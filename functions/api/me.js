import LESSONS from '../_lessons.json';
import { J, verify } from '../_lib.js';
import { fsGet, fsSet, sv } from '../_fs.js';
const hits = new Map();
const ok = uid => { const now = Date.now(), a = (hits.get(uid) || []).filter(x => now - x < 60e3); if (a.length >= 40) return false; a.push(now); hits.set(uid, a); if (hits.size > 5000) hits.clear(); return true; };
async function load(env, uid) {
  const d = await fsGet(env, 'userdata/' + uid);
  let o = {}; try { o = JSON.parse(d && d.fields && d.fields.d && d.fields.d.stringValue || '{}'); } catch (_) {}
  const bm = Array.isArray(o.bm) ? o.bm.filter(n => LESSONS[String(n)]).map(Number) : [];
  const notes = {}; for (const k of Object.keys(o.notes || {})) if (LESSONS[k] && o.notes[k] && typeof o.notes[k].t === 'string') notes[k] = { t: o.notes[k].t.slice(0, 2000), u: Number(o.notes[k].u) || 0 };
  return { bm, notes };
}
// private per-user bookmarks + lesson notes, server-only storage (userdata/{uid}), owner only
export async function onRequest({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const uid = await verify((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')).catch(() => null);
  if (!uid) return J({ error: 'auth' }, 401);
  if (!ok(uid)) return J({ error: 'rate' }, 429);
  let cur; try { cur = await load(env, uid); } catch (_) { return J({ error: 'store' }, 502); }
  if (request.method === 'GET') return J(cur);
  if (request.method !== 'POST') return J({ error: 'method' }, 405);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  if (b.bm !== undefined) {
    if (!Array.isArray(b.bm) || b.bm.length > 200) return J({ error: 'bad' }, 400);
    cur.bm = [...new Set(b.bm.map(String).filter(n => LESSONS[n]).map(Number))];
  }
  if (b.note !== undefined) {
    const n = String(b.note && b.note.n || ''), t = String(b.note && b.note.t || '').slice(0, 2000);
    if (!LESSONS[n]) return J({ error: 'bad' }, 400);
    if (t.trim()) cur.notes[n] = { t, u: Date.now() }; else delete cur.notes[n];
  }
  const saved = await fsSet(env, 'userdata/' + uid, { d: sv(JSON.stringify(cur)) });
  return saved ? J(cur) : J({ error: 'store' }, 502);
}
