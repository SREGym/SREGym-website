import { Lock } from "lucide-react";
import { Section } from "./section";

interface TaskDescriptionProps {
  description: string;
  encrypted: boolean;
}

export function TaskDescription({
  description,
  encrypted,
}: TaskDescriptionProps) {
  return (
    <Section title="Description">
      {encrypted ? (
        <div className="bg-muted flex items-center gap-3 border p-3">
          <Lock className="text-muted-foreground size-4" />
          <p className="text-muted-foreground font-mono sm:text-sm">
            Description encrypted to prevent contamination.
          </p>
        </div>
      ) : (
        <p className="font-mono wrap-anywhere whitespace-pre-wrap sm:text-sm">
          {description}
        </p>
      )}
    </Section>
  );
}
