import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { createDB } from './index.js';
import {
  exercise_attachment,
  exercise_equipment,
  modifier,
  muscle,
} from './schema.js';
import { attachments } from './seeds/attachments.js';
import { equipment } from './seeds/equipment.js';
import { modifiers } from './seeds/modifiers.js';
import { muscles } from './seeds/muscles.js';

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
    for (const seed of attachments) {
      await tx
        .insert(exercise_attachment)
        .values(seed)
        .onConflictDoUpdate({
          target: exercise_attachment.code,
          set: { name: seed.name },
        });
    }

    for (const seed of equipment) {
      await tx
        .insert(exercise_equipment)
        .values(seed)
        .onConflictDoUpdate({
          target: exercise_equipment.code,
          set: { name: seed.name },
        });
    }

    for (const seed of modifiers) {
      await tx
        .insert(modifier)
        .values(seed)
        .onConflictDoUpdate({
          target: modifier.code,
          set: { name: seed.name, value_kind: seed.value_kind },
        });
    }

    for (const seed of muscles) {
      await tx
        .insert(muscle)
        .values(seed)
        .onConflictDoUpdate({ target: muscle.code, set: { name: seed.name } });
    }
  });
} finally {
  await db.$client.end();
}
