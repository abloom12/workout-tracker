import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ExerciseRow = { id: number; code: string; name: string };

type ExercisesTableProps = { data?: ExerciseRow[] };

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, ExerciseRow>();
const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('code', { header: 'Code' }),
  columnHelper.accessor('name', { header: 'Name' }),
]);
const emptyData: ExerciseRow[] = [];

export function ExercisesTable({ data = emptyData }: ExercisesTableProps) {
  const table = useTable({
    features,
    columns,
    data,
    getRowId: (row) => row.id.toString(),
  });
  const rows = table.getRowModel().rows;

  return (
    <Table>
      <TableCaption className="sr-only">Exercises</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan} scope="col">
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
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
              No exercises loaded.
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
}
