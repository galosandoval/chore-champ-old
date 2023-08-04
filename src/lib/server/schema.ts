import { relations } from 'drizzle-orm'
import { text, timestamp, pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('cuid').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  householdId: text('household_id').references(() => household.id),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
})

export const usersRelations = relations(user, ({ one, many }) => ({
  household: one(household, {
    references: [household.id],
    fields: [user.householdId]
  }),
  usersToChores: many(usersToChores)
}))

export const household = pgTable('household', {
  id: text('cuid').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
})

export const householdRelations = relations(household, ({ many }) => ({
  users: many(user),
  chores: many(chore)
}))

export const chore = pgTable('chore', {
  id: text('cuid').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  householdId: text('household_id').references(() => household.id),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
})

export const choreRelations = relations(chore, ({ many, one }) => ({
  usersToChores: many(usersToChores),
  household: one(household, {
    fields: [chore.householdId],
    references: [household.id]
  })
}))

export const usersToChores = pgTable(
  'users_to_chores',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    choreId: text('chore_id')
      .notNull()
      .references(() => chore.id),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
  },
  (t) => ({
    pk: primaryKey(t.userId, t.choreId)
  })
)

export const usersToChoresRelation = relations(usersToChores, ({ one }) => ({
  chore: one(chore, {
    fields: [usersToChores.choreId],
    references: [chore.id]
  }),
  user: one(user, {
    fields: [usersToChores.userId],
    references: [user.id]
  })
}))

