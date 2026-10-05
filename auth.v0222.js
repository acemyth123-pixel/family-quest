
(() => {
  const SUPABASE_URL = 'https://ooctpgofcrysnpwunbuw.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_LigLVxhoROMMUDnnwYC3TQ_YCvYHjKf';
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  let session = null, profile = null, household = null, startedApp = false;

  const $a = s => document.querySelector(s);
  const sections = ['authSignedOut','authNoFamily','authPending','authRejected'];
  function show(id, message=''){
    sections.forEach(x => $a('#'+x).hidden = x!==id);
    $a('#authMessage').textContent = message;
    $a('#authMessage').hidden = !message;
    $a('#authGate').hidden = false;
    $a('#appShell').hidden = true;
  }
  function msg(t){ $a('#authMessage').hidden=false; $a('#authMessage').textContent=t; }
  function errText(e){ return e?.message || String(e || 'Something went wrong.'); }

  async function getProfile(){
    if(!session?.user) return null;
    const {data,error}=await client.from('profiles')
      .select('user_id,household_id,display_name,role,active,membership_status,title,selected_sprite_id')
      .eq('user_id',session.user.id).maybeSingle();
    if(error) throw error;
    return data;
  }
  async function getHousehold(id){
    if(!id)return null;
    const {data,error}=await client.from('households')
      .select('id,name,invite_code,current_season_year').eq('id',id).maybeSingle();
    if(error) throw error;
    return data;
  }
  async function loadStats(){
    if(!profile?.user_id || !household)return {season_xp:0,reward_points:0,current_streak:0,best_streak:0,lifetime_xp:0};
    const [{data:s},{data:l}] = await Promise.all([
      client.from('season_stats').select('*').eq('user_id',profile.user_id).eq('season_year',household.current_season_year).maybeSingle(),
      client.from('lifetime_stats').select('*').eq('user_id',profile.user_id).maybeSingle()
    ]);
    return {...(s||{}),...(l||{})};
  }
  async function refreshIdentity(){
    profile=await getProfile(); household=profile?.household_id?await getHousehold(profile.household_id):null;
    if(!profile)return;
    const stats=await loadStats();
    const u=state.users.find(x=>x.id===profile.user_id||x.name===profile.display_name);
    if(u){u.xp=stats.season_xp||0;u.rp=stats.reward_points||0;u.streak=stats.current_streak||0;u.bestStreak=stats.best_streak||0;u.lifetime=stats.lifetime_xp||0;}
  }
  async function enterApp(){
    const stats=await loadStats();
    const real={
      id:profile.user_id,name:profile.display_name,
      role:profile.role==='admin'?'Admin Parent':'Family Member',
      active:profile.active,title:profile.title||'New Adventurer',
      sprite:profile.selected_sprite_id||'dog',
      xp:stats.season_xp||0,rp:stats.reward_points||0,
      streak:stats.current_streak||0,bestStreak:stats.best_streak||0,
      lifetime:stats.lifetime_xp||0
    };
    const existing=state.users.findIndex(u=>u.id===real.id || u.name===real.name);
    if(existing>=0) state.users[existing]={...state.users[existing],...real};
    else state.users.unshift(real);
    state.currentUser=real.name;
    state.achievementTarget=real.name;
    state.previewUser=null;
    state.seasonYear=household.current_season_year || new Date().getFullYear();

    $a('#authGate').hidden=true;
    $a('#appShell').hidden=false;
    
    if(typeof populateUsers==='function')populateUsers();
    checkAutomaticSeasonReset();
    startedApp=true;
    if(window.FQLoaders?.members)await window.FQLoaders.members();
    if(window.FQLoaders?.chores)await window.FQLoaders.chores();
    await refreshIdentity();
    if(window.FQLoaders?.cosmetics)await window.FQLoaders.cosmetics();
    if(window.FQLoaders?.achievements)await window.FQLoaders.achievements();
    if(window.FQLoaders?.rewards)await window.FQLoaders.rewards();
    if(window.FQLoaders?.calendar)await window.FQLoaders.calendar();
    if(window.FQLoaders?.groceries)await window.FQLoaders.groceries();
    if(window.FQLoaders?.notifications)await window.FQLoaders.notifications();
    if(window.FQLoaders?.requests)await window.FQLoaders.requests();
    if(window.FQLoaders?.xpMultipliers)await window.FQLoaders.xpMultipliers();
    render();
  }
  async function route(){
    try{
      profile=await getProfile();
      household=profile?.household_id ? await getHousehold(profile.household_id) : null;
      if(!profile){ show('authNoFamily'); return; }
      if(profile.membership_status==='pending'){
        show('authPending');
        $a('#pendingText').textContent=`Your request to join ${household?.name||'the family'} is waiting for an Admin.`;
        return;
      }
      if(profile.membership_status==='rejected'){ show('authRejected'); return; }
      if(profile.membership_status==='active' && profile.active){ await enterApp(); return; }
      show('authPending','This account is currently inactive.');
    }catch(e){ show('authNoFamily',errText(e)); }
  }
  async function refreshSession(){
    const {data,error}=await client.auth.getSession();
    if(error)throw error;
    session=data.session;
    api.realSession=!!session;
    if(!session){ profile=null;household=null;show('authSignedOut'); return; }
    await route();
  }

  async function signIn(e){
    e.preventDefault(); msg('Signing in…');
    const {error}=await client.auth.signInWithPassword({
      email:$a('#signInEmail').value.trim(),password:$a('#signInPassword').value
    });
    if(error){show('authSignedOut',errText(error));return}
    await refreshSession();
  }
  async function signUp(e){
    e.preventDefault();
    if($a('#signUpPassword').value!==$a('#signUpPassword2').value){msg('Passwords do not match.');return}
    msg('Creating account…');
    const {data,error}=await client.auth.signUp({
      email:$a('#signUpEmail').value.trim(),
      password:$a('#signUpPassword').value,
      options:{emailRedirectTo:'https://acemyth123-pixel.github.io/family-quest/'}
    });
    if(error){show('authSignedOut',errText(error));return}
    if(!data.session){
      show('authSignedOut','No new signed-in account was created. If this email already belongs to Family Quest, use Sign In instead. Otherwise check your email for a confirmation link.');
      return;
    }
    const createdAt=data.user?.created_at?Date.parse(data.user.created_at):0;
    if(!createdAt || Math.abs(Date.now()-createdAt)>120000){
      await client.auth.signOut({scope:'local'}).catch(()=>{});
      session=null;api.realSession=false;
      show('authSignedOut','That email may already have an account. No existing Family Quest membership was changed. Please use Sign In.');
      return;
    }
    session=data.session;api.realSession=true;await route();
  }
  async function createFamily(e){
    e.preventDefault();msg('Creating your family…');
    const {data,error}=await client.rpc('create_family',{
      p_household_name:$a('#createHouseholdName').value.trim(),
      p_display_name:$a('#createDisplayName').value.trim()
    });
    if(error){show('authNoFamily',errText(error));return}
    await route();
  }
  async function joinFamily(e){
    e.preventDefault();msg('Sending join request…');
    const {error}=await client.rpc('join_family',{
      p_invite_code:$a('#joinInviteCode').value.trim(),
      p_display_name:$a('#joinDisplayName').value.trim()
    });
    if(error){show('authNoFamily',errText(error));return}
    await route();
  }
  async function requestPasswordReset(){
    const email=$a('#signInEmail').value.trim();
    if(!email){msg('Enter your email address first, then tap Forgot password.');$a('#signInEmail').focus();return}
    msg('Sending password reset email…');
    const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:'https://acemyth123-pixel.github.io/family-quest/'});
    if(error){show('authSignedOut',errText(error));return}
    show('authSignedOut','If an account exists for that email, a password reset link has been sent. Check your inbox and spam folder.');
    $a('#signInEmail').value=email;
  }
  function showPasswordRecovery(){
    show('authSignedOut');
    $a('#signInForm').hidden=true;$a('#signUpForm').hidden=true;
    let box=document.getElementById('passwordRecoveryForm');
    if(!box){
      box=document.createElement('form');box.id='passwordRecoveryForm';box.className='auth-form';
      box.innerHTML='<h2>Set New Password</h2><p class="muted">Choose a new password for your Family Quest account.</p><label>New Password<input id="recoveryPassword" type="password" autocomplete="new-password" minlength="6" required></label><label>Confirm Password<input id="recoveryPassword2" type="password" autocomplete="new-password" minlength="6" required></label><button class="primary" type="submit">Update Password</button>';
      $a('#authSignedOut').appendChild(box);
      box.addEventListener('submit',async e=>{
        e.preventDefault();
        const p=$a('#recoveryPassword').value,p2=$a('#recoveryPassword2').value;
        if(p!==p2){msg('Passwords do not match.');return}
        msg('Updating password…');
        const {error}=await client.auth.updateUser({password:p});
        if(error){msg(errText(error));return}
        await client.auth.signOut({scope:'local'});
        session=null;api.realSession=false;box.remove();
        $a('#signInForm').hidden=false;$a('#signUpForm').hidden=true;
        show('authSignedOut','Password updated. Sign in with your new password.');
      });
    }
    box.hidden=false;
  }
  async function signOut(){
    await client.auth.signOut({scope:'local'});
    session=null;profile=null;household=null;api.realSession=false;startedApp=false;
    document.getElementById('adminPreviewBanner')?.remove();
    show('authSignedOut','Signed out.');
  }
  async function approve(userId){
    const {error}=await client.rpc('approve_family_member',{p_user_id:userId});
    if(error){toast(errText(error));return}
    toast('Family member approved.');
    await renderMembershipAdmin();
  }
  async function reject(userId){
    if(!confirm('Reject this join request?'))return;
    const {error}=await client.rpc('reject_family_member',{p_user_id:userId});
    if(error){toast(errText(error));return}
    toast('Join request rejected.');
    await renderMembershipAdmin();
  }
  async function manageMember(userId,action,displayName=null){
    const labels={promote_admin:'Promote to Admin',demote_member:'Change to Family Member',deactivate:'Deactivate',reactivate:'Reactivate'};
    if(action!=='rename' && !confirm(`${labels[action]||action}?`))return;
    const {error}=await client.rpc('manage_family_member',{p_user_id:userId,p_action:action,p_display_name:displayName});
    if(error){toast(errText(error));return}
    toast(action==='rename'?'Name updated.':'Family member updated.');
    await renderMembershipAdmin(true);
  }
  async function shareFamilyQuest(){
    if(!profile || profile.role!=='admin')return;
    const code=household?.invite_code||'';
    const url='https://acemyth123-pixel.github.io/family-quest/';
    const familyName=household?.name||'our family';
    const shareData={
      title:'Join Family Quest',
      text:`Join ${familyName} on Family Quest!\n\nFamily code: ${code}\n\nOpen Family Quest and create an account, then choose Join Family and enter the code.`,
      url
    };
    if(navigator.share){
      try{await navigator.share(shareData);return}catch(e){if(e?.name==='AbortError')return}
    }
    const fallback=`${shareData.text}\n\n${url}`;
    try{await navigator.clipboard.writeText(fallback);toast('Family Quest invite copied.');}
    catch(e){window.prompt('Copy this Family Quest invite:',fallback);}
  }
  async function renderMembershipAdmin(force=false){
    if(!profile || profile.role!=='admin' || state.view!=='admin')return;
    const view=document.getElementById('view'); if(!view)return;
    document.getElementById('realMembershipPanel')?.remove();
    const {data:members,error}=await client.from('profiles')
      .select('user_id,display_name,role,active,membership_status,created_at')
      .eq('household_id',profile.household_id).order('created_at');
    if(error)return;
    const pending=(members||[]).filter(m=>m.membership_status==='pending');
    const active=(members||[]).filter(m=>m.membership_status==='active');
    const panel=document.createElement('div');
    panel.id='realMembershipPanel';panel.className='card admin-section backend-panel';
    panel.innerHTML=`
      <div class="section-title"><h3>🔐 Household Members</h3><span class="chip good">Live Backend</span></div>
      <div class="invite-code-box"><span>Family Invite Code</span><strong>${household?.invite_code||'—'}</strong><small>New family members create their own account and request access with this code.</small><div class="action-row" style="margin-top:14px"><button type="button" class="primary" data-real-share-family>📤 Share Family Quest</button></div></div>
      <h4>Pending Join Requests</h4>
      <div class="simple-list">${pending.length?pending.map(m=>`
        <div class="simple-item row"><div><strong>${escapeHtml(m.display_name)}</strong><p>Waiting for approval</p></div>
        <div class="action-row"><button class="good" data-real-approve="${m.user_id}">Approve</button><button class="bad" data-real-reject="${m.user_id}">Reject</button></div></div>`).join(''):'<div class="empty">No pending join requests.</div>'}</div>
      <h4 style="margin-top:16px">Family Accounts</h4>
      <div class="simple-list">${active.map(m=>`
        <div class="simple-item member-manage-row">
          <div><strong>${escapeHtml(m.display_name)} ${m.user_id===profile.user_id?'<span class="chip">You</span>':''}</strong>
          <p>${m.role==='admin'?'Admin':'Family Member'} · ${m.active?'Active':'Deactivated'}</p></div>
          <div class="action-row">
            <button class="ghost" data-real-rename="${m.user_id}" data-real-name="${escapeHtml(m.display_name)}">Rename</button>
            ${m.role==='admin'?`<button class="ghost" data-real-member="${m.user_id}">Make Member</button>`:`<button class="primary" data-real-admin="${m.user_id}">Make Admin</button>`}
            ${m.active?`<button class="bad" data-real-deactivate="${m.user_id}">Deactivate</button>`:`<button class="good" data-real-reactivate="${m.user_id}">Reactivate</button>`}
          </div>
        </div>`).join('')}</div>`;
    view.prepend(panel);
  }
  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  async function start(){
    $a('#signInForm').addEventListener('submit',signIn);
    $a('#forgotPasswordButton')?.addEventListener('click',requestPasswordReset);
    $a('#signUpForm').addEventListener('submit',signUp);
    $a('#createFamilyForm').addEventListener('submit',createFamily);
    $a('#joinFamilyForm').addEventListener('submit',joinFamily);
    document.addEventListener('click',async e=>{
      const tab=e.target.closest('[data-auth-tab]')?.dataset.authTab;
      if(tab){
        $a('#signInForm').hidden=tab!=='signin';$a('#signUpForm').hidden=tab!=='signup';
        document.querySelectorAll('[data-auth-tab]').forEach(b=>b.className=b.dataset.authTab===tab?'primary':'ghost');
        return;
      }
      const action=e.target.closest('[data-auth-action]')?.dataset.authAction;
      if(action==='signout'){await signOut();return}
      if(action==='refresh'){await refreshSession();return}
      if(action==='retry-join'){show('authNoFamily');return}
      const sh=e.target.closest('[data-real-share-family]');if(sh){await shareFamilyQuest();return}
      const a=e.target.closest('[data-real-approve]');if(a){await approve(a.dataset.realApprove);return}
      const r=e.target.closest('[data-real-reject]');if(r){await reject(r.dataset.realReject);return}
      const rn=e.target.closest('[data-real-rename]');if(rn){const n=prompt('Display name:',rn.dataset.realName||'');if(n&&n.trim())await manageMember(rn.dataset.realRename,'rename',n.trim());return}
      const ad=e.target.closest('[data-real-admin]');if(ad){await manageMember(ad.dataset.realAdmin,'promote_admin');return}
      const mm=e.target.closest('[data-real-member]');if(mm){await manageMember(mm.dataset.realMember,'demote_member');return}
      const de=e.target.closest('[data-real-deactivate]');if(de){await manageMember(de.dataset.realDeactivate,'deactivate');return}
      const re=e.target.closest('[data-real-reactivate]');if(re){await manageMember(re.dataset.realReactivate,'reactivate');return}
    });
    client.auth.onAuthStateChange((event,newSession)=>{
      session=newSession;api.realSession=!!newSession;
      if(event==='PASSWORD_RECOVERY')showPasswordRecovery();
    });
    await refreshSession();
  }
  const api={start,renderMembershipAdmin,refreshIdentity,realSession:false,client,get profile(){return profile},get household(){return household}};
  window.FQAuth=api;
})();
