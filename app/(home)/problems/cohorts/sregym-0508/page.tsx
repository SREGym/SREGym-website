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
import { getSregym0508Problems } from "@/lib/cohort-data";
import { getDefaultTasks } from "@/lib/problems-data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CohortProblemList } from "./components/cohort-problem-list";

export const metadata: Metadata = {
  title: "SREGym-0508 Cohort",
  description: "The 90-fault cohort used for SREGym-0508 leaderboard results.",
};

export default async function Sregym0508CohortPage() {
  const [cohortProblems, catalogTasks] = await Promise.all([
    getSregym0508Problems(),
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
              <BreadcrumbPage>SREGym-0508</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-4xl tracking-tighter">
                SREGym-0508 Cohort
              </h1>
              <Badge variant="secondary" className="font-mono">
                90 faults
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl font-mono text-sm sm:text-base">
              The exact fault cohort used for the SREGym-0508 leaderboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-none font-mono">
              <Link href="/leaderboard">
                <ArrowLeft />
                Leaderboard
              </Link>
            </Button>
            {/* <Button asChild variant="outline" className="rounded-none font-mono">
              <a href="/data/sregym-0508-problems.csv" download>
                <Download />
                Download CSV
              </a>
            </Button> */}
          </div>
        </div>

        <CohortProblemList problems={problems} />
      </div>
    </div>
  );
}
