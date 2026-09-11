/* Family Quest v0.23.8.6 compatibility — monthly bills + profile only.
   Admin tabs are intentionally owned ONLY by patch.v02384.js. */
(function(){
  const priorChoreLoader=window.FQLoaders?.chores;
  async function loadChoresCompat(){
    if(priorChoreLoader) await priorChoreLoader();
    if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id)) return;
    const {data,error}=await window.FQAuth.client.from('chore_definitions')
      .select('id,amount_due_cents,amount_due_note')
      .eq('household_id',window.FQAuth.profile.household_id);
    if(error)return;
    const map=new Map((data||[]).map(x=>[String(x.id),x]));
    (state.chores||[]).forEach(c=>{
      const row=map.get(String(c.definitionId||c.id));
      c.amountDueCents=row?.amount_due_cents??null;
      c.amountDueNote=row?.amount_due_note||'';
    });
  }
  if(window.FQLoaders){window.FQLoaders.chores=loadChoresCompat;loadRealChores=loadChoresCompat;}

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
    if(type!=='chore')return;
    const o=id?(state.chores||[]).find(x=>String(x.id)===String(id)):null;
    const body=document.querySelector('#adminEditorBody .form-grid');
    const typeSel=document.getElementById('aeType');
    if(!body||document.getElementById('aeAmountDue'))return;
    body.insertAdjacentHTML('beforeend',`<div class="full monthly-bill-fields" id="monthlyBillFieldsCompat"><h4>💵 Monthly Bill Details <span class="muted">(optional)</span></h4><div class="grid two"><label>Amount Due ($)<input id="aeAmountDue" type="number" min="0" step="0.01" placeholder="e.g. 1250.00" value="${o?.amountDueCents!=null?(Number(o.amountDueCents)/100).toFixed(2):''}"></label><label>Amount Note<input id="aeAmountNote" placeholder="e.g. Rent, Electric, Minimum payment" value="${esc(o?.amountDueNote||'')}"></label></div></div>`);
    const sync=()=>{const f=document.getElementById('monthlyBillFieldsCompat');if(f)f.hidden=typeSel?.value!=='Monthly';};
    typeSel?.addEventListener('change',sync);sync();
  };

  const form=document.getElementById('adminEditorForm');
  form?.addEventListener('submit',async e=>{
    if(state.editing?.type!=='chore'||!realChoresEnabled())return;
    e.preventDefault();e.stopImmediatePropagation();
    const o=state.editing.id?(state.chores||[]).find(x=>String(x.id)===String(state.editing.id)):null;
    const type=document.getElementById('aeType')?.value||'Daily';
    const ids=[...document.querySelectorAll('input[name="aeAssignees"]:checked')].map(x=>x.value);
    const due=(type==='Monthly'||type==='One-Off')?(document.getElementById('aeDue')?.value||null):null;
    const amountInput=document.getElementById('aeAmountDue');
    const amount=type==='Monthly'&&amountInput&&amountInput.value!==''?Math.round(Number(amountInput.value)*100):null;
    const {error}=await window.FQAuth.client.rpc('save_chore_definition_v0238',{
      p_id:o?.definitionId||o?.id||null,p_title:document.getElementById('aeTitle')?.value.trim()||'',p_category:o?.category||'Other',p_frequency:frequencyValue(type),p_assigned_user_ids:ids,p_xp:Number(document.getElementById('aeXp')?.value||0),p_bounty_cents:Math.round(Number(document.getElementById('aeBounty')?.value||0)*100),p_due_at:due,p_expectations:(document.getElementById('aeDetails')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),p_active:o?.active!==false,p_allow_multiple:document.getElementById('aeMultiple')?.value==='true',p_failure_penalty_rp:Number(document.getElementById('aePenalty')?.value||0),p_amount_due_cents:amount,p_amount_due_note:type==='Monthly'?(document.getElementById('aeAmountNote')?.value||null):null
    });
    if(error){toast(error.message);return;}
    document.getElementById('adminEditor')?.close();toast('Chore saved.');await loadChoresCompat();render();
  },true);

  function moveProfile(){
    if(state.view!=='profiles'||!state.profilePlayerId)return;
    const shell=document.querySelector('.fq-player-shell'),top=document.querySelector('.topbar>div:first-child'),title=document.getElementById('viewTitle');
    if(!shell||!top||!title)return;
    top.querySelectorAll('.profile-top-control-row,.profile-top-control-row-02382,.profile-top-control-row-02383').forEach(x=>x.remove());
    const back=shell.querySelector('.fq-profile-back,[data-action="profile-back-232"]');
    const custom=shell.querySelector('.fq-profile-customize,[data-action="profile-open"]');
    if(!back&&!custom)return;
    const row=document.createElement('div');row.className='profile-top-control-row-02382';
    if(back)row.appendChild(back);row.appendChild(title);if(custom)row.appendChild(custom);top.appendChild(row);
  }
  const prevRender=render;render=function(){prevRender();queueMicrotask(moveProfile)};
  window.addEventListener('load',()=>setTimeout(moveProfile,300));
})();