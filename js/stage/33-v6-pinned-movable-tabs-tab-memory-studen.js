/* ===== v6: pinned/movable tabs, tab memory, student tab bar, mouse mirror, student page cache + sharp zoom ===== */
(function(){
const uid=()=>Math.random().toString(36).slice(2,10),did=d=>d.id||(d.id=uid()),LSK='ls_pins_v1';
const kA=m=>m.type+'|'+(m.id||m.src||'');

/* ---- keep website/video tabs alive (no reload, no white page when you come back) ---- */
(function(){const KEEP=new Map();window.__KEEP=KEEP;
 const hideKept=e=>{[...e.children].forEach(c=>{if(c.dataset&&c.dataset.keep){c.style.display='none';const x=c.querySelector('#mn');if(x){x.dataset.was='mn';x.removeAttribute('id')}}else c.remove()})};
 const _mO=mOpen,_mC=mClose;
 mOpen=function(m){const e=$('media'),keepable=(m.type==='web'||m.type==='yt')&&!m.blob,k=kA(m);hideKept(e);
  const w=keepable?KEEP.get(k):null,got=[];
  Object.defineProperty(e,'innerHTML',{set(){},get(){return''},configurable:true});e.appendChild=x=>{got.push(x);return x};
  try{_mO(m)}finally{delete e.innerHTML;delete e.appendChild}
  const n=got[0],b=got[1];if(!n)return;
  if(keepable&&w&&w.parentNode===e){w.style.display='contents';const x=w.querySelector('[data-was=mn]');if(x){x.id='mn';x.removeAttribute('data-was')}if(b)e.appendChild(b);return}
  if(keepable){const wr=document.createElement('div');wr.dataset.keep='1';wr.style.display='contents';wr.appendChild(n);e.appendChild(wr);KEEP.set(k,wr)}else e.appendChild(n);
  if(b)e.appendChild(b)};
 mClose=function(own){const e=$('media');document.body.classList.remove('hasweb');S.mkey=null;hideKept(e);e.style.display='none';S.media=null;if(own)send({t:'mx'})};
 window.__mkill=k=>{const w=KEEP.get(k);if(w){w.remove();KEEP.delete(k)}};
})();

/* ---- teacher side ---- */
if(!STU){
 const _sP=sendPage;sendPage=function(i){const p=S.pages[i];if(p&&p.blob)p.sent=1;_sP(i)};
 function sendSrc(d){if(!d||d.mediaTab||!d.src||d.srcSent)return;d.srcSent=1;try{send({t:'src',id:did(d),f:d.src})}catch(e){d.srcSent=0}}
 sendPages=function(){const d=S.decks[S.d],dk=d&&!d.mediaTab?d:null;
  if(dk&&dk.sentOnce&&S.pages.length&&S.pages.every(p=>p.sent&&p.blob)){send({t:'usedeck',id:did(dk)});return}
  send({t:'pages',id:dk?did(dk):null,l:S.pages.map(p=>({blob:p.blob,w:p.w,h:p.h,strokes:p.strokes,r:p.rot||p.rotWant||0}))});
  S.pages.forEach(p=>{if(p.blob)p.sent=1});if(dk){dk.sentOnce=1;sendSrc(dk)}};
 const _af=addFiles;addFiles=async function(fs,fl){for(const f of [...fs]){await _af([f],fl);if(/\.pdf$/i.test(f.name)){const d=S.decks[S.d];if(d&&!d.mediaTab&&!d.src){d.src=f;if(S.pages.length)sendSrc(d)}}}};
 /* tabs: render with drag + pin, tell the student window */
 let dragK=null;
 const savePins=()=>{try{localStorage.setItem(LSK,JSON.stringify(S.decks.filter(d=>d.pinned).map(d=>d.mediaTab?(d.media&&!d.media.blob?{k:'m',name:d.name,media:d.media}:null):(d.key||d.ghost?{k:'f',name:d.name,id:d.ghost||d.key}:null)).filter(Boolean)))}catch(e){}};
 const sendTabs=()=>send({t:'tabs',l:S.decks.map(d=>({n:(d.mediaTab?'🌐 ':'')+d.name,p:d.pinned?1:0})),a:S.d});
 function moveDeck(a,b){if(a==null||a===b||!S.decks[a])return;const cur=S.decks[S.d],[d]=S.decks.splice(a,1);S.decks.splice(b,0,d);S.d=cur?S.decks.indexOf(cur):-1;savePins();dtabs()}
 function togglePin(d){d.pinned=!d.pinned;if(d.pinned){const i=S.decks.indexOf(d),cur=S.decks[S.d];S.decks.splice(i,1);let j=0;while(j<S.decks.length&&S.decks[j].pinned)j++;S.decks.splice(j,0,d);S.d=cur?S.decks.indexOf(cur):-1;toast('Pinned: this tab comes back next time')}savePins();dtabs()}
 dtabs=function(){const e=$('dtabs');e.innerHTML='';
  S.decks.forEach((d,k)=>{const b=document.createElement('div');b.className='dt'+(k==S.d?' on':'')+(d.pinned?' pin':'');b.draggable=true;
   b.innerHTML='<span></span><i class="pn" title="Pin this tab (kept for next time)">📌</i>'+(d.pinned?'':'<i class="x" title="Close">✕</i>');
   b.firstChild.textContent=(d.mediaTab?'🌐 ':'')+d.name;
   b.onclick=ev=>{const t=ev.target;if(t.classList.contains('x'))closeDeck(k);else if(t.classList.contains('pn'))togglePin(d);else if(k!=S.d)openDeck(k)};
   b.ondragstart=ev=>{dragK=k;b.classList.add('drag');try{ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',String(k))}catch(_){}};
   b.ondragend=()=>{b.classList.remove('drag');[...e.children].forEach(x=>x.classList.remove('over'))};
   b.ondragover=ev=>{ev.preventDefault();b.classList.add('over')};b.ondragleave=()=>b.classList.remove('over');
   b.ondrop=ev=>{ev.preventDefault();const a=dragK;dragK=null;moveDeck(a,k)};
   e.appendChild(b)});sendTabs()};
 /* each tab remembers its own zoom/position, and switching does not resend pages */
 const _sd=saveDeck;saveDeck=function(){_sd();const d=S.decks[S.d];if(d&&!d.mediaTab)d.v={...S.v}};
 const _od=openDeck;openDeck=function(k){const d=S.decks[k];if(!d)return;
  if(d.ghost){const gid=d.ghost;toast('Opening '+d.name+'…');(async()=>{try{const r=await lib('get',gid);if(!r)throw 0;const gi=S.decks.indexOf(d);await addFiles([new File([r.blob],r.name,{type:r.type})],1);const nd=S.decks[S.d];if(!nd||nd===d)return;nd.pinned=true;S.decks.splice(S.decks.indexOf(d),1);S.decks.splice(S.decks.indexOf(nd),1);S.decks.splice(Math.min(gi,S.decks.length),0,nd);S.d=S.decks.indexOf(nd);savePins();dtabs()}catch(e){toast('Not in the library any more — open the file again and re-pin it')}})();return}
  const v=d.v?{...d.v}:null,s0=st;st=function(){};try{_od(k)}finally{st=s0}
  if(v&&!d.mediaTab&&S.d===k)S.v=v;need=1;st()};
 const _cd=closeDeck;closeDeck=function(k){const d=S.decks[k];if(d&&d.mediaTab&&d.media){const kk=kA(d.media);window.__mkill(kk);send({t:'mkill',k:kk})}_cd(k);savePins()};
 /* restore pinned tabs from last time */
 try{JSON.parse(localStorage.getItem(LSK)||'[]').forEach(p=>S.decks.push(p.k==='m'?{mediaTab:true,media:p.media,name:p.name,pages:[],i:0,cards:'',hist:[],pinned:true,id:uid()}:{name:p.name,pages:[],i:0,cards:'',hist:[],pinned:true,ghost:p.id,id:uid()}))}catch(e){}
 if(S.decks.length)dtabs();
 /* teacher listens to student: hello / tab clicks / need */
 const _h=ch.onmessage;ch.onmessage=async ev=>{const m=ev&&ev.data;
  if(m&&m.t==='hello'){S.decks.forEach(d=>{d.sentOnce=0;d.srcSent=0;(d.pages||[]).forEach(p=>p.sent=0)});const r=await _h(ev);sendTabs();return r}
  if(m&&m.t==='needtabs'){sendTabs();return}
  if(m&&m.t==='tabgo'){if(S.decks[m.k]&&m.k!==S.d)openDeck(m.k);return}
  if(m&&m.t==='needdeck'){const d=S.decks[S.d];if(d&&d.id===m.id){d.sentOnce=0;sendPages();st()}return}
  return _h(ev)};
 /* mouse mirror: teacher mouse over the file */
 let pend=null,raf=0;const flush=()=>{raf=0;if(pend){send(pend);pend=null}};
 cv.addEventListener('pointermove',e=>{const g=geo();if(!g)return;const[x,y]=toN(g,e.offsetX,e.offsetY);pend={t:'mcur',i:S.i,x,y};if(!raf)raf=requestAnimationFrame(flush)});
 cv.addEventListener('pointerleave',()=>{pend=null;send({t:'mcur',off:1})});
}

/* ---- student side ---- */
if(STU){
 const C={};let curId=null;window.__SC=()=>C[curId];
 const bar=document.createElement('div');bar.id='stabs';document.body.appendChild(bar);
 document.body.classList.remove('tabhide');
 const cur=document.createElement('div');cur.id='mcur';cur.innerHTML='<svg viewBox="0 0 24 24" width="28" height="28"><path d="M3 2l7 19 3-8 8-3z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';$('stage').appendChild(cur);
 const tc=document.createElement('canvas');tc.id='mtrail';$('stage').appendChild(tc);const tx=tc.getContext('2d');
 let M=null,T=[],fr=0;
 function frame(){fr=0;if(window.__lc)return;const g=geo(),now=performance.now();
  if(tc.width!==Math.round(W*D)||tc.height!==Math.round(H*D)){tc.width=Math.round(W*D);tc.height=Math.round(H*D)}
  tx.setTransform(D,0,0,D,0,0);tx.clearRect(0,0,W,H);
  const hide=!g||!M||M.off||S.blank||M.i!==S.i||S.ptr||$('media').style.display==='flex';
  if(hide){cur.style.display='none';T=[];return}
  const[px,py]=toS(g,M.x,M.y);cur.style.display='block';cur.style.transform='translate('+(px-4)+'px,'+(py-2)+'px)';
  T.push([px,py,now]);T=T.filter(t=>now-t[2]<420);
  for(let i=1;i<T.length;i++){const a=1-(now-T[i][2])/420;tx.strokeStyle='rgba(94,234,212,'+(a*.7).toFixed(3)+')';tx.lineWidth=2+4*a;tx.lineCap='round';tx.beginPath();tx.moveTo(T[i-1][0],T[i-1][1]);tx.lineTo(T[i][0],T[i][1]);tx.stroke()}
  if(T.length>1)fr=requestAnimationFrame(frame)}
 const kick=()=>{if(!fr)fr=requestAnimationFrame(frame)};
 let gotT=0;const nt=setInterval(()=>{if(gotT)clearInterval(nt);else send({t:'needtabs'})},1200);
 const _p=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;if(!m)return _p(ev);
  if(m.t==='page'&&m.p){const lp=S.pages[m.i];if(lp&&lp.lr){lp.strokes=m.p.strokes||lp.strokes;need=1;return}}
  if(m.t==='pages'){const r=await _p(ev);curId=m.id||null;if(m.id)C[m.id]=Object.assign(C[m.id]||{},{pages:S.pages});return r}
  if(m.t==='usedeck'){const c=C[m.id];if(c&&c.pages){curId=m.id;S.pages=c.pages;S.i=Math.min(S.i,S.pages.length-1);S.live=null;ui();ensurePg(S.i);need=1}else send({t:'needdeck',id:m.id});return}
  if(m.t==='src'){const c=C[m.id]=C[m.id]||{};(async()=>{try{c.doc=await pdfjsLib.getDocument({data:await m.f.arrayBuffer()}).promise}catch(e){}})();return}
  if(m.t==='tabs'){gotT=1;bar.innerHTML='';m.l.forEach((t,k)=>{const b=document.createElement('button');b.className='st'+(k===m.a?' on':'');b.textContent=(t.p?'📌 ':'')+t.n;b.onclick=()=>send({t:'tabgo',k});bar.appendChild(b)});const pb=document.createElement('button');pb.className='st';pb.textContent='⇧';pb.title='Hide / show tab bar';pb.onclick=()=>{const h=document.body.classList.toggle('tabhide');pb.textContent=h?'⇩':'⇧'};bar.appendChild(pb);return}
  if(m.t==='mcur'){M=m.off?null:m;kick();return}
  if(m.t==='mkill'){window.__mkill(m.k);return}
  return _p(ev)};
 /* student renders its own pages from the PDF it already received, so it never waits for the teacher screen */
 let lrAct=0;
 const lrRun=async(p,k,c)=>{p.lr=1;lrAct++;try{const pg=await c.doc.getPage(k+1),v0=pg.getViewport({scale:1}),vp=pg.getViewport({scale:Math.min(5,PW()/v0.width,Math.sqrt(6e6/(v0.width*v0.height)))}),cv=document.createElement('canvas');cv.width=Math.round(vp.width);cv.height=Math.round(vp.height);await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.9));cv.width=cv.height=0;if(S.pages[k]!==p||p.blob||!blob){p.lr=0;return}Object.assign(p,{blob,w:vp.width,h:vp.height,bmp:null,mip:null,hi:null,dec:0});p.url=URL.createObjectURL(blob);need=1;try{ensurePg(S.i)}catch(e){}}catch(e){p.lr=0}finally{lrAct--}};
 const lrPump=()=>{const c=C[curId];if(!c||!c.doc||!c.pages||c.pages!==S.pages||document.hidden)return;for(const d of[0,1,2,-1,3,4]){if(lrAct>=2)break;const k=S.i+d,p=S.pages[k];if(p&&!p.blob&&!p.lr)lrRun(p,k,c)}};
 {const _ul=ui;ui=function(){lrPump();_ul()}}
 setInterval(lrPump,300);
 /* sharp zoom: give each page its PDF so the visible part re-renders at screen resolution; prefetch + release memory */
 setInterval(()=>{const c=C[curId];if(c&&c.doc&&c.pages)c.pages.forEach((p,i)=>{if(!p.pdf&&!p.r)p.pdf={doc:c.doc,n:i+1}});
  if(!S.pages.length)return;try{ensurePg(S.i);ensurePg(S.i+2)}catch(e){}
  S.pages.forEach((p,k)=>{if(p.bmp&&Math.abs(k-S.i)>5){try{p.bmp.close()}catch(e){}p.bmp=null}})},700);
}
})();
