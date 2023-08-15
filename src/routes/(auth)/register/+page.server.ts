import type { Actions, PageServerLoad } from './$types'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db/init'
import { registerSchema, user } from '$lib/server/db/schema'
import { createId } from '@paralleldrive/cuid2'
import pkg from 'bcryptjs'
const { hash } = pkg
import { SALT } from '$env/static/private'
import { createSession } from '$lib/server/createSession'
import { eq } from 'drizzle-orm'

export const load = (async () => {
	const form = await superValidate(registerSchema)

	// Always return { form } in load and form actions.
	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, registerSchema)

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form })
		}

		const foundUser = await db.select().from(user).where(eq(user.email, form.data.email))
		if (foundUser && foundUser.length) {
			console.log('foundUser', foundUser)
			return setError(form, 'email', 'Email already in use.')
		}

		const id = createId()

		const hashedPassword = await hash(form.data.password, parseInt(SALT))

		const newUser = await db
			.insert(user)
			.values({ email: form.data.email.toLowerCase(), password: hashedPassword, id })
			.returning()

		if (newUser.length && newUser[0].id) {
			const session = await createSession(db, newUser[0])

			cookies.set('session', session[0].id, {
				httpOnly: true,
				path: '/',
				expires: new Date(session[0].expiresAt || '')
			})
			throw redirect(303, '/login')
		}

		return fail(500, { form })
	}
} satisfies Actions
