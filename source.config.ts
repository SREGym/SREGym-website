import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: "content/docs",
});

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    authors: z.array(
      z.object({
        name: z.string(),
        url: z.string().url().optional(),
      }),
    ),
    date: z.string().date().or(z.date()),
    category: z.string().optional().default("Release"),
    hideToc: z.boolean().optional().default(false),
    cover: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    highlight: z
      .object({
        study: z.string(),
        baseline: z.object({
          label: z.string(),
          passed: z.number(),
          total: z.number().positive(),
        }),
        comparison: z.object({
          label: z.string(),
          passed: z.number(),
          total: z.number().positive(),
        }),
        sample: z.string(),
        caveat: z.string(),
      })
      .optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
