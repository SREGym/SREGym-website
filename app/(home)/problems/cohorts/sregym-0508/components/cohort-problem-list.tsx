"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type CohortCategory = "Ported" | "Similar Failures" | "New Failures";

export type CohortProblemItem = {
  id: string;
  category: CohortCategory;
  hasDetails: boolean;
};

const CATEGORY_ORDER: CohortCategory[] = [
  "Ported",
  "Similar Failures",
  "New Failures",
];

export function CohortProblemList({
  problems,
}: {
  problems: CohortProblemItem[];
}) {
  const [query, setQuery] = useState("");

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return problems;

    return problems.filter((problem) =>
      problem.id.toLowerCase().includes(normalizedQuery),
    );
  }, [problems, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search fault IDs"
            className="rounded-none pl-9 font-mono"
            aria-label="Search cohort fault IDs"
          />
        </div>
        <p className="text-muted-foreground font-mono text-sm">
          Showing {filteredProblems.length} of {problems.length} faults
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        {CATEGORY_ORDER.map((category) => {
          const categoryProblems = filteredProblems.filter(
            (problem) => problem.category === category,
          );
          const totalInCategory = problems.filter(
            (problem) => problem.category === category,
          ).length;

          return (
            <section key={category} className="border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-mono font-medium">{category}</h2>
                <Badge variant="secondary" className="font-mono">
                  {categoryProblems.length === totalInCategory
                    ? totalInCategory
                    : `${categoryProblems.length}/${totalInCategory}`}
                </Badge>
              </div>

              {categoryProblems.length > 0 ? (
                <ul className="divide-y">
                  {categoryProblems.map((problem) => (
                    <li key={problem.id} className="px-4 py-3">
                      {problem.hasDetails ? (
                        <Link
                          href={`/problems/${problem.id}`}
                          className="group flex items-start justify-between gap-2 font-mono text-sm hover:underline"
                        >
                          <span className="min-w-0 break-all">{problem.id}</span>
                          <ArrowUpRight className="text-muted-foreground mt-0.5 size-3.5 shrink-0 group-hover:text-foreground" />
                        </Link>
                      ) : (
                        <span
                          className="text-muted-foreground block break-all font-mono text-sm"
                          title="No detail page in the current problem catalog"
                        >
                          {problem.id}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground px-4 py-6 text-center font-mono text-sm">
                  No matching faults
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
