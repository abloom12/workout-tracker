import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema.js';
import { exercise_setup } from './exercise.js';
import { modifier } from './modifier.js';
import { setType } from './workout.js';

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
    planned_workout: jsonb('planned_workout').notNull(),
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
    weight_lb: numeric('weight_lb'),
    reps: integer('reps'),
    duration_seconds: numeric('duration_seconds'),
    set_type: setType('set_type').default('working').notNull(),
  },
  (table) => [
    unique('workout_set_number_unique').on(
      table.session_exercise_id,
      table.set_number,
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
