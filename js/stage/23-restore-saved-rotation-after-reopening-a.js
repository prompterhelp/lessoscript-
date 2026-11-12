(function(){
const tb=$('tb'),AU={t:0,d:1,s:5};S.keepZ=true;if(STU){tb.querySelectorAll('[title^="Rotate"],[title^="Keep the same"],[title^="Auto page turn"],[title^="Auto direction"],[title^="Flow"],[title="Zoom in"],[title="Zoom out"],.asec').forEach(e=>e.remove());[...tb.querySelectorAll('hr')].forEach(h=>{const p=h.previousElementSibling,n=h.nextElementSibling;if(!p||p.tagName=='HR'||!n)h.remove()})}
const mk=(h,t,fn)=>{const b=document.createElement('button');b.innerHTML=h;b.title=t;b.onclick=fn;return b};
async function rotP(p,turns,withStrokes){turns=((turns%4)+4)%4;if(!turns)return;
 const bm=p.bmp||await createImageBitmap(p.blob),w=bm.width,h=bm.height,odd=turns%2,c=document.createElement('canvas');
 c.width=odd?h:w;c.height=odd?w:h;const x=c.getContext('2d');x.translate(c.width/2,c.height/2);x.rotate(Math.PI/2*turns);x.drawImage(bm,-w/2,-h/2);
 p.blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.95));p.bmp=await createImageBitmap(p.blob);p.mip=null;p.pdf=null;p.hi=null;
 const ow=p.w;if(odd){p.w=p.h;p.h=ow}
 if(withStrokes)p.strokes=p.strokes.map(s=>({...s,w:odd?s.w*ow/p.w:s.w,p:s.p.map(q=>{let a=q[0],b=q[1];for(let k=0;k<turns;k++){const t=a;a=1-b;b=t}return[a,b]})}));
 p.rot=((p.rot||0)+turns)%4;p.url=URL.createObjectURL(p.blob)}
function railImg(i){if(STU)return;const d=$('rail').children[i],p=S.pages[i];if(d&&d.firstChild&&p)d.firstChild.src=p.url}
async function rot(dir){const p=P();if(!p)return;if(!p.blob){toast('Page still loading…');return}
 await rotP(p,dir,true);p.rotWant=p.rot;S.v.cx=S.v.cy=.5;railImg(S.i);sendPage(S.i);st();need=1}
window.rotPage=rot;
function step(){const n=S.pages.length;if(n<2)return;let k=S.i+AU.d;if(k>=n)k=0;if(k<0)k=n-1;go(k)}
function autoTog(){if(AU.t){clearInterval(AU.t);AU.t=0}else AU.t=S.flow?setInterval(()=>window.flowTick(AU),50):setInterval(step,AU.s*1000);bAu.classList.toggle('on',!!AU.t);toast(AU.t?'Auto page turn every '+AU.s+'s':'Auto page turn off')}
const bRot=mk('⟳','Rotate page 90° (R)',()=>rot(1)),
 bKz=mk('🔒','Keep the same zoom on every page',()=>{S.keepZ=!S.keepZ;bKz.textContent=S.keepZ?'🔒':'🔓';bKz.classList.toggle('on',S.keepZ);toast(S.keepZ?'Zoom stays the same on every page':'Zoom resets on each page')}),
 bAu=mk('⏱','Auto page turn on / off',autoTog),
 bDir=mk('▶','Auto direction: forward / backward',()=>{AU.d=-AU.d;bDir.textContent=AU.d>0?'▶':'◀';toast(AU.d>0?'Auto: forward':'Auto: backward')}),
 inp=document.createElement('input');
bKz.classList.add('on');inp.type='number';inp.min=1;inp.max=600;inp.value=5;inp.title='Seconds per page';inp.className='asec';
inp.onchange=()=>{AU.s=Math.max(1,+inp.value||5);inp.value=AU.s;if(AU.t){clearInterval(AU.t);AU.t=S.flow?setInterval(()=>window.flowTick(AU),50):setInterval(step,AU.s*1000)}};
const anchor=tb.querySelector('[onclick="rst()"]'),hr=document.createElement('hr');
[bRot,bKz,bAu,bDir,inp,hr].forEach(e=>tb.insertBefore(e,anchor));
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();
 if(k=='r'){rot(e.shiftKey?-1:1)}
 if(STU){if(k=='arrowright'||k=='pagedown')go(S.i+1);else if(k=='arrowleft'||k=='pageup')go(S.i-1);else if(k=='t')document.body.classList.toggle('tbon')}});
// restore saved rotation after reopening a file
setInterval(()=>{if(STU)return;S.pages.forEach((p,i)=>{if(p.rotWant&&p.blob&&(p.rot||0)!==p.rotWant&&!p.rb){p.rb=1;rotP(p,p.rotWant-(p.rot||0),false).then(()=>{p.rb=0;railImg(i);try{sendPage(i)}catch(e){}need=1}).catch(()=>{p.rb=0})}})},800);
// teacher receives what the student window does
if(!STU){const seen4=new Set(),prev=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;
  if(m&&['st','add','set','live','ptr','page'].includes(m.t)){
   if(m.n){if(seen4.has(m.n))return;seen4.add(m.n);if(seen4.size>600)seen4.clear()}
   const p=S.pages[m.i];
   if(m.t=='st'){if(p){const c=m.i!=S.i;S.i=m.i;{const g=geo();S.v=(g&&m.vw&&m.v.z>1.001)?{z:Math.max(1,Math.min(10,Math.min(W/(g.bw*m.vw),H/(g.bh*m.vh)))),cx:m.v.cx,cy:m.v.cy}:{z:1,cx:m.v.cx,cy:m.v.cy}}clampV();if(c){S.live=null;S.ptr=null;ui();try{want()}catch(e){}}need=1}}
   else if(m.t=='add'){p&&p.strokes.push(m.s);S.live=null;need=1}
   else if(m.t=='set'){p&&(p.strokes=m.l);need=1}
   else if(m.t=='live'){S.live=m.s;need=1}
   else if(m.t=='ptr'){S.ptr=m.p;need=1}
   else if(m.t=='page'&&p&&m.p){Object.assign(p,{blob:m.p.blob,w:m.p.w,h:m.p.h,strokes:m.p.strokes,bmp:null,mip:null,pdf:null,hi:null,dec:0});p.url=URL.createObjectURL(m.p.blob);railImg(m.i);need=1}
   return}
  return prev(ev)}}
// student: tools appear only when the mouse goes to the bottom/right edge (or T key / corner tap)
if(STU){S.tool='hand';const h=document.querySelector('#tb [data-t=hand]');h&&h.click();
 let over=0,ht=0;const show=()=>{document.body.classList.add('tbon');clearTimeout(ht);ht=setTimeout(()=>{if(!over&&!window.__pin)document.body.classList.remove('tbon')},2200)};
 document.addEventListener('pointermove',e=>{over=!!(e.target.closest&&e.target.closest('#tb,#rbar'));if(over||e.clientX>innerWidth-60||e.clientX<60)show()});
 document.documentElement.addEventListener('mouseleave',()=>{over=0});
 const hot=document.createElement('div');hot.id='hot';hot.onclick=()=>{window.__pin=!window.__pin;document.body.classList.toggle('tbon',!!window.__pin)};document.body.appendChild(hot)}
})();
