import { relations } from 'drizzle-orm'
import { text, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const user = pgTable('user', {
	id: text('cuid').primaryKey(),
	name: text('name'),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	householdId: text('household_id').references(() => household.id),
	createdAt: text('created_at').default(new Date().toISOString()),
	updatedAt: text('updated_at').default(new Date().toISOString())
})

export const insertUserSchema = createInsertSchema(user, {
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(8).max(50),
	id: (schema) => schema.id.optional()
})

export const registerSchema = insertUserSchema
	.extend({
		confirmPassword: z.string().min(8).max(50)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type User = z.infer<typeof insertUserSchema>

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
	createdAt: text('created_at').default(new Date().toISOString()),
	updatedAt: text('updated_at').default(new Date().toISOString())
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
	createdAt: text('created_at').default(new Date().toISOString()),
	updatedAt: text('updated_at').default(new Date().toISOString())
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
		createdAt: text('created_at').default(new Date().toISOString()),
		updatedAt: text('updated_at').default(new Date().toISOString())
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

export const session = pgTable('session', {
	id: text('cuid').primaryKey(),
	userId: text('user_id').references(() => user.id),
	expiresAt: text('expires_at')
})
