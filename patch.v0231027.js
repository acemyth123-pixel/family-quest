/* Family Quest v0.23.10.27 — equipped profile background on Home cards */
(function(){
  const BUILD='v0.23.10.27';
  function clearBgClasses(el){
    if(!el)return;
    [...el.classList].filter(c=>c.startsWith('bg-')).forEach(c=>el.classList.remove(c));
  }
  function themeCard(el,bg){
    if(!el)return;
    clearBgClasses(el);
    el.classList.add('fq-home-themed-card','bg-'+bg);
  }
  function applyHomeBackgrounds0231027(){
    if(state?.view!=='home')return;
    const u=currentUser?.();
    if(!u)return;
    const bg=String(u.backgroundId||'plain-background');

    // Main player/XP card.
    themeCard(document.querySelector('#view > .card'),bg);

    // Reward Points card nested inside the player hero.
    themeCard(document.querySelector('#view > .card .profile-hero > .card.stat'),bg);

    // Current Streak / Open Quests / Notifications / Admin Queue.
    document.querySelectorAll('#view > .grid.cards-4 > .card').forEach(card=>themeCard(card,bg));

    // Larger Home content cards such as Upcoming. Up Next may be removed by the
    // existing Home cleanup before this runs; any remaining direct grid card is themed.
    document.querySelectorAll('#view > .grid:not(.cards-4) > .card').forEach(card=>themeCard(card,bg));
  }

  const priorRender=render;
  render=function(){
    priorRender();
    queueMicrotask(applyHomeBackgrounds0231027);
  };

  window.FQApplyHomeBackgrounds=applyHomeBackgrounds0231027;
  window.addEventListener('load',()=>setTimeout(applyHomeBackgrounds0231027,550));

  const badge=document.getElementById('buildBadge');
  if(badge)badge.textContent=BUILD;
})();