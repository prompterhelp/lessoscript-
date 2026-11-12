/* ===== Optional Supabase sync (REST, no library). Table: reports(id, data, updated) ===== */
function clCfg(){ try{ return JSON.parse(lsGet('lp.cloud')||'{}'); }catch(e){ return {}; } }
function clMsg(t){ const m = $('clMsg'); if(m) m.textContent = t; }
async function clAuth(body, grant){
  const c = clCfg(), r = await fetch(c.url+'/auth/v1/token?grant_type='+grant, {method:'POST', headers:{apikey:c.key,'Content-Type':'application/json'}, body:JSON.stringify(body)});
  const j = await r.json(); if(!r.ok) throw new Error(j.error_description || j.msg || 'Sign-in failed');
  lsSet('lp.cloud', JSON.stringify(Object.assign(c, {at:j.access_token, rt:j.refresh_token, exp:Date.now()+j.expires_in*1000})));
}
async function clReq(path, opts){
  let c = clCfg(); if(!c.at) throw new Error('Not signed in');
  if(Date.now() > c.exp-60000){ await clAuth({refresh_token:c.rt}, 'refresh_token'); c = clCfg(); }
  const r = await fetch(c.url+'/rest/v1/'+path, Object.assign({}, opts, {headers:Object.assign({apikey:c.key, Authorization:'Bearer '+c.at, 'Content-Type':'application/json'}, (opts||{}).headers)}));
  if(!r.ok) throw new Error((await r.text()).slice(0,160)); const t = await r.text(); return t ? JSON.parse(t) : null;
}
async function clStorage(path, opts){
  let c = clCfg(); if(!c.at) throw new Error('Not signed in');
  if(Date.now() > c.exp-60000){ await clAuth({refresh_token:c.rt}, 'refresh_token'); c = clCfg(); }
  const r = await fetch(c.url+'/storage/v1/'+path, Object.assign({}, opts, {headers:Object.assign({apikey:c.key, Authorization:'Bearer '+c.at}, (opts||{}).headers)}));
  if(!r.ok){ let m=''; try{ const j=await r.json(); m=j.message||j.error||''; }catch(e){} throw new Error(m||('Storage '+r.status)); } return r;
}
function clUid(){ try{ return JSON.parse(atob(clCfg().at.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub; }catch(e){ throw new Error('Not signed in'); } }
function rpTomb(id){ let t = []; try{ t = JSON.parse(lsGet('lp.rep.del')||'[]'); }catch(e){} t.push(id); lsSet('lp.rep.del', JSON.stringify(t)); }

/* ===== Saved scripts (local + cloud sync with reports) ===== */
function scAll(){ try{ const a=JSON.parse(lsGet('lp.scripts')||'[]'); return Array.isArray(a)?a.filter(x=>x&&x.id):[]; }catch(e){ return []; } }
function scStore(a){ lsSet('lp.scripts',JSON.stringify(a)); }
function scGuess(t){ const l=String(t||'').split('\n').map(x=>x.replace(/[#*_>\[\]]|SPEAK|ASK|PAUSE|OPTIONAL/g,'').replace(/\s+/g,' ').trim()).find(x=>x.length>11)||'Script'; return l.slice(0,60); }
function scSave(){
  const text=S.script||''; if(!text.trim()){ toast('Load a script first'); return; }
  const name=($('scName').value.trim()||scGuess(text)), a=scAll(), same=a.find(x=>x.name===name), now=Date.now();
  const it=same||{id:'sc'+now.toString(36)+Math.random().toString(36).slice(2,5),name};
  it.name=name; it.text=text; it.kind='script'; it.saved=now; if(!same) a.push(it); scStore(a); $('scName').value=''; scRender(); toast('Script saved ✅'); clSyncNow(true);
}
function scOpen(id){ const it=scAll().find(x=>x.id===id); if(!it) return; try{ $('scriptInput').value=it.text; }catch(e){} if(applyScript(it.text)){ toast('Opened “'+it.name+'”'); if(typeof setView==='function') setView('follow'); } }
function scDel(id){ const it=scAll().find(x=>x.id===id); if(!it||!confirm('Delete “'+it.name+'”?')) return; scStore(scAll().filter(x=>x.id!==id)); rpTomb(id); scRender(); clSyncNow(true); }
function scRender(){
  const box=$('scList'); if(!box) return; const q=($('scFind').value||'').trim().toLowerCase(), all=scAll().sort((a,b)=>(b.saved||0)-(a.saved||0)), cur=S.script||'';
  const rows=all.filter(x=>!q||(x.name+' '+x.text).toLowerCase().includes(q)); $('scCount').textContent=all.length?'('+all.length+')':'';
  box.innerHTML=rows.length?rows.map(x=>'<div class="rp-item"><div><b dir="auto">'+esc(x.name)+(x.text===cur?' ✓':'')+'</b><small>'+new Date(x.saved||0).toLocaleDateString()+' · '+Math.max(1,Math.round(String(x.text).split(/\s+/).length/125))+' min</small></div><div class="row-actions"><button class="btn small" data-sc="open" data-id="'+esc(x.id)+'" type="button">Open</button><button class="btn small" data-sc="del" data-id="'+esc(x.id)+'" type="button">🗑</button></div></div>').join(''):'<p class="help">'+(all.length?'No match.':'No saved scripts yet. Load a script, then tap “Save current script”.')+'</p>';
}
document.addEventListener('click',e=>{ const b=e.target.closest('#scLib button'); if(!b) return; if(b.id==='scSave') scSave(); else if(b.dataset.sc==='open') scOpen(b.dataset.id); else if(b.dataset.sc==='del') scDel(b.dataset.id); });
document.addEventListener('input',e=>{ if(e.target.id==='scFind') scRender(); });
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.id==='scName'){ e.preventDefault(); scSave(); } });
setTimeout(()=>{ try{ scRender(); }catch(e){} },0);

