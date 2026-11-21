/* Text tool: click on the slide, type, Enter to place (Shift+Enter = new line, Esc = cancel) */
(function(){
if(typeof S==='undefined'||typeof cv==='undefined'){console.warn('text tool: stage core not found');return}
let box=null;
function done(ok){if(!box)return;const b=box;box=null;const v=b.ta.value.replace(/\s+$/,'');b.ta.remove();
 if(ok&&v&&P()){const g=geo();if(!g)return;snap();const s={k:'text',c:b.c||S.color,f:b.f/(g.bw*S.v.z),w:0,t:v,p:[[b.x,b.y]]};P().strokes.push(s);send({t:'add',i:S.i,s:s});need=1}}
function bb(s,g){const z=S.v.z,fp=s.f*g.bw*z,L=String(s.t||'').split('\n');cx.save();cx.font='600 '+fp+'px system-ui,"Segoe UI",Tahoma,sans-serif';const w=Math.max(...L.map(l=>cx.measureText(l).width),fp);cx.restore();return{x:s.p[0][0],y:s.p[0][1],w:w/(g.bw*z),h:L.length*fp*1.25/(g.bh*z),fp}}
function hit(x,y,g){const l=P().strokes;for(let i=l.length-1;i>=0;i--){const s=l[i];if(s.k!=='text')continue;const b=bb(s,g);if(x>=b.x-.004&&x<=b.x+b.w+.004&&y>=b.y-.004&&y<=b.y+b.h+.004)return s}return null}
const oe=window.er;window.er=function(x,y,g){const p=P(),t=hit(x,y,g);if(t){p.strokes=p.strokes.filter(s=>s!==t);send({t:'set',i:S.i,l:p.strokes});need=1;return}return oe(x,y,g)};
window.txtAdd=function(x,y,ox,oy,g,ed){
 if(box){done(1);return}
 if(!ed){const t=hit(x,y,g);if(t){const b=bb(t,g),gx=x-t.p[0][0],gy=y-t.p[0][1];let mv=0;snap();const m=e=>{const q=toN(geo(),e.offsetX,e.offsetY);if(!mv&&Math.hypot((q[0]-x)*g.bw,(q[1]-y)*g.bh)<5)return;mv=1;t.p[0]=[q[0]-gx,q[1]-gy];need=1;send({t:'set',i:S.i,l:P().strokes})},u=()=>{cv.removeEventListener('pointermove',m);cv.removeEventListener('pointerup',u);cv.removeEventListener('pointercancel',u);if(mv){send({t:'set',i:S.i,l:P().strokes});return}S.hist.pop();const p=P();snap();p.strokes=p.strokes.filter(s=>s!==t);send({t:'set',i:S.i,l:p.strokes});need=1;const a=toS(geo(),t.p[0][0],t.p[0][1]);txtAdd(t.p[0][0],t.p[0][1],a[0],a[1],geo(),t)};cv.addEventListener('pointermove',m);cv.addEventListener('pointerup',u);cv.addEventListener('pointercancel',u);return}}
 const px=ed?Math.max(16,ed.f*g.bw*S.v.z):Math.max(16,Math.min(64,S.size*2.4)),ta=document.createElement('textarea'),r=cv.getBoundingClientRect();
 ta.dir='auto';ta.rows=1;
 ta.style.cssText='position:fixed;z-index:99999;left:'+(r.left+ox-7)+'px;top:'+(r.top+oy-3)+'px;width:'+(px*3)+'px;height:'+(px*1.25+4)+'px;box-sizing:content-box;padding:1px 6px;margin:0;border:1px dashed #4cc9f0;border-radius:4px;background:transparent;outline:0;resize:none;overflow:hidden;white-space:pre;font:600 '+px+'px system-ui,"Segoe UI",Tahoma,sans-serif;line-height:1.25;color:'+S.color+';text-shadow:0 0 3px rgba(0,0,0,.45)';
 ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();done(1)}else if(e.key==='Escape'){e.preventDefault();done(0)}};
 ta.onkeyup=e=>e.stopPropagation();
 ta.oninput=()=>{const L=ta.value.split('\n'),m=Math.max(...L.map(l=>l.length),3);ta.style.width=Math.min(innerWidth*.7,m*px*.7+px)+'px';ta.style.height=(L.length*px*1.25+4)+'px'};
 ta.onblur=()=>done(1);
 if(ed){ta.value=ed.t;ta.style.color=ed.c;ta.oninput()}
 document.body.appendChild(ta);box={ta,x,y,f:px,c:ed&&ed.c};setTimeout(()=>ta.focus(),40)};
{const od=cv.ondblclick;cv.ondblclick=function(e){if(S.tool==='text'){e.preventDefault();return}return od&&od.call(this,e)}}
document.addEventListener('keydown',e=>{if((e.key==='t'||e.key==='T')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName)&&!(e.target&&e.target.isContentEditable)){if(typeof setTool==='function')setTool('text')}});
})();
