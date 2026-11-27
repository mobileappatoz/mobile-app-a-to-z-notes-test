import { J, verify, loadScores, saveScores, totalOf, bumpDay, cairoDay, weekStart } from '../_lib.js';
import { fsGet, fsList } from '../_fs.js';
const hits = new Map();
const num = f => Number((f && (f.integerValue ?? f.doubleValue)) || 0);
const rate = (key, max, win) => { const now = Date.now(), a = (hits.get(key) || []).filter(x => now - x < win); if (a.length >= max) return false; a.push(now); hits.set(key, a); if (hits.size > 5000) hits.clear(); return true; };
const dayMap = d => (d && d.fields && d.fields.days && d.fields.days.mapValue && d.fields.days.mapValue.fields) || {};
const QUESTS = { q101: d => d.w >= 300, q102: d => d.s >= 1, q103: d => d.w + d.t > 0, q104: d => d.t >= 2 };
const QXP = 2, CHEST_XP = 10, CHEST_DAYS = 5;
// GET /api/weekly -> weekly league: top 10 public (on the leaderboard) users by points earned this week (Sat..Fri, Cairo)
export async function onRequestGet({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  if (!rate('g' + (request.headers.get('cf-connecting-ip') || 'x'), 30, 60e3)) return J({ error: 'rate' }, 429);
  const ws = weekStart(cairoDay());
  let lb, ac;
  try { [lb, ac] = await Promise.all([fsList(env, 'leaderboard', 300), fsList(env, 'activity', 300)]); } catch (_) { return J({ error: 'store' }, 502); }
  const wp = {};
  for (const d of ac) {
    const uid = d.name.split('/').pop(), m = dayMap(d);
    let p = 0; for (const k of Object.keys(m)) if (/^\d{4}-\d{2}-\d{2}$/.test(k) && k >= ws) p += num((m[k].mapValue && m[k].mapValue.fields || {}).p);
    wp[uid] = p;
  }
  const rows = [];
  for (const d of lb) {
    const uid = d.name.split('/').pop(), f = d.fields || {}, p = wp[uid] || 0;
    if (p <= 0 || uid === 'xLar9GPCNwaZjPkc1hgiuihvIWi2') continue;
    const av = f.av && f.av.stringValue || '';
    rows.push({ id: uid, name: (f.name && f.name.stringValue || '').slice(0, 60), points: p, total: num(f.points), lessons: num(f.lessons), av: /^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(av) ? av : '' });
  }
  rows.sort((a, b) => b.points - a.points);
  return J({ week: ws, rows: rows.slice(0, 10) });
}
// POST /api/weekly {claim:'q101'|'q102'|'q103'|'q104'|'chest'} -> server verifies today's real activity, grants the XP once
export async function onRequestPost({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const uid = await verify((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')).catch(() => null);
  if (!uid) return J({ error: 'auth' }, 401);
  if (!rate('p' + uid, 20, 60e3)) return J({ error: 'rate' }, 429);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const c = String(b.claim || ''), today = cairoDay(), ws = weekStart(today);
  const act = await fsGet(env, 'activity/' + uid).catch(() => null);
  if (!act) return J({ error: 'not_yet' }, 409);
  const m = dayMap(act), g = k => { const f = (m[k] && m[k].mapValue && m[k].mapValue.fields) || {}; return { w: num(f.w), t: num(f.t), s: num(f.s) }; };
  let key, xp;
  if (QUESTS[c]) { if (!QUESTS[c](g(today))) return J({ error: 'not_done' }, 409); key = 'q_' + today + '_' + c.slice(1); xp = QXP; }
  else if (c === 'chest') {
    let n = 0; for (const k of Object.keys(m)) if (/^\d{4}-\d{2}-\d{2}$/.test(k) && k >= ws && k <= today) { const x = g(k); if (x.w + x.t > 0) n++; }
    if (n < CHEST_DAYS) return J({ error: 'not_done', active: n }, 409);
    key = 'chest_' + ws; xp = CHEST_XP;
  } else return J({ error: 'bad' }, 400);
  let sc; try { sc = await loadScores(env, uid); } catch (_) { return J({ error: 'store' }, 502); }
  if (sc.tasks[key]) return J({ claimed: true, already: true, total: totalOf(sc.tasks, sc.lessons) });
  sc.tasks[key] = { best: xp, n: 0, fin: true };
  if (!(await saveScores(env, uid, sc))) return J({ error: 'busy' }, 409);
  await bumpDay(env, uid, 0, 0, 0, xp);
  return J({ claimed: true, xp, total: totalOf(sc.tasks, sc.lessons) });
}
