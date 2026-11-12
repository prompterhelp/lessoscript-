function IT(){return /iPad|Android|Tablet/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform))}function PW(){return IT()?2600:4096}
let SRC='<!doctype html>'+document.documentElement.outerHTML;let SW=null;const $=id=>document.getElementById(id),STU=location.hash==='#student'||window.name==='lsstudent',F=$('F');
if(STU)document.body.classList.add('stu');
const ch=new BroadcastChannel('lessonstage-pro'),S={pages:[],i:0,v:{z:1,cx:.5,cy:.5},tool:'pen',color:'#ff4d6d',size:4,blank:0,ptr:null,live:null,words:0,follow:1,end:0};
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const cv=$('cv'),cx=cv.getContext('2d');let W=0,H=0,D=1,need=1,space=0;
const P=()=>S.pages[S.i],BCOK=/^https?:$/.test(location.protocol),send=m=>{if(1){m.n=Math.random();if(BCOK)ch.postMessage(m);else try{if(STU)opener&&opener.postMessage(m,'*');else SW&&!SW.closed&&SW.postMessage(m,'*')}catch(e){}}};
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1800)}
function size(){const r=$('stage').getBoundingClientRect();D=Math.min(devicePixelRatio||1,IT()?(STU?1.5:1.75):2);W=r.width;H=r.height;cv.width=W*D;cv.height=H*D;need=1}
let _rw=0,_rh=0,_rt=0;new ResizeObserver(()=>{const r=$('stage').getBoundingClientRect();if(Math.abs(r.width-_rw)<2&&Math.abs(r.height-_rh)<2)return;_rw=r.width;_rh=r.height;cancelAnimationFrame(_rt);_rt=requestAnimationFrame(size)}).observe($('stage'));
const geo=()=>{const p=P();if(!p)return null;const f=Math.min(W/p.w,H/p.h);return{p,bw:p.w*f,bh:p.h*f}};
const toS=(g,x,y)=>[W/2+(x-S.v.cx)*g.bw*S.v.z,H/2+(y-S.v.cy)*g.bh*S.v.z],toN=(g,x,y)=>[(x-W/2)/(g.bw*S.v.z)+S.v.cx,(y-H/2)/(g.bh*S.v.z)+S.v.cy];
function clampV(){const v=S.v;v.z=Math.max(1,Math.min(10,v.z));v.cx=Math.max(0,Math.min(1,v.cx));v.cy=Math.max(0,Math.min(1,v.cy));if(v.z==1){v.cx=v.cy=.5}}
function stroke(s,g){const z=S.v.z;cx.save();cx.lineCap=cx.lineJoin='round';cx.strokeStyle=s.c;cx.lineWidth=s.w*g.bw*z*(s.k=='hl'?4:1);if(s.k=='hl')cx.globalAlpha=.38;
 const Q=s.p.map(q=>toS(g,q[0],q[1])),a=Q[0],b=Q[Q.length-1];cx.beginPath();
 if(s.k=='rect')cx.rect(a[0],a[1],b[0]-a[0],b[1]-a[1]);else if(s.k=='line'){cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1])}
 else{cx.moveTo(a[0],a[1]);if(Q.length==1)cx.lineTo(a[0]+.1,a[1]);for(let i=1;i<Q.length-1;i++)cx.quadraticCurveTo(Q[i][0],Q[i][1],(Q[i][0]+Q[i+1][0])/2,(Q[i][1]+Q[i+1][1])/2);if(Q.length>1)cx.lineTo(b[0],b[1])}
 cx.stroke();cx.restore()}
function ensurePg(i){for(const k of[i,i+1,i-1,i+2]){const p=S.pages[k];if(p&&!p.bmp&&!p.dec&&p.blob){p.dec=1;createImageBitmap(p.blob).then(b=>{p.bmp=b;need=1}).catch(()=>{p.dec=0})}}}
function draw(){need=0;cx.setTransform(D,0,0,D,0,0);cx.clearRect(0,0,W,H);cx.imageSmoothingEnabled=true;cx.imageSmoothingQuality='high';const g=geo();if(!g||S.blank){if(S.blank&&STU){cx.fillStyle='#000';cx.fillRect(0,0,W,H)}return}
 const[x,y]=toS(g,0,0);if(!g.p.bmp){ensurePg(S.i);return}const dw=g.bw*S.v.z,dh=g.bh*S.v.z,bm=g.p.bmp,ix=Math.max(0,x),iy=Math.max(0,y),ex=Math.min(W,x+dw),ey=Math.min(H,y+dh);cx.imageSmoothingQuality=(performance.now()-(S.mvT||0)<160||S.live||S.ptr)?'low':'high';if(ex>ix&&ey>iy){const kx=bm.width/dw,ky=bm.height/dh;cx.drawImage(bm,(ix-x)*kx,(iy-y)*ky,(ex-ix)*kx,(ey-iy)*ky,ix,iy,ex-ix,ey-iy)}g.p.strokes.forEach(s=>stroke(s,g));if(S.live)stroke(S.live,g);
 const q=S.ptr;if(q){const[px,py]=toS(g,q.x,q.y);if(q.m=='spot'){const r=Math.min(W,H)*.16;cx.fillStyle='rgba(0,0,0,.78)';cx.beginPath();cx.rect(0,0,W,H);cx.arc(px,py,r,0,7);cx.fill('evenodd')}
 else{const gr=cx.createRadialGradient(px,py,0,px,py,18);gr.addColorStop(0,'#fff');gr.addColorStop(.25,'#ff2d55');gr.addColorStop(1,'rgba(255,45,85,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(px,py,18,0,7);cx.fill()}}}
(function loop(){if(need)draw();requestAnimationFrame(loop)})();
let vt=0;function st(){const p=P();const m={t:'st',i:S.i,v:S.v,blank:S.blank,words:S.words&&p?p.words:null};if(!vt){vt=1;setTimeout(()=>{vt=0;send(m)},33)}else{send(m)}}
function fx(){}
function go(i){if(!S.pages.length)return;S.i=Math.max(0,Math.min(S.pages.length-1,i));if(!S.keepZ)S.v={z:1,cx:.5,cy:.5};if(S.flow){const g0=geo();if(g0)S.v.cy=Math.min(H/(g0.bh*S.v.z)/2,.5)}S.live=null;S.ptr=null;ui();st();need=1}
function zoomBy(k,sx=W/2,sy=H/2){const g=geo();if(!g)return;const[nx,ny]=toN(g,sx,sy);S.v.z*=k;clampV();if(S.v.z>1){S.v.cx=nx-(sx-W/2)/(g.bw*S.v.z);S.v.cy=ny-(sy-H/2)/(g.bh*S.v.z);clampV()}need=1;st()}
function rst(){S.v={z:1,cx:.5,cy:.5};need=1;st()}
// input
const pts=new Map();let cur=null,pan=null,pin=null,lastL=0;
const mid=()=>{const a=[...pts.values()];return{x:(a[0][0]+a[1][0])/2,y:(a[0][1]+a[1][1])/2,d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}};
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.offsetX,e.offsetY]);const g=geo();if(!g)return;
 if(pts.size==2){cur=null;S.live=null;pin=mid();pin.z=S.v.z;return}
 if((STU&&S.tool=='hand')||S.tool=='hand'||space||e.button==1){pan={x:e.offsetX,y:e.offsetY,cx:S.v.cx,cy:S.v.cy};cv.style.cursor='grabbing';return}
 const[x,y]=toN(g,e.offsetX,e.offsetY),t=S.tool;
 if(t=='eraser'){cur='e';er(x,y,g);return}
 if(t=='laser'||t=='spot'){cur='p';S.ptr={x,y,m:t};send({t:'ptr',p:S.ptr});need=1;return}
 cur={k:t,c:S.color,w:S.size/(g.bw*S.v.z),p:[[x,y]]};S.live=cur;need=1};
cv.onpointermove=e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.offsetX,e.offsetY]);const g=geo();if(!g)return;
 if(pin&&pts.size==2){const m=mid(),[nx,ny]=toN(g,pin.x,pin.y);if(!(pin.d>8)||!(m.d>0))return;S.v.z=pin.z*m.d/pin.d;clampV();if(S.v.z>1){S.v.cx=nx-(m.x-W/2)/(g.bw*S.v.z);S.v.cy=ny-(m.y-H/2)/(g.bh*S.v.z);clampV()}need=1;st();return}
 if(pan){S.v.cx=pan.cx-(e.offsetX-pan.x)/(g.bw*S.v.z);S.v.cy=pan.cy-(e.offsetY-pan.y)/(g.bh*S.v.z);clampV();need=1;st();return}
 if(!cur)return;const ev=e.getCoalescedEvents?e.getCoalescedEvents():[e];
 for(const c of(ev.length?ev:[e])){const r=cv.getBoundingClientRect(),[x,y]=toN(g,c.clientX-r.left,c.clientY-r.top);
  if(cur=='e')er(x,y,g);else if(cur=='p'){S.ptr={x,y,m:S.tool};}
  else if(cur.k=='line'||cur.k=='rect')cur.p=[cur.p[0],[x,y]];else cur.p.push([x,y])}
 if(cur=='p')send({t:'ptr',p:S.ptr});else if(cur&&cur!='e'){const n=performance.now();if(n-lastL>30){lastL=n;const L=cur.p.length,K=Math.ceil(L/120);send({t:'live',s:K>1?{...cur,p:cur.p.filter((_,i)=>i%K==0||i==L-1)}:cur})}}need=1};
const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pin=null;if(pan){pan=null;cv.style.cursor=STU?'grab':''}
 if(pts.size)return;if(cur&&cur!='e'&&cur!='p'){if(cur.p.length>0){snap();P().strokes.push(cur);send({t:'add',i:S.i,s:cur})}S.live=null;send({t:'live',s:null})}
 if(cur=='p'){S.ptr=null;send({t:'ptr',p:null})}cur=null;need=1};
cv.onpointerup=cv.onpointercancel=up;
cv.addEventListener('wheel',e=>{e.preventDefault();zoomBy(Math.exp(-e.deltaY*.0018),e.offsetX,e.offsetY)},{passive:false});
cv.ondblclick=rst;
function er(x,y,g){const p=P(),th=16/(g.bw*S.v.z),n=p.strokes.length;p.strokes=p.strokes.filter(s=>!s.p.some((q,j)=>Math.hypot((q[0]-x)*g.bw,(q[1]-y)*g.bh)<th*g.bw)&&!(s.p.length>1&&mids(s).some(q=>Math.hypot((q[0]-x)*g.bw,(q[1]-y)*g.bh)<th*g.bw)));if(p.strokes.length!=n){send({t:'set',i:S.i,l:p.strokes});need=1}}
function mids(s){const o=[],a=s.p[0],b=s.p[s.p.length-1];if(s.k=='line'||s.k=='rect'){for(let k=1;k<12;k++)o.push([a[0]+(b[0]-a[0])*k/12,a[1]+(b[1]-a[1])*k/12])}if(s.k=='rect'){o.push([a[0],b[1]],[b[0],a[1]])}return o}
function undo(){const p=P();if(!p)return;p.strokes.pop();send({t:'set',i:S.i,l:p.strokes});need=1}
function clr(){const p=P();if(!p||!p.strokes.length)return;p.strokes=[];send({t:'set',i:S.i,l:[]});need=1;toast('Cleared')}
function blank(){S.blank=S.blank?0:1;$('bl').classList.toggle('on',!!S.blank);toast(S.blank?'Student screen blanked':'Student screen live');st()}
// files
async function push(c){const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.95)),bmp=await createImageBitmap(blob);S.pages.push({blob,bmp,w:c.width,h:c.height,strokes:[],notes:'',words:''})}
async function addFiles(fs){const was=S.pages.length;try{for(const f of fs){if(/\.pdf$/i.test(f.name)){const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;for(let n=1;n<=d.numPages;n++){toast('Loading page '+n+' / '+d.numPages);const pg=await d.getPage(n),w=pg.getViewport({scale:1}).width,vp=pg.getViewport({scale:Math.min(2.5,2200/w)}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;await push(c)}}
 else if(f.type.startsWith('image/')){const b=await createImageBitmap(f),c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);await push(c)}}}catch(err){toast('Could not read file')}
 if(S.pages.length>was){sendPages();go(was);toast('Ready ✓')}}
async function addBoard(){const c=document.createElement('canvas');c.width=1600;c.height=900;const x=c.getContext('2d');x.fillStyle='#fdfcf7';x.fillRect(0,0,1600,900);await push(c);sendPages();go(S.pages.length-1)}
F.onchange=()=>{addFiles([...F.files]);F.value=''};
$('stage').ondragover=e=>e.preventDefault();$('stage').ondrop=e=>{e.preventDefault();addFiles([...e.dataTransfer.files])};
function sendPages(){if(!STU)send({t:'pages',l:S.pages.map(p=>({blob:p.blob,w:p.w,h:p.h,strokes:p.strokes,r:p.rot||p.rotWant||0}))});}
// UI
function ui(){const n=S.pages.length;$('empty').style.display=n?'none':'flex';$('cnt').textContent=n?(S.i+1)+' / '+n:'';$('pg').textContent=n?'Slide '+(S.i+1)+' of '+n:'';
 if(!STU){const r=$('rail');if(r.children.length!=n){r.innerHTML='';S.pages.forEach((p,i)=>{const d=document.createElement('div');d.className='th';d.innerHTML='<img src="'+(p.url||(p.url=URL.createObjectURL(p.blob)))+'"><b>'+(i+1)+'</b>';d.onclick=()=>go(i);r.appendChild(d)})}
  [...r.children].forEach((d,i)=>d.classList.toggle('on',i==S.i));const c=r.children[S.i];c&&c.scrollIntoView({block:'nearest'});
  const p=P();$('nt').value=p?p.notes:'';$('wt').value=p?p.words:'';rw()}need=1}
function rw(){const p=P(),l=$('wl');l.innerHTML='';if(p)p.words.split('\n').filter(x=>x.trim()).forEach(x=>{const a=x.split('|').map(s=>s.trim()),d=document.createElement('div');d.className='card';d.innerHTML='<span class="ar"></span><span class="mu" style="text-align:right"></span>';d.firstChild.textContent=a[0]||'';d.lastChild.textContent=(a[1]||'')+(a[2]?' · '+a[2]:'');l.appendChild(d)})}
function wb(){$('wb').textContent=S.words?'Hide from students':'Show to students';$('wb').classList.toggle('pri',!S.words)}
$('nt').oninput=e=>{const p=P();if(p)p.notes=e.target.value};
$('wt').oninput=e=>{const p=P();if(p){p.words=e.target.value;rw();if(S.words)st()}};
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button,.pane').forEach(x=>x.classList.remove('on'));b.classList.add('on');$(b.dataset.p).classList.add('on')});
document.querySelectorAll('#tb [data-t]').forEach(b=>b.onclick=()=>{S.tool=b.dataset.t;document.querySelectorAll('#tb [data-t]').forEach(x=>x.classList.toggle('on',x==b));cv.style.cursor=S.tool=='hand'?'grab':'crosshair'});
document.querySelectorAll('#tb [data-c]').forEach(b=>b.onclick=()=>{S.color=b.dataset.c;document.querySelectorAll('#tb [data-c]').forEach(x=>x.classList.toggle('on',x==b));if(['eraser','laser','spot','hand'].includes(S.tool))document.querySelector('[data-t=pen]').click()});
$('sz').oninput=e=>S.size=+e.target.value;
function setTool(t){const b=document.querySelector('[data-t='+t+']');b&&b.click()}
function fs(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>toast('Fullscreen blocked here'))}
function zen(){document.body.classList.toggle('zen');setTimeout(size,50)}
function openStu(){const u=location.href.split('#')[0]+'#student';const w=window.open(u,'lsstudent');if(!w){navigator.clipboard&&navigator.clipboard.writeText(u);toast('Popup blocked: link copied. Open it in a new window.')}else toast('Drag that window to the student screen, then press Full screen')}
function timer(s){S.end=s?Date.now()+s*1e3:0;send({t:'tm',end:S.end});tick()}
function tick(){const e=$('tmr');if(!S.end){e.style.display='none';return}const r=Math.max(0,Math.round((S.end-Date.now())/1e3));e.style.display='block';e.textContent=String(Math.floor(r/60)).padStart(2,'0')+':'+String(r%60).padStart(2,'0');e.style.color=r<30?'#ff6b81':'';if(!r&&S.end){S.end=0;setTimeout(()=>e.style.display='none',4000)}}
setInterval(tick,500);
function pickN(){const l=$('nm').value.split('\n').map(x=>x.trim()).filter(Boolean);if(!l.length)return toast('Add names first');showPick(l[Math.random()*l.length|0],1)}
function showPick(n,own){const e=$('pick');e.firstChild.textContent=n;e.style.display='flex';if(own)send({t:'pick',n});setTimeout(()=>e.style.display='none',6000)}
$('pick').onclick=e=>{e.currentTarget.style.display='none';if(!STU)send({t:'pick',n:null})};
function showWords(t){const o=$('ovw');o.innerHTML='';if(!t){o.style.display='none';return}o.style.display='flex';t.split('\n').filter(x=>x.trim()).forEach(x=>{const a=x.split('|').map(s=>s.trim()),d=document.createElement('div');d.className='card';d.innerHTML='<span class="ar"></span><span></span>';d.firstChild.textContent=a[0]||'';d.lastChild.textContent=a[1]||'';o.appendChild(d)})}
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName)&&e.target.type!='range')return;const k=e.key.toLowerCase();
 if(k==' '){space=1;e.preventDefault()}
 if(k=='f')fs();if(STU)return;
 if(k=='arrowright'||k=='pagedown')go(S.i+1);else if(k=='arrowleft'||k=='pageup')go(S.i-1);
 else if(k=='p')setTool('pen');else if(k=='h')setTool('hl');else if(k=='e')setTool('eraser');else if(k=='l')setTool('laser');else if(k=='s'&&!e.ctrlKey)setTool('spot');else if(k=='v')setTool('hand');
 else if(k=='b')blank();else if(k=='tab'){e.preventDefault();zen()}else if(k=='+'||k=='=')zoomBy(1.25);else if(k=='-')zoomBy(.8);else if(k=='0')rst();
 else if(k=='z'&&(e.ctrlKey||e.metaKey)){e.preventDefault();undo()}else if(k=='escape'&&document.body.classList.contains('zen'))zen()});
document.addEventListener('keyup',e=>{if(e.key==' ')space=0});
// sync
ch.onmessage=async ev=>{const m=ev.data;
 if(m.t=='hello'&&!STU){sendPages();st();send({t:'tm',end:S.end});return}
 if(!STU)return;
 if(m.t=='pages'){S.pages=await Promise.all(m.l.map(async p=>({...p,bmp:null})));S.i=Math.min(S.i,S.pages.length-1);ui()}
 else if(m.t=='st'){const ch2=m.i!=S.i;S.i=m.i;S.blank=m.blank;if(S.follow||ch2){if(ch2&&!S.follow){S.follow=1;$('fol').style.display='none'}S.v=m.v}showWords(m.words);if(ch2){S.live=null;ui()}need=1}
 else if(m.t=='add'){S.pages[m.i]&&S.pages[m.i].strokes.push(m.s);S.live=null;need=1}
 else if(m.t=='set'){S.pages[m.i]&&(S.pages[m.i].strokes=m.l);need=1}
 else if(m.t=='live'){S.live=m.s;need=1}else if(m.t=='ptr'){S.ptr=m.p;need=1}
 else if(m.t=='pick'){m.n?showPick(m.n):$('pick').style.display='none'}
 else if(m.t=='tm'){S.end=m.end;tick()}};
if(STU){document.title='Student screen';send({t:'hello'});setInterval(()=>{if(!S.pages.length&&!S.media)send({t:'hello'})},2000);$('empty').querySelector('h1').textContent='Waiting for the teacher…';$('empty').querySelectorAll('.row,.mu').forEach(x=>x.remove())}
S.hist=[];S.redo=[];S.ov=null;S.media=null;const seen=new Set();
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function snap(){S.hist.push({i:S.i,l:P().strokes.slice()});if(S.hist.length>300)S.hist.shift();S.redo=[]}
function restore(a,b){const h=a.pop();if(!h)return toast('Nothing left');const p=S.pages[h.i];if(!p)return;b.push({i:h.i,l:p.strokes});p.strokes=h.l;if(h.i!=S.i)go(h.i);send({t:'set',i:h.i,l:h.l});need=1}
function undo(){restore(S.hist,S.redo)}function redo(){restore(S.redo,S.hist)}
function clr(){const p=P();if(!p||!p.strokes.length)return;snap();p.strokes=[];send({t:'set',i:S.i,l:[]});need=1;toast('Cleared · Ctrl+Z restores')}
const dseg=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy||1e-9,t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/L));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)};
function er(x,y,g){const p=P(),R=Math.max(14,S.size*2)/(g.bw*S.v.z),ar=g.bh/g.bw;const hit=s=>{let q=s.p;if(s.k=='rect'&&q.length>1){const a=q[0],b=q[1];q=[a,[b[0],a[1]],b,[a[0],b[1]],a]}if(q.length==1)return Math.hypot(x-q[0][0],(y-q[0][1])*ar)<R;for(let i=1;i<q.length;i++)if(dseg(x,y*ar,[q[i-1][0],q[i-1][1]*ar],[q[i][0],q[i][1]*ar])<R)return true;return false};
 const k=p.strokes.filter(s=>!hit(s));if(k.length!=p.strokes.length){if(!S.es){snap();S.es=1}p.strokes=k;send({t:'set',i:S.i,l:k});need=1}}
cv.addEventListener('pointerup',()=>S.es=0);
function sendPage(i){const p=S.pages[i];if(p)send({t:'page',i,p:{blob:p.blob,w:p.w,h:p.h,strokes:p.strokes}})}
async function push(c,tx){const bmp=await createImageBitmap(c),blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.95));S.pages.push({blob,bmp,w:c.width,h:c.height,strokes:[],notes:'',words:'',text:tx||''});sendPage(S.pages.length-1)}
const AR=/[\u0600-\u06FF]/;
function wrap(x,t,w){const o=[];let l='';for(const wd of t.split(/\s+/)){const m=l?l+' '+wd:wd;if(x.measureText(m).width>w&&l){o.push(l);l=wd}else l=m}o.push(l);return o}
function pptSlide(L){const c=document.createElement('canvas');c.width=1600;c.height=900;const x=c.getContext('2d');x.fillStyle='#fdfcf7';x.fillRect(0,0,1600,900);x.fillStyle='#14182a';let y=110;for(let k=0;k<L.length&&y<840;k++){const t=L[k],rtl=AR.test(t);x.direction=rtl?'rtl':'ltr';x.textAlign=rtl?'right':'left';x.font=(k?'500 38px':'700 56px')+' Inter,"Noto Naskh Arabic",sans-serif';for(const ln of wrap(x,t,1400)){if(y>850)break;x.fillText(ln,rtl?1500:100,y);y+=k?54:80}y+=12}return c}
async function addFiles(fs){const was=S.pages.length,first=()=>S.pages.length==was+1?go(was):ui();toast('Loading…');
 for(const f of fs){try{
  if(/\.pdf$/i.test(f.name)){const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
   for(let n=1;n<=d.numPages;n++){const pg=await d.getPage(n),w=pg.getViewport({scale:1}).width,vp=pg.getViewport({scale:Math.min(5,PW()/w)}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
    const r=await Promise.all([pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise,pg.getTextContent().then(t=>{let o='',y=null;for(const it of t.items){const yy=it.transform[5];if(y!==null&&Math.abs(yy-y)>3)o+='\n';o+=it.str;y=yy}return o}).catch(()=>'')]);
    await push(c,r[1]);first();toast('Loaded '+n+' / '+d.numPages)}}
  else if(/\.pptx$/i.test(f.name)){const z=await(await lz()).loadAsync(f),ks=Object.keys(z.files).filter(k=>/^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a,b)=>a.match(/\d+/)-b.match(/\d+/));
   for(const k of ks){const xml=await z.file(k).async('string'),L=xml.split('</a:p>').map(p=>(p.match(/<a:t>([^<]*)<\/a:t>/g)||[]).map(s=>s.replace(/<[^>]+>/g,'')).join('').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()).filter(Boolean);await push(pptSlide(L),L.join('\n'));first()}}
  else if(f.type.startsWith('image/')){const b=await createImageBitmap(f),c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);await push(c,'');first()}
 }catch(e){toast('Could not read '+f.name)}}
 ui();toast('Ready ✓ Open Study to build cards')}
F.onchange=()=>{addFiles([...F.files]);F.value=''};
// cards + quiz
const cards=()=>$('ct').value.split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(a=>a[0]&&a[1]),shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]),cn=()=>$('qc').textContent=cards().length+' cards';
$('ct').oninput=cn;
function extract(){const out=[],sn=new Set(),add=(a,b)=>{a=a.trim();b=b.trim();const k=a+'|'+b;if(a&&b&&a.length<70&&b.length<200&&!sn.has(k)){sn.add(k);out.push(a+' | '+b)}};
 S.pages.forEach(p=>(p.text||'').split('\n').concat((p.words||'').split('\n')).forEach(l=>{l=l.trim();if(l.length<3)return;let m=l.split('|');if(m.length>=2)return add(m[0],m[1]);m=l.match(/^(.{1,70}?)\s*(?:[:：=–—]|\s-\s)\s*(.+)$/);if(m)return add(m[1],m[2]);m=l.match(/^([\u0600-\u06FF\u064B-\u065F\s]+?)\s+([A-Za-z][^\u0600-\u06FF]*)$/)||l.match(/^([A-Za-z][^\u0600-\u06FF]*?)\s+([\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s]*)$/);if(m)add(m[1],m[2])}));
 if(!out.length)return toast('No pairs found. Use lines like: term - meaning');const t=$('ct');t.value=(t.value.trim()?t.value.trim()+'\n':'')+out.join('\n');cn();toast(out.length+' cards extracted')}
function startFC(){const c=cards();if(!c.length)return toast('Add or extract cards first');ovSet({k:'fc',c:shuf(c),i:0,f:0})}
function startQZ(){const c=cards();if(c.length<2)return toast('Need at least 2 cards');ovSet({k:'qz',i:0,r:0,q:shuf(c).slice(0,12).map(a=>{const o=shuf([a[1],...shuf(c.filter(b=>b[1]!=a[1])).slice(0,3).map(b=>b[1])]);return{q:a[0],o,a:o.indexOf(a[1])}})})}
function ovSet(o){S.ov=o;renderOv();send({t:'ov',o})}
function renderOv(){const e=$('ov'),o=S.ov;if(!o){e.style.display='none';return}e.style.display='flex';let h='';
 if(o.k=='fc')h='<div class="mu">Card '+(o.i+1)+' / '+o.c.length+'</div><div class="fcard'+(o.f?' bk':'')+'" dir="auto" '+(STU?'':'onclick="ovA(\'f\')"')+'>'+esc(o.c[o.i][o.f?1:0])+'</div>';
 else{const q=o.q[o.i];h='<div class="mu">Question '+(o.i+1)+' / '+o.q.length+'</div><div class="qq" dir="auto">'+esc(q.q)+'</div><div class="qo">'+q.o.map((t,k)=>'<div dir="auto" class="'+(o.r?(k==q.a?'ok':'no'):'')+'"><b>'+'ABCD'[k]+'</b>'+esc(t)+'</div>').join('')+'</div>'}
 if(!STU)h+='<div class="obar"><button onclick="ovA(\'p\')">◀ Prev</button><button class="pri" onclick="ovA(\'f\')">'+(o.k=='fc'?'Flip':'Reveal answer')+'</button><button onclick="ovA(\'n\')">Next ▶</button>'+(o.k=='fc'?'<button onclick="ovA(\'s\')">🔀</button>':'')+'<button onclick="ovA(\'x\')">✕ Close</button></div>';e.innerHTML=h}
function ovA(a){const o=S.ov;if(!o)return;const L=(o.c||o.q).length;if(a=='x')return ovSet(null);if(a=='f'){o.k=='fc'?o.f^=1:o.r^=1}else if(a=='n'||a=='p'){o.i=(o.i+(a=='n'?1:-1)+L)%L;o.f=o.r=0}else if(a=='s'){o.c=shuf(o.c);o.i=0;o.f=0}ovSet(o)}
// media
const yid=u=>(u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/)||[])[1];
function mDlg(){$('md').style.display=$('md').style.display=='flex'?'none':'flex'}
function mUrl(){const u=$('mu').value.trim();if(!u)return;const y=yid(u);const m=y&&/youtu/.test(u)?{type:'yt',id:y}:/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(u)?{type:'video',src:u}:/\.(png|jpe?g|gif|webp|svg|avif)(\?|#|$)/i.test(u)?{type:'img',src:u}:/^https?:\/\//i.test(u)?{type:'web',src:u}:/^[\w-]+(\.[\w-]+)+(\/|$)/.test(u)?{type:'web',src:'https://'+u}:null;if(m&&m.type==='web'){ $('md').style.display='none';addMediaTab(m);return }mSet(m)}
function mFile(f){if(f)mSet({type:f.type.startsWith('video')?'video':'img',blob:f,src:URL.createObjectURL(f)})}
function mSet(m){if(!m)return toast('Paste a website, YouTube, video or image link');$('md').style.display='none';if(m.type==='web'){addMediaTab(m);return}mOpen(m);sendMedia()}
function sendMedia(){const m=S.media;if(m){const s={...m};if(m.blob)delete s.src;send({t:'media',m:s})}}
function mOpen(m){S.media=m;const e=$('media');e.innerHTML='';e.style.display='flex';let n;
 if(m.type=='yt'){n=document.createElement('iframe');n.referrerPolicy='strict-origin-when-cross-origin';n.src=ytSrc(m.id);n.allow='autoplay;fullscreen;encrypted-media';n.allowFullscreen=true}
 else if(m.type=='web'){n=document.createElement('div');let H=m.src;try{H=new URL(m.src).hostname}catch(x){}
  n.style.cssText='display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;width:100%;height:100%;background:#0b1220;color:#fff;text-align:center;padding:24px;font-family:sans-serif';
  n.innerHTML='<div style="font-size:clamp(28px,5vw,56px);font-weight:800">🌐 '+H+'</div><div style="opacity:.7;word-break:break-all;max-width:90%">'+m.src+'</div><a href="'+m.src+'" target="_blank" rel="noopener" style="background:#2ee59d;color:#062;padding:18px 36px;border-radius:14px;font-weight:800;font-size:clamp(20px,3vw,32px);text-decoration:none">↗ Open website</a><button class="btn" id="wtry">Try showing it here</button>'+(STU?'':'<button class="btn pri" onclick="liveStart()">🖥 Share this site live (works for every site)</button>');
  setTimeout(()=>{const t=n.querySelector('#wtry');if(t)t.onclick=()=>{const f=document.createElement('iframe');f.name=STU?'lsstu':'lstea';f.src=m.src;f.allow='fullscreen;autoplay';f.allowFullscreen=true;f.id='mn';f.style.cssText='width:100%;height:100%;border:0;background:#0b0d14';n.replaceWith(f)}},0)}
 else{n=document.createElement(m.type=='video'?'video':'img');n.src=m.src;if(m.type=='video')n.playsInline=true}
 n.id='mn';e.appendChild(n);
 if(!STU){const b=document.createElement('div');b.id='mbar';b.innerHTML=(m.type=='web'?'<button onclick="window.open(S.media.src,\'_blank\')">↗ Open in tab</button>':m.type=='img'?'':'<button onclick="mc(\'play\')">▶</button><button onclick="mc(\'pause\')">⏸</button>'+(m.type=='video'?'<button onclick="mc(\'back\')">−10s</button><button onclick="mc(\'fwd\')">+10s</button><input type="range" id="msk" min="0" max="1000" value="0" oninput="mc(\'seek\',this.value/1000)">':'')+'<button onclick="mc(\'restart\')">↺</button><button onclick="mute()">🔊</button>')+'<button onclick="closeMedia()">✕ Close</button>';e.appendChild(b);if(m.type=='video')n.ontimeupdate=()=>{const k=$('msk');if(k&&n.duration)k.value=n.currentTime/n.duration*1000}}}
function yt(f,a){const n=$('mn');n&&n.contentWindow&&n.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:a||[]}),'*')}
function mcApply(a,v){const n=$('mn');if(!n||!S.media)return;if(S.media.type=='yt'){if(a=='play')yt('playVideo');else if(a=='pause')yt('pauseVideo');else if(a=='restart'){yt('seekTo',[0,true]);yt('playVideo')}}
 else if(S.media.type=='video'){if(a=='play')n.play().catch(()=>toast('Click this window once to allow sound'));else if(a=='pause')n.pause();else if(a=='back')n.currentTime-=10;else if(a=='fwd')n.currentTime+=10;else if(a=='restart'){n.currentTime=0;n.play()}else if(a=='seek')n.currentTime=v*n.duration}}
function mc(a,v){mcApply(a,v);send({t:'mc',a,v})}
function mute(){const n=$('mn');if(!n)return;if(S.media.type=='yt'){S.mu=!S.mu;yt(S.mu?'mute':'unMute')}else n.muted=!n.muted}
function closeMedia(){document.body.classList.remove('hasweb');const d=S.decks[S.d];if(d&&d.mediaTab)closeDeck(S.d);else mClose(1)}
function mClose(own){document.body.classList.remove('hasweb');S.mkey=null;$('media').style.display='none';$('media').innerHTML='';S.media=null;if(own)send({t:'mx'})}
// sync wrapper + student window
const old=ch.onmessage;
ch.onmessage=async ev=>{const m=ev.data;if(m.n){if(seen.has(m.n))return;seen.add(m.n)}
 if(m.t=='hello'&&!STU){await old(ev);send({t:'ov',o:S.ov});sendMedia();return}
 if(!STU)return;
 if(m.t=='page'){const p=m.p;S.pages[m.i]={...p,bmp:null};ui()}
 else if(m.t=='ov'){S.ov=m.o;renderOv()}
 else if(m.t=='media'){const s=m.m,k=s.type+'|'+(s.id||s.src||(s.blob?s.blob.size+s.blob.type:''));if(S.media&&S.mkey===k&&$('media').style.display!=='none')return;S.mkey=k;if(s.blob)s.src=URL.createObjectURL(s.blob);mOpen(s)}
 else if(m.t=='mc')mcApply(m.a,m.v);else if(m.t=='mx')mClose();else if(m.t=='frame'){const n=$('mn');if(n&&n.tagName=='IMG'){const u=URL.createObjectURL(m.b);const o=n.src;n.onload=()=>{if(o.startsWith('blob:'))URL.revokeObjectURL(o)};n.src=u}}else old(ev)};
addEventListener('message',e=>{if(e.data&&e.data.t&&(STU?e.source===opener:SW&&e.source===SW))ch.onmessage({data:e.data})});
function openStu(){const u=URL.createObjectURL(new Blob([SRC],{type:'text/html'}))+'#student';SW=window.open(u,'lsstudent');if(!SW)return toast('Popup blocked: allow popups for this page, then try again');toast('Move that window to the student screen, click it, press Full screen')}
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName))return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&(k=='y'||(k=='z'&&e.shiftKey))){e.preventDefault();e.stopImmediatePropagation();redo()}},true);

