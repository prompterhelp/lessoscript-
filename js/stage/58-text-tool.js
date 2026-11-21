/* Text tool: click on the slide, type, Enter to place (Shift+Enter = new line, Esc = cancel) */
(function(){
if(typeof S==='undefined'||typeof cv==='undefined'){console.warn('text tool: stage core not found');return}
let box=null;
function done(ok){if(!box)return;const b=box;box=null;const v=b.ta.value.replace(/\s+$/,'');b.ta.remove();
 if(ok&&v&&P()){const g=geo();if(!g)return;snap();const s={k:'text',c:S.color,f:b.f/(g.bw*S.v.z),w:0,t:v,p:[[b.x,b.y]]};P().strokes.push(s);send({t:'add',i:S.i,s:s});need=1}}
window.txtAdd=function(x,y,ox,oy,g){
 if(box){done(1);return}
 const px=Math.max(14,Math.min(64,S.size*2.4)),ta=document.createElement('textarea'),r=cv.getBoundingClientRect();
 ta.dir='auto';ta.rows=1;
 ta.style.cssText='position:fixed;z-index:99999;left:'+(r.left+ox-7)+'px;top:'+(r.top+oy-3)+'px;width:'+(px*3)+'px;height:'+(px*1.25+4)+'px;box-sizing:content-box;padding:1px 6px;margin:0;border:1px dashed #4cc9f0;border-radius:4px;background:transparent;outline:0;resize:none;overflow:hidden;white-space:pre;font:600 '+px+'px system-ui,"Segoe UI",Tahoma,sans-serif;line-height:1.25;color:'+S.color+';text-shadow:0 0 3px rgba(0,0,0,.45)';
 ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();done(1)}else if(e.key==='Escape'){e.preventDefault();done(0)}};
 ta.onkeyup=e=>e.stopPropagation();
 ta.oninput=()=>{const L=ta.value.split('\n'),m=Math.max(...L.map(l=>l.length),3);ta.style.width=Math.min(innerWidth*.7,m*px*.7+px)+'px';ta.style.height=(L.length*px*1.25+4)+'px'};
 ta.onblur=()=>done(1);
 document.body.appendChild(ta);box={ta,x,y,f:px};setTimeout(()=>ta.focus(),40)};
document.addEventListener('keydown',e=>{if((e.key==='t'||e.key==='T')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName)&&!(e.target&&e.target.isContentEditable)){if(typeof setTool==='function')setTool('text')}});
})();
