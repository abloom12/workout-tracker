import { Tabs as TabsPrimitive } from 'radix-ui';

export function SplitBuilder() {
  return (
    <div>
      <TabsPrimitive.Root>
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">1</TabsPrimitive.Trigger>
        </TabsPrimitive.List>

        <TabsPrimitive.Content value="tab1">test</TabsPrimitive.Content>
      </TabsPrimitive.Root>
    </div>
  );
}
