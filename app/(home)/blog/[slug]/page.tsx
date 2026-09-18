import { Share } from "@/components/share";
import { blog } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResearchHighlight } from "../components/research-highlight";

type PageProps = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const Mdx = page.data.body;
  const words = page.data.structuredData.contents
    .map((item) => item.content)
    .join(" ")
    .split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 220));
  const sections = page.data.hideToc
    ? []
    : page.data.toc.filter((item) => item.depth === 2);

  const contents = (
    <ol className="blog-contents-list">
      {sections.map((item, index) => (
        <li key={item.url}>
          <a href={item.url}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="blog-shell pb-16">
      <header className="pt-7 sm:pt-10">
        <div className="mb-9 flex items-center justify-between">
          <Link href="/blog" className="blog-back">
            <ArrowLeft className="size-4" aria-hidden="true" /> All articles
          </Link>
          <Share />
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
          <span className="blog-accent">{page.data.category}</span>
          <time
            className="blog-muted"
            dateTime={new Date(page.data.date).toISOString()}
          >
            {new Date(page.data.date).toLocaleDateString("en-US", {
              dateStyle: "medium",
              timeZone: "UTC",
            })}
          </time>
          <span className="blog-muted">{readingMinutes} min read</span>
        </div>
        <h1 className="blog-post-title">{page.data.title}</h1>
        <p className="blog-muted mt-6 max-w-3xl text-lg leading-relaxed font-semibold sm:text-xl">
          {page.data.description}
        </p>
        <p className="blog-byline">
          <span className="blog-muted">By </span>
          {page.data.authors.map((author, index) => (
            <span key={author.name}>
              {index > 0 && <span className="blog-muted">, </span>}
              {author.url ? (
                <a href={author.url}>{author.name}</a>
              ) : (
                author.name
              )}
            </span>
          ))}
        </p>
      </header>

      <div
        className={`blog-article-grid ${sections.length ? "" : "blog-article-grid-no-toc"}`}
      >
        <div className="min-w-0">
          {page.data.highlight && (
            <ResearchHighlight data={page.data.highlight} />
          )}
          {sections.length > 0 && (
            <details className="blog-mobile-contents">
              <summary>In this article</summary>
              {contents}
            </details>
          )}
          <article className="blog-prose prose max-w-none min-w-0">
            <Mdx components={getMDXComponents()} />
          </article>
          <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <Link href="/blog" className="blog-back">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to all
              articles
            </Link>
            <Link href="/leaderboard" className="blog-back">
              Explore the leaderboard{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </footer>
        </div>
        {sections.length > 0 && (
          <aside className="blog-desktop-contents">
            <nav aria-label="Article contents">
              <p className="blog-eyebrow blog-muted mb-5">In this article</p>
              {contents}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return blog.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
}
