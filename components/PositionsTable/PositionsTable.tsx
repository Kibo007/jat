"use client";
import { Position } from "@/types/common";
import { Columns } from "./Columns";
import { DataTable } from "./DataTable";

interface PositionsTableProp {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProp) {
  return <DataTable columns={Columns} data={positions}></DataTable>;
}
