
/* owner identity: label and verified badge come from the account uid only, never from a name */
(function(){var OWN='xLar9GPCNwaZjPkc1hgiuihvIWi2';window.__OWNER=OWN;
function en(){return document.documentElement.lang==='en'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var RES=/مشرف|مدرب|مدير|ادمن|اداري|moderator|instructor|admin|staff|owner|teacher|verified|official|support|softwareengineer|mobileappatoz|devahmed|ahmedelngar|elngar|المدرس/;
function norm(s){return String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[^a-z\u0600-\u06ff0-9]/g,'')}
window.__reserved=function(n){return RES.test(norm(n))};
window.__safeName=function(id,n){n=String(n||'');if(id===OWN)return n;return window.__reserved(n)?(en()?'Student':'طالب'):n};
var CK='<svg class="vbs" viewBox="0 0 24 24" width="17" height="17" role="img" aria-label="Verified"><path fill="#1d9bf0" d="M12 1.5l2.6 1.8 3.1-.2 1.1 2.9 2.6 1.8-.9 3 .9 3-2.6 1.8-1.1 2.9-3.1-.2L12 22.5l-2.6-1.8-3.1.2-1.1-2.9L2.6 16.2l.9-3-.9-3 2.6-1.8 1.1-2.9 3.1.2z"/><path d="M8 12.3l2.6 2.6L16 9.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
window.__who=function(id,n){var s=esc(window.__safeName(id,n)||'—');if(id!==OWN)return s;return s+' <span class="vb" title="'+(en()?'Verified account':'حساب موثّق')+'">'+CK+'</span> <span class="stf">'+(en()?'Moderator / Instructor':'مشرف / مدرّب')+'</span>'};
})();
document.addEventListener('click',function(e){
  var tb=e.target.closest('.tab');if(tb){document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===tb)});document.querySelectorAll('.pane').forEach(function(p){p.hidden=p.id!=='pane-'+tb.dataset.tab});}
  var b=e.target.closest('.copy');
  if(b){var text=document.getElementById(b.dataset.code).innerText;
    var orig=b.innerHTML;var done=function(){b.textContent=document.documentElement.lang==='en'?'Copied ✓':'اتنسخ ✓';b.classList.add('ok');setTimeout(function(){b.innerHTML=orig;b.classList.remove('ok')},1500)};
    var fb=function(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(_){}t.remove()};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fb);else fb();}
  if(e.target.closest('#theme')){var d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(_){}
    }
});



(function(){var r=[].slice.call(document.querySelectorAll('.rv'));r.forEach(function(e,i){e.style.setProperty('--d',(i%4)*0.08+'s')});
if(!('IntersectionObserver' in window)){r.forEach(function(e){e.classList.add('in')});}else{var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});r.forEach(function(e){io.observe(e)});}
var h=document.querySelector('header');window.addEventListener('scroll',function(){h.classList.toggle('sc',scrollY>10)},{passive:true});
var f=document.getElementById('cform');if(f){f.addEventListener('submit',function(e){e.preventDefault();var n=f.name.value.trim(),m=f.message.value.trim();if(!n||!m){(n?f.message:f.name).focus();return}
var s=document.getElementById('sent');s.textContent=m;s.hidden=false;['ok','err'].forEach(function(i){document.getElementById(i).hidden=true});var b=f.querySelector('.send');b.disabled=true;
fetch('https://formsubmit.co/ajax/mobileappatoz@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:n,email:f.email.value,message:m,_subject:'رسالة جديدة من موقع Mobile App A to Z',_honey:f._honey.value})}).then(function(r){return r.json()}).then(function(j){if(j.success==='true'||j.success===true){document.getElementById('ok').hidden=false;f.message.value=''}else throw 0}).catch(function(){document.getElementById('err').hidden=false}).then(function(){b.disabled=false});});}
})();

/* progress + auth (Firebase when configured, otherwise this device only) */
(function(){
var KEY='progress_v1',done={},user=null,fs=null,cfg=window.FIREBASE_CONFIG;
try{(JSON.parse(localStorage.getItem(KEY)||'[]')).forEach(function(n){done[n]=1})}catch(_){}
function list(){return Object.keys(done).map(Number).sort(function(a,b){return a-b})}
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(list()))}catch(_){}}
function render(){
 document.querySelectorAll('.card[data-n]').forEach(function(c){c.classList.toggle('done',!!done[c.dataset.n])});
 document.querySelectorAll('.sl a').forEach(function(a){var m=a.getAttribute('href').match(/lesson-(\d+)/);if(m)a.classList.toggle('done',!!done[m[1]])});
 document.querySelectorAll('.donebtn').forEach(function(b){b.classList.toggle('on',!!done[b.dataset.n])});
 document.querySelectorAll('[data-ls]').forEach(function(el){var ids=el.dataset.ls.split(','),n=ids.filter(function(i){return done[i]}).length;
  var t=el.querySelector('.tpt,.mp')||el;if(el.classList.contains('mypr'))el.querySelector('.mp').textContent=n+'/'+ids.length;
  var tp=el.querySelector('.tpt');if(tp){tp.textContent=n+'/'+ids.length;el.querySelector('.tbar i').style.width=Math.round(100*n/ids.length)+'%'}});
}
function persist(){saveLocal();if(fs&&user){fs.set(fs.doc(fs.db,'users',user.uid),{done:list(),updated:Date.now()},{merge:true}).catch(function(){})}}
document.addEventListener('click',function(e){var b=e.target.closest('.donebtn');if(!b)return;var n=b.dataset.n;if(done[n])delete done[n];else done[n]=1;
 b.classList.add('pop');setTimeout(function(){b.classList.remove('pop')},500);persist();render();
 if(!user&&!window.__hint){window.__hint=1;if(cfg){setTimeout(function(){openM()},500)}}});
render();
/* modal */
var M=document.getElementById('amodal'),ab=document.getElementById('auth'),msg=document.getElementById('amsg');
window.__acc=function(){try{return JSON.parse(localStorage.getItem('accounts_v1')||'[]')}catch(_){return[]}};
function tr2(x,y){return document.documentElement.lang==='en'?y:x}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('body>.modal:not(#amodal)').forEach(function(m){m.remove()})}});
window.__confirmOut=function(cb){var d=document.createElement('div');d.className='modal';d.innerHTML='<div class="mbox"><h3></h3><p class="mp-s"></p><div class="sbtn" style="margin-top:14px"><button class="btn" type="button" data-y></button><button class="btn ghost" type="button" data-n></button></div></div>';d.querySelector('h3').textContent=tr2('تسجيل الخروج','Log out');d.querySelector('p').textContent=tr2('عايز تسجّل خروج؟ حسابك هيفضل محفوظ على الجهاز عشان ترجع بضغطة واحدة.','Do you want to log out? Your account stays saved on this device for one-tap sign-in.');d.querySelector('[data-y]').textContent=tr2('أيوه، خروج','Yes, log out');d.querySelector('[data-n]').textContent=tr2('إلغاء','Cancel');document.body.appendChild(d);function x(){d.remove()}d.querySelector('[data-n]').onclick=x;d.addEventListener('click',function(e){if(e.target===d)x()});d.querySelector('[data-y]').onclick=function(){x();cb()};d.querySelector('[data-n]').focus()};
function renderSaved(){var f=document.getElementById('aform'),h=document.getElementById('svlist');if(!f)return;if(!h){h=document.createElement('div');h.id='svlist';h.className='svlist';f.parentNode.insertBefore(h,f)}var cur=window.__user&&window.__user.uid,L=window.__acc().filter(function(x){return x.uid!==cur});h.hidden=!L.length;h.innerHTML='';if(!L.length)return;var t=document.createElement('p');t.className='mp-s';t.textContent=tr2('حسابات محفوظة على الجهاز','Saved on this device');h.appendChild(t);
 L.forEach(function(x){var r=document.createElement('div');r.className='svr';var b=document.createElement('button');b.type='button';b.className='svb';var av=document.createElement('span');av.className='svv';if(x.ph){var im=document.createElement('img');im.src=x.ph;im.alt='';im.referrerPolicy='no-referrer';av.appendChild(im)}else av.textContent=(x.name||x.email||'?').charAt(0).toUpperCase();var tx=document.createElement('span');tx.className='svt';var n=document.createElement('b');n.textContent=x.name||x.email.split('@')[0];var e=document.createElement('small');e.textContent=x.email;e.dir='ltr';tx.appendChild(n);tx.appendChild(e);b.appendChild(av);b.appendChild(tx);
  b.onclick=function(){if(x.g&&window.__gin){window.__gin(x.email)}else{var em=document.getElementById('aem'),pw=document.getElementById('apw');if(f.hidden){f.hidden=false}if(em){em.value=x.email}if(pw){pw.value='';pw.focus()}}};
  var d=document.createElement('button');d.type='button';d.className='svx';d.setAttribute('aria-label',tr2('إزالة','Remove'));d.textContent='×';d.onclick=function(){try{localStorage.setItem('accounts_v1',JSON.stringify(window.__acc().filter(function(y){return y.uid!==x.uid})))}catch(_){}renderSaved()};
  r.appendChild(b);r.appendChild(d);h.appendChild(r)})}
function openM(){if(!M)return;M.hidden=false;renderSaved();if(!cfg){document.getElementById('aform').hidden=true;document.getElementById('alocal').hidden=false}}
function closeM(){if(M)M.hidden=true}
if(M){M.addEventListener('click',function(e){if(e.target===M||e.target.closest('.mx'))closeM()});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});}

/* signup views */
(function(){var af=document.getElementById('aform'),as=document.getElementById('asign'),ah=document.getElementById('ahead');if(!as)return;
function swap(hideEl,showEl,cb){hideEl.classList.add('vout');setTimeout(function(){hideEl.hidden=true;hideEl.classList.remove('vout');showEl.hidden=false;showEl.classList.add('vin');if(cb)cb();setTimeout(function(){showEl.classList.remove('vin')},320)},170)}
function toUp(){swap(af,as,function(){ah.hidden=true;go(1)})}
function toIn(){ah.hidden=false;swap(as,af)}
function go(n){var a=document.getElementById('s1'),b=document.getElementById('s2');document.getElementById('sp1').classList.toggle('on',true);document.getElementById('sp2').classList.toggle('on',n===2);
 if(n===2){swap(a,b)}else if(b.hidden===false){swap(b,a)}else{a.hidden=false}}
var en=function(){return document.documentElement.lang==='en'};
function sm(t){var m=document.getElementById('asmsg');m.textContent=t;m.className='amsg e'}
document.getElementById('areg').addEventListener('click',function(e){e.stopImmediatePropagation();e.preventDefault();toUp()},true);
document.getElementById('rtoin').addEventListener('click',toIn);
document.getElementById('rback').addEventListener('click',function(){go(1)});
document.getElementById('rnext').addEventListener('click',function(){var n=document.getElementById('rname').value.trim(),em=document.getElementById('rem').value.trim(),p=document.getElementById('rpw').value,p2=document.getElementById('rpw2').value,m=en();
 var err=n.length<2?(m?'Enter your name':'اكتب اسمك'):!/^\S+@\S+\.\S+$/.test(em)?(m?'Enter a valid email':'اكتب إيميل صحيح'):p.length<6?(m?'Password needs 6+ characters':'كلمة السر 6 حروف على الأقل'):p!==p2?(m?'Passwords do not match':'كلمتين السر مش زي بعض'):'';
 if(err){var x=document.querySelector('#s1 .fld.bad');var s=document.getElementById('s1');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');sm2(err);return}sm2('');go(2)});
function sm2(t){var m=document.getElementById('asmsg');m.textContent=t;m.className='amsg e'}
document.getElementById('rgo').addEventListener('click',function(){if(!window.__register){sm(en()?'Sign-up is not available':'التسجيل مش متاح');return}var n=document.getElementById('rname').value.trim(),em=document.getElementById('rem').value.trim(),p=document.getElementById('rpw').value;if(window.__reserved(n)){sm(en()?'This name is reserved':'الاسم ده محجوز');return}var tr=document.getElementById('rtrack').value,k=+document.getElementById('rdone').value;
 for(var i=1;i<=k;i++)done[i]=1;saveLocal();try{localStorage.setItem('start_v1',JSON.stringify({track:tr,upto:k}))}catch(_){}
 document.getElementById('rgo').disabled=true;
 window.__register(n,em,p).then(function(){closeM();render();if(tr)location.href='/tracks/'+tr+'/'}).catch(function(e){document.getElementById('rgo').disabled=false;if(e&&e.code==='auth/email-already-in-use'||/email|password/i.test((e&&e.code)||'')){go(1)}sm2(window.__regErr(e))})});
})();
function setMsg(t,err){msg.textContent=t;msg.className='amsg'+(err?' e':'')}
window.__av=function(){var u=window.__user;try{return u?localStorage.getItem('avatar_'+u.uid):null}catch(_){return null}};
function ui(){window.__user=user;if(user&&user.email){try{var L0=window.__acc().filter(function(x){return x.uid!==user.uid});L0.unshift({uid:user.uid,name:user.displayName||'',email:user.email,g:user.providerData.some(function(p){return p.providerId==='google.com'}),ph:user.photoURL||''});localStorage.setItem('accounts_v1',JSON.stringify(L0.slice(0,4)))}catch(_){}}var w=document.getElementById('uwrap'),av=document.getElementById('avt');if(ab)ab.hidden=!!user;if(w){w.hidden=!user;if(user){var nm=user.displayName||(user.email||'').split('@')[0]||'?';av.innerHTML=(window.__av()||user.photoURL)?'<img src="'+(window.__av()||user.photoURL)+'" alt="" referrerpolicy="no-referrer">':'<span>'+nm.charAt(0).toUpperCase()+'</span>';(function(){var e=document.getElementById('uname');if(user.uid===window.__OWNER)e.innerHTML=window.__who(user.uid,nm);else e.textContent=nm;var ad=document.getElementById('uadmin');if(ad)ad.hidden=user.uid!==window.__OWNER})();document.getElementById('uemail').textContent=user.email||''}}document.dispatchEvent(new Event('authchange'))}
(function(){var av=document.getElementById('avt'),um=document.getElementById('umenu');if(!av)return;function pl(){var r=av.getBoundingClientRect(),w=Math.min(250,innerWidth-16),cx=r.left+r.width/2,l=Math.max(8,Math.min(innerWidth-w-8,cx-w/2));um.style.width=w+'px';um.style.left=l+'px';um.style.top=(r.bottom+10)+'px';um.style.setProperty('--ax',(cx-l)+'px')}
function cl(){um.hidden=true;av.setAttribute('aria-expanded','false')}
av.addEventListener('click',function(e){e.stopPropagation();if(um.hidden){um.hidden=false;av.setAttribute('aria-expanded','true');pl()}else cl()});
document.addEventListener('click',function(e){if(!um.hidden&&!um.contains(e.target))cl()});document.addEventListener('keydown',function(e){if(e.key==='Escape')cl()});window.addEventListener('resize',pl);
document.getElementById('ulogout').addEventListener('click',function(){cl();window.__confirmOut(function(){Promise.resolve(window.__signOut&&window.__signOut()).then(function(){location.href='/'})})});
})();
/* profile + settings pages */
(function(){var root=document.documentElement,pf=document.getElementById('pfname'),st=document.getElementById('stname');
function paint(){var u=window.__user,en=root.lang==='en';
 if(pf){var n=u?(u.displayName||(u.email||'').split('@')[0]):(en?'Guest':'ضيف');if(u&&u.uid===window.__OWNER){pf.innerHTML=window.__who(u.uid,n)+'<small class="ptl">Software Engineer</small>';var pvv=document.querySelector('.pa-pv');if(pvv)pvv.dataset.owner='1'}else pf.textContent=n;document.getElementById('pfmail').textContent=u?u.email||'':'';var p2=document.getElementById('pfname2');if(p2){p2.textContent=n;document.getElementById('pfmail2').textContent=u?u.email||'':''}var av=document.getElementById('pfav');av.innerHTML=u&&(window.__av()||u.photoURL)?'<img src="'+(window.__av()||u.photoURL)+'" alt="" referrerpolicy="no-referrer" style="width:100%;height:100%;border-radius:inherit;object-fit:cover">':(u?n.charAt(0).toUpperCase():av.innerHTML);document.getElementById('pfout').hidden=!!u;var pi=document.getElementById('pfin');if(pi)pi.hidden=!u;
  var d=[];try{d=JSON.parse(localStorage.getItem('progress_v1')||'[]')}catch(_){}var tot=(window.SEARCH||[]).length||1;document.getElementById('pfcount').textContent=d.length;document.getElementById('pfbar').style.width=Math.round(100*d.length/tot)+'%';
  var tp=window.__stp?window.__stp(window.__user&&window.__user.uid):0;var pts=tp,lv=1+Math.floor(pts/20),T2={dart:'Dart',oop:'OOP','flutter-basics':'Flutter Basics','flutter-advanced':'Flutter Advanced'},stt={};try{stt=JSON.parse(localStorage.getItem('start_v1')||'{}')}catch(_){}
  function sv2(i,t){var e=document.getElementById(i);if(e)e.textContent=t}
  var nx=(window.SEARCH||[]).filter(function(x){return d.indexOf(x.n)<0})[0],md=(u&&u.metadata)||{};
  sv2('pfpts',pts);sv2('pfc2',d.length+'/'+tot);var rg=document.getElementById('pfring');if(rg)rg.style.setProperty('--p',Math.round(100*d.length/tot));sv2('pflv2',(en?'Level ':'المستوى ')+lv);sv2('pflvl',lv);(function(){var ow=window.__user&&window.__user.uid===window.__OWNER,p=document.getElementById('pfin'),s=document.getElementById('ownsec');if(p)p.classList.toggle('pfowner',!!ow);if(s)s.hidden=!ow})();(function(){var ow=window.__user&&window.__user.uid===window.__OWNER;['pflv2','pflvl'].forEach(function(i){var e=document.getElementById(i);if(e)e.style.display=ow?'none':''})})();sv2('pftrack',T2[stt.track]||(en?'None':'مفيش'));sv2('pfjoin',md.creationTime?new Date(md.creationTime).toLocaleDateString(en?'en-GB':'ar-EG'):'—');sv2('pflast',md.lastSignInTime?new Date(md.lastSignInTime).toLocaleDateString(en?'en-GB':'ar-EG'):'—');
  sv2('pfver',u?(u.emailVerified?(en?'Verified':'متحقق منه'):(en?'Not verified':'غير متحقق')):'');sv2('pfprov',(window.__prov?window.__prov():[]).map(function(p){return p==='google.com'?'Google':(en?'Email & password':'إيميل وباسورد')}).join(' + ')||'—');
  var nl=document.getElementById('pfnext');if(nl){if(nx){nl.href=nx.u;nl.textContent=(en?'Continue: Lesson ':'كمّل: الدرس ')+nx.n;nl.hidden=false}else nl.hidden=true}
  var pw=document.getElementById('pwsec');if(pw&&window.__prov)pw.hidden=window.__prov().indexOf('password')<0;var gh=document.getElementById('pwgoogle');if(gh&&window.__prov)gh.hidden=window.__prov().indexOf('password')>=0;
  var l=document.getElementById('pflist');l.innerHTML='';(window.SEARCH||[]).forEach(function(x){if(d.indexOf(x.n)<0)return;var a=document.createElement('a');a.className='sc on';a.href=x.u;a.style.display='inline-flex';a.style.alignItems='center';a.textContent=(en?'Lesson ':'الدرس ')+x.n;l.appendChild(a)})}
 if(st&&document.activeElement!==st){var u2=window.__user;st.value=u2?(u2.displayName||''):'';st.disabled=!u2}}
document.addEventListener('authchange',paint);paint();
var ps=document.getElementById('pfsign');if(ps)ps.addEventListener('click',function(){var b=document.getElementById('auth');if(b)b.click()});
var sv=document.getElementById('stsave');if(sv)sv.addEventListener('click',function(){var m=document.getElementById('stmsg'),en=root.lang==='en';if(!window.__user){m.textContent=en?'Sign in first':'سجّل دخولك الأول';return}var n=st.value.trim();if(n.length<2){m.textContent=en?'Name is too short':'الاسم قصير';return}if(window.__reserved(n)&&window.__user.uid!==window.__OWNER){m.textContent=en?'This name is reserved':'الاسم ده محجوز';return}window.__setName(n).then(function(){m.textContent=en?'Saved':'اتحفظ'}).catch(function(){m.textContent=en?'Could not save':'مقدرناش نحفظ'})});
var sl=document.getElementById('stlang');if(sl)sl.addEventListener('click',function(){var x=document.getElementById('lang');if(x)x.click()});
var tt=document.getElementById('sttheme');if(tt)tt.addEventListener('click',function(){var x=document.getElementById('theme');if(x)x.click()});
var rs=document.getElementById('streset');if(rs)rs.addEventListener('click',function(){if(confirm(root.lang==='en'?'Reset progress on this device?':'مسح التقدم على الجهاز؟')){try{localStorage.removeItem('progress_v1')}catch(_){}(window.__sync?window.__sync({done:[]}):Promise.resolve()).catch(function(){}).then(function(){location.reload()})}})})();
(function(){var root=document.documentElement;function tx(x,y){return root.lang==='en'?y:x}
function msg(id,t,ok){var m=document.getElementById(id);if(m){m.textContent=t;m.className='amsg'+(ok?' ok':' e')}}
var EM={'auth/wrong-password':['كلمة السر الحالية غلط','Current password is wrong'],'auth/invalid-credential':['كلمة السر الحالية غلط','Current password is wrong'],'auth/weak-password':['كلمة السر الجديدة ضعيفة (6 حروف على الأقل)','New password is too weak (6+ characters)'],'auth/requires-recent-login':['سجّل دخول من جديد وجرّب تاني','Sign in again and retry'],'auth/email-already-in-use':['الإيميل ده مستخدم','That email is already in use'],'auth/invalid-email':['الإيميل مش صحيح','Invalid email'],'auth/too-many-requests':['محاولات كتير، استنى شوية','Too many attempts, wait a bit'],'auth/popup-closed-by-user':['اتقفلت نافذة جوجل','Google window was closed'],'auth/operation-not-allowed':['العملية دي مش متاحة','Operation not allowed']};
function er(e){var m=EM[e&&e.code];return m?tx(m[0],m[1]):tx('حصلت مشكلة، جرّب تاني','Something went wrong, try again')}
function ok(id){if(!window.__user){msg(id,tx('سجّل دخولك الأول','Sign in first'));return false}return true}
function on(id,f){var e=document.getElementById(id);if(e)e.addEventListener('click',f)}
function val(i){var e=document.getElementById(i);return e?e.value:''}
on('pwsave',function(){if(!ok('pwmsg'))return;var n=val('pwnew');if(n.length<6){msg('pwmsg',tx('6 حروف على الأقل','At least 6 characters'));return}if(n!==val('pwnew2')){msg('pwmsg',tx('كلمتين السر مش متطابقين','Passwords do not match'));return}
 window.__changePass(val('pwcur'),n).then(function(){msg('pwmsg',tx('اتغيرت كلمة السر','Password changed'),1);['pwcur','pwnew','pwnew2'].forEach(function(i){document.getElementById(i).value=''})}).catch(function(e){msg('pwmsg',er(e))})});
on('pwreset',function(){if(!ok('pwmsg'))return;window.__resetMail().then(function(){msg('pwmsg',tx('بعتنالك لينك على الإيميل','Reset link sent to your email'),1)}).catch(function(e){msg('pwmsg',er(e))})});
on('emsave',function(){if(!ok('emmsg'))return;var e=val('emnew').trim();if(!/^\S+@\S+\.\S+$/.test(e)){msg('emmsg',tx('الإيميل مش صحيح','Invalid email'));return}
 window.__changeEmail(val('emcur'),e).then(function(){msg('emmsg',tx('بعتنا لينك تأكيد على الإيميل الجديد، الإيميل بيتغير بعد ما تأكده','Confirmation link sent to the new email. It changes once you confirm'),1)}).catch(function(x){msg('emmsg',er(x))})});
on('vfsend',function(){if(!ok('vfmsg'))return;window.__verifyMail().then(function(){msg('vfmsg',tx('بعتنا لينك التحقق','Verification link sent'),1)}).catch(function(e){msg('vfmsg',er(e))})});
on('delgo',function(){if(!ok('delmsg'))return;if(!confirm(tx('هتمسح الحساب نهائياً. متأكد؟','Delete your account permanently?')))return;
 var u=window.__user;window.__delAcct(val('delpw')).then(function(){try{localStorage.removeItem('avatar_'+u.uid)}catch(_){}location.href='/'}).catch(function(e){msg('delmsg',er(e))})});
on('stout',function(){window.__confirmOut(function(){Promise.resolve(window.__signOut&&window.__signOut()).then(function(){location.href='/'})})});
['nt1','nt2'].forEach(function(i){var e=document.getElementById(i);if(!e)return;var k='notif_'+i;try{e.checked=localStorage.getItem(k)==='1'}catch(_){}e.addEventListener('change',function(){try{localStorage.setItem(k,e.checked?'1':'0')}catch(_){}if(i==='nt1')window.__push(e.checked,e);if(window.__sync){var o={};o[i==='nt1'?'n1':'n2']=e.checked;window.__sync(o).catch(function(){})}})});
})();

(function(){var T=document.querySelectorAll('.tk');if(!T.length)return;var en=document.documentElement.lang==='en';function tx(x,y){return document.documentElement.lang==='en'?y:x}
var K='attempts_v1',S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(_){}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(_){}if(window.__sync&&window.__user)window.__sync({att:S}).catch(function(){})}
function isU(o){return o&&(o.fin||(o.n||0)>=2)}
function srvLock(id){if(!window.__user||!window.__idToken)return;window.__idToken().then(function(tok){return fetch('/api/grade',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({task:id,reveal:true})})}).then(function(r){return r.json()}).then(function(j){if(j&&j.total!=null){window.__setStp(window.__user.uid,j.total);var o=S[id];if(o){o.best=j.best|0;o.pts=Math.max(0,Math.min(10,j.best|0))}save();if(window.__lb)window.__lb()}}).catch(function(){})}
function finalize(id){var o=S[id];if(o&&!o.fin){o.fin=1;o.pts=Math.max(0,Math.min(10,Math.round(o.best||0)));srvLock(id)}}
function unlock(t){var d=t.querySelector('.ans'),l=t.querySelector('.tklock');if(d)d.hidden=false;if(l)l.hidden=true}
window.__srvLoad=function(m){var ch=0;Object.keys(m).forEach(function(k){var o=S[k]||(S[k]={n:0});var v=m[k];o.best=v.best;if(v.n>(o.n||0))o.n=v.n;if(v.fin&&!o.fin){o.fin=1;o.pts=v.pts}else if(v.fin)o.pts=v.pts;ch=1});if(ch){try{localStorage.setItem(K,JSON.stringify(S))}catch(_){}T.forEach(function(t){var id=t.querySelector('.tk-n').textContent;if(isU(S[id]))unlock(t);else if(S[id])revBtn(t)})}};
window.__attLoad=function(c){if(c&&typeof c==='object'){Object.keys(c).forEach(function(k){if(!S[k]||(c[k].fin&&!S[k].fin)||(!S[k].fin&&(c[k].n||1)>(S[k].n||1)))S[k]=c[k]});try{localStorage.setItem(K,JSON.stringify(S))}catch(_){}T.forEach(function(t){var id=t.querySelector('.tk-n').textContent,ta=t.querySelector('.tka');if(S[id]&&ta&&!ta.value)ta.value=S[id].a||'';if(isU(S[id]))unlock(t);else revBtn(t);if(ta)ta.dispatchEvent(new Event('input'))})}};
function revBtn(t){var id=t.querySelector('.tk-n').textContent,o=S[id],b=t.querySelector('.tkrev');if(isU(o)){if(b)b.hidden=true;return}if(!o||!(o.n>=1)){if(b)b.hidden=true;return}
 if(!b){b=document.createElement('button');b.type='button';b.className='btn tkrev';t.querySelector('.tksub').parentNode.appendChild(b);b.addEventListener('click',function(){if(!b.dataset.c){b.dataset.c=1;b.textContent=tx('تأكيد: النتيجة هتتثبّت والحل هيظهر','Confirm: score locks and solution shows');setTimeout(function(){delete b.dataset.c;b.textContent=tx('راضي عن نتيجتي، وريني الحل','Happy with my score, show solution')},5000);return}
  finalize(id);save();unlock(t);b.hidden=true;t.querySelector('.tkmsg').textContent=tx('النتيجة اتثبّتت والحل اتفتح تحت.','Score locked. The solution is unlocked below.')})}
 b.hidden=false;b.textContent=tx('راضي عن نتيجتي، وريني الحل','Happy with my score, show solution')}
var gradeReady=false;fetch('/api/grade?ping=1',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.ready){gradeReady=true;T.forEach(function(t){t.querySelector('.tkai').textContent=tx('قيّم بالـ AI','Grade with AI');upd(t)})}}).catch(function(){});
function upd(t){var ta=t.querySelector('.tka'),n=ta.value.trim().length;t.querySelector('.tksub').disabled=n<10;t.querySelector('.tkai').disabled=!(gradeReady&&n>=10)}
T.forEach(function(t){var id=t.querySelector('.tk-n').textContent,ta=t.querySelector('.tka'),m=t.querySelector('.tkmsg');if(S[id]){ta.value=S[id].a||'';if(isU(S[id]))unlock(t);else{t.querySelector('.tkmsg').textContent=tx('المحاولة 1 من 2 اتسجّلت. تقدر تقدّم تاني، أو تفتح الحل وتثبّت نتيجتك.','Attempt 1 of 2 saved. Submit again, or reveal the solution and lock your score.');revBtn(t)}}
 ta.addEventListener('input',function(){upd(t)});upd(t);
 t.querySelector('.tksub').addEventListener('click',function(){var v=ta.value.trim();if(v.length<10){m.textContent=tx('اكتب إجابة أطول شوية','Write a longer answer');return}var n=((S[id]&&S[id].n)||0)+1;if(n>2)n=2;var o=S[id]||{};o.a=v.slice(0,2000);o.n=n;o.t=Date.now();S[id]=o;if(n>=2)finalize(id);save();if(n>=2){unlock(t);m.textContent=tx('المحاولة 2 من 2 اتسجّلت. الحل اتفتح تحت.','Attempt 2 of 2 saved. The solution is unlocked below.')}else{m.textContent=tx('المحاولة 1 من 2 اتسجّلت. تقدر تقدّم تاني، أو تفتح الحل وتثبّت نتيجتك.','Attempt 1 of 2 saved. Submit again, or reveal the solution and lock your score.');revBtn(t)}});
 t.querySelector('.tkai').addEventListener('click',function(){var v=ta.value.trim();if(!window.__user){m.textContent=tx('سجّل دخولك الأول عشان التقييم','Sign in to get AI grading');return}var o0=S[id];if(o0&&o0.fin){m.textContent=tx('النتيجة اتثبّتت خلاص.','Your score is already locked.');return}m.textContent=tx('بيتقيّم...','Grading...');(window.__idToken?window.__idToken():Promise.resolve('')).then(function(tok){return fetch('/api/grade',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({task:id,answer:v})})}).then(function(r){if(r.status===429){throw 'rate'}return r.json().then(function(x){if(r.status===409&&x&&x.locked){var o3=S[id]||(S[id]={n:2});o3.fin=1;o3.best=x.best|0;o3.pts=Math.max(0,Math.min(10,o3.best));save();unlock(t);throw 'locked'}return x})}).then(function(j){if(j&&j.score!=null){var o2=S[id]||(S[id]={a:v,n:0,t:Date.now()});if(!o2.fin){o2.best=Math.max(o2.best||0,Number(j.best!=null?j.best:j.score)||0);if(j.n>(o2.n||0))o2.n=j.n;if(j.fin){o2.fin=1;o2.pts=Math.max(0,Math.min(10,o2.best|0));unlock(t)}save()}if(j.total!=null&&window.__user){window.__setStp(window.__user.uid,j.total);if(window.__lb)window.__lb()}m.textContent=tx('التقييم: ','Score: ')+j.score+'/10 '+(j.feedback||'')+(o2.fin?tx(' (بعد فتح الحل مفيش نقاط جديدة)',' (no new points after the solution is revealed)'):'')}else m.textContent=tx('مقدرناش نقيّم','Could not grade')}).catch(function(e){m.textContent=e==='rate'?tx('كتير أوي، جرّب بعد شوية.','Too many requests, try again later.'):e==='locked'?tx('النتيجة اتثبّتت خلاص والحل اتفتح.','Your score is already locked.'):tx('مقدرناش نقيّم','Could not grade')})})})})();
if(ab)ab.addEventListener('click',function(){if(user){window.__signOut&&window.__signOut()}else openM()});
ui();
if(!cfg)return;
/* Firebase */
var V='10.14.1',B='https://www.gstatic.com/firebasejs/'+V+'/';
Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]).then(function(m){
 var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg),A=m[1],F=m[2],auth=A.getAuth(app),db=F.getFirestore(app);
 fs={db:db,doc:F.doc,set:F.setDoc};
 var errs={'auth/invalid-credential':'الإيميل أو كلمة السر غلط','auth/user-not-found':'مفيش حساب بالإيميل ده','auth/wrong-password':'كلمة السر غلط','auth/email-already-in-use':'الإيميل ده مسجّل قبل كده، جرّب دخول','auth/weak-password':'كلمة السر ضعيفة (6 حروف على الأقل)','auth/invalid-email':'الإيميل مش مظبوط','auth/popup-closed-by-user':'','auth/too-many-requests':'محاولات كتير، جرّب بعد شوية'};
 function fail(e){setMsg(errs[e.code]!==undefined?errs[e.code]:'حصلت مشكلة، جرّب تاني',true)}
 document.getElementById('gsign').onclick=function(){A.signInWithPopup(auth,(function(){var p=new A.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p})()).then(closeM).catch(fail)};
 document.getElementById('alogin').onclick=function(){A.signInWithEmailAndPassword(auth,document.getElementById('aem').value.trim(),document.getElementById('apw').value).then(closeM).catch(fail)};
 document.getElementById('areg').onclick=function(){A.createUserWithEmailAndPassword(auth,document.getElementById('aem').value.trim(),document.getElementById('apw').value).then(closeM).catch(fail)};
 document.getElementById('areset').onclick=function(){var em=document.getElementById('aem').value.trim();if(!em){setMsg('اكتب الإيميل الأول',true);return}A.sendPasswordResetEmail(auth,em).then(function(){setMsg('بعتنالك لينك تغيير كلمة السر')}).catch(fail)};
 window.__register=function(name,email,pw){return A.createUserWithEmailAndPassword(auth,email,pw).then(function(c){return A.updateProfile(c.user,{displayName:name}).catch(function(){}).then(function(){user=auth.currentUser;ui();var st={};try{st=JSON.parse(localStorage.getItem('start_v1')||'{}')}catch(_){}return window.__sync({name:name,track:st.track||'',upto:st.upto||0,done:list()}).catch(function(){})})})};window.__regErr=function(e){return errs[e.code]||e.message};window.__signOut=function(){return A.signOut(auth)};window.__push=function(on,el){var cfg=window.FIREBASE_CONFIG,u=window.__user,en=document.documentElement.lang==='en';function msg(t){var m=document.getElementById('pushmsg');if(!m){m=document.createElement('p');m.id='pushmsg';m.className='cm-note';el.closest('.srow').parentNode.insertBefore(m,el.closest('.srow').nextSibling)}m.textContent=t}
if(!cfg)return;if(!u){if(on){el.checked=false;msg(en?'Sign in first to get alerts.':'سجّل دخولك الأول عشان توصلك الإشعارات.')}return}
if(!on){window.__db().then(function(x){return x.F.deleteDoc(x.F.doc(x.db,'pushtokens',u.uid))}).then(function(){msg(en?'Alerts are off.':'الإشعارات اتقفلت.')}).catch(function(){});return}
if(!('Notification' in window)||!('serviceWorker' in navigator)){el.checked=false;msg(en?'This browser does not support alerts.':'المتصفح ده مش بيدعم الإشعارات.');return}
Notification.requestPermission().then(function(p){if(p!=='granted'){el.checked=false;msg(en?'Notifications are blocked in the browser settings.':'الإشعارات متقفلة من إعدادات المتصفح.');return}
return Promise.all([import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),import('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js'),window.__db(),navigator.serviceWorker.register('/firebase-messaging-sw.js')]).then(function(r){var app=r[0].getApps().length?r[0].getApp():r[0].initializeApp(cfg);return navigator.serviceWorker.ready.then(function(reg){return r[1].getToken(r[1].getMessaging(app),{vapidKey:'BNyjV6niIphnYq4qio6FtGd7kOTilNui5LaMjzwuy3qAVs_VUACq13p3BFwXvaBZG-6JlktAnq5Gi5Uqj9WF8ng',serviceWorkerRegistration:reg})}).then(function(tok){if(!tok)throw 0;return r[2].F.setDoc(r[2].F.doc(r[2].db,'pushtokens',u.uid),{token:tok,updated:Date.now()})})}).then(function(){msg(en?'Done. You will get an alert when a new lesson is out.':'تمام. هيجيلك إشعار لما ينزل درس جديد.')})}).catch(function(){el.checked=false;msg(en?'Could not turn alerts on. Try again.':'مقدرناش نفعّل الإشعارات. جرّب تاني.')})};
window.__stp=function(uid){try{var o=JSON.parse(localStorage.getItem('srvtp')||'{}');return o.u===uid?(o.t|0):0}catch(_){return 0}};window.__setStp=function(uid,t){try{localStorage.setItem('srvtp',JSON.stringify({u:uid,t:t|0}))}catch(_){}};window.__idToken=function(){var c=auth.currentUser;return c?c.getIdToken():Promise.resolve('')};window.__lb=function(){var cu=auth.currentUser;if(!cu)return Promise.resolve();var d=list(),tp=window.__stp(cu.uid);var nm=cu.displayName||(cu.email||'').split('@')[0]||'User';if(localStorage.getItem('priv_'+cu.uid)==='0')return F.deleteDoc(F.doc(db,'leaderboard',cu.uid)).catch(function(){});return window.__thumb().then(function(av){var o={name:String(nm).slice(0,60),points:tp,lessons:d.length,updated:Date.now()},cv=parseInt(localStorage.getItem('cover_'+cu.uid),10);if(cv>=0&&cv<6)o.cv=cv;if(av)o.av=av;return F.setDoc(F.doc(db,'leaderboard',cu.uid),o)}).catch(function(){})};
 window.__sync=function(p){var cu=auth.currentUser;if(!cu)return Promise.resolve();p.updated=Date.now();return F.setDoc(F.doc(db,'users',cu.uid),p,{merge:true}).then(function(r){if(p.done||p.att||p.name!==undefined||p.priv!==undefined||p.cover!==undefined||p.avatar!==undefined)window.__lb();return r})};window.__gin=function(email){var p=new A.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account',login_hint:email});return A.signInWithPopup(auth,p).then(closeM).catch(fail)};
 window.__prov=function(){var u=auth.currentUser;return u?u.providerData.map(function(p){return p.providerId}):[]};
 window.__reauth=function(pw){var u=auth.currentUser;if(window.__prov().indexOf('password')>=0)return A.reauthenticateWithCredential(u,A.EmailAuthProvider.credential(u.email,pw));return A.reauthenticateWithPopup(u,new A.GoogleAuthProvider())};
 window.__changePass=function(c,n){return window.__reauth(c).then(function(){return A.updatePassword(auth.currentUser,n)})};
 window.__changeEmail=function(c,e){return window.__reauth(c).then(function(){return A.verifyBeforeUpdateEmail(auth.currentUser,e)})};
 window.__delAcct=function(c){return window.__reauth(c).then(function(){return A.deleteUser(auth.currentUser)})};
 window.__resetMail=function(){return A.sendPasswordResetEmail(auth,auth.currentUser.email)};
 window.__verifyMail=function(){return A.sendEmailVerification(auth.currentUser)};window.__switch=function(){A.signOut(auth).then(function(){window.__gprompt=1;openM()})};window.__setName=function(n){return A.updateProfile(auth.currentUser,{displayName:n}).then(function(){user=auth.currentUser;ui();return window.__sync({name:n}).catch(function(){})})};
 A.onAuthStateChanged(auth,function(u){user=u;ui();if(!u)return;
  var ref=F.doc(db,'users',u.uid);F.getDoc(F.doc(db,'taskscore',u.uid)).then(function(ts){var m={},tot=0;if(ts.exists()){var td=ts.data();tot=td.total|0;var tk=td.tasks||{};Object.keys(tk).forEach(function(k){m[k]={best:tk[k].best|0,n:tk[k].n|0,fin:tk[k].fin?1:0,pts:tk[k].fin?Math.max(0,Math.min(10,tk[k].best|0)):0}})}window.__setStp(u.uid,tot);if(window.__srvLoad)window.__srvLoad(m);if(window.__lb)window.__lb()}).catch(function(){});F.getDoc(ref).then(function(s){var d=s.exists()?s.data():{},r=d.done||[];if(window.__attLoad)window.__attLoad(d.att);if(window.__userLoad)window.__userLoad(d);r.forEach(function(n){done[n]=1});saveLocal();render();var up={done:list(),updated:Date.now()};
  try{if(d.track!==undefined){localStorage.setItem('start_v1',JSON.stringify({track:d.track,upto:d.upto||0}))}else{var st=JSON.parse(localStorage.getItem('start_v1')||'null');if(st){up.track=st.track||'';up.upto=st.upto||0}}
  ['n1','n2'].forEach(function(k,i){var lk='notif_nt'+(i+1);if(d[k]!==undefined){localStorage.setItem(lk,d[k]?'1':'0')}else{var v=localStorage.getItem(lk);if(v!==null)up[k]=v==='1'}});
  var ck='cover_'+u.uid;if(d.cover!==undefined){localStorage.setItem(ck,d.cover)}else{var cv0=parseInt(localStorage.getItem(ck),10);if(cv0>=0)up.cover=cv0}var ak='avatar_'+u.uid;if(d.avatar){localStorage.setItem(ak,d.avatar)}else if(d.avatar===undefined){var av=localStorage.getItem(ak);if(av&&av.length<65000)up.avatar=av}else{localStorage.removeItem(ak)}
  var pk='priv_'+u.uid;if(d.priv!==undefined){localStorage.setItem(pk,d.priv?'1':'0')}else{var pv0=localStorage.getItem(pk);if(pv0!==null)up.priv=pv0==='1'}if(d.name===undefined&&u.displayName)up.name=u.displayName}catch(_){}
  return F.setDoc(ref,up,{merge:true}).then(function(){window.__lb();ui();document.dispatchEvent(new Event('authchange'))})}).catch(function(){});});
}).catch(function(){});
})();

/* v5: language, menu, search, continue, certificate, run, subscribe */
(function(){
var root=document.documentElement;
function setLang(l){root.lang=l;root.dir=l==='en'?'ltr':'rtl';try{localStorage.setItem('lang',l)}catch(_){}
 document.querySelectorAll('.i').forEach(function(e){e.textContent=e.dataset[l]});
 document.querySelectorAll('[data-pha]').forEach(function(e){e.placeholder=e.dataset[l==='en'?'phe':'pha']});
 var b=document.getElementById('lang');if(b)b.textContent=l==='en'?'ع':'EN';}
var lg=document.getElementById('lang');if(lg)lg.addEventListener('click',function(){setLang(root.lang==='en'?'ar':'en')});
if(root.lang==='en')setLang('en');
var mb=document.getElementById('menu'),nv=document.getElementById('nav');if(mb)mb.addEventListener('click',function(){nv.classList.toggle('open')});
document.addEventListener('click',function(e){if(nv&&e.target.closest('#nav a'))nv.classList.remove('open')});
/* last lesson + continue */
var lm=document.querySelector('main[data-lesson]');if(lm){try{localStorage.setItem('last_lesson',lm.dataset.lesson)}catch(_){}}
var ct=document.getElementById('cont');if(ct){var n=null;try{n=localStorage.getItem('last_lesson')}catch(_){}
 if(n&&window.SEARCH){var l=window.SEARCH.filter(function(x){return String(x.n)===n})[0];if(l){ct.href=l.u;document.getElementById('contt').textContent=(root.lang==='en'?'Lesson ':'الدرس ')+l.n+': '+l.t;ct.hidden=false}}}
/* search popover */
var sm=document.getElementById('smodal'),sq=document.getElementById('sq'),sr=document.getElementById('sres'),sF={tr:'',lv:'',ty:''},sAnchor=null;
function sPlace(){if(!sm||sm.hidden||!sAnchor)return;var r=sAnchor.getBoundingClientRect(),w=Math.min(420,window.innerWidth-16),cx=r.left+r.width/2,l=Math.max(8,Math.min(window.innerWidth-w-8,cx-w/2));sm.style.width=w+'px';sm.style.left=l+'px';sm.style.top=(r.bottom+10)+'px';sm.style.setProperty('--ax',(cx-l)+'px')}
function sClose(){if(sm){sm.hidden=true;if(sAnchor)sAnchor.setAttribute('aria-expanded','false')}}
function openS(e){if(!sm)return;var t=(e&&e.currentTarget)||document.getElementById('sbtn');if(!sm.hidden&&sAnchor===t){sClose();return}sAnchor=t;sm.hidden=false;t.setAttribute('aria-expanded','true');sPlace();sq.value='';sRun();setTimeout(function(){sq.focus()},50)}
['sbtn','sbtn2'].forEach(function(i){var e=document.getElementById(i);if(e){e.setAttribute('aria-haspopup','dialog');e.setAttribute('aria-expanded','false');e.addEventListener('click',function(ev){ev.stopPropagation();openS(ev)})}});
function sRun(){var q=sq.value.trim().toLowerCase(),en=root.lang==='en';sr.innerHTML='';var any=false,filt=sF.tr||sF.lv||sF.ty;
 document.getElementById('shint').hidden=q.length>0;
 if(!q&&!filt&&true){}
 (window.SEARCH||[]).forEach(function(l){if(sF.tr&&l.tr!==sF.tr)return;if(sF.lv&&String(l.lv)!==sF.lv)return;
  var fields=sF.ty?[sF.ty]:['x','c','k'],hay=l.t,sn='';
  if(q){var hit=l.t.toLowerCase().indexOf(q)>=0;fields.forEach(function(f){var s=l[f]||'',i=s.toLowerCase().indexOf(q);if(i>=0&&!sn){hit=true;sn=s.slice(Math.max(0,i-30),i+80).replace(/\s+/g,' ')}});if(!hit)return}
  else{if(sF.ty&&!l[sF.ty])return;if(!q&&!filt&&sr.children.length>=5)return}
  any=true;var a=document.createElement('a');a.href=l.u;var b=document.createElement('b');b.textContent=(en?'Lesson ':'الدرس ')+l.n+': '+l.t;a.appendChild(b);
  if(sn){var p=document.createElement('span');p.textContent='\u2026'+sn+'\u2026';p.dir='auto';a.appendChild(p)}sr.appendChild(a)});
 if(!any){var d=document.createElement('p');d.className='amsg';d.textContent=en?'No results':'مفيش نتايج';sr.appendChild(d)}}
if(sm){sq.addEventListener('input',sRun);
 sm.addEventListener('click',function(e){e.stopPropagation();if(e.target.closest('.mx')){sClose();return}
  var c=e.target.closest('.sc');if(!c)return;if(c.classList.contains('sug')){sq.value=c.textContent;sRun();sq.focus();return}
  var f=c.getAttribute('data-f');sF[f]=c.getAttribute('data-v');sm.querySelectorAll('\.sc[data-f="'+f+'"]').forEach(function(x){x.classList.toggle('on',x===c)});sRun()});
 document.addEventListener('click',function(e){if(!sm.hidden&&!sm.contains(e.target))sClose()});
 window.addEventListener('resize',sPlace);window.addEventListener('scroll',sPlace,{passive:true});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sm.hidden){sClose();if(sAnchor)sAnchor.focus()}if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();openS({currentTarget:document.getElementById('sbtn')})}});}
/* progress extras: badges + certificate unlock */
function doneSet(){var d={};try{JSON.parse(localStorage.getItem('progress_v1')||'[]').forEach(function(n){d[n]=1})}catch(_){}return d}
function extras(){var d=doneSet();
 document.querySelectorAll('.tcard[data-ls],.step[data-ls]').forEach(function(c){var ids=c.dataset.ls?c.dataset.ls.split(','):[];c.classList.toggle('complete',ids.length>0&&ids.every(function(i){return d[i]}))});
}
document.addEventListener('click',function(e){if(e.target.closest('.donebtn'))setTimeout(extras,50)});
setTimeout(extras,100);window.addEventListener('storage',extras);
/* DartPad */
var rm=document.getElementById('rmodal'),dp=document.getElementById('dp'),pending=null;
document.addEventListener('click',function(e){var r=e.target.closest('.runb');if(!r)return;var c=document.getElementById(r.dataset.code).innerText;try{navigator.clipboard.writeText(c)}catch(x){}var o=r.innerHTML;r.innerHTML=(document.documentElement.lang==='en'?'Copied! Paste in DartPad':'اتنسخ! الصقه في DartPad');setTimeout(function(){r.innerHTML=o},3500);window.open('https://dartpad.dev/?channel=stable','_blank','noopener');});

if(rm)rm.addEventListener('click',function(e){if(e.target===rm||e.target.closest('.mx')){rm.hidden=true;dp.src='about:blank';pending=null}});
/* subscribe */
var sf=document.getElementById('sform');if(sf){sf.addEventListener('submit',function(e){e.preventDefault();var m=document.getElementById('smsg'),em=sf.email.value.trim();if(!/^\S+@\S+\.\S+$/.test(em)){m.textContent=root.lang==='en'?'Enter a valid email':'اكتب إيميل صحيح';m.className='amsg e';return}
 var b=sf.querySelector('.send');b.disabled=true;
 fetch('https://formsubmit.co/ajax/mobileappatoz@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:em,_subject:'اشتراك جديد في دروس Mobile App A to Z',_honey:sf._honey.value})}).then(function(r){return r.json()}).then(function(j){if(j.success==='true'||j.success===true){m.textContent=root.lang==='en'?'Subscribed. Thank you!':'تم الاشتراك. شكراً ليك!';m.className='amsg';sf.email.value=''}else throw 0}).catch(function(){m.textContent=root.lang==='en'?'Something went wrong, try again':'حصلت مشكلة، جرّب تاني';m.className='amsg e'}).then(function(){b.disabled=false})});}
})();

/* comments (Firestore, no login, real name required) */
(function(){var box=document.getElementById('comments');if(!box)return;
var lesson=parseInt(box.dataset.lesson,10),f=document.getElementById('cmform'),msg=document.getElementById('cmmsg'),list=document.getElementById('cmlist'),cfg=window.FIREBASE_CONFIG,OWNER='mobileappatoz@gmail.com';
var en=document.documentElement.lang==='en';
function say(t,err){msg.textContent=t;msg.className='cm-msg'+(err?' e':'')}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
if(!cfg){say(en?'Comments will open soon.':'التعليقات هتتفتح قريبًا.');f.querySelectorAll('input,textarea,button').forEach(function(x){x.disabled=true});return}
var V='10.14.1',B='https://www.gstatic.com/firebasejs/'+V+'/';
Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js'),import(B+'firebase-auth.js')]).then(function(m){
 var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg),F=m[1],A=m[2],db=F.getFirestore(app),auth=A.getAuth(app),isOwner=false;
 function when(ts){try{return ts.toDate().toLocaleDateString(en?'en-GB':'ar-EG',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
 function draw(docs){list.innerHTML=docs.length?'':'<p class="cm-empty">'+(en?'No comments yet. Be the first.':'مفيش تعليقات لسه. كن أول واحد.')+'</p>';
  docs.forEach(function(d){var x=d.data(),el=document.createElement('div');el.className='cm';
   el.innerHTML='<div class="cm-h"><b>'+(x.staff?window.__who(window.__OWNER,x.name):esc(x.name))+'</b><small>'+when(x.created)+'</small>'+(isOwner?'<button type="button" class="cm-del" data-id="'+d.id+'">'+(en?'Delete':'مسح')+'</button>':'')+'</div><p>'+esc(x.text)+'</p>';list.appendChild(el)})}
 var last=[];
 F.onSnapshot(F.query(F.collection(db,'comments'),F.where('lesson','==',lesson)),function(sn){last=sn.docs.slice().sort(function(a,b){var x=a.data().created,y=b.data().created;return (y?y.seconds:9e9)-(x?x.seconds:9e9)}).slice(0,100);draw(last)},function(){say(en?'Could not load comments.':'مقدرناش نحمّل التعليقات.',true)});
 A.onAuthStateChanged(auth,function(u){isOwner=!!(u&&u.emailVerified&&u.email===OWNER);draw(last)});
 list.addEventListener('click',function(e){var b=e.target.closest('.cm-del');if(!b||!isOwner)return;if(confirm(en?'Delete this comment?':'تمسح التعليق؟'))F.deleteDoc(F.doc(db,'comments',b.dataset.id)).catch(function(){})});
 f.addEventListener('submit',function(e){e.preventDefault();
  if(f.website.value)return;
  var nm=f.nm.value.replace(/\s+/g,' ').trim(),tx=f.tx.value.trim();
  if(!/^[\p{L}][\p{L} .'\-]{1,39}$/u.test(nm)||/https?:|www\./i.test(nm)){say(en?'Please enter your real name (letters only, 2 to 40 characters).':'اكتب اسمك الحقيقي (حروف بس، من 2 لـ 40 حرف).',true);f.nm.focus();return}
  if(tx.length<2){say(en?'Write your comment first.':'اكتب تعليقك الأول.',true);f.tx.focus();return}
  if((tx.match(/https?:\/\//gi)||[]).length>1){say(en?'Too many links.':'روابط كتير.',true);return}
  var now=Date.now(),lastT=+(localStorage.getItem('cm_t')||0);if(now-lastT<30000){say(en?'Please wait a few seconds between comments.':'استنى كام ثانية بين كل تعليق.',true);return}
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;
  F.addDoc(F.collection(db,'comments'),{lesson:lesson,name:nm,text:tx,created:F.serverTimestamp()}).then(function(){localStorage.setItem('cm_t',String(Date.now()));f.tx.value='';say(en?'Posted. Thank you!':'اتنشر. شكرًا!')}).catch(function(){say(en?'Could not post. Try again.':'مقدرناش ننشر، جرّب تاني.',true)}).then(function(){btn.disabled=false});
 });
}).catch(function(){say(en?'Comments are unavailable now.':'التعليقات مش متاحة دلوقتي.',true)});
})();

/* avatar editor */
(function(){var md=document.getElementById('avmodal');if(!md)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
var cv=document.getElementById('avcv'),cx=cv.getContext('2d'),zm=document.getElementById('avzm'),g=document.getElementById('avg'),am=document.getElementById('avmsg'),img=null,ox=0,oy=0,base=1,drag=null;
function say(t,ok){am.textContent=t;am.style.color=ok?'':'#ff8a8a'}
function dims(){var s=base*zm.value;return{w:img.width*s,h:img.height*s}}
function clamp(){if(!img)return;var d=dims(),mx=Math.max(0,(d.w-240)/2),my=Math.max(0,(d.h-240)/2);ox=Math.max(-mx,Math.min(mx,ox));oy=Math.max(-my,Math.min(my,oy))}
function draw(){cx.fillStyle='#0b1514';cx.fillRect(0,0,240,240);if(!img){cx.fillStyle='#5f7f7b';cx.font='15px sans-serif';cx.textAlign='center';cx.fillText(tx('مفيش صورة','No photo'),120,124);return}clamp();var d=dims();cx.drawImage(img,120-d.w/2+ox,120-d.h/2+oy,d.w,d.h)}
function setImg(i){img=i;base=Math.max(240/i.width,240/i.height);zm.value=1;ox=oy=0;draw()}
var seq=0;function load(src,cors){var q=++seq,i=new Image();if(cors)i.crossOrigin='anonymous';i.onload=function(){if(q===seq)setImg(i)};i.onerror=function(){img=null;draw()};i.src=src}
function open(){md.hidden=false;say('',1);var a=window.__av&&window.__av(),u=window.__user;img=null;draw();if(a)load(a);else if(u&&u.photoURL)load(u.photoURL,1)}
function close(){md.hidden=true}
document.getElementById('pfedit').addEventListener('click',function(){if(!window.__user)return;open()});
document.getElementById('avx').addEventListener('click',close);md.addEventListener('mousedown',function(e){if(e.target===md)close()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!md.hidden)close()});
zm.addEventListener('input',draw);
cv.addEventListener('pointerdown',function(e){if(!img)return;drag={x:e.clientX,y:e.clientY,ox:ox,oy:oy};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',function(e){if(!drag)return;var k=240/cv.getBoundingClientRect().width;ox=drag.ox+(e.clientX-drag.x)*k;oy=drag.oy+(e.clientY-drag.y)*k;draw()});
['pointerup','pointercancel'].forEach(function(n){cv.addEventListener(n,function(){drag=null})});
document.getElementById('avup').addEventListener('click',function(){document.getElementById('pfile').click()});
document.getElementById('pfile').addEventListener('change',function(){var f=this.files[0];this.value='';if(!f)return;if(!/^image\//.test(f.type)){say(tx('اختار صورة','Choose an image'));return}var r=new FileReader();r.onload=function(){load(r.result)};r.readAsDataURL(f)});
document.getElementById('avsave').addEventListener('click',function(){if(!img||!window.__user){say(tx('اختار صورة الأول','Pick a photo first'));return}var c=document.createElement('canvas');c.width=c.height=192;var x=c.getContext('2d'),d=dims(),k=192/240;x.fillStyle='#fff';x.fillRect(0,0,192,192);x.drawImage(img,(120-d.w/2+ox)*k,(120-d.h/2+oy)*k,d.w*k,d.h*k);var du;try{du=c.toDataURL('image/jpeg',.82);if(du.length>65000)du=c.toDataURL('image/jpeg',.55)}catch(e){say(tx('مقدرناش نجهّز الصورة، ارفع صورة من جهازك','Could not use this image, upload one from your device'));return}if(du.length>65000){say(tx('الصورة كبيرة','Photo too large'));return}
 try{localStorage.setItem('avatar_'+window.__user.uid,du)}catch(_){}say(tx('بنحفظ...','Saving...'),1);(window.__sync?window.__sync({avatar:du}):Promise.reject()).then(function(){location.reload()}).catch(function(){say(tx('مقدرناش نحفظ الصورة في حسابك','Could not save the photo to your account'))})});
document.getElementById('avdel').addEventListener('click',function(){if(!window.__user)return;try{localStorage.removeItem('avatar_'+window.__user.uid)}catch(_){}(window.__sync?window.__sync({avatar:''}):Promise.resolve()).catch(function(){}).then(function(){location.reload()})});
/* characters */
var P=[['#2fd3c6','#f2c9a5','#2b2118',0,'gl','#3b5bff'],['#8b5cf6','#a56b45','#14110f',1,'','#f4b942'],['#fb923c','#d8a173','#3a2417',3,'','#2f9e8f'],['#3b82f6','#6b4226','#0d0b0a',0,'hp','#fff'],['#f472b6','#f6d3b6','#6b3b1f',2,'','#3b5bff'],['#22c55e','#d8a173','#222',4,'cap','#1f2937'],['#1e3a5f','#f2c9a5','#2fd3c6',5,'','#2fd3c6'],['#64748b','#cbd5e1','',6,'','#2fd3c6'],['#facc15','#8d5a38','#1a1410',0,'bd','#ef4444'],['#ef4444','#f6d3b6','#c2410c',1,'gl','#111827'],['#6366f1','#4a2e1c','#0b0908',3,'hp','#f4b942'],['#14b8a6','#f2c9a5','#2b2118',7,'','#111827']];
function svg(p){var bg=p[0],sk=p[1],hr=p[2],st=p[3],ex=p[4],sh=p[5],s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="'+bg+'"/>';
 if(st===6){s+='<path d="M30 192c0-34 30-50 66-50s66 16 66 50z" fill="'+sh+'"/><rect x="92" y="30" width="8" height="22" fill="#94a3b8"/><circle cx="96" cy="28" r="7" fill="#f4b942"/><rect x="50" y="48" width="92" height="84" rx="22" fill="'+sk+'"/><rect x="64" y="72" width="22" height="22" rx="6" fill="#0b1514"/><rect x="106" y="72" width="22" height="22" rx="6" fill="#0b1514"/><circle cx="75" cy="83" r="5" fill="#2fd3c6"/><circle cx="117" cy="83" r="5" fill="#2fd3c6"/><rect x="72" y="108" width="48" height="8" rx="4" fill="#0b1514"/>';return s+'</svg>'}
 s+='<path d="M28 192c0-36 30-52 68-52s68 16 68 52z" fill="'+sh+'"/>';
 if(st===7)s+='<path d="M40 150c0-30 22-44 56-44s56 14 56 44v42H40z" fill="'+sh+'"/><path d="M62 136c8 14 20 20 34 20s26-6 34-20" fill="none" stroke="#0f766e" stroke-width="5"/>';
 if(st===1||st===9)s+='<path d="M48 90c0-44 20-58 48-58s48 14 48 58v62H48z" fill="'+hr+'"/>';
 if(st===5)s+='<path d="M44 96c0-42 22-62 52-62s52 20 52 62v50c-8 8-20 12-52 12s-44-4-52-12z" fill="'+hr+'"/>';
 s+='<rect x="84" y="116" width="24" height="30" rx="8" fill="'+sk+'"/><ellipse cx="96" cy="88" rx="40" ry="44" fill="'+sk+'"/>';
 if(st===0||st===1||st===9)s+='<path d="M54 84c0-30 18-46 42-46s42 16 42 46c-8-14-22-20-42-20s-34 6-42 20z" fill="'+hr+'"/>';
 if(st===2)s+='<path d="M56 78c0-26 18-40 40-40s40 14 40 40c-10-10-22-14-40-14s-30 4-40 14z" fill="'+hr+'"/><circle cx="62" cy="62" r="13" fill="'+hr+'"/><circle cx="84" cy="48" r="14" fill="'+hr+'"/><circle cx="110" cy="48" r="14" fill="'+hr+'"/><circle cx="130" cy="62" r="13" fill="'+hr+'"/>';
 if(st===3)s+='<path d="M54 80c0-28 18-40 42-40s42 12 42 40c-10-8-24-12-42-12s-32 4-42 12z" fill="'+hr+'"/><circle cx="66" cy="50" r="12" fill="'+hr+'"/><circle cx="96" cy="42" r="13" fill="'+hr+'"/><circle cx="126" cy="50" r="12" fill="'+hr+'"/>';
 if(st===4)s+='<circle cx="96" cy="36" r="17" fill="'+hr+'"/><path d="M54 84c0-30 18-44 42-44s42 14 42 44c-8-14-22-20-42-20s-34 6-42 20z" fill="'+hr+'"/>';
 if(st===5)s+='<path d="M48 90c0-34 18-54 48-54s48 20 48 54c0 18-6 28-6 28 0-30-14-52-42-52s-42 22-42 52c0 0-6-10-6-28z" fill="'+hr+'"/>';
 if(st===7)s+='<path d="M52 96c0-32 18-56 44-56s44 24 44 56c0 14-6 22-6 22 0-26-12-48-38-48s-38 22-38 48c0 0-6-8-6-22z" fill="#1f2937"/><path d="M50 90c0-30 20-52 46-52s46 22 46 52c-14-10-26-14-46-14s-32 4-46 14z" fill="#1f2937"/>';
 if(st===4||st===0)s+='';
 if(ex==='cap')s+='<path d="M52 70c0-24 18-38 44-38s44 14 44 38z" fill="'+sh+'"/><rect x="48" y="66" width="104" height="9" rx="4" fill="'+sh+'"/>';
 s+='<circle cx="80" cy="90" r="4.5" fill="#1b1b1b"/><circle cx="112" cy="90" r="4.5" fill="#1b1b1b"/><path d="M82 108q14 12 28 0" fill="none" stroke="#1b1b1b" stroke-width="3.5" stroke-linecap="round"/>';
 if(ex==='bd')s+='<path d="M58 100c2 26 16 40 38 40s36-14 38-40c-6 8-14 14-38 14s-32-6-38-14z" fill="'+hr+'"/><path d="M82 108q14 12 28 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>';
 if(ex==='gl')s+='<circle cx="80" cy="90" r="12" fill="none" stroke="#111" stroke-width="3.5"/><circle cx="112" cy="90" r="12" fill="none" stroke="#111" stroke-width="3.5"/><path d="M92 90h8" stroke="#111" stroke-width="3.5"/>';
 if(ex==='hp')s+='<path d="M52 92c0-36 18-52 44-52s44 16 44 52" fill="none" stroke="#111827" stroke-width="7"/><rect x="42" y="84" width="16" height="30" rx="8" fill="#2fd3c6"/><rect x="134" y="84" width="16" height="30" rx="8" fill="#2fd3c6"/>';
 return s+'</svg>'}
P.forEach(function(p,i){var b=document.createElement('button');b.type='button';b.className='ave-c';b.setAttribute('aria-label','avatar '+(i+1));var u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(p));b.innerHTML='<img alt="" src="'+u+'">';b.addEventListener('click',function(){var q2=++seq,im=new Image();im.onload=function(){if(q2!==seq)return;setImg(im);say(tx('اضغط حفظ عشان تثبّتها','Press Save to apply'),1);[].forEach.call(g.children,function(c){c.classList.remove('on')});b.classList.add('on')};im.src=u});g.appendChild(b)});
})();
/* covers */
(function(){var host=document.querySelector('.pa-cv');if(!host)return;var en=document.documentElement.lang==='en';
var FL=function(s,a,b){return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24"><path fill="'+(a||'#42a5f5')+'" d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357z"/><path fill="'+(b||'#0d47a1')+'" d="M14.328 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46z"/></svg>'};
var DA=function(s){return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24"><path fill="#02569b" d="M4.1 9.6L9.6 4.1l8.2 8.2-3.9 3.9z"/><path fill="#0175c2" d="M9.6 4.1l9.8.1.1 9.6-5.7 5.7-3.4-3.4L4.1 9.6z"/><path fill="#55ddca" d="M9.6 4.1h9.8l-4.9 4.9z" opacity=".9"/><path fill="#02569b" d="M13.9 16.2l5.6-5.6v8.7z" opacity=".6"/></svg>'};
var DS=function(s){return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 120 120"><ellipse cx="62" cy="74" rx="38" ry="30" fill="#29b6f6"/><path d="M30 60c-18-4-22-24-14-34 6 12 18 14 28 14z" fill="#0288d1"/><circle cx="86" cy="52" r="24" fill="#4fc3f7"/><path d="M104 50l16 6-16 8z" fill="#ffca28"/><circle cx="90" cy="48" r="7" fill="#fff"/><circle cx="92" cy="48" r="3.4" fill="#0b2a3a"/><path d="M52 70c10-14 28-14 36-4-8 16-26 20-36 4z" fill="#0288d1"/><path d="M44 100l-6 14m22-14l-2 14" stroke="#ffca28" stroke-width="4" stroke-linecap="round"/><path d="M80 30c2-10 8-14 12-14-2 6-4 10-6 14z" fill="#0288d1"/></svg>'};
var UI=function(a,b,c){return '<i class="hd" style="background:'+a+'"></i><i class="cd" style="background:'+b+';top:70px"></i><i class="cd" style="background:'+c+';top:112px;height:30px"></i><i class="bt" style="background:'+a+'"></i>'};
var dots=function(cols){return cols.map(function(c,i){return '<span class="cvdot" style="background:'+c+';width:'+(10+i*5)+'px;height:'+(10+i*5)+'px;left:'+(30+i*93)+'px;top:'+(24+(i%3)*72)+'px"></span>'}).join('')};
var ph=function(l,t,rot,a,b,c,m,z){return '<div class="cvph'+(m?' cvm':'')+'" style="left:'+l+'px;top:'+t+'px;'+(rot?'transform:rotate('+rot+'deg);':'')+(z?'z-index:2;':'')+'">'+UI(a,b,c)+'</div>'};
var lg=function(l,t,s,r){return '<div class="cva cvm cvlf" style="left:'+l+'px;top:'+t+'px;'+(r?'transform:rotate('+r+'deg)':'')+'">'+FL(s)+'</div>'};
var ld=function(l,t,s,r){return '<div class="cva cvm cvld" style="left:'+l+'px;top:'+t+'px;'+(r?'transform:rotate('+r+'deg)':'')+'">'+DA(s)+'</div>'};
var tx=function(a,b,c){return '<div class="cvt"><small'+(c?' style="color:'+c+'"':'')+'>'+a+'</small><b>'+b+'</b></div>'};
var C=[
 {k:'cvg3',h:'<div class="cva cvm cvlf" style="left:30px;top:20px">'+FL(54,'#fff','#bae6fd')+'</div>'+ld(100,28,50)+ph(40,70,-12,'#f43f5e','#fde68a','#a5f3fc')+ph(150,36,0,'#22d3ee','#fbcfe8','#fde68a',0,1)+ph(262,70,12,'#a855f7','#bbf7d0','#fecaca',1)+'<div class="cva cvm" style="left:386px;top:80px;transform:rotate(8deg)">'+DS(88)+'</div>'+dots(['#fde047','#fff','#34d399'])+tx('BUILD REAL APPS','Developer')},
 {k:'cvg1',h:'<div class="cva cvbig" style="left:-24px;top:-30px;opacity:.22">'+FL(300,'#fff','#fff')+'</div>'+dots(['#fde047','#fff','#34d399','#fb7185','#fde047'])+ph(70,46,-8,'#0ea5e9','#fde68a','#fbcfe8')+ph(190,30,6,'#d946ef','#a5f3fc','#bbf7d0',1)+lg(320,34,64)+ld(330,150,58)+'<div class="cva cvm" style="left:410px;top:90px;transform:rotate(-6deg)">'+DS(96)+'</div>'+tx('FLUTTER · DART','Keep Building')},
 {k:'cvg2',h:'<div class="cva" style="left:20px;top:56px">'+DS(170)+'</div>'+dots(['#0ea5e9','#fff','#a855f7','#22d3ee','#fff'])+lg(210,30,80,-10)+ld(300,128,76,8)+'<div class="cva cvm cvcode" style="left:376px;top:44px">runApp(<span>MyApp</span>());</div>'+tx('MOBILE APP A TO Z','Code. Run. Repeat.','#3b0764')},
 {k:'cvg4',h:'<div class="cva cvbig" style="left:240px;top:-20px;opacity:.18">'+DA(300)+'</div>'+dots(['#fff','#fde047','#0ea5e9','#fff'])+ph(50,52,-6,'#10b981','#fef3c7','#bae6fd')+ph(170,34,8,'#0ea5e9','#d1fae5','#fde68a',1)+lg(300,26,60,8)+ld(310,140,60,-8)+tx('ONE APP AT A TIME','Stay Curious')},
 {k:'cvg5',h:'<div class="cva cvbig" style="left:60px;top:-40px;opacity:.28">'+FL(320,'#c084fc','#7e22ce')+'</div>'+dots(['#f0abfc','#22d3ee','#fff','#fde047'])+ph(80,40,-10,'#a855f7','#e9d5ff','#fecdd3')+ph(210,56,10,'#22d3ee','#fbcfe8','#ddd6fe',1)+ld(340,36,64,-8)+'<div class="cva cvm" style="left:350px;top:110px;transform:rotate(6deg)">'+DS(100)+'</div>'+tx('LEVEL UP','Ship It')},
 {k:'cvg6',h:'<div class="cva" style="left:24px;top:60px">'+DS(150)+'</div>'+dots(['#fff','#f43f5e','#fde047','#fff'])+ph(210,40,8,'#f59e0b','#fde68a','#bfdbfe')+ph(320,64,-8,'#2563eb','#bbf7d0','#fbcfe8',1)+lg(180,10,56,-12)+ld(440,40,52,10)+tx('NEVER STOP','Learning','#1e3a8a')},
 {k:'cvown',h:''}
];
var ST='.cvg1{background:linear-gradient(120deg,#0ea5e9,#6366f1 55%,#d946ef)}.cvg2{background:linear-gradient(135deg,#fde047,#fb923c 40%,#ec4899)}.cvg3{background:radial-gradient(70% 120% at 20% 20%,#22d3ee,transparent 60%),radial-gradient(70% 120% at 90% 90%,#f43f5e,transparent 60%),#4f46e5}.cvg4{background:linear-gradient(130deg,#06b6d4,#10b981 55%,#a3e635)}.cvg5{background:radial-gradient(60% 120% at 80% 0%,#d946ef,transparent 60%),radial-gradient(60% 120% at 10% 100%,#2563eb,transparent 60%),#1e1b4b}.cvg6{background:linear-gradient(135deg,#38bdf8,#818cf8 50%,#facc15)}';
var s=document.createElement('style');s.textContent=ST;document.head.appendChild(s);window.__cvr=function(h,i){i=C[i]?i:0;h.className='pa-cv cvh '+C[i].k;h.innerHTML=C[i].h;h.dataset.cv=i};if(host.hasAttribute('data-pub'))return;
function uid(){return window.__user&&window.__user.uid}
function cur(){var u=uid();if(!u)return 0;var v=parseInt(localStorage.getItem('cover_'+u),10);if(u===window.__OWNER)return 6;return v>=0&&v<6?v:0}
function paintC(){host.className='pa-cv cvh '+C[cur()].k;host.innerHTML=C[cur()].h;host.dataset.cv=cur();var pv=document.querySelector('.pa-pv');if(pv)pv.dataset.cv=cur();var b=document.createElement('button');b.type='button';b.className='cvchg';b.id='cvchg';b.textContent=en?'Change cover':'تغيير الغلاف';b.onclick=openG;host.appendChild(b)}
var md=document.getElementById('cvmodal'),gr=document.getElementById('cvgrid');
function openG(){if(!md||!gr)return;gr.innerHTML='';C.forEach(function(c,i){if(i===6)return;var b=document.createElement('button');b.type='button';b.className='cvth'+(i===cur()?' on':'');b.setAttribute('aria-label','cover '+(i+1));b.innerHTML='<div class="cvsc"><div class="cvh '+c.k+'" style="width:760px;height:250px">'+c.h+'</div></div>';b.onclick=function(){var u=uid();if(!u)return;try{localStorage.setItem('cover_'+u,i)}catch(_){}paintC();md.hidden=true;if(window.__sync)window.__sync({cover:i}).catch(function(){})};gr.appendChild(b)});md.hidden=false;[].forEach.call(gr.querySelectorAll('.cvsc'),function(e){e.style.setProperty('--k',(e.clientWidth/760).toFixed(4))})}
if(md){document.getElementById('cvx').onclick=function(){md.hidden=true};md.addEventListener('mousedown',function(e){if(e.target===md)md.hidden=true});document.addEventListener('keydown',function(e){if(e.key==='Escape')md.hidden=true})}
document.addEventListener('authchange',function(){if(uid())paintC()});if(uid())paintC();
})();



/* settings tabs, privacy, data */
(function(){var nav=document.getElementById('stnav');if(!nav)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
var bs=[].slice.call(nav.querySelectorAll('button')),ps=[].slice.call(document.querySelectorAll('.stp'));
function show(t){if(!bs.some(function(b){return b.dataset.t===t}))t='profile';bs.forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});ps.forEach(function(p){p.hidden=p.dataset.p!==t});try{history.replaceState(null,'','#'+t)}catch(_){}}
bs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t)})});show((location.hash||'').slice(1));
function g(i){return document.getElementById(i)}
function paint(){var u=window.__user;g('stout1').hidden=!!u;var e=g('stemail');if(e)e.textContent=u?(u.email||'—'):'—';var v=g('stvf');if(v){v.textContent=u?(u.emailVerified?tx('متحقق منه','Verified'):tx('مش متحقق منه','Not verified')):'';v.className='amsg'+(u&&u.emailVerified?' ok':'')}
 var p=g('stprov');if(p&&window.__prov)p.textContent=(u?window.__prov():[]).map(function(x){return x==='google.com'?'Google':tx('إيميل وباسورد','Email and password')}).join(' + ')||'—';
 var pu=g('stpub');if(pu&&u)pu.href='/u/#'+u.uid;var pv=g('pv1');if(pv&&u){pv.checked=localStorage.getItem('priv_'+u.uid)!=='0'}}
document.addEventListener('authchange',paint);paint();
var pv=g('pv1');if(pv)pv.addEventListener('change',function(){var u=window.__user,m=g('pvmsg');if(!u){pv.checked=true;m.textContent=tx('سجّل دخولك الأول','Sign in first');m.className='amsg e';return}
 try{localStorage.setItem('priv_'+u.uid,pv.checked?'1':'0')}catch(_){}(window.__sync?window.__sync({priv:pv.checked}):Promise.reject()).then(function(){m.textContent=pv.checked?tx('ظهرت في الترتيب','You are on the leaderboard'):tx('اختفيت من الترتيب','You are hidden from the leaderboard');m.className='amsg ok'}).catch(function(){m.textContent=tx('مقدرناش نحفظ، جرّب تاني','Could not save, try again');m.className='amsg e'})});
var dl=g('stdl');if(dl)dl.addEventListener('click',function(){var u=window.__user;if(!u)return;function j(k,d){try{return JSON.parse(localStorage.getItem(k+'')||'null')||d}catch(_){return d}}
 var o={exported:new Date().toISOString(),name:u.displayName||'',email:u.email||'',progress:j('progress_v1',[]),attempts:j('attempts_v1',{}),start:j('start_v1',{}),cover:localStorage.getItem('cover_'+u.uid),showOnLeaderboard:localStorage.getItem('priv_'+u.uid)!=='0',notifications:{lessons:localStorage.getItem('notif_nt1')==='1',tasks:localStorage.getItem('notif_nt2')==='1'}};
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download='my-data.json';document.body.appendChild(a);a.click();a.remove()})
})();
/* shared: medals, top-10, avatar thumbnail */
(function(){var B='https://www.gstatic.com/firebasejs/10.14.1/',cfg=window.FIREBASE_CONFIG,en0=document.documentElement.lang==='en';
window.__badge=function(n){var g=n<=3,c=[['#fde047','#ca8a04','#ef4444'],['#f3f4f6','#9ca3af','#3b82f6'],['#fdba74','#c2410c','#22c55e']][n-1]||['#5eead4','#0f766e','#6366f1'];
 return '<span class="mdl'+(g?' mg':' mt')+'" title="'+(en0?'Top ':'ضمن أفضل ')+(g?n:10)+'"><svg viewBox="0 0 32 42" aria-hidden="true"><path d="M8 0h7l4 15h-8zM24 0h-7l-4 15h8z" fill="'+c[2]+'"/>'+(g?'<circle cx="16" cy="28" r="13" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.5"/><circle cx="16" cy="28" r="8.6" fill="none" stroke="'+c[1]+'" stroke-width="1.2" opacity=".6"/>':'<path d="M16 15l11 4v8c0 7-5 11-11 14C10 38 5 34 5 27v-8z" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.2"/>')+'<text x="16" y="'+(g?'33':'31')+'" text-anchor="middle" font-size="'+(g?15:13)+'" font-weight="900" fill="#2b1d05" font-family="sans-serif">'+n+'</text></svg></span>'};
var dbp=null;window.__db=function(){if(!cfg)return Promise.reject();return dbp||(dbp=Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]).then(function(m){var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg);return{F:m[1],db:m[1].getFirestore(app)}}))};
var tp=null;window.__top=function(){return tp||(tp=window.__db().then(function(x){return x.F.getDocs(x.F.query(x.F.collection(x.db,'leaderboard'),x.F.orderBy('points','desc'),x.F.limit(10)))}).then(function(s){var r=[];s.forEach(function(d){var v=d.data();if(v&&v.points>0&&d.id!==window.__OWNER)r.push(d.id)});return r}))};
window.__thumb=function(){return new Promise(function(ok){var u=window.__user,src=(window.__av&&window.__av())||(u&&u.photoURL);if(!src)return ok('');var im=new Image();im.onload=function(){try{var c=document.createElement('canvas');c.width=c.height=96;var x=c.getContext('2d'),s=Math.min(im.width,im.height);x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,96,96);var d=c.toDataURL('image/jpeg',.72);ok(d.length<11000?d:'')}catch(_){ok('')}};im.onerror=function(){ok('')};setTimeout(function(){ok('')},4000);im.src=src})};
/* own profile badge */
var pb=document.getElementById('pfbdg');if(pb){function pf(){var u=window.__user;if(!u||u.uid===window.__OWNER){pb.innerHTML='';return}window.__top().then(function(t){var i=t.indexOf(u.uid);pb.innerHTML=i<0?'':window.__badge(i+1)+'<b>'+(en0?'Rank #'+(i+1)+' on the leaderboard':'المركز '+(i+1)+' في الترتيب')+'</b>'}).catch(function(){})}document.addEventListener('authchange',function(){tp=null;pf()});pf()}
/* public profile */
var pm=document.getElementById('pubmain');if(pm){var id=(location.hash||'').slice(1),msg=document.getElementById('pumsg'),g=function(i){return document.getElementById(i)};
 function nf(t){msg.textContent=t;g('pubin').hidden=true;msg.hidden=false}
 if(!id)nf(en0?'No user selected.':'مفيش مستخدم متحدد.');else window.__db().then(function(x){return x.F.getDoc(x.F.doc(x.db,'leaderboard',id))}).then(function(d){if(!d.exists()){nf(en0?'This user is not on the leaderboard.':'المستخدم ده مش في الترتيب.');return}var v=d.data(),n=String(v.name||'—'),pts=v.points||0,ls=v.lessons||0,tot=(window.SEARCH||[]).length||1;
  g('pubin').hidden=false;msg.hidden=true;window.__cvr(g('pucv'),id===window.__OWNER?6:(typeof v.cv==='number'&&v.cv<6?v.cv:0));pm.dataset.cv=id===window.__OWNER?6:(typeof v.cv==='number'&&v.cv<6?v.cv:0);
  var pn=window.__safeName(id,n);g('puname').innerHTML=window.__who(id,n)+(id===window.__OWNER?'<small class="ptl">Software Engineer</small>':'');document.title=pn+' | Mobile App A to Z';if(id===window.__OWNER)pm.dataset.owner='1';n=pn;var av=g('puav');if(v.av&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(v.av))av.innerHTML='<img alt="" src="'+v.av+'" style="width:100%;height:100%;border-radius:inherit;object-fit:cover">';else av.textContent=n.trim().charAt(0).toUpperCase();
  g('pulv').textContent=(en0?'Level ':'المستوى ')+(1+Math.floor(pts/20));if(id===window.__OWNER){g('pulv').style.display='none';g('pubin').classList.add('pfowner');g('ownsec2').hidden=false}g('pupts').textContent=pts;g('pulsn').textContent=ls+'/'+tot;var pc=Math.min(100,Math.round(100*ls/tot));g('pubar').style.width=pc+'%';g('puring').style.setProperty('--p',pc);g('pucount').textContent=ls;
  window.__top().then(function(t){var i=t.indexOf(id);if(i>=0)g('pubdg').innerHTML=window.__badge(i+1)+'<b>'+(en0?'Rank #'+(i+1):'المركز '+(i+1))+'</b>'}).catch(function(){})}).catch(function(){nf(en0?'Could not load this profile.':'مقدرناش نحمّل البروفايل.')})}
})();
/* leaderboard page */
(function(){var box=document.getElementById('lbbox');if(!box)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
var rows=null,all=null,B='https://www.gstatic.com/firebasejs/10.14.1/',cfg=window.FIREBASE_CONFIG;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var COL=['#2fd3c6','#8b5cf6','#fb923c','#3b82f6','#f472b6','#22c55e','#facc15','#ef4444'];
function col(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return COL[h%COL.length]}
function ava(r){return r.av&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(r.av)?'<img alt="" src="'+r.av+'">':esc((r.name||'?').trim().charAt(0).toUpperCase())}
function row(r,i,me){var lv=1+Math.floor(r.points/20);return '<li tabindex="0" data-id="'+r.id+'" class="lbr'+(me?' me':'')+(i<3?' top'+(i+1):'')+'"><span class="lbn">'+(i<3?['🥇','🥈','🥉'][i]:i+1)+'</span><span class="lba" style="background:'+col(r.id)+'">'+ava(r)+'</span><span class="lbm"><b>'+window.__who(r.id,r.name)+(i<10&&r.points>0?window.__badge(i+1):'')+(me?' <em>'+tx('(أنت)','(you)')+'</em>':'')+'</b><small>'+tx('المستوى ','Level ')+lv+' · '+r.lessons+' '+tx('درس','lessons')+'</small></span><span class="lbp">'+r.points+'<small>'+tx('نقطة','pts')+'</small></span></li>'}
function paint(){if(!rows)return;var u=window.__user&&window.__user.uid;if(!rows.length){box.innerHTML='<p class="soon">'+tx('لسه مفيش حد في الترتيب. أول واحد يكمّل درس هيظهر هنا.','Nobody is on the board yet. The first person to finish a lesson shows up here.')+'</p>';return}
 var me=rows.findIndex(function(r){return r.id===u});function slot(r,i){var cls=['g','s','z'][i],h=[150,112,86][i];if(!r)return '<div class="pdc pd'+cls+' pde"><span class="pda"></span><b>'+tx('مكان فاضي','Open spot')+'</b><i>—</i><div class="pdb" style="height:'+h+'px"><span>'+(i+1)+'</span></div></div>';return '<div tabindex="0" data-id="'+r.id+'" class="pdc pd'+cls+(r.id===u?' me':'')+'"><span class="pdw"><span class="pda" style="background:'+col(r.id)+'">'+ava(r)+'</span>'+(r.points>0?window.__badge(i+1):'')+'</span><b>'+window.__who(r.id,r.name)+(r.id===u?' <em>'+tx('(أنت)','(you)')+'</em>':'')+'</b><i>'+r.points+' '+tx('نقطة','pts')+'</i><div class="pdb" style="height:'+h+'px"><span>'+(i+1)+'</span></div></div>'}
 var h='<div class="lbpod">'+slot(rows[1],1)+slot(rows[0],0)+slot(rows[2],2)+'</div>';if(rows.length>3)h+='<ol class="lbl" start="4">'+rows.slice(3).map(function(r,i){return row(r,i+3,r.id===u)}).join('')+'</ol>';
 if(u&&me<0)h+='<p class="soon">'+tx('كمّل درس عشان تظهر في الترتيب.','Finish a lesson to appear on the board.')+'</p>';if(!u)h+='<p class="soon">'+tx('سجّل دخولك وكمّل دروس عشان تظهر هنا.','Sign in and finish lessons to appear here.')+'</p>';box.innerHTML=h}
if(!cfg){box.innerHTML='<p class="soon">'+tx('الترتيب مش متاح دلوقتي.','The leaderboard is not available right now.')+'</p>';return}
Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js')]).then(function(m){var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg),F=m[1],db=F.getFirestore(app);
 return F.getDocs(F.query(F.collection(db,'leaderboard'),F.orderBy('points','desc'),F.limit(50)))}).then(function(s){rows=[];s.forEach(function(d){var v=d.data();if(v&&typeof v.points==='number'&&d.id!==window.__OWNER)rows.push({id:d.id,name:v.name,points:v.points,lessons:v.lessons||0,av:(typeof v.av==='string'&&v.av.indexOf('data:image/jpeg;base64,')===0)?v.av:''})});all=rows;paint()}).catch(function(){box.innerHTML='<p class="soon">'+tx('مقدرناش نحمّل الترتيب. جرّب تاني.','Could not load the leaderboard. Try again.')+'</p>'});
var tabs=document.getElementById('lbtabs');if(tabs)tabs.addEventListener('click',function(e){var b=e.target.closest('button[data-w]');if(!b)return;[].forEach.call(tabs.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});if(b.dataset.w==='0'){rows=all;paint();return}fetch('/api/weekly').then(function(r){return r.ok?r.json():null}).then(function(j){if(!j)throw 0;rows=j.rows.map(function(r){return{id:r.id,name:r.name,points:r.points,lessons:r.lessons,av:r.av}});if(!rows.length){box.innerHTML='<p class="soon">'+tx('لسه محدش كسب نقاط الأسبوع ده.','Nobody has earned points this week yet.')+'</p>';return}paint()}).catch(function(){box.innerHTML='<p class="soon">'+tx('مقدرناش نحمّل دوري الأسبوع.','Could not load the weekly league.')+'</p>'})});
function go(e){var t=e.target.closest&&e.target.closest('[data-id]');if(t&&box.contains(t)&&(e.type==='click'||e.key==='Enter'))location.href='/u/#'+t.getAttribute('data-id')}box.addEventListener('click',go);box.addEventListener('keydown',go);window.__lbPrev=function(r){rows=r;paint()};document.addEventListener('authchange',paint)})();

(function(){var f=document.getElementById('ytp');if(!f)return;var n=+f.dataset.n,en=document.documentElement.lang==='en',bx=document.getElementById('wprog'),bi=document.getElementById('wbi'),tx=document.getElementById('wtx');
function T(x,y){return en?y:x}
var pend=0,played=0,lastT=null,st=-1,pl=null,busy=false,done=false,pct=0,loaded=false;
function show(){bx.hidden=false;bi.style.width=pct+'%';tx.textContent=done?T('✓ اتحسبت 10 نقاط للدرس ده','✓ 10 points earned for this lesson'):(window.__user?T('نسبة المشاهدة الفعلية: ','Real watch progress: ')+pct+'%'+T(' (محتاج 90% عشان تاخد 10 نقاط)',' (90% earns 10 points)'):T('سجّل دخولك وشاهد 90% من الدرس عشان تاخد 10 نقاط.','Sign in and watch 90% of the lesson to earn 10 points.'))}
function beat(){if(busy||done||!window.__user||!window.__idToken)return;if(!loaded){}var d=pend;busy=true;window.__idToken().then(function(tok){return fetch('/api/watch',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({lesson:n,delta:d})})}).then(function(r){return r.ok?r.json():null}).then(function(j){busy=false;if(!j)return;loaded=true;pend=Math.max(0,pend-d);pct=j.pct;if(j.done&&!done){done=true;window.__setStp&&window.__setStp(window.__user.uid,j.total);window.__lb&&window.__lb()}show()}).catch(function(){busy=false})}
function tick(){if(!pl||!pl.getPlayerState)return;var s=pl.getPlayerState();if(s===1){var t=pl.getCurrentTime();if(lastT!==null){var dt=t-lastT;if(dt>0&&dt<=2.5){played+=dt;pend+=dt}}lastT=t}else{lastT=null}st=s}
function boot(){pl=new YT.Player(f,{events:{onStateChange:function(e){lastT=null}}});setInterval(tick,1000);setInterval(function(){if(pend>=1)beat()},10000);var w=setInterval(function(){if(window.__user){clearInterval(w);beat()}},1500);show();document.addEventListener('visibilitychange',function(){if(document.hidden&&pend>=1)beat()})}
if(window.YT&&window.YT.Player)boot();else{window.onYouTubeIframeAPIReady=boot;var s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)}
})();

/* chatbot + report a problem */
(function(){
var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
var btn=document.createElement('button');btn.type='button';btn.id='cbfab';btn.className='cb-fab';btn.setAttribute('aria-label',tx('مساعد الكورس','Course helper'));btn.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg><span class="cb-lb">'+tx('اسأل المساعد','Ask the helper')+'</span>';
var box=document.createElement('section');box.id='cbbox';box.className='cb-box';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label',tx('مساعد الكورس','Course helper'));
box.innerHTML='<header class="cb-h"><b>'+tx('مساعد الكورس','Course helper')+'</b><span class="cb-hb"><button type="button" class="cb-rp" id="cbrp">'+tx('بلّغ عن مشكلة','Report a problem')+'</button><button type="button" class="cb-x" id="cbx" aria-label="'+tx('إغلاق','Close')+'">×</button></span></header><div class="cb-log" id="cblog" aria-live="polite"></div><form class="cb-f" id="cbf"><input class="fld" id="cbq" maxlength="600" autocomplete="off" placeholder="'+tx('اسأل عن الدروس أو الكود...','Ask about the lessons or code...')+'"><button class="btn" type="submit" id="cbs">'+tx('ابعت','Send')+'</button></form><form class="cb-rf" id="cbrf" hidden><textarea class="fld" id="cbrt" rows="4" maxlength="1500" placeholder="'+tx('اوصف المشكلة...','Describe the problem...')+'"></textarea><div class="cb-rr"><button class="btn" type="submit">'+tx('ابعت البلاغ','Send report')+'</button><button class="btn ghost" type="button" id="cbrc">'+tx('رجوع','Back')+'</button></div><p class="cm-note" id="cbrm"></p></form>';
document.body.appendChild(btn);document.body.appendChild(box);
var log=box.querySelector('#cblog'),q=box.querySelector('#cbq'),f=box.querySelector('#cbf'),rf=box.querySelector('#cbrf'),msgs=[],loaded=null,busy=false;
function add(r,t,cls){var d=document.createElement('div');d.className='cb-m '+(r==='u'?'u':'b')+(cls?' '+cls:'');if(r==='u'||cls==='w'){d.textContent=t}else{t.split('```').forEach(function(sg,i){if(i%2){var pr=document.createElement('pre');pr.className='cb-pre';pr.dir='ltr';var c=document.createElement('code');c.textContent=sg.replace(/^[a-zA-Z]*\n/,'').replace(/\n$/,'');pr.appendChild(c);d.appendChild(pr)}else if(sg.trim()){var sp=document.createElement('div');sp.textContent=sg.replace(/\*\*/g,'').replace(/`/g,'').trim();d.appendChild(sp)}})}log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function welcome(){add('b',tx('أهلاً! أنا مساعد الكورس. اسألني عن أي حاجة في الدروس أو الأكواد، وأجاوب من مادة الكورس بس.','Hi! I am the course helper. Ask me about the lessons or code. I answer only from the course material.'),'w')}
function paint(){log.innerHTML='';welcome();msgs.forEach(function(m){add(m.r,m.t)})}
function load(){var u=window.__user;var key=u?u.uid:'guest';if(loaded===key)return;loaded=key;msgs=[];paint();if(u&&window.__idToken){window.__idToken().then(function(t){return fetch('/api/ask',{headers:{authorization:'Bearer '+t}})}).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.m&&loaded===key&&!msgs.length){msgs=j.m;paint()}}).catch(function(){})}}
function open(){box.hidden=false;btn.hidden=true;load();setTimeout(function(){q.focus()},50)}
function close(){box.hidden=true;btn.hidden=false}
btn.addEventListener('click',open);box.querySelector('#cbx').addEventListener('click',close);
document.addEventListener('authchange',function(){loaded=null;if(!box.hidden)load()});
f.addEventListener('submit',function(e){e.preventDefault();var v=q.value.trim();if(!v||busy)return;busy=true;q.value='';add('u',v);var h=msgs.slice(-8);msgs.push({r:'u',t:v});var w=add('b',tx('بيكتب...','Typing...'),'w');
(window.__user&&window.__idToken?window.__idToken():Promise.resolve('')).then(function(t){var hd={'content-type':'application/json'};if(t)hd.authorization='Bearer '+t;return fetch('/api/ask',{method:'POST',headers:hd,body:JSON.stringify({q:v,history:h})})}).then(function(r){if(r.status===429)throw 'rate';if(!r.ok)throw 'err';return r.json()}).then(function(j){w.remove();msgs.push({r:'b',t:j.a});add('b',j.a)}).catch(function(e){w.textContent=e==='rate'?tx('كتير أوي، جرّب بعد شوية.','Too many requests, try again later.'):tx('مقدرتش أرد دلوقتي، جرّب تاني.','I could not answer now, try again.');msgs.pop()}).then(function(){busy=false})});
box.querySelector('#cbrp').addEventListener('click',function(){f.hidden=true;log.hidden=true;rf.hidden=false;box.querySelector('#cbrt').focus()});
box.querySelector('#cbrc').addEventListener('click',function(){rf.hidden=true;f.hidden=false;log.hidden=false});
rf.addEventListener('submit',function(e){e.preventDefault();var t=box.querySelector('#cbrt').value.trim(),m=box.querySelector('#cbrm');if(t.length<5){m.textContent=tx('اكتب تفاصيل أكتر شوية.','Please add a few more details.');return}m.textContent=tx('بيتبعت...','Sending...');
(window.__user&&window.__idToken?window.__idToken():Promise.resolve('')).then(function(tk){var hd={'content-type':'application/json'};if(tk)hd.authorization='Bearer '+tk;return fetch('/api/report',{method:'POST',headers:hd,body:JSON.stringify({text:t,url:location.href,device:navigator.userAgent+' | '+innerWidth+'x'+innerHeight})})}).then(function(r){if(r.status===429)throw 'rate';if(!r.ok)throw 'err';box.querySelector('#cbrt').value='';m.textContent=tx('وصلنا البلاغ، شكرًا!','Report received, thank you!')}).catch(function(e){m.textContent=e==='rate'?tx('بلاغات كتير، جرّب بعد شوية.','Too many reports, try later.'):tx('مقدرناش نبعت، جرّب تاني.','Could not send, try again.')})});
/* settings: delete my chats */
var pv=document.getElementById('pv1');if(pv){var row=pv.closest('.srow');if(row){var d=document.createElement('div');d.className='srow';d.innerHTML='<div><b>'+tx('محادثات المساعد','Helper chats')+'</b><p class="cm-note">'+tx('محادثاتك محفوظة على حسابك وخاصة بيك. تقدر تمسحها في أي وقت.','Your chats are saved to your account and private. You can delete them any time.')+'</p></div><button type="button" class="btn ghost" id="cbdel">'+tx('امسح محادثاتي','Delete my chats')+'</button>';row.parentNode.insertBefore(d,row.nextSibling);var m=document.createElement('p');m.className='cm-note';m.id='cbdm';d.parentNode.insertBefore(m,d.nextSibling);d.querySelector('#cbdel').addEventListener('click',function(){var u=window.__user;if(!u){m.textContent=tx('سجّل دخولك الأول','Sign in first');return}if(!confirm(tx('تمسح كل محادثاتك مع المساعد؟','Delete all your helper chats?')))return;window.__idToken().then(function(t){return fetch('/api/ask',{method:'DELETE',headers:{authorization:'Bearer '+t}})}).then(function(r){if(!r.ok)throw 0;msgs=[];loaded=null;m.textContent=tx('اتمسحت.','Deleted.')}).catch(function(){m.textContent=tx('مقدرناش نمسح، جرّب تاني.','Could not delete, try again.')})})}}
})();

/* streak + continue where you left off (synced to the account when signed in) */
(function(){
var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function dayStr(ms){try{return new Date(ms).toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'})}catch(_){return new Date(ms).toISOString().slice(0,10)}}
function today(){return dayStr(Date.now())}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function prev(d){return new Date(Date.parse(d+'T12:00:00Z')-864e5).toISOString().slice(0,10)}
var FL='<svg class="cont-fl" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#ff9d2e" d="M12 2c1 3.5-1 5-2.5 7C8 11 7 12.5 7 15a5 5 0 0 0 10 0c0-2-1-3.5-2-4.5-.3 1.2-.9 2-1.8 2.3C13.6 9.6 13.5 5 12 2z"/><path fill="#ffd36b" d="M12 22a3 3 0 0 1-3-3c0-1.6 1.2-2.4 2-3.6.4 1 1 1.3 1.6 2 .6.7 1.4 1.4 1.4 2.6a3 3 0 0 1-2 2z"/></svg>';
var st=ld('streak_v1',{last:'',n:0,best:0}),ll=ld('lastlesson_v2',{n:parseInt(localStorage.getItem('lastlesson'),10)||0,t:0});
function push(){if(window.__user&&window.__sync)window.__sync({streak:st,lastLesson:ll}).catch(function(){})}
var m=location.pathname.match(/\/lesson-(\d+)\/?$/);
if(m){var t=today();if(st.last!==t){st={last:t,n:st.last===prev(t)?st.n+1:1,best:st.best||0};st.best=Math.max(st.best,st.n);sv('streak_v1',st);try{sessionStorage.setItem('streak_up','1')}catch(_){}}ll={n:+m[1],t:Date.now()};sv('lastlesson_v2',ll);try{localStorage.setItem('lastlesson',m[1])}catch(_){}push()}
var p=location.pathname.replace(/index\.html$/,'');
var show=(p==='/'||p==='/lessons/'||p==='/en/'||p==='/en/lessons/');
var bar=null;
function render(){
 if(!show)return;
 var t2=today(),live=st.last===t2||st.last===prev(t2)?st.n:0,go=ll.n|0;
 if(bar){bar.remove();bar=null}
 if(!go&&!live)return;
 var nums=[].map.call(document.querySelectorAll('a[href*="lesson-"]:not(.cont-go)'),function(a){var x=a.getAttribute('href').match(/lesson-(\d+)/);return x?+x[1]:0}).filter(Boolean);
 var mx=nums.length?Math.max.apply(null,nums):go,done=ld('progress_v1',[]);
 if(go&&done.indexOf(go)>=0&&go<mx)go=go+1;
 var base=location.pathname.indexOf('/en/')===0?'/en':'';
 bar=document.createElement('div');bar.className='cont-bar';
 var h='';if(live)h+='<span class="cont-st" title="'+tx('أيام متتالية','Day streak')+'">'+FL+'<b>'+live+'</b> '+tx(live===1?'يوم':live<11?'أيام':'يوم',live===1?'day':'days')+'</span>';
 if(go)h+='<a class="btn cont-go" href="'+base+'/lesson-'+go+'/">'+tx('كمّل من حيث وقفت: الدرس ','Continue where you left off: Lesson ')+go+'</a>';
 var up=false;try{up=sessionStorage.getItem('streak_up')==='1';if(up)sessionStorage.removeItem('streak_up')}catch(_){}if(up&&live)h=h.replace('class="cont-st"','class="cont-st pop"').replace('</b>','</b><i class="sp"></i><i class="sp"></i><i class="sp"></i><i class="sp"></i><i class="sp"></i><i class="sp"></i>');bar.innerHTML=h;var fl=bar.querySelector('.cont-st');if(fl)fl.addEventListener('click',function(){fl.classList.remove('tap');void fl.offsetWidth;fl.classList.add('tap')});var host=document.querySelector('main')||document.body;host.insertBefore(bar,host.firstChild)}
window.__userLoad=function(d){var ch=false;var r=d&&d.streak;if(r&&r.last&&(r.last>st.last||(r.last===st.last&&r.n>st.n))){st={last:String(r.last),n:r.n|0,best:Math.max(r.best|0,st.best|0)};ch=true}else if(r&&(r.best|0)>(st.best|0)){st.best=r.best|0;ch=true}
 var q=d&&d.lastLesson;if(q&&q.n&&(q.t|0)>(ll.t|0)){ll={n:q.n|0,t:q.t|0};ch=true}
 if(ch){sv('streak_v1',st);sv('lastlesson_v2',ll)}
 var need=!r||r.last!==st.last||r.n!==st.n||!q||q.n!==ll.n;if(need&&(st.last||ll.n))push();render()};
render();
})();

/* dev activity panel (real data from /api/activity + leaderboard) */
(function(){
var box=document.getElementById('hmbox');if(!box)return;
var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var RK=[[1,'Intern'],[3,'Junior'],[6,'Mid Developer'],[10,'Senior'],[15,'Lead'],[20,'Architect']];
function rank(l){var r=RK[0][1];for(var i=0;i<RK.length;i++)if(l>=RK[i][0])r=RK[i][1];return r}
function nextRk(l){for(var i=0;i<RK.length;i++)if(RK[i][0]>l)return RK[i];return null}
function ck(){return '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" stroke="#0a1020" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
function segs(n,on,h,hi){var s='';for(var i=0;i<n;i++)s+='<s class="'+(i<on?'on':(hi&&i===on?'hi':''))+'"'+(h?' style="height:'+h+'px"':'')+'></s>';return s}
var uid=null,ctx={pts:null,name:'',top:null};
function render(j){
 var pts=ctx.pts==null?0:ctx.pts,lv=1+Math.floor(pts/20),rk=rank(lv),nx=nextRk(lv),inl=pts%20;
 var td=j.days[j.today]||{w:0,t:0,s:0},today=new Date(j.today+'T12:00:00Z'),dow=(today.getUTCDay()+1)%7;
 var Q=[['#101','feat: watch a lesson (5 min)',tx('شاهد 5 دقايق من أي درس','Watch 5 minutes of any lesson'),Math.min(1,td.w/300),Math.min(5,Math.floor(td.w/60))+'/5 min','q101'],
  ['#102','fix: solve a task, score >= 7',tx('حل تاسك بدرجة 7 أو أكتر','Solve a task with score 7 or more'),Math.min(1,td.s/1),Math.min(1,td.s)+'/1','q102'],
  ['#103','chore: keep the streak alive',tx('اعمل أي نشاط النهارده','Do any activity today'),(td.w+td.t>0)?1:0,(td.w+td.t>0?1:0)+'/1','q103'],
  ['#104','test: attempt 2 tasks',tx('جرّب تاسكين','Try two tasks'),Math.min(1,td.t/2),Math.min(2,td.t)+'/2','q104']];
 var own=window.__user&&window.__user.uid===uid,CL=j.claimed||[];function isCl(k){return CL.indexOf('q_'+j.today+'_'+k.slice(1))>=0}
 var tk=Q.map(function(q){var st=q[3]>=1?['done','merged']:q[3]>0?['prog','in review']:['todo','open'];
  var cl=q[3]>=1?(isCl(q[5])?'<span class="mono yy dv-xp">+2 XP '+tx('اتسلّمت','claimed')+'</span>':(own?'<button type="button" class="dv-cb mono" data-claim="'+q[5]+'">'+tx('استلم +2 XP','Claim +2 XP')+'</button>':'<span class="mono mu dv-xp">+2 XP</span>')):'<span class="mono mu dv-xp">+2 XP</span>';
  return '<div class="dv-tk"><div class="dv-l1 mono"><span class="bb">'+q[0]+'</span><b>'+q[1]+'</b><span class="dv-st '+st[0]+'">'+st[1]+'</span></div><div class="dv-ds">'+q[2]+'</div><div class="dv-l1"><div class="dv-bar" style="flex:1;margin:0">'+segs(12,Math.round(q[3]*12),8)+'</div><span class="mono yy dv-xp">'+q[4]+'</span></div><div class="dv-l1" style="justify-content:flex-end;margin-top:4px">'+cl+'</div></div>'}).join('');
 var D=['Sat','Sun','Mon','Tue','Wed','Thu','Fri'],act=0,pl='';var chest='';
 for(var i=0;i<7;i++){var dt=new Date(today.getTime()+(i-dow)*864e5),k=dt.toISOString().slice(0,10),a=j.days[k]&&(j.days[k].w+j.days[k].t>0),fut=i>dow,now=i===dow;if(a)act++;
  pl+=(i?'<div class="dv-ln'+(!fut&&(a||i<=dow)&&a?' ok':'')+'"></div>':'')+'<div class="dv-nd mono'+(a?' ok':'')+(now&&!a?' now':'')+'"><div class="dv-dot">'+(a?ck():now?'<span class="yy" style="font-size:11px">&gt;_</span>':fut?'<span class="mu" style="font-size:10px">...</span>':'<span class="mu" style="font-size:12px">-</span>')+'</div>'+D[i]+'</div>'}
 var chCl=CL.indexOf('chest_'+(j.week&&j.week.start))>=0;chest='<div class="dv-ch mono"><span class="bb">release v1.0.5</span> '+(chCl?'<span class="yy">+10 XP '+tx('اتسلّمت','claimed')+'</span>':(act>=5?(own?'<button type="button" class="dv-cb mono" data-claim="chest">'+tx('افتح الصندوق +10 XP','Open chest +10 XP')+'</button>':'<span class="yy">'+tx('الصندوق جاهز','chest ready')+'</span>'):'<span class="mu">'+tx('5 أيام نشاط في الأسبوع = صندوق +10 XP','5 active days in a week = chest +10 XP')+' ('+act+'/5)</span>'))+'</div>';
 var lg='';if(ctx.top&&ctx.top.length){lg=ctx.top.map(function(r,i){var l2=1+Math.floor((r.total||r.points)/20),me=r.id===uid;return '<tr class="mono'+(me?' me':'')+'"><td class="'+(i<3?'yy':'mu')+'">'+(i+1)+'</td><td dir="auto">'+window.__who(r.id,r.name)+(me?' <span class="cgr">(you)</span>':'')+'</td><td><span class="dv-rk">'+rank(l2)+'</span></td><td class="yy" style="text-align:right">'+r.points+' <span class="mu">XP '+tx('الأسبوع','wk')+'</span></td></tr>'}).join('')}
 else lg='<tr><td class="mu mono">// '+tx('لسه مفيش حد','nobody yet')+'</td></tr>';
 box.innerHTML='<div class="dv-tb"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i><span class="mono">~/mobile-app-a-to-z/dev-profile.dart</span></div><div class="dv-bd">'+
 '<div class="dv-hd"><div class="dv-av mono">&lt;/&gt;</div><div class="dv-who"><div class="dv-n"><span class="mono pp">'+rk+'</span> <span class="mono mu">Lv.'+lv+'</span></div><div class="dv-bar">'+segs(20,inl,0,true)+'</div><div class="mono mu" style="font-size:12px">'+inl+' / 20 XP'+(nx?' <span class="cgr">// '+((nx[0]-1)*20-pts)+' commits to '+nx[1]+'</span>':'')+'</div></div>'+
 '<div class="dv-chips"><div class="dv-chip mono"><span class="yy">$</span> streak: <b class="yy">'+j.current+'d</b></div><div class="dv-chip mono">best: <b>'+j.longest+'d</b></div><div class="dv-chip mono"><span class="bb">commits</span> <b>'+pts+'</b></div></div></div>'+
 '<div class="dv-cols"><div><div class="dv-sec mono"><span class="pr">$</span> git log --today <span class="cgr">// '+tx('المهام اليومية','daily tickets')+'</span></div>'+tk+
 '<div class="dv-sec mono"><span class="pr">$</span> deploy --week <span class="cgr">// '+tx('الأسبوع = release','the week = release')+'</span></div><div class="dv-pl">'+pl+'</div><div class="mono mu" style="font-size:12px;margin-top:6px"><span class="cgr">// </span>'+act+'/7 '+tx('أيام اتشحنت','days shipped')+' <span class="yy">v1.0.'+act+'</span></div>'+chest+'</div>'+
 '<div><div class="dv-sec mono"><span class="pr">$</span> git shortlog -sn --week <span class="cgr">// '+tx('دوري الأسبوع','weekly league')+'</span></div><table class="dv-lg">'+lg+'</table><div class="mono mu" style="font-size:12px;margin-top:8px"><span class="cgr">// </span>'+tx('XP الأسبوع = النقاط اللي كسبتها من السبت. بيتصفّر كل سبت.','Weekly XP = points earned since Saturday. Resets every Saturday.')+(j.week?' <span class="yy">'+tx('نقاطك: ','you: ')+j.week.wp+'</span>':'')+'</div></div></div>'+
 '<p class="cm-note" dir="auto" style="margin:12px 0 0">'+tx('كل الأرقام من نشاطك الفعلي: مشاهدة الدروس ومحاولات التاسكات. بيبدأ من يوم تفعيل التتبع.','All numbers come from your real activity: lessons watched and task attempts. Tracking started the day it was enabled.')+'</p></div>';
 box.hidden=false}
function getWk(){return fetch('/api/weekly').then(function(r){return r.ok?r.json():null}).then(function(j){return(j&&j.rows||[]).filter(function(r){return r.id!==window.__OWNER})}).catch(function(){return[]})}
function getTop(){return window.__db?window.__db().then(function(x){return x.F.getDocs(x.F.query(x.F.collection(x.db,'leaderboard'),x.F.orderBy('points','desc'),x.F.limit(6)))}).then(function(s){var r=[];s.forEach(function(d){var v=d.data();if(v&&typeof v.points==='number'&&v.points>0&&d.id!==window.__OWNER)r.push({id:d.id,name:v.name,points:v.points})});return r}).catch(function(){return[]}):Promise.resolve([])}
function getPts(id){return window.__db?window.__db().then(function(x){return x.F.getDoc(x.F.doc(x.db,'leaderboard',id))}).then(function(d){return d.exists()&&typeof d.data().points==='number'?d.data().points:null}).catch(function(){return null}):Promise.resolve(null)}
function load(id){if(!id)return;uid=id;var hd={};(window.__user&&window.__idToken?window.__idToken():Promise.resolve('')).then(function(t){if(t)hd.authorization='Bearer '+t;return Promise.all([fetch('/api/activity?uid='+encodeURIComponent(id),{headers:hd}).then(function(r){return r.ok?r.json():null}),getPts(id),getWk()])}).then(function(a){var j=a[0];if(!j||!j.days)return;var pts=a[1];if(pts==null){var e=document.getElementById('pfpts');pts=e?(parseInt(e.textContent,10)||0):0}ctx={pts:pts,top:a[2]};window.__hm=j;render(j)}).catch(function(){})}
box.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-claim]');if(!b||b.disabled)return;b.disabled=true;var c=b.getAttribute('data-claim');window.__idToken().then(function(t){return fetch('/api/weekly',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+t},body:JSON.stringify({claim:c})})}).then(function(r){return r.json().catch(function(){return{}})}).then(function(r){if(r&&r.claimed){if(window.__setStp)window.__setStp(uid,r.total);if(window.__lb)window.__lb();var pe=document.getElementById('pfpts');if(pe)pe.textContent=r.total;load(uid)}else{b.disabled=false;b.textContent=tx('لسه مش جاهز، جرّب تاني','Not ready yet, try again')}}).catch(function(){b.disabled=false})});
var pub=document.getElementById('pubmain');
if(pub){var h0=(location.hash||'').slice(1);if(h0)load(h0);window.addEventListener('hashchange',function(){load((location.hash||'').slice(1))})}
else{var tryMe=function(){if(window.__user)load(window.__user.uid)};document.addEventListener('authchange',tryMe);setTimeout(tryMe,1500)}
})();
/* bookmarks + personal notes (guest: this device; signed in: synced to the account via /api/me) */
(function(){
var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function lj(k,d){try{return JSON.parse(localStorage.getItem(k)||'')||d}catch(_){return d}}
function sj(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function api(m,b){return window.__idToken().then(function(t){if(!t)throw 0;return fetch('/api/me',{method:m,headers:{'content-type':'application/json',authorization:'Bearer '+t},body:b?JSON.stringify(b):undefined})}).then(function(r){if(!r.ok)throw 0;return r.json()})}
var bm=lj('bm_v1',[]),synced=false;
function paintBm(){document.querySelectorAll('.bkbtn').forEach(function(b){var on=bm.indexOf(+b.dataset.n)>=0;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});paintList()}
function saveBm(){sj('bm_v1',bm);paintBm();if(window.__user)api('POST',{bm:bm}).catch(function(){})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.bkbtn');if(!b)return;var n=+b.dataset.n,i=bm.indexOf(n);if(i>=0)bm.splice(i,1);else bm.push(n);saveBm()});
function paintList(){var p=document.getElementById('bkpanel');if(!p||document.getElementById('pubmain'))return;var S=window.SEARCH||[];var items=bm.slice().sort(function(a,b){return a-b}).map(function(n){var s=S.filter(function(x){return x.n===n})[0];return s?'<a class="bki" href="'+esc(s.u)+'"><b>'+tx('الدرس ','Lesson ')+n+'</b> <span dir="auto">'+esc(s.t)+'</span></a>':''}).join('');var l=document.getElementById('bklist');l.innerHTML=items||'<p class="cm-note">'+tx('لسه محفظتش أي درس. دوس ☆ احفظ الدرس في صفحة أي درس.','No saved lessons yet. Press ☆ Save lesson on any lesson page.')+'</p>';p.hidden=false}
/* notes */
var nb=document.getElementById('mynote');
if(nb){var n=nb.dataset.n,ta=document.getElementById('mynotetx'),st=document.getElementById('mynotest'),tm=null,k='note_'+n;
 var loc=lj(k,null);if(loc&&typeof loc.t==='string')ta.value=loc.t;
 function stat(s){st.textContent=s}
 function save(){var v=ta.value.slice(0,2000);sj(k,{t:v,u:Date.now()});if(!window.__user){stat(tx('اتحفظت على الجهاز ده. سجّل دخول عشان تتزامن.','Saved on this device. Sign in to sync.'));return}stat(tx('بيحفظ...','Saving...'));api('POST',{note:{n:n,t:v}}).then(function(){stat(tx('اتحفظت في حسابك ✓','Saved to your account ✓'))}).catch(function(){stat(tx('مقدرناش نحفظ في الحساب، اتحفظت على الجهاز','Could not save to the account, kept on this device'))})}
 ta.addEventListener('input',function(){clearTimeout(tm);stat('');tm=setTimeout(save,1200)});
 window.__noteSync=function(srv){var s=srv.notes&&srv.notes[n],l=lj(k,null);if(s&&(!l||(l.u||0)<s.u)){ta.value=s.t;sj(k,{t:s.t,u:s.u})}else if(l&&l.t&&(!s||s.u<(l.u||0))){api('POST',{note:{n:n,t:l.t}}).catch(function(){})}}}
function sync(){if(!window.__user||!window.__idToken||synced)return;synced=true;api('GET').then(function(s){var m=bm.slice();s.bm.forEach(function(x){if(m.indexOf(x)<0)m.push(x)});var ch=m.length!==s.bm.length;bm=m;sj('bm_v1',bm);paintBm();if(ch)api('POST',{bm:bm}).catch(function(){});if(window.__noteSync)window.__noteSync(s)}).catch(function(){synced=false})}
document.addEventListener('authchange',function(){synced=false;sync()});setTimeout(sync,1500);paintBm();
})();

/* roadmap: fills from real progress (same source as the profile) */
(function(){var ws=document.querySelectorAll('.rmw');if(!ws.length)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function done(){var d={};try{JSON.parse(localStorage.getItem('progress_v1')||'[]').forEach(function(n){d[n]=1})}catch(_){}return d}
function paint(){var d=done();ws.forEach(function(w){var ids=w.dataset.ls.split(','),c=0,nxt=false;ids.forEach(function(i){var li=w.querySelector('.rmn[data-n="'+i+'"]'),ok=!!d[i];if(ok)c++;li.classList.toggle('done',ok);var isn=!ok&&!nxt;if(isn)nxt=true;li.classList.toggle('next',isn);li.querySelector('.rms').textContent=ok?tx('✓ مكتمل','✓ Done'):(isn?tx('التالي','Next'):'')});w.querySelector('.rmp').textContent=c+'/'+ids.length;w.querySelector('.rmb i').style.width=Math.round(100*c/ids.length)+'%'})}
paint();window.addEventListener('storage',paint);document.addEventListener('authchange',function(){setTimeout(paint,1200)});setTimeout(paint,1500)})();

/* lesson quiz: questions only; grading and points are server-side (/api/quiz) */
(function(){var q=document.getElementById('quiz');if(!q)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var n=q.dataset.n,Q=JSON.parse(q.dataset.q),bx=document.getElementById('quizbox'),st=null,sel=[],res=null,busy=false;
function api(m,b){return window.__idToken().then(function(t){if(!t)throw 0;return fetch('/api/quiz'+(m==='GET'?'?lesson='+n:''),{method:m,headers:{'content-type':'application/json',authorization:'Bearer '+t},body:m==='POST'?JSON.stringify(b):undefined})}).then(function(r){return r.json().then(function(j){j._s=r.status;return j})})}
function L(a){return en?a[1]:a[0]}
function paint(){var u=window.__user,h='';var done=st&&(st.left===0||st.best===Q.length);
 Q.forEach(function(x,i){var ok=st&&st.correct;h+='<fieldset class="qz"><legend><b>'+(i+1)+'.</b> '+esc(L(x.q))+'</legend>'+x.o.map(function(o,k){var c=(sel[i]===k?' checked':''),cls='';if(ok){if(k===st.correct[i])cls=' qok';else if(sel[i]===k)cls=' qno'}return '<label class="qo'+cls+'"><input type="radio" name="q'+i+'" value="'+k+'"'+c+(done||!u?' disabled':'')+'><span dir="auto">'+esc(L(o))+'</span></label>'}).join('')+'</fieldset>'});
 var msg='';if(!u)msg=tx('سجّل دخولك عشان تجاوب وتاخد نقاط.','Sign in to answer and earn points.');else if(res!=null)msg=tx('نتيجتك: ','Your score: ')+res+'/'+Q.length;
 if(st)msg+=(msg?' · ':'')+tx('أعلى نتيجة: ','Best: ')+st.best+'/'+Q.length+' · '+tx('محاولات متبقية: ','attempts left: ')+st.left;
 h+='<div class="qbar"><button type="button" class="btn qsub"'+(done||!u||busy?' disabled':'')+'>'+tx('تأكيد الإجابات','Submit answers')+'</button><span class="qmsg" role="status">'+msg+'</span></div>';bx.innerHTML=h}
bx.addEventListener('change',function(e){var r=e.target;if(r.type==='radio'){sel[+r.name.slice(1)]=+r.value}});
bx.addEventListener('click',function(e){if(!e.target.closest('.qsub'))return;for(var i=0;i<Q.length;i++)if(sel[i]==null){var m=bx.querySelector('.qmsg');m.textContent=tx('جاوب على كل الأسئلة الأول.','Answer all questions first.');return}busy=true;paint();api('POST',{lesson:+n,answers:sel}).then(function(j){busy=false;if(j.error){res=null;paint();bx.querySelector('.qmsg').textContent=tx('حصلت مشكلة، جرّب تاني.','Something went wrong, try again.');return}if(j.score!=null)res=j.score;st=j;if(window.__setStp&&window.__user)window.__setStp(window.__user.uid,j.total);if(window.__lb)window.__lb();paint()}).catch(function(){busy=false;paint()})});
function init(){if(window.__user&&window.__idToken){api('GET').then(function(j){if(!j.error){st=j;paint()}}).catch(function(){})}paint()}
document.addEventListener('authchange',function(){sel=[];res=null;st=null;init()});paint();setTimeout(init,1500)})();

/* daily challenge: one server-picked question a day, one attempt, +3 XP when correct (/api/daily) */
(function(){var bx=document.getElementById('dcbox2')||(document.getElementById('pubmain')?null:document.getElementById('dcbox'));if(!bx)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function L(a){return en?a[1]:a[0]}
var st=null,sel=null,busy=false;
function call(m,b){return(window.__user&&window.__idToken?window.__idToken():Promise.resolve('')).then(function(t){var h={'content-type':'application/json'};if(t)h.authorization='Bearer '+t;return fetch('/api/daily',{method:m,headers:h,body:b?JSON.stringify(b):undefined})}).then(function(r){return r.json().then(function(j){j._s=r.status;return j})})}
function paint(){if(!st||st.error){bx.innerHTML='<p class="cm-note">'+tx('التحدي مش متاح دلوقتي.','The challenge is not available right now.')+'</p>';return}var u=window.__user,pl=st.played;var p=document.getElementById('dcpanel');if(p)p.hidden=false;
 var h='<fieldset class="qz"><legend>'+esc(L(st.q))+'</legend>'+st.o.map(function(o,k){var cls='';if(pl){if(k===st.correct)cls=' qok';else if(sel===k)cls=' qno'}return '<label class="qo'+cls+'"><input type="radio" name="dc" value="'+k+'"'+(sel===k?' checked':'')+(pl||!u?' disabled':'')+'><span dir="auto">'+esc(L(o))+'</span></label>'}).join('')+'</fieldset>';
 var m=!u?tx('سجّل دخولك عشان تجاوب. الإجابة الصح بتدي '+st.xp+' نقاط. محاولة واحدة في اليوم.','Sign in to answer. A correct answer gives '+st.xp+' points. One attempt per day.'):(pl?(st.got?tx('إجابة صح! +'+st.xp+' نقاط. ارجع بكرة لتحدي جديد.','Correct! +'+st.xp+' points. Come back tomorrow for a new one.'):tx('إجابة غلط. ارجع بكرة لتحدي جديد.','Not this time. Come back tomorrow for a new one.')):tx('محاولة واحدة. الإجابة الصح بتدي '+st.xp+' نقاط.','One attempt. A correct answer gives '+st.xp+' points.'));
 h+='<div class="qbar"><button type="button" class="btn dcsub"'+(pl||!u||busy?' disabled':'')+'>'+tx('تأكيد','Submit')+'</button><span class="qmsg" role="status">'+m+'</span></div>';bx.innerHTML=h}
bx.addEventListener('change',function(e){if(e.target.type==='radio')sel=+e.target.value});
bx.addEventListener('click',function(e){if(!e.target.closest('.dcsub'))return;if(sel==null){bx.querySelector('.qmsg').textContent=tx('اختار إجابة الأول.','Pick an answer first.');return}busy=true;paint();call('POST',{answer:sel}).then(function(j){busy=false;if(j.error&&j._s!==409){paint();bx.querySelector('.qmsg').textContent=tx('حصلت مشكلة، جرّب تاني.','Something went wrong, try again.');return}st=j;if(window.__setStp&&window.__user&&j.total!=null)window.__setStp(window.__user.uid,j.total);if(window.__lb&&j.got)window.__lb();paint()}).catch(function(){busy=false;paint()})});
function init(){call('GET').then(function(j){st=j;paint()}).catch(function(){})}
document.addEventListener('authchange',function(){sel=null;init()});setTimeout(init,1400)})();

/* Q&A under each lesson (server: /api/qa). name only, spam limits, report, best answer by the asker */
(function(){var q=document.getElementById('qa');if(!q)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var n=+q.dataset.lesson,f=document.getElementById('qaform'),msg=document.getElementById('qamsg'),ls=document.getElementById('qalist'),items=[],owner=false,open=null;
function say(t,e){msg.textContent=t;msg.className='cm-msg'+(e?' e':'')}
function tk(){try{return JSON.parse(localStorage.getItem('qa_tok')||'{}')}catch(_){return{}}}function stk(id,t){var o=tk();o[id]=t;try{localStorage.setItem('qa_tok',JSON.stringify(o))}catch(_){}}
function hdr(){return(window.__user&&window.__idToken?window.__idToken():Promise.resolve('')).then(function(t){var h={'content-type':'application/json'};if(t)h.authorization='Bearer '+t;return h})}
function call(b){return hdr().then(function(h){return fetch('/api/qa',{method:'POST',headers:h,body:JSON.stringify(b)})}).then(function(r){return r.json().then(function(j){j._s=r.status;return j})})}
function when(t){try{return new Date(t).toLocaleDateString(en?'en-GB':'ar-EG',{day:'numeric',month:'short',year:'numeric'})}catch(_){return''}}
function can(id){return owner||!!tk()[id]}
function item(x,isq,qid){var ac='';if(can(x.id))ac+='<button type="button" class="qa-b" data-a="del" data-id="'+x.id+'">'+tx('مسح','Delete')+'</button>';if(!isq&&(owner||!!tk()[qid]))ac+='<button type="button" class="qa-b" data-a="best" data-id="'+x.id+'">'+(x.best?tx('إلغاء أفضل إجابة','Unmark best'):tx('أفضل إجابة','Mark best'))+'</button>';ac+='<button type="button" class="qa-b" data-a="rep" data-id="'+x.id+'">'+tx('إبلاغ','Report')+'</button>';
 return '<div class="qa-i'+(x.best?' best':'')+'"><div class="cm-h"><b>'+(x.staff?window.__who(window.__OWNER,x.name):esc(x.name))+'</b><small>'+when(x.created)+'</small>'+(x.best?'<span class="qa-best">✓ '+tx('أفضل إجابة','Best answer')+'</span>':'')+'</div><p dir="auto">'+esc(x.text)+'</p><div class="qa-ac">'+ac+'</div></div>'}
function draw(){var qs=items.filter(function(x){return!x.parent}).sort(function(a,b){return b.created-a.created});if(!qs.length){ls.innerHTML='<p class="cm-empty">'+tx('مفيش أسئلة لسه. كن أول واحد.','No questions yet. Be the first.')+'</p>';return}
 ls.innerHTML=qs.map(function(x){var as=items.filter(function(a){return a.parent===x.id}).sort(function(a,b){return(b.best?1:0)-(a.best?1:0)||a.created-b.created});
  return '<div class="qa-q">'+item(x,true)+'<div class="qa-as">'+as.map(function(a){return item(a,false,x.id)}).join('')+'</div><form class="qa-af" data-q="'+x.id+'" novalidate><input class="fld" name="nm" maxlength="40" autocomplete="name" placeholder="'+tx('اسمك الحقيقي','Your real name')+'"><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><textarea class="fld" name="tx" rows="2" maxlength="1000" placeholder="'+tx('اكتب إجابتك...','Write your answer...')+'"></textarea><button class="btn" type="submit">'+tx('أرسل الإجابة','Post answer')+'</button><span class="cm-msg"></span></form></div>'}).join('')}
function load(){hdr().then(function(h){return fetch('/api/qa?lesson='+n,{headers:h})}).then(function(r){return r.json()}).then(function(j){if(j.error)throw 0;items=j.items;owner=!!j.owner;var a=document.activeElement;if(a&&a.closest&&a.closest('#qalist')&&a.tagName!=='BUTTON')return;draw()}).catch(function(){ls.innerHTML='<p class="cm-empty">'+tx('مقدرناش نحمّل الأسئلة.','Could not load the questions.')+'</p>'})}
function nm0(v){var s=v.replace(/\s+/g,' ').trim();return s}
function post(form,body,out){return call(body).then(function(j){if(j.token){stk(j.id,j.token)}if(j.error){out.textContent=j.error==='rate'?tx('بتبعت كتير. استنى شوية.','Too many posts. Wait a bit.'):j.error==='name'?tx('اكتب اسمك الحقيقي (حروف بس، من 2 لـ 40 حرف).','Please enter your real name (letters only, 2 to 40 characters).'):j.error==='text'?tx('النص قصير أو فيه روابط كتير.','Text is too short or has too many links.'):tx('حصلت مشكلة، جرّب تاني.','Something went wrong, try again.');out.className='cm-msg e';return false}out.textContent=tx('اتبعت ✓','Posted ✓');out.className='cm-msg';return true})}
f.addEventListener('submit',function(e){e.preventDefault();var nm=nm0(f.nm.value),t=f.tx.value.trim();if(!nm||t.length<2){say(tx('اكتب اسمك وسؤالك.','Enter your name and question.'),true);return}try{localStorage.setItem('qa_name',nm)}catch(_){}post(f,{act:'post',lesson:n,name:nm,text:t,hp:f.website.value},msg).then(function(ok){if(ok){f.tx.value='';if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();load()}})});
ls.addEventListener('submit',function(e){var af=e.target.closest('.qa-af');if(!af)return;e.preventDefault();var out=af.querySelector('.cm-msg'),nm=nm0(af.nm.value),t=af.tx.value.trim();if(!nm||t.length<2){out.textContent=tx('اكتب اسمك وإجابتك.','Enter your name and answer.');out.className='cm-msg e';return}try{localStorage.setItem('qa_name',nm)}catch(_){}post(af,{act:'post',lesson:n,name:nm,text:t,parent:af.dataset.q,hp:af.website.value},out).then(function(ok){if(ok){af.tx.value='';if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();load()}})});
ls.addEventListener('focusin',function(e){var af=e.target.closest&&e.target.closest('.qa-af');if(af&&!af.nm.value){try{af.nm.value=localStorage.getItem('qa_name')||''}catch(_){}}});
ls.addEventListener('click',function(e){var b=e.target.closest('.qa-b');if(!b)return;var a=b.dataset.a,id=b.dataset.id;if(a==='del'&&!confirm(tx('تمسح؟','Delete this?')))return;b.disabled=true;call({act:a==='rep'?'report':a,id:id,token:tk()[id]||(a==='best'?tk()[items.filter(function(x){return x.id===id})[0].parent]:'')}).then(function(j){if(a==='rep'){b.textContent=j.ok?tx('اتبلّغ، شكراً','Reported, thanks'):tx('مقدرناش نبلّغ','Could not report');return}load()}).catch(function(){b.disabled=false})});
try{f.nm.value=localStorage.getItem('qa_name')||''}catch(_){}
document.addEventListener('authchange',function(){setTimeout(load,1200)});load();setInterval(function(){if(!document.hidden)load()},60000)})();

/* admin page: only the owner account can load data (the server answers 404 to everyone else) */
(function(){var m=document.getElementById('admmain');if(!m)return;var en=document.documentElement.lang==='en';function tx(a,b){return en?b:a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var msg=document.getElementById('admmsg'),box=document.getElementById('admin');
function dt(t){return t?new Date(t).toLocaleString(en?'en-GB':'ar-EG',{dateStyle:'medium',timeStyle:'short'}):'—'}
function tk(){return window.__idToken?window.__idToken():Promise.resolve('')}
function nf(){box.hidden=true;msg.hidden=false;msg.textContent=tx('الصفحة دي مش متاحة.','This page is not available.')}
function load(){if(!window.__user){msg.hidden=false;box.hidden=true;msg.textContent=tx('سجّل دخولك بحساب المشرف.','Sign in with the admin account.');return}
 tk().then(function(t){return fetch('/api/admin',{headers:{authorization:'Bearer '+t}})}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){msg.hidden=true;box.hidden=false;
  document.getElementById('admcount').textContent='('+j.accounts.length+')';
  document.getElementById('admacc').innerHTML='<table class="adm-tb"><thead><tr><th>'+tx('الاسم','Name')+'</th><th>'+tx('الإيميل','Email')+'</th><th>'+tx('نقاط','Points')+'</th><th>'+tx('انضم','Joined')+'</th><th>'+tx('آخر دخول','Last sign-in')+'</th></tr></thead><tbody>'+j.accounts.map(function(a){return '<tr><td>'+window.__who(a.uid,a.name||'—')+'</td><td dir="ltr">'+esc(a.email||'—')+'</td><td>'+a.points+'</td><td>'+dt(a.created)+'</td><td>'+dt(a.last)+'</td></tr>'}).join('')+'</tbody></table>';
  var q=j.qa;document.getElementById('admqa').innerHTML=q.length?q.map(function(x){return '<div class="qa-i'+(x.hidden?' adm-h':'')+'"><div class="cm-h"><b>'+(x.staff?window.__who(window.__OWNER,x.name):esc(x.name))+'</b><small>'+tx('درس ','Lesson ')+x.lesson+' · '+dt(x.created)+(x.parent?' · '+tx('إجابة','answer'):' · '+tx('سؤال','question'))+(x.rep?' · '+x.rep+' '+tx('بلاغ','reports'):'')+(x.hidden?' · '+tx('مخفي','hidden'):'')+'</small></div><p dir="auto">'+esc(x.text)+'</p><div class="qa-ac"><button type="button" class="qa-b" data-id="'+x.id+'">'+tx('مسح','Delete')+'</button></div></div>'}).join(''):'<p class="cm-empty">'+tx('مفيش أسئلة.','No questions.')+'</p>'}).catch(nf)}
document.getElementById('admqa').addEventListener('click',function(e){var b=e.target.closest('.qa-b');if(!b||!confirm(tx('تمسح؟','Delete this?')))return;b.disabled=true;tk().then(function(t){return fetch('/api/qa',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+t},body:JSON.stringify({act:'del',id:b.dataset.id})})}).then(function(){load()})});
document.addEventListener('authchange',function(){setTimeout(load,300)});setTimeout(load,1500)})();

;(function(){var L=document.documentElement.lang==='en';
var EYE='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var OFF='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22"/></svg>';
function wrap(i){if(i.dataset.pwe)return;i.dataset.pwe='1';var w=document.createElement('span');w.className='pwwrap';i.parentNode.insertBefore(w,i);w.appendChild(i);
var b=document.createElement('button');b.type='button';b.className='pweye';b.innerHTML=EYE;b.setAttribute('aria-label',L?'Show password':'إظهار كلمة السر');b.setAttribute('aria-pressed','false');
b.onclick=function(){var s=i.type==='password';var sc=i.closest('.sview,.sform')||document;sc.querySelectorAll('.pwwrap').forEach(function(x){var k=x.querySelector('input'),e=x.querySelector('.pweye');if(!k||!e)return;k.type=s?'text':'password';e.innerHTML=s?OFF:EYE;e.setAttribute('aria-pressed',s?'true':'false');e.setAttribute('aria-label',s?(L?'Hide password':'إخفاء كلمة السر'):(L?'Show password':'إظهار كلمة السر'))});i.focus()};w.appendChild(b)}
function scan(){document.querySelectorAll('input[type=password]').forEach(wrap)}
scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})})();
