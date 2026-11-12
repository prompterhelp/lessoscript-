/* ===== Templates, fonts, picture quality, grades, RTL dates ===== */
Object.assign(RP_AR,{'Add your own grade (e.g. Mumtaz, A+, ممتاز)':'أضف تقديرك الخاص (مثال: ممتاز، A+)','Add grade':'أضف تقدير','Templates, fonts & picture quality':'القوالب والخطوط وجودة الصورة','Student report template':'قالب تقرير الطالب','Monthly record template':'قالب السجل الشهري','Font (any language)':'الخط (لأي لغة)','Arabic / Urdu font':'الخط العربي / الأردي','Picture quality':'جودة الصورة','Picture format':'صيغة الصورة','Make my own template':'أنشئ قالبي الخاص','Template name':'اسم القالب','Main color':'اللون الأساسي','Second color':'اللون الثاني','Accent color':'لون التمييز','Background':'الخلفية','Save as my template':'احفظ كقالب خاص','Delete selected template':'احذف القالب المحدد','Default font':'الخط الافتراضي','Default Arabic font':'الخط العربي الافتراضي','Classic green':'أخضر طيبة','Official black & white':'رسمي أبيض وأسود','Royal blue':'أزرق ملكي','Plum & rose':'بنفسجي وردي','Warm sunrise':'شروق دافئ','Ocean teal':'أزرق مخضر','Standard (1×)':'عادية (1×)','High (2×)':'عالية (2×)','Very high (3×)':'عالية جدًا (3×)','Ultra (4×)':'فائقة (4×)','PNG (sharp, large)':'PNG (حاد، حجم كبير)','JPG (small file)':'JPG (حجم صغير)','WebP (sharp, small)':'WebP (حاد وصغير)'});
Object.assign(RP_AR,{'Report':'التقرير','Design':'التصميم','Monthly':'الشهري','Saved':'المحفوظة','Preview':'معاينة','Both reports':'كلا التقريرين','Student report':'تقرير الطالب','Monthly record':'السجل الشهري','Templates':'القوالب','Fonts':'الخطوط','Picture':'صورة','Copy':'نسخ','WhatsApp':'واتساب','Print':'طباعة','Print / PDF':'طباعة / PDF','Copy table':'نسخ الجدول','Word':'وورد','Create my own template':'أنشئ قالبي الخاص','Layout':'التخطيط','Pick a look. It is used for your lesson reports and the monthly record.':'اختر شكلاً. يُستخدم في تقارير الدروس والسجل الشهري.','Choose a layout, colors and the fonts above, then save it to the gallery.':'اختر التخطيط والألوان والخطوط أعلاه ثم احفظه في المعرض.','Golden certificate':'شهادة ذهبية','Royal frame':'إطار ملكي','Modern teal':'عصري أخضر مزرق','Modern violet':'عصري بنفسجي','Madinah geometric':'هندسي المدينة','Blue mosaic':'فسيفساء زرقاء','Clean minimal':'بسيط أنيق','Sunny kids':'أطفال مشمس','Candy kids':'أطفال حلوى','Classic':'كلاسيكي','Elegant frame':'إطار أنيق','Modern card':'بطاقة عصرية','Islamic geometric':'هندسي إسلامي','Minimal':'بسيط','Playful kids':'مرح للأطفال','Upload my Word form':'ارفع نموذج وورد الخاص بي','Built-in form':'النموذج المدمج'});
const RP_BT=[
 {id:'aur1',n:'Aurora teal',lay:'aurora',g:'#0F766E',g2:'#14B8A6',gold:'#F59E0B',bg:'#F2FAF9',f:'Plus Jakarta Sans',af:'Alexandria'},
 {id:'aur2',n:'Aurora indigo',lay:'aurora',g:'#3730A3',g2:'#6366F1',gold:'#F472B6',bg:'#F5F6FF',f:'Manrope',af:'Readex Pro'},
 {id:'soft1',n:'Soft sage',lay:'soft',g:'#2F5D50',g2:'#6BA292',gold:'#E9B44C',bg:'#F3F7F2',f:'DM Sans',af:'Cairo'},
 {id:'soft2',n:'Soft rose',lay:'soft',g:'#9D174D',g2:'#EC4899',gold:'#F59E0B',bg:'#FFF5F8',f:'Outfit',af:'Rubik'},
 {id:'noir1',n:'Midnight gold',lay:'noir',g:'#0F1720',g2:'#1F2A37',gold:'#D4AF37',bg:'#0F1720',f:'Cormorant Garamond',af:'Aref Ruqaa'},
 {id:'rib1',n:'Ribbon navy',lay:'ribbon',g:'#0B3C5D',g2:'#328CC1',gold:'#D9B310',bg:'#F6F9FC',f:'Montserrat',af:'Noto Kufi Arabic'},
 {id:'classic',n:'Classic green',lay:'classic',g:'#1F4D43',g2:'#2F6B5C',gold:'#B8923A',bg:'#FBF7EE',f:'',af:''},
 {id:'official',n:'Official black & white',lay:'classic',g:'#222222',g2:'#444444',gold:'#666666',bg:'#FFFFFF',plain:1,f:'',af:''},
 {id:'gold',n:'Golden certificate',lay:'elegant',g:'#6B4A12',g2:'#8A6A2A',gold:'#B8923A',bg:'#FFFBF0',f:'Playfair Display',af:'Amiri'},
 {id:'navy',n:'Royal frame',lay:'elegant',g:'#14305C',g2:'#2D5A9E',gold:'#C9A227',bg:'#F7F9FD',f:'Lora',af:'Scheherazade New'},
 {id:'teal',n:'Modern teal',lay:'modern',g:'#0F766E',g2:'#14B8A6',gold:'#F59E0B',bg:'#F0FDFA',f:'Poppins',af:'Cairo'},
 {id:'violet',n:'Modern violet',lay:'modern',g:'#4C1D95',g2:'#7C3AED',gold:'#F472B6',bg:'#F5F3FF',f:'Inter',af:'IBM Plex Sans Arabic'},
 {id:'madinah',n:'Madinah geometric',lay:'geo',g:'#1F4D43',g2:'#2F6B5C',gold:'#C9A24B',bg:'#FBF7EE',f:'Lora',af:'Amiri'},
 {id:'mosaic',n:'Blue mosaic',lay:'geo',g:'#17406F',g2:'#2D6CA3',gold:'#D4A84B',bg:'#F4F8FC',f:'Merriweather',af:'Noto Naskh Arabic'},
 {id:'minimal',n:'Clean minimal',lay:'minimal',g:'#111111',g2:'#444444',gold:'#B8923A',bg:'#FFFFFF',f:'Inter',af:'IBM Plex Sans Arabic'},
 {id:'sunny',n:'Sunny kids',lay:'kids',g:'#E8590C',g2:'#F59F00',gold:'#2B8A3E',bg:'#FFF9DB',f:'Nunito',af:'Cairo'},
 {id:'candy',n:'Candy kids',lay:'kids',g:'#C2255C',g2:'#7048E8',gold:'#F59F00',bg:'#FFF0F6',f:'Nunito',af:'Reem Kufi'}];
const RP_LAYS=[['aurora','Aurora (modern)'],['soft','Soft rounded'],['noir','Midnight'],['ribbon','Ribbon'],['classic','Classic'],['elegant','Elegant frame'],['modern','Modern card'],['geo','Islamic geometric'],['minimal','Minimal'],['kids','Playful kids']];
const RP_FONTS=[
 {n:'Plus Jakarta Sans',g:'Latin'},{n:'DM Sans',g:'Latin'},{n:'Manrope',g:'Latin'},{n:'Outfit',g:'Latin'},{n:'Sora',g:'Latin'},{n:'Montserrat',g:'Latin'},{n:'Raleway',g:'Latin'},{n:'Space Grotesk',g:'Latin'},{n:'Cormorant Garamond',g:'Latin'},{n:'Fraunces',g:'Latin'},
 {n:'Lora',g:'Latin'},{n:'Playfair Display',g:'Latin'},{n:'Merriweather',g:'Latin'},{n:'Inter',g:'Latin'},{n:'Poppins',g:'Latin'},{n:'Roboto',g:'Latin'},{n:'Open Sans',g:'Latin'},{n:'Nunito',g:'Latin'},
 {n:'Alexandria',g:'Arabic'},{n:'Readex Pro',g:'Arabic'},{n:'Rubik',g:'Arabic'},{n:'Mada',g:'Arabic'},{n:'Changa',g:'Arabic'},{n:'Lemonada',g:'Arabic'},{n:'Baloo Bhaijaan 2',g:'Arabic'},{n:'Amiri',g:'Arabic'},{n:'Cairo',g:'Arabic'},{n:'Tajawal',g:'Arabic'},{n:'Noto Naskh Arabic',g:'Arabic'},{n:'Noto Kufi Arabic',g:'Arabic'},{n:'Scheherazade New',g:'Arabic'},{n:'Reem Kufi',g:'Arabic'},{n:'Almarai',g:'Arabic'},{n:'IBM Plex Sans Arabic',g:'Arabic'},{n:'El Messiri',g:'Arabic'},{n:'Markazi Text',g:'Arabic'},{n:'Aref Ruqaa',g:'Arabic'},{n:'Lateef',g:'Arabic'},
 {n:'Noto Nastaliq Urdu',g:'Urdu / Persian'},{n:'Vazirmatn',g:'Urdu / Persian'},
 {n:'Noto Sans',g:'Other scripts'},{n:'Noto Serif',g:'Other scripts'},{n:'Noto Sans Devanagari',g:'Other scripts'},{n:'Noto Sans Bengali',g:'Other scripts'},
 {n:'Georgia',g:'System',sys:1},{n:'Times New Roman',g:'System',sys:1},{n:'Cambria',g:'System',sys:1},{n:'Arial',g:'System',sys:1},{n:'Tahoma',g:'System',sys:1}];
const CT_AFONTS=[{n:'Aref Ruqaa Ink',g:'Arabic calligraphy',w:'400;700'},{n:'Amiri Quran',g:'Arabic calligraphy',w:'400'},{n:'Katibeh',g:'Arabic calligraphy',w:'400'},{n:'Mirza',g:'Arabic calligraphy',w:'400;700'},{n:'Harmattan',g:'Arabic calligraphy',w:'400;700'},{n:'Qahiri',g:'Arabic calligraphy',w:'400'},{n:'Gulzar',g:'Arabic calligraphy',w:'400'},{n:'Alkalami',g:'Arabic calligraphy',w:'400'},{n:'Vibes',g:'Arabic calligraphy',w:'400'},{n:'Rakkas',g:'Arabic calligraphy',w:'400'},{n:'Ruwudu',g:'Arabic calligraphy',w:'400;700'},{n:'Kufam',g:'Arabic Kufi & display',w:'400;700'},{n:'Jomhuria',g:'Arabic Kufi & display',w:'400'},{n:'Lalezar',g:'Arabic Kufi & display',w:'400'},{n:'Marhey',g:'Arabic Kufi & display',w:'400;700'},{n:'Noto Sans Arabic',g:'Arabic Kufi & display',w:'400;700'},{n:'Zain',g:'Arabic Kufi & display',w:'400;700'},{n:'Beiruti',g:'Arabic Kufi & display',w:'400;700'},{n:'Cairo Play',g:'Arabic Kufi & display',w:'400;700'},{n:'Handjet',g:'Arabic Kufi & display',w:'400;700'},{n:'Playpen Sans Arabic',g:'Arabic Kufi & display',w:'400;700'},{n:'Blaka Ink',g:'Arabic calligraphy',w:'400'},{n:'Reem Kufi Ink',g:'Arabic Kufi & display',w:'400'},{n:'Reem Kufi Fun',g:'Arabic Kufi & display',w:'400;700'},{n:'Blaka Hollow',g:'Arabic Kufi & display',w:'400'}];
const CT_EFONTS=[{n:'Great Vibes',g:'English certificate script',w:'400'},{n:'Pinyon Script',g:'English certificate script',w:'400'},{n:'Allura',g:'English certificate script',w:'400'},{n:'Alex Brush',g:'English certificate script',w:'400'},{n:'Parisienne',g:'English certificate script',w:'400'},{n:'Italianno',g:'English certificate script',w:'400'},{n:'Rouge Script',g:'English certificate script',w:'400'},{n:'Sacramento',g:'English certificate script',w:'400'},{n:'Petit Formal Script',g:'English certificate script',w:'400'},{n:'Monsieur La Doulaise',g:'English certificate script',w:'400'},{n:'Tangerine',g:'English certificate script',w:'400;700'},{n:'Dancing Script',g:'English certificate script',w:'400;700'},{n:'Cinzel',g:'English certificate serif',w:'400;700'},{n:'Cinzel Decorative',g:'English certificate serif',w:'400;700'},{n:'Cormorant SC',g:'English certificate serif',w:'400;700'},{n:'Cormorant Upright',g:'English certificate serif',w:'400;700'},{n:'Playfair Display SC',g:'English certificate serif',w:'400;700'},{n:'Italiana',g:'English certificate serif',w:'400'},{n:'Marcellus',g:'English certificate serif',w:'400'},{n:'Forum',g:'English certificate serif',w:'400'},{n:'Bodoni Moda',g:'English certificate serif',w:'400;700'},{n:'Libre Baskerville',g:'English certificate serif',w:'400;700'},{n:'EB Garamond',g:'English certificate serif',w:'400;700'},{n:'Old Standard TT',g:'English certificate serif',w:'400;700'},{n:'Cardo',g:'English certificate serif',w:'400;700'},{n:'Spectral',g:'English certificate serif',w:'400;700'}];
const RP_TAIL=['Noto Sans','Noto Naskh Arabic','Noto Sans Devanagari','Noto Sans Bengali','Noto Nastaliq Urdu'];
let RP_AP='both';
function rpJ(k,d){ try{ const v=JSON.parse(lsGet(k)||'null'); return v==null?d:v; }catch(e){ return d; } }
function rpCT(){ const a=rpJ('lp.rep.th',[]); return Array.isArray(a)?a:[]; }
function rpCG(){ const a=rpJ('lp.rep.cg',[]); return Array.isArray(a)?a:[]; }
function rpAllT(){ return RP_BT.concat(rpCT()); }
function rpTh(w){ const id=lsGet(w==='s'?'lp.rep.ths':'lp.rep.thm')||(w==='s'?'classic':'official'); return rpAllT().find(t=>t.id===id)||RP_BT[w==='s'?0:1]; }
function rpFam(n){ return RP_FONTS.find(f=>f.n===n)||CT_AFONTS.find(f=>f.n===n)||CT_EFONTS.find(f=>f.n===n)||null; }
function rpFonts(){ return [rpFam(lsGet('lp.rep.font')),rpFam(lsGet('lp.rep.afont'))].filter((x,i,r)=>x&&r.indexOf(x)===i); }
function rpStackFor(f,af){ const fs=[rpFam(f),rpFam(af)].filter((x,i,r)=>x&&r.indexOf(x)===i); if(!fs.length) return ''; return fs.map(x=>"'"+x.n+"'").concat(RP_TAIL.map(x=>"'"+x+"'"),['Georgia','serif']).join(','); }
function rpStack(){ return rpStackFor(lsGet('lp.rep.font'),lsGet('lp.rep.afont')); }
function rpFontURL(list){ const seen=new Set(), q=list.filter(f=>!f.sys&&!seen.has(f.n)&&seen.add(f.n)).map(f=>'family='+f.n.replace(/ /g,'+')+':wght@'+(f.w||'400;700')); return q.length?'https://fonts.googleapis.com/css2?'+q.join('&')+'&display=swap':''; }
function rpLoadFontLinks(list){ const seen=new Set(); (list||[]).filter(f=>f&&!f.sys&&!seen.has(f.n)&&seen.add(f.n)).forEach(f=>{ const id='flk-'+f.n.replace(/\W+/g,'_'); if(document.getElementById(id)) return; const b='https://fonts.googleapis.com/css2?family='+f.n.replace(/ /g,'+'); const tries=f.w?[b+':wght@'+f.w+'&display=swap',b+'&display=swap']:[b+':wght@400;500;600;700;800&display=swap',b+':wght@400;700&display=swap',b+'&display=swap']; let i=0; const lk=document.createElement('link'); lk.id=id; lk.rel='stylesheet'; lk.onerror=function(){ if(++i<tries.length) lk.href=tries[i]; }; lk.href=tries[0]; document.head.appendChild(lk); }); }
function rpLinkFams(){ return rpFonts().concat(RP_TAIL.map(n=>({n}))); }
function rpMix(a,b,p){ const h=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)), A=h(a), B=h(b); return '#'+A.map((v,i)=>Math.round(v*p+B[i]*(1-p)).toString(16).padStart(2,'0')).join(''); }
function rpVars(t){ const W='#ffffff'; return '--g:'+t.g+';--g2:'+t.g2+';--gold:'+t.gold+';--bg:'+t.bg+';--ln:'+rpMix(t.gold,W,.35)+';--tg:'+rpMix(t.gold,W,.16)+';--t1:'+rpMix(t.g,W,.14)+';--t2:'+rpMix(t.gold,W,.22)+';--t3:'+rpMix(t.g2,W,.14); }
function rpThemeCSS(){
  const F=rpStack(), fa=rpFonts().find(f=>f.g==='Arabic'||f.g==='Urdu / Persian');
  return RP_LAY+'.rc .rc-title{font-size:1.4rem!important;line-height:1.2;letter-spacing:.03em}'+'.rc{'+rpVars(rpTh('s'))+(F?';font-family:'+F:'')+'}.mw{'+rpVars(rpTh('m'))+(F?';font-family:'+F:'')+'}'+(fa?'.rc-bis{font-family:\''+fa.n+'\',serif}':'');
}
function rpApplyDesign(){
  let st=$('rpThemeStyle'); if(!st){ st=document.createElement('style'); st.id='rpThemeStyle'; document.head.appendChild(st); }
  st.textContent=rpThemeCSS();
  if(rpFonts().length) rpLoadFontLinks(rpLinkFams());
  try{ rpPreview();
    const vis=n=>{ const p=document.querySelector('#view-reports .rp-pane[data-pane="'+n+'"]'); return p&&!p.hidden; };
    if(vis('month')) rpMonthRender(); if(vis('design')) rpGallery(); }catch(e){}
}
function rpGalFonts(){ if($('rpGalLink')) return; const m=document.createElement('meta'); m.id='rpGalLink'; document.head.appendChild(m); const _gf=[].concat.apply([],rpAllT().map(t=>[rpFam(t.f),rpFam(t.af)])).filter(Boolean); let _gi=0; (function step(){ if(_gi>=_gf.length) return; rpLoadFontLinks(_gf.slice(_gi,_gi+3)); _gi+=3; setTimeout(step,400); })(); }
function rpSample(){ const ar=RPL==='ar'; return {name:ar?'حمزة':'Hamza',subj:ar?'القرآن':'Qur’an',date:'31/10/2026',dur:ar?'ساعة':'1 hour',teacher:'',bis:true,notes:[{icon:'📖',title:ar?'القرآن':'Qur’an',rows:[['',ar?'سورة الفاتحة (كاملة)':'Surah Al-Fatihah (full surah)']]}],hw:[{icon:'📖',title:ar?'القرآن':'Qur’an',text:ar?'مراجعة السورة':'Revise the surah'}],grade:ar?'ممتاز ما شاء الله ⭐':'Excellent, MashaAllah! ⭐'}; }
function rpGallery(){
  const g=$('rpGallery'); if(!g) return; const sm=rpSample(), sId=rpTh('s').id, mId=rpTh('m').id, ar=RPL==='ar';
  g.innerHTML=rpAllT().map(t=>'<button type="button" class="tp" data-th="'+rpEsc(t.id)+'" aria-pressed="'+(t.id===sId||t.id===mId)+'"><div class="tp-sc">'+rpHTML(sm,t)+'</div><b>'+rpEsc(T(t.n))+'</b><small>'+(t.id===sId?'✓ '+T('Student')+' ':'')+(t.id===mId?'✓ '+(ar?'الشهري':'Monthly'):'')+'</small></button>').join('');
}
function rpPick(id){
  const t=rpAllT().find(x=>x.id===id); if(!t) return;
  if(RP_AP!=='m') lsSet('lp.rep.ths',id); if(RP_AP!=='s') lsSet('lp.rep.thm',id);
  lsSet('lp.rep.font',t.f||''); lsSet('lp.rep.afont',t.af||'');
  rpDesignInit(); rpApplyDesign(); toast('Template applied ✅');
}
function rpDesignInit(){
  const opt=(v,t,sel)=>'<option value="'+rpEsc(v)+'"'+(sel?' selected':'')+'>'+rpEsc(t)+'</option>';
  $('rpThQ').innerHTML=rpAllT().map(t=>opt(t.id,t.n,t.id===rpTh('s').id)).join('');
  const grp=(arr,cur)=>[...new Set(arr.map(f=>f.g))].map(g=>'<optgroup label="'+g+'">'+arr.filter(f=>f.g===g).map(f=>opt(f.n,f.n,f.n===cur)).join('')+'</optgroup>').join('');
  const cf=lsGet('lp.rep.font')||'', ca=lsGet('lp.rep.afont')||'';
  $('rpFont').innerHTML=opt('','Default font',!cf)+grp(RP_FONTS,cf);
  $('rpAFont').innerHTML=opt('','Default Arabic font',!ca)+grp(RP_FONTS.filter(f=>f.g==='Arabic'||f.g==='Urdu / Persian'),ca);
  const t=rpTh('s'); $('rpTLay').innerHTML=RP_LAYS.map(l=>opt(l[0],l[1],l[0]===(t.lay||'classic'))).join('');
  const q=rpImgSet(); $('rpQual').value=String(q.q); $('rpFmt').value=q.f;
  $('rpCg').value=t.g; $('rpCg2').value=t.g2; $('rpCgold').value=t.gold; $('rpCbg').value=t.bg;
}
function rpDesignChange(t){
  const id=t.id;
  if(id==='rpThQ'){ lsSet('lp.rep.ths',t.value); rpApplyDesign(); return true; }
  if(id==='rpFont'||id==='rpAFont'){ lsSet(id==='rpFont'?'lp.rep.font':'lp.rep.afont',t.value); rpApplyDesign(); return true; }
  if(id==='rpQual'||id==='rpFmt'){ lsSet('lp.rep.img',JSON.stringify({q:+$('rpQual').value,f:$('rpFmt').value})); toast('Saved ✅'); return true; }
  return false;
}
function rpTSave(){
  const n=$('rpTName').value.replace(/[<>&"]/g,'').trim(); if(!n){ toast('Name your template'); $('rpTName').focus(); return; }
  const a=rpCT(), t={id:'c'+Date.now().toString(36),n,lay:$('rpTLay').value,g:$('rpCg').value.toUpperCase(),g2:$('rpCg2').value.toUpperCase(),gold:$('rpCgold').value.toUpperCase(),bg:$('rpCbg').value.toUpperCase(),f:lsGet('lp.rep.font')||'',af:lsGet('lp.rep.afont')||''};
  a.push(t); lsSet('lp.rep.th',JSON.stringify(a)); lsSet('lp.rep.ths',t.id); lsSet('lp.rep.thm',t.id); $('rpTName').value=''; rpDesignInit(); rpApplyDesign(); rpUI(); toast('Template saved ✅');
}
function rpTDel(){
  const id=rpTh('s').id, a=rpCT(); if(!a.some(x=>x.id===id)){ toast('Select one of your own templates first (built-in ones can’t be deleted)'); return; } if(!confirm('Delete this template?')) return;
  lsSet('lp.rep.th',JSON.stringify(a.filter(x=>x.id!==id))); ['lp.rep.ths','lp.rep.thm'].forEach(k=>{ if(lsGet(k)===id) lsSet(k,''); }); rpDesignInit(); rpApplyDesign(); rpUI();
}
function rpTab(n){
  if(!['write','design','month','saved','cert'].includes(n)) n='write'; lsSet('lp.rep.tab',n);
  document.querySelectorAll('#rpTabs [data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===n)));
  document.querySelectorAll('#view-reports .rp-pane').forEach(p=>{ p.hidden=p.dataset.pane!==n; });
  if(n==='design'){ rpGalFonts(); rpGallery(); } if(n==='month') rpMonthRender(); if(n==='saved') rpList();
}
function rpImgSet(){ const q=rpJ('lp.rep.img',{}); return {q:Math.min(4,Math.max(1,+q.q||2)),f:['png','jpg','webp'].includes(q.f)?q.f:'png'}; }
const RP_FC={};
function rpInRange(r,cps){ return r.split(',').some(p=>{ p=p.trim().replace(/^U\+/i,''); const ab=p.split('-'), lo=parseInt(ab[0].replace(/\?/g,'0'),16), hi=ab[1]?parseInt(ab[1],16):(ab[0].indexOf('?')>=0?parseInt(ab[0].replace(/\?/g,'F'),16):lo); for(const c of cps) if(c>=lo&&c<=hi) return true; return false; }); }
async function rpFontCSS(html){
  try{
    const txt=html.replace(/<[^>]*>/g,' '), cps=new Set(Array.from(txt).map(c=>c.codePointAt(0))), fams=rpFonts().slice().concat(window.RP_XF||[]);
    if(/[ऀ-ॿ]/.test(txt)) fams.push({n:'Noto Sans Devanagari'}); if(/[ঀ-৿]/.test(txt)) fams.push({n:'Noto Sans Bengali'});
    let out='';
    for(const f of fams){ if(f.sys) continue; try{
      let css=RP_FC['css:'+f.n]; if(!css){ css=await (await fetch(rpFontURL([f]))).text(); RP_FC['css:'+f.n]=css; }
      for(const b of (css.match(/@font-face\s*\{[^}]*\}/g)||[])){
        const ur=/unicode-range:\s*([^;]+);/.exec(b); if(ur&&!rpInRange(ur[1],cps)) continue;
        const um=/url\((https:[^)]+)\)/.exec(b); if(!um) continue;
        let d=RP_FC[um[1]]; if(!d){ const rb=await (await fetch(um[1])).blob(); d=await new Promise(res=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.readAsDataURL(rb); }); RP_FC[um[1]]=d; }
        out+=b.replace(um[1],d);
      } }catch(e){} }
    return out;
  }catch(e){ return ''; }
}
const RP_MAR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function rpDW(){
  const ar=RPL==='ar';
  [['rpDate',1],['rpMonth',0]].forEach(a=>{
    const inp=$(a[0]); if(!inp) return; let w=inp.nextElementSibling;
    if(!w||!w.classList.contains('rp-dw')){ w=document.createElement('div'); w.className='rp-dw'; inp.after(w);
      w.addEventListener('change',()=>{ const v=[...w.querySelectorAll('select')].map(x=>+x.value), full=a[1], y=v[full?2:1], mo=v[full?1:0], d=full?Math.min(v[0],new Date(y,mo,0).getDate()):0;
        inp.value=y+'-'+String(mo).padStart(2,'0')+(full?'-'+String(d).padStart(2,'0'):''); inp.dispatchEvent(new Event('input',{bubbles:true})); rpDW(); }); }
    inp.style.display=ar?'none':''; w.style.display=ar?'flex':'none'; if(!ar) return;
    const m=/^(\d{4})-(\d\d)(?:-(\d\d))?/.exec(inp.value||'')||[], cy=new Date().getFullYear(), y=+m[1]||cy, mo=+m[2]||1, d=+m[3]||1, y0=Math.min(cy-5,y), y1=Math.max(cy+3,y);
    w.innerHTML=(a[1]?'<select class="field" aria-label="Day">'+Array.from({length:31},(_,i)=>'<option value="'+(i+1)+'"'+(i+1===d?' selected':'')+'>'+(i+1)+'</option>').join('')+'</select>':'')
      +'<select class="field" aria-label="Month">'+RP_MAR.map((n,i)=>'<option value="'+(i+1)+'"'+(i+1===mo?' selected':'')+'>'+n+'</option>').join('')+'</select>'
      +'<select class="field" aria-label="Year">'+Array.from({length:y1-y0+1},(_,i)=>'<option value="'+(y0+i)+'"'+(y0+i===y?' selected':'')+'>'+(y0+i)+'</option>').join('')+'</select>';
  });
}
['rpLoad','rpReset','rpSetLang'].forEach(n=>{ const f=window[n]; window[n]=function(){ const r=f.apply(this,arguments); try{ rpDW(); if(n==='rpSetLang') rpGallery(); else rpTab('write'); }catch(e){} return r; }; });

