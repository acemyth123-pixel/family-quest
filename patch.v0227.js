/* Family Quest v0.22.7 — equipped profile cosmetics everywhere */
(function(){
  function removePrefixedClasses(el,prefix){[...el.classList].filter(c=>c.startsWith(prefix)).forEach(c=>el.classList.remove(c))}
  function smallShowcase(u,extra=''){const frame=u?.frameId||'plain-frame',bg=u?.backgroundId||'plain-background';return `<div class="profile-showcase profile-showcase-compact bg-${esc(bg)} frame-${esc(frame)} ${extra}">${spriteMarkup(u,'small')}</div>`}
  function mediumShowcase(u,extra=''){const frame=u?.frameId||'plain-frame',bg=u?.backgroundId||'plain-background';return `<div class="profile-showcase profile-showcase-medium bg-${esc(bg)} frame-${esc(frame)} ${extra}">${spriteMarkup(u)}</div>`}
  function applyProfileCosmeticsEverywhere(){
    const me=currentUser?.();if(!me)return;
    const side=document.getElementById('sidebarAvatar');
    if(side){removePrefixedClasses(side,'bg-');removePrefixedClasses(side,'frame-');side.classList.add('profile-showcase','profile-showcase-sidebar',`bg-${me.backgroundId||'plain-background'}`,`frame-${me.frameId||'plain-frame'}`);side.innerHTML=spriteMarkup(me,'small')}
    if(state.view==='home'){
      const hero=document.querySelector('#view .profile-hero'),old=hero?.querySelector(':scope > .sprite-avatar');
      if(old){const wrap=document.createElement('div');wrap.innerHTML=mediumShowcase(me,'home-profile-showcase');old.replaceWith(wrap.firstElementChild)}
    }
    if(state.view==='profiles'){
      const sorted=[...state.users].sort((a,b)=>b.xp-a.xp);
      document.querySelectorAll('#view .leader-row').forEach((row,i)=>{const u=sorted[i],player=row.querySelector('.leader-player'),old=player?.querySelector(':scope > .sprite-avatar');if(!u||!old)return;const wrap=document.createElement('div');wrap.innerHTML=smallShowcase(u,'leader-profile-showcase');old.replaceWith(wrap.firstElementChild)})
    }
  }
  const oldUpdateShell=updateShell;updateShell=function(){oldUpdateShell();applyProfileCosmeticsEverywhere()};
  const oldRender=render;render=function(){oldRender();queueMicrotask(applyProfileCosmeticsEverywhere)};
  window.FQApplyProfileCosmetics=applyProfileCosmeticsEverywhere;
})();
