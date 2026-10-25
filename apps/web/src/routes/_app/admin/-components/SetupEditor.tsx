import type { inferInput, inferOutput } from '@trpc/tanstack-react-query';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useBlocker } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import type { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { useAppForm, withForm } from '@/lib/form';

type CatalogueOption = { id: number; name: string };
type ExerciseInput = inferInput<typeof trpc.catalogue.exercises.create>;
export type ExerciseRow = inferOutput<
  typeof trpc.catalogue.exercises.list
>[number];
export type ExerciseOptions = inferOutput<
  typeof trpc.catalogue.exercises.options
> & { equipment: CatalogueOption[]; muscles: CatalogueOption[] };
export type ExerciseDraft = {
  clientId: string;
  id: number | null;
  code: string;
  name: string;
  equipmentId: string;
  primaryMuscleIds: number[];
  secondaryMuscleIds: number[];
};

const editableFields = [
  'name',
  'equipmentId',
  'primaryMuscleIds',
  'secondaryMuscleIds',
] as const;
export type ExerciseEditableField = (typeof editableFields)[number];
export type ExerciseGridEditorProps = {
  data: ExerciseDraft[];
  renderField: (index: number, name: ExerciseEditableField) => ReactNode;
  renderActions: (index: number, beforeRemove: () => void) => ReactNode;
  renderBulkEditor: (
    selectedClientIds: string[],
    clearSelection: () => void,
  ) => ReactNode;
  disabled: boolean;
};

type ExerciseEditorProps = {
  data: ExerciseDraft[];
  options: ExerciseOptions;
  onSaved: () => void;
  onCancel: () => void;
  children: (editor: ExerciseGridEditorProps) => ReactNode;
};

const routeApi = getRouteApi('/_app/admin/catalogue');
const formSchema = z.object({
  rows: z.array(
    z.object({
      clientId: z.string(),
      id: z.int().positive().nullable(),
      code: z.string(),
      name: z.string().trim().min(1, 'Name is required').max(200),
      equipmentId: z.string().min(1, 'Select equipment'),
      primaryMuscleIds: z.array(z.int().positive()).max(100),
      secondaryMuscleIds: z.array(z.int().positive()).max(100),
    }),
  ),
});
const emptyRows: ExerciseDraft[] = [];
const editorFormOptions = {
  defaultValues: { rows: emptyRows },
  validators: { onChange: formSchema },
};

function changedExercises(
  rows: ExerciseDraft[],
  isDefaultValue: (index: number, field: ExerciseEditableField) => boolean,
) {
  return rows.filter(
    (row, index) =>
      row.id === null ||
      editableFields.some((field) => !isDefaultValue(index, field)),
  );
}

function newExercise(source?: ExerciseDraft): ExerciseDraft {
  return {
    clientId: crypto.randomUUID(),
    id: null,
    code: '',
    name: source ? `${source.name} (copy)` : '',
    equipmentId: source?.equipmentId ?? '',
    primaryMuscleIds: [...(source?.primaryMuscleIds ?? [])],
    secondaryMuscleIds: [...(source?.secondaryMuscleIds ?? [])],
  };
}

function MusclePicker({
  id,
  label,
  options,
  value,
  disabled,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  options: CatalogueOption[];
  value: number[];
  disabled: boolean;
  onChange: (value: number[]) => void;
  onBlur: () => void;
}) {
  const selectedNames = options
    .filter((option) => value.includes(option.id))
    .map((option) => option.name);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={label}
          className="h-auto min-h-9 w-full min-w-40 justify-start text-left whitespace-normal"
          onBlur={onBlur}
        >
          {selectedNames.join(', ') || 'Select muscles'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-80 overflow-y-auto" align="start">
        <p className="font-medium">{label}</p>
        {options.map((muscle) => (
          <Field key={muscle.id} orientation="horizontal">
            <Checkbox
              id={`${id}-${muscle.id}`}
              checked={value.includes(muscle.id)}
              disabled={disabled}
              onCheckedChange={(checked) => {
                onChange(
                  checked === true ?
                    [...value, muscle.id].sort((a, b) => a - b)
                  : value.filter((muscleId) => muscleId !== muscle.id),
                );
              }}
            />
            <FieldLabel htmlFor={`${id}-${muscle.id}`}>
              {muscle.name}
            </FieldLabel>
          </Field>
        ))}
        {options.length === 0 && <p>No muscles available.</p>}
      </PopoverContent>
    </Popover>
  );
}

const bulkMuscleMode = z.enum(['unchanged', 'replace', 'clear']);
const bulkEditSchema = z
  .object({
    equipmentId: z.string(),
    primaryMode: bulkMuscleMode,
    primaryMuscleIds: z.array(z.int().positive()).max(100),
    secondaryMode: bulkMuscleMode,
    secondaryMuscleIds: z.array(z.int().positive()).max(100),
  })
  .superRefine((value, ctx) => {
    for (const role of ['primary', 'secondary'] as const) {
      if (
        value[`${role}Mode`] === 'replace' &&
        value[`${role}MuscleIds`].length === 0
      ) {
        ctx.addIssue({
          code: 'custom',
          path: [`${role}MuscleIds`],
          message:
            'Select muscles to replace the list, or choose Clear muscles.',
        });
      }
    }
    if (
      value.primaryMode === 'replace' &&
      value.secondaryMode === 'replace' &&
      value.primaryMuscleIds.some((id) => value.secondaryMuscleIds.includes(id))
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['secondaryMuscleIds'],
        message: 'A muscle cannot be both primary and secondary.',
      });
    }
  });
type BulkEditValues = z.infer<typeof bulkEditSchema>;
const bulkEditDefaults: BulkEditValues = {
  equipmentId: '',
  primaryMode: 'unchanged',
  primaryMuscleIds: [],
  secondaryMode: 'unchanged',
  secondaryMuscleIds: [],
};
const bulkFormOptions = {
  defaultValues: bulkEditDefaults,
  validators: { onChange: bulkEditSchema },
};

function hasBulkChanges(value: BulkEditValues) {
  return (
    value.equipmentId !== '' ||
    value.primaryMode !== 'unchanged' ||
    value.secondaryMode !== 'unchanged'
  );
}

function applyBulkChanges(
  row: ExerciseDraft,
  value: BulkEditValues,
): ExerciseDraft {
  let primaryMuscleIds =
    value.primaryMode === 'unchanged' ? row.primaryMuscleIds
    : value.primaryMode === 'clear' ? []
    : [...value.primaryMuscleIds];
  let secondaryMuscleIds =
    value.secondaryMode === 'unchanged' ? row.secondaryMuscleIds
    : value.secondaryMode === 'clear' ? []
    : [...value.secondaryMuscleIds];

  // Match individual editing: assigning a muscle to one role moves it out
  // of the other. Clearing a list never alters the opposite role.
  if (value.primaryMode === 'replace') {
    secondaryMuscleIds = secondaryMuscleIds.filter(
      (id) => !primaryMuscleIds.includes(id),
    );
  }
  if (value.secondaryMode === 'replace') {
    primaryMuscleIds = primaryMuscleIds.filter(
      (id) => !secondaryMuscleIds.includes(id),
    );
  }

  return {
    ...row,
    equipmentId: value.equipmentId || row.equipmentId,
    primaryMuscleIds,
    secondaryMuscleIds,
  };
}

const BulkMuscleFields = withForm({
  ...bulkFormOptions,
  props: {} as {
    role: 'primary' | 'secondary';
    id: string;
    options: CatalogueOption[];
    disabled: boolean;
  },
  render: function BulkMuscleFields({ form, role, id, options, disabled }) {
    const label = role === 'primary' ? 'Primary muscles' : 'Secondary muscles';
    return (
      <form.Field name={`${role}Mode`}>
        {(mode) => (
          <form.Field name={`${role}MuscleIds`}>
            {(muscles) => (
              <Field>
                <FieldLabel htmlFor={`${id}-mode`}>{label}</FieldLabel>
                <NativeSelect
                  id={`${id}-mode`}
                  value={mode.state.value}
                  disabled={disabled}
                  onChange={(event) =>
                    mode.handleChange(bulkMuscleMode.parse(event.target.value))
                  }
                  onBlur={mode.handleBlur}
                >
                  <NativeSelectOption value="unchanged">
                    Leave unchanged
                  </NativeSelectOption>
                  <NativeSelectOption value="replace">
                    Replace list
                  </NativeSelectOption>
                  <NativeSelectOption value="clear">
                    Clear muscles
                  </NativeSelectOption>
                </NativeSelect>
                {mode.state.value === 'replace' && (
                  <MusclePicker
                    id={`${id}-muscles`}
                    label={`${label} for selected exercises`}
                    options={options}
                    value={muscles.state.value}
                    disabled={disabled}
                    onChange={muscles.handleChange}
                    onBlur={muscles.handleBlur}
                  />
                )}
                <FieldError
                  errors={[
                    ...mode.state.meta.errors,
                    ...muscles.state.meta.errors,
                  ]}
                />
              </Field>
            )}
          </form.Field>
        )}
      </form.Field>
    );
  },
});

function BulkEditControls({
  options,
  selectedCount,
  disabled,
  onApply,
  clearSelection,
}: {
  options: ExerciseOptions;
  selectedCount: number;
  disabled: boolean;
  onApply: (value: BulkEditValues) => void;
  clearSelection: () => void;
}) {
  const id = useId();
  const form = useAppForm({
    ...bulkFormOptions,
    onSubmit: ({ value, formApi }) => {
      if (disabled || selectedCount === 0 || !hasBulkChanges(value)) return;
      onApply(value);
      formApi.reset();
    },
  });

  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => (
        <FieldSet
          disabled={disabled || state.isSubmitting}
          className="rounded-lg border p-4"
        >
          <FieldLegend variant="label">
            Edit {selectedCount} selected rows
          </FieldLegend>
          <FieldDescription>
            Names stay unchanged. Apply updates drafts only; use Save changes to
            persist them. Assigning a muscle to one role removes it from the
            other.
          </FieldDescription>
          <div className="grid gap-4 md:grid-cols-3">
            <form.Field name="equipmentId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={`${id}-equipment`}>Equipment</FieldLabel>
                  <NativeSelect
                    id={`${id}-equipment`}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  >
                    <NativeSelectOption value="">
                      Leave unchanged
                    </NativeSelectOption>
                    {options.equipment.map((equipment) => (
                      <NativeSelectOption
                        key={equipment.id}
                        value={String(equipment.id)}
                      >
                        {equipment.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            </form.Field>
            {(['primary', 'secondary'] as const).map((role) => (
              <BulkMuscleFields
                key={role}
                form={form}
                role={role}
                id={`${id}-${role}`}
                options={options.muscles}
                disabled={disabled || state.isSubmitting}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={
                !state.canSubmit ||
                !hasBulkChanges(state.values) ||
                selectedCount === 0
              }
              onClick={() => void form.handleSubmit()}
            >
              Apply to selected ({selectedCount})
            </Button>
            <Button type="button" variant="outline" onClick={clearSelection}>
              Clear selection
            </Button>
          </div>
        </FieldSet>
      )}
    </form.Subscribe>
  );
}

const ExerciseBulkEditor = withForm({
  ...editorFormOptions,
  props: {} as {
    options: ExerciseOptions;
    selectedClientIds: string[];
    clearSelection: () => void;
    disabled: boolean;
  },
  render: function ExerciseBulkEditor({
    form,
    options,
    selectedClientIds,
    clearSelection,
    disabled,
  }) {
    return (
      <BulkEditControls
        options={options}
        selectedCount={selectedClientIds.length}
        disabled={disabled}
        clearSelection={clearSelection}
        onApply={(value) => {
          if (form.state.isSubmitting) return;
          const selected = new Set(selectedClientIds);
          form.setFieldValue('rows', (rows) =>
            rows.map((row) =>
              selected.has(row.clientId) ? applyBulkChanges(row, value) : row,
            ),
          );
          void form.validate('change');
          toast.success(
            `Applied to ${selectedClientIds.length} draft rows. Not saved yet.`,
          );
        }}
      />
    );
  },
});

const ExerciseDraftField = withForm({
  ...editorFormOptions,
  props: {} as {
    index: number;
    row: ExerciseDraft;
    name: ExerciseEditableField;
    options: ExerciseOptions;
    disabled: boolean;
  },
  render: function ExerciseDraftField({
    form,
    index,
    row,
    name,
    options,
    disabled,
  }) {
    const id = `${row.clientId}-${name}`;
    const label = `${
      name === 'name' ? 'Name'
      : name === 'equipmentId' ? 'Equipment'
      : name === 'primaryMuscleIds' ? 'Primary muscles'
      : 'Secondary muscles'
    } for exercise row ${index + 1}`;

    if (name === 'name' || name === 'equipmentId') {
      return (
        <form.Field name={`rows[${index}].${name}`}>
          {(field) => (
            <Field
              className={
                name === 'equipmentId' ?
                  'w-[194px] max-w-[194px] min-w-0 whitespace-normal'
                : 'min-w-40 whitespace-normal'
              }
            >
              <FieldLabel className="sr-only" htmlFor={id}>
                {label}
              </FieldLabel>
              {name === 'name' ?
                <Input
                  id={id}
                  value={field.state.value}
                  autoComplete="off"
                  autoFocus={row.id === null}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={`${id}-error`}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              : <NativeSelect
                  id={id}
                  className="w-full"
                  value={field.state.value}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={`${id}-error`}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                >
                  <NativeSelectOption value="" disabled>
                    Select equipment
                  </NativeSelectOption>
                  {options.equipment.map((equipment) => (
                    <NativeSelectOption
                      key={equipment.id}
                      value={String(equipment.id)}
                    >
                      {equipment.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              }
              <FieldError id={`${id}-error`} errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      );
    }

    return (
      <form.Field name={`rows[${index}].${name}`}>
        {(field) => (
          <Field className="w-[210px] max-w-[210px] min-w-0 whitespace-normal">
            <MusclePicker
              id={id}
              label={label}
              options={options.muscles}
              value={field.state.value}
              disabled={disabled}
              onBlur={field.handleBlur}
              onChange={(value) => {
                field.handleChange(value);
                const other =
                  name === 'primaryMuscleIds' ? 'secondaryMuscleIds' : (
                    'primaryMuscleIds'
                  );
                form.setFieldValue(`rows[${index}].${other}`, (ids) =>
                  ids.filter((muscleId) => !value.includes(muscleId)),
                );
              }}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
    );
  },
});

function DraftActions({
  row,
  index,
  onDuplicate,
  onRemove,
}: {
  row: ExerciseDraft;
  index: number;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Duplicate exercise row ${index + 1}`}
        onClick={onDuplicate}
      >
        Duplicate
      </Button>
      {row.id === null && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Remove unsaved exercise row ${index + 1}`}
          onClick={onRemove}
        >
          Remove
        </Button>
      )}
    </div>
  );
}

const ExerciseEditorGrid = withForm({
  ...editorFormOptions,
  props: {} as Pick<ExerciseEditorProps, 'options' | 'onCancel'> & {
    renderTable: ExerciseEditorProps['children'];
    error?: string;
  },
  render: function ExerciseEditorGrid({
    form,
    options,
    onCancel,
    renderTable,
    error,
  }) {
    return (
      <form.Field name="rows" mode="array">
        {(rows) => (
          <form.Subscribe selector={(state) => state}>
            {(state) => {
              const changes = changedExercises(
                state.values.rows,
                (index, field) =>
                  state.fieldMeta[`rows[${index}].${field}`]?.isDefaultValue !==
                  false,
              );

              return (
                <FieldSet disabled={state.isSubmitting} className="min-w-0">
                  <div className="bg-card sticky top-0 z-10 flex flex-wrap items-center gap-2 py-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => rows.pushValue(newExercise())}
                    >
                      Add row
                    </Button>
                    <Button
                      type="submit"
                      disabled={!state.canSubmit || changes.length === 0}
                      aria-busy={state.isSubmitting}
                    >
                      {state.isSubmitting && <Spinner />}
                      {state.isSubmitting ?
                        'Saving…'
                      : `Save changes (${changes.length})`}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (
                          form.state.isDefaultValue ||
                          window.confirm(
                            'Discard all unsaved catalogue changes?',
                          )
                        ) {
                          onCancel();
                        }
                      }}
                    >
                      Discard changes
                    </Button>
                  </div>
                  <FieldDescription>
                    Changes stay here until you save. Sorting is paused while
                    editing. Codes are generated on creation and never change.
                  </FieldDescription>
                  <FieldError>{error}</FieldError>
                  {renderTable({
                    data: state.values.rows,
                    disabled: state.isSubmitting,
                    renderBulkEditor: (selectedClientIds, clearSelection) =>
                      selectedClientIds.length > 0 ?
                        <ExerciseBulkEditor
                          form={form}
                          options={options}
                          selectedClientIds={selectedClientIds}
                          clearSelection={clearSelection}
                          disabled={state.isSubmitting}
                        />
                      : <FieldDescription>
                          Select rows to set equipment or muscle lists together.
                        </FieldDescription>,
                    renderField: (index, name) => {
                      const row = state.values.rows[index];
                      return row ?
                          <ExerciseDraftField
                            form={form}
                            index={index}
                            row={row}
                            name={name}
                            options={options}
                            disabled={state.isSubmitting}
                          />
                        : null;
                    },
                    renderActions: (index, beforeRemove) => {
                      const row = state.values.rows[index];
                      return row ?
                          <DraftActions
                            row={row}
                            index={index}
                            onDuplicate={() => rows.pushValue(newExercise(row))}
                            onRemove={() => {
                              beforeRemove();
                              void rows.removeValue(index);
                            }}
                          />
                        : null;
                    },
                  })}
                </FieldSet>
              );
            }}
          </form.Subscribe>
        )}
      </form.Field>
    );
  },
});

export function ExerciseEditor({
  data,
  options,
  onSaved,
  onCancel,
  children,
}: ExerciseEditorProps) {
  // Capture one editing session; background refetches must not replace its draft.
  const [defaultValues, setDefaultValues] = useState(() => ({ rows: data }));
  const { trpc } = routeApi.useRouteContext();
  const queryClient = useQueryClient();
  const saveExercises = useMutation(
    trpc.catalogue.exercises.save.mutationOptions(),
  );
  const form = useAppForm({
    ...editorFormOptions,
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const changes = changedExercises(
        value.rows,
        (index, field) =>
          formApi.getFieldMeta(`rows[${index}].${field}`)?.isDefaultValue !==
          false,
      );
      if (changes.length === 0) return;

      const input = changes.map(
        (row) =>
          ({
            ...(row.id === null ? {} : { id: row.id }),
            name: row.name.trim(),
            equipmentId: Number(row.equipmentId),
            muscles: [
              ...row.primaryMuscleIds.map((muscleId) => ({
                muscleId,
                role: 'primary' as const,
              })),
              ...row.secondaryMuscleIds.map((muscleId) => ({
                muscleId,
                role: 'secondary' as const,
              })),
            ],
          }) satisfies ExerciseInput & { id?: number },
      );

      let saved;
      try {
        saved = await saveExercises.mutateAsync({ changes: input });
      } catch {
        // A failed transaction changes nothing; keep the complete draft.
        return;
      }

      const savedByClientId = new Map(
        changes.map((row, index) => [row.clientId, saved[index]]),
      );
      const committedValues = {
        rows: value.rows.map((row) => ({
          ...row,
          ...savedByClientId.get(row.clientId),
        })),
      };
      try {
        await Promise.all([
          queryClient.invalidateQueries(
            { queryKey: trpc.catalogue.exercises.list.queryKey() },
            { throwOnError: true },
          ),
          queryClient.invalidateQueries(
            { queryKey: trpc.exercise.list.queryKey() },
            { throwOnError: true },
          ),
        ]);
      } catch {
        toast.warning(
          'Changes were saved, but refreshing failed. Your saved values are still shown here.',
        );
        return;
      } finally {
        // Even if refreshing fails, keep the committed IDs and mark them clean
        // so retrying cannot accidentally create the same exercises again.
        setDefaultValues(committedValues);
        formApi.reset(committedValues);
      }
      toast.success(
        `Saved ${changes.length} exercise${changes.length === 1 ? '' : 's'}`,
      );
      onSaved();
    },
  });

  useBlocker({
    shouldBlockFn: () =>
      form.state.isSubmitting ||
      (!form.state.isDefaultValue &&
        !window.confirm('Leave and discard your unsaved catalogue changes?')),
    enableBeforeUnload: () =>
      form.state.isSubmitting || !form.state.isDefaultValue,
  });

  return (
    <form
      aria-label="Edit exercise catalogue"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <ExerciseEditorGrid
        form={form}
        options={options}
        onCancel={onCancel}
        error={saveExercises.error?.message}
        renderTable={children}
      />
    </form>
  );
}
