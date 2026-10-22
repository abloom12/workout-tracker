import { createFileRoute } from '@tanstack/react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttachmentsTable } from './-components/AttachmentsTable';
import { EquipmentTable } from './-components/EquipmentTable';
import { ExercisesTable } from './-components/ExercisesTable';
import { GripsTable } from './-components/GripsTable';
import { ModifiersTable } from './-components/ModifiersTable';
import { MusclesTable } from './-components/MusclesTable';
import { SetupsTable } from './-components/SetupsTable';

export const Route = createFileRoute('/_app/admin/catalogue')({
  component: RouteComponent,
});

const catalogueTabs = [
  { value: 'exercises', label: 'Exercises', component: ExercisesTable },
  { value: 'setups', label: 'Setups', component: SetupsTable },
  { value: 'equipment', label: 'Equipment', component: EquipmentTable },
  { value: 'attachments', label: 'Attachments', component: AttachmentsTable },
  { value: 'grips', label: 'Grips', component: GripsTable },
  { value: 'modifiers', label: 'Modifiers', component: ModifiersTable },
  { value: 'muscles', label: 'Muscles', component: MusclesTable },
] as const;

function RouteComponent() {
  return (
    <section aria-labelledby="admin-catalogue-title" className="space-y-4">
      <div className="space-y-2">
        <h2 id="admin-catalogue-title" className="text-xl font-semibold">
          Catalogue
        </h2>
        <p className="text-muted-foreground">
          Shared definitions used throughout the exercise library.
        </p>
      </div>
      <Tabs defaultValue="exercises">
        <div className="overflow-x-auto">
          <TabsList aria-label="Catalogue sections">
            {catalogueTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {catalogueTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
                <CardDescription>
                  Not connected to the catalogue API yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <tab.component />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
