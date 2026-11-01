import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const modifierValueKind = pgEnum('modifier_value_kind', [
  'weight',
  'duration',
  'none',
]);

export const modifier = pgTable('modifier', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  value_kind: modifierValueKind('value_kind').notNull(),
});
