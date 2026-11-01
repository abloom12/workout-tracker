import type { Database } from '../index.js';

export async function listModifiers(db: Database) {
  const modifiers = await db.query.modifier.findMany({
    columns: { id: true, name: true, value_kind: true },
    orderBy: (modifier, { asc }) => [asc(modifier.name), asc(modifier.id)],
  });

  return modifiers.map((modifier) => ({
    id: modifier.id,
    name: modifier.name,
    valueKind: modifier.value_kind,
  }));
}
