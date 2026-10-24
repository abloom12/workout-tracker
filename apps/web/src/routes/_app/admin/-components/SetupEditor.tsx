import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useAppForm } from '@/lib/form';

type CatalogueOption = { id: number; name: string };

export type SetupRow = {
  id: number;
  code: string;
  name: string;
  exercise: CatalogueOption;
  equipment: CatalogueOption;
  grip: CatalogueOption;
  allowedAttachments: CatalogueOption[];
  attachmentRequired: boolean;
  loadConvention:
    'total_weight' | 'per_side' | 'added_to_bodyweight' | 'assisted';
  isUnilateral: boolean;
};

export type SetupOptions = {
  exercises: CatalogueOption[];
  equipment: CatalogueOption[];
  grips: CatalogueOption[];
  attachments: CatalogueOption[];
};

type SetupEditorProps = {
  setup?: SetupRow;
  options: SetupOptions;
  onSaved: () => void;
  onCancel: () => void;
};

const routeApi = getRouteApi('/_app/admin/catalogue');
const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    exerciseId: z.string().min(1, 'Select an exercise'),
    equipmentId: z.string().min(1, 'Select equipment'),
    gripId: z.string().min(1, 'Select a grip'),
    allowedAttachmentIds: z.array(z.number()),
    attachmentRequired: z.boolean(),
    loadConvention: z.enum([
      'total_weight',
      'per_side',
      'added_to_bodyweight',
      'assisted',
    ]),
    isUnilateral: z.boolean(),
  })
  .refine(
    (input) =>
      !input.attachmentRequired || input.allowedAttachmentIds.length > 0,
    {
      message: 'Select at least one allowed attachment when one is required',
      path: ['allowedAttachmentIds'],
    },
  );

function selectOptions(options: CatalogueOption[]) {
  return options.map((option) => ({
    value: String(option.id),
    label: option.name,
  }));
}

export function SetupEditor({
  setup,
  options,
  onSaved,
  onCancel,
}: SetupEditorProps) {
  const formId = useId();
  const { trpc } = routeApi.useRouteContext();
  const queryClient = useQueryClient();
  const createSetup = useMutation(
    trpc.catalogue.setups.create.mutationOptions(),
  );
  const updateSetup = useMutation(
    trpc.catalogue.setups.update.mutationOptions(),
  );

  const form = useAppForm({
    defaultValues: {
      name: setup?.name ?? '',
      exerciseId: setup ? String(setup.exercise.id) : '',
      equipmentId: setup ? String(setup.equipment.id) : '',
      gripId: setup ? String(setup.grip.id) : '',
      allowedAttachmentIds:
        setup?.allowedAttachments.map((attachment) => attachment.id) ?? [],
      attachmentRequired: setup?.attachmentRequired ?? false,
      loadConvention: setup?.loadConvention ?? 'total_weight',
      isUnilateral: setup?.isUnilateral ?? false,
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      const input = {
        ...value,
        name: value.name.trim(),
        exerciseId: Number(value.exerciseId),
        equipmentId: Number(value.equipmentId),
        gripId: Number(value.gripId),
      };

      try {
        if (setup) {
          await updateSetup.mutateAsync({ ...input, id: setup.id });
        } else {
          await createSetup.mutateAsync(input);
        }
      } catch {
        // Mutation errors are shown below; retain the draft for correction.
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trpc.catalogue.setups.list.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.exercise.list.queryKey(),
        }),
      ]);
      toast.success(setup ? 'Setup updated' : 'Setup created');
      onSaved();
    },
  });

  return (
    <form
      aria-label={setup ? `Edit setup ${setup.name}` : 'Add setup'}
      className="max-w-4xl p-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isDirty,
          state.isSubmitting,
        ]}
      >
        {([canSubmit, isDirty, isSubmitting]) => (
          <FieldSet disabled={isSubmitting}>
            <FieldLegend>
              {setup ? `Edit setup #${setup.id}` : 'New setup'}
            </FieldLegend>
            <FieldGroup className="gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.InputField label="Name" autoComplete="off" />
                )}
              />
              <Field>
                <FieldLabel htmlFor={`${formId}-code`}>Code</FieldLabel>
                <Input
                  id={`${formId}-code`}
                  value={setup?.code ?? 'Generated from name when saved'}
                  readOnly
                  aria-describedby={`${formId}-code-description`}
                />
                <FieldDescription id={`${formId}-code-description`}>
                  Assigned once on creation; renaming does not change it.
                </FieldDescription>
              </Field>
              <form.AppField
                name="exerciseId"
                children={(field) => (
                  <field.NativeSelectField
                    label="Exercise"
                    placeholder="Select an exercise"
                    options={selectOptions(options.exercises)}
                  />
                )}
              />
              <form.AppField
                name="equipmentId"
                children={(field) => (
                  <field.NativeSelectField
                    label="Equipment"
                    placeholder="Select equipment"
                    options={selectOptions(options.equipment)}
                  />
                )}
              />
              <form.AppField
                name="gripId"
                children={(field) => (
                  <field.NativeSelectField
                    label="Grip"
                    placeholder="Select a grip"
                    options={selectOptions(options.grips)}
                  />
                )}
              />
              <form.AppField
                name="loadConvention"
                children={(field) => (
                  <field.NativeSelectField
                    label="Loading convention"
                    options={[
                      { value: 'total_weight', label: 'Total weight' },
                      { value: 'per_side', label: 'Per side' },
                      {
                        value: 'added_to_bodyweight',
                        label: 'Added to bodyweight',
                      },
                      { value: 'assisted', label: 'Assisted' },
                    ]}
                  />
                )}
              />
            </FieldGroup>
            <FieldGroup className="gap-4">
              <form.AppField
                name="attachmentRequired"
                children={(field) => (
                  <field.CheckboxField label="Attachment required" />
                )}
              />
              <form.AppField
                name="isUnilateral"
                children={(field) => <field.CheckboxField label="Unilateral" />}
              />
            </FieldGroup>
            <form.AppField
              name="allowedAttachmentIds"
              children={(field) => (
                <FieldSet>
                  <FieldLegend variant="label">Allowed attachments</FieldLegend>
                  <FieldDescription>
                    Leave empty if this setup does not support attachments.
                  </FieldDescription>
                  <FieldGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {options.attachments.map((attachment) => (
                      <Field key={attachment.id} orientation="horizontal">
                        <Checkbox
                          id={`${formId}-attachment-${attachment.id}`}
                          checked={field.state.value.includes(attachment.id)}
                          onCheckedChange={(checked) => {
                            field.handleChange(
                              checked === true ?
                                [...field.state.value, attachment.id]
                              : field.state.value.filter(
                                  (id) => id !== attachment.id,
                                ),
                            );
                          }}
                          onBlur={field.handleBlur}
                        />
                        <FieldLabel
                          htmlFor={`${formId}-attachment-${attachment.id}`}
                        >
                          {attachment.name}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                  <FieldError errors={field.state.meta.errors} />
                </FieldSet>
              )}
            />
            <FieldError>
              {createSetup.error?.message ?? updateSetup.error?.message}
            </FieldError>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!canSubmit || !isDirty || isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                {isSubmitting ? 'Saving…' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </FieldSet>
        )}
      </form.Subscribe>
    </form>
  );
}
