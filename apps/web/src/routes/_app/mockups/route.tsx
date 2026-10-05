import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/mockups')({
  component: RouteComponent,
});

const mockups = [
  { label: 'Mockup 1', to: '/mockups/mockup' },
  { label: 'Mockup 2', to: '/mockups/mockup-two' },
  { label: 'Mockup 3', to: '/mockups/mockup-three' },
  { label: 'Mockup 4', to: '/mockups/mockup-four' },
  { label: 'Mockup 5', to: '/mockups/mockup-five' },
  { label: 'Split variations', to: '/mockups/split' },
  { label: 'Library variations', to: '/mockups/library' },
] as const;

function RouteComponent() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <nav
        aria-label="Mockup navigation"
        className="flex h-8 shrink-0 items-center gap-1 overflow-x-auto px-2"
      >
        <span className="text-muted-foreground mr-2 text-xs font-medium">
          Mockups
        </span>
        {mockups.map((mockup) => (
          <Button key={mockup.to} asChild variant="ghost">
            <Link
              to={mockup.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: 'bg-muted text-foreground' }}
              inactiveProps={{ className: 'text-muted-foreground' }}
            >
              {mockup.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
