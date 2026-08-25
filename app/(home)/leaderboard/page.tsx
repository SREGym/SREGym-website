import { leaderboardBenchmarks } from "@/lib/leaderboard-data";
import { LeaderboardClient } from "./components/leaderboard-client";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6 sm:pt-12">
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h2 className="font-mono text-4xl tracking-tighter">
            SREGym Leaderboard
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl font-mono text-sm sm:text-base">
            Comparing SRE agents across diagnosis, mitigation, and end-to-end
            incident resolution on SREGym. Ranked by E2E success rate, requiring
            both correct root-cause diagnosis and successful mitigation on the
            same run.
          </p>
        </div>
        <LeaderboardClient benchmarks={leaderboardBenchmarks} />
      </div>
    </div>
  );
}
