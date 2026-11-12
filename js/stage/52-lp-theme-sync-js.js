(function(){
var isStu=false;try{isStu=!!STU}catch(e){}
if(isStu)return;
var P;try{P=window.parent;if(!P||P===window)return;P.document.documentElement}catch(e){return}
var R=document.documentElement,key='';
function hex(v){v=String(v||'').trim();var m=v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!m)return null;var h=m[1];if(h.length==3)h=h.replace(/./g,'$&$&');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
function lum(c){return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255}
function sync(){try{
  var cs=P.getComputedStyle(P.document.documentElement),g=function(n){return cs.getPropertyValue(n).trim()};
  var bg=g('--bg');if(!bg)return;
  var k=[bg,g('--surface'),g('--surface-2'),g('--line'),g('--fg'),g('--muted'),g('--accent'),g('--on-accent')].join('|');
  if(k===key)return;key=k;
  var c=hex(bg),light=c?lum(c)>.45:false,s=R.style;
  s.setProperty('--bg',bg);s.setProperty('--s1',g('--surface')||bg);s.setProperty('--s2',g('--surface-2')||bg);
  s.setProperty('--bd',g('--line'));s.setProperty('--tx',g('--fg'));s.setProperty('--mu',g('--muted'));
  var a=g('--accent')||'#5eead4';s.setProperty('--a',a);
  s.setProperty('--b',a);
  s.setProperty('--g','linear-gradient(135deg,'+a+',color-mix(in srgb,'+a+' 72%,'+(g('--fg')||'#fff')+'))');
  s.setProperty('--oa',g('--on-accent')||(light?'#fff':'#05211d'));
  s.setProperty('--lp-cs',light?'light':'dark');
  R.classList.add('lp-th');R.classList.toggle('lp-light',light);
}catch(e){}}
var raf=0;function soon(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;sync()})}
sync();
try{new MutationObserver(soon).observe(P.document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']})}catch(e){}
setInterval(function(){if(!document.hidden)sync()},3000);
addEventListener('focus',soon);document.addEventListener('visibilitychange',soon);
})();