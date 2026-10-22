import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section aria-labelledby="admin-overview-title" className="space-y-2">
      <h2 id="admin-overview-title" className="text-xl font-semibold">
        Overview
      </h2>
      <p className="text-muted-foreground">
        Use Users to manage accounts or Catalogue to manage shared exercise
        definitions. Management controls will be added in a future pass.
      </p>
    </section>
  );
}
