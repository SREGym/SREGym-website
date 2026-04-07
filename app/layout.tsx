import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistMono } from "geist/font/mono";
import { JetBrains_Mono } from "next/font/google";
import { Metadata } from "next/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import ogImage from "@/public/sregym-og.png";
import "./global.css";

export const metadata: Metadata = {
  title: "SREGym",
  metadataBase: new URL("https://www.sregym.com"),
  description: "An AI-Native Platform for Benchmarking SRE Agents",
  icons: {
    icon: "/i.png",
  },
  openGraph: {
    title: "SREGym",
    description: "An AI-Native Platform for Benchmarking SRE Agents",
    url: "https://www.sregym.com",
    siteName: "SREGym",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "SREGym - An AI-Native Platform for Benchmarking SRE Agents",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SREGym",
    description: "An AI-Native Platform for Benchmarking SRE Agents",
    images: [ogImage.src],
  },
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(jetbrainsMono.variable, jetbrainsMono.className, GeistMono.variable)}
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
