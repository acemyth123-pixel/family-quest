/* Family Quest v0.23.10.5 — Admin organization, personal chore reminders, per-user repeat completion */
(function(){
  const BUILD='v0.23.10.5';
  window.FQAdmin02310=true;
  state.adminArea02310=state.adminArea02310||'review';
  state.adminManage02310=state.adminManage02310||'reward';
  state.adminQuest02310=state.adminQuest02310||'Daily';
  state.adminAchievement02310=state.adminAchievement02310||'Visible';
  state.reminderSettings02310=state.reminderSettings02310||null;

  function setBadge(){const b=document.getElementById('buildBadge');if(b)b.textContent=BUILD;}
  function btn(label,active,fn){const b=document.createElement('button');b.type='button';b.className='ghost'+(active?' active':'');b.textContent=label;b.onclick=e=>{e.preventDefault();e.stopPropagation();fn()};return b;}
  function heading(card){return (card?.querySelector('h3')?.textContent||'').replace(/^\s*[🎁⚔️⏰🛒🏠👨‍👩‍👧‍👦🏆🎨]+\s*/u,'').trim();}
  function show(el,on){if(!el)return;el.hidden=!on;el.style.display=on?'':'none';}

  function inPeriod(c,x){
    if(!x?.completed_at)return false;
    const at=new Date(x.completed_at), now=new Date(), due=c.due?new Date(c.due):null;
    if(c.type==='Daily') return at.toLocaleDateString('en-CA',{timeZone:'America/New_York'})===now.toLocaleDateString('en-CA',{timeZone:'America/New_York'});
    if(c.type==='Weekly'&&due) return at<=due&&at>new Date(due.getTime()-7*86400000);
    if(c.type==='Monthly'&&due){const prev=new Date(due);prev.setMonth(prev.getMonth()-1);return at<=due&&at>prev;}
    return c.type==='One-Off';
  }
  const priorCard=choreCard;
  choreCard=function(c){
    if(c?.allowMultiple&&c.type==='Monthly'){
      const uid=window.FQAuth?.profile?.user_id;
      const mine=(c.approvedCompletions||[]).some(x=>String(x.completed_by)===String(uid)&&inPeriod(c,x));
      const saved=c.completedThisPeriod;c.completedThisPeriod=mine;
      const html=priorCard(c);c.completedThisPeriod=saved;return html;
    }
    return priorCard(c);
  };

  const priorRenderChores023104=renderChores;
  renderChores=function(){
    const uid=window.FQAuth?.profile?.user_id;
    const me=currentUser();
    const rank=c=>{
      const assigned=(c.assigneeIds||[]).some(id=>String(id)===String(uid))||owner(c)===me?.name;
      const claimed=String(c.claimedById||c.claimed_by||'')===String(uid);
      return assigned||claimed?0:1;
    };
    const original=state.chores;
    state.chores=[...(original||[])].sort((a,b)=>rank(a)-rank(b));
    try{return priorRenderChores023104()}finally{state.chores=original}
  };

  function homeQuestIsOutstanding(c,u){
    if(!c||c.active===false||c.status!=='Open')return false;
    if(owner(c)!==u.name)return false;
    // Repeatable chores can keep an optional open instance after a successful
    // completion. That optional extra attempt is not an outstanding obligation.
    if(c.completedThisPeriod)return false;
    return true;
  }
  function upcomingHomeEvents(){
    const now=Date.now();
    return (state.events||[]).filter(e=>{
      const end=new Date(e.end||e.start).getTime();
      return Number.isFinite(end)&&end>=now;
    }).sort((a,b)=>new Date(a.start)-new Date(b.start)).slice(0,5);
  }
  function refreshHome023102(){
    if(state.view!=='home')return;
    const u=currentUser(),open=(state.chores||[]).filter(c=>homeQuestIsOutstanding(c,u));
    const openStat=[...document.querySelectorAll('#view [data-view-jump="chores"].quick-stat')][0];
    if(openStat){
      const v=openStat.querySelector('.value'),s=openStat.querySelector('.sub');
      if(v)v.textContent=String(open.length);
      if(s)s.textContent='Assigned or claimed';
    }
    // Up Next duplicated the Quest Log and made the whole card vulnerable to
    // late-render click-through. Remove it; Open Quests is the single route.
    const upNext=[...document.querySelectorAll('#view .card')].find(x=>(x.querySelector('.section-title h3')?.textContent||'').includes('Up Next'));
    if(upNext)upNext.remove();
    const upcoming=[...document.querySelectorAll('#view .card')].find(x=>(x.querySelector('.section-title h3')?.textContent||'').includes('Upcoming'));
    if(upcoming){
      const list=upcoming.querySelector('.simple-list'),events=upcomingHomeEvents();
      if(list)list.innerHTML=events.length?events.map(eventCard).join(''):'<div class="empty">Nothing upcoming.</div>';
      const grid=upcoming.parentElement;
      if(grid?.classList.contains('grid'))grid.classList.remove('two');
    }
  }

  function applyQuickAddVisibility023105(){const b=document.querySelector('.top-actions [data-action="quick-open"]');if(b)b.style.display=state.view==='home'?'':'none';}
  async function loadHouseholdReminderThreshold023105(){if(!window.FQAuth?.realSession||!isAdmin())return;const {data,error}=await window.FQAuth.client.rpc('get_household_chore_reminder_threshold');if(!error&&data)state.householdReminderThreshold023105=String(data).slice(0,5);}
  async function saveHouseholdReminderThreshold023105(){const el=document.getElementById('fqHouseholdReminderThreshold023105');if(!el?.value)return;const {data,error}=await window.FQAuth.client.rpc('set_household_chore_reminder_threshold',{p_time:el.value});if(error){toast(error.message);return}state.householdReminderThreshold023105=String(data||el.value).slice(0,5);toast('Chore reminder time saved.');await loadAdminOverdueChores();render();}
  function addOverdueThresholdControl023105(){if(state.view!=='admin'||!isAdmin())return;const panel=document.querySelector('#view .overdue-panel');if(!panel||panel.querySelector('#fqHouseholdReminderThreshold023105'))return;const p=panel.querySelector('p.muted'),wrap=document.createElement('div');wrap.className='form-grid';wrap.innerHTML=`<label>Daily / Weekly reminder time<input id="fqHouseholdReminderThreshold023105" type="time" value="${state.householdReminderThreshold023105||'18:00'}"></label><div class="action-row"><button type="button" class="primary" data-action="overdue-threshold-save-023105">Save Time</button></div><p class="muted full">Daily and Weekly quests appear here at this time so Admin can send a reminder, but they are not failed or late until midnight. Monthly and One-Off quests appear after their actual due date/time and remain until completed.</p>`;if(p)p.replaceWith(wrap);else panel.querySelector('.section-title')?.after(wrap);}

  async function loadReminderSettings(){
    if(!window.FQAuth?.realSession)return;
    const {data,error}=await window.FQAuth.client.rpc('get_my_chore_reminder_settings');
    if(!error)state.reminderSettings02310=data||null;
  }
  function reminderMarkup(){
    const s=state.reminderSettings02310||{};
    const row=(key,title,desc,extra='')=>`<div class="fq-reminder-row"><label class="fq-reminder-toggle"><input type="checkbox" data-reminder-enabled="${key}" ${s[key+'_enabled']?'checked':''}> <strong>${title}</strong></label><span class="muted">${desc}</span>${extra}<label>Reminder time<input type="time" data-reminder-time="${key}" value="${String(s[key+'_time']||'17:00').slice(0,5)}"></label></div>`;
    return `<div class="card fq-reminder-settings"><div class="section-title"><div><h3>⏰ My Chore Reminders</h3><p class="muted">Personal phone reminders only. These do not change due dates or notify Admin.</p></div></div>
      ${row('daily','Daily quests','If assigned Daily quests are still open today.')}
      ${row('weekly','Weekly quests','If assigned Weekly quests are still open on your reminder day.',`<label>Reminder day<select data-reminder-weekday>${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((d,i)=>`<option value="${i}" ${Number(s.weekly_weekday??0)===i?'selected':''}>${d}</option>`).join('')}</select></label>`)}
      ${row('monthly','Monthly quests','On the Monthly quest due date if your assigned quest is still open.')}
      ${row('one_off','One-Off quests','On the One-Off due date if your assigned quest is still open.')}
      <div class="action-row"><button class="primary" data-action="reminders-save-02310">Save Reminder Settings</button></div></div>`;
  }
  async function saveReminders(){
    const val=k=>document.querySelector(`[data-reminder-time="${k}"]`)?.value||'17:00';
    const on=k=>!!document.querySelector(`[data-reminder-enabled="${k}"]`)?.checked;
    const args={p_daily_enabled:on('daily'),p_daily_time:val('daily'),p_weekly_enabled:on('weekly'),p_weekly_weekday:Number(document.querySelector('[data-reminder-weekday]')?.value||0),p_weekly_time:val('weekly'),p_monthly_enabled:on('monthly'),p_monthly_time:val('monthly'),p_one_off_enabled:on('one_off'),p_one_off_time:val('one_off')};
    const {data,error}=await window.FQAuth.client.rpc('save_my_chore_reminder_settings',args);
    if(error){toast(error.message);return}state.reminderSettings02310=data;toast('Reminder settings saved.');
  }
  function addReminderSettings(){
    if(state.view!=='profiles'||!state.profilePlayerId)return;
    const uid=window.FQAuth?.profile?.user_id;
    if(String(state.profilePlayerId)!==String(uid))return;
    const shell=document.querySelector('.fq-player-shell');if(!shell||shell.querySelector('.fq-reminder-settings'))return;
    shell.insertAdjacentHTML('beforeend',reminderMarkup());
  }

  function managementCard(){return [...document.querySelectorAll('#view .card')].find(c=>[...c.querySelectorAll('.section-title h3')].some(h=>h.textContent.trim()==='Chores')&&[...c.querySelectorAll('.section-title h3')].some(h=>h.textContent.trim()==='Rewards'))||null;}
  function section(card,name){return [...(card?.querySelectorAll('.section-title')||[])].find(x=>(x.querySelector('h3')?.textContent||'').trim()===name)||null;}
  function listAfter(head){let n=head?.nextElementSibling;while(n&&!n.classList.contains('simple-list'))n=n.nextElementSibling;return n;}
  function directCardByHeading(name){
    return [...document.querySelectorAll('#view > .card,#view > .grid > .card')].find(c=>heading(c)===name)||null;
  }
  function placeAfter(anchor,node){if(anchor&&node&&anchor!==node)anchor.after(node);return node||anchor;}
  function applyAdmin(){
    if(state.view!=='admin')return;
    const view=document.getElementById('view');if(!view)return;
    let nav=document.getElementById('fqAdminAreaNav02310');
    if(!nav){nav=document.createElement('div');nav.id='fqAdminAreaNav02310';nav.className='tabs fq-admin-area-tabs';view.prepend(nav);}

    const failed=document.querySelector('#view .failed-panel');
    const member=document.getElementById('realMembershipPanel');
    const choreApproval=document.getElementById('realChoreApprovalPanel');
    const rewardApproval=document.getElementById('realRewardApprovalPanel');
    const overdue=document.querySelector('#view .overdue-panel');
    const grocery=directCardByHeading('Grocery Quest Settings');
    const season=directCardByHeading('Season Controls');
    const legacy=directCardByHeading('Approval Queue');
    const m=managementCard();

    if(legacy)show(legacy,false);
    const reviewCount=(choreApproval?.querySelectorAll('.simple-item').length||0)+(rewardApproval?.querySelectorAll('.simple-item').length||0)+(failed?.querySelectorAll('.simple-item').length||0);
    nav.innerHTML='';
    [['review',`📥 Review${reviewCount?` (${reviewCount})`:''}`],['quests','⚔️ Quests'],['household','👨‍👩‍👧‍👦 Household'],['manage','🎛️ Manage']].forEach(([id,label])=>nav.appendChild(btn(label,state.adminArea02310===id,()=>{state.adminArea02310=id;applyAdmin()})));

    [failed,choreApproval,rewardApproval].forEach(x=>show(x,state.adminArea02310==='review'));
    [overdue,grocery].forEach(x=>show(x,state.adminArea02310==='quests'));
    [member,season].forEach(x=>show(x,state.adminArea02310==='household'));
    if(m)show(m,state.adminArea02310==='quests'||state.adminArea02310==='manage');

    let anchor=nav;
    if(state.adminArea02310==='review'){
      anchor=placeAfter(anchor,choreApproval);anchor=placeAfter(anchor,rewardApproval);anchor=placeAfter(anchor,failed);
    }else if(state.adminArea02310==='quests'){
      anchor=placeAfter(anchor,overdue);anchor=placeAfter(anchor,grocery);anchor=placeAfter(anchor,m);
    }else if(state.adminArea02310==='household'){
      anchor=placeAfter(anchor,member);anchor=placeAfter(anchor,season);
    }else if(state.adminArea02310==='manage'){
      anchor=placeAfter(anchor,m);
    }

    if(!m)return;
    m.querySelectorAll('.admin-catalog-tabs,.admin-catalog-tabs-v236,.admin-catalog-tabs-v238,.admin-main-tabs-02382,.admin-main-tabs-02383,.admin-main-tabs-02384,.admin-subtabs-0238,.admin-subtabs-02382,.admin-subtabs-02383,.admin-subtabs-02384,.fq-admin-inner-tabs-02310').forEach(x=>x.remove());
    const heads={chore:section(m,'Chores'),reward:section(m,'Rewards'),achievement:section(m,'Achievements'),cosmetic:section(m,'Cosmetic Shop Pricing')};
    const action=[...m.children].find(x=>x.classList?.contains('action-row'));
    if(state.adminArea02310==='quests'){
      Object.entries(heads).forEach(([k,h])=>{show(h,k==='chore');show(listAfter(h),k==='chore')});
      if(action)[...action.children].forEach(x=>show(x,x.dataset.type==='chore'));
      const h=heads.chore,l=listAfter(h);if(h&&l){const sub=document.createElement('div');sub.className='tabs fq-admin-inner-tabs-02310';['Daily','Weekly','Monthly','Seasonal'].forEach(x=>sub.appendChild(btn(x,state.adminQuest02310===x,()=>{state.adminQuest02310=x;applyAdmin()})));h.after(sub);[...l.children].forEach((row,i)=>show(row,String((state.chores||[])[i]?.type)===state.adminQuest02310));}
    }else if(state.adminArea02310==='manage'){
      const sub=document.createElement('div');sub.className='tabs fq-admin-inner-tabs-02310';[['reward','🎁 Rewards'],['achievement','🏆 Achievements'],['cosmetic','🎨 Cosmetic Pricing']].forEach(([id,label])=>sub.appendChild(btn(label,state.adminManage02310===id,()=>{state.adminManage02310=id;applyAdmin()})));m.prepend(sub);
      Object.entries(heads).forEach(([k,h])=>{const on=k===state.adminManage02310;show(h,on);show(listAfter(h),on)});
      if(action)[...action.children].forEach(x=>show(x,x.dataset.type==='achievement'&&state.adminManage02310==='achievement'));
      if(state.adminManage02310==='achievement'){const h=heads.achievement,l=listAfter(h);if(h&&l){const a=document.createElement('div');a.className='tabs fq-admin-inner-tabs-02310';['Visible','Secret'].forEach(x=>a.appendChild(btn(x,state.adminAchievement02310===x,()=>{state.adminAchievement02310=x;applyAdmin()})));h.after(a);[...l.children].forEach((row,i)=>{const item=(state.achievements||[])[i],secret=!!(item?.hidden||item?.secret);show(row,state.adminAchievement02310==='Secret'?secret:!secret)});}}
    }
  }

  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-action="overdue-threshold-save-023105"]');if(b){e.preventDefault();e.stopPropagation();saveHouseholdReminderThreshold023105();}},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-action="reminders-save-02310"]');if(b){e.preventDefault();saveReminders();}},true);
  const prevRender=render;
  render=function(){prevRender();queueMicrotask(()=>{setBadge();applyQuickAddVisibility023105();addReminderSettings();applyAdmin();addOverdueThresholdControl023105();refreshHome023102()});if(state.view==='profiles'&&state.profilePlayerId&&!state.reminderSettings02310)loadReminderSettings().then(()=>{if(state.view==='profiles'){addReminderSettings();}});if(state.view==='admin'){loadHouseholdReminderThreshold023105().then(addOverdueThresholdControl023105);[80,300,800].forEach(ms=>setTimeout(()=>{applyAdmin();addOverdueThresholdControl023105();},ms));}};
  window.addEventListener('load',()=>{setBadge();setTimeout(()=>{applyQuickAddVisibility023105();loadHouseholdReminderThreshold023105();addReminderSettings();applyAdmin();addOverdueThresholdControl023105();refreshHome023102()},500)});
  setBadge();
})();