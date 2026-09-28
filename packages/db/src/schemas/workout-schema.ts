import { relations } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema.js';

export const exercise = pgTable('exercise', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
});

export const workout = pgTable('workout', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
});

export const workoutExercise = pgTable(
  'workout_exercise',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workout.id),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercise.id),
    position: integer('position').notNull(),
  },
  (table) => [
    uniqueIndex('workout_exercise_position_unique').on(
      table.workoutId,
      table.position,
    ),
  ],
);

export const trainingSplit = pgTable('training_split', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
});

export const trainingSplitWorkout = pgTable(
  'training_split_workout',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workout.id),
    splitId: integer('split_id')
      .notNull()
      .references(() => trainingSplit.id),
    position: integer('position').notNull(),
  },
  (table) => [
    uniqueIndex('training_split_workout_position_unique').on(
      table.splitId,
      table.position,
    ),
  ],
);

export const workoutSession = pgTable('workout_session', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  completed: timestamp('completed').notNull(),
  plannedWorkout: jsonb('planned_workout'),
});

export const workoutSet = pgTable(
  'workout_set',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercise.id),
    workoutSessionId: integer('workout_session_id')
      .notNull()
      .references(() => workoutSession.id),
    setType: text('set_type').notNull(),
    setNumber: integer('set_number').notNull(),
    weight: integer('weight').notNull(),
    reps: integer('reps').notNull(),
  },
  (table) => [
    uniqueIndex('workout_set_session_exercise_number_unique').on(
      table.workoutSessionId,
      table.exerciseId,
      table.setNumber,
    ),
  ],
);

export const workoutRelations = relations(workout, ({ one, many }) => ({
  owner: one(user, { fields: [workout.ownerId], references: [user.id] }),
  exercises: many(workoutExercise),
  splits: many(trainingSplitWorkout),
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

export const trainingSplitRelations = relations(
  trainingSplit,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [trainingSplit.ownerId],
      references: [user.id],
    }),
    workouts: many(trainingSplitWorkout),
  }),
);

export const trainingSplitWorkoutRelations = relations(
  trainingSplitWorkout,
  ({ one }) => ({
    split: one(trainingSplit, {
      fields: [trainingSplitWorkout.splitId],
      references: [trainingSplit.id],
    }),
    workout: one(workout, {
      fields: [trainingSplitWorkout.workoutId],
      references: [workout.id],
    }),
  }),
);

export const workoutSessionRelations = relations(
  workoutSession,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [workoutSession.ownerId],
      references: [user.id],
    }),
    sets: many(workoutSet),
  }),
);

export const workoutSetRelations = relations(workoutSet, ({ one }) => ({
  exercise: one(exercise, {
    fields: [workoutSet.exerciseId],
    references: [exercise.id],
  }),
  session: one(workoutSession, {
    fields: [workoutSet.workoutSessionId],
    references: [workoutSession.id],
  }),
}));
