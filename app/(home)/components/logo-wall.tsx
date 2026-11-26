import Image from "next/image";
import organizations from "./organizations.json";

type Organization = (typeof organizations)[number] & { file?: string };

const organizationGroups = [
  {
    id: "company",
    title: "Companies",
    columns: 4,
    rowClassName: "lg:gap-x-[calc(4.5rem*var(--organization-logo-scale))]",
    linkClassName: "h-12 lg:h-[calc(3rem*var(--organization-logo-scale))]",
  },
  {
    id: "university",
    title: "Universities",
    columns: 5,
    rowClassName: "lg:gap-x-[calc(1.5rem*var(--organization-logo-scale))]",
    linkClassName: "h-16 lg:h-[calc(4rem*var(--organization-logo-scale))]",
  },
].map((group) => {
  const members = organizations.filter((item) => item.category === group.id);

  return {
    ...group,
    rows: Array.from(
      { length: Math.ceil(members.length / group.columns) },
      (_, index) =>
        members.slice(index * group.columns, (index + 1) * group.columns),
    ),
  };
});

function OrganizationLogo({
  organization,
  theme,
}: {
  organization: Organization;
  theme: "light" | "dark";
}) {
  const image = organization[theme];
  const width = Math.min(
    180,
    (image.width / image.height) * organization.displayHeight,
  );

  return (
    <Image
      src={`/logos/organizations/${theme}/${organization.file ?? `${organization.id}.png`}`}
      alt=""
      width={image.width}
      height={image.height}
      sizes={`(min-width: 1200px) ${Math.ceil(width * 1.35)}px, (min-width: 1024px) ${Math.ceil(width * 1.15)}px, ${Math.ceil(width)}px`}
      className={theme === "light" ? "block dark:hidden" : "hidden dark:block"}
      style={{
        width: `calc(${width}px * var(--organization-logo-scale))`,
        height: "auto",
        maxWidth: "100%",
      }}
    />
  );
}

export function LogoWall() {
  return (
    <div className="flex flex-col gap-6 [--organization-logo-scale:1] min-[1200px]:[--organization-logo-scale:1.35] lg:gap-[calc(1.5rem*var(--organization-logo-scale))] lg:[--organization-logo-scale:1.15]">
      {organizationGroups.map((group) => (
        <div
          key={group.id}
          role="group"
          aria-label={`${group.title} using SREGym`}
          className="flex flex-wrap justify-center gap-x-6 gap-y-4 lg:flex-col lg:gap-y-[calc(1rem*var(--organization-logo-scale))]"
        >
          {group.rows.map((row) => (
            <ul
              key={row[0].id}
              className={`contents lg:flex lg:items-center lg:justify-center ${group.rowClassName}`}
            >
              {row.map((organization) => (
                <li
                  key={organization.id}
                  className="max-w-[calc((100%_-_1.5rem)/2)] min-w-0 flex-none lg:max-w-none"
                >
                  <a
                    href={organization.href}
                    aria-label={organization.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`focus-visible:ring-ring focus-visible:ring-offset-background flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none ${group.linkClassName}`}
                  >
                    <OrganizationLogo
                      organization={organization}
                      theme="light"
                    />
                    <OrganizationLogo
                      organization={organization}
                      theme="dark"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
