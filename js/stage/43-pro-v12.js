/* returning to a tab keeps its pages, bitmaps and place: the student window reuses what it already has instead of reloading */
(function(){
 if(!STU){try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail','thot'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}return}
 const DK={};const _p=ch.onmessage;
 ch.onmessage=async ev=>{const m=ev&&ev.data;
  if(m&&m.t==='pages'&&m.id&&DK[m.id]&&DK[m.id].length===m.l.length){
   const a=DK[m.id];m.l.forEach((q,k)=>{const p=a[k];if(!p)return;p.strokes=q.strokes||p.strokes;p.r=q.r;if(!p.blob&&q.blob){p.blob=q.blob;p.w=q.w;p.h=q.h;p.bmp=null}});
   S.live=null;return _p({data:{t:'usedeck',id:m.id,n:Math.random()}})}
  const r=await _p(ev);
  if(m&&m.t==='pages'&&m.id)DK[m.id]=S.pages;
  return r};
})();
