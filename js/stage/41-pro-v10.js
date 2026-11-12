/* student screen loads PDF pages by itself from the saved library (same browser), no waiting for the teacher window */
(function(){
 if(!STU){const _s=sendPages;sendPages=function(){_s();const d=S.decks[S.d];if(d&&!d.mediaTab&&d.key&&d.id)send({t:'dkey',id:d.id,key:d.key})};return}
 const D={};let cur=null,busy=0;
 async function load(id,key){if(D[id]&&D[id].key===key)return;D[id]={key};
  try{const r=await lib('get',key);if(!r||!r.blob||!/pdf/i.test((r.type||'')+(r.name||'')))return;D[id].doc=await pdfjsLib.getDocument({data:await r.blob.arrayBuffer()}).promise}catch(e){D[id]=null}}
 const _p=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;
  if(m){if(m.t==='pages'||m.t==='usedeck')cur=m.id||cur;
   if(m.t==='dkey'){cur=m.id;load(m.id,m.key);return}}
  return _p(ev)};
 setInterval(async()=>{if(busy||document.hidden)return;const d=D[cur];if(!d||!d.doc)return;busy=1;
  try{const n=d.doc.numPages;
   if(!S.pages.length){const l=await Promise.all(Array.from({length:n},(_,k)=>d.doc.getPage(k+1).then(pg=>{const v=pg.getViewport({scale:1});return{blob:null,bmp:null,w:v.width,h:v.height,strokes:[],notes:'',words:'',text:''}})));
    if(!S.pages.length){S.pages=l;S.i=Math.min(S.i,n-1);ui()}}
   if(S.pages.length!==n)return;
   for(const k of[0,1,-1,2,3,4,-2]){const idx=S.i+k,t=S.pages[idx];if(!t||t.blob||t.srend)continue;t.srend=1;
    try{const pg=await d.doc.getPage(idx+1),w0=pg.getViewport({scale:1}).width,vp=pg.getViewport({scale:Math.min(5,PW()/w0)}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
     await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
     if(!t.blob){t.blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.95));t.w=c.width;t.h=c.height;t.bmp=await createImageBitmap(c);t.pdf={doc:d.doc,n:idx+1};need=1;ui()}}
    catch(e){}finally{t.srend=0}break}
  }finally{busy=0}},150);
})();
(function(){if(STU)return;try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail','thot'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}})();
