import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

export const exerciseMuscleRole = pgEnum('exercise_muscle_role', [
  'primary',
  'secondary',
]);
export const gripOrientation = pgEnum('grip_orientation', [
  'overhand',
  'underhand',
  'neutral',
]);
export const gripWidth = pgEnum('grip_width', ['close', 'standard', 'wide']);
export const exerciseMechanics = pgEnum('exercise_mechanics', [
  'compound',
  'isolation',
]);

export const muscle = pgTable('muscle', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
});

export const movement_pattern = pgTable('movement_pattern', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
});

export const exercise_equipment = pgTable('exercise_equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export const exercise_attachment = pgTable('exercise_attachment', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export const exercise = pgTable('exercise', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  equipment_id: uuid('equipment_id')
    .notNull()
    .references(() => exercise_equipment.id),
  grip_orientation: gripOrientation('grip_orientation'),
  grip_width: gripWidth('grip_width'),
  is_unilateral: boolean('is_unilateral').notNull().default(false),
  mechanics: exerciseMechanics('mechanics'),
});

export const exercise_muscle = pgTable(
  'exercise_muscle',
  {
    exercise_id: uuid('exercise_id')
      .notNull()
      .references(() => exercise.id, { onDelete: 'cascade' }),
    muscle_id: integer('muscle_id')
      .notNull()
      .references(() => muscle.id, { onDelete: 'cascade' }),
    role: exerciseMuscleRole('role').notNull(),
  },
  (table) => [primaryKey({ columns: [table.exercise_id, table.muscle_id] })],
);

export const exercise_movement_pattern = pgTable(
  'exercise_movement_pattern',
  {
    exercise_id: uuid('exercise_id')
      .notNull()
      .references(() => exercise.id, { onDelete: 'cascade' }),
    movement_pattern_id: integer('movement_pattern_id')
      .notNull()
      .references(() => movement_pattern.id),
  },
  (table) => [
    primaryKey({ columns: [table.exercise_id, table.movement_pattern_id] }),
  ],
);

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  equipment: one(exercise_equipment, {
    fields: [exercise.equipment_id],
    references: [exercise_equipment.id],
  }),
  muscles: many(exercise_muscle),
  movementPatterns: many(exercise_movement_pattern),
}));

export const movementPatternRelations = relations(
  movement_pattern,
  ({ many }) => ({ exercises: many(exercise_movement_pattern) }),
);

export const exerciseMovementPatternRelations = relations(
  exercise_movement_pattern,
  ({ one }) => ({
    exercise: one(exercise, {
      fields: [exercise_movement_pattern.exercise_id],
      references: [exercise.id],
    }),
    movementPattern: one(movement_pattern, {
      fields: [exercise_movement_pattern.movement_pattern_id],
      references: [movement_pattern.id],
    }),
  }),
);

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
