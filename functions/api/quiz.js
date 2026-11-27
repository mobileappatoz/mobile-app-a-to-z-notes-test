import KEY from '../_quiz.json';
import { J, verify, loadScores, saveScores, totalOf, bumpDay } from '../_lib.js';
const hits = new Map();
const MAXTRY = 3;
const rate = (k, max, win) => { const now = Date.now(), a = (hits.get(k) || []).filter(x => now - x < win); if (a.length >= max) return false; a.push(now); hits.set(k, a); if (hits.size > 5000) hits.clear(); return true; };
// GET ?lesson=N -> this user's attempts. POST {lesson, answers:[i x5]} -> server grades; points = best score (max 5), 3 attempts
export async function onRequest({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const uid = await verify((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')).catch(() => null);
  if (!uid) return J({ error: 'auth' }, 401);
  if (!rate(uid, 30, 60e3)) return J({ error: 'rate' }, 429);
  let n, ans = null;
  if (request.method === 'GET') n = String(new URL(request.url).searchParams.get('lesson') || '');
  else if (request.method === 'POST') { let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400 ); } n = String(b.lesson || ''); ans = b.answers; }
  else return J({ error: 'method' }, 405);
  const key = KEY[n];
  if (!key) return J({ error: 'bad' }, 400);
  let sc; try { sc = await loadScores(env, uid); } catch (_) { return J({ error: 'store' }, 502); }
  const id = 'quiz_' + n, cur = sc.tasks[id] || { best: 0, n: 0, fin: false };
  const reveal = cur.n >= MAXTRY || cur.best === key.length;
  const info = () => ({ best: cur.best, n: cur.n, left: Math.max(0, MAXTRY - cur.n), total: totalOf(sc.tasks, sc.lessons), correct: reveal ? key : undefined });
  if (request.method === 'GET') return J(info());
  if (!Array.isArray(ans) || ans.length !== key.length || !ans.every(x => Number.isInteger(x) && x >= 0 && x <= 5)) return J({ error: 'bad' }, 400);
  if (cur.n >= MAXTRY) return J({ locked: true, ...info() }, 409);
  const before = totalOf(sc.tasks, sc.lessons);
  const score = ans.reduce((a, x, i) => a + (x === key[i] ? 1 : 0), 0);
  cur.n += 1; cur.best = Math.max(cur.best, score); cur.fin = true;
  sc.tasks[id] = cur;
  if (!(await saveScores(env, uid, sc))) return J({ error: 'busy' }, 409);
  await bumpDay(env, uid, 0, 0, 0, totalOf(sc.tasks, sc.lessons) - before);
  const r2 = cur.n >= MAXTRY || cur.best === key.length;
  return J({ score, best: cur.best, n: cur.n, left: Math.max(0, MAXTRY - cur.n), total: totalOf(sc.tasks, sc.lessons), correct: r2 ? key : undefined });
}
