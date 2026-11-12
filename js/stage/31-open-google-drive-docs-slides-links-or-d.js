/* ===== open Google Drive / Docs / Slides links or direct links ===== */
(function(){if(STU)return;const KEY='ls_gkey';
const gid=u=>{const m=u.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([\w-]{15,})/)||u.match(/[?&]id=([\w-]{15,})/);return m&&m[1]};
const ge=async r=>{try{const j=await r.json();return j.error&&j.error.message?' – '+j.error.message:''}catch(e){return''}};
const mk=(b,n,t)=>{const f=new File([b],n,{type:b.type||t||''});return f};
let _tk=null,_te=0;
function tok(cid){if(_tk&&Date.now()<_te)return Promise.resolve(_tk);return new Promise((res,rej)=>{const go=()=>{const c=google.accounts.oauth2.initTokenClient({client_id:cid,scope:'https://www.googleapis.com/auth/drive.readonly',callback:r=>{if(r.access_token){_tk=r.access_token;_te=Date.now()+50*60000;res(_tk)}else rej(new Error('Google sign-in failed: '+(r.error||'')))},error_callback:e=>rej(new Error('Google sign-in: '+(e.type||'cancelled')))});c.requestAccessToken()};if(window.google&&google.accounts&&google.accounts.oauth2)return go();const sc=document.createElement('script');sc.src='https://accounts.google.com/gsi/client';sc.onload=go;sc.onerror=()=>rej(new Error('Could not load Google sign-in'));document.head.appendChild(sc)})}
async function pub(u,id){const rt=/rtpof=true/.test(u)||/\/file\/d\//.test(u),dl='https://drive.usercontent.google.com/download?id='+id+'&export=download&confirm=t';
 const d=rt?dl:/presentation/.test(u)?'https://docs.google.com/presentation/d/'+id+'/export/pdf':/spreadsheets/.test(u)?'https://docs.google.com/spreadsheets/d/'+id+'/export?format=pdf':/document/.test(u)?'https://docs.google.com/document/d/'+id+'/export?format=pdf':dl;
 for(const t of[d,'https://corsproxy.io/?url='+encodeURIComponent(d),'https://api.allorigins.win/raw?url='+encodeURIComponent(d),'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(d),'https://thingproxy.freeboard.io/fetch/'+d]){try{const r=await fetch(t);if(!r.ok)continue;const b=await r.blob();if(/text\/html/.test(b.type)||b.size<200)continue;
  const h=new Uint8Array(await b.slice(0,4).arrayBuffer());const ext=(h[0]==0x25&&h[1]==0x50)?'pdf':(h[0]==0x50&&h[1]==0x4B)?(/spreadsheets/.test(u)?'xlsx':/document\//.test(u)?'docx':'pptx'):'';if(!ext)continue;return mk(b,'Google file.'+ext)}catch(e){}}
 throw new Error('Could not download it (Google blocks web pages from downloading files). Use File > Download in Google, then 📂 Open, or press Show embedded.')}
async function grab(u,key,cid){const id=gid(u);
 if(/\/folders\//.test(u))throw new Error('Open a file, not a folder');
 let ke=null;if(id&&(key||cid)){try{let H={},q='';if(cid){H={Authorization:'Bearer '+await tok(cid)}}else q='&key='+encodeURIComponent(key);
 const m=await fetch('https://www.googleapis.com/drive/v3/files/'+id+'?fields=name,mimeType&supportsAllDrives=true'+q,{headers:H});
 if(!m.ok){const em=await ge(m);throw new Error(m.status==401&&!cid?'Google does not accept the key for this file. Share it as "Anyone with the link", or use Google sign-in (Client ID below)'+em:m.status==400&&/key/i.test(em)?'The Google API key is not valid'+em:(m.status==403||m.status==404)?'No access to this file (or Google Drive API is not enabled)'+em:'Drive error '+m.status+em)}
 const j=await m.json();let url,name=j.name||'Drive file';
 if(/^application\/vnd\.google-apps\./.test(j.mimeType)){url='https://www.googleapis.com/drive/v3/files/'+id+'/export?mimeType=application/pdf'+q;if(!/\.pdf$/i.test(name))name+='.pdf'}
 else url='https://www.googleapis.com/drive/v3/files/'+id+'?alt=media&supportsAllDrives=true'+q;
 const r=await fetch(url,{headers:H});if(!r.ok)throw new Error('Could not download ('+r.status+')'+await ge(r));const b=await r.blob();
 if(b.type=='application/pdf'&&!/\.pdf$/i.test(name))name+='.pdf';return mk(b,name,j.mimeType)}catch(e0){ke=e0}}
 if(id){try{return await pub(u,id)}catch(e1){throw ke||e1}}
 const url=id?'https://drive.usercontent.google.com/download?id='+id+'&export=download&confirm=t':u;
 let r;try{r=await fetch(url)}catch(e){throw new Error(id?'Google blocks direct downloads here. Add a free Google API key below (one time).':'That site does not allow opening its files from a web page. Download it and use 📂 Open.')}
 if(!r.ok)throw new Error('Could not download ('+r.status+')');const b=await r.blob();
 let name=decodeURIComponent((new URL(url).pathname.split('/').pop()||'file'));if(b.type=='application/pdf'&&!/\.pdf$/i.test(name))name+='.pdf';
 if(/text\/html/.test(b.type))throw new Error('That link opens a web page, not a file. Share it as "Anyone with the link".');return mk(b,name)}
window.openLink=function(pre){if(document.getElementById('lkd'))return;let kv='',cv='';try{kv=localStorage.getItem(KEY)||'';cv=localStorage.getItem('ls_gcid')||''}catch(e){}
 const d=document.createElement('div');d.id='lkd';d.innerHTML='<div class="bx"><b>🔗 Open from a link</b><textarea rows="3" id="lku" placeholder="Paste Google Drive / Docs / Slides link, or a direct PDF link (one per line)"></textarea><input id="lkk" type="password" placeholder="Google API key (needed for Drive links, saved on this device only)" value="'+kv.replace(/"/g,'')+'"><input id="lkid" placeholder="Google OAuth Client ID (optional: sign in to open PRIVATE files)" value="'+cv.replace(/"/g,'')+'"><small>Drive file must be shared as <b>Anyone with the link</b>. Key: Google Cloud Console → new project → enable <i>Google Drive API</i> → Credentials → API key. Google Docs / Slides / Sheets open as PDF.<br>Private files: Credentials → Create credentials → OAuth client ID → Web application → add the address of this page under Authorized JavaScript origins (https:// or localhost; file:// does not work), paste the Client ID above, and sign in when asked.<br>Easiest alternative: in Google Slides use File → Download → PDF, then 📂 Open.</small><div class="r"><button class="btn" id="lkc">Cancel</button><button class="btn" id="lke" style="display:none" title="Shows the live Google page, no key needed (can be softer, no pen on the slide)">Show embedded (no key)</button><button class="btn" id="lko">Open as pages</button></div></div>';
 document.body.appendChild(d);const cl=()=>d.remove();$('lkc').onclick=cl;
 const emb=u=>{const id=gid(u);return id&&/presentation|document|spreadsheets/.test(u)?'https://docs.google.com/'+(/presentation/.test(u)?'presentation':/spreadsheets/.test(u)?'spreadsheets':'document')+'/d/'+id+'/preview':null};
 const chk=()=>{const f=$('lku').value.split(/\s+/).filter(Boolean)[0];$('lke').style.display=f&&emb(f)?'':'none'};$('lku').oninput=chk;
 $('lke').onclick=()=>{const f=$('lku').value.split(/\s+/).filter(Boolean)[0],e=emb(f);if(e){cl();addMediaTab({type:'web',src:e},'Google file')}};
 if(pre){$('lku').value=pre;chk();setTimeout(()=>$('lko').click(),50)}
d.onclick=e=>{if(e.target===d)cl()};
 $('lko').onclick=async()=>{const us=$('lku').value.split(/\s+/).filter(Boolean),key=$('lkk').value.trim(),cid=$('lkid').value.trim();if(!us.length)return;try{localStorage.setItem(KEY,key);localStorage.setItem('ls_gcid',cid)}catch(e){}
  $('lko').disabled=true;const fs=[];try{for(const u of us){toast('Downloading…');fs.push(await grab(u,key,cid))}}catch(e){toast(e.message);$('lko').disabled=false;return}
  cl();addFiles(fs)}}})();

/* ===== sharper pages, smoother on tablets, page box on student screen ===== */
(function(){
// fast low-res copy used only while moving; full quality returns when you stop
setInterval(()=>{if(!S.pages.length)return;for(const k of [S.i,S.i+1,S.i-1]){const p=S.pages[k];if(p&&p.bmp&&!p.mip&&!p.mp&&p.bmp.width>1400){p.mp=1;const w=Math.min(1400,p.bmp.width),h=Math.max(1,Math.round(p.bmp.height*w/p.bmp.width)),c=document.createElement('canvas');c.width=w;c.height=h;try{c.getContext('2d').drawImage(p.bmp,0,0,w,h);createImageBitmap(c).then(m=>{p.mip=m;p.mp=0}).catch(()=>p.mp=0)}catch(e){p.mp=0}}}
 S.pages.forEach((p,k)=>{if(p.mip&&Math.abs(k-S.i)>3){try{p.mip.close()}catch(e){}p.mip=null}})},500);
const _dr3=draw;draw=function(){const mv=performance.now()-(S.mvT||0)<220||!!S.live||!!S.ptr,sw=[];
 if(mv)for(const d of[-1,0,1]){const p=S.pages[S.i+d];if(p&&p.mip&&p.bmp){sw.push([p,p.bmp]);p.bmp=p.mip}}
 try{_dr3()}finally{sw.forEach(([p,b])=>p.bmp=b)}
 if(mv){clearTimeout(S._mt);S._mt=setTimeout(()=>{need=1},240)}};
// decode the new page and its neighbours right away on every page change
{const _ue=ui;ui=function(){_ue();try{ensurePg(S.i)}catch(e){}}}
// teacher pushes the next pages to the student as soon as they are ready; student asks at once on every page change
{const sent=new WeakSet();
 if(!STU)setInterval(()=>{if(document.hidden||!S.pages.length)return;for(const k of[S.i,S.i+1,S.i+2,S.i+3,S.i-1]){const p=S.pages[k];if(p&&p.blob&&!sent.has(p.blob)){sent.add(p.blob);try{sendPage(k)}catch(e){}break}}},120);
 else{const ask=()=>{for(const k of[S.i,S.i+1,S.i+2,S.i-1]){const p=S.pages[k];if(k>=0&&k<S.pages.length&&(!p||!p.blob)&&!(p&&p.lr))needPg(k)}};
  const _ua=ui;ui=function(){_ua();ask()};setInterval(()=>{if(!document.hidden)ask()},300)}}
// page number box on the student screen
if(STU){const tb=$('tb'),g=document.createElement('input');g.type='number';g.min=1;g.className='gps';g.title='Go to page, press Enter';
 const upd=()=>{g.placeholder=S.pages.length?(S.i+1)+'/'+S.pages.length:'Page'};
 g.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'){const n=parseInt(g.value);if(n>=1&&n<=S.pages.length){go(n-1);g.value='';g.blur()}}};
 tb.insertBefore(g,tb.firstChild);upd();const _u=ui;ui=function(){_u();upd()}}
})();

/* ===== crisp zoom: re-render the visible part of PDF pages at screen resolution when you stop moving ===== */
(function(){const hk=g=>{const v=S.v;return[S.i,v.z.toFixed(4),v.cx.toFixed(5),v.cy.toFixed(5),W,H,D].join('|')};let rb=0;
const _dr4=draw;draw=function(){_dr4();const g=geo(),p=g&&g.p,h=p&&p.hi;if(!h||S.blank||S.ptr||performance.now()-(S.mvT||0)<350)return;
 if(h.key!==hk(g)||h.i!==S.i)return;cx.setTransform(D,0,0,D,0,0);cx.imageSmoothingEnabled=true;cx.imageSmoothingQuality='high';cx.drawImage(h.bm,h.x,h.y,h.w,h.h);
 p.strokes.forEach(s=>stroke(s,g));if(S.live)stroke(S.live,g)};
setInterval(async()=>{S.pages.forEach(p=>{if(p.hi&&p.hi.i!==S.i){try{p.hi.bm.close()}catch(e){}p.hi=null}});
 if(rb||S.blank||performance.now()-(S.mvT||0)<350)return;const g=geo();if(!g)return;const p=g.p;if(!p.pdf||!p.bmp)return;
 const v=S.v,dw=g.bw*v.z,dh=g.bh*v.z;if(dw*D<p.bmp.width*.9){if(p.hi){try{p.hi.bm.close()}catch(e){}p.hi=null}return}
 const key=hk(g);if(p.hi&&p.hi.key===key)return;
 const[x,y]=toS(g,0,0),ix=Math.max(0,x),iy=Math.max(0,y),ex=Math.min(W,x+dw),ey=Math.min(H,y+dh);if(ex<=ix||ey<=iy)return;
 let r=1;const px=(ex-ix)*D,py=(ey-iy)*D;if(px*py>16e6)r=Math.sqrt(16e6/(px*py));
 rb=1;const i0=S.i;try{const pg=await p.pdf.doc.getPage(p.pdf.n),w1=pg.getViewport({scale:1}).width,sc=dw*D/w1*r,
  vp=pg.getViewport({scale:sc,offsetX:-(ix-x)*D*r,offsetY:-(iy-y)*D*r}),c=document.createElement('canvas');c.width=Math.max(1,Math.round(px*r));c.height=Math.max(1,Math.round(py*r));
  await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;const bm=await createImageBitmap(c);
  const g2=geo();if(S.i===i0&&g2&&hk(g2)===key){if(p.hi){try{p.hi.bm.close()}catch(e){}}p.hi={bm,key,i:i0,x:ix,y:iy,w:ex-ix,h:ey-iy};need=1}else bm.close()}catch(e){}finally{rb=0}},300);
})();

if(!STU){const _mu2=mUrl;mUrl=function(){const el=$('mu'),u=el?el.value.trim():'';if(/(^|\/\/)(docs|drive)\.google\.com\//i.test(u)&&/\/d\/[\w-]{15,}|[?&]id=[\w-]{15,}/.test(u)){const id=(u.match(/\/d\/([\w-]{15,})/)||u.match(/[?&]id=([\w-]{15,})/))[1],t=/rtpof=true|\/file\/d\//.test(u)?'drive.google.com/file':/presentation/.test(u)?'docs.google.com/presentation':/spreadsheets/.test(u)?'docs.google.com/spreadsheets':/document/.test(u)?'docs.google.com/document':'drive.google.com/file';el.value='https://'+t+'/d/'+id+'/preview';toast('Using the embeddable Google viewer link')}
return _mu2()}}

/* opening anything new stops the old live share and clears the old screen on the student side */
if(!STU){const _ms=mSet;mSet=function(m){if(LV){clearInterval(LV.tm);LV.st.getTracks().forEach(t=>t.stop());LV=null}return _ms(m)};
 const _af=addFiles;addFiles=async function(fs,f){if(S.media||LV)mClose(1);return _af(fs,f)}}

/* other window's view updates glide in instead of jumping */
(function(){const pf=ch.onmessage;let tgt=null,raf=0;
 const step=()=>{raf=0;if(!tgt)return;if(pts.size||performance.now()-(S.own||0)<500){tgt=null;return}const v=S.v,a=.35;v.z+=(tgt.z-v.z)*a;v.cx+=(tgt.cx-v.cx)*a;v.cy+=(tgt.cy-v.cy)*a;
  if(Math.abs(tgt.z-v.z)<.001&&Math.abs(tgt.cx-v.cx)<.0003&&Math.abs(tgt.cy-v.cy)<.0003){v.z=tgt.z;v.cx=tgt.cx;v.cy=tgt.cy;tgt=null}need=1;if(tgt)raf=requestAnimationFrame(step)};
 ch.onmessage=async ev=>{const m=ev&&ev.data;if(m&&m.t=='st'){const pi=S.i,pv=S.v&&{z:S.v.z,cx:S.v.cx,cy:S.v.cy};const r=await pf(ev);
   if(S.i===pi&&pv&&S.v&&Math.abs(S.v.z-pv.z)<3&&(S.v.z!==pv.z||S.v.cx!==pv.cx||S.v.cy!==pv.cy)){tgt={z:S.v.z,cx:S.v.cx,cy:S.v.cy};S.v.z=pv.z;S.v.cx=pv.cx;S.v.cy=pv.cy;if(!raf)raf=requestAnimationFrame(step)}else tgt=null;return r}
  return pf(ev)}})();

/* student window must get the WHOLE page (all fixes), not a half-loaded copy */
(function(){
  if(STU)return;
  try{
    const c=document.documentElement.cloneNode(true);
    ['fxl','rbar','rtog','fxc','stopshare','stopshare2','stopTop','wshield'].forEach(i=>c.querySelectorAll('#'+i).forEach(e=>e.remove()));
    SRC='<!doctype html>'+c.outerHTML;
  }catch(e){}
})();
