import LESSONS from '../_lessons.json';
import { J, verify } from '../_lib.js';
import { fsGet, fsSet, fsDel, fsQuery, sv } from '../_fs.js';
const OWNER_UID = 'xLar9GPCNwaZjPkc1hgiuihvIWi2';
const hits = new Map();
const rate = (k, max, win) => { const now = Date.now(), a = (hits.get(k) || []).filter(x => now - x < win); if (a.length >= max) return false; a.push(now); hits.set(k, a); if (hits.size > 8000) hits.clear(); return true; };
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const sha = async s => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
const num = f => Number((f && (f.integerValue ?? f.doubleValue)) || 0);
const str = f => (f && f.stringValue) || '';
const bool = f => !!(f && f.booleanValue);
const parse = d => { const f = d.fields || {}; return { id: d.name.split('/').pop(), lesson: num(f.lesson), name: str(f.name), text: str(f.text), parent: str(f.parent), created: num(f.created), tok: str(f.tok), best: bool(f.best), hidden: bool(f.hidden), staff: bool(f.staff), rep: num(f.rep) }; };
const fields = x => ({ lesson: { integerValue: String(x.lesson) }, name: sv(x.name), text: sv(x.text), parent: sv(x.parent), created: { integerValue: String(x.created) }, tok: sv(x.tok), best: { booleanValue: !!x.best }, hidden: { booleanValue: !!x.hidden }, staff: { booleanValue: !!x.staff }, rep: { integerValue: String(x.rep || 0) } });
const pub = x => ({ id: x.id, name: x.name, text: x.text, parent: x.parent, created: x.created, best: x.best, staff: x.staff });
const OWNER_NAME = 'Dev Ahmed';
const RES = /مشرف|مدرب|مدير|ادمن|اداري|moderator|instructor|admin|staff|owner|teacher|verified|official|support|softwareengineer|mobileappatoz|devahmed|ahmedelngar|elngar|المدرس/;
const norm = s => String(s || '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/[^a-z\u0600-\u06ff0-9]/g, '');
const NAME = /^[\p{L}][\p{L} .'\-]{1,39}$/u;
async function isOwner(request) { const t = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''); if (!t) return false; return (await verify(t).catch(() => null)) === OWNER_UID; }
export async function onRequest({ request, env }) {
  if (!env.FIREBASE_SA) return J({ error: 'not_ready' }, 503);
  const ip = request.headers.get('cf-connecting-ip') || 'x';
  if (!rate('g' + ip, 120, 60e3)) return J({ error: 'rate' }, 429);
  if (request.method === 'GET') {
    const n = parseInt(new URL(request.url).searchParams.get('lesson'), 10);
    if (!LESSONS[String(n)]) return J({ error: 'bad' }, 400);
    let docs; try { docs = await fsQuery(env, 'qa', 'lesson', n); } catch (_) { return J({ error: 'store' }, 502); }
    return J({ items: docs.map(parse).filter(x => !x.hidden).sort((a, b) => a.created - b.created).map(pub), owner: await isOwner(request) });
  }
  if (request.method !== 'POST') return J({ error: 'method' }, 405);
  let b; try { b = await request.json(); } catch (_) { return J({ error: 'bad' }, 400); }
  const act = String(b.act || '');
  if (act === 'post') {
    if (b.hp) return J({ ok: true });
    if (!rate('p' + ip, 6, 3600e3)) return J({ error: 'rate' }, 429);
    const lesson = parseInt(b.lesson, 10); if (!LESSONS[String(lesson)]) return J({ error: 'bad' }, 400);
    const staff = await isOwner(request);
    let name = String(b.name || '').replace(/\s+/g, ' ').trim(); const text = String(b.text || '').trim();
    if (staff) name = OWNER_NAME;
    else if (!NAME.test(name) || /https?:|www\./i.test(name) || RES.test(norm(name))) return J({ error: 'name' }, 400);
    if (text.length < 2 || text.length > 1000 || (text.match(/https?:\/\//gi) || []).length > 1) return J({ error: 'text' }, 400);
    const parent = String(b.parent || '');
    if (parent) { if (!/^[0-9a-z\-]{8,40}$/.test(parent)) return J({ error: 'bad' }, 400); const pd = await fsGet(env, 'qa/' + parent).catch(() => null); if (!pd) return J({ error: 'bad' }, 400); const p = parse(pd); if (p.parent || p.lesson !== lesson || p.hidden) return J({ error: 'bad' }, 400); }
    const token = hex(crypto.getRandomValues(new Uint8Array(16))), id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const x = { lesson, name, text, parent, created: Date.now(), tok: await sha(token), best: false, hidden: false, rep: 0, staff };
    if (!(await fsSet(env, 'qa/' + id, fields(x)))) return J({ error: 'store' }, 502);
    return J({ ok: true, id, token });
  }
  const id = String(b.id || ''); if (!/^[0-9a-z\-]{8,40}$/.test(id)) return J({ error: 'bad' }, 400);
  const d = await fsGet(env, 'qa/' + id).catch(() => null); if (!d) return J({ error: 'gone' }, 404);
  const it = parse(d), own = await isOwner(request), tk = b.token ? await sha(String(b.token)) : null;
  if (act === 'report') {
    if (!rate('r' + ip, 10, 3600e3) || !rate('r' + ip + id, 1, 86400e3)) return J({ error: 'rate' }, 429);
    it.rep += 1; if (it.rep >= 3) it.hidden = true;
    await fsSet(env, 'qa/' + id, fields(it));
    await fsSet(env, 'reports/qa-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), { text: sv('Q&A report on lesson ' + it.lesson + (it.hidden ? ' (auto-hidden after 3 reports)' : '') + ': ' + it.text.slice(0, 200)), url: sv('/lesson-' + it.lesson + '/'), device: sv('qa:' + id), uid: sv(''), t: { integerValue: String(Date.now()) } }).catch(() => {});
    return J({ ok: true });
  }
  if (act === 'best') {
    if (!it.parent) return J({ error: 'bad' }, 400);
    const qd = await fsGet(env, 'qa/' + it.parent).catch(() => null); if (!qd) return J({ error: 'gone' }, 404);
    const q = parse(qd);
    if (!(own || (tk && tk === q.tok))) return J({ error: 'auth' }, 403);
    const sibs = (await fsQuery(env, 'qa', 'parent', it.parent).catch(() => [])).map(parse);
    const was = it.best;
    for (const s of sibs) if (s.best && s.id !== id) { s.best = false; await fsSet(env, 'qa/' + s.id, fields(s)); }
    it.best = !was; await fsSet(env, 'qa/' + id, fields(it));
    return J({ ok: true, best: it.best });
  }
  if (act === 'del') {
    if (!(own || (tk && tk === it.tok))) return J({ error: 'auth' }, 403);
    if (!it.parent) for (const s of (await fsQuery(env, 'qa', 'parent', id).catch(() => []))) await fsDel(env, 'qa/' + s.name.split('/').pop());
    await fsDel(env, 'qa/' + id);
    return J({ ok: true });
  }
  return J({ error: 'bad' }, 400);
}
