---
id: TASK-10
title: Publish the portfolio-ready MVP
status: To Do
assignee: []
created_date: '2026-09-18 14:19'
labels: []
dependencies:
  - TASK-2
  - TASK-9
documentation:
  - doc-1
type: chore
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The completed behavior must be publicly usable and quickly understandable to hiring reviewers. Verify the complete production journey and present it with reproducible documentation and current visual evidence.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The production deployment supports the complete authenticated journey from Workout creation through scheduling, Set logging, both History views, and safe Workout deletion
- [ ] #2 One automated browser journey covers signup or login, Workout creation from curated Exercises, scheduling, multiple Set Logs, completion, both History views, confirmed deletion, schedule cleanup, and historical preservation
- [ ] #3 The critical journey has no blocking keyboard, labeling, validation, focus, mobile-layout, desktop-layout, browser-console, or server errors
- [ ] #4 Repository-level formatting, linting, typechecking, production builds, API tests, and the browser journey pass through documented commands
- [ ] #5 The public README accurately describes the product, architecture, features, local setup, migrations, tests, deployment, scope, and material trade-offs
- [ ] #6 The README contains the live URL and current mobile and desktop screenshots of the product
- [ ] #7 Primary product surfaces contain no misleading starter, scaffold, or placeholder presentation
<!-- AC:END -->
