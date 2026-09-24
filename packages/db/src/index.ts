import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.js';

export * from './schema.js';

export function createDB(databaseURL: string) {
  return drizzle(databaseURL, { schema });
}

export type Database = ReturnType<typeof createDB>;
