/* ===== LessoScript integration & upgrades ===== */
function ytSrc(id){return 'https://www.youtube.com/embed/'+id+'?enablejsapi=1&rel=0&playsinline=1'+(/^https?:$/.test(location.protocol)?'&origin='+encodeURIComponent(location.origin):'')}
// decks = one tab per opened file
S.decks=[];S.d=-1;
function saveDeck(){try{metaSave()}catch(e){}const d=S.decks[S.d];if(d&&!d.mediaTab){d.pages=S.pages;d.i=S.i;d.cards=$('ct').value;d.hist=S.hist}}
function dtabs(){const e=$('dtabs');e.innerHTML='';S.decks.forEach((d,k)=>{const b=document.createElement('div');b.className='dt'+(k==S.d?' on':'');b.innerHTML='<span></span><i title="Close">✕</i>';b.firstChild.textContent=(d.mediaTab?'🌐 ':'')+d.name;b.onclick=ev=>{if(ev.target.tagName=='I')closeDeck(k);else if(k!=S.d)openDeck(k)};e.appendChild(b)})}
function newDeck(name){saveDeck();mClose(1);S.decks.push({name,pages:[],i:0,cards:'',hist:[]});S.d=S.decks.length-1;S.pages=[];S.i=0;S.hist=[];S.redo=[];S.v={z:1,cx:.5,cy:.5};$('ct').value='';cn();$('rail').innerHTML='';S.ov=null;renderOv();send({t:'ov',o:null});sendPages();dtabs();ui()}
function openMediaTab(k){const d=S.decks[k];S.d=k;S.pages=[];S.i=0;$('rail').innerHTML='';$('ct').value='';cn();S.ov=null;S.blank=0;renderOv();send({t:'ov',o:null});sendPages();mOpen(d.media);sendMedia();dtabs();ui()}
function addMediaTab(m,name){saveDeck();try{libLink(m.orig||m.src,name||undefined)}catch(e){}const host=(()=>{try{return new URL(m.src||'').hostname}catch(e){return m.type==='yt'?'YouTube':'Media'}})();S.decks.push({mediaTab:true,media:m,name:name||host,pages:[],i:0,cards:'',hist:[]});openMediaTab(S.decks.length-1)}
function openDeck(k){saveDeck();const d=S.decks[k];if(d.mediaTab){openMediaTab(k);return}S.d=k;S.pages=d.pages;S.i=Math.max(0,d.i);S.hist=d.hist||[];S.redo=[];S.v={z:1,cx:.5,cy:.5};S.live=null;$('ct').value=d.cards||'';cn();S.ov=null;renderOv();send({t:'ov',o:null});$('rail').innerHTML='';mClose(1);sendPages();dtabs();ui();st();}
function closeDeck(k){const wasActive=k===S.d;S.decks.splice(k,1);if(!S.decks.length){S.d=-1;S.pages=[];S.i=0;mClose(1);$('rail').innerHTML='';sendPages();dtabs();ui();st();return}if(wasActive){S.d=-1;openDeck(Math.max(0,k-1))}else{if(k<S.d)S.d--;dtabs()}}
async function addBoard(){newDeck('Board '+(S.decks.length+1));const c=document.createElement('canvas');c.width=1600;c.height=900;const x=c.getContext('2d');x.fillStyle='#fdfcf7';x.fillRect(0,0,1600,900);await push(c);go(0)}
async function addFiles(fs,fromLib){toast('Loading…');
 for(const f of fs){const n=f.name||'File';try{newDeck(n.replace(/\.[^.]+$/,''));
  if(/\.pdf$/i.test(n)){const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
   for(let k=1;k<=d.numPages;k++){const pg=await d.getPage(k),w=pg.getViewport({scale:1}).width,vp=pg.getViewport({scale:Math.min(5,PW()/w)}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
    const r=await Promise.all([pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise,pg.getTextContent().then(t=>{let o='',y=null;for(const it of t.items){const yy=it.transform[5];if(y!==null&&Math.abs(yy-y)>3)o+='\n';o+=it.str;y=yy}return o}).catch(()=>'')]);
    await push(c,r[1]);if(k==1)go(0);toast(n+': '+k+' / '+d.numPages)}}
  else if(/\.pptx$/i.test(n)){const z=await(await lz()).loadAsync(f),ks=Object.keys(z.files).filter(k=>/^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a,b)=>a.match(/\d+/)-b.match(/\d+/));
   for(const k of ks){const xml=await z.file(k).async('string'),L=xml.split('</a:p>').map(p=>(p.match(/<a:t>([^<]*)<\/a:t>/g)||[]).map(s=>s.replace(/<[^>]+>/g,'')).join('').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()).filter(Boolean);await push(pptSlide(L),L.join('\n'));if(S.pages.length==1)go(0)}}
  else if((f.type||'').startsWith('image/')){const b=await createImageBitmap(f),c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);await push(c,'');go(0)}
  else{toast('Unsupported file: '+n);closeDeck(S.d);continue}
  if(!S.pages.length){toast('Nothing found in '+n);closeDeck(S.d);continue}
  S.decks[S.d].key=f.name+'|'+f.size;metaLoad(S.decks[S.d]);S.pages.forEach((_,i)=>sendPage(i));ui();if(!fromLib){libSave(f)}
 }catch(e){toast('Could not read '+n);if(S.decks[S.d]&&!S.pages.length)closeDeck(S.d)}}
 ui();if(S.pages.length){toast('Ready ✓')}}
F.onchange=()=>{addFiles([...F.files]);F.value=''};
$('stage').ondrop=e=>{e.preventDefault();addFiles([...e.dataTransfer.files])};
// library (IndexedDB, same browser as LessoScript)
const DBO=()=>new Promise((res,rej)=>{const r=indexedDB.open('lessonstage',1);r.onupgradeneeded=()=>r.result.createObjectStore('files',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function lib(mode,arg){const db=await DBO();return new Promise((res,rej)=>{const s=db.transaction('files',mode=='get'||mode=='all'?'readonly':'readwrite').objectStore('files'),q=mode=='put'?s.put(arg):mode=='all'?s.getAll():mode=='get'?s.get(arg):s.delete(arg);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function libSave(f){try{await lib('put',{id:f.name+'|'+f.size,name:f.name,type:f.type,size:f.size,date:Date.now(),blob:f});toast('Saved to library ✓')}catch(e){}}
async function libDlg(){let m=$('lb');if(!m){m=document.createElement('div');m.id='lb';m.className='md2';m.onclick=e=>{if(e.target==m)m.style.display='none'};document.body.appendChild(m)}
 let l=[];try{l=(await lib('all')).sort((a,b)=>b.date-a.date)}catch(e){}
 m.innerHTML='<div class="mdc" style="width:min(560px,94vw);max-height:80vh;overflow:auto"><b>📚 Saved lessons</b><div class="mu">Files you open are saved here automatically (in this browser).</div>'+(l.length?l.map(r=>'<div class="lbi"><span>'+esc(r.name)+'</span><small class="mu">'+Math.round(r.size/1024)+' KB · '+new Date(r.date).toLocaleDateString()+'</small><button class="btn pri" data-o="'+encodeURIComponent(r.id)+'">Open</button><button class="btn" data-x="'+encodeURIComponent(r.id)+'">🗑</button></div>').join(''):'<div class="mu">Nothing saved yet.</div>')+'<button class="btn" onclick="$(\'lb\').style.display=\'none\'">Close</button></div>';
 m.style.display='flex';
 m.querySelectorAll('[data-o]').forEach(b=>b.onclick=async()=>{const r=await lib('get',decodeURIComponent(b.dataset.o));m.style.display='none';addFiles([new File([r.blob],r.name,{type:r.type})],1)});
 m.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{await lib('del',decodeURIComponent(b.dataset.x));libDlg()})}
// study cards: local extraction + AI
const aiCfg=()=>{try{return JSON.parse(localStorage.getItem('lp.ai')||'null')}catch(e){return null}};
const b64=bl=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(bl)});
async function aiCall(prompt,imgs){const a=aiCfg();if(!a||!a.key)throw new Error('Add your AI key in LessoScript > Setup');
 if(a.provider==='claude'){const content=(imgs||[]).map(d=>({type:'image',source:{type:'base64',media_type:'image/jpeg',data:d}}));content.push({type:'text',text:prompt});
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':a.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:a.model||'claude-haiku-5-5',max_tokens:2000,messages:[{role:'user',content}]})});const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||r.status);return j.content.map(x=>x.text||'').join('')}
 const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+a.key},body:JSON.stringify({model:(a.model&&a.model.trim())||'openai/gpt-oss-20b',messages:[{role:'user',content:prompt}],reasoning_effort:'low',include_reasoning:false,max_completion_tokens:2000,temperature:.2})});const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||r.status);return j.choices[0].message.content}
async function aiCards(txt,imgs){const o=await aiCall('From this lesson material create up to 20 study cards (a term or question, and a short answer) in the same language as the material. Return ONLY a JSON array like [{"q":"...","a":"..."}].\n\nMaterial:\n'+txt,imgs);const m=o.match(/\[[\s\S]*\]/);if(!m)throw new Error('AI returned no cards');return JSON.parse(m[0]).filter(x=>x&&x.q&&x.a).map(x=>[String(x.q),String(x.a)])}
function heur(t){const o=[],sn=new Set(),add=(a,b)=>{a=(a||'').replace(/\s+/g,' ').trim();b=(b||'').replace(/\s+/g,' ').trim();if(a.length<2||b.length<2||a.length>160||b.length>220)return;const k=a.toLowerCase();if(sn.has(k))return;sn.add(k);o.push([a,b])};
 const lines=t.split(/\n+/).map(s=>s.trim()).filter(s=>s.length>2);
 for(const l of lines){let m=l.split('|');if(m.length>1){add(m[0],m[1]);continue}
  m=l.match(/^(.{2,70}?)\s*(?:[:：=–—]|\s-\s)\s*(.{2,})$/);if(m){add(m[1],m[2]);continue}
  m=l.match(/^([\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s]*?)\s+([A-Za-z][A-Za-z\s'-]*)$/)||l.match(/^([A-Za-z][A-Za-z\s'-]*?)\s+([\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s]*)$/);if(m)add(m[1],m[2])}
 const ss=t.replace(/\n+/g,' ').split(/(?<=[.!?؟])\s+/).map(s=>s.trim()).filter(s=>s.length>25&&s.length<260);
 for(const s of ss){const m=s.match(/^(?:An?\s+|The\s+)?([A-Z][\w\s'-]{1,45}?)\s+(?:is|are|means|refers to|was|were)\s+(.{12,})$/);if(m)add(m[1],m[2].replace(/\.$/,''))}
 if(o.length<6)for(const s of ss){if(o.length>=14)break;const w2=s.split(/\s+/),ws=w2.map((w,i)=>[w.replace(/[^\p{L}\p{N}'-]/gu,''),i]).filter(x=>x[0].length>=5).sort((a,b)=>b[0].length-a[0].length);if(!ws.length)continue;const k=ws[0];w2[k[1]]='_____';add(w2.join(' '),k[0])}
 return o}
function addCards(a){const t=$('ct'),have=new Set(cards().map(c=>c[0].toLowerCase())),n=a.filter(c=>!have.has(c[0].toLowerCase())).map(c=>c[0].replace(/\|/g,'/')+' | '+c[1].replace(/\|/g,'/'));if(n.length){t.value=(t.value.trim()?t.value.trim()+'\n':'')+n.join('\n');cn();saveDeck()}return n.length}
let building=0;
async function buildCards(manual){if(building||!S.pages.length)return;building=1;const dk=S.decks[S.d];if(dk)dk.built=1;
 try{const txt=S.pages.map(p=>p.text||'').join('\n'),w=S.pages.map(p=>p.words||'').join('\n');addCards(heur(txt+'\n'+w));
  const a=aiCfg();if(a&&a.key){const scan=txt.trim().length<80;if(!scan||a.provider==='claude'){if(manual)toast('AI is reading your slides…');try{const imgs=scan?await Promise.all(S.pages.slice(0,6).map(p=>b64(p.blob))):[];addCards(await aiCards(txt.slice(0,12000),imgs))}catch(e){if(manual)toast('AI: '+e.message)}}}
  else if(manual&&!cards().length)toast('No text found. Add an AI key in LessoScript > Setup for scanned files.');
  const n=cards().length;if(n)toast(n+' study cards ready ✓')}finally{building=0}}
function extract(){buildCards(true)}
async function startFC(){let c=cards();if(!c.length){await buildCards(true);c=cards()}if(!c.length)return toast('No cards yet. Add text or an AI key.');ovSet({k:'fc',c:shuf(c),i:0,f:0})}
async function startQZ(){let c=cards();if(c.length<2){await buildCards(true);c=cards()}if(c.length<2)return toast('Need at least 2 cards');ovSet({k:'qz',i:0,r:0,q:shuf(c).slice(0,12).map(a=>{const o=shuf([a[1],...shuf(c.filter(b=>b[1]!=a[1])).slice(0,3).map(b=>b[1])]);return{q:a[0],o,a:o.indexOf(a[1])}})})}
// words: big, centred, with teacher preview
function wordsHTML(t){return '<div class="wvin">'+String(t||'').split('\n').filter(x=>x.trim()).map(x=>{const a=x.split('|').map(s=>s.trim());return '<div class="wc"><span class="wt" dir="auto">'+esc(a[0]||'')+'</span><span class="wm" dir="auto">'+esc(a[1]||'')+(a[2]?'<small>'+esc(a[2])+'</small>':'')+'</span></div>'}).join('')+'</div>'}
function showWords(t){const o=$('ovw');if(!t){o.style.display='none';o.innerHTML='';return}o.innerHTML=wordsHTML(t);o.style.display='flex'}
function rw(){const p=P();$('wprev').innerHTML=wordsHTML(p?p.words:'')}
function tpv(){if(!S.end)$('tpv').textContent=String(Math.max(0,+$('tm').value||0)).padStart(2,'0')+':00'}
$('tm').addEventListener('input',tpv);
// pick-a-student fix (the random message id used to overwrite the name)
function showPick(n,own){const e=$('pick');e.firstChild.textContent=n;e.style.display='flex';if(own)send({t:'pick',name:n});clearTimeout(showPick.h);showPick.h=setTimeout(()=>e.style.display='none',8000)}
$('pick').onclick=e=>{e.currentTarget.style.display='none';if(!STU)send({t:'pick',name:null})};
const _om=ch.onmessage;ch.onmessage=ev=>{const m=ev.data;if(m&&m.t=='pick'){if(STU){m.name?showPick(m.name):$('pick').style.display='none'}return}return _om(ev)};
// student window: real separate window (share it with Zoom/Meet > Window), full screen on first click
function openStu(){const real=/^https?:$/.test(location.protocol),u=real?location.href.split('#')[0]+'#student':URL.createObjectURL(new Blob([SRC],{type:'text/html'}))+'#student',w=screen.availWidth||1280,h=screen.availHeight||720;
 SW=window.open(u,'lsstudent','popup=yes,width='+w+',height='+h+',left='+(screen.availLeft||0)+',top='+(screen.availTop||0));if(!SW)return toast('Popup blocked: allow popups for this page, then try again');
 toast('Student window opened. In Zoom/Meet choose Share > Window > "Student screen". Your script stays private.')}
if(STU){document.title='Student screen';const h=document.createElement('div');h.id='fsh';h.textContent='⛶ Click anywhere or press any key for full screen';document.body.appendChild(h);h.style.display='none';
 let once=0;const tf=e=>{if(once||(e&&e.type=='keydown'&&e.key.toLowerCase()=='f'))return;once=1;document.removeEventListener('pointerdown',tf,true);document.removeEventListener('keydown',tf,true);if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{})};
 document.addEventListener('pointerdown',tf,true);document.addEventListener('keydown',tf,true)}
else{dtabs();tpv();rw()}

