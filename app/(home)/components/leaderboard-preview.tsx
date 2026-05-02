import { runLeaderboardData } from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RANK_COLORS } from "@/lib/constants";

export function LeaderboardPreview() {
  const top3 = [...runLeaderboardData]
    .sort((a, b) => b.e2ePct - a.e2ePct);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <p className="font-mono text-sm text-muted-foreground">
        top agent performance
      </p>
      <div className="bg-card w-full max-w-2xl border font-mono">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 py-3 text-center">Rank</TableHead>
              <TableHead className="py-3">Agent</TableHead>
              <TableHead className="py-3">Model</TableHead>
              <TableHead className="py-3 text-right">
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <span className="cursor-help">E2E (%)</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="animate-none font-mono text-sm/relaxed">
                    End-to-end success: requires both correct diagnosis and
                    correct mitigation on the same run.
                  </HoverCardContent>
                </HoverCard>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top3.map((entry, i) => (
              <TableRow key={`${entry.agent}-${entry.model}-${entry.noise}`}>
                <TableCell className="text-center">
                  {i < 3 ? (
                    <span
                      className="inline-flex size-7 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: RANK_COLORS[i] }}
                    >
                      {i + 1}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{i + 1}</span>
                  )}
                </TableCell>
                <TableCell>{entry.agent}</TableCell>
                <TableCell>{entry.model}</TableCell>
                <TableCell className="text-right font-bold">
                  {entry.e2ePct}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        view full leaderboard ↗
      </Link>
    </div>
  );
}
