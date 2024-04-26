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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, MinusIcon } from "lucide-react";
import { AddPositionDialog } from "../AddPositionDialog/AddPositionDialog";
import { onDeleteAction } from "@/actions/deletePosition";
import { useToast } from "../ui/use-toast";
import { Position } from "@/types/common";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useIsMobile from "@/hooks/useIsMobile";

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
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleOnRowClick = (id: number) => {
    router.push(`positions/${id.toString()}`);
  };

  React.useEffect(() => {
    if (isMobile) {
      table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
          if (!["jobTitle", "status"].includes(column.id)) {
            column.toggleVisibility(false);
          }
        });
    } else {
      table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
          if (!column.getIsVisible()) {
            column.toggleVisibility(true);
          }
        });
    }
  }, [isMobile, table]);

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

        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddPositionDialog />
        </div>
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
                  onClick={() => {
                    const item = row.original as Position;
                    handleOnRowClick(item.id);
                  }}
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
