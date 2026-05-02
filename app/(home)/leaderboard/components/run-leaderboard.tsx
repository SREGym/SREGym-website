"use client";

import { RunEntry } from "../data";
import { runColumns } from "./run-columns";
import { DataTable } from "./data-table";

export function RunLeaderboard({
  rows,
  className,
}: {
  rows: RunEntry[];
  className?: string;
}) {
  return (
    <DataTable columns={runColumns} data={rows} className={className} />
  );
}
