/* ===== v2 upgrades ===== */
function tp(){document.body.classList.toggle('po');setTimeout(()=>{size();try{rw()}catch(e){}},60)}
// eraser ring (mouse + touch)
cv.addEventListener('pointermove',e=>{const r=$('ering');if(S.tool!='eraser'||STU){r.style.display='none';return}const d=Math.max(14,S.size*2)*2;r.style.cssText='display:block;width:'+d+'px;height:'+d+'px;left:'+e.offsetX+'px;top:'+e.offsetY+'px'});
cv.addEventListener('pointerleave',()=>$('ering').style.display='none');
cv.addEventListener('pointerup',e=>{if(e.pointerType=='touch')$('ering').style.display='none'});
// student screen = new tab in the same browser window
function openStu(){const real=/^https?:$/.test(location.protocol),u=real?location.href.split('#')[0].split('?')[0]+'#student':'about:blank';
 SW=window.open(u,'lsstudent');if(SW)if(SW&&!real){try{SW.document.open();SW.document.write(SRC);SW.document.close()}catch(e){}}if(!SW)return toast('Popup blocked: allow popups for this site, then try again');toast('Student screen opened in a new tab. Drag the tab to the student display and press Full screen.')}
// YouTube error 153 / embed errors: retry, then fall back to a button
function ytSrc(id,nc){return 'https://www.youtube'+(nc?'-nocookie':'')+'.com/embed/'+id+'?rel=0&playsinline=1&modestbranding=1&enablejsapi=1&vq=hd1080'}
function ytFail(code){const e=$('media');if(!S.media||S.media.type!='yt')return;const n=$('mn');
 if(!S.media.retry&&n&&!/nocookie/.test(n.src)){S.media.retry=1;n.src=ytSrc(S.media.id,1);return}
 let b=$('yterr');if(!b){b=document.createElement('div');b.id='yterr';e.appendChild(b)}
 b.innerHTML='<div style="font-size:18px;font-weight:700">This video cannot play inside the page (error '+code+')</div><div class="mu">The owner may block embedding, or the page has no referrer.</div><a class="btn pri" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v='+S.media.id+'">▶ Open on YouTube</a>';b.style.display='flex'}
addEventListener('message',e=>{let h='';try{h=new URL(e.origin).hostname}catch(_){return}if(!/(^|\.)youtube(-nocookie)?\.com$/.test(h))return;let d=e.data;try{if(typeof d=='string')d=JSON.parse(d)}catch(_){return}
 if(d&&d.event=='onError'||d&&d.info&&d.info.errorCode)ytFail((d.info&&d.info.errorCode)||d.info||153)});
// save: notes, words, cards and drawings are kept per lesson file (this browser)
const mk=d=>d&&d.key?'lp.stage.'+d.key:null;
const mLast={},mTm={};const metaPay=()=>({c:$('ct').value,p:S.pages.map(p=>({n:p.notes,w:p.words,s:p.strokes}))});
function metaSave(){if(STU)return;const d=S.decks[S.d],k=mk(d);if(!k||!S.pages.length)return;const pl=metaPay(),js=JSON.stringify(pl);if(mLast[d.key]===js)return;mLast[d.key]=js;const t=Date.now();try{localStorage.setItem(k,JSON.stringify(Object.assign({t},pl)))}catch(e){}
 if(pl.c||pl.p.some(x=>x.n||x.w||x.s.length)){clearTimeout(mTm[d.key]);mTm[d.key]=setTimeout(()=>{if(js.length<8e6)cloudRow('meta:'+d.key,Object.assign({kind:'stagemeta',key:d.key,t},pl),t)},5000)}}
function metaLoad(d){const k=mk(d);if(!k)return;try{const m=JSON.parse(localStorage.getItem(k)||'null');if(m){d.cards=m.c||'';$('ct').value=d.cards;cn();S.pages.forEach((p,i)=>{const q=m.p&&m.p[i];if(q){p.notes=q.n||'';p.words=q.w||'';p.strokes=q.s||[];p.rotWant=q.r||0}});d.built=1}}catch(e){}
 mLast[d.key]=JSON.stringify(metaPay());metaCloud(d)}
async function metaCloud(d){if(STU||!d.key)return;try{const g=await cr('reports?select=data&id=eq.'+encodeURIComponent('stage:meta:'+d.key)),c=g&&g[0]&&g[0].data;if(!c||!S.decks.includes(d))return;const lt=+((JSON.parse(localStorage.getItem(mk(d))||'null')||{}).t)||0;if((+c.t||0)<=lt)return;
  d.cards=c.c||'';d.built=1;d.pages.forEach((p,i)=>{const q=c.p&&c.p[i];if(q){p.notes=q.n||'';p.words=q.w||'';p.strokes=q.s||[];p.rotWant=q.r||0}});try{localStorage.setItem(mk(d),JSON.stringify({t:c.t,c:c.c,p:c.p}))}catch(e){}
  if(S.decks[S.d]===d){$('ct').value=d.cards;cn();ui();rw();S.pages.forEach((p,i)=>send({t:'set',i,l:p.strokes}));need=1;toast('Your saved edits loaded ☁️');mLast[d.key]=JSON.stringify(metaPay())}}catch(e){}}
if(!STU){setInterval(metaSave,4000);addEventListener('pagehide',metaSave);addEventListener('beforeunload',metaSave)}

