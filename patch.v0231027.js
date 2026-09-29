/* Family Quest v0.23.10.31 — equipped background across player-facing cards */
(function(){
  const BUILD='v0.23.10.31';
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