import { db } from '$lib/server/db'
import { session, user } from '$lib/server/schema'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

// Attach authorization to each server request (role may have changed)
async function attachUserToRequestEvent(sessionId: string, event: RequestEvent) {
	// find user by session ID
	const foundUser = await db
		.select({
			id: user.id,
			email: user.email,
			name: user.name,
			householdId: user.householdId,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		})
		.from(user)
		.leftJoin(session, eq(user.id, sessionId))

	if (foundUser && foundUser.length) {
		event.locals.user = foundUser[0]
	}
}

// Invoked for each endpoint called and initially for SSR router
export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event
	const sessionId = cookies.get('session')

	// before endpoint or page is called
	if (sessionId) {
		await attachUserToRequestEvent(sessionId, event)
	}

	if (!event.locals.user) cookies.delete('session')

	const response = await resolve(event)

	// after endpoint or page is called

	return response
}
