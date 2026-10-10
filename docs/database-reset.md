# Reset the local database and update the schema

Run these commands from the repository root.

**Warning:** resetting the database deletes all local data, including accounts
and workouts. Use this only for a disposable local development database.

## 1. Stop the application

Press `Ctrl+C` in the terminal running `pnpm dev`.

## 2. Tear down PostgreSQL and delete its data

```bash
pnpm db:down -v
```

The `-v` flag is forwarded to `docker compose down` and deletes the database
volume. Without `-v`, `pnpm db:down` preserves the data.

## 3. Edit the schema

Edit the appropriate file:

- `packages/db/src/schemas/workout-schema.ts`
- `packages/db/src/schemas/auth-schema.ts`

Both are exported through `packages/db/src/schema.ts`.

## 4. Generate and review the migration

```bash
pnpm db:generate
```

This generates migration SQL from the TypeScript schema changes; it does not
regenerate the TypeScript schema itself. Review the generated files in
`packages/db/src/migrations/` before applying them.

Keep the existing migrations. The fresh database will apply the full migration
history.

## 5. Start PostgreSQL

```bash
pnpm db:up
```

Wait until PostgreSQL reports that it is ready to accept connections. This
command runs in the foreground, so leave this terminal open.

## 6. Apply migrations and seed the database

In another terminal, from the repository root:

```bash
pnpm db:migrate
pnpm db:seed
```

The migration command uses `DATABASE_URL` from the environment or, if it is not
set, from `apps/server/.env`. Ensure it points to your local database and matches
the PostgreSQL credentials configured in the root `.env`.

## 7. Restart the application

```bash
pnpm dev
```

## Schema changes without resetting the database

Most schema changes do not require wiping the database. With PostgreSQL running:

1. Edit the TypeScript schema.
2. Run `pnpm db:generate`.
3. Review the generated migration, especially any destructive changes.
4. Run `pnpm db:migrate`.
