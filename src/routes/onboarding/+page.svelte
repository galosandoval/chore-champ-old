<script lang="ts">
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import Input from '$lib/components/Input.svelte'
	import { InputChip } from '@skeletonlabs/skeleton'

	type Step = 'household' | 'areas' | 'chores' | 'members' | 'done' | 'edit' | 'areas-to-chores'
	export let data: PageData

	const { form, errors, enhance, message, tainted } = superForm(data.form)

	let step: Step = 'household'
	let areaName = ''

	console.log(step)

	function focus(el: HTMLInputElement) {
		el.focus()
	}

	function handleNextStep() {
		step = 'areas'
	}

	function handleAddArea() {
		form.update(($form) => {
			$form.areaNames = $form.areaNames.concat(areaName)
			return $form
		})

		areaName = ''
	}

	$: {
		console.log($tainted?.householdName)
		console.log($page.form)
	}
	console.log(step)
</script>

<div class="h-full px-2 grid place-items-center">
	<div class="">
		<div class="flex justify-center flex-col items-center gap-2">
			<h1 class="h1 text-center">Welcome to Chore Champ!</h1>
			<span class="text-9xl">💪</span>
		</div>
		{#if step === 'household'}
			<div class="">
				<Input
					errorMessage={$errors.householdName || null}
					name="householdName"
					placeholder="Da crib"
					bind:value={$form.householdName}
				/>
			</div>
			<div class="w-full">
				<button
					disabled={$form.householdName === ''}
					type="button"
					on:click={handleNextStep}
					class="btn variant-soft w-full">Next</button
				>
			</div>
		{:else if step === 'areas'}
			<h2 class="h2 text-center">
				Add areas to {$form.householdName}
			</h2>

			<InputChip
				allowDuplicates={false}
				bind:value={$form.areaNames}
				autoFocus={true}
				name="areaNames"
				placeholder={`eg: Kitchen, Bedroom or Bathroom`}
			/>

			{#if $form.areaNames.length > 0}
				<button on:click={() => (step = 'chores')} class="btn variant-filled-primary">Next</button>
			{/if}
		{:else if step === 'chores'}
			<h2 class="h2 text-center">
				Add areas to {$form.householdName}
			</h2>

			<InputChip
				allowDuplicates={false}
				bind:value={$form.choreNames}
				autoFocus={true}
				name="choreNames"
				placeholder={`eg: Sweep, Mop or Dust`}
			/>

			{#if $form.choreNames.length > 0}
				<button on:click={() => (step = 'areas-to-chores')} class="btn variant-filled-primary"
					>Next</button
				>
			{/if}
		{:else if step === 'areas-to-chores'}
			<select class="select">
				{#each $form.areaNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>

			<div class="space-y-2">
				{#each $form.choreNames as name}
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" checked />
						<p>{name}</p>
					</label>
				{/each}
			</div>

			<button on:click={() => (step = 'done')} class="btn variant-filled-primary">Next</button>
		{:else}
			<form class="" method="POST" use:enhance>
				<button type="submit" class="btn variant-filled-primary">Finish</button>
			</form>
		{/if}
	</div>
</div>
