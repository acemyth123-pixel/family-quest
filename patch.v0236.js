/* Family Quest v0.23.6 — reliable Admin catalog tabs + badge enforcement */
(function(){
  state.adminCatalogTab = state.adminCatalogTab || 'chore';

  function enforceBadge(){
    const badge=document.getElementById('buildBadge');
    if(badge && badge.textContent!=='v0.23.6') badge.textContent='v0.23.6';
  }

  function labelOf(section){
    return section?.querySelector('h3')?.textContent?.trim() || '';
  }

  function applyAdminTabs(){
    enforceBadge();
    if(state.view !== 'admin') return;
    const root = document.getElementById('view');
    if(!root) return;

    const management = [...root.querySelectorAll('.card')].find(card => {
      const labels = [...card.querySelectorAll('.section-title')].map(labelOf);
      return labels.includes('Chores') && labels.includes('Rewards') && labels.includes('Achievements');
    });
    if(!management) return;

    /* Remove the older v0.22.5 tab row so only one tier remains. */
    management.querySelectorAll('.admin-catalog-tabs:not(.admin-catalog-tabs-v236)').forEach(x=>x.remove());

    let tabs = management.querySelector('.admin-catalog-tabs-v236');
    if(!tabs){
      tabs = document.createElement('div');
      tabs.className = 'tabs admin-catalog-tabs-v236';
      management.prepend(tabs);
    }

    tabs.innerHTML = [
      ['chore','⚔️ Chores'],
      ['reward','🎁 Rewards'],
      ['achievement','🏆 Achievements']
    ].map(([id,label]) => `<button type="button" class="ghost ${state.adminCatalogTab===id?'active':''}" data-admin-tab-v236="${id}">${label}</button>`).join('');

    const headers = [...management.querySelectorAll('.section-title')];
    const definitions = [
      ['chore','Chores'],
      ['reward','Rewards'],
      ['achievement','Achievements']
    ];

    for(const [id,label] of definitions){
      const header = headers.find(h => labelOf(h) === label);
      const list = header?.nextElementSibling;
      if(!header || !list) continue;
      const show = state.adminCatalogTab === id;
      header.hidden = !show;
      list.hidden = !show;
      header.style.setProperty('display', show ? 'flex' : 'none', 'important');
      list.style.setProperty('display', show ? '' : 'none', 'important');
    }

    const actions = [...management.children].find(x => x.classList?.contains('action-row'));
    if(actions){
      const chore = actions.querySelector('[data-type="chore"]');
      const ach = actions.querySelector('[data-type="achievement"]');
      if(chore) chore.style.display = state.adminCatalogTab === 'chore' ? '' : 'none';
      if(ach) ach.style.display = state.adminCatalogTab === 'achievement' ? '' : 'none';
    }

    const cosmeticsHeader = headers.find(h => labelOf(h) === 'Cosmetic Shop Pricing');
    if(cosmeticsHeader){
      cosmeticsHeader.hidden = false;
      cosmeticsHeader.style.removeProperty('display');
      const list = cosmeticsHeader.nextElementSibling;
      if(list){list.hidden=false;list.style.removeProperty('display');}
    }
  }

  const previousRender = render;
  render = function(){
    previousRender();
    queueMicrotask(()=>{enforceBadge();applyAdminTabs();});
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-admin-tab-v236]');
    if(!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    state.adminCatalogTab = b.dataset.adminTabV236;
    applyAdminTabs();
  }, true);

  /* Keep the visible build marker authoritative even if older patch code rewrites it later. */
  const badgeObserver=new MutationObserver(enforceBadge);
  const badge=document.getElementById('buildBadge');
  if(badge) badgeObserver.observe(badge,{childList:true,characterData:true,subtree:true});
  window.addEventListener('load',()=>{enforceBadge();setTimeout(enforceBadge,0);setTimeout(enforceBadge,500);});

  window.FQApplyAdminTabs = applyAdminTabs;
  enforceBadge();
  queueMicrotask(applyAdminTabs);
})();
