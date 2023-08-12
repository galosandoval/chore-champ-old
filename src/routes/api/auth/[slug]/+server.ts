import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db'
import { insertUserSchema, session, user } from '$lib/server/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { createSession } from '$lib/server/createSession'
import { SALT } from '$env/static/private'
import pkg from 'bcryptjs'
const { hash, compare } = pkg

export const POST: RequestHandler = async (event) => {
	const { slug } = event.params

	let result
	let sql

	try {
		switch (slug) {
			case 'logout':
				if (event.locals.user) {
					// else they are logged out / session ended

					const id = event.locals.user.id
					if (id) await db.delete(session).where(eq(session.userId, id))

					event.locals.user = undefined
				}
				console.log(event.locals.user)
				return json(
					{ message: 'Logout successful.' },
					{
						headers: {
							'Set-Cookie': `session=; Path=/; SameSite=Lax; HttpOnly; Expires=${new Date().toUTCString()}`
						}
					}
				)
			case 'login':
				sql = `SELECT authenticate($1) AS "authenticationResult";`
				break
			case 'register':
				sql = `SELECT register($1) AS "authenticationResult";`
				break
			default:
				throw error(404, 'Invalid endpoint.')
		}

		// Only /auth/login and /auth/register at this point
		const body = await event.request.json()

		// While client checks for these to be non-null, register() in the database does not
		if (slug === 'register') {
			const input = insertUserSchema.parse(body)

			const id = createId()

			const hashedPassword = await hash(input.password, SALT)

			const newUser = await db
				.insert(user)
				.values({ email: input.email, password: hashedPassword, id })
				.returning()

			if (newUser.length && newUser[0].id) {
				const session = await createSession(db, newUser[0])

				return json(
					{
						message: 'Successful registration.',
						user: newUser[0]
					},
					{
						headers: {
							'Set-Cookie': `session=${session[0].id}; Path=/; SameSite=Lax; HttpOnly;`
						}
					}
				)
			}
		} else if (slug === 'login') {
			const input = insertUserSchema.parse(body)

			const foundUser = await db.select().from(user).where(eq(user.email, input.email))

			if (foundUser.length && foundUser[0].id) {
				const passwordMatches = await compare(input.password, foundUser[0].password)

				if (passwordMatches) {
					const session = await createSession(db, foundUser[0])

					return json(
						{
							message: 'Successful login.',
							user: foundUser[0]
						},
						{
							headers: {
								'Set-Cookie': `session=${session[0].id}; Path=/; SameSite=Lax; HttpOnly;`
							}
						}
					)
				}
			}
		}
	} catch (err) {
		throw error(503, 'Could not communicate with database.')
	}

	const authenticationResult = {} as any

	if (!authenticationResult.user)
		// includes when a user tries to register an existing email account with wrong password
		throw error(authenticationResult.statusCode, authenticationResult.status)

	// Ensures hooks.server.ts:handle() will not delete session cookie
	event.locals.user = authenticationResult.user

	return json(
		{
			message: authenticationResult.status,
			user: authenticationResult.user
		},
		{
			headers: {
				'Set-Cookie': `session=${authenticationResult.sessionId}; Path=/; SameSite=Lax; HttpOnly;`
			}
		}
	)
}
