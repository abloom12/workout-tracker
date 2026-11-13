import type { inferInput, inferOutput } from '@trpc/tanstack-react-query';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useBlocker } from '@tanstack/react-router';
import { CopyIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/cn';
import { useAppForm, withForm } from '@/lib/form';

type CatalogueOption = { id: number; name: string };
type ExerciseInput = inferInput<typeof trpc.catalogue.exercises.create>;
export type ExerciseRow = inferOutput<
  typeof trpc.catalogue.exercises.list
>[number];
export type ExerciseOptions = inferOutput<
  typeof trpc.catalogue.exercises.options
> & {
  equipment: ExerciseRow['equipment'][];
  muscles: CatalogueOption[];
  movementPatterns: CatalogueOption[];
};
export type ExerciseDraft = {
  clientId: string;
  id: ExerciseRow['id'] | null;
  name: string;
  equipmentId: string;
  gripOrientation: ExerciseRow['gripOrientation'];
  gripWidth: ExerciseRow['gripWidth'];
  isUnilateral: ExerciseRow['isUnilateral'];
  mechanics: ExerciseRow['mechanics'];
  movementPatternIds: number[];
  primaryMuscleIds: number[];
  secondaryMuscleIds: number[];
};

const editableFields = [
  'name',
  'equipmentId',
  'gripOrientation',
  'gripWidth',
  'isUnilateral',
  'mechanics',
  'movementPatternIds',
  'primaryMuscleIds',
  'secondaryMuscleIds',
] as const;
export type ExerciseEditableField = (typeof editableFields)[number];
export type ExerciseGridEditorProps = {
  data: ExerciseDraft[];
  renderField: (index: number, name: ExerciseEditableField) => ReactNode;
  isFieldChanged: (index: number, name: ExerciseEditableField) => boolean;
  renderActions: (index: number, beforeRemove: () => void) => ReactNode;
  renderBulkEditor: (
    selectedClientIds: string[],
    clearSelection: () => void,
  ) => ReactNode;
  renderToolbar: (
    selectedClientIds: string[],
    bulkEditor: ReactNode,
  ) => ReactNode;
  disabled: boolean;
};

type ExerciseEditorProps = {
  data: ExerciseDraft[];
  options: ExerciseOptions;
  onCancel: () => void;
  children: (editor: ExerciseGridEditorProps) => ReactNode;
};

export function formatExerciseOption(
  value: ExerciseDraft['gripOrientation' | 'gripWidth' | 'mechanics'],
) {
  return value === null ? 'Not set' : (
      value.charAt(0).toUpperCase() + value.slice(1)
    );
}

const exerciseSelectLabels = {
  gripOrientation: 'Grip orientation',
  gripWidth: 'Grip width',
  mechanics: 'Mechanics',
};
type ExerciseSelectFieldName = keyof typeof exerciseSelectLabels;

function exerciseSelectOptions(
  options: ExerciseOptions,
  name: ExerciseSelectFieldName,
) {
  return (
    name === 'gripOrientation' ? options.gripOrientations
    : name === 'gripWidth' ? options.gripWidths
    : options.mechanics
  );
}

const routeApi = getRouteApi('/_app/admin/catalogue');
const formSchema = z.object({
  rows: z.array(
    z.object({
      clientId: z.string(),
      id: z.uuid().nullable(),
      name: z.string().trim().min(1, 'Name is required').max(200),
      equipmentId: z.uuid('Select equipment'),
      gripOrientation: z
        .enum([
          'overhand',
          'underhand',
          'neutral',
        ] satisfies ExerciseOptions['gripOrientations'])
        .nullable(),
      gripWidth: z
        .enum([
          'close',
          'standard',
          'wide',
        ] satisfies ExerciseOptions['gripWidths'])
        .nullable(),
      isUnilateral: z.boolean(),
      mechanics: z
        .enum(['compound', 'isolation'] satisfies ExerciseOptions['mechanics'])
        .nullable(),
      movementPatternIds: z.array(z.int().positive()).max(100),
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
    name: source?.name ?? '',
    equipmentId: source?.equipmentId ?? '',
    gripOrientation: source?.gripOrientation ?? null,
    gripWidth: source?.gripWidth ?? null,
    isUnilateral: source?.isUnilateral ?? false,
    mechanics: source?.mechanics ?? null,
    movementPatternIds: [...(source?.movementPatternIds ?? [])],
    primaryMuscleIds: [...(source?.primaryMuscleIds ?? [])],
    secondaryMuscleIds: [...(source?.secondaryMuscleIds ?? [])],
  };
}

// A small family palette stays consistent across roles and the editing pickers.
const muscleBadgeTones = [
  {
    names: ['chest'],
    primary:
      'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/15 dark:text-rose-200',
    secondary:
      'border-rose-200 text-rose-700 dark:border-rose-400/30 dark:text-rose-300',
  },
  {
    names: ['lats', 'traps', 'upper back', 'lower back'],
    primary:
      'border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-400/25 dark:bg-sky-400/15 dark:text-sky-200',
    secondary:
      'border-sky-200 text-sky-700 dark:border-sky-400/30 dark:text-sky-300',
  },
  {
    names: ['front delts', 'side delts', 'rear delts'],
    primary:
      'border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-400/25 dark:bg-violet-400/15 dark:text-violet-200',
    secondary:
      'border-violet-200 text-violet-700 dark:border-violet-400/30 dark:text-violet-300',
  },
  {
    names: ['biceps', 'triceps', 'forearms'],
    primary:
      'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-200',
    secondary:
      'border-amber-200 text-amber-700 dark:border-amber-400/30 dark:text-amber-300',
  },
  {
    names: ['quads', 'hamstrings', 'glutes', 'adductors', 'calves'],
    primary:
      'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200',
    secondary:
      'border-emerald-200 text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-300',
  },
  {
    names: ['core'],
    primary:
      'border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-400/25 dark:bg-orange-400/15 dark:text-orange-200',
    secondary:
      'border-orange-200 text-orange-700 dark:border-orange-400/30 dark:text-orange-300',
  },
];

export function MuscleBadges({
  muscles,
  secondary = false,
}: {
  muscles: CatalogueOption[];
  secondary?: boolean;
}) {
  if (muscles.length === 0) {
    return (
      <span className="text-muted-foreground" aria-label="No muscles assigned">
        —
      </span>
    );
  }

  return (
    <span className="flex max-w-64 flex-wrap gap-1">
      {muscles.map((muscle) => {
        const tone = muscleBadgeTones.find((group) =>
          group.names.includes(muscle.name.trim().toLowerCase()),
        );
        return (
          <Badge
            key={muscle.id}
            variant={secondary ? 'outline' : 'secondary'}
            className={cn(
              'h-auto min-h-5 whitespace-normal',
              secondary ? 'font-normal' : 'font-medium',
              secondary ? tone?.secondary : tone?.primary,
            )}
          >
            {muscle.name}
          </Badge>
        );
      })}
    </span>
  );
}

export function MovementPatternBadges({
  patterns,
}: {
  patterns: CatalogueOption[];
}) {
  return patterns.length === 0 ?
      <span
        className="text-muted-foreground"
        aria-label="No movement patterns assigned"
      >
        —
      </span>
    : <span className="flex max-w-64 flex-wrap gap-1">
        {patterns.map((pattern) => (
          <Badge
            key={pattern.id}
            variant="secondary"
            className="whitespace-normal"
          >
            {pattern.name}
          </Badge>
        ))}
      </span>;
}

function CataloguePicker({
  id,
  label,
  options,
  value,
  kind = 'muscles',
  secondary = false,
  disabled,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  options: CatalogueOption[];
  value: number[];
  kind?: 'muscles' | 'movementPatterns';
  secondary?: boolean;
  disabled: boolean;
  onChange: (value: number[]) => void;
  onBlur: () => void;
}) {
  const selected = options.filter((option) => value.includes(option.id));
  const noun = kind === 'muscles' ? 'muscles' : 'movement patterns';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={`${label}: ${selected.map((option) => option.name).join(', ') || 'None selected'}`}
          className="h-auto min-h-9 w-full min-w-0 justify-start text-left [overflow-wrap:anywhere] whitespace-normal"
          onBlur={onBlur}
        >
          {selected.length === 0 ?
            <span className="text-muted-foreground">
              {kind === 'movementPatterns' ?
                'Select movement'
              : 'Select muscles'}
            </span>
          : kind === 'muscles' ?
            <MuscleBadges muscles={selected} secondary={secondary} />
          : <MovementPatternBadges patterns={selected} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-80 overflow-y-auto" align="start">
        <p className="font-medium">{label}</p>
        {options.map((option) => (
          <Field key={option.id} orientation="horizontal">
            <Checkbox
              id={`${id}-${option.id}`}
              checked={value.includes(option.id)}
              disabled={disabled}
              onCheckedChange={(checked) => {
                onChange(
                  checked === true ?
                    [...value, option.id].sort((a, b) => a - b)
                  : value.filter((id) => id !== option.id),
                );
              }}
            />
            <FieldLabel htmlFor={`${id}-${option.id}`}>
              {option.name}
            </FieldLabel>
          </Field>
        ))}
        {options.length === 0 && <p>No {noun} available.</p>}
      </PopoverContent>
    </Popover>
  );
}

const bulkEditSchema = z
  .object({
    equipmentId: z.union([z.literal(''), z.uuid()]),
    gripOrientation:
      formSchema.shape.rows.element.shape.gripOrientation.optional(),
    gripWidth: formSchema.shape.rows.element.shape.gripWidth.optional(),
    isUnilateral: z.boolean().optional(),
    mechanics: formSchema.shape.rows.element.shape.mechanics.optional(),
    movementPatternIds:
      formSchema.shape.rows.element.shape.movementPatternIds.optional(),
    primaryMuscleIds: z.array(z.int().positive()).max(100).optional(),
    secondaryMuscleIds: z.array(z.int().positive()).max(100).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.primaryMuscleIds?.some((id) =>
        value.secondaryMuscleIds?.includes(id),
      )
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
  gripOrientation: undefined,
  gripWidth: undefined,
  isUnilateral: undefined,
  mechanics: undefined,
  movementPatternIds: undefined,
  // An untouched picker is omitted; choosing then removing all muscles is [].
  primaryMuscleIds: undefined,
  secondaryMuscleIds: undefined,
};
const bulkFormOptions = {
  defaultValues: bulkEditDefaults,
  validators: { onChange: bulkEditSchema },
};

function hasBulkChanges(value: BulkEditValues) {
  return (
    value.equipmentId !== '' ||
    value.gripOrientation !== undefined ||
    value.gripWidth !== undefined ||
    value.isUnilateral !== undefined ||
    value.mechanics !== undefined ||
    value.movementPatternIds !== undefined ||
    value.primaryMuscleIds !== undefined ||
    value.secondaryMuscleIds !== undefined
  );
}

function applyBulkChanges(
  row: ExerciseDraft,
  value: BulkEditValues,
): ExerciseDraft {
  let primaryMuscleIds =
    value.primaryMuscleIds === undefined ?
      row.primaryMuscleIds
    : [...value.primaryMuscleIds];
  let secondaryMuscleIds =
    value.secondaryMuscleIds === undefined ?
      row.secondaryMuscleIds
    : [...value.secondaryMuscleIds];

  // Match individual editing: assigning a muscle to one role moves it out
  // of the other. Untouched pickers otherwise preserve each row's list.
  if (value.primaryMuscleIds !== undefined) {
    secondaryMuscleIds = secondaryMuscleIds.filter(
      (id) => !primaryMuscleIds.includes(id),
    );
  }
  if (value.secondaryMuscleIds !== undefined) {
    primaryMuscleIds = primaryMuscleIds.filter(
      (id) => !secondaryMuscleIds.includes(id),
    );
  }

  return {
    ...row,
    equipmentId: value.equipmentId || row.equipmentId,
    gripOrientation:
      value.gripOrientation === undefined ?
        row.gripOrientation
      : value.gripOrientation,
    gripWidth: value.gripWidth === undefined ? row.gripWidth : value.gripWidth,
    isUnilateral: value.isUnilateral ?? row.isUnilateral,
    mechanics: value.mechanics === undefined ? row.mechanics : value.mechanics,
    movementPatternIds:
      value.movementPatternIds === undefined ?
        row.movementPatternIds
      : [...value.movementPatternIds],
    primaryMuscleIds,
    secondaryMuscleIds,
  };
}

const BulkSelectField = withForm({
  ...bulkFormOptions,
  props: {} as {
    name: ExerciseSelectFieldName;
    id: string;
    options: ExerciseOptions;
    disabled: boolean;
  },
  render: function BulkSelectField({ form, name, id, options, disabled }) {
    const fieldId = `${id}-${name}`;
    const label = exerciseSelectLabels[name];
    const values = exerciseSelectOptions(options, name);

    return (
      <form.Field name={name}>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
            <NativeSelect
              id={fieldId}
              className="w-full"
              disabled={disabled}
              value={
                field.state.value === undefined ?
                  ''
                : (field.state.value ?? 'unset')
              }
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby={`${fieldId}-error`}
              onChange={(event) =>
                field.handleChange(
                  event.target.value === 'unset' ?
                    null
                  : values.find((value) => value === event.target.value),
                )
              }
              onBlur={field.handleBlur}
            >
              <NativeSelectOption value="">Leave unchanged</NativeSelectOption>
              <NativeSelectOption value="unset">Not set</NativeSelectOption>
              {values.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {formatExerciseOption(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError
              id={`${fieldId}-error`}
              errors={field.state.meta.errors}
            />
          </Field>
        )}
      </form.Field>
    );
  },
});

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
      <form.Field name={`${role}MuscleIds`}>
        {(muscles) => (
          <Field>
            <FieldLabel htmlFor={`${id}-muscles`}>{label}</FieldLabel>
            <CataloguePicker
              id={`${id}-muscles`}
              label={`${label} for selected exercises`}
              options={options}
              value={muscles.state.value ?? []}
              secondary={role === 'secondary'}
              disabled={disabled}
              onChange={muscles.handleChange}
              onBlur={muscles.handleBlur}
            />
            <FieldError errors={muscles.state.meta.errors} />
          </Field>
        )}
      </form.Field>
    );
  },
});

const BulkUnilateralField = withForm({
  ...bulkFormOptions,
  props: {} as { id: string; disabled: boolean },
  render: function BulkUnilateralField({ form, id, disabled }) {
    return (
      <form.Field name="isUnilateral">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={id}>Unilateral</FieldLabel>
            <NativeSelect
              id={id}
              className="w-full"
              disabled={disabled}
              value={
                field.state.value === undefined ? '' : String(field.state.value)
              }
              onChange={(event) =>
                field.handleChange(
                  event.target.value === '' ?
                    undefined
                  : event.target.value === 'true',
                )
              }
              onBlur={field.handleBlur}
            >
              <NativeSelectOption value="">Leave unchanged</NativeSelectOption>
              <NativeSelectOption value="true">Yes</NativeSelectOption>
              <NativeSelectOption value="false">No</NativeSelectOption>
            </NativeSelect>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
    );
  },
});

const BulkMovementPatternField = withForm({
  ...bulkFormOptions,
  props: {} as { id: string; options: CatalogueOption[]; disabled: boolean },
  render: function BulkMovementPatternField({ form, id, options, disabled }) {
    return (
      <form.Field name="movementPatternIds">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={id}>Movement patterns</FieldLabel>
            <CataloguePicker
              id={id}
              label="Movement patterns for selected exercises"
              kind="movementPatterns"
              options={options}
              value={field.state.value ?? []}
              disabled={disabled}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
            <FieldDescription>
              {field.state.value === undefined ?
                'Leave unchanged'
              : field.state.value.length === 0 ?
                'Clear all assignments'
              : 'Replace assignments with selected patterns'}
            </FieldDescription>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => field.handleChange([])}
              >
                Clear patterns
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || field.state.value === undefined}
                onClick={() => field.handleChange(undefined)}
              >
                Leave unchanged
              </Button>
            </div>
            <FieldError errors={field.state.meta.errors} />
          </Field>
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
  const controlsDisabled = disabled || selectedCount < 2;
  const form = useAppForm({
    ...bulkFormOptions,
    onSubmit: ({ value, formApi }) => {
      if (controlsDisabled || !hasBulkChanges(value)) return;
      onApply(value);
      formApi.reset();
    },
  });

  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => (
        <FieldSet
          disabled={controlsDisabled || state.isSubmitting}
          className="@container min-w-0"
        >
          <FieldLegend variant="label">
            Edit {selectedCount} selected rows
          </FieldLegend>
          <div className="grid gap-4 @lg:grid-cols-3">
            <form.Field name="equipmentId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={`${id}-equipment`}>Equipment</FieldLabel>
                  <NativeSelect
                    id={`${id}-equipment`}
                    className="w-full"
                    disabled={controlsDisabled || state.isSubmitting}
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
                        value={equipment.id}
                      >
                        {equipment.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            </form.Field>
            <BulkUnilateralField
              form={form}
              id={`${id}-unilateral`}
              disabled={controlsDisabled || state.isSubmitting}
            />
            {(['gripOrientation', 'gripWidth', 'mechanics'] as const).map(
              (name) => (
                <BulkSelectField
                  key={name}
                  form={form}
                  name={name}
                  id={id}
                  options={options}
                  disabled={controlsDisabled || state.isSubmitting}
                />
              ),
            )}
            <BulkMovementPatternField
              form={form}
              id={`${id}-movement-patterns`}
              options={options.movementPatterns}
              disabled={controlsDisabled || state.isSubmitting}
            />
            {(['primary', 'secondary'] as const).map((role) => (
              <BulkMuscleFields
                key={role}
                form={form}
                role={role}
                id={`${id}-${role}`}
                options={options.muscles}
                disabled={controlsDisabled || state.isSubmitting}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={
                controlsDisabled ||
                state.isSubmitting ||
                !state.canSubmit ||
                !hasBulkChanges(state.values)
              }
              onClick={() => void form.handleSubmit()}
            >
              Apply to selected ({selectedCount})
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={controlsDisabled || state.isSubmitting}
              onClick={clearSelection}
            >
              Clear selection
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
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
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || selectedClientIds.length < 2}
          >
            Edit multiple ({selectedClientIds.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit multiple exercises</DialogTitle>
            <DialogDescription>
              Set values for {selectedClientIds.length} selected rows. Apply
              updates the draft only; use Save changes to save them.
            </DialogDescription>
          </DialogHeader>
          <BulkEditControls
            options={options}
            selectedCount={selectedClientIds.length}
            disabled={disabled}
            clearSelection={() => {
              clearSelection();
              setOpen(false);
            }}
            onApply={(value) => {
              if (form.state.isSubmitting) return;
              const selected = new Set(selectedClientIds);
              form.setFieldValue('rows', (rows) =>
                rows.map((row) =>
                  selected.has(row.clientId) ?
                    applyBulkChanges(row, value)
                  : row,
                ),
              );
              void form.validate('change');
              toast.success(
                `Applied to ${selectedClientIds.length} draft rows. Not saved yet.`,
              );
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  },
});

const ExerciseSelectField = withForm({
  ...editorFormOptions,
  props: {} as {
    index: number;
    clientId: string;
    name: ExerciseSelectFieldName;
    options: ExerciseOptions;
    disabled: boolean;
  },
  render: function ExerciseSelectField({
    form,
    index,
    clientId,
    name,
    options,
    disabled,
  }) {
    const id = `${clientId}-${name}`;
    const label = `${exerciseSelectLabels[name]} for exercise row ${index + 1}`;
    const values = exerciseSelectOptions(options, name);

    return (
      <form.Field name={`rows[${index}].${name}`}>
        {(field) => (
          <Field className="min-w-0 whitespace-normal">
            <FieldLabel className="sr-only" htmlFor={id}>
              {label}
            </FieldLabel>
            <NativeSelect
              id={id}
              className="w-full"
              disabled={disabled}
              value={field.state.value ?? ''}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby={`${id}-error`}
              onChange={(event) =>
                field.handleChange(
                  values.find((value) => value === event.target.value) ?? null,
                )
              }
              onBlur={field.handleBlur}
            >
              <NativeSelectOption value="">Not set</NativeSelectOption>
              {values.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {formatExerciseOption(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id={`${id}-error`} errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
    );
  },
});

const ExerciseUnilateralField = withForm({
  ...editorFormOptions,
  props: {} as { index: number; clientId: string; disabled: boolean },
  render: function ExerciseUnilateralField({
    form,
    index,
    clientId,
    disabled,
  }) {
    const id = `${clientId}-isUnilateral`;

    return (
      <form.Field name={`rows[${index}].isUnilateral`}>
        {(field) => (
          <Field orientation="horizontal" className="min-h-8 justify-center">
            <Checkbox
              id={id}
              checked={field.state.value}
              disabled={disabled}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
              onBlur={field.handleBlur}
            />
            <FieldLabel className="sr-only" htmlFor={id}>
              Unilateral for exercise row {index + 1}
            </FieldLabel>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
    );
  },
});

const ExerciseMovementPatternField = withForm({
  ...editorFormOptions,
  props: {} as {
    index: number;
    clientId: string;
    options: CatalogueOption[];
    disabled: boolean;
  },
  render: function ExerciseMovementPatternField({
    form,
    index,
    clientId,
    options,
    disabled,
  }) {
    return (
      <form.Field name={`rows[${index}].movementPatternIds`}>
        {(field) => (
          <Field className="min-w-0 whitespace-normal">
            <CataloguePicker
              id={`${clientId}-movementPatternIds`}
              label={`Movement patterns for exercise row ${index + 1}`}
              kind="movementPatterns"
              options={options}
              value={field.state.value}
              disabled={disabled}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
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
    if (
      name === 'gripOrientation' ||
      name === 'gripWidth' ||
      name === 'mechanics'
    ) {
      return (
        <ExerciseSelectField
          form={form}
          index={index}
          clientId={row.clientId}
          name={name}
          options={options}
          disabled={disabled}
        />
      );
    }

    const id = `${row.clientId}-${name}`;

    if (name === 'isUnilateral') {
      return (
        <ExerciseUnilateralField
          form={form}
          index={index}
          clientId={row.clientId}
          disabled={disabled}
        />
      );
    }

    if (name === 'movementPatternIds') {
      return (
        <ExerciseMovementPatternField
          form={form}
          index={index}
          clientId={row.clientId}
          options={options.movementPatterns}
          disabled={disabled}
        />
      );
    }

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
            <Field className="min-w-0 whitespace-normal">
              <FieldLabel className="sr-only" htmlFor={id}>
                {label}
              </FieldLabel>
              {name === 'name' ?
                <Input
                  id={id}
                  className="font-medium"
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
                    <NativeSelectOption key={equipment.id} value={equipment.id}>
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
          <Field className="min-w-0 whitespace-normal">
            <CataloguePicker
              id={id}
              label={label}
              options={options.muscles}
              value={field.state.value}
              secondary={name === 'secondaryMuscleIds'}
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
    <div className="flex min-w-0 flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Duplicate exercise row ${index + 1}`}
        title="Duplicate exercise"
        onClick={onDuplicate}
      >
        <CopyIcon aria-hidden="true" />
      </Button>
      {row.id === null && (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          aria-label={`Remove unsaved exercise row ${index + 1}`}
          title="Remove unsaved exercise"
          onClick={onRemove}
        >
          <Trash2Icon aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

const ExerciseSelectionActions = withForm({
  ...editorFormOptions,
  props: {} as { selectedClientIds: string[]; disabled: boolean },
  render: function ExerciseSelectionActions({
    form,
    selectedClientIds,
    disabled,
  }) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || selectedClientIds.length === 0}
          onClick={() => {
            if (form.state.isSubmitting) return;
            const rowsById = new Map(
              form.state.values.rows.map((row) => [row.clientId, row]),
            );
            const copies = selectedClientIds.flatMap((clientId) => {
              const source = rowsById.get(clientId);
              return source ? [newExercise(source)] : [];
            });
            if (copies.length === 0) return;

            form.setFieldValue('rows', (rows) => [...rows, ...copies]);
            void form.validate('change');
          }}
        >
          Duplicate selected ({selectedClientIds.length})
        </Button>
      </div>
    );
  },
});

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
                  {renderTable({
                    data: state.values.rows,
                    disabled: state.isSubmitting,
                    isFieldChanged: (index, name) =>
                      state.values.rows[index]?.id !== null &&
                      state.fieldMeta[`rows[${index}].${name}`]
                        ?.isDefaultValue === false,
                    renderToolbar: (selectedClientIds, bulkEditor) => (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => rows.pushValue(newExercise())}
                          >
                            Add row
                          </Button>
                          <ExerciseSelectionActions
                            form={form}
                            selectedClientIds={selectedClientIds}
                            disabled={state.isSubmitting}
                          />
                          {bulkEditor}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
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
                            {state.isDefaultValue ? 'Leave' : 'Discard changes'}
                          </Button>
                        </div>
                        <FieldDescription className="flex items-center gap-2 text-xs">
                          <span
                            aria-hidden="true"
                            className="size-3 rounded-sm border-l-2 border-amber-400 bg-amber-100 dark:bg-amber-400/15"
                          />
                          Highlighted cells have unsaved changes. New rows are
                          marked “New”.
                        </FieldDescription>
                        <FieldError>{error}</FieldError>
                      </>
                    ),
                    renderBulkEditor: (selectedClientIds, clearSelection) => (
                      <ExerciseBulkEditor
                        form={form}
                        options={options}
                        selectedClientIds={selectedClientIds}
                        clearSelection={clearSelection}
                        disabled={state.isSubmitting}
                      />
                    ),
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
            equipmentId: row.equipmentId,
            gripOrientation: row.gripOrientation,
            gripWidth: row.gripWidth,
            isUnilateral: row.isUnilateral,
            mechanics: row.mechanics,
            movementPatternIds: row.movementPatternIds,
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
          }) satisfies ExerciseInput & { id?: ExerciseRow['id'] },
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
