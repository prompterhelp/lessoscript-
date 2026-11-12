/* student tools: always auto-hide after the mouse leaves them (pin no longer sticks) */
(function(){
 if(!STU){try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail','thot'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}return}
 const b=document.body;let t=0,over=0;
 const hide=()=>{if(over)return;window.__pin=false;b.classList.remove('tbon')};
 const sched=()=>{clearTimeout(t);t=setTimeout(hide,1800)};
 document.addEventListener('pointermove',e=>{over=!!(e.target.closest&&e.target.closest('#tb,#rbar'));if(over)clearTimeout(t);else if(b.classList.contains('tbon'))sched()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){over=0;clearTimeout(t);hide()}},true);
 new MutationObserver(()=>{if(b.classList.contains('tbon')&&!over)sched()}).observe(b,{attributes:true,attributeFilter:['class']});
})();
