import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { createDB } from './index.js';
import {
  exercise,
  exercise_equipment,
  exercise_grip,
  modifier,
} from './schema.js';
import { equipment } from './seeds/equipment.js';
import { exercises } from './seeds/exercises.js';
import { grips } from './seeds/grips.js';
import { modifiers } from './seeds/modifiers.js';

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
  await db.transaction(async (tx) => {
    await tx
      .insert(exercise)
      .values(exercises)
      .onConflictDoNothing({ target: exercise.name });

    await tx
      .insert(exercise_equipment)
      .values(equipment)
      .onConflictDoNothing({ target: exercise_equipment.name });

    await tx
      .insert(exercise_grip)
      .values(grips)
      .onConflictDoNothing({ target: exercise_grip.name });

    await tx
      .insert(modifier)
      .values(modifiers)
      .onConflictDoNothing({ target: modifier.name });
  });
} finally {
  await db.$client.end();
}
