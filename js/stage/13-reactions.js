(function(){
if(!STU){try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog'].forEach(i=>{const e=c.querySelector('#'+i);e&&e.remove()});SRC='<!doctype html>'+c.outerHTML}catch(e){}}
/* ===== reactions ===== */
const RB=document.getElementById('rbar'),RT=document.getElementById('rtog');

if(RB&&RT){RB.style.display='flex';RT.onclick=()=>RB.classList.toggle('hide')}
const L=document.getElementById('fxl'),rnd=(a,b)=>a+Math.random()*(b-a);
/* ===== timer side-state ===== */
setInterval(()=>{if(document.hidden)return;const e=$('tmr');if(!e)return;const on=e.style.display==='block';document.body.classList.toggle('tmron',on);e.classList.toggle('low',!!S.end&&S.end-Date.now()<30000)},300);
document.querySelectorAll('.mu').forEach(x=>{if(/top-centre/.test(x.textContent))x.textContent='Preview: students see a compact timer at the side, so content stays clear'});
/* ===== YouTube / video: full sync (play, pause, seek, volume, mute, speed) ===== */
const mst={t:0,d:0,p:0};
addEventListener('message',e=>{if(typeof e.data!=='string'||String(e.origin).indexOf('youtube')<0)return;let d;try{d=JSON.parse(e.data)}catch(_){return}
 if(d.event==='infoDelivery'&&d.info){const i=d.info;if(i.currentTime!=null)mst.t=i.currentTime;if(i.duration)mst.d=i.duration;if(i.playerState!=null){if(i.playerState===1)mst.p=1;else if(i.playerState===2||i.playerState===0)mst.p=0}}});
const nEl=()=>$('mn'),isYT=()=>S.media&&S.media.type==='yt',isV=()=>S.media&&S.media.type==='video';
const cur=()=>isYT()?mst.t:(isV()&&nEl()?nEl().currentTime:0),dur=()=>isYT()?mst.d:(isV()&&nEl()&&nEl().duration)||0,playing=()=>isYT()?!!mst.p:(isV()&&nEl()?!nEl().paused:false);
const _ma=mcApply;
mcApply=function(a,v){const n=nEl(),M=S.media;if(!n||!M)return;
 if(a==='seekt'){if(isYT()){yt('seekTo',[v,true]);mst.t=v}else if(isV())n.currentTime=v;return}
 if(a==='vol'){if(isYT())yt('setVolume',[Math.round(v*100)]);else if(isV())n.volume=v;return}
 if(a==='mute'){M.muted=v;if(isYT())yt(v?'mute':'unMute');else if(isV())n.muted=v;return}
 if(a==='rate'){if(isYT())yt('setPlaybackRate',[v]);else if(isV())n.playbackRate=v;return}
 if(a==='sync'){if(STU&&v&&(isYT()||isV())){if(Math.abs(cur()-v.t)>2)mcApply('seekt',v.t);if(v.p&&!playing())_ma('play');if(!v.p&&playing())_ma('pause')}return}
 if(isYT()&&a==='play')mst.p=1;if(isYT()&&a==='pause')mst.p=0;
 return _ma(a,v)};
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
let drag=0,lastSend=0,muted=false;
function bar(){const e=$('media'),old=$('mbar');if(!e||!old||STU||!S.media||S.media.type==='img'||S.media.type==='web')return;old.remove();muted=false;
 const b=document.createElement('div');b.id='mbar';b.className='yb';
 b.innerHTML='<button class="pp" id="bPP" title="Play / pause">▶</button><button id="bB" title="Back 10s">⟲10</button><button id="bF" title="Forward 10s">10⟳</button><span class="tm" id="bT">0:00 / 0:00</span><input type="range" id="msk" min="0" max="1000" value="0"><button id="bM" title="Mute / unmute student">🔊</button><input type="range" id="bV" min="0" max="1" step=".05" value="1" title="Volume"><select id="bR" title="Speed"><option value=".5">0.5×</option><option value=".75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button id="bX" title="Restart">↺</button><button onclick="closeMedia()">✕ Close</button>';
 e.appendChild(b);
 $('bPP').onclick=()=>{mc(playing()?'pause':'play');if(isYT())mst.p=playing()?0:1};
 $('bB').onclick=()=>mc('seekt',Math.max(0,cur()-10));$('bF').onclick=()=>mc('seekt',cur()+10);$('bX').onclick=()=>{mc('restart');mst.t=0};
 $('bM').onclick=()=>{muted=!muted;mc('mute',muted);$('bM').textContent=muted?'🔇':'🔊'};
 $('bV').oninput=ev=>mc('vol',+ev.target.value);$('bR').onchange=ev=>mc('rate',+ev.target.value);
 const k=$('msk');k.onpointerdown=()=>drag=1;k.onpointerup=()=>{drag=0};
 k.oninput=()=>{const t=k.value/1000*dur();mst.t=t;if(Date.now()-lastSend>140){lastSend=Date.now();mc('seekt',t)}};k.onchange=()=>{mc('seekt',k.value/1000*dur());drag=0}}
const _mo=mOpen;mOpen=function(m){mst.t=0;mst.d=0;mst.p=0;_mo(m);if(!STU)bar()};
setInterval(()=>{if(STU||!S.media||S.media.type==='img'||!$('bPP'))return;const d=dur();$('bT').textContent=fmt(cur())+' / '+fmt(d);$('bPP').textContent=playing()?'⏸':'▶';if(!drag&&d)$('msk').value=cur()/d*1000},300);
setInterval(()=>{if(STU||!S.media||S.media.type==='img'||S.media.type==='web')return;try{send({t:'mc',a:'sync',v:{t:cur(),p:playing()?1:0}})}catch(_){}},1500);
/* ===== AI study cards (Groq + Claude + Gemini, scanned pages too) ===== */
const _ai=aiCall;
aiCall=async function(prompt,imgs){const a=aiCfg();if(!a||!a.key)throw new Error('Add your AI key in LessoScript > Setup');imgs=imgs||[];
 const mime=d=>d.startsWith('iVBOR')?'image/png':'image/jpeg';
 try{
 if(a.provider==='gemini'){const model=(a.model||'gemini-2.5-flash-lite').replace(/^models\//,'');const parts=imgs.map(d=>({inlineData:{mimeType:mime(d),data:d}}));parts.push({text:prompt});
  const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent?key='+encodeURIComponent(a.key),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts}],generationConfig:{maxOutputTokens:3000,temperature:.2}})});
  const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||r.status);return((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(x=>x.text||'').join('')}
 if(a.provider==='claude'){const content=imgs.map(d=>({type:'image',source:{type:'base64',media_type:mime(d),data:d}}));content.push({type:'text',text:prompt});
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':a.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:a.model||'claude-haiku-5-5',max_tokens:3000,messages:[{role:'user',content}]})});
  const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||r.status);return j.content.map(x=>x.text||'').join('')}
 return await _ai(prompt,imgs)}catch(e){if(e instanceof TypeError)throw new Error('Cannot reach the AI service. Check internet and your key in Setup.');throw e}};
aiCards=async function(txt,imgs){const o=await aiCall('From this lesson material create 12 to 25 study cards (a term or question, and a short answer) in the same language as the material. Return ONLY a JSON array like [{"q":"...","a":"..."}] with no extra text.\n\nMaterial:\n'+txt,imgs);
 let arr=[];const m=o.match(/\[[\s\S]*\]/);if(m){try{arr=JSON.parse(m[0])}catch(_){}}
 if(!arr.length){const re=/\{\s*"q"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"a"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;let x;while((x=re.exec(o)))arr.push({q:JSON.parse('"'+x[1]+'"'),a:JSON.parse('"'+x[2]+'"')})}
 if(!arr.length)throw new Error('AI returned no cards, try again');return arr.filter(x=>x&&x.q&&x.a).map(x=>[String(x.q),String(x.a)])};
buildCards=async function(manual){if(building)return;if(!S.pages.length){toast('Open a lesson (PDF / images) first');return}building=1;const dk=S.decks[S.d];if(dk)dk.built=1;
 try{const txt=S.pages.map(p=>p.text||'').join('\n'),w=S.pages.map(p=>p.words||'').join('\n');addCards(heur(txt+'\n'+w));
  const a=aiCfg();
  if(a&&a.key){const scan=txt.trim().length<80;
   if(scan&&a.provider==='groq'){aiStatus('⚠ These pages are pictures only (no text). Groq cannot read pictures: choose Claude or Gemini in LessoScript > Setup.')}
   else{if(manual)toast('✨ AI is reading your slides…');
    try{const imgs=scan?await Promise.all(S.pages.slice(0,6).map(p=>b64(p.blob))):[];const n=addCards(await aiCards(txt.slice(0,12000),imgs));aiStatus(n?'✓ AI added '+n+' new cards':'AI answered but added 0 new cards (all already exist)')}catch(e){aiStatus('⚠ AI error: '+e.message+'  [provider: '+a.provider+', model: '+(a.model||'default')+']')}}}
  else aiStatus('No AI key found. Add it in LessoScript > Setup (same browser).');
  const n=cards().length;if(n&&!(a&&a.key&&manual))toast(n+' study cards ready ✓')}finally{building=0}};
})();

// live tab share
let LV=null;
async function liveStart(){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia)return toast('Screen share not supported in this browser');
 let st;try{st=await navigator.mediaDevices.getDisplayMedia({video:{width:{ideal:2560},height:{ideal:1440},frameRate:{ideal:15}},audio:false,preferCurrentTab:false,selfBrowserSurface:'exclude'})}catch(e){return}
 $('md').style.display='none';
 mSet({type:'img',src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='});
 const v=document.createElement('video');v.srcObject=st;v.muted=true;v.playsInline=true;v.autoplay=true;v.id='mn';v.style.cssText='width:100%;height:100%;border:0;object-fit:contain;background:#000';
 const old=$('mn');if(old)old.replaceWith(v);v.play().catch(()=>{});
 const c=document.createElement('canvas'),x=c.getContext('2d');let busy=0;
 const tm=setInterval(()=>{if(busy||!v.videoWidth)return;const w=Math.min(1920,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);c.width=w;c.height=h;x.drawImage(v,0,0,w,h);busy=1;c.toBlob(b=>{busy=0;if(b)send({t:'frame',b})},'image/jpeg',.93)},200);
 LV={st,tm};st.getVideoTracks()[0].onended=()=>{if(LV){mClose(1)}};
}
const _mcl=mClose;mClose=function(o){if(LV){clearInterval(LV.tm);LV.st.getTracks().forEach(t=>t.stop());LV=null}_mcl(o)};

// websites (quran.com etc.) block iframes -> always use live tab share instead of a blank frame
const _mu0=mUrl;
mUrl=function(){const u=$('mu').value.trim();if(!u)return;const y=yid(u);
 const isWeb=!(y&&/youtu/.test(u))&&!/\.(mp4|webm|ogg|mov|m4v|png|jpe?g|gif|webp|svg|avif)(\?|#|$)/i.test(u)&&(/^https?:\/\//i.test(u)||/^[\w-]+(\.[\w-]+)+(\/|$)/.test(u));
 if(!isWeb)return _mu0();
 $('md').style.display='none';return addMediaTab({type:'web',src:/^https?:/i.test(u)?u:'https://'+u})};

// student: draw live frames on a canvas (no flicker, sharper)
(function(){if(!STU)return;const _pf=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;if(m&&m.t==='frame'){if(m.n){if(seen.has(m.n))return;seen.add(m.n);if(seen.size>400)seen.clear()}
  if(!S.media||!m.b)return;const bm=await createImageBitmap(m.b);let c=$('mn');
  if(!c||c.tagName!=='CANVAS'){const n=document.createElement('canvas');n.id='mn';n.style.cssText='width:100%;height:100%;object-fit:contain;background:#000';if(c)c.replaceWith(n);else $('media').appendChild(n);c=n}
  if(c.width!==bm.width||c.height!==bm.height){c.width=bm.width;c.height=bm.height}
  c.getContext('2d').drawImage(bm,0,0);bm.close();return}
  return _pf(ev)}})();

// proxy mode: quran.com opens inside the tool through your Cloudflare Worker (set once in Media)
(function(){const K='ls.proxy',px=()=>(localStorage.getItem(K)||'https://falling-bird-c92c.mohrmo1234.workers.dev').replace(/\/+$/,'');
 const _b=mOpen;mOpen=function(m){_b(m);const me=$('media');me.classList.toggle('web',m.type==='web');document.body.classList.toggle('hasweb',m.type==='web');if(m.type==='web'){const bb=$('mbar');bb&&bb.remove();if(!STU)S.wz=m.wz||1.25}if(m.prox){const go=()=>{const t=document.querySelector('#media #wtry');t&&t.click();setTimeout(applyWz,40)};setTimeout(go,30);setTimeout(go,300)}};
 const _m=mUrl;mUrl=function(){const u=$('mu').value.trim();let h='';try{h=new URL(/^https?:/i.test(u)?u:'https://'+u)}catch(e){return _m()}
  if(px()&&/(^|\.)quran\.com$/.test(h.hostname)){$('md').style.display='none';return addMediaTab({type:'web',prox:1,orig:h.href,src:px()+h.pathname+h.search},h.hostname)}return _m()};
 if(!STU){const d=document.querySelector('#md .mdc');if(d){const r=document.createElement('div');r.className='row';r.innerHTML='<input type="text" id="pxu" placeholder="Proxy address (optional) https://xxx.workers.dev" style="flex:1"><button class="btn" id="pxs">Save</button>';d.insertBefore(r,d.lastElementChild);$('pxu').value=px();$('pxs').onclick=()=>{const v=$('pxu').value.trim();try{if(v)localStorage.setItem(K,v);else localStorage.removeItem(K)}catch(e){}toast(v?'Proxy saved':'Proxy removed')}}}
})();

/* ===== website zoom: + / - / 0, toolbar 🔍 and ⤢, synced to the student screen ===== */
const BW=1280;
function placeWz(){const n=document.querySelector('#media iframe#mn'),box=$('media');if(!n||!box)return;const r=box.getBoundingClientRect();if(!r.width)return;const z=S.wz||1.25,vw=Math.round(BW/z),sc=r.width/vw,vh=Math.ceil(r.height/sc/20)*20,k=vw+'x'+vh+'@'+sc.toFixed(3);if(n.dataset.k===k)return;n.dataset.k=k;
 n.style.cssText='position:absolute;left:0;top:0;border:0;background:#0b0d14;width:'+vw+'px;height:'+vh+'px;transform:scale('+sc+');transform-origin:0 0'}
function applyWz(){if(S.wz==null)S.wz=1.25;if(S.media&&S.media.type==='web')S.media.wz=S.wz;const n=document.querySelector('#media iframe#mn');if(n)delete n.dataset.k;placeWz();if(!STU)send({t:'wz',z:S.wz})}
try{new ResizeObserver(()=>requestAnimationFrame(placeWz)).observe($('media'))}catch(e){}
const _zb=zoomBy;zoomBy=function(k,sx,sy){if(S.media&&S.media.type==='web'){S.wz=Math.max(.4,Math.min(3,(S.wz||1.25)*k));applyWz();if(!STU)toast('Zoom '+Math.round(S.wz*100)+'%');return}return _zb(k,sx,sy)};
const _rz=rst;rst=function(){if(S.media&&S.media.type==='web'){S.wz=1.25;applyWz();return}return _rz()};
const _w0=ch.onmessage;ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t==='wz'){if(m.n){if(seen.has(m.n))return;seen.add(m.n)}if(STU){S.wz=m.z;applyWz()}return}return _w0(ev)};

/* ===== stable website view: lock iframe layout size, fixed-size live-share canvas ===== */
placeWz=function(){const n=document.querySelector('#media iframe#mn'),box=$('media');if(!n||!box)return;const r=box.getBoundingClientRect();if(!r.width||!r.height)return;
 const z=S.wz||1.25;let L=n._L;
 const rk=Math.round(r.width/24)+'x'+Math.round(r.height/24);if(!L||L.z!==z||L.src!==n.src||L.rk!==rk){const vw=Math.round(BW/z),sc0=r.width/vw;L=n._L={z,src:n.src,rk,vw,vh:Math.ceil(r.height/sc0/20)*20};n.style.cssText='position:absolute;left:0;top:0;border:0;background:#0b0d14;width:'+vw+'px;height:'+L.vh+'px;transform-origin:0 0'}
 const sc=Math.min(r.width/L.vw,r.height/L.vh);n.style.left=Math.max(0,(r.width-L.vw*sc)/2)+'px';n.style.transform='scale('+sc.toFixed(4)+')'};
if(STU){const _p=ch.onmessage;ch.onmessage=async ev=>{const m=ev&&ev.data;
 if(m&&m.t==='frame'){if(m.n){if(seen.has(m.n))return;seen.add(m.n);if(seen.size>400)seen.clear()}
  if(!S.media||!m.b||S.media.src!=='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')return;const bm=await createImageBitmap(m.b);let c=$('mn');
  if(!c||c.tagName!=='CANVAS'){const n=document.createElement('canvas');n.id='mn';n.width=3840;n.height=2160;n.style.cssText='width:100%;height:100%;object-fit:contain;background:#000';if(c)c.replaceWith(n);else $('media').appendChild(n);c=n}
  const x=c.getContext('2d'),k=Math.min(c.width/bm.width,c.height/bm.height),w=bm.width*k,h=bm.height*k;x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.drawImage(bm,(c.width-w)/2,(c.height-h)/2,w,h);bm.close();return}
 return _p(ev)}}
try{requestAnimationFrame(()=>placeWz())}catch(e){}

/* ===== live share: fast frames while the picture changes, one sharp 4K frame when it stops ===== */
liveStart=async function(){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia)return toast('Screen share not supported in this browser');
 let st;try{st=await navigator.mediaDevices.getDisplayMedia({video:{cursor:'always',width:{ideal:3840},height:{ideal:2160},frameRate:{ideal:24}},audio:false,preferCurrentTab:false,selfBrowserSurface:'exclude'})}catch(e){return}
 try{st.getVideoTracks()[0].contentHint='detail'}catch(e){}
 $('md').style.display='none';mSet({type:'img',src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='});
 const v=document.createElement('video');v.srcObject=st;v.muted=true;v.playsInline=true;v.autoplay=true;v.id='mn';v.style.cssText='width:100%;height:100%;border:0;object-fit:contain;background:#000';
 const old=$('mn');if(old)old.replaceWith(v);v.play().catch(()=>{});
 const c=document.createElement('canvas'),x=c.getContext('2d'),sm=document.createElement('canvas');sm.width=64;sm.height=36;const sx=sm.getContext('2d',{willReadFrequently:true});
 let busy=0,prev=null,lastChange=0,sharpPending=false,fw=2200,lastSend=0,lastB=null;
 const send1=(w,q)=>{w=Math.min(w,v.videoWidth);const h=Math.round(w*v.videoHeight/v.videoWidth);c.width=w;c.height=h;x.imageSmoothingQuality=q>.9?'high':'medium';x.drawImage(v,0,0,w,h);busy=1;const t0=performance.now();
  c.toBlob(b=>{busy=0;lastSend=performance.now();const dt=lastSend-t0;
   if(q<.9){fw=dt>45?Math.max(1024,fw*.88):dt<20?Math.min(3000,fw*1.1):fw}   /* adapt fast-frame size to this computer */
   if(b){lastB=b;send({t:'frame',b})}},'image/jpeg',q)};
 const tm=setInterval(()=>{if(busy||!v.videoWidth)return;const now=performance.now();
  if(lastB&&!sharpPending&&now-lastSend>1500){lastSend=now;send({t:'frame',b:lastB})}   /* keep the student screen filled even if it opened late */
  sx.drawImage(v,0,0,64,36);const d=sx.getImageData(0,0,64,36).data;let diff=0;if(prev){for(let i=0;i<d.length;i+=4)diff+=Math.abs(d[i]-prev[i])+Math.abs(d[i+1]-prev[i+1])+Math.abs(d[i+2]-prev[i+2])}else diff=1e9;
  if(diff>60){prev=d;lastChange=now;sharpPending=true;if(now-lastSend>45)send1(fw,.88);return}
  if(sharpPending&&now-lastChange>220){sharpPending=false;send1(3840,.97)}},30);
 LV={st,tm};st.getVideoTracks()[0].onended=()=>{if(LV){mClose(1)}};
};

/* ===== modern reactions: GPU-light canvas particle engine ===== */
(function(){
const D=Math.min(devicePixelRatio||1,1.5),cvs=document.createElement('canvas');cvs.id='fxc';cvs.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99997';document.body.appendChild(cvs);
const x=cvs.getContext('2d');let W=0,H=0;const rs=()=>{W=innerWidth;H=innerHeight;cvs.width=W*D;cvs.height=H*D};rs();addEventListener('resize',rs);
const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0],later=(f,ms)=>setTimeout(f,ms),ob=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
const EM='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
let P=[],raf=0,last=0;
function add(p){if(P.length>240)return;P.push(Object.assign({k:'e',x:0,y:0,vx:0,vy:0,g:0,dr:0,age:0,life:2,size:30,rot:0,vr:0,a:1,sw:0,sf:3,sp:0},p));if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
function draw(p){const u=p.age/p.life,al=p.a*(p.nofade?1:(u<.08?u/.08:u>.65?(1-u)/.35:1));if(al<=0)return;x.globalAlpha=al;
 if(p.k==='e'){x.globalCompositeOperation='source-over';const s=ob(Math.min(1,p.age/(p.pop?.4:.25)));x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.scale(s,s);x.font=p.size+'px '+EM;x.textAlign='center';x.textBaseline='middle';x.fillText(p.t,0,0);x.restore()}
 else if(p.k==='r'){x.globalCompositeOperation='source-over';x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.fillStyle=p.color;x.fillRect(-p.size/2,-p.size*.3*Math.abs(Math.cos(p.age*p.fl)),p.size,p.size*.6*Math.abs(Math.cos(p.age*p.fl))+1);x.restore()}
 else if(p.k==='c'){x.globalCompositeOperation='lighter';x.fillStyle=p.color;x.beginPath();x.arc(p.x,p.y,p.size*(1-u*.5),0,7);x.fill();}
 else if(p.k==='sp'){x.globalCompositeOperation='lighter';x.strokeStyle=p.color;x.lineCap='round';const h=p.h||[];for(let i=1;i<h.length;i++){x.globalAlpha=al*i/h.length;x.lineWidth=p.size*i/h.length;x.beginPath();x.moveTo(h[i-1][0],h[i-1][1]);x.lineTo(h[i][0],h[i][1]);x.stroke()}x.globalAlpha=al;x.fillStyle='#fff';x.beginPath();x.arc(p.x,p.y,p.size*.6,0,7);x.fill()}
 else if(p.k==='ring'){x.globalCompositeOperation='lighter';const e=1-Math.pow(1-u,3);x.strokeStyle=p.color;x.lineWidth=p.lw*(1-u);x.beginPath();x.arc(p.x,p.y,p.size+(p.max-p.size)*e,0,7);x.stroke()}
 else if(p.k==='st'){x.globalCompositeOperation='lighter';const s=Math.sin(u*Math.PI)*p.size;x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.fillStyle=p.color;x.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.22:s;x.lineTo(Math.cos(i*Math.PI/4)*r,Math.sin(i*Math.PI/4)*r)}x.closePath();x.fill();x.restore()}}
function tick(t){const dt=Math.min(.05,(t-last)/1000);last=t;x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,W,H);
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.age+=dt;if(p.age>=p.life){if(p.die)p.die(p);P.splice(i,1);continue}
  p.vy+=p.g*dt;const d=Math.max(0,1-p.dr*dt);p.vx*=d;p.vy*=d;p.x+=(p.vx+(p.sw?Math.sin(p.age*p.sf+p.sp)*p.sw:0))*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
  if(p.bounce&&p.y>H-p.size/2){p.y=H-p.size/2;p.vy*=-.62;if(Math.abs(p.vy)<90)p.vy=0}
  if(p.trail){(p.h=p.h||[]).push([p.x,p.y]);if(p.h.length>p.trail)p.h.shift()}
  draw(p)}
 x.globalAlpha=1;x.globalCompositeOperation='source-over';
 if(P.length)raf=requestAnimationFrame(tick);else{raf=0;x.clearRect(0,0,W,H)}}
const ring=(px,py,max,col)=>add({k:'ring',x:px,y:py,size:18,max,life:.9,color:col||'rgba(255,255,255,.85)',lw:7});
function pop(em,sz,glow){add({t:em,x:W/2,y:H/2,size:sz||190,life:1.5,vy:-26,pop:1,glow:glow||'rgba(255,255,255,.55)'});ring(W/2,H/2,Math.min(W,H)*.42)}
function burst(list,o,n,sp,sz,g){for(let i=0;i<n;i++){const a=R(0,6.283),v=R(sp*.5,sp);add({t:pick(list),x:o.x,y:o.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.25,g:g||650,dr:1.1,size:R(sz*.7,sz*1.2),vr:R(-4,4),life:R(1.4,2.2)})}}
/* ===== reaction sounds: layered modern synth audio (no files) ===== */
const SFX=(()=>{let ac,out,rv,busy=0,lastK='',lastT=0;
const on=()=>{try{return localStorage.getItem('lp.sfx')!=='0'}catch(e){return true}};
function init(){if(ac)return ac;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();
 const comp=ac.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=18;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.22;
 const sh=ac.createBiquadFilter();sh.type='highshelf';sh.frequency.value=6500;sh.gain.value=-3;
 out=ac.createGain();out.gain.value=.62;out.connect(sh);sh.connect(comp);comp.connect(ac.destination);
 const len=ac.sampleRate*1.9|0,ir=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}
 const cv=ac.createConvolver();cv.buffer=ir;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=380;rv=ac.createGain();rv.gain.value=1;rv.connect(cv);cv.connect(hp);hp.connect(out);return ac}
function arm(){const a=init();if(a&&!CB&&!CBt)CBt=setTimeout(()=>{try{mkClap()}catch(e){}},400);if(a&&a.state==='suspended')a.resume().catch(()=>{});return a}
function go(fn){const A=arm();if(!A)return;if(A.state==='running')return fn(A);const t0=performance.now();A.resume().then(()=>{if(A.state==='running'&&performance.now()-t0<500)fn(A)}).catch(()=>{})}
['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,arm,{passive:true}));
const R=(a,b)=>a+Math.random()*(b-a),sc=n=>261.63*Math.pow(2,[0,2,4,7,9][n%5]/12+Math.floor(n/5));
const env=(g,t,a,d,v)=>{g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)};
function V(t,a,d,v,pan,wet){const g=ac.createGain();env(g,t,a,d,v);let n=g;if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=pan||0;g.connect(p);n=p}n.connect(out);if(wet){const w=ac.createGain();w.gain.value=wet;n.connect(w);w.connect(rv)}return g}
function O(type,f,t,d,dst,to){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);o.connect(dst);o.start(t);o.stop(t+d+.1);return o}
function bell(f,t,d,v,pan,wet,r){const g=V(t,.004,d,v,pan,wet===undefined?.55:wet),c=O('sine',f,t,d+.05,g),m=ac.createOscillator(),mg=ac.createGain();m.frequency.value=f*(r||3.5);mg.gain.setValueAtTime(f*1.8,t);mg.gain.exponentialRampToValueAtTime(.01,t+d*.5);m.connect(mg);mg.connect(c.frequency);m.start(t);m.stop(t+d+.1)}
function pad(fs,t,d,v,pan,wet){const g=V(t,.09,d,v,pan,wet===undefined?.5:wet),lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=.7;lp.frequency.setValueAtTime(380,t);lp.frequency.exponentialRampToValueAtTime(2400,t+d*.45);lp.connect(g);fs.forEach(f=>[-7,7].forEach(dt=>{O('sawtooth',f,t,d,lp).detune.value=dt}))}
function sub(t,f0,f1,d,v){O('sine',f0,t,d,V(t,.004,d,v,0,.08),f1)}
function nz(t,d,v,f0,f1,q,type,pan,wet,a){const n=Math.max(1,ac.sampleRate*(d+.05)|0),b=ac.createBuffer(1,n,ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;
 const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type=type||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+d);s.connect(f);f.connect(V(t,a||.006,d,v,pan,wet));s.start(t);s.stop(t+d+.05)}
function clap(t,v,pan,q){q=q||1;nz(t,.09,v,1300*q,700*q,1.1,'bandpass',pan,.45,.002);nz(t+.012,.06,v*.7,2400*q,1500*q,.9,'bandpass',pan,.3,.002)}
function thump(t,f,v){O('sine',f,t,.2,V(t,.005,.2,v,0,.12),f*.55);nz(t,.1,v*.7,220,90,.7,'lowpass',0,.05,.003)}
function ha(t,f0,v,pan,d){const g=V(t,.015,d,v,pan,.25),o=ac.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f0*1.1,t);o.frequency.exponentialRampToValueAtTime(f0*.88,t+d);
 [[800,1,7],[1250,.6,8],[2700,.25,9]].forEach(F=>{const b=ac.createBiquadFilter();b.type='bandpass';b.frequency.value=F[0];b.Q.value=F[2];const fg=ac.createGain();fg.gain.value=F[1]*3.2;o.connect(b);b.connect(fg);fg.connect(g)});o.start(t);o.stop(t+d+.05);nz(t,.07,v*.5,1900,1200,1,'bandpass',pan,.2,.004)}
function crowd(t,n,len,v,lo,hi){for(let i=0;i<n;i++){const u=Math.random(),pos=len*u,w=Math.sin(Math.PI*Math.min(1,u*1.15+.05));nz(t+pos,R(.018,.04),v*(.35+.65*w)*R(.5,1),R(lo,hi),R(lo*.5,hi*.5),R(.8,1.6),'bandpass',R(-.9,.9),.3,.001)}}
function clk(t,v,f,pan){nz(t,R(.008,.02),v,f,f*.5,R(1.5,3),'bandpass',pan||0,.15,.0005)}
function applause(t,len,v){const sr=ac.sampleRate,N=sr*len|0,buf=ac.createBuffer(2,N,sr);for(let c=0;c<2;c++){const d=buf.getChannelData(c),lenb=sr*.02|0;let n=sr*len*(130+R(0,40))|0;n=len*(150+R(0,30))|0;
  for(let k=0;k<n*3;k++){const u=Math.random(),w=Math.pow(Math.sin(Math.PI*Math.min(1,u*1.08+.03)),1.3);if(Math.random()>.12+.88*w)continue;const st=u*(N-lenb)|0,a=R(.25,1)*(.4+.6*w),dec=R(.0018,.006)*sr;let p=0,lp=0;
   for(let i=0;i<lenb;i++){const x=Math.random()*2-1,h=x-p;p=x;lp+=(h-lp)*.38;d[st+i]+=lp*a*Math.exp(-i/dec)}}}
 const s=ac.createBufferSource();s.buffer=buf;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1700;bp.Q.value=.45;const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.5);g.gain.setValueAtTime(v,t+len*.55);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.connect(bp);bp.connect(g);g.connect(out);const w=ac.createGain();w.gain.value=.5;g.connect(w);w.connect(rv);s.start(t);s.stop(t+len+.05)}
var CB=null,CBt=0;
function mkClap(){if(CB)return CB;const sr=ac.sampleRate,N=sr*2.8|0,b=ac.createBuffer(2,N,sr),L=sr*.07|0;
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<8;i++){const f=1-Math.max(0,i-4)*.22;for(let k=0;k<6;k++){const st=((.05+i*.31+R(-.03,.03))*sr)|0,a=(.5+.5*Math.random())*f,dec=R(.005,.011)*sr;let p=0,lp=0;for(let j=0;j<L&&st+j<N;j++){const x=Math.random()*2-1,h=x-p;p=x;lp+=(h-lp)*.3;d[st+j]+=lp*a*Math.exp(-j/dec)*.5}}}}
 return CB=b}
function clapPlay(t){const s=ac.createBufferSource();s.buffer=mkClap();const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=.5;const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.7,t+.03);g.gain.setValueAtTime(.7,t+1.9);g.gain.linearRampToValueAtTime(.0001,t+2.7);s.connect(bp);bp.connect(g);g.connect(out);const w=ac.createGain();w.gain.value=.35;g.connect(w);w.connect(rv);s.start(t);s.stop(t+2.8)}
function hc(t,v,pan){const q=R(.8,1.3);nz(t,.012,v,2200*q,1500*q,1.4,'bandpass',pan,.3,.0008);nz(t+.007,.012,v*.8,1700*q,1200*q,1.4,'bandpass',pan,.3,.0008);nz(t+.015,.05,v*.7,1100*q,600*q,1.1,'bandpass',pan,.45,.001)}
function ha2(t,f0,v,pan,d,fs){fs=fs||1;const g=V(t,.04,d,v,pan,.3),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;lp.connect(g);const o=ac.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f0*1.06,t);o.frequency.exponentialRampToValueAtTime(f0*.9,t+d);const lf=ac.createOscillator(),lg=ac.createGain();lf.frequency.value=5.5;lg.gain.value=f0*.012;lf.connect(lg);lg.connect(o.frequency);
 [[700,1,4],[1220,.55,5],[2600,.22,6]].forEach(F=>{const b=ac.createBiquadFilter();b.type='bandpass';b.frequency.value=F[0]*fs;b.Q.value=F[2];const fg=ac.createGain();fg.gain.value=F[1]*3;o.connect(b);b.connect(fg);fg.connect(lp)});o.start(t);lf.start(t);o.stop(t+d+.05);lf.stop(t+d+.05);nz(t,d*.9,v*.5,1400,2600,.8,'bandpass',pan,.25,.02)}
const S={
 heart(t){[0,.85].forEach(d=>{thump(t+d,62,.7);thump(t+d+.24,52,.5)})},
 like(t){sub(t,200,100,.08,.12);bell(987.77,t,.5,.14,0,.12,2.76);bell(1318.51,t+.1,.8,.14,0,.18,2.76)},
 clap(t){clapPlay(t)},
 fire(t){nz(t,2.8,.15,520,240,.4,'lowpass',0,.15,.9);nz(t+.1,2.6,.03,2500,1500,.4,'bandpass',0,.2,.9);for(let i=0;i<34;i++){const u=t+.1+Math.random()*2.5,pn=R(-.7,.7);if(Math.random()<.7){const c=Math.random()<.35?3:1;for(let k=0;k<c;k++)nz(u+k*R(.012,.035),R(.015,.035),R(.07,.2),R(1800,4200),R(900,1800),R(3,6),'bandpass',pn,.2,.0005)}else{nz(u,.06,R(.18,.34),R(500,1100),200,2,'bandpass',pn,.25,.0005);O('sine',R(130,190),u,.07,V(u,.002,.07,.12,pn,.1),70)}}},
 confetti(t){sub(t,230,60,.14,.6);nz(t,.1,.45,3000,500,.5,'lowpass',0,.3,.001);for(let i=0;i<34;i++){const u=Math.random();nz(t+.07+u*1.3,R(.02,.05),R(.03,.1)*(1-u*.6),R(4000,9000),0,.7,'highpass',R(-.9,.9),.3,.003)}},
 fireworks(t){const bm=(u,v,pn)=>{sub(u,65,30,1.6,v*.7);nz(u,.08,v*.2,1400,500,.6,'lowpass',pn,.5,.006);nz(u,.6,v*.4,900,140,.6,'lowpass',pn,.6,.01);nz(u+.15,1.8,v*.2,500,80,.5,'lowpass',pn,.8,.3);O('sine',48,u+.3,1.4,V(u+.3,.2,1.4,v*.12,pn,.5),38);nz(u-.6,.6,v*.07,350,1500,.8,'bandpass',pn,.3,.4);for(let i=0;i<14;i++)nz(u+.25+Math.random()*1.3,R(.03,.06),R(.015,.05)*v,R(2200,3600),R(1400,2200),1.2,'bandpass',R(-.8,.8),.5,.012)};[[0,1.1,-.3],[1.1,.9,.3],[2.1,.7,0]].forEach(a=>bm(t+.7+a[0],a[1],a[2]))},
 stars(t){[[1568,0],[2093,.09],[2637,.19]].forEach((a,i)=>bell(a[0],t+a[1],1.5,.1-i*.015,(i-1)*.3,.35,2.76));nz(t,.7,.025,6000,9500,.6,'highpass',0,.5,.25)},
 laugh(t){for(let v=0;v<4;v++){const st=R(0,.2),f=R(240,380),fs=R(.9,1.25),pn=R(-.7,.7),n=5+(v%2),gp=R(.16,.2);for(let i=0;i<n;i++)ha2(t+st+i*gp,f*(1+Math.sin(i/n*3.14)*.06),.09*(1-i*.09),pn,R(.09,.12),fs)}}
};
function play(k){if(!on())return;const n=performance.now();if(k===lastK&&n-lastT<110||busy>6)return;lastK=k;lastT=n;busy++;setTimeout(()=>busy--,1100);go(A=>{try{(S[k]||S.like)(A.currentTime+.02)}catch(e){}})}
function ui(open){if(!on())return;go(A=>{const t=A.currentTime+.01;try{if(open){nz(t,.2,.07,500,3200,.8,'bandpass',0,.3,.07);bell(1318.5,t+.05,.4,.06,0,.5)}else{nz(t,.15,.06,2800,500,.8,'bandpass',0,.3,.04);bell(880,t,.28,.05,0,.4)}}catch(e){}})}
function tap(){if(!on())return;go(A=>{try{bell(1760,A.currentTime+.005,.2,.05,0,.2)}catch(e){}})}
return{play,ui,tap,on,S,ctx:arm,set(v){try{localStorage.setItem('lp.sfx',v?'1':'0')}catch(e){}}}})();
const FX={
 heart(o){pop('❤️',200,'rgba(255,60,110,.7)');for(let i=0;i<16;i++)later(()=>add({t:pick(['❤️','💖','💗','💕','💓']),x:R(W*.08,W*.92),y:H+50,vy:-R(170,380),sw:R(30,80),sf:R(2,4),sp:R(0,6),size:R(30,78),life:R(3.2,5),vr:R(-.4,.4)}),i*65)},
 like(o){pop('👍',200,'rgba(80,170,255,.6)');burst(['👍','✨'],{x:W/2,y:H/2},12,520,46)},
 clap(o){pop('👏',200,'rgba(255,200,80,.6)');burst(['👏','✨','🌟'],{x:W/2,y:H/2},18,620,46)},
 fire(o){for(let i=0;i<24;i++)later(()=>{add({t:'🔥',x:R(0,W),y:H+40,vy:-R(320,760),sw:R(10,40),sf:R(3,7),sp:R(0,6),size:R(46,104),life:R(1.3,2.4),glow:'rgba(255,120,0,.7)'});for(let k=0;k<2;k++)add({k:'c',x:R(0,W),y:H,vy:-R(250,700),vx:R(-60,60),color:pick(['#ff9f1c','#ff4d00','#ffd166']),size:R(2,5),life:R(1,2)})},i*20)},
 laugh(o){pop('😂',200,'rgba(255,220,60,.6)');for(let i=0;i<12;i++)later(()=>add({t:pick(['😂','🤣','😆']),x:R(40,W-40),y:-50,vx:R(-80,80),vy:R(0,120),g:1100,size:R(44,90),bounce:1,vr:R(-1.5,1.5),life:R(3.2,4.4)}),i*90)},
 confetti(o){const C=['#ff4d6d','#ffd166','#5eead4','#8ecae6','#c77dff','#80ed99','#ff9f1c'];[-1,1].forEach(sd=>{for(let i=0;i<50;i++)later(()=>add({k:'r',x:sd<0?-10:W+10,y:H+10,vx:-sd*R(250,1000),vy:-R(750,1500),g:950,dr:.75,color:pick(C),size:R(9,16),fl:R(8,18),rot:R(0,6),vr:R(-8,8),life:R(3,4.8),nofade:0}),i*6)})},
 fireworks(o){const hu=[350,45,170,270,200,20];for(let i=0;i<6;i++)later(()=>{const tx=R(W*.15,W*.85),ty=R(H*.12,H*.5),T=.75,hue=pick(hu);
  add({k:'sp',x:tx+R(-60,60),y:H,vx:0,vy:-(H-ty)/T,size:4,trail:9,life:T,color:'#ffe9a8',nofade:1,die:p=>{ring(p.x,p.y,150,'hsla('+hue+',100%,70%,.9)');for(let j=0;j<44;j++){const a=j/44*6.283+R(-.05,.05),v=R(160,440);add({k:'sp',x:p.x,y:p.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:230,dr:1.2,size:3.2,trail:8,life:R(1,1.7),color:'hsl('+(hue+R(-18,18))+',100%,'+R(55,72)+'%)'})}for(let j=0;j<10;j++)add({k:'c',x:p.x,y:p.y,vx:R(-160,160),vy:R(-160,160),g:140,dr:1,size:R(1.5,3),life:R(1.2,2),color:'#fff'})}})},i*420)},
 stars(o){pop('⭐',190,'rgba(255,220,90,.8)');const C=['#fff3b0','#ffd166','#5eead4','#c4b5fd','#ffffff'];for(let i=0;i<20;i++)later(()=>add({k:'st',x:R(20,W-20),y:R(20,H-20),size:R(14,36),rot:R(0,3),vr:R(-1,1),life:R(1,1.9),color:pick(C)}),R(0,1000))}
};
function fancy(k,o){const f=FX[k]||FX.heart;try{SFX.play(FX[k]?k:'heart')}catch(e){}try{f(o||{x:W-60,y:H/2})}catch(e){}}
const RB=document.getElementById('rbar');
const SB=document.createElement('button');SB.id='rsnd';SB.title='Sound';const sbu=()=>{SB.textContent=SFX.on()?'🔊':'🔇';SB.style.opacity=SFX.on()?'.85':'.5'};sbu();if(RB)RB.appendChild(SB);
const RT2=document.getElementById('rtog');if(RT2)RT2.addEventListener('click',()=>{if(RB)SFX.ui(!RB.classList.contains('hide'))});
if(!STU&&RB){RB.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopImmediatePropagation();if(b.id==='rsnd'){SFX.set(!SFX.on());sbu();SFX.tap();return}const r=b.getBoundingClientRect();fancy(b.dataset.k,{x:r.left+r.width/2,y:r.top+r.height/2});send({t:'fx',k:b.dataset.k})},true)}
document.addEventListener('keydown',e=>{if(STU||/TEXTAREA|INPUT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const k={'1':'heart','2':'like','3':'clap','4':'fire','5':'confetti','6':'fireworks','7':'stars','8':'laugh'}[e.key];if(k){e.stopImmediatePropagation();fancy(k);send({t:'fx',k})}},true);
const _f=ch.onmessage;ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t==='fx'){if(m.n){if(seen.has(m.n))return;seen.add(m.n)}fancy(m.k);return}return _f(ev)};
})();

/* ===== wheel = scroll, student re-follow, loading overlay, toggle position ===== */
(function(){
const st0=document.createElement('style');st0.textContent='#rtog{bottom:auto!important;top:104px!important;right:16px!important;width:42px!important;height:42px!important;font-size:18px!important}';document.head.appendChild(st0);
let wl=0;
$('stage').addEventListener('wheel',e=>{if(S.flow||e.ctrlKey||S.media)return;e.preventDefault();e.stopPropagation();if(STU)return;const g=geo();if(!g)return;
 if(S.v.z>1.001){S.v.cy+=e.deltaY/(g.bh*S.v.z);S.v.cx+=e.deltaX/(g.bw*S.v.z);clampV();need=1;st()}
 else{const n=Date.now();if(n-wl<350||Math.abs(e.deltaY)<4)return;wl=n;go(S.i+(e.deltaY>0?1:-1))}},{capture:true,passive:false});
if(STU){let lv='';const _s=ch.onmessage;ch.onmessage=ev=>{const m=ev&&ev.data;if(m&&m.t==='st'){const k=JSON.stringify([m.i,m.v]);if(k!==lv){lv=k;if(!S.follow){S.follow=1;const b=$('fol');if(b)b.style.display='none'}}}return _s(ev)}}
setInterval(()=>{if(document.hidden)return;const n=document.querySelector('#media iframe#mn');if(!n||n._ld)return;n._ld=1;const o=document.createElement('div');o.id='lsload';o.style.cssText='position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background:#0b0d14;color:#8b95b5;font:600 18px Inter,sans-serif';o.textContent='Loading page…';$('media').appendChild(o);const done=()=>o.remove();n.addEventListener('load',done);setTimeout(done,3500)},50);
document.addEventListener('visibilitychange',()=>{if(document.hidden)return;const n=document.querySelector('#media iframe#mn');if(!n)return;n.style.opacity='.99';requestAnimationFrame(()=>requestAnimationFrame(()=>n.style.opacity=''))});
})();

/* reaction toggle lives inside the toolbar; reaction bar steps aside when the side panel is open */
(function(){const t=document.getElementById('rtog'),tb=document.getElementById('tb');if(!t||!tb)return;
const st=document.createElement('style');st.textContent='#tb #rtog{position:static!important;width:38px!important;height:38px!important;min-width:38px!important;font-size:18px!important;border-radius:10px!important;background:none!important;box-shadow:none!important;transform:none!important;flex:none}#tb #rtog:hover{background:var(--s2)!important;transform:none!important}.po #rbar{right:346px!important}';document.head.appendChild(st);
tb.appendChild(t)})();

/* student screen = read-only mirror: its own zoom/pan can no longer break the sync */
(function(){return;const stg=document.getElementById('stage');
['pointerdown','dblclick','wheel','touchstart'].forEach(t=>stg.addEventListener(t,e=>{if(e.target.closest&&e.target.closest('#media'))return;e.stopPropagation();if(t==='wheel')e.preventDefault()},{capture:true,passive:false}));
setInterval(()=>{if(document.hidden)return;if(!S.follow){S.follow=1;const b=document.getElementById('fol');if(b)b.style.display='none'}},300)})();

/* zoom stays centred; view can never leave the page (no half-blank sides) */
clampV=function(){const v=S.v;v.z=Math.max(1,Math.min(10,v.z));const g=geo();if(!g||v.z<=1){v.cx=v.cy=.5;return}
 const vw=W/(g.bw*v.z),vh=H/(g.bh*v.z);
 v.cx=vw>=1?.5:Math.max(vw/2,Math.min(1-vw/2,v.cx));v.cy=vh>=1?.5:Math.max(vh/2,Math.min(1-vh/2,v.cy))};
(function(){const _z=zoomBy;zoomBy=function(k,sx,sy){return _z(k,sx,sy)};
 const _c=ch.onmessage;ch.onmessage=async ev=>{const r=await _c(ev);const m=ev&&ev.data;if(STU&&m&&m.t==='st'){clampV();need=1}return r};})();

setInterval(()=>{if(document.hidden)return;const b=document.getElementById('stopShare');if(b)b.style.display=(!STU&&(S.media||LV))?'':'none'},300);

/* Stop sharing button: visible on the teacher screen while anything is shown to students */
(function(){if(STU)return;const b=document.createElement('button');b.id='stopshare';b.textContent='⏹ Stop sharing';
b.style.cssText='position:absolute;top:14px;right:14px;z-index:9;display:none;padding:9px 16px;border-radius:12px;border:0;background:#ff4d6d;color:#fff;font:700 14px Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);cursor:pointer';
b.onclick=()=>{try{closeMedia()}catch(e){try{mClose(1)}catch(_){}}b.style.display='none';toast('Stopped sharing with students')};
document.getElementById('stage').appendChild(b);
setInterval(()=>{if(document.hidden)return;b.style.display=(S.media||LV)?'block':'none'},300)})();

/* proportional zoom v2: student mirrors the teacher's visible area; student can never zoom by itself */
(function(){
  st=function(){
    const p=P(),g=geo(),z=S.v.z;
    send({t:'st',i:S.i,v:S.v,blank:S.blank,words:S.words&&p?p.words:null,
      vw:g?W/(g.bw*z):1, vh:g?H/(g.bh*z):1});   /* not clamped: exact visible area */
  };
  if(!STU){
    try{new ResizeObserver(()=>st()).observe($('stage'))}catch(e){}
    return;
  }
  const apply=m=>{
    const g=geo();if(!g||!m||!m.vw||!m.v)return;
    const zw=m.vw>=1?1e9:W/(g.bw*m.vw),zh=m.vh>=1?1e9:H/(g.bh*m.vh),z=m.v.z<=1.001?1:(Math.min(zw,zh)>=1e9?1:Math.min(zw,zh));
    S.v={z:Math.max(1,Math.min(10,z)),cx:m.v.cx,cy:m.v.cy};
    clampV();need=1;
  };
  const prev=ch.onmessage;
  ch.onmessage=async ev=>{
    const r=await prev(ev),m=ev&&ev.data;
    if(m&&m.t==='st'){S.last=m;apply(m)}
    return r;
  };
  
  /* periodic re-lock removed: it pulled the student view back */          /* re-lock to teacher view */
  /* block every way a student could zoom */
  addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false,capture:true});
  addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','-','=','_','0'].includes(e.key))e.preventDefault()},true);
  ['gesturestart','gesturechange','gestureend'].forEach(t=>addEventListener(t,e=>e.preventDefault()));
})();
