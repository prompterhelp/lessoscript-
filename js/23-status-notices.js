/* Offline-ready chip + gentle error notice. It only listens; it changes nothing else. */
(function(){
  'use strict';
  if(window.__lpStatus) return; window.__lpStatus=1;
  var isAr=function(){ return document.documentElement.getAttribute('data-ui')==='ar'; };
  var T=function(en,ar){ return isAr()?ar:en; };

  var css=document.createElement('style');
  css.textContent=
    '.lpx-chip,.lpx-err{position:fixed;z-index:9000;font:600 12px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg,#e8efe9);background:var(--surface,#16211f);border:1px solid var(--line,rgba(255,255,255,.16));box-shadow:0 6px 18px rgba(0,0,0,.28);opacity:0;transition:opacity .25s,transform .25s}'+
    '.lpx-chip{left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;transform:translateY(6px);pointer-events:none}'+
    '.lpx-chip.on{opacity:1;transform:none}'+
    '.lpx-chip i{width:8px;height:8px;border-radius:50%;background:#2fbf9b;flex:none}'+
    '.lpx-chip.warn i{background:#e0a030}.lpx-chip.bad i{background:#d9534f}'+
    '.lpx-err{left:50%;bottom:calc(72px + env(safe-area-inset-bottom,0px));max-width:min(92vw,430px);display:none;align-items:center;gap:10px;padding:9px 10px 9px 14px;border-radius:14px;transform:translate(-50%,8px)}'+
    '.lpx-err.on{display:flex;opacity:1;transform:translate(-50%,0)}'+
    '.lpx-err span{flex:1}'+
    '.lpx-err button{font:inherit;cursor:pointer;border-radius:10px;border:1px solid var(--line,rgba(255,255,255,.2));background:transparent;color:inherit;padding:5px 10px}'+
    '.lpx-err button.x{border:0;padding:5px 7px;opacity:.7}'+
    '@media print{.lpx-chip,.lpx-err{display:none!important}}';
  document.head.appendChild(css);

  function mk(tag,cls,parent){ var e=document.createElement(tag); e.className=cls; e.setAttribute('data-noi18n',''); (parent||document.body).appendChild(e); return e; }

  /* ---------- offline status ---------- */
  var chip=mk('div','lpx-chip'), dot=document.createElement('i'), lab=document.createElement('b'), chipT=0, wasOffline=false, shownReady=false;
  chip.appendChild(dot); chip.appendChild(lab); lab.style.fontWeight='600';
  function say(text,kind,ms){
    lab.textContent=text; chip.className='lpx-chip on'+(kind?' '+kind:''); clearTimeout(chipT);
    if(ms) chipT=setTimeout(function(){ chip.className='lpx-chip'; },ms);
  }
  function ready(cb){
    var ctl=!!(navigator.serviceWorker&&navigator.serviceWorker.controller);
    if(!ctl||!window.caches) return cb(false);
    caches.match('./index.html').then(function(r){ if(r) return cb(true); return caches.match('./').then(function(r2){ cb(!!r2); }); }).catch(function(){ cb(false); });
  }
  function check(){
    ready(function(ok){
      if(!navigator.onLine){
        wasOffline=true;
        if(ok) say(T('Offline · running from saved copy','بلا اتصال · يعمل من النسخة المحفوظة'),'warn');
        else say(T('Offline · saved copy not ready','بلا اتصال · النسخة المحفوظة غير جاهزة'),'bad');
      } else if(wasOffline){
        wasOffline=false; say(T('Back online','عاد الاتصال'),'',2600);
      } else if(ok&&!shownReady){
        shownReady=true; say(T('Ready offline','جاهز للعمل دون اتصال'),'',3200);
      }
    });
  }
  window.addEventListener('online',check); window.addEventListener('offline',check);
  setTimeout(check,2500); setTimeout(check,9000);

  /* ---------- gentle error notice ---------- */
  var log=[], lastAt=0, count=0, errT=0;
  var box=mk('div','lpx-err'), msg=document.createElement('span'), bCopy=document.createElement('button'), bX=document.createElement('button');
  bCopy.type=bX.type='button'; bX.className='x'; bX.textContent='✕'; bX.setAttribute('aria-label','Close');
  box.appendChild(msg); box.appendChild(bCopy); box.appendChild(bX);
  function hide(){ box.className='lpx-err'; clearTimeout(errT); }
  function report(){
    return 'Lesson Prompter error report\n'+new Date().toISOString()+'\nPage: '+location.pathname+'\nOnline: '+navigator.onLine+'\n'+navigator.userAgent+'\n\n'+log.join('\n---\n');
  }
  function fallbackCopy(t){
    try{ var a=document.createElement('textarea'); a.value=t; a.style.cssText='position:fixed;left:-9999px;top:0'; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); return true; }catch(e){ return false; }
  }
  bCopy.addEventListener('click',function(){
    var t=report(), done=function(ok){ bCopy.textContent=ok?T('Copied ✓','تم النسخ ✓'):T('Could not copy','تعذّر النسخ'); };
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){ done(true); },function(){ done(fallbackCopy(t)); });
    else done(fallbackCopy(t));
  });
  bX.addEventListener('click',hide);
  function showErr(){
    msg.textContent=T('Something did not work as expected.','حدث خلل غير متوقع.');
    bCopy.textContent=T('Copy details','نسخ التفاصيل');
    box.className='lpx-err on'; clearTimeout(errT); errT=setTimeout(hide,10000);
  }
  var IGNORE=/ResizeObserver loop|^Script error\.?$|Non-Error promise rejection|AbortError|interrupted|aborted|The user denied|NotAllowedError|cancel/i;
  function note(text,where,stack){
    text=String(text==null?'':text); if(!text||IGNORE.test(text)) return;
    log.push(new Date().toLocaleTimeString()+'  '+text+(where?'\n'+where:'')+(stack?'\n'+String(stack).split('\n').slice(0,4).join('\n'):'')); if(log.length>8) log.shift();
    var now=Date.now(); if(now-lastAt<6000||count>=5) return; lastAt=now; count++; showErr();
  }
  window.addEventListener('error',function(e){ note(e.message,(e.filename||'').split('/').slice(-2).join('/')+':'+e.lineno+':'+e.colno,e.error&&e.error.stack); });
  window.addEventListener('unhandledrejection',function(e){ var r=e.reason; note(r&&r.message?r.message:r,'',r&&r.stack); });
})();
