# Architecture

## Purpose and scope

This document describes the architecture currently implemented in the repository.
It is an entry point for humans and AI assistants, not a specification of the
finished product. Incomplete and future capabilities are identified explicitly.

For installation, environment setup, and development commands, see the
[root README](../README.md).

## Overview

Workout Tracker is a browser-based application for organizing and tracking
training.

The system consists of a React single-page application, a Fastify server, and a
PostgreSQL database. The server is a single deployable application composed from
workspace packages, not a collection of independently deployed services.

Applications and shared packages live in a TypeScript monorepo managed with pnpm
workspaces and Turborepo.

## Technology stack

| Area                 | Technology                             | Responsibility                                            |
| -------------------- | -------------------------------------- | --------------------------------------------------------- |
| Language and runtime | TypeScript, Node.js                    | Typed application code and server execution               |
| Workspace and tasks  | pnpm workspaces, Turborepo             | Dependency management, task ordering, and build caching   |
| Web application      | React, Vite                            | Browser UI and frontend development/build tooling         |
| Routing              | TanStack Router                        | File-based routes, route loaders, and navigation guards   |
| Server state         | TanStack Query                         | API result caching, queries, and mutations                |
| Forms and tables     | TanStack Form, TanStack Table          | Form state and tabular interfaces                         |
| UI and styling       | Tailwind CSS, Radix UI                 | Styling and accessible UI primitives                      |
| HTTP server          | Fastify                                | HTTP hosting, middleware, and endpoint registration       |
| Application API      | tRPC                                   | Typed procedures and a shared client/server API contract  |
| Validation           | Zod                                    | API input validation and server environment validation    |
| Authentication       | Better Auth                            | Email/password login, sessions, and admin capabilities    |
| Persistence          | PostgreSQL, Drizzle ORM, node-postgres | Relational storage, typed queries, and transactions       |
| Schema changes       | Drizzle Kit                            | SQL migration generation and application                  |
| Quality tooling      | ESLint, Prettier, TypeScript, Vitest   | Static checks, formatting, typechecking, and test tooling |

Exact versions are maintained in workspace `package.json` files,
[pnpm-workspace.yaml](../pnpm-workspace.yaml), and the lockfile rather than copied
here. Runtime requirements are declared in [package.json](../package.json) and
`.nvmrc`.

## Code organization

| Location                       | Responsibility                                                                         | Main entry point                          |
| ------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| `apps/web` (`@acme/web`)       | Browser application, routes, components, and API/auth clients                          | [App.tsx](../apps/web/src/App.tsx)        |
| `apps/server` (`@acme/server`) | Server startup, configuration, dependency composition, and HTTP middleware             | [app.ts](../apps/server/src/app.ts)       |
| `packages/api` (`@acme/api`)   | tRPC routers, request context, input validation, and procedure authorization           | [index.ts](../packages/api/src/index.ts)  |
| `packages/auth` (`@acme/auth`) | Better Auth construction, authentication policy, and adapter configuration             | [index.ts](../packages/auth/src/index.ts) |
| `packages/db` (`@acme/db`)     | Database construction, schemas, queries, transactions, migrations, and reference seeds | [index.ts](../packages/db/src/index.ts)   |
| `tooling`                      | Shared ESLint, Prettier, and TypeScript configurations                                 | [tooling/](../tooling/)                   |

### Dependency boundaries

- `apps/server` is the composition root: it creates the database, passes it to
  the auth factory, and injects both into the API factory.
- `packages/api` calls exported database query functions and uses auth types.
  The request context carries runtime dependencies into procedures.
- `packages/auth` receives a database through its adapter rather than importing
  the `@acme/db` package directly.
- `packages/db` owns persistence and does not depend on the API or applications.
- `apps/web` imports the API's `AppRouter` as a **type only**. Server code and
  database credentials do not belong in the browser bundle.

These describe the current organization, not a claim that every boundary has a
custom lint rule enforcing it.

### Frontend organization

[TanStack Router routes](../apps/web/src/routes/) organize screens by application
area. `_app` is a pathless authenticated layout; its children share the protected
shell. The `admin` route adds an admin navigation guard.

Route-local components and types are colocated in `-components` directories and
other `-`-prefixed files, which are excluded from route discovery. Reusable UI
primitives live in `components/ui`, shared components in `components`, and client
integrations in `lib`. `routeTree.gen.ts` is generated by the router plugin.

## Architecture patterns and trade-offs

### Layered responsibilities with direct query calls

The common application path is:

```text
Route / component → tRPC procedure → database query function → PostgreSQL
```

Procedures handle transport-facing validation and access checks. Database query
functions handle persistence operations and result mapping. There is no generic
repository abstraction or mandatory service layer between them. Some behavior,
such as multi-record Exercise saves, currently lives in the database package.

This keeps the current implementation small, but API code is coupled to exported
persistence types and some database enum definitions. The architecture is not a
strict dependency-inverted Clean Architecture or a fully modeled DDD design.

### Factory-based dependency injection

`createDB`, `createAuth`, and `createApi` make dependency construction explicit.
The Fastify application wires them together without a dependency-injection
container. API procedures receive the database and session through context.

### Shared typed API contract

The frontend's tRPC client derives its contract from `AppRouter`. This gives
compile-time agreement within the monorepo, while Zod still validates mutation
inputs at runtime. Type sharing does not replace runtime validation or API
access checks, and the client remains coupled to the server contract.

### Relational integrity and transactional writes

Foreign keys, uniqueness constraints, and join tables enforce catalog integrity.
Exercise creation and updates use transactions to keep the Exercise and its
assignments consistent. Batch saves run in one transaction, so a failure rolls
back the batch.

See [Exercise queries](../packages/db/src/queries/exercises.ts). Known persistence
failures become `ExerciseWriteError` values, which the API translates into tRPC
errors such as `CONFLICT`, `BAD_REQUEST`, and `NOT_FOUND`.

## Cross-cutting concerns

### Authentication and authorization

- Better Auth owns email/password authentication and cookie-based sessions,
  using the same PostgreSQL database through its Drizzle adapter.
- Protected tRPC procedures require a resolved session. Catalog reads require
  authentication; they are not restricted to admins.
- Exercise writes additionally read the actor's current database role and ban
  flag, rather than trusting cached role information.
- The admin route checks a fresh session with the cookie cache disabled.
  Hiding links or redirecting in the browser does not authorize API operations.
- Better Auth's admin plugin provides its own server-side permission checks.

Authentication currently enables a short-lived session cookie cache and does
not require email verification. Password-reset email delivery is not configured.
The password minimum is relaxed only when `NODE_ENV=development`; this must not
be used for a public deployment. See
[auth options](../packages/auth/src/options.ts) for the authoritative policy.

### Configuration, HTTP protection, and errors

[Server configuration](../apps/server/src/env.ts) validates environment variables
with Zod at startup. The server owns database and auth secrets; the web app uses
`VITE_API_URL` for its browser-facing server address. Vite-exposed configuration
must not contain secrets.

Fastify registers credentialed CORS with configured origins, security headers
through Helmet, and request rate limiting. Better Auth also has a configured
trusted application origin. These controls do not replace procedure-level
authorization.

The server logs through Fastify's logger, including tRPC and authentication
handler failures. API procedures use tRPC errors; frontend routes provide
loading and error UI where implemented. No external telemetry integration is
configured in the inspected application entry points.

### Schema lifecycle

Drizzle schemas are the source for migration generation. SQL migrations are
committed under `packages/db/src/migrations`; seeding is a separate operation
from migration. See [Drizzle configuration](../packages/db/drizzle.config.ts)
and [the seed entry point](../packages/db/src/seed.ts).

## Current limitations and future scope

- Program building is an in-progress frontend feature, not an end-to-end
  persisted workflow.
- Workout scheduling, session logging, and history do not yet have implemented
  API routers or database models.
- Admin user-management UI remains a placeholder; the catalog editor does not
  provide full management of every reference-data type.
- Production hosting, TLS termination, backups, and operational monitoring are
  not defined by the local development setup.

These are boundaries of the current implementation, not commitments to a
particular future design.

## Maintaining this document

Update this document when runtime topology, package ownership, domain boundaries,
security behavior, or major architectural patterns change. Keep version numbers
and operational instructions in their authoritative files rather than
repeating them here.

This overview describes the current system and observable trade-offs; it does
not reconstruct undocumented historical reasoning. Future significant decisions
can be recorded as Architecture Decision Records (ADRs) under `docs/decisions/`
and linked here. No ADR directory is required until there is a decision to record.
