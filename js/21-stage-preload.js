(function(){
function pre(){var f=document.getElementById('stageFrame');if(f&&!f.getAttribute('src'))f.src='stage.html'}
addEventListener('load',function(){setTimeout(function(){(window.requestIdleCallback?requestIdleCallback(pre,{timeout:4000}):pre())},1800)});
var t=document.getElementById('tab-stage');if(t)['pointerenter','touchstart','focus'].forEach(function(ev){t.addEventListener(ev,pre,{passive:true,once:true})});
})();