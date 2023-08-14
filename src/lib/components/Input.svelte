<script lang="ts">
	export let value: string,
		label: string | undefined,
		errorMessage: string[] | undefined,
		name: string,
		type: string = 'text',
		placeholder: string = ''

	function typeAction(node: any) {
		node.type = type
		node.placeholder = placeholder
	}
</script>

<div class="">
	{#if label}
		<label class="label"
			><span>{label}</span>

			<input {placeholder} class="input" use:typeAction {name} bind:value />
		</label>
	{:else}
		<input {placeholder} class="input" use:typeAction {name} bind:value />
	{/if}

	{#if errorMessage}
		<span class="text-xs text-error-400">{errorMessage}</span>
	{/if}
</div>
