import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/programs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/programs/"!</div>
}
