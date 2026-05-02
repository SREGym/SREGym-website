"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RunEntry, RankedRunEntry } from "../data";
import { runColumns } from "./run-columns";
import { DataTable } from "./data-table";

type NoiseFilter = "all" | "clean" | "noisy";

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

  const ranked = React.useMemo(() => {
    let filtered: RunEntry[];
    if (noiseFilter === "clean") filtered = data.filter((r) => !r.noise);
    else if (noiseFilter === "noisy") filtered = data.filter((r) => r.noise);
    else filtered = data;
    return rankByE2E(filtered);
  }, [data, noiseFilter]);

  return (
    <div className="flex flex-col gap-4">
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
      <DataTable
        columns={runColumns}
        data={ranked}
        initialSort={{ id: "rank", desc: false }}
      />
    </div>
  );
}
