import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { createDB } from './index.js';
import {
  exercise_attachment,
  exercise_equipment,
  modifier,
  movement_pattern,
  muscle,
} from './schema.js';
import { attachments } from './seeds/attachments.js';
import { equipment } from './seeds/equipment.js';
import { modifiers } from './seeds/modifiers.js';
import { movementPatterns } from './seeds/movement-patterns.js';
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
          target: exercise_attachment.name,
          set: { name: seed.name },
        });
    }

    for (const seed of equipment) {
      await tx
        .insert(exercise_equipment)
        .values(seed)
        .onConflictDoUpdate({
          target: exercise_equipment.name,
          set: { name: seed.name },
        });
    }

    for (const seed of modifiers) {
      await tx
        .insert(modifier)
        .values(seed)
        .onConflictDoUpdate({
          target: modifier.name,
          set: { name: seed.name, value_kind: seed.value_kind },
        });
    }

    for (const seed of movementPatterns) {
      await tx
        .insert(movement_pattern)
        .values(seed)
        .onConflictDoUpdate({
          target: movement_pattern.name,
          set: { name: seed.name },
        });
    }

    for (const seed of muscles) {
      await tx
        .insert(muscle)
        .values(seed)
        .onConflictDoUpdate({ target: muscle.name, set: { name: seed.name } });
    }
  });
} finally {
  await db.$client.end();
}
