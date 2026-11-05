/* הכסף שלי — offline support. The app shell is cached; market data is fetched fresh when online. */
var CACHE='kesef-2026.11.05.1041';
var SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','market.json','version.json'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}));});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(/\/(market|version)\.json$/.test(u.pathname)){ // network first, cache fallback
    e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(u.pathname.replace(/^.*\//,''),cp);});return r;}).catch(function(){return caches.match(u.pathname.replace(/^.*\//,''));}));return;}
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request).then(function(n){return n;}).catch(function(){return caches.match('index.html');});}));
});
