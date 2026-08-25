import { Badge } from "@/components/ui/badge";
import { formatDatasetName } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { CopyTaskId } from "./copy-task-id";

interface TaskHeaderProps {
  id: string;
  githubUrl: string;
  category: string;
  // difficulty: string;
  dataset_name: string;
  dataset_version: string;
}

export function TaskHeader({
  id,
  githubUrl,
  category,
  // difficulty,
  dataset_name,
  dataset_version,
}: TaskHeaderProps) {
  return (
    <div className="space-y-4">
      <CopyTaskId id={id} />
      <Badge>
        Problem Set
      </Badge>
      <div className="flex gap-2">
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-mono underline-offset-4 hover:underline sm:text-sm"
        >
          Github
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-2">
        <Badge
          variant="secondary"
          className="font-mono"
        >
          {category}
        </Badge>
      </div>
    </div>
  );
}
