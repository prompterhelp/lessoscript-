/* Text tool: click on the slide, type, Enter to place (Shift+Enter = new line, Esc = cancel) */
(function(){
if(typeof S==='undefined'||typeof cv==='undefined'){console.warn('text tool: stage core not found');return}
let box=null;
function done(ok){if(!box)return;const b=box;box=null;const v=b.ta.value.replace(/\s+$/,'');b.ta.remove();
 if(ok&&v&&P()){const g=geo();if(!g)return;snap();const s={k:'text',c:S.color,f:b.f/(g.bw*S.v.z),w:0,t:v,p:[[b.x,b.y]]};P().strokes.push(s);send({t:'add',i:S.i,s:s});need=1}}
window.txtAdd=function(x,y,ox,oy,g){
 if(box){done(1);return}
 const px=Math.max(18,S.size*3.5),ta=document.createElement('textarea'),r=cv.getBoundingClientRect();
 ta.dir='auto';ta.rows=1;ta.placeholder='Type…';
 ta.style.cssText='position:fixed;z-index:99999;left:'+(r.left+ox)+'px;top:'+(r.top+oy)+'px;min-width:140px;max-width:70vw;padding:2px 6px;margin:0;border:1.5px dashed #4cc9f0;border-radius:6px;background:rgba(0,0,0,.35);outline:0;resize:both;overflow:hidden;font:600 '+px+'px system-ui,"Segoe UI",Tahoma,sans-serif;line-height:1.25;color:'+S.color;
 ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();done(1)}else if(e.key==='Escape'){e.preventDefault();done(0)}};
 ta.onkeyup=e=>e.stopPropagation();
 ta.oninput=()=>{ta.style.height='auto';ta.style.height=ta.scrollHeight+'px'};
 ta.onblur=()=>done(1);
 document.body.appendChild(ta);box={ta,x,y,f:px};setTimeout(()=>ta.focus(),40)};
document.addEventListener('keydown',e=>{if((e.key==='t'||e.key==='T')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName)&&!(e.target&&e.target.isContentEditable)){if(typeof setTool==='function')setTool('text')}});
})();
