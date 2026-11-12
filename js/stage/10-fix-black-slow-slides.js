/* ===== fix: black / slow slides ===== */
ensurePg=function(i){for(let k=i-1;k<=i+2;k++){const p=S.pages[k];if(p&&!p.bmp&&!p.dec&&p.blob){p.dec=1;createImageBitmap(p.blob).then(b=>{p.bmp=b;need=1}).catch(()=>{}).finally(()=>{p.dec=0})}}};
function needPg(i){const m={t:'need',i,n:Math.random()};try{if(BCOK)ch.postMessage(m);else if(opener)opener.postMessage(m,'*')}catch(e){}}
(function(){const prev=ch.onmessage;ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t==='need'){if(!STU&&S.pages[m.i]){const nw=performance.now(),T=window._nt=window._nt||{};if(!(nw-(T[m.i]||0)<400)){T[m.i]=nw;if(window.wantAt)window.wantAt(m.i);sendPage(m.i)}}return}return prev(ev)}})();
setInterval(()=>{const n=S.pages.length;if(!n)return;
 if(STU)for(let k=Math.max(0,S.i-2);k<Math.min(n,S.i+6);k++){const p=S.pages[k];if(!p||!p.blob)needPg(k)}
 const c=S.pages[S.i];if(c&&c.blob){ensurePg(S.i);if(!c.bmp)need=1}
 if(n>=12)S.pages.forEach((p,k)=>{if(p&&p.bmp&&Math.abs(k-S.i)>6){try{p.bmp.close()}catch(e){}p.bmp=null}})},700);

/* ===== lazy PDF: open instantly, render pages on demand + 3 in parallel ===== */
(function(){
const orig=addFiles,PH='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
let q=[],act=0;const MAXC=3;
const _sp=sendPage;sendPage=function(i){const p=S.pages[i];if(p&&p.blob)_sp(i)};
const _ui=ui;ui=function(){_ui();fixRail()};
function fixRail(){if(STU)return;const r=$('rail');[...r.children].forEach((d,i)=>{const p=S.pages[i],im=d.firstChild;if(p&&im&&im.style&&!p.blob){im.style.aspectRatio=p.w+'/'+p.h;im.style.background='#111'}})}
function pump(){while(act<MAXC&&q.length){const p=q.shift();if(p.blob||p.rend||!p.lazy)continue;doR(p)}}
async function doR(p){p.rend=1;act++;try{
 const L=p.lazy;p.pdf={doc:L.doc,n:L.n};const pg=await L.doc.getPage(L.n),v0=pg.getViewport({scale:1}),w0=v0.width,vp=pg.getViewport({scale:Math.min(5,PW()/w0,Math.sqrt(6e6/(w0*v0.height)))}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
 await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
 p.text=await pg.getTextContent().then(t=>{let o='',y=null;for(const it of t.items){const yy=it.transform[5];if(y!==null&&Math.abs(yy-y)>3)o+='\n';o+=it.str;y=yy}return o}).catch(()=>'');
 const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.95)),i=S.pages.indexOf(p);
 p.w=c.width;p.h=c.height;if(i>=0&&Math.abs(i-S.i)<=3)p.bmp=await createImageBitmap(c);
 p.blob=blob;p.url=URL.createObjectURL(blob);p.lazy=null;
 if(i>=0){const d=$('rail').children[i];if(d&&d.firstChild){d.firstChild.src=p.url;d.firstChild.style.aspectRatio=''}sendPage(i)}
 need=1}catch(e){p.rend=0}finally{act--;p.rend=0;pump()}}
function want(){const l=[4,3,2,-2,-1,1,0];for(const k of l){const p=S.pages[S.i+k];if(p&&p.lazy&&!p.blob&&!p.rend){q=q.filter(x=>x!==p);q.unshift(p)}}pump()}
window.want=want;window.wantAt=function(i){const p=S.pages[i];if(p&&p.lazy&&!p.blob&&!p.rend){q=q.filter(x=>x!==p);q.unshift(p);pump()}};const _go=go;go=function(i){_go(i);want()};
setInterval(()=>{if(!document.hidden)want()},300);
const _bc=buildCards;buildCards=async function(m){if(S.pages.some(p=>p.lazy&&!p.blob)){toast('Reading all pages first…');while(S.pages.some(p=>p.lazy&&!p.blob))await new Promise(r=>setTimeout(r,300))}return _bc(m)};
addFiles=async function(fs,fromLib){
 for(const f of fs){const n=f.name||'File';
  if(!/\.pdf$/i.test(n)){await orig([f],fromLib);continue}
  try{toast('Opening…');const doc=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
   newDeck(n.replace(/\.[^.]+$/,''));
   const pgs=await Promise.all(Array.from({length:doc.numPages},(_,k)=>doc.getPage(k+1).then(pg=>{const v=pg.getViewport({scale:1});return{blob:null,bmp:null,w:v.width,h:v.height,strokes:[],notes:'',words:'',text:'',lazy:{doc,n:k+1},url:PH}})));
   S.pages=pgs;const d=S.decks[S.d];d.pages=pgs;d.key=n+'|'+f.size;try{metaLoad(d)}catch(e){}
   q=pgs.slice();go(0);ui();sendPages();if(!fromLib){try{libSave(f)}catch(e){}}
   toast('Ready ✓ ('+doc.numPages+' pages loading in background)')
  }catch(e){toast('Could not read '+n);if(S.decks[S.d]&&!S.pages.length)closeDeck(S.d)}}};
F.onchange=()=>{addFiles([...F.files]);F.value=''};
$('stage').ondrop=e=>{e.preventDefault();addFiles([...e.dataTransfer.files])};
})();

(function(){const g=document.getElementById('gp');if(!g)return;
const jump=()=>{const n=parseInt(g.value,10);if(!n||!S.pages.length)return;go(Math.min(S.pages.length,Math.max(1,n))-1);g.value='';g.blur()};
g.addEventListener('keydown',e=>{if(e.key==='Enter')jump();e.stopPropagation()});
const _u=ui;ui=function(){_u();g.max=S.pages.length||1;g.style.display=STU?'none':''};
})();
