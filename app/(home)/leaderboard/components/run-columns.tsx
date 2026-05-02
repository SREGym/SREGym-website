"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { RunEntry } from "../data";

function BestInColumn({ value, isBest }: { value: string; isBest: boolean }) {
  return <span className={isBest ? "font-bold" : ""}>{value}</span>;
}

function SortableHeader({
  column,
  label,
  tooltip,
}: {
  column: Column<RunEntry, unknown>;
  label: string;
  tooltip?: string;
}) {
  const sorted = column.getIsSorted();
  const icon =
    sorted === "asc" ? (
      <ArrowUp className="ml-1 inline size-3" />
    ) : sorted === "desc" ? (
      <ArrowDown className="ml-1 inline size-3" />
    ) : (
      <ArrowUpDown className="ml-1 inline size-3 opacity-40" />
    );

  const button = (
    <button
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {icon}
    </button>
  );

  if (!tooltip) return button;

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent className="font-mono text-sm/relaxed">
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );
}

export const runColumns: ColumnDef<RunEntry>[] = [
  {
    accessorKey: "agent",
    header: ({ column }) => <SortableHeader column={column} label="Agent" />,
  },
  {
    accessorKey: "model",
    header: ({ column }) => <SortableHeader column={column} label="Model" />,
  },
  {
    accessorKey: "noise",
    header: "Noise",
    cell: ({ row }) => (row.original.noise ? "✓" : "✗"),
  },
  {
    id: "diagPct",
    accessorKey: "diagPct",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Diag. (%)"
        tooltip="Diagnosis success rate: whether the agent correctly identifies the root cause, scored via LLM-as-a-Judge with a threshold of 0.7."
      />
    ),
    cell: ({ row, table }) => {
      const val = row.original.diagPct;
      const best = Math.max(
        ...table.getRowModel().rows.map((r) => r.original.diagPct),
      );
      return <BestInColumn value={val.toFixed(1)} isBest={val === best} />;
    },
  },
  {
    id: "mitPct",
    accessorKey: "mitPct",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Mit. (%)"
        tooltip="Mitigation success rate: whether the agent successfully mitigated the incident, verified by the mitigation oracle."
      />
    ),
    cell: ({ row, table }) => {
      const val = row.original.mitPct;
      const best = Math.max(
        ...table.getRowModel().rows.map((r) => r.original.mitPct),
      );
      return <BestInColumn value={val.toFixed(1)} isBest={val === best} />;
    },
  },
  {
    id: "e2ePct",
    accessorKey: "e2ePct",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="E2E (%)"
        tooltip="End-to-end success: requires both correct diagnosis and correct mitigation on the same run."
      />
    ),
    cell: ({ row, table }) => {
      const val = row.original.e2ePct;
      const best = Math.max(
        ...table.getRowModel().rows.map((r) => r.original.e2ePct),
      );
      return <BestInColumn value={val.toFixed(1)} isBest={val === best} />;
    },
  },
  {
    id: "ttdSeconds",
    accessorKey: "ttdSeconds",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="TTD (s)"
        tooltip="Time-to-diagnose: mean seconds to produce a diagnosis."
      />
    ),
    cell: ({ row, table }) => {
      const val = row.original.ttdSeconds;
      const best = Math.min(
        ...table.getRowModel().rows.map((r) => r.original.ttdSeconds),
      );
      return <BestInColumn value={val.toFixed(1)} isBest={val === best} />;
    },
  },
  {
    id: "ttmSeconds",
    accessorKey: "ttmSeconds",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="TTM (s)"
        tooltip="Time-to-mitigate: mean seconds to mitigate the incident."
      />
    ),
    cell: ({ row, table }) => {
      const val = row.original.ttmSeconds;
      const best = Math.min(
        ...table.getRowModel().rows.map((r) => r.original.ttmSeconds),
      );
      return <BestInColumn value={val.toFixed(1)} isBest={val === best} />;
    },
  },
  {
    accessorKey: "tokens",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Tokens"
        tooltip="Mean token usage per problem run."
      />
    ),
  },
];
