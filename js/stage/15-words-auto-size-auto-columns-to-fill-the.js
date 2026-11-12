/* words: auto-size + auto-columns to fill the student screen */
(function(){
  wordsHTML=function(t){
    const L=String(t||'').split('\n').filter(x=>x.trim()),n=L.length;
    const s=n<=1?2.4:n==2?2:n<=4?1.7:n<=6?1.4:n<=9?1.15:n<=12?1:.85;
    let c=n<=1?1:n==2?2:n==3?3:n==4?2:n<=9?3:n<=12?4:5;
    if(innerWidth<innerHeight)c=Math.min(c,2);
    return '<div class="wvin" data-n="'+n+'" style="--cols:'+c+';--s:'+s+'">'+L.map(x=>{const a=x.split('|').map(q=>q.trim());
      return '<div class="wc"><span class="wt" dir="auto">'+esc(a[0]||'')+'</span><span class="wm" dir="auto">'+esc(a[1]||'')+(a[2]?'<small>'+esc(a[2])+'</small>':'')+'</span></div>'}).join('')+'</div>'};
  if(!STU)rw();
  addEventListener('resize',()=>{if(STU){const o=$('ovw');if(o&&o.style.display==='flex'&&S.pages[S.i]&&S.lastWords){o.innerHTML=wordsHTML(S.lastWords)}}});
  const _sw=showWords;showWords=function(t){S.lastWords=t;return _sw(t)};
})();

/* Stop sharing: works for files/slides too (blanks the student screen; click again to resume) */
(function(){
  if(STU)return;
  const old=document.getElementById('stopshare');if(old)old.remove();
  const b=document.createElement('button');b.id='stopshare2';
  b.style.cssText='position:absolute;top:14px;right:14px;z-index:9;display:none;padding:9px 16px;border-radius:12px;border:0;font:700 14px Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);cursor:pointer;color:#fff';
  document.getElementById('stage').appendChild(b);
  b.onclick=()=>{
    if(S.blank){blank();return}
    let did=0;
    if(S.media||(typeof LV!=='undefined'&&LV)){try{closeMedia()}catch(e){try{mClose(1)}catch(_){}}did=1}
    if(S.ov){ovSet(null);did=1}
    if(S.words){S.words=0;try{wb()}catch(e){}st();did=1}
    if(!did&&S.pages.length){blank()}
    toast(did?'Stopped sharing':'Student screen blanked');
  };
  setInterval(()=>{const on=S.pages.length||S.media||(typeof LV!=='undefined'&&LV);b.style.display=on?'block':'none';
    b.textContent=S.blank?'▶ Resume sharing':'⏹ Stop sharing';b.style.background=S.blank?'#12b886':'#ff4d6d'},300);
})();
