"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Claude from "@lobehub/icons/es/Claude";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Kimi from "@lobehub/icons/es/Kimi";
import { RankedRunEntry } from "../data";

function BestInColumn({ value, isBest }: { value: string; isBest: boolean }) {
  if (isBest) {
    return (
      <span className="font-bold underline decoration-2 underline-offset-4">
        {value}
      </span>
    );
  }
  return <span>{value}</span>;
}

function SortableHeader({
  column,
  label,
  tooltip,
}: {
  column: Column<RankedRunEntry, unknown>;
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
      className="cursor-pointer select-none whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {icon}
    </button>
  );

  if (!tooltip) return button;

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent className="animate-none font-mono text-sm/relaxed">
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );
}

const RANK_COLORS = [
  "#D6AF36", // gold
  "#A7A7AD", // silver
  "#A77044", // bronze
];

function ModelIcon({ model }: { model: string }) {
  const lower = model.toLowerCase();
  if (lower.includes("claude") || lower.includes("sonnet"))
    return <Claude.Avatar size={28} />;
  if (lower.includes("gpt") || lower.includes("codex"))
    return <OpenAI.Avatar size={28} background="#fff" color="#000" />;
  if (lower.includes("kimi"))
    return <Kimi.Avatar size={28} />;
  return null;
}

export const runColumns: ColumnDef<RankedRunEntry>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label="Rank"
        tooltip="Rank based on end-to-end (E2E) success rate within the current filter."
      />
    ),
    cell: ({ row }) => {
      const rank = row.original.rank;
      if (rank <= 3) {
        return (
          <div className="flex justify-center">
            <span
              className="inline-flex size-7 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: RANK_COLORS[rank - 1] }}
            >
              {rank}
            </span>
          </div>
        );
      }
      return <div className="text-muted-foreground text-center">{rank}</div>;
    },
  },
  {
    accessorKey: "agent",
    header: ({ column }) => <SortableHeader column={column} label="Agent" />,
  },
  {
    accessorKey: "model",
    header: ({ column }) => <SortableHeader column={column} label="Model" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="bg-white rounded-full border">
        <ModelIcon model={row.original.model} />
        </div>
        <span>{row.original.model}</span>
      </div>
    ),
  },
  {
    accessorKey: "noise",
    header: () => (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <span className="cursor-help opacity-80 hover:opacity-100 transition-opacity">
            Noise
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="animate-none font-mono text-sm/relaxed">
          Whether transient disturbances (e.g., a pod crashing and
          self-recovering) were injected alongside the target fault.
        </HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => (row.original.noise ? "Yes" : "No"),
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
