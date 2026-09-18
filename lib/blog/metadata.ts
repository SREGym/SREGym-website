import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { blogImageSize } from "./config";

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
    ...blogImageSize,
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
