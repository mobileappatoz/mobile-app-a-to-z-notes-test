import LESSONS from '../_lessons.json';
import { J, verify, saToken, PROJECT } from '../_lib.js';
import { fsList, fsDel } from '../_fs.js';
const OWNER_UID = 'xLar9GPCNwaZjPkc1hgiuihvIWi2';
const num = f => Number((f && (f.integerValue ?? f.doubleValue)) || 0);
const str = f => (f && f.stringValue) || '';
const hits = new Map();
const rate = (k, max, win) => { const now = Date.now(), a = (hits.get(k) || []).filter(x => now - x < win); if (a.length >= max) return false; a.push(now); hits.set(k, a); if (hits.size > 2000) hits.clear(); return true; };
// Owner-only. Everyone else gets the same 404 a missing page gets, so the endpoint does not advertise itself.
export async function onRequest({ request, env }) {
  const nf = () => new Response('Not found', { status: 404 });
  if (!env.FIREBASE_SA) return nf();
  const tok = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!tok) return nf();
  if (!rate('a' + (request.headers.get('cf-connecting-ip') || 'x'), 30, 60e3)) return J({ error: 'rate' }, 429);
  const uid = await verify(tok).catch(() => null);
  if (uid !== OWNER_UID) return nf();
  if (request.method === 'GET') {
    let au = [], lb = [], qa = [];
    try {
      const r = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:batchGet?maxResults=500`, { headers: { authorization: 'Bearer ' + await saToken(env) } });
      if (r.ok) au = (await r.json()).users || []; else au = null;
    } catch (_) { au = null; }
    try { lb = await fsList(env, 'leaderboard', 300); qa = await fsList(env, 'qa', 300); } catch (_) { return J({ error: 'store' }, 502); }
    const pts = {}; for (const d of lb) pts[d.name.split('/').pop()] = { points: num(d.fields.points), lessons: num(d.fields.lessons), name: str(d.fields.name) };
    const accounts = au ? au.map(u => ({ uid: u.localId, email: u.email || '', name: u.displayName || (pts[u.localId] && pts[u.localId].name) || '', created: Number(u.createdAt) || 0, last: Number(u.lastLoginAt) || 0, google: (u.providerUserInfo || []).some(p => p.providerId === 'google.com'), verified: !!u.emailVerified, disabled: !!u.disabled, points: (pts[u.localId] || {}).points || 0 })).sort((a, b) => b.created - a.created)
      : Object.entries(pts).map(([id, v]) => ({ uid: id, email: '', name: v.name, created: 0, last: 0, google: false, verified: false, disabled: false, points: v.points }));
    const items = qa.map(d => { const f = d.fields || {}; return { id: d.name.split('/').pop(), lesson: num(f.lesson), name: str(f.name), text: str(f.text), parent: str(f.parent), created: num(f.created), hidden: !!(f.hidden && f.hidden.booleanValue), rep: num(f.rep) }; }).sort((a, b) => b.created - a.created);
    return J({ accounts, source: au ? 'auth' : 'leaderboard', qa: items, lessons: Object.keys(LESSONS).length });
  }
  return nf();
}
