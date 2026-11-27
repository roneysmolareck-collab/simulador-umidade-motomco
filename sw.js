// Guarda o simulador no aparelho para abrir sem internet
const VERSAO = 'simulador-v3-3';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fotos/01-colheita.jpg', './fotos/02-estrada.jpg', './fotos/03-balanca.jpg', './fotos/04-calador.jpg', './fotos/05-medidor.jpg', './fotos/06-classificacao.jpg', './fotos/07-romaneio.jpg', './fotos/08-secador.jpg', './fotos/09-armazem.jpg', './fotos/10-expedicao.jpg', './fotos/11-produtor.jpg', './fotos/12-unidade.jpg',
  './voz/ba0.mp3', './voz/ba1.mp3', './voz/ba2.mp3', './voz/ba3.mp3', './voz/ba4.mp3', './voz/ba5a.mp3', './voz/ba5b.mp3', './voz/ex0.mp3', './voz/ex1a.mp3', './voz/ex1b.mp3', './voz/ex2.mp3', './voz/ex3a.mp3', './voz/ex3b.mp3', './voz/ex4a.mp3', './voz/ex4b.mp3', './voz/ex5a.mp3', './voz/ex5b.mp3', './voz/ex6.mp3', './voz/pr0.mp3', './voz/pr1.mp3', './voz/pr2.mp3', './voz/pr3.mp3', './voz/pr4a.mp3', './voz/pr4b.mp3', './voz/pr5a.mp3', './voz/pr5b.mp3', './voz/pr6a.mp3', './voz/pr6b.mp3', './voz/pr6c.mp3', './voz/pr6d.mp3', './voz/ro0.mp3', './voz/ro1.mp3', './voz/ro2.mp3', './voz/ro3.mp3', './voz/ro4.mp3', './voz/ro5.mp3', './voz/un0.mp3', './voz/un1.mp3', './voz/un2.mp3', './voz/un3.mp3', './voz/un4a.mp3', './voz/un4b.mp3', './voz/un4c.mp3', './voz/un5a.mp3', './voz/un5b.mp3', './voz/un6.mp3'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // página: tenta a rede primeiro para pegar atualizações, cai no cache sem internet
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put('./index.html', c)); return r; }).catch(() => caches.match('./index.html'))); return; }
  // fontes do Google e arquivos locais: cache primeiro
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return r; })));
  }
});
