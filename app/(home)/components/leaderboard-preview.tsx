"use client";

import {
  liteLeaderboardData,
  rankLeaderboardEntries,
  LITE_EVALUATION_NOTE,
  THIRD_PARTY_SUBMISSION_NOTE,
} from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { runColumns } from "../leaderboard/components/run-columns";
import { DataTable } from "../leaderboard/components/data-table";

export function LeaderboardPreview() {
  const topResults = rankLeaderboardEntries(liteLeaderboardData).slice(0, 5);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="space-y-1 text-center font-mono">
        <h2 className="text-xl font-semibold tracking-tight">
          SREGym-Lite-1004 results
        </h2>
        <p className="text-muted-foreground text-sm">
          Top results on the curated 17-fault cohort.
        </p>
      </div>
      <div className="w-full max-w-6xl">
        <DataTable
          columns={runColumns}
          data={topResults}
          initialSort={{ id: "rank", desc: false }}
          columnVisibility={{ noise: false }}
          footnote={[
            LITE_EVALUATION_NOTE,
            topResults.some((entry) => entry.thirdParty)
              ? THIRD_PARTY_SUBMISSION_NOTE
              : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
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
