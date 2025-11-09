import { CanaryString } from "@/components/canary-string";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDefaultTask } from "@/lib/problems-data";
import { notFound } from "next/navigation";
import { buildTaskGithubUrl } from "../lib/utils";
import { TaskDemo } from "./components/task-demo";
import { TaskDescription } from "./components/task-description";
import { TaskHeader } from "./components/task-header";
import { TaskTags } from "./components/task-tags";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Task({ params }: PageProps) {
  const { id } = await params;
  const task = await getDefaultTask(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6 sm:pt-12">
      <div className="flex w-full max-w-3xl flex-1 flex-col gap-6 font-mono">
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/problems">Problems</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TaskHeader
          id={id}
          githubUrl={buildTaskGithubUrl({
            dataset: task.registry,
            taskId: task.registry.is_encrypted ? `${task.id}.zip` : task.file_id,
          })}
          category={task.category}
          // difficulty={task.difficulty}
          dataset_name={task.dataset_name}
          dataset_version={task.dataset_version}
        />
        {task.demo_url && <TaskDemo demoUrl={task.demo_url} />}
        <TaskDescription
          description={task.description}
          encrypted={task.registry.is_encrypted}
        />
        <TaskTags tags={task.tags} />
        {task.author_name !== "unknown" && task.author_name !== "anonymous" && (
          <p className="text-muted-foreground font-mono text-sm">
            Created by {task.author_name}
          </p>
        )}
        <div className="flex flex-1 flex-col justify-end">
          <CanaryString />
        </div>
      </div>
    </div>
  );
}
