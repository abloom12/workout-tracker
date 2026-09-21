import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import type { Auth } from 'better-auth';
import { afterAll, expect, test } from 'vitest';

import { createDB } from '@acme/db';

import type { ApiContext, ApiSession } from '../index.js';
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

function createCaller(session: ApiSession) {
  return appRouter.createCaller({
    db,
    req: {} as ApiContext['req'],
    res: {} as ApiContext['res'],
    session,
  });
}

function createTestSession(): NonNullable<ApiSession> {
  const now = new Date();

  return {
    session: {
      id: 'test-session',
      token: 'test-token',
      userId: 'test-user',
      expiresAt: new Date(now.getTime() + 60_000),
      createdAt: now,
      updatedAt: now,
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  };
}

afterAll(async () => {
  await db.$client.end();
});

test('exercise.list rejects an anonymous caller', async () => {
  const caller = createCaller(null);

  await expect(caller.exercise.list()).rejects.toMatchObject({
    code: 'UNAUTHORIZED',
  });
});

test('exercise.list returns the configured catalog to an authenticated caller', async () => {
  const caller = createCaller(createTestSession());
  const exercises = await caller.exercise.list();

  expect(exercises).toHaveLength(20);
  const exerciseNames = exercises.map(({ name }) => name);

  expect(exerciseNames).toContain('Bench Press');
  expect(exerciseNames).toContain('Sissy Squat');

  for (const exercise of exercises) {
    expect(Object.keys(exercise).sort()).toEqual(['id', 'name']);
    expect(Number.isInteger(exercise.id)).toBe(true);
    expect(typeof exercise.name).toBe('string');
  }
});
