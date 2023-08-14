<script lang="ts">
	import Input from '$lib/components/Input.svelte'
	import type { PageServerData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'

	export let data: PageServerData

	const { form, errors, enhance } = superForm(data.form)
</script>

<div class="h-full grid place-items-center">
	<form class="card p-4 text-token space-y-4" method="POST" use:enhance>
		<h1 class="h1">Welcome back</h1>

		<div class="flex flex-col gap-2">
			<Input label="Email" errorMessage={$errors.email} value={$form.email} name="email" />

			<Input
				type="password"
				label="Password"
				errorMessage={$errors.password}
				value={$form.password}
				name="password"
			/>
		</div>

		<div class="w-full flex flex-col items-center">
			<button class="btn variant-soft w-full">Login</button>
			<div class=""><a class="anchor text-sm" href="/register">Sign up</a></div>
		</div>
	</form>
</div>
