/* Family Quest v0.23.11.0 — private Personal Goals */
(function(){
 state.personalQuests=state.personalQuests||[];state.personalQuestCompletions=state.personalQuestCompletions||[];
 async function loadPersonalGoals(){
  if(!window.FQAuth?.realSession)return;
  const c=window.FQAuth.client,u=window.FQAuth.profile?.user_id;
  const [q,r]=await Promise.all([c.from('personal_quests').select('*').order('created_at',{ascending:false}),c.from('personal_quest_completions').select('*').order('completed_at',{ascending:false})]);
  if(!q.error)state.personalQuests=q.data||[];if(!r.error)state.personalQuestCompletions=r.data||[];
 }
 function activeGoals(){return (state.personalQuests||[]).filter(q=>q.status==='active')}
 function weekKey(){const d=new Date(),t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+'-'+String(Math.ceil((((t-y)/86400000)+1)/7)).padStart(2,'0')}
 function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
 function progress(q){const rows=(state.personalQuestCompletions||[]).filter(x=>x.quest_id===q.id);if(q.schedule_type==='weekly_target'){const n=rows.filter(x=>x.period_key.startsWith(weekKey())).length;return {n,target:q.weekly_target||1,label:n+' / '+(q.weekly_target||1)+' this week'}}const done=rows.some(x=>x.period_key===todayKey()||x.period_key==='once');return {n:done?1:0,target:1,label:done?'Done today':'Ready for a quick win'}}
 function scheduleLabel(q){if(q.schedule_type==='daily')return 'Daily';if(q.schedule_type==='weekly_target')return (q.weekly_target||1)+'× per week';if(q.schedule_type==='days')return 'Selected days';return q.target_date?'By '+q.target_date:'One time'}
 function homeCard(){
  const goals=activeGoals(),done=goals.reduce((n,q)=>n+(progress(q).n>=progress(q).target?1:0),0),best=goals.reduce((m,q)=>Math.max(m,q.current_streak||0),0);
  return '<div class="card fq-personal-home" data-action="personal-goals-open"><div class="section-title"><h3>🎯 Personal Momentum</h3><span class="chip">'+goals.length+' active</span></div><div class="row"><strong>'+done+' goals on target</strong><span>🔥 '+best+' momentum</span></div><p class="muted">Private goals · Tap to check in</p></div>';
 }
 function injectHome(){if(state.view!=='home')return;const root=document.getElementById('view');if(!root||root.querySelector('.fq-personal-home'))return;root.insertAdjacentHTML('beforeend',homeCard())}
 function renderGoals(){
  setHeader('PERSONAL GOALS','My Momentum');const goals=activeGoals();
  view.innerHTML='<div class="card"><div class="section-title"><div><h3>🎯 Personal Goals</h3><p class="muted">Private commitments to yourself. No penalties, no household overdue status.</p></div><button class="primary" data-action="personal-goal-new">+ New Goal</button></div></div><div class="grid two" style="margin-top:16px">'+goals.map(q=>{const p=progress(q);return '<div class="card"><div class="section-title"><div><h3>'+esc(q.title)+'</h3><span class="muted">'+scheduleLabel(q)+'</span></div><span class="chip">🔥 '+(q.current_streak||0)+'</span></div>'+(q.notes?'<p>'+esc(q.notes)+'</p>':'')+'<div class="xpbar"><i style="width:'+Math.min(100,(p.n/p.target)*100)+'%"></i></div><p class="muted">'+p.label+' · Best '+(q.best_streak||0)+' · '+(q.total_completions||0)+' total</p><div class="action-row"><button class="primary" data-action="personal-goal-complete" data-id="'+q.id+'">✓ Check In</button>'+(q.total_completions>=7?'<button class="ghost" data-action="personal-goal-xp" data-id="'+q.id+'">⭐ Submit XP</button>':'')+'<button class="ghost" data-action="personal-goal-pause" data-id="'+q.id+'">Pause</button></div></div>'}).join('')+'</div>'+(goals.length?'':'<div class="card empty" style="margin-top:16px">No personal goals yet. Start with something small enough to win.</div>');
 }
 function openNew(){
  const title=prompt('What is your personal goal?');if(!title?.trim())return;const kind=prompt('Schedule: one-time, daily, or weekly?','daily')?.toLowerCase();const schedule=kind?.startsWith('week')?'weekly_target':kind?.startsWith('one')?'one_time':'daily';let target=null;if(schedule==='weekly_target')target=Math.max(1,Math.min(14,Number(prompt('How many times per week?','3'))||3));
  window.FQAuth.client.from('personal_quests').insert({household_id:window.FQAuth.profile.household_id,user_id:window.FQAuth.profile.user_id,title:title.trim(),schedule_type:schedule,weekly_target:target}).then(async({error})=>{if(error)return toast(error.message);await loadPersonalGoals();renderGoals()});
 }
 document.addEventListener('click',async e=>{
  const b=e.target.closest?.('[data-action]');if(!b)return;const a=b.dataset.action,id=b.dataset.id;
  if(a==='personal-goals-open'){state.view='personal-goals';renderGoals();return}
  if(a==='personal-goal-new'){openNew();return}
  if(a==='personal-goal-complete'){const {error}=await window.FQAuth.client.rpc('complete_personal_quest',{p_quest_id:id});if(error)return toast(error.message);await loadPersonalGoals();toast('Nice. Momentum kept.');renderGoals();return}
  if(a==='personal-goal-pause'){await window.FQAuth.client.from('personal_quests').update({status:'paused'}).eq('id',id);await loadPersonalGoals();renderGoals();return}
  if(a==='personal-goal-xp'){const {error}=await window.FQAuth.client.rpc('submit_personal_quest_xp',{p_quest_id:id});if(error)return toast(error.message);toast('XP milestone sent to Admin for approval.');return}
 },true);
 const prior=render;render=function(){if(state.view==='personal-goals'){renderGoals();return}prior();queueMicrotask(injectHome)};
 window.FQLoaders=window.FQLoaders||{};window.FQLoaders.personalGoals=loadPersonalGoals;
 window.addEventListener('load',()=>setTimeout(()=>loadPersonalGoals().then(()=>{if(state.view==='home')injectHome()}),650));
})();