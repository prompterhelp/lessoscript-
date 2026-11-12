S.flow=true;
const _clFlow=clampV;
clampV=function(){const n=S.pages.length;if(!S.flow||!n)return _clFlow();
 const v=S.v;v.z=Math.max(1,Math.min(10,v.z));let g=geo();if(!g)return;let moved=0;
 while(v.cy>1&&S.i<n-1){const g1=geo();S.i++;const g2=geo();v.cy=(v.cy-1)*g1.bh/g2.bh;v.cx=.5+(v.cx-.5)*g1.bw/g2.bw;moved=1}
 while(v.cy<0&&S.i>0){const g1=geo();S.i--;const g2=geo();v.cy=1+v.cy*g1.bh/g2.bh;v.cx=.5+(v.cx-.5)*g1.bw/g2.bw;moved=1}
 g=geo();const vw=W/(g.bw*v.z),vh=H/(g.bh*v.z),lo=Math.min(vh/2,.5);
 v.cx=vw>=1?.5:Math.max(vw/2,Math.min(1-vw/2,v.cx));
 if(S.i==0&&v.cy<lo)v.cy=lo;if(S.i==n-1&&v.cy>1-lo)v.cy=1-lo;
 if(moved){S.live=null;ui();try{want()}catch(e){}}};
function drawNb(dir){const p2=S.pages[S.i+dir];if(!p2)return;if(!p2.bmp){try{ensurePg(S.i)}catch(e){}return}
 const g1=geo(),f2=Math.min(W/p2.w,H/p2.h),g2={p:p2,bw:p2.w*f2,bh:p2.h*f2},v=S.v,z=v.z,sv=S.v;
 S.v={z,cx:.5+(v.cx-.5)*g1.bw/g2.bw,cy:dir>0?(v.cy-1)*g1.bh/g2.bh:1+v.cy*g1.bh/g2.bh};
 try{cx.imageSmoothingQuality=(performance.now()-(S.mvT||0)<250)?'low':'high';const mv=performance.now()-(S.mvT||0)<250;const[x,y]=toS(g2,0,0),dw=g2.bw*z,dh=g2.bh*z;if(y<H&&y+dh>0&&x<W&&x+dw>0){const ix=Math.max(0,x),iy=Math.max(0,y),ex=Math.min(W,x+dw),ey=Math.min(H,y+dh),bm=p2.bmp,kx=bm.width/dw,ky=bm.height/dh;
  if(ex>ix&&ey>iy){cx.drawImage(bm,(ix-x)*kx,(iy-y)*ky,(ex-ix)*kx,(ey-iy)*ky,ix,iy,ex-ix,ey-iy);cx.save();cx.beginPath();cx.rect(ix,iy,ex-ix,ey-iy);cx.clip();if(!mv)p2.strokes.forEach(s=>stroke(s,g2));cx.restore()}}}
 finally{S.v=sv}}
const _stF=st;let _stT=0,_stL=0;st=function(){S.mvT=performance.now();S.own=S.mvT;const gp=STU?70:45,n=S.mvT;if(n-_stL>=gp){_stL=n;_stF()}else if(!_stT){_stT=setTimeout(()=>{_stT=0;_stL=performance.now();_stF()},gp-(n-_stL))}};
const _drFlow=draw;
draw=function(){_drFlow();if(!S.flow||S.blank||!geo())return;cx.setTransform(D,0,0,D,0,0);drawNb(1);drawNb(-1)};
function flowTick(AU){const n=S.pages.length,g=geo();if(!g||!n)return;const v=S.v;v.cy+=AU.d*50/(AU.s*1000);
 const lo=Math.min(H/(g.bh*v.z)/2,.5);
 if(AU.d>0&&S.i==n-1&&v.cy>1-lo){S.i=0;const g2=geo();v.cy=Math.min(H/(g2.bh*v.z)/2,.5);ui()}
 else if(AU.d<0&&S.i==0&&v.cy<lo){S.i=n-1;const g2=geo();v.cy=1-Math.min(H/(g2.bh*v.z)/2,.5);ui()}
 else clampV();
 need=1;st()}
$('stage').addEventListener('wheel',e=>{window.smoothWheel&&window.smoothWheel(e)},{capture:true,passive:false});
(function(){const tb=$('tb');
 const b=document.createElement('button');b.title='Flow: pages scroll continuously (wheel / drag). Ctrl+wheel = zoom';b.textContent='📜';b.classList.add('on');
 const upd=()=>{b.classList.toggle('on',!!S.flow)};
 b.onclick=()=>{S.flow=!S.flow;const a=tb.querySelector('[title^="Auto page turn"]');if(a&&a.classList.contains('on'))a.click();upd();clampV();need=1;st();send({t:'flow',v:S.flow});toast(S.flow?'Pages flow continuously':'One page at a time')};
 tb.insertBefore(b,tb.querySelector('[title^="Rotate"]'));const zo=document.createElement('button');zo.textContent='➖';zo.title='Zoom out';zo.onclick=()=>window.smZoom?smZoom(-Math.log(1.3)):zoomBy(1/1.3);const zi=document.createElement('button');zi.textContent='➕';zi.title='Zoom in';zi.onclick=()=>window.smZoom?smZoom(Math.log(1.3)):zoomBy(1.3);tb.insertBefore(zo,b);tb.insertBefore(zi,b);
 const seenF=new Set(),pv=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;if(m&&m.t=='flow'){if(m.n){if(seenF.has(m.n))return;seenF.add(m.n)}S.flow=!!m.v;upd();clampV();need=1;return}return pv(ev)};
 if(STU){const h=document.createElement('div');h.id='hdl';h.title='Tools';h.onclick=()=>{window.__pin=true;document.body.classList.add('tbon')};document.body.appendChild(h);
  document.body.classList.add('tbon');setTimeout(()=>{if(!window.__pin)document.body.classList.remove('tbon')},5000)}
})();
