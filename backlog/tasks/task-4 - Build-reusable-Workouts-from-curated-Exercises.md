---
id: TASK-4
title: Build reusable Workout Templates from curated Exercises
status: In Progress
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-21 23:51'
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
Users need reusable one-day Workout Templates assembled from the curated Exercise library. Deliver the complete authenticated path for creating and maintaining an ordered Template composition through the typed persisted application.

Keep this slice intentionally focused on reusable structure. Training Splits, grouping, preferences, variations, scheduling, Training Blocks, prescriptions, performance, history, and deletion are deferred.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can create a named Workout Template from a nonempty selection of curated Exercises
- [ ] #2 The user can add, remove, and reorder Exercises in a Workout Template
- [ ] #3 An Exercise can occur only once in a Workout Template
- [ ] #4 Exercise order is preserved after saving and reloading the Workout Template
- [ ] #5 The user can return later and see their persisted Workout Templates and compositions
- [ ] #6 Workout Template names are required and case-insensitively unique per owner
- [ ] #7 Workout Template forms expose accessible validation, pending, failure, and success feedback without requiring a page reload
- [ ] #8 Server-side ownership enforcement prevents one user from reading or changing another user's Workout Templates
- [ ] #9 Automated API coverage verifies creation, composition changes, ordering, validation, persistence, authentication, and ownership boundaries
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach

Build the smallest coherent vertical slice for reusable one-day training structure. Persist owner-scoped Workout Templates and their ordered many-to-many composition with the curated Exercise library. Expose protected tRPC list, create, and update operations, then provide an authenticated TanStack Form and Query interface.

## Schema decisions

- `workout_template` is a reusable blueprint for one day of training.
- `workout_template_exercise` stores ordered Template composition.
- Workout Template IDs use PostgreSQL integer identity columns; ownership references the Better Auth UUID user ID.
- Names are trimmed by the API, must be nonblank, and are case-insensitively unique per owner.
- A composite primary key prevents the same Exercise appearing twice in one Template.
- Explicit zero-based positions preserve composition order and are unique per Template.
- Deleting a Template cascades to its composition; deleting a referenced curated Exercise is restricted.

## Implementation steps

1. Finalize `packages/db/src/schemas/workout-schema.ts`, export it from the package schema, generate the migration, and review its SQL.
2. Add a protected Workout Template router that lists only the authenticated owner’s Templates, creates a named Template from a nonempty ordered Exercise ID list, and updates only an owned Template transactionally. Validate that Exercise IDs exist, are unique, and belong to the curated library; conceal unowned Template IDs with safe not-found behavior.
3. Add isolated API tests covering anonymous rejection, creation and reload, ordering, add/remove/reorder updates, name and composition validation, owner-scoped listing, and cross-user mutation rejection without changing the owner’s data.
4. Add an authenticated Workout Templates route and reusable form/editor. Load Exercises and Templates through tRPC and TanStack Query; use TanStack Form for name and composition validation; provide keyboard-accessible add, remove, and move controls.
5. Render responsive loading, empty, failure, and persisted states. Provide inline validation, mutation pending indicators, retry controls, failure alerts, success announcements, query invalidation, navigation integration, and generated route updates.
6. Update the README capability summary, authenticated journey, database setup, and API-test coverage.

## Deferred

- Training Splits
- Superset and circuit grouping
- User training preferences and RPE/RIR
- Exercise variations
- Scheduling, Microcycles, and Training Blocks
- Prescription and performance data
- History and deletion

## Final verification

- Review and apply the generated migration, then seed the curated Exercises.
- Run API tests, formatting, linting, typechecking, and the production build.
- Manually verify keyboard-accessible Template creation and editing, feedback states, ownership behavior, and persistence after reload.
<!-- SECTION:PLAN:END -->
