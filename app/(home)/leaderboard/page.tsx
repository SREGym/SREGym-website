import { runLeaderboardData } from "./data";
import { RunLeaderboard } from "./components/run-leaderboard";

export default async function LeaderboardPage() {
  const sorted = [...runLeaderboardData].sort(
    (a, b) => b.e2ePct - a.e2ePct,
  );

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6 sm:pt-12">
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h2 className="font-mono text-4xl tracking-tighter">
            SREGym Leaderboard
          </h2>
          <p className="text-muted-foreground mt-2 font-mono text-sm sm:text-base">
            Evaluating SRE agents on diagnosis, mitigation, and end-to-end
            incident resolution.
          </p>
        </div>
        <RunLeaderboard rows={sorted} />
      </div>
    </div>
  );
}
