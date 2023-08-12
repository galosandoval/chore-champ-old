import { createId } from '@paralleldrive/cuid2'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { session, type User } from './schema'
import { eq } from 'drizzle-orm'

export const createSession = async (db: PostgresJsDatabase, user: Partial<User>) => {
	const id = createId()

	const expiresAt = addHours(new Date(), 12).toISOString()

	if (user.id) {
		const oldSession = await db.select().from(session).where(eq(session.userId, user.id))

		if (oldSession && oldSession.length) {
			return await db
				.update(session)
				.set({ expiresAt })
				.where(eq(session.id, oldSession[0].id))
				.returning({ id: session.id, expiresAt: session.expiresAt })
		}
	}

	return await db
		.insert(session)
		.values({ id, expiresAt, userId: user.id })
		.returning({ id: session.id, expiresAt: session.expiresAt })
}

function addHours(date: Date, hours: number) {
	date.setTime(date.getTime() + hours * 60 * 60 * 1000)

	return date
}
