/* Family Quest v0.23.8.4 — Admin tabs/subtabs only */
(function(){
  const BUILD='v0.23.8.4';
  state.adminMainTab02384=state.adminMainTab02384||'chore';
  state.adminChoreTab02384=state.adminChoreTab02384||'Daily';
  state.adminAchievementTab02384=state.adminAchievementTab02384||'Visible';

  function setBadge(){const b=document.getElementById('buildBadge');if(b)b.textContent=BUILD;}
  function sectionName(section){return (section?.querySelector('h3')?.textContent||'').trim();}
  function managementCard(){
    const root=document.getElementById('view');if(!root)return null;
    return [...root.querySelectorAll('.card')].find(card=>{
      const names=[...card.querySelectorAll('.section-title')].map(sectionName);
      return names.includes('Chores')&&names.includes('Rewards')&&names.includes('Achievements');
    })||null;
  }
  function section(card,name){return [...card.querySelectorAll('.section-title')].find(x=>sectionName(x)===name)||null;}
  function listAfter(head){
    let n=head?.nextElementSibling||null;
    while(n && !n.classList?.contains('simple-list')) n=n.nextElementSibling;
    return n;
  }
  function show(el,on){if(!el)return;el.hidden=!on;el.style.display=on?'':'none';}

  function apply(){
    if(state.view!=='admin')return;
    const card=managementCard();if(!card)return;

    // Remove every older generated tab row so there is exactly one owner.
    card.querySelectorAll('.admin-catalog-tabs,.admin-catalog-tabs-v236,.admin-catalog-tabs-v238,.admin-main-tabs-02382,.admin-main-tabs-02383,.admin-main-tabs-02384,.admin-subtabs-0238,.admin-subtabs-02382,.admin-subtabs-02383,.admin-subtabs-02384').forEach(x=>x.remove());

    const top=document.createElement('div');
    top.className='tabs admin-main-tabs-02384';
    top.innerHTML=[['chore','⚔️ Chores'],['reward','🎁 Rewards'],['achievement','🏆 Achievements'],['cosmetic','🎨 Cosmetic Pricing']]
      .map(([id,label])=>`<button type="button" class="ghost ${state.adminMainTab02384===id?'active':''}" data-admin-main-02384="${id}">${label}</button>`).join('');
    card.prepend(top);

    const defs=[['chore','Chores'],['reward','Rewards'],['cosmetic','Cosmetic Shop Pricing'],['achievement','Achievements']];
    defs.forEach(([id,name])=>{
      const head=section(card,name),list=listAfter(head),on=state.adminMainTab02384===id;
      show(head,on);show(list,on);
    });

    const actionRow=[...card.children].find(x=>x.classList?.contains('action-row'));
    if(actionRow){
      [...actionRow.children].forEach(btn=>{
        const t=btn.dataset.type;
        btn.style.display=(t==='chore'&&state.adminMainTab02384==='chore')||(t==='achievement'&&state.adminMainTab02384==='achievement')?'':'none';
      });
    }

    if(state.adminMainTab02384==='chore'){
      const head=section(card,'Chores'),list=listAfter(head);
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02384';
        sub.innerHTML=['Daily','Weekly','Monthly','Seasonal'].map(x=>`<button type="button" class="ghost ${state.adminChoreTab02384===x?'active':''}" data-admin-chore-02384="${x}">${x}</button>`).join('');
        head.after(sub);
        [...list.children].forEach((row,i)=>{
          const item=(state.chores||[])[i];
          const on=!!item&&String(item.type)===state.adminChoreTab02384;
          show(row,on);
        });
      }
    }

    if(state.adminMainTab02384==='achievement'){
      const head=section(card,'Achievements'),list=listAfter(head);
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02384';
        sub.innerHTML=['Visible','Secret'].map(x=>`<button type="button" class="ghost ${state.adminAchievementTab02384===x?'active':''}" data-admin-ach-02384="${x}">${x}</button>`).join('');
        head.after(sub);
        [...list.children].forEach((row,i)=>{
          const item=(state.achievements||[])[i];
          const secret=!!(item?.hidden||item?.secret);
          const on=state.adminAchievementTab02384==='Secret'?secret:!secret;
          show(row,on);
        });
      }
    }
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.adminMain02384){e.preventDefault();e.stopImmediatePropagation();state.adminMainTab02384=b.dataset.adminMain02384;apply();return;}
    if(b.dataset.adminChore02384){e.preventDefault();e.stopImmediatePropagation();state.adminChoreTab02384=b.dataset.adminChore02384;apply();return;}
    if(b.dataset.adminAch02384){e.preventDefault();e.stopImmediatePropagation();state.adminAchievementTab02384=b.dataset.adminAch02384;apply();return;}
  },true);

  const prevRender=render;
  render=function(){prevRender();queueMicrotask(()=>{apply();setBadge();});};
  window.addEventListener('load',()=>setTimeout(()=>{apply();setBadge();},300));
  setBadge();
})();