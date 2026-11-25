import Image from "next/image";
import organizations from "./organizations.json";

type Organization = (typeof organizations)[number] & { file?: string };

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
      sizes={`${Math.ceil(width)}px`}
      className={theme === "light" ? "block dark:hidden" : "hidden dark:block"}
      style={{
        width,
        height: "auto",
        maxWidth: "100%",
      }}
    />
  );
}

export function LogoWall() {
  return (
    <ul
      aria-label="Organizations using SREGym"
      className="flex flex-wrap justify-center gap-x-6 gap-y-6 sm:gap-y-8 lg:gap-x-8"
    >
      {organizations.map((organization) => (
        <li
          key={organization.id}
          className="w-[calc((100%_-_1.5rem)/2)] min-w-0 flex-none sm:w-[calc((100%_-_4.5rem)/4)] lg:w-[calc((100%_-_8rem)/5)]"
        >
          <a
            href={organization.href}
            aria-label={organization.name}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:ring-ring focus-visible:ring-offset-background flex h-16 items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            <OrganizationLogo organization={organization} theme="light" />
            <OrganizationLogo organization={organization} theme="dark" />
          </a>
        </li>
      ))}
    </ul>
  );
}
