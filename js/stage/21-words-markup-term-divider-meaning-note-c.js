/* words markup: term, divider, meaning (+ note chip) */
(function(){
  wordsHTML=function(t){
    const L=String(t||'').split('\n').filter(x=>x.trim()),n=L.length;
    const s=n<=1?2.4:n==2?2:n<=4?1.7:n<=6?1.4:n<=9?1.15:n<=12?1:.85;
    let c=n<=1?1:n==2?2:n==3?3:n==4?2:n<=9?3:n<=12?4:5;
    if(innerWidth<innerHeight)c=Math.min(c,2);
    return '<div class="wvin" data-n="'+n+'" style="--cols:'+c+';--s:'+s+'">'+L.map(x=>{const a=x.split('|').map(q=>q.trim()),m=a[1]||'',nt=a[2]||'';
      return '<div class="wc"><span class="wt" dir="auto">'+esc(a[0]||'')+'</span>'+((m||nt)?'<i class="wd"></i><span class="wm" dir="auto">'+esc(m)+(nt?'<small>'+esc(nt)+'</small>':'')+'</span>':'')+'</div>'}).join('')+'</div>'};
  try{if(!STU)rw()}catch(e){}
})();

/* Study cards: wait for all pages, show clear AI messages */
(function(){
  window.aiStatus=function(t){let e=document.getElementById('qerr');if(!e){e=document.createElement('div');e.id='qerr';e.className='mu';e.style.cssText='padding:8px 10px;border-radius:10px;background:var(--s2);border:1px solid var(--bd);line-height:1.4;word-break:break-word';const q=document.getElementById('qc');q.parentNode.insertBefore(e,q.nextSibling)}e.textContent=t;try{toast(t.slice(0,90))}catch(_){}};
  const _b=buildCards;
  buildCards=async function(m){
    if(S.pages.some(p=>p.lazy&&!p.blob)){aiStatus('Reading all pages first…');const t0=Date.now();while(S.pages.some(p=>p.lazy&&!p.blob)&&Date.now()-t0<120000)await new Promise(r=>setTimeout(r,300))}
    const chars=S.pages.reduce((a,p)=>a+((p.text||'').length),0);
    aiStatus('Working… (read '+chars+' characters from '+S.pages.length+' pages)');
    const r=await _b(m);
    if(!document.getElementById('qerr').textContent.startsWith('⚠')&&!/^✓|^AI answered|^No AI/.test(document.getElementById('qerr').textContent))aiStatus(cards().length+' cards ready (text read: '+chars+' characters)');
    return r};
})();
