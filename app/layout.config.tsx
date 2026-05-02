import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

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
        <img src="/i.png" alt="SREGym Logo" className="size-6" />
        <p className="font-mono text-lg font-medium tracking-tight">
          SREGym
        </p>
      </div>
    ),
  },
  links: [
    { text: "Leaderboard", url: "/leaderboard" },
  ],
  themeSwitch: {
    enabled: true,
    mode: "light-dark-system",
  },
};
