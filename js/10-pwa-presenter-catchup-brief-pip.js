/* ===== PWA: service worker + install prompt ===== */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  const b = $('installBtn');
  if(b){ b.hidden = false; b.textContent = '⬇️ Install app'; }
});
$('installBtn').addEventListener('click', async () => {
  if(!deferredInstall){ toast('Use your browser menu: Add to Home Screen / Install app'); return; }
  deferredInstall.prompt();
  const { outcome } = await deferredInstall.userChoice;
  if(outcome === 'accepted'){ toast('Installing… open it from your home screen / apps list'); }
  deferredInstall = null;
  $('installBtn').hidden = true;
});
window.addEventListener('appinstalled', () => { $('installBtn').hidden = true; toast('✅ App installed'); });
if('serviceWorker' in navigator){
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>{ try{ r.update(); }catch(e){} }).catch(() => {}); });
}

/* ===== PRESENTER MODE toggle ===== */
function applyPresenter(){
  document.body.classList.toggle('presenter', S.presenter);
  const b = $('presBtn');
  if(b){ b.setAttribute('aria-pressed', String(S.presenter)); b.textContent = S.presenter ? '🎭 Presenter ✓' : '🎭 Presenter'; }
}
$('presBtn').addEventListener('click', () => { S.presenter = !S.presenter; applyPresenter(); savePrefs(); if(S.model) renderFollow(); toast(S.presenter ? '🎭 Presenter mode — clean screen' : 'Grading tools back'); });

/* ===== ONE-TAP CATCH-UP: auto-skip optionals when behind ===== */
function catchUp(){
  if(!S.model) return;
  const p = paceInfo();
  if(p.c !== 'bad' && p.c !== 'warn'){ toast('✅ You are on pace — nothing to skip'); return; }
  const w = slideWindow(S.model.steps[S.pos].slide);
  if(!w){ toast('No time plan set'); return; }
  let deficit = elapsedMs()/1000 - w[1];
  if(deficit <= 0){ toast('✅ Back on pace already'); return; }
  let target = S.pos + 1, saved = 0, skipped = 0;
  while(target < S.model.steps.length && deficit > 0){
    const l = S.model.steps[target];
    if(l.optional){
      const cost = ((l.text + ' ' + l.items.join(' ')).split(/\s+/).filter(Boolean).length / 125) * 60 + (l.kind === 'ask' ? 30 : 5);
      deficit -= cost; saved += cost; skipped++;
      target++;
      while(target < S.model.steps.length && S.model.steps[target].optional) target++;
    } else if(l.kind === 'pause'){
      deficit -= 5; saved += 5; target++;              // shave pause waits slightly
    } else target++;
  }
  if(skipped === 0){ toast('⚡ No optional lines left — trim pauses or extend the plan (⏱ Timer)'); return; }
  go(target);
  toast('⚡ Skipped ' + skipped + ' optional line' + (skipped>1?'s':'') + ' · saved ~' + Math.round(saved) + 's');
  confetti();
}
$('catchBtn').addEventListener('click', catchUp);

/* ===== PRE-LESSON BRIEF ===== */
function briefWords(){
  const freq = {};
  S.model.steps.forEach(l => { if(l.kind === 'speak') (l.text + ' ' + l.items.join(' ')).split(/[^\p{L}'-]+/u).forEach(w => { w = w.toLowerCase(); if(w.length >= 8) freq[w] = (freq[w]||0) + 1; }); });
  return Object.keys(freq).sort((a,b) => freq[b]-freq[a]).slice(0, 8);
}
function predictMinutes(){
  const wc = S.model.steps.reduce((a,l) => a + (l.kind==='pause' ? 25 : (l.text + ' ' + l.items.join(' ')).split(/\s+/).filter(Boolean).length), 0);
  let rates = S.history.map(h => h.wc && h.sec ? h.wc / h.sec : 0).filter(r => r > 0.5 && r < 10);
  const wps = rates.length ? rates.reduce((a,b)=>a+b,0)/rates.length : 125/60;
  return { min: Math.ceil(wc / wps / 60), wc: wc, own: rates.length >= 2 };
}
function showBrief(){
  if(!S.model) return;
  closeBrief();
  const m = S.model, pr = predictMinutes(), plan = plannedMin();
  const words = briefWords();
  const el = document.createElement('div');
  el.id = 'brief';
  el.innerHTML = '<div role="dialog" aria-label="Lesson briefing">'
    + '<h2>📋 Lesson Brief</h2>'
    + '<p class="b-sub">' + esc(m.title.kicker ? m.title.kicker + ' — ' : '') + esc(m.title.name || m.slides[0].title) + '</p>'
    + '<div class="b-grid">'
    + '<div class="b-cell"><b>' + m.slides.length + '</b><span>slides</span></div>'
    + '<div class="b-cell"><b>' + pr.min + '′</b><span>' + (pr.own ? 'your pace' : 'est. time') + '</span></div>'
    + '<div class="b-cell"><b>' + (plan ? plan + '′' : '—') + '</b><span>planned</span></div>'
    + '</div>'
    + (plan && pr.min > plan + 2 ? '<div class="report bad" style="margin:6px 0">⚠️ Your pace suggests ' + pr.min + ' min but the plan is ' + plan + ' min — consider trimming.</div>' : '')
    + '<h3>Key line per slide</h3>'
    + m.slides.map(s => { const k = s.lines.find(l => l.kind === 'speak'); return '<div class="b-key"><b>' + s.n + '</b><span>' + (k ? esc(cleanMd(k.text).slice(0, 90)) : esc(s.title)) + '</span></div>'; }).join('')
    + (words.length ? '<h3>Practice these words 🔊</h3><div class="b-words">' + words.map(w => '<button type="button" class="b-w">' + esc(w) + '</button>').join('') + '</div>' : '')
    + '<div class="b-foot"><button class="btn primary" id="briefStart">🚀 Start teaching</button><button class="btn" id="briefGo">Follow tab</button>'
    + '<label><input type="checkbox" id="briefNever"> don\'t auto-show</label></div></div>';
  document.body.appendChild(el);
  el.addEventListener('click', e => {
    const w = e.target.closest('.b-w'); if(w){ speakText(w.textContent); return; }
    if(e.target.closest('#briefStart')){ closeBrief(); startTimer(); if(S.view !== 'follow') setView('follow'); return; }
    if(e.target.closest('#briefGo')){ closeBrief(); setView('follow'); return; }
    if(e.target === el) closeBrief();
  });
  el.querySelector('#briefNever').addEventListener('change', e => { if(e.target.checked){ S.briefOff[S.key] = 1; savePrefs(); } });
}
function closeBrief(){ const b = $('brief'); if(b) b.remove(); }
$('briefBtn').addEventListener('click', showBrief);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeBrief(); });

/* ===== EYE-CONTACT PiP CAM ===== */
let pipStream = null;
function closePip(){
  if(pipStream){ pipStream.getTracks().forEach(t => t.stop()); pipStream = null; }
  const p = $('pip'); if(p) p.remove();
  $('pipBtn').setAttribute('aria-pressed', 'false');
}
async function togglePip(){
  if($('pip')){ closePip(); return; }
  try{
    pipStream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 }, audio: false });
    const d = document.createElement('div');
    d.id = 'pip';
    const pos = (S.pip && typeof S.pip.x === 'number') ? S.pip : { x: Math.round(innerWidth/2 - 75), y: 70 };
    d.style.left = pos.x + 'px'; d.style.top = pos.y + 'px';
    d.innerHTML = '<video autoplay playsinline muted></video><div class="pbar"><button type="button" data-p="mir">⇋</button><button type="button" data-p="big">＋</button><button type="button" data-p="x">✕</button></div>';
    d.querySelector('video').srcObject = pipStream;
    document.body.appendChild(d);
    $('pipBtn').setAttribute('aria-pressed', 'true');
    let drag = null;
    d.addEventListener('pointerdown', e => {
      if(e.target.closest('button')) return;
      drag = { x: e.clientX - d.offsetLeft, y: e.clientY - d.offsetTop };
      d.setPointerCapture(e.pointerId);
    });
    d.addEventListener('pointermove', e => { if(!drag) return; d.style.left = Math.max(0, Math.min(innerWidth - d.offsetWidth, e.clientX - drag.x)) + 'px'; d.style.top = Math.max(0, e.clientY - drag.y) + 'px'; });
    d.addEventListener('pointerup', () => { if(drag){ S.pip = { x: d.offsetLeft, y: d.offsetTop }; savePrefs(); } drag = null; });
    d.querySelector('.pbar').addEventListener('click', e => {
      const b = e.target.closest('button'); if(!b) return;
      const v = d.querySelector('video');
      if(b.dataset.p === 'x') closePip();
      else if(b.dataset.p === 'mir') v.style.transform = v.style.transform ? '' : 'scaleX(-1)';
      else if(b.dataset.p === 'big'){ const w = Math.min(320, d.offsetWidth + 40); d.style.width = w + 'px'; }
    });
  }catch(e){ toast('Camera blocked — allow camera access and retry'); }
}
$('pipBtn').addEventListener('click', togglePip);

/* Boot Initialization (Strictly NO auto-microphone access) */
(function boot(){
  initSettings();
  const saved = lsGet('lp.script');
  let ok = saved ? applyScript(saved, lsGet('lp.scriptkey') || '') : false;
  if(!ok) ok = applyScript(SAMPLE);
  $('scriptInput').value = S.script;
  renderAll();
  applyPresenter();
  
  setInterval(tick, 500);
  setInterval(voiceTick, 120); setInterval(predTick, 80);
  if(S.wake) setWake(true);
})();
