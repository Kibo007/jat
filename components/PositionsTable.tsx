"use client";

import * as React from "react";

import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseISO, format } from "date-fns";
import { ArrowUpDown, MinusIcon } from "lucide-react";
import { AddPositionDialog } from "./AddPositionDialog/AddPositionDialog";
import Link from "next/link";
import { onDeleteAction } from "@/actions/deletePosition";
import { useToast } from "./ui/use-toast";
import { PositionStatus } from "@/types/common";
import { onUpdateStatus } from "@/actions/updatePosition";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { POSITION_STATUS } from "@/utils/supabase/constants";

export const columns: ColumnDef<Position>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: "Datum",
    cell: ({ row }) => {
      const createdAt = parseFloat(row.getValue("createdAt"));
      const date = parseISO(createdAt.toString());
      return (
        <time className="text-right font-medium" dateTime={date.toString()}>
          {format(date, "LLLL d, yyyy")}
        </time>
      );
    },
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "positionUrl",
    header: "Position url",
    cell: ({ row }) => {
      const link = row.getValue("positionUrl");
      return (
        <Link href={row.getValue("positionUrl")} target="_blank">
          link
        </Link>
      );
    },
  },
  {
    accessorKey: "hourlyRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hourly rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("hourlyRate"));

      const formatted = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const position = row.original;

      return (
        <div>
          <Select
            defaultValue={position.status}
            onValueChange={(status) => {
              onUpdateStatus(position.id, status as PositionStatus);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select postion status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {POSITION_STATUS.map((status) => {
                  return (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [isPending, startTransition] = React.useTransition();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const { toast } = useToast();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const applyFilter = (value: string) => {
    setFilterValue(value);
    table.setGlobalFilter(value);
  };

  const selectedRow = table.getFilteredSelectedRowModel().rows;

  const handleDelete = () => {
    startTransition(async () => {
      const selectedRows = table.getSelectedRowModel();
      const rowIds: number[] = selectedRows.rows.map((row) => {
        const item = row.original as Position;
        return item.id;
      });
      const response = await onDeleteAction(rowIds);

      if (response.message === "success") {
        setRowSelection({});
        toast({
          title: `Position${rowIds.length > 1 ? "s" : ""} successfuly deleted`,
        });
      }
    });
  };

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search..."
            value={filterValue}
            onChange={(event) => applyFilter(event.target.value)}
            className="max-w-sm mr-2"
          />

          {selectedRow.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <MinusIcon className="mr-2" /> Delete
            </Button>
          )}
        </div>

        <AddPositionDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export type Position = {
  company: string;
  contact: string;
  createdAt: string;
  description: string;
  hourlyRate: number;
  id: number;
  jobTitle: string;
  location: string;
  positionUrl: string;
  status: PositionStatus;
};

interface PositionsTableProp {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProp) {
  return <DataTable columns={columns} data={positions}></DataTable>;
}
