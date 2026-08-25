import { Button } from "@/components/ui/button";
import { ArrowRight, House } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <header className="flex h-16 items-center border-b px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="SREGym home"
        >
          <img src="/i.png" alt="" className="size-6" />
          <span className="text-lg font-medium tracking-tight">SREGym</span>
        </Link>
      </header>

      <div className="relative flex flex-1 items-center px-4 py-16 sm:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -z-0 hidden border-t md:block"
        />

        <section className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 bg-background py-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-14 md:py-12">
          <div className="flex items-start md:justify-end">
            <span className="font-mono text-7xl leading-none font-semibold tracking-[-0.04em] text-muted-foreground sm:text-8xl">
              404
            </span>
          </div>

          <div className="max-w-xl">
            <h1 className="font-mono text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Page not found
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This page does not exist, or its address has changed. Choose a
              current page to continue.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/leaderboard">
                  View leaderboard
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/">
                  <House />
                  Go to home
                </Link>
              </Button>
            </div>

            {/* <p className="mt-8 border-t pt-5 text-sm text-muted-foreground">
              Looking for the published benchmark problems?{" "}
              <Link
                href="/problems/cohorts/sregym-0508"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View the SREGym-0508 cohort
              </Link>
              .
            </p> */}
          </div>
        </section>
      </div>
    </main>
  );
}
