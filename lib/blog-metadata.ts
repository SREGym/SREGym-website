import type { Metadata } from "next";

export const siteUrl = "https://www.sregym.com";
export const blogTitle = "SREGym Blog: Research on Reliable SRE Agents";
export const blogDescription =
  "Experiments, benchmarks, and field notes on AI agents for site reliability engineering, incident diagnosis, and recovery.";

type BlogMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  date?: string | Date;
  authors?: { name: string; url?: string }[];
  category?: string;
};

export function createBlogMetadata({
  title,
  description,
  path,
  date,
  authors,
  category,
}: BlogMetadataOptions): Metadata {
  const url = new URL(path, siteUrl).href;
  const image = {
    url: `${url}/share-image`,
    width: 1200,
    height: 630,
    alt: title,
    type: "image/png",
  };

  return {
    title,
    description,
    authors,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "SREGym",
      locale: "en_US",
      images: [image],
      ...(date
        ? {
            type: "article",
            publishedTime: new Date(date).toISOString(),
            authors: authors?.map((author) => author.url ?? author.name),
            section: category,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
