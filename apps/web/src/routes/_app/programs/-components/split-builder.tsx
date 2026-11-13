import { Tabs as TabsPrimitive } from 'radix-ui';

import { ScrollArea } from '@/components/ui/scroll-area';

export function SplitBuilder() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <TabsPrimitive.Root className="flex-1">
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">1</TabsPrimitive.Trigger>
        </TabsPrimitive.List>

        <TabsPrimitive.Content value="tab1">test</TabsPrimitive.Content>
      </TabsPrimitive.Root>

      <div className="shrink-0">editor</div>
    </div>
  );
}
