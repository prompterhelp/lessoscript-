(function(){
var B=document.body,$=function(i){return document.getElementById(i)};
/* student toolbar: choose column count so everything fits */
function fitCols(){
  if(!B.classList.contains('stu'))return;
  var tb=document.querySelector('.tb');if(!tb)return;
  var sbar=$('stabs'),h=sbar?sbar.offsetHeight:0;tb.style.setProperty('--tbTop',(h+12)+'px');
  var items=[].filter.call(tb.children,function(x){return x.tagName!='HR'&&x.offsetParent!==null});
  var cells=items.reduce(function(a,x){return a+((x.id==='sz'||x.type==='range')?2:1)},0);
  var perCol=Math.max(5,Math.floor((innerHeight-h-12-10-16)/38));
  tb.style.setProperty('--cols',Math.min(4,Math.max(2,Math.ceil(cells/perCol))));
}
var r=0;function sch(){cancelAnimationFrame(r);r=requestAnimationFrame(fitCols)}
addEventListener('resize',sch);addEventListener('orientationchange',sch);
new MutationObserver(sch).observe(B,{attributes:true,attributeFilter:['class']});
setInterval(function(){if(document.hidden)return;var sb=$('stabs');if(sb&&!sb._ro&&window.ResizeObserver){sb._ro=1;new ResizeObserver(sch).observe(sb)}fitCols()},1500);sch();
})();