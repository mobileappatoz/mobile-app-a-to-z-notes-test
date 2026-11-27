const PROJECT = 'mobile-app-a-to-z-test';
const b64u = u8 => btoa(String.fromCharCode(...new Uint8Array(u8))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const enc = o => b64u(new TextEncoder().encode(JSON.stringify(o)));
let saTok = null, saExp = 0;
async function saToken(env) {
  if (saTok && Date.now() < saExp - 60e3) return saTok;
  const sa = JSON.parse(env.FIREBASE_SA);
  const now = Math.floor(Date.now() / 1000);
  const head = enc({ alg: 'RS256', typ: 'JWT' }), claim = enc({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const pem = sa.private_key.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = b64u(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + claim)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + head + '.' + claim + '.' + sig });
  const j = await r.json();
  if (!j.access_token) throw new Error('sa_token');
  saTok = j.access_token; saExp = Date.now() + (j.expires_in || 3600) * 1000;
  return saTok;
}

const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const eq = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };
export async function onRequestPost({ request, env }) {
  if (!env.NOTIFY_SECRET || !env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  if (!eq(request.headers.get('x-notify-secret') || '', env.NOTIFY_SECRET)) return J({ error: 'auth' }, 401);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const title = String(b.title || '').slice(0, 80), body = String(b.body || '').slice(0, 200), url = String(b.url || '/');
  if (!title || !/^\/[A-Za-z0-9\-_\/#?=.&]*$/.test(url)) return J({ error: 'bad' }, 400);
  const t = await saToken(env), H = { authorization: 'Bearer ' + t, 'content-type': 'application/json' };
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/pushtokens`;
  let docs = [], pt = '';
  do {
    const r = await fetch(base + '?pageSize=300' + (pt ? '&pageToken=' + pt : ''), { headers: H });
    if (!r.ok) return J({ error: 'store' }, 502);
    const d = await r.json(); docs = docs.concat(d.documents || []); pt = d.nextPageToken || '';
  } while (pt);
  let sent = 0, failed = 0, removed = 0, err = '';
  for (const d of docs) {
    const tok = d.fields && d.fields.token && d.fields.token.stringValue; if (!tok) continue;
    const r = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT}/messages:send`, { method: 'POST', headers: H, body: JSON.stringify({ message: { token: tok, data: { title, body, url }, webpush: { headers: { TTL: '86400' } } } }) });
    if (r.ok) sent++; else { failed++; if (!err) err = r.status + ' ' + (await r.clone().text()).slice(0, 200); if (r.status === 404) { const dr = await fetch('https://firestore.googleapis.com/v1/' + d.name, { method: 'DELETE', headers: H }); if (dr.ok) removed++; } }
  }
  return J({ subscribers: docs.length, sent, failed, removed, err });
}
