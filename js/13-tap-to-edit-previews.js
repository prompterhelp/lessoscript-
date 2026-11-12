/* ===== Report tab: collapsible sections ===== */
(function(){
  const pane=document.querySelector('.rp-pane[data-pane="write"]'); if(!pane) return;
  const closed=new Set(); let raf=0;
  const cards=()=>[...pane.querySelectorAll(':scope > .rp-card, :scope > #rpSections > .rp-card')];
  const hdOf=c=>{ const h=c.querySelector('h3'); if(!h) return null; let e=h; while(e.parentElement&&e.parentElement!==c) e=e.parentElement; return e; };
  const keyOf=c=>{ const h=c.querySelector('h3'); return h?((h.querySelector('span')||h).textContent||'').replace(/\s+/g,' ').trim():''; };
  function deco(){ raf=0;
    cards().forEach(c=>{ const hd=hdOf(c); if(!hd) return; hd.classList.add('acc-head');
      let ch=hd.querySelector('.acc-chev');
      if(!ch){ ch=document.createElement('button'); ch.type='button'; ch.className='acc-chev'; ch.setAttribute('aria-label','Toggle section'); ch.textContent='▾'; (hd.tagName==='H3'?hd:(hd.querySelector('h3')||hd)).appendChild(ch); }
      const isC=closed.has(keyOf(c)); c.classList.toggle('acc-c',isC); ch.setAttribute('aria-expanded',String(!isC)); });
  }
  const sched=()=>{ if(!raf) raf=requestAnimationFrame(deco); };
  pane.addEventListener('click',e=>{
    const hd=e.target.closest('.acc-head'); if(!hd||!pane.contains(hd)) return;
    if(e.target.closest('button,select,input,textarea,a,label')&&!e.target.closest('.acc-chev')) return;
    const c=hd.closest('.rp-card'); if(!c) return; const k=keyOf(c);
    if(closed.has(k)) closed.delete(k); else closed.add(k); deco();
  });
  new MutationObserver(ms=>{ if(ms.some(m=>!(m.target.closest&&m.target.closest('#rpPreview,#rpDesignPv,#rpTextPrev')))) sched(); }).observe(pane,{childList:true,subtree:true});
  deco();
})();
/* ===== Tap-to-edit previews v2: edit any text, add text/logo, resize, drag, reset ===== */
const PVE = { S:{report:{},design:{}}, C:{en:{},ar:{},both:{}}, hint:0, sel:null, snap:(lsGet('lp.pve.snap')==='lines'?'lines':'free') };
Object.defineProperty(PVE.S,'cert',{ get(){ const l=(typeof CT!=='undefined'&&CT.lang)||'both'; return PVE.C[l]||(PVE.C[l]={}); }, set(v){ const l=(typeof CT!=='undefined'&&CT.lang)||'both'; PVE.C[l]=v; }, enumerable:false });
try{ const j = JSON.parse((lsGet('lp.pve')||'{}')); ['report','design'].forEach(k => { if(j[k] && typeof j[k]==='object') PVE.S[k] = j[k]; });
  if(j.certs && typeof j.certs==='object'){ ['en','ar','both'].forEach(l => { if(j.certs[l] && typeof j.certs[l]==='object') PVE.C[l] = j.certs[l]; }); }
  else if(j.cert && typeof j.cert==='object') PVE.C.both = j.cert; }catch(e){}
const pvSnap = () => JSON.stringify({report:PVE.S.report, design:PVE.S.design, certs:PVE.C});
PVE.hist = []; PVE.prev = pvSnap();
const pvSave = () => { const cur = pvSnap(); if(!PVE.undoing && PVE.prev !== cur){ PVE.hist.push(PVE.prev); if(PVE.hist.length > 60) PVE.hist.shift(); } PVE.prev = cur; lsSet('lp.pve', cur); };
document.addEventListener('pointerdown', e => { PVE.pt = {x:e.clientX, y:e.clientY, t:Date.now()}; }, true);
function pvUndo(){ if(!PVE.hist.length){ toast('Nothing to undo'); return; }
  const j = JSON.parse(PVE.hist.pop()); PVE.S.report = j.report || {}; PVE.S.design = j.design || {}; PVE.C = j.certs || {en:{},ar:{},both:{}}; ['en','ar','both'].forEach(l => { if(!PVE.C[l]) PVE.C[l] = {}; });
  PVE.undoing = true; pvSave(); PVE.undoing = false; PVE.sel = null;
  Object.keys(PV_ROOT).forEach(k => { try{ if($(PV_ROOT[k])) PV_RR[k](); }catch(e){} }); toast('Undone ↶'); }
document.addEventListener('keydown', e => { if(!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || (e.key || '').toLowerCase() !== 'z') return;
  const t = e.target; if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  if(!PVE.hist.length) return; if(!Object.keys(PV_ROOT).some(k => { const r = $(PV_ROOT[k]); return r && r.offsetParent; })) return; e.preventDefault(); pvUndo(); });
const PV_ROOT = {report:'rpPreview', design:'rpDesignPv', cert:'ctPv'};
const PV_RR = {report:() => rpPreview(), design:() => rpDesignPv(), cert:() => ctRender()};
const PV_INL = /^(SPAN|B|I|U|STRONG|EM|SMALL|SUP|SUB|BR)$/;
const pvPath = (root, el) => { const p = []; while(el && el !== root){ p.unshift([].indexOf.call(el.parentNode.children, el)); el = el.parentNode; } return p.join('.'); };
const pvAt = (root, p) => { let el = root; for(const i of String(p).split('.')){ el = el && el.children[+i]; } return el || null; };
const pvOK = el => !!el && el.nodeType === 1 && !el.closest('svg,img,button,input,select,textarea,label,.pv-layer,.pv-bar,[data-noedit]') && ![].some.call(el.children, c => !PV_INL.test(c.tagName)) && (el.textContent||'').trim().length > 0;
const pvCls = el => String(el.className||'').split(/\s+/).filter(c => c && !/^pv-/.test(c)).join(' ');
const pvEntries = S => Object.keys(S).filter(k => k !== '_x');
const pvCount = S => pvEntries(S).length + (S._x ? S._x.length : 0);
function pvLayer(box, items, live){
  if(!box) return; const old = box.querySelector(':scope > .pv-layer'); if(old) old.remove();
  if(!items || !items.length) return;
  if(!box.classList.contains('ct') && !box.style.position) box.style.position = 'relative';
  const L = document.createElement('div'); L.className = 'pv-layer'; L.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;container-type:inline-size;pointer-events:none;z-index:50';
  items.forEach(it => { const d = document.createElement(it.k === 'i' ? 'img' : 'div'); d.className = 'pv-it'; d.dataset.id = it.id;
    let c = 'position:absolute;transform:translate(-50%,-50%);left:' + it.x + '%;top:' + it.y + '%;';
    if(it.k === 'i'){ d.src = it.src; d.alt = ''; d.draggable = false; c += 'width:' + it.w + '%;height:auto;'; }
    else { d.textContent = it.txt; d.setAttribute('dir','auto'); c += 'font-size:' + it.fs + 'cqw;line-height:1.25;overflow-wrap:anywhere;max-width:' + (it.bw || 90) + '%;white-space:pre-wrap;text-align:center;' + (it.c ? 'color:' + it.c + ';' : '') + (it.ff ? "font-family:'" + pvFF(it.ff, it.c) + "',serif;" : ''); }
    if(live) c += 'pointer-events:auto;touch-action:none;cursor:move;';
    d.style.cssText = c; L.appendChild(d); });
  box.appendChild(L);
}
function pvPos(el, v, W){ if(v.dx || v.dy){ el.style.translate = (v.dx * W) + 'px ' + (v.dy * W) + 'px'; if(PV_INL.test(el.tagName)) el.style.display = 'inline-block'; } else el.style.translate = ''; }
function pvGuide(box, on){ let g = box.querySelector(':scope > .pv-guide'); if(!on){ if(g) g.remove(); return; } if(g) return; if(!box.classList.contains('ct') && !box.style.position) box.style.position = 'relative'; g = document.createElement('div'); g.className = 'pv-guide'; g.style.cssText = 'position:absolute;left:50%;top:0;bottom:0;width:0;border-left:1px dashed #3b82f6;z-index:60;pointer-events:none'; box.appendChild(g); }
function pvApply(root, S, mark, bw){ let n = 0; const W = bw || (root.firstElementChild && root.firstElementChild.offsetWidth) || 1123;
  pvEntries(S).forEach(p => { const v = S[p]; let el = pvAt(root, p);
    if(el && v.t === v.o && pvOK(el) && el.textContent !== v.o && (!v.k || pvCls(el) === v.k)){ v.o = v.t = el.textContent; } if(!(el && pvOK(el) && (el.textContent === v.o || v.t === v.o) && (!v.o || el.textContent === v.o || el.textContent === v.t)) && v.o){ el = [].find.call(root.querySelectorAll('*'), x => pvOK(x) && x.textContent === v.o && !x.closest('.pv-layer')) || null; } if(el && pvOK(el) && (el.textContent === v.o || v.t === v.o)){ if(v.t !== v.o){ el.textContent = v.t; if(String(v.t).indexOf('\n') >= 0) el.style.whiteSpace = 'pre-line'; } if(v.w){ el.style.maxWidth = (v.w * W) + 'px'; el.style.overflowWrap = 'anywhere'; if(PV_INL.test(el.tagName)) el.style.display = 'inline-block'; } if(v.f && v.b) el.style.setProperty('font-size', (v.b * v.f) + 'px', 'important'); pvPos(el, v, W); if(v.ff) el.style.setProperty('font-family', "'" + pvFF(v.ff, v.c) + "',serif", 'important'); if(v.c){ el.style.setProperty('color', v.c, 'important'); el.style.setProperty('-webkit-text-fill-color', v.c, 'important'); el.style.setProperty('background', 'none', 'important'); } if(mark && (v.t !== v.o || v.f || v.dx || v.dy || v.w || v.ff || v.c)) el.classList.add('pv-ed'); n++; } });
  root.querySelectorAll('style[data-pvpal]').forEach(x => x.remove());

  pvLayer(root.firstElementChild, S._x, mark); return n; }
function ctFitMid(ct){ const m = ct && ct.querySelector('.ct-mid'); if(!m) return; m.style.transform = ''; const kids = [].slice.call(m.children); if(!kids.length) return;
  const top = Math.min.apply(null, kids.map(c => c.offsetTop)), bot = Math.max.apply(null, kids.map(c => c.offsetTop + c.offsetHeight)), need = bot - top + 10, k = m.clientHeight / need;
  if(k < .995){ m.style.transformOrigin = 'center center'; m.style.transform = 'scale(' + Math.max(.6, k).toFixed(3) + ')'; } }
function pvExport(html, w, force){ try{ const d = document.createElement('div'); d.innerHTML = html; const key = force || (d.querySelector('.ct-in') ? 'cert' : d.querySelector('.rc') ? 'report' : ''); if(!key) return html;
  const S = PVE.S[key]; if(key === 'report' && !pvCount(S)) return html;
  pvApply(d, S, false, key === 'cert' ? 1123 : (w ? w - 28 : 560));
  if(key === 'cert'){ d.style.cssText = 'position:fixed;left:-99999px;top:0;width:1123px'; document.body.appendChild(d); try{ ctFitMid(d.querySelector('.ct')); }finally{ d.remove(); d.style.cssText = ''; } }
  return d.innerHTML; }catch(e){ return html; } }
function pvMark(root, key){ root.querySelectorAll('.pv-sel').forEach(x => x.classList.remove('pv-sel')); const s = PVE.sel; if(!s || s.key !== key) return;
  const el = s.id ? root.querySelector('.pv-it[data-id="' + s.id + '"]') : pvAt(root, s.p); if(el) el.classList.add('pv-sel'); }
const PV_CF={'Reem Kufi Ink':'Reem Kufi','Reem Kufi Fun':'Reem Kufi','Blaka Ink':'Blaka','Blaka Hollow':'Blaka'};
function pvFF(ff,c){ return (c && PV_CF[ff]) || ff; }
function pvFontSel(){ const all=CT_AFONTS.concat(CT_EFONTS,RP_FONTS.filter(f=>!f.sys)), gs=[...new Set(all.map(f=>f.g))];
  return '<select class="field" data-pvfont title="Font of the selected text" aria-label="Font" style="max-width:150px;padding:4px 6px;font-size:12px"><option value="">Aa Font</option>'+gs.map(g=>'<optgroup label="'+g+'">'+all.filter(f=>f.g===g).map(f=>'<option value="'+rpEsc(f.n)+'">'+rpEsc(f.n)+'</option>').join('')+'</optgroup>').join('')+'</select>'; }
document.addEventListener('change', e => { const f = e.target.closest && e.target.closest('[data-pvfont]'); if(!f) return; const key = f.closest('[data-pvbar]').dataset.pvbar, S = PVE.S[key], s = PVE.sel;
  if(!s || s.key !== key){ toast('Tap a text or an added item first'); f.value = ''; return; } const fam = f.value; if(fam) rpLoadFontLinks([rpFam(fam)]);
  if(s.id){ const it = pvItem(key, s.id); if(!it || it.k === 'i'){ toast('Font works on text'); f.value = ''; return; } it.ff = fam; }
  else { const root = $(PV_ROOT[key]), el = pvAt(root, s.p); if(!el) return; const v = S[s.p] || {k:pvCls(el), o:el.textContent, t:el.textContent, f:0, b:0, dx:0, dy:0, w:0, ff:''}; if(v.t === v.o && v.o !== el.textContent){ v.o = v.t = el.textContent; } v.ff = fam;
    if(v.t === v.o && !v.f && !v.dx && !v.dy && !v.w && !v.ff && !v.c){ delete S[s.p]; el.style.removeProperty('font-family'); } else S[s.p] = v; }
  pvSave(); PV_RR[key](); });
document.addEventListener('input', e => { const f = e.target.closest && e.target.closest('[data-pvcolor]'); if(f) pvColor(f, f.value); });
document.addEventListener('click', e => { const f = e.target.closest && e.target.closest('[data-pvcolorx]'); if(f) pvColor(f, ''); });
function pvColor(f, col){ const key = f.closest('[data-pvbar]').dataset.pvbar, S = PVE.S[key], s = PVE.sel;
  if(!s || s.key !== key){ toast('Tap a text or an added item first'); return; }
  if(s.id){ const it = pvItem(key, s.id); if(!it || it.k === 'i'){ toast('Color works on text'); return; } it.c = col; }
  else { const root = $(PV_ROOT[key]), el = pvAt(root, s.p); if(!el) return; const v = S[s.p] || {k:pvCls(el), o:el.textContent, t:el.textContent, f:0, b:0, dx:0, dy:0, w:0, ff:'', c:''}; if(v.t === v.o && v.o !== el.textContent){ v.o = v.t = el.textContent; } v.c = col;
    if(!col){ el.style.removeProperty('color'); el.style.removeProperty('-webkit-text-fill-color'); }
    if(v.t === v.o && !v.f && !v.dx && !v.dy && !v.w && !v.ff && !v.c){ delete S[s.p]; } else S[s.p] = v; }
  if(col) rpLoadFontLinks([rpFam('Reem Kufi'),{n:'Blaka',w:'400'}].filter(Boolean));
  pvSave(); PV_RR[key](); }
function pvBar(root, key){
  const anchor = root.closest('.ct-wrap') || root; let bar = anchor.parentNode.querySelector('[data-pvbar="' + key + '"]');
  if(!bar){ bar = document.createElement('div'); bar.className = 'pv-bar'; bar.dataset.pvbar = key; bar.dir = 'ltr';
    bar.innerHTML = '<span>✏️ Tap text to edit · drag added items</span><div class="pv-btns"><button type="button" class="btn small" data-pv="addt">＋ Text</button><label class="btn small pv-lbl">🖼️ Logo<input type="file" accept="image/*" hidden data-pvfile></label><button type="button" class="btn small" data-pv="mv" title="Move texts by dragging">✋ Move</button><button type="button" class="btn small" data-pv="snap" title="Free or straight lines">📏 Free</button><button type="button" class="btn small" data-pv="sm" title="Smaller">A−</button><button type="button" class="btn small" data-pv="lg" title="Bigger">A+</button>'+(key === 'cert' ? pvFontSel()+'<input type="color" data-pvcolor value="#000000" title="Color of the selected text" aria-label="Text color" style="width:34px;height:30px;padding:0;border:1px solid var(--bd,#ccc);border-radius:6px;background:none"><button type="button" class="btn small" data-pvcolorx title="Back to the original color">A↺</button>' : '')+'<button type="button" class="btn small" data-pv="wm" title="Narrower text box">↔−</button><button type="button" class="btn small" data-pv="wp" title="Wider text box">↔+</button><button type="button" class="btn small" data-pv="undo" title="Undo last change (Ctrl+Z)">↶ Undo</button><button type="button" class="btn small" data-pv="selall" title="Select all text in the box you are editing">Select all</button><button type="button" class="btn small" data-pv="clear" title="Delete all text in the box you are editing">Clear</button><button type="button" class="btn small" data-pv="del" title="Delete added item">🗑</button><button type="button" class="btn small" data-pvreset="' + key + '">↺ Reset</button></div>';
    bar.addEventListener('mousedown', e => { if(e.target.closest('button')) e.preventDefault(); });
    anchor.parentNode.insertBefore(bar, anchor); }
  const n = pvCount(PVE.S[key]), r = bar.querySelector('[data-pvreset]'); r.disabled = !n; r.textContent = n ? '↺ Reset (' + n + ')' : '↺ Reset';
  bar.querySelector('[data-pv="mv"]').textContent = PVE.move ? '✋ Move: ON' : '✋ Move'; bar.querySelector('[data-pv="mv"]').setAttribute('aria-pressed', String(!!PVE.move));
  bar.querySelector('[data-pv="snap"]').textContent = PVE.snap === 'lines' ? '📏 Lines' : '📏 Free';
  bar.querySelector('[data-pv="undo"]').disabled = !PVE.hist.length;
  const fsel = bar.querySelector('[data-pvfont]'); if(fsel){ let ff = ''; const s0 = PVE.sel; if(s0 && s0.key === key){ if(s0.id){ const it0 = pvItem(key, s0.id); ff = (it0 && it0.ff) || ''; } else { const v0 = PVE.S[key][s0.p]; ff = (v0 && v0.ff) || ''; } } fsel.value = ff; }
  const csel = bar.querySelector('[data-pvcolor]'); if(csel){ let cc = ''; const s1 = PVE.sel; if(s1 && s1.key === key){ if(s1.id){ const i1 = pvItem(key, s1.id); cc = (i1 && i1.c) || ''; } else { const v1 = PVE.S[key][s1.p]; cc = (v1 && v1.c) || ''; if(!cc){ const el1 = pvAt(root, s1.p); if(el1){ const m = /(\d+)\D+(\d+)\D+(\d+)/.exec(getComputedStyle(el1).color); if(m) cc = '#' + [1,2,3].map(i => (+m[i]).toString(16).padStart(2,'0')).join(''); } } } } if(/^#[0-9a-f]{6}$/i.test(cc)) csel.value = cc; }
  bar.querySelector('[data-pv="del"]').disabled = !(PVE.sel && PVE.sel.key === key && PVE.sel.id);
}
function pvEdit(el, done){ const prevWS = el.style.whiteSpace; el.contentEditable = 'plaintext-only'; if(el.contentEditable !== 'plaintext-only') el.contentEditable = 'true'; el.style.whiteSpace = 'pre-wrap'; el.classList.add('pv-edit'); el.focus();
  try{ const sl = getSelection(), pt = PVE.pt; let rg = null; PVE.pt = null;
    if(pt && Date.now() - pt.t < 2000){ if(document.caretRangeFromPoint) rg = document.caretRangeFromPoint(pt.x, pt.y); else if(document.caretPositionFromPoint){ const cp = document.caretPositionFromPoint(pt.x, pt.y); if(cp){ rg = document.createRange(); rg.setStart(cp.offsetNode, cp.offset); rg.collapse(true); } } }
    if(!rg || !el.contains(rg.startContainer)){ rg = document.createRange(); rg.selectNodeContents(el); rg.collapse(false); }
    sl.removeAllRanges(); sl.addRange(rg); const keep = rg.cloneRange(); const again = () => { try{ if(el.isContentEditable && document.activeElement === el){ const s2 = getSelection(); s2.removeAllRanges(); s2.addRange(keep); } }catch(e){} }; requestAnimationFrame(again); setTimeout(again, 60); }catch(e){}
  if(!PVE.nl){ PVE.nl = 1; toast('Tap to place the cursor · Enter = new line · tap outside to finish · Esc cancels'); }
  let cancel = false;
  const fin = () => { el.removeEventListener('blur', fin); el.removeEventListener('keydown', kd); el.removeEventListener('paste', ps); el.removeAttribute('contenteditable'); el.classList.remove('pv-edit'); const txt = (el.innerText || el.textContent || '').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/ ?\n ?/g,'\n').replace(/\n{3,}/g,'\n\n').trim(); el.style.whiteSpace = prevWS; done(cancel ? null : txt); };
  const kd = e => { if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); el.blur(); } else if(e.key === 'Escape'){ cancel = true; el.blur(); } e.stopPropagation(); };
  const ps = e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text').replace(/\r/g,'').replace(/[ \t]+/g,' ')); };
  el.addEventListener('blur', fin); el.addEventListener('keydown', kd); el.addEventListener('paste', ps); }
function pvStart(root, key, el){
  const S = PVE.S[key], p = pvPath(root, el), cur = S[p] || {}, o = cur.o !== undefined ? cur.o : el.textContent, before = el.textContent;
  PVE.sel = {key:key, p:p}; pvMark(root, key); pvBar(root, key);
  pvEdit(el, t => { const nt = (t === null) ? before : t; el.textContent = nt; el.style.whiteSpace = nt.indexOf('\n') >= 0 ? 'pre-line' : ''; if(nt === '' && o) toast('Text hidden — ↺ Reset brings it back'); const v = {k:cur.k || pvCls(el), o:o, t:nt, f:cur.f || 0, b:cur.b || 0, dx:cur.dx || 0, dy:cur.dy || 0, w:cur.w || 0, ff:cur.ff || '', c:cur.c || ''};
    if(nt === o && !v.f && !v.dx && !v.dy && !v.w && !v.ff && !v.c){ delete S[p]; el.classList.remove('pv-ed'); } else { S[p] = v; el.classList.add('pv-ed'); }
    pvSave(); pvBar(root, key); }); }
function pvMoveEl(root, key, el, e){
  const S = PVE.S[key], p = pvPath(root, el), box = root.firstElementChild, W = box.offsetWidth || 1, br = box.getBoundingClientRect(), sc = (br.width / W) || 1, v0 = S[p] || {k:pvCls(el), o:el.textContent, t:el.textContent, f:0, b:0, dx:0, dy:0};
  const er = el.getBoundingClientRect(), c0 = (er.left + er.width / 2 - br.left) / sc, lines = PVE.snap === 'lines', sx = e.clientX, sy = e.clientY;
  let dx = v0.dx || 0, dy = v0.dy || 0, moved = false, axis = ''; e.preventDefault(); PVE.sel = {key:key, p:p}; pvMark(root, key); pvBar(root, key);
  const mv = ev => { let ax = (ev.clientX - sx) / sc, ay = (ev.clientY - sy) / sc; if(!moved && Math.hypot(ax, ay) < 3) return; moved = true;
    if(lines){ if(!axis && Math.hypot(ax, ay) > 8) axis = Math.abs(ax) >= Math.abs(ay) ? 'x' : 'y'; if(axis === 'x') ay = 0; else if(axis === 'y') ax = 0; ax = Math.round(ax / 8) * 8; ay = Math.round(ay / 8) * 8;
      const nc = c0 + ax, near = axis !== 'y' && Math.abs(nc - W / 2) < 8; if(near) ax += W / 2 - nc; pvGuide(box, near); }
    dx = (v0.dx || 0) + ax / W; dy = (v0.dy || 0) + ay / W; pvPos(el, {dx:dx, dy:dy}, W); };
  const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); pvGuide(box, false);
    if(!moved) return; v0.dx = +dx.toFixed(4); v0.dy = +dy.toFixed(4); S[p] = v0; el.classList.add('pv-ed'); pvSave(); pvBar(root, key); };
  document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up); }
function pvItem(key, id){ return (PVE.S[key]._x || []).find(i => i.id === id); }
function pvDrag(root, key, e){
  const t = e.target.closest('.pv-it'); if(!t || t.hasAttribute('contenteditable')) return; const it = pvItem(key, t.dataset.id); if(!it) return;
  e.preventDefault(); PVE.sel = {key:key, id:it.id}; pvMark(root, key); pvBar(root, key);
  const box = root.firstElementChild, sx = e.clientX, sy = e.clientY; let moved = false;
  const x0 = it.x, y0 = it.y, lines = PVE.snap === 'lines'; let axis = '';
  const mv = ev => { if(!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return; moved = true; const r = box.getBoundingClientRect();
    let px = (ev.clientX - r.left) / r.width * 100, py = (ev.clientY - r.top) / r.height * 100, near = false;
    if(lines){ const ax = ev.clientX - sx, ay = ev.clientY - sy; if(!axis && Math.hypot(ax, ay) > 8) axis = Math.abs(ax) >= Math.abs(ay) ? 'x' : 'y'; if(axis === 'x') py = y0; else if(axis === 'y') px = x0; px = Math.round(px / 2) * 2; py = Math.round(py / 2) * 2; if(axis !== 'y' && Math.abs(px - 50) < 2){ px = 50; near = true; } }
    pvGuide(box, near); it.x = Math.max(0, Math.min(100, Math.round(px * 10) / 10)); it.y = Math.max(0, Math.min(100, Math.round(py * 10) / 10)); t.style.left = it.x + '%'; t.style.top = it.y + '%'; };
  const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); pvGuide(box, false);
    if(moved){ pvSave(); return; }
    if(it.k === 't') pvEdit(t, txt => { if(txt === null) { t.textContent = it.txt; return; } if(!txt){ PVE.S[key]._x = PVE.S[key]._x.filter(i => i !== it); PVE.sel = null; pvSave(); PV_RR[key](); return; } it.txt = txt; t.textContent = txt; pvSave(); }); };
  document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up); }
function pvAfter(id, key){
  const root = $(id); if(!root) return; pvApply(root, PVE.S[key], true);
  if(!root._pv){ root._pv = 1; root.classList.add('pv-on');
    root.addEventListener('pointerdown', e => { if(e.target.closest('.pv-it')) return pvDrag(root, key, e); if(!PVE.move) return; const h = document.elementsFromPoint(e.clientX, e.clientY).find(x => x !== root && root.contains(x) && pvOK(x)); if(h) pvMoveEl(root, key, h, e); });
    root.addEventListener('click', e => { if(PVE.move || e.target.closest('[contenteditable],.pv-it')) return;
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find(x => x !== root && root.contains(x) && pvOK(x));
      if(!hit){ PVE.sel = null; pvMark(root, key); pvBar(root, key); if(!PVE.hint){ PVE.hint = 1; toast('Tap directly on a line of text to edit it'); } return; }
      pvStart(root, key, hit); }); }
  root.classList.toggle('pv-move', !!PVE.move); if(key === 'cert') ctFitMid(root.querySelector('.ct'));
  pvMark(root, key); pvBar(root, key);
}
function pvLogo(key, file){
  const rd = new FileReader(); rd.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 480 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const S = PVE.S[key]; S._x = S._x || []; const it = {id:'i' + Date.now().toString(36), k:'i', x:50, y:14, w:16, src:c.toDataURL('image/png')}; S._x.push(it); PVE.sel = {key:key, id:it.id}; pvSave(); PV_RR[key](); toast('Logo added — drag to move, A+ / A− to resize'); }; im.src = rd.result; };
  rd.readAsDataURL(file); }
document.addEventListener('change', e => { const f = e.target.closest && e.target.closest('[data-pvfile]'); if(!f || !f.files[0]) return; const key = f.closest('[data-pvbar]').dataset.pvbar; pvLogo(key, f.files[0]); f.value = ''; });
document.addEventListener('click', e => { const r = e.target.closest('[data-pvreset]'), b = e.target.closest('[data-pv]'); if(!r && !b) return;
  const key = (r || b).closest('[data-pvbar]').dataset.pvbar, S = PVE.S[key], root = $(PV_ROOT[key]); if(!root) return;
  if(r){ PVE.S[key] = {}; if(PVE.sel && PVE.sel.key === key) PVE.sel = null; pvSave(); PV_RR[key](); toast('Edits reset ↺'); return; }
  const act = b.dataset.pv;
  if(act === 'undo'){ pvUndo(); return; }
  if(act === 'snap'){ PVE.snap = PVE.snap === 'lines' ? 'free' : 'lines'; lsSet('lp.pve.snap', PVE.snap); Object.keys(PV_ROOT).forEach(k => { const r2 = $(PV_ROOT[k]); if(r2) pvBar(r2, k); }); toast(PVE.snap === 'lines' ? 'Lines: straight moves, snaps to a grid and the center line' : 'Free: move anywhere'); return; }
  if(act === 'selall' || act === 'clear'){ const ed = root.querySelector('[contenteditable]'); if(!ed){ toast('Tap a text to edit first'); return; } ed.focus(); if(act === 'selall'){ const r = document.createRange(); r.selectNodeContents(ed); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); } else { ed.textContent = ''; ed.focus(); } return; }
  if(act === 'mv'){ PVE.move = !PVE.move; Object.keys(PV_ROOT).forEach(k => { const r2 = $(PV_ROOT[k]); if(r2){ r2.classList.toggle('pv-move', !!PVE.move); pvBar(r2, k); } }); toast(PVE.move ? 'Move ON — drag any text or item, tap ✋ again to edit text' : 'Move off — tap text to edit'); return; }
  if(act === 'addt'){ S._x = S._x || []; const it = {id:'t' + Date.now().toString(36), k:'t', x:50, y:50, fs:4, txt:'Your text', c:''}; S._x.push(it); PVE.sel = {key:key, id:it.id}; pvSave(); PV_RR[key](); toast('Tap the new text to edit it, drag to move'); return; }
  const s = PVE.sel; if(!s || s.key !== key){ toast('Tap a text or an added item first'); return; }
  if(act === 'del'){ if(s.id){ S._x = (S._x || []).filter(i => i.id !== s.id); PVE.sel = null; pvSave(); PV_RR[key](); } return; }
  if(act === 'wm' || act === 'wp'){ const k = act === 'wp' ? 1.12 : 1 / 1.12;
    if(s.id){ const it = pvItem(key, s.id); if(!it || it.k !== 't'){ toast('Width works on text'); return; } it.bw = Math.max(10, Math.min(100, +((it.bw || 90) * k).toFixed(1))); pvSave(); PV_RR[key](); return; }
    const el = pvAt(root, s.p); if(!el) return; const box = root.firstElementChild, W = box.offsetWidth || 1, sc = (box.getBoundingClientRect().width / W) || 1;
    const v = S[s.p] || {k:pvCls(el), o:el.textContent, t:el.textContent, f:0, b:0, dx:0, dy:0, w:0}; if(v.t === v.o && v.o !== el.textContent){ v.o = v.t = el.textContent; } const cw = v.w || (el.getBoundingClientRect().width / sc / W);
    v.w = Math.max(.1, Math.min(1, +(cw * k).toFixed(3))); S[s.p] = v; pvSave(); PV_RR[key](); return; }
  const m = act === 'lg' ? 1.12 : 1 / 1.12;
  if(s.id){ const it = pvItem(key, s.id); if(!it) return; if(it.k === 'i') it.w = Math.max(4, Math.min(90, +(it.w * m).toFixed(1))); else it.fs = Math.max(1.2, Math.min(16, +(it.fs * m).toFixed(2))); }
  else { const el = pvAt(root, s.p); if(!el) return; const v = S[s.p] || {k:pvCls(el), o:el.textContent, t:el.textContent, f:0, b:0, dx:0, dy:0}; if(v.t === v.o && v.o !== el.textContent){ v.o = v.t = el.textContent; } if(!v.b){ el.style.removeProperty('font-size'); v.b = parseFloat(getComputedStyle(el).fontSize) || 16; }
    v.f = Math.max(.4, Math.min(3, +((v.f || 1) * m).toFixed(2))); if(Math.abs(v.f - 1) < .03) v.f = 0; if(v.t === v.o && !v.f && !v.dx && !v.dy && !v.w && !v.ff && !v.c) delete S[s.p]; else S[s.p] = v; if(v.f) el.style.setProperty('font-size', (v.b * v.f) + 'px', 'important'); else el.style.removeProperty('font-size'); }
  pvSave(); if(s.id) PV_RR[key](); else pvBar(root, key); });
(function(){ const f = rpPreview; rpPreview = function(){ const r = f.apply(this, arguments); pvAfter('rpPreview','report'); return r; }; })();
(function(){ const f = rpDesignPv; rpDesignPv = function(){ const r = f.apply(this, arguments); pvAfter('rpDesignPv','design'); return r; }; })();
(function(){ const f = ctRender; ctRender = function(){ const r = f.apply(this, arguments); pvAfter('ctPv','cert'); return r; }; })();
(function(){ const f = rpToPng; rpToPng = function(html, w, name, text){ return f.call(this, pvExport(html, w, window.PV_FORCE), w, name, text); }; })();
(function(){ const f = rpPrintDoc; rpPrintDoc = function(t, html, css){ return f.call(this, t, pvExport(html), css); }; })();
pvAfter('rpPreview','report'); pvAfter('rpDesignPv','design'); pvAfter('ctPv','cert');

