/* ============================================================
   VOICE FOLLOW TELEPROMPTER & RECOGNITION (NEVER AUTO-STARTS)
   ============================================================ */
function toggleVoiceControl(){
  S.voice = !S.voice; updateTracking();
  $('voiceBtn').setAttribute('aria-pressed', String(S.voice));
  document.body.classList.toggle('voice-on', S.voice);
  if(S.voice){ voiceReset(); VT.pos=-1; startVoiceRecognition(); buildTrack(); }
  else { stopVoiceRecognition(); if(S.model && fOn()) renderFollow(); }
}

function showVoiceFeedback(text){
  let badge = $('voiceStatusBadge');
  if(!badge){
    badge = document.createElement('span');
    badge.id = 'voiceStatusBadge';
    badge.className = 'voice-live-badge';
    $('pace').parentNode.appendChild(badge);
  }
  badge.textContent = text;
  badge.hidden = false;
  setTimeout(() => { if(badge && !S.voice) badge.hidden = true; }, 2500);
}

/* ---------- Voice follow: word-by-word tracking (highlights where you stopped) ---------- */
const VT = { lastMatch:0, words:[], lastNS:-1, idx:0, disp:0, off:0, hp:0, all:0, pos:-1, lastSpeech:0, done:false, lead:0, rate:2.6, leadT:0, advT:0 };
const STOPW = new Set(['the','a','an','and','of','to','in','on','is','it','he','she','they','we','you','i','was','are','that','this','for','with','as','at','by','be','or','so','his','her','their','but','not','do','did','had','has','have','will','what','who','why','how','if','then']);
const NUMW = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const norm = w => { const n = String(w||'').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^\p{L}\p{N}]/gu, ''); return /^\d+$/.test(n) && NUMW[+n] ? NUMW[+n] : n; };
const skel = x => x.replace(/[aeiouy]/g,'');
function lev(a,b){
  const m=a.length, n=b.length; if(Math.abs(m-n)>2) return 9;
  let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){ const cur=[i]; for(let j=1;j<=n;j++) cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1)); prev=cur; }
  return prev[n];
}
const isAr = x => /[\u0600-\u06FF]/.test(x);
function similar(t,h){
  if(t===h) return true;
  if(isAr(t)||isAr(h)){ const a=t.replace(/^(وال|بال|لل|ال)/,''), b=h.replace(/^(وال|بال|لل|ال)/,''); if(a&&a===b) return true; if(a.length<2||b.length<2) return false; const L=Math.max(a.length,b.length); return lev(a,b) <= (L>=7?2:L>=4?1:0); }
  if(t.length<3||h.length<3) return false;
  const mn=Math.min(t.length,h.length);
  if(mn>=4 && (t.startsWith(h)||h.startsWith(t)) && mn/Math.max(t.length,h.length)>=0.6) return true;
  if(t.length>=5 && h.length>=5 && t[0]===h[0] && skel(t).length>=3 && skel(t)===skel(h)) return true;
  const L=Math.max(t.length,h.length);
  return lev(t,h) <= (L>=9?2:L>=5?1:0);
}
/* Strict follow: a heard word only moves the cursor if it is the next script word, or within 2 content words ahead.
   Words that are not in the script are ignored (cursor stays put) until you say words from the current section again. */
function matchFrom(start, hw){
  const h = norm(hw); if(!h) return -1;
  const maxSkip = STOPW.has(h) ? 0 : 2; let skipped=0, scanned=0;
  for(let j=start; j<VT.words.length && scanned<7; j++){
    const t = VT.words[j]; if(t.skip) continue;
    scanned++;
    if(similar(t.n, h)) return j+1;
    if(!STOPW.has(t.n) && ++skipped>maxSkip) break;
  }
  return -1;
}
function voiceReset(){ VT.lastMatch=0; VT.lead=0; VT.idx=0; VT.disp=0; VT.hp=0; VT.off=VT.all; VT.done=false; VT.lastSpeech=Date.now(); }

function buildTrack(){
  VT.words=[]; VT.lastNS=-1; VT.lead=0;
  const el = document.querySelector('#stage .line.now');
  if(!el || !S.model || S.model.steps[S.pos].kind==='pause') return;
  if(VT.pos!==S.pos){ VT.pos=S.pos; VT.idx=0; VT.disp=0; VT.done=false; }
  const seenAr = new Set();
  const _t = el.textContent||''; const arMode = (_t.match(/[\u0600-\u06FF]/g)||[]).length > (_t.match(/[A-Za-z]/g)||[]).length;
  setRecLang(arMode?'ar-SA':'en-US');
  el.querySelectorAll('.txt, .items li').forEach(box => {
    const tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    const nodes = []; while(tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach(node => {
      if(node.parentElement.closest('sup.cite')) return;
      const ar = node.parentElement.closest('.ar');
      if(ar && !arMode){ if(!seenAr.has(ar)){ seenAr.add(ar); VT.words.push({el:ar, n:'', skip:true}); } return; }
      const parts = node.nodeValue.split(/(\s+)/).flatMap(t => /\S/.test(t) ? t.split(/(?<=[—–\-])(?=[^\s—–\-])/) : [t]);
      if(parts.length===1 && !/\S/.test(parts[0])) return;
      const frag = document.createDocumentFragment();
      parts.forEach(tok => {
        if(!/\S/.test(tok)){ frag.appendChild(document.createTextNode(tok)); return; }
        const sp = document.createElement('span'); sp.className='w'; sp.textContent=tok;
        const n = norm(tok); const idx = VT.words.length;
        sp.dataset.w = idx; VT.words.push({el:sp, n, skip:!n});
        frag.appendChild(sp);
      });
      node.parentNode.replaceChild(frag, node);
    });
  });
  VT.words.forEach((w,i)=>{ if(!w.skip) VT.lastNS=i; }); VT.n=VT.words.filter(w=>!w.skip).length;
  renderTrack(false);
}

function renderTrack(scroll){
  if(!VT.words.length) return;
  let last=-1, nxt=-1;
  const D=Math.min(VT.disp+(VT.lead||0), VT.lastNS+1);
  for(let i=0;i<VT.words.length;i++){ if(VT.words[i].skip) continue; if(i<D) last=i; else if(nxt<0) nxt=i; }
  VT.words.forEach((w,i)=>{ const c=w.el.classList; c.toggle('said', i<D); c.toggle('cur', i===last); c.toggle('nxt', i===nxt); });
  if(scroll!==false && last>=0){
    const w=VT.words[last].el, main=fScroller(), mr=main.getBoundingClientRect(), wr=w.getBoundingClientRect(), tb=$('toolbar').offsetHeight;
    if(wr.bottom>mr.bottom-110 || wr.top<mr.top+tb+16) main.scrollBy({top: wr.top-mr.top-tb-mr.height*0.28, behavior:'smooth'});
  }
}

function setVoiceBadge(t){
  let b=$('voiceStatusBadge');
  if(!b){ b=document.createElement('span'); b.id='voiceStatusBadge'; b.className='voice-live-badge'; $('pace').parentNode.appendChild(b); }
  b.textContent=t; b.hidden=false;
}
function showVoiceFeedback(t){ setVoiceBadge(t); setTimeout(()=>{ if(S.voice) setVoiceBadge('🎙️ Listening'); else { const b=$('voiceStatusBadge'); if(b) b.hidden=true; } }, 1400); }

/* Predictive cursor: while you are speaking, move the highlight ahead at your own reading speed
   (max 2 words) so it matches your voice; real recognised words correct it instantly. */
function predTick(){
  if(!S.voice || RD.on || !VT.words.length || !fOn()) return;
  const now=Date.now(), live=now-VT.lastMatch<650;   // only run ahead while your words are really matching the script
  if(live && VT.disp+VT.lead<=VT.lastNS && VT.lead<1 && now-VT.leadT>=1000/VT.rate){ VT.lead++; VT.leadT=now; renderTrack(true); }
  else if(!live && VT.lead>0){ VT.lead=0; renderTrack(false); }
}
function voiceTick(){
  if(!S.voice || RD.on || !S.model || VT.lastNS<0 || !fOn()) return;
  let rem=0; for(let i=VT.disp;i<=VT.lastNS;i++) if(!VT.words[i].skip) rem++;
  const done = rem===0 || (VT.n>=6 && rem<=1 && Date.now()-VT.lastSpeech>450);
  if(done!==VT.done){ VT.done=done; setVoiceBadge(done ? (S.voiceDelay>0 ? '✓ Line done · next after pause' : '✓ Line done · tap Next') : '🎙️ Listening'); }
  if(done && S.voiceDelay>0 && S.pos < S.model.steps.length-1 && Date.now()-VT.lastSpeech >= S.voiceDelay*1000 && Date.now()-lastAdvanceTime > 1500){
    const nxt = S.model.steps[S.pos+1];
    if(nxt.kind === 'pause'){ setVoiceBadge('👂 Listening — tap Next when done'); }   // hands-free stop at questions
    else { lastAdvanceTime = Date.now(); next(); }
  }
}

const VCMDS = [
  [/^(next|next line|go next|move on)$/, () => next()],
  [/^(back|go back|previous)$/, () => prev()],
  [/^skip$/, () => skipCurrent()],
  [/^(read|read this|read step)$/, () => startRead()],
  [/^(got it|correct|good)$/, () => gradeCur('got')],
  [/^(partly|partially)$/, () => gradeCur('partly')],
  [/^(review|revisit)$/, () => gradeCur('review')],
  [/^(pause timer|stop timer)$/, () => pauseTimer()],
  [/^(start timer|resume timer)$/, () => startTimer()],
  [/^(?:go to )?slide (\w+)$/, (m) => { const w=m[1].toLowerCase(); const map={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10}; const n=/^\d+$/.test(w)?+w:(map[w]||0); const sl=S.model.slides[n-1]; if(sl){ go(sl.lines[0].pos); showVoiceFeedback('→ Slide '+n); } }],
  [/^(next|following) slide$/, () => { const cs=S.model.steps[S.pos].slide; const nx=S.model.slides[cs+1]; if(nx){ go(nx.lines[0].pos); showVoiceFeedback('→ Slide '+nx.n); } }],
  [/^(previous|last) slide$/, () => { const cs=S.model.steps[S.pos].slide; const pv=S.model.slides[cs-1]; if(pv){ go(pv.lines[0].pos); showVoiceFeedback('→ Slide '+pv.n); } }]
];

function onVoiceResult(e){
  if(RD.on) return;
  const fin=[], int=[]; let cmdText='';
  for(let i=0;i<e.results.length;i++){
    const r=e.results[i], t=String(r[0].transcript||'');
    const ws=t.split(/[\s\-—–]+/).filter(Boolean);
    if(r.isFinal){ fin.push(...ws); if(i>=e.resultIndex) cmdText=t; } else int.push(...ws);
  }
  VT.all = fin.length + int.length;
  if(cmdText && Date.now()-lastAdvanceTime>1000){
    const c = cmdText.toLowerCase().replace(/[^\p{L}\s]/gu,'').trim();
    const hit = VCMDS.find(x=>x[0].test(c));
    if(hit){ lastAdvanceTime=Date.now(); hit[1](); showVoiceFeedback('✓ '+c); return; }
  }
  if(!VT.words.length) return;
  const H = fin.concat(int).slice(VT.off);
  const finLen = Math.max(0, fin.length - VT.off);
  for(let k=VT.hp; k<finLen; k++){ const r=matchFrom(VT.idx, H[k]); if(r>=0) VT.idx=r; }
  VT.hp = Math.max(VT.hp, finLen);
  let t = VT.idx;
  for(let k=finLen; k<H.length; k++){ const r=matchFrom(t, H[k]); if(r>=0) t=r; }
  if(H.length) VT.lastSpeech = Date.now();
  let nd = Math.max(VT.disp, VT.idx, t);
  if(nd===VT.disp && H.length>=2){            // lost the thread? re-find it from the last two heard words
    const a=norm(H[H.length-2]), b=norm(H[H.length-1]);
    if(a.length>=3 && b.length>=3 && !(STOPW.has(a)&&STOPW.has(b))){
      let seen=0;
      for(let j=VT.disp; j<VT.words.length && seen<40; j++){
        if(VT.words[j].skip) continue; seen++;
        if(similar(VT.words[j].n,a)){ let j2=j+1; while(j2<VT.words.length && VT.words[j2].skip) j2++;
          if(j2<VT.words.length && similar(VT.words[j2].n,b)){ nd=j2+1; VT.idx=Math.max(VT.idx,nd); break; } }
      }
    }
  }
  if(nd!==VT.disp){
    const now=Date.now(), d=nd-VT.disp, dt=(now-VT.advT)/1000;
    if(VT.advT && dt>0.05 && dt<2.5 && d<=6) VT.rate=Math.min(4.8,Math.max(1.6,VT.rate*0.6+(d/dt)*0.4));
    VT.advT=now; VT.lastMatch=now; VT.lead=Math.max(0,VT.lead-d); VT.disp=nd; renderTrack(true);
  }
}

let recLang='en-US';
function setRecLang(l){ if(l===recLang) return; recLang=l; if(speechRec && S.voice){ speechRec.lang=l; try{ speechRec.stop(); }catch(e){} } }
function startVoiceRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    S.voice=false; $('voiceBtn').setAttribute('aria-pressed','false'); document.body.classList.remove('voice-on');
    return;
  }
  try{
    speechRec = new SR();
    speechRec.continuous = true; speechRec.interimResults = true; speechRec.lang = recLang; speechRec.maxAlternatives = 1;
    speechRec.onstart = () => { VT.off=0; VT.hp=0; VT.all=0; };
    speechRec.onresult = onVoiceResult;
    speechRec.onerror = e => {
      if(e.error==='not-allowed' || e.error==='service-not-allowed'){
        S.voice=false; $('voiceBtn').setAttribute('aria-pressed','false'); document.body.classList.remove('voice-on');
        const b=$('voiceStatusBadge'); if(b) b.hidden=true;
        alert('Microphone access is blocked. Allow the microphone for this page and try again.');
      }
    };
    speechRec.onend = () => {
      if(S.voice){ setTimeout(()=>{ if(S.voice && speechRec){ try{ speechRec.start(); }catch(err){} } }, 30); }
      else { const b=$('voiceStatusBadge'); if(b) b.hidden=true; }
    };
    speechRec.start();
    setVoiceBadge('🎙️ Listening');
  }catch(err){ S.voice=false; $('voiceBtn').setAttribute('aria-pressed','false'); document.body.classList.remove('voice-on'); }
}

function stopVoiceRecognition(){
  if(speechRec){ const r=speechRec; speechRec=null; try{ r.stop(); }catch(e){} }
  const b=$('voiceStatusBadge'); if(b) b.hidden=true;
}

/* Pronunciation Audio Engine (Instant Zero-Latency for Arabic & English) */
let cachedVoices = [];
function preloadVoices(){
  if('speechSynthesis' in window){
    cachedVoices = window.speechSynthesis.getVoices();
  }
}
if('speechSynthesis' in window){
  window.speechSynthesis.onvoiceschanged = preloadVoices;
  preloadVoices();
}

function getBestVoice(isAr){
  if(!cachedVoices.length && 'speechSynthesis' in window) cachedVoices = window.speechSynthesis.getVoices();
  if(isAr){
    return cachedVoices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic')) || null;
  }
  return cachedVoices.find(v => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('English')))
      || cachedVoices.find(v => v.lang.startsWith('en'))
      || null;
}

function speakText(text){
  if(!('speechSynthesis' in window) || !text) return;
  stopReading(true);
  const clean = String(text).replace(AR_RE, ' ').replace(/[*_`#]/g, '').replace(/\s+/g,' ').trim();
  if(!clean) return;
  window.speechSynthesis.cancel();
  const ut = new SpeechSynthesisUtterance(clean);
  ut.lang = 'en-US'; ut.rate = S.rate||0.95;
  const v = getBestVoice(false); if(v) ut.voice = v;
  window.speechSynthesis.speak(ut);
}


/* ===== Word-by-word Read Aloud with Pause/Resume/Stop ===== */
const RD = { on:false, paused:false, ut:null, timer:0 };
const READBTN = '<button type="button" class="btn small" data-act="read-step">🔊 Read</button> <button type="button" class="btn small" data-act="read-stop" hidden>⏹ Stop</button>';
function updateTracking(){ document.body.classList.toggle('tracking', !!(S.voice || RD.on)); }
function readSetBtn(){
  const b=document.querySelector('#stage .line.now [data-act="read-step"]'), x=document.querySelector('#stage .line.now [data-act="read-stop"]');
  if(b) b.textContent = !RD.on ? '🔊 Read' : RD.paused ? '▶ Resume' : '⏸ Pause';
  if(x) x.hidden = !RD.on;
  updateTracking();
}
function stopReading(keepHL){
  RD.ut=null; clearInterval(RD.timer);
  if('speechSynthesis' in window){ try{ speechSynthesis.cancel(); }catch(e){} }
  RD.on=false; RD.paused=false;
  if(!S.voice && !keepHL){ VT.words.forEach(w=>w.el.classList.remove('said','cur','nxt')); VT.disp=0; }
  readSetBtn();
}
function startRead(){
  if(!('speechSynthesis' in window) || !S.model) return;
  const st=S.model.steps[S.pos];
  stopReading(true);
  if(st.kind==='pause'){ speakText(st.label||st.text); return; }
  if(!document.querySelector('#stage .line.now .w')){ VT.pos=-1; buildTrack(); }
  VT.disp=0; VT.idx=0; VT.off=VT.all;
  const map=[]; let txt='';
  VT.words.forEach((w,i)=>{ if(w.skip) return; map.push([txt.length,i]); txt+=w.el.textContent.replace(/[*_`#]/g,'')+' '; });
  if(!map.length) return;
  const ut=new SpeechSynthesisUtterance(txt.trim()); ut.lang='en-US'; ut.rate=S.rate||0.95;
  const v=getBestVoice(false); if(v) ut.voice=v;
  let got=false; const t0=Date.now(); let k=0;
  ut.onboundary=e=>{
    if(e.name && e.name!=='word') return; got=true;
    let j=-1; for(let q=0;q<map.length;q++){ if(map[q][0]<=e.charIndex) j=q; else break; }
    if(j>=0){ VT.disp=map[j][1]+1; renderTrack(true); }
  };
  ut.onend=()=>{ if(RD.ut===ut) readDone(); };
  ut.onerror=()=>{ if(RD.ut===ut) stopReading(true); };
  RD.ut=ut; RD.on=true; RD.paused=false;
  RD.timer=setInterval(()=>{ if(got){ clearInterval(RD.timer); return; } if(RD.paused||Date.now()-t0<700) return; k=Math.min(map.length-1,k+1); VT.disp=map[k][1]+1; renderTrack(true); },380);
  speechSynthesis.speak(ut); readSetBtn();
}
function toggleRead(){
  if(!RD.on){ startRead(); return; }
  if(RD.paused){ speechSynthesis.resume(); RD.paused=false; } else { speechSynthesis.pause(); RD.paused=true; }
  readSetBtn();
}
function readDone(){
  stopReading(true);
  const n=S.model.steps[S.pos+1];
  if(S.readAuto && n && n.kind==='speak') setTimeout(()=>{ next(); startRead(); },300);
}

/* Navigation */
function go(n){
  S.savedOnce = false;
  { const pr = S.model.steps[S.pos]; if(pr && pr.kind === 'pause') S.talkSec = (S.talkSec||0) + (Date.now() - S.waitStart)/1000; }
  stopReading();
  const last = S.model.steps.length - 1;
  n = Math.max(0, Math.min(last, n));
  const curSlide = S.model.steps[n].slide;
  const slideChanged = curSlide !== S.model.steps[S.pos].slide;

  if(S.rehearsing && slideChanged){
    const prevSlide = S.model.steps[S.pos].slide;
    const dur = Math.round(elapsedMs() / 1000);
    S.rehearsalTimes[prevSlide] = (S.rehearsalTimes[prevSlide] || 0) + dur;
  }

  if(slideChanged){ S.slideSec = S.slideSec || {}; const ps = S.model.steps[S.pos].slide; S.slideSec[ps] = (S.slideSec[ps]||0) + (elapsedMs() - (S.slideStart||0))/1000; S.slideStart = elapsedMs(); }
  S.pos = n;
  S.finished = false;
  S.waitStart = Date.now();
  voiceReset();
  
  
  renderStrip();
  renderFollow(slideChanged);
  if(slideChanged && !S.full){ const st=$('stage'); st.classList.remove('slide-in'); void st.offsetWidth; st.classList.add('slide-in'); }
  renderFoot();
  saveState();
  tick();
  broadcastSlide(curSlide);
}

function next(){ if(S.pos >= S.model.steps.length - 1) finish(); else go(S.pos + 1); }
function prev(){ go(S.pos - 1); }
function skipCurrent(){
  let target = S.pos + 1;
  while(target < S.model.steps.length && S.model.steps[target].optional) target++;
  go(target);
}

function confetti(){ const e=['🎉','⭐','✨','🎊','🌟']; for(let i=0;i<36;i++){ const d=document.createElement('span'); d.className='conf'; d.textContent=e[i%5]; d.style.left=Math.random()*100+'vw'; d.style.animationDelay=Math.random()*.8+'s'; document.body.appendChild(d); setTimeout(()=>d.remove(),3500); } }
function finish(){
  pauseTimer();
  if(!S.savedOnce){ S.savedOnce = true; saveToHistory(); toast('🎉 Lesson finished & saved to history'); } confetti();
  S.finished = true;
  setView('notes'); confetti();
}

function setView(v){
  S.view = v;
  for(const k of ['follow', 'script', 'notes', 'reports', 'history', 'stage', 'setup']){
    const el = $('view-' + k);
    if(el) el.hidden = k !== v;
    const t = $('tab-' + k);
    if(t){ t.setAttribute('aria-selected', String(k === v)); t.tabIndex = k === v ? 0 : -1; }
  }
  $('controls').hidden = v !== 'follow';
  if(v === 'follow') renderFollow(false);
  if(v === 'script') renderScript();
  if(v === 'notes') renderNotes();
  if(v === 'history') renderHistory();
  if(v === 'reports') rpInit();
  if(v === 'stage'){ const f = $('stageFrame'); if(f && !f.getAttribute('src')) f.src = 'stage.html'; }
  if(v === 'setup') $('scriptInput').value = S.script;
  $('main').scrollTop = 0;
  if(v === 'follow') scrollToCurrent(false);
}

function renderHead(){
  const m = S.model, t = m.title;
  if(S.focus){
    const sl = m.slides[m.steps[S.pos].slide];
    $('kicker').textContent = 'Slide ' + sl.n + ' of ' + m.slides.length;
    $('lessonName').textContent = sl.title;
  } else {
    $('kicker').textContent = t.kicker || 'Lesson';
    $('lessonName').textContent = t.name || m.slides[0].title;
  }
}
function renderTop(){
  renderHead();
  $('planned').textContent = plannedMin() ? '/ ' + mmss(plannedMin() * 60) : '';
  renderClockBtn();
}
function renderStrip(){
  const m = S.model, el = $('strip');
  $('progBar').style.width = ((S.pos + 1) / m.steps.length * 100) + '%';
  const curSlide = m.steps[S.pos].slide;
  el.innerHTML = m.slides.map((s, i) => {
    const cls = i < curSlide ? 'done' : i === curSlide ? 'cur' : '';
    const mins = s.start && s.end ? ', min ' + s.start + '–' + s.end : '';
    return '<button type="button" class="seg ' + cls + '" style="--w:' + s.weight + '" data-slide="' + i + '" aria-label="Slide ' + s.n + ': ' + esc(s.title) + mins + '"' + (i === curSlide ? ' aria-current="step"' : '') + '>' + s.n + '</button>';
  }).join('') + '<div class="cursor" id="cursor" aria-hidden="true"></div>';
}

function lineHTML(l, state, after){
  const pace = paceInfo();
  const isBehind = pace.c === 'bad' || pace.c === 'warn';
  const showSkip = l.optional && isBehind && state === 'now';
  const cls = 'line k-' + l.kind + ' ' + state + (after ? ' after' : '') + (l.optional && isBehind ? ' skippable' : '');
  const badge = '<span class="badge">' + esc(l.tag) + '</span>';
  const optBadge = l.optional ? '<span class="opt-tag">Optional</span>' : '';
  const attrs = ' data-pos="' + l.pos + '"' + (state === 'now' ? ' aria-current="step"' : '') + dirA(l);

  if(l.kind === 'pause'){
    const label = esc(l.label || 'Wait for the answer');
    if(state === 'now'){
      const curAssessment = S.assess[l.qid] || '';
      return '<article class="' + cls + '"' + attrs + '><div class="head"><div>' + badge + ' ' + READBTN + '</div><span class="wait"><span id="waitClock">0:00</span><span class="lbl">listening</span></span></div>'
        + '<p class="txt">' + label + '</p>'
        + (l.expect ? '<div class="expect"><span class="lbl">Likely answer</span><p>' + fmt(l.expect) + '</p></div>' : '')
        + '<div class="qa-chips">'
        + '<button type="button" class="btn-q" data-act="grade" data-qid="' + l.qid + '" data-status="got" aria-pressed="' + (curAssessment==='got') + '">✅ Got it <span class="hint">(1)</span></button>'
        + '<button type="button" class="btn-q" data-act="grade" data-qid="' + l.qid + '" data-status="partly" aria-pressed="' + (curAssessment==='partly') + '">🟡 Partly <span class="hint">(2)</span></button>'
        + '<button type="button" class="btn-q" data-act="grade" data-qid="' + l.qid + '" data-status="review" aria-pressed="' + (curAssessment==='review') + '">🔁 Review <span class="hint">(3)</span></button>'
        + (S.presenter ? '' : '</div>')
        + (S.presenter ? '' : '<button type="button" class="btn small" data-act="dictate" style="margin-top:8px">🎤 Dictate answer</button>' + '<input id="ans" class="field" type="text" autocomplete="off" aria-label="Student answer" placeholder="Note ' + esc(S.model.student) + '&#39;s answer..." value="' + esc(S.answers[l.qid]||'') + '">')
        + (showSkip ? '<div class="skip-action"><button type="button" class="btn small" data-act="skip">⚡ Skip this optional step (Save time)</button></div>' : '')
        + '</article>';
    }
    return '<article class="' + cls + '"' + attrs + '>' + badge + '<p class="txt">' + label + '</p></article>';
  }

  const items = l.items.length ? '<ol class="items">' + l.items.map(i => '<li>' + fmt(i) + '</li>').join('') + '</ol>' : '';
  return '<article class="' + cls + '"' + attrs + '><div class="line-top"><div>' + badge + ' ' + optBadge + '</div>' + (state==='now' ? '' + READBTN + '' : '') + '</div><p class="txt">' + fmt(l.text) + '</p>' + items 
    + (showSkip ? '<div class="skip-action"><button type="button" class="btn small" data-act="skip">⚡ Skip optional line</button></div>' : '')
    + '</article>';
}

function flHead(s){
  if(S.div === 'none') return '<div class="fl-gap"></div>';
  const t = s.start && s.end ? 'min ' + s.start + '–' + s.end : '';
  if(S.div === 'chapter') return '<div class="fl-head"><b>Slide ' + s.n + ': ' + esc(s.title) + '</b><span>' + t + '</span></div>';
  return '<div class="fl-head mini"><b>' + s.n + ' · ' + esc(s.title) + '</b></div>';
}
function renderFollow(){
  const m = S.model, cur = m.steps[S.pos], sl = m.slides[cur.slide];
  renderHead();
  const win = sl.start && sl.end ? ' · min ' + sl.start + '–' + sl.end : '';
  
  // RESTORE ALL ORIGINAL TOOLBAR BUTTONS: A-, A+, Theme, Wide, Fullscreen, Rephrase
  $('toolbar').innerHTML = '<div class="ttl"><div class="eyebrow">' + (S.full ? 'Full script · whole lesson on one page' : 'Slide ' + sl.n + '/' + m.slides.length + win) + '</div><div class="name">' + esc(sl.title) + '</div></div>'
    + '<div class="tools"><span class="count">' + (S.pos + 1) + ' / ' + m.steps.length + '</span>'
    + '<button class="btn small" type="button" id="undoBtn" title="Undo last text change (Ctrl+Z)" aria-label="Undo"' + (S.undoStack.length ? '' : ' disabled') + '>↩</button><button class="btn small" type="button" id="redoBtn" title="Redo (Ctrl+Shift+Z)" aria-label="Redo"' + (S.redoStack.length ? '' : ' disabled') + '>↪</button>'
    + '<button class="btn small" type="button" id="fsDown" aria-label="Smaller text">A−</button><button class="btn small" type="button" id="fsUp" aria-label="Larger text">A+</button>'
    + '<button class="btn small" type="button" id="readBtn" title="Read aloud / pause (R)">🔊</button><button class="btn small primary" type="button" id="fullTxtBtn" title="Switch Full page / Slides (W)">' + (S.full ? '📜 Full page' : '🗂 Slides') + '</button><button class="btn small" type="button" id="toolsMore" aria-label="More tools">⋯</button><span class="tools-extra' + (window.__to ? ' open' : '') + '"><button class="btn small" type="button" id="thmBtn" aria-label="Change theme" title="Cycle theme">🎨</button>'
    + '<button class="btn small" type="button" id="wideBtn" aria-label="Wide mode" title="Full wide mode" aria-pressed="' + S.wide + '">↔</button>'
    + '<button class="btn small" type="button" id="fullBtn" aria-label="Full screen" title="Full screen">⛶</button>'
    + '<button class="btn small" type="button" id="mirBtn" title="Mirror text (for glass teleprompter)">🪞</button><button class="btn small" type="button" id="editBtn" title="Edit this line">✏️</button>'
    + '</span><button class="btn small" type="button" id="rpBtn" aria-label="Rephrase helper" title="Rephrase selected text or this step">✨</button></div>';

  const lh = l => lineHTML(l, l.pos < S.pos ? 'done' : l.pos === S.pos ? 'now' : 'next', l.pos === S.pos + 1);
  $('stage').innerHTML = S.full
    ? m.slides.map(s => flHead(s) + s.lines.map(lh).join('')).join('')
    : sl.lines.map(lh).join('');
  
  const a = $('ans');
  if(a) a.addEventListener('input', () => { S.answers[cur.qid] = a.value; saveState(); });
  if(S.voice) buildTrack();
  readSetBtn();
  scrollToCurrent(true);
}

function scrollToCurrent(smooth){
  const el = document.querySelector('#stage .line.now');
  if(!el) return;
  const place = (behavior) => {
    const main = fScroller(), tb = $('toolbar').offsetHeight;
    const mr = main.getBoundingClientRect(), er = el.getBoundingClientRect();
    const elTop = er.top - mr.top + main.scrollTop;
    const room = main.clientHeight - tb;
    const lead = Math.min(room * 0.12, 80);
    let target = elTop - tb - lead;
    if(er.height > room - 24) target = elTop - tb - 8;
    main.scrollTo({ top: Math.max(0, target), behavior });
  };
  requestAnimationFrame(() => {
    place(smooth ? 'smooth' : 'instant');
  });
}

function renderFoot(){
  const m = S.model, last = m.steps.length - 1;
  $('btnPrev').disabled = S.pos === 0;
  if(S.pos >= last){
    $('goLabel').textContent = 'Finish lesson';
    $('goSub').textContent = 'Open notes & summary report';
  } else {
    $('goLabel').textContent = 'Next';
    const n = m.steps[S.pos + 1];
    $('goSub').textContent = 'then ' + n.tag.toLowerCase() + (n.slide !== m.steps[S.pos].slide ? ' · new slide' : '');
  }
}

function renderScript(){
  const m = S.model, onlyAsk = S.filter === 'ask', onlySkip = S.filter === 'skippable';
  $('chipAsk').textContent = 'Questions (' + m.asks.length + ')';
  document.querySelectorAll('#view-script .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === S.filter)));
  let html = '';
  m.slides.forEach(s => {
    const lines = s.lines.filter(l => {
      if(S.q && !(l.text + ' ' + l.items.join(' ')).toLowerCase().includes(S.q)) return false;
      if(onlyAsk) return l.kind === 'ask';
      if(onlySkip) return l.optional;
      return true;
    });
    if(!lines.length) return;
    html += '<div class="sl-head"><h2>' + s.n + '. ' + esc(s.title) + '</h2><span>' + (s.start && s.end ? 'min ' + s.start + '–' + s.end : '') + '</span></div>';
    html += lines.map(l => {
      const st = l.pos === S.pos ? ' cur' : l.pos < S.pos ? ' past' : '';
      const body = l.kind === 'pause' ? esc(l.label || 'Wait for answer') : fmt(l.text);
      return '<div class="row k-' + l.kind + st + '"' + dirA(l) + ' data-pos="' + l.pos + '" role="button" tabindex="0"><span class="badge">' + esc(l.tag) + '</span><div><p class="txt">' + body + '</p></div></div>';
    }).join('');
  });
  $('scriptList').innerHTML = html || '<div class="empty">No matching lines.</div>';
}

function buildSummary(){
  const m = S.model, e = elapsedMs() / 1000, cur = m.steps[S.pos];
  const out = [];
  out.push('📚 ' + (m.title.kicker ? m.title.kicker + ' — ' : '') + (m.title.name || m.slides[0].title));
  out.push('🗓️ Date: ' + new Date().toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' }));
  out.push('⏱️ Duration: ' + mmss(e) + (plannedMin() ? ' of ' + plannedMin() + ' planned minutes' : ''));
  out.push('🗨️ Student speaking time: ' + mmss(S.talkSec||0));
  out.push('📍 Covered up to: Slide ' + m.slides[cur.slide].n + ' (' + m.slides[cur.slide].title + ')');
  
  const gotList = [], partlyList = [], reviewList = [];
  m.asks.forEach(a => {
    const status = S.assess[a.id] || '';
    const qClean = cleanMd(a.text).replace(/\s?\[\d+(?:\s*,\s*\d+)*\]/g,'');
    if(status === 'got') gotList.push('• ' + qClean);
    else if(status === 'partly') partlyList.push('• ' + qClean);
    else if(status === 'review') reviewList.push('• ' + qClean);
  });

  out.push('');
  out.push('--- Student Mastery ---');
  if(gotList.length){ out.push('✅ Mastered concepts:'); out.push(gotList.join('\n')); }
  if(partlyList.length){ out.push('🟡 Developing (partially understood):'); out.push(partlyList.join('\n')); }
  if(reviewList.length){ out.push('🔁 Needs revisit next session:'); out.push(reviewList.join('\n')); }
  if(!gotList.length && !partlyList.length && !reviewList.length) out.push('(No quick assessment grades marked)');

  if(m.asks.length){
    out.push('');
    out.push('--- Detailed Q&A ---');
    m.asks.forEach((a, i) => {
      const ans = (S.answers[a.id] || '').trim();
      out.push('Q' + (i+1) + ': ' + cleanMd(a.text));
      out.push(m.student + ': ' + (ans || '(no typed answer)'));
    });
  }

  out.push(''); out.push('--- Time per slide ---');
  { const st=slideTimes(), mx=Math.max(1,...st.map(x=>x[1])); st.forEach(([sl,t])=>out.push('Slide '+sl.n+' '+'█'.repeat(Math.round(t/mx*10)||0)+' '+mmss(t))); }
  if(S.notes.trim()){
    out.push('');
    out.push('--- Teacher Notes ---');
    out.push(S.notes.trim());
  }
  return out.join('\n');
}

function renderNotes(){
  const m = S.model;
  const fb = $('finishBanner');
  if(S.finished){
    fb.hidden = false;
    fb.textContent = '🎉 Lesson finished in ' + mmss(elapsedMs() / 1000) + (plannedMin() ? ' (planned ' + plannedMin() + ' min).' : '.');
  } else fb.hidden = true;

  { const c={got:0,partly:0,review:0}; m.asks.forEach(a=>{ if(c[S.assess[a.id]]!==undefined) c[S.assess[a.id]]++; });
    const pct=Math.round((S.pos+1)/m.steps.length*100);
    $('stats').innerHTML=[[mmss(elapsedMs()/1000),'Time'],[pct+'%','Covered'],[c.got,'✅ Got it'],[c.partly,'🟡 Partly'],[c.review,'🔁 Review']].map(x=>'<div class="stat"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join(''); }
  $('notesArea').value = S.notes;
  $('qaHead').textContent = m.student + "'s Answers & Assessment";
  $('qaList').innerHTML = m.asks.length ? m.asks.map((a, i) => {
    const curA = S.assess[a.id] || '';
    return '<div class="hist-item"><div class="h-top"><span>Q' + (i+1) + ': ' + fmt(a.text) + '</span></div>'
      + '<div class="qa-chips" style="margin-block:6px">'
      + '<button type="button" class="btn-q" data-act="grade" data-qid="' + a.id + '" data-status="got" aria-pressed="' + (curA==='got') + '">✅ Got it <span class="hint">(1)</span></button>'
      + '<button type="button" class="btn-q" data-act="grade" data-qid="' + a.id + '" data-status="partly" aria-pressed="' + (curA==='partly') + '">🟡 Partly <span class="hint">(2)</span></button>'
      + '<button type="button" class="btn-q" data-act="grade" data-qid="' + a.id + '" data-status="review" aria-pressed="' + (curA==='review') + '">🔁 Review <span class="hint">(3)</span></button>'
      + '</div>'
      + '<textarea class="field" data-qid="' + a.id + '" placeholder="What did ' + esc(m.student) + ' say?">' + esc(S.answers[a.id]||'') + '</textarea>'
      + '</div>';
  }).join('') : '<p class="help">No questions in this script.</p>';

  $('summary').value = buildSummary();
}

function saveToHistory(){
  if(!S.model) return;
  const reviewQuestions = S.model.asks.filter(a => S.assess[a.id] === 'review' || S.assess[a.id] === 'partly').map(a => cleanMd(a.text).slice(0, 50) + '...').join('; ');
  const entry = {
    date: new Date().toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' }),
    title: S.model.title.name || S.model.slides[0].title,
    time: mmss(elapsedMs() / 1000),
    reviewTopics: reviewQuestions || 'All key concepts mastered',
    sec: Math.round(elapsedMs() / 1000),
    wc: S.model.steps.reduce((a,l) => a + (l.kind==='pause' ? 25 : (l.text + ' ' + l.items.join(' ')).split(/\s+/).filter(Boolean).length), 0)
  };
  S.history.unshift(entry);
  if(S.history.length > 50) S.history.pop();
  lsSet('lp.history', JSON.stringify(S.history));
  $('copyMsg').textContent = 'Saved to history!';
  setTimeout(() => $('copyMsg').textContent='', 2500);
  checkLastTimeBanner();
}

function renderHistory(){
  const hl = $('historyList');
  if(!S.history || !S.history.length){ hl.innerHTML = '<div class="empty">No past lesson sessions recorded yet.</div>'; return; }
  hl.innerHTML = S.history.map(h => '<div class="hist-item"><div class="h-top"><span>' + esc(h.title) + '</span><span>' + esc(h.date) + '</span></div>'
    + '<div class="h-sub">Duration: ' + esc(h.time) + ' · Focus for review: <em>' + esc(h.reviewTopics) + '</em></div></div>').join('');
}

async function generateAutoQuiz(){
  const qb = $('quizBox');
  qb.hidden = false;
  qb.innerHTML = '<em>Generating 3 recap questions with AI...</em>';
  try {
    const prompt = 'Based on this lesson script: "' + S.script.slice(0, 1500) + '", create 3 fun, direct recap review questions suitable for ' + S.ai.age + '. Format: 1., 2., 3.';
    const res = await callAI(prompt);
    qb.innerHTML = '<strong>🎯 Quick Recap Quiz for ' + esc(S.model.student) + ':</strong><pre style="margin:6px 0 0;white-space:pre-wrap;font-family:inherit">' + esc(res) + '</pre>';
  } catch(err){
    qb.innerHTML = '<span style="color:var(--bad)">Could not generate quiz: ' + esc(err.message) + '</span>';
  }
}

/* 12 Original Themes & Fonts */
const THEMES = [
  ['auto','Auto'],['paper','Paper (eye comfort)'],['night','Night (warm)'],['midnight','Midnight blue'],['graphite','Graphite'],
  ['forest','Forest'],['reddim','Red night'],['dark','Dark'],['sepia','Sepia'],
  ['gray','Soft gray'],['light','Light'],['blue','Soft blue'],['contrast','High contrast']
];
const ARFONTS = {
  naskh:"'Noto Naskh Arabic','Amiri','Traditional Arabic',serif",
  amiri:"'Amiri','Noto Naskh Arabic','Traditional Arabic',serif",
  schei:"'Scheherazade New','Amiri','Noto Naskh Arabic',serif",
  cairo:"'Cairo','Noto Naskh Arabic',sans-serif"
};
const FONTS = {
  lora:"'Lora',Georgia,'Noto Naskh Arabic',serif",
  merri:"'Merriweather',Georgia,'Noto Naskh Arabic',serif",
  literata:"'Literata',Georgia,'Noto Naskh Arabic',serif",
  lexend:"'Lexend','Atkinson Hyperlegible',system-ui,sans-serif",
  nunito:"'Nunito','Atkinson Hyperlegible',system-ui,sans-serif",
  atk:"'Atkinson Hyperlegible',system-ui,-apple-system,'Segoe UI',sans-serif",
  serif:"Georgia,'Noto Naskh Arabic','Times New Roman',serif",
  system:"system-ui,-apple-system,'Segoe UI',sans-serif"
};

function applyLook(){
  const r = document.documentElement;
  if(S.theme === 'auto') r.removeAttribute('data-theme');
  else r.setAttribute('data-theme', S.theme);
  
  r.style.setProperty('--fs', S.fs);
  r.style.setProperty('--ar-fs', S.arFs);
  r.style.setProperty('--lh', S.lh);
  r.style.setProperty('--font-body', FONTS[S.font] || FONTS.lora); r.style.setProperty('--font-ar', ARFONTS[S.arFont] || ARFONTS.naskh);
  
  document.body.classList.toggle('focus', S.focus);
  document.body.classList.toggle('locked', S.locked);
  document.body.classList.toggle('wide', S.wide);
  document.body.classList.toggle('camera-mode', S.cam); document.body.classList.toggle('fulltext', S.full); document.body.classList.toggle('nodiv', S.full && S.div === 'none');
  
  $('focusBtn').setAttribute('aria-pressed', String(S.focus));
  $('lockBtn').setAttribute('aria-pressed', String(S.locked));
  $('lockBtn').textContent = S.locked ? '🔒 Unlock taps' : '🔓 Lock taps';
  $('camBtn').setAttribute('aria-pressed', String(S.cam));
  $('voiceBtn').setAttribute('aria-pressed', String(S.voice));
  
  document.querySelectorAll('#themeChips .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.theme === S.theme)));
  $('optWide').checked = S.wide; $('divSel').value = S.div;
  $('optCam').checked = S.cam;
  $('fsRange').value = S.fs;
  $('arFsRange').value = S.arFs;
  $('lhRange').value = S.lh;
  r.style.setProperty('--fw', S.fw || 400); r.style.setProperty('--fwb', Math.min(900, (S.fw || 400) + 200));
  if(S.tc) r.style.setProperty('--txt-c', S.tc); else r.style.removeProperty('--txt-c');
  document.body.classList.toggle('has-tc', !!S.tc); document.body.classList.toggle('has-fw', S.fw > 0);
  $('stage').style.filter = S.br !== 1 ? 'brightness(' + S.br + ')' : '';
  $('brRange').value = S.br; $('fwRange').value = S.fw || 400; if(S.tc) $('tcInput').value = S.tc;
  document.querySelectorAll('#tcChips .swatch').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.c || '') === (S.tc || ''))));
  $('fontSel').value = S.font; $('arFontSel').value = S.arFont;
  $('optCites').checked = S.cites;
  $('optFloatRP').checked = S.floatRP;
  $('optAuto').checked = S.autoStart;
  $('optWake').checked = S.wake;
  $('voicePace').value = String(S.voiceDelay); $('optReadAuto').checked = S.readAuto; $('readRate').value = S.rate;
}

function toggleFullText(){ S.full = !S.full; applyLook(); savePrefs(); if(S.model){ renderFollow(); toast(S.full ? '📜 Full text mode' : '🗂 Card mode'); } }
function toggleFull(){
  try {
    if(document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }catch(e){}
}

function initSettings(){
  $('themeChips').innerHTML = THEMES.map(t => '<button type="button" class="chip" data-theme="' + t[0] + '" aria-pressed="false">' + t[1] + '</button>').join('');
  $('themeChips').addEventListener('click', e => {
    const b = e.target.closest('[data-theme]');
    if(!b) return;
    S.theme = b.dataset.theme; applyLook(); savePrefs();
  });
  
  $('divSel').addEventListener('change', e => { S.div = e.target.value; savePrefs(); if(S.model) renderFollow(); });
  $('optWide').addEventListener('change', e => { S.wide = e.target.checked; applyLook(); savePrefs(); renderFollow(); });
  $('optCam').addEventListener('change', e => { S.cam = e.target.checked; applyLook(); savePrefs(); });
  $('fsRange').addEventListener('input', e => { S.fs = +e.target.value; applyLook(); savePrefs(); });
  $('arFsRange').addEventListener('input', e => { S.arFs = +e.target.value; applyLook(); savePrefs(); });
  $('lhRange').addEventListener('input', e => { S.lh = +e.target.value; applyLook(); savePrefs(); });
  const QC = [['','Theme','transparent'],['#FFFFFF','White','#FFFFFF'],['#FFF3C4','Cream','#FFF3C4'],['#FFE066','Yellow','#FFE066'],['#9BE7C4','Mint','#9BE7C4'],['#9CC9FF','Sky','#9CC9FF'],['#FFB4A2','Coral','#FFB4A2'],['#111111','Black','#111111']];
  $('tcChips').innerHTML = QC.map(c => '<button type="button" class="swatch" data-c="' + c[0] + '" title="' + c[1] + '" aria-label="' + c[1] + '" aria-pressed="false" style="background:' + (c[0] ? c[2] : 'repeating-linear-gradient(45deg,var(--surface-2) 0 6px,var(--line) 6px 12px)') + '"></button>').join('');
  $('tcChips').addEventListener('click', e => { const b = e.target.closest('.swatch'); if(!b) return; S.tc = b.dataset.c; applyLook(); savePrefs(); });
  $('tcInput').addEventListener('input', e => { S.tc = e.target.value; applyLook(); savePrefs(); });
  $('brRange').addEventListener('input', e => { S.br = +e.target.value; applyLook(); savePrefs(); });
  $('fwRange').addEventListener('input', e => { S.fw = +e.target.value; applyLook(); savePrefs(); });
  $('resetLook').addEventListener('click', () => { S.tc = ''; S.br = 1; S.fw = 0; applyLook(); savePrefs(); toast('Text look reset'); });
  $('moreMenu').addEventListener('click', e => { const b = e.target.closest('[data-look]'); if(!b) return; const k = b.dataset.look;
    if(k === 'br+') S.br = Math.min(1.5, +(S.br + 0.1).toFixed(2)); else if(k === 'br-') S.br = Math.max(0.5, +(S.br - 0.1).toFixed(2));
    else if(k === 'fw+') S.fw = Math.min(800, (S.fw || 400) + 100); else if(k === 'fw-') S.fw = (S.fw || 400) <= 400 ? 0 : (S.fw || 400) - 100;
    applyLook(); savePrefs(); toast(k.startsWith('br') ? 'Brightness ' + Math.round(S.br * 100) + '%' : 'Boldness ' + (S.fw || 'normal')); });
  $('fontSel').addEventListener('change', e => { S.font = e.target.value; applyLook(); savePrefs(); });
  $('arFontSel').addEventListener('change', e => { S.arFont = e.target.value; applyLook(); savePrefs(); });
  $('optCites').addEventListener('change', e => { S.cites = e.target.checked; savePrefs(); renderFollow(); });
  $('optFloatRP').addEventListener('change', e => { S.floatRP = e.target.checked; savePrefs(); if(!S.floatRP) $('selChip').hidden = true; });
  $('optAuto').addEventListener('change', e => { S.autoStart = e.target.checked; savePrefs(); });
  $('voicePace').addEventListener('change', e => { S.voiceDelay = +e.target.value; savePrefs(); });
  $('optReadAuto').addEventListener('change', e => { S.readAuto = e.target.checked; savePrefs(); });
  $('readRate').addEventListener('input', e => { S.rate = +e.target.value; savePrefs(); });
  $('optWake').addEventListener('change', e => { S.wake = e.target.checked; savePrefs(); setWake(S.wake); });

  const aiObj = JSON.parse(lsGet('lp.ai') || 'null');
  if(aiObj) Object.assign(S.ai, aiObj);
  $('aiProv').value = S.ai.provider;
  $('aiKey').value = S.ai.key;
  $('aiModel').value = S.ai.model;
  $('aiAge').value = S.ai.age || '11-year-old student';

  $('aiProv').addEventListener('change', e => { S.ai.provider = e.target.value; saveAI(); });
  $('aiKey').addEventListener('input', e => { S.ai.key = e.target.value.trim(); saveAI(); });
  $('aiModel').addEventListener('input', e => { S.ai.model = e.target.value.trim(); saveAI(); });
  $('aiAge').addEventListener('input', e => { S.ai.age = e.target.value.trim(); saveAI(); });
  $('stuName').value = S.name || '';
  $('stuName').addEventListener('input', e => { S.name = e.target.value.trim(); savePrefs(); if(S.model){ S.model.student = S.name || 'Student'; } });
  applyLook();
}
function saveAI(){ lsSet('lp.ai', JSON.stringify(S.ai)); }

/* Backup & Restore */
function exportBackupJSON(){
  const data = {
    version: 2,
    date: new Date().toISOString(),
    prefs: S,
    history: S.history,
    reports: rpAll(),
    script: S.script,
    answers: S.answers,
    assess: S.assess,
    notes: S.notes
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Lesson_Prompter_Backup_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importBackupJSON(file){
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if(data.history) { S.history = data.history; lsSet('lp.history', JSON.stringify(S.history)); }
      if(Array.isArray(data.reports)) rpMerge(data.reports);
      if(data.script) applyScript(data.script);
      if(data.answers) S.answers = data.answers;
      if(data.assess) S.assess = data.assess;
      if(data.notes) S.notes = data.notes;
      saveState();
      renderAll();
      alert('Backup restored successfully!');
    } catch(err){ alert('Invalid backup file.'); }
  };
  reader.readAsText(file);
}


