import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
} from 'drizzle-orm/pg-core';

export const exercise = pgTable('exercise', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise_equipment = pgTable('exercise_equipment', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise_grip = pgTable('exercise_grip', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const exercise_attachment = pgTable('exercise_attachment', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
});

export const loadConvention = pgEnum('load_convention', [
  'total_weight',
  'per_implement',
  'per_side',
  'added_to_bodyweight',
  'assisted',
]);

export const exercise_setup = pgTable(
  'exercise_setup',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    exercise_id: integer('exercise_id')
      .notNull()
      .references(() => exercise.id),
    equipment_id: integer('equipment_id')
      .notNull()
      .references(() => exercise_equipment.id),
    grip_id: integer('grip_id')
      .notNull()
      .references(() => exercise_grip.id),
    attachment_id: integer('attachment_id').references(() => exercise_attachment.id),
    load_convention: loadConvention('load_convention').notNull(),
    is_unilateral: boolean('is_unilateral').notNull().default(false),
  },
  (table) => [
    unique('exercise_setup_components_unique')
      .on(
        table.exercise_id,
        table.equipment_id,
        table.grip_id,
        table.is_unilateral,
        table.attachment_id,
      )
      .nullsNotDistinct(),
  ],
);

export const exerciseSetupRelations = relations(exercise_setup, ({ one }) => ({
  exercise: one(exercise, {
    fields: [exercise_setup.exercise_id],
    references: [exercise.id],
  }),
  equipment: one(exercise_equipment, {
    fields: [exercise_setup.equipment_id],
    references: [exercise_equipment.id],
  }),
  grip: one(exercise_grip, {
    fields: [exercise_setup.grip_id],
    references: [exercise_grip.id],
  }),
  attachment: one(exercise_attachment, {
    fields: [exercise_setup.attachment_id],
    references: [exercise_attachment.id],
  }),
}));
