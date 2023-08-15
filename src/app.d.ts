// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/server/db/schema'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Omit<User, 'password'> | undefined
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
