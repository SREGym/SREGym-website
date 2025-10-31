import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Terminal } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Terminal className="size-4" />
        <p className="font-mono text-base font-medium tracking-tight">
          SREGym
        </p>
      </div>
    ),
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Leaderboard",
      url: "/leaderboard",
      active: "nested-url",
    },
    {
      text: "Problems",
      url: "/problems/terminal-bench-core/head",
      active: "nested-url",
    },
    {
      text: "Contributors",
      url: "/contributors",
      active: "nested-url",
    },
    {
      text: "News",
      url: "/news",
      active: "nested-url",
    },
    {
      text: "Stratus",
      url: "/stratus",
      active: "nested-url",
    },
  ],
  themeSwitch: {
    mode: "light-dark-system",
  },
};
