<script lang="ts">
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import Input from '$lib/components/Input.svelte'

	export let data: PageData

	const {
		form: householdForm,
		errors: householdErrors,
		enhance: enhanceHousehold,
		message: householdMessage
	} = superForm(data.householdForm)

	const {
		form: areaForm,
		errors: areaErrors,
		enhance: enhanceArea,
		message: areaMessage
	} = superForm(data.areaForm)

	let step = 0

	console.log($page.form)

	$: showHouseHoldForm = $householdMessage !== 'success' && $areaMessage !== 'success'
	$: showAreaForm = $householdMessage === 'success'
	console.log(showHouseHoldForm)
	console.log(showAreaForm)
</script>

<div class="h-full px-2">
	<!-- {#if $housesholdMessage}
		<form method="POST" action="?/createArea" use:enhanceArea>
			<div class="">
				<Input
					errorMessage={$areaErrors.name}
					label="Add an area"
					name="name"
					value={$areaForm.name}
				/>
			</div>
		</form> -->
	{#if showHouseHoldForm}
		<form class="" method="POST" action="?/createHousehold" use:enhanceHousehold>
			<div class="">
				<Input
					errorMessage={$householdErrors.name}
					label="Household Name"
					name="name"
					placeholder="My Household"
					value={$householdForm.name}
				/>
			</div>
			<div class="w-full">
				<button class="btn variant-soft w-full">Create Household</button>
			</div>
		</form>
	{:else if showAreaForm}
		<h1 class="h1">{$householdForm.name}</h1>

		<form method="POST" action="?/createArea" use:enhanceArea>
			<div class="">
				<Input
					errorMessage={$areaErrors.name}
					label="Add an area"
					name="name"
					value={$areaForm.name}
				/>
			</div>

			<div class="w-full">
				<button class="btn variant-soft w-full">Add Area</button>
			</div>
		</form>
	{/if}
</div>
