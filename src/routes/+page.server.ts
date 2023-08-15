import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ cookies }) => {
	if (cookies.get('session')) {
		throw redirect(307, '/dashboard')
	}
	throw redirect(307, '/login')
}) satisfies PageServerLoad
