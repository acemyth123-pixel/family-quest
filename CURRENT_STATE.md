# Family Quest — Current State

Last live verification: 2026-09-29
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
- Current cache identifier observed: `family-quest-v0231029`.
- Root `index.html` displays `v0.23.10.29`, while `patch.v0231027.js` declares `v0.23.10.30` and sets the build badge at runtime. Treat this as a **version-label/cache alignment issue to clean up**, not as proof of a new formal checkpoint.
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

**Starry Swirl is not yet present in live Supabase as of this verification.**

Planned Starry Swirl definition:
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

## Immediate continuity priorities

1. Keep these repository continuity files updated during development.
2. When adding Starry Swirl, verify the current background CSS/catalog wiring first, add the Supabase definition, add the CSS, align build/cache identifiers, and test purchase/equip behavior without replacing Whimsical Waterfall Islands.
3. Clean the current v0.23.10.29 / v0.23.10.30 / cache-0231029 version-label mismatch during the next frontend build bump.
4. Eventually consolidate the patch chain into a clean exact-live package and only then consider a new formal Source Checkpoint after user testing.

## New-chat instruction

If the user says **"Continue Family Quest"**, begin by reading this file and `PROJECT_CONTEXT.md`, then inspect the live GitHub/Supabase areas relevant to the next task. Do not ask the user to reconstruct prior work unless the live sources and documentation genuinely leave an ambiguity.
