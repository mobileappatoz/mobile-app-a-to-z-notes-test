import LESSONS from '../_lessons.json';
import { bumpDay, J, verify, loadScores, saveScores, totalOf } from '../_lib.js';
const hits = new Map();
export async function onRequestPost({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const auth = request.headers.get('authorization') || '';
  const uid = await verify(auth.replace(/^Bearer\s+/i, '')).catch(() => null);
  if (!uid) return J({ error: 'auth' }, 401);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const n = String(b.lesson || ''), dur = LESSONS[n];
  if (!dur) return J({ error: 'bad' }, 400);
  const delta = Math.max(0, Math.min(60, Number(b.delta) || 0));
  const now = Date.now(), arr = (hits.get(uid) || []).filter(x => now - x < 60e3);
  if (arr.length >= 12) return J({ error: 'rate' }, 429);
  arr.push(now); hits.set(uid, arr);
  let sc;
  try { sc = await loadScores(env, uid); } catch (_) { return J({ error: 'store' }, 502); }
  const L = sc.lessons[n] || { last: now, cred: 0, done: false };
  const out = () => ({ pct: Math.min(100, Math.round(100 * L.cred / dur)), done: L.done, total: totalOf(sc.tasks, sc.lessons), need: Math.round(dur * 0.9) });
  if (L.done) return J(out());
  const before = totalOf(sc.tasks, sc.lessons);
  const elapsed = Math.max(0, (now - L.last) / 1000);
  // video seconds can advance at most 2x real time (YouTube max speed), plus 2s slack
  const add = Math.min(delta, 2 * elapsed + 2, 40);
  L.cred = Math.min(dur, L.cred + add); L.last = now;
  if (L.cred >= 0.9 * dur) L.done = true;
  sc.lessons[n] = L;
  if (!(await saveScores(env, uid, sc))) return J({ error: 'busy' }, 409);
  await bumpDay(env, uid, add, 0, 0, totalOf(sc.tasks, sc.lessons) - before);
  return J(out());
}
