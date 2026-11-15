/* student window: reactions behave exactly like the main window; drag always moves when not drawing */
(function(){if(!STU)return;
const fx=k=>{const m={t:'fx',k,n:Math.random()};try{ch.onmessage({data:{...m,n:Math.random()}})}catch(e){}send(m)};
const RB=document.getElementById('rbar');
if(RB)RB.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopImmediatePropagation();e.preventDefault();fx(b.dataset.k)},true);
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
 const k={'1':'heart','2':'like','3':'clap','4':'fire','5':'confetti','6':'fireworks','7':'stars','8':'laugh'}[e.key];if(k){e.stopImmediatePropagation();fx(k)}},true);
})();

/* smooth, slower wheel scrolling + Ctrl/Alt/pinch zoom */
(function(){let PX=0,PY=0,ZL=0,raf=0,ZX=null,ZY=null;
function tick(){raf=0;const nw=performance.now(),dt=Math.min(40,nw-(tick.t||nw-16));tick.t=nw;const a=1-Math.exp(-dt/65);const g=geo();if(!g){PX=PY=ZL=0;return}let ch=0;
 if(Math.abs(ZL)>.002){const p=ZL*a;ZL-=p;zoomBy(Math.exp(p),ZX,ZY);ch=1}else ZL=0;
 if(Math.abs(PY)>.3||Math.abs(PX)>.3){const fy=PY*a,fx=PX*a;PY-=fy;PX-=fx;const g2=geo();S.v.cy+=fy/(g2.bh*S.v.z);S.v.cx+=fx/(g2.bw*S.v.z);clampV();need=1;st();ch=1}else{PX=PY=0}
 if(ch||PX||PY||ZL)raf=requestAnimationFrame(tick)}
const go1=()=>{if(!raf){tick.t=0;raf=requestAnimationFrame(tick)}};window.smZoom=l=>{ZL+=l;ZX=ZY=null;go1()};
window.smoothWheel=function(e){if(e.target.closest&&e.target.closest('#media,#ov'))return;if(!geo())return;
 const zk=e.ctrlKey||e.altKey||e.metaKey;if(!zk&&!S.flow)return;
 e.preventDefault();e.stopImmediatePropagation();const k=e.deltaMode==1?16:e.deltaMode==2?400:1;
 if(zk){const r=$('stage').getBoundingClientRect();ZX=e.clientX-r.left;ZY=e.clientY-r.top;ZL+=Math.max(-.6,Math.min(.6,-e.deltaY*k*.004))}
 else{PY+=Math.max(-150,Math.min(150,e.deltaY*k))*.6;PX+=Math.max(-150,Math.min(150,e.deltaX*k))*.6}
 go1()}})();

if(STU)setTimeout(()=>{const tb=$('tb');[...tb.children].forEach(h=>{if(h.tagName=='HR'){const p=h.previousElementSibling;if(!p||p.tagName=='HR')h.remove()}})},300);
/* reactions sent while this window is hidden: keep only the last 3 (different kinds), replay them one by one when you come back - never all at once */
(function(){const pf=ch.onmessage;let q=[];
 ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t=='fx'&&(document.hidden||document.visibilityState==='hidden')){q=q.filter(x=>x.m.k!==m.k);q.push({m,t:Date.now()});if(q.length>3)q.shift();return}return pf(ev)};
 document.addEventListener('visibilitychange',()=>{if(document.hidden||!q.length)return;const L=q.filter(x=>Date.now()-x.t<6000);q=[];L.forEach((x,i)=>setTimeout(()=>{if(!document.hidden)pf({data:{...x.m,n:Math.random()}})},400+i*450))})})();
/* a press/drag that was cut off by switching windows must not stay "held" (it made this window ignore the other window's page changes) */
(function(){const rs=()=>{try{pts.clear();pin=null;pan=null}catch(e){}};addEventListener('blur',rs);document.addEventListener('visibilitychange',()=>{if(document.hidden)rs()})})();
/* while you are moving this window, ignore view updates coming from the other one (no tug of war) */
/* (the update that was ignored is NOT lost: the newest one is applied right after you stop moving) */
(function(){const pf=ch.onmessage;let late=null,lt=0;ch.onmessage=ev=>{const m=ev&&ev.data;
 if(m&&m.t=='st'){if(pts.size||performance.now()-(S.own||0)<500){late=ev;clearTimeout(lt);lt=setTimeout(()=>{const e=late;late=null;if(e&&!pts.size)pf(e)},560);return}late=null;clearTimeout(lt)}
 return pf(ev)}})();