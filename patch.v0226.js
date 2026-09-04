/* Family Quest v0.22.6 — profile + quest tabs and stronger themed frames */
state.profileCosmeticTab=state.profileCosmeticTab||'avatar';
state.questTab=state.questTab||'Daily';

renderCosmeticPicker=function(){
 const u=currentUser(),owned=new Set(u.cosmeticUnlocks||[]),tab=state.profileCosmeticTab||'avatar';
 const defs={avatar:['profileAvatarId','Avatar','🧍'],frame:['profileFrameId','Frame','🖼️'],background:['profileBackgroundId','Background','🌌'],confetti:['profileConfettiId','Confetti','🎉']};
 const [input,label,icon]=defs[tab]||defs.avatar;
 const selected=$('#'+input).value;
 const items=state.cosmeticCatalog.filter(x=>(x.type||'avatar')===tab&&(x.acquisition_method==='default'||owned.has(x.id)));
 $('#cosmeticPicker').innerHTML=`
  <div class="tabs profile-cosmetic-tabs">
   ${Object.entries(defs).map(([id,[,name,ico]])=>`<button type="button" class="ghost ${tab===id?'active':''}" data-profile-cosmetic-tab="${id}">${ico} ${name}</button>`).join('')}
  </div>
  <div class="profile-cosmetic-tab-panel">
   <div class="section-title"><h4>${icon} ${label}</h4><span class="muted">${items.length} unlocked</span></div>
   <div class="sprite-picker">${items.map(x=>`<button type="button" class="sprite-choice ${selected===x.id?'selected':''}" data-action="profile-cosmetic-select" data-input="${input}" data-cosmetic="${esc(x.id)}"><span class="sprite-choice-icon">${cosmeticPreview(x)}</span><strong>${esc(x.name)}</strong></button>`).join('')||'<div class="empty">No unlocked cosmetics in this category yet.</div>'}</div>
  </div>`;
 const preview=$('#profileCosmeticPreview');
 if(preview){const fake={...u,avatarId:$('#profileAvatarId').value,frameId:$('#profileFrameId').value,backgroundId:$('#profileBackgroundId').value};preview.innerHTML=profileShowcase(fake,'profile-dialog-preview')}
};
renderSpritePicker=function(){renderCosmeticPicker()};

const _openProfile0226=openProfile;
openProfile=function(){state.profileCosmeticTab='avatar';_openProfile0226()};

renderChores=function(){
 setHeader('QUEST LOG','Household Quests');
 const baseTabs=['Daily','Weekly','One-Off'];
 if(state.chores.some(c=>c.type==='Seasonal'&&c.active!==false&&!c.isGroceryRun))baseTabs.push('Seasonal');
 if(!baseTabs.includes(state.questTab))state.questTab=baseTabs[0];
 const list=state.chores.filter(c=>c.type===state.questTab&&c.active!==false&&!c.isGroceryRun);
 view.innerHTML=`
  ${isAdmin()?'<div class="section-title"><div></div><button class="primary" data-action="admin-create" data-type="chore">+ Create Chore</button></div>':''}
  <div class="tabs quest-type-tabs">${baseTabs.map(t=>`<button class="ghost ${state.questTab===t?'active':''}" data-quest-tab="${t}">${t==='Daily'?'☀️':t==='Weekly'?'📆':t==='One-Off'?'⚡':'🍂'} ${t}</button>`).join('')}</div>
  <div class="card quest-tab-card"><div class="section-title"><h3>${state.questTab}</h3><span class="muted">${list.length} quest${list.length===1?'':'s'}</span></div><div class="quest-list">${list.map(choreCard).join('')||'<div class="empty">No active quests in this category.</div>'}</div></div>`;
};

document.addEventListener('click',e=>{
 const p=e.target.closest('[data-profile-cosmetic-tab]');
 if(p){e.preventDefault();e.stopImmediatePropagation();state.profileCosmeticTab=p.dataset.profileCosmeticTab;renderCosmeticPicker();return}
 const q=e.target.closest('[data-quest-tab]');
 if(q){e.preventDefault();e.stopImmediatePropagation();state.questTab=q.dataset.questTab;render();return}
},true);
