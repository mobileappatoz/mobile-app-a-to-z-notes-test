import { J, verify, loadScores, weekStart } from '../_lib.js';
import { fsGet } from '../_fs.js';
const hits = new Map();
const num = f => Number((f && (f.integerValue ?? f.doubleValue)) || 0);
// GET /api/activity?uid=X  -> real per-day activity for X, only if X's profile is public (on the leaderboard) or X is the caller
export async function onRequestGet({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const url = new URL(request.url), uid = String(url.searchParams.get('uid') || '');
  if (!/^[A-Za-z0-9]{20,40}$/.test(uid)) return J({ error: 'bad' }, 400);
  const ip = request.headers.get('cf-connecting-ip') || 'x', now = Date.now();
  const a = (hits.get(ip) || []).filter(x => now - x < 60e3);
  if (a.length >= 30) return J({ error: 'rate' }, 429);
  a.push(now); hits.set(ip, a); if (hits.size > 5000) hits.clear();
  const t = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const me = t ? await verify(t).catch(() => null) : null;
  if (me !== uid) {
    const lb = await fsGet(env, 'leaderboard/' + uid).catch(() => null);
    if (!lb) return J({ error: 'private' }, 404);
  }
  const d = await fsGet(env, 'activity/' + uid).catch(() => null);
  const m = (d && d.fields && d.fields.days && d.fields.days.mapValue && d.fields.days.mapValue.fields) || {};
  const days = {};
  for (const k of Object.keys(m)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    const f = (m[k].mapValue && m[k].mapValue.fields) || {};
    days[k] = { w: num(f.w), t: num(f.t), s: num(f.s), p: num(f.p) };
  }
  const keys = Object.keys(days).filter(k => days[k].w + days[k].t > 0).sort();
  const dayN = s => Date.parse(s + 'T12:00:00Z') / 864e5;
  let best = 0, run = 0, prev = null;
  for (const k of keys) { run = prev !== null && dayN(k) - prev === 1 ? run + 1 : 1; prev = dayN(k); best = Math.max(best, run); }
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' }), tn = dayN(today);
  let cur = 0;
  if (keys.length) { let last = dayN(keys[keys.length - 1]); if (tn - last <= 1) { cur = 1; for (let i = keys.length - 2; i >= 0; i--) { if (last - dayN(keys[i]) === 1) { cur++; last = dayN(keys[i]); } else break; } } }
  const out = {};
  for (const k of keys.slice(-371)) out[k] = days[k];
  const ws = weekStart(today);
  let wp = 0, wa = 0;
  for (const k of Object.keys(days)) if (k >= ws && k <= today) { wp += days[k].p; if (days[k].w + days[k].t > 0) wa++; }
  const res = { days: out, current: cur, longest: best, active: keys.length, today, week: { start: ws, wp, active: wa } };
  if (me === uid) { try { const sc = await loadScores(env, uid); res.claimed = Object.keys(sc.tasks).filter(k => k.startsWith('q_' + today + '_') || k === 'chest_' + ws); } catch (_) {} }
  return J(res);
}
