import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="dashboard-title"
    >
      <p className="text-muted-foreground text-sm font-medium">
        Workout Tracker
      </p>
      <h1
        id="dashboard-title"
        className="mt-2 text-3xl font-semibold tracking-tight"
      >
        Welcome back, {session.user.name}.
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Plan your training and keep a clear record of the work you put in.
      </p>
    </section>
  );
}
