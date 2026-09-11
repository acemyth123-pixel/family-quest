/* Family Quest v0.23.8.3 — consolidated monthly bills + Admin tabs + profile header */
(function(){
  const BUILD='v0.23.8.3';
  state.adminMainTab02383=state.adminMainTab02383||'chore';
  state.adminChoreTab02383=state.adminChoreTab02383||'Daily';
  state.adminAchievementTab02383=state.adminAchievementTab02383||'Visible';

  function setBadge(){
    const b=document.getElementById('buildBadge');
    if(b) b.textContent=BUILD;
  }

  /* ---- Monthly bill data ---- */
  const priorChoreLoader=window.FQLoaders?.chores;
  async function loadChores02383(){
    if(priorChoreLoader) await priorChoreLoader();
    if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id)) return;
    const {data,error}=await window.FQAuth.client.from('chore_definitions')
      .select('id,amount_due_cents,amount_due_note')
      .eq('household_id',window.FQAuth.profile.household_id);
    if(error) return;
    const map=new Map((data||[]).map(x=>[String(x.id),x]));
    (state.chores||[]).forEach(c=>{
      const row=map.get(String(c.definitionId||c.id));
      c.amountDueCents=row?.amount_due_cents??null;
      c.amountDueNote=row?.amount_due_note||'';
    });
  }
  if(window.FQLoaders){window.FQLoaders.chores=loadChores02383;loadRealChores=loadChores02383;}

  const priorChoreCard=choreCard;
  choreCard=function(c){
    let html=priorChoreCard(c);
    if(String(c.type)==='Monthly'&&c.amountDueCents!=null){
      const amount=(Number(c.amountDueCents)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
      const box=`<div class="bill-due-box"><span>💵 AMOUNT DUE</span><strong>$${amount}</strong>${c.amountDueNote?`<small>${esc(c.amountDueNote)}</small>`:''}</div>`;
      html=html.replace('<div class="quest-meta">',box+'<div class="quest-meta">');
    }
    return html;
  };

  const priorEditor=openAdminEditor;
  openAdminEditor=function(type,id=null){
    priorEditor(type,id);
    if(type!=='chore') return;
    const o=id?(state.chores||[]).find(x=>String(x.id)===String(id)):null;
    const body=document.querySelector('#adminEditorBody .form-grid');
    const typeSel=document.getElementById('aeType');
    if(!body||document.getElementById('aeAmountDue')) return;
    body.insertAdjacentHTML('beforeend',`<div class="full monthly-bill-fields" id="monthlyBillFields02383"><h4>💵 Monthly Bill Details <span class="muted">(optional)</span></h4><div class="grid two"><label>Amount Due ($)<input id="aeAmountDue" type="number" min="0" step="0.01" placeholder="e.g. 1250.00" value="${o?.amountDueCents!=null?(Number(o.amountDueCents)/100).toFixed(2):''}"></label><label>Amount Note<input id="aeAmountNote" placeholder="e.g. Rent, Electric, Minimum payment" value="${esc(o?.amountDueNote||'')}"></label></div></div>`);
    const sync=()=>{const f=document.getElementById('monthlyBillFields02383');if(f)f.hidden=typeSel?.value!=='Monthly';};
    typeSel?.addEventListener('change',sync);sync();
  };

  const form=document.getElementById('adminEditorForm');
  form?.addEventListener('submit',async e=>{
    if(state.editing?.type!=='chore'||!realChoresEnabled()) return;
    e.preventDefault();e.stopImmediatePropagation();
    const o=state.editing.id?(state.chores||[]).find(x=>String(x.id)===String(state.editing.id)):null;
    const type=document.getElementById('aeType')?.value||'Daily';
    const ids=[...document.querySelectorAll('input[name="aeAssignees"]:checked')].map(x=>x.value);
    const due=(type==='Monthly'||type==='One-Off')?(document.getElementById('aeDue')?.value||null):null;
    const amountInput=document.getElementById('aeAmountDue');
    const amount=type==='Monthly'&&amountInput&&amountInput.value!==''?Math.round(Number(amountInput.value)*100):null;
    const {error}=await window.FQAuth.client.rpc('save_chore_definition_v0238',{
      p_id:o?.definitionId||o?.id||null,
      p_title:document.getElementById('aeTitle')?.value.trim()||'',
      p_category:o?.category||'Other',
      p_frequency:frequencyValue(type),
      p_assigned_user_ids:ids,
      p_xp:Number(document.getElementById('aeXp')?.value||0),
      p_bounty_cents:Math.round(Number(document.getElementById('aeBounty')?.value||0)*100),
      p_due_at:due,
      p_expectations:(document.getElementById('aeDetails')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),
      p_active:o?.active!==false,
      p_allow_multiple:document.getElementById('aeMultiple')?.value==='true',
      p_failure_penalty_rp:Number(document.getElementById('aePenalty')?.value||0),
      p_amount_due_cents:amount,
      p_amount_due_note:type==='Monthly'?(document.getElementById('aeAmountNote')?.value||null):null
    });
    if(error){toast(error.message);return;}
    document.getElementById('adminEditor')?.close();toast('Chore saved.');
    await loadChores02383();render();
  },true);

  /* ---- Admin catalog tabs ---- */
  function sectionName(section){return (section?.querySelector('h3')?.textContent||'').trim();}
  function managementCard(){
    const root=document.getElementById('view');if(!root)return null;
    return [...root.querySelectorAll('.card')].find(card=>{
      const names=[...card.querySelectorAll('.section-title')].map(sectionName);
      return names.includes('Chores')&&names.includes('Rewards')&&names.includes('Achievements');
    })||null;
  }
  function section(card,name){return [...card.querySelectorAll('.section-title')].find(x=>sectionName(x)===name)||null;}
  function setShown(el,show){if(!el)return;el.hidden=!show;el.style.display=show?'':'none';}

  function applyAdminTabs(){
    if(state.view!=='admin')return;
    const card=managementCard();if(!card)return;
    card.querySelectorAll('.admin-catalog-tabs,.admin-catalog-tabs-v236,.admin-catalog-tabs-v238,.admin-main-tabs-02382,.admin-subtabs-0238,.admin-subtabs-02382,.admin-main-tabs-02383,.admin-subtabs-02383').forEach(x=>x.remove());

    const top=document.createElement('div');top.className='tabs admin-main-tabs-02383';
    top.innerHTML=[['chore','⚔️ Chores'],['reward','🎁 Rewards'],['achievement','🏆 Achievements'],['cosmetic','🎨 Cosmetic Pricing']]
      .map(([id,label])=>`<button type="button" class="ghost ${state.adminMainTab02383===id?'active':''}" data-admin-main-02383="${id}">${label}</button>`).join('');
    card.prepend(top);

    const defs=[['chore','Chores'],['reward','Rewards'],['cosmetic','Cosmetic Shop Pricing'],['achievement','Achievements']];
    defs.forEach(([id,name])=>{
      const head=section(card,name),list=head?.nextElementSibling;
      const show=state.adminMainTab02383===id;
      setShown(head,show);setShown(list,show);
    });

    const actions=[...card.children].find(x=>x.classList?.contains('action-row'));
    if(actions){
      [...actions.children].forEach(btn=>{
        const t=btn.dataset.type;
        btn.style.display=(t==='chore'&&state.adminMainTab02383==='chore')||(t==='achievement'&&state.adminMainTab02383==='achievement')?'':'none';
      });
    }

    if(state.adminMainTab02383==='chore'){
      const head=section(card,'Chores');const list=head?.nextElementSibling;
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02383';
        sub.innerHTML=['Daily','Weekly','Monthly','Seasonal'].map(x=>`<button type="button" class="ghost ${state.adminChoreTab02383===x?'active':''}" data-admin-chore-02383="${x}">${x}</button>`).join('');
        head.after(sub);
        [...list.children].forEach((row,i)=>{const item=(state.chores||[])[i];const show=!!item&&String(item.type)===state.adminChoreTab02383;setShown(row,show);});
      }
    }

    if(state.adminMainTab02383==='achievement'){
      const head=section(card,'Achievements');const list=head?.nextElementSibling;
      if(head&&list){
        const sub=document.createElement('div');sub.className='tabs admin-subtabs-02383';
        sub.innerHTML=['Visible','Secret'].map(x=>`<button type="button" class="ghost ${state.adminAchievementTab02383===x?'active':''}" data-admin-ach-02383="${x}">${x}</button>`).join('');
        head.after(sub);
        [...list.children].forEach((row,i)=>{const item=(state.achievements||[])[i];const secret=!!(item?.hidden||item?.secret);const show=state.adminAchievementTab02383==='Secret'?secret:!secret;setShown(row,show);});
      }
    }
  }

  /* ---- Player-profile header ---- */
  function moveProfileControls(){
    const top=document.querySelector('.topbar>div:first-child');
    if(!top)return;
    top.querySelectorAll('.profile-top-control-row,.profile-top-control-row-02382,.profile-top-control-row-02383').forEach(x=>x.remove());
    if(state.view!=='profiles'||!state.profilePlayerId)return;
    const shell=document.querySelector('.fq-player-shell');const title=document.getElementById('viewTitle');
    if(!shell||!title)return;
    const back=shell.querySelector('.fq-profile-back,[data-action="profile-back-232"]');
    const custom=shell.querySelector('.fq-profile-customize,[data-action="profile-open"]');
    if(!back&&!custom)return;
    const row=document.createElement('div');row.className='profile-top-control-row-02383';
    if(back)row.appendChild(back);row.appendChild(title);if(custom)row.appendChild(custom);
    top.appendChild(row);
  }

  const priorRender=render;
  render=function(){priorRender();queueMicrotask(()=>{applyAdminTabs();moveProfileControls();setBadge();});};

  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.adminMain02383){e.preventDefault();e.stopImmediatePropagation();state.adminMainTab02383=b.dataset.adminMain02383;applyAdminTabs();}
    else if(b.dataset.adminChore02383){e.preventDefault();e.stopImmediatePropagation();state.adminChoreTab02383=b.dataset.adminChore02383;applyAdminTabs();}
    else if(b.dataset.adminAch02383){e.preventDefault();e.stopImmediatePropagation();state.adminAchievementTab02383=b.dataset.adminAch02383;applyAdminTabs();}
  },true);

  window.addEventListener('load',()=>setTimeout(()=>{applyAdminTabs();moveProfileControls();setBadge();},250));
  setBadge();
})();