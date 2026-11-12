(function(){
var $=function(i){return document.getElementById(i)},B=document.body;
/* student toolbar: measure tab bar + choose rows */
function fit(){if(!B.classList.contains('stu'))return;var sb=$('stabs'),tb=document.querySelector('.tb');
var vis=sb&&!B.classList.contains('tabhide')&&sb.offsetHeight>0;var h=vis?sb.offsetHeight:6;B.style.setProperty('--stabH',h+'px');
if(!tb)return;var n=[].filter.call(tb.children,function(x){return x.tagName!='HR'&&x.offsetParent!==null||x.tagName!='HR'&&getComputedStyle(x).display!='none'}).length||24;
var avail=innerHeight-h-16-10,rows=Math.max(4,Math.min(n,Math.floor(avail/33)));tb.style.setProperty('--rows',rows)}
var raf=0;function sched(){cancelAnimationFrame(raf);raf=requestAnimationFrame(fit)}
addEventListener('resize',sched);addEventListener('orientationchange',sched);
new MutationObserver(sched).observe(B,{attributes:true,attributeFilter:['class']});
setTimeout(function(){var sb=$('stabs');if(sb&&window.ResizeObserver)new ResizeObserver(sched).observe(sb);var tb=document.querySelector('.tb');if(tb)new MutationObserver(sched).observe(tb,{childList:true})},500);sched();
/* teacher dock collapse */
if(!B.classList.contains('stu')){var st=$('stage'),tb=$('tb');if(st&&tb){var m=document.createElement('button');m.id='tbMin';m.type='button';m.title='Hide / show tools';m.textContent='\u2304';
var ls=null;try{ls=localStorage.getItem('tbMin')}catch(e){}if(ls==='1'){tb.classList.add('min');m.textContent='\u270F\uFE0F'}
m.onclick=function(){var x=tb.classList.toggle('min');m.textContent=x?'\u270F\uFE0F':'\u2304';try{localStorage.setItem('tbMin',x?'1':'0')}catch(e){}};st.appendChild(m)}}
/* doc tab list + keep active tab visible */
var dt=$('dtabs');if(dt){var pop=document.createElement('div');pop.id='tlPop';document.body.appendChild(pop);var busy=0;
function dec(){if(busy)return;busy=1;var old=$('tlBtn');if(old)old.remove();var tabs=[].slice.call(dt.querySelectorAll('.dt'));
if(tabs.length>1){var b=document.createElement('button');b.id='tlBtn';b.type='button';b.textContent='\u25BE '+tabs.length;b.title='All tabs';
b.onclick=function(e){e.stopPropagation();pop.innerHTML='';tabs.forEach(function(t,k){var o=document.createElement('button');o.textContent=t.querySelector('span').textContent;if(t.classList.contains('on'))o.className='on';o.onclick=function(){pop.classList.remove('open');t.click()};pop.appendChild(o)});var r=b.getBoundingClientRect();pop.style.top=(r.bottom+6)+'px';pop.style.right=Math.max(6,innerWidth-r.right)+'px';pop.classList.toggle('open')};dt.appendChild(b)}
var on=dt.querySelector('.dt.on');if(on)on.scrollIntoView({block:'nearest',inline:'center'});busy=0}
new MutationObserver(function(){if(busy)return;cancelAnimationFrame(dec.r);dec.r=requestAnimationFrame(dec)}).observe(dt,{childList:true});
document.addEventListener('pointerdown',function(e){if(!e.target.closest('#tlPop,#tlBtn'))pop.classList.remove('open')},true);dec()}
})();