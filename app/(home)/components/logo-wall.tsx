import Image from "next/image";
import logoFrames from "./logo-wall-layout.json";

// Keep the organizations, links, and theme variants in sync with the SREGym README.
const organizations = [
  {
    id: "microsoft",
    name: "Microsoft Research",
    href: "https://www.microsoft.com/research/",
  },
  { id: "datadog", name: "Datadog", href: "https://www.datadoghq.com/" },
  { id: "cognition", name: "Cognition", href: "https://cognition.com/" },
  {
    id: "cloudthinker",
    name: "CloudThinker",
    href: "https://cloudthinker.io/",
  },
  { id: "komodor", name: "Komodor", href: "https://komodor.com/" },
  { id: "nofire", name: "NOFire", href: "https://www.nofire.ai/" },
  { id: "chiron", name: "Chiron", href: "https://chironvision.ai/" },
  {
    id: "skyhook",
    name: "Skyhook, makers of Radar",
    href: "https://radarhq.io/",
  },
  { id: "ciroos", name: "Ciroos", href: "https://ciroos.ai/" },
  { id: "one2n", name: "One2N", href: "https://one2n.io/" },
  { id: "exo", name: "Exo", href: "https://github.com/exoharness/exo" },
  { id: "p95", name: "P95.ai", href: "https://p95.ai/" },
  { id: "bespoke", name: "Bespoke Labs", href: "https://bespokelabs.ai/" },
  {
    id: "illinois",
    name: "University of Illinois Urbana-Champaign",
    href: "https://illinois.edu/",
  },
  {
    id: "washington",
    name: "University of Washington",
    href: "https://www.washington.edu/",
  },
  {
    id: "toronto",
    name: "University of Toronto",
    href: "https://www.utoronto.ca/",
  },
  {
    id: "berkeley",
    name: "University of California, Berkeley",
    href: "https://www.berkeley.edu/",
  },
  { id: "asu", name: "Arizona State University", href: "https://www.asu.edu/" },
] as const;

type Organization = (typeof organizations)[number];

function OrganizationLogo({
  organization,
  theme,
}: {
  organization: Organization;
  theme: "light" | "dark";
}) {
  const frame = logoFrames[organization.id][theme];
  const isUniversity = [
    "illinois",
    "washington",
    "toronto",
    "berkeley",
    "asu",
  ].includes(organization.id);
  const height = isUniversity ? 42 : 32;
  const width = Math.min(164, (frame.width / frame.height) * height);

  return (
    <span
      className={`relative overflow-hidden ${theme === "light" ? "block dark:hidden" : "hidden dark:block"}`}
      style={{
        width,
        maxWidth: "100%",
        aspectRatio: `${frame.width} / ${frame.height}`,
      }}
    >
      <Image
        src={`/logos/organizations/${theme}/${organization.id}.png`}
        alt=""
        width={720}
        height={270}
        sizes={`${Math.ceil((720 / frame.width) * width)}px`}
        className="absolute max-w-none"
        style={{
          left: `${(-frame.left / frame.width) * 100}%`,
          top: `${(-frame.top / frame.height) * 100}%`,
          width: `${(720 / frame.width) * 100}%`,
          height: `${(270 / frame.height) * 100}%`,
        }}
      />
    </span>
  );
}

export function LogoWall() {
  return (
    <section
      id="users"
      aria-labelledby="users-heading"
      className="w-full scroll-mt-24"
    >
      <h2
        id="users-heading"
        className="text-foreground/65 text-center font-mono text-sm leading-relaxed font-normal sm:text-base"
      >
        Used by researchers and engineers at
      </h2>

      <ul className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 px-3 sm:mt-8 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-6 lg:gap-x-6">
        {organizations.map((organization) => (
          <li key={organization.id} className="min-w-0">
            <a
              href={organization.href}
              aria-label={organization.name}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:ring-ring focus-visible:ring-offset-background flex h-12 items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
            >
              <OrganizationLogo organization={organization} theme="light" />
              <OrganizationLogo organization={organization} theme="dark" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
