---
id: TASK-5
title: Schedule a Workout by calendar date
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-4
documentation:
  - doc-1
type: feature
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A reusable Workout becomes actionable when it is assigned to a date. Deliver date-only scheduling and a persisted view of the authenticated user's Scheduled Workouts without introducing recurrence, times, or unscheduled starts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can select one of their Workouts and assign it to a calendar date
- [ ] #2 The Scheduled Workout remains visible with its assigned date after reloading the application
- [ ] #3 Scheduling and display preserve the selected calendar date without timezone-related date shifting
- [ ] #4 The scheduling interface contains no recurrence or time-of-day behavior
- [ ] #5 The product does not offer an entry point for starting an unscheduled Workout
- [ ] #6 Schedule loading, empty, failure, and mutation states are accessible and responsive
- [ ] #7 Server-side ownership enforcement prevents one user from viewing or changing another user's Scheduled Workouts
- [ ] #8 Automated API coverage verifies date-only persistence and ownership boundaries
<!-- AC:END -->
