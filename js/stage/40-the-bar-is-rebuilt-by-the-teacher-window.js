(function(){if(!STU)return;
 const b=document.body;b.classList.add('tabhide');
 const h=document.createElement('div');h.id='thot';b.appendChild(h);
 let t=0;const peek=()=>{clearTimeout(t);b.classList.add('tabpeek')},away=()=>{clearTimeout(t);t=setTimeout(()=>b.classList.remove('tabpeek'),1200)};
 h.addEventListener('pointerenter',peek);
 const bar=document.getElementById('stabs');if(bar){bar.addEventListener('pointerenter',peek);bar.addEventListener('pointerleave',away)}
 h.addEventListener('pointerleave',away);
 /* the bar is rebuilt by the teacher window; keep it hidden unless the user unhid it with the arrow */
})();
(function(){if(STU)return;try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}})();
