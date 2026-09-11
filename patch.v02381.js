/* Family Quest v0.23.8.1 — robust Admin filtering + profile header controls */
(function(){
state.adminChoreSubtab0238=state.adminChoreSubtab0238||'Daily';state.adminAchievementSubtab0238=state.adminAchievementSubtab0238||'Visible';
function findManagement(){const root=document.getElementById('view');if(!root)return null;return [...root.querySelectorAll('.card')].find(c=>{const labels=[...c.querySelectorAll('.section-title h3')].map(h=>(h.textContent||'').trim());return labels.includes('Chores')&&labels.includes('Rewards')&&labels.includes('Achievements')})||null}
function titleFromRow(row){const el=row.querySelector('h4,strong,.title');return (el?.textContent||'').trim()}
function applyFilters(){if(state.view!=='admin')return;const m=findManagement();if(!m)return;const sections=[...m.querySelectorAll('.section-title')];const byName=n=>sections.find(s=>(s.querySelector('h3')?.textContent||'').trim()===n);
 const ch=byName('Chores'),cl=ch?.nextElementSibling;if(ch&&cl&&state.adminCatalogTab0238==='chore'){
   let sub=ch.nextElementSibling?.classList?.contains('admin-subtabs-0238')?ch.nextElementSibling:null;if(!sub){sub=document.createElement('div');sub.className='tabs admin-subtabs-0238';ch.after(sub)}
   sub.innerHTML=['Daily','Weekly','Monthly','Seasonal'].map(x=>`<button class="ghost ${state.adminChoreSubtab0238===x?'active':''}" data-admin-chore-sub-02381="${x}">${x}</button>`).join('');
   [...cl.children].forEach(row=>{const t=titleFromRow(row),c=(state.chores||[]).find(x=>(x.title||'').trim()===t);row.hidden=!!c&&String(c.type)!==state.adminChoreSubtab0238;row.style.display=row.hidden?'none':''})
 }
 const ah=byName('Achievements'),al=ah?.nextElementSibling;if(ah&&al&&state.adminCatalogTab0238==='achievement'){
   let sub=ah.nextElementSibling?.classList?.contains('admin-subtabs-0238')?ah.nextElementSibling:null;if(!sub){sub=document.createElement('div');sub.className='tabs admin-subtabs-0238';ah.after(sub)}
   sub.innerHTML=['Visible','Secret'].map(x=>`<button class="ghost ${state.adminAchievementSubtab0238===x?'active':''}" data-admin-ach-sub-02381="${x}">${x}</button>`).join('');
   [...al.children].forEach(row=>{const t=titleFromRow(row),a=(state.achievements||[]).find(x=>(x.title||x.name||'').trim()===t);if(!a)return;const secret=!!a.secret;row.hidden=state.adminAchievementSubtab0238==='Secret'?!secret:secret;row.style.display=row.hidden?'none':''})
 }
}
function moveProfileControls(){if(state.view!=='profiles')return;const shell=document.querySelector('.fq-player-shell');if(!shell)return;const back=shell.querySelector('.fq-profile-back,[data-action="profile-back"]'),custom=shell.querySelector('.fq-profile-customize,[data-action="profile-open"]');if(!back&&!custom)return;const head=document.querySelector('.topbar>div:first-child');const title=document.getElementById('viewTitle');if(!head||!title)return;let row=head.querySelector('.profile-top-control-row');if(!row){row=document.createElement('div');row.className='profile-top-control-row';head.appendChild(row)}row.innerHTML='';if(back)row.appendChild(back);row.appendChild(title);if(custom)row.appendChild(custom);title.style.margin='0';}
const prevRender=render;render=function(){prevRender();setTimeout(()=>{applyFilters();moveProfileControls()},0)};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.adminChoreSub02381){e.preventDefault();e.stopImmediatePropagation();state.adminChoreSubtab0238=b.dataset.adminChoreSub02381;applyFilters()}else if(b.dataset.adminAchSub02381){e.preventDefault();e.stopImmediatePropagation();state.adminAchievementSubtab0238=b.dataset.adminAchSub02381;applyFilters()}},true);
window.addEventListener('load',()=>setTimeout(()=>{applyFilters();moveProfileControls()},300));
})();