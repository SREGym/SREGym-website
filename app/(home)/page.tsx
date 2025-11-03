import { CanaryString } from "@/components/canary-string";
import { buttonVariants } from "@/components/ui/button";
import { getTasks } from "@/lib/problems-data";
import { cn } from "@/lib/utils";
import { ChevronDown, Terminal } from "lucide-react";
import Link from "next/link";
import { Callout } from "./components/callout";
import { LeaderboardChart } from "./components/leaderboard-chart";
import { TaskGrid } from "./problems/[name]/[version]/components/task-grid";

export default async function Tasks() {
  const allTasks = await getTasks("problem-repertoire", "head");
  const taskIds = [
    "configure-git-webserver",
    "openssl-selfsigned-cert",
    "build-linux-kernel-qemu",
    "reshard-c4-data",
    "crack-7z-hash",
    "train-fasttext",
  ];
  const tasks = allTasks.filter((task) => taskIds.includes(task.id));

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-7xl flex-1 flex-col items-center">
        <div className="flex flex-col justify-center gap-16 sm:pt-24 sm:pb-0">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="h-[83px] w-[83px] flex-shrink-0 overflow-hidden shadow-lg sm:h-[125px] sm:w-[125px]" style={{ borderRadius: '16px' }}>
                <img
                  src="/LOGO_VECTORIZED.svg"
                  alt="SREGym Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-[83px] sm:h-[125px] flex flex-col justify-center">
                <h2 className="font-mono text-5xl font-medium tracking-tighter whitespace-nowrap sm:text-8xl">
                  SREGym
                </h2>
                <p className="font-mono text-xl tracking-tight text-balance sm:text-2xl">
                    An AI-Native Platform for Benchmarking SRE Agents
                </p>
              </div>
            </div>
          </div>
          <p className="text-fd-muted-foreground text-center font-mono tracking-tight text-balance sm:text-xl/relaxed mt-[40px]">
            SREGym is a unified platform to enable the design, development, and evaluation of AI agents for Site Reliability Engineering (SRE). The core idea is to create live system environments for SRE agents to solve real-world problems. SREGym also provides a comprehensive SRE benchmark suite with a wide variety of problems for evaluating SRE agents and for training next-generation AI agents.
          </p>
          <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
            <Link
              href="/docs/installation"
              className={cn(
                "font-mono text-lg py-6 px-8",
                buttonVariants({ size: "xl", className: "rounded-none" }),
              )}
            >
              Sweat out with your agent! 💪
            </Link>
            <Link
              href="/docs/setup-guide"
              className={cn(
                "font-mono text-lg py-6 px-8",
                buttonVariants({
                  variant: "secondary",
                  size: "xl",
                  className: "rounded-none inline-flex items-center gap-2",
                }),
              )}
            >
              Add facilities to the gym!
              <img
                src="/gym-icon.png"
                alt="gym icon"
                className="h-6 w-6"
                aria-hidden
              />
            </Link>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-4 md:flex-row md:gap-2">
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
          <div className="mx-auto flex max-w-xl flex-col justify-center gap-4">
            <p className="text-center font-mono text-sm sm:text-base">
              xlab @ University of Illinois at Urbana-Champaign
            </p>
          </div>
        </div>
        <div className="hidden w-full flex-col items-center py-12">
          <div className="mb-6 flex flex-col items-center gap-2">
            <p className="font-mono text-sm">view agent performance</p>
            <ChevronDown className="animate-float size-4" />
          </div>
          <LeaderboardChart className="-mx-4 mb-16 self-stretch" />
          <Link
            href="/leaderboard"
            className={cn(
              "font-mono",
              buttonVariants({
                variant: "secondary",
                size: "xl",
                className: "rounded-none",
              }),
            )}
          >
            view the full leaderboard ↗
          </Link>
        </div>
        <div className="hidden min-h-[90vh] flex-col justify-center py-12 sm:pb-16">
          <div className="mb-4 flex flex-col items-center gap-2">
            <p className="font-mono text-sm">
              view sregym task examples
            </p>
            <ChevronDown className="animate-float size-4" />
          </div>
          {tasks && (
            <div className="-mx-4 flex flex-col gap-12 sm:mx-0 sm:gap-16">
              <TaskGrid tasks={tasks} behavior="navigate" />
              <Link
                href="/problems/problem-repertoire/head"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "xl",
                    className: "mx-auto rounded-none font-mono",
                  }),
                )}
              >
                view all problems ↗
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <CanaryString />
        </div>
      </div>
    </div>
  );
}
