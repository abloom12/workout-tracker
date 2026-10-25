import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  createSortedRowModel,
  metaHelper,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  ExerciseGridEditorProps,
  ExerciseOptions,
  ExerciseRow,
} from './SetupEditor';
import { ExerciseEditor } from './SetupEditor';

type ExercisesTableProps = { data?: ExerciseRow[]; options: ExerciseOptions };
type ExerciseTableRow = ExerciseDraft & {
  equipmentName: string;
  primaryMuscles: string;
  secondaryMuscles: string;
};
type TableMeta = Partial<
  Pick<ExerciseGridEditorProps, 'renderField' | 'renderActions' | 'disabled'>
>;

type ColumnMeta = { editClassName?: string };

const features = tableFeatures({
  columnMeta: metaHelper<ColumnMeta>(),
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  tableMeta: metaHelper<TableMeta>(),
});
const columnHelper = createColumnHelper<typeof features, ExerciseTableRow>();
const columns = columnHelper.columns([
  columnHelper.accessor((row) => row.id ?? undefined, {
    id: 'id',
    header: 'ID',
    sortUndefined: 'last',
    cell: ({ cell }) => cell.getValue() ?? 'New',
  }),
  columnHelper.accessor('code', {
    header: 'Code',
    // Code is content-sized; add 100px beyond the normal cell padding.
    meta: { editClassName: 'pr-[calc(0.5rem_+_100px)]' },
    cell: ({ cell }) => cell.getValue() || 'Generated on save',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    // Let Name absorb spare table width rather than distributing it to Equipment.
    meta: { editClassName: 'w-full' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'name') ?? cell.getValue(),
  }),
  columnHelper.accessor('equipmentName', {
    header: 'Equipment',
    meta: { editClassName: 'w-[210px] max-w-[210px] min-w-[210px]' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'equipmentId') ??
      cell.getValue(),
  }),
  columnHelper.accessor('primaryMuscles', {
    header: 'Primary muscles',
    meta: { editClassName: 'w-[226px] max-w-[226px] min-w-[226px]' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'primaryMuscleIds') ??
      cell.getValue(),
  }),
  columnHelper.accessor('secondaryMuscles', {
    header: 'Secondary muscles',
    meta: { editClassName: 'w-[226px] max-w-[226px] min-w-[226px]' },
    cell: ({ row, table, cell }) =>
      table.options.meta?.renderField?.(row.index, 'secondaryMuscleIds') ??
      cell.getValue(),
  }),
]);
const editableColumns = columnHelper.columns([
  columnHelper.display({
    id: 'selection',
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all exercises"
        checked={
          table.getIsAllRowsSelected() ? true
          : table.getIsSomeRowsSelected() ?
            'indeterminate'
          : false
        }
        disabled={
          (table.options.meta?.disabled ?? false) ||
          table.getCoreRowModel().rows.length === 0
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

function CatalogueTable({
  data,
  options,
  renderField,
  renderActions,
  renderBulkEditor,
  disabled = false,
}: { data: ExerciseDraft[]; options: ExerciseOptions } & TableMeta &
  Partial<Pick<ExerciseGridEditorProps, 'renderBulkEditor'>>) {
  const tableData = useMemo(() => {
    const equipment = new Map(
      options.equipment.map((item) => [String(item.id), item.name]),
    );
    const muscleNames = (ids: number[]) =>
      options.muscles
        .filter((muscle) => ids.includes(muscle.id))
        .map((muscle) => muscle.name)
        .join(', ') || 'None';

    return data.map((row) => ({
      ...row,
      equipmentName: equipment.get(row.equipmentId) ?? '',
      primaryMuscles: muscleNames(row.primaryMuscleIds),
      secondaryMuscles: muscleNames(row.secondaryMuscleIds),
    }));
  }, [data, options]);
  const table = useTable({
    features,
    columns: renderBulkEditor ? editableColumns : columns,
    data: tableData,
    meta: { renderField, renderActions, disabled },
    enableRowSelection: renderBulkEditor !== undefined && !disabled,
    getRowId: (row) => row.clientId,
    initialState:
      renderField ? { sorting: [{ id: 'id', desc: false }] } : undefined,
    enableMultiSort: false,
    sortDescFirst: false,
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {renderBulkEditor?.(
        table.getSelectedRowModel().rows.map((row) => row.id),
        () => table.resetRowSelection(true),
      )}
      <Table>
        <TableCaption className="sr-only">Exercises</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    renderField ?
                      header.column.columnDef.meta?.editClassName
                    : undefined
                  }
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
                      className="-ml-2.5"
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
                </TableHead>
              ))}
              {renderActions && <TableHead scope="col">Actions</TableHead>}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ?
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'align-top',
                      renderField && cell.column.columnDef.meta?.editClassName,
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell className="align-top">
                    {table.options.meta?.renderActions?.(row.index, () =>
                      row.toggleSelected(false),
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          : <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length + (renderActions ? 1 : 0)}
                className="text-muted-foreground h-24 text-center"
              >
                {renderField ?
                  'Add a row to start building the catalogue.'
                : 'No exercises loaded.'}
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </div>
  );
}

export function ExercisesTable({
  data = emptyData,
  options,
}: ExercisesTableProps) {
  const [editing, setEditing] = useState(false);
  const drafts = useMemo(
    () =>
      data.map((exercise) => ({
        clientId: `exercise-${exercise.id}`,
        id: exercise.id,
        code: exercise.code,
        name: exercise.name,
        equipmentId: String(exercise.equipment.id),
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
        onSaved={() => setEditing(false)}
        onCancel={() => setEditing(false)}
      >
        {(editor) => <CatalogueTable {...editor} options={options} />}
      </ExerciseEditor>
    );
  }

  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => setEditing(true)}>
        Edit catalogue
      </Button>
      <CatalogueTable data={drafts} options={options} />
    </div>
  );
}
