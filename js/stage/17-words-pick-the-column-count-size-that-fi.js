/* words: pick the column count + size that fills the screen best (no overflow, no clipping) */
(function(){
  function fitWords(root){
    if(!root)return;if(root.id==='wprev'&&!document.body.classList.contains('po'))return;const w=root.querySelector('.wvin');if(!w)return;
    const cs=getComputedStyle(root),pl=parseFloat(cs.paddingLeft)||0,pr=parseFloat(cs.paddingRight)||0,pt=parseFloat(cs.paddingTop)||0,pb=parseFloat(cs.paddingBottom)||0;
    const AW=root.clientWidth-pl-pr,AH=root.clientHeight-pt-pb;if(AW<30||AH<30)return;
    const n=+w.dataset.n||1,maxC=Math.min(n,5);let best={u:0,c:1};
    const fits=(u,c)=>{w.style.setProperty('--cols',c);w.style.setProperty('--u',u+'px');return w.offsetHeight<=AH+1};
    for(let c=1;c<=maxC;c++){
      if(innerWidth<innerHeight&&c>2)break;
      let lo=7,hi=Math.min(AW,AH)*.17;
      if(!fits(lo,c))continue;
      for(let i=0;i<13;i++){const m=(lo+hi)/2;fits(m,c)?lo=m:hi=m}
      if(lo>best.u*1.03)best={u:lo,c};
    }
    if(!best.u)best={u:7,c:Math.min(n,3)};
    w.style.setProperty('--cols',best.c);w.style.setProperty('--u',best.u+'px');
  }
  window.fitWords=fitWords;
  const _s=showWords;showWords=function(t){_s(t);if(t)fitWords($('ovw'))};
  const _r=rw;rw=function(){_r();fitWords($('wprev'))};
  const refit=()=>{fitWords($('ovw'));fitWords($('wprev'))};
  try{const ro=new ResizeObserver(()=>requestAnimationFrame(refit));ro.observe($('ovw'));ro.observe($('wprev'))}catch(e){}
  addEventListener('resize',()=>setTimeout(refit,150));
  try{document.fonts&&document.fonts.ready.then(refit)}catch(e){}
  if(!STU)try{rw()}catch(e){}
})();

/* zoom: once zoomed, the page always fills the view (no black sides) and every page edge is reachable */
(function(){
  if(STU)return;
  const base=clampV;
  clampV=function(){
    const v=S.v;v.z=Math.max(1,Math.min(10,v.z));const g=geo();
    if(g&&v.z>1.001){const cov=Math.max(W/g.bw,H/g.bh);if(cov>1.001&&v.z<cov&&!pts.size)v.z=(S.pz>v.z)?1:cov}
    S.pz=v.z;return base();
  };
  setInterval(()=>{if(S.v.z<=1.001)S.pz=1},150);
})();

/* website zoom with Ctrl + mouse wheel / trackpad pinch / Ctrl +,-,0 (also when the mouse is over the website itself) */
(function(){
  if(STU)return;
  const isWeb=()=>S.media&&S.media.type==='web';
  let acc=1,raf=0;
  const push=k=>{acc*=k;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const a=acc;acc=1;if(isWeb())zoomBy(a)})};
  // events that reach this page
  addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&isWeb()){e.preventDefault();push(Math.exp(-Math.max(-80,Math.min(80,e.deltaY))*.001))}},{passive:false,capture:true});
  addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||!isWeb())return;
    if(e.key==='+'||e.key==='='){e.preventDefault();push(1.1)}else if(e.key==='-'||e.key==='_'){e.preventDefault();push(1/1.1)}else if(e.key==='0'){e.preventDefault();rst()}},true);
  // events inside the proxied website (sent by the Worker script)
  addEventListener('message',e=>{const d=e.data,n=document.querySelector('#media iframe#mn');
    if(!d||!n||e.source!==n.contentWindow||!isWeb())return;
    if(typeof d.lsz==='number')push(Math.exp(Math.max(-80,Math.min(80,d.lsz))*.001));
    else if(d.lszk){const k=d.lszk;if(k==='+'||k==='=')push(1.1);else if(k==='-'||k==='_')push(1/1.1);else if(k==='0')rst()}});
})();

/* slides: slower Ctrl+wheel zoom, Shift+wheel / trackpad = move sideways, wheel = move up/down (or change slide when not zoomed) */
(function(){
  if(STU)return;
  let wl=0;
  addEventListener('wheel',e=>{
    if(S.media||!e.target.closest||!e.target.closest('#stage'))return;
    const g=geo();if(!g)return;
    e.preventDefault();e.stopPropagation();
    if(e.ctrlKey||e.metaKey){
      const r=cv.getBoundingClientRect(),d=Math.max(-80,Math.min(80,e.deltaY));
      zoomBy(Math.exp(-d*.0014),e.clientX-r.left,e.clientY-r.top);return}
    let dx=e.deltaX,dy=e.deltaY;
    if(e.shiftKey&&!dx){dx=dy;dy=0}
    if(S.v.z>1.001){panBy(dx/(g.bw*S.v.z),dy/(g.bh*S.v.z))}
    else if(dy){const n=Date.now();if(n-wl<350||Math.abs(dy)<4)return;wl=n;go(S.i+(dy>0?1:-1))}
  },{passive:false,capture:true});
})();
