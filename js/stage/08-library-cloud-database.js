/* ===== Library -> LessoScript cloud database (Supabase "reports" table, ids "stage:*") ===== */
const cr=(p,o)=>{const P=window.parent;if(P&&P!==window&&typeof P.clReq=='function'&&P.clCfg&&P.clCfg().at)return P.clReq(p,o);return Promise.reject(new Error('cloud'))};
const toB64=bl=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(bl)});
const fromB64=(b,t)=>{const x=atob(b),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);return new Blob([u],{type:t})};
const STB='lessonstage-library',STMAX=104857600;
const stReq=(p,o)=>{const P=window.parent;if(P&&P!==window&&typeof P.clStorage=='function'&&P.clCfg&&P.clCfg().at)return P.clStorage(p,o);return Promise.reject(new Error('cloud'))};
const stPath=r=>{let h=0;for(const c of String(r.id))h=(h*31+c.charCodeAt(0))|0;return window.parent.clUid()+'/'+(h>>>0).toString(36)+'_'+String(r.name).replace(/[^\w.\-]+/g,'_').slice(-80)};
async function cloudPut(r,quiet){if(r.size>STMAX){quiet||toast('Too large for cloud (max 100 MB). Kept on this device.');return}
 try{const id='stage:'+r.id,base={id:r.id,kind:'stagefile',name:r.name,type:r.type,size:r.size,date:r.date};let path=null,why='';
  try{path=stPath(r);await stReq('object/'+STB+'/'+path,{method:'POST',headers:{'x-upsert':'true','Content-Type':r.type||'application/octet-stream'},body:r.blob})}catch(e){if(e.message=='cloud')throw e;path=null;why=e.message}
  let data;if(path)data=Object.assign(base,{storage:path});else if(r.size<=12e6)data=Object.assign(base,{b64:await toB64(r.blob)});else{quiet||toast('Large files need the Storage setup: run the SQL in SUPABASE-SETUP.md. Kept on this device.');return}
  await cr('reports',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify([{id,data,updated:r.date}])});quiet||toast('Saved to library + cloud ✓')}
 catch(e){if(!quiet&&e.message!='cloud')toast('Cloud save failed: '+e.message.slice(0,60))}}
libSave=async function(f){try{const r={id:f.name+'|'+f.size,name:f.name,type:f.type,size:f.size,date:Date.now(),blob:f};await lib('put',r);toast('Saved to library ✓');cloudPut(r)}catch(e){}};
async function cloudRow(id,data,date){try{await cr('reports',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify([{id:'stage:'+id,data,updated:date}])});return 1}catch(e){return 0}}
async function libLink(url,name){if(STU||!url)return;const r={id:'link|'+url,kind:'link',name:name||url,url,type:'link',size:0,date:Date.now()};try{await lib('put',r)}catch(e){}cloudRow(r.id,{id:r.id,kind:'link',name:r.name,url,size:0,date:r.date},r.date);toast('Link saved to library ✓')}
const _ms=mSet;mSet=function(m){if(m&&m.type==='yt')libLink('https://www.youtube.com/watch?v='+m.id,'YouTube video');return _ms(m)};
libDlg=async function(){let m=$('lb');if(!m){m=document.createElement('div');m.id='lb';m.className='md2';m.onclick=e=>{if(e.target==m)m.style.display='none'};document.body.appendChild(m)}
 m.style.display='flex';m.innerHTML='<div class="mdc"><div class="mu">Loading library…</div></div>';
 let loc=[],cl=null;try{loc=await lib('all')}catch(e){}
 try{cl=await cr('reports?select=id,kind:data->>kind,name:data->>name,url:data->>url,size:data->>size,date:data->>date,storage:data->>storage&id=like.stage:*')}catch(e){}
 const M={};loc.forEach(r=>M[r.id]={id:r.id,name:r.name,size:+r.size||0,date:r.date,kind:r.kind==='link'?'link':'file',url:r.url,loc:1});
 (cl||[]).forEach(x=>{if(x.kind==='stagemeta')return;const id=x.id.slice(6);M[id]=Object.assign(M[id]||{id,name:x.name,size:+x.size||0,date:+x.date||0,kind:x.kind==='link'?'link':'file',url:x.url},{cloud:1,storage:x.storage})});
 if(cl)loc.filter(r=>!cl.some(x=>x.id=='stage:'+r.id)).forEach(r=>{if(r.kind==='link')cloudRow(r.id,{id:r.id,kind:'link',name:r.name,url:r.url,size:0,date:r.date},r.date);else cloudPut(r,1)});
 const l=Object.values(M).sort((a,b)=>b.date-a.date);
 m.innerHTML='<div class="mdc" style="width:min(560px,94vw);max-height:80vh;overflow:auto"><b>📚 Saved lessons &amp; links</b><div class="mu">'+(cl?'Files, links, drawings, notes and cards are synced with your LessoScript cloud ☁️':'Saved in this browser. Sign in under Reports ▸ Cloud sync to also save to the cloud.')+'</div>'+(l.length?l.map(r=>'<div class="lbi"><span>'+(r.kind==='link'?'🔗 ':'')+esc(r.name)+'</span><small class="mu">'+(r.cloud?'☁️ ':'')+(r.kind==='link'?'link':Math.round(r.size/1024)+' KB')+' · '+new Date(r.date).toLocaleDateString()+'</small><button class="btn pri" data-o="'+encodeURIComponent(r.id)+'">Open</button><button class="btn" data-x="'+encodeURIComponent(r.id)+'">🗑</button></div>').join(''):'<div class="mu">Nothing saved yet.</div>')+'<button class="btn" onclick="$(\'lb\').style.display=\'none\'">Close</button></div>';
 m.querySelectorAll('[data-o]').forEach(b=>b.onclick=async()=>{const id=decodeURIComponent(b.dataset.o);
  if(M[id]&&M[id].kind==='link'){m.style.display='none';$('mu').value=M[id].url;mUrl();return}
  let r=null;try{r=await lib('get',id)}catch(e){}
  if(!r){try{toast('Downloading from cloud…');const g=await cr('reports?select=data&id=eq.'+encodeURIComponent('stage:'+id)),d=g[0].data;r={name:d.name,type:d.type,blob:d.storage?new Blob([await(await stReq('object/authenticated/'+STB+'/'+d.storage)).blob()],{type:d.type}):fromB64(d.b64,d.type),size:d.size,id,date:d.date};await lib('put',r)}catch(e){return toast('Could not download this file')}}
  m.style.display='none';addFiles([new File([r.blob],r.name,{type:r.type})],1)});
 m.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{const id=decodeURIComponent(b.dataset.x);try{await lib('del',id)}catch(e){}try{if(M[id]&&M[id].storage)await stReq('object/'+STB+'/'+M[id].storage,{method:'DELETE'})}catch(e){}try{await cr('reports?id=eq.'+encodeURIComponent('stage:'+id),{method:'DELETE'})}catch(e){}try{await cr('reports?id=eq.'+encodeURIComponent('stage:meta:'+id),{method:'DELETE'})}catch(e){}try{localStorage.removeItem('lp.stage.'+id)}catch(e){}libDlg()})};

