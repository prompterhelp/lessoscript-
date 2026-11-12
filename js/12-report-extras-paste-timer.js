/* ===== Closing du'as / words for the student (constants) ===== */
const CT_DUAS=[
 {id:'barak',ar:'بارك الله فيك وزادك علمًا ونورًا',en:'May Allah bless you and increase you in knowledge and light.'},
 {id:'rabbi',ar:'رَبِّ زِدْنِي عِلْمًا',en:'“My Lord, increase me in knowledge.” (Qur’an 20:114)'},
 {id:'jazak',ar:'جزاك الله خيرًا',en:'May Allah reward you with goodness.'},
 {id:'nafa',ar:'اللَّهُمَّ انْفَعْنَا بِمَا عَلَّمْتَنَا وَعَلِّمْنَا مَا يَنْفَعُنَا وَزِدْنَا عِلْمًا',en:'O Allah, benefit us with what You taught us, teach us what benefits us, and increase us in knowledge.'},
 {id:'rabi3',ar:'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قُلُوبِنَا وَنُورَ صُدُورِنَا',en:'O Allah, make the Qur’an the spring of our hearts and the light of our chests.'},
 {id:'khayr',ar:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',en:'“The best of you are those who learn the Qur’an and teach it.”'},
 {id:'masha',ar:'ما شاء الله، تبارك الله',en:'What Allah wills — blessed is Allah. Keep shining!'},
 {id:'waffaq',ar:'وفّقك الله لكل خير',en:'May Allah grant you success in everything good.'},
 {id:'nafa3',ar:'نفع الله بك الإسلام والمسلمين',en:'May Allah benefit Islam and the Muslims through you.'},
 {id:'ryb',ar:'اقرأ وارتقِ ورتّل كما كنتَ ترتّل في الدنيا',en:'“Recite and rise, as you used to recite in the world.”'}
];
const CT_DUA_AUTO={surah:'rabbi',juz:'khayr',quran:'ryb',noor:'barak'};
function ctDua(c){ const v=c.dua||'auto'; if(v==='none') return ''; const d=CT_DUAS.find(x=>x.id===v)||CT_DUAS.find(x=>x.id===(CT_DUA_AUTO[c.kind]||'barak')); const L=c.lang;
  return '<div class="ct-dua">'+(L==='en'?'':'<div class="a" dir="rtl" lang="ar">'+rpEsc(d.ar)+'</div>')+(L==='ar'?'':'<div class="e" dir="ltr">'+rpEsc(d.en)+'</div>')+'</div>'; }
function ctHTML(c,desId){
  { const d0=ctDes(desId||c.design); if(d0.imp) return ctImpHTML(c,d0); }
  let h=ctHTML0(c,desId); const e=rpEsc;
  const R=(cls,v)=>{ if(!v) return; h=h.replace(new RegExp('(<div class="'+cls+'"[^>]*>)[\\s\\S]*?(</div>)'),(m,a,b)=>a+e(v)+b); };
  R('ct-t',c.tEn); R('ct-ta',c.tAr); R('ct-p',c.pEn); R('ct-pa',c.pAr);
  if(c.nobis) h=h.replace(/<div class="ct-bis">[\s\S]*?<\/div>/,''); else R('ct-bis',c.bisTxt);
  let k=0; h=h.replace(/<div class="l">[\s\S]*?<\/div>/g,m=>{ k++; const v=k===1?c.tl:c.dl; return v?'<div class="l" dir="auto">'+e(v)+'</div>':m; });
  if(c.noseal) h=h.replace(/<div class="ct-seal">[\s\S]*?<\/div>(?=<div class="ct-sg">)/,'<div class="ct-seal" style="visibility:hidden"></div>');
  else { if(c.sealIcon) h=h.replace(/(<div class="ct-seal"><b>)[\s\S]*?(?=<\/b>)/,(m,a)=>a+e(c.sealIcon)); if(c.sealTxt) h=h.replace(/(<div class="ct-seal"><b>[\s\S]*?<\/b>)(<span>[\s\S]*?<\/span>)?/,(m,a)=>a+'<span dir="auto">'+e(c.sealTxt)+'</span>'); }
  { const du=ctDua(c); if(du||c.msg) h=h.replace('</div><div class="ct-ft">',du+(c.msg?'<div class="ct-msg" dir="auto">'+e(c.msg)+'</div>':'')+'</div><div class="ct-ft">'); }
  const st=(c.bg?'--bg:'+c.bg+';background:'+c.bg+';':'')+(c.tx?'--tx:'+c.tx+';--mu:'+c.tx+';':'');
  if(st) h=h.replace('style="--c1:','style="'+st+'--c1:');
  return h;
}
function ctHTML0(c,desId){
  const d=ctDes(desId||c.design), w=ctWhat(c), en=c.lang!=='ar', ar=c.lang!=='en', both=en&&ar, f=c.gender==='f';
  const acad=c.academy||'', teacher=c.teacher||'', gr=CT_GR[c.grade]||null;
  const c1=c.c1||d.c1, c2=c.c2||d.c2, cf=c.font||d.f, ca=c.afont||d.af;
  const e=rpEsc, nm=e(c.name||(ar&&!en?'اسم الطالب':'Student Name'));
  let h='<div class="ct cd-'+d.id+(both?' both':'')+'" dir="'+(ar&&!en?'rtl':'ltr')+'" style="--c1:'+c1+';--c2:'+c2+';--cf:'+ctStack(cf).replace(/,$/,'')+';--ca:'+ctStack(ca).replace(/,$/,'')+'"><div class="ct-fr"></div><div class="ct-in">';
  h+='<div class="ct-bis">بسم الله الرحمن الرحيم</div>'+(acad?'<div class="ct-acad" dir="auto">'+e(acad)+'</div>':'');
  h+='<div class="ct-mid">';
  if(en) h+='<div class="ct-t">'+w.t[0]+'</div>'; if(ar) h+='<div class="ct-ta">'+w.t[1]+'</div>';
  if(en) h+='<div class="ct-p">This certificate is proudly presented to</div>'; if(ar) h+='<div class="ct-pa">'+'تُمنح هذه الشهادة إلى'+'</div>';
  h+='<div class="ct-name" dir="auto">'+nm+'</div>';
  if(en&&w.en) h+='<div class="ct-ach" dir="auto">'+e(w.en)+'</div>'; if(ar&&w.ar) h+='<div class="ct-acha" dir="rtl">'+e(w.ar)+'</div>';
  h+='</div><div class="ct-ft">';
  const lab=(a,b)=>(en?a:'')+(both?' · ':'')+(ar?b:'');
  h+='<div class="ct-sg"><div class="v" dir="auto">'+e(teacher)+'</div><div class="l">'+lab('Teacher','المعلّم'+(f?'':''))+'</div></div>';
  h+='<div class="ct-seal"><b><svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg></b>'+(gr?'<span>'+(en?gr[0]:'')+(both?'<br>':'')+(ar?gr[1]:'')+'</span>':'')+'</div>';
  h+='<div class="ct-sg"><div class="v" dir="ltr">'+e(rpDMY(c.date))+'</div><div class="l">'+lab('Date','التاريخ')+'</div></div>';
  return h+'</div></div></div>';
}
function ctFonts(c){ const d=ctDes(c.design); let a=[rpFam(c.font||d.f),rpFam(c.afont||d.af)].concat(ctImpFonts(d)); if(d.imp){ const o=(c.ix&&c.ix[d.id])||{}; Object.keys(o).forEach(k=>{ if(o[k]&&o[k].f) a.push(rpFam(o[k].f)); }); } try{ const S=PVE.S.cert; Object.keys(S).forEach(k=>{ if(k==='_x') S._x.forEach(i=>{ if(i.ff){ a.push(rpFam(i.ff)); if(PV_CF[i.ff]) a.push(rpFam(PV_CF[i.ff])||{n:PV_CF[i.ff],w:'400'}); } }); else if(S[k]&&S[k].ff){ a.push(rpFam(S[k].ff)); if(PV_CF[S[k].ff]) a.push(rpFam(PV_CF[S[k].ff])||{n:PV_CF[S[k].ff],w:'400'}); } }); }catch(e){} return a.filter(Boolean); }
function ctLoadFonts(){
  const ric=window.requestIdleCallback||(f=>setTimeout(f,300)); ric(()=>rpLoadFontLinks([].concat.apply([],CT_DES.map(d=>[rpFam(d.f),rpFam(d.af)].concat(ctImpFonts(d)))).concat(ctFonts(CT)).filter(Boolean)));
}
function ctFit(){
  document.querySelectorAll('#rpCertPane [data-ctfit]').forEach(w=>{ const c=w.firstElementChild; if(!c) return; const s=w.clientWidth/1123; if(!s) return; c.style.transformOrigin='top left'; c.style.transform='scale('+s+')'; w.style.height=(794*s)+'px'; });
}
function ctRender(){
  const pv=$('ctPv'); if(!pv) return; pv.innerHTML=ctHTML(CT);
  document.querySelectorAll('#ctGal [data-des]').forEach(b=>{ if(!b.dataset.done){ b.dataset.done='1'; const z={}; CT_KEYS.forEach(k=>z[k]=''); b.querySelector('.ct-th').innerHTML=ctHTML(Object.assign({},CT,z,{name:'',teacher:'',academy:''}),b.dataset.des); } b.setAttribute('aria-pressed',String(b.dataset.des===CT.design)); });
  ctFit();
}
function ctSubVis(){
  const k=CT.kind; const sh=(id,on)=>{ const el=$(id); if(el) el.classList.toggle('rp-hide',!on); };
  sh('ctRowSurah',k==='surah'); sh('ctRowJuz',k==='juz'); sh('ctRowVerb',['surah','juz','quran'].includes(k)); sh('ctRowCust',k==='custom');
}
function ctBuild(){
  const p=$('rpCertPane'); if(!p) return;
  const acad=rpJ('lp.rep.acad',{}); if(!CT.date) CT.date=rpToday(); if(!CT.teacher) CT.teacher=($('rpTeacher')&&$('rpTeacher').value)||''; if(!CT.academy) CT.academy=acad.a||'';
  const opt=(v,t,s)=>'<option value="'+rpEsc(v)+'"'+(s?' selected':'')+'>'+rpEsc(t)+'</option>';
  const fgrp=(arr,cur,def)=>opt('',def,!cur)+[...new Set(arr.map(f=>f.g))].map(g=>'<optgroup label="'+g+'">'+arr.filter(f=>f.g===g).map(f=>opt(f.n,f.n,f.n===cur)).join('')+'</optgroup>').join('');
  const chip=(k,v,t)=>'<button type="button" class="rp-chip" data-cc="'+k+'" data-v="'+v+'" aria-pressed="'+(CT[k]===v)+'">'+t+'</button>';
  p.innerHTML='<div class="rp-pvcol"><div class="rp-card ct-pv"><div class="ct-wrap" data-ctfit="1"><div id="ctPv"></div></div></div><div class="rp-card"><h3><i>Aa</i> Fonts &amp; colors</h3>'
  +'<div class="rp-grid" style="margin-top:0"><div><label class="rp-lbl" for="ctF">Font (English)</label><select class="field" id="ctF" data-c="font">'+fgrp(CT_EFONTS.concat(RP_FONTS.filter(f=>f.g!=='Arabic'&&f.g!=='Urdu / Persian'&&!f.sys)),CT.font,'Design default')+'</select></div>'
  +'<div><label class="rp-lbl" for="ctAF">Font (Arabic)</label><select class="field" id="ctAF" data-c="afont">'+fgrp(CT_AFONTS.concat(RP_FONTS.filter(f=>f.g==='Arabic')),CT.afont,'Design default')+'</select></div>'
  +'<div><label class="rp-lbl" for="ctC1">Main color</label><input class="field" id="ctC1" type="color" data-c="c1" value="'+(CT.c1||ctDes(CT.design).c1)+'"></div>'
  +'<div><label class="rp-lbl" for="ctC2">Accent color</label><input class="field" id="ctC2" type="color" data-c="c2" value="'+(CT.c2||ctDes(CT.design).c2)+'"></div>'
  +'<div><label class="rp-lbl" for="ctBg">Background color</label><input class="field" id="ctBg" type="color" data-c="bg" value="'+(CT.bg||'#ffffff')+'"></div>'
  +'<div><label class="rp-lbl" for="ctTx">Text color</label><input class="field" id="ctTx" type="color" data-c="tx" value="'+(CT.tx||'#222222')+'"></div></div>'
  +'</div></div>'
  +'<div class="rp-card"><h3><i>🏆</i> Certificate</h3><p class="help">Create a certificate when a student finishes a surah, a juz’, the Qur’an or a level. The preview above updates as you type.</p>'
  +'<div class="rp-grid"><div><label class="rp-lbl" for="ctName">Student’s name</label><input class="field" id="ctName" data-c="name" dir="auto" list="rpNames" autocomplete="off" value="'+rpEsc(CT.name)+'"></div>'
  +'<div><label class="rp-lbl" for="ctDate">Date</label><input class="field" id="ctDate" type="date" data-c="date" value="'+rpEsc(CT.date)+'"></div>'
  +'<div style="grid-column:1/-1"><label class="rp-lbl" for="ctKind">Awarded for</label><select class="field" id="ctKind" data-c="kind">'+[['surah','Finishing a surah'],['juz','Finishing a juz’'],['quran','Finishing the whole Qur’an'],['noor','Finishing Noor Al-Bayan'],['excel','Excellence & good conduct'],['custom','Custom text']].map(x=>opt(x[0],x[1],x[0]===CT.kind)).join('')+'</select></div>'
  +'<div id="ctRowSurah" style="grid-column:1/-1"><label class="rp-lbl" for="ctSurah">Surah</label><select class="field" id="ctSurah" data-c="surah">'+rpOpts('',CT.surah)+'</select></div>'
  +'<div id="ctRowJuz"><label class="rp-lbl" for="ctJuz">Juz’</label><select class="field" id="ctJuz" data-c="juz">'+Array.from({length:30},(_,i)=>opt(String(i+1),String(i+1),String(i+1)===String(CT.juz))).join('')+'</select></div>'
  +'<div id="ctRowVerb" style="grid-column:1/-1"><span class="rp-lbl">Type</span><div class="rp-chips">'+chip('verb','mem','Memorisation')+chip('verb','rec','Recitation')+chip('verb','rev','Revision')+'</div></div>'
  +'<div id="ctRowCust" style="grid-column:1/-1"><label class="rp-lbl" for="ctCE">Text in English (after “for…”)</label><input class="field" id="ctCE" data-c="custEn" dir="ltr" value="'+rpEsc(CT.custEn)+'" placeholder="for outstanding progress in Tajweed"><label class="rp-lbl" for="ctCA">Text in Arabic</label><input class="field" id="ctCA" data-c="custAr" dir="rtl" value="'+rpEsc(CT.custAr)+'" placeholder="لتميّزه في أحكام التجويد"></div>'
  +'<div><label class="rp-lbl" for="ctGrade">Grade on the seal</label><select class="field" id="ctGrade" data-c="grade">'+opt('','None',!CT.grade)+Object.keys(CT_GR).map(k=>opt(k,CT_GR[k][0]+' · '+CT_GR[k][1],k===CT.grade)).join('')+'</select></div>'
  +'<div><span class="rp-lbl">Student</span><div class="rp-chips">'+chip('gender','m','👦 Boy')+chip('gender','f','👧 Girl')+'</div></div>'
  +'<div style="grid-column:1/-1"><label class="rp-lbl" for="ctDua">Closing du’a / words for the student</label><select class="field" id="ctDua" data-c="dua">'+[['auto','Auto (matches the award)'],['none','None']].concat(CT_DUAS.map(d=>[d.id,d.ar.slice(0,34)+' — '+d.en.replace(/[“”]/g,'').slice(0,38)+'…'])).map(o=>'<option value="'+o[0]+'"'+((CT.dua||'auto')===o[0]?' selected':'')+'>'+rpEsc(o[1])+'</option>').join('')+'</select></div>'
  +'<div><label class="rp-lbl" for="ctTeacher">Teacher name</label><input class="field" id="ctTeacher" data-c="teacher" dir="auto" value="'+rpEsc(CT.teacher)+'"></div>'
  +'<div><label class="rp-lbl" for="ctAcad">Academy name</label><input class="field" id="ctAcad" data-c="academy" dir="auto" value="'+rpEsc(CT.academy)+'" placeholder="Your academy name"></div></div>'
  +'<span class="rp-lbl" style="margin-top:10px">Certificate language</span><div class="rp-chips">'+chip('lang','en','English')+chip('lang','ar','العربية')+chip('lang','both','English + العربية')+'</div></div>'
  +'<details class="rp-card"><summary style="cursor:pointer;font-weight:800">&#9998; Edit every text on the certificate</summary><p class="help">Leave a box empty to keep the default wording.</p><div class="rp-grid"><div><label class="rp-lbl" for="ctX_tEn">Title (English)</label><input class="field" id="ctX_tEn" data-c="tEn" dir="ltr" placeholder="Certificate of Completion" value="'+rpEsc(CT.tEn)+'"></div><div><label class="rp-lbl" for="ctX_tAr">Title (Arabic)</label><input class="field" id="ctX_tAr" data-c="tAr" dir="rtl" placeholder="&#1588;&#1607;&#1575;&#1583;&#1577; &#1573;&#1578;&#1605;&#1575;&#1605;" value="'+rpEsc(CT.tAr)+'"></div><div><label class="rp-lbl" for="ctX_pEn">Presented-to line (English)</label><input class="field" id="ctX_pEn" data-c="pEn" dir="ltr" placeholder="This certificate is proudly presented to" value="'+rpEsc(CT.pEn)+'"></div><div><label class="rp-lbl" for="ctX_pAr">Presented-to line (Arabic)</label><input class="field" id="ctX_pAr" data-c="pAr" dir="rtl" placeholder="&#1578;&#1615;&#1605;&#1606;&#1581; &#1607;&#1584;&#1607; &#1575;&#1604;&#1588;&#1607;&#1575;&#1583;&#1577; &#1573;&#1604;&#1609;" value="'+rpEsc(CT.pAr)+'"></div><div><label class="rp-lbl" for="ctX_bisTxt">Top line (Bismillah)</label><input class="field" id="ctX_bisTxt" data-c="bisTxt" dir="rtl" placeholder="" value="'+rpEsc(CT.bisTxt)+'"></div><div><label class="rp-lbl" for="ctX_msg">Extra message under the text</label><input class="field" id="ctX_msg" data-c="msg" dir="auto" placeholder="Keep going, may Allah bless you" value="'+rpEsc(CT.msg)+'"></div><div><label class="rp-lbl" for="ctX_tl">Left label (Teacher)</label><input class="field" id="ctX_tl" data-c="tl" dir="auto" placeholder="Teacher" value="'+rpEsc(CT.tl)+'"></div><div><label class="rp-lbl" for="ctX_dl">Right label (Date)</label><input class="field" id="ctX_dl" data-c="dl" dir="auto" placeholder="Date" value="'+rpEsc(CT.dl)+'"></div><div><label class="rp-lbl" for="ctX_sealIcon">Seal symbol</label><input class="field" id="ctX_sealIcon" data-c="sealIcon" dir="auto" placeholder="&#9733;" value="'+rpEsc(CT.sealIcon)+'"></div><div><label class="rp-lbl" for="ctX_sealTxt">Seal text (replaces the grade)</label><input class="field" id="ctX_sealTxt" data-c="sealTxt" dir="auto" placeholder="Top student" value="'+rpEsc(CT.sealTxt)+'"></div></div><div class="rp-grid rp-addrow" style="margin-top:8px"><div><span class="rp-lbl">Top line</span><div class="rp-chips">'+chip('nobis','','Show')+chip('nobis','1','Hide')+'</div></div><div><span class="rp-lbl">Seal</span><div class="rp-chips">'+chip('noseal','','Show')+chip('noseal','1','Hide')+'</div></div></div></details><div id="ctImpBox"></div>'
  +'<div class="rp-card"><h3><i>&#127912;</i> Design</h3><div class="ct-gal" id="ctGal">'+CT_DES.map(d=>'<button type="button" class="ct-gb" data-des="'+d.id+'" aria-pressed="'+(d.id===CT.design)+'"><div class="ct-th" data-ctfit="1"><div></div></div><b>'+d.n+'</b></button>').join('')+'</div>'
  
  +'<div class="row-actions"><button class="btn small" type="button" data-ca="imp">⬆ Import template</button><button class="btn small" type="button" data-ca="exp">⬇ Export template</button>'+'<button class="btn small" type="button" data-ca="del" hidden>🗑 Remove this template</button>'+'<button class="btn small" type="button" data-ca="reset">↺ Reset colors & fonts</button><input type="file" id="ctImpF" accept=".html,.htm,.json" hidden></div></div>'
  +'<div class="rp-bar"><div class="rp-act" style="grid-template-columns:repeat(2,1fr)"><button class="btn primary" type="button" data-ca="print"><span>🖨️</span>Print / PDF</button><button class="btn" type="button" data-ca="img"><span>🖼️</span>Picture</button></div></div>';
  ctSubVis(); ctLoadFonts(); ctRender(); ctImpPanel(); try{ rpUI(); }catch(e){}
  if(!p.dataset.ixb){ p.dataset.ixb='1'; p.addEventListener('input',ctImpEvt); p.addEventListener('change',e=>{ if(e.target.id==='ctImpF'){ ctImportFile(e.target.files[0]); e.target.value=''; } else ctImpEvt(e); }); p.addEventListener('click',ctImpClick); }
  if(!p.dataset.bound){ p.dataset.bound='1';
    const upd=t=>{ const k=t.dataset&&t.dataset.c; if(!k) return; CT[k]=t.value; if(k==='kind') ctSubVis(); if(k==='font'||k==='afont') ctLoadFonts(); ctSave(); ctRender(); };
    p.addEventListener('input',e=>upd(e.target)); p.addEventListener('change',e=>upd(e.target));
    p.addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b) return;
      if(b.dataset.cc){ CT[b.dataset.cc]=b.dataset.v; b.parentNode.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); ctSave(); ctRender(); return; }
      if(b.dataset.des){ CT.design=b.dataset.des; CT.c1=''; CT.c2=''; CT.bg=''; CT.tx=''; const d=ctDes(CT.design); $('ctC1').value=d.c1; $('ctC2').value=d.c2; ctSave(); ctLoadFonts(); ctRender(); ctImpPanel(); return; }
      if(b.dataset.ca==='reset'){ CT_KEYS.forEach(k=>CT[k]=''); ctSave(); ctBuild(); return; }
      if(b.dataset.ca==='print') ctPrint(); if(b.dataset.ca==='img') ctPng();
    });
    window.addEventListener('resize',ctFit);
  }
  setTimeout(ctFit,50);
}
const CT_PG=`.ct-mid>*,.ct-in>*{max-width:100%;overflow-wrap:anywhere}
.rc-row,.rc-subh,.rc-info b{overflow-wrap:anywhere}
div.ct:not(.both) .ct-mid{gap:8px}
div.ct:not(.both) .ct-t,div.ct:not(.both) .ct-ta{margin-top:0;line-height:1.3}
div.ct:not(.both) .ct-p,div.ct:not(.both) .ct-pa{margin-top:8px;line-height:1.5}
div.ct:not(.both) .ct-name{margin-top:14px;margin-bottom:6px}
div.ct:not(.both) .ct-ach,div.ct:not(.both) .ct-acha{margin-top:14px;line-height:1.6}
div.ct:not(.both) .ct-dua{margin-top:12px}
div.ct:not(.both) .ct-msg{margin-top:10px}`;
function ctPrint(){
  const all=[].concat.apply([],CT_DES.map(d=>[rpFam(d.f),rpFam(d.af)].concat(ctImpFonts(d)))).concat(ctFonts(CT)).filter(Boolean), u=rpFontURL(all);
  pvPrintDoc('<!doctype html><html><head><meta charset="utf-8"><title>Certificate</title>'+(u?'<link rel="stylesheet" href="'+u+'">':'')+'<style>'+CT_CSS+(typeof CT_CSS2!=='undefined'?CT_CSS2:'')+CT_PG+ctImpCSS()+'@page{size:A4 landscape;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;padding:0;background:#fff;width:1123px}</style></head><body>'+pvExport(ctHTML(CT),0,'cert')+'</body></html>');
}
async function ctPng(){
  window.RP_XF=ctFonts(CT); window.RP_XCSS=CT_CSS+(typeof CT_CSS2!=='undefined'?CT_CSS2:'')+CT_PG+ctImpCSS(); window.RP_XPAD=0;
  window.PV_FORCE='cert';
  try{ await rpToPng(ctHTML(CT),1123,'Certificate_'+(CT.name||'student')); } finally { window.PV_FORCE=null; window.RP_XF=null; window.RP_XCSS=''; window.RP_XPAD=null; }
}
(function(){ const f=rpTab; rpTab=function(n){ const r=f.apply(this,arguments); if(n==='cert'){ ctBuild(); } return r; }; })();

/* Arabic labels */
Object.assign(RP_AR,{'Certificate':'شهادة','Create a certificate when a student finishes a surah, a juz’, the Qur’an or a level. The preview above updates as you type.':'أنشئ شهادة عند إتمام الطالب سورة أو جزءًا أو القرآن أو مستوى. تتحدّث المعاينة أعلاه أثناء الكتابة.','Awarded for':'تُمنح عن','Finishing a surah':'إتمام سورة','Finishing a juz’':'إتمام جزء','Finishing the whole Qur’an':'إتمام القرآن كاملاً','Finishing Noor Al-Bayan':'إتمام القاعدة النورانية','Excellence & good conduct':'التميّز وحسن السلوك','Custom text':'نص مخصص','Surah':'السورة','Juz’':'الجزء','Type':'النوع','Memorisation':'حفظ','Recitation':'تلاوة','Revision':'مراجعة','Text in English (after “for…”)':'النص بالإنجليزية (بعد “for…”)','Text in Arabic':'النص بالعربية','Grade on the seal':'التقدير على الختم','None':'بدون','Student':'الطالب','👦 Boy':'ولد','👧 Girl':'بنت','Academy name':'اسم الأكاديمية','Certificate language':'لغة الشهادة','Design':'التصميم','Font (English)':'الخط (الإنجليزي)','Font (Arabic)':'الخط (العربي)','Main color':'اللون الأساسي','Accent color':'لون التمييز','Design default':'افتراضي التصميم','↺ Reset colors & fonts':'↺ إعادة الألوان والخطوط','Print / PDF':'طباعة / PDF','Picture':'صورة','Add homework (optional)':'إضافة واجب (اختياري)','Live preview':'معاينة مباشرة','Check for updates':'التحقق من التحديثات','Reload':'إعادة التحميل','New version installed':'تم تثبيت إصدار جديد','Aurora teal':'أورورا تركوازي','Aurora indigo':'أورورا نيلي','Soft sage':'ناعم أخضر','Soft rose':'ناعم وردي','Midnight gold':'منتصف الليل الذهبي','Ribbon navy':'شريط كحلي','Royal gold':'ذهبي ملكي','Emerald Islamic':'إسلامي زمردي','Modern clean':'عصري نظيف','Happy kids':'أطفال سعداء','Aurora':'أورورا','Soft':'ناعم','Midnight':'ليلي','Ribbon':'شريط','Emerald panel II':'لوحة زمردية ٢','Import template':'استيراد قالب','Export template':'تصدير قالب','Remove this template':'حذف هذا القالب','Texts in this template':'نصوص هذا القالب','Template font':'خط القالب','Edit each text, its font and its color. Type {name}, {date}, {teacher} or {academy} to fill a text from the fields above.':'عدّل كل نص وخطه ولونه. اكتب {name} أو {date} أو {teacher} أو {academy} لتعبئة النص من الحقول أعلاه.','Template imported':'تم استيراد القالب','English certificate script':'خطوط إنجليزية مزخرفة','English certificate serif':'خطوط إنجليزية كلاسيكية','Could not import this file':'تعذّر استيراد هذا الملف','Arabic calligraphy':'خطوط عربية فنية','Arabic Kufi & display':'خطوط كوفية وعناوين'});

/* ---------- Paste a full report text ---------- */
function rpParseText(raw){
  const AD='٠١٢٣٤٥٦٧٨٩';
  const t=String(raw||'').replace(/[٠-٩]/g,d=>AD.indexOf(d)).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\r/g,'');
  const nz=x=>String(x||'').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[^a-z0-9\u0621-\u064a]/g,'');
  const SN=RP_SURAHS.map((s,i)=>{ const a=nz(s[0]), b=nz(RP_SURAHS_AR[i]||''); return {i:i,n:[a,a.replace(/^(al|an|ar|as|at|ad|az|ash|adh)/,''),b,b.replace(/^ال/,'')].filter(x=>x.length>=3)}; });
  const R={subjects:[],data:{},hw:{},unparsed:0,name:'',date:'',dur:0,timing:'',teacher:'',grade:''};
  function qParse(str){ const out=[];
    { const rg=/(?:\bsurah\s+)?([^;؛,،]+?)\s+(?:to|الى|إلى)\s+(?:surah\s+|سورة\s+)?([^;؛,،(]+?)\s*\(\s*\d+\s*(?:full surahs?|سور(?:ة)? كاملة)\s*\)/ig, rest=String(str); let mm, any=false, last=0, txt='';
      const find=x=>{ const k=nz(x.replace(/\b(surah|sura|soorah|from|the)\b/ig,' ').replace(/سورة|من/g,' ')); let b=null,bl=0; SN.forEach(sn=>sn.n.forEach(n=>{ if(k.includes(n)&&n.length>bl){ b=sn; bl=n.length; } })); return b; };
      while((mm=rg.exec(rest))){ const a=find(mm[1]), z=find(mm[2]); if(a&&z){ any=true; const d=z.i>=a.i?1:-1; for(let q=a.i;;q+=d){ out.push({s:String(q+1),f:'',t:''}); if(q===z.i) break; } txt+=rest.slice(last,mm.index)+' ; '; last=mm.index+mm[0].length; } }
      if(any){ str=txt+rest.slice(last); } }
    String(str).split(/\s*(?:;|؛|\band\b|\s\+\s|\s&\s|،)\s*/i).forEach(seg=>{ seg=seg.trim(); if(!seg) return;
      const w=seg.replace(/\b(surah|sura|soorah|verses?|ayah|ayat|from|to|full|complete|entire|the)\b/gi,' ').replace(/سورة|كاملة|الآيات|آيات|آية/g,' ');
      const k=nz(w); let best=null,bl=0; SN.forEach(s=>s.n.forEach(n=>{ if(k.includes(n)&&n.length>bl){ best=s; bl=n.length; } }));
      if(!best){ const m=/(?:surah|sura|سورة)\s*(\d{1,3})/i.exec(seg); if(m&&+m[1]>=1&&+m[1]<=114) best=SN[+m[1]-1]; }
      if(!best) return;
      const rest=seg.replace(/(?:surah|sura|سورة)\s*\d{1,3}/ig,' '); let f='',tt='',m=/(\d+)\s*(?:-|–|—|to|الى|إلى|الي)\s*(\d+)/i.exec(rest);
      if(m){ f=m[1]; tt=m[2]; } else if((m=/(?:verse|ayah|ayat|آية)\s*(\d+)/i.exec(rest))){ f=tt=m[1]; }
      if(/full|complete|entire|كامل/i.test(seg)){ f=''; tt=''; }
      out.push({s:String(best.i+1),f:f,t:tt}); }); return out; }
  const subKey=l=>{ const x=nz(l); if(!x) return null;
    if(/quran|قران/.test(x)) return 'quran'; if(/arabic|عربي|العربيه/.test(x)) return 'arabic'; if(/noor|نور/.test(x)) return 'noor';
    if(/tajw|تجويد/.test(x)) return 'tajweed'; if(/islamic|اسلامي|دينيه/.test(x)) return 'islamic';
    const c=REPF.subjects.find(k=>k.indexOf('x_')===0&&nz(k.slice(2))===x); return c||null; };
  const addSub=k=>{ if(k&&R.subjects.indexOf(k)<0) R.subjects.push(k); };
  const addDone=(k,v)=>{ R.data[k+'.done']=((R.data[k+'.done']||'')+' '+v).trim(); };
  const noor=[]; let sec='head',cur=null,lastHw=null;
  const putQ=(o,key,rest)=>{ const q=qParse(rest); if(q.length){ o[key]=(o[key]||[]).concat(q); return true; } return false; };
  const norm=txt=>{ /* accepts the Copy-button layout (*bold*, ─── lines, "- " bullets, no colons) as well as "Label: value" */
    const ls=txt.replace(/[*_✦]/g,'').split('\n').map(x=>x.trim()), head=[], body=[]; let sig=false,tl='',zone='head';
    const isSep=x=>/^[\s─━═\-–—=~]{3,}$/.test(x), isBul=x=>/^[-•▪]\s*/.test(x);
    const HL=/^(student|name|الطالبة?|اسم الطالبة?|subjects?|المادة|المواد|date|التاريخ|duration|المدة|teacher|المعلمة?|المعلم)\s+(?![:：])(.+)$/i;
    const nextBul=i=>{ for(let j=i+1;j<ls.length;j++){ if(!ls[j]||isSep(ls[j])) continue; return isBul(ls[j]); } return false; };
    ls.forEach((l,i)=>{
      if(!l){ body.push(''); return; } if(isSep(l)||/^بسم الله/.test(l)) return;
      if(sig){ if(!tl) tl=l; return; }
      if(/^(جزاكم الله|jazakum allahu)/i.test(l)){ sig=true; return; }
      if(/^(lesson notes|ملاحظات الدرس)\s*[:：]?\s*$/i.test(l)){ zone='notes'; body.push(l); return; }
      if(/^(homework|الواجب(?: المنزلي)?|الواجبات)\s*[:：]?\s*$/i.test(l)){ zone='hw'; body.push(l); return; }
      if(/^(grade|التقييم|الدرجة)\b/i.test(l)){ zone='grade'; body.push(l); return; }
      if(zone==='head'&&!isBul(l)&&nextBul(i)&&!/[:：]/.test(l)){ zone='notes'; body.push('Lesson Notes'); }
      if(zone==='head'){ { const pp=l.split(/\s+·\s+/).map(x=>x.trim()); if(pp.length===3&&/\d{1,4}[\/\-.]\d{1,2}[\/\-.]\d{1,4}/.test(pp[1])){ head.push('Student: '+pp[0],'Date: '+pp[1],'Duration: '+pp[2]); return; } } l.split(/\s+·\s+/).forEach(p=>{ p=p.trim(); const m=HL.exec(p); head.push(m?m[1]+': '+m[2]:p); }); return; }
      if(isBul(l)){ let b=l.replace(/^[-•▪]\s*/,''); const m=/^(.{1,40}?)\s+[—–]\s+(.+)$/.exec(b);
        if(m&&(/^(new memori[sz]ation|new|revision|review|حفظ جديد|الحفظ الجديد|الحفظ|مراجعة|المراجعة)$/i.test(m[1].trim())||subKey(m[1]))) b=m[1].trim()+': '+m[2];
        body.push(b); return; }
      if(zone==='notes'&&!/[:：]\s*$/.test(l)&&nextBul(i)){ body.push(l+':'); return; }
      body.push(l); });
    if(tl) head.push('Teacher: '+tl.split(/\s+·\s+/)[0]);
    return head.concat(body).join('\n'); };
  norm(t).split('\n').forEach(raw=>{ raw=raw.trim(); if(!raw) return; const l=raw.replace(/^[^\p{L}\p{N}]+/u,''); if(!l) return; let m;
    if(/^(lesson report|تقرير الدرس)$/i.test(l)) return;
    if(/^(lesson notes|ملاحظات الدرس)\s*[:：]?\s*$/i.test(l)){ sec='notes'; cur=null; return; }
    if(/^(homework|الواجب(?: المنزلي)?|الواجبات)\s*[:：]?\s*$/i.test(l)){ sec='hw'; lastHw=null; return; }
    if((m=/^(grade|التقييم|الدرجة)\s*[:：]?\s*(.*)$/i.exec(l))){ sec='grade'; if(m[2]) R.grade=m[2].trim(); return; }
    if(sec==='head'){
      const dash=v=>/^[—–\-?\s]*$/.test(v);
      if((m=/^(?:student[’'`]?s?\s*name|student|name|اسم الطالبة?|الطالبة?)\s*[:：]\s*(.+)$/i.exec(l))){ if(!dash(m[1])) R.name=m[1].trim(); return; }
      if((m=/^(?:subjects?|المادة|المواد)\s*[:：]\s*(.+)$/i.exec(l))){ m[1].split(/\s*(?:,|،|؛|;|\band\b|\s&\s|\+)\s*/i).forEach(x=>{ x=x.trim(); if(!x) return; addSub(subKey(x)||'x_'+x); }); return; }
      if((m=/^(?:duration|المدة)\s*[:：]\s*(.+)$/i.exec(l))){ const v=m[1].toLowerCase(); let mins=0,h,mi;
        if(/ساعتان/.test(v)) mins=120; else if((h=/(\d+(?:[.,]\d+)?)\s*(?:h\b|hr|hour|ساع)/i.exec(v))) mins=Math.round(parseFloat(h[1].replace(',','.'))*60); else if(/ساعة/.test(v)) mins=60;
        if((mi=/(\d+)\s*(?:m\b|min|دقيق|دقائق)/i.exec(v))) mins+=+mi[1]; if(!mins&&(mi=/^\D*(\d{1,3})\D*$/.exec(v))) mins=+mi[1];
        R.dur=mins; R.timing=/late|متأخر/.test(v)?'late':/short|مختصر|قصير/.test(v)?'short':/extend|extra|ممتد|اضافي|إضافي/.test(v)?'extra':''; return; }
      if((m=/^(?:date|التاريخ)\s*[:：]\s*(.+)$/i.exec(l))){ const v=m[1].trim(); let a;
        if((a=/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/.exec(v))) R.date=a[3]+'-'+a[2].padStart(2,'0')+'-'+a[1].padStart(2,'0');
        else if((a=/(\d{4})-(\d\d)-(\d\d)/.exec(v))) R.date=a[0];
        else { const d=new Date(v); if(!isNaN(d)) R.date=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); } return; }
      if((m=/^(?:teacher|(?:ال)?معلّ?م[ةه]?)\s*[:：]\s*(.+)$/i.exec(l))){ if(!/^[—–\-?\s]*$/.test(m[1])) R.teacher=m[1].trim(); return; }
      return;
    }
    if(sec==='grade'){ R.grade=(R.grade?R.grade+' ':'')+l; return; }
    const lab=/^(.{1,40}?)\s*[:：]\s*(.*)$/.exec(l), L=lab?lab[1].trim():'', rest=lab?lab[2].trim():'';
    if(sec==='notes'){
      if(lab){
        if(cur==='quran'){ const ff=/^(new memori[sz]ation|new|حفظ جديد|الحفظ الجديد|الحفظ)$/i.test(L)?'new':/^(revision|review|مراجعة|المراجعة)$/i.test(L)?'rev':'';
          if(ff){ if(rest&&!putQ(R.data,'quran.'+ff,rest)) R.unparsed++; return; } }
        const k=subKey(L);
        if(k){ cur=k; addSub(k); if(rest){ if(k==='quran'){ if(!putQ(R.data,'quran.new',rest)) R.unparsed++; } else if(k==='noor') noor.push(rest); else addDone(k,rest); } return; }
        if(!rest){ const k2='x_'+L; cur=k2; addSub(k2); return; }
      }
      if(!cur){ R.unparsed++; return; }
      if(cur==='quran'){ if(!putQ(R.data,'quran.new',l)) R.unparsed++; } else if(cur==='noor') noor.push(l); else addDone(cur,l);
      return;
    }
    if(sec==='hw'){
      let k=lab?subKey(L):null, txt=k?rest:l; if(!k){ k=lastHw; } if(!k){ R.unparsed++; return; } lastHw=k; addSub(k); if(!txt) return;
      if(k==='quran'){ if(!putQ(R.hw,'quran',txt)) R.unparsed++; } else R.hw[k]=((R.hw[k]||'')+' '+txt).trim();
    }
  });
  if(noor.length) R.data['noor.note']=noor.join(' ');
  return R;
}
function rpApplyParsed(R){
  const f=[];
  if(R.name){ $('rpName').value=R.name; f.push('name'); }
  if(R.date){ $('rpDate').value=R.date; f.push('date'); }
  if(R.dur){ rpSetDur(R.dur); $('rpTime').value=R.timing||''; f.push('duration'); }
  if(R.teacher){ $('rpTeacher').value=R.teacher; f.push('teacher'); }
  if(R.subjects.length){ REPF.id=null; REPF.subjects=R.subjects; REPF.data=R.data; REPF.hw=R.hw; f.push(R.subjects.length+' subject'+(R.subjects.length>1?'s':'')); }
  if(R.grade){ const gk=x=>String(x).toLowerCase().replace(/[^a-z\u0621-\u064a]/g,''), gt=gk(R.grade); let gi=-1;
    RP_GRADES.forEach((g,i)=>{ if(gi<0&&gt&&(gk(g)===gt||gt.indexOf(gk(g))===0||(gt.length>3&&gk(g).indexOf(gt)===0))) gi=i; });
    if(gi<0) RP_GRADES_AR.forEach((g,i)=>{ if(gi<0&&gt&&gk(g)===gt) gi=i; });
    if(gi>=0) REPF.grade=RP_GRADES[gi]; else { REPF.grade=R.grade; const cg=rpCG(); if(cg.indexOf(R.grade)<0){ cg.push(R.grade); lsSet('lp.rep.cg',JSON.stringify(cg)); } }
    f.push('grade'); }
  rpChips(); rpBuildSections(); rpPreview();
  toast(f.length?'Filled: '+f.join(', ')+(R.unparsed?' ('+R.unparsed+' line'+(R.unparsed>1?'s':'')+' not recognised)':''):'Nothing recognised - check the format');
}
function rpPasteOpen(){
  if($('rpPasteBox')) return; const d=document.createElement('div'); d.id='rpPasteBox';
  d.style.cssText='position:fixed;inset:0;z-index:96;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';
  d.innerHTML='<div class="rp-card" style="width:100%;max-width:560px;margin:0;max-height:92vh;overflow:auto"><h3 style="margin:0 0 6px">&#128203; Paste report text</h3><p class="help" style="margin:0 0 8px">Paste a full report (same layout as the Copy button). The fields fill in automatically.</p><textarea class="field" id="rpPasteTa" rows="11" dir="auto" placeholder="Student’s Name: Hamza&#10;Subject: Qur’an&#10;Duration: 1 hour&#10;Date: 31/10/2026&#10;&#10;Lesson Notes&#10;Qur’an:&#10;New Memorisation: Surah Al-Fatihah (full surah)&#10;&#10;Homework&#10;Qur’an: Surah Al-Ikhlas (full surah)&#10;&#10;Grade&#10;Excellent, MashaAllah!"></textarea><div class="row-actions" style="margin-top:10px"><button class="btn primary" id="rpPasteGo" type="button">Fill the fields</button><button class="btn" id="rpPasteClip" type="button">Paste from clipboard</button><button class="btn" id="rpPasteX" type="button">Cancel</button></div></div>';
  document.body.appendChild(d); const ta=$('rpPasteTa'); ta.focus();
  const close=()=>{ d.remove(); document.removeEventListener('keydown',esc); }, esc=e=>{ if(e.key==='Escape') close(); };
  document.addEventListener('keydown',esc);
  d.addEventListener('click',e=>{ if(e.target===d) close(); });
  $('rpPasteX').onclick=close;
  $('rpPasteClip').onclick=async()=>{ try{ ta.value=await navigator.clipboard.readText(); }catch(e){ toast('Long-press the box and paste'); } };
  $('rpPasteGo').onclick=()=>{ if(!ta.value.trim()){ toast('Paste the report text first'); return; } rpApplyParsed(rpParseText(ta.value)); close(); };
}
document.addEventListener('click',e=>{ if(e.target.closest('#rpPasteBtn')) rpPasteOpen(); });

/* ---------- Timer reset ---------- */
(function(){ const b=$('resetTimer'); if(!b) return;
  b.addEventListener('click',()=>{ if(elapsedMs()>=10000&&!confirm('Reset the timer to 00:00?')) return;
    S.elapsed=0; S.running=false; S.runStart=0; S.slideStart=0; try{ setWake(false); }catch(e){}
    saveState(); renderClockBtn(); try{ renderTop(); }catch(e){} tick(); toast('Timer reset'); }); })();

/* ---------- Reports layout helpers ---------- */
(function(){
  const root=document.documentElement;
  function stk(){ const tabs=$('rpTabs'), hd=document.querySelector('header.top'), v=$('view-reports'); if(!tabs||!hd||!v) return;
    let sc=tabs.parentElement; while(sc&&sc!==document.body&&sc!==root&&!/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc=sc.parentElement;
    const cb=(sc&&sc!==document.body&&sc!==root)?sc.getBoundingClientRect().top:0;
    { const th=document.body.classList.contains('split')?'0px':Math.max(0,Math.round(hd.getBoundingClientRect().bottom-cb))+'px'; if(root.style.getPropertyValue('--topH')!==th) root.style.setProperty('--topH',th); }
    const was=v.classList.contains('rp-wide'), wide=v.clientWidth>=900; if(was!==wide){ v.classList.toggle('rp-wide',wide); try{ ctFit(); }catch(e){} } }
  window.addEventListener('resize',stk); setInterval(()=>{ const v=$('view-reports'); if(document.hidden||!v||v.hidden) return; stk(); },4000); setTimeout(stk,200);
  if(window.ResizeObserver){ const hd=document.querySelector('header.top'); if(hd) new ResizeObserver(stk).observe(hd); }
})();

/* ---------- App version & updates ---------- */
const APP_VERSION='1.4.0';
(function(){
  const v=$('appVer'); if(v) v.querySelector('b').textContent=APP_VERSION;
  const num=x=>x.split('.').map(Number); const newer=(a,b)=>{ const A=num(a),B=num(b); for(let i=0;i<3;i++){ if((A[i]||0)!==(B[i]||0)) return (A[i]||0)>(B[i]||0); } return false; };
  async function applyNew(){ try{ const ks=await caches.keys(); await Promise.all(ks.map(k=>caches.delete(k))); const rg=await navigator.serviceWorker.getRegistration(); if(rg) await rg.unregister(); }catch(e){} location.reload(); }
  function bar(ver){ let d=$('updBar'); if(d) d.remove(); d=document.createElement('div'); d.id='updBar'; d.innerHTML='<span>New version '+ver+' is ready</span><button type="button">Update now</button>'; d.querySelector('button').onclick=applyNew; document.body.appendChild(d); }
  const u=$('appUpd'); if(u) u.addEventListener('click',async()=>{
    u.disabled=true; const t=u.textContent; u.textContent='Checking...';
    try{ const r=await fetch(location.pathname.replace(/[^\/]*$/,'')+'index.html?_='+Date.now(),{cache:'no-store'}); const m=(await r.text()).match(/APP_VERSION='([\d.]+)'/);
      if(m&&newer(m[1],APP_VERSION)) bar(m[1]); else toast('You already have the latest version v'+APP_VERSION);
    }catch(x){ toast('Could not check - are you online?'); }
    u.disabled=false; u.textContent=t; });
})();

try{ if(lsGet('lp.rep.tab')==='cert') rpTab('cert'); else rpDesignPv(); }catch(e){}

