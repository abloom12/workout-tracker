import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import type { Auth } from 'better-auth';
import { afterAll, expect, test } from 'vitest';

import { createDB } from '@acme/db';

import type { ApiContext } from '../index.js';
import { createApi } from '../index.js';

const testDirectory = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  loadEnvFile(resolve(testDirectory, '../../../../apps/server/.env'));
}

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL is required');
}

const db = createDB(databaseURL);
const auth = {
  api: { getSession: () => Promise.resolve(null) },
} as unknown as Auth;
const { appRouter } = createApi(auth, db);

afterAll(async () => {
  await db.$client.end();
});

test('exercise.list rejects an anonymous caller', async () => {
  const caller = appRouter.createCaller({
    db,
    req: {} as ApiContext['req'],
    res: {} as ApiContext['res'],
    session: null,
  });

  await expect(caller.exercise.list()).rejects.toMatchObject({
    code: 'UNAUTHORIZED',
  });
});
