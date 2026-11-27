// Aplica patch.txt sobre original.html e gera index.html + arquivos de PWA
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const [,, patchFile, dir] = process.argv;
let src = fs.readFileSync(path.join(dir, 'original.html'), 'utf8');
let patch = fs.readFileSync(patchFile, 'utf8').replace(/\r\n/g, '\n');
// remove o bloco antigo que ficou sem uso
patch = patch.replace(/,\n  secagemREMOVIDA\(r\)\{[\s\S]*?\n  \}\n@@@ END/, '\n@@@ END');
if (patch.includes('secagemREMOVIDA')) throw new Error('bloco removido ainda presente');

// limpa o que o Netlify injeta (ele injeta de novo no deploy)
src = src.replace(/<!-- This site is hosted on Netlify[\s\S]*?-->\n/, '');
src = src.replace(/<script async src="\/\.netlify\/scripts\/hud[^>]*><\/script>\s*$/, '');

const blocos = [...patch.matchAll(/@@@ FIND\n([\s\S]*?)\n@@@ REPLACE\n([\s\S]*?)\n@@@ END/g)];
let erros = 0;
for (const [, find, rep] of blocos) {
  const n = src.split(find).length - 1;
  if (n !== 1) { console.error(`FIND aparece ${n}x: ${find.slice(0, 90)}`); erros++; continue; }
  src = src.replace(find, () => rep);
}
// troca a animação de desenho pelo palco de fotos
const reAnimar = /async function animar\(\)\{[\s\S]*?\n\}\n(?=\n\/\* ===== Navegação ===== \*\/)/;
if (!reAnimar.test(src)) { console.error('função animar não encontrada'); erros++; }
src = src.replace(reAnimar, () => fs.readFileSync(path.join(__dirname, 'animar.js'), 'utf8')
  .replace('__VOZ_FALAS__', () => JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, 'falas.json'), 'utf8')))));
// os áudios antigos (embutidos) não são mais usados: a narração nova vem de voz/*.mp3
const reClips = /const CLIPS=\{[^\n]*\};/;
if (!reClips.test(src)) { console.error('CLIPS antigos não encontrados'); erros++; }
src = src.replace(reClips, 'const CLIPS={};');
const logo = src.match(/<span class="card-logo"><img src="(data:image\/[a-z]+;base64,[^"]+)"/)[1];
src = src.split('__CARDLOGO__').join(logo);
if (erros) { console.error(erros + ' blocos falharam'); process.exit(1); }
fs.writeFileSync(path.join(dir, 'index.html'), src);
console.log(`ok: ${blocos.length} blocos aplicados, index.html ${(src.length / 1e6).toFixed(2)} MB`);

// ---------- PWA ----------
fs.writeFileSync(path.join(dir, 'manifest.webmanifest'), JSON.stringify({
  name: 'Simulador de Umidade Motomco', short_name: 'Simulador Motomco',
  description: 'Desconto de umidade, romaneio, balanço de massa, desvio do MUG e quebra técnica.',
  lang: 'pt-BR', start_url: './', scope: './', display: 'standalone',
  background_color: '#06401f', theme_color: '#06401f',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2));

fs.writeFileSync(path.join(dir, 'sw.js'), `// Guarda o simulador no aparelho para abrir sem internet
const VERSAO = 'simulador-v3-3';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  ${fs.readdirSync(path.join(dir, 'fotos-ia')).filter(f => f.endsWith('.jpg')).map(f => `'./fotos/${f}'`).join(', ')},
  ${fs.readdirSync(path.join(dir, 'voz')).filter(f => f.endsWith('.mp3')).map(f => `'./voz/${f}'`).join(', ')}];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // página: tenta a rede primeiro para pegar atualizações, cai no cache sem internet
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put('./index.html', c)); return r; }).catch(() => caches.match('./index.html'))); return; }
  // fontes do Google e arquivos locais: cache primeiro
  if (url.origin === location.origin || /fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return r; })));
  }
});
`);

// ícone: símbolo da logo Motomco (parte esquerda da logo do site) em branco sobre o verde Motomco
const dec = require(path.join(__dirname, 'pngdec.js'));
const L = dec(Buffer.from(src.match(/class="logo-w" src="data:image\/png;base64,([^"]+)"/)[1], 'base64'));
const A = (x, y) => L.px[(y * L.w + x) * 4 + 3];
// recorta o símbolo: colunas até o primeiro vão vertical, depois as linhas usadas
let x1 = 0; while (x1 < L.w) { let s = 0; for (let y = 0; y < L.h; y++) s += A(x1, y) > 40; if (!s && x1 > 20) break; x1++; }
let y0 = 0, y1 = L.h - 1; const linhaVazia = y => { for (let x = 0; x < x1; x++) if (A(x, y) > 40) return false; return true; };
while (linhaVazia(y0)) y0++; while (linhaVazia(y1)) y1--;
let x0 = 0; const colVazia = x => { for (let y = y0; y <= y1; y++) if (A(x, y) > 40) return false; return true; }; while (colVazia(x0)) x0++;
const sw = x1 - x0, sh = y1 - y0 + 1;
console.log(`símbolo da logo: ${sw}×${sh} px`);
function png(size, file) {
  const S = 4, px = Buffer.alloc(size * size * 4), bg = [6, 64, 31];
  const alvo = size * 0.56, esc = alvo / Math.max(sw, sh), ox = (size - sw * esc) / 2, oy = (size - sh * esc) / 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let a = 0;
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const lx = Math.floor((x + (sx + .5) / S - ox) / esc) + x0, ly = Math.floor((y + (sy + .5) / S - oy) / esc) + y0;
      if (lx >= x0 && lx < x1 && ly >= y0 && ly <= y1) a += A(lx, ly) / 255;
    }
    a /= S * S; const i = (y * size + x) * 4;
    px[i] = bg[0] + (255 - bg[0]) * a; px[i + 1] = bg[1] + (255 - bg[1]) * a; px[i + 2] = bg[2] + (255 - bg[2]) * a; px[i + 3] = 255;
  }
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td)); return Buffer.concat([l, td, cr]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  fs.writeFileSync(path.join(dir, file), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}
png(192, 'icon-192.png'); png(512, 'icon-512.png');
console.log('ok: manifest, sw.js e ícones gerados');
