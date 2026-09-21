---
id: TASK-3
title: Provide the curated Exercise library
status: In Progress
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-20 03:04'
labels: []
dependencies:
  - TASK-1
documentation:
  - doc-1
type: feature
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Lifters need a focused, application-managed set of conventional strength and hypertrophy movements that supports meaningful variation without requiring users to maintain an exercise catalog. Deliver the authenticated, read-only Exercise library as structured Exercise, Equipment/Setup, and Modifier definitions that later Workout composition can combine into exact configurations with independent history.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can browse the configured Exercise library, including the allowed Equipment/Setup choices and Modifiers for each Exercise
- [ ] #2 The initial library contains Bench Press, Incline Bench Press, Decline Bench Press, Back Squat, Front Squat, Deadlift, Dips, Push-Up, Pull-Up, Chin-Up, and Overhead Press with the approved Equipment/Setup mappings
- [ ] #3 The initial Modifier vocabulary contains only Paused and Chains, and the catalog identifies Chains as requiring separately recorded load when Sets are logged
- [ ] #4 The interface and supported API expose no operation for a user to create, edit, or delete Exercises, Equipment/Setup choices, or Modifiers
- [ ] #5 Exercise-library retrieval exposes accessible loading, failure, and empty behavior and remains usable at mobile and desktop widths
- [ ] #6 Automated API coverage verifies authenticated ordered retrieval of the configured nested library, anonymous rejection, and the absence of user-facing catalog mutation procedures
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach

Model the Exercise library as application-owned reference data rather than a flat list of precomposed names. An **Exercise** is a specific movement such as Bench Press or Incline Bench Press. **Equipment/Setup** identifies the single configured setup used for that movement, such as Barbell, Dumbbells, Straight Bar, Olympic Rings, or Floor. **Modifiers** are optional stackable characteristics; v1 provides Paused and Chains.

Keep all definitions and compatibility mappings read-only to users. Give every definition a stable text identifier and deterministic display order. The later Workout-composition slice will resolve an Exercise, one Equipment/Setup, and zero or more allowed Modifiers into an immutable canonical configuration. Identical selections must resolve to the same configuration and history identity, but TASK-3 does not yet create Workouts or persist those combinations.

Present the library in layers instead of concatenating every component into a long Exercise name: show the Exercise name, its Equipment/Setup choices, and its Modifier choices as structured details.

## Initial Catalog

| Exercise | Allowed Equipment/Setup |
| --- | --- |
| Bench Press | Barbell, Dumbbells |
| Incline Bench Press | Barbell, Dumbbells |
| Decline Bench Press | Barbell, Dumbbells |
| Back Squat | Barbell |
| Front Squat | Barbell |
| Deadlift | Barbell |
| Dips | Straight Bar, Olympic Rings |
| Push-Up | Floor, Olympic Rings |
| Pull-Up | Straight Bar, Olympic Rings |
| Chin-Up | Straight Bar, Olympic Rings |
| Overhead Press | Barbell, Dumbbells |

Seed only these Modifiers:

- **Paused** — changes configuration identity and requires no additional Set value.
- **Chains** — changes configuration identity and requires chain load to be recorded separately when Sets are logged.

Compatibility is explicit reference data. Store allowed Equipment/Setup choices per Exercise and allowed Modifiers per Exercise/Equipment pairing so the later builder can show only relevant choices. Configure and store a visible default Equipment/Setup for every Exercise rather than relying on an implicit default.

Do not include Bands, Assisted, Weighted, specialty bars, user-created catalog entries, or a broad third-party exercise catalog in v1.

## Implementation Steps

1. **Add the structured Exercise reference model**
   - Define the reference tables and relations in `packages/db/src/schemas/exercise-schema.ts` and export them through `packages/db/src/schema.ts`.
   - Represent Exercises, Equipment, allowed Exercise/Equipment setups, Modifiers, and allowed setup/Modifier mappings with stable text identifiers, uniqueness constraints, and deterministic ordering.
   - Include Modifier metadata that distinguishes a descriptive Modifier from one that requires an additional load value; Paused is descriptive and Chains requires separately recorded pounds.
   - Generate a committed Drizzle migration under `packages/db/src/migrations/` that creates the reference model and seeds the approved initial catalog and compatibility mappings.
   - Export the database type needed for typed API dependency injection from `packages/db/src/index.ts`.

2. **Expose an authenticated read-only Exercise API**
   - Add `@acme/db` to `packages/api` and pass the database instance from `apps/server/src/app.ts` into the API context.
   - Add an `exercise` router in `packages/api/src/index.ts` with only a protected `list` query.
   - Return Exercises in configured order with nested allowed Equipment/Setup choices, visible defaults, and allowed Modifiers in their configured order.
   - Keep the router free of catalog create, update, and delete procedures.

3. **Add focused API integration coverage**
   - Add a lightweight Node test-runner/`tsx` test setup and package test command for `packages/api`.
   - Exercise the tRPC public seam against the configured migrated PostgreSQL database.
   - Verify anonymous callers are rejected and authenticated callers receive the exact ordered Exercise catalog, Equipment/Setup mappings, defaults, Modifier mappings, and load-tracking metadata.
   - Verify no user-facing Exercise, Equipment/Setup, or Modifier mutation procedures are exposed.
   - Include the new test tooling and workspace dependency changes in the lockfile.

4. **Build the Exercise library route**
   - Add `apps/web/src/routes/_app/exercises.tsx` and retrieve the library with `trpc.exercise.list.queryOptions()` and `useQuery`.
   - Render a responsive semantic list grouped by Exercise, with Equipment/Setup details and Modifier labels displayed separately instead of generating long combined names.
   - Render no catalog creation, editing, deletion, composition, or Set-logging controls in this slice.
   - Provide an announced loading state, an error state with a keyboard-operable retry control, and a clear empty-library state.
   - Use the existing layout and responsive UI primitives so the library remains readable at narrow mobile and desktop widths.

5. **Integrate the library into authenticated navigation**
   - Add an Exercises destination to `apps/web/src/components/app-sidebar.tsx`, including active-route styling and existing mobile-sidebar close behavior.
   - Regenerate the TanStack route tree through the normal Vite/TanStack workflow rather than editing generated routing output manually.

6. **Document the delivered behavior**
   - Update `README.md` to identify the authenticated read-only structured Exercise library, its database migration requirement, and the focused API test command.
   - Continue to describe Workout composition, configuration reuse, Set logging, and History as future slices.

## Downstream Contracts

These decisions constrain later tasks but are not implemented by TASK-3:

- TASK-4 will let a user choose one provided Exercise, one allowed Equipment/Setup, and any allowed Modifiers while adding an Exercise to a Workout. The server will create or reuse an immutable canonical configuration and surface the user's previously used configurations without exposing catalog management.
- Exact configurations have separate Exercise History. Bench Press with Barbell and Paused is distinct from Bench Press with Barbell, Paused, and Chains. Modifier selection order does not change identity.
- TASK-6 will record primary weight and chain weight separately per Set and will not calculate a combined total.
- Barbell weight includes the bar. Dumbbell weight is recorded per dumbbell and displayed as `lb each`.
- For bodyweight Exercises, zero added weight displays as `BW`; a positive value displays as `BW + N lb`. Added bodyweight load does not require a Weighted Modifier and remains part of the same configuration history.

## Acceptance Criteria Coverage

- **Authenticated structured browsing** — the seeded reference model, protected nested `exercise.list` query, `/exercises` route, sidebar entry, and authenticated browser check expose the configured Exercise, Equipment/Setup, and Modifier data.
- **Approved initial catalog** — the committed seed migration contains exactly the approved Exercises and Equipment/Setup mappings, and API coverage verifies their deterministic order and defaults.
- **Paused and Chains only** — the migration and API response expose only the two approved Modifiers and identify Chains as load-bearing metadata for later Set logging.
- **No user catalog management** — the tRPC router exposes only `list`, the route renders no mutation controls, and API coverage verifies that no catalog mutation procedures are available.
- **Accessible query states and responsive presentation** — explicit loading, failure/retry, empty, and populated branches plus semantic layered markup and manual responsive checks verify the behavior.
- **Automated API coverage** — the integration test covers authentication, exact nested retrieval, configured ordering, defaults, compatibility mappings, load metadata, and the read-only public procedure surface.

## Final Verification

- `pnpm db:migrate` — applies the structured Exercise reference schema and approved seed data to PostgreSQL.
- `pnpm --filter @acme/api test` — verifies authenticated nested retrieval, anonymous rejection, configured ordering and compatibility, Modifier metadata, and the absence of catalog mutation procedures.
- `pnpm format` — verifies repository formatting.
- `pnpm lint` — verifies application and test lint rules.
- `pnpm typecheck` — verifies database, API, and frontend contracts.
- `pnpm build` — regenerates routing output and verifies all production builds.
- `pnpm dev` — supports browser verification of the populated route, layered catalog display, loading and failure/retry behavior, keyboard navigation, and mobile/desktop layouts; use a controlled empty response to verify the empty state.
- `git diff --check` — verifies that the implementation introduces no whitespace errors.
<!-- SECTION:PLAN:END -->
