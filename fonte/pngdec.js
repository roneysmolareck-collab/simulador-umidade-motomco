// decodifica PNG RGBA 8 bits sem entrelaçamento
const zlib=require('zlib');
module.exports=function(b){const w=b.readUInt32BE(16),h=b.readUInt32BE(20);let p=8,idat=[];
 while(p<b.length){const len=b.readUInt32BE(p),t=b.toString('ascii',p+4,p+8);if(t==='IDAT')idat.push(b.slice(p+8,p+8+len));p+=12+len;}
 const raw=zlib.inflateSync(Buffer.concat(idat)),bpp=4,st=w*bpp,out=Buffer.alloc(w*h*4);
 for(let y=0;y<h;y++){const f=raw[y*(st+1)],ro=y*(st+1)+1;for(let x=0;x<st;x++){const a=x>=bpp?out[y*st+x-bpp]:0,up=y?out[(y-1)*st+x]:0,c=(x>=bpp&&y)?out[(y-1)*st+x-bpp]:0;let v=raw[ro+x];
  if(f===1)v+=a;else if(f===2)v+=up;else if(f===3)v+=(a+up)>>1;else if(f===4){const pp=a+up-c,pa=Math.abs(pp-a),pb=Math.abs(pp-up),pc=Math.abs(pp-c);v+=(pa<=pb&&pa<=pc)?a:(pb<=pc?up:c);}
  out[y*st+x]=v&255;}}
 return {w,h,px:out};};
