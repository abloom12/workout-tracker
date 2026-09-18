---
id: doc-1
title: Weekend Weightlifting Tracker MVP
type: specification
created_date: '2026-09-18 14:07'
updated_date: '2026-09-18 14:09'
---
# Weekend Weightlifting Tracker MVP

## Problem

The project needs to provide a public, deployed React application suitable for demonstrating professional frontend ability during a job search.

A focused weightlifting tracker combines a credible product problem with the creator’s prior experience as a personal trainer. The MVP must be small enough to complete during a three-day weekend while still demonstrating meaningful React architecture, forms, server state, typed APIs, persistence, accessibility, and testing.

## Intended Outcome

Deliver a public weightlifting application in which an authenticated user can:

- build reusable Workouts from a curated Exercise library;
- schedule Workouts for calendar dates;
- perform scheduled Workouts by logging sets, reps, and weight; and
- review Workout and Exercise History without later template changes rewriting completed training.

The deployed application is the primary résumé project. The source fullstack starter remains a separate supporting project.

## User Stories

1. As a lifter, I can browse a curated library of traditional weightlifting Exercises so that I can build Workouts without maintaining an exercise catalog.

2. As a lifter, I can create a named Workout and add or remove Exercises from it so that I can reuse an ordered training routine such as Push Day or Upper Body Day.

3. As a lifter, I can delete a Workout after reviewing a warning so that I can remove routines I no longer use.

4. As a lifter, I can assign a Workout to a calendar date so that I know which Workout I intend to perform.

5. As a lifter, I can open a Scheduled Workout and log sets, reps, and weight so that the performed Workout becomes part of my training history.

6. As a lifter, I can review completed Workout Sessions so that I can see what I performed on previous dates.

7. As a lifter, I can review Set Logs grouped by Exercise so that I can see my previous performance for a movement.

## Requirements and Invariants

### Domain language

- **Exercise:** A reusable weightlifting movement from the application’s curated Exercise library.
- **Workout:** A reusable, ordered group of Exercises, such as Push Day or Upper Body Day.
- **Scheduled Workout:** A Workout assigned to a calendar date.
- **Workout Session:** A performed occurrence of a Workout containing logged Sets.
- **Set Log:** The performed data for one set: reps and weight.
- **Workout History:** A derived view of completed Workout Sessions.
- **Exercise History:** A derived view of Set Logs grouped by Exercise.

These terms must retain their distinct meanings in user-facing copy, data contracts, APIs, tests, and implementation naming.

### Exercise library

- The application provides a curated library of traditional weightlifting Exercises.
- Users cannot create, edit, or delete Exercises in the MVP.
- Users can add Exercises from the library to a Workout.
- Users can remove Exercises from a Workout without removing them from the library.
- The library focuses on conventional strength and hypertrophy training.
- Cardio, distance-based activities, duration-based activities, and CrossFit-style movements or workouts are excluded.
- The exact contents of the initial Exercise library are not prescribed by this specification.

### Workouts

- A user can create a Workout.
- A Workout contains an ordered group of Exercises selected from the curated library.
- A user can add and remove Exercises from a Workout.
- A user can delete a Workout.
- Deleting a Workout requires a warning that explains the scheduling effect.
- If the user confirms deletion, unperformed Scheduled Workouts referencing that Workout are also removed from the schedule.
- Deleting or changing a reusable Workout must not alter completed Workout Sessions or their Set Logs.

### Scheduling

- A user can assign a Workout to a calendar date.
- Scheduling is date-based only.
- The MVP does not support recurrence or time-of-day scheduling.
- Starting an unscheduled Workout is excluded.
- Removing a deleted Workout’s unperformed Scheduled Workouts must not remove completed history.

### Workout Sessions and Set Logs

- A Workout Session represents one performed occurrence of a Workout.
- A Workout Session is started from a Scheduled Workout.
- A Set Log records reps and weight for one performed set.
- Reps must be positive whole numbers.
- Weight must be a nonnegative whole number.
- Weight is stored and displayed in pounds (`lb`).
- Zero weight is allowed for bodyweight movements.
- Decimal and negative weights are invalid in v1.
- The logging interface must support the dynamic set-entry behavior necessary to record multiple Set Logs.
- A completed Workout Session is a historical fact.
- The MVP does not provide a user-facing operation to edit or delete completed Workout Sessions or Set Logs.

### Historical preservation

- Workout History is derived from completed Workout Sessions.
- Exercise History is derived from Set Logs grouped by Exercise.
- History is not a separate user-managed record type.
- Completed history must preserve the Workout and Exercise display names, Exercise order, Set order, reps, weight, and dates required to render what was performed.
- Later changes to or deletion of a reusable Workout must not rewrite or cascade-delete completed history.
- Completed Workout Sessions must remain renderable independently of whether their reusable Workout still exists.

### Ownership and authentication

- Product functionality uses the inherited email-and-password authentication system.
- Workout data belongs to the authenticated user.
- Protected product data and operations must be scoped to that user on the server.
- One user must not be able to read or mutate another user’s Workouts, schedules, Sessions, or Set Logs.

### Product quality

The public application must emphasize credible React work through:

- component and route composition;
- dynamic form state;
- TanStack Router;
- TanStack Query;
- TanStack Form;
- typed API integration;
- explicit loading, empty, error, and mutation states;
- responsive behavior;
- accessible labels, validation, controls, and keyboard interaction; and
- a small number of meaningful automated tests.

The final release must include:

- a public deployment;
- a production database;
- a usable mobile and desktop experience;
- a public README;
- screenshots; and
- documented local setup and verification commands.

## Implementation Decisions

- The Workout application is maintained as a repository independent from the source fullstack starter.
- Shared Git history may be retained when practical, but the repositories are not continuously synchronized.
- The application retains the starter’s React and Vite frontend, TanStack Router, TanStack Query, TanStack Form, typed tRPC API, Fastify server, Drizzle ORM, PostgreSQL database, and Better Auth foundation.
- Product work and MVP-blocking fixes happen in the Workout repository first.
- Generic starter hardening is deferred unless it blocks the MVP.
- Generic fixes suitable for the starter should remain isolated so they can optionally be backported after the MVP.
- Completed Workout Sessions must contain or retain the historical values needed to render them independently of the reusable Workout. The exact database deletion and archival mechanism remains an implementation-level choice as long as the observable preservation requirements hold.
- Deployment-provider and database-host selection remain operational choices based on available accounts, cost, and compatibility with the inherited architecture.

## Testing Decisions

Testing should use two principal public seams.

### Authenticated API and persistence seam

Exercise the protected tRPC/Fastify API against PostgreSQL to verify:

- authenticated ownership boundaries;
- Workout creation and composition;
- date-based scheduling;
- Set Log validation;
- acceptance of zero weight;
- rejection of decimal or negative weight;
- rejection of nonpositive or fractional reps;
- completion and persistence of Workout Sessions;
- confirmed Workout deletion removing unperformed Scheduled Workouts; and
- completed history surviving reusable Workout deletion.

These tests should validate observable API and persistence behavior rather than private helper functions.

### Browser journey seam

Exercise one focused browser journey through the React application:

1. Sign up or log in.
2. Create a Workout from curated Exercises.
3. Schedule the Workout.
4. Log multiple Sets with reps and whole-number weight.
5. Complete the Workout Session.
6. Verify Workout History.
7. Verify Exercise History.
8. Delete the reusable Workout after accepting the warning.
9. Confirm its unperformed scheduled occurrences are removed.
10. Confirm the completed Session remains visible in History.

The browser journey should also provide practical coverage of routing, dynamic forms, server-state transitions, accessibility, and responsive presentation.

## Out of Scope

- User-created, edited, or deleted Exercises.
- Cardio activities.
- Duration or distance tracking.
- CrossFit-style movements or workouts.
- Alternate Exercise measurement types.
- Starting an unscheduled Workout.
- Recurring schedules.
- Time-of-day scheduling.
- Editing or deleting completed Workout Sessions or Set Logs.
- Decimal weights.
- Unit preferences or kilogram conversion.
- Exercise APIs or third-party Exercise catalogs.
- Social features.
- Coaching features.
- Program generation.
- Nutrition.
- Subscriptions.
- Photos.
- Offline support.
- Timers.
- Advanced charts or analytics.
- Continuous synchronization with the source starter repository.
- Completing the starter’s deferred hardening task chain before beginning product work.

## Further Notes

The three-day delivery priority is:

1. Establish the repository, verify inherited authentication and database behavior, define the schema, and build the application shell.
2. Implement the complete Workout-building, scheduling, and logging path with persistence.
3. Add History, focused tests, responsive and accessibility polish, deployment, screenshots, and the public README.

Deployment time must be protected rather than treated as optional end-of-project cleanup.
