if(STU)document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName))return;const k=e.key.toLowerCase();
 if((e.ctrlKey||e.metaKey)&&k=='z'){e.preventDefault();undo();return}if((e.ctrlKey||e.metaKey)&&k=='y'){e.preventDefault();redo();return}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 const T={p:'pen',h:'hl',e:'eraser',l:'laser',s:'spot',v:'hand'};if(T[k])setTool(T[k]);
 else if(k=='+'||k=='=')zoomBy(1.25);else if(k=='-')zoomBy(.8);else if(k=='0')rst()});

/* private tools window: students never see it (share only the student window) */
(function(){if(!STU)return;let tw=null;
const HTML='<!doctype html><title>Tools (private)</title><body style="margin:0;background:#121623;color:#fff;font:14px system-ui"><div id=b style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;align-items:center"></div><style>button{min-width:38px;height:38px;border:0;border-radius:9px;background:#232a44;color:#fff;font-size:18px;cursor:pointer}button.on{background:#5eead4;color:#05211d}button:hover{filter:brightness(1.3)}i{width:22px;height:22px;border-radius:50%;display:inline-block;cursor:pointer;border:2px solid transparent}hr{width:1px;height:26px;border:0;background:#444}</style><script>'
+'const o=window.opener,send=(c,v)=>o&&o.postMessage({cmd:c,v},"*"),b=document.getElementById("b");'
+'const A=[["✏️","tool","pen",1],["🖍","tool","hl",1],["╱","tool","line",1],["▭","tool","rect",1],["⌫","tool","eraser",1],["🔴","tool","laser",1],["🔦","tool","spot",1],["✋","tool","hand",1],0,["↶","undo"],["↷","redo"],["🗑","clear"],0,["➕","zin"],["➖","zout"],["⤢","rst"],["⟳","rot"],["📜","flow"],["🔒","keep"],0,["◀","prev"],["▶","next"],["⏱","auto"],["⇄","dir"],0,["❤️","fx","heart"],["👍","fx","like"],["👏","fx","clap"],["🔥","fx","fire"],["🎉","fx","confetti"],["⭐","fx","stars"]];'
+'A.forEach(a=>{if(!a){b.appendChild(document.createElement("hr"));return}const e=document.createElement("button");e.textContent=a[0];e.onclick=()=>{send(a[1],a[2]);if(a[3]){b.querySelectorAll("button.on").forEach(x=>x.classList.remove("on"));e.classList.add("on")}};b.appendChild(e)});'
+'b.appendChild(document.createElement("hr"));["#ff4d6d","#ffd23f","#2ee59d","#4cc9f0","#ffffff","#111111"].forEach(c=>{const e=document.createElement("i");e.style.background=c;e.onclick=()=>send("color",c);b.appendChild(e)});'
+'const r=document.createElement("input");r.type="range";r.min=2;r.max=24;r.value=4;r.style.width="70px";r.oninput=()=>send("size",+r.value);b.appendChild(r);'
+'const n=document.createElement("input");n.type="number";n.value=5;n.min=1;n.title="seconds per page";n.style.cssText="width:46px;height:28px";n.onchange=()=>send("secs",+n.value);b.appendChild(n);'
+'<\/script></body>';
function openTools(){if(tw&&!tw.closed){tw.focus();return}
 tw=window.open('','lstools','popup=yes,width=760,height=130,left='+Math.max(0,Math.round(screenX+(outerWidth-760)/2))+',top='+Math.max(0,Math.round(screenY+outerHeight-170)));if(!tw){toast('Popup blocked: allow popups, then press T');return}
 tw.document.open();tw.document.write(HTML);tw.document.close()}
window.openTools=openTools;
document.addEventListener('keydown',e=>{if(/TEXTAREA|INPUT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key=='T')openTools()});
const q=t=>document.querySelector(t);
addEventListener('message',e=>{const d=e.data;if(!d||!d.cmd||e.source!==tw)return;const c=d.cmd,v=d.v;
 if(c=='tool')setTool(v);else if(c=='color'){const x=q('#tb [data-c="'+v+'"]');x&&x.click()}else if(c=='size')S.size=v;
 else if(c=='undo')undo();else if(c=='redo')redo();else if(c=='clear')clr();else if(c=='zin')zoomBy(1.3);else if(c=='zout')zoomBy(1/1.3);else if(c=='rst')rst();
 else if(c=='rot')rotPage(1);else if(c=='prev')go(S.i-1);else if(c=='next')go(S.i+1);
 else if(c=='flow'){const x=q('#tb [title^="Flow"]');x&&x.click()}else if(c=='keep'){const x=q('#tb [title^="Keep the same"]');x&&x.click()}
 else if(c=='auto'){const x=q('#tb [title^="Auto page turn"]');x&&x.click()}else if(c=='dir'){const x=q('#tb [title^="Auto direction"]');x&&x.click()}
 else if(c=='secs'){const x=q('#tb .asec');if(x){x.value=v;x.onchange()}}
 else if(c=='fx'){const x=q('#rbar [data-k="'+v+'"]');x&&x.click()}});
})();
