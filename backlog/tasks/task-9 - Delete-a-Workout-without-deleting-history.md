---
id: TASK-9
title: Delete a Workout without deleting history
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-7
  - TASK-8
documentation:
  - doc-1
type: feature
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users need to remove obsolete reusable Workouts without losing performed facts. Deliver the approved warning, cancellation, future schedule cleanup, and completed-history preservation behavior as one coherent deletion flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Deleting a Workout presents a warning that explains its unperformed Scheduled Workouts will also be removed while completed history will remain
- [ ] #2 Cancelling the warning leaves the Workout, its Scheduled Workouts, and its completed history unchanged
- [ ] #3 Confirming deletion removes the reusable Workout from the user's available Workouts
- [ ] #4 Confirming deletion removes all unperformed Scheduled Workouts that reference the deleted Workout
- [ ] #5 Completed Workout Sessions and Set Logs remain unchanged and render correctly in Workout History after deletion
- [ ] #6 Set Logs remain grouped and render correctly in Exercise History after deletion
- [ ] #7 One user cannot delete another user's Workout or affect that user's schedule or history
- [ ] #8 Automated API and persistence coverage verifies schedule cleanup, historical preservation, and ownership
<!-- AC:END -->
