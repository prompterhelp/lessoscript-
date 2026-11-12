(function(){if(STU)return;let P;try{P=window.parent;if(!P||P===window)return;P.document.documentElement}catch(e){return}
const hex=v=>{v=String(v||'').trim();const m=v.match(/^#([0-9a-f]{6})$/i);return m?[0,2,4].map(i=>parseInt(m[1].substr(i,2),16)):null};
const lum=c=>(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255;let key='';
function sync(){try{const cs=P.getComputedStyle(P.document.documentElement),g=n=>cs.getPropertyValue(n).trim(),bg=hex(g('--bg'));if(!bg||lum(bg)>.45)return;
 const k=[g('--bg'),g('--surface'),g('--surface-2'),g('--line'),g('--fg'),g('--muted'),g('--accent')].join();if(k===key)return;key=k;
 const r=document.documentElement.style;r.setProperty('--bg',g('--bg'));r.setProperty('--s1',g('--surface'));r.setProperty('--s2',g('--surface-2'));r.setProperty('--bd',g('--line'));r.setProperty('--tx',g('--fg'));r.setProperty('--mu',g('--muted'));r.setProperty('--a',g('--accent'))}catch(e){}}
sync();setInterval(sync,1500);
const st=document.createElement('style');st.textContent='html body .top,html body #dtabs,html body #rail,html body #panel{background:var(--s1)!important;border-color:var(--bd)!important;box-shadow:none!important}html body #stage{background:var(--bg)!important}html body .dt{background:var(--s2)}html body .dt.on{background:var(--bg)!important}html body .tgrp{background:var(--s2)!important;border-color:var(--bd)!important}html body #tb{background:var(--s1)!important;border-color:var(--bd)!important}html body #pg,html body #gp{background:var(--s2)!important;border-color:var(--bd)!important}';(document.body||document.documentElement).appendChild(st);
})();
