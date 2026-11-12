/* ===== Flexible script formats: auto-convert plain / markdown / dialogue scripts ===== */
function stripMd(x){
  return String(x||'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\((?:https?:|mailto:)[^)]*\)/g,'$1').replace(/\\([\\`*_{}\[\]()#+\-.!>|~<])/g,'$1');
}
function normalizeScript(text){
  { const nb = markupConvert(text) || nbConvert(text); if(nb) return nb; }
  const src = stripMd(String(text||'').replace(/\r/g,''));
  if(TAGGED_RE.test(src)) return text; // already tagged
  if(!src.trim()) return text;
  const KW = 'slide|section|part|chapter|step|topic|stage|segment|activity|scene|page';
  const kwHead = new RegExp('^\\W*(?:'+KW+')\\s*\\d*\\s*[:：.\\-–—]\\s*(.+)$','i');
  const kwOnly = new RegExp('^\\W*(?:'+KW+')\\s*\\d+\\s*$','i');
  const timeRe = /\(?\s*(?:minutes?|mins?)\.?\s*(\d+)\s*(?:[–\-—]|to)\s*(\d+)\s*\)?|\(?\s*(\d+)\s*(?:[–\-—]|to)\s*(\d+)\s*(?:minutes?|mins?)\s*\)?/i;
  const durRe = /\(\s*(\d+)\s*(?:minutes?|mins?)\s*\)/i;
  const SKIP = /^(?:\d+\s*[.)]\s*)?(?:references?|sources?|further reading|teaching tips?|teacher'?s? notes?|notes for (?:the )?teacher|answer key)\b/i;
  const META = /^(?:duration|audience|language|lesson objectives?|objectives?|grade|age(?: group)?|level|topic|subject|goal|materials|class)\s*[:：]/i;
  const LABELONLY = /^(?:teacher(?: or speaker)?(?: says)?|speaker(?: says)?|say|arabic|transliteration|meaning|translation)\s*[:：]?\s*$/i;
  const INSTR = /^(?:ask|read|go through) (?:the )?(?:following )?questions\b/i;
  const STAGE = /^(?:pause\b|wait\b|allow (?:the )?(?:children|students|child|kids|class)|let (?:the )?(?:children|students|child|kids|class) (?:answer|respond|think|share|reply)|give (?:the )?(?:children|students|kids|class) (?:time|a moment|a chance))/i;
  const EXP = /^(?:expected answers?|possible answers?|likely answers?|model answer|answer)\s*[:：]\s*(.+)$/i;
  const raw = src.split('\n');
  const h1 = raw.filter(l => /^#\s+\S/.test(l.trim())).length, h2 = raw.some(l => /^#{2,6}\s+\S/.test(l.trim()));
  let titleDone = (h1 >= 2 && !h2);
  const isPlainHead = t => {
    if(!t || t.length > 70 || /^[\[\(\*>\-•#]/.test(t) || /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFEFF]/.test(t)) return false;
    const w = t.replace(/\*/g,'').split(/\s+/); if(w.length > 9) return false;
    if(/[.!?:;,،؟)"”\]]$/.test(t)) return false;
    const big = w.filter(x => x.replace(/[^\p{L}]/gu,'').length > 3);
    if(big.length && big.filter(x => /^\p{Lu}/u.test(x.replace(/^[^\p{L}]+/u,''))).length / big.length < 0.7) return false;
    if(!big.length && w.length > 3) return false;
    return !LABELONLY.test(cleanMd(t)) && !EXP.test(t);
  };
  const L = [];
  for(let i=0;i<raw.length;i++){
    let t = raw[i].trim();
    while(t && !/[.!?…:;"”’')\]*]$/.test(t) && i+1 < raw.length){
      const nx = raw[i+1].trim();
      if(nx && /^[a-z]/.test(nx)){ t += ' ' + nx; i++; } else break;
    }
    L.push(t);
  }
  const mdHeads = raw.filter(l => /^#{2,6}\s+\S/.test(l.trim())).length;
  const plainHeads = raw.filter(l => isPlainHead(l.trim())).length >= 3 && mdHeads < 3;
  let durTotal = 0;
  const items = []; let pendingAsk = false, skipping = false;
  const flush = () => { if(pendingAsk){ items.push({k:'pause', label:'Listen to the answer', expect:''}); pendingAsk = false; } };
  const lastLine = () => { const x = items[items.length-1]; return x && (x.k === 'speak' || x.k === 'ask' || x.k === 'item'); };
  for(let t of L){
    if(!t || /^[-_=*─━═\s]{3,}$/.test(t)) continue;
    if(!titleDone && /^#\s+\S/.test(t)){ titleDone = true; items.push({title:t}); continue; }
    const c = cleanMd(t); let m;
    if(!items.some(x => x.k) && META.test(c)){ const dm = /duration\s*[:：]\s*(\d+)/i.exec(c); if(dm) durTotal = +dm[1]; continue; }
    let head = null;
    let isMd = false;
    if((m = /^#{1,6}\s+(.+)$/.exec(t))){ head = m[1]; isMd = true; }
    else if((m = kwHead.exec(c))) head = m[1];
    else if(kwOnly.test(c)) head = '';
    else if((m = /^\W*(?:minutes?|mins?)\s*\d+\s*[–\-—]\s*\d+\s*[:\-–—]?\s*(.*)$/i.exec(c))) head = c;
    else if(timeRe.test(c) && c.split(/\s+/).length <= 9 && !/[.!?]$/.test(c)) head = c;
    else if(plainHeads && isPlainHead(t)) head = c;
    else if(/^[A-Z0-9][A-Z0-9 &'’,:\-–—()\/]{3,60}$/.test(t) && /[A-Z]{3}/.test(t) && !/[.!?]$/.test(t)) head = t;
    else if(/^\*\*[^*]{2,60}\*\*:?$/.test(t) && !/[.!?]\*\*:?$/.test(t)) head = c.replace(/:$/,'');
    if(head !== null){
      flush();
      if(SKIP.test(cleanMd(head).trim())){ skipping = true; continue; }
      skipping = false; items.push({h:head, md:isMd}); continue;
    }
    if(skipping) continue;

    t = t.replace(/^>\s?/,'').trim(); if(!t) continue;
    let opt = false;
    if((m = /^\(?\s*optional\s*\)?\s*[:\-–—]?\s*(.+)$/i.exec(t))){ opt = true; t = m[1]; }
    const bm = /^(?:\d+[.)]|[-•*])\s+(.*)$/.exec(t);
    if(bm){
      if(lastLine()){ items.push({k:'item', s:'- ' + bm[1]}); continue; }
      t = bm[1];
    }
    let k = 'speak', label = '', expect = '';
    if((m = /^(?:teacher|tutor|instructor|presenter|narrator|speak|read|tell|script|me)\s*[:：]\s*(.+)$/i.exec(t))) t = m[1];
    const ct = cleanMd(t);
    if(LABELONLY.test(ct) || INSTR.test(ct)) continue;
    if((m = EXP.exec(t))){
      const last = items[items.length-1];
      if(last && last.k === 'pause' && !last.expect){ last.expect = m[1]; }
      else items.push({k:'pause', label:'Listen', expect:m[1]});
      pendingAsk = false; continue;
    }
    if((m = /^(?:ask(?: the (?:children|students|kids|class|child))?|question|quiz|q\d*|check)\s*\d*\s*[:：.)]\s*(.+)$/i.exec(t))){ k = 'ask'; t = m[1]; }
    else if((m = /^(student|pupil|child|kid|learner|pause|wait|listen)\s*[:：]\s*(.*)$/i.exec(t))){
      k = 'pause';
      if(/^(pause|wait|listen)$/i.test(m[1])) label = m[2] || 'Listen to the answer'; else { label = 'Listen'; expect = m[2]; }
    }
    else if(STAGE.test(t)){
      k = 'pause';
      const q = /[:：]\s*[“"'‘](.+?)[”"'’]\s*\.?$/.exec(t);
      if(q){ expect = q[1]; label = t.replace(/[:：].*$/,''); } else label = t;
    }
    else if(/^[\(\[\*_]+\s*(pause|wait|listen|silence|let (?:him|her|them|the (?:student|child)) )/i.test(t)){ k = 'pause'; label = /^\W*(pause|wait|listen)\W*$/i.test(t) ? 'Listen to the answer' : t.replace(/[\(\)\[\]\*_]/g,'').trim(); }
    else if(/[?؟]["”')\]*_]*$/.test(t) && t.split(/\s+/).length <= 45) k = 'ask';
    if(k === 'pause'){ pendingAsk = false; items.push({k, label, expect}); continue; }
    flush();
    items.push({k, s:t, opt});
    if(k === 'ask') pendingAsk = true;
  }
  flush();
  const hasHead = items.some(x => x.h !== undefined);
  let body = items.filter(x => !x.title);
  const out = items.filter(x => x.title).map(x => x.title);
  // first heading that is really the lesson title (rest are numbered sections)
  if(!out.length && body[0] && body[0].h !== undefined && !/^\d/.test(cleanMd(body[0].h))){
    const hs = body.filter(x => x.h !== undefined);
    if(hs.slice(1).filter(x => /^\d+\s*[.)]/.test(cleanMd(x.h))).length >= 3){ out.push('# ' + cleanMd(body[0].h)); body = body.slice(1); }
  }
  if(!out.length && body[0] && body[0].md && body.filter(x => x.md).length === 1){ out.push('# ' + cleanMd(body[0].h)); body = body.slice(1); }
  let seq = [];
  if(hasHead){
    seq = body[0] && body[0].h === undefined ? [{h:'Introduction'}].concat(body) : body;
  } else {
    let since = 0; seq = [{h:''}];
    for(const x of body){
      if(since >= 12 && (x.k === 'speak' || x.k === 'ask') && !lastItemIsAsk(seq)){ seq.push({h:''}); since = 0; }
      seq.push(x); if(x.k !== 'item') since++;
    }
  }
  function lastItemIsAsk(a){ const x = a[a.length-1]; return x && x.k === 'ask'; }
  const parsed = x => {
    let a = '', b = '', d = null;
    const title = x.h.replace(timeRe, (mm,a1,b1,a2,b2) => { a = a1||a2; b = b1||b2; return ''; }).replace(durRe, (mm,q) => { d = +q; return ''; })
      .replace(/^\s*\d+\s*[.)]\s*/,'').replace(/[\s:–—\-|]+$/,'').replace(/\*/g,'').trim();
    return {title, a, b, d};
  };
  const timedCount = seq.filter(x => x.h !== undefined).filter(x => { const q = parsed(x); return q.a || q.d; }).length;
  const autoT = new Map();
  if(!timedCount && durTotal){
    const groups = []; let g = null;
    for(const x of seq){ if(x.h !== undefined){ g = {x, w:0}; groups.push(g); } else if(g) g.w += x.k === 'pause' ? 25 : String(x.s||'').split(/\s+/).length; }
    const tot = groups.reduce((q,y) => q + y.w, 0) || 1; let acc = 0, prev = 0;
    groups.forEach((y,i) => { acc += y.w; let e = i === groups.length-1 ? durTotal : Math.round(acc/tot*durTotal); e = Math.max(prev+1, e); autoT.set(y.x, [prev+1, e]); prev = e; });
  }
  let n = 0, cum = 0;
  for(const x of seq){
    if(x.h !== undefined){
      const q = parsed(x);
      if(timedCount >= 2 && !(q.a || q.d) && n > 0) continue; // untimed sub-heading: stays inside previous slide
      n++;
      if(autoT.has(x)){ q.a = autoT.get(x)[0]; q.b = autoT.get(x)[1]; }
      if(!q.a && q.d){ q.a = cum + 1; q.b = cum + q.d; }
      if(q.a && q.b) cum = +q.b;
      out.push(''); out.push('➡️ **SLIDE ' + n + ': ' + (q.title || ('Part ' + n)) + '**' + (q.a && q.b ? ' *(Minutes ' + q.a + '–' + q.b + ')*' : ''));
    } else if(x.k === 'speak') out.push((x.opt ? '🗣️ **[OPTIONAL]** **[SPEAK]** ' : '🗣️ **[SPEAK]** ') + x.s);
    else if(x.k === 'ask') out.push((x.opt ? '❓ **[OPTIONAL]** **[ASK]** ' : '❓ **[ASK]** ') + x.s);
    else if(x.k === 'item') out.push(x.s);
    else if(x.k === 'pause'){
      const lb = String(x.label||'').replace(/\*/g,'').replace(/[:\s.]+$/,'');
      out.push('🛑 **[PAUSE]** *(' + (x.expect ? (lb && lb !== 'Listen to the answer' ? lb : 'Listen') + ': e.g., "' + x.expect.replace(/["*“”]/g,'') + '"' : (lb || 'Listen to the answer')) + ')*');
    }
  }
  return enrichSpeak(out.join('\n')).text;
}

/* ===== Split long spoken paragraphs into one sentence per line with a bold lead-in ===== */
function enrichSpeak(text){
  const out = []; let changed = 0;
  for(const line of String(text||'').split('\n')){
    const m = /^(🗣️?\s*\*\*\[SPEAK\]\*\*\s+)(.+)$/.exec(line);
    if(!m || m[2].includes('**')){ out.push(line); continue; }
    const sents = m[2].split(/(?<=[.!?…؟]["”')\]]*)\s+(?=["“'(\[—«]?[\p{Lu}\p{N}؀-ۿ])/u).map(x => x.trim()).filter(Boolean);
    sents.forEach(q => {
      const w = q.split(/\s+/), k = Math.min(3, w.length), head = w.slice(0,k).join(' ');
      out.push(m[1] + (w.length > k && !/[*_`<>\[\]"“”؀-ۿ]/.test(head) ? '**' + head + '** ' + w.slice(k).join(' ') : q));
    });
    changed++;
  }
  return { text: out.join('\n'), changed };
}

/* ===== Markup / video-script converter (XML-like tags, [TIMECODE], comments) ===== */
function markupConvert(text){
  let t = String(text||'').replace(/\r/g,'');
  if(!(/\[TIMECODE:/i.test(t) || /^\s*\[\d+:\d+:\d+[^\]]*-->/m.test(t) || /<speaker\b/i.test(t) || (t.match(/<!--/g)||[]).length >= 2)) return null;
  // repair text that an earlier bad conversion already tagged
  t = t.replace(/^[^\p{L}\p{N}\[<\n]{0,12}\*{0,2}\[(?:SPEAK|OPTIONAL)\]\*{0,2}\s*/gmu,'')
       .replace(/^➡️?\s*\*{0,2}SLIDE\s*\d+\s*:\s*(.*?)\*{0,2}\s*$/gimu, (m, x) => /^introduction$/i.test(x.trim()) ? '' : x);
  const callouts = [];
  t = t.replace(/<!--[\s\S]*?-->/g,'').replace(/<((?:graphics|anim|overlay|callout|lower_third)(?::[\w-]+)?)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, tg, inner) => { const c = inner.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); if(c && c.split(/\s+/).length <= 8 && !/[.!?]$/.test(c)) callouts.push(c); return ''; })
       .replace(/<([\w:-]*?(?:director|uuid|tracking|meta|overlay|vfx|audio|music|sfx|camera|graphic|motion|callout|cue|marker|post_roll|video|whisper|lighting|trigger)[\w:-]*)\b[^>]*>[\s\S]*?<\/\1>/gi,'')
       .replace(/<annotation\b[^>]*>([\s\S]*?)<\/annotation>/gi, (m, x) => { const a = x.replace(/[\[\]]/g,'').trim(); return /[؀-ۿ]/.test(a) ? ' (' + a + ')' : ''; });
  const dec = x => x.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ');
  const tc = (h,m,x) => (+h)*3600 + (+m)*60 + (+x);
  const slides = []; let cur = null, prevB = 0;
  const open = title => { cur = { title, s:null, e:null, buf:[] }; slides.push(cur); };
  open('Introduction');
  for(const raw of t.split('\n')){
    const l = raw.trim(); if(!l) continue;
    let m;
    if((m = /^\[SCENE_BREAK:\s*([^\]]*)\]/i.exec(l))){
      const nm = m[1].replace(/^SECTION[_\s-]*/i,'').replace(/[_]+/g,' ').trim().toLowerCase().replace(/\b\p{L}/gu, c => c.toUpperCase());
      if(cur.buf.length) open(nm || 'Part ' + (slides.length + 1)); else if(nm) cur.title = nm;
      continue;
    }
    if((m = /^\[(?:TIMECODE:\s*)?(\d+):(\d+):(\d+)(?:[.,]\d+)?\s*(?:-->|[-–—])\s*(\d+):(\d+):(\d+)(?:[.,]\d+)?\s*\]/i.exec(l))){
      const a = tc(m[1],m[2],m[3]), b = tc(m[4],m[5],m[6]);
      if(cur.s === null) cur.s = a; cur.e = Math.max(cur.e || 0, b); continue;
    }
    if(/^\[[A-Z0-9_]+(?::[^\]]*)?\]\s*$/.test(l)) continue;     // [SCENE_START: ..] etc.
    if((m = /^\*\*([^*]{2,60}?)\*\*:?$/.exec(l)) && !/[.!?]$/.test(m[1]) && m[1].split(/\s+/).length <= 8){ if(cur.buf.length) open(m[1].trim()); else cur.title = m[1].trim(); continue; }
    const x = dec(l.replace(/<[^>]*\/>/g,' ').replace(/<[^>]*>/g,'')).replace(/\*+/g,'').replace(/\[([\u0600-\u06FF\s]+)\]/g,'($1)').replace(/\s+/g,' ').trim();
    if(x) cur.buf.push(x);
  }
  if(slides.filter(x => x.buf.length).length === 1 && slides[0].title === 'Introduction' && callouts[0]) slides[0].title = callouts[0];
  const firstT = slides.find(x => x.s !== null), base = firstT ? Math.floor(firstT.s/60)*60 : 0;   // minutes count from the start of this excerpt
  const out = []; let n = 0, planned = false;
  for(const sl of slides){
    const txt = sl.buf.join(' ').replace(/\s+([,.;:!?])/g,'$1').trim();
    if(!txt) continue;
    const sents = txt.split(/(?<=[.!?…]["”')\]]*)\s+(?=["“'(\[—«]?[\p{Lu}\p{N}\u0600-\u06FF])/u).map(x => x.trim()).filter(Boolean);
    n++;
    let mins = '';
    if(sl.s !== null){ const o = base || 0; let a = Math.floor((sl.s - o)/60) + 1, b = Math.max(a, Math.ceil((sl.e - o)/60)); a = Math.min(Math.max(a, prevB), b); prevB = b; mins = ' *(Minutes ' + a + '–' + b + ')*'; planned = true; }
    out.push(''); out.push('➡️ **SLIDE ' + n + ': ' + sl.title + '**' + mins);
    for(const q of sents){
      if(/[?؟]["”')\]]*$/.test(q) && q.split(/\s+/).length <= 45){ out.push('❓ **[ASK]** ' + q); out.push('🛑 **[PAUSE]** *(Listen to the answer)*'); continue; }
      const w = q.split(/\s+/), k = Math.min(3, w.length), head = w.slice(0,k).join(' ');
      out.push('🗣️ **[SPEAK]** ' + (w.length > k && !/[*_`<>\u0600-\u06FF]/.test(head) ? '**' + head + '** ' + w.slice(k).join(' ') : q));
    }
  }
  return n ? out.join('\n').trim() : null;
}

/* ===== NotebookLM "What to say / Quick Check-In" converter ===== */
function nbConvert(text){
  let t = String(text||'').replace(/\r/g,'');
  if(!/^\W*[*_]*what to say:?[*_]*|quick check-?in/im.test(t)) return null;
  // also repair text that an earlier (bad) conversion already tagged
  t = t.replace(/^[^\p{L}\p{N}\[\n]{0,12}\*{0,2}\[(?:SPEAK|OPTIONAL)\]\*{0,2}\s*(?:\*{0,2}\[SPEAK\]\*{0,2}\s*)?/gmu,'').replace(/^[^\p{L}\p{N}\n]{0,6}(?=\*{0,2}slide\s*\d)/gimu,'');
  t = t.replace(/\\*\(\s*\\rightarrow\s*\\*\)/g,'→').replace(/\\rightarrow/g,'→').replace(/\s?\[cite:[^\]]*\]/gi,'');
  let lines = t.split('\n');
  let first = lines.findIndex(l => /^\s*#{1,6}\s/.test(l));
  if(first < 0) first = lines.findIndex(l => /^\W*[*_]*\s*(?:⏱️?\s*)?[*_]*slide\s*\d+\s*[:：]/iu.test(l.trim()) && /\(\s*minutes?/i.test(l));
  if(first > 0) lines = lines.slice(first);   // drop language review / chatter above the script
  const out = []; let n = 0, hasSlide = false, nestedSeen = false;
  const stuM = /quick check-?in[^"“]*["“]\s*([A-Z][a-z]+),/i.exec(t), stu = stuM ? stuM[1] : '';
  const lead = x => { x = String(x||'').trim(); if(/^[\p{L}\p{N}"“'‘]/u.test(x) === false || x.startsWith('**')) return x;
    const w = x.split(/\s+/); const k = Math.min(3, w.length); const head = w.slice(0,k).join(' ');
    if(/[*_`\u0600-\u06FF]/.test(head) || w.length <= k) return x; return '**' + head + '** ' + w.slice(k).join(' '); };
  const unq = s => { s = String(s||'').trim(); const q = (s.match(/["“”]/g)||[]).length, a = /^["“]/.test(s), b = /["”]$/.test(s);
    if(a && b && q === 2) return s.slice(1,-1).trim(); if(a && q % 2) return s.slice(1).trim(); if(b && q % 2) return s.slice(0,-1).trim(); return s; };
  for(const raw of lines){
    const s = raw.trim();
    if(!s || /^[-_=*─━═\s]{3,}$/.test(s) || s.startsWith('💡')) continue;
    const c = cleanMd(s), isBullet = /^[*\-•]\s/.test(s);
    let m;
    if(/^#{1,6}\s/.test(s) && !/slide\s*\d/i.test(c)){
      if(!out.length) out.push('# ' + c.replace(/^.*?script\s*[:\-–—]\s*/i,'').replace(/^[^\p{L}\p{N}]+/u,''));
      continue;
    }
    if(!isBullet && (m = /^\W*slide\s*\d+\s*[:：.\-–—]\s*(.+?)\s*(?:\(\s*(?:minutes?|mins?)\s*(\d+)\s*[–\-—]\s*(\d+)\s*\))?\s*$/iu.exec(c))){
      let ttl = m[1].replace(/^[^\p{L}\p{N}]+/u,'').trim(); const nest = /^slide\s*\d+\s*[:：.\-–—]\s*(.+)$/i.exec(ttl);
      if(nest){ ttl = nest[1].trim(); if(!nestedSeen){ nestedSeen = true; out.length = 0; n = 0; } }
      n++; hasSlide = true; out.push('');
      out.push('➡️ **SLIDE ' + n + ': ' + ttl + '**' + (m[2] ? ' *(Minutes ' + m[2] + '–' + m[3] + ')*' : ''));
      continue;
    }
    let body = s.replace(/^[*\-•]\s+/,'');
    const num = /^(\d+)[.)]\s+(.*)$/.exec(body);
    const wts = /^\**what to say:?\**\s*(.*)$/i.exec(body);
    const qci = /^❓️?\s*\**quick check-?in:?\**\s*(.*)$/i.exec(body);
    if(qci || (body.includes('→') && /\?/.test(body))){
      const parts = (qci ? qci[1] : (num ? num[2] : body)).split('→');
      const qq = unq(cleanMd(parts[0]));
      const nm = /^([A-Z][a-z]+),/.exec(qq);
      const exp = unq(cleanMd(parts.slice(1).join(' ')).replace(/^\(\s*/,'').replace(/\s*\)$/,'').replace(/^(?:student|wait for|answer|expected(?: answer)?)\s*:\s*/i,'')).replace(/["“”]/g,'');
      const who = stu || (nm ? nm[1] : '');
      out.push('❓ **[ASK' + (who ? ' ' + who.toUpperCase() : '') + ']** ' + lead('"' + qq.replace(/^["“]|["”]$/g,'') + '"').replace(/^\*\*"/,'**"'));
      out.push('🛑 **[PAUSE]** *(Listen to ' + (who ? who + "'s answer" : 'the answer') + (exp ? ': e.g., "' + exp + '"' : '') + ')*');
      continue;
    }
    if(wts){ const sp = unq(wts[1]); if(sp) out.push('🗣️ **[SPEAK]** ' + lead(sp)); continue; }
    out.push('🗣️ **[SPEAK]** ' + lead(unq(body)));
  }
  return hasSlide ? out.join('\n').trim() : null;
}

/* ===== Arabic support for Clean & standardize ===== */
const AR_LET = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const arZ = s => String(s||'').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[*_#>\[\]()«»"“”]/g,' ').replace(/\s+/g,' ').trim();
const arD = s => String(s||'').replace(/[٠-٩]/g,d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const AR_ORD = {اول:1,اولا:1,اولي:1,ثاني:2,ثانيا:2,ثانيه:2,ثالث:3,ثالثا:3,ثالثه:3,رابع:4,رابعا:4,رابعه:4,خامس:5,خامسا:5,خامسه:5,سادس:6,سادسا:6,سادسه:6,سابع:7,سابعا:7,سابعه:7,ثامن:8,ثامنا:8,ثامنه:8,تاسع:9,تاسعا:9,تاسعه:9,عاشر:10,عاشرا:10,عاشره:10};
const AR_L = {
  teacher: /^(?:(?:يقول|تقول) )?(?:المعلم|المعلمه|المدرس|المحاضر|المحاضره|المتحدث|المتحدثه|الراوي)(?: (?:يقول|تقول))?$/,
  student: /^(?:(?:اجابه|جواب) )?(?:الطالب|الطالبه|الطلاب|الطلبه|الطفل|الطفله|الاطفال|التلميذ|التلميذه|المتعلم|المتعلمه)$/,
  ask: /^(?:اسال(?: (?:الطلاب|الطالب|الطالبه|الاطفال|الطفل|الصف))?|(?:ال)?سوال(?: \S+)?|اختبار سريع|تحقق|فحص(?: الفهم)?)$/,
  pause: /^(?:توقف(?: قليلا)?|انتظر|استمع|صمت|وقفه)$/,
  exp: /^(?:(?:ال)?(?:اجابه|اجابات|جواب|اجوبه) (?:المتوقعه?|المحتمله?|النموذجيه|الصحيحه)|(?:ال)?(?:اجابه|جواب))$/,
  meta: /^(?:المده|مده الدرس|زمن الدرس|الجمهور|الفئه(?: المستهدفه| العمريه)?|اللغه|الاهداف|اهداف الدرس|الهدف|المستوي|الصف|العمر|المواد|الوسائل|الادوات|الماده|الموضوع|عنوان الدرس|اسم الدرس)$/,
  skip: /^(?:المراجع|المصادر|قراءات اضافيه|مزيد من القراءه|نصائح للمعلم|ملاحظات للمعلم|ملاحظات المعلم|ارشادات للمعلم|مفتاح الاجابه|مفتاح الاجابات)$/
};
const AR_HEAD = /^[#*_\s]*(?:الشريحة|الشريحه|القسم|الجزء|الفصل|الخطوة|الخطوه|المرحلة|المرحله|المحور|النشاط|المشهد|الصفحة|الصفحه|الحصة|الحصه)(?:\s+([0-9٠-٩۰-۹]+|[\u0621-\u064A]{2,12}))?\s*(?:[-–—:：]\s*(.*?))?[*_\s]*$/;
function arPrep(text){
  let t = String(text||'').replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u061C]/g,'');
  t = t.replace(/\[\s*([^\]\n]{1,24}?)\s*\]/g, (m,w) => { const z = arZ(w);
    if(/^(?:اسال|سوال|اسالوا)$/.test(z)) return '[ASK]';
    if(/^(?:قل|قول|تحدث|اشرح|نص|اقرا|المعلم|يقول|المعلمه)$/.test(z)) return '[SPEAK]';
    if(/^(?:توقف|انتظر|استمع|صمت|اجابه الطالب|الطالب)$/.test(z)) return '[PAUSE]';
    if(z === 'اختياري') return '[OPTIONAL]'; return m; });
  const tagged = TAGGED_RE.test(t); let n = 0, seen = false; const out = [];
  const slide = (num, title) => { n = num; title = (title||'').trim();
    if(!tagged) return 'Slide ' + n + ': ' + title;
    const tm = /\(?\s*Minutes\s+(\d+)\s*[–-]\s*(\d+)\s*\)?/i.exec(title); if(tm) title = title.replace(tm[0],'').trim();
    return '➡️ **SLIDE ' + n + ': ' + (title.replace(/[*:]+$/,'').trim() || 'Part ' + n) + '**' + (tm ? ' *(Minutes ' + tm[1] + '–' + tm[2] + ')*' : ''); };
  for(const raw of t.split('\n')){
    let l = raw.trim();
    if(!l || !AR_LET.test(l)){ out.push(raw); continue; }
    if(l.length <= 90) l = arD(l).replace(/(?:الدقائق|الدقيقة|دقائق|دقيقة)\s*(\d+)\s*(?:[-–—]|الى|إلى|الي)\s*(\d+)/g,'Minutes $1–$2').replace(/(\d+)\s*(?:[-–—]|الى|إلى)\s*(\d+)\s*(?:دقائق|دقيقة|دقيقه)/g,'$1–$2 minutes').replace(/\(\s*(\d+)\s*(?:دقائق|دقيقة|دقيقه)\s*\)/g,'($1 minutes)');
    let opt = false, om = /^[(\[]\s*اختيار(?:ي|ية)\s*[)\]]\s*[:\-–]?\s*(.+)$/.exec(l); if(om){ opt = true; l = om[1]; }
    if(AR_L.pause.test(arZ(l)) && l.length < 30){ out.push(tagged ? '🛑 **[PAUSE]** *(Listen to the answer)*' : 'Pause: '); continue; }
    const tmm = /\(?\s*Minutes\s+\d+\s*[–-]\s*\d+\s*\)?/i.exec(l); let lh = tmm ? l.replace(tmm[0],'').trim() : l;
    let m = AR_HEAD.exec(lh);
    if(m && (m[1] || m[2] !== undefined || /^[#*_\s]*\S+[*_\s]*$/.test(lh))){
      const g = m[1] || '', num = /^[0-9٠-٩۰-۹]+$/.test(g) ? +arD(g) : (AR_ORD[arZ(g).replace(/^ال/,'')] || n + 1);
      out.push(slide(num, (m[2] || '') + (tmm ? ' ' + tmm[0] : ''))); continue; }
    m = /^[\s#>*_\-•\d.)]*([^:：]{1,40}?)\s*\**\s*[:：]\s*\**\s*(.*)$/.exec(l);
    if(m){
      const z = arZ(m[1]), rest = m[2].trim();
      if(AR_L.teacher.test(z)){ if(rest){ out.push((opt ? '(optional) ' : '') + rest); seen = true; } continue; }
      if(AR_L.ask.test(z)){ if(rest){ out.push(tagged ? '❓ **[ASK]** ' + rest : (opt ? '(optional) ' : '') + 'Ask: ' + rest); seen = true; } continue; }
      if(AR_L.pause.test(z)){ out.push(tagged ? '🛑 **[PAUSE]** *(' + (rest || 'Listen to the answer') + ')*' : 'Pause: ' + rest); continue; }
      if(AR_L.exp.test(z) && rest){ out.push(tagged ? '🛑 **[PAUSE]** *(Listen: e.g., "' + rest.replace(/["*“”]/g,'') + '")*' : 'Expected answer: ' + rest); continue; }
      if(AR_L.student.test(z) && rest){ out.push(tagged ? '🛑 **[PAUSE]** *(Listen: e.g., "' + rest.replace(/["*“”]/g,'') + '")*' : 'Student: ' + rest); continue; }
      if(!seen && AR_L.meta.test(z)){ const d = /\d+/.exec(rest); if(!tagged) out.push(/^(?:المده|مده|زمن)/.test(z) && d ? 'Duration: ' + d[0] : 'Objectives: ' + rest); continue; }
      if(!rest && AR_L.skip.test(z)){ out.push('## References'); continue; }
      if(!rest && AR_L.skip.test(arZ(m[1]))){ out.push('## References'); continue; }
      const oz = AR_ORD[z]; if(oz && rest.length <= 60 && !/[.!?؟]$/.test(rest)){ out.push(slide(oz, rest)); continue; }
    } else if(AR_L.skip.test(arZ(l))){ out.push('## References'); continue; }
    if(!/^#/.test(l)) seen = true; out.push(opt ? '(optional) ' + l : l);
  }
  return out.join('\n');
}
function arPunct(s){
  return String(s||'').replace(/(?<=\p{L})ـ+(?=\p{L})/gu,'')
    .replace(/(?<=[\u0600-\u06FF\u064B-\u065F])\s*,/g,'،').replace(/(?<=[\u0600-\u06FF\u064B-\u065F])\s*;/g,'؛').replace(/(?<=[\u0600-\u06FF\u064B-\u065F])\s*\?/g,'؟')
    .replace(/\s+([،؛؟!:.])(?=\s|$|["”»)\]])/g,'$1').replace(/\s+([.!؟،؛])(?=[\u0600-\u06FF])/g,'$1 ')
    .replace(/([،؛؟])(?=[^\s\d"”»)\]،؛؟.!*])/g,'$1 ')
    .replace(/[ ]{2,}/g,' ').trim();
}
function arUnq(s){
  s = String(s||'').trim();
  const q = (s.match(/["“”]/g)||[]).length, a = /^["“]/.test(s), b = /["”]$/.test(s);
  if(a && b && q === 2) return s.slice(1,-1).trim();
  if(a && q % 2) s = s.slice(1).trim(); else if(b && q % 2) s = s.slice(0,-1).trim();
  if(/^«[^»«]*»$/.test(s)) s = s.slice(1,-1).trim();
  return s;
}
function arTidyOut(l){
  if(!AR_LET.test(l)) return l;
  const m = /^((?:[^\p{L}\p{N}\[\n]{0,12}\*{0,2}\[(?:OPTIONAL|SPEAK|ASK)\]\*{0,2}\s*)+)(.*)$/u.exec(l);
  if(!m) return /^(?:➡️|🛑|#)/.test(l) ? l : arPunct(l);
  let x = m[2].replace(/^\*{0,2}(?:يقول |تقول )?(?:المعلم|المعلمة|المعلمه|المدرس|المحاضر|المتحدث|المتحدثة|الراوي)(?: (?:يقول|تقول))?\s*[:：]\s*\*{0,2}\s*/, '');
  return m[1] + arPunct(arUnq(x));
}

/* ===== Clean & standardize any script ===== */
function cleanScript(text){
  const _ar = AR_LET.test(String(text||'')); if(_ar) text = arPrep(String(text));
  { const x = String(text||''), sig = [/^\s*(?:import\s+[\w.]+\s*$|from\s+[\w.]+\s+import\s)/m, /^\s*def\s+\w+\s*\([^)]*\)\s*(?:->[^:]*)?:\s*$/m, /\bre\.(?:sub|split|compile)\(/, /^\s*if\s+__name__\s*==/m, /^\s*(?:for|while|if)\b[^\n]*:\s*$/m, /^\s*return\s+\S+/m].filter(r => r.test(x)).length;
    if(sig >= 3){
      // pasted a Python cleaner: clean the sample script embedded in it instead of the code
      const em = /\b\w+\s*=\s*(?:r|f)?(?:\"\"\"|''')([\s\S]*?)(?:\"\"\"|''')/.exec(x.replace(/^\s*(?:\"\"\"|''')[\s\S]*?(?:\"\"\"|''')/gm, m0 => m0.replace(/\"\"\"|'''/g,'###')));
      const emb = em && /(?:\"\"\"|''')([\s\S]*?)(?:\"\"\"|''')/.exec(x.slice(x.indexOf(em[0].split('=')[0].trim())));
      if(emb && emb[1].trim().length > 40){
        const r = cleanScript(emb[1]); const tt = /slide_title\s*=\s*[\"']([^\"']{2,80})[\"']\s*\)/.exec(x);
        if(!r.code && tt) r.text = r.text.replace(/(➡️ \*\*SLIDE 1: )[^*]*(\*\*)/, '$1' + tt[1] + '$2');
        if(!r.code){ r.notes = ['Pasted Python code detected: cleaned the sample script inside it (not the code itself)'].concat(r.notes); return r; }
      }
      return { text:x, notes:['This looks like Python code, not a lesson script — paste the script text instead'], code:true };
    } }
  { const mk = markupConvert(text); if(mk) return { text: mk, notes:['Video/markup script detected: removed tags, comments, timecodes, sound/graphics cues; kept narration only, split into sentences; scene breaks became slides with minutes from timecodes'] }; }
  { const nb = nbConvert(text); if(nb) return { text: nb, notes:['NotebookLM format detected: removed language review/intro, [cite] tags and LaTeX arrows; bullets converted to SPEAK / ASK / PAUSE steps'] }; }
  const notes = []; const imgCount = (String(text||'').match(/!\[[^\]]*\]\([^)]*\)/g) || []).length;
  let t = stripMd(String(text||'')).replace(/\r/g,'').replace(/[\u00A0\u2007\u202F]/g,' ').replace(/[\u200B\uFEFF]/g,'').replace(/\t/g,' ');
  if(imgCount) notes.push(imgCount + ' images/links removed');
  const before = t;
  const cites = (t.match(/\s?\[\d+(?:\s*,\s*\d+)*\]/g) || []).length;
  if(cites){ t = t.replace(/[ ]?\[\d+(?:\s*,\s*\d+)*\]/g,''); notes.push(cites + ' source numbers removed'); }
  let lines = t.split('\n').map(l => l.replace(/[ ]{2,}/g,' ').replace(/\s+$/,''));
  const n0 = lines.length;
  lines = lines.filter(l => !/^[\s\-_=*─━═#➡️]*[-_=─━═]{3,}[\s\-_=*─━═]*$/.test(l.trim()) && !/^💡/.test(l.trim()));
  // drop AI chatter before the script starts
  const firstReal = lines.findIndex(l => /^\s*#{1,6}\s|slide\s*\d|^\W*(?:section|part|chapter|step)\s*\d/iu.test(l));
  if(firstReal > 0 && lines.slice(0, firstReal).every(l => !l.trim() || /^(here|sure|certainly|okay|ok|below|this is|great)\b/i.test(l.trim().replace(/^\W+/,'')))){ lines = lines.slice(firstReal); notes.push('intro chatter removed'); }
  if(lines.length < n0) notes.push((n0 - lines.length) + ' divider/blank-noise lines removed');
  let out = lines.join('\n').replace(/\n{3,}/g,'\n\n').replace(/\*{4,}/g,'').trim();
  const tagged = TAGGED_RE.test(out);
  if(!tagged){ const nn = normalizeScript(out); if(nn !== out){ out = nn; notes.push('converted to standard tagged format'); } }
  else {
    let fixed = 0;
    out = out.split('\n').map(l => {
      const tl = l.trim(); if(!tl) return '';
      const m = /^([^\p{L}\p{N}\[]{0,12}?\*{0,2}\[)([A-Za-z][^\]]{1,30})(\]\*{0,2})/u.exec(tl);
      if(m){ const up = m[2].toUpperCase(); if(up !== m[2]){ fixed++; return tl.replace(m[0], m[1] + up + m[3]); } return tl; }
      const c = cleanMd(tl);
      if(/^#\s/.test(tl) || HEAD_RE.test(c) || ITEM_RE.test(tl)) return tl;
      fixed++; return '🗣️ **[SPEAK]** ' + tl;
    }).join('\n');
    if(fixed) notes.push(fixed + ' lines tagged / standardized');
  }
  if(_ar){ const o2 = out.split('\n').map(arTidyOut).join('\n'); if(o2 !== out){ out = o2; notes.push('Arabic: direction marks, labels, quotes & punctuation standardized'); } }
  // remove consecutive duplicate lines
  const dd = []; let dups = 0;
  out.split('\n').forEach(l => { if(l.trim() && dd.length && dd[dd.length-1].trim() === l.trim()) dups++; else dd.push(l); });
  if(dups){ out = dd.join('\n'); notes.push(dups + ' duplicate lines removed'); }
  { const e = enrichSpeak(out); if(e.changed){ out = e.text; notes.push('long paragraphs split into one sentence per line with bold lead-ins'); } }
  if(out === before.trim() && !notes.length) notes.push('already clean');
  return { text: out, notes };
}

/* Helpers */
const $ = id => document.getElementById(id);
const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const isRtlText = t => { t = String(t||''); return (t.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g)||[]).length > (t.match(/[A-Za-z]/g)||[]).length; };
const dirA = l => isRtlText((l.text||'') + ' ' + (l.expect||'') + ' ' + ((l.items||[]).join(' '))) ? ' dir="rtl"' : '';
const AR_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+(?:\s+[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+)*/g;

function fmt(raw){
  let s = esc(raw);
  s = s.replace(/\s?\[(\d+(?:\s*,\s*\d+)*)\]/g, (m,n) => S.cites ? ' <sup class="cite">' + n + '</sup>' : '');
  let first = true;
  s = s.replace(/\*\*(.+?)\*\*/g, (m,t) => { if(/[\u0600-\u06FF]/.test(t)) return t; const c = first ? ' class="lead"' : ''; first = false; return '<strong' + c + '>' + t + '</strong>'; });
  s = s.replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(AR_RE, '<span class="ar" dir="rtl" lang="ar">$&</span>');
  return s;
}

function dictate(){
  if(S.voice){ toast('Turn off 🎙️ voice follow first'); return; }
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ toast('Use Chrome or Edge'); return; }
  const l=S.model.steps[S.pos], a=$('ans'); if(!a) return;
  const base=S.answers[l.qid]||'', r=new SR(); r.lang='en-US'; r.interimResults=true; r.continuous=false;
  r.onresult=e=>{ let t=''; for(const x of e.results) t+=x[0].transcript; a.value=(base+' '+t).trim(); };
  r.onend=()=>{ S.answers[l.qid]=a.value; saveState(); toast('Answer saved ✓'); };
  try{ r.start(); toast('🎤 Listening…'); }catch(e){}
}
function editLine(){
  const st=S.model.steps[S.pos]; if(!st || st.kind==='pause') return;
  const v=prompt('Edit this line:', st.text); if(v===null || !v.trim() || v===st.text) return;
  pushUndo(S.script, S.pos);
  S.script=S.script.replace(st.text, () => v.trim()); st.text=v.trim();
  lsSet('lp.script', S.script); $('scriptInput').value=S.script; renderFollow(); toast('Line updated ✓');
}
function confetti(){ const e=['🎉','✨','🌟','🎊','💚']; for(let i=0;i<36;i++){ const d=document.createElement('div'); d.className='conf'; d.textContent=e[i%e.length]; d.style.left=Math.random()*100+'vw'; d.style.animationDelay=(Math.random()*.8)+'s'; document.body.appendChild(d); setTimeout(()=>d.remove(),3800); } }
function slideTimes(){ const m=S.model, cs=m.steps[S.pos].slide, out=[]; m.slides.forEach((sl,i)=>{ let t=(S.slideSec&&S.slideSec[i])||0; if(i===cs) t+=(elapsedMs()-(S.slideStart||0))/1000; out.push([sl,t]); }); return out; }
let toastT=0;
function toast(m){ const t=$('toast'); t.textContent=m; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>t.hidden=true,2200); }
function gradeCur(st){ if(!S.model) return; const l=S.model.steps[S.pos]; if(l.kind!=='pause') return; S.assess[l.qid]=st; saveState(); renderFollow(); toast({got:'✅ Got it',partly:'🟡 Partly',review:'🔁 Review'}[st]); }
function mmss(sec){ sec = Math.max(0, Math.floor(sec)); return String(Math.floor(sec/60)).padStart(2,'0') + ':' + String(sec%60).padStart(2,'0'); }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function hash(s){ let h = 5381; for(let i=0; i<s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

/* App State */
const S = {
  model: null,
  script: '',
  key: '',
  pos: 0,
  view: 'follow',
  running: false,
  runStart: 0,
  elapsed: 0,
  answers: {},
  assess: {},
  notes: '',
  finished: false,
  waitStart: Date.now(),
  filter: 'all',
  fs: 1,
  arFs: 1.25,
  cites: false,
  autoStart: false,
  wake: true,
  plannedOv: 0,
  theme: 'paper',
  focus: false,
  locked: false,
  wide: true,
  cam: false,
  voice: false,
  voiceDelay: 0.7,
  floatRP: true, readAuto: true, rate: 0.95,
  font: 'lora', arFont: 'naskh',
  rehearsing: false,
  rehearsalTimes: {},
  history: [],
  lh: 1.55, tc: '', br: 1, fw: 0,
  ai: { provider: 'groq', key: '', model: 'openai/gpt-oss-20b', age: '11-year-old student' },
  full: true, div: 'none', replacementsHistory: [], name: '',
  presenter: false, pip: null, briefOff: {},
};

let ticks = 0, wakeLock = null, speechRec = null, studentChannel = null;
let spokenBuffer = [], lastAdvanceTime = 0;

try { studentChannel = new BroadcastChannel('lesson_prompter_sync'); }catch(e){}

function broadcastSlide(slideIdx){
  if(!studentChannel || !S.model) return;
  const sl = S.model.slides[slideIdx];
  if(sl){
    studentChannel.postMessage({
      type: 'SLIDE_CHANGE',
      slideNum: sl.n,
      title: sl.title,
      totalSlides: S.model.slides.length,
      q: S.model.steps[S.pos].kind === 'ask' ? plain(S.model.steps[S.pos].text) : ''
    });
  }
}

/* Load Settings */
try {
  const p = JSON.parse(lsGet('lp.prefs') || 'null');
  if(p){
    S.fs = p.fs || 1; S.arFs = p.arFs || 1.25; S.cites = !!p.cites; S.autoStart = false;
    S.wake = !!p.wake; S.theme = p.tv === 3 ? (p.theme || 'paper') : 'paper'; S.cam = !!p.cam; S.wide = p.wide === undefined ? true : !!p.wide;
    S.lh = p.lh || 1.55; S.tc = p.tc || ''; S.br = p.br || 1; S.fw = p.fw || 0; S.font = (p.fv === 2 && p.font) ? p.font : 'lora'; S.arFont = p.arFont || 'naskh'; S.full = p.full!==false; S.div = p.dv === 2 ? (p.div || 'none') : 'none'; S.presenter = !!p.pr; S.pip = p.pip || null; S.briefOff = p.bo || {}; S.floatRP = p.fr2===undefined ? true : !!p.fr2; if(p.vd2) S.voiceDelay = +p.voiceDelay; S.name = p.name||''; S.readAuto = p.ra!==false; S.rate = p.rate||0.95;
  }
} catch(e){}

try { S.history = JSON.parse(lsGet('lp.history') || '[]'); }catch(e){ S.history = []; }

function savePrefs(){
  lsSet('lp.prefs', JSON.stringify({
    fs: S.fs, arFs: S.arFs, cites: S.cites, autoStart2: S.autoStart,
    wake: S.wake, tv: 3, theme: S.theme, cam: S.cam, wide: S.wide, lh: S.lh, tc: S.tc, br: S.br, fw: S.fw,
    font: S.font, fv: 2, arFont: S.arFont, full: S.full, div: S.div, dv: 2, name: S.name, fr2: S.floatRP, vd2: 1, ra: S.readAuto, rate: S.rate, voiceDelay: S.voiceDelay, pr: S.presenter, pip: S.pip, bo: S.briefOff
  }));
}

function elapsedMs(){ return S.elapsed + (S.running ? Date.now() - S.runStart : 0); }
function saveState(){
  if(!S.key) return;
  lsSet(S.key, JSON.stringify({
    pos: S.pos, elapsed: elapsedMs(), answers: S.answers, assess: S.assess,
    notes: S.notes, planned: S.plannedOv, rehearsalTimes: S.rehearsalTimes
  }));
}

/* Script Application */
function applyScript(text, forceKey){
  const orig = text; text = normalizeScript(text); const converted = text !== orig;
  if(converted){ try{ $('scriptInput').value = text; }catch(e){} }
  const model = parseScript(text);
  const rep = $('report');
  rep.hidden = false;
  if(!model.steps.length){
    rep.className = 'report bad';
    rep.textContent = 'No script lines found. Tag each step with [SPEAK], [ASK] or [PAUSE].';
    return false;
  }
  if(S.name) model.student = S.name;
  S.model = model;
  S.script = text;
  lsSet('lp.script', text);
  S.key = forceKey || ('lp.s.' + hash(text)); lsSet('lp.scriptkey', S.key);
  if(!forceKey){ S.undoStack = []; S.redoStack = []; try{ persistUndo(); }catch(e){} }
  
  let saved = null;
  try { saved = JSON.parse(lsGet(S.key) || 'null'); }catch(e){}
  
  S.pos = saved ? Math.min(Math.max(saved.pos || 0, 0), model.steps.length - 1) : 0;
  S.elapsed = saved ? (saved.elapsed || 0) : 0;
  S.answers = (saved && saved.answers) || {};
  S.assess = (saved && saved.assess) || {};
  S.notes = (saved && saved.notes) || '';
  S.plannedOv = (saved && saved.planned) || 0;
  S.rehearsalTimes = (saved && saved.rehearsalTimes) || {};
  S.running = false;
  S.finished = false;
  S.waitStart = Date.now();
  
  rep.className = 'report good';
  rep.textContent = 'Loaded ' + model.slides.length + ' slides, ' + model.steps.length + ' lines and ' + model.asks.length + ' questions' + (model.planned ? ', planned ' + model.planned + ' min.' : '.') + (saved && saved.pos ? ' Resumed where you left off.' : '') + (converted ? ' Script format was auto-detected and converted.' : '');
  
  calculateTimingFeasibility();
  checkLastTimeBanner();
  return true;
}

function calculateTimingFeasibility(){
  if(!S.model) return;
  let totalWords = 0;
  S.model.slides.forEach(sl => {
    let w = 0;
    sl.lines.forEach(l => { w += (l.text + ' ' + l.items.join(' ')).trim().split(/\s+/).filter(Boolean).length; });
    sl.wordCount = w;
    totalWords += w;
  });
  const estimatedMin = Math.ceil((totalWords / 125) + (S.model.asks.length * 0.5));
  const plan = plannedMin();
  const wcEl = $('wordCountEst');
  if(wcEl){
    let msg = 'Script word count: ' + totalWords + ' words (~' + estimatedMin + ' min needed). ';
    if(plan && estimatedMin > plan + 2){
      msg += '⚠️ WARNING: Plan is ' + plan + ' min. You may run out of time unless pacing is fast.';
      wcEl.style.color = 'var(--bad)';
    } else {
      msg += '✅ Pacing fits comfortably inside your planned window.';
      wcEl.style.color = 'var(--good)';
    }
    wcEl.textContent = msg;
  }
}

function checkLastTimeBanner(){
  const banner = $('lastTimeBanner');
  if(!banner) return;
  if(!S.history || !S.history.length){ banner.hidden = true; return; }
  const last = S.history[0];
  banner.hidden = false;
  banner.innerHTML = '<strong>Last time we covered (' + esc(last.date) + '):</strong> '
    + esc(last.title) + ' · Finished in ' + esc(last.time) + (last.reviewTopics ? ' · Revisit: <em>' + esc(last.reviewTopics) + '</em>' : '');
}

/* Timer & Pacing */
function startTimer(){ if(S.running) return; S.running = true; S.runStart = Date.now(); if(S.wake) setWake(true); renderClockBtn(); }
function pauseTimer(){ if(!S.running) return; S.elapsed += Date.now() - S.runStart; S.running = false; renderClockBtn(); saveState(); }
function renderClockBtn(){ const b = $('toggleTimer'); b.textContent = S.running ? 'Pause' : (S.elapsed > 0 ? 'Resume' : 'Start'); b.classList.toggle('primary', !S.running); }
function plannedMin(){ return S.plannedOv || (S.model && S.model.planned) || 0; }

function slideWindow(i){
  const m = S.model, pm = plannedMin(), sl = m.slides[i];
  if(!pm) return null;
  if(m.planned && sl.start && sl.end){
    const k = pm / m.planned;
    return [(sl.start - 1) * 60 * k, sl.end * 60 * k];
  }
  const tot = m.slides.reduce((a, x) => a + x.weight, 0);
  let c = 0; for(let j = 0; j < i; j++) c += m.slides[j].weight;
  return [c / tot * pm * 60, (c + sl.weight) / tot * pm * 60];
}

function paceInfo(){
  const m = S.model; if(!m) return { t:'', c:'' };
  const e = elapsedMs() / 1000;
  if(e < 1 && !S.running) return { t:'Timer stopped', c:'' };
  const w = slideWindow(m.steps[S.pos].slide); if(!w) return { t:'No time plan', c:'' };
  const ws = w[0], we = w[1];
  if(e > we){ const d = e - we; return { t:'Behind ' + mmss(d), c: d > 60 ? 'bad' : 'warn' }; }
  if(e < ws){ return { t:'Ahead ' + mmss(ws - e), c:'warn' }; }
  return { t:'On pace', c:'good' };
}

function tick(){
  if(!S.model) return;
  const e = elapsedMs() / 1000;
  $('elapsed').textContent = mmss(e);
  const p = paceInfo(), pe = $('pace');
  pe.textContent = p.t; pe.className = 'pace ' + p.c;
  if(S.running && p.c === 'bad'){ const si = S.model.steps[S.pos].slide; if(S._hint !== si){ S._hint = si; toast('⏱ Behind pace — press S to skip optional lines'); } }
  
  const cur = $('cursor');
  if(cur && plannedMin()){ cur.style.display = 'block'; cur.style.left = (Math.min(e / (plannedMin() * 60), 1) * 100) + '%'; }
  const w = $('waitClock');
  if(w){ const s = Math.floor((Date.now() - S.waitStart) / 1000); w.textContent = Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
  const tl=$('timeLeft');
  if(tl){ const m=S.model; if(!m._wc){ let a=0; m._wc=m.steps.map(x=>{ a+=(x.kind==='pause'?30:(x.text+' '+x.items.join(' ')).split(/\s+/).length); return a; }); }
    const tot=m._wc[m._wc.length-1], rem=tot-(S.pos>0?m._wc[S.pos-1]:0), mins=Math.max(0,Math.ceil(rem/125)); tl.textContent='~'+mins+' min left · '+Math.round((1-rem/tot)*100)+'%'; }
  if(++ticks % 10 === 0 && S.running) saveState();
}

async function setWake(on){
  try{
    if(on && 'wakeLock' in navigator && !wakeLock){ wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', ()=>{ wakeLock = null; }); }
    else if(!on && wakeLock){ await wakeLock.release(); wakeLock = null; }
  }catch(e){ wakeLock = null; }
}

