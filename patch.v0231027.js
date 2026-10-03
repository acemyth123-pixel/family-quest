/* Family Quest v0.23.10.35 — equipped background across player-facing cards */
(function(){
  const BUILD='v0.23.10.35';
  function themeCard(el,bg){
    if(!el)return;
    const prior=el.dataset.fqThemeBgClass;
    if(prior)el.classList.remove(prior);
    const cls='bg-'+bg;
    el.dataset.fqThemeBgClass=cls;
    el.classList.add('fq-themed-card',cls);
  }
  function clearThemeCards(){
    document.querySelectorAll('#view .fq-themed-card').forEach(el=>{
      const prior=el.dataset.fqThemeBgClass;
      if(prior)el.classList.remove(prior);
      delete el.dataset.fqThemeBgClass;
      el.classList.remove('fq-themed-card');
    });
  }
  function shouldTheme(card){
    if(!card)return false;
    if(card.closest('.fq-player-shell'))return false;
    if(card.classList.contains('admin-section'))return false;
    if(card.closest('#realMembershipPanel,#realChoreApprovalPanel,#realRewardApprovalPanel,.failed-panel,.overdue-panel'))return false;
    return true;
  }
  function applyEquippedBackgroundTheme(){
    clearThemeCards();
    if(!state?.view||state.view==='admin')return;
    const u=currentUser?.();
    if(!u)return;
    const bg=String(u.backgroundId||'plain-background');

    document.querySelectorAll('#view .card').forEach(card=>{
      if(shouldTheme(card))themeCard(card,bg);
    });
  }

  const priorRender=render;
  render=function(){
    priorRender();
    queueMicrotask(applyEquippedBackgroundTheme);
  };

  window.FQApplyEquippedBackgroundTheme=applyEquippedBackgroundTheme;
  window.FQApplyHomeBackgrounds=applyEquippedBackgroundTheme;
  window.addEventListener('load',()=>setTimeout(applyEquippedBackgroundTheme,550));

  const badge=document.getElementById('buildBadge');
  if(badge)badge.textContent=BUILD;
})();

/* v0.23.10.35 — durable Admin soft-overdue threshold control */
(function(){
 async function refreshThreshold(){if(!window.FQAuth?.realSession||!isAdmin())return;const {data}=await window.FQAuth.client.rpc('get_household_chore_reminder_threshold');if(data)state.householdReminderThreshold023105=String(data).slice(0,5);}
 function install(){if(state.view!=='admin'||!isAdmin())return;const panel=document.querySelector('#view .overdue-panel');if(!panel)return;let box=panel.querySelector('.fq-soft-overdue-settings-0231035');if(!box){box=document.createElement('div');box.className='fq-soft-overdue-settings-0231035 form-grid';const head=panel.querySelector('.section-title');head?.after(box);}box.innerHTML='<label>Soft-overdue / reminder time<input id="fqSoftOverdueTime0231035" type="time" value="'+(state.householdReminderThreshold023105||'18:00')+'"></label><div class="action-row"><button type="button" class="primary" data-action="soft-overdue-save-0231035">Save Time</button></div><p class="muted full">Daily and Weekly quests become reminder-eligible for Admin at this time. They are not actually failed or late until their real due time.</p>';}
 document.addEventListener('click',async e=>{const b=e.target.closest?.('[data-action="soft-overdue-save-0231035"]');if(!b)return;e.preventDefault();e.stopPropagation();const input=document.getElementById('fqSoftOverdueTime0231035');if(!input?.value)return;const {data,error}=await window.FQAuth.client.rpc('set_household_chore_reminder_threshold',{p_time:input.value});if(error){toast(error.message);return}state.householdReminderThreshold023105=String(data||input.value).slice(0,5);toast('Soft-overdue reminder time saved.');await loadAdminOverdueChores();render();},true);
 const prior=render;render=function(){prior();if(state.view==='admin'){refreshThreshold().then(()=>{install();[100,350,900].forEach(ms=>setTimeout(install,ms));});}};
 window.addEventListener('load',()=>setTimeout(()=>refreshThreshold().then(install),700));
})();
