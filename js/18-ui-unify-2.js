(function(){
const V=[['follow','Follow'],['stage','Stage'],['reports','Reports'],['script','Script'],['notes','Notes'],['history','History'],['setup','Setup']];
function sync(){
 const sp=document.body.classList.contains('split');
 document.querySelectorAll('.view').forEach(v=>{
  const has=v.querySelector(':scope>.ptabs'),want=sp&&(v.classList.contains('pA')||v.classList.contains('pB'));
  if(!want){if(has)has.remove();return}
  const key=v.id.replace('view-','');
  if(has){has.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===key));return}
  const bar=document.createElement('div');bar.className='ptabs';bar.setAttribute('role','tablist');
  V.forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.dataset.v=k;b.className=k===key?'on':'';
   const ic=document.querySelector('#tab-'+k+' .ic');if(ic)b.appendChild(ic.cloneNode(true));
   const tl=document.querySelector('#tab-'+k+' .tl'),t=document.createElement('span');t.textContent=tl?tl.textContent:l;b.appendChild(t);
   b.addEventListener('click',e=>{e.stopPropagation();setView(k)});bar.appendChild(b)});
  v.insertBefore(bar,v.firstChild)})
}
setInterval(function(){if(!document.hidden)sync()},4000);sync();
document.addEventListener('click',function(){setTimeout(sync,80)},true);
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
