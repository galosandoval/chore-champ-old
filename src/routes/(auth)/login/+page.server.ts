import type { Actions, PageServerLoad } from './$types'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { insertUserSchema, user } from '$lib/server/schema'
import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import pkg from 'bcryptjs'
import { createSession } from '$lib/server/createSession'
const { compare } = pkg

export const load = (async () => {
	const form = await superValidate(insertUserSchema)

	// Always return { form } in load and form actions.
	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, insertUserSchema)

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form })
		}

		const foundUser = await db.select().from(user).where(eq(user.email, form.data.email))
		if (!foundUser || !foundUser.length) {
			console.log('foundUser', foundUser)
			setError(form, 'email', 'Invalid credentials')
			return setError(form, 'password', 'Invalid credentials')
		}

		const passwordMatches = await compare(form.data.password, foundUser[0].password)
		if (!passwordMatches) {
			setError(form, 'email', 'Invalid credentials')
			return setError(form, 'password', 'Invalid credentials')
		} else {
			const session = await createSession(db, foundUser[0])
			cookies.set('session', session[0].id, {
				httpOnly: true,
				path: '/',
				expires: new Date(session[0].expiresAt || '')
			})

			console.log('redirecting')

			throw redirect(303, '/dashboard')
		}
	}
} satisfies Actions
