# Workout Tracker

A full-stack workout tracking application built with React, Fastify,
PostgreSQL, Better Auth, tRPC, and Turborepo.

The current foundation provides email/password authentication, protected
application routes, a responsive authenticated shell, and account session
controls. It also provides an application-owned curated Exercise catalog
through an authenticated read-only tRPC API. User-facing Exercise selection,
Workout composition, scheduling, logging, and History are delivered in later
slices.

## Prerequisites

- Node.js 24.21.0
- pnpm 10.34.5
- Docker with Docker Compose

The required Node and pnpm versions are recorded in `.nvmrc` and
`package.json`.

## Environment setup

Copy the committed environment examples:

```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Environment responsibilities:

| File               | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| `.env`             | PostgreSQL Compose database, user, password, and port |
| `apps/server/.env` | Fastify, Better Auth, CORS, and database connection   |
| `apps/web/.env`    | Browser-facing API URL                                |

The database credentials in `.env` must match the credentials in
`DATABASE_URL` inside `apps/server/.env`.

Replace `BETTER_AUTH_SECRET` with a unique value containing at least 32
characters before using the application outside local development.

## Install dependencies

```bash
pnpm install --frozen-lockfile
```

## Start PostgreSQL

Run PostgreSQL in its own terminal:

```bash
pnpm db:up
```

This runs PostgreSQL 17 in the foreground and streams its logs. Wait until it
reports that it is ready to accept connections.

In another terminal, apply the committed migrations:

```bash
pnpm db:migrate
```

Drizzle records applied migrations, so rerunning this command is safe.

Seed the application-owned Exercise catalog:

```bash
pnpm db:seed
```

The seed command can be rerun safely and inserts any missing configured
Exercises without creating duplicates.

Stop and remove the Compose services with:

```bash
pnpm db:down
```

The named database volume remains available across normal service restarts.

## Start development

With PostgreSQL running and migrations applied:

```bash
pnpm dev
```

Turbo builds local workspace dependencies, starts the Fastify API and Vite
application, and watches them for changes.

To additionally rerun typechecking and linting as relevant files change:

```bash
pnpm dev:check
```

- Web application: http://localhost:5173
- Fastify API: http://localhost:3000

## Authentication journey

1. Open the public landing page.
2. Create an account or sign in.
3. Enter the protected Dashboard.
4. Navigate between Dashboard and Settings through the responsive sidebar.
5. Sign out through the account menu.

Anonymous visitors cannot access protected Dashboard or Settings routes.

### Admin access

The admin section provides placeholder pages at `/admin` (Overview),
`/admin/users`, and `/admin/catalogue`. The Catalogue page contains tabs for
Exercises, Setups, Equipment, Attachments, Grips, Modifiers, and Muscles.
Management controls and snapshot export/import are not implemented yet.

The Admin sidebar link is visible only to users with the `admin` role. The
parent admin route checks a fresh server session, bypassing the cookie cache,
and redirects non-admin users to the Dashboard. These frontend guards are not
API authorization: future catalogue endpoints must also enforce admin access
on the server. Better Auth's existing admin endpoints already enforce their
own server-side permissions.

To promote your first account in development:

1. Create an account normally through Sign Up.
2. In Drizzle Studio, set that account's `user.role` field to `admin`, or run
   the following SQL against your development database, substituting your email:

   ```sql
   UPDATE "user"
   SET role = 'admin'
   WHERE email = 'your-email@example.com'
   RETURNING email, role;
   ```

3. Sign out and sign back in, then open Admin from the sidebar.

Normal signups remain ordinary users. Repeat the promotion after resetting the
user database; catalogue snapshots do not include user accounts or roles.

### Development passwords

With `NODE_ENV=development` in `apps/server/.env`, the server accepts passwords
as short as one character. The Vite development signup form uses the same
minimum. Production signup requires at least 12 characters; the server also
keeps that minimum when `NODE_ENV` is unset or is anything other than
`development`. The maximum remains 128 characters.

Empty passwords are not supported by Better Auth. Login only requires a
nonempty password, rather than enforcing the signup length policy. Never use
development passwords for real accounts or run a public deployment with
`NODE_ENV=development`.

## Database commands

| Command            | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `pnpm db:up`       | Start PostgreSQL and stream its logs           |
| `pnpm db:down`     | Stop and remove Compose services               |
| `pnpm db:logs`     | Follow logs from a detached PostgreSQL service |
| `pnpm db:migrate`  | Apply committed migrations                     |
| `pnpm db:seed`     | Seed the application-owned Exercise catalog    |
| `pnpm db:generate` | Generate a migration from schema changes       |
| `pnpm db:studio`   | Open Drizzle Studio                            |

## API tests

Run the focused API integration tests against the migrated and seeded
PostgreSQL database:

```bash
pnpm -F @acme/api test
```

The Exercise coverage verifies anonymous rejection and authenticated retrieval
through the protected tRPC router.

## Quality commands

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

Run these repository-level commands before submitting changes. Turbo executes
the corresponding checks across all applications, packages, and shared
tooling.
