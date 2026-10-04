# Family Quest — Current State

Last live verification: 2026-10-04
Verification sources: GitHub `acemyth123-pixel/family-quest` main + Supabase project `ooctpgofcrysnpwunbuw`.

## Formal stable checkpoint

- **v0.19.13** remains the formal user-promoted Source Checkpoint.
- Do not promote a newer live/experimental build without explicit user confirmation.

## Verified live frontend

- GitHub repository: `acemyth123-pixel/family-quest`, default branch `main`.
- GitHub connector currently has push/admin permission.
- Root `index.html` is the application shell.
- `manifest.webmanifest` uses `start_url: "./"` and `scope: "./"`.
- Service worker is `sw.js`; navigation is network-first/no-store with cache fallback.
- Current cache identifier: `family-quest-v023113`.
- Current live/experimental frontend build is **v0.23.11.3**. The formal stable checkpoint remains v0.19.13 until explicitly promoted.ng Starry Swirl; a stale `BUILD='v0.23.10.28'` owner in `patch.v02310.js` was subsequently found and corrected after device testing. This remains live/experimental and does not change the formal stable checkpoint.
- Current frontend uses the long patch lineage; consolidation into a clean exact-live package remains desirable.

## Verified live backend

Supabase project `ooctpgofcrysnpwunbuw` is ACTIVE_HEALTHY.

Recent migrations verified live include:

- `20260928171802 add_personal_chore_reminders_and_expand_push`
- `20260928172048 refine_family_quest_push_event_types`
- `20260928172105 lock_down_personal_reminder_helpers`
- `20260928223958 household_chore_reminder_threshold_and_multiuser_monthly`
- `20260928224017 fix_multi_assignee_monthly_chore_claiming`
- `20260928232311 realign_rent_multiuser_records`
- `20260928233008 restore_chore_reference_photo_storage`
- `20260928234808 set_chore_reference_photo_rpc`
- `20260929101544 fix_personal_chore_reminder_notification_creation`

Live tables additionally confirm `chore_reminder_settings` and `chore_personal_reminder_log` exist. Reference-photo work therefore moved beyond the older binder statement that photos were deferred.

## Current cosmetic/background state

Live Supabase contains RP-shop backgrounds through:

- `shop-whimsical-islands` — **Whimsical Waterfall Islands**, 450 RP, epic, sort 2150.

`starter.v0231027.css` contains the illustrated Whimsical Waterfall Islands background. `patch.v0231027.js` applies the equipped background to player-facing cards.

**Starry Swirl is live in Supabase and styled in `starter.v0231027.css`. After user review, its first abstract galaxy treatment was replaced with a brighter painted cobalt swirl + warm gold star treatment based on the supplied visual reference.**

Starry Swirl definition:
- id: `shop-starry-swirl`
- name: `Starry Swirl`
- icon: 🌙
- cosmetic_type: `background`
- acquisition_method: `rp_shop`
- price_rp: 450
- rarity: `epic`
- active/shop_active: true
- sort_order: 2160
- do not replace Whimsical Waterfall Islands.

## Current product decisions to preserve

- Frames are retired from the current customization direction unless the user explicitly revives them.
- Equipped profile backgrounds are being expanded meaningfully across player-facing cards.
- Confetti supports preview/celebration behavior.
- Personal chore reminder settings live under profile customization.
- Avoid multiple patches/controllers owning the same UI feature.

## Latest onboarding reliability fix — v0.23.10.33

- Signup now explicitly sets the Supabase email confirmation redirect to `https://acemyth123-pixel.github.io/family-quest/`.
- Android/browser push state now self-heals: when a local PushManager subscription exists, Family Quest re-registers it with Supabase before reporting notifications as enabled.
- The enable flow now reports success only after backend registration succeeds.
- This was added after a newly approved Android user had browser notification permission but zero rows in `push_subscriptions`.
- Supabase Auth must also allow the Family Quest Pages URL in its Redirect URLs configuration; app code cannot override a server-side redirect allow-list.

## v0.23.10.33 walkthrough regression fixes

- Other-player profiles now load authoritative current-season XP/RP/streak stats and lifetime XP for all active household members instead of preserving stale browser values.
- Admin soft-overdue/reminder threshold is restored as a durable editable time control backed by `set_household_chore_reminder_threshold`; household value was changed by Admin to 17:00.
- XP award accounting itself was verified healthy; this fix is display/loading only.
- Remaining notification work: admin approval-needed pushes and automatic admin soft-overdue alerts still require implementation/verification.

## v0.23.10.36 soft-overdue UI correction

- Removed the duplicate soft-overdue/reminder-time control introduced in v0.23.10.33.
- Restored the original Admin Overdue Chores card as the single owner of the household Daily/Weekly soft-overdue threshold.
- The threshold remains household-wide and currently saves through get/set_household_chore_reminder_threshold.
- Verified get_admin_overdue_chores returns open assigned Daily/Weekly chores for the household after the threshold, while Monthly/One-Off use their actual due time.


## Personal Goals / Personal Quests — v0.23.11.3

Personal Goals are now a private, self-directed quest system designed to support ADHD-friendly momentum without household punishment.

- Each user can create and edit only their own Personal Goals.
- Supported planning fields include one-time, daily, selected-day, and weekly-target schedules; optional deadline, reminder time, notes, and steps.
- Goals can be paused; they do not enter household overdue/failure logic and do not trigger Admin policing for missed goals.
- The Personal Goals screen includes Check In, Edit, Pause, and **Just Start** encouragement.
- Home has a compact **Personal Momentum** card showing active-goal count, goals currently on target, and momentum without exposing private goal names to other users.
- Personal-goal completion history is private under RLS.
- Momentum/current and best streaks are separate from household chore streaks. Weekly-target momentum advances when the target period is actually achieved rather than on every individual check-in.
- XP is not awarded for every self-created completion. Eligible milestones are 7 / 14 / 30 / 60 / 100 completions with suggested awards 50 / 75 / 150 / 250 / 500 XP.
- A user explicitly submits an eligible milestone for Admin review. Admin sees the member, milestone, and suggested XP, but not the private goal details.
- Approval writes season XP, lifetime XP, XP transaction history, and normal RP gained from crossing XP thresholds. Approval/decline notifies the submitting user.
- Submitting a milestone creates an Admin notification.
- Backend tables: `personal_quests`, `personal_quest_completions`, `personal_quest_xp_claims`.
- Key RPCs: `complete_personal_quest`, `submit_personal_quest_xp`, `review_personal_quest_xp`.
- Frontend owner: `patch.v02311.js`.
- Supabase migrations: `personal_quests_v02311` and `personal_quests_finish_v023111`.

## Immediate continuity priorities

1. Keep these repository continuity files updated during development.
2. Run the user-facing app walkthrough/regression pass; structure is believed essentially complete, with work shifting toward cosmetic tweaks/additions unless the walkthrough finds structural issues.
3. Verify Starry Swirl appears in the RP shop and purchase/equip behavior works without replacing Whimsical Waterfall Islands.
4. Eventually consolidate the patch chain into a clean exact-live package and only then consider a new formal Source Checkpoint after user testing.

## New-chat instruction

If the user says **"Continue Family Quest"**, begin by reading this file and `PROJECT_CONTEXT.md`, then inspect the live GitHub/Supabase areas relevant to the next task. Do not ask the user to reconstruct prior work unless the live sources and documentation genuinely leave an ambiguity.


## Personal Goals UX refinement — v0.23.11.3

- Home Personal Momentum remains a shortcut into Personal Goals.
- Quests now adds a top-level Household Quests / Personal Goals switch; the existing household quest interface remains intact.
- Just Start opens a focused step checklist instead of only displaying encouragement.
- Step progress persists in `personal_quest_step_progress` and is private to the goal owner under RLS.
- Repeating goals detect unresolved progress from a prior period and offer Keep Going or Start Fresh. Carrying progress forward does not create a completion for the prior period; starting fresh does not penalize it.
- One-time goals retain step progress until resolved. Weekly-target progress belongs to the current weekly occurrence.
- Checking the final step automatically completes the current occurrence; Complete remains available to bypass optional steps.
- Completed daily goals now explicitly display **✓ Completed Today** and disable the redundant completion action for that occurrence.
- Backend migration: `personal_quest_step_progress_v023112`; RPCs: `save_personal_quest_step_progress`, `resolve_personal_quest_step_progress`.


## Personal Goals device-test correction — v0.23.11.3

- Device testing showed the first Household/Personal switch rendered as unstyled browser buttons and disappeared after entering Personal Goals. It is now a styled two-way quest-mode control rendered in both Household Quests and Personal Goals.
- Device testing also showed a partial checklist interaction associated with a resolved/completed occurrence. Step auto-completion is now hardened: after saving a step, the client re-reads persisted step indexes, normalizes/deduplicates them, and only completes when every defined step index is persisted. A single step in a multi-step goal cannot satisfy that condition.
- Checklist styling now matches the app visual language and completed steps visibly strike through.
