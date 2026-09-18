import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.js';

export function createDB(databaseURL: string) {
  return drizzle(databaseURL, { schema });
}
