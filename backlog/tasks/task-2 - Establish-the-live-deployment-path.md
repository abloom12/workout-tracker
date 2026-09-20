---
id: TASK-2
title: Establish the live deployment path
status: In Progress
assignee: []
created_date: '2026-09-18 14:19'
updated_date: '2026-09-19 23:40'
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach

Package the application as a provider-neutral OCI container deployed initially to a Render Free Web Service, backed by a Neon Free PostgreSQL database. Fastify will serve the built React application, tRPC API, and Better Auth routes from one HTTPS origin, avoiding cross-origin cookie issues.

The container’s production entrypoint will apply committed Drizzle migrations before starting Fastify because Render’s free services do not support pre-deploy commands. Deployment will use only standard environment variables and PostgreSQL connections; no Render or Neon SDKs will enter application code. Render and Neon cold starts are accepted as the free-tier trade-off.

## Implementation Steps

1. **Make Fastify the single production origin**
   - Update `apps/web/src/lib/auth-client.ts` and `apps/web/src/lib/trpc.ts` to use same-origin `/api/auth` and `/trpc` requests rather than a build-time API hostname.
   - Extend the Vite development proxy for both API namespaces and remove the obsolete required `VITE_API_URL` configuration.
   - Add static-file support to `apps/server` so it serves `apps/web/dist`, returns the SPA entry point for browser routes, and preserves API-specific not-found behavior.
   - Add a lightweight `GET /health` endpoint for container and Render health checks.
   - Ensure the server binds to the configured host and Render-provided port, trusts the hosting proxy appropriately, and uses production-suitable structured logging.

2. **Provide a production-safe migration entrypoint**
   - Add a compiled migration runner in `packages/db` that applies the committed Drizzle migration directory using `DATABASE_URL`.
   - Include migration SQL and metadata in the database package’s production output.
   - Add a production start command that runs migrations before launching Fastify and fails without starting the application if migration fails.
   - Retain the existing Drizzle Kit generation and local migration workflows.
   - Use Neon’s direct SSL PostgreSQL connection string for this low-traffic deployment so the same connection works reliably for migrations and application access.

3. **Create the portable container workflow**
   - Add a multi-stage root `Dockerfile` using the repository’s pinned Node and pnpm versions, frozen dependency installation, workspace builds, a non-root runtime, and the migration-first production command.
   - Add `.dockerignore` rules excluding Git data, local dependencies, caches, build output, and all uncommitted environment or secret files.
   - Extend `docker-compose.yml` with an optional application profile and health check so the production image can be built and smoke-tested locally against PostgreSQL without changing the existing development database workflow.

4. **Document production configuration and deployment**
   - Update environment examples and `README.md` to distinguish local development values from required production variables: `NODE_ENV`, `HOST`, `PORT`, `APP_ORIGIN`, `CORS_ORIGIN`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `DATABASE_URL`.
   - Document creation of a Neon Free project, selection of its direct SSL connection string, and application of committed migrations through container startup.
   - Document creation of a Docker-based Render Free Web Service, `/health` configuration, generated HTTPS URL, secret configuration, deployment, restart, rollback, and log checks.
   - Record the live URL and explain free-tier cold starts, Neon limits, migration behavior, secret handling, and how the same image can move to another container host or standard PostgreSQL provider.

5. **Establish and verify the live environment**
   - Provision Neon PostgreSQL and configure Render secrets without writing credentials to tracked files, Docker layers, logs, or documentation.
   - Deploy the container and confirm startup logs show successful committed-migration application followed by Fastify startup.
   - Verify the public web page and health endpoint over HTTPS.
   - Complete signup, protected application access, logout, and login through the deployed browser application.
   - Restart or redeploy the Render service, then log in with the previously created account to prove Neon-backed data survives application replacement.

## Acceptance Criteria Coverage

- **The web application and API are publicly reachable over HTTPS** — the single Render HTTPS origin serves the React entry point and `GET /health`; verify both with public `curl` requests and a browser.
- **Production uses a persistent PostgreSQL database initialized from committed migrations** — the production entrypoint runs the packaged Drizzle migrations against Neon before Fastify starts; verify deployment logs and successful persisted authentication records.
- **Signup, login, authenticated application access, and logout work in the deployed environment** — manually exercise the complete Better Auth browser journey at the Render URL.
- **Data created through the deployed application survives an application restart or redeployment** — create an account, restart or redeploy the stateless Render service, and successfully log in with the same account afterward.
- **Required production configuration and repeatable deployment steps are documented without exposing secrets** — environment examples contain placeholders only, `.dockerignore` excludes secret files, and the README documents Neon, Render, migration, deployment, restart, and portability procedures.

## Final Verification

- `pnpm format` — verifies repository formatting.
- `pnpm lint` — verifies lint rules across the monorepo.
- `pnpm typecheck` — verifies application, migration-runner, and workspace types.
- `pnpm build` — verifies all production artifacts compile.
- `docker compose --profile app up --build --wait` — builds and starts the production container against local PostgreSQL.
- `curl --fail --show-error http://localhost:3000/health` — verifies the containerized API health endpoint.
- `curl --fail --show-error --location http://localhost:3000/ | grep -F '<title>Workout Tracker</title>'` — verifies the container serves the React application.
- `docker compose --profile app down` — stops the local container smoke environment while retaining its database volume.
- `git diff --check` — verifies no whitespace errors.
- `curl --fail --show-error "$PRODUCTION_URL/health"` — verifies the deployed API over HTTPS.
- `curl --fail --show-error --location "$PRODUCTION_URL/" | grep -F '<title>Workout Tracker</title>'` — verifies the deployed web application over HTTPS.
- In the deployed browser application, complete signup, protected access, logout, and login; restart or redeploy Render and confirm the same account can still log in.
<!-- SECTION:PLAN:END -->
