Family Quest v0.18 — Sprite Shop Foundation

Separate Sprite Shop using the same RP economy. Purchases are instant permanent cosmetic unlocks and do not require Admin approval. Achievement cosmetics remain earned-only. Existing cosmetic_unlocks inventory and profiles.selected_sprite_id are reused.

Initial RP prices (tunable): Red Ant 100; Derpy Dude 125; Taco Tuesday 150; Grumpy Girl 200; Dan Was Here 250; Duck Robot 350; Ekoh 1200.

The backend supports asset_path, but this build uses compact icon placeholders until the final PNG/WebP artwork files are placed into app/storage. The cosmetic catalog remains the art source of truth.

Battle Chicken note: the old placeholder 30-day streak mapping was removed because the intended new Battle Chicken rule is claim someone else's chore 10 times. That achievement rule will be wired in the achievement-rule pass.

PRE-DELIVERY: backend purchase/equip rollback PASS; insufficient-RP rollback PASS; JS syntax PASS; duplicate IDs PASS; auth API contract PASS; v0.17.5 helper audit PASS.

BROWSER: open Sprite Shop; buy an affordable sprite; confirm RP drops immediately; equip; refresh and confirm it persists; verify purchased sprite appears unlocked in Customize Profile; verify Rewards/Chores/XP HUD still load.


v0.18.1 HOTFIX
- Fixed Sprite Shop startup loader. v0.18 registered FQLoaders.cosmetics but auth startup did not invoke it, leaving state.cosmeticCatalog empty even though Supabase contained active shop items.
- Startup now loads cosmetics after identity refresh and before achievements.


v0.18.2 ARTWORK + SEASON POLICY
- Taco Tuesday now uses the supplied original artwork asset rather than the emoji placeholder.
- Added a single shared artwork renderer used by Sprite Shop, sidebar, Home/Profile HUD, leaderboard/profile cards, and Customize Profile.
- Cosmetics without packaged artwork still fall back safely to their placeholder icon.
- Backend asset_path for Taco Tuesday is assets/cosmetics/taco-tuesday.png.
- Season policy changed: there is NO automatic Jan 1 reset. Season rollover remains an Admin action named Start New Season; exact long-term season design is still intentionally open.
- Permanent cosmetic unlocks are not removed by season rollover.


v0.18.3 — REAL ACHIEVEMENT WAVE 1
Backend achievement rules now live:
- Robot Waiter: approved Pick Dinner 5 times.
- Snail: complete your assigned chore within the final 10 minutes before due time.
- Dog With Blanket: Feed Dogs 5 approved completions.
- Warrior Cat: Feed Cats 5 approved completions.
- Battle Chicken: claim another member's assigned chore 10 times.
- Trash Alien: Take Out Trash 10 approved completions.
- Fat Cat: approved Dessert Boss 5 times.

Achievement sprites now appear as a collection beneath the RP Shop with Locked / Ready to Claim / Unlocked state. Claiming an achievement refreshes cosmetic inventory immediately.

BACKEND ROLLBACK TESTS PASS:
- Feed Dogs 5 -> achievement -> Claim -> Dog With Blanket cosmetic unlock.
- Pick Dinner 5 -> Robot Waiter achievement.
- Nine prior cross-assignment claims + real 10th claim -> Battle Chicken achievement.

ART NOTE: Taco Tuesday's supplied artwork remains packaged and proven. The other finished original artwork exists in the project File Library/catalog, but those File Library image references are not available to this build runtime as raw image bytes. Their real cosmetic records/rules are wired now; icon fallback remains until those original PNGs are mounted/uploaded into a build conversation. No replacement art was fabricated.


v0.18.4 — ACHIEVEMENT WAVE 2 EXACT RULES
Corrected backend rules: Animal House = every pet-care chore once; Kitchen Confidential = every kitchen chore once; Clean Sweep = every general-cleaning chore once; Groundskeeper = Cut Grass + Weed Whack; Pool Boy = Vacuum Pool 5; Laundry Legend = Laundry 10; Porcelain Throne = both bathrooms; Litterally the Best = both litter chores same day; Who's a Good Human? = Feed Dogs + Dogs Water Bowl same day; Floor Manager = every vacuuming chore once; Whole House Hero = one approved chore from every official household category; Dishwasher Main remains 25.

A centralized achievement_rule_met guard prevents the older legacy trigger from prematurely awarding these corrected achievements. A second exact-evaluation trigger checks the corrected set after approved completions.

Rollback tests passed for Pool Boy 5, Litterally same-day pair, Animal House set, Kitchen set, Clean Sweep set, Groundskeeper pair, Floor Manager set, Porcelain Throne pair, Good Human same-day pair, and Laundry Legend 10.

No frontend redesign; Trophy Room loads corrected descriptions from Supabase.


v0.18.5 — CHORE LIFECYCLE + STREAK + BEHAVIORAL HARDENING
- Send Back now permits replacement submission; only Pending/Approved rows block another live completion.
- Proven Member complete -> Admin Send Back -> Member resubmit -> Admin approve. Historical Sent Back = 0 XP; replacement Approved = XP once.
- Broken streak cycles reset streak milestone tracking, allowing a fresh +200 XP when the player rebuilds to Day 7.
- The Streak Is Dead evaluates on a broken previously-paid streak cycle.
- Woods Skeleton is now a real secret achievement: a seven-day window with at least one assigned chore due and zero approved completions of the user's assigned chores.
- Trophy Room load calls refresh_behavioral_achievements so time-window achievements can unlock without requiring another chore event.

ROLLBACK TESTS PASS: Send Back/resubmit/approve; broken 7-day milestone reset 7 -> 0; rebuilt seven-day streak -> +200 and milestone 7. Frontend syntax/IDs/auth/helper regression PASS.

Vague chaos achievements (Absolute Menace / Tomorrow's Problem) were intentionally not guessed; define their exact conditions before wiring them.


v0.18.6 — FINAL BEHAVIORAL ACHIEVEMENT DEFINITIONS
Locked and implemented:
- Absolute Menace: claim 3 other family members' assigned chores in one day.
- Tomorrow's Problem: have 3 assigned chores overdue at the same time.
- Power Overwhelming: earn 1,000 XP in one day.
- The Cleaner: complete 5 Cleaning/Floors/Bathrooms chores in one day.
- The Streak Is Dead: build a 7-day streak, then break it.
- Rescue Mission: complete someone else's assigned chore after it becomes overdue.
- Fine, I'll Do It: complete someone else's assigned chore after 24+ hours overdue.

Backend triggers now evaluate claim behavior, approved chore behavior, daily XP, and time-based overdue conditions. Trophy Room's existing behavioral refresh handles Tomorrow's Problem.


v0.19.0 — HOUSEHOLD SYSTEMS WAVE 1
- Lottery vouchers removed; all lottery prizes resolve immediately as XP/RP.
- Groceries migrated to Supabase with requester/status/cleanup notifications.
- Calendar user events persist in Supabase; creator/Admin may manage normal events; reward events are protected.
- Persistent Supabase notifications with unread badge and Mark all read.
- 15 approved custom cosmetic PNGs packaged and resized to max 640px.


v0.19.1 — WAVE 1 BROWSER FIXES
- Grocery Shopping approval now refreshes groceries immediately; cleared Purchased/Denied rows disappear without a page refresh.
- Admin can adjust date/time on approved reward calendar events. Reward title/audience/notes remain protected and reward events still cannot be deleted directly.
- Calendar defaults to the current America/New_York date/month instead of the old August 2026 prototype cursor.


v0.19.2 — FAMILY REQUESTS + MANUAL SEASON CONTROL
- Fixed Admin auto-approved Grocery Shopping refresh.
- Family Requests migrated to Supabase with accept/deny and requester notifications.
- Season reset is Admin-controlled only: preview, then typed RESET <season> confirmation. No automatic reset and no simulation control.
- Reset archives the old season, resets seasonal XP/level/streak state, carries RP, and preserves permanent cosmetics/history.
- Calendar remains creator-editable for members and Admin-editable across the household; approved reward dates are Admin-adjustable.


v0.19.3 — COMPLETE COSMETIC ART PASS
- Added custom packaged artwork for all 10 default sprites.
- Added custom packaged artwork for all remaining active achievement cosmetics, including Disco Snail.
- The 15 user-supplied custom sprites are preserved unchanged.
- Cosmetic asset paths now cover every active cosmetic in Supabase; emoji remains only as a fallback if an image cannot load.


v0.19.4 — REWARD PRICE CONTROL + INSTANT XP POWER-UPS
- Admin Reward Management now allows RP price changes only.
- Double XP and Triple XP activate immediately when claimed; no date selection and no Admin approval.
- The power-up lasts through the current America/New_York calendar day and expires at midnight.
- Activating late does not extend the duration.
- A second multiplier cannot be activated while one is already active that day.


v0.19.5 — TEST RESET + SPRITE PRICE CONTROL
- Current-month non-lottery reward test redemptions were cleared from the development household; approved/resolved RP costs were refunded.
- Test XP multiplier rows tied to those redemptions were cleared so Double/Triple XP can be retested.
- Admin can change RP Shop sprite pricing directly in Sprite Shop.
- Sprite editing is price-only; achievement/default acquisition rules remain protected.


v0.19.6 — STABILIZATION PASS
- Instant Double/Triple XP activation now reloads identity/RP, reward usage, XP multiplier state, household data and notifications before rerendering.
- Successful XP activation gives an explicit ACTIVE UNTIL MIDNIGHT message without requiring a browser refresh.
- Recurring chore deactivation now uses finish-current behavior: an existing open instance may still be completed, but a deactivated definition will not generate the next daily/weekly instance.
- Reward pricing and RP Shop sprite pricing controls from v0.19.5 retained.

v0.19.7 — SPRITE SHOP EXPANSION
- Added 9 new purchasable RP Shop sprites.
- My Redemptions displays the 10 most recent entries; full history remains in Supabase.
- Rebuilt Admin Sprite Price action with explicit error feedback.
- Retains v0.19.6 XP activation refresh and recurring-chore finish-current behavior.

v0.19.8 — SPRITE ART REPLACEMENT
- Replaced artwork only for Hi Ren, Samurai Frog, and Rat Merc using the user's revised sprites.
- Cosmetic IDs, RP prices, unlock/purchase behavior, and Supabase records are unchanged.

v0.19.9 — SPRITE PRICE DIALOG FIX
- Replaced the unresponsive browser-prompt Sprite Price control with a dedicated in-app Admin dialog.
- Price dialog shows the sprite name and current RP price.
- Save Price calls update_cosmetic_price, reloads cosmetics, closes the dialog, and rerenders the shop.
- No sprite artwork, IDs, purchase behavior, or prices were otherwise changed.

v0.19.10 — SPRITE PRICE CLICK ROUTING FIX
- Price buttons now call a dedicated global sprite-price dialog opener directly.
- The Price action no longer depends on the generic document click dispatcher.
- Added showModal fallback and explicit missing-dialog feedback.
- Existing sprite artwork, prices, purchase/equip logic, and Supabase RPC are unchanged.

v0.19.11 — SPRITE PRICE CAPTURE FIX
- Removed inline onclick from Sprite Price buttons.
- Added a capture-phase document listener dedicated to Sprite Price before the generic click dispatcher.
- Fixes the no-op case where inline handlers can be blocked while the generic handler was also told to ignore the button.
- Existing price dialog and Supabase update_cosmetic_price RPC remain unchanged.

v0.19.12 — SPRITE PRICE EXPLICIT BINDING
- Removed Sprite Price from delegated/capture action routing entirely.
- Price buttons now have a dedicated CSS class and receive a direct DOM onclick property after render.
- The price dialog/RPC remains the same.

v0.19.13 — MOVE SPRITE PRICING TO ADMIN
- Removed Price controls from Sprite Shop cards.
- Added Admin > Sprite Shop Pricing list with editable RP price fields and Save Price buttons.
- Uses the same Admin action routing as the working Chore/Reward admin controls.
- Uses state.cosmeticCatalog, the actual loaded cosmetic collection.
- Saves through update_cosmetic_price and reloads the cosmetic catalog immediately.

v0.20.0 — PHONE / TOUCH HARDENING
- Based directly on stable v0.19.13; no backend/mechanics changes.
- Mobile navigation becomes a compact horizontal swipe row instead of a 3-column button wall.
- Touch targets hardened to ~44px for primary actions.
- Cards, quests, Admin rows, member controls, forms, dialogs, toast and achievement popup adapt to narrow screens.
- Calendar keeps a seven-day month grid on phone and reduces cell density instead of collapsing to two columns.
- Week calendar remains horizontally scrollable.
- Dialogs use phone-safe width/max-height and 16px inputs to avoid mobile zoom.
- Added overflow/long-text protection and smaller phone spacing.

v0.20.1 — PHONE TEST FIXES
- Removed Test Achievement from the production header.
- Removed persistent sidebar Sign Out; signed-in Sign Out now lives under Admin > Account.
- Preserves XP/RP/streak/lifetime values when the real household member list reloads.
- Home/Rewards/Sprite Shop/Profiles refresh identity when entered so RP does not show stale zero values.
- Reward buttons have a dedicated touch-safe click listener; lottery/request flow no longer depends solely on the shared action dispatcher.
- Added Clear Inbox with confirmation and real Supabase deletion via clear_my_notifications().

v0.20.2 — REWARD MOBILE FLOW + SIGN OUT
- Sign Out moved to Profiles beside Customize Profile so every signed-in member can access it.
- Added direct current-user season/lifetime stats reload; reward and sprite views refresh RP after member loading.
- Lottery shows an immediate drawing message, then a visible result popup/toast after backend refresh.
- Reward dialog Cancel has a dedicated direct click binding; Submit remains a direct form submit binding.
- Reward submission reports whether it was auto-approved or sent for approval.
- Backend migration admin_self_reward_autoapprove_v1: normal Admin self-requested rewards auto-approve through the existing review RPC; member requests remain pending.

v0.20.3 — REWARD STATE / LOTTERY RESULT FIX
- Confirmed backend lottery requests were succeeding even when frontend reported failure.
- Reward post-submit refresh is now fault-tolerant: backend success is not relabeled as failure if a later UI refresh step fails.
- Lottery result is fetched directly by returned redemption ID, then shown even if another loader has trouble.
- Rewards now distinguish Pending Approval from Used This Month.
- Pending normal rewards show an explicit waiting note and button label.
- Repeat clicks explain whether a reward is pending or already used instead of silently doing nothing.

v0.20.4 — AUTHORITATIVE REWARD RESPONSE + NEW SPRITES
- ZIP now extracts into one top-level Family_Quest_v0.20.4 folder.
- Added 9 uploaded RP-shop sprite assets unchanged.
- Added request_reward_v2 backend RPC: returns redemption status, details, current RP, XP and streak in the same successful request.
- Lottery result and RP now update directly from that authoritative backend response; no page refresh should be required.
- Background reward/notification refresh can no longer turn a successful lottery into a visible failure.

v0.20.5 — MOBILE REWARD SUBMISSION LOCKS
- Normal reward Submit disables immediately and reads Submitting… while the request is in flight.
- Reward dialog closes and clears its draft after a successful backend response.
- Lottery has a 4-second client cooldown plus a matching backend cooldown to prevent button-mash duplicate tickets.
- Lottery popup timer/confetti are generation-safe so rapid results cannot tear down a newer popup.
- A successful reward RPC can no longer be relabeled as failed by a later render/display exception.

v0.20.6 — REWARD MODAL CLOSE HARDENING
- After reward fields validate, the Submit Request modal closes immediately before the async backend request starts.
- Added dialog.close() plus open-attribute fallback for mobile browser quirks.
- Reward draft is cleared before the request/render cycle so a stale modal cannot linger.
- Duplicate submission lock remains active while the backend call is running.


v0.20.7 — ADMIN OVERDUE CHORES
- Admin Control now has an Overdue Chores panel.
- Shows assigned user, due time, and human-readable overdue age.
- Admin navigation shows a red overdue count badge.
- Send Reminder creates an Inbox notification for the assigned user.
- Server-enforced 6-hour reminder cooldown per chore.
- Designed so the same notification can later feed phone push notifications.

v0.20.8 — PHONE PUSH / PWA
- Family Quest is now installable as a PWA with manifest + service worker.
- Profile has Enable Phone Notifications, Disable, and Send Test Notification controls.
- Push scope: overdue chores, chore/reward approval results, Family Requests, and today's calendar digest.
- Automatic overdue check runs every 15 minutes and only alerts once per overdue chore instance.
- Calendar digest is generated once around 8 AM America/New_York when there are events that day.
- Existing Family Quest Inbox remains the permanent notification history.
- Uses Web Push + Supabase Edge Function; no paid push provider was added.
