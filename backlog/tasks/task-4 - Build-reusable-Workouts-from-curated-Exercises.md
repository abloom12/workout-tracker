---
id: TASK-4
title: Build Training Splits with reusable Workouts from curated Exercises
status: In Progress
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-24 00:23'
labels: []
dependencies:
  - TASK-3
documentation:
  - doc-1
type: feature
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deliver the authenticated, persisted v0 Workout and Training Split building slice. A user may save a named Workout independently or create one inline while building a named Split. A Workout contains ordered curated Exercises; a Split contains ordered Workouts. Adding a previously saved Workout to a Split copies its name and ordered Exercise selection into a new, independently editable Workout. The source remains unchanged. Copies may keep the same display name. The accepted apps/web/src/routes/_app/workout-lab.tsx board is an in-memory UX prototype, not the completed feature.

Build only the bottom of the planning pyramid in TASK-4. Training Blocks and Programs will later group repeated Splits and Blocks, respectively, and copying at those levels will create independent plans; do not create placeholder Block or Program rows merely to save a Split. Scheduling, performed Sessions, history, and reusable-Workout deletion remain separate work.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can create, list, edit, and reload their own standalone named Workouts with nonempty ordered selections of curated Exercises.
- [ ] #2 An authenticated user can create, list, edit, and reload their own named Training Splits containing at least one ordered Workout; the editor starts with one card and can add or remove cards without altering a source Workout.
- [ ] #3 A Workout can be created inline while building a Split; adding a previously saved Workout to a Split makes a new independent copy of its name and Exercise order, leaving the source unchanged when either copy is edited.
- [ ] #4 Workout and Split names must be nonblank after trimming; independent copies may have the same display name.
- [ ] #5 Curated Exercise IDs must exist and be unique within each Workout; saved Workout order within a Split and Exercise order within a Workout survive reload.
- [ ] #6 The authenticated UI preserves the accepted board interaction and provides accessible validation plus loading, empty, pending, failure, retry, and success feedback without requiring a reload.
- [ ] #7 Server-side authentication and ownership checks prevent reading or changing another user’s Workouts or Splits, including copy and grouping operations; multi-row saves and copies are atomic.
- [ ] #8 Automated API and persistence tests cover standalone and inline creation, independent copying, edit and reload, order, validation, rollback, authentication, and cross-user boundaries.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach

Implement the smallest persisted planning structures: independently saved user-owned Workouts with ordered curated Exercises, and user-owned Training Splits containing ordered Workout copies. A Workout may exist without a Split. When an existing Workout is added to a Split, clone the Workout row and its ordered Exercise composition; retain the source and give the copy its own ID. Copies are independently editable and may share display names. The Exercise catalog remains shared. The user drives coding; review each slice together.

## V0 schema and migration

- Follow docs/CODING_STANDARDS.md. Replace the affected 0002_unusual_barracuda.sql migration and every later generated migration (if any), their matching snapshots and journal entries, then generate a clean consolidated migration from the last retained snapshot. Review SQL and re-migrate a non-production database from a consistent state; if 0002 was already applied, plan its reset/re-creation rather than expecting db:migrate to undo it. Do not add a follow-up migration for this v0 change.
- Replace the old Workout Template schema with an owner-scoped Workout and ordered Workout–Exercise rows, and add an owner-scoped Training Split. A Workout has an optional Split ID and position; standalone Workouts have neither. Enforce matching owner on a Split assignment with a composite foreign key where practical, nonnegative/unique positions within each parent, nonblank trimmed names, and no owner-wide name-uniqueness constraint (copies may have the same name). Persisted ordering is separate from future drag-and-drop UI behavior.
- Program and Training Block are future grouping levels, not required database tables or automatically created parents in TASK-4. A Block may later group repeated rotations of a Split for an optional planned duration; a Program groups Blocks. Do not model a Split as necessarily a calendar week.

## Work sequence

1. Agree typed standalone Workout create/list/update and Split create/list/update/copy contracts around the approved board draft: Split name, ordered Workout names/IDs and ordered Exercise IDs. Adding an existing Workout always creates a new independent Workout and copies its composition; never move or live-link the source. Before persisted removal is implemented, decide whether a detached copy is retained as standalone or deleted, without modifying the source or completed history.
2. Update packages/db/src/schemas/workout-schema.ts and replace affected generated migration files and metadata under the v0 rule. Review SQL constraints and the non-production DB state before re-migrating.
3. Implement protected tRPC operations and register them in packages/api/src/index.ts; apps/server/src/app.ts already mounts the app router. Use transactions for Split and Workout multi-row writes and copying. Trim/validate names, nonempty compositions, unique and existing curated Exercise IDs, ordering, and owner-scoped source/Split IDs. Return safe not-found behavior for unowned IDs; handle constraint failures without leaking protected data.
4. Add PostgreSQL-backed API tests for anonymous rejection, standalone and inline Workout creation, Split create/update/reload, copy independence and preserved order, duplicate display names, missing/duplicate Exercise IDs, atomic rollback, owner-scoped listing, and cross-user reads/writes/copies.
5. Connect the accepted apps/web/src/routes/_app/workout-lab.tsx board to persisted queries and mutations. Keep its one initial Workout card, adjacent Add another Workout control, per-card removal, Exercise picker, and thin borders. Offer a way to choose a previously saved Workout for copying into a Split. Replace preview-only state; provide accessible validation and loading, empty, pending, failure/retry, and success feedback; finish production route/navigation and remove prototype-only affordances. Do not restore the removed up/down Exercise buttons; drag-and-drop ordering is a later interaction enhancement. Use existing web components and Lucide icons.
6. Update README setup and capability information. Verify migration/seeding, API tests, format, lint, types, build, keyboard interaction, ownership isolation, and persistence after reload.

## Deferred

Program and Training Block persistence and copying, scheduling, progression, performed Sets and Sessions, completed history, reusable-Workout deletion, and drag-and-drop reordering are outside TASK-4. Preserve the distinction between editable planning rows and immutable performed history when later slices are designed.
<!-- SECTION:PLAN:END -->
