"use client";

import React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  initialSort?: { id: string; desc: boolean };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  initialSort,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSort ? [initialSort] : [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn("bg-card border-y font-mono md:border-x", className)}>
      <div className="overflow-x-auto">
        <Table className="min-w-[800px] [&_tr>td:first-child]:pl-6 [&_tr>td:last-child]:pr-6 [&_tr>th:first-child]:pl-6 [&_tr>th:last-child]:pr-6">
          <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="px-6 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="bg-card sticky top-0 z-10 py-4 text-base">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="px-6"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 text-base">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="px-6">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
      <div className="text-muted-foreground border-t px-6 py-4 text-xs leading-relaxed">
        <p>
          <span className="text-foreground">Diag.</span> Diagnosis success rate ·{" "}
          <span className="text-foreground">Mit.</span> Mitigation success rate ·{" "}
          <span className="text-foreground">E2E</span> End-to-end (both diagnosis and mitigation correct) ·{" "}
          <span className="text-foreground">TTD</span> Time-to-diagnose (seconds) ·{" "}
          <span className="text-foreground">TTM</span> Time-to-mitigate (seconds) ·{" "}
          <span className="text-foreground">Tokens</span> Mean token usage per run
        </p>
      </div>
    </div>
  );
}
