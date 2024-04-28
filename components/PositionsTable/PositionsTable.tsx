"use client";
import { Position } from "@/types/common";
import { Columns } from "./Columns";
import { DataTable } from "./DataTable";
import useIsMobile from "@/hooks/useIsMobile";

interface PositionsTableProp {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProp) {
  const isMobile = useIsMobile();
  console.log(positions);
  return <DataTable columns={Columns(isMobile)} data={positions}></DataTable>;
}
