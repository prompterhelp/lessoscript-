(function(){
function dock(){var tb=document.getElementById('tb');if(!tb||tb.dataset.dock||document.body.classList.contains('stu'))return;tb.dataset.dock=1;
var q=function(s){return tb.querySelector(s)};
var kids=[].slice.call(tb.children).filter(function(x){return x.tagName=='BUTTON'});
var oc=function(b){return b.getAttribute('onclick')||''};
var pen=q('[data-t=pen]'),hl=q('[data-t=hl]'),er=q('[data-t=eraser]'),hand=q('[data-t=hand]');
var undo=kids.find(function(b){return /undo\(/.test(oc(b))}),redo=kids.find(function(b){return /redo\(/.test(oc(b))});
var prev=kids.find(function(b){return /go\(S\.i-1\)/.test(oc(b))}),next=kids.find(function(b){return /go\(S\.i\+1\)/.test(oc(b))});
var rtog=document.getElementById('rtog');
var sw=[].slice.call(tb.querySelectorAll('button.sw')),sz=document.getElementById('sz');
var col=document.createElement('button');col.id='tbCol';col.type='button';col.title='Colour & size';col.innerHTML='<i></i>';
var more=document.createElement('button');more.id='tbMoreBtn';more.type='button';more.title='More tools';more.textContent='\u22EF';
var p1=document.createElement('div');p1.className='tbpop';p1.id='tbColPop';
var p2=document.createElement('div');p2.className='tbpop';p2.id='tbMore';
sw.forEach(function(x){p1.appendChild(x)});if(sz){sz.style.width='150px';p1.appendChild(sz)}
var keep=[pen,hl,er,hand,col,undo,redo,prev,next,rtog,more].filter(Boolean);
function lab(b){if(b.dataset.l)return;var l=(b.title||b.getAttribute('aria-label')||'').replace(/\s*\(.*?\)\s*/g,'').split(':')[0].trim();var M={'Keep the same zoom':'Keep zoom','Blank student screen':'Blank screen','Rotate page 90\u00b0':'Rotate','Auto page turn':'Auto turn','Auto direction':'Direction'};l=M[l]||l;if(l.length>12)l=l.split(' ').slice(0,2).join(' ');b.dataset.l=l}
function toMore(x){if(x.id==='tbCol'||x.id==='tbMoreBtn'||x.classList.contains('tbpop')||keep.indexOf(x)>-1||x.tagName=='HR')return;if(x.tagName=='BUTTON')lab(x);p2.appendChild(x)}
[].slice.call(tb.children).forEach(function(x){if(keep.indexOf(x)<0)toMore(x)});
keep.forEach(function(x){tb.appendChild(x)});tb.appendChild(p1);tb.appendChild(p2);
function dot(){var on=p1.querySelector('.sw.on');if(on)col.firstChild.style.background=on.dataset.c||on.style.background}dot();
function close(){p1.classList.remove('open');p2.classList.remove('open')}
col.addEventListener('click',function(e){e.stopPropagation();var o=!p1.classList.contains('open');close();p1.classList.toggle('open',o)});
more.addEventListener('click',function(e){e.stopPropagation();var o=!p2.classList.contains('open');close();p2.classList.toggle('open',o)});
p1.addEventListener('click',function(e){if(e.target.closest('.sw'))setTimeout(function(){dot();close()},120)});
p2.addEventListener('click',function(e){if(e.target.closest('button'))setTimeout(close,120)});
document.addEventListener('pointerdown',function(e){if(!e.target.closest('#tb'))close()},true);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType==1&&n.parentNode===tb)toMore(n)})})}).observe(tb,{childList:true});
setInterval(function(){more.classList.toggle('on',!!p2.querySelector('.on'));dot()},400)}
dock();setTimeout(dock,600);setTimeout(dock,2000);
})();