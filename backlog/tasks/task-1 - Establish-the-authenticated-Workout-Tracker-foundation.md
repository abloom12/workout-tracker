---
id: TASK-1
title: Establish the authenticated Workout Tracker foundation
status: In Progress
assignee: []
created_date: '2026-09-18 14:18'
updated_date: '2026-09-18 22:35'
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach

Establish the Workout Tracker as an independent product repository by importing the reviewed application foundation from the sibling fullstack starter as a source snapshot—not by adding a Git remote, merging histories, or creating any ongoing repository relationship.

Preserve this repository’s existing Backlog and agent guidance. Bring across only the application workspaces, reusable UI inventory, lockfile, tooling, and runtime configuration needed by the approved stack.

Reduce the inherited authentication setup to the supported email/password and session flow, establish a reproducible core-auth migration, and replace starter-facing presentation with a responsive authenticated Workout Tracker shell. Repair only inherited issues that block this task’s migration and quality criteria; do not begin Exercise, Workout, scheduling, or history behavior.

## Implementation Steps

1. **Import the independent application baseline**
   - Bring the tracked `apps/`, `packages/`, `tooling/`, workspace manifests, lockfile, TypeScript/Turbo configuration, environment examples, ignore rules, and Compose configuration from the reviewed `fullstack-starter` application tree.
   - Preserve this repository’s `AGENTS.md`, `backlog/`, specification, tasks, and Git history.
   - Do not import the starter’s `.git`, Backlog artifacts, starter specification/tasks, README, or proprietary license.
   - Rename root and visible runtime identity from Fullstack Starter or generic demo wording to Workout Tracker.

2. **Narrow authentication to the required foundation**
   - Simplify `packages/auth` and its server/client wiring to Better Auth email/password authentication and sessions.
   - Remove Google OAuth configuration and the unused admin, organization, two-factor, OpenAPI, and breached-password plugins so they do not expand the database baseline or public product contract.
   - Retain signup, login, logout, session lookup, profile update, and password update behavior.
   - Remove obsolete plugin-specific client scaffolding and environment examples.
   - Keep the protected tRPC context and public/protected health procedures as the initial typed API seams.

3. **Establish reproducible local PostgreSQL initialization**
   - Reduce the authentication schema to the core user, session, account, and verification records required by the retained auth behavior.
   - Configure root database commands to load the server environment predictably while allowing an explicitly supplied `DATABASE_URL` to take precedence.
   - Correct Compose port mapping, use Workout Tracker-neutral database resource names, and add PostgreSQL readiness behavior.
   - Generate and review one initial Drizzle migration and metadata for the core authentication schema.
   - Remove empty or misleading migration, seed, and schema placeholders that do not represent supported behavior.
   - Verify that a fresh PostgreSQL 17 database accepts the committed migration.

4. **Make the inherited authentication journey browser-correct**
   - Update shared input and password fields to expose stable `id` and `name` values, applicable autocomplete attributes, correctly associated descriptions/errors, and accurate password-visibility announcements.
   - Apply appropriate autocomplete values to signup, login, profile, and password-update fields.
   - Verify signup, login, and password-update forms are keyboard-operable and retain accessible pending and validation feedback.

5. **Build the authenticated Workout Tracker shell**
   - Replace the generic home/demo presentation with a Workout Tracker landing and authenticated landing surface.
   - Turn the existing `/_app` route into the shared protected application layout, retaining its session guard and outlet for later product routes.
   - Add responsive, keyboard-operable brand/navigation/account controls and logout behavior without implementing future Exercise, Workout, scheduling, or history features.
   - Make authentication redirects return users to the authenticated landing surface or originally requested supported route.
   - Update Better Auth’s application name and the browser document title to Workout Tracker.
   - Retain the account settings route inside the authenticated shell.

6. **Make local quality gates truthful and green**
   - Fix inherited formatting failures, strict API lint findings, shared ESLint ESM resolution, and TanStack Router’s expected route-export lint handling without broadly weakening rules.
   - Ensure web typechecking continues to cover both application source and Vite configuration.
   - Keep generated route output excluded from linting and regenerate it through the normal TanStack Router/Vite workflow rather than hand-editing it.
   - Confirm the imported dependency graph installs from the frozen lockfile and all workspace builds complete.

7. **Document the verified foundation**
   - Replace the placeholder README with accurate prerequisites, environment setup, PostgreSQL startup and migration, development, quality-check, and production-build commands.
   - Clearly distinguish root Compose variables, server runtime variables, and browser API configuration.
   - Describe only the authentication and application-shell behavior delivered by this task; do not claim later product features.

## Acceptance Criteria Coverage

- **Clean checkout installs and starts the React app, API, and PostgreSQL** — imported workspace configuration, corrected environment/Compose setup, frozen-lockfile installation, documented startup commands, and a local startup smoke check.
- **Committed migrations initialize a fresh database** — reduced core-auth schema, reviewed initial Drizzle migration, and migration against a disposable PostgreSQL 17 database.
- **Signup, login, protected access, and logout work** — retained Better Auth email/password flow, protected `/_app` layout, redirect handling, and a browser smoke journey covering anonymous and authenticated states.
- **Responsive, keyboard-operable Workout Tracker shell** — product identity, protected shared layout, navigation/account controls, corrected form semantics, and manual narrow/mobile and keyboard verification.
- **Formatting, linting, typechecking, and builds pass** — repaired inherited quality blockers and clean root quality-command results.

## Final Verification

- `pnpm install --frozen-lockfile` — proves the committed dependency graph installs reproducibly.
- `pnpm db:up` — starts the configured PostgreSQL 17 service and reaches readiness.
- `pnpm db:migrate` — proves the committed core-auth migration initializes the configured fresh database.
- `pnpm db:migrate` — confirms rerunning the migration command is safe.
- `pnpm format` — verifies repository formatting.
- `pnpm lint` — verifies strict lint configuration loads and all imported source passes.
- `pnpm typecheck` — verifies application, tooling, and typed API contracts.
- `pnpm build` — verifies all workspaces produce their production builds.
- `pnpm dev` — supports a manual browser check of signup, login, protected-route redirection, authenticated shell navigation, keyboard operation, responsive layout, logout, and subsequent protected-route rejection.
- `git diff --check` — verifies the implementation contains no whitespace errors.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Configure editor format-on-save for the web workspace so the shared Prettier configuration automatically formats files and organizes imports through @ianvs/prettier-plugin-sort-imports.
<!-- SECTION:NOTES:END -->
