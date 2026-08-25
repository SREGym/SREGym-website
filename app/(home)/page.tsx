import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, Terminal } from "lucide-react";
import Link from "next/link";
import { Callout } from "./components/callout";
import { TerminalHero } from "./components/terminal-hero";
import { LeaderboardPreview } from "./components/leaderboard-preview";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-6xl flex-1 flex-col items-center">
        <div className="flex flex-col justify-center gap-16 sm:pt-24 sm:pb-0 w-full">
          <TerminalHero />
          <div className="mx-auto flex flex-col gap-4 sm:gap-2 items-center mb-12 sm:mb-9">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 justify-center items-center w-full">
              <Link
                href="https://github.com/SREGym/SREGym"
                className={cn(
                  "font-mono text-xl py-8 px-10 whitespace-nowrap w-full sm:w-auto sm:min-w-[350px]",
                  buttonVariants({ size: "xl", className: "rounded-none inline-flex items-center gap-2 !text-xl" }),
                )}
              >
                <Github className="size-6" />
                GitHub
              </Link>
              <Link
                href="https://join.slack.com/t/SREGym/shared_invite/zt-3gvqxpkpc-RvCUcyBEMvzvXaQS9KtS_w"
                className={cn(
                  "font-mono text-xl py-8 px-10 whitespace-nowrap w-full sm:w-auto sm:min-w-[350px]",
                  buttonVariants({
                    variant: "secondary",
                    size: "xl",
                    className: "rounded-none inline-flex items-center gap-2 !text-xl",
                  }),
                )}
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zm-2.522 10.124a2.528 2.528 0 0 1 2.522 2.52A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.522h-6.313z"/></svg>
                Slack
              </Link>
            </div>
            <Link
              href="https://arxiv.org/abs/2605.07161"
              className={cn(
                "font-mono text-xl py-8 px-10 whitespace-nowrap w-full sm:w-auto sm:min-w-[350px]",
                buttonVariants({
                  variant: "secondary",
                  size: "xl",
                  className: "rounded-none inline-flex items-center gap-2 !text-xl",
                }),
              )}
            >
              <svg className="size-6 text-[#b31b1b] dark:text-[#ef4444]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.8423 0a1.0037 1.0037 0 0 0-.922.6078c-.1536.3687-.0438.6275.2938 1.1113l6.9185 8.3597-1.0223 1.1058a1.0393 1.0393 0 0 0 .003 1.4229l1.2292 1.3135-5.4391 6.4444c-.2803.299-.4538.823-.2971 1.1986a1.0253 1.0253 0 0 0 .9585.635.9133.9133 0 0 0 .6891-.3405l5.783-6.126 7.4902 8.0051a.8527.8527 0 0 0 .6835.2597.9575.9575 0 0 0 .8777-.6138c.1577-.377-.017-.7502-.306-1.1407l-7.0518-8.3418 1.0632-1.13a.9626.9626 0 0 0 .0089-1.3165L4.6336.4639s-.3733-.4535-.768-.463zm0 .272h.0166c.2179.0052.4874.2715.5644.3639l.005.006.0052.0055 10.169 10.9905a.6915.6915 0 0 1-.0072.945l-1.0666 1.133-1.4982-1.7724-8.5994-10.39c-.3286-.472-.352-.6183-.2592-.841a.7307.7307 0 0 1 .6704-.4401Zm14.341 1.5701a.877.877 0 0 0-.6554.2418l-5.6962 6.1584 1.6944 1.8319 5.3089-6.5138c.3251-.4335.479-.6603.3247-1.0292a1.1205 1.1205 0 0 0-.9763-.689zm-7.6557 12.2823 1.3186 1.4135-5.7864 6.1295a.6494.6494 0 0 1-.4959.26.7516.7516 0 0 1-.706-.4669c-.1119-.2682.0359-.6864.2442-.9083l.0051-.0055.0047-.0055z"/></svg>
              arXiv
            </Link>
          </div>
          <LeaderboardPreview />
          <div className="mx-auto flex max-w-3xl flex-col gap-4 md:flex-row md:gap-2 hidden">
            <Callout
              className="flex-1"
              title="introducing sregym"
              description="read our launch announcement ↗"
              href="/news/announcement"
              icon={Terminal}
            />
            <Callout
              className="flex-1"
              title="sregym dataset registry"
              description="easily evaluate your agent on standard third-party benchmarks ↗"
              href="/news/registry-and-adapters"
              icon={Terminal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
