import { blog } from "@/lib/source";
import { NewsCard } from "./components/news-card";

export default async function BlogPage() {
  const posts = blog
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  return (
    <div className="blog-shell pb-16">
      <header className="pt-10 pb-10 sm:pt-16 sm:pb-12">
        <p className="blog-eyebrow blog-accent mb-4">From the SREGym team</p>
        <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
          Blog
        </h1>
        <p className="blog-muted mt-5 max-w-xl text-lg leading-relaxed">
          Experiments, findings, and field notes on building reliable SRE
          agents.
        </p>
      </header>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="blog-eyebrow blog-muted">Latest writing</h2>
        <div className="bg-border h-px flex-1" />
      </div>
      <div className="flex flex-col gap-6">
        {posts.map((post, index) => (
          <NewsCard
            key={post.url}
            url={post.url}
            date={post.data.date}
            category={post.data.category}
            title={post.data.title}
            description={post.data.description}
            authors={post.data.authors}
            highlight={post.data.highlight}
            featured={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
