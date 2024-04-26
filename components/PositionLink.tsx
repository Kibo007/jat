"use client";

import { Position } from "@/types/common";
import Link from "next/link";

export default function PositionLink(
  positon: Pick<Position, "company" | "jobTitle" | "id">
) {
  return (
    <Link href={`${positon.id.toString()}`} className="flex flex-col p-4">
      <h3>{positon.jobTitle}</h3>
      <span className="text-slate-600">{positon.company}</span>
    </Link>
  );
}
