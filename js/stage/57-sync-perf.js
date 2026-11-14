/* ===== sync + lag fix: coalesce view/pointer updates, never replay stacked reactions ===== */
(function(){
if(typeof ch==='undefined'||typeof st!=='function'){console.warn('57-sync-perf: stage core not found, patch skipped');return}
/* 1) outgoing view updates: real throttle, always send the LATEST state (old code sent every call) */
let sT=0,sLast=0;
st=function(){if(sT)return;const w=Math.max(0,33-(performance.now()-sLast));sT=setTimeout(()=>{sT=0;sLast=performance.now();const p=P();send({t:'st',i:S.i,v:{z:S.v.z,cx:S.v.cx,cy:S.v.cy},blank:S.blank,words:S.words&&p?p.words:null})},w)};
/* 2) incoming: keep only the latest st / live / ptr and handle it once per frame (timer fallback when the window is hidden) */
const prev=ch.onmessage,hold={},HOT=['st','live','ptr'];let ft=0,rf=0;
const flush=()=>{ft&&clearTimeout(ft);rf&&cancelAnimationFrame(rf);ft=rf=0;for(const t of HOT){const m=hold[t];if(m){hold[t]=null;try{prev({data:m})}catch(e){}}}};
/* 3) reactions: dropped while hidden, max one every 150 ms, so nothing piles up and bursts on return */
let fxT=0;
ch.onmessage=ev=>{const m=ev&&ev.data;if(!m)return prev(ev);
 if(m.t==='fx'){const n=performance.now();if(document.hidden||document.visibilityState==='hidden'||n-fxT<150)return;fxT=n;return prev(ev)}
 if(HOT.includes(m.t)){
  if(m.t==='st'&&hold.st&&hold.st.i!==m.i)flush(); /* page change is never skipped */
  hold[m.t]=m;if(!rf)rf=requestAnimationFrame(flush);if(!ft)ft=setTimeout(flush,120);return}
 if(m.t==='add'||m.t==='set')flush();
 return prev(ev)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)flush()});
})();
