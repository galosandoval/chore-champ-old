import { createId } from '@paralleldrive/cuid2'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { Form, isRouteErrorResponse, useRouteError } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { db } from '~/lib/db/init'
import { area, chore, household } from '~/lib/db/schema'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export async function action({ request }: ActionArgs) {
  console.log('hellooaoaoaoaoa')

  // const formData = await request.formData()
  // const data = insertHouseholdAreaAndChoreSchema.parse(
  //   Object.fromEntries(formData.entries())
  // )

  const householdName = 'My Household'
  const allChores = [
    'dishes',
    'sweep',
    'mop',
    'toilet',
    'sink',
    'shower',
    'mop',
    'sweep'
  ]
  const areasToEnter = {
    kitchen: ['dishes', 'sweep', 'mop'],
    bathroom: ['toilet', 'sink', 'shower', 'mop', 'sweep']
  }

  const choresDictionary = allChores.reduce((acc, chore) => {
    acc[chore] = { id: createId(), name: chore }
    return acc
  }, {} as Record<string, { id: string; name: string }>)

  const areasDictionary = Object.keys(areasToEnter).reduce((acc, area) => {
    acc[area] = { id: createId(), name: area }
    return acc
  }, {} as Record<string, { id: string; name: string }>)

  const householdId = createId()
  console.log('db', db)
  const newHousehold = await db
    .insert(household)
    .values({ name: householdName, id: householdId })
    .returning()

  if (!newHousehold || newHousehold.length === 0) {
    throw new Error('Could not create household')
  }

  // const areaIds = data.areaNames.map((name) => ({ id: createId(), name }))
  const areasToInsert = Object.entries(areasDictionary).map(
    ([areaName, area]) => {
      return {
        id: area.id,
        name: areaName
      }
    }
  )

  const newAreas = await db.insert(area).values(areasToInsert).returning()

  if (!newAreas || newAreas.length === 0) {
    throw new Error('Could not create areas')
  }

  const choresToInsert = Object.entries(choresDictionary).map(
    ([choreName, chore]) => {
      return {
        id: chore.id,
        name: choreName
      }
    }
  )
  const newChores = await db.insert(chore).values(choresToInsert).returning()

  if (!newChores || newChores.length === 0) {
    throw new Error('Could not create chores')
  }

  // const householdAreas = newAreas.map((area) => ({
  //   id: createId(),
  //   householdId,
  //   areaId: area.id
  // }))
  // const newHouseholdAreas = await db.insert(areasToChores).values({})
}

export default function Index() {
  return (
    <div className='h-full grid place-items-center'>
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method='post'>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' placeholder='Name of your project' />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='framework'>Framework</Label>
                <Select>
                  <SelectTrigger id='framework'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='next'>Next.js</SelectItem>
                    <SelectItem value='sveltekit'>SvelteKit</SelectItem>
                    <SelectItem value='astro'>Astro</SelectItem>
                    <SelectItem value='nuxt'>Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>Submit</Button>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline'>Cancel</Button>
          <Button type='submit'>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
