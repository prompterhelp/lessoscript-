/* ===== Undo / Redo for every script change (rephrase, edit line) ===== */
S.undoStack = []; S.redoStack = [];
try{ S.undoStack = JSON.parse(lsGet('lp.undo')||'[]'); S.redoStack = JSON.parse(lsGet('lp.redo')||'[]'); }catch(e){}
function persistUndo(){ lsSet('lp.undo', JSON.stringify(S.undoStack.slice(-30))); lsSet('lp.redo', JSON.stringify(S.redoStack.slice(-30))); }
function pushUndo(script, pos){
  S.undoStack.push({ script, pos }); if(S.undoStack.length > 30) S.undoStack.shift();
  S.redoStack = []; persistUndo();
}
function restoreSnap(snap){
  const wasRunning = S.running; saveState();
  applyScript(snap.script, S.key);
  S.pos = Math.min(Math.max(snap.pos||0, 0), S.model.steps.length - 1);
  if(wasRunning){ S.elapsed = elapsedMs(); startTimer(); }
  saveState();
  $('scriptInput').value = S.script;
  $('rp').hidden = true;
  persistUndo();
  renderStrip(); renderFollow(); renderFoot(); tick();
  if(S.view === 'script') renderScript();
}
function undoScript(){
  if(!S.undoStack.length){ toast('Nothing to undo'); return; }
  const snap = S.undoStack.pop();
  S.redoStack.push({ script: S.script, pos: S.pos });
  restoreSnap(snap); toast('↩ Undone (' + S.undoStack.length + ' more)');
}
function redoScript(){
  if(!S.redoStack.length){ toast('Nothing to redo'); return; }
  const snap = S.redoStack.pop();
  S.undoStack.push({ script: S.script, pos: S.pos });
  restoreSnap(snap); toast('↪ Redone');
}

/* Map rendered (plain) text back to the raw markdown line so the REAL script text changes */
function plainMap(raw){
  const chars=[], idx=[];
  let i=0, lastSpace=true;
  while(i<raw.length){
    const rest=raw.slice(i);
    const cm=/^\s?\[\d+(?:\s*,\s*\d+)*\]/.exec(rest);
    if(cm){ i+=cm[0].length; continue; }
    const ch=raw[i];
    if(ch==='*'||ch==='`'){ i++; continue; }
    if(/\s/.test(ch)){ if(!lastSpace){ chars.push(' '); idx.push(i); lastSpace=true; } i++; continue; }
    chars.push(ch); idx.push(i); lastSpace=false; i++;
  }
  return { plain: chars.join(''), idx };
}
function findInRaw(raw, sel){
  const q=String(sel||'').replace(/\*/g,'').replace(/\s+/g,' ').trim();
  if(!q) return null;
  const m=plainMap(raw);
  let at=m.plain.indexOf(q);
  if(at<0) at=m.plain.toLowerCase().indexOf(q.toLowerCase());
  if(at<0) return null;
  const start=m.idx[at];
  let end=m.idx[at+q.length-1]+1;
  return { start, end };
}
function replaceInRaw(raw, sel, newText){
  const f=findInRaw(raw, sel); if(!f) return null;
  const removed=raw.slice(f.start,f.end);
  const odd=((removed.match(/\*\*/g)||[]).length%2)===1;
  const clean=String(newText).replace(/\s*\n\s*/g,' ').replace(/\*/g,'').trim() + (odd?'**':'');
  return raw.slice(0,f.start)+clean+raw.slice(f.end);
}
function applyReplace(newText){
  if(!S.model) return;
  const st = RP.pos >= 0 ? S.model.steps[RP.pos] : null;
  const lines = S.script.split('\n');
  let hit=-1, out=null;
  const tryLine=(li)=>{
    const raw=lines[li];
    if(RP.whole && st && st.text && raw.includes(st.text)){
      const c=String(newText).replace(/\s*\n\s*/g,' ').replace(/\*/g,'').trim();
      return raw.replace(st.text, () => c);
    }
    return replaceInRaw(raw, RP.text, newText);
  };
  // pass 1: the line(s) that belong to the selected step
  if(st){
    const keys=[st.text].concat(st.items||[]).filter(Boolean);
    for(let li=0; li<lines.length && out===null; li++){
      if(keys.some(k => lines[li].includes(k))){ const r=tryLine(li); if(r!==null){ hit=li; out=r; } }
    }
  }
  // pass 2: any line containing the selection
  for(let li=0; li<lines.length && out===null; li++){
    const r=tryLine(li); if(r!==null){ hit=li; out=r; }
  }
  if(out===null){ toast("⚠️ Couldn't find that text in the script — try selecting a smaller piece"); return; }
  const wasRunning=S.running, oldScript=S.script, oldPos=S.pos;
  saveState();
  lines[hit]=out;
  pushUndo(oldScript, oldPos);
  const ok = applyScript(lines.join('\n'), S.key);
  if(!ok){ S.undoStack.pop(); persistUndo(); S.script=oldScript; applyScript(oldScript, S.key); toast('Replacement produced an invalid script — undone'); return; }
  S.pos=Math.min(oldPos, S.model.steps.length-1);
  if(wasRunning){ S.elapsed=elapsedMs(); startTimer(); }
  saveState();
  $('scriptInput').value = S.script;
  $('rp').hidden = true;
  persistUndo(); $('rpUndo').hidden = false;
  renderStrip(); renderFollow(); renderFoot(); tick();
  if(S.view==='script') renderScript();
  toast('✓ Script text replaced');
}

$('rpUndo').addEventListener('click', undoScript);
$('rpRedo').addEventListener('click', redoScript);


/* Double-tap any word: meaning + pronunciation */
let dictWord='';
async function openDict(w){
  w=String(w).replace(/[^\p{L}'\-]/gu,''); if(!w) return; dictWord=w;
  $('selChip').hidden=true; $('dict').hidden=false;
  $('dictBody').innerHTML='<h3>'+esc(w)+'</h3><p class="help">Looking up…</p>';
  speakText(w);
  try{
    const r=await fetch('https://api.dictionaryapi.dev/v2/entries/en/'+encodeURIComponent(w.toLowerCase()));
    if(!r.ok) throw 0; const j=await r.json(), e=j[0];
    const ph=e.phonetic||((e.phonetics||[]).find(p=>p.text)||{}).text||'';
    let h='<h3>'+esc(w)+'<span class="ph">'+esc(ph)+'</span></h3>';
    (e.meanings||[]).slice(0,3).forEach(m=>{ h+='<p style="margin:8px 0 2px"><em>'+esc(m.partOfSpeech)+'</em></p><ol style="margin:0;padding-left:1.3em">'+m.definitions.slice(0,2).map(d=>'<li>'+esc(d.definition)+(d.example?'<br><small style="color:var(--muted)">e.g. '+esc(d.example)+'</small>':'')+'</li>').join('')+'</ol>'; });
    $('dictBody').innerHTML=h;
  }catch(err){ $('dictBody').innerHTML='<h3>'+esc(w)+'</h3><p class="help">No dictionary entry (or offline). Try ✨ Easier words or 🌐 Translate.</p>'; }
}
$('dictX').addEventListener('click',()=>{$('dict').hidden=true;});
$('dictRead').addEventListener('click',()=>speakText(dictWord));
$('dictTr').addEventListener('click',()=>{ $('dict').hidden=true; openRP({text:dictWord,pos:S.pos,whole:false},'translate'); });
$('dictSyn').addEventListener('click',()=>{ $('dict').hidden=true; openRP({text:dictWord,pos:S.pos,whole:false},'synonyms'); });
$('stage').addEventListener('dblclick',e=>{ if(S.locked) return; const w=(window.getSelection().toString()||'').trim(); if(w && !/\s/.test(w)) openDict(w); });

/* Touch Swipe Gestures */
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive:true });

document.addEventListener('touchend', e => {
  const diffX = e.changedTouches[0].screenX - touchStartX;
  const diffY = e.changedTouches[0].screenY - touchStartY;
  if(Math.abs(diffX) > 60 && Math.abs(diffY) < 40){
    if(diffX < 0) next();
    else prev();
  }
}, { passive:true });

/* Open Student Screenshare Window */
$('openStudentWindow').addEventListener('click', () => {
  const win = window.open('', 'StudentPresentation', 'width=800,height=600');
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Lesson Presentation</title>
  <style>
[hidden]{display:none!important}
    body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0C1413;color:#E4EEEB;font-family:'Bricolage Grotesque',system-ui,sans-serif;text-align:center;padding:30px}
    h2{font-size:1.4rem;color:#4FC3B5;letter-spacing:.08em;text-transform:uppercase;margin:0 0 10px}
    h1{font-size:2.8rem;line-height:1.2;margin:0}
  </style></head><body>
  <h2 id="slNum">Slide</h2><h1 id="slTitle">Welcome!</h1><p id="q" style="font-size:2rem;color:#97A3FF;margin-top:28px"></p>
  <script>
    const bc = new BroadcastChannel('lesson_prompter_sync');
    bc.onmessage = e => {
      if(e.data.type === 'SLIDE_CHANGE'){
        document.getElementById('slNum').textContent = 'Slide ' + e.data.slideNum + ' of ' + e.data.totalSlides;
        document.getElementById('slTitle').textContent = e.data.title;
        document.getElementById('q').textContent = e.data.q ? '❓ ' + e.data.q : '';
      }
    };
  <\/script></body></html>`);
});

/* Events */
$('exportScript').addEventListener('click', () => { const u=URL.createObjectURL(new Blob([S.script],{type:'text/plain'})); const a=document.createElement('a'); a.href=u; a.download='lesson_script.txt'; a.click(); URL.revokeObjectURL(u); });
$('helpBtn').addEventListener('click', () => { $('help').hidden = false; });
$('help').addEventListener('click', () => { $('help').hidden = true; });
$('scriptSearch').addEventListener('input', e => { S.q = e.target.value.trim().toLowerCase(); renderScript(); });
$('toggleTimer').addEventListener('click', () => { S.running ? pauseTimer() : startTimer(); tick(); });
$('btnNext').addEventListener('click', next);
$('btnPrev').addEventListener('click', prev);
$('camBtn').addEventListener('click', () => { S.cam = !S.cam; applyLook(); savePrefs(); });
$('voiceBtn').addEventListener('click', toggleVoiceControl);
$('focusBtn').addEventListener('click', () => { S.focus = !S.focus; applyLook(); savePrefs(); if(S.model) renderHead(); });
$('lockBtn').addEventListener('click', () => { S.locked = !S.locked; applyLook(); });

document.querySelector('.tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if(b && !S.locked) setView(b.dataset.view);
});

$('strip').addEventListener('click', e => {
  const b = e.target.closest('[data-slide]');
  if(!b || S.locked) return;
  const s = S.model.slides[+b.dataset.slide];
  go(s.lines[0].pos);
  if(S.view !== 'follow') setView('follow');
});

/* Stage Clicks: Audio, Quick Assessment, Skips */
$('stage').addEventListener('click', e => {
  if(S.locked) return;
  if(e.target.closest('[data-act="dictate"]')){ dictate(); return; }
  if(e.target.closest('[data-act="read-stop"]')){ stopReading(); return; }
  if(e.target.closest('[data-act="read-step"]')){ toggleRead(); return; }
  if(RD.on && e.target.closest('.line.now') && !e.target.closest('input,button')){ toggleRead(); return; }
  const wd = e.target.closest('.w');
  if(wd && S.voice && !String(window.getSelection()).trim()){
    VT.disp = VT.idx = +wd.dataset.w + 1; VT.off = VT.all; VT.hp = 0; VT.lastSpeech = Date.now();
    renderTrack(false); return;
  }

  
  const gradeBtn = e.target.closest('[data-act="grade"]');
  if(gradeBtn){
    const qid = gradeBtn.dataset.qid, status = gradeBtn.dataset.status;
    S.assess[qid] = S.assess[qid] === status ? '' : status;
    saveState();
    renderFollow();
    return;
  }
  
  const skipBtn = e.target.closest('[data-act="skip"]');
  if(skipBtn){ skipCurrent(); return; }

  const row = e.target.closest('[data-pos]');
  if(row && !e.target.closest('input,button')){
    const p = +row.dataset.pos;
    if(p !== S.pos) go(p);
  }
});


/* Toolbar Quick Clicks (Restored original functions) */
$('toolbar').addEventListener('click', e => {
  if(S.locked) return;
  const id = e.target.closest('button')?.id;
  if(id === 'undoBtn'){ undoScript(); }
  else if(id === 'redoBtn'){ redoScript(); }
  else if(id === 'toolsMore'){ window.__to = !window.__to; const x = document.querySelector('.tools-extra'); if(x) x.classList.toggle('open', window.__to); }
  else if(id === 'readBtn') { toggleRead(); }
  else if(id === 'fsUp') { S.fs = Math.min(1.6, +(S.fs + 0.1).toFixed(2)); applyLook(); savePrefs(); scrollToCurrent(false); }
  else if(id === 'fsDown') { S.fs = Math.max(0.85, +(S.fs - 0.1).toFixed(2)); applyLook(); savePrefs(); scrollToCurrent(false); }
  else if(id === 'thmBtn') {
    const idx = THEMES.findIndex(t => t[0] === S.theme);
    S.theme = THEMES[(idx + 1) % THEMES.length][0];
    applyLook(); savePrefs();
  }
  else if(id === 'fullTxtBtn') { toggleFullText(); }
  else if(id === 'wideBtn') { S.wide = !S.wide; applyLook(); savePrefs(); renderFollow(); }
  else if(id === 'fullBtn') { toggleFull(); }
  else if(id === 'mirBtn') { S.mirror = !S.mirror; document.body.classList.toggle('mirror', S.mirror); }
  else if(id === 'editBtn') { editLine(); }
  else if(id === 'rpBtn') { const i = selInfo() || wholeLine(); if(i) openRP(i); }
});

/* Script View Jump */
$('scriptList').addEventListener('click', e => {
  const r = e.target.closest('[data-pos]');
  if(r){ S.pos = +r.dataset.pos; setView('follow'); renderFoot(); saveState(); tick(); }
});
document.querySelectorAll('#view-script .chip').forEach(c => c.addEventListener('click', () => { S.filter = c.dataset.filter; renderScript(); }));

/* Notes, Assessment & Sharing */
$('notesArea').addEventListener('input', e => { S.notes = e.target.value; saveState(); $('summary').value = buildSummary(); });
$('qaList').addEventListener('click', e => {
  const gradeBtn = e.target.closest('[data-act="grade"]');
  if(gradeBtn){
    const qid = gradeBtn.dataset.qid, status = gradeBtn.dataset.status;
    S.assess[qid] = S.assess[qid] === status ? '' : status;
    saveState();
    renderNotes();
  }
});
$('qaList').addEventListener('input', e => {
  const qid = e.target.dataset?.qid;
  if(qid){ S.answers[qid] = e.target.value; saveState(); $('summary').value = buildSummary(); }
});

$('btnQuiz').addEventListener('click', generateAutoQuiz);
$('saveHistoryBtn').addEventListener('click', saveToHistory);

$('copySummary').addEventListener('click', async () => {
  $('summary').value = buildSummary();
  try { await navigator.clipboard.writeText($('summary').value); $('copyMsg').textContent = 'Copied to clipboard.'; }
  catch(e){ $('copyMsg').textContent = 'Select all and copy manually.'; }
  setTimeout(() => $('copyMsg').textContent = '', 3000);
});

$('shareWhatsApp').addEventListener('click', () => {
  const text = encodeURIComponent(buildSummary());
  window.open('https://api.whatsapp.com/send?text=' + text, '_blank');
});
$('printSummary').addEventListener('click', () => { window.print(); });

/* Setup, Backup & File Ingestion */
$('exportBackup').addEventListener('click', exportBackupJSON);
$('importFile').addEventListener('change', e => { if(e.target.files[0]) importBackupJSON(e.target.files[0]); });

/* Word DOCX Parser */
async function docxToText(file){
  const buf = new Uint8Array(await file.arrayBuffer()), dv = new DataView(buf.buffer);
  let eocd = -1;
  for(let i = buf.length - 22; i >= 0; i--){ if(buf[i] === 0x50 && buf[i+1] === 0x4b && buf[i+2] === 5 && buf[i+3] === 6){ eocd = i; break; } }
  if(eocd < 0) throw new Error('not a docx');
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true), xml = null;
  for(let n = 0; n < count; n++){
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(buf.slice(p + 46, p + 46 + nl));
    if(name === 'word/document.xml'){
      const ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true), data = buf.slice(ds, ds + csize);
      xml = method === 0 ? new TextDecoder().decode(data) : await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
      break;
    }
    p += 46 + nl + el + cl;
  }
  if(!xml) throw new Error('no document.xml');
  const doc = new DOMParser().parseFromString(xml, 'application/xml'), out = [];
  for(const para of doc.getElementsByTagName('w:p')){
    let t = '';
    for(const r of para.getElementsByTagName('w:r')){
      let rt = '';
      for(const c of r.childNodes){
        if(c.nodeName === 'w:t') rt += c.textContent;
        else if(c.nodeName === 'w:tab' || c.nodeName === 'w:br') rt += ' ';
      }
      const b = r.getElementsByTagName('w:b')[0];
      const bold = b && b.getAttribute('w:val') !== '0' && b.getAttribute('w:val') !== 'false';
      t += (bold && rt.trim()) ? '**' + rt + '**' : rt;
    }
    t = t.replace(/\*\*\*\*/g, '').trim();
    if(!t) continue;
    if(para.getElementsByTagName('w:numPr').length && !/\[[^\]]{2,32}\]/.test(t)) t = '1. ' + t;
    out.push(t);
  }
  return out.join('\n\n');
}

async function readFile(f){
  if(!f) return;
  let text = '';
  try {
    text = /\.docx$/i.test(f.name) ? await docxToText(f) : await f.text();
  } catch(e){
    const rep = $('report'); rep.hidden = false; rep.className = 'report bad';
    rep.textContent = 'Could not read file. Save as .txt or .docx and try again.';
    return;
  }
  $('scriptInput').value = text;
  if(applyScript(text)){ S.view = 'follow'; renderAll(); }
}

$('cleanBtn').addEventListener('click', () => {
  const t = $('scriptInput').value; if(!t.trim()){ toast('Paste a script first'); return; }
  const r = cleanScript(t); if(r.code){ toast('That is code, not a script'); const rp = $('report'); rp.hidden = false; rp.className = 'report bad'; rp.textContent = r.notes[0]; return; } $('scriptInput').value = r.text;
  if(applyScript(r.text)){ renderAll(); const rep = $('report'); rep.textContent += ' 🧹 Cleaned: ' + r.notes.join(', ') + '.'; toast('🧹 Script cleaned'); }
});
$('pasteBtn').addEventListener('click', async () => {
  try {
    const t = await navigator.clipboard.readText();
    if(!t.trim()) throw new Error('empty');
    $('scriptInput').value = t;
    if(applyScript(t)){ S.view = 'follow'; renderAll(); }
  } catch(e){
    $('scriptInput').focus();
    alert('Clipboard access was blocked by browser. Paste directly into the box.');
  }
});
$('fileIn').addEventListener('change', e => { readFile(e.target.files[0]); e.target.value = ''; });
const drop = $('drop');
['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => readFile(e.dataTransfer.files[0]));

$('loadScript').addEventListener('click', () => { if(applyScript($('scriptInput').value)){ S.view = 'follow'; renderAll(); } });
$('useSample').addEventListener('click', () => { $('scriptInput').value = SAMPLE; applyScript(SAMPLE); renderAll(); });

/* Timer Edit Drawer */
let teDirty = false;
$('editTimer').addEventListener('click', () => {
  const t = $('tedit'); t.hidden = !t.hidden; if(t.hidden) return;
  $('tePlanned').value = plannedMin() || '';
  const s = Math.floor(elapsedMs() / 1000);
  $('teMin').value = Math.floor(s / 60); $('teSec').value = s % 60; teDirty = false;
});
['teMin','teSec'].forEach(id => $(id).addEventListener('input', () => { teDirty = true; }));
$('tedit').addEventListener('click', e => {
  const b = e.target.closest('[data-d]');
  if(b) $('tePlanned').value = Math.max(1, (parseFloat($('tePlanned').value) || plannedMin() || 15) + (+b.dataset.d));
});
$('teApply').addEventListener('click', () => {
  const pl = parseFloat($('tePlanned').value); S.plannedOv = pl > 0 ? pl : 0;
  if(teDirty){ S.elapsed = ((parseInt($('teMin').value)||0)*60 + (parseInt($('teSec').value)||0)) * 1000; if(S.running) S.runStart = Date.now(); }
  saveState(); renderTop(); renderStrip(); tick(); $('tedit').hidden = true;
  calculateTimingFeasibility();
});
$('teReset').addEventListener('click', () => { S.elapsed = 0; S.running = false; saveState(); renderTop(); tick(); $('teMin').value = 0; $('teSec').value = 0; });
$('teClose').addEventListener('click', () => { $('tedit').hidden = true; });
$('teRehearse').addEventListener('click', () => {
  S.rehearsing = !S.rehearsing;
  $('teRehearse').classList.toggle('primary', S.rehearsing);
  $('teRehearse').textContent = S.rehearsing ? '🔴 Rehearsing Active' : '🎙️ Rehearsal Mode';
  alert(S.rehearsing ? 'Rehearsal Mode enabled! Practice reading slides; exact timing per slide is now recorded.' : 'Rehearsal Mode finished.');
});

/* Reset lesson */
let resetArmed = false, resetT = 0;
$('resetLesson').addEventListener('click', () => {
  const b = $('resetLesson'), msg = $('resetMsg');
  if(!resetArmed){
    resetArmed = true; b.textContent = 'Tap again to confirm'; msg.textContent = 'Clears position, timer, answers and notes.';
    resetT = setTimeout(() => { resetArmed = false; b.textContent = 'Reset this lesson'; msg.textContent = ''; }, 4000);
    return;
  }
  clearTimeout(resetT); resetArmed = false; b.textContent = 'Reset this lesson'; msg.textContent = 'Reset complete.';
  S.pos = 0; S.elapsed = 0; S.running = false; S.answers = {}; S.assess = {}; S.notes = ''; S.finished = false;
  saveState(); setView('follow'); renderAll();
});

/* Keyboard Navigation */
document.addEventListener('keydown', e => {
  { const tg = e.target?.tagName; if((e.ctrlKey||e.metaKey) && !e.altKey && tg !== 'INPUT' && tg !== 'TEXTAREA' && !(e.target && e.target.isContentEditable) && fOn() && S.model && (e.key === 'z' || e.key === 'Z' || e.key === 'y')){ e.preventDefault(); (e.shiftKey || e.key === 'y') ? redoScript() : undoScript(); return; } }
  const tag = e.target?.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable) || e.ctrlKey || e.metaKey || e.altKey) return;
  if(!S.model) return;
  if(!fOn()) return;
  if(e.key === 't' || e.key === 'T'){ S.running ? pauseTimer() : startTimer(); tick(); return; }
  if(e.key === 'f' || e.key === 'F'){ S.focus = !S.focus; applyLook(); savePrefs(); if(S.model) renderHead(); return; }
  if(e.key === 'w' || e.key === 'W'){ toggleFullText(); return; }
  if(e.key === 'c' || e.key === 'C'){ S.cam = !S.cam; applyLook(); savePrefs(); return; }
  if(e.key === 'v' || e.key === 'V'){ toggleVoiceControl(); return; }
  if(fOn() && '123'.includes(e.key) && e.key.length===1){ const st=S.model.steps[S.pos]; if(st.kind==='pause'){ const v=['got','partly','review'][+e.key-1]; S.assess[st.qid]=S.assess[st.qid]===v?'':v; saveState(); renderFollow(); return; } }
  if(e.key === 'd' || e.key === 'D'){ const w=(window.getSelection().toString()||'').trim(); if(w) openDict(w.split(/\s+/)[0]); return; }
  if(e.key === 'r' || e.key === 'R'){ toggleRead(); return; }
  if(e.key === 'Escape'){ stopReading(); return; }
  if(e.key === 'l' || e.key === 'L'){ S.locked = !S.locked; applyLook(); return; }
  if(e.key === '?'){ $('help').hidden = !$('help').hidden; return; }
  if(!fOn()) return;
  if(e.key === 's' || e.key === 'S'){ skipCurrent(); return; }
  if(e.key === '1') return gradeCur('got');
  if(e.key === '2') return gradeCur('partly');
  if(e.key === '3') return gradeCur('review');
  if(e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); next(); }
  else if(e.key === 'ArrowLeft'){ e.preventDefault(); prev(); }
});

function renderAll(){
  applyLook();
  renderTop();
  renderStrip();
  renderFoot();
  setView(S.view);
  tick();
}

/* Header overflow menu */
$('moreBtn').addEventListener('click', e => { e.stopPropagation(); const m = $('moreMenu'); m.hidden = !m.hidden; $('moreBtn').setAttribute('aria-expanded', String(!m.hidden)); });
$('moreMenu').addEventListener('click', e => { if(e.target.closest('button') && e.target.closest('button').id !== 'lockBtn' && !e.target.closest('button').hasAttribute('data-keep')) { setTimeout(() => { $('moreMenu').hidden = true; $('moreBtn').setAttribute('aria-expanded','false'); }, 120); } });
document.addEventListener('click', e => { if(!e.target.closest('#moreMenu,#moreBtn')){ $('moreMenu').hidden = true; $('moreBtn').setAttribute('aria-expanded','false'); } });

