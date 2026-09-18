import { createBlogSocialImage } from "@/lib/blog/social-image";
import { blog } from "@/lib/source";

export const dynamic = "force-static";

// Render known articles during the build, not on the first crawler request.
export function generateStaticParams() {
  return blog.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) return new Response("Article not found", { status: 404 });

  return createBlogSocialImage({
    title: page.data.title,
    description: page.data.description,
    category: page.data.category,
  });
}
