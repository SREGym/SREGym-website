import { GridItem } from "@/components/grid";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/lib/supabase/database.types";
import { Lock } from "lucide-react";
import { Fragment } from "react";
import { buildTaskGithubUrl } from "../lib/utils";
import { CopyButton } from "./copy-button";
import { FilterOrLink } from "./filter-or-link";
import { GithubLinkButton } from "./github-link-button";

type TaskCardProps = {
  task: Tables<"task"> & { registry: Tables<"registry"> };
  behavior?: "filter" | "navigate";
};

export function TaskCard({ task, behavior }: TaskCardProps) {
  return (
    <GridItem href={`/problems/${task.id}`}>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 py-6">
        <CardHeader className="min-w-0">
          <div className="mb-2 flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <CardTitle className="min-w-0 flex-1 overflow-hidden">
                <h2 className="truncate font-mono text-xl font-medium">
                  {task.id}
                </h2>
              </CardTitle>
              <div className="flex-shrink-0">
                <CopyButton text={task.id} successMessage="Copied task ID" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <GithubLinkButton
                githubUrl={buildTaskGithubUrl({
                  dataset: task.registry,
                  taskId: task.registry.is_encrypted ? `${task.id}.zip` : task.file_id,
                })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <FilterOrLink
              value={task.category}
              valuesName="categories"
              behavior={behavior}
            >
              <Badge
                variant="secondary"
                className="hover:bg-muted-foreground/15 font-mono transition-colors duration-200"
              >
                {task.category}
              </Badge>
            </FilterOrLink>
            {/* <FilterOrLink
              value={task.difficulty}
              valuesName="difficulties"
              behavior={behavior}
            >
              <Badge
                variant="secondary"
                className="hover:bg-muted-foreground/15 font-mono transition-colors duration-200"
              >
                {task.difficulty}
              </Badge>
            </FilterOrLink> */}
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between space-y-6">
          {task.registry.is_encrypted ? (
            <div className="bg-muted flex items-center gap-2 border p-2">
              <Lock
                className="text-muted-foreground size-3"
                strokeWidth={2.5}
              />
              <p className="text-muted-foreground font-mono text-sm sm:text-xs">
                Instruction encrypted.
              </p>
            </div>
          ) : (
            <p className="line-clamp-[10] font-mono wrap-anywhere whitespace-pre-wrap sm:text-sm">
              {task.description}
            </p>
          )}
          <div className="space-y-6">
            <p className="text-muted-foreground line-clamp-2 font-mono text-sm lowercase sm:text-xs">
              {task.tags.map((tag, index) => (
                <Fragment key={tag}>
                  <FilterOrLink
                    value={tag}
                    valuesName="tags"
                    className="cursor-default"
                    behavior={behavior}
                  >
                    <span className="hover:underline">{tag}</span>
                  </FilterOrLink>
                  {index < task.tags.length - 1 && ", "}
                </Fragment>
              ))}
            </p>
            {task.author_name !== "unknown" &&
              task.author_name !== "anonymous" && (
                <p className="text-muted-foreground font-mono text-sm sm:text-xs">
                  Created by {task.author_name}
                </p>
              )}
          </div>
        </CardContent>
      </div>
    </GridItem>
  );
}
