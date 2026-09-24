# Coding Standards

## V0 schema and migration workflow

Until the application goes to production, keep Drizzle's generated migration history minimal and clean. When a schema change affects a generated migration, **replace that migration and every migration after it** rather than adding another migration just to revise v0 schema work.

1. Identify the earliest generated migration affected by the schema change.
2. Delete that migration's SQL file and every later migration SQL file, along with their corresponding Drizzle snapshots and journal entries. Keep earlier, unaffected migrations.
3. Update the Drizzle schema, generate fresh migration files from the last retained snapshot, and review the resulting SQL and metadata.
4. Re-migrate the non-production database from a state consistent with the retained migrations. If the removed migrations were already applied, first plan the necessary local database reset or equivalent re-creation; do not assume that running `db:migrate` alone will undo them.

Do not rewrite an existing production migration after the project goes to production; use forward migrations instead. Before destructive migration-file or database operations, identify the exact files and database state affected and get explicit approval.
