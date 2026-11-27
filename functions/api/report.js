import { J, verify } from '../_lib.js';
import { fsSet, fsList, sv } from '../_fs.js';
const hits = new Map();
export async function onRequestPost({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const ip = request.headers.get('cf-connecting-ip') || 'x', now = Date.now();
  const a = (hits.get(ip) || []).filter(x => now - x < 3600e3);
  if (a.length >= 5) return J({ error: 'rate' }, 429);
  let b;
  try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const text = String(b.text || '').trim().slice(0, 1500);
  if (text.length < 5) return J({ error: 'bad' }, 400);
  const t = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const uid = t ? await verify(t).catch(() => null) : null;
  a.push(now); hits.set(ip, a);
  const id = now + '-' + Math.random().toString(36).slice(2, 8);
  const ok = await fsSet(env, 'reports/' + id, { text: sv(text), url: sv(String(b.url || '').slice(0, 300)), device: sv(String(b.device || '').slice(0, 300)), uid: sv(uid || ''), t: { integerValue: String(now) }, seen: { booleanValue: false } });
  return J({ ok }, ok ? 200 : 502);
}
// owner-only listing (secret header); ?mark=1 marks listed as seen
export async function onRequestGet({ request, env }) {
  if (!env.NOTIFY_SECRET || request.headers.get('x-notify-secret') !== env.NOTIFY_SECRET) return J({ error: 'auth' }, 401);
  const docs = await fsList(env, 'reports', 100).catch(() => null);
  if (!docs) return J({ error: 'store' }, 502);
  const out = [];
  for (const d of docs) {
    const f = d.fields || {}, id = d.name.split('/').pop();
    if (f.seen && f.seen.booleanValue) continue;
    out.push({ id, text: (f.text || {}).stringValue, url: (f.url || {}).stringValue, device: (f.device || {}).stringValue, uid: (f.uid || {}).stringValue, t: Number((f.t || {}).integerValue || 0) });
    if (new URL(request.url).searchParams.get('mark') === '1') await fsSet(env, 'reports/' + id, { ...f, seen: { booleanValue: true } });
  }
  return J({ reports: out });
}
