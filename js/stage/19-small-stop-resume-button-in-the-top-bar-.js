/* small Stop/Resume button in the top bar (not over the lesson) */
(function(){
  if(STU)return;
  const old=document.getElementById('stopshare2');if(old)old.remove();
  const top=document.querySelector('.top');if(!top)return;
  const b=document.createElement('button');b.id='stopTop';b.className='btn';b.title='Stop showing this to students (click again to resume)';
  const stu=[...top.querySelectorAll('button')].find(x=>/Student screen/.test(x.textContent));
  top.insertBefore(b,stu||null);
  b.onclick=()=>{
    if(S.blank){blank();return}
    let did=0;
    if(S.media||(typeof LV!=='undefined'&&LV)){try{closeMedia()}catch(e){try{mClose(1)}catch(_){}}did=1}
    if(S.ov){ovSet(null);did=1}
    if(S.words){S.words=0;try{wb()}catch(e){}st();did=1}
    if(!did&&S.pages.length)blank();
    toast(did?'Stopped sharing':'Student screen blanked');
  };
  setInterval(()=>{const on=S.pages.length||S.media||(typeof LV!=='undefined'&&LV);
    b.style.display=on?'inline-flex':'none';
    b.textContent=S.blank?'▶ Resume':'⏹ Stop';b.style.background=S.blank?'#12b886':'#e11d48'},300);
})();

/* website zoom, no Worker needed: holding Ctrl puts an invisible layer over the website so the wheel can zoom it */
(function(){
  if(STU)return;
  const isWeb=()=>S.media&&S.media.type==='web';
  const shield=on=>{const m=document.getElementById('media');if(!m)return;let s=document.getElementById('wshield');
    if(on&&isWeb()){if(!s){s=document.createElement('div');s.id='wshield';
      s.addEventListener('mousemove',e=>{if(!e.ctrlKey&&!e.metaKey)shield(false)});
      s.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)shield(false)},{passive:true});
      m.appendChild(s)}}
    else if(s)s.remove()};
  addEventListener('keydown',e=>{if((e.key==='Control'||e.key==='Meta')&&isWeb())shield(true)},true);
  addEventListener('keyup',e=>{if(e.key==='Control'||e.key==='Meta')shield(false)},true);
  addEventListener('blur',()=>shield(false));
  // tell the teacher when the Worker helper inside the website is live
  addEventListener('message',e=>{const n=document.querySelector('#media iframe#mn');
    if(e.data&&e.data.lsready&&n&&e.source===n.contentWindow){const o=document.getElementById('lsload');o&&o.remove()}});
})();

/* files: zoom toward the mouse (to the sides / corners), smooth steps, view never leaves the page, Right-drag or Alt-drag moves the page */
(function(){
  const _zw=zoomBy;   // handles websites; keep it for them
  zoomBy=function(k,sx,sy){
    if(S.media&&S.media.type==='web')return _zw(k,sx,sy);
    const g=geo();if(!g)return;
    if(sx==null){sx=W/2;sy=H/2}
    const p=toN(g,sx,sy);
    S.v.z*=k;clampV();
    if(S.v.z>1){S.v.cx=p[0]-(sx-W/2)/(g.bw*S.v.z);S.v.cy=p[1]-(sy-H/2)/(g.bh*S.v.z);clampV()}
    need=1;st();
  };
  // no jumping: smooth zoom, never shows outside the page when it is bigger than the view
  clampV=function(){
    const v=S.v;v.z=Math.max(1,Math.min(10,v.z));const g=geo();
    if(!g||v.z<=1.001){v.z=Math.max(1,v.z);if(v.z<=1.001){v.cx=v.cy=.5}return}
    const vw=W/(g.bw*v.z),vh=H/(g.bh*v.z);
    v.cx=vw>=1?.5:Math.max(vw/2,Math.min(1-vw/2,v.cx));
    v.cy=vh>=1?.5:Math.max(vh/2,Math.min(1-vh/2,v.cy));
  };
  if(STU)return;
  // move the zoomed page with the mouse: Right button or Alt + drag (no tool switching needed)
  const stg=document.getElementById('stage');let on=0;
  stg.addEventListener('pointerdown',e=>{if(e.button===2||e.altKey){space=1;on=1}},true);
  addEventListener('pointerup',()=>{if(on){space=0;on=0}},true);
  addEventListener('pointercancel',()=>{if(on){space=0;on=0}},true);
  stg.addEventListener('contextmenu',e=>e.preventDefault());
})();

/* smooth (not instant) zoom + pan, sharper once movement stops */
(function(){
  const _zi=zoomBy;let tz=null,ax=0,ay=0,raf=0,px=0,py=0,pr=0;
  zoomBy=function(k,sx,sy){
    if(STU||(S.media&&S.media.type==='web'))return _zi(k,sx,sy);
    if(!geo())return;
    if(tz==null)tz=S.v.z;
    tz=Math.max(1,Math.min(10,tz*k));ax=sx==null?W/2:sx;ay=sy==null?H/2:sy;
    if(!raf)raf=requestAnimationFrame(zstep)};
  function zstep(){raf=0;const d=tz/S.v.z;
    if(Math.abs(d-1)<.004){_zi(d,ax,ay);tz=null;return}
    _zi(Math.pow(d,.55),ax,ay);raf=requestAnimationFrame(zstep)}
  window.panBy=function(dx,dy){px+=dx;py+=dy;if(!pr)pr=requestAnimationFrame(pstep)};
  function pstep(){pr=0;const a=px*.5,b=py*.5;px-=a;py-=b;S.v.cx+=a;S.v.cy+=b;clampV();need=1;st();
    if(Math.abs(px)+Math.abs(py)>1e-4)pr=requestAnimationFrame(pstep);else px=py=0}
  const _r=rst;rst=function(){tz=null;px=py=0;return _r()};
  const _g=go;go=function(i){tz=null;px=py=0;return _g(i)};
  const _c=clampV;clampV=function(){S.mvT=performance.now();S.hq=0;return _c()};
  setInterval(()=>{if(S.mvT&&!S.hq&&performance.now()-S.mvT>230){S.hq=1;need=1}},120);
})();
