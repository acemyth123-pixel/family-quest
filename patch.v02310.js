/* Family Quest v0.23.10.11 — Admin organization, personal chore reminders, per-user repeat completion */
(function(){
  const BUILD='v0.23.10.18';
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
    if(c?.type==='Monthly'&&(c.assigneeIds||[]).length>1){
      const uid=window.FQAuth?.profile?.user_id;
      const mine=(c.approvedCompletions||[]).some(x=>String(x.completed_by)===String(uid)&&inPeriod(c,x));
      const saved=c.completedThisPeriod;c.completedThisPeriod=mine;
      const html=priorCard(c);c.completedThisPeriod=saved;return html;
    }
    return priorCard(c);
  };

  async function optimizeChorePhoto023111(file){
    if(!file)return null;
    if(!/^image\/(jpeg|png|webp|gif|heic|heif)$/i.test(file.type||'')&&!/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name||''))throw new Error('Please choose a photo.');
    if(file.size<=2*1024*1024&&/^image\/(jpeg|png|webp)$/i.test(file.type||''))return file;
    const bitmap=await createImageBitmap(file);
    const maxSide=1920,scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d',{alpha:false}).drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.82));
    if(!blob)throw new Error('Could not optimize this photo.');
    if(blob.size>5*1024*1024)throw new Error('Photo is still too large after optimization. Please choose a smaller image.');
    return new File([blob],(file.name||'reference-photo').replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }
  async function uploadChoreReferencePhoto023107(file,definitionId){
    if(!file)return null;
    const optimized=await optimizeChorePhoto023111(file);
    const ext=((optimized.name||'photo.jpg').split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    const hid=window.FQAuth?.profile?.household_id,uid=window.FQAuth?.profile?.user_id;
    const path=`${hid}/${definitionId}/${uid}-${Date.now()}.${ext}`;
    const {error}=await window.FQAuth.client.storage.from('chore-reference-photos').upload(path,optimized,{cacheControl:'3600',upsert:false,contentType:optimized.type});
    if(error)throw error;
    return window.FQAuth.client.storage.from('chore-reference-photos').getPublicUrl(path).data.publicUrl;
  }
  // Reference-photo upload is bound directly to the Save button so it runs
  // before the older form-submit owner can close/re-render the editor.
  function bindReferencePhotoSave023110(){
    const form=document.getElementById('adminEditorForm');
    const btn=form?.querySelector('button[type="submit"]');
    if(!btn||btn.dataset.photoSaveBound==='1')return;
    btn.dataset.photoSaveBound='1';
    btn.addEventListener('click',async e=>{
      if(state.editing?.type!=='chore'||!window.FQAuth?.realSession)return;
      const input=document.getElementById('aePhoto'),file=input?.files?.[0];
      if(!file)return;
      e.preventDefault();e.stopImmediatePropagation();
      const o=state.editing.id?state.chores.find(x=>String(x.id)===String(state.editing.id)):null;
      try{
        const did=o?.definitionId||o?.id;
        if(!did)throw new Error('Save the chore once before adding its reference photo.');
        btn.disabled=true;btn.textContent='Saving photo…';
        const url=await uploadChoreReferencePhoto023107(file,did);
        const {data,error}=await window.FQAuth.client.rpc('set_chore_reference_photo',{p_chore_id:did,p_photo_url:url});
        if(error)throw error;
        input.value='';
        btn.disabled=false;btn.textContent='Save';
        form.requestSubmit();
      }catch(err){
        btn.disabled=false;btn.textContent='Save';
        toast(err?.message||'Could not save reference photo.');
      }
    },true);
  }
  bindReferencePhotoSave023110();
  window.addEventListener('load',bindReferencePhotoSave023110);

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

  // Route notification launches after auth is ready. The push URL carries only
  // the notification id; source/type are read from Supabase so routing stays
  // correct even as notification types evolve.
  function notificationView023112(n){
    const t=String(n?.type||'').toLowerCase(),s=String(n?.source_type||'').toLowerCase();
    if(t==='push_test')return 'notifications';
    if(t==='calendar_today'||s==='calendar'||s==='calendar_event')return 'calendar';
    if(t==='request'||t.startsWith('request_')||s==='family_request')return 'requests';
    if(t==='grocery'||t.startsWith('grocery_'))return 'groceries';
    if(t==='achievement'||t.startsWith('achievement_')||s.includes('achievement'))return 'achievements';
    if(t==='reward'||t.startsWith('reward_')||s.includes('reward'))return 'rewards';
    if(t.startsWith('admin_'))return 'admin';
    if(t==='chore'||t==='overdue'||t==='overdue_reminder'||t==='failed_quest'||t==='failure'||t.startsWith('chore_')||t.startsWith('failure_')||s.startsWith('chore_'))return 'chores';
    return 'notifications';
  }
  async function routeNotificationLaunch023112(){
    const params=new URLSearchParams(location.search),id=params.get('notification');
    if(!id||sessionStorage.getItem('fq-routed-notification')===id)return;
    if(!window.FQAuth?.realSession||!window.FQAuth?.profile?.user_id)return;
    const {data:n,error}=await window.FQAuth.client.from('notifications').select('id,type,source_type,source_id,read_at').eq('id',id).eq('user_id',window.FQAuth.profile.user_id).maybeSingle();
    if(error||!n)return;
    sessionStorage.setItem('fq-routed-notification',id);
    state.view=notificationView023112(n);
    if(!n.read_at)window.FQAuth.client.rpc('mark_notification_read',{p_id:id}).catch(()=>{});
    history.replaceState({},'',location.pathname+location.hash);
    render();
    if(state.view==='chores'&&n.source_type==='chore_instance'&&n.source_id){
      const chore=(state.chores||[]).find(x=>String(x.instanceId||'')===String(n.source_id));
      if(chore)setTimeout(()=>openChoreDetail(chore.id),100);
    }
  }
  let notificationRouteTries023112=0;
  const notificationRouteTimer023112=setInterval(()=>{
    if(!new URLSearchParams(location.search).get('notification')){clearInterval(notificationRouteTimer023112);return}
    routeNotificationLaunch023112().finally(()=>{
      notificationRouteTries023112++;
      if(notificationRouteTries023112>40||sessionStorage.getItem('fq-routed-notification')===new URLSearchParams(location.search).get('notification'))clearInterval(notificationRouteTimer023112);
    });
  },250);
})();

/* v0.23.10.14 — expanded celebration/confetti effects */
(function(){
  const oldSpec=window.confettiSpec||confettiSpec;
  confettiSpec=function(id){
    const more={
      'sparkle-confetti':['✨','✦','⋆','✧'],
      'shooting-star-confetti':['🌠','⭐','✦'],
      'heart-confetti':['💜','💖','💕'],
      'lightning-confetti':['⚡','✦','⚡'],
      'flower-confetti':['🌸','🌼','✿'],
      'gem-confetti':['💎','◆','✦'],
      'party-confetti':['🎉','🎊','✦'],
      'hero-confetti':['⭐','✨','💥'],
      'speed-confetti':['💨','⚡','✦'],
      'moon-confetti':['🌙','⭐','✦'],
      'trash-confetti':['🗑️','✨','▪'],
      'pet-confetti':['🐾','🦴','🐾'],
      'royal-confetti':['👑','✨','◆']
    };
    return more[id]||oldSpec(id);
  };
  window.confettiSpec=confettiSpec;
})();


/* v0.23.10.15 — try-before-you-buy celebration previews in Cosmetic Shop */
(function(){
  function fqCelebrationSpec(id){
    const specs={
      'leaf-confetti':['🍂','🍁','🍃'],'snowfall-confetti':['❄️','❅','✦'],'harvest-confetti':['🍎','🎃','🍂'],
      'fireworks-confetti':['✦','★','✹'],'coin-confetti':['🪙','◆','✦'],'grass-confetti':['🌱','🍃','▪'],
      'sunshine-confetti':['🌈','☀️','✦'],'bubble-confetti':['🫧','○','◌'],'ice-confetti':['🧊','❄️','✦'],
      'sparkle-confetti':['✨','✦','⋆','✧'],'shooting-star-confetti':['🌠','⭐','✦'],'heart-confetti':['💜','💖','💕'],
      'lightning-confetti':['⚡','✦','⚡'],'flower-confetti':['🌸','🌼','✿'],'gem-confetti':['💎','◆','✦'],
      'party-confetti':['🎉','🎊','✦'],'hero-confetti':['⭐','✨','💥'],'speed-confetti':['💨','⚡','✦'],
      'moon-confetti':['🌙','⭐','✦'],'trash-confetti':['🗑️','✨','▪'],'pet-confetti':['🐾','🦴','🐾'],
      'royal-confetti':['👑','✨','◆']
    };
    return specs[id]||['■','●','▲','◆'];
  }
  function fqPreviewLayer(){return document.querySelector('#celebration')||document.body}
  function fqBurstCelebration(id,anchor){
    const spec=fqCelebrationSpec(id),layer=fqPreviewLayer(),r=anchor?.getBoundingClientRect?.(),x=r?r.left+r.width/2:innerWidth/2,y=r?r.top+r.height/2:innerHeight/2;
    for(let i=0;i<34;i++){
      const p=document.createElement('i'),a=Math.random()*Math.PI*2,d=70+Math.random()*150;
      p.textContent=spec[i%spec.length];p.className='fq-shop-burst-particle';
      p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',Math.sin(a)*d+'px');
      p.style.fontSize=(14+Math.random()*12)+'px';layer.appendChild(p);setTimeout(()=>p.remove(),1050);
    }
  }
  function fqRainCelebration(id){
    const spec=fqCelebrationSpec(id),layer=fqPreviewLayer();
    for(let i=0;i<48;i++){
      const p=document.createElement('i');p.textContent=spec[i%spec.length];p.className='fq-shop-rain-particle';
      p.style.left=Math.random()*100+'vw';p.style.animationDelay=Math.random()*.55+'s';p.style.animationDuration=(1.8+Math.random()*1.2)+'s';
      p.style.fontSize=(14+Math.random()*13)+'px';layer.appendChild(p);setTimeout(()=>p.remove(),3600);
    }
  }
  function fqDecorateConfettiShop(){
    if(state?.view!=='cosmetics')return;
    document.querySelectorAll('.cosmetic-card').forEach(card=>{
      const control=card.querySelector('[data-action="cosmetic-buy"],[data-action="cosmetic-equip"]');
      if(!control)return;
      const id=control.dataset.cosmetic,x=state.cosmeticCatalog?.find(v=>String(v.id)===String(id));
      if(!x||x.type!=='confetti'||card.querySelector('.fq-confetti-tests'))return;
      const owned=(currentUser()?.cosmeticUnlocks||[]).map(String).includes(String(id))||x.acquisition_method==='default';
      if(x.secret&&!owned)return;
      const row=document.createElement('div');row.className='row fq-confetti-tests';
      row.innerHTML='<button type="button" class="ghost" data-fq-confetti-burst="'+String(id).replace(/"/g,'&quot;')+'">💥 Test Burst</button><button type="button" class="ghost" data-fq-confetti-rain="'+String(id).replace(/"/g,'&quot;')+'">🎉 Test Celebration</button>';
      card.appendChild(row);
    });
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-fq-confetti-burst],[data-fq-confetti-rain]');if(!b)return;
    e.preventDefault();e.stopPropagation();
    if(b.dataset.fqConfettiBurst)fqBurstCelebration(b.dataset.fqConfettiBurst,b);
    else fqRainCelebration(b.dataset.fqConfettiRain);
  },true);
  const mo=new MutationObserver(()=>fqDecorateConfettiShop());mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(fqDecorateConfettiShop,500));
})();




/* v0.23.10.18 — single-owner Customize Profile tabs + reminders */
(function(){
  let tab='avatar';
  const keys=['avatar','background','confetti','reminders'], labels={avatar:'🧍 Avatar',background:'🌌 Background',confetti:'🎉 Confetti',reminders:'⏰ Reminders'};
  async function loadReminderSettings231018(){
    if(!window.FQAuth?.realSession)return;
    const {data,error}=await window.FQAuth.client.rpc('get_my_chore_reminder_settings');
    if(!error)state.reminderSettings02310=data||{};
  }
  function reminderHTML(){
    const s=state.reminderSettings02310||{},days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const row=(k,title,desc,extra='')=>'<div class="fq-custom-reminder-row"><label class="fq-reminder-toggle"><input type="checkbox" data-r18-on="'+k+'" '+(s[k+'_enabled']?'checked':'')+'><strong>'+title+'</strong></label><span class="muted">'+desc+'</span>'+extra+'<label>Reminder time<input type="time" data-r18-time="'+k+'" value="'+String(s[k+'_time']||'17:00').slice(0,5)+'"></label></div>';
    const weekday='<label>Reminder day<select data-r18-weekday>'+days.map((d,i)=>'<option value="'+i+'" '+(Number(s.weekly_weekday??0)===i?'selected':'')+'>'+d+'</option>').join('')+'</select></label>';
    return '<div class="fq-custom-reminders"><p class="muted">Send me a phone reminder when quests assigned to me are still unfinished.</p>'+row('daily','Daily quests','At my chosen time if today’s Daily quests are unfinished.')+row('weekly','Weekly quests','On my chosen day and time if Weekly quests are unfinished.',weekday)+row('monthly','Monthly quests','At my chosen time on the due date if unfinished.')+row('one_off','One-Off quests','At my chosen time on the due date if unfinished.')+'<div class="action-row"><button type="button" class="primary" data-action="r18-save">Save Reminders</button></div></div>';
  }
  function build(){
    const d=document.getElementById('profileDialog'),picker=document.getElementById('cosmeticPicker');if(!d?.open||!picker)return;
    // Remove every earlier tab strip injected by profile/customization patches.
    d.querySelectorAll('.fq-customize-tabs,.profile-customize-tabs,.profile-cosmetic-tabs').forEach(n=>n.remove());
    const groups=[...picker.querySelectorAll('.profile-cosmetic-group')];
    // Keep the existing picker groups as the content source, but one nav owns visibility.
    groups.forEach((g,i)=>{g.dataset.r18Pane=['avatar','background','confetti'][i]||'';g.style.display=tab===g.dataset.r18Pane?'':'none';});
    let nav=d.querySelector('#fqCustomizeTabs231018');
    if(!nav){nav=document.createElement('div');nav.id='fqCustomizeTabs231018';nav.className='tabs fq-customize-tabs-231018';picker.before(nav);}
    nav.innerHTML=keys.map(k=>'<button type="button" class="ghost '+(tab===k?'active':'')+'" data-r18-tab="'+k+'">'+labels[k]+'</button>').join('');
    let pane=d.querySelector('#fqReminderPane231018');if(!pane){pane=document.createElement('div');pane.id='fqReminderPane231018';picker.after(pane);}
    pane.hidden=tab!=='reminders';pane.innerHTML=tab==='reminders'?reminderHTML():'';
    picker.hidden=tab==='reminders';
    const preview=document.getElementById('profileCosmeticPreview');if(preview)preview.hidden=tab==='reminders';
  }
  document.addEventListener('click',async e=>{
    const open=e.target.closest?.('[data-action="profile-open"]');
    if(open){tab='avatar';setTimeout(async()=>{await loadReminderSettings231018();build();},40);}
    const t=e.target.closest?.('[data-r18-tab]');if(t){e.preventDefault();e.stopImmediatePropagation();tab=t.dataset.r18Tab;build();return;}
    const save=e.target.closest?.('[data-action="r18-save"]');if(save){
      e.preventDefault();e.stopImmediatePropagation();
      const on=k=>!!document.querySelector('[data-r18-on="'+k+'"]')?.checked,val=k=>document.querySelector('[data-r18-time="'+k+'"]')?.value||'17:00';
      const args={p_daily_enabled:on('daily'),p_daily_time:val('daily'),p_weekly_enabled:on('weekly'),p_weekly_weekday:Number(document.querySelector('[data-r18-weekday]')?.value||0),p_weekly_time:val('weekly'),p_monthly_enabled:on('monthly'),p_monthly_time:val('monthly'),p_one_off_enabled:on('one_off'),p_one_off_time:val('one_off')};
      const {data,error}=await window.FQAuth.client.rpc('save_my_chore_reminder_settings',args);if(error){toast(error.message);return}state.reminderSettings02310=data||args;toast('Reminder settings saved.');build();return;
    }
  },true);
  const obs=new MutationObserver(()=>{const d=document.getElementById('profileDialog');if(d?.open&&!d.querySelector('#fqCustomizeTabs231018'))build();});obs.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
})();
