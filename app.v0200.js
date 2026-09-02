"use strict";
const state={
 currentUser:'',view:'home',calendarMode:'month',calendarCursor:'',achievementTarget:'',editing:null,rewardDraft:null,editingCalendarId:null,
 users:[],
 realXpMultipliers:[],
 chores:[],
 groceries:[],
 events:[],
 requests:[],
 achievements:[
  {id:1,title:'Clean Sweep',desc:'Complete every assigned chore in a day.',icon:'🧹',unlockedBy:['Adam','Beth','Carl']},
  {id:2,title:'Combo x7',desc:'Maintain a 7-day streak.',icon:'🔥',unlockedBy:['Adam','Beth']},
  {id:3,title:'Dishwasher Main',desc:'Complete dishwasher duty 25 times.',icon:'🍽️',unlockedBy:['Carl']},
  {id:4,title:'Touch Grass',desc:'Complete Cut Grass 10 times.',icon:'🌱',unlockedBy:[]},
  {id:5,title:'Lazy Sack',desc:'Complete absolutely nothing all day.',icon:'🛋️',unlockedBy:['Eileen'],secret:true},
  {id:6,title:"Tomorrow's Problem",desc:'Let 3 chores become overdue.',icon:'⏰',unlockedBy:['Dawn'],secret:true}
 ],
 rewards:[
  {id:1,title:'Pick Dinner',cost:150,desc:'Choose dinner for one available date.',kind:'dinner',active:true},
  {id:2,title:'Streak Shield',cost:175,desc:'Protect one missed day.',kind:'simple',active:true},
  {id:3,title:'Double XP Token',cost:200,desc:'Double XP from one approved chore.',kind:'simple',active:true},
  {id:4,title:'Pass-a-Chore',cost:250,desc:'Pass one assigned chore to another household member.',kind:'pass',active:true},
  {id:5,title:'Chore Skip',cost:300,desc:'Remove one eligible chore.',kind:'chore',active:true},
  {id:6,title:'$5 Reward',cost:500,desc:'Admin-approved cash reward.',kind:'simple',active:true}
 ],
 redemptions:[],
 notifications:[]
};


// v0.7 agreed household catalogs and prototype tracking
state.chores=[];

state.rewards=[
 {id:1,title:'Pick Dinner',cost:300,desc:'Choose dinner and an available date.',kind:'dinner',active:true},
 {id:2,title:'Pass a Chore — Day',cost:250,desc:'Pass one of your chores for one day to another household member.',kind:'pass',active:true},
 {id:3,title:'Pass a Chore — Week',cost:600,desc:'Pass one weekly chore to another household member for that week.',kind:'pass',active:true},
 {id:4,title:'Free Snack Purchase',cost:200,desc:'Choose the snack you want and the date.',kind:'dated-choice',choiceLabel:'Snack Choice',calendarPrefix:'Snack Pick',active:true},
 {id:5,title:'Game Night',cost:300,desc:'Choose the game and the date for family game night.',kind:'dated-choice',choiceLabel:'Game Choice',calendarPrefix:'Game Night',active:true},
 {id:6,title:'Movie Night',cost:300,desc:'Choose the movie and the date for family movie night.',kind:'dated-choice',choiceLabel:'Movie Choice',calendarPrefix:'Movie Night',active:true},
 {id:7,title:'Double XP for the Day',cost:400,desc:'Earn 2× chore XP for one selected day. Cannot combine with Triple XP.',kind:'simple',active:true},
 {id:8,title:'Triple XP for the Day',cost:700,desc:'Earn 3× chore XP for one selected day. Cannot combine with Double XP.',kind:'simple',active:true},
 {id:9,title:'$5 Reward',cost:500,desc:'Admin-approved $5 reward.',kind:'simple',active:true},
 {id:10,title:'Dessert Boss',cost:200,desc:'Choose the dessert or treat and the date.',kind:'dated-choice',choiceLabel:'Dessert / Treat',calendarPrefix:'Dessert Boss',active:true},
 {id:11,title:'Takeout Upgrade',cost:250,desc:'When the family is already ordering takeout, you make the final restaurant choice.',kind:'simple',active:true},
 {id:12,title:'DJ for the Night',cost:200,desc:'Choose the household or car music for the night.',kind:'simple',active:true},
 {id:13,title:'Late Night Pass',cost:300,desc:'Get one extra hour on an eligible Friday or Saturday night.',kind:'simple',active:true},
 {id:14,title:'Pick the Adventure',cost:400,desc:'Choose the family activity or outing and the date.',kind:'dated-choice',choiceLabel:'Adventure / Activity',calendarPrefix:'Family Adventure',active:true},
 {id:15,title:'Breakfast Request',cost:250,desc:'Choose the breakfast and the date.',kind:'dated-choice',choiceLabel:'Breakfast Choice',calendarPrefix:'Breakfast Request',active:true},
 {id:16,title:'Mystery Box',cost:250,desc:'Admin chooses a small surprise reward.',kind:'simple',active:true},
 {id:17,title:'RP Lottery Ticket',cost:50,desc:'Instant 50 RP ticket. Results are immediate XP/RP prizes only — no voucher inventory required.',kind:'lottery',active:true},
 {id:20,title:'Pick the Halloween Movie',cost:250,desc:'Choose the family Halloween movie.',kind:'simple',active:false},
 {id:21,title:'Fall Adventure',cost:400,desc:'Choose a reasonable family fall activity.',kind:'simple',active:false},
 {id:22,title:'Pick the Christmas Movie',cost:250,desc:'Choose the family Christmas movie.',kind:'simple',active:false},
 {id:23,title:'Christmas Treat Pick',cost:200,desc:'Choose a Christmas treat or dessert.',kind:'simple',active:false},
 {id:24,title:"New Year's Movie/Game Pick",cost:250,desc:"Choose the New Year's movie or game.",kind:'simple',active:false},
 {id:25,title:'Summer Adventure',cost:400,desc:'Choose a reasonable family summer activity.',kind:'simple',active:false},
 {id:26,title:'Ice Cream Run',cost:250,desc:'Choose an ice-cream trip.',kind:'simple',active:false},
 {id:27,title:'Birthday VIP',cost:500,desc:'Special birthday choice or activity reward.',kind:'simple',active:false}
];

state.achievements=[
 {id:1,title:'It Begins',desc:'Reach a 3-day streak.',icon:'🌱',unlockedBy:[],secret:false},
 {id:2,title:'On a Roll',desc:'Reach a 7-day streak and earn the first +200 XP streak milestone.',icon:'🔥',unlockedBy:['Adam','Beth'],secret:false},
 {id:3,title:'Still Going',desc:'Reach a 14-day streak.',icon:'🔥',unlockedBy:[],secret:false},
 {id:4,title:'Unstoppable',desc:'Reach a 30-day streak.',icon:'🔥',unlockedBy:[],secret:false},
 {id:5,title:'Seriously?',desc:'Reach a 60-day streak.',icon:'🔥',unlockedBy:[],secret:false},
 {id:6,title:'Touch Grass',desc:'Reach a 100-day streak.',icon:'🌿',unlockedBy:[],secret:false},
 {id:7,title:'No Days Off',desc:'Reach a 365-day streak.',icon:'👑',unlockedBy:[],secret:false},

 {id:10,title:'One-Off Warrior',desc:'Complete 10 One-Off chores.',icon:'⚔️',unlockedBy:[],secret:false},
 {id:11,title:'One-Off Veteran',desc:'Complete 25 One-Off chores.',icon:'⚔️',unlockedBy:[],secret:false},
 {id:12,title:'One-Off Champion',desc:'Complete 50 One-Off chores.',icon:'🏆',unlockedBy:[],secret:false},
 {id:13,title:'Side Quest Addict',desc:'Complete 100 One-Off chores.',icon:'💎',unlockedBy:[],secret:false},

 {id:20,title:'Helping Hand',desc:"Complete someone else's assigned chore.",icon:'🤝',unlockedBy:[],secret:false},
 {id:21,title:'Rescue Mission',desc:"Complete someone else's chore after it becomes overdue.",icon:'🚨',unlockedBy:[],secret:false},
 {id:22,title:'Not All Heroes Wear Capes',desc:'Rescue 10 overdue chores belonging to other people.',icon:'🦸',unlockedBy:[],secret:false},
 {id:23,title:'First Responder',desc:'Rescue overdue chores belonging to 3 different family members.',icon:'🚒',unlockedBy:[],secret:false},
 {id:24,title:"Fine, I'll Do It",desc:"Complete someone else's chore after it has been overdue for 24+ hours.",icon:'💀',unlockedBy:[],secret:true},

 {id:30,title:'Animal House',desc:'Complete every different pet chore at least once.',icon:'🐾',unlockedBy:[],secret:false},
 {id:31,title:'Kitchen Confidential',desc:'Complete every kitchen chore at least once.',icon:'🍽️',unlockedBy:[],secret:false},
 {id:32,title:'Clean Sweep',desc:'Complete every cleaning-category chore at least once.',icon:'🧹',unlockedBy:[],secret:false},
 {id:33,title:'Groundskeeper',desc:'Complete Cut Grass and Weed Whack.',icon:'🌿',unlockedBy:[],secret:false},
 {id:34,title:'Pool Boy',desc:'Vacuum the pool 5 times.',icon:'🏊',unlockedBy:[],secret:false},
 {id:35,title:'Laundry Legend',desc:'Complete Laundry 10 times.',icon:'🧺',unlockedBy:[],secret:false},
 {id:36,title:'Porcelain Throne',desc:'Clean both bathrooms at least once.',icon:'🚽',unlockedBy:[],secret:false},
 {id:37,title:'Litterally the Best',desc:'Complete both litter-box chores in the same day.',icon:'🐈',unlockedBy:[],secret:false},
 {id:38,title:"Who's a Good Human?",desc:'Feed Dogs and Clean Dog Water Bowl in the same day.',icon:'🐶',unlockedBy:[],secret:false},
 {id:39,title:'Dishwasher Main',desc:'Complete the dishwasher chore 25 times.',icon:'🍽️',unlockedBy:[],secret:false},
 {id:40,title:'Floor Manager',desc:'Complete every vacuuming chore at least once.',icon:'🧹',unlockedBy:[],secret:false},
 {id:41,title:'Whole House Hero',desc:'Complete at least one chore from every household chore category.',icon:'🏠',unlockedBy:[],secret:false},

 {id:50,title:'Speedrun',desc:'Complete an assigned chore shortly after it becomes available.',icon:'⚡',unlockedBy:[],secret:true},
 {id:51,title:'I Was Getting To It',desc:'Complete a chore shortly before it becomes overdue.',icon:'👀',unlockedBy:[],secret:true},
 {id:52,title:'The Streak Is Dead',desc:'Lose a streak of 30 days or more.',icon:'💀',unlockedBy:[],secret:true},
 {id:53,title:"Tomorrow's Problem",desc:'Complete a chore after it has become overdue.',icon:'🐌',unlockedBy:[],secret:true},
 {id:54,title:'Nobody Asked You To Do That',desc:'Claim and complete an unassigned chore before anyone is assigned to it.',icon:'🧽',unlockedBy:[],secret:true},
 {id:55,title:'Overachiever',desc:'Complete 5 approved chores in one day.',icon:'🎯',unlockedBy:[],secret:false},
 {id:56,title:'Absolute Menace',desc:'Complete 10 approved chores in one day.',icon:'🔥',unlockedBy:[],secret:false},
 {id:57,title:'The Cleaner',desc:'Complete chores belonging to 3 different people in the same week.',icon:'🧹',unlockedBy:[],secret:false},
 {id:58,title:"Fine, I'll Do It Myself",desc:'As an admin, complete a chore after it was denied or sent back to someone else.',icon:'🤨',unlockedBy:[],secret:true},
 {id:59,title:'Return to Sender',desc:'Have a chore sent back, redo it, and get it approved.',icon:'🔄',unlockedBy:[],secret:false},

 {id:60,title:'First Purchase',desc:'Redeem your first reward.',icon:'💰',unlockedBy:[],secret:false},
 {id:61,title:'Big Spender',desc:'Spend 1,000 total Reward Points.',icon:'💸',unlockedBy:[],secret:false},
 {id:62,title:'Treat Yourself',desc:'Redeem 5 different reward types.',icon:'🎟️',unlockedBy:[],secret:false},
 {id:63,title:'Not My Problem',desc:'Use your first Pass-a-Chore reward.',icon:'😈',unlockedBy:[],secret:false},
 {id:64,title:'Special Delivery',desc:'Receive your first Pass-a-Chore from another person.',icon:'📬',unlockedBy:[],secret:false},
 {id:65,title:'Uno Reverse Card',desc:'Pass a chore to someone who has previously passed a chore to you.',icon:'🔁',unlockedBy:[],secret:true},
 {id:66,title:'Maximum Efficiency',desc:'Complete 5 chores during a Double XP day.',icon:'⚡',unlockedBy:[],secret:false},
 {id:67,title:'Power Overwhelming',desc:'Complete 5 chores during a Triple XP day.',icon:'☢️',unlockedBy:[],secret:false},

 {id:70,title:'Leaf Me Alone',desc:'Rake leaves for the first time.',icon:'🍂',unlockedBy:[],secret:false},
 {id:71,title:'Fall Cleanup Crew',desc:'Rake leaves 5 times.',icon:'🍂',unlockedBy:[],secret:false},
 {id:72,title:'Leaf Annihilator',desc:'Rake leaves 10 times.',icon:'🍁',unlockedBy:[],secret:false},
 {id:73,title:'Do You Wanna Build a Snowman?',desc:'Shovel snow for the first time.',icon:'❄️',unlockedBy:[],secret:false},
 {id:74,title:'The Plow',desc:'Shovel snow 5 times.',icon:'❄️',unlockedBy:[],secret:false},
 {id:75,title:'Winter Warrior',desc:'Shovel snow 10 times.',icon:'🥶',unlockedBy:[],secret:false},
 {id:76,title:'Salty',desc:'Spread salt for the first time.',icon:'🧂',unlockedBy:[],secret:false},
 {id:77,title:'Salt Bae',desc:'Spread salt 10 times.',icon:'🧂',unlockedBy:[],secret:false},
 {id:78,title:'Storm Response Team',desc:'Shovel snow and spread salt on the same day.',icon:'🌨️',unlockedBy:[],secret:false},
 {id:79,title:'Snow Angel',desc:"Complete someone else's overdue snow chore.",icon:'🪽',unlockedBy:[],secret:false},
 {id:80,title:'Autumn Specialist',desc:'Complete multiple fall seasonal chores.',icon:'🍁',unlockedBy:[],secret:false},
 {id:81,title:'Winter Specialist',desc:'Complete multiple winter seasonal chores.',icon:'❄️',unlockedBy:[],secret:false},
 {id:82,title:'Four Seasons',desc:'Complete at least one seasonal chore in each season.',icon:'🏆',unlockedBy:[],secret:false}
];


// Backend builds must never retain prototype household identity/activity.
state.users=[];
state.groceries=[];
state.events=[];
state.requests=[];
state.redemptions=[];
state.notifications=[];
state.achievements.forEach(a=>{a.unlockedBy=[]});
state.currentUser='';
state.achievementTarget='';

const $=s=>document.querySelector(s);const view=$('#view');

const SPRITES=[
 // 10 default sprites everyone can choose from immediately
 {id:'dog',name:'Dog',icon:'🐶',default:true,assetPath:'assets/cosmetics/dog.png'},
 {id:'cat',name:'Cat',icon:'🐱',default:true,assetPath:'assets/cosmetics/cat.png'},
 {id:'fox',name:'Fox',icon:'🦊',default:true,assetPath:'assets/cosmetics/fox.png'},
 {id:'frog',name:'Frog',icon:'🐸',default:true,assetPath:'assets/cosmetics/frog.png'},
 {id:'panda',name:'Panda',icon:'🐼',default:true,assetPath:'assets/cosmetics/panda.png'},
 {id:'penguin',name:'Penguin',icon:'🐧',default:true,assetPath:'assets/cosmetics/penguin.png'},
 {id:'pig',name:'Pig',icon:'🐷',default:true,assetPath:'assets/cosmetics/pig.png'},
 {id:'antelope',name:'Antelope',icon:'🦌',default:true,assetPath:'assets/cosmetics/antelope.png'},
 {id:'chicken',name:'Chicken',icon:'🐔',default:true,assetPath:'assets/cosmetics/chicken.png'},
 {id:'alien',name:'Alien',icon:'👾',default:true,assetPath:'assets/cosmetics/alien.png'},

 // Achievement-unlocked collectible sprites
 {id:'fire-spirit',name:'Fire Spirit',icon:'🔥',achievement:'On a Roll',assetPath:'assets/cosmetics/fire-spirit.png'},
 {id:'battle-chicken',name:'Battle Chicken',icon:'🐔⚔️',achievement:'Unstoppable'},
 {id:'robot-ear',name:'Robot Ear',icon:'🤖👂',achievement:'Seriously?',assetPath:'assets/cosmetics/robot-ear.png'},
 {id:'wizard-frog',name:'Wizard Frog',icon:'🐸🧙',achievement:'Touch Grass',assetPath:'assets/cosmetics/wizard-frog.png'},
 {id:'phoenix-crown',name:'Crowned Phoenix',icon:'🐦‍🔥👑',achievement:'No Days Off',assetPath:'assets/cosmetics/phoenix-crown.png'},
 {id:'sword-goblin',name:'Side Quest Goblin',icon:'👹⚔️',achievement:'One-Off Warrior',assetPath:'assets/cosmetics/sword-goblin.png'},
 {id:'business-goose',name:'Business Goose',icon:'🪿💼',achievement:'One-Off Champion',assetPath:'assets/cosmetics/business-goose.png'},
 {id:'rescue-raccoon',name:'Rescue Raccoon',icon:'🦝🚨',achievement:'Rescue Mission',assetPath:'assets/cosmetics/rescue-raccoon.png'},
 {id:'hero-cape',name:'Cape Hero',icon:'🦸',achievement:'Not All Heroes Wear Capes',assetPath:'assets/cosmetics/hero-cape.png'},
 {id:'angry-toaster',name:'Angry Toaster',icon:'🍞😡',achievement:'Kitchen Confidential',assetPath:'assets/cosmetics/angry-toaster.png'},
 {id:'possessed-vacuum',name:'Possessed Vacuum',icon:'👻🧹',achievement:'Clean Sweep',assetPath:'assets/cosmetics/possessed-vacuum.png'},
 {id:'golden-toilet',name:'Golden Toilet',icon:'🚽👑',achievement:'Porcelain Throne',assetPath:'assets/cosmetics/golden-toilet.png'},
 {id:'dishwasher-ghost',name:'Haunted Dishwasher',icon:'👻🍽️',achievement:'Dishwasher Main',assetPath:'assets/cosmetics/dishwasher-ghost.png'},
 {id:'disco-snail',name:'Disco Snail',icon:'🐌🪩',achievement:"Tomorrow's Problem",assetPath:'assets/cosmetics/disco-snail.png'},
 {id:'dumpster-fire',name:'Dumpster Fire',icon:'🗑️🔥',achievement:'The Streak Is Dead',assetPath:'assets/cosmetics/dumpster-fire.png'},
 {id:'three-raccoons',name:'Three Raccoons',icon:'🦝🦝🦝',achievement:'The Cleaner',assetPath:'assets/cosmetics/three-raccoons.png'},
 {id:'flaming-potato',name:'Flaming Potato',icon:'🥔🔥',achievement:'Absolute Menace',assetPath:'assets/cosmetics/flaming-potato.png'},
 {id:'space-chicken',name:'Space Chicken',icon:'🐔🚀',achievement:'Power Overwhelming',assetPath:'assets/cosmetics/space-chicken.png'},
 {id:'gem-goblin',name:'Gem Goblin',icon:'💎👹',achievement:'Big Spender',assetPath:'assets/cosmetics/gem-goblin.png'},
 {id:'mystery-orb',name:'The Orb',icon:'🔮',achievement:'Uno Reverse Card',assetPath:'assets/cosmetics/mystery-orb.png'},
 {id:'leaf-beast',name:'Leaf Beast',icon:'🍁👹',achievement:'Leaf Annihilator',assetPath:'assets/cosmetics/leaf-beast.png'},
 {id:'snow-yeti',name:'Snow Yeti',icon:'❄️👹',achievement:'Winter Warrior',assetPath:'assets/cosmetics/snow-yeti.png'},
 {id:'salt-wizard',name:'Salt Wizard',icon:'🧂🧙',achievement:'Salt Bae',assetPath:'assets/cosmetics/salt-wizard.png'},
 {id:'snow-tank',name:'Snow Tank',icon:'❄️🛡️',achievement:'Storm Response Team',assetPath:'assets/cosmetics/snow-tank.png'},
 {id:'season-master',name:'Season Master',icon:'🌦️👑',achievement:'Four Seasons',assetPath:'assets/cosmetics/season-master.png'}
];

state.cosmeticCatalog=[];
state.previewUser=null;
state.seasonYear=state.seasonYear||2026;
state.seasonHistory=state.seasonHistory||[];
state.seasonResetAudit=state.seasonResetAudit||[];


// Restored shared helpers from stable v0.14.1
function unlockedSprites(u){return SPRITES.filter(s=>spriteUnlocked(u,s))}
function userSprite(u){return spriteById(u.avatarId||'dog')}
function spriteIcon(u){return userSprite(u).icon}
function spriteVisual(s,extra=''){
 const src=s?.assetPath;
 return src?`<img class="sprite-art ${extra}" src="${esc(src)}" alt="${esc(s.name||'Sprite')}" loading="lazy">`:`<span class="sprite-fallback ${extra}">${esc(s?.icon||'✨')}</span>`;
}
function spriteMarkup(u,extra=''){const s=userSprite(u);return `<span class="sprite-avatar ${extra}" title="${esc(s.name)}">${spriteVisual(s)}</span>`}
function owner(c){return c.claimedBy||c.assigned||null}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function dateKey(v){if(!v)return'';return String(v).slice(0,10)}
function fmt(v){if(!v)return'—';const d=new Date(v);if(Number.isNaN(d.getTime()))return v;return d.toLocaleString([], {month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}
function toInput(v){return v&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)?v.slice(0,16):''}
function monthKey(){return '2026-08'}
function notify(name,text){state.notifications.unshift({id:Date.now()+Math.random(),user:name,text,read:false})}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function celebrate(title,desc){$('#achievementTitle').textContent=title;$('#achievementDesc').textContent=desc;$('#achievementPopup').classList.add('show');for(let i=0;i<45;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=`hsl(${Math.random()*360} 85% 60%)`;p.style.animationDelay=Math.random()*.3+'s';$('#celebration').appendChild(p);setTimeout(()=>p.remove(),2200)}setTimeout(()=>$('#achievementPopup').classList.remove('show'),3300)}
function showLotteryResult(result){
 const popup=$('#achievementPopup'),icon=popup.querySelector('.achievement-icon'),small=popup.querySelector('small');
 const oldIcon=icon.textContent,oldSmall=small.textContent;
 icon.textContent='🎟️';small.textContent='RP LOTTERY';
 $('#achievementTitle').textContent='Ticket Result';
 $('#achievementDesc').textContent=result;
 popup.classList.add('lottery-pop','show');
 for(let i=0;i<65;i++){const p=document.createElement('i');p.className='confetti lottery-confetti';p.style.left=Math.random()*100+'vw';p.style.background=`hsl(${Math.random()*360} 85% 60%)`;p.style.animationDelay=Math.random()*.25+'s';$('#celebration').appendChild(p);setTimeout(()=>p.remove(),2400)}
 setTimeout(()=>{popup.classList.remove('show','lottery-pop');icon.textContent=oldIcon;small.textContent=oldSmall},3000);
}
function stat(label,value,sub){return `<div class="card stat"><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div>`}
function setHeader(kicker,title){$('#viewEyebrow').textContent=kicker;$('#viewTitle').textContent=title}
function populateUsers(){const el=$('#userSelect');if(!el)return;const s=el;s.innerHTML=state.users.map(u=>`<option ${u.name===state.currentUser?'selected':''}>${u.name}</option>`).join('')}
function updateShell(){const u=currentUser();$('#sidebarAvatar').innerHTML=spriteVisual(userSprite(u));$('#sidebarName').textContent=u.name;$('#sidebarRole').textContent=u.role;$('#adminNav').style.display=isAdmin()?'block':'none';const unread=state.notifications.filter(n=>n.user===u.name&&!n.read).length;$('#navNotifBadge').textContent=unread?String(unread):'';$('#navNotifBadge').classList.toggle('show',!!unread);document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view))}
function choreCard(c){let buttons='';if(c.status==='Open'&&owner(c)===state.currentUser)buttons+=`<button class="primary" data-action="chore-complete" data-id="${c.id}">Complete</button>`;if(c.status==='Open'&&owner(c)!==state.currentUser)buttons+=`<button class="ghost" data-action="chore-claim" data-id="${c.id}">Claim</button>`;return `<div class="quest" data-action="chore-detail" data-id="${c.id}"><div><h4>${esc(c.title)}</h4><p>${c.type} · Due ${fmt(c.due)}</p><div class="quest-meta"><span class="chip">${owner(c)?'Owner: '+owner(c):'Unclaimed'}</span><span class="chip">+${c.xp} XP</span>${c.bounty?`<span class="chip good">💵 $${c.bounty} bounty</span>`:''}<span class="chip ${c.status==='Pending'?'warn':c.status==='Denied'?'bad':c.status==='Approved'?'good':''}">${c.status}</span></div></div><div class="action-row">${buttons}</div></div>`}
function eventCard(e){
 const rewardDay=e.backend&&e.sourceType==='reward';
 const when=rewardDay?`All Day · ${new Date(e.start).toLocaleDateString([], {month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'})}`:`${fmt(e.start)} → ${fmt(e.end)}`;
 const by=e.by||memberNameById(e.createdBy)||'Family Quest',aud=e.for||((e.audience==='household'||!e.audience)?'Household':e.audience);
 const mine=e.createdBy===window.FQAuth?.profile?.user_id||by===state.currentUser,manageable=!rewardDay&&(mine||isAdmin()),rewardAdjust=rewardDay&&isAdmin();
 return `<div class="simple-item"><div class="row"><div><h4>${esc(e.title)}</h4><p>${when} · For ${esc(aud)} · Added by ${esc(by)}${rewardDay?' · 🔒 Reward event':''}</p></div>${manageable?`<div class="action-row"><button class="ghost" data-action="event-edit" data-id="${e.id}">Edit</button><button class="bad" data-action="event-remove" data-id="${e.id}">Remove</button></div>`:rewardAdjust?`<div class="action-row"><button class="ghost" data-action="event-edit" data-id="${e.id}">Adjust Date</button></div>`:''}</div></div>`;
}

function realChoresEnabled(){return !!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id)}
function realProfile(){return window.FQAuth?.profile}
function realHousehold(){return window.FQAuth?.household}

function signedInUser(){
 return state.users.find(u=>u.name===state.currentUser)||state.users[0]||null;
}
function currentUser(){
 if(state.previewUser)return state.users.find(u=>u.name===state.previewUser)||signedInUser();
 return signedInUser();
}
function isPreviewing(){return !!state.previewUser}
function activeUsers(){return state.users.filter(u=>u.active!==false)}
function nextUserId(){return Math.max(0,...state.users.map(u=>Number(u.id)||0))+1}
function streakDayForCompletion(c){return (c.completedAt||c.completedDate||c.date||'').slice(0,10)}
function getApprovedCompletionDays(userName){
 const days=new Set();
 (state.completions||[]).forEach(c=>{
   if(c.user===userName&&c.status==='Approved'){
     const d=streakDayForCompletion(c);if(d)days.add(d);
   }
 });
 return [...days].sort();
}
function calculateCurrentStreak(userName){
 const days=new Set(getApprovedCompletionDays(userName));
 if(!days.size)return 0;
 const cur=new Date();cur.setHours(0,0,0,0);
 if(!days.has(cur.toISOString().slice(0,10))){
   cur.setDate(cur.getDate()-1);
   if(!days.has(cur.toISOString().slice(0,10)))return 0;
 }
 let n=0;
 while(days.has(cur.toISOString().slice(0,10))){n++;cur.setDate(cur.getDate()-1)}
 return n;
}
function refreshUserStreaks(){
 state.users.forEach(u=>{const s=calculateCurrentStreak(u.name);u.streak=s;u.bestStreak=Math.max(u.bestStreak||0,s)});
}
function checkAutomaticSeasonReset(){/* v0.18.2: season rollover is intentionally Admin-controlled; no automatic reset. */}
function isAdmin(){return signedInUser().role==='Admin Parent'}
function levelOf(u){return Math.floor(u.xp/1000)+1}

function spriteById(id){return SPRITES.find(s=>s.id===id)||SPRITES[0]}
function hasAchievement(u,title){
 const a=state.achievements.find(x=>x.title===title);
 return !!(a&&a.unlockedBy.includes(u.name));
}
function spriteUnlocked(u,s){
 if(s.default)return true;
 if((u.cosmeticUnlocks||[]).includes(s.id))return true;
 const a=state.achievements.find(a=>a.title===s.achievement);
 return !!a?.unlockedBy?.includes(u.name);
}
function memberNameById(id){return state.users.find(u=>String(u.id)===String(id))?.name||null}
function memberIdByName(name){return state.users.find(u=>u.name===name)?.id||null}
function frequencyLabel(v){return ({daily:'Daily',weekly:'Weekly',one_off:'One-Off',seasonal:'Seasonal'})[v]||v}
function frequencyValue(v){return ({Daily:'daily',Weekly:'weekly','One-Off':'one_off',Seasonal:'seasonal'})[v]||v}
function mapRealChore(d){
 const inst=(d.chore_instances||[]).find(x=>['open','pending','sent_back'].includes(x.status))||(d.chore_instances||[])[0]||null;
 return {
  id:d.id,instanceId:inst?.id||null,title:d.title,type:frequencyLabel(d.frequency),
  assigned:memberNameById(inst?.assigned_user_id||d.assigned_user_id),
  assignedId:inst?.assigned_user_id||d.assigned_user_id||null,
  claimedBy:memberNameById(inst?.claimed_by),claimedById:inst?.claimed_by||null,
  xp:d.xp_value||0,bounty:(d.bounty_cents||0)/100,due:inst?.due_at||d.due_at||'',
  status:inst?({open:'Open',pending:'Pending',sent_back:'Open',approved:'Approved',denied:'Denied'}[inst.status]||inst.status):'Open',
  details:Array.isArray(d.completion_expectations)?d.completion_expectations:[],
  photo:d.reference_photo_path||null,active:d.active!==false,category:d.category||'',
  isGroceryRun:!!d.is_grocery_run,backend:true
 };
}

async function loadRealHouseholdMembers(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client,p=window.FQAuth.profile;
 const {data,error}=await c.from('profiles').select('user_id,display_name,role,active,title,selected_sprite_id').eq('household_id',p.household_id).eq('membership_status','active');
 if(error)throw error;
 state.users=(data||[]).map(u=>({id:u.user_id,name:u.display_name,role:u.role==='admin'?'Admin Parent':'Family Member',admin:u.role==='admin',active:u.active,title:u.title||'New Adventurer',avatarId:u.selected_sprite_id||'dog',xp:0,rp:0,streak:0,bestStreak:0,lifetime:0}));
 const me=state.users.find(u=>u.id===p.user_id); if(me){state.currentUser=me.name;state.achievementTarget=me.name}
}
async function loadRealChores(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client,p=window.FQAuth.profile;
 const sync=await c.rpc('sync_chore_instances');
 if(sync.error)throw sync.error;
 const {data,error}=await c.from('chore_definitions').select('id,title,category,frequency,assigned_user_id,xp_value,bounty_cents,active,due_at,completion_expectations,reference_photo_path,is_grocery_run,chore_instances(id,assigned_user_id,claimed_by,due_at,status,created_at)').eq('household_id',p.household_id).order('created_at');
 if(error)throw error;
 state.chores=(data||[]).map(mapRealChore);
}
async function refreshRealCore(){
 try{await loadRealHouseholdMembers();await loadRealChores();render()}catch(e){toast(e.message||String(e))}
}
async function realClaimChore(c){
 const {error}=await window.FQAuth.client.rpc('claim_chore',{p_instance_id:c.instanceId});if(error){toast(error.message);return}
 toast(`${c.title} claimed.`);await loadRealChores();render();
}
async function realCompleteChore(c){
 const {data,error}=await window.FQAuth.client.rpc('complete_chore',{p_instance_id:c.instanceId});if(error){toast(error.message);return}
 toast(data==='approved'?`${c.title} completed and auto-approved.`:`${c.title} sent for admin approval.`);
 await window.FQAuth.refreshIdentity?.(); await Promise.all([loadRealChores(),loadRealGroceries(),loadRealNotifications()]); render();
}
async function loadPendingRealCompletions(){
 if(!realChoresEnabled()||!isAdmin())return[];
 const {data,error}=await window.FQAuth.client.from('chore_completions').select('id,completed_by,completed_at,status,chore_id,chore_definitions(title,xp_value,bounty_cents)').eq('household_id',realProfile().household_id).eq('status','pending').order('completed_at');
 if(error)return[];return data||[];
}
async function realReviewCompletion(id,decision){
 const {error}=await window.FQAuth.client.rpc('review_chore_completion',{p_completion_id:id,p_decision:decision,p_note:null});
 if(error){toast(error.message);return}
 toast(decision==='approve'?'Chore approved.':decision==='send_back'?'Sent back.':'Denied.');
 await Promise.all([loadRealChores(),loadRealGroceries(),loadRealNotifications()]);render();
}
async function realToggleChore(id){
 const c=state.chores.find(x=>String(x.id)===String(id));if(!c)return;
 const {error}=await window.FQAuth.client.rpc('set_chore_active',{p_id:c.id,p_active:c.active===false});
 if(error){toast(`Could not update chore: ${error.message}`);return}toast(`${c.title} ${c.active===false?'activated':'deactivated'}.`);await loadRealChores();render();
}
function renderHome(){const u=currentUser(),cur=u.xp%1000,my=state.chores.filter(c=>owner(c)===u.name&&c.status==='Open'),pending=state.chores.filter(c=>c.status==='Pending').length+state.redemptions.filter(r=>r.status==='Pending'&&!r.backend).length,unread=state.notifications.filter(n=>n.user===u.name&&!n.read).length;setHeader('HOUSEHOLD HUD',`Welcome back, ${u.name}`);view.innerHTML=`<div class="card"><div class="profile-hero">${spriteMarkup(u)}<div><div class="kicker">SEASON 2026</div><div class="big-name">${u.name} · Level ${levelOf(u)}</div><div class="muted">${esc(u.title)}</div>${(()=>{const p=currentXpPowerup(),up=upcomingXpPowerup();const cls=p?(p.multiplier===3?' triple':' double'):'';const tag=p?`<span class="xp-power-tag">${p.multiplier}× XP ACTIVE UNTIL MIDNIGHT</span>`:'';return `<div class="xpbar${cls}"><i style="width:${cur/10}%"></i></div>${tag}`})()}<div class="row muted" style="font-size:12px;margin-top:6px"><span>${cur} / 1000 XP to next level</span><span>${u.xp.toLocaleString()} season XP</span></div></div><div class="card stat"><div class="label">Reward Points</div><div class="value">💎 ${u.rp}</div><div class="sub">Carries into next year</div></div></div></div><div class="grid cards-4" style="margin-top:16px">${stat('🔥 Current Streak',u.streak+' days',(()=>{const rem=7-(u.streak%7);return `+200 XP in ${rem} day${rem===1?'':'s'} · Best: ${u.bestStreak}`})())}${stat('⚔️ Open Quests',my.length,'Assigned or claimed')}${stat('🔔 Notifications',unread,'Unread')}${stat('🛡️ Admin Queue',isAdmin()?pending:'—',isAdmin()?'Awaiting review':'Admin only')}</div><div class="grid two" style="margin-top:16px"><div class="card"><div class="section-title"><h3>🎯 Up Next</h3><button class="ghost" data-view-jump="chores">View All</button></div>${my[0]?choreCard(my[0]):'<div class="empty">No open quests.</div>'}</div><div class="card"><div class="section-title"><h3>📅 Upcoming</h3><button class="ghost" data-view-jump="calendar">Calendar</button></div><div class="simple-list">${state.events.slice().sort((a,b)=>a.start.localeCompare(b.start)).slice(0,3).map(eventCard).join('')}</div></div></div>`}
function renderChores(){setHeader('QUEST LOG','Household Quests');view.innerHTML=`${isAdmin()?'<div class="section-title"><div></div><button class="primary" data-action="admin-create" data-type="chore">+ Create Chore</button></div>':''}${['Daily','Weekly','One-Off','Seasonal'].map(t=>{const list=state.chores.filter(c=>c.type===t&&c.active!==false);if(!list.length)return'';return `<div class="card" style="margin-bottom:16px"><div class="section-title"><h3>${t}</h3><span class="muted">${list.length} quests</span></div><div class="quest-list">${list.map(choreCard).join('')}</div></div>`}).join('')}`}
function rewardUsedThisMonth(rewardId,user){return state.redemptions.some(r=>r.rewardId===rewardId&&r.user===user&&r.month===monthKey()&&r.status!=='Denied')}

async function loadRealXpMultipliers(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id)){state.realXpMultipliers=[];return}
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'});
 const {data,error}=await window.FQAuth.client.from('xp_multiplier_days').select('user_id,active_date,multiplier,source_redemption_id').gte('active_date',today).order('active_date');
 if(error){console.error('XP multiplier load failed',error);state.realXpMultipliers=[];return}
 state.realXpMultipliers=data||[];
 console.info('Family Quest XP power-ups loaded',state.realXpMultipliers.length);
}
function localDateKey(){return new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'})}
function upcomingXpPowerup(){const uid=window.FQAuth?.profile?.user_id;if(!uid)return null;const today=localDateKey();return state.realXpMultipliers.filter(x=>x.user_id===uid&&x.active_date>=today).sort((a,b)=>a.active_date.localeCompare(b.active_date))[0]||null}
function currentXpPowerup(){const p=upcomingXpPowerup();return p&&p.active_date===localDateKey()?p:null}
function xpPowerupLockFor(r){if(r.kind!=='multiplier')return null;const p=currentXpPowerup();return p?`Unavailable — ${p.multiplier===3?'Triple':'Double'} XP is already active today`:null}
async function loadRealCalendarEvents(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client,p=window.FQAuth.profile;
 const {data,error}=await c.from('calendar_events').select('id,title,start_at,end_at,audience,created_by,source_type,source_id,details').eq('household_id',p.household_id).order('start_at');
 if(error){console.error('Calendar load failed',error);return}
 const backend=(data||[]).map(e=>({
   id:e.id,title:e.title,start:e.start_at,end:e.end_at||e.start_at,
   audience:e.audience||'household',createdBy:e.created_by,
   by:memberNameById(e.created_by)||'Family Quest',
   for:(e.audience==='household'||!e.audience)?'Household':e.audience,
   backend:true,sourceType:e.source_type,sourceId:e.source_id,details:e.details||{}
 }));
 state.events=(state.events||[]).filter(e=>!e.backend).concat(backend);
}
async function loadRealRewards(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client,p=window.FQAuth.profile;
 const [defs,reds]=await Promise.all([
   c.from('reward_definitions').select('id,template_key,title,cost_rp,description,kind,choice_label,calendar_prefix,active').eq('household_id',p.household_id).order('cost_rp'),
   c.from('reward_redemptions').select('id,reward_id,user_id,cost_rp,status,details,requested_at,reviewed_at,reward_definitions(title,template_key)').eq('household_id',p.household_id).order('requested_at',{ascending:false})
 ]);
 if(defs.error)throw defs.error;if(reds.error)throw reds.error;
 state.rewards=(defs.data||[]).map(r=>({id:r.id,templateKey:r.template_key,title:r.title,cost:r.cost_rp,desc:r.description,kind:r.kind,choiceLabel:r.choice_label,calendarPrefix:r.calendar_prefix,active:r.active,backend:true}));
 state.redemptions=(reds.data||[]).map(x=>({id:x.id,user:memberNameById(x.user_id)||'Family Member',userId:x.user_id,rewardId:x.reward_id,title:x.reward_definitions?.title||'Reward',templateKey:x.reward_definitions?.template_key,cost:x.cost_rp,status:({pending:'Pending',approved:'Approved',denied:'Denied',resolved:'Resolved'})[x.status]||x.status,details:x.details||{},month:String(x.requested_at||'').slice(0,7),requestedAt:x.requested_at,backend:true}));
}
async function realRequestReward(r,details){
 const {data,error}=await window.FQAuth.client.rpc('request_reward',{p_reward_id:r.id,p_details:details||{}});
 if(error){toast(error.message);return false}
 await window.FQAuth.refreshIdentity?.();
 await Promise.all([loadRealRewards(),loadRealHouseholdMembers(),loadRealXpPowerups(),loadRealNotifications()]);
 const latest=(state.redemptions||[]).find(x=>String(x.id)===String(data));
 const result=latest?.details?.lotteryResult;
 if(result)showLotteryResult(result);
 render();
 if(r.kind==='multiplier')toast(`⚡ ${r.templateKey==='triple_xp_day'?'3×':'2×'} XP ACTIVE UNTIL MIDNIGHT`);
 return true;
}
async function loadPendingRealRewards(){
 if(!realChoresEnabled()||!isAdmin())return[];
 const {data,error}=await window.FQAuth.client.from('reward_redemptions').select('id,user_id,cost_rp,details,requested_at,reward_definitions(title,kind,template_key)').eq('household_id',realProfile().household_id).eq('status','pending').order('requested_at');
 if(error){toast(error.message);return[]}return data||[];
}
async function renderRealRewardApprovalQueue(){
 if(!realChoresEnabled()||!isAdmin()||state.view!=='admin')return;
 const items=await loadPendingRealRewards();if(state.view!=='admin')return;
 let panel=document.getElementById('realRewardApprovalPanel');panel?.remove();
 panel=document.createElement('div');panel.id='realRewardApprovalPanel';panel.className='card admin-section backend-panel';
 const detailHtml=x=>{
   const k=x.reward_definitions?.kind,d=x.details||{};
   if(k==='dinner')return `<div class="admin-reward-edit" data-edit-reward="${x.id}"><label>Dinner Choice<input data-field="meal" value="${esc(d.meal||'')}"></label><label>Date<input type="date" data-field="date" value="${esc(d.date||'')}"></label><button data-action="reward-save-real" data-redemption="${x.id}">Save Changes</button></div>`;
   if(k==='dated-choice')return `<div class="admin-reward-edit" data-edit-reward="${x.id}"><label>Choice<input data-field="choice" value="${esc(d.choice||'')}"></label><label>Date<input type="date" data-field="date" value="${esc(d.date||'')}"></label><button data-action="reward-save-real" data-redemption="${x.id}">Save Changes</button></div>`;
   if(k==='multiplier')return `<div class="admin-reward-edit" data-edit-reward="${x.id}"><label>XP Bonus Date<input type="date" data-field="date" value="${esc(d.date||'')}"></label><p class="muted">${x.reward_definitions?.template_key==='triple_xp_day'?'3×':'2×'} chore XP on the selected completion date.</p><button data-action="reward-save-real" data-redemption="${x.id}">Save Changes</button></div>`;
   return Object.keys(d).length?`<p class="muted">${esc(JSON.stringify(d))}</p>`:'';
 };
 panel.innerHTML=`<div class="section-title"><h3>🎁 Reward Approval Queue</h3><span class="chip warn">${items.length}</span></div><div class="simple-list">${items.map(x=>`<div class="simple-item"><div class="row"><div><h4>${esc(x.reward_definitions?.title||'Reward')}</h4><p>${esc(memberNameById(x.user_id)||'Family Member')} · ${x.cost_rp} RP · ${fmt(x.requested_at)}</p></div><span class="chip warn">Pending</span></div>${detailHtml(x)}<div class="action-row" style="margin-top:10px"><button class="good" data-action="reward-approve-real" data-redemption="${x.id}">Approve</button><button class="bad" data-action="reward-deny-real" data-redemption="${x.id}">Deny</button></div></div>`).join('')||'<div class="empty">Nothing waiting.</div>'}</div>`;
 const chore=document.getElementById('realChoreApprovalPanel');chore?chore.after(panel):document.getElementById('view').prepend(panel);
}
async function realSaveRewardEdits(id){
 const box=document.querySelector(`[data-edit-reward="${CSS.escape(String(id))}"]`);if(!box)return;
 const details={};
 box.querySelectorAll('[data-field]').forEach(el=>details[el.dataset.field]=el.value.trim());
 const {error}=await window.FQAuth.client.rpc('admin_update_reward_redemption',{p_redemption_id:id,p_details:details});
 if(error){toast(error.message);return false}
 toast('Reward request updated.');
 await loadRealRewards();render();return true;
}

async function realReviewReward(id,decision){
 if(decision==='approve'&&document.querySelector(`[data-edit-reward="${CSS.escape(String(id))}"]`)){
   const saved=await realSaveRewardEdits(id);
   if(!saved)return;
 }
 const {error}=await window.FQAuth.client.rpc('review_reward_redemption',{p_redemption_id:id,p_decision:decision,p_note:null});
 if(error){toast(error.message);return}
 toast(decision==='approve'?'Reward approved.':'Reward denied.');
 await loadRealRewards();await loadRealCalendarEvents();
   await loadRealXpMultipliers();await loadRealChores();await loadRealHouseholdMembers();await window.FQAuth.refreshIdentity?.();await loadRealAchievements();render();
}

function renderRewards(){const u=currentUser();setHeader('REWARD SHOP',`Spend Reward Points · ${u.rp} RP`);view.innerHTML=`<div class="grid cards-3">${state.rewards.filter(r=>r.active).map(r=>{const used=r.kind!=='lottery'&&rewardUsedThisMonth(r.id,u.name),powerLock=xpPowerupLockFor(r),disabled=!!powerLock||used||u.rp<r.cost;return `<div class="card${powerLock?' reward-locked':''}"><div class="kicker">REWARD</div><h3>${esc(r.title)}</h3><p class="muted">${esc(r.desc)}</p>${powerLock?`<div class="reward-lock-note">🔒 ${esc(powerLock)}</div>`:''}<div class="row" style="margin-top:18px"><span class="reward-price">💎 ${r.cost} RP</span><button class="primary" data-action="reward-open" data-id="${r.id}" ${disabled?'disabled':''}>${powerLock?'Locked':(used?'Used This Month':(r.kind==='multiplier'?'Activate':'Request'))}</button></div></div>`}).join('')}</div><div class="card" style="margin-top:16px"><h3>My Redemptions</h3><div class="simple-list">${state.redemptions.filter(r=>r.user===u.name).slice(0,10).map(r=>`<div class="simple-item row"><div><h4>${esc(r.title)}</h4><p>${r.cost} RP${r.details?.meal?' · '+esc(r.details.meal):''}${r.details?.choice?' · '+esc(r.details.choice):''}${r.details?.date?' · '+r.details.date:''}${r.details?.target?' · to '+r.details.target:''}${r.details?.lotteryResult?' · '+esc(r.details.lotteryResult):''}</p></div><span class="chip ${r.status==='Pending'?'warn':(r.status==='Approved'||r.status==='Resolved')?'good':'bad'}">${r.status}</span></div>`).join('')||'<div class="empty">No reward requests.</div>'}</div></div>`}
async function loadRealGroceries(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const {data,error}=await window.FQAuth.client.from('grocery_items').select('id,item,requested_by,status,notes,created_at').eq('household_id',window.FQAuth.profile.household_id).is('cleared_at',null).order('created_at',{ascending:false});
 if(error){console.error('Groceries load failed',error);return}
 state.groceries=(data||[]).map(g=>({id:g.id,item:g.item,by:memberNameById(g.requested_by)||'Family Member',requestedBy:g.requested_by,status:g.status,notes:g.notes||'',backend:true}));
}
async function realAddGrocery(item,notes){const {error}=await window.FQAuth.client.rpc('add_grocery_item',{p_item:item,p_notes:notes||null});if(error){toast(error.message);return false}await loadRealGroceries();toast(`${item} added.`);render();return true}
async function realSetGroceryStatus(id,status){const {error}=await window.FQAuth.client.rpc('set_grocery_status',{p_id:id,p_status:status});if(error){toast(error.message);return}await Promise.all([loadRealGroceries(),loadRealNotifications()]);toast(`Grocery item: ${status}`);render()}
async function loadRealNotifications(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const {data,error}=await window.FQAuth.client.from('notifications').select('id,user_id,text,type,read_at,created_at,source_type,source_id').eq('user_id',window.FQAuth.profile.user_id).order('created_at',{ascending:false}).limit(100);
 if(error){console.error('Notifications load failed',error);return}
 state.notifications=(data||[]).map(n=>({id:n.id,user:state.currentUser,text:n.text,type:n.type,read:!!n.read_at,createdAt:n.created_at,backend:true}));
}
async function realMarkNotificationRead(id){const {error}=await window.FQAuth.client.rpc('mark_notification_read',{p_id:id});if(error){toast(error.message);return}await loadRealNotifications();render()}
async function realMarkAllNotificationsRead(){const {error}=await window.FQAuth.client.rpc('mark_all_notifications_read');if(error){toast(error.message);return}await loadRealNotifications();render()}
function renderGroceries(){setHeader('SHARED LIST','Groceries');view.innerHTML=`<div class="card"><div class="section-title"><h3>Current List</h3><button class="primary" data-action="quick-open" data-type="grocery">+ Add Item</button></div><div class="notice">Anyone can add items. Status changes notify the requester. When Grocery Shopping is approved, Purchased and Denied items clear automatically.</div><div class="simple-list" style="margin-top:12px">${state.groceries.map(g=>`<div class="simple-item"><div class="row"><div><h4>${esc(g.item)}</h4><p>Requested by ${esc(g.by)}${g.notes?' · '+esc(g.notes):''}</p></div><span class="chip">${esc(g.status)}</span></div><div class="action-row" style="margin-top:10px">${['Requested','In Cart','Purchased','Delayed','Denied'].map(s=>`<button class="${s==='Purchased'?'good':s==='Denied'?'bad':s==='Delayed'?'warn':'ghost'}" data-action="grocery-status" data-id="${g.id}" data-status="${s}" ${g.status===s?'disabled':''}>${s}</button>`).join('')}</div></div>`).join('')||'<div class="empty">Nothing on the grocery list.</div>'}</div></div>`}
function localTodayDate(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t)?.value;return new Date(Number(get('year')),Number(get('month'))-1,Number(get('day')),12)}
function cursorDate(){return state.calendarCursor?new Date(state.calendarCursor+'T12:00:00'):localTodayDate()}
function setCursor(d){state.calendarCursor=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function startWeek(d){const x=new Date(d);x.setDate(x.getDate()-x.getDay());return x}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function renderCalendar(){setHeader('FAMILY CALENDAR','Schedule');const mode=state.calendarMode,d=cursorDate();let title='',body='';if(mode==='month'){title=d.toLocaleDateString([], {month:'long',year:'numeric'});const first=new Date(d.getFullYear(),d.getMonth(),1,12),last=new Date(d.getFullYear(),d.getMonth()+1,0,12),cells=[];for(let i=0;i<first.getDay();i++)cells.push('<div class="calendar-day blank"></div>');for(let day=1;day<=last.getDate();day++){const cur=new Date(d.getFullYear(),d.getMonth(),day,12),ds=dateKey(cur.toISOString()),evs=state.events.filter(e=>dateKey(e.start)===ds);cells.push(`<div class="calendar-day" data-action="day-zoom" data-date="${ds}"><div class="daynum">${day}</div>${evs.map(e=>`<div class="event-pill"><strong>${esc(e.title)}</strong><br><span class="muted">${new Date(e.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div>`).join('')}</div>`)}body=`<div class="calendar-grid">${cells.join('')}</div>`}else if(mode==='week'){const start=startWeek(d);title=`Week of ${start.toLocaleDateString([], {month:'short',day:'numeric'})}`;body=`<div class="week-grid">${Array.from({length:7},(_,i)=>{const cur=addDays(start,i),ds=dateKey(cur.toISOString()),evs=state.events.filter(e=>dateKey(e.start)===ds);return `<div class="week-day" data-action="day-zoom" data-date="${ds}"><strong>${cur.toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'})}</strong>${evs.map(e=>`<div class="event-pill">${esc(e.title)}<br><span class="muted">${new Date(e.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div>`).join('')||'<p class="muted">No events</p>'}</div>`}).join('')}</div>`}else{title=d.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric',year:'numeric'});const ds=state.calendarCursor,evs=state.events.filter(e=>dateKey(e.start)===ds).sort((a,b)=>a.start.localeCompare(b.start)),reqs=state.requests.filter(r=>dateKey(r.start)===ds);body=`<div class="day-timeline">${evs.map(eventCard).join('')||'<div class="empty">No calendar events this day.</div>'}</div>${reqs.length?`<div class="section-title"><h3>Family Requests</h3></div><div class="simple-list">${reqs.map(r=>`<div class="simple-item"><h4>${esc(r.title)}</h4><p>${fmt(r.start)} → ${fmt(r.end)} · ${r.by} · ${r.status}</p></div>`).join('')}</div>`:''}`}view.innerHTML=`<div class="card"><div class="section-title"><div><div class="tabs"><button class="ghost ${mode==='month'?'active':''}" data-action="calendar-mode" data-mode="month">Month</button><button class="ghost ${mode==='week'?'active':''}" data-action="calendar-mode" data-mode="week">Week</button><button class="ghost ${mode==='day'?'active':''}" data-action="calendar-mode" data-mode="day">Day</button></div><div class="calendar-nav" style="margin-top:10px"><button class="ghost" data-action="calendar-move" data-dir="-1">‹</button><button class="ghost" data-action="calendar-today">Today</button><button class="ghost" data-action="calendar-move" data-dir="1">›</button><strong>${title}</strong></div></div><button class="primary" data-action="quick-open" data-type="calendar">+ Add Event</button></div>${body}</div>`}
async function loadRealFamilyRequests(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const {data,error}=await window.FQAuth.client.from('family_requests').select('id,title,notes,requested_by,start_at,end_at,status,responded_by,responded_at,created_at').eq('household_id',window.FQAuth.profile.household_id).order('created_at',{ascending:false});
 if(error){console.error('Family requests load failed',error);return}
 state.requests=(data||[]).map(r=>({id:r.id,title:r.title,notes:r.notes||'',by:memberNameById(r.requested_by)||'Family Member',requestedBy:r.requested_by,start:r.start_at,end:r.end_at,status:r.status,owner:r.responded_by?memberNameById(r.responded_by):'',respondedBy:r.responded_by,backend:true}));
}
async function realCreateFamilyRequest(title,start,end,notes){const {error}=await window.FQAuth.client.rpc('create_family_request',{p_title:title,p_start_at:new Date(start).toISOString(),p_end_at:new Date(end).toISOString(),p_notes:notes||null});if(error){toast(error.message);return false}await Promise.all([loadRealFamilyRequests(),loadRealNotifications()]);toast(`${title} requested.`);render();return true}
async function realRespondFamilyRequest(id,decision){const {error}=await window.FQAuth.client.rpc('respond_family_request',{p_id:id,p_decision:decision});if(error){toast(error.message);return}await Promise.all([loadRealFamilyRequests(),loadRealNotifications()]);toast(decision==='accept'?'Request accepted.':'Request denied.');render()}
function renderRequests(){setHeader('FAMILY REQUESTS','Ask the House');view.innerHTML=`<div class="card"><div class="section-title"><h3>Requests</h3><button class="primary" data-action="quick-open" data-type="request">+ New Request</button></div><div class="simple-list">${state.requests.map(r=>`<div class="simple-item"><div class="row"><div><h4>${esc(r.title)}</h4><p>${fmt(r.start)} → ${fmt(r.end)} · Requested by ${r.by}${r.owner?' · Accepted by '+r.owner:''}</p></div><span class="chip ${r.status==='Denied'?'bad':r.status==='Accepted'?'good':''}">${r.status}</span></div>${r.status==='Open'&&r.requestedBy!==window.FQAuth?.profile?.user_id?`<div class="action-row" style="margin-top:10px"><button class="good" data-action="request-accept" data-id="${r.id}">I'll Do It</button><button class="bad" data-action="request-deny" data-id="${r.id}">Deny</button></div>`:r.status==='Open'?'<div class="muted" style="margin-top:10px">Waiting for another family member.</div>':''}</div>`).join('')}</div></div>`}

async function loadRealCosmetics(){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client;
 const [defs,unlocks]=await Promise.all([c.from('cosmetic_definitions').select('id,name,icon,acquisition_method,price_rp,unlock_requirement,achievement_id,rarity,secret,active,shop_active,sort_order,asset_path').eq('active',true).order('sort_order'),c.from('cosmetic_unlocks').select('user_id,sprite_id,source_achievement_id,source_type,purchase_price_rp')]);
 if(defs.error)throw defs.error;if(unlocks.error)throw unlocks.error;state.cosmeticCatalog=defs.data||[];
 state.cosmeticCatalog.forEach(d=>{const old=SPRITES.find(s=>s.id===d.id),mapped={id:d.id,name:d.name,icon:d.icon||'✨',default:d.acquisition_method==='default',achievementId:d.achievement_id||null,requirement:d.unlock_requirement||'',method:d.acquisition_method,price:d.price_rp,rarity:d.rarity,secret:!!d.secret,shopActive:!!d.shop_active,assetPath:d.asset_path||null};if(old)Object.assign(old,mapped);else SPRITES.push(mapped)});
 const rows=unlocks.data||[];state.users.forEach(u=>{u.cosmeticUnlocks=rows.filter(x=>String(x.user_id)===String(u.id)).map(x=>x.sprite_id)});
}
async function purchaseCosmetic(id){const item=state.cosmeticCatalog.find(x=>x.id===id);if(!item)return;const {data,error}=await window.FQAuth.client.rpc('purchase_cosmetic',{p_cosmetic_id:id});if(error){toast(error.message);return}await window.FQAuth.refreshIdentity?.();await loadRealCosmetics();toast(`${data?.name||item.name} unlocked!`);render()}
async function equipCosmetic(id){const s=spriteById(id);if(!spriteUnlocked(currentUser(),s)){toast('That sprite is still locked.');return false}const {data,error}=await window.FQAuth.client.rpc('equip_cosmetic',{p_cosmetic_id:id});if(error){toast(error.message);return false}currentUser().avatarId=id;toast(`${data?.name||s.name} equipped.`);return true}
function cosmeticRarityLabel(v){return String(v||'common').replace(/^./,c=>c.toUpperCase())}
function renderCosmetics(){
 const u=currentUser(),owned=new Set(u.cosmeticUnlocks||[]);
 const shop=state.cosmeticCatalog.filter(x=>x.active&&x.shop_active&&x.acquisition_method==='rp_shop');
 const earned=state.cosmeticCatalog.filter(x=>x.active&&x.acquisition_method==='achievement');
 setHeader('SPRITE SHOP',`Permanent cosmetics · ${u.rp} RP`);
 const card=x=>{const has=owned.has(x.id),can=u.rp>=Number(x.price_rp||0),ach=state.achievements.find(a=>String(a.id)===String(x.achievement_id));const earnedAch=ach&&(ach.earnedBy||[]).includes(u.name);return `<div class="card cosmetic-card rarity-${esc(x.rarity||'common')} ${has?'cosmetic-owned':''}"><div class="cosmetic-preview">${has||x.acquisition_method==='rp_shop'?spriteVisual({name:x.name,icon:x.icon,assetPath:x.asset_path},'shop-art'):'<span class="locked-sprite">🔒</span>'}</div><div class="kicker">${esc(cosmeticRarityLabel(x.rarity))} SPRITE</div><h3>${esc(has||!x.secret?x.name:'Secret Sprite')}</h3><p class="muted">${esc(has||!x.secret?(x.unlock_requirement||'Permanent cosmetic unlock.'):'Secret achievement')}</p><div class="row" style="margin-top:18px">${x.acquisition_method==='rp_shop'?`<span class="reward-price">💎 ${Number(x.price_rp||0)} RP</span>${has?`<button class="good" data-action="cosmetic-equip" data-cosmetic="${esc(x.id)}">Equip</button>`:`<button class="primary" data-action="cosmetic-buy" data-cosmetic="${esc(x.id)}" ${can?'':'disabled'}>${can?'Buy':'Need RP'}</button>`}`:`<span class="achievement-cosmetic-status">${has?'✓ Unlocked':earnedAch?'🏆 Ready to Claim':'🔒 Achievement'}</span>${has?`<button class="good" data-action="cosmetic-equip" data-cosmetic="${esc(x.id)}">Equip</button>`:''}`}</div></div>`};
 view.innerHTML=`<div class="card cosmetic-shop-intro"><div><div class="kicker">COSMETIC STORE</div><h3>Collect new profile sprites</h3><p class="muted">RP sprites are instant permanent unlocks. Achievement sprites are earned through real Family Quest milestones and become permanent when the achievement is claimed.</p></div><button class="ghost" data-action="profile-open">My Collection</button></div><h3 class="section-title">RP Shop</h3><div class="grid cards-3 cosmetic-shop-grid">${shop.map(card).join('')||'<div class="empty">No Sprite Shop items are active.</div>'}</div><h3 class="section-title cosmetic-achievement-title">Achievement Sprites</h3><div class="grid cards-3 cosmetic-shop-grid">${earned.map(card).join('')||'<div class="empty">No achievement sprites are active.</div>'}</div>`;
}
async function loadRealAchievements(){
 try{if(window.FQAuth?.realSession)await window.FQAuth.client.rpc('refresh_behavioral_achievements')}catch(e){console.warn('Behavioral achievement refresh skipped',e)}
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const c=window.FQAuth.client,p=window.FQAuth.profile,h=window.FQAuth.household;
 const year=h?.current_season_year||new Date().getFullYear();
 const [defsRes,earnedRes,cosRes]=await Promise.all([
   c.from('achievement_definitions').select('id,name,icon,description,secret,xp_reward,rp_reward,sprite_unlock_id,active').eq('active',true).order('id'),
   c.from('user_achievements').select('user_id,achievement_id,season_year,unlocked_at,claimed_at').eq('household_id',p.household_id).eq('season_year',year),
   c.from('cosmetic_unlocks').select('user_id,sprite_id,source_achievement_id')
 ]);
 if(defsRes.error)throw defsRes.error;
 if(earnedRes.error)throw earnedRes.error;
 if(cosRes.error)throw cosRes.error;
 const earned=earnedRes.data||[];
 state.achievements=(defsRes.data||[]).map(a=>({
   id:a.id,title:a.name,icon:a.icon,desc:a.description,hidden:!!a.secret,secret:!!a.secret,
   xpReward:a.xp_reward||0,rpReward:a.rp_reward||0,spriteUnlockId:a.sprite_unlock_id||null,
   earnedBy:earned.filter(x=>x.achievement_id===a.id).map(x=>memberNameById(x.user_id)).filter(Boolean),
   unlockedBy:earned.filter(x=>x.achievement_id===a.id&&x.claimed_at).map(x=>memberNameById(x.user_id)).filter(Boolean),
   claimableBy:earned.filter(x=>x.achievement_id===a.id&&!x.claimed_at).map(x=>memberNameById(x.user_id)).filter(Boolean),
   backend:true
 }));
 const cosmetics=cosRes.data||[];
 state.users.forEach(u=>{u.cosmeticUnlocks=cosmetics.filter(x=>String(x.user_id)===String(u.id)).map(x=>x.sprite_id)});
}

window.FQLoaders=window.FQLoaders||{};
window.FQLoaders.members=loadRealHouseholdMembers;
window.FQLoaders.chores=loadRealChores;
window.FQLoaders.cosmetics=loadRealCosmetics;
window.FQLoaders.achievements=loadRealAchievements;
window.FQLoaders.rewards=loadRealRewards;
window.FQLoaders.calendar=loadRealCalendarEvents;
window.FQLoaders.groceries=loadRealGroceries;
window.FQLoaders.notifications=loadRealNotifications;
window.FQLoaders.requests=loadRealFamilyRequests;
window.FQLoaders.xpMultipliers=loadRealXpMultipliers;

async function realClaimAchievement(id){
 if(!(window.FQAuth?.realSession&&window.FQAuth?.profile?.household_id))return;
 const a=state.achievements.find(x=>String(x.id)===String(id));
 const {data,error}=await window.FQAuth.client.rpc('claim_achievement',{p_achievement_id:String(id)});
 if(error){toast(error.message||String(error));return}
 const result=Array.isArray(data)?data[0]:data;
 await window.FQAuth.refreshIdentity?.();
 await loadRealAchievements();
 await loadRealCosmetics();
 render();
 celebrate(result?.name||a?.title||'Achievement Unlocked!',result?.description||a?.desc||'Claimed!');
}

function renderAchievements(){
  setHeader('TROPHY ROOM','Achievements');
  const target=state.achievementTarget||state.currentUser;
  const viewingSelf=target===state.currentUser;
  const claimedCount=state.achievements.filter(a=>(a.unlockedBy||[]).includes(target)).length;
  const readyCount=viewingSelf?state.achievements.filter(a=>(a.claimableBy||[]).includes(target)).length:0;
  let cards='';
  if(viewingSelf){
    cards=state.achievements.map(a=>{
      const claimed=(a.unlockedBy||[]).includes(target);
      const ready=(a.claimableBy||[]).includes(target);
      const earned=claimed||ready;
      const secretLocked=a.hidden&&!earned;
      return `<div class="achievement-card ${earned?'':'locked'} ${ready?'claim-ready':''}">
        <div class="icon">${earned?a.icon:(secretLocked?'❓':a.icon)}</div>
        <h4>${secretLocked?'Secret Achievement':esc(a.title)}</h4>
        <p>${secretLocked?'Requirement hidden until earned.':esc(a.desc)}</p>
        ${a.xpReward?`<span class="chip">+${a.xpReward} XP</span>`:''}${a.rpReward?`<span class="chip">+${a.rpReward} RP</span>`:''}
        ${ready?`<div class="action-row" style="margin-top:12px"><button class="primary" data-action="achievement-claim" data-id="${a.id}">🎁 Claim Achievement</button></div>`:''}
        ${claimed?'<span class="chip good">✓ Claimed</span>':ready?'<span class="chip warn">Ready to Claim</span>':'<span class="chip">Locked</span>'}
      </div>`;
    }).join('');
  }else{
    cards=state.achievements.filter(a=>(a.unlockedBy||[]).includes(target)).map(a=>`<div class="achievement-card"><div class="icon">${a.icon}</div><h4>${esc(a.title)}</h4><span class="chip good">Unlocked</span></div>`).join('')||'<div class="empty">No claimed achievements yet.</div>';
  }
  view.innerHTML=`<div class="section-title"><div><h3>${esc(target)}'s Trophy Room</h3><p class="muted">${viewingSelf?'Earned achievements wait here for you to claim.':'Only claimed achievements are visible.'}</p></div><div class="row"><span class="chip">${claimedCount} claimed</span>${readyCount?`<span class="chip warn">${readyCount} ready!</span>`:''}</div></div><div class="achievement-grid">${cards}</div>`;
}
function renderProfiles(){
 setHeader('FAMILY PROFILES','Profiles & Leaderboard');
 const sorted=[...state.users].sort((a,b)=>b.xp-a.xp);
 view.innerHTML=`
 <div class="card">
   <div class="section-title"><h3>2026 Standings</h3><span class="muted">Season rollover is Admin-controlled · permanent unlocks stay</span></div>
   ${sorted.map((u,i)=>`<div class="leader-row">
      <div class="rank">${i+1}</div>
      <div class="leader-player">${spriteMarkup(u,'small')}<div><strong>${u.name}</strong><div class="muted">${esc(u.title)}</div></div></div>
      <div>Lv ${levelOf(u)}</div><div>${u.xp.toLocaleString()} XP</div>
   </div>`).join('')}
 </div>
 <div class="grid cards-3" style="margin-top:16px">
   ${state.users.map(u=>{
      const s=userSprite(u);
      return `<div class="card">
        <div class="profile-card">${spriteMarkup(u,'large')}<div><strong>${u.name}</strong><span>${u.role}</span><span class="sprite-name">${esc(s.name)}</span></div></div>
        <p class="muted">${esc(u.title)}<br>Lifetime XP: ${u.lifetime.toLocaleString()}<br>Best streak: ${u.bestStreak} days<br>Reward Points: ${u.rp}<br>Sprites Unlocked: ${unlockedSprites(u).length} / ${SPRITES.length}</p>
        ${u.name===state.currentUser?'<button class="ghost" data-action="profile-open">Customize Profile</button>':''}
      </div>`;
   }).join('')}
 </div>`;
}
function renderNotifications(){setHeader('INBOX','Notifications');const ns=state.notifications.filter(n=>n.user===state.currentUser),unread=ns.filter(n=>!n.read).length;view.innerHTML=`<div class="card"><div class="section-title"><h3>Inbox</h3>${unread?'<button class="ghost" data-action="notif-read-all">Mark all read</button>':''}</div><div class="simple-list">${ns.map(n=>`<div class="simple-item row ${n.read?'':'notification-unread'}"><div><h4>${n.read?'Read':'● New'}</h4><p>${esc(n.text)}</p></div>${n.read?'':`<button class="ghost" data-action="notif-read" data-id="${n.id}">Mark Read</button>`}</div>`).join('')||'<div class="empty">No notifications.</div>'}</div></div>`}
function datedRewardConflict(redemption){
 if(!redemption?.details?.date)return false;
 return state.redemptions.some(r=>
   r.id!==redemption.id &&
   r.status!=='Denied' &&
   r.details?.date===redemption.details.date &&
   (state.rewards.find(x=>x.id===r.rewardId)?.kind==='dinner' || state.rewards.find(x=>x.id===r.rewardId)?.kind==='dated-choice')
 );
}
function dinnerConflict(redemption){return datedRewardConflict(redemption)}
function renderAdmin(){if(!isAdmin()){state.view='home';render();return}setHeader('ADMIN CONTROL','Manage Household');const pc=realChoresEnabled()?[]:state.chores.filter(c=>c.status==='Pending'),pr=state.redemptions.filter(r=>r.status==='Pending'&&!r.backend);
 const householdPanel='';
const seasonPanel=`
 <div class="card admin-section">
  <div class="section-title"><h3>Season Controls</h3><span class="muted">Current season: ${state.seasonYear}</span></div>
  <p class="muted">Nothing resets automatically. Start a new season only when the household is ready.</p>
  <div class="toolbar">
   <button class="ghost" data-action="season-preview">Preview Reset</button>
   <button class="ghost danger" data-action="season-reset">Reset Season</button>
  </div>
  ${state.seasonResetAudit.length?`<div class="audit-list">${state.seasonResetAudit.slice().reverse().slice(0,5).map(a=>`<div class="muted">${esc(a.when)} · ${esc(a.mode)} · ${esc(a.by)}</div>`).join('')}</div>`:''}
 </div>`;

 view.innerHTML=`${householdPanel}${seasonPanel}<div class="grid two"><div class="card"><div class="section-title"><h3>Approval Queue</h3><span class="chip warn">${pc.length+pr.length}</span></div><div class="simple-list">${pc.map(c=>`<div class="simple-item"><div class="row"><div><h4>${esc(c.title)}</h4><p>${owner(c)} · +${c.xp} XP${c.bounty?' · $'+c.bounty+' bounty':''}</p></div><span class="chip warn">Chore</span></div><div class="action-row" style="margin-top:10px"><button class="good" data-action="chore-approve" data-id="${c.id}">Approve</button><button class="warn" data-action="chore-sendback" data-id="${c.id}">Send Back</button><button class="bad" data-action="chore-deny" data-id="${c.id}">Deny</button></div></div>`).join('')}${pr.map(r=>`<div class="simple-item"><div class="row"><div><h4>${esc(r.title)}</h4><p>${r.user} · ${r.cost} RP${r.details?.meal?' · '+esc(r.details.meal):''}${r.details?.choice?' · '+esc(r.details.choice):''}${r.details?.target?' · pass to '+r.details.target:''}</p></div><span class="chip ${datedRewardConflict(r)?'bad':'warn'}">${datedRewardConflict(r)?'Date Conflict':'Reward'}</span></div>${r.details?.date?`<label style="display:grid;gap:6px;margin-top:10px;color:var(--muted);font-size:12px">Requested Date<input type="date" data-reward-date="${r.id}" value="${r.details?.date||''}"></label>`:''}<div class="action-row" style="margin-top:10px"><button class="good" data-action="reward-approve" data-id="${r.id}">Approve</button><button class="bad" data-action="reward-deny" data-id="${r.id}">Deny</button></div></div>`).join('')}${!pc.length&&!pr.length?'<div class="empty">Nothing waiting.</div>':''}</div></div><div class="card"><div class="action-row"><button class="primary" data-action="admin-create" data-type="chore">+ Chore</button><button class="primary" data-action="admin-create" data-type="achievement">+ Achievement</button></div><div class="section-title"><h3>Chores</h3></div><div class="simple-list">${state.chores.map(c=>`<div class="simple-item row"><div><h4>${esc(c.title)}</h4><p>${c.type} · ${c.active===false?'INACTIVE':'ACTIVE'} · ${c.assigned||'Unassigned'} · ${c.xp} XP${c.bounty?' · $'+c.bounty:''} · ${fmt(c.due)}</p></div><div class="action-row"><button class="ghost" data-action="admin-toggle" data-type="chore" data-id="${c.id}">${c.active===false?'Activate':'Deactivate'}</button><button class="ghost" data-action="admin-edit" data-type="chore" data-id="${c.id}">Edit</button>${realChoresEnabled()?'':`<button class="bad" data-action="admin-remove" data-type="chore" data-id="${c.id}">Remove</button>`}</div></div>`).join('')}</div><div class="section-title"><h3>Rewards</h3><span class="muted">Admin may adjust RP pricing</span></div><div class="simple-list">${state.rewards.map(r=>`<div class="simple-item row"><div><h4>${esc(r.title)}</h4><p>${r.cost} RP · ${r.active===false?'INACTIVE':'ACTIVE'} · once per user each month${r.kind==='multiplier'?' · instant activation until midnight':''}</p></div><div class="action-row"><button class="ghost" data-action="admin-toggle" data-type="reward" data-id="${r.id}">${r.active===false?'Activate':'Deactivate'}</button><button class="ghost" data-action="admin-edit" data-type="reward" data-id="${r.id}">Price</button></div></div>`).join('')}</div><div class="section-title"><h3>Sprite Shop Pricing</h3><span class="muted">RP Shop cosmetics only</span></div><div class="simple-list">${state.cosmeticCatalog.filter(x=>x.active&&x.shop_active&&x.acquisition_method==='rp_shop').map(x=>`<div class="simple-item row"><div><h4>${esc(x.name)}</h4><p>${esc(cosmeticRarityLabel(x.rarity))} · Current price: ${Number(x.price_rp||0)} RP</p></div><div class="action-row"><input type="number" min="0" step="1" value="${Number(x.price_rp||0)}" data-admin-cosmetic-price="${esc(x.id)}" style="width:110px"><button type="button" class="ghost" data-action="admin-cosmetic-price-save" data-id="${esc(x.id)}">Save Price</button></div></div>`).join('')||'<div class="empty">No purchasable sprites.</div>'}</div><div class="section-title"><h3>Achievements</h3></div><div class="simple-list">${state.achievements.map(a=>`<div class="simple-item row"><div><h4>${a.icon} ${esc(a.title)}</h4><p>${a.hidden?'Secret · ':''}${esc(a.desc)}</p></div><div class="action-row">${realChoresEnabled()?'<span class="chip good">Live Rule</span>':`<button class="ghost" data-action="admin-edit" data-type="achievement" data-id="${a.id}">Edit</button><button class="bad" data-action="admin-remove" data-type="achievement" data-id="${a.id}">Remove</button>`}</div></div>`).join('')}</div></div></div>`}
function toggleActive(type,id){if(!isAdmin())return;const arr=type==='chore'?state.chores:state.rewards;const obj=arr.find(x=>String(x.id)===String(id));if(!obj)return;
 if(type==='reward'&&obj.backend){window.FQAuth.client.rpc('set_reward_active',{p_id:obj.id,p_active:obj.active===false}).then(async({error})=>{if(error){toast(error.message);return}await loadRealRewards();toast(`${obj.title} ${obj.active===false?'activated':'deactivated'}.`);render()});return}
 obj.active=obj.active===false;toast(`${obj.title} ${obj.active?'activated':'deactivated'}.`);render()}



async function renderRealApprovalQueue(){
 if(!realChoresEnabled()||!isAdmin()||state.view!=='admin')return;
 const items=await loadPendingRealCompletions(); if(state.view!=='admin')return;
 let panel=document.getElementById('realChoreApprovalPanel');panel?.remove();
 panel=document.createElement('div');panel.id='realChoreApprovalPanel';panel.className='card admin-section backend-panel';
 panel.innerHTML=`<div class="section-title"><h3>⚔️ Real Chore Approval Queue</h3><span class="chip warn">${items.length}</span></div><div class="simple-list">${items.map(x=>`<div class="simple-item"><div class="row"><div><h4>${esc(x.chore_definitions?.title||'Chore')}</h4><p>${esc(memberNameById(x.completed_by)||'Family Member')} · +${x.chore_definitions?.xp_value||0} XP · ${fmt(x.completed_at)}</p></div><span class="chip warn">Pending</span></div><div class="action-row" style="margin-top:10px"><button class="good" data-action="chore-approve" data-completion="${x.id}">Approve</button><button class="warn" data-action="chore-sendback" data-completion="${x.id}">Send Back</button><button class="bad" data-action="chore-deny" data-completion="${x.id}">Deny</button></div></div>`).join('')||'<div class="empty">Nothing waiting.</div>'}</div>`;
 const view=document.getElementById('view');const membership=document.getElementById('realMembershipPanel');membership?membership.after(panel):view.prepend(panel);
}
function renderPreviewBanner(){
 let b=document.getElementById('adminPreviewBanner');
 if(!isPreviewing()){if(b)b.remove();return}
 if(!b){
  b=document.createElement('div');
  b.id='adminPreviewBanner';
  b.className='admin-preview-banner';
  b.addEventListener('click',e=>{if(e.target.closest('[data-action="preview-exit"]'))exitPreview()});
  document.body.prepend(b);
 }
 b.innerHTML=`👁️ ADMIN PREVIEW — Viewing as <strong>${esc(currentUser().name)}</strong> <button data-action="preview-exit">Exit Preview</button>`;
}

function render(){
 renderPreviewBanner();updateShell();({home:renderHome,chores:renderChores,rewards:renderRewards,cosmetics:renderCosmetics,groceries:renderGroceries,calendar:renderCalendar,requests:renderRequests,achievements:renderAchievements,profiles:renderProfiles,notifications:renderNotifications,admin:renderAdmin}[state.view]||renderHome)();
 if(state.view==='admin'&&window.FQAuth?.realSession){setTimeout(()=>window.FQAuth.renderMembershipAdmin(),0);setTimeout(renderRealApprovalQueue,0);setTimeout(renderRealRewardApprovalQueue,0)}
}

function openChoreDetail(id){const c=state.chores.find(x=>String(x.id)===String(id));if(!c)return;$('#choreDialogTitle').textContent=c.title;$('#choreDialogBody').innerHTML=`<div class="quest-meta"><span class="chip">${c.type}</span><span class="chip">${owner(c)?'Owner: '+owner(c):'Unclaimed'}</span><span class="chip">+${c.xp} XP</span>${c.bounty?`<span class="chip good">$${c.bounty} bounty</span>`:''}<span class="chip">Due ${fmt(c.due)}</span></div><div class="section-title"><h3>What Counts as Complete</h3></div>${c.details.length?`<ul class="expectation-list">${c.details.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<div class="empty">No detailed expectations yet.</div>'}<div class="section-title"><h3>Finished-Look Reference</h3></div>${c.photo?`<img class="chore-photo" src="${c.photo}" alt="Reference">`:'<div class="empty">No reference photo uploaded yet.</div>'}`;$('#choreDialog').showModal()}
function claimChore(id){const c=state.chores.find(x=>x.id===id);if(!c||c.status!=='Open')return;c.claimedBy=state.currentUser;toast(`${c.title} claimed by ${state.currentUser}.`);render()}
function completeChore(id){const c=state.chores.find(x=>x.id===id);if(!c||owner(c)!==state.currentUser)return;if(isAdmin()){c.status='Pending';approveChore(id,true);return}c.status='Pending';notify('Adam',`${state.currentUser} completed ${c.title}.`);notify('Beth',`${state.currentUser} completed ${c.title}.`);toast(`${c.title} sent for admin approval.`);render()}
function approveChore(id,self=false){const c=state.chores.find(x=>x.id===id),u=state.users.find(x=>x.name===owner(c));if(!c||!u)return;const beforeLevel=levelOf(u),beforeXP=u.xp;u.xp+=c.xp;u.lifetime+=c.xp;const rp=(Math.floor(u.xp/100)-Math.floor(beforeXP/100))*10;if(rp>0)u.rp+=rp;c.status='Approved';notify(u.name,`${c.title} approved. +${c.xp} XP${rp?' and +'+rp+' RP':''}${c.bounty?' plus $'+c.bounty+' bounty':''}.`);if(c.isGroceryRun){const done=state.groceries.filter(g=>g.status==='Purchased'||g.status==='Denied');done.forEach(g=>notify(g.by,`${g.item} was ${g.status.toLowerCase()} and cleared after the grocery run was completed.`));state.groceries=state.groceries.filter(g=>g.status!=='Purchased'&&g.status!=='Denied');c.status='Open';c.claimedBy=null}if(levelOf(u)>beforeLevel)celebrate(`Level ${levelOf(u)}!`,`${u.name} leveled up. Pure clout.`);toast(self?`${c.title} completed and auto-approved.`:'Chore approved.');render()}
function sendBackChore(id){const c=state.chores.find(x=>x.id===id);if(!c)return;c.status='Open';notify(owner(c),`${c.title} was sent back for a redo.`);toast('Sent back.');render()}
function denyChore(id){const c=state.chores.find(x=>x.id===id);if(!c)return;c.status='Denied';notify(owner(c),`${c.title} was denied. No XP awarded.`);toast('Denied.');render()}
function setGroceryStatus(id,status){const g=state.groceries.find(x=>x.id===id);if(!g)return;g.status=status;notify(g.by,`${g.item} was marked ${status}.`);toast(`${g.item}: ${status}`);render()}
function acceptRequest(id){const r=state.requests.find(x=>x.id===id);if(!r)return;r.status='Accepted';r.owner=state.currentUser;notify(r.by,`${state.currentUser} accepted your request: ${r.title}.`);toast('Request accepted.');render()}
function denyRequest(id){const r=state.requests.find(x=>x.id===id);if(!r)return;r.status='Denied';notify(r.by,`${state.currentUser} denied your request: ${r.title}.`);toast('Request denied.');render()}
async function removeEvent(id){const ev=state.events.find(e=>String(e.id)===String(id));if(ev?.backend){const {error}=await window.FQAuth.client.rpc('delete_calendar_event',{p_id:id});if(error){toast(error.message);return}await loadRealCalendarEvents()}else state.events=state.events.filter(e=>String(e.id)!==String(id));toast('Calendar event removed.');render()}
function openDayZoom(ds){const d=new Date(ds+'T12:00:00'),evs=state.events.filter(e=>dateKey(e.start)===ds),reqs=state.requests.filter(r=>dateKey(r.start)===ds);$('#dayDialogTitle').textContent=d.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric',year:'numeric'});$('#dayDialogBody').innerHTML=`<div class="row"><div class="kicker">DAY DETAIL</div><button type="button" class="primary" data-action="day-full" data-date="${ds}">Open Full Day View</button></div><div class="section-title"><h3>Calendar</h3></div><div class="simple-list">${evs.map(eventCard).join('')||'<div class="empty">No events.</div>'}</div>${reqs.length?`<div class="section-title"><h3>Family Requests</h3></div><div class="simple-list">${reqs.map(r=>`<div class="simple-item"><h4>${esc(r.title)}</h4><p>${fmt(r.start)} → ${fmt(r.end)} · ${r.by} · ${r.status}</p></div>`).join('')}</div>`:''}`;$('#dayDialog').showModal()}
function moveCalendar(dir){const d=cursorDate();if(state.calendarMode==='month')d.setMonth(d.getMonth()+dir);else if(state.calendarMode==='week')d.setDate(d.getDate()+7*dir);else d.setDate(d.getDate()+dir);setCursor(d);render()}
function calendarToday(){setCursor(new Date('2026-08-30T12:00:00'));render()}

function openQuick(type='grocery',eventId=null){if(type==='chore'){toast('Only admins can create chores from Admin.');return}state.editingCalendarId=eventId;$('#quickType').value=type;const ev=eventId?state.events.find(x=>String(x.id)===String(eventId)):null,rewardEdit=ev?.backend&&ev?.sourceType==='reward';$('#quickTitle').value=ev?.title||'';$('#quickNotes').value=ev?.details?.notes||ev?.notes||'';renderQuickFields();if(ev&&type==='calendar'){$('#quickStart').value=toInput(ev.start);$('#quickEnd').value=toInput(ev.end);$('#quickFor').value=ev.for||'Household';if(rewardEdit){$('#quickTitle').readOnly=true;$('#quickNotes').readOnly=true;$('#quickFor').readOnly=true;$('#quickDynamic').insertAdjacentHTML('afterbegin','<div class="notice full">Approved reward event: Admin may adjust the date/time only.</div>')}}else{$('#quickTitle').readOnly=false;$('#quickNotes').readOnly=false}$('#quickDialog').showModal()}
function renderQuickFields(){const t=$('#quickType').value;$('#quickTitle').readOnly=false;$('#quickNotes').readOnly=false;if(t==='calendar'||t==='request')$('#quickDynamic').innerHTML=`<div class="form-grid"><label>Start<input type="datetime-local" id="quickStart" required></label><label>End<input type="datetime-local" id="quickEnd" required></label>${t==='calendar'?'<label class="full">For<input id="quickFor" placeholder="Household"></label>':''}</div>`;else $('#quickDynamic').innerHTML=''}
async function submitQuick(e){e.preventDefault();const type=$('#quickType').value,title=$('#quickTitle').value.trim(),notes=$('#quickNotes').value.trim();if(!title){toast('Enter a title.');return}
 if(type==='grocery'&&window.FQAuth?.realSession){$('#quickDialog').close();await realAddGrocery(title,notes);return}
 if(type==='grocery')state.groceries.unshift({id:Date.now(),item:title,by:state.currentUser,status:'Requested',notes});
 if(type==='request'){const start=$('#quickStart').value,end=$('#quickEnd').value;if(!start||!end){toast('Enter start and end date/time.');return}if(window.FQAuth?.realSession){$('#quickDialog').close();await realCreateFamilyRequest(title,start,end,notes);return}state.requests.unshift({id:Date.now(),title,by:state.currentUser,start,end,status:'Open',notes})}
 if(type==='calendar'){const start=$('#quickStart').value,end=$('#quickEnd').value;if(!start||!end){toast('Enter start and end date/time.');return}
   if(window.FQAuth?.realSession){const {error}=await window.FQAuth.client.rpc('save_calendar_event',{p_id:state.editingCalendarId||null,p_title:title,p_start_at:new Date(start).toISOString(),p_end_at:new Date(end).toISOString(),p_audience:$('#quickFor').value.trim()||'household',p_notes:notes||null});if(error){toast(error.message);return}await loadRealCalendarEvents();}
   else if(state.editingCalendarId){const ev=state.events.find(x=>String(x.id)===String(state.editingCalendarId));if(ev)Object.assign(ev,{title,start,end,for:$('#quickFor').value.trim()||'Everyone',notes})}
   else state.events.unshift({id:Date.now(),title,start,end,by:state.currentUser,for:$('#quickFor').value.trim()||'Everyone',notes});
 }
 state.editingCalendarId=null;$('#quickDialog').close();toast(`${title} ${type==='calendar'?'saved':'added'}.`);render()}


function resolveLottery(reward,u){
 if(!reward||!u||u.rp<reward.cost||rewardUsedThisMonth(reward.id,u.name))return;
 u.rp-=reward.cost;

 const roll=Math.random()*100;
 let result='',xp=0,rp=0,voucher=null;

 if(roll<40){
   result='Better luck next time — no prize this ticket.';
 }else if(roll<65){
   rp=25; result='You won 25 RP!';
 }else if(roll<80){
   rp=50; result='You won 50 RP!';
 }else if(roll<90){
   xp=100; result='You won 100 XP!';
 }else if(roll<96){
   rp=100; result='You won 100 RP!';
 }else if(roll<99){
   rp=200; result='BIG WIN: You won 200 RP!';
 }else{
   xp=250;rp=250;result='JACKPOT: You won 250 XP and 250 RP!';
 }

 if(rp)u.rp+=rp;
 if(xp)u.xp+=xp;

 const redemption={
   id:Date.now(),user:u.name,rewardId:reward.id,title:reward.title,cost:reward.cost,
   status:'Resolved',details:{lotteryResult:result,xp,rp,voucher},month:monthKey()
 };
 state.redemptions.push(redemption);

 if(voucher){
   state.redemptions.push({
     id:Date.now()+1,user:u.name,rewardId:0,title:`Lottery Prize — ${voucher}`,
     cost:0,status:'Approved',details:{lotteryVoucher:voucher},month:monthKey()
   });
 }
 notify(u.name,`🎟️ RP Lottery result: ${result}`);
 toast(`🎟️ ${result}`);
 render();
}
function openReward(id){
 const r=state.rewards.find(x=>String(x.id)===String(id)),u=currentUser();
 const powerLock=r?xpPowerupLockFor(r):null;
 if(powerLock){toast(powerLock);return}
 if(!r||!r.active||u.rp<r.cost||(r.kind!=='lottery'&&rewardUsedThisMonth(id,u.name)))return;
 if(r.kind==='lottery'&&r.backend){realRequestReward(r,{});return}
 if(r.kind==='lottery'){resolveLottery(r,u);return}
 state.rewardDraft=id;
 $('#rewardDialogTitle').textContent=r.title;
 let b=`<p class="muted">${esc(r.desc)}</p>`;
 if(r.kind==='dinner'){
   b+=`<label>Dinner Choice<input id="rewardMeal" required placeholder="Pizza"></label>
       <label>Dinner Date<input type="date" id="rewardDate" required></label>
       <p class="notice">Admins can adjust the dinner choice or date before approval.</p>`;
 }
 if(r.kind==='dated-choice'){
   b+=`<label>${esc(r.choiceLabel||'Choice')}<input id="rewardChoice" required placeholder="Enter your choice"></label>
       <label>Date<input type="date" id="rewardDate" required></label>
       <p class="notice">Admins can adjust the choice or date before approval.</p>`;
 }
 if(r.kind==='multiplier'){b+=`<div class="notice">${r.templateKey==='triple_xp_day'?'3×':'2×'} XP activates immediately when claimed and lasts until midnight. No Admin approval is required.</div>`;}
 if(r.kind==='pass'){
   const wanted=r.templateKey==='pass_chore_week'?'Weekly':'Daily';
   const mine=state.chores.filter(c=>c.assigned===u.name&&c.status==='Open'&&c.active!==false&&c.type===wanted);
   b+=`<label>Chore<select id="rewardChore">${mine.map(c=>`<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label>
       <label>Pass To<select id="rewardTarget">${state.users.filter(x=>x.name!==u.name).map(x=>`<option>${x.name}</option>`).join('')}</select></label>`;
 }
 if(r.kind==='chore'){
   const mine=state.chores.filter(c=>owner(c)===u.name&&c.status==='Open'&&c.active!==false);
   b+=`<label>Chore<select id="rewardChore">${mine.map(c=>`<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label>`;
 }
 $('#rewardDialogBody').innerHTML=b;
 $('#rewardDialog').showModal();
}
async function submitReward(e){
 e.preventDefault();
 const id=state.rewardDraft,r=state.rewards.find(x=>String(x.id)===String(id)),u=currentUser();
 if(!r)return;
 const details={};
 if(r.kind==='dinner'){
   details.meal=$('#rewardMeal').value.trim();
   details.date=$('#rewardDate').value;
   if(!details.meal||!details.date){toast('Enter dinner and date.');return}
 }
 if(r.kind==='dated-choice'){
   details.choice=$('#rewardChoice').value.trim();
   details.date=$('#rewardDate').value;
   if(!details.choice||!details.date){toast('Enter your choice and date.');return}
 }
 
 if(r.kind==='pass'){
   details.choreId=$('#rewardChore').value;
   details.target=$('#rewardTarget').value;
   if(!details.choreId){toast('No eligible assigned chore to pass.');return}
 }
 if(r.kind==='chore'){
   details.choreId=$('#rewardChore').value;
   if(!details.choreId){toast('No eligible chore.');return}
 }
 if(r.backend){
   if(r.kind==='pass'){
     const chore=state.chores.find(c=>String(c.id)===String(details.choreId));
     const target=state.users.find(x=>x.name===details.target);
     details.choreId=chore?.id||details.choreId;details.targetUserId=target?.id||null;
   }
   const ok=await realRequestReward(r,details);
   if(ok){$('#rewardDialog').close();toast(r.kind==='multiplier'?`${r.templateKey==='triple_xp_day'?'3×':'2×'} XP activated until midnight.`:'Reward sent for approval.')}
   return;
 }
 state.redemptions.push({id:Date.now(),user:u.name,rewardId:r.id,title:r.title,cost:r.cost,status:'Pending',details,month:monthKey()});
 $('#rewardDialog').close();toast('Reward sent for approval.');render();
}
function approveReward(id){
 const red=state.redemptions.find(x=>x.id===id),u=state.users.find(x=>x.name===red?.user);
 if(!red||!u)return;
 const def=state.rewards.find(x=>x.id===red.rewardId);
 if(!def)return;

 const dateInput=document.querySelector(`[data-reward-date="${id}"]`);
 if(dateInput&&red.details)red.details.date=dateInput.value;

 if((def.kind==='dinner'||def.kind==='dated-choice')&&datedRewardConflict(red)){
   toast('That date is already reserved by another dated reward. Choose another date first.');
   return;
 }
 if(u.rp<red.cost){toast('User no longer has enough RP.');return}

 u.rp-=red.cost;
 red.status='Approved';

 if(def.kind==='pass'){
   const c=state.chores.find(x=>x.id===red.details.choreId);
   if(c){
     c.assigned=red.details.target;
     c.claimedBy=null;
     notify(red.details.target,`${red.user} blessed you with a Chore Pass: ${c.title}.`);
   }
 }

 if(def.kind==='dinner'){
   state.events.push({
     id:Date.now()+1,
     title:`Dinner Pick: ${red.details.meal}`,
     start:red.details.date+'T18:00',
     end:red.details.date+'T20:00',
     by:red.user,
     for:'Everyone'
   });
   notify(red.user,`Your Pick Dinner reward was approved for ${red.details.date}: ${red.details.meal}.`);
 }else if(def.kind==='dated-choice'){
   const prefix=def.calendarPrefix||def.title;
   state.events.push({
     id:Date.now()+1,
     title:`${prefix}: ${red.details.choice}`,
     start:red.details.date+'T18:00',
     end:red.details.date+'T20:00',
     by:red.user,
     for:'Everyone'
   });
   notify(red.user,`${red.title} approved for ${red.details.date}: ${red.details.choice}.`);
 }else if(def.kind!=='pass'){
   notify(red.user,`${red.title} approved. ${red.cost} RP spent.`);
 }

 toast('Reward approved.');
 render();
}
function denyReward(id){const r=state.redemptions.find(x=>x.id===id);if(!r)return;r.status='Denied';notify(r.user,`${r.title} was denied. No RP spent.`);toast('Reward denied.');render()}

function openAdminEditor(type,id=null){
  if(!isAdmin())return;
  state.editing={type,id};

  let obj=null;
  if(id){
    if(type==='chore')obj=state.chores.find(x=>String(x.id)===String(id));
    else if(type==='reward')obj=state.rewards.find(x=>String(x.id)===String(id));
    else if(type==='achievement')obj=state.achievements.find(x=>x.id===id);
  }

  const prettyType=type==='chore'?'Chore':type==='reward'?'Reward':'Achievement';
  $('#adminEditorTitle').textContent=`${id?'Edit':'Create'} ${prettyType}`;

  if(type==='chore'){
    $('#adminEditorBody').innerHTML=`<div class="form-grid"><label class="full">Title<input id="aeTitle" value="${esc(obj?.title||'')}" required></label><label>Type<select id="aeType"><option ${obj?.type==='Daily'?'selected':''}>Daily</option><option ${obj?.type==='Weekly'?'selected':''}>Weekly</option><option ${obj?.type==='One-Off'?'selected':''}>One-Off</option><option ${obj?.type==='Seasonal'?'selected':''}>Seasonal</option></select></label><label>Assigned To<select id="aeAssigned"><option value="">Unassigned</option>${state.users.map(u=>`<option ${obj?.assigned===u.name?'selected':''}>${u.name}</option>`).join('')}</select></label><label>XP<input type="number" id="aeXp" min="0" value="${obj?.xp??20}" required></label><label>Bounty $<input type="number" id="aeBounty" min="0" value="${obj?.bounty??0}"></label><label class="full">Due Date / Time<input type="datetime-local" id="aeDue" value="${toInput(obj?.due||'')}" required></label><label class="full">What Counts as Complete<textarea id="aeDetails" placeholder="One expectation per line">${esc((obj?.details||[]).join('\n'))}</textarea></label><label class="full">Finished-Look Reference Photo<input type="file" accept="image/*" id="aePhoto"></label>${obj?.photo?`<div class="full"><img class="chore-photo" src="${obj.photo}"></div>`:''}</div>`;
  }else if(type==='reward'){
    $('#adminEditorTitle').textContent=`Reward Price — ${esc(obj?.title||'Reward')}`;
    $('#adminEditorBody').innerHTML=`<div class="form-grid"><div class="full notice">Only the RP price is editable. Reward behavior and rules stay protected.</div><label>Cost RP<input type="number" id="aeCost" min="0" step="1" value="${obj?.cost??100}" required></label></div>`;
  }else{
    $('#adminEditorBody').innerHTML=`<div class="form-grid"><label>Icon / Emoji<input id="aeIcon" value="${esc(obj?.icon||'🏆')}" maxlength="8"></label><label>Visibility<select id="aeHidden"><option value="false" ${!obj?.hidden?'selected':''}>Visible</option><option value="true" ${obj?.hidden?'selected':''}>Secret</option></select></label><label class="full">Achievement Name<input id="aeTitle" value="${esc(obj?.title||'')}" required placeholder="Example: Clean Sweep"></label><label class="full">Unlock Requirement / Description<textarea id="aeDesc" required placeholder="Example: Complete every assigned chore in one day.">${esc(obj?.desc||'')}</textarea></label><div class="full notice">Visible locked achievements show their requirement. Secret achievements appear as “Secret Achievement” until unlocked.</div></div>`;
  }

  $('#adminEditor').showModal();
}

function submitAdminEditor(e){
  e.preventDefault();
  const {type,id}=state.editing||{};

  if(type==='chore'){
    const obj=id?state.chores.find(x=>x.id===id):null;
    const data={title:$('#aeTitle').value.trim(),type:$('#aeType').value,assigned:$('#aeAssigned').value||null,claimedBy:obj?.claimedBy||null,xp:Number($('#aeXp').value),bounty:Number($('#aeBounty').value||0),due:$('#aeDue').value,status:obj?.status||'Open',details:$('#aeDetails').value.split('\n').map(x=>x.trim()).filter(Boolean),photo:obj?.photo||null,isGroceryRun:obj?.isGroceryRun||false};
    if(!data.title||!data.due){toast('Title and real due date/time are required.');return}
    const file=$('#aePhoto').files?.[0];
    if(realChoresEnabled()){
      if(file){toast('Reference photo storage will be connected in the media migration. Existing photo selection was not saved.')}
      const assignedId=memberIdByName(data.assigned);
      window.FQAuth.client.rpc('save_chore_definition',{p_id:obj?.id||null,p_title:data.title,p_category:obj?.category||'Other',p_frequency:frequencyValue(data.type),p_assigned_user_id:assignedId,p_xp:data.xp,p_bounty_cents:Math.round(data.bounty*100),p_due_at:data.due||null,p_expectations:data.details,p_active:obj?.active!==false}).then(async({error})=>{if(error){toast(error.message);return}$('#adminEditor').close();toast('Chore saved to Family Quest.');await loadRealChores();render()});return;
    }
    const finish=photo=>{if(photo)data.photo=photo;if(obj)Object.assign(obj,data);else state.chores.push({id:Date.now(),...data});$('#adminEditor').close();toast('Chore saved.');render()};
    if(file){const reader=new FileReader();reader.onload=()=>finish(reader.result);reader.readAsDataURL(file)}else finish(null);
    return;
  }

  if(type==='reward'){
    const obj=id?state.rewards.find(x=>String(x.id)===String(id)):null,cost=Number($('#aeCost').value);
    if(!obj||!Number.isInteger(cost)||cost<0){toast('Enter a whole-number RP price of zero or greater.');return}
    if(obj.backend&&window.FQAuth?.realSession){window.FQAuth.client.rpc('update_reward_price',{p_reward_id:obj.id,p_cost_rp:cost}).then(async({error})=>{if(error){toast(error.message);return}$('#adminEditor').close();await loadRealRewards();toast(`${obj.title} price updated to ${cost} RP.`);render()});return}
    obj.cost=cost;$('#adminEditor').close();toast(`${obj.title} price updated.`);render();return;
  }

  if(type==='achievement'){
    const obj=id?state.achievements.find(x=>x.id===id):null;
    const data={title:$('#aeTitle').value.trim(),desc:$('#aeDesc').value.trim(),icon:$('#aeIcon').value.trim()||'🏆',hidden:$('#aeHidden').value==='true'};
    if(!data.title||!data.desc){toast('Achievement name and requirement are required.');return}
    if(obj)Object.assign(obj,data);
    else{
      const nextId=state.achievements.reduce((m,a)=>Math.max(m,Number(a.id)||0),0)+1;
      state.achievements.push({id:nextId,...data,unlockedBy:[]});
    }
    $('#adminEditor').close();toast('Achievement saved.');render();return;
  }
}

function removeAdminItem(type,id){
  if(!isAdmin())return;
  if(type==='chore')state.chores=state.chores.filter(x=>x.id!==id);
  else if(type==='reward')state.rewards=state.rewards.filter(x=>x.id!==id);
  else if(type==='achievement')state.achievements=state.achievements.filter(x=>x.id!==id);
  toast('Removed.');
  render();
}
function openProfile(){
 const u=currentUser();
 $('#profileAvatarId').value=u.avatarId||'dog';
 $('#profileTitle').value=u.title;
 renderSpritePicker();
 $('#profileDialog').showModal();
}
function renderSpritePicker(){
 const u=currentUser(),selected=$('#profileAvatarId').value;
 $('#spritePicker').innerHTML=SPRITES.map(s=>{
   const unlocked=spriteUnlocked(u,s);
   const linkedAchievement=s.achievement||state.achievements.find(a=>a.id===s.achievementId)?.title;
   const secretAchievement=(s.secret||linkedAchievement&&state.achievements.find(a=>a.title===linkedAchievement)?.hidden)&&!unlocked;
   const requirement=s.default?'Default Sprite':(secretAchievement?'Secret Achievement':s.method==='rp_shop'?`Sprite Shop · ${s.price||0} RP`:(s.requirement||`Unlock: ${linkedAchievement||'Achievement'}`));
   return `<button type="button" class="sprite-choice ${selected===s.id?'selected':''} ${unlocked?'':'locked'}" data-action="sprite-select" data-sprite="${s.id}" ${unlocked?'':'disabled'}>
     <span class="sprite-choice-icon">${unlocked?spriteVisual(s,'picker-art'):'🔒'}</span>
     <strong>${unlocked?esc(s.name):'Locked Sprite'}</strong>
     <small>${esc(requirement)}</small>
   </button>`;
 }).join('');
}
function submitProfile(e){
 e.preventDefault();
 const u=currentUser(),id=$('#profileAvatarId').value,s=spriteById(id);
 if(!spriteUnlocked(u,s)){toast('That sprite is still locked.');return}
 if(window.FQAuth?.realSession){equipCosmetic(s.id).then(ok=>{if(ok){u.title=$('#profileTitle').value.trim()||u.title;$('#profileDialog').close();render()}});return}
 u.avatarId=s.id;
 u.avatar=s.icon;
 u.title=$('#profileTitle').value.trim()||u.title;
 $('#profileDialog').close();
 toast(`${s.name} equipped.`);
 render();
}

function openUserDialog(id=null){
 if(!isAdmin())return;
 const u=id?state.users.find(x=>x.id===Number(id)):null;
 $('#userDialogTitle').textContent=u?'Edit User':'Add User';
 $('#userId').value=u?.id||'';
 $('#userName').value=u?.name||'';
 $('#userRole').value=u?.role||'Family Member';
 $('#userSprite').innerHTML=SPRITES.filter(s=>s.default).map(s=>`<option value="${s.id}">${s.icon} ${esc(s.name)}</option>`).join('');
 $('#userSprite').value=u?.avatarId||'dog';
 $('#userDialog').showModal();
}
function submitUser(e){
 e.preventDefault();if(!isAdmin())return;
 const id=Number($('#userId').value||0),name=$('#userName').value.trim(),role=$('#userRole').value,sprite=spriteById($('#userSprite').value);
 if(!name){toast('Enter a display name.');return}
 if(state.users.some(u=>u.name.toLowerCase()===name.toLowerCase()&&u.id!==id)){toast('That user name already exists.');return}
 if(id){
  const u=state.users.find(x=>x.id===id);if(!u)return;
  const old=u.name;u.name=name;u.role=role;u.avatarId=sprite.id;u.avatar=sprite.icon;
  if(old!==name){
   (state.chores||[]).forEach(c=>{if(c.assigned===old)c.assigned=name;if(c.claimedBy===old)c.claimedBy=name});
   (state.redemptions||[]).forEach(r=>{if(r.user===old)r.user=name;if(r.details?.target===old)r.details.target=name});
   (state.events||[]).forEach(ev=>{if(ev.by===old)ev.by=name;if(ev.for===old)ev.for=name});
   (state.notifications||[]).forEach(n=>{if(n.user===old)n.user=name});
   (state.achievements||[]).forEach(a=>{a.unlockedBy=a.unlockedBy.map(v=>v===old?name:v)});
   if(state.currentUser===old)state.currentUser=name;
   if(state.previewUser===old)state.previewUser=name;
  }
 }else{
  state.users.push({id:nextUserId(),name,role,active:true,avatar:sprite.icon,avatarId:sprite.id,title:'New Adventurer',xp:0,lifetime:0,rp:0,streak:0,bestStreak:0});
 }
 $('#userDialog').close();toast(id?'User updated.':'User added.');render();
}
function deactivateUser(id){
 if(!isAdmin())return;
 const u=state.users.find(x=>x.id===Number(id));if(!u||u.name===signedInUser().name)return;
 u.active=false;if(state.previewUser===u.name)state.cosmeticCatalog=[];
state.previewUser=null;
 toast(`${u.name} deactivated. History preserved.`);render();
}
function reactivateUser(id){
 if(!isAdmin())return;
 const u=state.users.find(x=>x.id===Number(id));if(!u)return;
 u.active=true;toast(`${u.name} reactivated.`);render();
}
function previewUser(id){
 if(!isAdmin())return;
 const u=state.users.find(x=>x.id===Number(id));if(!u||u.active===false)return;
 state.previewUser=u.name;toast(`Admin Preview: ${u.name}`);render();
}
function exitPreview(){state.cosmeticCatalog=[];
state.previewUser=null;toast('Exited Admin Preview.');render()}

function seasonResetSnapshot(){
 return state.users.map(u=>{
  const earned=state.achievements.filter(a=>a.unlockedBy.includes(u.name));
  return {
   name:u.name,
   seasonXP:u.xp||0,
   level:levelOf(u),
   rp:u.rp||0,
   lifetime:u.lifetime||0,
   achievementCount:earned.length,
   achievements:earned.map(a=>({id:a.id,name:a.name,icon:a.icon,secret:!!a.secret})),
   sprite:userSprite(u).name
  };
 });
}
async function openSeasonResetDialog(mode){
 if(!isAdmin())return;let snap=null;
 if(window.FQAuth?.realSession){const {data,error}=await window.FQAuth.client.rpc('preview_season_reset');if(error){toast(error.message);return}snap=data}
 else snap={currentSeason:state.seasonYear,newSeason:state.seasonYear+1,members:seasonResetSnapshot().map(x=>({name:x.name,seasonXP:x.seasonXP,rewardPoints:x.rp}))};
 const oldYear=Number(snap.currentSeason??state.seasonYear),newYear=Number(snap.newSeason??oldYear+1),members=snap.members||[];
 $('#seasonDialogTitle').textContent=mode==='manual'?'Reset Season':'Preview Season Reset';
 $('#seasonDialogBody').innerHTML=`<p class="muted">Admin decides when to reset. Season ${oldYear} will be archived and the household will move to Season ${newYear}.</p><div class="notice">Resets: seasonal XP, level, current/best streak, streak milestone progress, and seasonal achievement progress. Keeps: RP, lifetime XP, history/archive, permanent cosmetic unlocks, and current cosmetic selection.</div><div class="reset-preview" style="margin-top:12px">${members.map(x=>`<div><strong>${esc(x.name||'Member')}</strong> — ${Number(x.seasonXP||0).toLocaleString()} XP → 0 XP / Lv 1 · ${Number(x.rewardPoints||0)} RP kept</div>`).join('')}</div>${mode==='manual'?`<label>Type RESET ${oldYear}<input id="seasonConfirmText"></label>`:''}`;
 $('#seasonConfirmButton').textContent=mode==='preview'?'Close':'Reset Season';$('#seasonForm').dataset.mode=mode;$('#seasonForm').dataset.year=String(oldYear);$('#seasonDialog').showModal();
}
function performSeasonReset(mode='Manual'){
 const oldYear=state.seasonYear;
 state.seasonHistory.push({year:oldYear,closedAt:new Date().toISOString(),users:seasonResetSnapshot()});
 state.users.forEach(u=>{u.xp=0;u.streak=0});
 // Achievements are seasonal: archive the earned list above, then re-lock them for the new season.
 // Cosmetic sprite selections/unlocks are intentionally not removed.
 state.achievements.forEach(a=>{a.unlockedBy=[]});
 state.seasonYear=oldYear+1;
 state.seasonResetAudit.push({when:new Date().toLocaleString(),mode,by:signedInUser().name,season:String(oldYear)});
}
async function submitSeasonReset(e){
 e.preventDefault();const mode=$('#seasonForm').dataset.mode,oldYear=$('#seasonForm').dataset.year;
 if(mode==='preview'){$('#seasonDialog').close();return}
 const confirm=($('#seasonConfirmText')?.value||'').trim(),want=`RESET ${oldYear}`;if(confirm!==want){toast(`Type ${want} exactly.`);return}
 if(window.FQAuth?.realSession){const {data,error}=await window.FQAuth.client.rpc('admin_reset_season',{p_confirm:confirm});if(error){toast(error.message);return}await window.FQAuth.refreshIdentity?.();await Promise.all([loadRealHouseholdMembers(),loadRealAchievements(),loadRealNotifications()]);state.seasonYear=Number(data?.newSeason||Number(oldYear)+1);$('#seasonDialog').close();toast(`Season ${state.seasonYear} started.`);render();return}
 performSeasonReset('Manual reset');$('#seasonDialog').close();toast('Season reset complete.');render();
}

function bindCosmeticPriceButtons(){
 document.querySelectorAll('.cosmetic-price-btn').forEach(btn=>{
   btn.onclick=function(e){
     e.preventDefault();
     e.stopPropagation();
     window.openCosmeticPriceDialog(this.dataset.cosmetic);
   };
 });
}

window.openCosmeticPriceDialog=function(id){
 const c=state.cosmetics.find(x=>String(x.id)===String(id));
 if(!c){toast('Sprite not found.');return false}
 if(!isAdmin()){toast('Admin permission required.');return false}
 const dlg=document.getElementById('cosmeticPriceDialog');
 const idInput=document.getElementById('cosmeticPriceId');
 const title=document.getElementById('cosmeticPriceTitle');
 const price=document.getElementById('cosmeticPriceValue');
 if(!dlg||!idInput||!title||!price){toast('Sprite price dialog is unavailable.');return false}
 idInput.value=String(c.id);
 title.textContent=`Set Price · ${c.name}`;
 price.value=String(Number(c.price_rp||0));
 if(typeof dlg.showModal==='function') dlg.showModal(); else dlg.setAttribute('open','');
 setTimeout(()=>price.focus(),0);
 return false;
};

async function submitCosmeticPrice(e){
 e.preventDefault();
 const id=String($('#cosmeticPriceId').value||'');
 const price=Number($('#cosmeticPriceValue').value);
 const c=state.cosmetics.find(x=>String(x.id)===id);
 if(!c){toast('Sprite not found.');return}
 if(!isAdmin()){toast('Admin permission required.');return}
 if(!Number.isInteger(price)||price<0){toast('Enter a whole-number RP price of zero or greater.');return}
 if(window.FQAuth?.realSession){
   const {error}=await window.FQAuth.client.rpc('update_cosmetic_price',{p_cosmetic_id:id,p_price_rp:price});
   if(error){toast(error.message);return}
   await loadRealCosmetics();
 }else{
   c.price_rp=price;
 }
 $('#cosmeticPriceDialog').close();
 toast(`${c.name} price updated to ${price} RP.`);
 render();
}

function handleClick(e){const btn=e.target.closest('button,[data-action]');if(!btn)return;const action=btn.dataset.action;
 if(action==='user-add'){openUserDialog();return}
 if(action==='user-edit'){openUserDialog(btn.dataset.id);return}
 if(action==='user-deactivate'){deactivateUser(btn.dataset.id);return}
 if(action==='user-reactivate'){reactivateUser(btn.dataset.id);return}
 if(action==='preview-user'){previewUser(btn.dataset.id);return}
 if(action==='preview-exit'){exitPreview();return}
 if(action==='season-preview'){openSeasonResetDialog('preview');return}
 if(action==='season-reset'){openSeasonResetDialog('manual');return}
 if(action==='admin-cosmetic-price-save'){
 const id=String(btn.dataset.id||'');
 const c=state.cosmeticCatalog.find(x=>String(x.id)===id);
 if(!c){toast('Sprite not found.');return}
 const input=document.querySelector(`[data-admin-cosmetic-price="${CSS.escape(id)}"]`);
 const price=Number(input?.value);
 if(!Number.isInteger(price)||price<0){toast('Enter a whole-number RP price of zero or greater.');return}
 if(window.FQAuth?.realSession){
   window.FQAuth.client.rpc('update_cosmetic_price',{p_cosmetic_id:id,p_price_rp:price}).then(async({error})=>{
     if(error){toast(error.message);return}
     await loadRealCosmetics();
     toast(`${c.name} price updated to ${price} RP.`);
     render();
   }).catch(err=>{console.error(err);toast('Could not update sprite price.')});
   return
 }
 c.price_rp=price;toast(`${c.name} price updated to ${price} RP.`);render();return
}

 const previewBlocked=['chore-complete','chore-claim','grocery-add','grocery-status','request-create','request-accept','request-deny','reward-open','reward-redeem','profile-open','event-add','event-delete'];
 if(isPreviewing()&&previewBlocked.includes(action)){toast('Exit Admin Preview before making changes.');return}
if(btn.dataset.view){state.view=btn.dataset.view;render();return}if(btn.dataset.viewJump){state.view=btn.dataset.viewJump;render();return}if(action==='cosmetic-buy'){purchaseCosmetic(btn.dataset.cosmetic);return}
 if(action==='cosmetic-equip'){equipCosmetic(btn.dataset.cosmetic).then(ok=>{if(ok)render()});return}if(action==='achievement-claim'){realClaimAchievement(btn.dataset.id);return}if(action==='reward-save-real'){realSaveRewardEdits(btn.dataset.redemption);return}if(action==='reward-approve-real'){realReviewReward(btn.dataset.redemption,'approve');return}if(action==='reward-deny-real'){realReviewReward(btn.dataset.redemption,'deny');return}if(!action)return;if(action==='dialog-close'){$('#'+btn.dataset.dialog).close();return}if(action==='quick-open'){openQuick(btn.dataset.type||'grocery');return}if(action==='test-achievement'){celebrate('I Was Getting To It','Completed a chore suspiciously close to the deadline.');return}if(action==='chore-detail'){openChoreDetail(btn.dataset.id);return}if(action==='chore-claim'){e.stopPropagation();const c=state.chores.find(x=>String(x.id)===String(btn.dataset.id));if(c?.backend){realClaimChore(c);return}claimChore(Number(btn.dataset.id));return}if(action==='chore-complete'){e.stopPropagation();const c=state.chores.find(x=>String(x.id)===String(btn.dataset.id));if(c?.backend){realCompleteChore(c);return}completeChore(Number(btn.dataset.id));return}if(action==='chore-approve'&&btn.dataset.completion){realReviewCompletion(btn.dataset.completion,'approve');return}if(action==='chore-sendback'&&btn.dataset.completion){realReviewCompletion(btn.dataset.completion,'send_back');return}if(action==='chore-deny'&&btn.dataset.completion){realReviewCompletion(btn.dataset.completion,'deny');return}if(action==='chore-approve'){approveChore(Number(btn.dataset.id));return}if(action==='chore-sendback'){sendBackChore(Number(btn.dataset.id));return}if(action==='chore-deny'){denyChore(Number(btn.dataset.id));return}if(action==='grocery-status'){const g=state.groceries.find(x=>String(x.id)===String(btn.dataset.id));if(g?.backend){realSetGroceryStatus(btn.dataset.id,btn.dataset.status);return}setGroceryStatus(Number(btn.dataset.id),btn.dataset.status);return}if(action==='request-accept'){const r=state.requests.find(x=>String(x.id)===String(btn.dataset.id));if(r?.backend){realRespondFamilyRequest(btn.dataset.id,'accept');return}acceptRequest(Number(btn.dataset.id));return}if(action==='request-deny'){const r=state.requests.find(x=>String(x.id)===String(btn.dataset.id));if(r?.backend){realRespondFamilyRequest(btn.dataset.id,'deny');return}denyRequest(Number(btn.dataset.id));return}if(action==='event-edit'){e.stopPropagation();openQuick('calendar',btn.dataset.id);return}if(action==='event-remove'){e.stopPropagation();removeEvent(btn.dataset.id);return}if(action==='day-zoom'){openDayZoom(btn.dataset.date);return}if(action==='day-full'){state.calendarCursor=btn.dataset.date;state.calendarMode='day';$('#dayDialog').close();render();return}if(action==='calendar-mode'){state.calendarMode=btn.dataset.mode;render();return}if(action==='calendar-move'){moveCalendar(Number(btn.dataset.dir));return}if(action==='calendar-today'){calendarToday();return}if(action==='reward-open'){openReward(btn.dataset.id);return}if(action==='reward-approve'){approveReward(Number(btn.dataset.id));return}if(action==='reward-deny'){denyReward(Number(btn.dataset.id));return}if(action==='achievement-target'){state.achievementTarget=btn.dataset.user;render();return}if(action==='notif-read-all'){if(window.FQAuth?.realSession){realMarkAllNotificationsRead();return}state.notifications.filter(n=>n.user===state.currentUser).forEach(n=>n.read=true);render();return}if(action==='notif-read'){const n=state.notifications.find(x=>String(x.id)===String(btn.dataset.id));if(n?.backend){realMarkNotificationRead(btn.dataset.id);return}if(n)n.read=true;render();return}if(action==='admin-create'){openAdminEditor(btn.dataset.type);return}if(action==='admin-toggle'){if(btn.dataset.type==='chore'&&realChoresEnabled()){realToggleChore(btn.dataset.id);return}toggleActive(btn.dataset.type,btn.dataset.type==='reward'?btn.dataset.id:Number(btn.dataset.id));return}if(action==='admin-edit'){openAdminEditor(btn.dataset.type,(btn.dataset.type==='chore'&&realChoresEnabled())||btn.dataset.type==='reward'?btn.dataset.id:Number(btn.dataset.id));return}if(action==='admin-remove'){if(btn.dataset.type==='chore'&&realChoresEnabled()){toast('Deactivate real chores instead of deleting them so history is preserved.');return}removeAdminItem(btn.dataset.type,Number(btn.dataset.id));return}if(action==='sprite-select'){const s=spriteById(btn.dataset.sprite);if(!spriteUnlocked(currentUser(),s))return;$('#profileAvatarId').value=s.id;renderSpritePicker();return}if(action==='profile-open'){openProfile();return}}

document.addEventListener('click',handleClick);$('#userSelect')?.addEventListener('change',e=>{if(window.FQAuth?.realSession){toast('Use Admin Preview from Admin Control.');populateUsers();return}state.currentUser=e.target.value;state.achievementTarget=e.target.value;if(!isAdmin()&&state.view==='admin')state.view='home';render()});$('#quickType').addEventListener('change',renderQuickFields);$('#quickForm').addEventListener('submit',submitQuick);$('#rewardForm').addEventListener('submit',submitReward);$('#adminEditorForm').addEventListener('submit',submitAdminEditor);$('#profileForm').addEventListener('submit',submitProfile);$('#cosmeticPriceForm').addEventListener('submit',submitCosmeticPrice);$('#userForm').addEventListener('submit',submitUser);
$('#seasonForm').addEventListener('submit',submitSeasonReset);
window.addEventListener('load',()=>window.FQAuth.start());
