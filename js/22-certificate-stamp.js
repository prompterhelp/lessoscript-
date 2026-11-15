/* Certificate stamp option (additive): adds "Stamp" choices to Reports > Certificate. Nothing else is modified. */
(function(){
  if(typeof CT==='undefined'||typeof ctHTML!=='function'||typeof ctBuild!=='function') return;
  var COLS={blue:'#1f3a8a',green:'#0f6b4a',maroon:'#8a1c2b',black:'#111111'};
  var AR_FONT="'Amiri','Noto Naskh Arabic',serif", EN_FONT="'Cormorant Garamond',Georgia,serif";
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function stampSVG(lang,col,c){
    c=c||{}; var ar=lang==='ar', W=900,H=400,cx=W/2, f=ar?AR_FONT:EN_FONT, real=c.stampReal!=='off';
    var name=(c.stampName||'').trim()||(ar?'جهاد صبح':'Jehad Soboh');
    var title=(c.stampTitle||'').trim()||(ar?'معلم القرآن والتجويد واللغة العربية':'Quran, Tajweed & Arabic Teacher');
    var k=ar?0.42:0.5, ns=ar?120:104, ts=42, maxW=760;
    ns=Math.min(ns,maxW/(Math.max(1,name.length)*k)); ts=Math.min(ts,maxW/(Math.max(1,title.length)*k*(ar?1.05:0.95)));
    var dir=ar?'rtl':'ltr', s='';
    if(real) s+='<defs><filter id="stInk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3 3.05" result="m"/><feComposite in="d" in2="m" operator="in"/></filter></defs><g filter="url(#stInk)" opacity="0.95">';
    s+='<rect x="32" y="32" width="'+(W-64)+'" height="'+(H-64)+'" rx="44" fill="none" stroke="'+col+'" stroke-width="'+(real?7:2.5)+'"/>';
    if(real) s+='<rect x="48" y="48" width="'+(W-96)+'" height="'+(H-96)+'" rx="32" fill="none" stroke="'+col+'" stroke-width="2.5"/>';
    [-1,0,1].forEach(function(i){ s+='<rect x="-7" y="-7" width="14" height="14" rx="3" fill="'+col+'" transform="translate('+(cx+i*44)+',78) rotate(45)"/>'; });
    s+='<text x="'+cx+'" y="178" text-anchor="middle" dominant-baseline="central" direction="'+dir+'" font-family="'+f+'" font-size="'+ns+'" font-weight="700" fill="'+col+'">'+esc(name)+'</text>';
    var gid='stF'+String(col).replace(/[^a-z0-9]/gi,'');
    s+='<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+col+'" stop-opacity="0"/><stop offset="0.5" stop-color="'+col+'"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></linearGradient></defs>';
    s+='<rect x="'+(cx-220)+'" y="258" width="440" height="2.5" fill="url(#'+gid+')"/>';
    s+='<text x="'+cx+'" y="308" text-anchor="middle" dominant-baseline="central" direction="'+dir+'" font-family="'+f+'" font-size="'+ts+'" font-weight="700" fill="'+col+'">'+esc(title)+'</text>';
    if(real) s+='</g>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="28 28 '+(W-56)+' '+(H-56)+'" width="100%" height="100%" style="display:block;overflow:visible">'+s+'</svg>';
  }
  function stampDiv(c){
    var col=COLS[c.stampCol]||COLS.blue, w=+c.stampW||250, h=Math.round(w*344/844);
    var x=(c.stampX!=null&&c.stampX!=='')?+c.stampX:(c.stampSide==='r'?82.6:17.4), y=(c.stampY!=null&&c.stampY!=='')?+c.stampY:83;
    return '<div class="ct-stamp" style="position:absolute;z-index:5;left:'+x+'%;top:'+y+'%;width:'+w+'px;height:'+h+'px;margin:'+(-h/2)+'px 0 0 '+(-w/2)+'px;transform:rotate('+(+c.stampR||0)+'deg);'+(c.stampReal!=='off'?'mix-blend-mode:multiply;':'')+'touch-action:none">'+stampSVG(c.stamp,col,c)+'</div>';
  }
  /* put the stamp on the certificate (preview, print and picture) */
  var _ctHTML=ctHTML;
  ctHTML=function(c,desId){
    var h=_ctHTML.apply(this,arguments);
    if(!desId&&c&&(c.stamp==='ar'||c.stamp==='en')) h=h.replace(/<\/div>\s*$/,stampDiv(c)+'</div>');
    return h;
  };
  /* make sure the stamp fonts are loaded / embedded in the picture */
  if(typeof ctFonts==='function'&&typeof rpFam==='function'){
    var _ctFonts=ctFonts;
    ctFonts=function(c){
      var a=_ctFonts.apply(this,arguments);
      if(c&&(c.stamp==='ar'||c.stamp==='en')){ [rpFam('Amiri'),rpFam('Cormorant Garamond')].forEach(function(x){ if(x&&a.indexOf(x)<0) a.push(x); }); }
      return a;
    };
  }
  /* the option card in Reports > Certificate */
  var _ctBuild=ctBuild;
  ctBuild=function(){
    var r=_ctBuild.apply(this,arguments);
    try{
      var p=document.getElementById('rpCertPane'); if(!p||p.querySelector('#ctStampCard')) return r;
      var chip=function(k,v,t,d){ return '<button type="button" class="rp-chip" data-stk="'+k+'" data-v="'+v+'" aria-pressed="'+((CT[k]||d||'')===v)+'">'+t+'</button>'; };
      var card=document.createElement('div'); card.className='rp-card'; card.id='ctStampCard';
      card.innerHTML='<h3><i>🔏</i> Stamp</h3><p class="help">Add a stamp to the certificate. It prints and saves with it.</p>'
        +'<span class="rp-lbl">Stamp</span><div class="rp-chips">'+chip('stamp','','None')+chip('stamp','ar','العربية')+chip('stamp','en','English')+'</div>'
        +'<span class="rp-lbl" style="margin-top:10px">Stamp name (blank = default)</span><input type="text" id="stNm" class="field" dir="auto" style="margin-top:4px" placeholder="Jehad Soboh / جهاد صبح">'
        +'<span class="rp-lbl" style="margin-top:8px">Stamp title (blank = default)</span><input type="text" id="stTt" class="field" dir="auto" style="margin-top:4px" placeholder="Quran, Tajweed &amp; Arabic Teacher">'
        +'<span class="rp-lbl" style="margin-top:10px">Look</span><div class="rp-chips">'+chip('stampReal','on','Real ink stamp','on')+chip('stampReal','off','Clean','on')+'</div>'
        +'<span class="rp-lbl" style="margin-top:10px">Ink color</span><div class="rp-chips">'+chip('stampCol','blue','Blue')+chip('stampCol','green','Green')+chip('stampCol','maroon','Maroon')+chip('stampCol','black','Black')+'</div>'
        +'<span class="rp-lbl" style="margin-top:10px">Position</span><div class="rp-chips">'+chip('stampSide','l','Left')+chip('stampSide','r','Right')+'</div><p class="help" style="margin:6px 0 0">Tip: drag the stamp on the preview to move it anywhere.</p>'
        +'<span class="rp-lbl" style="margin-top:10px">Move: left ⇄ right</span><input type="range" id="stSx" min="0" max="100" step="0.5" style="width:100%">'
        +'<span class="rp-lbl">Move: up ⇅ down</span><input type="range" id="stSy" min="0" max="100" step="0.5" style="width:100%">'
        +'<span class="rp-lbl" style="margin-top:10px">Rotate (<b id="stRv">0</b>°)</span><input type="range" id="stSr" min="-180" max="180" step="1" style="width:100%"><button type="button" class="rp-chip" id="stR0" style="margin-top:4px">Reset angle</button>'
        +'<span class="rp-lbl" style="margin-top:10px">Stamp size</span><div class="rp-chips">'+chip('stampW','170','Small')+chip('stampW','250','Medium','250')+chip('stampW','330','Large')+chip('stampW','420','XL')+'</div>'
        +'<h3 style="margin-top:16px"><i>🖨️</i> Print paper</h3><p class="help">Print / PDF uses exactly this size (certificate is scaled to fit).</p>'
        +'<span class="rp-lbl">Paper size</span><div class="rp-chips">'+chip('paper','a4','A4','a4')+chip('paper','a3','A3','a4')+chip('paper','a5','A5','a4')+chip('paper','letter','Letter','a4')+chip('paper','legal','Legal','a4')+'</div>'
        +'<span class="rp-lbl" style="margin-top:10px">Orientation</span><div class="rp-chips">'+chip('orient','l','Landscape','l')+chip('orient','p','Portrait','l')+'</div>';
      var sx=card.querySelector('#stSx'), sy=card.querySelector('#stSy');
      var curXY=function(){ return [(CT.stampX!=null&&CT.stampX!=='')?+CT.stampX:(CT.stampSide==='r'?82.6:17.4),(CT.stampY!=null&&CT.stampY!=='')?+CT.stampY:83]; };
      window.syncSl=function(){ var v=curXY(); sx.value=v[0]; sy.value=v[1]; };
      syncSl();
      var slide=function(){ CT.stampX=+sx.value; CT.stampY=+sy.value;
        document.querySelectorAll('#rpCertPane .ct-stamp').forEach(function(el){ el.style.left=CT.stampX+'%'; el.style.top=CT.stampY+'%'; });
        try{ ctSave(); }catch(_){} };
      sx.addEventListener('input',slide); sy.addEventListener('input',slide);
      var nm=card.querySelector('#stNm'), tt=card.querySelector('#stTt');
      nm.value=CT.stampName||''; tt.value=CT.stampTitle||'';
      var txt=function(){ CT.stampName=nm.value; CT.stampTitle=tt.value; try{ ctSave(); }catch(_){} try{ ctRender(); }catch(_){} };
      nm.addEventListener('input',txt); tt.addEventListener('input',txt);
      var sr=card.querySelector('#stSr'), rv=card.querySelector('#stRv');
      var rot=function(a){ CT.stampR=a; sr.value=a; rv.textContent=a;
        document.querySelectorAll('#rpCertPane .ct-stamp').forEach(function(el){ el.style.transform='rotate('+a+'deg)'; });
        try{ ctSave(); }catch(_){} };
      sr.value=+CT.stampR||0; rv.textContent=sr.value;
      sr.addEventListener('input',function(){ rot(+sr.value); });
      card.querySelector('#stR0').addEventListener('click',function(){ rot(0); });
      card.addEventListener('click',function(e){
        var b=e.target.closest('button[data-stk]'); if(!b) return;
        CT[b.dataset.stk]=b.dataset.v; if(b.dataset.stk==='stampSide'){ CT.stampX=b.dataset.v==='r'?82.6:17.4; CT.stampY=83; syncSl(); }
        card.querySelectorAll('button[data-stk="'+b.dataset.stk+'"]').forEach(function(x){ x.setAttribute('aria-pressed',String(x===b)); });
        try{ ctSave(); }catch(_){}
        try{ if(typeof ctLoadFonts==='function') ctLoadFonts(); ctRender(); }catch(_){}
      });
      var bar=p.querySelector('.rp-bar'); if(bar&&bar.parentNode) bar.parentNode.insertBefore(card,bar); else p.appendChild(card);
    }catch(e){}
    return r;
  };

  /* ---- drag the stamp on the preview ---- */
  var st=document.createElement('style'); st.textContent='#rpCertPane .ct-stamp{cursor:grab}#rpCertPane .ct-stamp:hover{outline:1.5px dashed rgba(0,0,0,.45);outline-offset:3px}@media print{.ct-stamp{outline:none!important}}';
  document.head.appendChild(st);
  var drag=null; window.syncSl=window.syncSl||function(){};
  document.addEventListener('pointerdown',function(e){
    var el=null; try{ el=document.elementsFromPoint(e.clientX,e.clientY).map(function(n){ return n.closest&&n.closest('#rpCertPane .ct-stamp'); }).filter(Boolean)[0]; }catch(_){} if(!el) return;
    var ct=el.closest('.ct'); if(!ct) return;
    e.preventDefault(); e.stopPropagation();
    drag={el:el,ct:ct,id:e.pointerId}; document.body.style.userSelect='none';
  },true);
  document.addEventListener('pointermove',function(e){
    if(!drag) return; e.preventDefault();
    var r=drag.ct.getBoundingClientRect();
    var x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)), y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));
    drag.el.style.left=x+'%'; drag.el.style.top=y+'%'; drag.x=x; drag.y=y;
  },true);
  function dragEnd(e){ if(!drag) return; document.body.style.userSelect=''; if(drag.x!=null){ CT.stampX=+drag.x.toFixed(2); CT.stampY=+drag.y.toFixed(2); try{ ctSave(); }catch(_){} syncSl(); } drag=null; }
  document.addEventListener('pointerup',dragEnd,true); document.addEventListener('pointercancel',dragEnd,true);
  document.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('#rpCertPane .ct-stamp')){ e.stopPropagation(); e.preventDefault(); } },true);

  /* ---- print at the chosen paper size ---- */
  var PAPER={a4:[210,297],a3:[297,420],a5:[148,210],letter:[215.9,279.4],legal:[215.9,355.6]};
  ctPrint=function(){
    var p=PAPER[CT.paper]||PAPER.a4, land=(CT.orient||'l')!=='p', wm=land?p[1]:p[0], hm=land?p[0]:p[1];
    var mm=96/25.4, pw=Math.round(wm*mm), ph=Math.round(hm*mm), k=Math.min(pw/1123,ph/794);
    var all=[].concat.apply([],CT_DES.map(function(d){ return [rpFam(d.f),rpFam(d.af)].concat(ctImpFonts(d)); })).concat(ctFonts(CT)).filter(Boolean), u=rpFontURL(all);
    
    /* Strip conflicting @page rules from CT_PG so our paper size wins */
    var basePg=(typeof CT_PG==='string')?CT_PG.replace(/@page\s*\{[^}]*\}/gi,''):'';
    var css=CT_CSS+(typeof CT_CSS2!=='undefined'?CT_CSS2:'')+basePg+ctImpCSS();
    var certMarkup=ctLiveHTML()||(typeof pvExport==='function'?pvExport(ctHTML(CT),0,'cert'):ctHTML(CT));

    var html='<!doctype html><html><head><meta charset="utf-8"><title>Certificate</title>'
      +(u?'<link rel="stylesheet" href="'+u+'">':'')
      +'<style>'+css
      +'@page{size:'+wm+'mm '+hm+'mm;margin:0 !important;}'
      +'*{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;box-sizing:border-box;}'
      +'html,body{margin:0 !important;padding:0 !important;background:#fff !important;width:'+wm+'mm;height:'+hm+'mm;overflow:hidden !important;}'
      +'#print-stage{position:relative;width:'+pw+'px;height:'+ph+'px;overflow:hidden;background:#fff;page-break-after:avoid;page-break-inside:avoid;}'
      +'#cw{position:absolute;left:50%;top:50%;width:1123px;height:794px;transform-origin:center center;transform:translate(-50%,-50%);}'
      +'.ct{width:1123px !important;height:794px !important;margin:0 !important;box-shadow:none !important;transform:none !important;}'
      +'</style></head><body><div id="print-stage"><div id="cw">'+certMarkup+'</div></div></body></html>';

    var f=document.createElement('iframe');
    f.style.cssText='position:fixed;left:-9999px;top:0;width:1123px;height:794px;border:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(f);
    var w=f.contentWindow, d=w.document; d.open(); d.write(html); d.close();

    var go=function(){
      /* Apply scale AFTER ctFitMid has measured unscaled 1123x794 layout */
      var cw=d.getElementById('cw');
      if(cw) cw.style.transform='translate(-50%,-50%) scale('+k.toFixed(5)+')';
      setTimeout(function(){
        try{ w.focus(); w.print(); }catch(e){ try{ toast('Print failed - use Picture instead'); }catch(_){} }
        setTimeout(function(){ f.remove(); },120000);
      },150);
    };

    var lk=d.querySelector('link[rel=stylesheet]'), ls=lk?new Promise(function(r){ lk.onload=lk.onerror=r; setTimeout(r,3500); }):Promise.resolve();
    ls.then(function(){
      var fam=(d.fonts&&d.fonts.load)?Array.prototype.map.call(d.querySelectorAll('.ct *'),function(n){ return w.getComputedStyle(n).fontFamily; }).filter(function(v,i,a){ return a.indexOf(v)===i; }).slice(0,30).map(function(fn){ return d.fonts.load('20px '+fn,'\u0627Aa').catch(function(){}); }):[];
      return Promise.race([Promise.all(fam).then(function(){ return d.fonts.ready; }),new Promise(function(r){ setTimeout(r,3500); })]);
    }).then(function(){
      /* Only run ctFitMid if we fell back to raw ctHTML; live HTML already has fitted font sizes */
      if(!ctLiveHTML()){ try{ ctFitMid(d.querySelector('.ct')); }catch(e){} }
      go();
    });
  };
  /* if the Certificate tab is already open, add the card now */
  try{ if(document.getElementById('ctPv')) ctBuild(); }catch(e){}
})();


/* ---- Print / Picture copy the clean certificate element without editor UI artifacts ---- */
function ctLiveHTML(){
  try{
    var pv=document.getElementById('ctPv'); if(!pv) return '';
    var ctNode=pv.querySelector('.ct'); if(!ctNode) return '';
    var clone=ctNode.cloneNode(true);

    /* Remove preview scaling/positioning styles on the root .ct element */
    clone.style.transform='';
    clone.style.transformOrigin='';
    clone.style.margin='';
    clone.style.boxShadow='';
    clone.style.outline='';

    /* Remove all editor guides, resize handles, toolbars, and badges */
    clone.querySelectorAll('.pv-guide, .pv-handle, .pv-bar, .pv-badge, .pv-resizer, .ui-resizable-handle').forEach(function(x){ x.remove(); });

    /* Strip editing attributes, dashed outlines, and pv-* state classes from all children */
    var all=[clone].concat(Array.prototype.slice.call(clone.querySelectorAll('*')));
    all.forEach(function(x){
      x.removeAttribute('contenteditable');
      x.removeAttribute('spellcheck');
      x.removeAttribute('data-pv-sel');
      x.removeAttribute('data-selected');
      if(x.style){
        x.style.outline='';
        x.style.outlineOffset='';
        x.style.cursor='';
        if(x.style.boxShadow && /rgba?\(|#/.test(x.style.boxShadow) && x!==clone){
          /* Clear selection ring box-shadows added by the preview editor */
          if(x.className && typeof x.className==='string' && /pv-/.test(x.className)) x.style.boxShadow='';
        }
      }
      if(x.hasAttribute('class')){
        var k=String(x.getAttribute('class')).split(/\s+/).filter(function(c){ return c&&!/^pv-/.test(c)&&c!=='selected'&&c!=='active'&&c!=='editing'; }).join(' ');
        if(k) x.setAttribute('class',k); else x.removeAttribute('class');
      }
    });
    return clone.outerHTML;
  }catch(e){ return ''; }
}
(function(){
  var _png=ctPng;
  ctPng=async function(){
    var live=ctLiveHTML(); if(!live) return _png.apply(this,arguments);
    window.RP_XF=ctFonts(CT); window.RP_XCSS=CT_CSS+(typeof CT_CSS2!=='undefined'?CT_CSS2:'')+CT_PG+ctImpCSS(); window.RP_XPAD=0;
    window.PV_FORCE='live';
    try{ await rpToPng(live,1123,'Certificate_'+(CT.name||'student')); } finally { window.PV_FORCE=null; window.RP_XF=null; window.RP_XCSS=''; window.RP_XPAD=null; }
  };
})();
          
