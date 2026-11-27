const http=require('http'),fs=require('fs'),path=require('path');
const dir=process.argv[2],port=+process.argv[3]||8090;
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.webmanifest':'application/manifest+json'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(dir,p);
if(!f.startsWith(path.resolve(dir))||!fs.existsSync(f)){r.writeHead(404);return r.end('404');}
r.writeHead(200,{'Content-Type':tipos[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(port,()=>console.log('servindo em http://localhost:'+port));
