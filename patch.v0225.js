/* Family Quest v0.22.5 — requests, achievements, profiles and Admin polish */
state.adminCatalogTab=state.adminCatalogTab||'chore';
const _loadRequests0225=loadRealFamilyRequests;
loadRealFamilyRequests=async function(){if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;const {data,error}=await window.FQAuth.client.rpc('get_active_family_requests');if(error){console.error('Family requests load failed',error);return}state.requests=(data||[]).map(r=>({id:r.id,title:r.title,notes:r.notes||'',by:memberNameById(r.requested_by)||'Family Member',requestedBy:r.requested_by,requestedFor:r.requested_for,requestedForName:r.requested_for?memberNameById(r.requested_for):'',start:r.start_at,end:r.end_at,status:r.status,owner:r.responded_by?memberNameById(r.responded_by):'',respondedBy:r.responded_by,backend:true}))};window.FQLoaders.requests=loadRealFamilyRequests;
const _complete0225=realCompleteChore;realCompleteChore=async function(c){await _complete0225(c);try{await loadRealAchievements();render()}catch(e){console.warn('Achievement refresh after chore',e)}};
const _review0225=realReviewCompletion;realReviewCompletion=async function(id,decision){await _review0225(id,decision);try{await loadRealAchievements();render()}catch(e){console.warn('Achievement refresh after review',e)}};
const _ach0225=renderAchievements;renderAchievements=function(){const target=state.achievementTarget||state.currentUser;state.achievements.sort((a,b)=>{const rank=x=>(x.claimableBy||[]).includes(target)?0:(x.unlockedBy||[]).includes(target)?2:1;return rank(a)-rank(b)||String(a.title).localeCompare(String(b.title))});_ach0225()};
function applyProfileAchievementCounts0225(){if(state.view!=='profiles')return;const cards=[...document.querySelectorAll('#view .grid.cards-3 > .card')];cards.forEach((card,i)=>{const u=state.users[i];if(!u)return;const p=card.querySelector('p.muted');if(!p||p.textContent.includes('Achievements Unlocked:'))return;const n=state.achievements.filter(a=>(a.earnedBy||[]).includes(u.name)).length;p.innerHTML=p.innerHTML.replace('Reward Points:',`Achievements Unlocked: ${n}<br>Reward Points:`).replace(/Cosmetics Unlocked:\s*\d+/,`Cosmetics Unlocked: ${(u.cosmeticUnlocks||[]).length}`)})}
function applyAdminCatalogTabs0225(){if(state.view!=='admin')return;const root=document.getElementById('view');if(!root)return;const management=[...root.querySelectorAll('.card')].find(c=>c.querySelector('[data-action="admin-create"][data-type="chore"]'));if(!management||management.querySelector('.admin-catalog-tabs'))return;const sections=[...management.querySelectorAll('.section-title')],ch=sections.find(x=>x.textContent.trim().startsWith('Chores')),rw=sections.find(x=>x.textContent.trim().startsWith('Rewards')),ac=sections.find(x=>x.textContent.trim().startsWith('Achievements')),co=sections.find(x=>x.textContent.includes('Cosmetic Shop Pricing'));if(!ch||!rw||!ac)return;const cl=ch.nextElementSibling,rl=rw.nextElementSibling,al=ac.nextElementSibling;const tabs=document.createElement('div');tabs.className='tabs admin-catalog-tabs';tabs.innerHTML=`<button class="ghost ${state.adminCatalogTab==='chore'?'active':''}" data-admin-catalog="chore">⚔️ Chores</button><button class="ghost ${state.adminCatalogTab==='reward'?'active':''}" data-admin-catalog="reward">🎁 Rewards</button><button class="ghost ${state.adminCatalogTab==='achievement'?'active':''}" data-admin-catalog="achievement">🏆 Achievements</button>`;management.prepend(tabs);const show=(h,l,on)=>{h.hidden=!on;l.hidden=!on};show(ch,cl,state.adminCatalogTab==='chore');show(rw,rl,state.adminCatalogTab==='reward');show(ac,al,state.adminCatalogTab==='achievement');const actions=management.querySelector(':scope > .action-row');if(actions){actions.querySelector('[data-type="chore"]')?.toggleAttribute('hidden',state.adminCatalogTab!=='chore');actions.querySelector('[data-type="achievement"]')?.toggleAttribute('hidden',state.adminCatalogTab!=='achievement')}if(co){co.hidden=false;if(co.nextElementSibling)co.nextElementSibling.hidden=false}}
const _render0225=render;render=function(){_render0225();queueMicrotask(()=>{applyProfileAchievementCounts0225();applyAdminCatalogTabs0225();applyAdminCatalogTabs0236()})};
document.addEventListener('click',e=>{const tab=e.target.closest('[data-admin-catalog]');if(tab){e.preventDefault();e.stopImmediatePropagation();state.adminCatalogTab=tab.dataset.adminCatalog;render();return}const nav=e.target.closest('[data-view="achievements"],[data-view-jump="achievements"]');if(nav&&window.FQAuth?.realSession){setTimeout(()=>loadRealAchievements().then(()=>render()).catch(console.error),0)}},true);

/* v0.23.6 compatibility bridge: works even if an older app shell is still cached. */
(function(){
  const badge=document.getElementById('buildBadge');if(badge)badge.textContent='v0.23.6';
  if(!document.querySelector('link[data-fq-0236]')){const l=document.createElement('link');l.rel='stylesheet';l.href='starter.v02351.css?v=0236';l.dataset.fq0236='1';document.head.appendChild(l)}
  const s=document.createElement('style');s.textContent='[data-admin-panel-0236][hidden]{display:none!important}.admin-catalog-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.admin-catalog-tabs button{flex:1;min-width:110px}';document.head.appendChild(s);
})();

function applyAdminCatalogTabs0236(){
 if(state.view!=='admin')return;
 const root=document.getElementById('view');if(!root)return;
 const cards=[...root.querySelectorAll('.card')];
 const management=cards.find(c=>{const hs=[...c.querySelectorAll('h3')].map(h=>h.textContent.trim());return hs.includes('Chores')&&hs.includes('Rewards')&&hs.includes('Achievements')});
 if(!management)return;
 let tabs=management.querySelector('.admin-catalog-tabs');
 if(!tabs){tabs=document.createElement('div');tabs.className='tabs admin-catalog-tabs';management.prepend(tabs)}
 tabs.innerHTML=`<button class="ghost ${state.adminCatalogTab==='chore'?'active':''}" data-admin-catalog-0236="chore">⚔️ Chores</button><button class="ghost ${state.adminCatalogTab==='reward'?'active':''}" data-admin-catalog-0236="reward">🎁 Rewards</button><button class="ghost ${state.adminCatalogTab==='achievement'?'active':''}" data-admin-catalog-0236="achievement">🏆 Achievements</button>`;
 const headers=[...management.querySelectorAll('.section-title')];
 const map={chore:'Chores',reward:'Rewards',achievement:'Achievements'};
 for(const [key,label] of Object.entries(map)){
   const h=headers.find(x=>x.querySelector('h3')?.textContent.trim()===label);if(!h)continue;
   const list=h.nextElementSibling;if(!list)continue;
   h.dataset.adminPanel0236=key;list.dataset.adminPanel0236=key;
   const on=state.adminCatalogTab===key;h.hidden=!on;list.hidden=!on;h.style.display=on?'':'none';list.style.display=on?'':'none';
 }
 const actions=[...management.children].find(el=>el.classList?.contains('action-row'));
 if(actions){const choreBtn=actions.querySelector('[data-type="chore"]'),achBtn=actions.querySelector('[data-type="achievement"]');if(choreBtn)choreBtn.style.display=state.adminCatalogTab==='chore'?'':'none';if(achBtn)achBtn.style.display=state.adminCatalogTab==='achievement'?'':'none'}
 const cosHeader=headers.find(x=>x.querySelector('h3')?.textContent.trim()==='Cosmetic Shop Pricing');if(cosHeader){cosHeader.style.display='';cosHeader.hidden=false;if(cosHeader.nextElementSibling){cosHeader.nextElementSibling.style.display='';cosHeader.nextElementSibling.hidden=false}}
}

document.addEventListener('click',e=>{const b=e.target.closest('[data-admin-catalog-0236]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();state.adminCatalogTab=b.dataset.adminCatalog0236;applyAdminCatalogTabs0236()},true);
setTimeout(()=>applyAdminCatalogTabs0236(),0);
