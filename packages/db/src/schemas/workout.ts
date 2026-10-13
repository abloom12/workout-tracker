import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema.js';
import { exercise_setup } from './exercise.js';
import { modifier } from './modifier.js';

export const setType = pgEnum('set_type', ['warmup', 'working']);

export const workout = pgTable('workout', {
  id: uuid('id')
    .default(sql`pg_catalog.gen_random_uuid()`)
    .primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
});

export const workout_exercise = pgTable(
  'workout_exercise',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    workout_id: uuid('workout_id')
      .notNull()
      .references(() => workout.id, { onDelete: 'cascade' }),
    exercise_setup_id: integer('exercise_setup_id')
      .notNull()
      .references(() => exercise_setup.id),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('workout_exercise_position_unique').on(
      table.workout_id,
      table.position,
    ),
    check('workout_exercise_position_positive', sql`${table.position} >= 0`),
  ],
);

export const planned_set = pgTable(
  'planned_set',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    workout_exercise_id: uuid('workout_exercise_id')
      .notNull()
      .references(() => workout_exercise.id, { onDelete: 'cascade' }),
    set_number: integer('set_number').notNull(),
    reps_min: integer('reps_min'),
    reps_max: integer('reps_max'),
    is_amrap: boolean().default(false).notNull(),
    target_weight_lb: numeric('target_weight_lb'),
    duration_seconds: numeric('duration_seconds'),
    set_type: setType().default('working').notNull(),
  },
  (table) => [
    unique('planned_set_number_unique').on(
      table.workout_exercise_id,
      table.set_number,
    ),
    check('planned_set_number_positive', sql`${table.set_number} >= 1`),
    check(
      'planned_set_weight_nonnegative',
      sql`${table.target_weight_lb} IS NULL OR ${table.target_weight_lb} >= 0`,
    ),
    check(
      'planned_set_reps_min_positive',
      sql`${table.reps_min} IS NULL OR ${table.reps_min} >= 1`,
    ),
    check(
      'planned_set_reps_max_valid',
      sql`${table.reps_max} IS NULL OR (${table.reps_min} IS NOT NULL AND ${table.reps_max} >= ${table.reps_min})`,
    ),
    check(
      'planned_set_amrap_no_bounds',
      sql`NOT ${table.is_amrap} OR (${table.reps_min} IS NULL AND ${table.reps_max} IS NULL)`,
    ),
    check(
      'planned_set_duration_positive',
      sql`${table.duration_seconds} IS NULL OR ${table.duration_seconds} > 0`,
    ),
    check(
      'planned_set_has_prescription',
      sql`${table.reps_min} IS NOT NULL OR ${table.is_amrap} OR ${table.duration_seconds} IS NOT NULL`,
    ),
  ],
);

export const planned_set_modifier = pgTable(
  'planned_set_modifier',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    planned_set_id: uuid('planned_set_id')
      .notNull()
      .references(() => planned_set.id, { onDelete: 'cascade' }),
    modifier_id: integer('modifier_id')
      .notNull()
      .references(() => modifier.id),
    weight_lb: numeric('weight_lb'),
    duration_seconds: numeric('duration_seconds'),
  },
  (table) => [
    unique('planned_set_modifier_unique').on(
      table.planned_set_id,
      table.modifier_id,
    ),
    check(
      'planned_set_modifier_weight_nonnegative',
      sql`${table.weight_lb} IS NULL OR ${table.weight_lb} >= 0`,
    ),
    check(
      'planned_set_modifier_duration_positive',
      sql`${table.duration_seconds} IS NULL OR ${table.duration_seconds} > 0`,
    ),
    check(
      'planned_set_modifier_single_value',
      sql`${table.weight_lb} IS NULL OR ${table.duration_seconds} IS NULL`,
    ),
  ],
);

export const workoutRelations = relations(workout, ({ one, many }) => ({
  owner: one(user, { fields: [workout.ownerId], references: [user.id] }),
  exercises: many(workout_exercise),
}));
export const workoutExerciseRelations = relations(
  workout_exercise,
  ({ one, many }) => ({
    workout: one(workout, {
      fields: [workout_exercise.workout_id],
      references: [workout.id],
    }),
    setup: one(exercise_setup, {
      fields: [workout_exercise.exercise_setup_id],
      references: [exercise_setup.id],
    }),
    sets: many(planned_set),
  }),
);
export const plannedSetRelations = relations(planned_set, ({ one }) => ({
  workoutExercise: one(workout_exercise, {
    fields: [planned_set.workout_exercise_id],
    references: [workout_exercise.id],
  }),
}));
