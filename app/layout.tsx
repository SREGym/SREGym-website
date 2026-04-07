import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistMono } from "geist/font/mono";
import { JetBrains_Mono } from "next/font/google";
import { Metadata } from "next/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Script from "next/script";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
  title: "SREGym",
  metadataBase: new URL("https://www.sregym.com"),
  verification: {
    google: "s-wA7Z2Xp-iHI8AzPkUpXnVukm9SNKGT4y4HUqQ8eOg",
  },
  description: "An AI-Native Platform for Benchmarking SRE Agents",
  icons: {
    icon: "/i.png",
  },
  openGraph: {
    title: "SREGym",
    description: "An AI-Native Platform for Benchmarking SRE Agents",
    url: "https://www.sregym.ai",
    siteName: "SREGym",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SREGym",
    description: "An AI-Native Platform for Benchmarking SRE Agents",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DKDGMPLTKE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted'
            });
            gtag('config', 'G-DKDGMPLTKE');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </RootProvider>
        <Toaster />
      </body>
    </html>
  );
}
