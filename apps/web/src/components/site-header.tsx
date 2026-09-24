import { useRouterState } from '@tanstack/react-router';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const title = pathname.replace('/', '');

  return (
    <header className="border-border flex h-14 shrink-0 items-center border-b">
      <div className="flex w-full items-center gap-2 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}
