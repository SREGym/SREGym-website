import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  ResearchHighlight,
  type ResearchHighlightData,
} from "./research-highlight";

interface NewsCardProps {
  url: string;
  date: string | Date;
  category?: string;
  title: string;
  description?: string;
  authors: { name: string }[];
  highlight?: ResearchHighlightData;
  cover?: { src: string; alt: string; width: number; height: number };
  featured?: boolean;
}

export function NewsCard({
  url,
  date,
  category,
  title,
  description,
  authors,
  highlight,
  cover,
  featured,
}: NewsCardProps) {
  return (
    <Link
      href={url}
      className={`blog-story group ${cover || (featured && highlight) ? "blog-story-featured" : ""}`}
    >
      <div className="blog-story-copy">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
          <span className="blog-accent">{category}</span>
          <time className="blog-muted" dateTime={new Date(date).toISOString()}>
            {new Date(date).toLocaleDateString("en-US", {
              dateStyle: "medium",
              timeZone: "UTC",
            })}
          </time>
        </div>
        <h2 className="text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="blog-muted mt-5 text-base leading-relaxed">
            {description}
          </p>
        )}
        <p className="blog-muted mt-5 text-xs leading-relaxed">
          {authors.map((author) => author.name).join(" · ")}
        </p>
        <span className="mt-8 flex items-center gap-2 text-sm font-medium">
          Read article{" "}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
      {cover ? (
        <div className="blog-story-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading={featured ? "eager" : "lazy"}
          />
        </div>
      ) : (
        featured && highlight && <ResearchHighlight data={highlight} compact />
      )}
    </Link>
  );
}
