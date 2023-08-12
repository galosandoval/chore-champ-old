<script lang="ts">
	import type { PageServerData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'

	export let data: PageServerData

	const { form, errors } = superForm(data.form)
</script>

<div class="h-full grid place-items-center">
	<form class="card p-4 text-token space-y-4" method="POST">
		<h1 class="h1">Welcome back</h1>

		<div class="flex flex-col gap-2">
			<div class="">
				<label class="label"
					><span>Email</span>
					<input class="input" type="text" name="email" bind:value={$form.email} />
				</label>

				{#if $errors.email}
					<span class="text-xs text-error-400">{$errors.email}</span>
				{/if}
			</div>
			<div class="">
				<label class="label">
					<span>Password</span>
					<input class="input" type="password" name="password" bind:value={$form.password} />
				</label>

				{#if $errors.password}
					<span class="text-xs text-error-400">{$errors.password}</span>
				{/if}
			</div>
		</div>

		<div class="w-full flex flex-col items-center">
			<button class="btn variant-soft w-full">Login</button>
			<div class=""><a class="anchor text-sm" href="/register">Sign up</a></div>
		</div>
	</form>
</div>
