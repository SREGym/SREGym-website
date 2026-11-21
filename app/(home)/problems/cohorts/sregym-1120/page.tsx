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
import { getSregym1120Problems } from "@/lib/cohort-data";
import { getDefaultTasks } from "@/lib/problems-data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LiteCohortProblemList } from "../components/lite-cohort-problem-list";

export const metadata: Metadata = {
  title: "SREGym-1120 Cohort",
  description:
    "The 85-fault noisy SREGym-1120 cohort: 70 retained faults and 15 Slack Spine and Saleor variants.",
  alternates: { canonical: "/problems/cohorts/sregym-1120" },
};

export default async function Sregym1120CohortPage() {
  const [cohortProblems, catalogTasks] = await Promise.all([
    getSregym1120Problems(),
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
              <BreadcrumbPage>SREGym-1120</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-4xl tracking-tighter">
                SREGym-1120 Cohort
              </h1>
              <Badge variant="secondary" className="font-mono">
                {problems.length} faults
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl font-mono text-sm sm:text-base">
              The noisy cohort retains 70 faults from{" "}
              <Link
                href="/problems/cohorts/sregym-0508"
                className="underline underline-offset-4"
              >
                SREGym-0508
              </Link>{" "}
              and adds 15 ported variants for Slack Spine and Saleor. The 20
              deprecated original faults are excluded.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-none font-mono">
            <Link href="/leaderboard">
              <ArrowLeft />
              Leaderboard
            </Link>
          </Button>
        </div>

        <LiteCohortProblemList problems={problems} />
      </div>
    </div>
  );
}
