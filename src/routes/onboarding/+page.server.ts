import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms/server'
import { household, insertAreaSchema, insertHouseholdSchema, user } from '$lib/server/schema'
import { db } from '$lib/server/db'
import { createId } from '@paralleldrive/cuid2'

export const load = (async ({ locals }) => {
	const { user } = locals

	if (!user) {
		throw redirect(307, '/login')
	}

	const householdForm = await superValidate(insertHouseholdSchema)
	const areaForm = await superValidate(insertAreaSchema)

	return { householdForm, areaForm }
}) satisfies PageServerLoad

export const actions = {
	createHousehold: async ({ request, locals }) => {
		const householdForm = await superValidate(request, insertHouseholdSchema)

		if (!householdForm.valid) {
			return fail(400, { householdForm })
		}

		const householdId = createId()

		const newHousehold = await db
			.insert(household)
			.values({ id: householdId, name: householdForm.data.name })
			.returning()

		if (!newHousehold.length || !newHousehold[0].id) {
			return fail(500, { householdForm })
		}

		const updatedUser = await db.update(user).set({ householdId: newHousehold[0].id }).returning()

		if (!updatedUser.length || !updatedUser[0].id) {
			message
			return fail(500, { householdForm })
		}

		return message(householdForm, 'success')
	},

	createArea: async ({ request, locals }) => {
		const { user: localsUser } = locals
		const areaForm = await superValidate(request, insertHouseholdSchema)

		if (!areaForm.valid) {
			return fail(400, { areaForm })
		}

		const areaId = createId()
		return { areaForm }
	}
} satisfies Actions
