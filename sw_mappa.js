// Service worker della mappa magazzino: salva i file sul telefono e li serve anche senza rete.
// Tocca solo i file della mappa (non le altre pagine del sito).
const NOME='mappa-magazzino-v1';
const FILE=['mappa_magazzino.html','mappa_magazzino.webmanifest','icona-192.png','icona-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(NOME).then(c=>c.addAll(FILE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==NOME&&x.startsWith('mappa-magazzino')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  const f=u.pathname.split('/').pop();
  if(!FILE.includes(f)&&f!=='') return;
  if(f===''&&!/mappa/.test(u.pathname)) return;
  // prima la rete (così gli aggiornamenti arrivano), se non c'è rete usa la copia salvata
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(NOME).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
