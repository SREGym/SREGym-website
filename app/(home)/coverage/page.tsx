import { coverageEntries } from "@/lib/coverage-data";
import ogImage from "@/public/sregym-og.png";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Coverage | SREGym";
const description =
  "News reports, benchmark results, and community discussions featuring SREGym.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/coverage" },
  openGraph: {
    title,
    description,
    url: "/coverage",
    siteName: "SREGym",
    type: "website",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "SREGym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.src],
  },
};

const linkClassName =
  "text-blue-700 decoration-blue-700/40 underline underline-offset-4 hover:text-blue-800 hover:decoration-blue-800 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none dark:text-blue-400 dark:decoration-blue-400/50 dark:hover:text-blue-300 dark:hover:decoration-blue-300";

export default function CoveragePage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-6 pb-12 sm:pt-12 sm:pb-16">
      <div className="flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
        <header className="space-y-3">
          <h1 className="font-mono text-4xl tracking-tighter">Coverage</h1>
          <p className="text-muted-foreground max-w-4xl font-sans text-base leading-relaxed sm:text-lg">
            SREGym is featured in news reports, industry benchmarks, and
            community discussions.
          </p>
        </header>
        <ol
          aria-label="SREGym coverage"
          className="marker:text-muted-foreground max-w-5xl list-decimal space-y-3 pl-7 font-sans text-base leading-relaxed marker:font-mono"
        >
          {coverageEntries.map((entry) => (
            <li key={entry.href} className="pl-1">
              {entry.before}
              <Link
                href={entry.href}
                className={linkClassName}
                {...(entry.href.startsWith("https://")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {entry.title}
              </Link>
              {entry.after}
              {entry.related && (
                <>
                  {" "}
                  (more details in the{" "}
                  <a
                    href={entry.related.href}
                    className={linkClassName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.related.title}
                  </a>
                  )
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
