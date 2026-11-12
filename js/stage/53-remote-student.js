/* ===== Remote student: a student on their OWN device opens a link, sees the student screen and can draw; the teacher sees the strokes.
   Uses the teacher's own Supabase project (Realtime broadcast, no database tables). Everything else in the app is unchanged. ===== */
(function(){
if(!/^https?:$/.test(location.protocol))return;
const qs=new URLSearchParams(location.search),ID=Math.random().toString(36).slice(2,8),LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
const OUT_T=['pages','st','add','set','live','ptr','tm','page','pick'],OUT_S=['hello','need','add','set','live','ptr'];
let cl=null,rc=null,on=false,room='';
let op=ch.postMessage.bind(ch),ALLOW=false,RD=false,sentRT=new WeakMap();
const loadLib=()=>window.supabase&&window.supabase.createClient?Promise.resolve():new Promise((ok,no)=>{const e=document.createElement('script');e.src=LIB;e.onload=ok;e.onerror=()=>no(new Error('The online library could not load - check the internet'));document.head.appendChild(e)});
const tx=p=>{try{Promise.resolve(rc.send({type:'broadcast',event:'m',payload:p})).catch(()=>{})}catch(e){}};
const lat={},tm={};
function fast(m){if(tm[m.t]){lat[m.t]=m;return}tx(m);tm[m.t]=setTimeout(()=>{tm[m.t]=0;const x=lat[m.t];lat[m.t]=null;if(x)tx(x)},25)}
const cache=new WeakMap(),cachePv=new WeakMap();globalThis.__rsc=cache;
async function enc(blob,W,Q,cache){W=W||1280;Q=Q||.68;cache=cache||globalThis.__rsc;let d=cache.get(blob);if(d)return d;const bm=await createImageBitmap(blob),w=Math.min(W,bm.width),h=Math.max(1,Math.round(bm.height*w/bm.width)),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(bm,0,0,w,h);try{bm.close()}catch(e){}
 const b=await new Promise(r=>c.toBlob(r,'image/jpeg',Q));d=await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});cache.set(blob,d);return d}
async function sendPageRT(m,o){const p=m.p;if(!p||!p.blob)return;
 try{const v=await enc(p.blob,480,.5,cachePv);if(v.length<90000)tx({t:'pc',id:Math.random().toString(36).slice(2),k:0,n:1,i:m.i,o,d:v,w:p.w,h:p.h,z:-1,pv:1,s:[]})}catch(e){}
 const d=await enc(p.blob),id=Math.random().toString(36).slice(2),Z=70000,N=Math.ceil(d.length/Z),sj=JSON.stringify(p.strokes||[]);
 for(let k=0;k<N;k++){const x={t:'pc',id,k,n:N,i:m.i,o,d:d.slice(k*Z,(k+1)*Z)};if(k==N-1){x.w=p.w;x.h=p.h;x.z=p.blob.size;if(sj.length<120000)x.s=p.strokes||[]}tx(x);if(k%3==2)await new Promise(r=>setTimeout(r,30))}}
function out(m,keep){if(!on||!m)return;if(!(STU?OUT_S:OUT_T).includes(m.t))return;const o=keep&&m.o?m.o:ID;
 if(m.t==='page'){const b=m.p&&m.p.blob;if(!b)return;const nw=Date.now();if(nw-(sentRT.get(b)||0)<5000)return;sentRT.set(b,nw);sendPageRT(m,o).catch(()=>{});return}
 let x=m;if(m.t==='pages')x={t:'pages',l:(m.l||[]).map(p=>({w:p.w,h:p.h,strokes:[],r:p.r||0,z:p.blob?p.blob.size:0}))};
 x={...x,o};if(m.t==='live'||m.t==='ptr'||m.t==='st')fast(x);else tx(x);if(!STU&&m.t==='st')prefetch(m.i)}
function prefetch(i){for(const k of[i,i+1,i+2,i-1]){const p=S.pages[k];if(!p)continue;if(p.blob){const b=p.blob,nw=Date.now();if(nw-(sentRT.get(b)||0)>=5000){sentRT.set(b,nw);sendPageRT({i:k,p},ID).catch(()=>{})}}else if(window.wantAt)window.wantAt(k)}}
ch.postMessage=function(m){op(m);try{out(m)}catch(e){}};
const asm={};
function rcv(m){if(!m||m.o===ID)return;
 if(m.t==='pc'){const now=Date.now();for(const k in asm)if(now-asm[k].t>60000)delete asm[k];
  const a=asm[m.id]=asm[m.id]||{p:[],c:0,t:now};a.p[m.k]=m.d;a.c++;if(m.w){a.w=m.w;a.h=m.h;a.s=m.s;a.z=m.z;a.pv=m.pv}
  if(a.c===m.n){delete asm[m.id];const cp=S.pages[m.i];if(STU&&cp&&cp.blob&&(a.pv||cp.z===a.z))return;fetch(a.p.join('')).then(r=>r.blob()).then(b=>{const c2=S.pages[m.i];if(a.pv&&c2&&c2.blob)return;ch.onmessage&&ch.onmessage({data:{t:'page',i:m.i,n:Math.random(),p:{blob:b,w:a.w,h:a.h,z:a.z,strokes:a.s||[]}}})}).catch(()=>{})}
  return}
 if(STU){
  if(m.t==='perm'){setDraw(!!m.d);return}
  if(m.t==='pages'){const old=S.pages.slice();Promise.resolve(ch.onmessage&&ch.onmessage({data:m})).then(()=>{(m.l||[]).forEach((q,i)=>{const o=old[i],n=S.pages[i];if(o&&n&&o.blob&&q.z&&q.z===o.z){n.blob=o.blob;n.bmp=o.bmp;n.url=o.url;n.z=o.z;n.strokes=o.strokes||n.strokes}});need=1});return}
  ch.onmessage&&ch.onmessage({data:m});return}
 if(m.t==='hello'||m.t==='need'){if(m.t==='hello'){sentRT=new WeakMap();tx({t:'perm',d:ALLOW?1:0,o:ID})}ch.onmessage&&ch.onmessage({data:m});return}
 if(['add','set','live','ptr'].includes(m.t)){if(!ALLOW)return;ch.onmessage&&ch.onmessage({data:m});op(m);out(m,true)}}
async function connect(url,key,r){await loadLib();room=r;cl=window.supabase.createClient(url,key,{realtime:{params:{eventsPerSecond:60}}});
 rc=cl.channel('ls-'+r,{config:{broadcast:{self:false,ack:false}}});rc.on('broadcast',{event:'m'},e=>{try{rcv(e.payload)}catch(x){}});
 return new Promise((ok,no)=>{let done=0;rc.subscribe(s=>{if(s==='SUBSCRIBED'){on=true;if(STU)tx({t:'hello',o:ID,n:Math.random()});if(!done){done=1;ok()}}
  else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'){on=false;if(!done){done=1;no(new Error('Could not connect - check the Project URL / key and that Realtime is on'))}}else if(s==='CLOSED')on=false})})}
function stop(){on=false;try{rc&&cl.removeChannel(rc)}catch(e){}rc=null;cl=null}
const css=document.createElement('style');css.textContent='body.rnodraw #tb [data-t]:not([data-t=hand]),body.rnodraw #tb [onclick^="undo"],body.rnodraw #tb [onclick^="redo"],body.rnodraw #tb [onclick^="clr"]{display:none!important}';document.head.appendChild(css);
function setDraw(v){RD=v;if(!STU)return;document.body.classList.toggle('rnodraw',!v);const t=document.querySelector('#tb [data-t='+(v?'pen':'hand')+']');S.tool=v?'pen':'hand';if(t)t.click();if(v){document.body.classList.add('tbon');window.__pin=true;toast('The teacher allowed you to draw')}else{window.__pin=false;toast('Drawing is off - the teacher leads')}}
if(STU&&qs.get('r')&&qs.get('u')&&qs.get('k')){const cvv=document.getElementById('cv');cvv&&cvv.addEventListener('pointerdown',()=>{if(!RD&&S.tool!=='hand'){S.tool='hand'}},true)}
if(STU){const r=qs.get('r'),u=qs.get('u'),k=qs.get('k');
 if(r&&u&&k){try{ch.close()}catch(e){}op=()=>{};setDraw(false);toast('Connecting to your teacher…');connect(u,k,r).then(()=>toast('Connected. Waiting for the teacher…')).catch(e=>toast(e.message))}return}
/* teacher side */
ch.addEventListener('message',e=>{const m=e.data;if(m&&['add','set','live','ptr','st'].includes(m.t))out(m)});
const cfg=()=>{try{return JSON.parse(localStorage.getItem('lp.cloud')||'{}')}catch(e){return{}}};
const mb=[...document.querySelectorAll('button')].find(b=>/Media/.test(b.textContent)&&/mDlg/.test(b.getAttribute('onclick')||''));
if(!mb)return;
const btn=document.createElement('button');btn.className='btn';btn.textContent='🌐 Remote student';btn.title='Let a student on their own device see the student screen and draw';mb.parentNode.insertBefore(btn,mb);
function link(){const c=cfg();return location.href.split('#')[0].split('?')[0]+'?r='+encodeURIComponent(room)+'&u='+encodeURIComponent(c.url)+'&k='+encodeURIComponent(c.key)+'#student'}
function dlg(){let d=document.getElementById('rsd');if(d)d.remove();d=document.createElement('div');d.id='rsd';d.style.cssText='position:fixed;inset:0;z-index:99999;background:#0009;display:flex;align-items:center;justify-content:center';
 d.innerHTML='<div style="background:#1a2032;color:#eaeefb;border:1px solid #272e45;border-radius:16px;padding:18px;width:min(520px,92vw);font:14px system-ui"><b>🌐 Remote student link</b><p style="color:#8b95b5;margin:8px 0">Send this link to the student. They open it on their own device, see the student screen and can draw. Anyone with the link can join, so share it only with your student.</p><input id="rsl" readonly style="width:100%;padding:10px;border-radius:10px;border:1px solid #272e45;background:#0b0d14;color:#eaeefb"><label style="display:flex;align-items:center;gap:8px;margin:12px 0 0"><input type="checkbox" id="rsa"> Allow the student to draw (off = the student only watches you)</label><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn" id="rsc">Copy link</button><button class="btn" id="rss" style="background:#e11d48;border:0;color:#fff">Stop sharing</button><button class="btn" id="rsx">Close</button></div></div>';
 document.body.appendChild(d);const i=d.querySelector('#rsl');i.value=link();i.onfocus=()=>i.select();
 d.querySelector('#rsc').onclick=()=>{i.select();try{navigator.clipboard.writeText(i.value)}catch(e){document.execCommand('copy')}toast('Link copied')};
 d.querySelector('#rss').onclick=()=>{stop();ALLOW=false;btn.classList.remove('on');btn.textContent='🌐 Remote student';d.remove();toast('Remote student stopped')};
 const ca=d.querySelector('#rsa');ca.checked=ALLOW;ca.onchange=()=>{ALLOW=ca.checked;tx({t:'perm',d:ALLOW?1:0,o:ID});toast(ALLOW?'The student can draw now':'Drawing is off for the student')};d.querySelector('#rsx').onclick=()=>d.remove();d.onclick=e=>{if(e.target===d)d.remove()}}
btn.onclick=async()=>{if(on){dlg();return}const c=cfg();if(!c.url||!c.key){toast('First add your Supabase URL and key in Reports > Cloud sync');return}
 let r=localStorage.getItem('lp.room');if(!r){r=Math.random().toString(36).slice(2,10);try{localStorage.setItem('lp.room',r)}catch(e){}}
 btn.textContent='Connecting…';try{await connect(c.url,c.key,r);btn.classList.add('on');btn.textContent='🌐 Remote: on';dlg()}catch(e){btn.textContent='🌐 Remote student';toast(e.message)}}
})();
