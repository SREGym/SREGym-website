"use client";

import { liteLeaderboardData } from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { runColumns } from "../leaderboard/components/run-columns";
import { DataTable } from "../leaderboard/components/data-table";

export function LeaderboardPreview() {
  const topResults = [...liteLeaderboardData]
    .sort((a, b) => b.e2ePct - a.e2ePct)
    .slice(0, 5)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="space-y-1 text-center font-mono">
        <h2 className="text-xl font-semibold tracking-tight">
          SREGym-Lite results
        </h2>
        <p className="text-muted-foreground text-sm">
          Top results on curated 20-fault cohort.
        </p>
      </div>
      <div className="w-full max-w-6xl">
        <DataTable
          columns={runColumns}
          data={topResults}
          initialSort={{ id: "rank", desc: false }}
          columnVisibility={{ noise: false }}
        />
      </div>
      <Link
        href="/leaderboard"
        className={cn(
          "font-mono",
          buttonVariants({
            variant: "secondary",
            size: "xl",
            className: "rounded-none",
          }),
        )}
      >
        view all results ↗
      </Link>
    </div>
  );
}
