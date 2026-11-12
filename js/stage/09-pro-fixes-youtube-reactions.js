/* ===== Pro fixes: YouTube + live reactions ===== */
(function(){
const hostOK=/^https?:$/.test(location.protocol);
function ytCard(id,why){const e=$('media');if(!e||$('ybox'))return;const b=document.createElement('div');b.id='ybox';
 b.innerHTML='<div class="th" style="background-image:url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)"></div><div style="font-size:20px;font-weight:700">Video ready</div><div style="opacity:.7;max-width:460px;font-size:13px">'+why+'</div><div style="display:flex;gap:8px"><a class="btn pri" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v='+id+'" style="text-decoration:none">▶ Play on YouTube</a>'+(STU?'':'<button class="btn" onclick="closeMedia()">✕ Close</button>')+'</div>';e.appendChild(b)}
// final, single mOpen wrapper (replaces earlier layered ones)
const base=mOpen;
mOpen=function(m){base(m);if(m.type!='yt')return;const n=$('mn');if(!n)return;
 n.referrerPolicy='strict-origin-when-cross-origin';n.src=ytSrc(m.id);n.allow='autoplay; fullscreen; encrypted-media; picture-in-picture';
 n.style.cssText='width:100%;height:100%;border:0';m.retry=0};
ytFail=function(code){if(!hostOK&&S.media&&S.media.type=='yt'&&!S.media.retry){}if(!S.media||S.media.type!='yt')return;const n=$('mn');S.media.retry=(S.media.retry||0)+1;
 if(n&&S.media.retry==1){n.src=ytSrc(S.media.id,1);return}
 if(n)n.style.display='none';
 ytCard(S.media.id,'This video owner blocks playing inside other pages (error '+code+'). It plays normally on YouTube.')};
// error listener for the iframe (YouTube posts events once "listening")
const _mo3=mOpen;mOpen=function(m){_mo3(m);if(m.type=='yt'){const n=$('mn');if(n)n.onload=()=>{try{setTimeout(()=>{yt('setPlaybackQuality',['hd1080'])},1500);n.contentWindow.postMessage(JSON.stringify({event:'listening',id:1}),'*');n.contentWindow.postMessage(JSON.stringify({event:'command',func:'addEventListener',args:['onError']}),'*')}catch(_){}}}};

/* ---------- reactions & effects ---------- */
const L=document.createElement('div');L.id='fxl';document.body.appendChild(L);
const R=document.createElement('div');R.id='rbar';
const items=[['❤️','heart'],['👍','like'],['👏','clap'],['🔥','fire'],['🎉','confetti'],['🎆','fireworks'],['⭐','stars'],['😂','laugh']];
R.innerHTML=items.map(i=>'<button data-k="'+i[1]+'" title="'+i[1]+'">'+i[0]+'</button>').join('')+'<div class="lc" id="lcnt">0 ❤</div>';
document.body.appendChild(R);
const T=document.createElement('button');T.id='rtog';T.textContent='😊';T.title='Reactions';document.body.appendChild(T);
T.onclick=()=>{R.style.display=R.style.display=='none'?'flex':'none'};
let likes=0;const cnt=()=>{const e=$('lcnt');if(e)e.textContent=likes+' ❤'};
const rnd=(a,b)=>a+Math.random()*(b-a);
function el(txt,x,y,size){const e=document.createElement('div');e.className='fxe';e.textContent=txt;e.style.cssText='left:'+x+'px;top:'+y+'px;font-size:'+size+'px';L.appendChild(e);return e}
function anim(e,kf,d,delay){const a=e.animate(kf,{duration:d,delay:delay||0,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});a.onfinish=()=>e.remove()}
const W=()=>innerWidth,H=()=>innerHeight;
const FX={
 heart(em){for(let i=0;i<14;i++){const x=rnd(W()*.15,W()*.85),e=el(em||'❤️',x,H()-60,rnd(28,60)),dx=rnd(-90,90);anim(e,[{transform:'translate(0,0) scale(.4)',opacity:0},{opacity:1,offset:.15},{transform:'translate('+dx+'px,'+-H()*rnd(.5,.9)+'px) scale(1.2) rotate('+rnd(-30,30)+'deg)',opacity:0}],rnd(2200,3400),i*90)}},
 like(){FX.heart('👍')},clap(){FX.heart('👏')},fire(){FX.heart('🔥')},laugh(){FX.heart('😂')},
 stars(){for(let i=0;i<26;i++){const e=el(['⭐','✨','🌟'][i%3],rnd(0,W()),rnd(0,H()),rnd(22,50));anim(e,[{transform:'scale(0) rotate(0)',opacity:0},{transform:'scale(1.3) rotate(120deg)',opacity:1,offset:.4},{transform:'scale(0) rotate(260deg)',opacity:0}],rnd(1100,1800),rnd(0,900))}},
 confetti(){const c=['#ff4d6d','#ffd166','#5eead4','#8ecae6','#c77dff','#80ed99'];for(let i=0;i<90;i++){const e=document.createElement('div');e.className='fxe';const s=rnd(7,13);e.style.cssText='left:'+rnd(0,W())+'px;top:-20px;width:'+s+'px;height:'+s*1.6+'px;background:'+c[i%6]+';border-radius:2px';L.appendChild(e);anim(e,[{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+rnd(-120,120)+'px,'+(H()+40)+'px) rotate('+rnd(300,900)+'deg)',opacity:.9}],rnd(2200,3800),rnd(0,700))}},
 fireworks(){const cols=['#ff4d6d','#ffd166','#5eead4','#c77dff','#8ecae6'];for(let b=0;b<4;b++){const cx=rnd(W()*.2,W()*.8),cy=rnd(H()*.15,H()*.5),col=cols[b%5],d=b*420;
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=rnd(90,190),e=document.createElement('div');e.className='fxe';e.style.cssText='left:'+cx+'px;top:'+cy+'px;width:7px;height:7px;border-radius:50%;background:'+col+';box-shadow:0 0 10px '+col;L.appendChild(e);
   anim(e,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*r+'px,'+(Math.sin(a)*r+40)+'px) scale(.2)',opacity:0}],rnd(900,1300),d)}}}
};
function play(k){(FX[k]||FX.heart)();if(k=='heart'||k=='like'){likes++;cnt()}}
function fire(k){play(k);try{send({t:'fx',k})}catch(_){}}
R.addEventListener('click',e=>{const b=e.target.closest('button');if(b)fire(b.dataset.k)});
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const k={'1':'heart','2':'like','3':'clap','4':'fire','5':'confetti','6':'fireworks','7':'stars','8':'laugh'}[e.key];if(k)fire(k)});
// receive effects from the other window (teacher <-> student)
const prev=ch.onmessage;ch.onmessage=async ev=>{const m=ev&&ev.data;if(m&&m.t=='fx'){if(m.n){if(seen.has(m.n))return;seen.add(m.n)}play(m.k);return}return prev(ev)};
})();

ui();
