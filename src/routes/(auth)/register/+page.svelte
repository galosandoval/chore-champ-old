<script lang="ts">
	import Input from '$lib/components/Input.svelte'
	import type { PageServerData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'

	export let data: PageServerData

	const { form, errors, enhance } = superForm(data.form)
</script>

<div class="h-full grid place-items-center">
	<form class="card p-4 text-token space-y-4" use:enhance method="POST">
		<h1 class="h1">Welcome</h1>

		<div class="flex flex-col gap-2">
			<Input name="email" errorMessage={$errors.name} value={$form.email} label="Email" />
			<Input
				name="password"
				errorMessage={$errors.password}
				value={$form.password}
				label="Password"
			/>
			<Input
				name="confirmPassword"
				errorMessage={$errors.confirmPassword}
				value={$form.confirmPassword}
				label="Confirm Password"
			/>
		</div>

		<div class="w-full flex flex-col items-center">
			<button class="btn variant-soft w-full">Sign Up</button>
			<div class=""><a class="anchor text-sm" href="/login">Login</a></div>
		</div>
	</form>
</div>
