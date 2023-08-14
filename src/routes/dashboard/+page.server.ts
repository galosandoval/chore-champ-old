import { error, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { household, user } from '$lib/server/schema'
import { eq } from 'drizzle-orm'

export const load = (async ({ locals }) => {
	const { user } = locals

	if (!user) {
		throw redirect(307, '/login')
	}
	if (!user.householdId) {
		throw redirect(307, '/onboarding')
	}

	const householdData = await db.select().from(household).where(eq(household.id, user.householdId))

	if (!householdData) {
		throw error(500, 'Household not found')
	}

	return { household: householdData[0] }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const householdIdToDelete = locals.user?.householdId
		if (householdIdToDelete) {
			const updatedUser = await db.update(user).set({ householdId: null }).returning()

			if (!updatedUser.length || !updatedUser[0].id) {
				throw error(500, 'Failed to update user')
			}

			const result = await db
				.delete(household)
				.where(eq(household.id, householdIdToDelete))
				.returning()

			console.log(result)
		}
	}
} satisfies Actions
