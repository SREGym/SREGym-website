import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSregymLite0720Problems } from "@/lib/cohort-data";
import { getDefaultTasks } from "@/lib/problems-data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LiteCohortProblemList } from "../components/lite-cohort-problem-list";

export const metadata: Metadata = {
  title: "SREGym-Lite-0720 Cohort (Archived)",
  description:
    "The archived 20-fault cohort used for SREGym-Lite-0720 leaderboard results.",
  alternates: { canonical: "/problems/cohorts/sregym-lite-0720" },
};

export default async function SregymLite0720CohortPage() {
  const [cohortProblems, catalogTasks] = await Promise.all([
    getSregymLite0720Problems(),
    getDefaultTasks(),
  ]);
  const catalogProblemIds = new Set(catalogTasks.map((task) => task.id));
  const problems = cohortProblems.map((problem) => ({
    ...problem,
    hasDetails: catalogProblemIds.has(problem.id),
  }));

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6 sm:pt-12">
      <div className="flex w-full max-w-7xl flex-1 flex-col">
        <Breadcrumb className="mb-6 hidden font-mono sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/leaderboard">Leaderboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>SREGym-Lite-0720</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-4xl tracking-tighter">
                SREGym-Lite-0720 Cohort
              </h1>
              <Badge variant="secondary" className="font-mono">
                20 faults
              </Badge>
              <Badge variant="outline" className="font-mono">
                Archived
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl font-mono text-sm sm:text-base">
              The previous fault cohort used for archived SREGym-Lite-0720
              results.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-none font-mono">
            <Link href="/leaderboard">
              <ArrowLeft />
              Current leaderboard
            </Link>
          </Button>
        </div>

        <LiteCohortProblemList problems={problems} />
      </div>
    </div>
  );
}
