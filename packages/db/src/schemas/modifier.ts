import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const modifierValueKind = pgEnum('modifier_value_kind', [
  'weight',
  'duration',
  'none',
]);

export const modifier = pgTable('modifier', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  value_kind: modifierValueKind('value_kind').notNull(),
});
