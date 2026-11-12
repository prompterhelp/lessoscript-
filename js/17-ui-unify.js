(function(){
const S=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const IC={
 follow:'<path d="M5 4.5l14 7.5-14 7.5z"/>',
 stage:'<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/>',
 reports:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 script:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
 notes:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
 history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 setup:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
 lib:'<path d="M4 5v14M9 5v14"/><rect x="13" y="5" width="7" height="14" rx="1.5" transform="rotate(-8 16.5 12)"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 save:'<path d="M5 3h11l4 4v14H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
 file:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>',
 down:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
 up:'<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2M12 17h.01"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
 folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
 link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
 play:'<path d="M7 4.5l12 7.5-12 7.5z"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
 vol:'<path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 alert:'<path d="M12 3l10 18H2zM12 10v5M12 18h.01"/>',
 refresh:'<path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
 palette:'<path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 003-3A9 9 0 0012 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 star:'<path d="M12 3l2.8 5.9 6.2.8-4.5 4.4 1.1 6.3L12 17.4 6.4 20.4l1.1-6.3L3 9.7l6.2-.8z"/>',
 clip:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 print:'<path d="M7 9V3h10v6M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>',
 bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0114 0M16 4.5a3.5 3.5 0 010 7M18 20a6 6 0 00-3-5.2"/>',
 bell:'<path d="M6 17V11a6 6 0 1112 0v6l2 2H4zM10 21h4"/>',
 cloud:'<path d="M7 18a4.5 4.5 0 01-.5-9A6 6 0 0118 10a4 4 0 011 8z"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
 heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
 broom:'<path d="M14 4l6 6M4 20l5-1 9-9-4-4-9 9zM7 17l2 2"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
 chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 7l9 6 9-6"/>',
 split:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M12 4v16"/>',
 undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
 redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
 wide:'<path d="M3 12h18"/><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/>',
 mirror:'<path d="M12 3v18"/><path d="M8 7 3 17h5z"/><path d="m16 7 5 10h-5z"/>',
 full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
};
const M={'📚':'lib','🔎':'search','🔍':'search','💾':'save','🎙':'mic','✨':'spark','📄':'file','📃':'file','📜':'script','📥':'down','⬇':'down','📤':'up','⬆':'up','❓':'help','❔':'help','🗑':'trash','📂':'folder','📁':'folder','🗂':'folder','🔗':'link','🎬':'play','▶':'play','⏸':'pause','⏹':'stop','🔊':'vol','🔈':'vol','🔉':'vol','🌐':'globe','✅':'check','✔':'check','☑':'check','❌':'x','✖':'x','⚠':'alert','🔄':'refresh','🔁':'refresh','♻':'refresh','➕':'plus','🏆':'award','🎖':'award','🎨':'palette','📅':'cal','🗓':'cal','📆':'cal','⭐':'star','🌟':'star','📋':'clip','🔒':'lock','🎯':'target','🖨':'print','💡':'bulb','👤':'user','👥':'users','🔔':'bell','☁':'cloud','🔑':'key','🖼':'image','📱':'phone','❤':'heart','🧹':'broom','✍':'edit','📝':'notes','✏':'edit','🕒':'history','⏱':'history','⚙':'setup','📊':'reports','📈':'reports','🖥':'stage','🎤':'mic','🧾':'file','📌':'target','💬':'notes','🔖':'file','🚀':'play','📲':'chat','💬':'chat','🟢':'chat','✉':'mail','📧':'mail','📸':'image','📷':'image','🎓':'award','🏅':'award','📖':'lib','📕':'lib','📗':'lib','📘':'lib','⏰':'history','⏳':'history','🧑':'user','👨':'user','👩':'user','🕐':'history','🔐':'lock'};
Object.assign(M,{'↩':'undo','↪':'redo','↔':'wide','🪞':'mirror','⛶':'full','⤢':'full'});
const EM=/(?:\p{Extended_Pictographic}|✅|⭐)(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*/gu;
const SEL='button,summary,.tab,.chip,.rp-chip,label,h2,h3,.rp-lbl,.btn-q,a.btn';
const SKIP='#scriptList,#stage,.stage,textarea,input,select,script,style,[contenteditable=true],.line,.ct,#ctPv,#rpPreview,#rpDesignPv,.history-banner';
/* only touch text that holds at least one emoji we have an icon for; otherwise the node is rewritten with the same emoji forever and the observer loops (constant CPU use) */
function hasMapped(v){EM.lastIndex=0;let m;while((m=EM.exec(v))){const base=Array.from(m[0].replace(/[\uFE0F\u200D]/g,''))[0];if(M[base]||M[m[0]]){EM.lastIndex=0;return true}}EM.lastIndex=0;return false}
function icon(k){const s=document.createElement('span');s.className='ic';s.innerHTML=S(IC[k]);return s}
function clean(root){
 const r0=root||document;const list=r0.querySelectorAll?[...r0.querySelectorAll(SEL)]:[];if(r0.matches&&r0.matches(SEL))list.unshift(r0);
 list.forEach(el=>{
  if(el.closest(SKIP))return;
  const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const ns=[];let n;
  while((n=w.nextNode())){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest(SKIP))continue;if(hasMapped(n.nodeValue))ns.push(n)}
  ns.forEach(t=>{const v=t.nodeValue,f=document.createDocumentFragment();let last=0,m;EM.lastIndex=0;
   while((m=EM.exec(v))){f.appendChild(document.createTextNode(v.slice(last,m.index)));const base=Array.from(m[0].replace(/[\uFE0F\u200D]/g,''))[0],k=M[base]||M[m[0]];f.appendChild(k?icon(k):document.createTextNode(m[0]));last=m.index+m[0].length}
   f.appendChild(document.createTextNode(v.slice(last).replace(/^\s+/,' ')));t.parentNode.replaceChild(f,t)})
 })
}
/* tab icons + text label wrapper */
const TI={follow:'follow',stage:'stage',reports:'reports',script:'script',notes:'notes',history:'history',setup:'setup'};
function tabs(){document.querySelectorAll('.tabs .tab').forEach(b=>{if(b.dataset.ic)return;const k=TI[b.dataset.view];if(!k)return;b.dataset.ic=1;const t=b.textContent.trim();b.textContent='';b.appendChild(icon(k));const s=document.createElement('span');s.className='tl';s.textContent=t;b.appendChild(s)});
 /* keep the label in sync if the app translates it */}
const sbn=document.getElementById('tab-split');if(sbn&&!sbn.dataset.ic){sbn.dataset.ic=1;sbn.textContent='';sbn.appendChild(icon('split'));const sl=document.createElement('span');sl.className='tl';sl.textContent='Split';sbn.appendChild(sl)}
let q=0;const pend=new Set();
const HAS=/[\u2190-\u2BFF\u{1F000}-\u{1FFFF}]/u;
const run=()=>{q=0;try{tabs();pend.forEach(n=>{if(n.isConnected)clean(n)})}catch(e){}pend.clear()};
clean(document);tabs();
new MutationObserver(ms=>{
 for(const m of ms){
  if(m.type==='childList'){m.addedNodes.forEach(n=>{const e=n.nodeType===1?n:n.parentElement;if(e)pend.add(e)})}
  else if(m.target.parentElement&&HAS.test(m.target.nodeValue||''))pend.add(m.target.parentElement)
 }
 if(pend.size&&!q)q=setTimeout(run,80)
}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
