---
id: TASK-2
title: Establish the live deployment path
status: In Progress
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-19 22:31'
labels: []
dependencies:
  - TASK-1
documentation:
  - doc-1
type: chore
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deployment risk needs to be exposed before final polish. Establish an early production path for the inherited web, API, authentication, migration, and PostgreSQL architecture so later product slices can be released without discovering hosting constraints at the end.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The web application and API are publicly reachable over HTTPS
- [ ] #2 Production uses a persistent PostgreSQL database initialized from committed migrations
- [ ] #3 Signup, login, authenticated application access, and logout work in the deployed environment
- [ ] #4 Data created through the deployed application survives an application restart or redeployment
- [ ] #5 Required production configuration and repeatable deployment steps are documented without exposing secrets
<!-- AC:END -->
