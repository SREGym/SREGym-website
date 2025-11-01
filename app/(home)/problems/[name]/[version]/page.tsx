import { CanaryString } from "@/components/canary-string";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { getTasks } from "@/lib/problems-data";
import { formatDatasetName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { FilterableTaskGrid } from "./components/filterable-task-grid";

export default async function Dataset({
  params,
}: {
  params: Promise<{ name: string; version: string }>;
}) {
  const { name, version } = await params;

  const tasks = await getTasks(name, version);

  if (tasks.length === 0) {
    notFound();
  }

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
              <BreadcrumbLink href="/problems">Problems</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {formatDatasetName(name)}=={version}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="mb-6 font-mono text-4xl tracking-tighter">
          {formatDatasetName(name)}=={version}
        </h2>
        <CodeBlock
          code={`tb run -d ${name}==${version} -a "<agent>" -m "<model>"`}
          lang="bash"
          className="mt-0 font-mono"
        />
        {tasks.length > 0 ? (
          <FilterableTaskGrid tasks={tasks} />
        ) : (
          <p className="text-muted-foreground font-mono sm:text-sm">
            Problems have not been uploaded yet.
          </p>
        )}
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <CanaryString />
        </div>
      </div>
    </div>
  );
}
