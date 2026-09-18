import type { MetadataRoute } from "next";
import { getDefaultTasks } from "@/lib/problems-data";
import { siteUrl } from "@/lib/site";
import { blog } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tasks = await getDefaultTasks();
  // Include primary destinations and articles; omit cohorts and contributors.
  const paths = new Set([
    "/",
    "/blog",
    "/leaderboard",
    ...blog.getPages().map((page) => page.url),
    ...tasks.map((task) => `/problems/${encodeURIComponent(task.id)}`),
  ]);

  // Publication dates and build times aren't reliable modification dates.
  // Leave optional lastModified fields out until actual edit dates are tracked.
  return [...paths].map((path) => ({ url: new URL(path, siteUrl).href }));
}
