<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms'

	export let value: string
	export let label: string | undefined = undefined
	export let errors: string[] | undefined = undefined
	export let constraints: InputConstraint | undefined = undefined
</script>

<div class="">
	{#if label}
		<label class="label"
			><span>{label}</span>
			<input
				class="input"
				type="text"
				bind:value
				aria-invalid={errors ? 'true' : undefined}
				{...constraints}
				{...$$restProps}
			/>
		</label>
	{:else}
		<input
			class="input"
			type="text"
			bind:value
			aria-invalid={errors ? 'true' : undefined}
			{...constraints}
			{...$$restProps}
		/>
	{/if}
	{#if errors}<span class="text-xs text-error-400">{errors}</span>{/if}
</div>
