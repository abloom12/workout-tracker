import type {
  ColumnFiltersState,
  ExtractFilterMeta,
  OnChangeFn,
  Row,
  TableFeatures,
  Table as TableInstance,
} from '@tanstack/react-table';
import { useId, useMemo, useState } from 'react';
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  metaHelper,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/cn';
import type {
  ExerciseDraft,
  ExerciseEditableField,
  ExerciseGridEditorProps,
  ExerciseOptions,
  ExerciseRow,
} from './SetupEditor';
import {
  ExerciseEditor,
  formatExerciseOption,
  MovementPatternBadges,
  MuscleBadges,
} from './SetupEditor';

type ExercisesTableProps = { data?: ExerciseRow[]; options: ExerciseOptions };
type ExerciseTableRow = ExerciseDraft & {
  equipmentName: string;
  primaryMuscles: ExerciseOptions['muscles'];
  secondaryMuscles: ExerciseOptions['muscles'];
  movementPatterns: ExerciseOptions['movementPatterns'];
};
type TableMeta = Partial<
  Pick<
    ExerciseGridEditorProps,
    'renderField' | 'renderActions' | 'isFieldChanged' | 'disabled'
  >
>;

type ColumnMeta = { className?: string; field?: ExerciseEditableField };
type CatalogueFilterStateProps = {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
};

const unsetGripFilterValue = 'unset';

function EquipmentBadge({ name }: { name: string }) {
  if (!name) {
    return (
      <span className="text-muted-foreground" aria-label="Equipment not set">
        —
      </span>
    );
  }

  const normalized = name.trim().toLowerCase();
  const isFreeWeight = ['barbell', 'trap bar', 'dumbbell'].includes(normalized);
  const isCable = normalized === 'cable';

  return (
    <Badge
      variant="secondary"
      className={cn(
        'h-auto min-h-6 max-w-48 rounded-md whitespace-normal',
        isFreeWeight &&
          'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200',
        isCable &&
          'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200',
      )}
    >
      {name}
    </Badge>
  );
}

function ExerciseOptionLabel({
  value,
}: {
  value: ExerciseDraft['gripOrientation' | 'gripWidth' | 'mechanics'];
}) {
  return value === null ?
      <span className="text-muted-foreground" aria-label="Not set">
        —
      </span>
    : <Badge variant="secondary" className="font-normal">
        {formatExerciseOption(value)}
      </Badge>;
}

function includeNewRows(filterFn: typeof filterFn_equals) {
  return Object.assign(
    <
      TFeatures extends TableFeatures,
      TData extends { id: ExerciseDraft['id'] },
    >(
      row: Row<TFeatures, TData>,
      columnId: string,
      filterValue: unknown,
      addMeta?: (meta: ExtractFilterMeta<TFeatures>) => void,
    ) =>
      row.original.id === null || filterFn(row, columnId, filterValue, addMeta),
    // Preserve TanStack's filter resolvers and automatic removal of empty values.
    { ...filterFn },
  );
}

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  columnMeta: metaHelper<ColumnMeta>(),
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    equals: includeNewRows(filterFn_equals),
    arrIncludes: includeNewRows(filterFn_arrIncludes),
  },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  tableMeta: metaHelper<TableMeta>(),
});
const columnHelper = createColumnHelper<typeof features, ExerciseTableRow>();
const columns = columnHelper.columns([
  columnHelper.accessor((row) => row.id ?? undefined, {
    id: 'id',
    header: 'ID',
    meta: {
      className: '[overflow-wrap:normal] whitespace-nowrap @5xl/catalogue:w-16',
    },
    sortUndefined: 'last',
    cell: ({ cell }) =>
      cell.getValue() === undefined ?
        <Badge
          variant="outline"
          className="border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200"
        >
          New
        </Badge>
      : <span
          title={cell.getValue()}
          className="text-muted-foreground block truncate font-mono text-xs"
        >
          {cell.getValue()}
        </span>,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    meta: { className: '@5xl/catalogue:w-[16%]', field: 'name' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'name') ?? (
        <span className="font-semibold">{cell.getValue()}</span>
      ),
  }),
  columnHelper.accessor('equipmentName', {
    header: 'Equipment',
    meta: { field: 'equipmentId' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'equipmentId') ?? (
        <EquipmentBadge name={cell.getValue()} />
      ),
  }),
  columnHelper.accessor('gripOrientation', {
    header: 'Grip orientation',
    meta: { field: 'gripOrientation' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'gripOrientation') ?? (
        <ExerciseOptionLabel value={cell.getValue()} />
      ),
  }),
  columnHelper.accessor('gripWidth', {
    header: 'Grip width',
    meta: { field: 'gripWidth' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'gripWidth') ?? (
        <ExerciseOptionLabel value={cell.getValue()} />
      ),
  }),
  columnHelper.accessor('mechanics', {
    header: 'Mechanics',
    meta: { field: 'mechanics' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'mechanics') ?? (
        <ExerciseOptionLabel value={cell.getValue()} />
      ),
  }),
  columnHelper.accessor(
    (row) => row.movementPatterns.map((pattern) => pattern.name).join(', '),
    {
      id: 'movementPatterns',
      header: 'Movement patterns',
      meta: { field: 'movementPatternIds' },
      cell: ({ row, table }) =>
        table.options.meta?.renderField?.(row.index, 'movementPatternIds') ?? (
          <MovementPatternBadges patterns={row.original.movementPatterns} />
        ),
    },
  ),
  columnHelper.accessor(
    (row) => row.primaryMuscles.map((muscle) => muscle.name).join(', '),
    {
      id: 'primaryMuscles',
      header: 'Primary muscles',
      meta: { field: 'primaryMuscleIds' },
      cell: ({ row, table }) =>
        table.options.meta?.renderField?.(row.index, 'primaryMuscleIds') ?? (
          <MuscleBadges muscles={row.original.primaryMuscles} />
        ),
    },
  ),
  columnHelper.accessor(
    (row) => row.secondaryMuscles.map((muscle) => muscle.name).join(', '),
    {
      id: 'secondaryMuscles',
      header: 'Secondary muscles',
      meta: { field: 'secondaryMuscleIds' },
      cell: ({ row, table }) =>
        table.options.meta?.renderField?.(row.index, 'secondaryMuscleIds') ?? (
          <MuscleBadges muscles={row.original.secondaryMuscles} secondary />
        ),
    },
  ),
  columnHelper.accessor((row) => (row.isUnilateral ? 'Yes' : 'No'), {
    id: 'isUnilateral',
    header: 'Uni',
    meta: {
      className:
        'flex flex-col justify-center text-center align-middle @5xl/catalogue:w-20',
      field: 'isUnilateral',
    },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'isUnilateral') ?? (
        <Badge variant="secondary" className="font-normal">
          {cell.getValue()}
        </Badge>
      ),
  }),
  // Filter on catalogue IDs, not formatted names or comma-separated labels.
  columnHelper.accessor('equipmentId', {
    filterFn: 'equals',
    enableSorting: false,
  }),
  columnHelper.accessor('primaryMuscleIds', {
    filterFn: 'arrIncludes',
    enableSorting: false,
  }),
  // A nonempty sentinel keeps "Not set" filters from being auto-removed.
  columnHelper.accessor((row) => row.gripOrientation ?? unsetGripFilterValue, {
    id: 'gripOrientationFilter',
    filterFn: 'equals',
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.gripWidth ?? unsetGripFilterValue, {
    id: 'gripWidthFilter',
    filterFn: 'equals',
    enableSorting: false,
  }),
]);
const editableColumns = columnHelper.columns([
  columnHelper.display({
    id: 'selection',
    meta: { className: '@5xl/catalogue:w-10' },
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all exercises"
        checked={
          table.getIsAllRowsSelected() ? true
          : table.getFilteredSelectedRowModel().rows.length > 0 ?
            'indeterminate'
          : false
        }
        disabled={
          (table.options.meta?.disabled ?? false) ||
          table.getFilteredRowModel().rows.length === 0
        }
        onCheckedChange={(checked) =>
          table.getToggleAllRowsSelectedHandler()({
            target: { checked: checked === true },
          })
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select exercise row ${row.index + 1}: ${row.original.name || 'New exercise'}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onClick={(event) => {
          // Radix renders a button, not an input. Supply checked while keeping
          // the original click so TanStack handles Shift-range selection.
          row.getToggleSelectedHandler()({
            target: { checked: !row.getIsSelected() },
            nativeEvent: event.nativeEvent,
          });
        }}
      />
    ),
  }),
  ...columns,
]);
const emptyData: ExerciseRow[] = [];

function CatalogueGripFilter({
  table,
  columnFilters,
  options,
  name,
  disabled,
}: {
  table: TableInstance<typeof features, ExerciseTableRow>;
  columnFilters: ColumnFiltersState;
  options: ExerciseOptions;
  name: 'gripOrientation' | 'gripWidth';
  disabled: boolean;
}) {
  const id = useId();
  const columnId = `${name}Filter`;
  const value = columnFilters.find((filter) => filter.id === columnId)?.value;
  const isOrientation = name === 'gripOrientation';
  const values = isOrientation ? options.gripOrientations : options.gripWidths;

  return (
    <Field className="w-52 max-w-full min-w-0">
      <FieldLabel htmlFor={id}>
        {isOrientation ? 'Filter by grip orientation' : 'Filter by grip width'}
      </FieldLabel>
      <NativeSelect
        id={id}
        className="w-full"
        disabled={disabled}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => {
          table.resetRowSelection(true);
          table
            .getColumn(columnId)
            ?.setFilterValue(event.target.value || undefined);
        }}
      >
        <NativeSelectOption value="">
          {isOrientation ? 'All orientations' : 'All widths'}
        </NativeSelectOption>
        <NativeSelectOption value={unsetGripFilterValue}>
          Not set
        </NativeSelectOption>
        {values.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {formatExerciseOption(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}

function CatalogueFilters({
  table,
  columnFilters,
  options,
  disabled,
}: {
  table: TableInstance<typeof features, ExerciseTableRow>;
  columnFilters: ColumnFiltersState;
  options: ExerciseOptions;
  disabled: boolean;
}) {
  const id = useId();
  const equipment = columnFilters.find(
    (filter) => filter.id === 'equipmentId',
  )?.value;
  const primaryMuscleFilter = columnFilters.find(
    (filter) => filter.id === 'primaryMuscleIds',
  )?.value;
  const primaryMuscle: unknown =
    Array.isArray(primaryMuscleFilter) ? primaryMuscleFilter[0] : undefined;

  return (
    <div
      role="group"
      aria-label="Catalogue filters"
      className="flex flex-wrap items-end gap-3"
    >
      <Field className="w-52 max-w-full min-w-0">
        <FieldLabel htmlFor={`${id}-equipment`}>Filter by equipment</FieldLabel>
        <NativeSelect
          id={`${id}-equipment`}
          className="w-full"
          disabled={disabled}
          value={typeof equipment === 'string' ? equipment : ''}
          onChange={(event) => {
            table.resetRowSelection(true);
            table
              .getColumn('equipmentId')
              ?.setFilterValue(event.target.value || undefined);
          }}
        >
          <NativeSelectOption value="">All equipment</NativeSelectOption>
          {options.equipment.map((item) => (
            <NativeSelectOption key={item.id} value={item.id}>
              {item.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field className="w-52 max-w-full min-w-0">
        <FieldLabel htmlFor={`${id}-primary-muscle`}>
          Filter by primary muscle
        </FieldLabel>
        <NativeSelect
          id={`${id}-primary-muscle`}
          className="w-full"
          disabled={disabled}
          value={typeof primaryMuscle === 'number' ? primaryMuscle : ''}
          onChange={(event) => {
            table.resetRowSelection(true);
            table
              .getColumn('primaryMuscleIds')
              ?.setFilterValue(
                event.target.value === '' ?
                  undefined
                : [Number(event.target.value)],
              );
          }}
        >
          <NativeSelectOption value="">All primary muscles</NativeSelectOption>
          {options.muscles.map((muscle) => (
            <NativeSelectOption key={muscle.id} value={muscle.id}>
              {muscle.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      {(['gripOrientation', 'gripWidth'] as const).map((name) => (
        <CatalogueGripFilter
          key={name}
          table={table}
          columnFilters={columnFilters}
          options={options}
          name={name}
          disabled={disabled}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled || columnFilters.length === 0}
        onClick={() => {
          table.resetRowSelection(true);
          table.resetColumnFilters(true);
        }}
      >
        Clear filters
      </Button>
      <FieldDescription role="status" aria-live="polite">
        {table.getFilteredRowModel().rows.length} of{' '}
        {table.getCoreRowModel().rows.length} exercises
      </FieldDescription>
    </div>
  );
}

function CatalogueTable({
  data,
  options,
  columnFilters,
  onColumnFiltersChange,
  renderField,
  renderActions,
  isFieldChanged,
  renderBulkEditor,
  renderToolbar,
  disabled = false,
}: { data: ExerciseDraft[]; options: ExerciseOptions } & TableMeta &
  CatalogueFilterStateProps &
  Partial<
    Pick<ExerciseGridEditorProps, 'renderBulkEditor' | 'renderToolbar'>
  >) {
  const tableData = useMemo(() => {
    const equipment = new Map(
      options.equipment.map((item) => [item.id, item.name]),
    );
    const muscleOptions = (ids: number[]) =>
      options.muscles.filter((muscle) => ids.includes(muscle.id));

    return data.map((row) => ({
      ...row,
      equipmentName: equipment.get(row.equipmentId) ?? '',
      primaryMuscles: muscleOptions(row.primaryMuscleIds),
      secondaryMuscles: muscleOptions(row.secondaryMuscleIds),
      movementPatterns: options.movementPatterns.filter((pattern) =>
        row.movementPatternIds.includes(pattern.id),
      ),
    }));
  }, [data, options]);
  const table = useTable({
    features,
    columns: renderBulkEditor ? editableColumns : columns,
    data: tableData,
    meta: { renderField, renderActions, disabled },
    state: { columnFilters },
    onColumnFiltersChange,
    enableRowSelection: renderBulkEditor !== undefined && !disabled,
    getRowId: (row) => row.clientId,
    initialState: {
      columnVisibility: {
        equipmentId: false,
        primaryMuscleIds: false,
        gripOrientationFilter: false,
        gripWidthFilter: false,
      },
      sorting: renderField ? [{ id: 'id', desc: false }] : [],
    },
    enableMultiSort: false,
    sortDescFirst: false,
  });
  const rows = table.getRowModel().rows;
  const selectedClientIds = table
    .getGroupedSelectedRowModel()
    .rows.map((row) => row.id);
  const bulkEditor = renderBulkEditor?.(selectedClientIds, () =>
    table.resetRowSelection(true),
  );

  return (
    <div className="@container/catalogue w-full max-w-full min-w-0 space-y-4">
      {(renderToolbar ?? renderBulkEditor) && (
        <div className="bg-card sticky top-0 z-10 min-w-0 space-y-3 py-2">
          {renderToolbar ?
            renderToolbar(selectedClientIds, bulkEditor)
          : bulkEditor}
        </div>
      )}
      <CatalogueFilters
        table={table}
        columnFilters={columnFilters}
        options={options}
        disabled={disabled}
      />
      <div className="isolate min-w-0 overflow-hidden rounded-md border [&>[data-slot=table-container]]:max-h-[60vh] [&>[data-slot=table-container]]:overflow-x-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:overscroll-contain">
        <Table
          role="table"
          className="block w-full table-fixed @5xl/catalogue:table [&_[data-slot=badge]]:h-auto [&_[data-slot=badge]]:max-w-full [&_[data-slot=badge]]:[overflow-wrap:anywhere] [&_[data-slot=badge]]:whitespace-normal"
        >
          <TableCaption className="sr-only">Exercises</TableCaption>
          <TableHeader
            role="rowgroup"
            className="bg-card sticky top-0 z-10 block @5xl/catalogue:table-header-group"
          >
            {table.getHeaderGroups().map((group) => (
              <TableRow
                key={group.id}
                role="row"
                className="flex flex-wrap items-center gap-2 p-2 @5xl/catalogue:table-row @5xl/catalogue:p-0"
              >
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    role="columnheader"
                    className={cn(
                      'flex h-auto min-w-0 items-center gap-2 [overflow-wrap:anywhere] whitespace-normal @5xl/catalogue:table-cell @5xl/catalogue:h-10',
                      renderField &&
                        header.column.id !== 'selection' &&
                        '@max-5xl/catalogue:sr-only',
                      header.column.columnDef.meta?.className,
                    )}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === 'asc' ? 'ascending'
                      : header.column.getIsSorted() === 'desc' ?
                        'descending'
                      : 'none'
                    }
                  >
                    {header.isPlaceholder ?
                      null
                    : renderField === undefined && header.column.getCanSort() ?
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto min-h-7 max-w-full min-w-0 justify-start px-0 text-left [overflow-wrap:anywhere] whitespace-normal"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {header.column.getIsSorted() === 'asc' ?
                          <ArrowUp aria-hidden="true" />
                        : header.column.getIsSorted() === 'desc' ?
                          <ArrowDown aria-hidden="true" />
                        : <ArrowUpDown aria-hidden="true" />}
                      </Button>
                    : <table.FlexRender header={header} />}
                    {header.column.id === 'selection' && (
                      <span className="@5xl/catalogue:hidden">Select all</span>
                    )}
                  </TableHead>
                ))}
                {renderActions && (
                  <TableHead
                    role="columnheader"
                    scope="col"
                    className="whitespace-normal @max-5xl/catalogue:sr-only @5xl/catalogue:w-24"
                  >
                    Actions
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            role="rowgroup"
            className="block @5xl/catalogue:table-row-group"
          >
            {rows.length > 0 ?
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  role="row"
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="even:bg-muted/20 hover:bg-muted/60 focus-within:bg-muted/60 data-[state=selected]:bg-primary/10 data-[state=selected]:hover:bg-primary/15 grid grid-cols-1 @sm/catalogue:grid-cols-2 @2xl/catalogue:grid-cols-3 @5xl/catalogue:table-row"
                >
                  {row.getVisibleCells().map((cell) => {
                    const field = cell.column.columnDef.meta?.field;
                    const changed =
                      field ? isFieldChanged?.(row.index, field) : false;
                    return (
                      <TableCell
                        key={cell.id}
                        role="cell"
                        data-changed={changed}
                        title={changed ? 'Unsaved change' : undefined}
                        className={cn(
                          'block min-w-0 align-top [overflow-wrap:anywhere] whitespace-normal data-[changed=true]:bg-amber-50 data-[changed=true]:shadow-[inset_2px_0_0_var(--color-amber-400)] @5xl/catalogue:table-cell dark:data-[changed=true]:bg-amber-400/10',
                          cell.column.columnDef.meta?.className,
                        )}
                      >
                        <span className="text-muted-foreground mb-1 block text-xs font-medium @5xl/catalogue:hidden">
                          {typeof cell.column.columnDef.header === 'string' ?
                            cell.column.columnDef.header
                          : 'Select'}
                        </span>
                        {changed && (
                          <span className="sr-only">Unsaved change. </span>
                        )}
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    );
                  })}
                  {renderActions && (
                    <TableCell
                      role="cell"
                      className="block min-w-0 align-top whitespace-normal @5xl/catalogue:table-cell @5xl/catalogue:w-24"
                    >
                      <span className="text-muted-foreground mb-1 block text-xs font-medium @5xl/catalogue:hidden">
                        Actions
                      </span>
                      {table.options.meta?.renderActions?.(row.index, () =>
                        row.toggleSelected(false),
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            : <TableRow role="row" className="block @5xl/catalogue:table-row">
                <TableCell
                  role="cell"
                  colSpan={
                    table.getVisibleLeafColumns().length +
                    (renderActions ? 1 : 0)
                  }
                  className="text-muted-foreground block h-24 text-center whitespace-normal @5xl/catalogue:table-cell"
                >
                  {columnFilters.length > 0 ?
                    'No exercises match these filters.'
                  : renderField ?
                    'Add a row to start building the catalogue.'
                  : 'No exercises loaded.'}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ExercisesTable({
  data = emptyData,
  options,
}: ExercisesTableProps) {
  const [editing, setEditing] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const drafts = useMemo(
    () =>
      data.map((exercise) => ({
        clientId: `exercise-${exercise.id}`,
        id: exercise.id,
        name: exercise.name,
        equipmentId: exercise.equipment.id,
        gripOrientation: exercise.gripOrientation,
        gripWidth: exercise.gripWidth,
        isUnilateral: exercise.isUnilateral,
        mechanics: exercise.mechanics,
        movementPatternIds: exercise.movementPatterns
          .map(({ id }) => id)
          .sort((a, b) => a - b),
        primaryMuscleIds: exercise.muscles
          .filter(({ role }) => role === 'primary')
          .map(({ id }) => id)
          .sort((a, b) => a - b),
        secondaryMuscleIds: exercise.muscles
          .filter(({ role }) => role === 'secondary')
          .map(({ id }) => id)
          .sort((a, b) => a - b),
      })),
    [data],
  );

  if (editing) {
    return (
      <ExerciseEditor
        data={drafts}
        options={options}
        onCancel={() => setEditing(false)}
      >
        {(editor) => (
          <CatalogueTable
            {...editor}
            options={options}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
          />
        )}
      </ExerciseEditor>
    );
  }

  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => setEditing(true)}>
        Edit catalogue
      </Button>
      <CatalogueTable
        data={drafts}
        options={options}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
    </div>
  );
}
