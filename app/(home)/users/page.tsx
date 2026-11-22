import { LogoWall } from "../components/logo-wall";
import ogImage from "@/public/sregym-og.png";
import type { Metadata } from "next";

const title = "Users | SREGym";
const description =
  "SREGym users include researchers and engineers at companies, research labs, and universities.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/users" },
  openGraph: {
    title,
    description,
    url: "/users",
    siteName: "SREGym",
    type: "website",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "SREGym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.src],
  },
};

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-6 pb-12 sm:pt-12 sm:pb-16">
      <div className="flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
        <header className="max-w-3xl space-y-3 font-mono">
          <h1 className="text-4xl tracking-tighter">Users</h1>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            SREGym is used by researchers and engineers at organizations including:
          </p>
        </header>
        <LogoWall />
      </div>
    </div>
  );
}
