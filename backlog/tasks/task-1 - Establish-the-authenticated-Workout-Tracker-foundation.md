---
id: TASK-1
title: Establish the authenticated Workout Tracker foundation
status: To Do
assignee: []
created_date: '2026-09-18 14:18'
labels: []
dependencies: []
documentation:
  - doc-1
type: chore
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The repository needs a runnable Workout Tracker foundation based on the approved starter architecture before product slices can deliver behavior. This establishes authentication, database initialization, product identity, and an authenticated shell without expanding into workout features.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A clean checkout can install dependencies and start the React application, Fastify API, and PostgreSQL database using documented commands
- [ ] #2 Committed migrations initialize a fresh database successfully
- [ ] #3 A visitor can sign up, log in, enter the authenticated application shell, log out, and is prevented from opening protected product routes anonymously
- [ ] #4 The authenticated shell identifies the product as Workout Tracker and provides a responsive, keyboard-operable foundation for its product surfaces
- [ ] #5 Repository-level formatting, linting, typechecking, and production builds pass using documented commands
<!-- AC:END -->
