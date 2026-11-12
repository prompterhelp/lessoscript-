(function(){
/* words: only "term | meaning" lines become cards; any other text stays together as ONE paragraph */
wordsHTML=function(t){
 const items=[];let buf=[];
 const flush=()=>{const s=buf.join('\n').replace(/^\s*\n+|\n+\s*$/g,'');if(s.trim())items.push({p:s});buf=[]};
 String(t||'').split('\n').forEach(l=>{if(l.includes('|')){flush();items.push({c:l.split('|').map(q=>q.trim())})}else buf.push(l)});flush();
 const nC=items.filter(x=>x.c).length,nP=items.length-nC;
 const s=!nC?1.6:nC<=1?2.4:nC==2?2:nC<=4?1.7:nC<=6?1.4:nC<=9?1.15:nC<=12?1:.85;
 let c=!nC?1:nC<=1?1:nC==2?2:nC==3?3:nC==4?2:nC<=9?3:nC<=12?4:5;
 if(innerWidth<innerHeight)c=Math.min(c,2);
 return '<div class="wvin'+(nC?'':' pa')+'" data-n="'+Math.max(1,nC+nP)+'" style="--cols:'+c+';--s:'+s+'">'+items.map(x=>{
  if(x.p!=null)return '<div class="wp" dir="auto">'+esc(x.p)+'</div>';
  const a=x.c,m=a[1]||'',nt=a[2]||'';
  return '<div class="wc"><span class="wt" dir="auto">'+esc(a[0]||'')+'</span>'+((m||nt)?'<i class="wd"></i><span class="wm" dir="auto">'+esc(m)+(nt?'<small>'+esc(nt)+'</small>':'')+'</span>':'')+'</div>'}).join('')+'</div>'};
if(!STU){try{rw()}catch(e){}if(S.words)st()}

/* top bar: regroup existing buttons (handlers untouched), line icons, calm layout */
if(!STU){
 const top=document.querySelector('.top');if(top){
 const I=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
 const IC={
  lib:I('<path d="M4 5v14M9 5v14"/><rect x="13" y="5" width="7" height="14" rx="1.5" transform="rotate(-8 16.5 12)"/>'),
  open:I('<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>'),
  link:I('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  board:I('<path d="M12 5v14M5 12h14"/>'),
  focus:I('<path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3"/>'),
  panel:I('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M15 4v16"/>'),
  media:I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor"/>'),
  stu:I('<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/>')};
 const q=s=>top.querySelector(':scope>button[onclick^="'+s+'"]');
 const set=(b,ic,label,title)=>{if(!b)return;b.innerHTML=ic+(label?'<span class="lbl">'+label+'</span>':'');if(title)b.title=title};
 const lib=q('libDlg'),opn=q('F.click'),lnk=q('openLink'),brd=q('addBoard'),zn=q('zen'),pn=q('tp'),md=q('mDlg'),st2=q('openStu');
 set(lib,IC.lib,'Library','Saved lessons & links');set(opn,IC.open,'Open','Open PDF / PowerPoint / images');set(lnk,IC.link,'Link','Open from a link');set(brd,IC.board,'Board','New blank board');
 set(zn,IC.focus,'Focus','Hide panels (Tab)');set(pn,IC.panel,'','Notes · Words · Study · Class');set(md,IC.media,'Media','Show media to students');set(st2,IC.stu,'Student screen','Open the student screen');
 const g1=document.createElement('div');g1.className='tgrp';[lib,opn,lnk,brd].forEach(b=>b&&g1.appendChild(b));
 const g2=document.createElement('div');g2.className='tgrp';const stop=document.getElementById('stopTop');
 [zn,pn,md].forEach(b=>b&&g2.appendChild(b));
 const dv=document.createElement('span');dv.className='tdiv';g2.appendChild(dv);
 if(stop)g2.appendChild(stop);if(st2)g2.appendChild(st2);
 const sp=top.querySelector('.sp');top.insertBefore(g1,sp);top.appendChild(g2);
 }
}
/* student window must receive these changes too */
try{const c=document.documentElement.cloneNode(true);['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield','stabs','mcur','mtrail'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));SRC='<!doctype html>'+c.outerHTML}catch(e){}
})();
