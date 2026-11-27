import DQ from '../_dq.json';
import { J, verify, loadScores, saveScores, totalOf, bumpDay, cairoDay } from '../_lib.js';
const hits = new Map();
const rate = (k, max, win) => { const now = Date.now(), a = (hits.get(k) || []).filter(x => now - x < win); if (a.length >= max) return false; a.push(now); hits.set(k, a); if (hits.size > 5000) hits.clear(); return true; };
const XP = 3;
// one question per day (same for everyone, picked by date), one attempt per account, +3 XP if correct, graded on the server
export async function onRequest({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  if (!rate('i' + (request.headers.get('cf-connecting-ip') || 'x'), 60, 60e3)) return J({ error: 'rate' }, 429);
  const day = cairoDay(), di = Math.floor(Date.parse(day + 'T12:00:00Z') / 864e5), item = DQ[di % DQ.length];
  const out = { day, xp: XP, q: item.q, o: item.o };
  const tok = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const uid = tok ? await verify(tok).catch(() => null) : null;
  if (!uid) { if (request.method === 'GET') return J(out); return J({ error: 'auth' }, 401); }
  if (!rate('u' + uid, 30, 60e3)) return J({ error: 'rate' }, 429);
  let sc; try { sc = await loadScores(env, uid); } catch (_) { return J({ error: 'store' }, 502); }
  const key = 'daily_' + day, cur = sc.tasks[key];
  const done = r => ({ ...out, played: true, correct: item.a, got: r, total: totalOf(sc.tasks, sc.lessons) });
  if (request.method === 'GET') return J(cur ? done(cur.best > 0) : out);
  if (request.method !== 'POST') return J({ error: 'method' }, 405);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const a = b.answer;
  if (!Number.isInteger(a) || a < 0 || a >= item.o.length) return J({ error: 'bad' }, 400);
  if (cur) return J(done(cur.best > 0), 409);
  const before = totalOf(sc.tasks, sc.lessons), ok = a === item.a;
  sc.tasks[key] = { best: ok ? XP : 0, n: 1, fin: true };
  if (!(await saveScores(env, uid, sc))) return J({ error: 'busy' }, 409);
  if (ok) await bumpDay(env, uid, 0, 0, 0, totalOf(sc.tasks, sc.lessons) - before);
  return J(done(ok));
}
