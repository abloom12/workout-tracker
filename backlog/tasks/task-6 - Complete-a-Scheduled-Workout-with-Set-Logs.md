---
id: TASK-6
title: Complete a Scheduled Workout with Set Logs
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-5
documentation:
  - doc-1
type: feature
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Logging performed training is the core product interaction. Deliver the path from opening a Scheduled Workout through dynamic Set entry and persistence as a completed Workout Session, while preserving the values needed for trustworthy history.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can open one of their Scheduled Workouts and see its Exercises in the saved Workout order
- [ ] #2 The logging interface supports entering multiple Set Logs with reps and weight for the Scheduled Workout's Exercises
- [ ] #3 Reps accept only positive whole numbers
- [ ] #4 Weight accepts zero and positive whole numbers, displays in lb, and rejects decimals and negative values
- [ ] #5 Validation is enforced by the supported server interface as well as communicated accessibly in the form
- [ ] #6 Successful completion persists a Workout Session, its Exercise order, Set order, reps, weight, date, and required display names
- [ ] #7 Successful and failed submissions expose clear state, and a failed submission does not discard entered Set Logs
- [ ] #8 One user cannot open or complete another user's Scheduled Workout
- [ ] #9 Automated API coverage verifies validation, zero-weight acceptance, persistence, ownership, and historical values
<!-- AC:END -->
