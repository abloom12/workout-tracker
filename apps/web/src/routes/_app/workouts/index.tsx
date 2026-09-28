import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workouts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/workouts/"!</div>
}
