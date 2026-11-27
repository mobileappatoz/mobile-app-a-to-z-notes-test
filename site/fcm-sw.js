importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyB5f_ZJjq3dUGDJNFVrXH6P8edfVFqVSS4',authDomain:'mobile-app-a-to-z-test.firebaseapp.com',projectId:'mobile-app-a-to-z-test',messagingSenderId:'13519907067',appId:'1:13519907067:web:daaf7faf13778031c1285e'});
var m=firebase.messaging();
m.onBackgroundMessage(function(p){var d=p.data||{};self.registration.showNotification(d.title||'Mobile App A to Z',{body:d.body||'',icon:'/img/icon-192.png',badge:'/img/icon-192.png',data:{url:d.url||'/'}})});
self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'/';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(w){for(var i=0;i<w.length;i++){if(w[i].url.indexOf(u)>-1&&'focus' in w[i])return w[i].focus()}return clients.openWindow(u)}))});
