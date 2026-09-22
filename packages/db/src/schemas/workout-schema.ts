import { relations, sql } from 'drizzle-orm';
import {
  check,
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

/**
 * A reusable, user-owned blueprint for one day of training.
 *
 * This table stores the template's identity and name. Its Exercises and their
 * order live in `workoutTemplateExercise`; scheduling, prescriptions, and
 * performed training intentionally belong to future tables with separate
 * lifecycles.
 */
export const workoutTemplate = pgTable(
  'workout_template',
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
    uniqueIndex('workout_template_owner_name_unique').on(
      table.ownerId,
      sql`lower(btrim(${table.name}))`,
    ),
    check(
      'workout_template_name_not_blank',
      sql`length(btrim(${table.name})) > 0`,
    ),
  ],
);

/**
 * The ordered many-to-many relationship between Workout Templates and the
 * curated Exercise library.
 *
 * The composite primary key prevents an Exercise from appearing twice in one
 * template, while `position` records where that Exercise belongs in this
 * particular template. Deleting a template removes its composition rows, but
 * deleting a referenced curated Exercise is restricted.
 */
export const workoutTemplateExercise = pgTable(
  'workout_template_exercise',
  {
    workoutTemplateId: integer('workout_template_id')
      .notNull()
      .references(() => workoutTemplate.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercise.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'workout_template_exercise_pk',
      columns: [table.workoutTemplateId, table.exerciseId],
    }),
    uniqueIndex('workout_template_exercise_position_unique').on(
      table.workoutTemplateId,
      table.position,
    ),
    index('workout_template_exercise_exercise_id_idx').on(table.exerciseId),
    check(
      'workout_template_exercise_position_nonnegative',
      sql`${table.position} >= 0`,
    ),
  ],
);

export const workoutTemplateRelations = relations(
  workoutTemplate,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [workoutTemplate.ownerId],
      references: [user.id],
    }),
    composition: many(workoutTemplateExercise),
  }),
);

export const workoutTemplateExerciseRelations = relations(
  workoutTemplateExercise,
  ({ one }) => ({
    workoutTemplate: one(workoutTemplate, {
      fields: [workoutTemplateExercise.workoutTemplateId],
      references: [workoutTemplate.id],
    }),
    exercise: one(exercise, {
      fields: [workoutTemplateExercise.exerciseId],
      references: [exercise.id],
    }),
  }),
);
