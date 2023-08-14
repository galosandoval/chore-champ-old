<script lang="ts">
	import type { PageServerData } from './$types'

	export let data: PageServerData

	const { household } = data
</script>

<div class="h-full">
	<h1 class="h1">
		{household.name}
	</h1>
	<form method="POST">
		<button class="btn variant-outline-error">Delete</button>
	</form>
</div>
