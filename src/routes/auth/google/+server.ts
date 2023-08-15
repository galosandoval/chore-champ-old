import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { OAuth2Client } from 'google-auth-library'
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public'
import { db } from '$lib/server/db/init'
import { session, user, type User } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { createSession } from '$lib/server/createSession'

// Verify JWT per https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
async function getGoogleUserFromJWT(token: string): Promise<Partial<User>> {
	try {
		const client = new OAuth2Client(PUBLIC_GOOGLE_CLIENT_ID)
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		})
		const payload = ticket.getPayload()
		if (!payload) throw error(500, 'Google authentication did not get the expected payload')

		console.log('payload', payload)

		return {
			email: payload['email']
		}
	} catch (err) {
		let message = ''
		if (err instanceof Error) message = err.message
		throw error(500, `Google user could not be authenticated: ${message}`)
	}
}

// Upsert user and get session ID
async function upsertGoogleUser(partialUser: Partial<User>) {
	try {
		// const sql = `SELECT start_gmail_user_session($1) AS user_session;`

		const session = await createSession(db, partialUser)

		const foundUser = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				householdId: user.householdId
			})
			.from(user)
			.where(eq(user.email, partialUser.email as string))

		return { id: session[0].id, user: foundUser[0] }
	} catch (err) {
		let message = ''
		if (err instanceof Error) message = err.message
		throw error(500, `Gmail user could not be upserted: ${message}`)
	}
}

// Returns local user if Google user authenticated (and authorized our app)
export const POST: RequestHandler = async (event) => {
	try {
		const { token } = await event.request.json()
		const user = await getGoogleUserFromJWT(token)
		const userSession = await upsertGoogleUser(user)

		// Prevent hooks.server.ts's handler() from deleting cookie thinking no one has authenticated
		event.locals.user = userSession.user

		return json(
			{
				message: 'Successful Google Sign-In.',
				user: userSession.user
			},
			{
				headers: {
					'Set-Cookie': `session=${userSession.id}; Path=/; SameSite=Lax; HttpOnly;`
				}
			}
		)
	} catch (err) {
		let message = ''
		if (err instanceof Error) message = err.message
		throw error(401, message)
	}
}
