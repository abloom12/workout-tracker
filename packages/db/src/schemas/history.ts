import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth.js';
import { exercise_setup } from './exercise.js';
import { modifier } from './modifier.js';
import { setType } from './workout.js';

export type PlannedWorkoutSnapshotV1 = {
  schema_version: 1;
  name: string;
  exercises: {
    position: number;
    name: string;
    exercise: string;
    equipment: string;
    grip: string;
    attachment: string | null;
    load_convention:
      | 'total_weight'
      | 'per_implement'
      | 'per_side'
      | 'added_to_bodyweight'
      | 'assisted';
    is_unilateral: boolean;
    sets: {
      set_number: number;
      set_type: 'warmup' | 'working';
      reps_min: number | null;
      reps_max: number | null;
      is_amrap: boolean;
      target_weight_lb: string | null;
      duration_seconds: string | null;
      modifiers: {
        name: string;
        value_kind: 'weight' | 'duration' | 'none';
        weight_lb: string | null;
        duration_seconds: string | null;
      }[];
    }[];
  }[];
};

export const setSide = pgEnum('set_side', ['both', 'left', 'right']);

export const workout_session = pgTable(
  'workout_session',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => user.id),
    started_at: timestamp('started_at', { withTimezone: true }).notNull(),
    completed_at: timestamp('completed_at', { withTimezone: true }),
    planned_workout: jsonb('planned_workout')
      .$type<PlannedWorkoutSnapshotV1>()
      .notNull(),
  },
  (table) => [
    index('workout_session_owner_started_at_idx').on(
      table.ownerId,
      table.started_at,
    ),
    check(
      'workout_session_completion_valid',
      sql`${table.completed_at} IS NULL OR ${table.completed_at} >= ${table.started_at}`,
    ),
    check(
      'workout_session_snapshot_object',
      sql`jsonb_typeof(${table.planned_workout}) = 'object'`,
    ),
    check(
      'workout_session_snapshot_version',
      sql`(${table.planned_workout} -> 'schema_version' = '1'::jsonb) IS TRUE`,
    ),
  ],
);

export const session_exercise = pgTable(
  'session_exercise',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    workout_session_id: uuid('workout_session_id')
      .notNull()
      .references(() => workout_session.id, { onDelete: 'cascade' }),
    exercise_setup_id: integer('exercise_setup_id')
      .notNull()
      .references(() => exercise_setup.id),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('session_exercise_position_unique').on(
      table.workout_session_id,
      table.position,
    ),
    index('session_exercise_setup_idx').on(table.exercise_setup_id),
    check('session_exercise_position_nonnegative', sql`${table.position} >= 0`),
  ],
);

export const workout_set = pgTable(
  'workout_set',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    session_exercise_id: uuid('session_exercise_id')
      .notNull()
      .references(() => session_exercise.id, { onDelete: 'cascade' }),
    set_number: integer('set_number').notNull(),
    side: setSide('side').notNull().default('both'),
    weight_lb: numeric('weight_lb'),
    reps: integer('reps'),
    duration_seconds: numeric('duration_seconds'),
    set_type: setType('set_type').default('working').notNull(),
  },
  (table) => [
    unique('workout_set_number_side_unique').on(
      table.session_exercise_id,
      table.set_number,
      table.side,
    ),
    check('workout_set_number_positive', sql`${table.set_number} >= 1`),
    check(
      'workout_set_weight_nonnegative',
      sql`${table.weight_lb} IS NULL OR ${table.weight_lb} >= 0`,
    ),
    check(
      'workout_set_reps_nonnegative',
      sql`${table.reps} IS NULL OR ${table.reps} >= 0`,
    ),
    check(
      'workout_set_duration_positive',
      sql`${table.duration_seconds} IS NULL OR ${table.duration_seconds} > 0`,
    ),
    check(
      'workout_set_has_performance',
      sql`${table.reps} IS NOT NULL OR ${table.duration_seconds} IS NOT NULL`,
    ),
  ],
);

export const workout_set_modifier = pgTable(
  'workout_set_modifier',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    workout_set_id: uuid('workout_set_id')
      .notNull()
      .references(() => workout_set.id, { onDelete: 'cascade' }),
    modifier_id: integer('modifier_id')
      .notNull()
      .references(() => modifier.id),
    weight_lb: numeric('weight_lb'),
    duration_seconds: numeric('duration_seconds'),
  },
  (table) => [
    unique('workout_set_modifier_unique').on(
      table.workout_set_id,
      table.modifier_id,
    ),
    check(
      'workout_set_modifier_weight_nonnegative',
      sql`${table.weight_lb} IS NULL OR ${table.weight_lb} >= 0`,
    ),
    check(
      'workout_set_modifier_duration_positive',
      sql`${table.duration_seconds} IS NULL OR ${table.duration_seconds} > 0`,
    ),
    check(
      'workout_set_modifier_single_value',
      sql`${table.weight_lb} IS NULL OR ${table.duration_seconds} IS NULL`,
    ),
  ],
);

export const workoutSessionRelations = relations(
  workout_session,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [workout_session.ownerId],
      references: [user.id],
    }),
    exercises: many(session_exercise),
  }),
);

export const sessionExerciseRelations = relations(
  session_exercise,
  ({ one, many }) => ({
    session: one(workout_session, {
      fields: [session_exercise.workout_session_id],
      references: [workout_session.id],
    }),
    setup: one(exercise_setup, {
      fields: [session_exercise.exercise_setup_id],
      references: [exercise_setup.id],
    }),
    sets: many(workout_set),
  }),
);

export const workoutSetRelations = relations(
  workout_set,
  ({ one, many }) => ({
    exercise: one(session_exercise, {
      fields: [workout_set.session_exercise_id],
      references: [session_exercise.id],
    }),
    modifiers: many(workout_set_modifier),
  }),
);

export const workoutSetModifierRelations = relations(
  workout_set_modifier,
  ({ one }) => ({
    set: one(workout_set, {
      fields: [workout_set_modifier.workout_set_id],
      references: [workout_set.id],
    }),
    modifier: one(modifier, {
      fields: [workout_set_modifier.modifier_id],
      references: [modifier.id],
    }),
  }),
);

