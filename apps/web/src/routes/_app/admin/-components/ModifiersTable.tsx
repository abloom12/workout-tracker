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

type ModifierRow = {
  id: number;
  code: string;
  name: string;
  valueKind: 'weight' | 'duration' | 'none';
};

type ModifiersTableProps = { data?: ModifierRow[] };

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});
const columnHelper = createColumnHelper<typeof features, ModifierRow>();
const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('code', { header: 'Code' }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('valueKind', { header: 'Value kind' }),
]);
const emptyData: ModifierRow[] = [];

export function ModifiersTable({ data = emptyData }: ModifiersTableProps) {
  const table = useTable({
    features,
    columns,
    data,
    getRowId: (row) => row.id.toString(),
    enableMultiSort: false,
    sortDescFirst: false,
  });
  const rows = table.getRowModel().rows;

  return (
    <Table>
      <TableCaption className="sr-only">Modifiers</TableCaption>
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
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length > 0 ?
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        : <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-muted-foreground h-24 text-center"
            >
              No modifiers loaded.
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
}
