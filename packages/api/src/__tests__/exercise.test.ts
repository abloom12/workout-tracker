import { beforeEach, expect, test, vi } from 'vitest';

import type { AppAuth } from '@acme/auth';
import type * as DBModule from '@acme/db';

import type { ApiContext, ApiSession } from '../index.js';
import { createApi } from '../index.js';

const queryMocks = vi.hoisted(() => ({
  listExercises: vi.fn<typeof DBModule.listExercises>(),
  listExerciseSetups: vi.fn<typeof DBModule.listExerciseSetups>(),
}));

vi.mock('@acme/db', async (importOriginal) => ({
  ...(await importOriginal<typeof DBModule>()),
  ...queryMocks,
}));

const db = {} as DBModule.Database;
const auth = {
  api: { getSession: () => Promise.resolve(null) },
} as unknown as AppAuth;
const { appRouter } = createApi(auth, db);

const setupFixture: Awaited<
  ReturnType<typeof DBModule.listExerciseSetups>
>[number] = {
  id: 101,
  code: 'barbell_bench_press',
  name: 'Barbell Bench Press',
  exercise: { id: 1, code: 'bench_press', name: 'Bench Press' },
  equipment: { id: 1, code: 'barbell', name: 'Barbell' },
  grip: { id: 1, code: 'pronated', name: 'Pronated' },
  allowedAttachments: [],
  attachmentRequired: false,
  loadConvention: 'total_weight',
  isUnilateral: false,
};

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
      role: 'user',
      banned: false,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  };
}

function createTestCaller(session: ApiSession = createTestSession()) {
  return appRouter.createCaller({
    db,
    req: {} as ApiContext['req'],
    res: {} as ApiContext['res'],
    session,
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('exercise.list rejects an anonymous caller before querying', async () => {
  await expect(createTestCaller(null).exercise.list()).rejects.toMatchObject({
    code: 'UNAUTHORIZED',
  });
  expect(queryMocks.listExerciseSetups).not.toHaveBeenCalled();
});

test('exercise.list preserves the setup response and IDs used by existing callers', async () => {
  queryMocks.listExerciseSetups.mockResolvedValue([setupFixture]);
  const caller = createTestCaller();

  const setups = await caller.exercise.list();

  expect(setups).toEqual([setupFixture]);
  expect(setups[0]?.id).toBe(101);
  expect(setups[0]?.exercise.id).toBe(1);
  expect(queryMocks.listExerciseSetups).toHaveBeenCalledExactlyOnceWith(db);
  expect(queryMocks.listExercises).not.toHaveBeenCalled();
});

test('exercise.list returns an empty collection without seed assumptions', async () => {
  queryMocks.listExerciseSetups.mockResolvedValue([]);

  await expect(createTestCaller().exercise.list()).resolves.toEqual([]);
});
