import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section aria-labelledby="admin-overview-title" className="space-y-2">
      <h1
        id="admin-overview-title"
        className="text-3xl font-semibold tracking-tight"
      >
        Overview
      </h1>
      <p className="text-muted-foreground">
        Use Users to manage accounts or Catalogue to manage shared exercise
        definitions. Management controls will be added in a future pass.
      </p>
    </section>
  );
}
