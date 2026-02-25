import { buttonVariants } from "@/components/ui/button";
import { getDefaultTasks } from "@/lib/problems-data";
import { cn } from "@/lib/utils";
import { ChevronDown, Terminal } from "lucide-react";
import Link from "next/link";
import { Callout } from "./components/callout";
import { LeaderboardChart } from "./components/leaderboard-chart";
import { TaskGrid } from "@/app/(home)/problems/components/task-grid";
import { TerminalHero } from "./components/terminal-hero";

export default async function Tasks() {
  const allTasks = await getDefaultTasks();
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
      <div className="flex w-full max-w-6xl flex-1 flex-col items-center">
        <div className="flex flex-col justify-center gap-16 sm:pt-24 sm:pb-0 w-full">
          <TerminalHero taskCount={allTasks.length} />
          <div className="mx-auto flex flex-col sm:flex-row gap-4 sm:gap-2 justify-center items-center mb-12 sm:mb-9">
            <Link
              href="https://github.com/SREGym/SREGym"
              className={cn(
                "font-mono text-xl py-8 px-10 whitespace-nowrap w-full sm:w-auto sm:min-w-[350px]",
                buttonVariants({ size: "xl", className: "rounded-none !text-xl" }),
              )}
            >
              Quick  Start!  💪
            </Link>
            <Link
              href="/problems"
              className={cn(
                "font-mono text-xl py-8 px-10 whitespace-nowrap w-full sm:w-auto sm:min-w-[350px]",
                buttonVariants({
                  variant: "secondary",
                  size: "xl",
                  className: "rounded-none inline-flex items-center gap-2 !text-xl",
                }),
              )}
            >
              Problem Set 👀
            </Link>
          </div>
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
                href="/problems"
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
      </div>
    </div>
  );
}
