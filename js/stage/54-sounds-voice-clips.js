/* 🔊 Sounds: instant voice-clip player for live classes (Web Audio = no delay, clips are decoded in advance and saved on this device) */
(function(){if(STU)return;
const DB='lessonsounds',AC=window.AudioContext||window.webkitAudioContext,LS=localStorage;let ctx,master,gain=+(LS.getItem('ls.snd.vol')||1);
let items=[],setName=LS.getItem('ls.snd.set')||'Lesson 1',cue=0,cur=null,db,auto=LS.getItem('ls.snd.auto')==='1',gap=+(LS.getItem('ls.snd.gap')||0),pads=LS.getItem('ls.snd.pads')==='1',bar=LS.getItem('ls.snd.bar')!=='0',paused=0,last=null,gapT=0,dragId=null,tick=0;
const bufs=new Map(),$s=id=>document.getElementById(id);
let sOn=0,sAt=0,sSess='',sSent=new Set();const via=()=>sOn&&Date.now()-sAt<12000;
{const _p=ch.onmessage;ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t==='snhi'){if(m.s!==sSess){sSess=m.s;sSent=new Set()}sOn=m.ok;sAt=Date.now();return}return _p&&_p(ev)}}
const open=()=>db||(db=new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('clips',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
const tx=async(m,f)=>{const d=await open();return new Promise((res,rej)=>{const t=d.transaction('clips',m),s=t.objectStore('clips');const r=f(s);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})};
const put=c=>tx('readwrite',s=>s.put(c)),del=id=>tx('readwrite',s=>s.delete(id)),all=()=>tx('readonly',s=>s.getAll());
function audio(){if(!AC)return null;if(!ctx){ctx=new AC({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=gain;master.connect(ctx.destination);try{const o=ctx.createOscillator(),k=ctx.createGain();k.gain.value=.0002;o.frequency.value=30;o.connect(k);k.connect(ctx.destination);o.start()}catch(e){}}if(ctx.state!=='running'&&!paused)ctx.resume();return ctx}
async function prep(c){if(bufs.has(c.id))return;const a=audio();if(c.blob.size>12e6||!a){bufs.set(c.id,null);return}
 try{bufs.set(c.id,await a.decodeAudioData(await c.blob.arrayBuffer()))}catch(e){bufs.set(c.id,null)}} /* null = play through a normal audio element instead */
function stop(fade){clearTimeout(gapT);gapT=0;if(!cur){draw();return}const x=cur;cur=null;if(x.rt)send({t:'sndstop',f:fade?1:0});
 try{if(paused&&x.src)ctx.resume();paused=0;if(x.src){const t=ctx.currentTime;x.g.gain.setTargetAtTime(0,t,fade?.02:.001);x.src.stop(t+(fade?.12:.01))}else{x.el.pause();URL.revokeObjectURL(x.url)}}catch(e){}paused=0;draw()}
async function play(id){const i=items.findIndex(c=>c.id===id);if(i<0)return;const c=items[i];stop(true);const a=audio();let b=bufs.get(id);
 if(b===undefined){await prep(c);b=bufs.get(id)}
 const me={id,t0:performance.now()};if(via()){me.rt=1;if(!sSent.has(id)){sSent.add(id);send({t:'sndclip',id,b:c.blob})}send({t:'sndplay',id,v:gain})}cur=me;last=id;cue=Math.min(i+1,items.length);
 const end=()=>{if(cur!==me)return;cur=null;paused=0;if(auto&&cue<items.length){const nid=items[cue].id;if(gap>0)gapT=setTimeout(()=>{gapT=0;play(nid)},gap*1000);else play(nid)}draw()};
 if(b&&a){if(a.state!=='running'&&!paused){try{await a.resume()}catch(e){}if(cur!==me)return}const s=a.createBufferSource(),g=a.createGain();s.buffer=b;s.connect(g);if(!me.rt)g.connect(master);me.src=s;me.g=g;me.dur=b.duration;s.onended=end;s.start(a.currentTime+.05)}
 else{const url=URL.createObjectURL(c.blob),el=new Audio(url);el.volume=Math.min(1,gain);el.muted=!!me.rt;me.el=el;me.url=url;el.onended=()=>{URL.revokeObjectURL(url);end()};el.onloadedmetadata=()=>me.dur=el.duration;try{await el.play()}catch(e){toast('Tap again to allow sound');cur=null}}
 draw();loop()}
function next(){if(!items.length)return toast('No sounds yet');if(cue>=items.length)cue=0;play(items[cue].id)}
function repeat(){if(last&&items.some(c=>c.id===last))play(last);else toast('Nothing to repeat yet')}
function pause(){if(!cur)return;if(!paused){paused=1;cur.pt=performance.now();if(cur.src)ctx.suspend();else cur.el.pause()}else{paused=0;cur.t0+=performance.now()-cur.pt;if(cur.src)ctx.resume();else cur.el.play().catch(()=>{})}if(cur.rt)send({t:'sndpause',on:paused});draw()}
function loop(){cancelAnimationFrame(tick);const f=()=>{const b=document.querySelector('.snr.pl i');if(cur&&b){const d=cur.dur||(cur.el&&cur.el.duration)||0,t=cur.el&&!cur.src?cur.el.currentTime:((paused?cur.pt:performance.now())-cur.t0)/1000;b.style.width=(d?Math.min(100,t/d*100):0)+'%'}if(cur)tick=requestAnimationFrame(f)};f()}
const nice=n=>n.replace(/\.[^.]+$/,'').replace(/_+/g,' ').trim();
async function load(){items=(await all()).filter(c=>c.set===setName).sort((a,b)=>a.order-b.order);draw();for(const c of items)await prep(c);draw()}
async function add(files){audio();let n=0;const base=items.length?Math.max(...items.map(c=>c.order))+1:0;
 const fs=[...files].filter(f=>/^(audio|video)\//.test(f.type)||/\.(mp3|mpeg|mpg|mpga|mp2|m4a|m4b|mp4|aac|adts|wav|wave|ogg|oga|opus|webm|weba|flac|aif|aiff|caf|amr|3gp|3gpp|wma|mka)$/i.test(f.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
 for(const f of fs){const c={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),set:setName,name:nice(f.name),order:base+n++,blob:f,size:f.size};await put(c);items.push(c);toast('Loading '+n+' / '+fs.length);await prep(c);draw()}
 if(fs.length)toast(fs.length+' sound'+(fs.length>1?'s':'')+' ready');try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}}
async function saveOrder(){for(let i=0;i<items.length;i++){items[i].order=i;await put(items[i])}}
async function move(id,to){const i=items.findIndex(c=>c.id===id);if(i<0||to<0||to>=items.length)return;const [c]=items.splice(i,1);items.splice(to,0,c);draw();await saveOrder()}
async function drawSets(){const s=$s('snSet');if(!s)return;const names=[...new Set([...(await all()).map(c=>c.set),setName])].sort();s.innerHTML='';names.forEach(n=>{const o=document.createElement('option');o.textContent=n;o.selected=n===setName;s.appendChild(o)})}
/* backup = one .lsounds file (header + the audio files), no libraries needed */
async function backup(){const a=await all();if(!a.length)return toast('Nothing to back up');const head=new TextEncoder().encode(JSON.stringify({v:1,clips:a.map(c=>({id:c.id,set:c.set,name:c.name,order:c.order,size:c.blob.size,type:c.blob.type}))})),len=new Uint8Array(4);new DataView(len.buffer).setUint32(0,head.length);
 const u=URL.createObjectURL(new Blob([len,head,...a.map(c=>c.blob)],{type:'application/octet-stream'})),l=document.createElement('a');l.href=u;l.download='lessoscript-sounds-'+new Date().toISOString().slice(0,10)+'.lsounds';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);toast(a.length+' sounds saved to a file')}
async function restore(f){try{const dv=new DataView(await f.slice(0,4).arrayBuffer()),n=dv.getUint32(0),h=JSON.parse(new TextDecoder().decode(await f.slice(4,4+n).arrayBuffer()));let off=4+n;
 for(const m of h.clips){await put({id:m.id,set:m.set,name:m.name,order:m.order,size:m.size,blob:f.slice(off,off+m.size,m.type)});off+=m.size}
 toast(h.clips.length+' sounds restored');await drawSets();await load()}catch(e){toast('This is not a sounds backup file')}}
function draw(){const L=$s('snL');if(!L)return;const esc=s=>s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
 L.className=pads?'pads':'';
 L.innerHTML=items.length?items.map((c,i)=>`<div class="snr${cur&&cur.id===c.id?' pl':''}${i===cue&&!(cur&&cur.id===c.id)?' cu':''}" style="--h:${(i*47)%360}" draggable="${!pads}" data-id="${c.id}"><span class="gr" title="Drag to reorder">⠿</span><button class="pb" data-a="p">${cur&&cur.id===c.id?'⏹':'▶'}</button><span class="nm" data-a="p"><b>${i+1}.</b> ${esc(c.name)}${bufs.get(c.id)===undefined?' <em>…</em>':''}</span><button data-a="u" title="Move up">▲</button><button data-a="d" title="Move down">▼</button><button data-a="r" title="Rename">✎</button><button data-a="x" title="Delete">✕</button><i></i></div>`).join(''):'<div class="mu">Add your voice files (mp3, m4a, mp4) and they will be ready to play instantly. They stay saved on this device.</div>';
 const nx=items[cue],pl=paused?'▶':'⏸';
 $s('snN').textContent=nx?('▶ Next: '+(cue+1)+'. '+nx.name):'↺ Start again';$s('snP').textContent=pl;$s('snPads').classList.toggle('on',pads);
 $s('bN').textContent=nx?('▶ '+(cue+1)+'. '+nx.name):'↺ Again';$s('bP').textContent=pl;$s('bP').style.opacity=cur?1:.4;
 document.body.classList.toggle('snbar',bar&&items.length>0&&!!cur)}
function ui(){
 const L=$s('snL');
 L.onclick=async e=>{const r=e.target.closest('.snr');if(!r)return;let a=e.target.closest('[data-a]');a=a?a.dataset.a:(pads?'p':'');if(!a)return;const id=r.dataset.id,i=items.findIndex(c=>c.id===id);
  if(a==='p'){cur&&cur.id===id&&!pads?stop(true):play(id)}
  else if(pads)return;
  else if(a==='u')move(id,i-1);else if(a==='d')move(id,i+1);
  else if(a==='r'){const n=prompt('Name',items[i].name);if(n&&n.trim()){items[i].name=n.trim();put(items[i]);draw()}}
  else if(a==='x'&&confirm('Delete "'+items[i].name+'"?')){if(cur&&cur.id===id)stop();items.splice(i,1);bufs.delete(id);await del(id);if(cue>items.length)cue=items.length;draw()}};
 L.ondragstart=e=>{const r=e.target.closest('.snr');if(r){dragId=r.dataset.id;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','s')}};
 L.ondragover=e=>{if(dragId)e.preventDefault()};
 L.ondrop=e=>{const r=e.target.closest('.snr');if(!dragId||!r)return;e.preventDefault();e.stopPropagation();const to=items.findIndex(c=>c.id===r.dataset.id);move(dragId,to);dragId=null};
 const P=$s('snd');['dragover','drop'].forEach(t=>P.addEventListener(t,e=>{if(dragId||!(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')))return;e.preventDefault();if(t==='drop'){e.stopPropagation();add(e.dataTransfer.files)}}));
 $s('snF').onchange=e=>{add(e.target.files);e.target.value=''};
 $s('snRF').onchange=e=>{if(e.target.files[0])restore(e.target.files[0]);e.target.value=''};
 $s('snBk').onclick=backup;
 $s('snN').onclick=next;$s('snS').onclick=()=>stop(true);$s('snP').onclick=pause;$s('snR').onclick=repeat;
 $s('bN').onclick=next;$s('bS').onclick=()=>stop(true);$s('bP').onclick=pause;$s('bR').onclick=repeat;
 $s('snPads').onclick=()=>{pads=!pads;LS.setItem('ls.snd.pads',pads?1:0);draw()};
 $s('snV').value=gain;$s('snV').oninput=e=>{gain=+e.target.value;LS.setItem('ls.snd.vol',gain);if(via())send({t:'sndvol',v:gain});if(master)master.gain.value=gain;if(cur&&cur.el)cur.el.volume=Math.min(1,gain)};
 $s('snA').checked=auto;$s('snA').onchange=e=>{auto=e.target.checked;LS.setItem('ls.snd.auto',auto?1:0)};
 $s('snG').value=gap;$s('snG').oninput=e=>{gap=Math.max(0,Math.min(30,+e.target.value||0));LS.setItem('ls.snd.gap',gap)};
 $s('snB').checked=bar;$s('snB').onchange=e=>{bar=e.target.checked;LS.setItem('ls.snd.bar',bar?1:0);draw()};
 $s('snSet').onchange=async e=>{stop();setName=e.target.value;LS.setItem('ls.snd.set',setName);cue=0;last=null;await load()};
 $s('snNew').onclick=async()=>{const n=prompt('New lesson set name');if(n&&n.trim()){stop();setName=n.trim();LS.setItem('ls.snd.set',setName);items=[];cue=0;last=null;await drawSets();draw()}};
 $s('snClr').onclick=async()=>{if(!items.length||!confirm('Delete all sounds in "'+setName+'"?'))return;stop();for(const c of items){bufs.delete(c.id);await del(c.id)}items=[];cue=0;await drawSets();draw()};
 document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k==='n'){e.preventDefault();next()}else if(k==='m')stop(true);else if(k==='k')pause();else if(k==='j')repeat()});
 const wake=()=>{audio();document.removeEventListener('pointerdown',wake,true)};document.addEventListener('pointerdown',wake,true);
 window.sndOpen=()=>{if(!document.body.classList.contains('po'))tp();document.querySelector('.tabs button[data-p="snd"]').click()};
 drawSets().then(load)}
ui();
})();
/* Student tab plays the teacher's sounds, so Meet 'share tab audio' on the student tab carries them */
(function(){if(!STU)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
let ctx,mg,cur=null,vol=1,gen=0;const B=new Map(),sess=Math.random().toString(36).slice(2),sn=new Set();
function au(){if(!ctx){ctx=new AC({latencyHint:'interactive'});mg=ctx.createGain();mg.gain.value=vol;mg.connect(ctx.destination);ctx.onstatechange=hi;try{const o=ctx.createOscillator(),k=ctx.createGain();k.gain.value=.0002;o.frequency.value=30;o.connect(k);k.connect(ctx.destination);o.start()}catch(e){}}return ctx}
function hi(){try{au();if(ctx.state!=='running')ctx.resume().catch(()=>{})}catch(e){}send({t:'snhi',s:sess,ok:!!ctx&&ctx.state==='running'})}
function halt(f){gen++;if(!cur)return;const x=cur;cur=null;try{const t=ctx.currentTime;x.g.gain.setTargetAtTime(0,t,f?.02:.001);x.s.stop(t+(f?.12:.01))}catch(e){}}
document.addEventListener('pointerdown',hi,true);setInterval(hi,4000);hi();
const prev=ch.onmessage;ch.onmessage=async ev=>{const m=ev&&ev.data;if(!m||!/^snd/.test(m.t||''))return prev&&prev(ev);
 if(m.n){if(sn.has(m.n))return;sn.add(m.n)}
 if(m.t==='sndclip'){B.set(m.id,(async()=>{try{return await au().decodeAudioData(await m.b.arrayBuffer())}catch(e){return null}})())}
 else if(m.t==='sndplay'){halt(0);const my=gen;vol=m.v;au();mg.gain.value=vol;const b=await B.get(m.id);if(!b||my!==gen)return;if(ctx.state!=='running'){try{await ctx.resume()}catch(e){}if(my!==gen)return}
  const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;s.connect(g);g.connect(mg);cur={s,g};s.onended=()=>{if(cur&&cur.s===s)cur=null};s.start(ctx.currentTime+.05)}
 else if(m.t==='sndstop')halt(m.f);
 else if(m.t==='sndpause'){if(ctx)m.on?ctx.suspend():ctx.resume()}
 else if(m.t==='sndvol'){vol=m.v;if(mg)mg.gain.value=vol}};
})();
