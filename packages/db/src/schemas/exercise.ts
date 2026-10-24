import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  unique,
} from 'drizzle-orm/pg-core';

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

export const exercise = pgTable('exercise', {
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
    // Catalogue writes must provide allowed attachments when this is required.
    attachment_required: boolean('attachment_required')
      .notNull()
      .default(false),
    load_convention: loadConvention('load_convention').notNull(),
    is_unilateral: boolean('is_unilateral').notNull().default(false),
  },
  (table) => [
    unique('exercise_setup_components_unique').on(
      table.exercise_id,
      table.equipment_id,
      table.grip_id,
      table.is_unilateral,
    ),
  ],
);

export const exercise_setup_attachment = pgTable(
  'exercise_setup_attachment',
  {
    exercise_setup_id: integer('exercise_setup_id')
      .notNull()
      .references(() => exercise_setup.id, { onDelete: 'cascade' }),
    attachment_id: integer('attachment_id')
      .notNull()
      .references(() => exercise_attachment.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.exercise_setup_id, table.attachment_id] }),
  ],
);

export const exerciseSetupRelations = relations(
  exercise_setup,
  ({ one, many }) => ({
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
    allowedAttachments: many(exercise_setup_attachment),
  }),
);

export const exerciseSetupAttachmentRelations = relations(
  exercise_setup_attachment,
  ({ one }) => ({
    setup: one(exercise_setup, {
      fields: [exercise_setup_attachment.exercise_setup_id],
      references: [exercise_setup.id],
    }),
    attachment: one(exercise_attachment, {
      fields: [exercise_setup_attachment.attachment_id],
      references: [exercise_attachment.id],
    }),
  }),
);
