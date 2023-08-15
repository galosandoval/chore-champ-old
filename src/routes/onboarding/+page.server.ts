import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms/server'
import {
	household,
	insertHouseholdAreaAndChoreSchema,
	insertHouseholdSchema,
	user
} from '$lib/server/db/schema'
import { db } from '$lib/server/db/init'
import { createId } from '@paralleldrive/cuid2'

export const load = (async ({ locals }) => {
	const { user } = locals

	if (!user) {
		throw redirect(307, '/login')
	}

	const form = await superValidate(insertHouseholdAreaAndChoreSchema)

	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, insertHouseholdAreaAndChoreSchema)

		if (!form.valid) {
			return fail(400, { form })
		}

		const householdId = createId()

		const newHousehold = await db
			.insert(household)
			.values({ id: householdId, name: form.data.householdName })
			.returning()

		if (!newHousehold.length || !newHousehold[0].id) {
			return fail(500, { form })
		}

		const updatedUser = await db.update(user).set({ householdId: newHousehold[0].id }).returning()

		if (!updatedUser.length || !updatedUser[0].id) {
			message
			return fail(500, { form })
		}

		const areaForm = await superValidate(request, insertHouseholdSchema)

		if (!areaForm.valid) {
			return fail(400, { areaForm })
		}

		const areaId = createId()

		console.log(areaId)

		return message(form, 'success')
	}
} satisfies Actions
