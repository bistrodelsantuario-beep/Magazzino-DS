const CACHE='magazzino-ds-v7';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./config.js','./app-1.txt','./app-2.txt','./app-3a.txt','./app-3b.txt','./app-4.txt'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));});
self.addEventListener('push',event=>{let data={title:'Nuovo ordine',body:'È stato inserito un nuovo ordine'};try{if(event.data)data={...data,...event.data.json()};}catch(_){ }event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'./icon.svg',badge:'./icon.svg',data:{url:data.url||'./index.html?open=history'}}));});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.openWindow(event.notification.data?.url||'./index.html?open=history'));});
