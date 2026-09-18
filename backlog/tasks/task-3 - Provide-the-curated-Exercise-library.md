---
id: TASK-3
title: Provide the curated Exercise library
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-1
documentation:
  - doc-1
type: feature
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Lifters need a focused set of conventional strength and hypertrophy movements without maintaining an exercise catalog. Deliver the approved read-only Exercise library as the source for later Workout composition.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An authenticated user can browse the configured curated Exercise library
- [ ] #2 The library contains weightlifting Exercises and does not present cardio, distance, duration, or CrossFit-style activities
- [ ] #3 The interface provides no operation for a user to create, edit, or delete an Exercise
- [ ] #4 Exercise retrieval exposes accessible loading, failure, and empty behavior and remains usable at mobile and desktop widths
- [ ] #5 Automated API coverage verifies that the library is readable through the supported interface but cannot be mutated through user-facing procedures
<!-- AC:END -->
