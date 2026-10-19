import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className="border-border flex h-14 shrink-0 items-center border-b">
      <div className="flex w-full items-center gap-2 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="-ml-2" />
      </div>
    </header>
  );
}
