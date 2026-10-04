# Family Quest — Project Continuity Contract

Updated: 2026-10-04

## Purpose

This file exists so Family Quest can survive ChatGPT conversation boundaries. A new working session should not reconstruct project state from chat memory alone.

## Recovery procedure for every new working session

Before changing Family Quest:

1. Read `CURRENT_STATE.md`.
2. Inspect live GitHub `main` for the files relevant to the requested work.
3. Inspect live Supabase schema/migrations/functions/data relevant to the requested work.
4. Reconcile those live sources with the project binder and formal Source Checkpoint.
5. State any meaningful drift before making changes.
6. Work from live state unless the user explicitly asks to roll back to a checkpoint.
7. After meaningful changes, update `CURRENT_STATE.md` in the same work session.

If GitHub or Supabase access is unavailable, say exactly which live source could not be verified. Do not silently substitute memory or an old binder for live state.

## Source hierarchy

These sources answer different questions and must not be conflated:

- **Live GitHub main** — authoritative for the currently deployed/experimental frontend code.
- **Live Supabase** — authoritative for current backend schema, migrations, RPC/function behavior, and persisted data.
- **Formal Source Checkpoint** — last user-promoted stable frontend baseline for regression/rollback.
- **Project Binder** — intended behavior, architecture, decisions, history, and known regression lessons.
- **CURRENT_STATE.md** — compact live handoff: verified state, current task, recent changes, unresolved work, and next action.
- **Chat memory/history** — supporting context only; never authoritative over the sources above.

## Checkpoint discipline

- Experimental/live does not automatically mean stable.
- Only explicit user promotion makes a new formal Source Checkpoint.
- Preserve milestone builds for rollback/regression comparison.
- When binder/history and live implementation differ, record the difference rather than silently choosing one.

## Change discipline

- Prefer consolidation over stacked corrective patches.
- For dynamic UI, one feature should have one clear renderer/event owner.
- For PWA changes, keep root browser launch, manifest start URL, service worker, and cache/build identifiers aligned.
- For backend changes, inspect the actual current schema/function before modifying it.
- Run relevant regression checks before recommending checkpoint promotion.
- Never expose Supabase/VAPID secrets in project documentation.

## Continuity update triggers

Update `CURRENT_STATE.md` whenever any of these happen:

- meaningful feature added or removed;
- bug fixed that changes expected behavior;
- database migration/function deployed;
- build/cache/version changes;
- user accepts/rejects a design direction;
- new known issue or regression is discovered;
- formal Source Checkpoint is promoted;
- current task or immediate next step changes.

## Binder policy

The detailed binder remains the long-form design/history document. The repository continuity files are the operational handoff layer. The binder should be refreshed at milestones or major architecture changes; `CURRENT_STATE.md` should stay current during ordinary development.

Current formal stable Source Checkpoint remains **v0.19.13** until explicitly promoted by the user.


## Current major feature note — Personal Goals

As of live build v0.23.11.2, Family Quest includes private Personal Goals. Treat these as self-directed, non-punitive goals separate from household chores. Goal details/completions are private to the owner; Admin participates only when the user submits an eligible consistency milestone for XP review. See CURRENT_STATE.md for the exact live behavior and backend objects.
