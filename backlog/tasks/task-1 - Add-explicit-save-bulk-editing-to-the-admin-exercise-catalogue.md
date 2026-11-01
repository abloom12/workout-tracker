---
id: TASK-1
title: Add explicit-save bulk editing to the admin exercise catalogue
status: In Progress
assignee:
  - '@pi'
created_date: '2026-10-24 22:23'
updated_date: '2026-10-30 22:16'
labels: []
dependencies: []
type: enhancement
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Entering and maintaining the exercise catalogue one row at a time is too slow, especially when manually replacing seed content. The admin needs to draft multiple additions and edits before explicitly saving. Preserve existing uncommitted catalogue/domain changes and leave seed data untouched.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Admin can edit multiple exercises, add draft rows, duplicate equipment and muscle assignments, and remove unsaved rows without network writes.
- [ ] #2 Save changes shows the number of new or changed rows and commits all changes atomically; failed saves retain the draft and identify the failing exercise where possible.
- [ ] #3 Discard changes abandons the draft and navigation or reload warns about unsaved work; typing, blur, and tabbing never autosave.
- [ ] #4 Use installed TanStack Table v9 row/cell models and sorting, TanStack Form validation, dirty metadata and array operations, and TanStack Router navigation blocking rather than custom substitutes.
- [ ] #5 Existing IDs remain stable on edits, authorization and reference validation remain enforced, and existing seed entries are preserved without catalogue code fields.
- [ ] #6 Admin can view, edit, duplicate, and bulk-edit unilateral, nullable mechanics, and multiple movement-pattern assignments; explicit save persists them atomically and clearing assignments is distinct from leaving them unchanged.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace the single-row editor with a TanStack Form array-backed draft and reuse a TanStack Table grid through typed table meta/render callbacks. Keep sorting disabled while editing to preserve focus.
2. Add an admin-only bulk-save API and a DB transaction that reuses internal exercise write helpers; retain existing single-write APIs and report the failed change.
3. Add row creation, duplication, draft-only removal, muscle selectors, explicit save/discard, and TanStack Router unsaved-navigation protection within the five approved source files.
4. Validate with no-output/no-cache static checks where possible. Do not create test files, build artifacts, caches, or perform database writes without separate approval.

5. Remove catalogue code columns from the Drizzle schema, DB queries, API validation and responses, and frontend drafts/table; keep IDs as stable identity.
6. Remove code fields from legacy seeds and use unique names as their conflict targets. Leave migrations and the database untouched; use read-only/no-output verification only.

7. Approved extension: expose and persist unilateral, nullable mechanics, and many-to-many movement patterns through the existing exercise read/create/update/bulk-save flow. Add movement-pattern list query/export/API and mechanics enum options; validate positive, unique movement-pattern IDs and preserve admin authorization and atomic writes.
8. Add Unilateral, Mechanics, and Movement patterns catalogue columns and editors; include all three in draft initialization, defaults, duplication, dirty metadata, save/discard, and bulk editing. Bulk controls explicitly distinguish unchanged from false, null, and empty assignments. No new filters.
9. Limit source changes to queries/exercises.ts, new queries/movement-patterns.ts, db/src/index.ts, api catalogue router, web catalogue route, ExercisesTable.tsx, and SetupEditor.tsx. Preserve existing uncommitted work; do not change schema, migrations, seeds, database, or generated files. Verify with in-memory/no-output type checks, no-cache lint, formatting checks, and diff checks; runtime/database testing requires separate authorization.

10. Approved UI refinement: move the existing right-hand bulk-value inputs into the shared Dialog component, opened by an Edit multiple toolbar button enabled only for 2+ selected rows. Keep all bulk fields and draft-only Apply behavior; close/reset on Apply or dismissal and leave explicit Save changes unchanged. Limit source edits to SetupEditor.tsx and ExercisesTable.tsx; preserve unrelated uncommitted changes and verify using read-only/no-output checks.

11. Approved responsive catalogue refinement: split the editing toolbar into draft actions (Add row, Duplicate selected, Edit multiple) and a second Save changes/Leave row. Remove fixed editor/column minimum widths, wrap table content, and use labelled stacked exercise fields in narrow catalogue containers so all columns remain accessible without horizontal scrolling. Limit source changes to SetupEditor.tsx and ExercisesTable.tsx; preserve existing work. Verify with in-memory/no-output TypeScript, no-cache ESLint, Prettier checks, and diff checks; no browser/server startup or database operations.

12. Approved edit-mode polish in ExercisesTable.tsx and SetupEditor.tsx: widen ID and prevent wrapping, rename the Unilateral column to Uni and center its row checkbox, shorten the empty movement-pattern picker text to Select movement, and replace per-row Duplicate/Remove labels with accessible copy/red-trash icon buttons. Preserve draft-only duplication/removal behavior (only unsaved rows removable), bulk editing, and responsive layout. Verify with no-output/no-cache static and in-memory render checks; no browser/server startup or database operations.

13. Approved width-only refinement: change the Uni column from 6% to a fixed 48px (w-12) at the desktop catalogue breakpoint in ExercisesTable.tsx, retaining centered alignment and the existing narrow-screen layout. No other source changes; verify with read-only/no-output checks.

14. Approved adjustment in ExercisesTable.tsx only: reduce desktop ID width from 96px to 64px while retaining no-wrap; vertically center Uni in responsive stacked rows with a flex-column/justify-center cell while retaining middle-aligned desktop table cells. Record verification without browser/server startup, emitted files/caches, or database operations.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Removed catalogue code fields from Drizzle schemas, DB query inputs/results, API generation/validation/conflict handling, and the exercise grid/drafts. Legacy seeds retain their existing entries and now use unique names as conflict targets. Verified DB/API/web with source-linked in-memory TypeScript programs (no emit/incremental cache), ESLint on all 15 changed source files (0 errors/warnings, no cache/fixes), Prettier checks, and git diff --check. No browser/runtime or DB tests were run; no builds, migration changes, or database writes were performed. Task remains In Progress with acceptance criteria unchecked pending interactive verification of the broader bulk-editing work.

Implemented the approved schema-field extension across the seven scoped source files. Exercise reads now include sorted movementPatterns ({ id, name }); movement-pattern query/export/API and mechanics enum options feed the catalogue. Create/update/bulk-save persist isUnilateral, nullable mechanics, and pattern assignments in the existing transaction. Omitted fields preserve existing update values/links; movementPatternIds: [] explicitly clears links. API validates positive unique pattern IDs with a 100-item bound.
The catalogue now displays and edits Unilateral, Mechanics, and Movement patterns, including draft initialization/defaults, duplication, dirty metadata, save/discard, and bulk controls with distinct unchanged/false/null/empty semantics. Reused the existing picker for muscles and patterns and extracted field components.
Verification: source-linked, in-memory TypeScript programs for DB/API/web (0 diagnostics); source-linked ESLint on all seven files (0 errors/warnings, no cache/fixes); Prettier checks and git diff --check pass. In-memory checks cover bulk unchanged/false/null/empty behavior, defaults/duplication/dirty tracking, API input validation, mocked create/update/replacement/omission/clearing, indexed write errors and rollback, and sorted read projection. Actual Drizzle relational SQL generation passes using drizzle.mock with the real exercise schema. No new test files, generated files, builds, caches, browser/server startup, live database connections/writes, migrations, schema edits, or seed edits. Task stays In Progress and criteria stay unchecked pending browser/live-database verification.

Implemented the approved catalogue UI refinement in SetupEditor.tsx and ExercisesTable.tsx: the always-visible right-hand bulk inputs now live in the shared Dialog, opened by Edit multiple (selection count), disabled until 2+ rows are selected. The button sits with Add row, Duplicate selected, Save changes, and Leave/Discard; the two-column toolbar/panel layout is removed. All bulk fields and unchanged/clear semantics are preserved. Apply changes selected draft rows and closes the popup, without saving; Cancel/dismissal discards unapplied popup values, and Clear selection closes it. Verification: web TypeScript program in memory/no emit (0 diagnostics), ESLint on both files (0 errors/warnings, no cache/fixes), Prettier checks and git diff --check pass. No browser/server startup, database operations, generated files, caches, or unrelated edits. Task remains In Progress with acceptance criteria unchanged pending interactive verification.

Implemented the approved toolbar/responsive UI refinement in SetupEditor.tsx and ExercisesTable.tsx. Draft actions occupy the first toolbar row; Save changes and Leave/Discard occupy the second. Removed fixed editor and column minimum widths; wide containers use a full-width fixed-layout table with wrapping headers, badges, and actions. Below 64rem of catalogue container width, the same row/editor instances use labelled 1/2/3-column field grids (breakpoints 24rem and 42rem), retaining every field, row selection, Select all, read-mode sorting controls, and per-row actions. Only vertical table scrolling remains. Filter fields also shrink within their container. Verification: in-memory React SSR checks pass for read/edit layouts, requested toolbar grouping, all stacked field labels, long unbroken names, selection/actions/input presence, and empty/filtered states; Tailwind compilation in memory confirms named-container and overflow rules. Web TypeScript has 0 diagnostics; scoped ESLint has 0 errors/warnings; Prettier and git diff --check pass. These are static/render checks, not browser layout verification. No generated files, caches, browser/server startup, database operations, or unrelated edits. Task stays In Progress with acceptance criteria unchanged pending interactive verification.

Implemented the approved edit-mode polish in ExercisesTable.tsx and SetupEditor.tsx: ID is now 6rem wide in the desktop table and explicitly nonwrapping (normal overflow-wrap); column heading is Uni, with centered/middle-aligned cells and a centered checkbox in a control-height wrapper. Empty movement-pattern pickers show Select movement while selected pattern badges remain unchanged. Per-row actions use copy and destructive red trash icon buttons, with accessible row-specific labels and hover titles. Trash remains limited to unsaved rows, and duplication/removal handlers are unchanged. Verification: web TypeScript 0 diagnostics, scoped ESLint 0 errors/warnings, Prettier and git diff --check pass. In-memory React render/handler checks cover a 10-digit ID and merged no-wrap classes, Uni labels/centering, empty and selected movement displays, copy/trash icons and red button styling, accessible labels, callback execution, and absence of trash for saved rows. No browser layout testing, server/browser startup, generated files/caches, database operations, or unrelated edits. Task remains In Progress; acceptance criteria unchanged.

Applied the approved width-only adjustment: Uni now uses a fixed 48px desktop column (w-12) instead of 6%, with centered alignment and responsive stacked layout unchanged. Only ExercisesTable.tsx source changed. Prettier and git diff --check pass; no browser testing or generated files/caches.

Applied the approved alignment/width adjustment in ExercisesTable.tsx only: ID now uses 64px desktop width (w-16) with no-wrap unchanged. Uni cells use a centered flex column in stacked row layouts; desktop cells still use table-cell display and vertical-align: middle. Scoped ESLint (0 errors/warnings), Prettier, and git diff --check pass. In-memory Tailwind merge/compilation checks confirm the Uni flex layout supersedes block/align-top while desktop table-cell display remains intact, plus the 64px ID rule and no-wrap. No browser layout verification, generated files/caches, server/browser startup, database operations, or unrelated source changes.
<!-- SECTION:NOTES:END -->
