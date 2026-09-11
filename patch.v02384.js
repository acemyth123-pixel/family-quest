/* Family Quest v0.23.8.7 — single-owner Admin tabs + optional repeat chore controls */
(function(){
  const BUILD='v0.23.8.7';
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
  function listAfter(head){let n=head?.nextElementSibling||null;while(n&&!n.classList?.contains('simple-list'))n=n.nextElementSibling;return n;}
  function show(el,on){if(!el)return;el.hidden=!on;el.style.display=on?'':'none';}
  function makeButton(label,active,onPress){
    const b=document.createElement('button');
    b.type='button';
    b.className='ghost'+(active?' active':'');
    b.textContent=label;
    b.style.pointerEvents='auto';
    b.style.position='relative';
    b.style.zIndex='20';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();onPress();};
    b.ontouchend=function(e){e.preventDefault();e.stopPropagation();onPress();};
    return b;
  }

  /* Repeatable quests stay visibly completed for the period, but the optional
     extra attempt uses the normal Claim / Complete language instead of
     "Complete Again" and never turns the finished accomplishment back into an
     unfinished obligation. The RPC creates the optional live instance only
     when the user actually chooses to act on it. */
  const priorChoreCard02387=choreCard;
  choreCard=function(c){
    let html=priorChoreCard02387(c);
    if(!c?.completedThisPeriod||!c?.allowMultiple||String(c.type)==='One-Off')return html;
    const mine=owner(c)===state.currentUser;
    const replacement=mine
      ?`<button class="primary" data-action="chore-repeat-optional" data-mode="complete" data-definition="${c.definitionId||c.id}">Complete</button>`
      :`<button class="ghost" data-action="chore-repeat-optional" data-mode="claim" data-definition="${c.definitionId||c.id}">Claim</button>`;
    return html.replace(/<button class="primary" data-action="chore-repeat" data-id="[^"]+">Complete Again<\/button>/,replacement);
  };

  async function startOptionalRepeat(btn){
    if(!(window.FQAuth?.realSession&&window.FQAuth?.client))return;
    if(btn.dataset.busy==='1')return;
    btn.dataset.busy='1';btn.disabled=true;
    try{
      const {data:iid,error}=await window.FQAuth.client.rpc('create_repeat_completion',{p_definition_id:btn.dataset.definition});
      if(error)throw error;
      await loadRealChores();
      const c=(state.chores||[]).find(x=>String(x.id)===String(iid))||(state.chores||[]).find(x=>String(x.definitionId||x.id)===String(btn.dataset.definition)&&x.status==='Open'&&owner(x)===state.currentUser);
      if(btn.dataset.mode==='complete'){
        if(!c)throw new Error('Optional repeat was created, but its quest card could not be loaded.');
        realCompleteChore(c);
      }else{
        toast('Quest claimed.');
        render();
      }
    }catch(err){
      console.error(err);toast(err?.message||'Could not open the optional repeat.');
      btn.disabled=false;btn.dataset.busy='0';
    }
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('button[data-action="chore-repeat-optional"]');
    if(!btn)return;
    e.preventDefault();e.stopPropagation();
    startOptionalRepeat(btn);
  },true);

  function apply(){
    if(state.view!=='admin')return;
    const card=managementCard();if(!card)return;
    card.querySelectorAll('.admin-catalog-tabs,.admin-catalog-tabs-v236,.admin-catalog-tabs-v238,.admin-main-tabs-02382,.admin-main-tabs-02383,.admin-main-tabs-02384,.admin-subtabs-0238,.admin-subtabs-02382,.admin-subtabs-02383,.admin-subtabs-02384').forEach(x=>x.remove());

    const top=document.createElement('div');top.className='tabs admin-main-tabs-02384';top.style.position='relative';top.style.zIndex='20';top.style.pointerEvents='auto';
    [['chore','⚔️ Chores'],['reward','🎁 Rewards'],['achievement','🏆 Achievements'],['cosmetic','🎨 Cosmetic Pricing']].forEach(([id,label])=>{
      top.appendChild(makeButton(label,state.adminMainTab02384===id,()=>{state.adminMainTab02384=id;apply();}));
    });
    card.prepend(top);

    [['chore','Chores'],['reward','Rewards'],['cosmetic','Cosmetic Shop Pricing'],['achievement','Achievements']].forEach(([id,name])=>{
      const head=section(card,name),list=listAfter(head),on=state.adminMainTab02384===id;show(head,on);show(list,on);
    });

    const actionRow=[...card.children].find(x=>x.classList?.contains('action-row'));
    if(actionRow){[...actionRow.children].forEach(btn=>{const t=btn.dataset.type;btn.style.display=(t==='chore'&&state.adminMainTab02384==='chore')||(t==='achievement'&&state.adminMainTab02384==='achievement')?'':'none';});}

    if(state.adminMainTab02384==='chore'){
      const head=section(card,'Chores'),list=listAfter(head);
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02384';sub.style.position='relative';sub.style.zIndex='20';sub.style.pointerEvents='auto';
        ['Daily','Weekly','Monthly','Seasonal'].forEach(x=>sub.appendChild(makeButton(x,state.adminChoreTab02384===x,()=>{state.adminChoreTab02384=x;apply();})));
        head.after(sub);
        [...list.children].forEach((row,i)=>{const item=(state.chores||[])[i];show(row,!!item&&String(item.type)===state.adminChoreTab02384);});
      }
    }

    if(state.adminMainTab02384==='achievement'){
      const head=section(card,'Achievements'),list=listAfter(head);
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02384';sub.style.position='relative';sub.style.zIndex='20';sub.style.pointerEvents='auto';
        ['Visible','Secret'].forEach(x=>sub.appendChild(makeButton(x,state.adminAchievementTab02384===x,()=>{state.adminAchievementTab02384=x;apply();})));
        head.after(sub);
        [...list.children].forEach((row,i)=>{const item=(state.achievements||[])[i];const secret=!!(item?.hidden||item?.secret);show(row,state.adminAchievementTab02384==='Secret'?secret:!secret);});
      }
    }
  }

  const prevRender=render;
  render=function(){prevRender();queueMicrotask(()=>{apply();setBadge();});};
  window.addEventListener('load',()=>setTimeout(()=>{apply();setBadge();},300));
  setBadge();
})();