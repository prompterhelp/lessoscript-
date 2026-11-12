(function(){
 if(!STU){try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail','thot'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}return}
 const b=document.body;let near=0,fh=0;
 /* tools stay open while the mouse is on them or resting near their edge; they hide only after you move away */
 let ht=0;const hideNow=()=>{window.__pin=false;b.classList.remove('tbon')};
 document.addEventListener('pointermove',e=>{fh=0;near=!!(e.target.closest&&e.target.closest('#tb,#rbar'))||e.clientX>innerWidth-45||e.clientX<45;clearTimeout(ht);if(!near)ht=setTimeout(hideNow,450)},true);
 document.documentElement.addEventListener('mouseleave',()=>{near=0;clearTimeout(ht);ht=setTimeout(hideNow,250)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')fh=1},true);
 new MutationObserver(()=>{if(near&&!fh&&!b.classList.contains('tbon'))b.classList.add('tbon')}).observe(b,{attributes:true,attributeFilter:['class']});
 /* tab bar: only rebuild when the tab list really changed (rebuilding under the mouse made clicks get lost) */
 let last='';const _p=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;
  if(m&&m.t==='tabs'){const k=JSON.stringify([m.l,m.a]);if(k===last)return;last=k}
  return _p(ev)};
})();
