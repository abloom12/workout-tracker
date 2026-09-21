---
id: TASK-4
title: Build reusable Workouts from curated Exercises
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-21 03:26'
labels: []
dependencies:
  - TASK-3
documentation:
  - doc-1
type: feature
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users need reusable named routines assembled from the curated library. Deliver the complete authenticated path for creating a Workout and maintaining its ordered Exercise composition through the typed persisted application.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can create a named Workout using Exercises from the curated library
- [ ] #2 The user can add and remove Exercises from a Workout
- [ ] #3 Exercise order is preserved after saving and reloading the Workout
- [ ] #4 The user can return later and see their persisted reusable Workouts and compositions
- [ ] #5 Workout forms expose accessible validation, pending, failure, and success feedback without requiring a page reload
- [ ] #6 Server-side ownership enforcement prevents one user from reading or changing another user's Workouts
- [ ] #7 Automated API coverage verifies Workout creation, composition persistence, ordering, and ownership boundaries
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## User Stories

- As a lifter, I can create a named Workout from curated Exercises so that I can reuse an ordered training routine.
- As a lifter, I can add, remove, and reorder Exercises in a Workout so that its composition matches how I intend to train.
- As a returning lifter, I can see my saved Workouts and their compositions so that I can reuse them later.
- As a user, I receive accessible validation and operation feedback so that I understand whether my changes were saved.
- As a user, only I can view or modify my Workouts.

## Approach

Add owner-scoped Workout persistence with an ordered Workout–Exercise composition. Expose protected tRPC list, create, and update operations that validate curated Exercise IDs and write compositions transactionally. Add an authenticated Workouts route using TanStack Form and Query for accessible creation and editing without page reloads. Deletion remains out of scope for TASK-4.

## Implementation Steps

1. Add `workout` and ordered `workout_exercise` tables in `packages/db/src/schemas/workout-schema.ts`, including owner and Exercise foreign keys, deterministic position storage, appropriate indexes/constraints, Drizzle relations, schema exports, and a generated migration.
2. Extend `packages/api/src/index.ts` with a protected Workout router that:
   - Lists only the authenticated user’s Workouts with Exercises ordered by stored position.
   - Creates a named Workout from a non-empty ordered Exercise ID list.
   - Updates only an owned Workout, supporting name changes and transactional add, remove, and reorder operations.
   - Verifies referenced Exercises belong to the curated library and returns safe not-found behavior for unowned Workout IDs.
3. Add `packages/api/src/__tests__/workout.test.ts` with isolated users and cleanup. Cover anonymous rejection, creation and reload through the list API, ordered composition persistence, add/remove/reorder updates, user-scoped listing, and rejection of cross-user mutation without modifying the owner’s data.
4. Add an authenticated `/workouts` route and reusable Workout form/editor under `apps/web/src/routes/_app/workouts.tsx` and `apps/web/src/components/`. Load the curated Exercise library and persisted Workouts through tRPC/TanStack Query; use TanStack Form for required-name and composition validation; provide keyboard-accessible add, remove, and move controls; and invalidate/refetch Workout data after successful mutations.
5. Render responsive loading, empty, failure, and persisted Workout states. Provide inline accessible validation, mutation pending indicators, retry controls, failure alerts, and success announcements without navigation or page reloads. Add Workouts to `app-sidebar.tsx`, update `site-header.tsx`, and regenerate the TanStack route tree.
6. Update `README.md` so its capability summary, authenticated journey, database setup, and API-test coverage accurately describe reusable Workouts and ordered composition management.

## Acceptance Criteria Coverage

- **Authenticated creation from curated Exercises** — Protected create procedure plus the `/workouts` TanStack form; verify through API creation tests and the authenticated browser flow.
- **Add and remove Exercises** — Transactional update procedure and dynamic composition editor; verify both changes in API tests and the rendered saved composition.
- **Order survives saving and reloading** — Persist explicit positions and always order API results by them; test a non-alphabetical composition before and after retrieval and update.
- **Persisted reusable Workouts remain available later** — Owner-scoped PostgreSQL records loaded by the Workouts route; verify with a fresh list call and browser reload.
- **Accessible validation and mutation feedback** — Field errors, live status/alert regions, pending controls, retry behavior, and query invalidation provide validation, pending, failure, and success states without reload.
- **Server-side ownership enforcement** — Scope list and update queries by authenticated user ID and conceal unowned IDs; verify isolation with two-user API tests.
- **Automated API coverage** — `workout.test.ts` exercises creation, composition changes, ordering, persistence, authentication, and ownership boundaries against PostgreSQL.

## Final Verification

- `pnpm db:migrate && pnpm db:seed` — applies the Workout migration and ensures curated Exercises are available.
- `pnpm -F @acme/api test` — verifies Workout persistence, ordering, composition changes, authentication, and ownership.
- `pnpm format` — verifies repository formatting.
- `pnpm lint` — verifies lint rules across the workspace.
- `pnpm typecheck` — verifies database, API, and frontend types.
- `pnpm build` — verifies all packages and applications build, including route generation.
- `pnpm dev` — manually verify keyboard-accessible creation/editing, feedback states, responsive layout, and persistence after browser reload.
<!-- SECTION:PLAN:END -->
