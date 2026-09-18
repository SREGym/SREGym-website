import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  // The social-image renderer reads these files at runtime. Explicitly include
  // them so standalone/serverless deployments retain the font assets.
  outputFileTracingIncludes: {
    "/blog/**": [
      "./node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
      "./node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf",
    ],
  },
};

export default withMDX(config);
