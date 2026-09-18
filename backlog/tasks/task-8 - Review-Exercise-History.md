---
id: TASK-8
title: Review Exercise History
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-6
documentation:
  - doc-1
type: feature
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Lifters need to see prior performance for each movement without maintaining a separate history resource. Deliver a read-only derived view of the authenticated user's Set Logs grouped by Exercise.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can select or inspect an Exercise and review their previous Set Logs for it
- [ ] #2 Exercise History groups performed Set Logs by Exercise and shows the preserved Exercise name, performed dates, reps, whole-number weight, and lb
- [ ] #3 Exercise History is derived from completed Set Logs rather than maintained as an independent user-managed record
- [ ] #4 The interface offers no operation to edit or delete historical Set Logs
- [ ] #5 Loading, empty, and failure states are accessible and usable at mobile and desktop widths
- [ ] #6 Server-side ownership enforcement prevents one user from viewing another user's Exercise History
<!-- AC:END -->
