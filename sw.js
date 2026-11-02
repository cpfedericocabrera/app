const CACHE='estudio-contable-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  // Librerías y fuentes externas: primero caché (funcionan sin internet)
  if(['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res})));return;
  }
  if(u.origin!==location.origin)return;
  // Archivos de la app: primero red (para recibir actualizaciones), si no hay internet usa la copia
  e.respondWith(fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
