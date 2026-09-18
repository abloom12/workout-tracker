---
id: TASK-4
title: Build reusable Workouts from curated Exercises
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
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
