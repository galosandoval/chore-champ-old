<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css'
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css'
	// Most of your app wide CSS should be put in this file
	import '../app.postcss'
	import type { LayoutServerData } from './$types'
	import { loginSession } from '../stores'
	import { beforeNavigate } from '$app/navigation'

	export let data: LayoutServerData
	$loginSession = data.user

	beforeNavigate(() => {
		console.log('beforeNavigate')
	})
</script>

<slot />
