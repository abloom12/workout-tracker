import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workout/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/workout/new"!</div>
}
