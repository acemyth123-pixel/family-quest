/* Family Quest v0.23.8.2 — direct Admin filtering + profile header placement */
(function(){
  state.adminCatalogTab0238 = state.adminCatalogTab0238 || 'chore';
  state.adminChoreSubtab0238 = state.adminChoreSubtab0238 || 'Daily';
  state.adminAchievementSubtab0238 = state.adminAchievementSubtab0238 || 'Visible';

  function managementCard(){
    const root=document.getElementById('view'); if(!root) return null;
    return [...root.querySelectorAll('.card')].find(c=>{
      const labels=[...c.querySelectorAll('.section-title h3')].map(h=>(h.textContent||'').trim());
      return labels.includes('Chores')&&labels.includes('Rewards')&&labels.includes('Achievements');
    })||null;
  }
  function sectionByName(card,name){return [...card.querySelectorAll('.section-title')].find(s=>(s.querySelector('h3')?.textContent||'').trim()===name)||null}

  function applyAdmin02382(){
    if(state.view!=='admin') return;
    const card=managementCard(); if(!card) return;
    card.querySelectorAll('.admin-catalog-tabs-v236,.admin-catalog-tabs-v238,.admin-subtabs-0238').forEach(x=>x.remove());
    let top=card.querySelector('.admin-main-tabs-02382');
    if(!top){top=document.createElement('div');top.className='tabs admin-main-tabs-02382';card.prepend(top)}
    top.innerHTML=[['chore','⚔️ Chores'],['reward','🎁 Rewards'],['achievement','🏆 Achievements'],['cosmetic','🎨 Cosmetic Pricing']].map(([id,label])=>`<button type="button" class="ghost ${state.adminCatalogTab0238===id?'active':''}" data-admin-main-02382="${id}">${label}</button>`).join('');

    const defs=[['chore','Chores'],['reward','Rewards'],['cosmetic','Cosmetic Shop Pricing'],['achievement','Achievements']];
    defs.forEach(([id,name])=>{
      const h=sectionByName(card,name), list=h?.nextElementSibling;
      if(!h||!list)return;
      const show=state.adminCatalogTab0238===id;
      h.hidden=!show; list.hidden=!show;
      h.style.display=show?'flex':'none'; list.style.display=show?'':'none';
    });
    const actions=[...card.children].find(x=>x.classList?.contains('action-row'));
    if(actions){
      [...actions.children].forEach(b=>{
        const type=b.dataset.type;
        b.style.display=(type==='chore'&&state.adminCatalogTab0238==='chore')||(type==='achievement'&&state.adminCatalogTab0238==='achievement')?'':'none';
      });
    }

    if(state.adminCatalogTab0238==='chore'){
      const h=sectionByName(card,'Chores'), list=h?.nextElementSibling;
      if(h&&list){
        const sub=document.createElement('div'); sub.className='tabs admin-subtabs-02382';
        sub.innerHTML=['Daily','Weekly','Monthly','Seasonal'].map(x=>`<button type="button" class="ghost ${state.adminChoreSubtab0238===x?'active':''}" data-admin-chore-sub-02382="${x}">${x}</button>`).join('');
        h.after(sub);
        const rows=[...list.children];
        rows.forEach((row,i)=>{const c=(state.chores||[])[i];const show=!c||String(c.type)===state.adminChoreSubtab0238;row.hidden=!show;row.style.display=show?'':'none'});
      }
    }
    if(state.adminCatalogTab0238==='achievement'){
      const h=sectionByName(card,'Achievements'), list=h?.nextElementSibling;
      if(h&&list){
        const sub=document.createElement('div'); sub.className='tabs admin-subtabs-02382';
        sub.innerHTML=['Visible','Secret'].map(x=>`<button type="button" class="ghost ${state.adminAchievementSubtab0238===x?'active':''}" data-admin-ach-sub-02382="${x}">${x}</button>`).join('');
        h.after(sub);
        const rows=[...list.children];
        rows.forEach((row,i)=>{const a=(state.achievements||[])[i];const secret=!!(a?.hidden||a?.secret);const show=state.adminAchievementSubtab0238==='Secret'?secret:!secret;row.hidden=!show;row.style.display=show?'':'none'});
      }
    }
  }

  function moveProfile02382(){
    if(state.view!=='profiles') return;
    const shell=document.querySelector('.fq-player-shell'); if(!shell) return;
    const back=shell.querySelector('.fq-profile-back,[data-action="profile-back-232"]');
    const custom=shell.querySelector('.fq-profile-customize,[data-action="profile-open"]');
    const top=document.querySelector('.topbar>div:first-child');
    const title=document.getElementById('viewTitle');
    if(!top||!title||(!back&&!custom)) return;
    let row=top.querySelector('.profile-top-control-row-02382');
    if(!row){row=document.createElement('div');row.className='profile-top-control-row-02382';top.appendChild(row)}
    if(back) row.appendChild(back);
    row.appendChild(title);
    if(custom) row.appendChild(custom);
  }

  const priorRender=render;
  render=function(){priorRender();setTimeout(()=>{applyAdmin02382();moveProfile02382()},0)};
  const view=document.getElementById('view');
  if(view){new MutationObserver(()=>{if(state.view==='admin')applyAdmin02382();else if(state.view==='profiles')moveProfile02382()}).observe(view,{childList:true,subtree:false})}
  document.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    if(b.dataset.adminMain02382){e.preventDefault();e.stopImmediatePropagation();state.adminCatalogTab0238=b.dataset.adminMain02382;applyAdmin02382()}
    else if(b.dataset.adminChoreSub02382){e.preventDefault();e.stopImmediatePropagation();state.adminChoreSubtab0238=b.dataset.adminChoreSub02382;applyAdmin02382()}
    else if(b.dataset.adminAchSub02382){e.preventDefault();e.stopImmediatePropagation();state.adminAchievementSubtab0238=b.dataset.adminAchSub02382;applyAdmin02382()}
  },true);
  window.addEventListener('load',()=>setTimeout(()=>{applyAdmin02382();moveProfile02382()},350));
})();