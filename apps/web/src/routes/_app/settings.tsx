import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="settings-title"
    >
      <p className="text-muted-foreground text-sm font-medium">
        Workout Tracker
      </p>
      <h1
        id="settings-title"
        className="mt-2 text-3xl font-semibold tracking-tight"
      >
        Account settings
      </h1>
      <p className="text-muted-foreground mt-3">
        Signed in as {session.user.email}
      </p>
    </section>
  );
}
