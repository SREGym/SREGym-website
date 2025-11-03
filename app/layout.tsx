import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { Metadata } from "next/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
  title: "SREGym",
  metadataBase: new URL("https://www.sregym.ai"),
  description: "A benchmark for terminal agents",
  icons: {
    icon: "/logov2.jpg",
  },
  openGraph: {
    title: "SREGym",
    description: "A benchmark for terminal agents",
    images: "/og/ascii-logo-dark-1200x630.png",
    url: "https://www.sregym.ai",
    siteName: "SREGym",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SREGym",
    description: "A benchmark for terminal agents",
    images: [
      {
        url: "/og/ascii-logo-dark-1200x630.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(inter.className, GeistMono.variable, "light")}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </RootProvider>
        <Toaster />
      </body>
    </html>
  );
}
