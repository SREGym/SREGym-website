import { Section } from "./section";

interface TaskTagsProps {
  tags: string[];
}

export function TaskTags({ tags }: TaskTagsProps) {
  if (tags.length === 0) return null;

  return (
    <Section title="Tags">
      <p className="text-muted-foreground font-mono lowercase sm:text-sm">
        {tags.join(", ")}
      </p>
    </Section>
  );
}
