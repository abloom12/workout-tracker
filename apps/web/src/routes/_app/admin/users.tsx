import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section aria-labelledby="admin-users-title" className="space-y-2">
      <h2 id="admin-users-title" className="text-xl font-semibold">
        Users
      </h2>
      <p className="text-muted-foreground">
        User management controls will be added here.
      </p>
    </section>
  );
}
