/* ===== First-run welcome guide (EN / AR) ===== */
const GUIDE={en:{t:'Welcome 👋',st:[
['1. Load your lesson','Setup → paste a script (for example from NotebookLM) or open a .txt / .md / .docx file. Tag lines with [SPEAK], [ASK] or [PAUSE]. Mark extra lines [OPTIONAL] so Catch-Up can skip them when you run late. Save it in 📚 My saved scripts to reuse it.'],
['2. Teach with Follow','Follow tab: tap Next to move through the lesson. Turn on Voice follow to highlight each word you say, or use read aloud, the camera column, mirror text and rehearsal mode. The timer is manual — press Start when you want it.'],
['3. Show pages on Stage','Stage tab: open PDFs, images, web links, videos or a blank board, then draw and highlight on them. Student screen opens a synced window you can share on Zoom or Meet. Pin the tabs you use every lesson and they come back next time.'],
['4. Split view','Split puts two tabs side by side — for example Follow and Stage — each with its own tab bar, so you can teach and present at once.'],
['5. Lesson reports','Reports tab: fill the short form after each lesson, then copy, send on WhatsApp, print or save as a picture. Arabic and English, with templates and fonts.'],
['6. Monthly record and certificates','Reports → Monthly: upload your own Word form (.docx) once. The app fills it with your month’s lessons and keeps your exact layout. Reports → Certificate: choose a design, language and award, then print or save a picture.'],
['7. Notes and History','Notes keeps private reminders for next time. History shows past lessons, pacing and how well each part was understood.'],
['8. Make it yours','Change the theme 🎨, text size, fonts and the interface language (English / العربية). The app opens in full wide mode to use your whole screen — turn it off in Setup → Wide mode if you prefer a narrower page.'],
['9. Your data','Everything stays on this device. Export a backup from Setup now and then. Cloud sync (free Supabase) and AI features are optional; your keys are stored only in your browser.']],btn:'Get started',priv:'Privacy: no account, no tracking. Fonts load from Google Fonts; AI requests go straight from your browser to the provider you choose.'},
ar:{t:'مرحبًا بك 👋',st:[
['١. حمّل درسك','من الإعدادات الصق نصًّا (مثلًا من NotebookLM) أو افتح ملف .txt / .md / .docx. ضع الوسوم [SPEAK] أو [ASK] أو [PAUSE] في الأسطر. علّم الأسطر الإضافية بـ [OPTIONAL] ليتخطاها «اللحاق» عند التأخر. احفظه في «📚 نصوصي المحفوظة» لتعيد استخدامه.'],
['٢. درّس من تبويب Follow','اضغط Next للتنقل بين أجزاء الدرس. فعّل تتبّع الصوت ليميّز كل كلمة تنطقها، أو استخدم القراءة بصوت عالٍ وعمود الكاميرا والنص المعكوس ووضع التدريب. المؤقّت يدوي — اضغط Start عندما تريد.'],
['٣. اعرض الصفحات في Stage','في تبويب Stage افتح ملفات PDF أو صورًا أو روابط ويب أو فيديو أو لوحة بيضاء، ثم ارسم وظلّل عليها. زر «شاشة الطالب» يفتح نافذة متزامنة يمكنك مشاركتها في Zoom أو Meet. ثبّت التبويبات التي تستخدمها كل درس لتعود في المرة القادمة.'],
['٤. العرض المقسّم','«Split» يضع تبويبين جنبًا إلى جنب — مثل Follow وStage — ولكل منهما شريط تبويبات خاص، لتدرّس وتعرض في وقت واحد.'],
['٥. تقارير الدروس','في تبويب Reports املأ النموذج القصير بعد كل درس، ثم انسخ التقرير أو أرسله عبر واتساب أو اطبعه أو احفظه كصورة. عربي وإنجليزي مع قوالب وخطوط.'],
['٦. السجل الشهري والشهادات','Reports ← Monthly: ارفع نموذج Word الخاص بك (.docx) مرة واحدة، وسيملؤه التطبيق بدروس الشهر مع الحفاظ على تنسيقه. Reports ← Certificate: اختر التصميم واللغة ونوع الشهادة ثم اطبع أو احفظ صورة.'],
['٧. الملاحظات والسجل','تحفظ «Notes» تذكيراتك الخاصة للمرة القادمة، ويعرض «History» الدروس السابقة والإيقاع ومدى فهم كل جزء.'],
['٨. اجعله على ذوقك','غيّر المظهر 🎨 وحجم النص والخطوط ولغة الواجهة (English / العربية). يفتح التطبيق بالوضع العريض الكامل ليستفيد من الشاشة كلها — أوقفه من الإعداد ← الوضع العريض إن فضّلت صفحة أضيق.'],
['٩. بياناتك','كل شيء يبقى على جهازك. صدّر نسخة احتياطية من الإعدادات من وقت لآخر. المزامنة السحابية (Supabase المجانية) وميزات الذكاء الاصطناعي اختيارية، ومفاتيحك تُحفظ في متصفحك فقط.']],btn:'ابدأ الآن',priv:'الخصوصية: بدون حساب وبدون تتبّع. تُحمَّل الخطوط من Google Fonts، وتذهب طلبات الذكاء الاصطناعي مباشرة من متصفحك إلى المزوّد الذي تختاره.'}};
function welcomeShow(l){
  let o=$('welcomeBox'); if(o) o.remove(); l=l||lsGet('lp.welcome.lang')||((navigator.language||'').slice(0,2)==='ar'?'ar':'en'); const G=GUIDE[l]||GUIDE.en;
  o=document.createElement('div'); o.id='welcomeBox'; o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';
  o.innerHTML='<div role="dialog" aria-modal="true" dir="'+(l==='ar'?'rtl':'ltr')+'" style="background:var(--panel,var(--bg,#fff));color:var(--fg,#1d2623);max-width:560px;width:100%;max-height:92vh;overflow:auto;border-radius:16px;padding:18px 18px 14px;box-shadow:0 12px 40px rgba(0,0,0,.35)">'
   +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px" dir="ltr"><h2 style="margin:0">'+G.t+'</h2><span><button class="btn small" data-wl="en" type="button" aria-pressed="'+(l==='en')+'">English</button> <button class="btn small" data-wl="ar" type="button" aria-pressed="'+(l==='ar')+'">العربية</button></span></div>'
   +G.st.map(x=>'<div style="margin:12px 0 0"><b>'+x[0]+'</b><div style="opacity:.85;line-height:1.55">'+x[1]+'</div></div>').join('')
   +'<p style="font-size:.8rem;opacity:.7;margin:14px 0 10px">'+G.priv+'</p><button class="btn primary" id="welcomeOk" type="button" style="width:100%">'+G.btn+'</button></div>';
  document.body.appendChild(o);
}
document.addEventListener('click',e=>{ const b=e.target.closest('[data-wl],#welcomeOk,#showGuide'); if(!b) return;
  if(b.dataset.wl){ lsSet('lp.welcome.lang',b.dataset.wl); welcomeShow(b.dataset.wl); }
  else if(b.id==='welcomeOk'){ lsSet('lp.welcome','1'); const o=$('welcomeBox'); if(o) o.remove(); }
  else if(b.id==='showGuide') welcomeShow(); });
if(!lsGet('lp.welcome')) setTimeout(()=>welcomeShow(),700);
let clBusy = false;
async function clSyncNow(quiet){
  if(clBusy || !clCfg().at) return; clBusy = true;
  try{
    let tomb = []; try{ tomb = JSON.parse(lsGet('lp.rep.del')||'[]'); }catch(e){}
    if(tomb.length){ await Promise.all(tomb.map(id => clReq('reports?id=eq.'+encodeURIComponent(id), {method:'DELETE'}))); lsSet('lp.rep.del', '[]'); }
    const meta = (await clReq('reports?select=id,updated')).filter(x => !String(x.id).startsWith('stage:')), rm = {}; meta.forEach(x => rm[x.id] = +x.updated || 0);
    const R = {}, X = {}; rpAll().forEach(r => R[r.id] = r); scAll().forEach(r => X[r.id] = r);
    const need = meta.filter(x => { const l = R[x.id] || X[x.id]; return !l || (+x.updated||0) > (l.saved||0); }).map(x => x.id);
    for(let i = 0; i < need.length; i += 40){
      const got = await clReq('reports?select=id,data&id=in.('+need.slice(i,i+40).map(x => '"'+x+'"').join(',')+')');
      got.forEach(x => { const r = x.data; if(!r || !r.id) return; if(r.kind === 'script') X[r.id] = r; else R[r.id] = r; });
    }
    const rl = Object.values(R).filter(r => r.kind !== 'script'), sl = Object.values(X); rpStore(rl); scStore(sl);
    const up = rl.concat(sl).filter(r => rm[r.id] === undefined || (r.saved||0) > rm[r.id]).map(r => ({id:r.id, data:r, updated:r.saved||Date.now()}));
    if(up.length) await clReq('reports', {method:'POST', headers:{Prefer:'resolution=merge-duplicates,return=minimal'}, body:JSON.stringify(up)});
    rpList(); try{ scRender(); }catch(e){} clMsg('Synced ✅ '+rl.length+' reports · '+sl.length+' scripts · '+new Date().toLocaleTimeString()); if(!quiet) toast('Synced ✅');
  }catch(e){ clMsg('Sync failed: '+e.message); if(!quiet) toast('Sync failed'); }
  clBusy = false;
}
function clInit(){
  const c = clCfg(); $('clUrl').value = c.url||''; $('clKey').value = c.key||''; $('clMail').value = c.mail||'';
  clMsg(c.at ? 'Signed in as '+(c.mail||'')+'.' : 'Not signed in. Reports are saved on this device only.');
  $('clIn').onclick = async () => {
    const url = $('clUrl').value.trim().replace(/\/+$/,''), key = $('clKey').value.trim(), mail = $('clMail').value.trim();
    if(!url || !key || !mail || !$('clPass').value){ clMsg('Fill in all four fields.'); return; }
    lsSet('lp.cloud', JSON.stringify({url, key, mail}));
    try{ await clAuth({email:mail, password:$('clPass').value}, 'password'); $('clPass').value = ''; clMsg('Signed in ✅ Syncing…'); await clSyncNow(); }
    catch(e){ clMsg(e.message); }
  };
  $('clSync').onclick = () => clSyncNow(); 
  $('clOut').onclick = () => { const c = clCfg(); lsSet('lp.cloud', JSON.stringify({url:c.url, key:c.key, mail:c.mail})); clMsg('Signed out. Reports stay on this device.'); };
  clSyncNow(true);
}

/* Fast Groq & AI API Handler */
async function callAI(prompt, onChunk){
  const a = S.ai;
  if(!a.key) throw new Error('Add your API key in Setup.');

  if(a.provider === 'claude'){
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': a.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: a.model || 'claude-haiku-5-5',
        max_tokens: 400,
        messages: [{ role:'user', content:prompt }]
      })
    });
    const j = await r.json();
    if(!r.ok) throw new Error((j.error && j.error.message) || ('Error ' + r.status));
    return j.content.map(x => x.text || '').join('');
  }

  if(a.provider === 'groq'){
    const model = (a.model && a.model.trim()) || 'openai/gpt-oss-20b';
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + a.key
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an educational assistant for an online teacher. Speak simply for an ' + a.age + '. Answer directly and concisely.' },
          { role: 'user', content: prompt }
        ],
        reasoning_effort: 'low',
        include_reasoning: false,
        max_completion_tokens: 800,
        temperature: 0.2,
        stream: false
      })
    });
    if(!r.ok){
      let msg = 'Groq error ' + r.status;
      try { const j = await r.json(); msg = j.error?.message || msg; }catch(e){}
      throw new Error(msg);
    }
    const data = await r.json();
    const full = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    if(!full.trim()) throw new Error('Groq returned an empty response.');
    if(onChunk) onChunk(full.trim());
    return full.trim();
  }

  // Gemini
  const model = a.model || 'gemini-2.5-flash-lite';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model.replace(/^models\//,'')) + ':generateContent?key=' + encodeURIComponent(a.key);
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.2 }
    })
  });
  const j = await r.json();
  if(!r.ok) throw new Error((j.error && j.error.message) || ('Error ' + r.status));
  const txt = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(x => x.text || '').join('');
  if(onChunk && txt) onChunk(txt);
  return txt;
}

/* Rephrase Helper (Polite, Non-Intrusive Floating Button) */
let RP = { text:'', pos:-1, whole:false, items:[] }, lastSel = { text:'', pos:-1, rect:null }, selT = 0;
const plain = t => cleanMd(t).replace(/\s?\[\d+(?:\s*,\s*\d+)*\]/g,'');

function selInfo(){
  const sel = window.getSelection(); if(!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().replace(/\s+/g,' ').trim();
  if(!text || text.length < 2) return null; // Ignore clicks or single-char taps
  const rng = sel.getRangeAt(0); let n = rng.commonAncestorContainer; n = n.nodeType === 1 ? n : n.parentElement;
  if(!n || !n.closest || !n.closest('#stage,#scriptList')) return null;
  const row = n.closest('[data-pos]');
  return { text, pos: row ? +row.dataset.pos : -1, rect: rng.getBoundingClientRect(), whole:false };
}
function wholeLine(){
  if(!S.model) return null; const l = S.model.steps[S.pos]; if(!l) return null;
  return { text: plain(l.kind === 'pause' ? (l.label || l.text) : l.text), pos: S.pos, whole: true };
}

document.addEventListener('selectionchange', () => {
  clearTimeout(selT);
  selT = setTimeout(() => {
    const chip = $('selChip');
    if(!S.floatRP){ chip.hidden = true; return; }
    const i = selInfo();
    if(i && $('rp').hidden){
      lastSel = i; chip.hidden = false; const r = i.rect, w = chip.offsetWidth;
      chip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
      let top = r.bottom + 8; if(top + 48 > innerHeight) top = Math.max(8, r.top - 46);
      chip.style.top = top + 'px';
    } else {
      chip.hidden = true;
    }
  }, 220);
});

// Hide floating button immediately when scrolling or tapping outside
window.addEventListener('scroll', () => { $('selChip').hidden = true; }, { passive:true });
document.addEventListener('pointerdown', e => {
  if(!e.target.closest('#selChip,#rp')) $('selChip').hidden = true;
});

$('selChip').addEventListener('pointerdown', e => e.preventDefault());
$('selChip').addEventListener('click', e => { const b=e.target.closest('[data-sc]'); if(!b) return; const m=b.dataset.sc; if(m==='read'){ speakText(lastSel.text); $('selChip').hidden=true; } else openRP(lastSel, m==='translate'?'translate':null); });
$('rpLang').addEventListener('change', () => runRP('translate'));
$('rpClose').addEventListener('click', () => { $('rp').hidden = true; $('selChip').hidden = true; });
$('rpSpeak').addEventListener('click', () => { if(RP.text) speakText(RP.text); });

function openRP(info, mode){
  RP = { text: info.text, pos: info.pos, whole: !!info.whole, items: [] };
  $('rpSel').textContent = info.text; $('rpOut').innerHTML = ''; $('rpMsg').textContent = '';
  const isWord = !/\s/.test(info.text);
  document.querySelectorAll('#rpModes [data-long]').forEach(b => b.hidden = isWord);
  $('selChip').hidden = true; $('rp').hidden = false;
  $('rpUndo').hidden = !S.undoStack.length;
  runRP(mode || (isWord ? 'synonyms' : 'simpler'));
}

function buildPrompt(mode, text, ctx){
  const base = 'You help a teacher reading a lesson aloud to an ' + S.ai.age + '. Keep names and Arabic phrases unchanged. ';
  const sel = ' Selected text: "' + text + '".' + (ctx ? ' Context: "' + ctx + '".' : '');
  if(mode === 'translate') return 'Translate the selected text into ' + $('rpLang').value + '. Give the translation first, then a short transliteration if the script is not Latin, then one simple example sentence. Be brief.' + sel;
  if(mode === 'simpler') return base + 'Rewrite with simple everyday words easy for an ' + S.ai.age + '. Give 3 clear alternatives, one per line.' + sel;
  if(mode === 'synonyms') return base + 'Give 6 everyday synonyms that fit this context. Return as comma-separated.' + sel;
  if(mode === 'meanings') return base + 'Give different meanings with examples. One per line.' + sel;
  if(mode === 'shorter') return base + 'Make this shorter and punchier for speech. Give 2 versions.' + sel;
  return base + 'Rephrase in 3 ways easy to read aloud.' + sel;
}

async function runRP(mode){
  const out = $('rpOut');
  out.innerHTML = '<p class="help">Working with ' + esc(S.ai.provider) + '...</p>';
  try {
    const ctx = RP.pos >= 0 && S.model.steps[RP.pos] ? plain(S.model.steps[RP.pos].text) : '';
    const txt = await callAI(buildPrompt(mode, RP.text, ctx));
    let items = [];
    if(mode === 'synonyms') items = txt.split(/[,\n]+/).map(x => x.replace(/^[\s\d.\-•*"]+|["\s]+$/g,'')).filter(Boolean).slice(0,10);
    else items = txt.split('\n').map(x => x.replace(/^[\s\d.)\-•*]+/,'').replace(/^"|"$/g,'').trim()).filter(Boolean).slice(0,5);
    
    RP.items = items;
    out.innerHTML = mode === 'translate'
      ? items.map(t => '<div class="ritem"><span class="t">' + esc(t) + '</span></div>').join('')
      : mode === 'synonyms'
      ? '<div class="chips">' + items.map((t, i) => '<button type="button" class="btn" data-act="use" data-i="' + i + '">' + esc(t) + '</button>').join('') + '</div>'
      : items.map((t, i) => '<div class="ritem"><span class="t">' + esc(t) + '</span><button type="button" class="btn small primary" data-act="use" data-i="' + i + '">Use</button></div>').join('');
  } catch(err){
    out.innerHTML = '<div class="report bad">' + esc(err.message) + '</div>' + (mode==='translate' ? '<p><a href="https://translate.google.com/?sl=auto&tl=' + ({Arabic:'ar',English:'en',French:'fr',Urdu:'ur',Spanish:'es'}[$('rpLang').value]||'ar') + '&text=' + encodeURIComponent(RP.text) + '&op=translate" target="_blank" rel="noopener">Open in Google Translate ↗</a></p>' : '');
  }
}

$('rpModes').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if(b) runRP(b.dataset.mode); });
$('rpOut').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if(!b) return;
  const t = RP.items[+b.dataset.i];
  if(b.dataset.act === 'use') applyReplace(t);
});

