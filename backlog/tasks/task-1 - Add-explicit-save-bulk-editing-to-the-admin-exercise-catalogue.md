---
id: TASK-1
title: Add explicit-save bulk editing to the admin exercise catalogue
status: In Progress
assignee:
  - '@pi'
created_date: '2026-10-24 22:23'
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
- [ ] #5 Existing IDs and exercise codes remain stable on edits, authorization and reference validation remain enforced, and existing seed data is unchanged.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace the single-row editor with a TanStack Form array-backed draft and reuse a TanStack Table grid through typed table meta/render callbacks. Keep sorting disabled while editing to preserve focus.
2. Add an admin-only bulk-save API and a DB transaction that reuses internal exercise write helpers; retain existing single-write APIs and report the failed change.
3. Add row creation, duplication, draft-only removal, muscle selectors, explicit save/discard, and TanStack Router unsaved-navigation protection within the five approved source files.
4. Validate with no-output/no-cache static checks where possible. Do not create test files, build artifacts, caches, or perform database writes without separate approval.
<!-- SECTION:PLAN:END -->
