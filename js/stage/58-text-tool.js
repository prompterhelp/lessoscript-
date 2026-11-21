/* Text tool: click on the slide, type, Enter to place; drag text to move it; double-click text to edit (Shift+Enter = new line, Esc = cancel) */
(function(){
if(typeof S==='undefined'||typeof cv==='undefined'){console.warn('text tool: stage core not found');return}
let box=null;
function done(ok){if(!box)return;const b=box;box=null;const v=b.ta.value.replace(/\s+$/,'');b.ta.remove();
 if(ok&&v&&P()){const g=geo();if(!g)return;snap();const s={k:'text',c:b.c||S.color,f:b.f/(g.bw*S.v.z),w:0,t:v,p:[[b.x,b.y]]};P().strokes.push(s);send({t:'add',i:S.i,s:s});need=1}}
function bb(s,g){const z=S.v.z,fp=s.f*g.bw*z,L=String(s.t||'').split('\n');cx.save();cx.font='600 '+fp+'px system-ui,"Segoe UI",Tahoma,sans-serif';const w=Math.max(...L.map(l=>cx.measureText(l).width),fp);cx.restore();return{x:s.p[0][0],y:s.p[0][1],w:w/(g.bw*z),h:L.length*fp*1.25/(g.bh*z),fp}}
function conv(d,x,y,g){if(!d)return[x,y,g];const p2=S.pages[S.i+d],f2=Math.min(W/p2.w,H/p2.h),g2={p:p2,bw:p2.w*f2,bh:p2.h*f2};return[.5+(x-.5)*g.bw/g2.bw,d>0?(y-1)*g.bh/g2.bh:1+y*g.bh/g2.bh,g2]}
function unconv(d,a,b,gg,g){return d?[.5+(a-.5)*gg.bw/g.bw,d>0?1+b*gg.bh/g.bh:(b-1)*gg.bh/g.bh]:[a,b]}
function hit(x,y,g){for(const d of[0,1,-1]){if(d&&(!S.flow||!S.pages[S.i+d]))continue;const[a,b2,gg]=conv(d,x,y,g),l=S.pages[S.i+d].strokes;for(let i=l.length-1;i>=0;i--){const s=l[i];if(s.k!=='text')continue;const b=bb(s,gg);if(a>=b.x-.004&&a<=b.x+b.w+.004&&b2>=b.y-.004&&b2<=b.y+b.h+.004)return{s,d,gg,pg:S.pages[S.i+d]}}}return null}
const oe=window.er;window.er=function(x,y,g){const h=hit(x,y,g);if(h){h.pg.strokes=h.pg.strokes.filter(s=>s!==h.s);send({t:'set',i:S.i+h.d,l:h.pg.strokes});need=1;return}return oe(x,y,g)};
function edit(h,g){const t=h.s,pg=h.pg,d=h.d;if(!d)snap();pg.strokes=pg.strokes.filter(s=>s!==t);send({t:'set',i:S.i+d,l:pg.strokes});need=1;const u2=unconv(d,t.p[0][0],t.p[0][1],h.gg,g),sc=toS(g,u2[0],u2[1]);window.txtAdd(u2[0],u2[1],sc[0],sc[1],g,t)}
cv.addEventListener('dblclick',e=>{if(S.tool!=='text'||box)return;const g=geo();if(!g)return;const q=toN(g,e.offsetX,e.offsetY),h=hit(q[0],q[1],g);if(h)edit(h,g)});
window.txtAdd=function(x,y,ox,oy,g,ed){
 if(box){done(1);return}
 if(!ed){const h=hit(x,y,g);if(h){const t=h.s,d=h.d,pg=h.pg,a0=conv(d,x,y,g),gx=a0[0]-t.p[0][0],gy=a0[1]-t.p[0][1];let mv=0;if(!d)snap();const m=e=>{const q=toN(geo(),e.offsetX,e.offsetY);if(!mv&&Math.hypot((q[0]-x)*g.bw,(q[1]-y)*g.bh)<5)return;mv=1;const c=conv(d,q[0],q[1],geo());t.p[0]=[c[0]-gx,c[1]-gy];need=1;send({t:'set',i:S.i+d,l:pg.strokes})},u=()=>{cv.removeEventListener('pointermove',m);cv.removeEventListener('pointerup',u);cv.removeEventListener('pointercancel',u);if(mv)send({t:'set',i:S.i+d,l:pg.strokes})};cv.addEventListener('pointermove',m);cv.addEventListener('pointerup',u);cv.addEventListener('pointercancel',u);return}}
 const px=ed?Math.max(16,ed.f*g.bw*S.v.z):Math.max(16,Math.min(64,S.size*2.4)),ta=document.createElement('textarea'),r=cv.getBoundingClientRect();
 ta.dir='auto';ta.rows=1;
 const SC=(w,h)=>'position:fixed!important;z-index:99999!important;left:'+(r.left+ox-7)+'px!important;top:'+(r.top+oy-3)+'px!important;width:'+w+'px!important;min-width:0!important;max-width:70vw!important;height:'+h+'px!important;min-height:0!important;box-sizing:content-box!important;padding:1px 6px!important;margin:0!important;border:1px dashed #4cc9f0!important;border-radius:4px!important;background:transparent!important;box-shadow:none!important;outline:0!important;resize:none!important;overflow:hidden!important;white-space:pre!important;font:600 '+px+'px system-ui,"Segoe UI",Tahoma,sans-serif!important;line-height:1.25!important;color:'+(ed?ed.c:S.color)+'!important;text-shadow:none!important';
 ta.style.cssText=SC(px*3,px*1.25+4);
 ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();done(1)}else if(e.key==='Escape'){e.preventDefault();done(0)}};
 ta.onkeyup=e=>e.stopPropagation();
 ta.oninput=()=>{const L=ta.value.split('\n'),m=Math.max(...L.map(l=>l.length),3);ta.style.cssText=SC(Math.min(innerWidth*.7,m*px*.7+px),L.length*px*1.25+4)};
 ta.onblur=()=>done(1);
 if(ed){ta.value=ed.t;ta.oninput()}
 document.body.appendChild(ta);box={ta,x,y,f:px,c:ed&&ed.c};setTimeout(()=>ta.focus(),40)};
{const od=cv.ondblclick;cv.ondblclick=function(e){if(S.tool==='text'){e.preventDefault();return}return od&&od.call(this,e)}}
document.addEventListener('keydown',e=>{if((e.key==='t'||e.key==='T')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName)&&!(e.target&&e.target.isContentEditable)){if(typeof setTool==='function')setTool('text')}});
})();
