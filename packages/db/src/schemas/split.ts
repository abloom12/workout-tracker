import { relations, sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgTable,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth.js';
import { workout } from './workout.js';

export const training_split = pgTable('training_split', {
  id: uuid('id')
    .default(sql`pg_catalog.gen_random_uuid()`)
    .primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
});

export const training_split_workout = pgTable(
  'training_split_workout',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    split_id: uuid('split_id')
      .notNull()
      .references(() => training_split.id, { onDelete: 'cascade' }),
    workout_id: uuid('workout_id')
      .notNull()
      .references(() => workout.id),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('training_split_workout_position_unique').on(
      table.split_id,
      table.position,
    ),
    check(
      'training_split_workout_position_nonnegative',
      sql`${table.position} >= 0`,
    ),
  ],
);

export const trainingSplitRelations = relations(
  training_split,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [training_split.ownerId],
      references: [user.id],
    }),
    workouts: many(training_split_workout),
  }),
);

export const trainingSplitWorkoutRelations = relations(
  training_split_workout,
  ({ one }) => ({
    split: one(training_split, {
      fields: [training_split_workout.split_id],
      references: [training_split.id],
    }),
    workout: one(workout, {
      fields: [training_split_workout.workout_id],
      references: [workout.id],
    }),
  }),
);
