(function(){if(typeof STU==='undefined'||!STU)return;const st=document.getElementById('stage');if(!st)return;
const o=document.createElement('div');o.id='pgload';o.innerHTML='<i></i><span></span>';st.appendChild(o);const sp=o.querySelector('span');let last=0;
setInterval(()=>{try{const p=S.pages[S.i],wait=!!(p&&!p.bmp&&!S.blank&&!S.media);
if(wait){sp.textContent='Loading page '+(S.i+1)+' / '+S.pages.length+'…';const n=Date.now();if(n-last>800){last=n;try{needPg(S.i)}catch(e){}}}
if(o.classList.contains('on')!==wait)o.classList.toggle('on',wait)}catch(e){}},150)})();