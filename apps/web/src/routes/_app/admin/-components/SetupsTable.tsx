import { useState } from 'react';
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SetupOptions, SetupRow } from './SetupEditor';
import { SetupEditor } from './SetupEditor';

type SetupsTableProps = { data?: SetupRow[]; options: SetupOptions };
type SetupEditorState =
  { kind: 'create' } | { kind: 'edit'; setup: SetupRow } | null;

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});
const columnHelper = createColumnHelper<typeof features, SetupRow>();
const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('code', { header: 'Code' }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('exercise.name', { header: 'Exercise' }),
  columnHelper.accessor('equipment.name', { header: 'Equipment' }),
  columnHelper.accessor('grip.name', { header: 'Grip' }),
  columnHelper.accessor(
    (row) => {
      if (row.attachmentRequired) return 'Required';
      return row.allowedAttachments.length > 0 ? 'Optional' : 'Unsupported';
    },
    { id: 'attachmentRequirement', header: 'Attachment selection' },
  ),
  columnHelper.accessor(
    (row) =>
      row.allowedAttachments.map((attachment) => attachment.name).join(', ') ||
      'None',
    { id: 'allowedAttachments', header: 'Allowed attachments' },
  ),
  columnHelper.accessor('loadConvention', { header: 'Loading convention' }),
  columnHelper.accessor('isUnilateral', {
    header: 'Unilateral',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
  }),
]);
const emptyData: SetupRow[] = [];

export function SetupsTable({ data = emptyData, options }: SetupsTableProps) {
  const [editor, setEditor] = useState<SetupEditorState>(null);
  const table = useTable({
    features,
    columns,
    data,
    getRowId: (row) => row.id.toString(),
    enableMultiSort: false,
    sortDescFirst: false,
  });
  const rows = table.getRowModel().rows;
  const editorForm = editor && (
    <SetupEditor
      key={editor.kind === 'edit' ? editor.setup.id : 'new'}
      setup={editor.kind === 'edit' ? editor.setup : undefined}
      options={options}
      onSaved={() => setEditor(null)}
      onCancel={() => setEditor(null)}
    />
  );

  return (
    <div className="space-y-4">
      <Button
        type="button"
        disabled={editor !== null}
        onClick={() => setEditor({ kind: 'create' })}
      >
        Add Setup
      </Button>
      <Table>
        <TableCaption className="sr-only">Exercise setups</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  scope="col"
                  aria-sort={
                    header.column.getIsSorted() === 'asc' ? 'ascending'
                    : header.column.getIsSorted() === 'desc' ?
                      'descending'
                    : 'none'
                  }
                >
                  {header.isPlaceholder ? null : (
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
                  )}
                </TableHead>
              ))}
              <TableHead scope="col">Actions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {editor?.kind === 'create' && (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="whitespace-normal"
              >
                {editorForm}
              </TableCell>
            </TableRow>
          )}
          {rows.length > 0 ?
            rows.map((row) => (
              <TableRow key={row.id}>
                {(
                  editor?.kind === 'edit' && editor.setup.id === row.original.id
                ) ?
                  <TableCell
                    colSpan={columns.length + 1}
                    className="whitespace-normal"
                  >
                    {editorForm}
                  </TableCell>
                : <>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={editor !== null}
                        aria-label={`Edit ${row.original.name}`}
                        onClick={() =>
                          setEditor({ kind: 'edit', setup: row.original })
                        }
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </>
                }
              </TableRow>
            ))
          : editor?.kind !== 'create' && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-muted-foreground h-24 text-center"
                >
                  No setups loaded.
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
}
