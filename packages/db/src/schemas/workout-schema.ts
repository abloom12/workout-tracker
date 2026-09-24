import { relations, sql } from 'drizzle-orm';
import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema.js';
import { exercise } from './exercise-schema.js';

export const trainingSplit = pgTable(
  'training_split',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('training_split_id_owner_unique').on(table.id, table.ownerId),
    check('training_split_name_not_blank', sql`length(btrim(${table.name})) > 0`),
  ],
);

export const workout = pgTable(
  'workout',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    splitId: integer('split_id'),
    position: integer('position'),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.splitId, table.ownerId],
      foreignColumns: [trainingSplit.id, trainingSplit.ownerId],
      name: 'workout_split_owner_fk',
    }),
    uniqueIndex('workout_split_position_unique').on(
      table.splitId,
      table.position,
    ),
    check('workout_name_not_blank', sql`length(btrim(${table.name})) > 0`),
    check(
      'workout_split_position_pair',
      sql`(${table.splitId} IS NULL) = (${table.position} IS NULL)`,
    ),
    check('workout_position_nonnegative', sql`${table.position} >= 0`),
  ],
);

export const workoutExercise = pgTable(
  'workout_exercise',
  {
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workout.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercise.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'workout_exercise_pk',
      columns: [table.workoutId, table.exerciseId],
    }),
    uniqueIndex('workout_exercise_position_unique').on(
      table.workoutId,
      table.position,
    ),
    index('workout_exercise_exercise_id_idx').on(table.exerciseId),
    check('workout_exercise_position_nonnegative', sql`${table.position} >= 0`),
  ],
);

export const trainingSplitRelations = relations(
  trainingSplit,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [trainingSplit.ownerId],
      references: [user.id],
    }),
    workouts: many(workout),
  }),
);

export const workoutRelations = relations(workout, ({ one, many }) => ({
  owner: one(user, {
    fields: [workout.ownerId],
    references: [user.id],
  }),
  split: one(trainingSplit, {
    fields: [workout.splitId],
    references: [trainingSplit.id],
  }),
  exercises: many(workoutExercise),
}));

export const workoutExerciseRelations = relations(
  workoutExercise,
  ({ one }) => ({
    workout: one(workout, {
      fields: [workoutExercise.workoutId],
      references: [workout.id],
    }),
    exercise: one(exercise, {
      fields: [workoutExercise.exerciseId],
      references: [exercise.id],
    }),
  }),
);
