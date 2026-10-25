import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';

export const exerciseMuscleRole = pgEnum('exercise_muscle_role', [
  'primary',
  'secondary',
]);

export const muscle = pgTable('muscle', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise_equipment = pgTable('exercise_equipment', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise_attachment = pgTable('exercise_attachment', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise = pgTable('exercise', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  equipment_id: integer('equipment_id')
    .notNull()
    .references(() => exercise_equipment.id),
});

export const exercise_muscle = pgTable(
  'exercise_muscle',
  {
    exercise_id: integer('exercise_id')
      .notNull()
      .references(() => exercise.id, { onDelete: 'cascade' }),
    muscle_id: integer('muscle_id')
      .notNull()
      .references(() => muscle.id, { onDelete: 'cascade' }),
    role: exerciseMuscleRole('role').notNull(),
  },
  (table) => [primaryKey({ columns: [table.exercise_id, table.muscle_id] })],
);

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  equipment: one(exercise_equipment, {
    fields: [exercise.equipment_id],
    references: [exercise_equipment.id],
  }),
  muscles: many(exercise_muscle),
}));

export const exerciseMuscleRelations = relations(
  exercise_muscle,
  ({ one }) => ({
    exercise: one(exercise, {
      fields: [exercise_muscle.exercise_id],
      references: [exercise.id],
    }),
    muscle: one(muscle, {
      fields: [exercise_muscle.muscle_id],
      references: [muscle.id],
    }),
  }),
);
