"use client";

import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export type LiteCohortProblemItem = {
  id: string;
  hasDetails: boolean;
};

export function LiteCohortProblemList({
  problems,
}: {
  problems: LiteCohortProblemItem[];
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

      <section className="bg-card border">
        {filteredProblems.length > 0 ? (
          <ul className="divide-y">
            {filteredProblems.map((problem) => (
              <li key={problem.id} className="px-4 py-3">
                {problem.hasDetails ? (
                  <Link
                    href={`/problems/${problem.id}`}
                    className="group flex items-start justify-between gap-2 font-mono text-sm hover:underline"
                  >
                    <span className="min-w-0 break-all">{problem.id}</span>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-foreground mt-0.5 size-3.5 shrink-0" />
                  </Link>
                ) : (
                  <span
                    className="text-muted-foreground block font-mono text-sm break-all"
                    title="No detail page in the current problem catalog"
                  >
                    {problem.id}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground px-4 py-8 text-center font-mono text-sm">
            No matching faults
          </p>
        )}
      </section>
    </div>
  );
}
