/* Split view: show two tabs at once, each side controlled by the tab you tap, resizable divider */
(function(){
const VIEWS=['follow','reports','script','notes','history','stage','setup'],main=$('main'),nav=document.querySelector('.tabs');
let split=lsGet('lp.split')==='1',sec=lsGet('lp.split.sec')||'script',act='B',sw=parseFloat(lsGet('lp.split.w'))||50;window.__lsSec=()=>split?sec:null;
if(sec===S.view||!VIEWS.includes(sec))sec='script';
const sb=document.createElement('button');sb.className='tab';sb.setAttribute('role','tab');sb.id='tab-split';sb.type='button';sb.title='Split screen: show two tabs side by side';sb.textContent='◫ Split';nav.appendChild(sb);
const dv=document.createElement('div');dv.id='splitDv';main.appendChild(dv);
function rend(k){try{if(k==='follow')renderFollow(false);else if(k==='script')renderScript();else if(k==='notes')renderNotes();else if(k==='history')renderHistory();else if(k==='reports')rpInit();else if(k==='stage'){const f=$('stageFrame');if(f&&!f.getAttribute('src'))f.src='stage.html'}else if(k==='setup')$('scriptInput').value=S.script}catch(e){}}
function renderSec(){rend(sec)}
const sp={};
function apply(){document.body.classList.toggle('split',split);sb.setAttribute('aria-selected',String(split));
 VIEWS.forEach(k=>{const e=$('view-'+k),t=$('tab-'+k);if(!e)return;if(!e.hidden)sp[k]=e.scrollTop;e.classList.remove('pA','pB','act');if(t)t.removeAttribute('data-sec');
  if(split){const was=e.hidden,on=k===S.view||k===sec;e.hidden=!on;if(k===S.view)e.classList.add('pA');else if(k===sec){e.classList.add('pB');if(t)t.setAttribute('data-sec','1')}if(on&&was){const y=sp[k]||0;requestAnimationFrame(()=>{e.scrollTop=y})}}});
 if(split){const a=$('view-'+(act==='B'?sec:S.view));a&&a.classList.add('act');main.style.setProperty('--sw',sw+'%');$('controls').hidden=!(S.view==='follow'||sec==='follow')}
 else main.style.removeProperty('--sw')}
const _sv=setView;
setView=function(v){
 if(!split)return _sv(v);
 if(act==='B'&&v!==S.view){if(v!==sec){sec=v;lsSet('lp.split.sec',sec);rend(v)}apply();return}
 if(v===S.view){if(sec===S.view)sec=VIEWS.find(k=>k!==S.view&&k!=='setup')||'script';rend(v);if(sec!==v)rend(sec);apply();return}
 if(v===sec){const t=S.view;S.view=v;sec=t;lsSet('lp.split.sec',sec)}else{S.view=v;rend(v)}
 VIEWS.forEach(k=>{const t=$('tab-'+k);if(t){t.setAttribute('aria-selected',String(k===S.view));t.tabIndex=k===S.view?0:-1}});
 if(S.view==='follow')try{scrollToCurrent(false)}catch(e){}
 apply()};
sb.onclick=()=>{split=!split;lsSet('lp.split',split?'1':'0');if(split){if(sec===S.view)sec=VIEWS.find(k=>k!==S.view);act='B';renderSec();toast&&toast(RPL==='ar'?'اضغط تبويباً لاختيار الجانب الأيمن':'Split on: tap a tab to fill the highlighted side. Tap a pane to switch sides.')}else{const keep=S.view;VIEWS.forEach(k=>{const e=$('view-'+k);if(e)e.hidden=k!==keep})}apply()};
main.addEventListener('pointerdown',e=>{if(!split)return;const v=e.target.closest('.view');let na;if(v&&v.classList.contains('pA'))na='A';else if(v&&v.classList.contains('pB'))na='B';else return;if(na===act)return;act=na;apply()},true);
let drag=0;dv.addEventListener('pointerdown',e=>{drag=1;dv.setPointerCapture(e.pointerId);document.querySelectorAll('iframe').forEach(f=>f.style.pointerEvents='none')});
dv.addEventListener('pointermove',e=>{if(!drag)return;const r=main.getBoundingClientRect(),vert=innerWidth<=700;sw=Math.min(80,Math.max(20,((vert?e.clientY-r.top:e.clientX-r.left)/(vert?r.height:r.width))*100));main.style.setProperty('--sw',sw+'%')});
const end=()=>{if(!drag)return;drag=0;lsSet('lp.split.w',String(Math.round(sw)));document.querySelectorAll('iframe').forEach(f=>f.style.pointerEvents='')};
dv.addEventListener('pointerup',end);dv.addEventListener('pointercancel',end);dv.addEventListener('dblclick',()=>{sw=50;lsSet('lp.split.w','50');apply()});
if(split){renderSec();apply()}
})();
