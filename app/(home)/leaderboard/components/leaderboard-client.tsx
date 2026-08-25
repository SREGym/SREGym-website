"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, TableIcon } from "lucide-react";
import {
  LeaderboardBenchmark,
  RunEntry,
  RankedRunEntry,
} from "@/lib/leaderboard-data";
import Link from "next/link";
import { runColumns } from "./run-columns";
import { DataTable } from "./data-table";
import { LeaderboardChart } from "./leaderboard-chart";

type NoiseFilter = "all" | "clean" | "noisy";
type View = "table" | "chart";

const filterOptions: { value: NoiseFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clean", label: "clean" },
  { value: "noisy", label: "with noises" },
];

function rankByE2E(entries: RunEntry[]): RankedRunEntry[] {
  return [...entries]
    .sort((a, b) => b.e2ePct - a.e2ePct)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function LeaderboardClient({
  benchmarks,
}: {
  benchmarks: LeaderboardBenchmark[];
}) {
  const [benchmarkId, setBenchmarkId] = React.useState(benchmarks[0]?.id ?? "");
  const [noiseFilter, setNoiseFilter] = React.useState<NoiseFilter>("all");
  const [view, setView] = React.useState<View>("table");

  const benchmark =
    benchmarks.find((entry) => entry.id === benchmarkId) ?? benchmarks[0];

  const ranked = React.useMemo(() => {
    if (!benchmark) return [];

    let filtered: RunEntry[];
    if (!benchmark.supportsNoise || noiseFilter === "clean") {
      filtered = benchmark.entries.filter((r) => !r.noise);
    } else if (noiseFilter === "noisy") {
      filtered = benchmark.entries.filter((r) => r.noise);
    } else {
      filtered = benchmark.entries;
    }
    return rankByE2E(filtered);
  }, [benchmark, noiseFilter]);

  if (!benchmark) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 font-mono text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-muted-foreground w-24 shrink-0 text-xs tracking-wide uppercase">
            Variant
          </span>
          <div
            className="flex max-w-full gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Variant"
          >
            {benchmarks.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={benchmark.id === entry.id}
                onClick={() => {
                  setBenchmarkId(entry.id);
                  setNoiseFilter("all");
                }}
                className={cn(
                  "shrink-0 rounded-none border px-3 py-1.5 transition-colors",
                  benchmark.id === entry.id
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-muted-foreground w-24 shrink-0 text-xs tracking-wide uppercase">
              Environment
            </span>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Environment"
            >
              {benchmark.supportsNoise ? (
                filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={noiseFilter === opt.value}
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
                ))
              ) : (
                <span className="bg-foreground text-background border-foreground border px-3 py-1">
                  clean
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView(view === "table" ? "chart" : "table")}
            className={cn(
              "border p-2 transition-colors",
              "border-border text-muted-foreground hover:text-foreground",
            )}
            title={view === "table" ? "Show chart" : "Show table"}
            aria-label={view === "table" ? "Show chart" : "Show table"}
          >
            {view === "table" ? (
              <BarChart3 className="size-4" />
            ) : (
              <TableIcon className="size-4" />
            )}
          </button>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>{benchmark.summary}</span>
          {benchmark.cohortHref && (
            <Link
              href={benchmark.cohortHref}
              className="text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline"
            >
              View cohort
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {view === "table" ? (
        <DataTable
          columns={runColumns}
          data={ranked}
          initialSort={{ id: "rank", desc: false }}
          columnVisibility={{ noise: benchmark.supportsNoise }}
        />
      ) : (
        <LeaderboardChart data={ranked} />
      )}
    </div>
  );
}
