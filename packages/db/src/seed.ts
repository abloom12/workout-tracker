import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { createDB } from './index.js';
import { exercise } from './schema.js';
import { exercises } from './seeds/exercises.js';

const seedDirectory = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  loadEnvFile(resolve(seedDirectory, '../../../apps/server/.env'));
}

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL is required');
}

const db = createDB(databaseURL);

try {
  await db
    .insert(exercise)
    .values(exercises)
    .onConflictDoNothing({ target: exercise.name });
} finally {
  await db.$client.end();
}
