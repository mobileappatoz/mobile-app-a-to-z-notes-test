export const PROJECT = 'mobile-app-a-to-z-test';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let jwks = null, jwksAt = 0;
const hits = new Map();
export const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const b64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const dec = s => JSON.parse(new TextDecoder().decode(b64(s)));
export async function verify(tok) {
  const p = (tok || '').split('.');
  if (p.length !== 3) return null;
  let h, c;
  try { h = dec(p[0]); c = dec(p[1]); } catch (_) { return null; }
  if (h.alg !== 'RS256' || !h.kid) return null;
  const now = Math.floor(Date.now() / 1000);
  if (c.aud !== PROJECT || c.iss !== 'https://securetoken.google.com/' + PROJECT || !c.sub || c.exp < now || c.iat > now + 300) return null;
  if (!jwks || Date.now() - jwksAt > 3600e3) { jwks = (await (await fetch(JWKS_URL)).json()).keys; jwksAt = Date.now(); }
  const k = jwks.find(x => x.kid === h.kid);
  if (!k) return null;
  const key = await crypto.subtle.importKey('jwk', k, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(p[2]), new TextEncoder().encode(p[0] + '.' + p[1]));
  return ok ? c.sub : null;
}

const b64u = u8 => btoa(String.fromCharCode(...new Uint8Array(u8))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const enc = o => b64u(new TextEncoder().encode(JSON.stringify(o)));
let saTok = null, saExp = 0;
export async function saToken(env) {
  if (saTok && Date.now() < saExp - 60e3) return saTok;
  const sa = JSON.parse(env.FIREBASE_SA);
  const now = Math.floor(Date.now() / 1000);
  const head = enc({ alg: 'RS256', typ: 'JWT' }), claim = enc({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const pem = sa.private_key.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = b64u(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + claim)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + head + '.' + claim + '.' + sig });
  const j = await r.json();
  if (!j.access_token) throw new Error('sa_token');
  saTok = j.access_token; saExp = Date.now() + (j.expires_in || 3600) * 1000;
  return saTok;
}
const DOC = uid => `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/taskscore/${uid}`;
// returns {tasks:{id:{best,n,fin}}, ut:updateTime|null}
export async function loadScores(env, uid) {
  const t = await saToken(env);
  const r = await fetch(DOC(uid), { headers: { authorization: 'Bearer ' + t } });
  if (r.status === 404) return { tasks: {}, lessons: {}, ut: null };
  if (!r.ok) throw new Error('fs_read');
  const d = await r.json(), tasks = {};
  const m = (d.fields && d.fields.tasks && d.fields.tasks.mapValue && d.fields.tasks.mapValue.fields) || {};
  for (const k of Object.keys(m)) {
    const f = (m[k].mapValue && m[k].mapValue.fields) || {};
    tasks[k] = { best: Number((f.best || {}).integerValue || 0), n: Number((f.n || {}).integerValue || 0), fin: !!(f.fin || {}).booleanValue };
  }
  const lm = (d.fields && d.fields.lessons && d.fields.lessons.mapValue && d.fields.lessons.mapValue.fields) || {};
  const lessons = {};
  for (const k of Object.keys(lm)) {
    const f = (lm[k].mapValue && lm[k].mapValue.fields) || {};
    lessons[k] = { last: Number((f.last || {}).integerValue || 0), cred: Number((f.cred || {}).doubleValue ?? (f.cred || {}).integerValue ?? 0), done: !!(f.done || {}).booleanValue };
  }
  return { tasks, lessons, ut: d.updateTime };
}
export const totalOf = (tasks, lessons) => Object.values(tasks).reduce((a, x) => a + (x.fin ? Math.max(0, Math.min(10, x.best)) : 0), 0) + 10 * Object.values(lessons || {}).filter(x => x.done).length;
export async function saveScores(env, uid, sc) {
  const t = await saToken(env);
  const fields = {};
  for (const k of Object.keys(sc.tasks)) { const x = sc.tasks[k]; fields[k] = { mapValue: { fields: { best: { integerValue: String(x.best) }, n: { integerValue: String(x.n) }, fin: { booleanValue: !!x.fin } } } }; }
  const lf = {};
  for (const k of Object.keys(sc.lessons || {})) { const x = sc.lessons[k]; lf[k] = { mapValue: { fields: { last: { integerValue: String(Math.round(x.last)) }, cred: { doubleValue: x.cred }, done: { booleanValue: !!x.done } } } }; }
  const body = { fields: { total: { integerValue: String(totalOf(sc.tasks, sc.lessons)) }, tasks: { mapValue: { fields } }, lessons: { mapValue: { fields: lf } }, updated: { integerValue: String(Date.now()) } } };
  const q = sc.ut ? 'currentDocument.updateTime=' + encodeURIComponent(sc.ut) : 'currentDocument.exists=false';
  const r = await fetch(DOC(uid) + '?' + q, { method: 'PATCH', headers: { authorization: 'Bearer ' + t, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return r.ok;
}
// per-day activity counters in the public-read, server-only-write doc activity/{uid}: days.<YYYY-MM-DD>.{w seconds watched, t task attempts, s tasks solved (score>=7)}
export const cairoDay = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
// week runs Saturday..Friday (Cairo); returns YYYY-MM-DD of this week's Saturday
export function weekStart(day) { const d = new Date(day + 'T12:00:00Z'); const back = (d.getUTCDay() + 1) % 7; return new Date(d.getTime() - back * 864e5).toISOString().slice(0, 10); }
export async function bumpDay(env, uid, w = 0, t = 0, s = 0, p = 0) {
  try {
    const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
    const doc = `projects/${PROJECT}/databases/(default)/documents/activity/${uid}`;
    const tr = [];
    if (w > 0) tr.push({ fieldPath: 'days.`' + day + '`.w', increment: { integerValue: String(Math.round(w)) } });
    if (t > 0) tr.push({ fieldPath: 'days.`' + day + '`.t', increment: { integerValue: String(t) } });
    if (s > 0) tr.push({ fieldPath: 'days.`' + day + '`.s', increment: { integerValue: String(s) } });
    if (p > 0) tr.push({ fieldPath: 'days.`' + day + '`.p', increment: { integerValue: String(Math.round(p)) } });
    if (!tr.length) return;
    const tok = await saToken(env);
    await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:commit`, { method: 'POST', headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json' }, body: JSON.stringify({ writes: [{ transform: { document: doc, fieldTransforms: tr } }] }) });
  } catch (_) {}
}
