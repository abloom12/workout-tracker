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

type SetupRow = {
  id: number;
  code: string;
  name: string;
  exercise: { name: string };
  equipment: { name: string };
  grip: { name: string };
  allowedAttachments: { name: string }[];
  attachmentRequired: boolean;
  loadConvention:
    'total_weight' | 'per_side' | 'added_to_bodyweight' | 'assisted';
  isUnilateral: boolean;
};

type SetupsTableProps = { data?: SetupRow[] };

const features = tableFeatures({});
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

export function SetupsTable({ data = emptyData }: SetupsTableProps) {
  const table = useTable({
    features,
    columns,
    data,
    getRowId: (row) => row.id.toString(),
  });
  const rows = table.getRowModel().rows;

  return (
    <Table>
      <TableCaption className="sr-only">Exercise setups</TableCaption>
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
              No setups loaded.
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
}
