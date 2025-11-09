import { CanaryString } from "@/components/canary-string";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_DATASET_NAME,
  DEFAULT_DATASET_VERSION,
  getDefaultTasks,
} from "@/lib/problems-data";
import { formatDatasetName } from "@/lib/utils";
import { FilterableTaskGrid } from "./components/filterable-task-grid";

export default async function ProblemsPage() {
  const tasks = await getDefaultTasks();
  const datasetName = tasks[0]?.dataset_name ?? DEFAULT_DATASET_NAME;
  const datasetVersion = tasks[0]?.dataset_version ?? DEFAULT_DATASET_VERSION;

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
              <BreadcrumbPage>Problems</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-6 space-y-3">
          <h2 className="font-mono text-4xl tracking-tighter">Problem List</h2>
          {/* <Badge variant="secondary" className="font-mono">
            {formatDatasetName(datasetName)}=={datasetVersion}
          </Badge> */}
        </div>
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
