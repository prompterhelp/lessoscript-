const SAMPLE = `Here is your presenter-friendly script for **Chapter 22 (Part 2)**.

---

# 📜 LESSON SCRIPT: CHAPTER 22 (PART 2) — Returning Home & Waraqah's Confirmation

#### ════════════════════════════════════
➡️ **SLIDE 1: Returning Home & Seeking Comfort** *(Minutes 1–3)*
════════════════════════════════════

🗣️ **[SPEAK]** **Assalamu alaykum, Omar!** **Today we are continuing** Chapter 22 right after Angel Jibreel met Prophet Muhammad (ﷺ) in the Cave of Hira [1].

🗣️ **[SPEAK]** **Still shaking and** overwhelmed from seeing the angel, the Prophet (ﷺ) hurried straight back home [1].

🗣️ **[SPEAK]** **He walked inside**, went to his wife Khadijah (رضي الله عنها), and said: **"Wrap me up! Wrap me up!"** [1]

🗣️ **[SPEAK]** **Khadijah brought a** blanket right away and wrapped him up warmly until he felt safe and calm [1].

🗣️ **[SPEAK]** **Once he felt better**, he told her everything that happened in the cave and admitted that he was deeply worried [1].

❓ **[ASK OMAR]** **"Omar, when you** go through something scary or unexpected, who is the first person you turn to, and why do they make you feel safe?"

🛑 **[PAUSE]** *(Listen to Omar's answer: e.g., "My mom or dad, because they listen and help me.")*

🗣️ **[SPEAK]** **That makes total sense!** **Turn to family for** support when you feel overwhelmed [1].

---

#### ════════════════════════════════════
➡️ **SLIDE 2: Khadijah's Words of Reassurance** *(Minutes 4–7)*
════════════════════════════════════

🗣️ **[SPEAK]** **Khadijah knew the** Prophet's character better than anyone else in the world [2].

🗣️ **[SPEAK]** **Instead of panicking**, she gave him great confidence, saying: **"Never! By Allah, Allah will never disgrace you!"** [2]

🗣️ **[SPEAK]** **She reminded him** of the noble things he did every day [2]:
1. *"You are good to your relatives."* [2]
2. *"You help people who carry heavy burdens."* [2]
3. *"You give to the poor and needy."* [2]
4. *"You welcome guests generously."* [2]
5. *"You always stand up for the truth."* [2]

🗣️ **[OPTIONAL]** **[SPEAK]** Notice how each of these five daily habits strengthens our communities.

❓ **[ASK OMAR]** **"Omar, why was** Khadijah so certain that Allah would protect the Prophet? What did his daily habits show about him?"

🛑 **[PAUSE]** *(Listen to Omar's answer: e.g., "Because he was always kind, honest, and helped people in need.")*

🗣️ **[SPEAK]** **Spot on! Doing** good deeds builds a strong foundation that Allah blesses and protects [2].

---

#### ════════════════════════════════════
➡️ **SLIDE 3: Visiting Waraqah ibn Nawfal** *(Minutes 8–10)*
════════════════════════════════════

🗣️ **[SPEAK]** **To help understand** what happened, Khadijah took him to see her cousin, **Waraqah ibn Nawfal** [2, 3].

🗣️ **[SPEAK]** **Waraqah was an** old, wise scholar who spent years reading ancient religious books [2].

🗣️ **[SPEAK]** **As soon as** the Prophet (ﷺ) described the encounter, Waraqah recognized what happened and said: *"You are the Prophet of this nation!"* [3]

🗣️ **[SPEAK]** **Waraqah explained that** the visitor was Angel Jibreel—the exact same angel Allah sent to Prophet Musa (عليه السلام) long ago [3].

❓ **[ASK OMAR]** **"Omar, why was** it so helpful that Waraqah had studied ancient books before this happened?"

🛑 **[PAUSE]** *(Listen to Omar's answer: e.g., "Because he knew about angels and prophets, so he could explain what it meant.")*

🗣️ **[SPEAK]** **Exactly! Learning and** gaining knowledge helps us understand big moments in life [2, 3].

---

#### ════════════════════════════════════
➡️ **SLIDE 4: Waraqah's Warning & The Surprise** *(Minutes 11–13)*
════════════════════════════════════

🗣️ **[SPEAK]** **Waraqah then gave** a serious warning: *"I wish I were young and strong when your people drive you out of Makkah!"* [3]

🗣️ **[SPEAK]** **Prophet Muhammad (ﷺ)** was completely surprised and asked: **"Will my people really drive me out?"** [3, 4]

🗣️ **[SPEAK]** **He was surprised** because the people of Makkah respected him and called him *Al-Amin* (The Trustworthy) and *As-Sadiq* (The Truthful) [4].

🗣️ **[SPEAK]** **Waraqah explained that** whenever a Messenger brings the truth, people who dislike changing their bad habits will fight against him [4].

❓ **[ASK OMAR]** **"Omar, why do** you think people sometimes resist or fight against the truth, even when it comes from an honest person?"

🛑 **[PAUSE]** *(Listen to Omar's answer: e.g., "Because people don't like changing their ways or admitting they were wrong.")*

🗣️ **[SPEAK]** **That is a** very mature answer! Standing for what is right takes real courage [4].

---

#### ════════════════════════════════════
➡️ **SLIDE 5: Power Takeaways & Action Plan** *(Minutes 14–15)*
════════════════════════════════════

🗣️ **[SPEAK]** **Omar, here is your** 3-step action plan from today's lesson [1, 2, 4]:

🗣️ **[SPEAK]** **🎯 1. Talk to Family:** When you feel stressed or confused, share your thoughts with your parents or family [1].

🗣️ **[SPEAK]** **🎯 2. Practice Good Habits:** Help others, tell the truth, and be kind—good character earns Allah's love and protection [2].

🗣️ **[SPEAK]** **🎯 3. Stand for Truth:** Always stick to what is right, even if other people find it hard to accept [4].

🗣️ **[SPEAK]** **Great job today, Omar!** **Next time, we will** see how the revelation continued and how secret preaching began [4]!`;

/* Regex Parsers */
const TAG_RE = /^([^\p{L}\p{N}\[]{0,12}?)\*{0,2}\[([^\]]{2,32})\]\*{0,2}\s*(.*)$/u;
const HEAD_RE = /^\W*(?:slide|section|part|chapter|step|topic|stage|segment|activity|scene|page)\s*(\d+)\s*[:：.\-–—]\s*(.+?)\s*(?:\(\s*(?:minutes?|mins?)\s*(\d+)\s*(?:[–\-—]|to)\s*(\d+)\s*\))?\s*$/i;
const TAGGED_RE = /^[^\p{L}\p{N}\[\n]{0,12}\*{0,2}\[(?:optional|speak|say|read|tell|ask(?:\s+[A-Za-z]+)?|question|quiz|check|discuss|pause|wait|listen|teacher|tutor|student|answer|note|explain|intro|summary|recap|story|activity|present\w*|narrat\w*)(?:\s[A-Za-z]+)?\]/imu;
const ITEM_RE = /^\s*(?:\d+[.)]|[-•])\s+(.*)$/;
function cleanMd(s){ return String(s||'').replace(/[*_`]/g,'').replace(/^#+\s*/,'').trim(); }

function parseScript(text){
  const raw = String(text||'').replace(/\r/g,'').split('\n');
  const hasSlides = raw.some(l => HEAD_RE.test(cleanMd(l)));
  let title = { kicker:'', name:'' }, slides = [], cur = null, lastAsk = null, student = '', warnings = [];
  
  if(!hasSlides && raw.some(l=>l.trim())) warnings.push('No "SLIDE n:" headers found, so the whole script is one slide.');

  for(let line of raw){
    const t = line.trim();
    if(!t) continue;
    if(/^#\s+\S/.test(t) && !title.name){
      let c = cleanMd(t).replace(/^[^\p{L}\p{N}]+/u,'').replace(/^lesson script\s*[:\-–—]\s*/i,'');
      const parts = c.split(/\s+[—–]\s+|\s+-\s+/);
      if(parts.length > 1){ title.kicker = parts[0].trim(); title.name = parts.slice(1).join(' — ').trim(); }
      else { title.name = c; }
      continue;
    }
    const c = cleanMd(t);
    if(/^[^\p{L}\p{N}]*$/u.test(c)) continue;
    const hm = HEAD_RE.exec(c);
    if(hm){
      cur = { n:+hm[1], title:hm[2].trim(), start:hm[3]?+hm[3]:null, end:hm[4]?+hm[4]:null, lines:[] };
      slides.push(cur);
      lastAsk = null;
      continue;
    }
    if(t.startsWith('💡')) continue;
    if(!cur){
      if(hasSlides) continue;
      cur = { n:1, title:'Lesson', start:null, end:null, lines:[] };
      slides.push(cur);
    }
    const im = ITEM_RE.exec(line);
    if(im && cur.lines.length){
      cur.lines[cur.lines.length-1].items.push(im[1].trim());
      continue;
    }
    
    let isOpt = /\[OPTIONAL\]/i.test(t);
    let workText = t.replace(/\[OPTIONAL\]/i, '').trim();
    const tm = TAG_RE.exec(workText);
    let L;
    if(tm && /[A-Za-z]{2}/.test(tm[2])){
      const tag = tm[2].trim().toUpperCase();
      const kind = /^(SPEAK|SAY|READ|TELL|TEACHER|TUTOR|PRESENT|NARRAT|EXPLAIN|INTRO|SUMMARY|RECAP|STORY|ACTIVITY)/.test(tag) ? 'speak' : /^(ASK|QUESTION|QUIZ|CHECK|DISCUSS|Q\b)/.test(tag) ? 'ask' : /^(PAUSE|WAIT|LISTEN|STUDENT|ANSWER)/.test(tag) ? 'pause' : 'other';
      L = { kind, tag, text:tm[3].trim(), items:[], optional:isOpt };
      if(kind === 'ask'){
        const nm = /^ASK\s+(.+)$/.exec(tag);
        if(nm && !student) student = nm[1].charAt(0).toUpperCase() + nm[1].slice(1).toLowerCase();
      }
      if(kind === 'pause'){
        let p = tm[3].replace(/\*/g,'').trim().replace(/^\(\s*/,'').replace(/\s*\)$/,'');
        const eg = /^(.*?)\s*e\.g\.,?\s*(.*)$/i.exec(p);
        if(eg){ L.label = eg[1].replace(/[:\s]+$/,''); L.expect = eg[2].replace(/^["“”']+|["“”']+$/g,'').trim(); }
        else { L.label = p; }
        L.text = p;
      }
    } else {
      L = { kind:'other', tag:'NOTE', text:workText, items:[], optional:isOpt };
    }
    cur.lines.push(L);
    if(L.kind === 'ask') lastAsk = L;
    if(L.kind === 'pause' && lastAsk){ L.qid = lastAsk; if(L.expect) lastAsk.expect = L.expect; lastAsk = null; }
  }
  slides = slides.filter(s => s.lines.length);
  const steps = [];
  slides.forEach((s, si) => s.lines.forEach((l, li) => {
    l.slide = si; l.pos = steps.length; l.id = 's' + si + 'l' + li; steps.push(l);
  }));
  steps.forEach(l => { l.qid = (l.kind === 'pause' && l.qid && typeof l.qid === 'object') ? l.qid.id : l.id; });
  const planned = slides.length && slides.every(s => s.end) ? Math.max(...slides.map(s => s.end)) : null;
  slides.forEach(s => { s.weight = s.start && s.end ? Math.max(1, s.end - s.start + 1) : 1; });
  return { title, slides, steps, student:student||'Student', planned, warnings, asks:steps.filter(l => l.kind === 'ask') };
}

