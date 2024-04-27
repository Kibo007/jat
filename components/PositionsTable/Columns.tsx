"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { parseISO, format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Position, PositionStatus } from "@/types/common";
import { onUpdateStatus } from "@/actions/updatePosition";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { POSITION_STATUS } from "@/utils/supabase/constants";
import { SelectStatus } from "./SelectStatus";

export const Columns = (isMobile: boolean): ColumnDef<Position>[] => [
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    ),
    enableSorting: false,
    enableHiding: true,
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
    cell: ({ row }) => {
      return (
        <p className="flex flex-col">
          <span>{row.getValue("jobTitle")}</span>
          {isMobile && (
            <span className="text-slate-600">{row.getValue("company")}</span>
          )}
        </p>
      );
    },
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

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const position = row.original;

      return (
        <div>
          <SelectStatus id={position.id} status={position.status} />
        </div>
      );
    },
  },
];
