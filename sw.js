const CACHE='magazzino-ds-v6';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html','./manifest.json','./icon.svg','./config.js','./app-1.txt','./app-2.txt','./app-3.txt','./app-4.txt'])));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
self.addEventListener('push',event=>{let data={title:'Nuovo ordine',body:'È stato inserito un nuovo ordine'};try{if(event.data)data={...data,...event.data.json()};}catch(_){ }event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'./icon.svg',badge:'./icon.svg',data:{url:data.url||'./index.html?open=history'}}));});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.openWindow(event.notification.data?.url||'./index.html?open=history'));});
