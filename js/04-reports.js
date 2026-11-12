/* ===== Lesson Reports (localStorage: lp.reports) ===== */
const RP_SURAHS=[['Al-Fatihah',7],['Al-Baqarah',286],['Ali ‘Imran',200],['An-Nisa',176],['Al-Ma’idah',120],['Al-An‘am',165],['Al-A‘raf',206],['Al-Anfal',75],['At-Tawbah',129],['Yunus',109],['Hud',123],['Yusuf',111],['Ar-Ra‘d',43],['Ibrahim',52],['Al-Hijr',99],['An-Nahl',128],['Al-Isra',111],['Al-Kahf',110],['Maryam',98],['Ta-Ha',135],['Al-Anbiya',112],['Al-Hajj',78],['Al-Mu’minun',118],['An-Nur',64],['Al-Furqan',77],['Ash-Shu‘ara',227],['An-Naml',93],['Al-Qasas',88],['Al-‘Ankabut',69],['Ar-Rum',60],['Luqman',34],['As-Sajdah',30],['Al-Ahzab',73],['Saba',54],['Fatir',45],['Ya-Sin',83],['As-Saffat',182],['Sad',88],['Az-Zumar',75],['Ghafir',85],['Fussilat',54],['Ash-Shura',53],['Az-Zukhruf',89],['Ad-Dukhan',59],['Al-Jathiyah',37],['Al-Ahqaf',35],['Muhammad',38],['Al-Fath',29],['Al-Hujurat',18],['Qaf',45],['Adh-Dhariyat',60],['At-Tur',49],['An-Najm',62],['Al-Qamar',55],['Ar-Rahman',78],['Al-Waqi‘ah',96],['Al-Hadid',29],['Al-Mujadila',22],['Al-Hashr',24],['Al-Mumtahanah',13],['As-Saff',14],['Al-Jumu‘ah',11],['Al-Munafiqun',11],['At-Taghabun',18],['At-Talaq',12],['At-Tahrim',12],['Al-Mulk',30],['Al-Qalam',52],['Al-Haqqah',52],['Al-Ma‘arij',44],['Nuh',28],['Al-Jinn',28],['Al-Muzzammil',20],['Al-Muddaththir',56],['Al-Qiyamah',40],['Al-Insan',31],['Al-Mursalat',50],['An-Naba’',40],['An-Nazi‘at',46],['‘Abasa',42],['At-Takwir',29],['Al-Infitar',19],['Al-Mutaffifin',36],['Al-Inshiqaq',25],['Al-Buruj',22],['At-Tariq',17],['Al-A‘la',19],['Al-Ghashiyah',26],['Al-Fajr',30],['Al-Balad',20],['Ash-Shams',15],['Al-Layl',21],['Ad-Duha',11],['Ash-Sharh',8],['At-Tin',8],['Al-‘Alaq',19],['Al-Qadr',5],['Al-Bayyinah',8],['Az-Zalzalah',8],['Al-‘Adiyat',11],['Al-Qari‘ah',11],['At-Takathur',8],['Al-‘Asr',3],['Al-Humazah',9],['Al-Fil',5],['Quraysh',4],['Al-Ma‘un',7],['Al-Kawthar',3],['Al-Kafirun',6],['An-Nasr',3],['Al-Masad',5],['Al-Ikhlas',4],['Al-Falaq',5],['An-Nas',6]];
const RP_OPTS='<option value="">Select surah…</option>'+RP_SURAHS.map((x,i)=>'<option value="'+(i+1)+'">'+(i+1)+'. '+x[0]+' ('+x[1]+')</option>').join('');
const RP_SUBJECTS={
  quran:{label:'Qur’an',icon:'📖'},
  arabic:{label:'Arabic Language',icon:'✍️',ph:'Tap a starter above, then finish the sentence…',st:['We covered…','We practised reading…','We learned the letters…','We reviewed…','We practised writing…','Vocabulary: …']},
  noor:{label:'Noor El-Bayan',icon:'📘'},
  tajweed:{label:'Tajweed',icon:'🎙️',ph:'Tap a starter above, then finish the sentence…',st:['We studied the rule of…','We practised applying…','We reviewed…']},
  islamic:{label:'Islamic Studies',icon:'🕌',ph:'Tap a starter above, then finish the sentence…',st:['We studied…','We discussed…','We learned about…','We reviewed…']}
};

let RPL=lsGet('lp.rep.lang')||'en';
const RP_AR={'Jazakum Allahu khayran':'جزاكم الله خيرًا','Academy':'الأكاديمية','Lesson Report':'تقرير الدرس','Student':'الطالب','Student’s Name':'اسم الطالب','Date':'التاريخ','Duration':'المدة','Subject':'المادة','Lesson Notes':'ملاحظات الدرس','Homework':'الواجب','Grade':'التقييم','Teacher':'المعلم','New Memorisation':'حفظ جديد','Revision':'مراجعة','Qur’an':'القرآن الكريم','Arabic Language':'اللغة العربية','Noor El-Bayan':'نور البيان','Tajweed':'التجويد','Islamic Studies':'الدراسات الإسلامية',' (late)':' (متأخر)',' (shortened)':' (مختصر)',' (extended)':' (ممتد)'};
const RP_GRADES_AR=['ممتاز، ما شاء الله! ⭐','جيد جدًا، استمر! 👏','جيد 👍','يحتاج إلى مزيد من التدريب 🔁'];
Object.assign(RP_AR,{'Last lesson’s homework':'واجب الدرس السابق'});
Object.assign(RP_AR,{"Lesson report": "تقرير الدرس", "Fill the form, copy the report, and send it to the parent. Every report is saved on this device.": "املأ النموذج، وانسخ التقرير، وأرسله إلى ولي الأمر. يُحفظ كل تقرير على هذا الجهاز.", "Student & lesson": "الطالب والدرس", "Student’s name": "اسم الطالب", "Date": "التاريخ", "Duration": "المدة", "hr": "ساعة", "min": "دقيقة", "Timing": "التوقيت", "On time": "في الموعد", "Late": "متأخر", "Shortened": "مختصر", "Extended": "ممتد", "Teacher name (optional)": "اسم المعلم (اختياري)", "Subjects taught (tap to add / remove)": "المواد التي تم تدريسها (اضغط للإضافة / الحذف)", "＋ Add subject": "＋ إضافة مادة", "Show Bismillah at the top of the report": "إظهار البسملة في أعلى التقرير", "New memorisation": "حفظ جديد", "Select surah…": "اختر السورة…", "＋ Add surah": "＋ إضافة سورة", "Revision": "مراجعة", "Homework": "الواجب", "↳ Same as today’s new": "↳ نفس حفظ اليوم", "What we covered": "ما تناولناه", "Page": "الصفحة", "To page (optional)": "إلى صفحة (اختياري)", "Part of page": "جزء من الصفحة", "Full page": "الصفحة كاملة", "First half": "النصف الأول", "Second half": "النصف الثاني", "Focus (reading & pronouncing words with…)": "التركيز (قراءة ونطق الكلمات التي فيها…)", "Extra note (optional)": "ملاحظة إضافية (اختياري)", "Grade": "التقييم", "Report preview": "معاينة التقرير", "💾 Save report": "💾 حفظ التقرير", "📋 Copy text": "📋 نسخ النص", "📲 WhatsApp": "📲 واتساب", "🖨️ Print / PDF": "🖨️ طباعة / PDF", "🖼️ Save as picture": "🖼️ حفظ كصورة", "➕ New report": "➕ تقرير جديد", "♻️ Start from last report": "♻️ البدء من آخر تقرير", "☁️ Cloud sync (optional)": "☁️ المزامنة السحابية (اختياري)", "Project URL": "رابط المشروع", "Anon key": "المفتاح العام", "Email": "البريد الإلكتروني", "Password": "كلمة المرور", "Sign in": "تسجيل الدخول", "🔄 Sync now": "🔄 مزامنة الآن", "Sign out": "تسجيل الخروج", "Not signed in. Reports are saved on this device only.": "لم يتم تسجيل الدخول. تُحفظ التقارير على هذا الجهاز فقط.", "📅 Monthly record": "📅 السجل الشهري", "A month-end lesson record built from your saved reports. Pick the month, then print / save as PDF or download as a Word file.": "سجل دروس شهري مبني على تقاريرك المحفوظة. اختر الشهر ثم اطبع / احفظ PDF أو نزّل ملف Word.", "Month": "الشهر", "Academy name": "اسم الأكاديمية", "Academy tagline": "شعار الأكاديمية", "🖼️ Picture": "🖼️ صورة", "📄 Word (.docx)": "📄 Word (.docx)", "📎 Upload my form": "📎 رفع نموذجي", "↩︎ Built-in form": "↩︎ النموذج الأساسي", "📋 Copy table": "📋 نسخ الجدول", "Saved reports": "التقارير المحفوظة", "No saved reports yet.": "لا توجد تقارير محفوظة بعد.", "Open": "فتح", "Copy": "نسخ", "♻️ Template": "♻️ قالب", "Hours": "ساعات", "Minutes": "دقائق", "Surah": "السورة", "From verse": "من آية", "To verse": "إلى آية", "Remove": "حذف", "Homework for next lesson": "الواجب للدرس القادم", "Search reports…": "ابحث في التقارير…", "Filter by student": "تصفية حسب الطالب", "Shown on the report": "يظهر في التقرير", "Add your own subject (e.g. Fiqh, Hadith, سيرة)": "أضف مادة (فقه، حديث…)", "e.g. Hamza": "مثال: حمزة", "e.g. 68": "مثال: 68", "e.g. He read fluently with a few mistakes.": "مثال: قرأ بطلاقة مع بعض الأخطاء.", "Tap a starter above, then finish the sentence…": "اضغط على عبارة أعلاه ثم أكمل الجملة…", "🔍 Search surah (name or number)…": "🔍 ابحث عن السورة (الاسم أو الرقم)…", "We covered…": "تناولنا…", "We practised reading…": "تدرّبنا على القراءة…", "We learned the letters…": "تعلّمنا الحروف…", "We reviewed…": "راجعنا…", "We practised writing…": "تدرّبنا على الكتابة…", "Vocabulary: …": "المفردات: …", "We studied the rule of…": "درسنا حكم…", "We practised applying…": "تدرّبنا على تطبيق…", "We studied…": "درسنا…", "We discussed…": "ناقشنا…", "We learned about…": "تعلّمنا عن…", "We practised…": "تدرّبنا على…", "We learned…": "تعلّمنا…", "Revise…": "مراجعة…", "Memorise…": "حفظ…", "Practise reading…": "التدرّب على القراءة…", "Write…": "كتابة…", "Review today’s lesson": "مراجعة درس اليوم", "Re-read today’s pages…": "إعادة قراءة صفحات اليوم…", "Shaddah": "الشدّة", "Kasrah": "الكسرة", "Fathah": "الفتحة", "Dammah": "الضمّة", "Sukoon": "السكون", "Tanween": "التنوين", "Madd (long vowels)": "المدّ", "Alif Lam (Al-)": "أل التعريف"});
const RP_SURAHS_AR=["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
Object.assign(RP_AR,{'✨ Polish with AI':'✨ تحسين بالذكاء الاصطناعي','↩︎ Undo':'↩︎ تراجع','Add your own phrase…':'أضف عبارتك الخاصة…'});
function T(x){ return RPL==='ar'&&RP_AR[x]?RP_AR[x]:x; }
function rpSub(k){ if(RP_SUBJECTS[k]) return RP_SUBJECTS[k]; if(typeof k==='string'&&k.indexOf('x_')===0) return {label:k.slice(2),icon:'📚',ph:'Tap a starter above, then finish the sentence…',st:['We covered…','We practised…','We reviewed…','We learned…']}; return null; }
function rpCS(){ try{ const a=JSON.parse(lsGet('lp.rep.cs')||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
function allSubKeys(rows){ const ks=Object.keys(RP_SUBJECTS).concat(rpCS().map(l=>'x_'+l)); (rows||[]).forEach(r=>(r.subjects||[]).forEach(k=>{ if(!ks.includes(k)&&rpSub(k)) ks.push(k); })); return ks; }
function rpDurL(m){ if(RPL!=='ar') return rpDur(m); m=+m||0; if(!m) return ''; const h=Math.floor(m/60), r=m%60; return (h?(h===1?'ساعة':h===2?'ساعتان':h+(h<11?' ساعات':' ساعة')):'')+(h&&r?' و ':'')+(r?(r===1?'دقيقة':r===2?'دقيقتان':r+(r<11?' دقائق':' دقيقة')):''); }
function rpTemplate(r){ if(!r){ toast('No saved reports yet'); return; } const o=JSON.parse(JSON.stringify(r)); o.id=null; o.date=rpToday(); rpLoad(o); REPF.id=null; toast('Template loaded — edit and save ♻️'); window.scrollTo({top:0,behavior:'smooth'}); }
function rpLastTemplate(){ const nm=$('rpName').value.trim().toLowerCase(); let a=rpAll(); const f=nm?a.filter(r=>(r.name||'').toLowerCase()===nm):[]; if(f.length) a=f; a.sort((x,y)=>(y.date||'').localeCompare(x.date||'')||(y.saved||0)-(x.saved||0)); rpTemplate(a[0]); }
async function rpMakePdf(jb,pw,ph,w,H){
  const jpg=new Uint8Array(await jb.arrayBuffer());
  const W=595.28, Hh=+(W*H/w).toFixed(2);
  const enc=new TextEncoder(), parts=[], offs=[]; let len=0;
  const add=x=>{ const u=typeof x==='string'?enc.encode(x):x; parts.push(u); len+=u.length; };
  const obj=(n,body)=>{ offs[n]=len; add(n+' 0 obj\n'+body+'\nendobj\n'); };
  add('%PDF-1.4\n');
  obj(1,'<</Type/Catalog/Pages 2 0 R>>');
  obj(2,'<</Type/Pages/Kids[3 0 R]/Count 1>>');
  obj(3,'<</Type/Page/Parent 2 0 R/MediaBox[0 0 '+W+' '+Hh+']/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>');
  offs[4]=len; add('4 0 obj\n<</Type/XObject/Subtype/Image/Width '+pw+'/Height '+ph+'/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length '+jpg.length+'>>\nstream\n'); add(jpg); add('\nendstream\nendobj\n');
  const cs='q '+W+' 0 0 '+Hh+' 0 0 cm /Im0 Do Q';
  obj(5,'<</Length '+cs.length+'>>\nstream\n'+cs+'\nendstream');
  const xr=len; let x='xref\n0 6\n0000000000 65535 f \n';
  for(let i=1;i<=5;i++) x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
  add(x+'trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n'+xr+'\n%%EOF');
  return new Blob(parts,{type:'application/pdf'});
}

async function rpToPng(html,w,name,text){
  try{
    const st=rpImgSet(), css=RP_CSS+MR_CSS+rpThemeCSS()+(window.RP_XCSS||''), host=document.createElement('div'); host.style.cssText='position:fixed;left:-99999px;top:0;width:'+w+'px;padding:'+(window.RP_XPAD==null?14:window.RP_XPAD)+'px;background:#fff;box-sizing:border-box';
    host.innerHTML='<style>'+css+'</style>'+html; document.body.appendChild(host);
    try{ await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]); }catch(e){}
    const H=host.offsetHeight; host.querySelectorAll('style').forEach(x=>x.remove()); host.style.position='static'; host.style.left='auto'; const inner=new XMLSerializer().serializeToString(host); host.remove();
    toast('Preparing picture…'); const fc=await rpFontCSS(html);
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+H+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style><![CDATA['+fc+css+']]></style>'+inner+'</div></foreignObject></svg>';
    const img=new Image(); img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); await img.decode();
    const k=Math.max(1,Math.min(st.q,Math.sqrt(16e6/(w*H))));
    const c=document.createElement('canvas'); c.width=Math.round(w*k); c.height=Math.round(H*k); const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.scale(k,k); x.drawImage(img,0,0,w,H);
    const mime=window.RP_PDF?'image/jpeg':{png:'image/png',jpg:'image/jpeg',webp:'image/webp'}[st.f], b0=await new Promise(r=>c.toBlob(r,mime,.95)); if(!b0) throw 0;
    const b=window.RP_PDF?await rpMakePdf(b0,c.width,c.height,w,H):b0;
    const ext=b.type==='application/pdf'?'pdf':b.type==='image/jpeg'?'jpg':b.type==='image/webp'?'webp':'png';
    const fname=(name||'report').replace(/[^\w\u0600-\u06FF-]+/g,'_')+'.'+ext;
    if((text||(window.matchMedia&&matchMedia('(pointer:coarse)').matches))&&navigator.canShare){ const f=new File([b],fname,{type:b.type}); if(navigator.canShare({files:[f]})){ try{ await navigator.share(text?{files:[f],text}:{files:[f]}); return; }catch(e){ if(e&&e.name==='AbortError') return; } } }
    const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=fname; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); toast('Picture saved \u2713 '+c.width+'\u00d7'+c.height+(k<st.q?' (max for this device)':'')); if(text) setTimeout(()=>window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank'),500);
  }catch(e){ toast('Could not make a picture here — use Print / PDF'); }
}

function rpNorm(x){ return String(x).toLowerCase().replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[^a-z0-9؀-ۿ]/g,''); }
function rpOpts(q,sel){ q=rpNorm(q||''); const ar=RPL==='ar'; let o='<option value="">'+(ar?'اختر السورة…':'Select surah…')+'</option>';
  RP_SURAHS.forEach((x,i)=>{ const a=RP_SURAHS_AR[i]; if(q&&!(String(i+1)===q||rpNorm(x[0]).includes(q)||rpNorm(a).includes(q))) return; o+='<option value="'+(i+1)+'"'+(String(i+1)===String(sel)?' selected':'')+'>'+(i+1)+'. '+(ar?a:x[0])+' ('+x[1]+')</option>'; }); return o; }
function rpSurahTxt(i,f,t,n){ if(RPL==='ar') return 'سورة '+RP_SURAHS_AR[i-1]+(f===1&&t===n?' (كاملة)':f===t?' (الآية '+f+')':' (الآيات '+f+'–'+t+')'); return 'Surah '+RP_SURAHS[i-1][0]+(f===1&&t===n?' (full surah)':f===t?' (verse '+f+')':' (verses '+f+'–'+t+')'); }
const rpOrig=new WeakMap();
function rpUI(){
  const v=$('view-reports'); if(!v) return; const ar=RPL==='ar';
  const tr=s=>{ const m=/^([^A-Za-z؀-ۿ]*)([\s\S]*?)(\s*)$/.exec(s), k=m[2], all=/^All students \((\d+)\)$/.exec(k); if(all) return m[1]+'كل الطلاب ('+all[1]+')'+m[3]; const a=RP_AR[k]||RP_AR[s.trim()]; return a?(RP_AR[s.trim()]?'':m[1])+a+m[3]:s; };
  const w=document.createTreeWalker(v,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode.closest('#rpMonthView,#rpPreview,#rpGallery,#rpDesignPv,.ct,#rpLangBar,script,style,textarea')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}), ns=[]; while(w.nextNode()) ns.push(w.currentNode);
  ns.forEach(n=>{ let o=rpOrig.get(n); if(o===undefined){ o=n.textContent; rpOrig.set(n,o); } n.textContent=ar?tr(o):o; });
  v.querySelectorAll('[dir="auto"],[data-da]').forEach(el=>{ if(el.closest('#rpPreview,#rpMonthView,#rpGallery,#rpDesignPv,.ct')) return; if(ar){ el.dataset.da='1'; el.dir='rtl'; } else if(el.dataset.da){ el.dir='auto'; delete el.dataset.da; } });
  ['placeholder','aria-label','title'].forEach(a=>v.querySelectorAll('['+a+']').forEach(el=>{ const k='o'+a.replace('-',''); if(el.dataset[k]===undefined) el.dataset[k]=el.getAttribute(a); el.setAttribute(a,ar?tr(el.dataset[k]):el.dataset[k]); }));
}
function rpSetLang(l){ RPL=l==='ar'?'ar':'en'; lsSet('lp.rep.lang',RPL); const v=$('view-reports'); v.dir=RPL==='ar'?'rtl':'ltr'; v.lang=RPL; document.querySelectorAll('#rpLangBar [data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===RPL))); rpChips(); rpBuildSections(); rpPreview(); rpList(); }
['rpChips','rpBuildSections','rpList'].forEach(n=>{ const f=window[n]; window[n]=function(){ const r=f.apply(this,arguments); rpUI(); return r; }; });

const RP_POL={};
async function rpPolish(btn,act){
  const k=btn.dataset.for, ta=[...document.querySelectorAll('#rpSections textarea[data-k]')].find(x=>x.dataset.k===k); if(!ta) return;
  const setV=v=>{ ta.value=v; if(k[0]==='d') REPF.data[k.slice(2)]=v; else REPF.hw[k.slice(2)]=v; rpPreview(); };
  const undo=btn.parentNode.querySelector('[data-act="polundo"]');
  if(act==='polundo'){ if(RP_POL[k]!=null) setV(RP_POL[k]); undo.hidden=true; return; }
  const txt=ta.value.trim(); if(!txt){ toast(RPL==='ar'?'اكتب الوصف أولًا':'Write the description first'); return; }
  if(!S.ai.key){ toast(RPL==='ar'?'أضف مفتاح API في الإعدادات (Setup)':'Add your API key in Setup first'); return; }
  const kind=k[0]==='h'?'homework instruction for the student':'description of what was covered in the lesson', lang=(/[؀-ۿ]/.test(txt)||RPL==='ar')?'Arabic':'English';
  const old=btn.textContent; btn.disabled=true; btn.textContent='…';
  try{
    let out=await callAI('Rewrite this teacher’s '+kind+' for a parent report. Fix grammar and spelling and make it clear, polished and professional yet warm, in 1–3 short sentences. Keep every fact exactly (names, surahs, pages, verses, numbers); add no new information. Write in '+lang+'. Output ONLY the rewritten text, no quotes, no explanation.\n\nText: '+txt);
    out=String(out||'').trim().replace(/^["“”«]+|["“”»]+$/g,'').trim(); if(!out) throw new Error('Empty result');
    RP_POL[k]=ta.value; setV(out); if(undo) undo.hidden=false; toast('Polished ✅');
  }catch(e){ toast(String(e.message||e).slice(0,90)); }
  btn.disabled=false; btn.textContent=old;
}
const RP_HWST=['Revise…','Memorise…','Practise reading…','Write…','Review today’s lesson'];
const RP_TOPICS=['Shaddah','Kasrah','Fathah','Dammah','Sukoon','Tanween','Madd (long vowels)','Alif Lam (Al-)'];
const RP_GRADES=['Excellent, MashaAllah! ⭐','Very good, keep it up! 👏','Good 👍','Needs more practice 🔁'];
const RP_CSS=`.rc{--g:#1F4D43;--g2:#2F6B5C;--gold:#B8923A;--mut:#6B756F;max-width:560px;margin:0 auto;background:#FBF7EE;color:#25302D;border-radius:18px;overflow:hidden;border:1px solid #E3D9BF;box-shadow:0 8px 28px rgba(31,77,67,.14);font-family:Georgia,'Lora',serif;line-height:1.6;font-weight:500;text-align:start}
.rc-head{background:linear-gradient(135deg,var(--g),var(--g2));color:#fff;text-align:center;padding:20px 18px 16px;border-bottom:4px solid var(--gold)}
.rc-bis{font-size:1.55rem;opacity:.95;margin-bottom:6px;direction:rtl;font-family:'Amiri','Traditional Arabic',serif}
.rc-ac{font-size:.82rem;letter-spacing:.22em;font-weight:700;text-transform:uppercase;opacity:.92;margin-top:4px}
.rc-title{font-size:1.7rem;font-weight:700;letter-spacing:.04em}
.rc-teacher{font-size:.94rem;opacity:.85;margin-top:2px}
.rc-info{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#E3D9BF;border-bottom:1px solid #E3D9BF}
.rc-info div{background:#fff;padding:10px 14px}
.rc-info small{display:block;font-size:.76rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);font-weight:700}
.rc-info b{font-size:1.12rem;color:#25302D}
.rc-sec{padding:14px 18px 4px}
.rc-h{font-size:.86rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);font-weight:800;margin:0 0 8px;display:flex;align-items:center;gap:8px}
.rc-h:after{content:"";flex:1;height:1px;background:#E3D9BF}
.rc-sub{background:#fff;border:1px solid #E8DFC8;border-inline-start:4px solid var(--g2);border-radius:10px;padding:10px 12px;margin-bottom:10px}
.rc-hw{border-inline-start-color:var(--gold)}
.rc-subh{font-weight:700;color:var(--g);margin-bottom:4px}
.rc-row{margin:4px 0;font-size:1.08rem;white-space:pre-wrap}
.rc-k{display:inline-block;font-size:.94rem;font-weight:800;color:#fff;background:var(--g2);border-radius:6px;padding:1px 8px;margin-inline-end:8px;vertical-align:1px}
.rc-grade{margin:8px 18px 18px;text-align:center;padding:12px;border-radius:12px;background:linear-gradient(135deg,#FFF6DC,#F6E7B8);border:1px solid #E3CB7E;color:#6B4E00;font-weight:800;font-size:1.22rem}
.rc-grade small{display:block;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;font-weight:700;opacity:.8}
.mr{max-width:760px;margin:0 auto;background:#fff;color:#1d2623;border:1px solid #D9D2BC;border-radius:14px;overflow:hidden;font-family:Georgia,'Lora',serif}
.mr-head{background:linear-gradient(135deg,#1F4D43,#2F6B5C);color:#fff;text-align:center;padding:18px 14px;border-bottom:4px solid #B8923A}
.mr-ac{font-size:1.3rem;font-weight:800;letter-spacing:.16em}.mr-t{font-size:1.05rem;margin-top:4px}.mr-s{font-size:.8rem;opacity:.85;margin-top:2px}
.mr-sec{padding:10px 12px;overflow-x:auto}
.mr-h{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:#B8923A;font-weight:800;margin:6px 0}
.mr table{width:100%;border-collapse:collapse;font-size:.86rem}
.mr td,.mr th{border:1px solid #E3D9BF;padding:6px 9px;text-align:left;vertical-align:top}
.mr th{background:#F3ECD6;color:#1F4D43;font-size:.72rem;letter-spacing:.05em;text-transform:uppercase}
.mr td.k{background:#FBF7EE;font-weight:700;color:#1F4D43;width:22%}
.mr tbody tr:nth-child(even) td{background:#FCFAF3}`;
const RP_PAT='radial-gradient(circle at 50% 50%,transparent 0 7px,rgba(255,255,255,.14) 7px 8px,transparent 8px),conic-gradient(from 45deg at 50% 50%,rgba(255,255,255,.08) 0 25%,transparent 0 50%,rgba(255,255,255,.08) 0 75%,transparent 0)';
const RP_LAY=`.rc{background:var(--bg);border-color:var(--ln)}.rc-info{background:var(--ln);border-bottom-color:var(--ln)}.rc-h:after{background:var(--ln)}.rc-sub{border-block-color:var(--ln);border-inline-end-color:var(--ln)}.rc-grade{background:var(--tg);border-color:var(--gold);color:var(--g)}
.rc.lay-elegant{border:4px double var(--gold);border-radius:6px;box-shadow:none;padding:8px 6px}
.rc.lay-elegant .rc-head{background:none;color:var(--g);border:0;padding:20px 12px 8px}
.rc.lay-elegant .rc-bis{color:var(--gold);font-size:1.3rem}
.rc.lay-elegant .rc-title{font-size:1.9rem;font-weight:600;letter-spacing:.08em}
.rc.lay-elegant .rc-title:after{content:"✦  ✦  ✦";display:block;font-size:.55rem;color:var(--gold);letter-spacing:.5em;margin-top:8px}
.rc.lay-elegant .rc-teacher{color:var(--g2)}
.rc.lay-elegant .rc-info{display:flex;flex-wrap:wrap;gap:0;background:none;border:0;border-block:1px solid var(--gold);margin:6px 16px}
.rc.lay-elegant .rc-info div{background:none;flex:1 1 45%;text-align:center;padding:8px 6px}
.rc.lay-elegant .rc-info small{color:var(--gold)}.rc.lay-elegant .rc-info b{color:var(--g)}
.rc.lay-elegant .rc-h{justify-content:center;color:var(--g)}.rc.lay-elegant .rc-h:before{content:"";flex:1;height:1px;background:var(--gold)}.rc.lay-elegant .rc-h:after{background:var(--gold)}
.rc.lay-elegant .rc-sub{background:none;border:0;border-bottom:1px dashed var(--gold);border-radius:0;padding:6px 4px}
.rc.lay-elegant .rc-k{background:none;color:var(--gold);border:1px solid var(--gold)}
.rc.lay-elegant .rc-grade{background:none;border:3px double var(--gold);border-radius:50px;width:72%;margin:14px auto 18px;color:var(--g)}
.rc.lay-modern{border:0;border-radius:24px;background:#fff;box-shadow:0 10px 40px rgba(0,0,0,.12)}
.rc.lay-modern .rc-head{background:none;color:var(--g);text-align:start;padding:24px 22px 8px;border:0}
.rc.lay-modern .rc-head:before{content:"";display:block;width:46px;height:6px;border-radius:6px;background:var(--gold);margin-bottom:12px}
.rc.lay-modern .rc-title{font-size:1.7rem;font-weight:800;letter-spacing:0}.rc.lay-modern .rc-bis{font-size:1rem;opacity:.7}
.rc.lay-modern .rc-info{display:flex;flex-wrap:wrap;gap:8px;background:none;border:0;padding:8px 22px 4px}
.rc.lay-modern .rc-info div{flex:1 1 120px;background:var(--bg);border-radius:12px;padding:8px 12px}
.rc.lay-modern .rc-h{color:var(--g);letter-spacing:.04em;text-transform:none;font-size:.9rem}.rc.lay-modern .rc-h:after{display:none}
.rc.lay-modern .rc-h:before{content:"";width:8px;height:8px;border-radius:50%;background:var(--gold)}
.rc.lay-modern .rc-sec{padding:12px 22px 2px}
.rc.lay-modern .rc-sub{background:var(--bg);border:0;border-radius:14px;padding:12px 14px}
.rc.lay-modern .rc-k{background:var(--g)}
.rc.lay-modern .rc-grade{margin:8px 22px 22px;background:linear-gradient(120deg,var(--g),var(--g2));color:#fff;border:0;border-radius:16px;padding:14px 18px}
.rc.lay-geo{border:2px solid var(--g);border-radius:0 0 22px 22px}
.rc.lay-geo .rc-head{background-color:var(--g);background-image:${RP_PAT};background-size:28px 28px;border-bottom:5px double var(--gold);border-radius:0 0 50% 50%/0 0 22px 22px;padding:26px 18px 32px}
.rc.lay-geo .rc-bis{color:var(--gold)}
.rc.lay-geo .rc-title:before,.rc.lay-geo .rc-title:after{content:"❖";color:var(--gold);margin:0 .5em;font-size:.7em}
.rc.lay-geo .rc-info{gap:8px;padding:14px 12px 4px;background:none;border:0}
.rc.lay-geo .rc-info div{background:#fff;border:1px solid var(--ln);border-radius:4px 14px 4px 14px}
.rc.lay-geo .rc-h{color:var(--g)}.rc.lay-geo .rc-h:before{content:"◆";color:var(--gold)}
.rc.lay-geo .rc-sub{background:#fff;border-radius:4px 14px 4px 14px;border-inline-start-color:var(--gold)}
.rc.lay-geo .rc-grade{border-radius:4px 14px 4px 14px;background:var(--g);color:var(--gold);border:2px solid var(--gold)}
.rc.lay-minimal{border:0;border-radius:0;box-shadow:none;background:#fff;color:#222}
.rc.lay-minimal .rc-head{background:none;color:#111;text-align:start;padding:26px 22px 10px;border:0}
.rc.lay-minimal .rc-title{font-size:2rem;font-weight:300;letter-spacing:-.01em}.rc.lay-minimal .rc-bis,.rc.lay-minimal .rc-teacher{color:#777}
.rc.lay-minimal .rc-info{display:flex;flex-wrap:wrap;gap:0 26px;background:none;border:0;border-block:1px solid #ddd;margin:6px 22px;padding:10px 0}
.rc.lay-minimal .rc-info div{background:none;padding:4px 0}.rc.lay-minimal .rc-info small{color:var(--gold)}
.rc.lay-minimal .rc-h{color:var(--g);letter-spacing:.2em;font-size:.68rem}.rc.lay-minimal .rc-h:after{background:#ddd}
.rc.lay-minimal .rc-sub{background:none;border:0;border-bottom:1px solid #eee;border-radius:0;padding:8px 0}
.rc.lay-minimal .rc-k{background:none;color:var(--g);padding:0;border-bottom:2px solid var(--gold);border-radius:0}
.rc.lay-minimal .rc-grade{background:none;border:0;border-top:2px solid var(--g);border-radius:0;text-align:start;color:var(--g);margin:10px 22px 22px;padding:12px 0 0}
.rc.lay-kids{border:4px solid var(--g);border-radius:30px}
.rc.lay-kids .rc-head{background:linear-gradient(135deg,var(--g),var(--g2));border:0;border-radius:0 0 40px 40px;padding:22px 16px 28px}
.rc.lay-kids .rc-title{font-size:1.7rem;font-weight:800}.rc.lay-kids .rc-title:before{content:"🌟 "}.rc.lay-kids .rc-title:after{content:" 🌟"}
.rc.lay-kids .rc-info{display:flex;flex-wrap:wrap;gap:8px;background:none;border:0;padding:14px 12px 4px}
.rc.lay-kids .rc-info div{flex:1 1 40%;background:#fff;border:2px dashed var(--gold);border-radius:16px}.rc.lay-kids .rc-info b{color:var(--g)}
.rc.lay-kids .rc-h{color:var(--g)}
.rc.lay-kids .rc-sub{border:0;border-radius:20px}.rc.lay-kids .rc-sub:nth-child(3n+2){background:var(--t1)}.rc.lay-kids .rc-sub:nth-child(3n){background:var(--t2)}.rc.lay-kids .rc-sub:nth-child(3n+1){background:var(--t3)}
.rc.lay-kids .rc-grade{border-radius:999px;background:var(--gold);color:#fff;border:4px solid #fff;box-shadow:0 0 0 3px var(--gold);font-size:1.2rem}.rc.lay-kids .rc-grade:before{content:"⭐ "}
.mw.t .mw-ac{color:var(--g)}.mw.t .mw-t{color:var(--gold)}.mw.t td,.mw.t th{border-color:var(--ln)}.mw.t th{background:var(--g);color:#fff}.mw.t td.k{background:var(--bg);color:var(--g)}.mw.t .mw-l tr:nth-child(even) td{background:var(--bg)}.mw.t .mw-f{color:var(--gold)}
.mw.lay-elegant{border:4px double var(--gold);padding:16px 14px}.mw.lay-elegant .mw-ac{font-weight:600;letter-spacing:.14em}.mw.lay-elegant .mw-t:after{content:"✦ ✦ ✦";display:block;font-size:8pt;letter-spacing:.4em;color:var(--gold)}.mw.lay-elegant th{background:none;color:var(--g);border-bottom:2px solid var(--gold)}
.mw.lay-modern .mw-ac,.mw.lay-modern .mw-t{text-align:start}.mw.lay-modern td{border-inline:0}.mw.lay-modern th{border-color:var(--g)}
.mw.lay-geo .mw-ac{color:#fff;background-color:var(--g);background-image:${RP_PAT};background-size:28px 28px;padding:12px;border-bottom:4px double var(--gold)}.mw.lay-geo th{color:var(--gold)}
.mw.lay-minimal .mw-ac,.mw.lay-minimal .mw-t{text-align:start}.mw.lay-minimal .mw-ac{font-weight:300}.mw.lay-minimal td,.mw.lay-minimal th{border:0;border-bottom:1px solid #ddd}.mw.lay-minimal th{background:none;color:var(--g);text-transform:uppercase;font-size:8pt;letter-spacing:.1em;border-bottom:2px solid var(--g)}.mw.lay-minimal td.k{background:none}
.mw.lay-kids{border:3px solid var(--gold);border-radius:22px;padding:16px}.mw.lay-kids th:nth-child(odd){background:var(--g)}.mw.lay-kids th:nth-child(even){background:var(--gold)}.mw.lay-kids .mw-ac{color:var(--g)}
.rc.lay-aurora{border:0;border-radius:28px;background:var(--bg);box-shadow:0 18px 50px rgba(0,0,0,.14)}
.rc.lay-aurora .rc-head{background:linear-gradient(135deg,var(--g),var(--g2));border:0;text-align:start;padding:28px 24px 56px;position:relative;overflow:hidden}
.rc.lay-aurora .rc-head:before{content:"";position:absolute;width:230px;height:230px;border-radius:50%;background:rgba(255,255,255,.13);top:-95px;inset-inline-end:-60px}
.rc.lay-aurora .rc-head:after{content:"";position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08);bottom:-55px;inset-inline-start:34%}
.rc.lay-aurora .rc-title{font-size:1.85rem;font-weight:800;letter-spacing:-.01em;position:relative;z-index:1}
.rc.lay-aurora .rc-bis{text-align:start;font-size:1.05rem;opacity:.9;position:relative;z-index:1}
.rc.lay-aurora .rc-teacher{position:relative;z-index:1}
.rc.lay-aurora .rc-info{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:none;border:0;margin:-36px 16px 4px;position:relative;z-index:2}
.rc.lay-aurora .rc-info div{background:#fff;border-radius:16px;box-shadow:0 8px 22px rgba(0,0,0,.09);padding:10px 14px}
.rc.lay-aurora .rc-info small{color:var(--g2)}
.rc.lay-aurora .rc-sec{padding:14px 16px 2px}
.rc.lay-aurora .rc-h{color:var(--g);font-size:.78rem}.rc.lay-aurora .rc-h:after{background:linear-gradient(90deg,var(--ln),transparent)}
.rc.lay-aurora .rc-sub{background:#fff;border:0;border-radius:18px;box-shadow:0 4px 16px rgba(0,0,0,.06);padding:14px 16px;position:relative}
.rc.lay-aurora .rc-sub:before{content:"";position:absolute;inset-inline-start:0;top:14px;bottom:14px;width:4px;border-radius:4px;background:linear-gradient(var(--g),var(--g2))}
.rc.lay-aurora .rc-hw:before{background:var(--gold)}
.rc.lay-aurora .rc-k{background:var(--t1);color:var(--g);border-radius:999px;padding:2px 10px}
.rc.lay-aurora .rc-grade{background:linear-gradient(135deg,var(--g),var(--g2));color:#fff;border:0;border-radius:20px;margin:10px 16px 20px;padding:16px;box-shadow:0 12px 26px rgba(0,0,0,.18)}
.rc.lay-soft{border:0;border-radius:32px;background:var(--bg);box-shadow:0 12px 36px rgba(0,0,0,.08)}
.rc.lay-soft .rc-head{background:none;color:var(--g);border:0;padding:30px 20px 10px}
.rc.lay-soft .rc-bis{color:var(--g2)}
.rc.lay-soft .rc-title{font-size:1.65rem;font-weight:800}
.rc.lay-soft .rc-title:after{content:"";display:block;width:56px;height:5px;border-radius:5px;background:var(--gold);margin:10px auto 0}
.rc.lay-soft .rc-info{display:flex;flex-wrap:wrap;gap:8px;background:none;border:0;padding:8px 16px 4px}
.rc.lay-soft .rc-info div{flex:1 1 40%;background:#fff;border-radius:999px;padding:8px 18px;text-align:center;box-shadow:inset 0 0 0 1.5px var(--ln)}
.rc.lay-soft .rc-h{justify-content:center;color:var(--g2)}.rc.lay-soft .rc-h:before,.rc.lay-soft .rc-h:after{content:"";flex:1;height:2px;border-radius:2px;background:var(--ln)}
.rc.lay-soft .rc-sub{background:#fff;border:0;border-radius:24px;padding:14px 18px;box-shadow:0 3px 0 var(--ln)}
.rc.lay-soft .rc-k{background:var(--gold);border-radius:999px}
.rc.lay-soft .rc-grade{border-radius:999px;background:var(--g);color:#fff;border:0;margin:10px 20px 22px}
.rc.lay-noir{background:#0F1720;color:#E7ECEF;border:1px solid rgba(255,255,255,.08);border-radius:24px;box-shadow:0 18px 50px rgba(0,0,0,.4)}
.rc.lay-noir .rc-head{background:linear-gradient(180deg,rgba(255,255,255,.06),transparent);color:var(--gold);border:0;border-bottom:1px solid var(--gold);padding:26px 20px 18px}
.rc.lay-noir .rc-title{font-size:1.7rem;font-weight:700;letter-spacing:.06em}
.rc.lay-noir .rc-info{background:none;gap:1px;border:0}
.rc.lay-noir .rc-info div{background:rgba(255,255,255,.04)}.rc.lay-noir .rc-info small{color:var(--gold)}.rc.lay-noir .rc-info b{color:#fff}
.rc.lay-noir .rc-h{color:var(--gold)}.rc.lay-noir .rc-h:after{background:rgba(255,255,255,.14)}
.rc.lay-noir .rc-sub{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-inline-start:3px solid var(--gold);border-radius:14px}
.rc.lay-noir .rc-subh{color:#fff}.rc.lay-noir .rc-k{background:var(--gold);color:#111}
.rc.lay-noir .rc-grade{background:none;border:1px solid var(--gold);color:var(--gold);border-radius:14px}
.rc.lay-ribbon{border:0;border-inline-start:14px solid var(--g);border-radius:8px;background:#fff;box-shadow:0 10px 32px rgba(0,0,0,.1)}
.rc.lay-ribbon .rc-head{background:none;color:var(--g);text-align:start;border:0;padding:26px 22px 8px}
.rc.lay-ribbon .rc-bis{color:var(--gold)}
.rc.lay-ribbon .rc-title{font-size:2.1rem;font-weight:800;line-height:1.1;text-transform:uppercase;letter-spacing:.02em}
.rc.lay-ribbon .rc-title:after{content:"";display:block;width:100%;height:3px;background:linear-gradient(90deg,var(--gold),transparent);margin-top:12px}
.rc.lay-ribbon .rc-info{display:flex;flex-wrap:wrap;gap:0 24px;background:none;border:0;padding:8px 22px}
.rc.lay-ribbon .rc-info div{background:none;padding:4px 0;flex:1 1 40%}.rc.lay-ribbon .rc-info small{color:var(--g2)}
.rc.lay-ribbon .rc-sec{padding:12px 22px 2px}
.rc.lay-ribbon .rc-h{color:var(--g)}
.rc.lay-ribbon .rc-sub{background:var(--bg);border:0;border-radius:6px;border-inline-start:4px solid var(--g2)}
.rc.lay-ribbon .rc-grade{background:var(--g);color:#fff;border:0;border-radius:6px;text-align:start;margin:10px 22px 22px;padding:14px 18px}
.mw.lay-aurora .mw-ac,.mw.lay-soft .mw-ac,.mw.lay-ribbon .mw-ac,.mw.lay-noir .mw-ac{color:var(--g)}
.mw.lay-aurora th,.mw.lay-ribbon th{background:linear-gradient(90deg,var(--g),var(--g2));color:#fff}
.mw.lay-soft td,.mw.lay-soft th{border-radius:0}.mw.lay-noir th{background:var(--g);color:var(--gold)}
`;
const REPF={id:null,subjects:['quran','arabic'],data:{},hw:{},grade:RP_GRADES[0],ready:false};
function rpAll(){ try{ const a=JSON.parse(lsGet('lp.reports')||'[]'); return Array.isArray(a)?a.filter(r=>!r||r.kind!=='script'):[]; }catch(e){ return []; } }
function rpStore(a){ lsSet('lp.reports',JSON.stringify(a)); }
function rpMerge(list){ const a=rpAll(), ids=new Set(a.map(r=>r.id)); list.forEach(r=>{ if(r&&r.id&&!ids.has(r.id)) a.push(r); }); rpStore(a); }
function rpEsc(t){ return String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function rpToday(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function rpDMY(iso){ const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(iso||''); return m?m[3]+'/'+m[2]+'/'+m[1]:(iso||''); }
function rpDur(m){ m=+m||0; if(!m) return ''; const h=Math.floor(m/60), r=m%60; return (h?h+(h>1?' hours':' hour'):'')+(h&&r?' ':'')+(r?r+(r>1?' minutes':' minute'):''); }
function rpJoin(a){ const ar=RPL==='ar'; return a.length>1?a.slice(0,-1).join(ar?'، ':', ')+(ar?' و':' and ')+(ar?'':' ')+a[a.length-1]:(a[0]||''); }
function rpQ(a){
  const ar=RPL==='ar', nm=i=>ar?RP_SURAHS_AR[i-1]:RP_SURAHS[i-1][0], out=[], it=[];
  (Array.isArray(a)?a:[]).forEach(e=>{ const sr=RP_SURAHS[(+e.s)-1]; if(!sr) return; const n=sr[1], f=Math.max(1,Math.min(+e.f||1,n)), t=Math.max(f,Math.min(+e.t||n,n)); it.push({s:+e.s,f:f,t:t,n:n,full:f===1&&t===n}); });
  let pend=[]; const flush=()=>{ if(pend.length>=3) out.push((ar?'سور ':'Surahs ')+pend.map(x=>nm(x.s)).join(ar?'، ':', ')+(ar?' (كاملة)':' (full)')); else pend.forEach(x=>out.push(rpSurahTxt(x.s,x.f,x.t,x.n))); pend=[]; };
  for(let i=0;i<it.length;){
    const x=it[i];
    if(x.full){
      let j=i, d=(i+1<it.length&&it[i+1].full)?it[i+1].s-x.s:0;
      if(d===1||d===-1){ while(j+1<it.length&&it[j+1].full&&it[j+1].s-it[j].s===d) j++; }
      const k=j-i+1;
      if(k>=3){ flush(); out.push(ar?'من سورة '+nm(x.s)+' إلى سورة '+nm(it[j].s)+' ('+k+(k<=10?' سور':' سورة')+' كاملة)':'Surah '+nm(x.s)+' to Surah '+nm(it[j].s)+' ('+k+' full surahs)'); i=j+1; continue; }
      pend.push(x); i++; continue;
    }
    flush(); out.push(rpSurahTxt(x.s,x.f,x.t,x.n)); i++;
  }
  flush(); return out;
}
function rpVal(v){ return Array.isArray(v)?rpQ(v).join(RPL==='ar'?'؛ ':'; '):(typeof v==='string'?v.trim():''); }
function rpNoor(d){
  const p=(d['noor.page']||'').trim(), p2=(d['noor.page2']||'').trim(), part=d['noor.part']||'', tp=d['noor.topics']||[], note=(d['noor.note']||'').trim();
  if(!p&&!note&&!tp.length) return '';
  if(RPL==='ar'){ const w=(p2&&p2!==p)?'الصفحات '+p+'–'+p2:(part==='first'?'النصف الأول من الصفحة ':part==='second'?'النصف الثاني من الصفحة ':'الصفحة ')+p; let a=p?'تناولنا '+w+' في نور البيان':'عملنا في نور البيان'; if(tp.length) a+='، مع التركيز على قراءة ونطق الكلمات التي فيها '+rpJoin(tp.map(T)); a+='.'; if(note) a+=' '+note; return a; }
  let s;
  if(p){ const w=(p2&&p2!==p)?'pages '+p+'–'+p2:(part==='first'?'the first half of page ':part==='second'?'the second half of page ':'page ')+p; s='We covered '+w+' in Noor El-Bayan'; }
  else s='We worked in Noor El-Bayan';
  if(tp.length) s+=', focusing on reading and pronouncing words with '+rpJoin(tp);
  s+='.'; if(note) s+=' '+note;
  return s;
}
function rpCur(){
  return {id:REPF.id,name:$('rpName').value.trim(),date:$('rpDate').value,dur:String((+$('rpH').value||0)*60+(+$('rpM').value||0)||''),timing:$('rpTime').value,
    teacher:$('rpTeacher').value.trim(),bis:$('rpBis').checked,showAc:$('rpShowAc').checked,ac:$('rpAcademy').value.trim(),subjects:REPF.subjects.slice(),data:REPF.data,hw:REPF.hw,grade:REPF.grade};
}
function rpModel(r){
  const subs=(r.subjects||[]).filter(k=>rpSub(k)), notes=[], hw=[], d=r.data||{}, h=r.hw||{};
  subs.forEach(k=>{
    const S=rpSub(k), rows=[];
    if(k==='quran'){ [['new','New Memorisation'],['rev','Revision']].forEach(f=>{ const v=rpVal(d['quran.'+f[0]]); if(v) rows.push([T(f[1]),v]); }); }
    else if(k==='noor'){ const v=rpNoor(d); if(v) rows.push(['',v]); }
    else { const v=rpVal(d[k+'.done']); if(v) rows.push(['',v]); }
    if(rows.length) notes.push({icon:S.icon,title:T(S.label),rows});
    const hv=rpVal(h[k]); if(hv) hw.push({icon:S.icon,title:T(S.label),text:hv});
  });
  const t=T({late:' (late)',short:' (shortened)',extra:' (extended)'}[r.timing]||'');
  return {name:r.name,subj:rpJoin(subs.map(k=>T(rpSub(k).label))),date:rpDMY(r.date),dur:(rpDurL(r.dur)||'—')+t,teacher:r.teacher||'',bis:r.bis!==false,ac:(r.showAc===false?'':(r.ac||'')),notes,hw,grade:(RPL==='ar'&&RP_GRADES.indexOf(r.grade)>=0)?RP_GRADES_AR[RP_GRADES.indexOf(r.grade)]:r.grade};
}
function rpText(m){
  let t=rpText0(m);
  if(m.bis) t='بسم الله الرحمن الرحيم\n'+t;
  if(RPL==='ar') t=t.split('\n').map(l=>{ if(!l.trim()) return l; const mm=/^[*_~\-\s]*/.exec(l)[0], rest=l.slice(mm.length); return /^[\u0590-\u08FF\u200F]/.test(rest)?l:mm+'\u200F'+rest; }).join('\n');
  return t;
}
function rpText0(m){
  const sty=lsGet('lp.rep.style')||'exec';
  if(sty==='classic') return rpTextClassic(m);
  if(sty==='exec'){
    const ln='──────────────────', B=t=>'*'+String(t).trim()+'*', cap=x=>String(x).replace(/(^|\s)([a-z])/g,(q,w,c)=>w+c.toUpperCase()), L=[];
    L.push('✦ '+B(T('Lesson Report'))+' ✦',ln,B([m.name||'—',m.date,m.dur].join('  ·  ')),ln,'');
    m.notes.forEach(n=>{
      L.push(B(n.title));
      n.rows.forEach(r=>L.push('- '+(r[0]?B(r[0].replace(/^New Memori[sz]ation$/,'New'))+' — '+r[1]:r[1])));
      L.push('');
    });
    if(m.hw.length){
      L.push(ln,B(T('Homework')));
      m.hw.forEach(x=>L.push('- '+B(x.title)+' — '+x.text));
    }
    if(m.grade) L.push(ln,B(T('Grade'))+'  '+m.grade);
    L.push(ln,'','_'+T('Jazakum Allahu khayran')+'_');
    { const sg=[m.teacher,m.ac?cap(m.ac):''].filter(Boolean).join(' · '); if(sg) L.push(sg); }
    return L.join('\n').replace(/\n{3,}/g,'\n\n').trim();
  }
  const B=t=>'*'+t+'*', bar='━━━━━━━━━━━━━━━━', L=[].concat(['📋 '+B(T('Lesson Report').toUpperCase()),bar,'👤 '+B(T('Student')+':')+' '+(m.name||'—'),'📚 '+B(T('Subject')+':')+' '+m.subj,...(m.teacher?['👨‍🏫 '+B(T('Teacher')+':')+' '+m.teacher]:[]),...(m.ac?['🏫 '+B(T('Academy')+':')+' '+m.ac]:[]),'⏱️ '+B(T('Duration')+':')+' '+m.dur,'📅 '+B(T('Date')+':')+' '+m.date,bar,'']);
  if(m.notes.length){ L.push('📝 '+B(T('Lesson Notes').toUpperCase()),'');
    m.notes.forEach(n=>{ L.push(n.icon+' '+B(n.title)); n.rows.forEach(r=>L.push(r[0]?'▪️ '+r[0]+': '+r[1]:r[1])); L.push(''); }); }
  if(m.hw.length){ L.push('📌 '+B(T('Homework').toUpperCase())); m.hw.forEach(x=>L.push(x.icon+' '+B(x.title)+': '+x.text)); L.push(''); }
  if(m.grade){ L.push('🌟 '+B(T('Grade').toUpperCase()),m.grade,''); }
  L.push(bar,'_'+T('Jazakum Allahu khayran')+'_ 🤲');
  return L.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}
function rpTextClassic(m){
  const L=['📋 '+T('Lesson Report'),T('Student’s Name')+': '+(m.name||'—'),T('Subject')+': '+m.subj,T('Duration')+': '+m.dur,T('Date')+': '+m.date];
  if(m.teacher) L.push(T('Teacher')+': '+m.teacher);
  if(m.ac) L.push(T('Academy')+': '+m.ac);
  L.push('',T('Lesson Notes'));
  m.notes.forEach(n=>{ L.push(n.title+':'); n.rows.forEach(r=>L.push(r[0]?r[0]+': '+r[1]:r[1])); L.push(''); });
  if(m.hw.length){ L.push(T('Homework')); m.hw.forEach(x=>L.push('*'+x.title+'*: '+x.text)); L.push(''); }
  if(m.grade){ L.push(T('Grade'),m.grade); }
  return L.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}
function rpHTML(m,tp){
  const D=RPL==='ar'?'rtl':'ltr', e=rpEsc, info=[[T('Student'),m.name||'—'],[T('Date'),m.date],[T('Duration'),m.dur],[T('Subject'),m.subj]];
  const th=tp||rpTh('s'), sf=tp?rpStackFor(tp.f,tp.af):''; let h='<div class="rc lay-'+(th.lay||'classic')+'"'+(tp?' style="'+rpVars(tp)+(sf?';font-family:'+sf:'')+'"':'')+' dir="'+(RPL==='ar'?'rtl':'ltr')+'"><div class="rc-head">'+(m.bis?'<div class="rc-bis">بسم الله الرحمن الرحيم</div>':'')+'<div class="rc-title">'+T('Lesson Report')+'</div>'+(m.teacher?'<div class="rc-teacher" dir="'+D+'">'+T('Teacher')+': '+e(m.teacher)+'</div>':'')+(m.ac?'<div class="rc-ac" dir="auto">'+e(m.ac)+'</div>':'')+'</div>';
  h+='<div class="rc-info">'+info.map(x=>'<div><small>'+x[0]+'</small><b dir="'+D+'">'+e(x[1])+'</b></div>').join('')+'</div>';
  if(m.notes.length) h+='<div class="rc-sec"><div class="rc-h">'+T('Lesson Notes')+'</div>'+m.notes.map(n=>'<div class="rc-sub"><div class="rc-subh">'+n.icon+' '+e(n.title)+'</div>'+n.rows.map(r=>'<div class="rc-row" dir="'+D+'">'+(r[0]?'<span class="rc-k">'+e(r[0])+'</span>':'')+e(r[1])+'</div>').join('')+'</div>').join('')+'</div>';
  if(m.hw.length) h+='<div class="rc-sec"><div class="rc-h">'+T('Homework')+'</div>'+m.hw.map(x=>'<div class="rc-sub rc-hw"><div class="rc-subh">'+x.icon+' '+e(x.title)+'</div><div class="rc-row" dir="'+D+'">'+e(x.text)+'</div></div>').join('')+'</div>';
  if(m.grade) h+='<div class="rc-grade"><small>'+T('Grade')+'</small><span dir="'+D+'">'+e(m.grade)+'</span></div>';
  return h+'</div>';
}
function rpQRef(q){ const o=q==='hw'?REPF.hw:REPF.data, k=q==='hw'?'quran':'quran.'+q; if(!Array.isArray(o[k])) o[k]=[]; return o[k]; }
function rpCst(){ try{ const o=JSON.parse(lsGet('lp.rep.cst')||'{}'); return o&&typeof o==='object'?o:{}; }catch(e){ return {}; } }
function rpStarters(k,arr){ arr=arr.map(T); const cu=rpCst()[k]||[], ek=rpEsc(k), btn=(t,x)=>'<button type="button" class="rp-sc" data-act="st" data-for="'+ek+'" data-t="'+rpEsc(t.replace(/…$/,''))+'" dir="auto">'+rpEsc(t)+(x?' <span data-delst="'+ek+'" data-t="'+rpEsc(t)+'" title="Remove" style="opacity:.6">✕</span>':'')+'</button>';
  return '<div class="rp-st">'+arr.map(t=>btn(t,0)).join('')+cu.map(t=>btn(t,1)).join('')+'</div><div class="rp-st"><input class="field" dir="auto" maxlength="80" data-addst="'+ek+'" placeholder="Add your own phrase…" style="margin:0;flex:1;min-width:150px;padding:5px 10px;font-size:.85rem"><button type="button" class="rp-sc" data-act="addst" data-for="'+ek+'">＋</button></div>'; }
function rpQBlock(q,label){
  const list=rpQRef(q); if(!list.length) list.push({s:'',f:'',t:''});
  return '<label class="rp-lbl">'+label+'</label>'+list.map((e,i)=>{ const at=' data-q="'+q+'" data-i="'+i+'"';
    return '<input class="field" type="search" data-qs="1" dir="auto" placeholder="🔍 Search surah (name or number)…" style="margin:0 0 6px"><div class="rp-q"><select class="field"'+at+' data-qf="s" data-v="'+rpEsc(e.s)+'" aria-label="Surah">'+rpOpts('',e.s)+'</select><input class="field" type="number" min="1" inputmode="numeric" placeholder="From verse"'+at+' data-qf="f" value="'+rpEsc(e.f)+'"><input class="field" type="number" min="1" inputmode="numeric" placeholder="To verse"'+at+' data-qf="t" value="'+rpEsc(e.t)+'"><button type="button" class="btn small" data-act="delq"'+at+' aria-label="Remove">✕</button></div>'; }).join('')
    +'<div class="row-actions" style="margin:0 0 8px"><button type="button" class="btn small" data-act="addq" data-q="'+q+'">＋ Add surah</button>'+(q==='hw'?'<button type="button" class="btn small" data-act="sameq">↳ Same as today’s new</button>':'')+(q==='rev'?'<button type="button" class="btn small" data-act="lastq">↳ Last lesson’s homework</button>':'')+'</div>';
}
function rpBuildSections(){
  const box=$('rpSections'); box.innerHTML='';
  REPF.subjects.forEach(k=>{
    const S=rpSub(k), c=document.createElement('div'); c.className='rp-card'; let b='<h3><i>'+S.icon+'</i> '+rpEsc(S.label)+'</h3>';
    if(k==='quran'){ b+=rpQBlock('new','New memorisation')+rpQBlock('rev','Revision')+'<div data-hw="quran">'+rpQBlock('hw','Homework')+'</div>'; }
    else if(k==='noor'){
      const tp=REPF.data['noor.topics']||[];
      b+='<div class="rp-grid"><div><label class="rp-lbl">Page</label><input class="field" type="number" min="1" inputmode="numeric" data-k="d:noor.page" value="'+rpEsc(REPF.data['noor.page']||'')+'" placeholder="e.g. 68"></div>'
        +'<div><label class="rp-lbl">To page (optional)</label><input class="field" type="number" min="1" inputmode="numeric" data-k="d:noor.page2" value="'+rpEsc(REPF.data['noor.page2']||'')+'"></div>'
        +'<div><label class="rp-lbl">Part of page</label><select class="field" data-k="d:noor.part" data-v="'+rpEsc(REPF.data['noor.part']||'')+'"><option value="">Full page</option><option value="first">First half</option><option value="second">Second half</option></select></div></div>'
        +'<label class="rp-lbl">Focus (reading &amp; pronouncing words with…)</label><div class="rp-chips" style="margin-bottom:8px">'+RP_TOPICS.map(t=>'<button type="button" class="rp-chip" data-act="tp" data-t="'+rpEsc(t)+'" aria-pressed="'+tp.includes(t)+'">'+rpEsc(t)+'</button>').join('')+'</div>'
        +'<label class="rp-lbl">Extra note (optional)</label><textarea class="field" data-k="d:noor.note" dir="auto" placeholder="e.g. He read fluently with a few mistakes.">'+rpEsc(REPF.data['noor.note']||'')+'</textarea>'
        +'<details class="rp-hwd" data-hw="noor"'+((REPF.hw.noor||(window.HWO&&HWO.has('noor')))?' open':'')+'><summary>📝 Add homework (optional)</summary>'+rpStarters('h:noor',['Re-read today’s pages…'].concat(RP_HWST))+'<textarea class="field" data-k="h:noor" dir="auto" placeholder="Homework for next lesson">'+rpEsc(REPF.hw.noor||'')+'</textarea></details>';
    } else {
      if(k==='arabic'){ let by={}; try{ by=JSON.parse(lsGet('lp.rep.by')||'{}'); }catch(e){}
        b+='<label class="rp-lbl">Bayna Yadayk quick-fill</label><div class="rp-by"><input class="field" type="number" min="1" inputmode="numeric" placeholder="Book" data-by="b" value="'+rpEsc(by.b||'')+'"><input class="field" type="number" min="1" inputmode="numeric" placeholder="Unit" data-by="u" value="'+rpEsc(by.u||'')+'"><input class="field" type="number" min="1" inputmode="numeric" placeholder="Lesson" data-by="l" value="'+rpEsc(by.l?+by.l+1:'')+'"><button type="button" class="btn small" data-act="by">+ Add</button></div>'; }
      b+='<label class="rp-lbl">What we covered</label>'+rpStarters('d:'+k+'.done',S.st)+'<textarea class="field" data-k="d:'+k+'.done" dir="auto" placeholder="'+rpEsc(S.ph)+'">'+rpEsc(REPF.data[k+'.done']||'')+'</textarea>'
        +'<details class="rp-hwd" data-hw="'+k+'"'+((REPF.hw[k]||(window.HWO&&HWO.has(k)))?' open':'')+'><summary>📝 Add homework (optional)</summary>'+rpStarters('h:'+k,RP_HWST)+'<textarea class="field" data-k="h:'+k+'" dir="auto" placeholder="Homework for next lesson">'+rpEsc(REPF.hw[k]||'')+'</textarea></details>';
    }
    c.innerHTML=b; box.appendChild(c);
  });
  box.querySelectorAll('select[data-v]').forEach(x=>{ x.value=x.dataset.v; });
  box.querySelectorAll('textarea[data-k]').forEach(ta=>{ const d=document.createElement('div'); d.className='row-actions'; d.style.margin='4px 0 10px'; d.innerHTML='<button type="button" class="btn small" data-act="polish" data-for="'+rpEsc(ta.dataset.k)+'">✨ Polish with AI</button><button type="button" class="btn small" data-act="polundo" data-for="'+rpEsc(ta.dataset.k)+'" hidden>↩︎ Undo</button>'; ta.after(d); });
  rpHint();
}
function rpHint(){
  document.querySelectorAll('.rp-hint').forEach(e=>e.remove());
  const name=$('rpName').value.trim().toLowerCase(); if(!name) return;
  const last=rpAll().filter(r=>r.name.toLowerCase()===name&&r.id!==REPF.id).sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0]; if(!last) return;
  REPF.subjects.forEach(k=>{
    const h=rpVal((last.hw||{})[k]); if(!h) return;
    const w=document.querySelector('[data-hw="'+k+'"]'); if(!w) return;
    const d=document.createElement('div'); d.className='rp-hint'; d.textContent='Last homework ('+rpDMY(last.date)+'): '+h; const sm0=w.querySelector('summary'); w.insertBefore(d,sm0?sm0.nextSibling:w.firstChild);
  });
}
function rpChips(){
  $('rpChips').innerHTML=allSubKeys([{subjects:REPF.subjects}]).map(k=>'<button type="button" class="rp-chip" data-sub="'+rpEsc(k)+'" aria-pressed="'+REPF.subjects.includes(k)+'" dir="auto">'+rpSub(k).icon+' '+rpEsc(rpSub(k).label)+(k.startsWith('x_')?' <span data-delsub="'+rpEsc(k)+'" title="Remove" style="opacity:.6;margin-inline-start:4px">✕</span>':'')+'</button>').join('');
  $('rpGrades').innerHTML=RP_GRADES.map(g=>'<button type="button" class="rp-chip" data-grade="'+rpEsc(g)+'" aria-pressed="'+(REPF.grade===g)+'">'+rpEsc(RPL==='ar'?RP_GRADES_AR[RP_GRADES.indexOf(g)]:g)+'</button>').join('')+rpCG().map(g=>'<button type="button" class="rp-chip" dir="auto" data-grade="'+rpEsc(g)+'" aria-pressed="'+(REPF.grade===g)+'">'+rpEsc(g)+' <span data-delgrade="'+rpEsc(g)+'" title="Remove" style="opacity:.6;margin-inline-start:4px">✕</span></button>').join('');
  $('rpDurQ').innerHTML=[[20,'20 min'],[30,'30 min'],[45,'45 min'],[60,'1 hr'],[90,'1 hr 30'],[120,'2 hr']].map(x=>'<button type="button" class="rp-sc" data-dm="'+x[0]+'">⏱ '+(RPL==='ar'?rpDurL(x[0]):x[1])+'</button>').join('');
}
function rpPreview(){ const m=rpModel(rpCur()); $('rpPreview').innerHTML=rpHTML(m); try{ const _t=$('rpTextPrev'); if(_t){ _t.textContent=rpText(m); _t.dir=(RPL==='ar'?'rtl':'ltr'); } }catch(e){} }
/* perf: coalesce rapid typing into one render per ~150ms */
let _rpPT=0, _rpMT=0;
function rpPreviewSoon(){ clearTimeout(_rpPT); _rpPT=setTimeout(()=>{ _rpPT=0; rpPreview(); },150); }
function rpMonthSoon(){ clearTimeout(_rpMT); _rpMT=setTimeout(()=>{ _rpMT=0; const p=document.querySelector('#view-reports .rp-pane[data-pane="month"]'); if(p&&!p.hidden) rpMonthRender(); },250); }
function rpTxtR(r){ return rpText(rpModel(r)); }
function rpList(){
  const all=rpAll().sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.saved||0)-(a.saved||0));
  const names=[...new Set(all.map(r=>r.name).filter(Boolean))].sort();
  $('rpNames').innerHTML=names.map(n=>'<option value="'+rpEsc(n)+'">').join('');
  const fSel=$('rpFilter'), cur=fSel.value;
  fSel.innerHTML='<option value="">All students ('+all.length+')</option>'+names.map(n=>'<option>'+rpEsc(n)+'</option>').join('');
  fSel.value=names.includes(cur)?cur:'';
  const q=$('rpSearch').value.trim().toLowerCase();
  const rows=all.filter(r=>(!fSel.value||r.name===fSel.value)&&(!q||rpTxtR(r).toLowerCase().includes(q)));
  rpMonthRender();
  $('rpList').innerHTML=rows.length?rows.map(r=>'<div class="rp-item"><div><b>'+rpEsc(r.name||'—')+'</b><small>'+rpDMY(r.date)+' · '+rpEsc(rpModel(r).subj)+'</small> <span class="rp-badge">'+rpEsc((r.grade||'').split(/[,!]/)[0])+'</span></div><div class="row-actions"><button class="btn small" data-rp="open" data-id="'+r.id+'">Open</button><button class="btn small" data-rp="tpl" data-id="'+r.id+'">♻️ Template</button><button class="btn small" data-rp="copy" data-id="'+r.id+'">Copy</button><button class="btn small" data-rp="del" data-id="'+r.id+'">🗑</button></div></div>').join(''):'<p class="help" style="margin-top:10px">No saved reports yet.</p>';
}
function rpSetDur(m){ m=+m||0; $('rpH').value=m>=60?Math.floor(m/60):''; $('rpM').value=m%60?m%60:''; }
function rpLoad(r){
  const cp=o=>JSON.parse(JSON.stringify(o||{}));
  REPF.id=r.id; REPF.subjects=(r.subjects||[]).filter(k=>rpSub(k)); REPF.data=cp(r.data); REPF.hw=cp(r.hw); REPF.grade=r.grade;
  $('rpName').value=r.name; $('rpDate').value=r.date; rpSetDur(r.dur); $('rpTime').value=r.timing||''; $('rpTeacher').value=r.teacher||''; $('rpBis').checked=r.bis!==false; $('rpShowAc').checked=r.showAc!==false; if(r.ac) $('rpAcademy').value=r.ac;
  rpChips(); rpBuildSections(); rpPreview();
}
function rpReset(){
  REPF.id=null; REPF.data={}; REPF.hw={}; REPF.grade=RP_GRADES[0];
  $('rpName').value=''; $('rpDate').value=rpToday(); $('rpTime').value=''; rpSetDur(0);
  rpChips(); rpBuildSections(); rpPreview(); window.scrollTo({top:0});
}
function rpCopyText(t){ (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Copied ✅'),()=>{ const a=document.createElement('textarea'); a.value=t; document.body.appendChild(a); a.select(); try{ document.execCommand('copy'); toast('Copied ✅'); }catch(e){} a.remove(); }); }
function pvPrintDoc(html){
  const land=/A4 landscape/.test(html), f=document.createElement('iframe');
  f.style.cssText='position:fixed;left:-9999px;top:0;width:'+(land?1123:794)+'px;height:1123px;border:0;visibility:hidden'; document.body.appendChild(f);
  const w=f.contentWindow, d=w.document; d.open(); d.write(html); d.close();
  const fit=()=>{ try{ const mm=96/25.4, mg=land?0:12*mm, aw=(land?297:210)*mm-2*mg, ah=(land?210:297)*mm-2*mg, el=d.body; el.style.zoom=''; el.style.overflow='hidden';
    const k=Math.max(.5,Math.min(1,aw/el.scrollWidth,ah/el.scrollHeight)); if(k<.995) el.style.zoom=k; }catch(e){} };
  const go=()=>{ fit(); try{ w.focus(); w.print(); }catch(e){ toast('Print failed - use Picture instead'); } setTimeout(()=>f.remove(),120000); };
  const fr=(d.fonts&&d.fonts.ready)?Promise.race([d.fonts.ready,new Promise(r=>setTimeout(r,2500))]):Promise.resolve();
  fr.then(()=>setTimeout(go,350));
}
function rpPrintDoc(title,body,extra){
  const u=rpFonts().length?rpFontURL(rpLinkFams()):'';
  pvPrintDoc('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title>'+(u?'<link rel="stylesheet" href="'+u+'">':'')+'<style>'+RP_CSS+MR_CSS+rpThemeCSS()+'@page{size:A4;margin:12mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;padding:18px;background:#fff}'+extra+'</style></head><body>'+body+'</body></html>');
}
function rpPrint(){ rpPrintDoc('Lesson Report',rpHTML(rpModel(rpCur())),'.rc{box-shadow:none}'); }
function rpPrefs(){ lsSet('lp.rep.prefs',JSON.stringify({subjects:REPF.subjects,teacher:$('rpTeacher').value.trim(),bis:$('rpBis').checked,showAc:$('rpShowAc').checked})); }

