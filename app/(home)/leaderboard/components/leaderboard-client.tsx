"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BarChart3, TableIcon } from "lucide-react";
import { RunEntry, RankedRunEntry } from "../data";
import { runColumns } from "./run-columns";
import { DataTable } from "./data-table";
import { LeaderboardChart } from "./leaderboard-chart";

type NoiseFilter = "all" | "clean" | "noisy";
type View = "table" | "chart";

const filterOptions: { value: NoiseFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clean", label: "Clean" },
  { value: "noisy", label: "Noisy" },
];

function rankByE2E(entries: RunEntry[]): RankedRunEntry[] {
  return [...entries]
    .sort((a, b) => b.e2ePct - a.e2ePct)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function LeaderboardClient({ data }: { data: RunEntry[] }) {
  const [noiseFilter, setNoiseFilter] = React.useState<NoiseFilter>("all");
  const [view, setView] = React.useState<View>("table");

  const ranked = React.useMemo(() => {
    let filtered: RunEntry[];
    if (noiseFilter === "clean") filtered = data.filter((r) => !r.noise);
    else if (noiseFilter === "noisy") filtered = data.filter((r) => r.noise);
    else filtered = data;
    return rankByE2E(filtered);
  }, [data, noiseFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-muted-foreground">Noise:</span>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setNoiseFilter(opt.value)}
              className={cn(
                "rounded-none border px-3 py-1 transition-colors",
                noiseFilter === opt.value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setView(view === "table" ? "chart" : "table")}
          className={cn(
            "border p-2 transition-colors",
            "border-border text-muted-foreground hover:text-foreground",
          )}
          title={view === "table" ? "Show chart" : "Show table"}
        >
          {view === "table" ? (
            <BarChart3 className="size-4" />
          ) : (
            <TableIcon className="size-4" />
          )}
        </button>
      </div>
      {view === "table" ? (
        <DataTable
          columns={runColumns}
          data={ranked}
          initialSort={{ id: "rank", desc: false }}
        />
      ) : (
        <LeaderboardChart data={ranked} />
      )}
    </div>
  );
}
