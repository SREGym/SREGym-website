# SREGym Website

Documentation and blog website built with Next.js and Fumadocs.

## Prerequisites

- Node.js 22 or higher recommended
- npm

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Check TypeScript
- `npm run test:blog` - Check blog metadata, sharing images, and accessible results
  against a running server (default `http://localhost:3000`; override with `BLOG_TEST_URL`)

## Adding Content

- Documentation: Add MDX files to `content/docs/`
- Blog posts: Add MDX files to `content/blog/`

## Blog structure

- `app/(home)/blog/`: routes, page layout/styles, listing components, and image endpoints
- `components/blog/`: MDX figures and the shared expandable figure component
- `lib/blog/`: sharing-image renderer, metadata helpers, and shared configuration
- `lib/site.ts`: canonical public site URL
- `content/blog/_data/`: article data shared by figures and accessible tables
- `public/blog/jev/`: the five generated SVGs used by the Jev article
- `scripts/blog/`: smoke tests and article-specific figure tooling

For Python setup, figure regeneration, and the non-mutating `--check` command,
see [Jev figure tooling](scripts/blog/jev/README.md).

Blog metadata and 1200×630 sharing images are generated from article frontmatter.
`seoDescription` optionally overrides the search/social description without
changing the visible article subtitle. Results tables remain screen-reader
accessible without adding another visible results section.
