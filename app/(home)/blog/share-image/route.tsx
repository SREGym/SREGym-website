import { blogDescription } from "@/lib/blog/config";
import { createBlogSocialImage } from "@/lib/blog/social-image";

export const dynamic = "force-static";

export async function GET() {
  return createBlogSocialImage({
    title: "Building more reliable SRE agents.",
    description: blogDescription,
  });
}
