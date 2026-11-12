/* modern line icons for the stage toolbar (replaces emoji / text glyphs) */
(function(){
const I=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const G={
'✏':I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>'),
'↶':I('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>'),
'↷':I('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>'),
'🗑':I('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>'),
'🔍':I('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>'),
'🖍':I('<path d="M14 4l6 6-8.5 8.5H5.5v-6z"/><path d="M3 21h8"/>'),
'╱':I('<path d="M5 19L19 5"/>'),
'▭':I('<rect x="4" y="6" width="16" height="12" rx="2.5"/>'),
'⌫':I('<path d="M7 21h13"/><path d="M5 13l8-8a2 2 0 013 0l3 3a2 2 0 010 3l-8 8H8z"/><path d="M9 9l6 6"/>'),
'🔴':I('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/>'),
'🔦':I('<circle cx="12" cy="12" r="3.6"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'),
'✋':I('<path d="M8 13V6a1.5 1.5 0 013 0v5M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6.5a1.5 1.5 0 013 0V15a7 7 0 01-7 7h-.5a6 6 0 01-5-2.7L3.7 15a1.5 1.5 0 012.5-1.6L8 15.5"/>'),
'⤢':I('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
'🙈':I('<path d="M3 3l18 18"/><path d="M10.6 6.1A10 10 0 0122 12a15 15 0 01-3 3.7M6.6 6.6A15 15 0 002 12s4 7 10 7a9.7 9.7 0 004-.9"/>'),
'⛶':I('<path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3"/>'),
'➖':I('<path d="M5 12h14"/>'),'➕':I('<path d="M12 5v14M5 12h14"/>'),'−':I('<path d="M5 12h14"/>'),'＋':I('<path d="M12 5v14M5 12h14"/>'),
'📜':I('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
'⟳':I('<path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 4v5h-5"/>'),
'🔒':I('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
'🔓':I('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 017.5-2"/>'),
'⏱':I('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2h5"/>'),
'⏸':I('<path d="M8 5v14M16 5v14"/>'),
'⏹':I('<rect x="6" y="6" width="12" height="12" rx="2"/>')
};
const PLAY=I('<path d="M7 4.5l12 7.5-12 7.5z" fill="currentColor"/>'),NEXT=I('<path d="M9 5l7 7-7 7"/>'),PREV=I('<path d="M15 5l-7 7 7 7"/>');
function fix(){const tb=document.getElementById('tb');if(!tb)return;
 tb.querySelectorAll('button:not(.sw)').forEach(b=>{if(b.querySelector('svg'))return;
  const t=(b.textContent||'').replace(/[︎️\s]/g,''),oc=b.getAttribute('onclick')||'';let h=null;
  if(t==='▶')h=/go\(S\.i\+1\)/.test(oc)?NEXT:PLAY;else if(t==='◀')h=PREV;else h=G[t];
  if(h)b.innerHTML=h})}
fix();try{new MutationObserver(fix).observe(document.getElementById('tb'),{childList:true,subtree:true})}catch(e){}
})();

/* student window must contain everything added above */
(function(){if(STU)return;try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}})();

/* memory saver: decoded page bitmaps are the biggest RAM cost; keep only the pages near the current slide (they decode again instantly when needed) */
setInterval(()=>{if(document.hidden||!S.pages.length)return;
 S.pages.forEach((p,k)=>{if(p.bmp&&Math.abs(k-S.i)>3&&p.blob){try{p.bmp.close()}catch(e){}p.bmp=null}});
 S.decks.forEach((d,k)=>{if(k!==S.d&&d.pages)d.pages.forEach(p=>{if(p.bmp&&p.blob){try{p.bmp.close()}catch(e){}p.bmp=null}if(p.mip){try{p.mip.close()}catch(e){}p.mip=null}if(p.hi){try{p.hi.bm.close()}catch(e){}p.hi=null}})})},2500);

/* fix black slides: decoding flag was never reset after success, so a released page could never decode again */
ensurePg=function(i){for(const k of[i,i+1,i-1,i+2]){const p=S.pages[k];if(p&&!p.bmp&&!p.dec&&p.blob){p.dec=1;createImageBitmap(p.blob).then(b=>{if(p.bmp){try{b.close()}catch(e){}}else p.bmp=b;need=1}).catch(()=>{}).finally(()=>{p.dec=0;need=1})}}};
let _nq=0;setInterval(()=>{if(!S.pages.length)return;const p=S.pages[S.i];
 if(p&&p.blob&&!p.bmp)ensurePg(S.i);
 else if(STU&&(!p||!p.blob)&&performance.now()-_nq>1200){_nq=performance.now();send({t:'need',i:S.i})}},400);

/* student renders PDF pages itself, so it no longer waits for the teacher window to load them */
if(STU){let busy=0;setInterval(async()=>{if(busy||document.hidden)return;const c=window.__SC&&window.__SC();if(!c||!c.doc||!S.pages.length)return;
 let t=null;for(const k of[0,1,-1,2,3,4,-2]){const p=S.pages[S.i+k];if(p&&!p.blob&&!p.r&&!p.srend){t=p;break}}
 if(!t)return;busy=1;t.srend=1;
 try{const idx=S.pages.indexOf(t),pg=await c.doc.getPage(idx+1),w0=pg.getViewport({scale:1}).width,vp=pg.getViewport({scale:Math.min(5,PW()/w0)}),k2=document.createElement('canvas');k2.width=vp.width;k2.height=vp.height;
  await pg.render({canvasContext:k2.getContext('2d'),viewport:vp}).promise;
  if(!t.blob){t.blob=await new Promise(r=>k2.toBlob(r,'image/jpeg',.95));t.w=k2.width;t.h=k2.height;t.bmp=await createImageBitmap(k2);t.pdf={doc:c.doc,n:idx+1};need=1;ui()}}
 catch(e){}finally{t.srend=0;busy=0}},200)}

/* mouse mirror while live sharing a website/tab: teacher pointer over the live preview shows on the student screen */
if(!STU){const md=$('media');let pend=null,raf=0;const fl=()=>{raf=0;if(pend){send(pend);pend=null}};
 md.addEventListener('pointermove',e=>{if(!LV)return;const v=$('mn');if(!v||!v.videoWidth)return;const r=v.getBoundingClientRect(),s=Math.min(r.width/v.videoWidth,r.height/v.videoHeight),cw=v.videoWidth*s,ch2=v.videoHeight*s,x0=r.left+(r.width-cw)/2,y0=r.top+(r.height-ch2)/2,fx=(e.clientX-x0)/cw,fy=(e.clientY-y0)/ch2;
  pend=(fx<0||fx>1||fy<0||fy>1)?{t:'lcur',off:1}:{t:'lcur',x:fx,y:fy};if(!raf)raf=requestAnimationFrame(fl)});
 md.addEventListener('pointerleave',()=>send({t:'lcur',off:1}))}
if(STU){const _q=ch.onmessage;ch.onmessage=async ev=>{const m=ev&&ev.data;
 if(m&&m.t==='lcur'){const cur=$('mcur');if(!cur)return;if(m.off){window.__lc=0;cur.style.display='none';return}const el=$('mn');if(!el||el.tagName!=='CANVAS'||!el.width)return;window.__lc=1;
  const sr=$('stage').getBoundingClientRect(),r=el.getBoundingClientRect(),s=Math.min(r.width/el.width,r.height/el.height),cw=el.width*s,ch2=el.height*s,px=r.left-sr.left+(r.width-cw)/2+m.x*cw,py=r.top-sr.top+(r.height-ch2)/2+m.y*ch2;
  cur.style.display='block';cur.style.transform='translate('+(px-4)+'px,'+(py-2)+'px)';return}
 if(m&&(m.t==='mx'||m.t==='pages'||m.t==='usedeck')){window.__lc=0}
 return _q(ev)}}
