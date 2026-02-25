"use client";

import { useEffect, useRef, useState } from "react";

const ASCII_ART = ` ____  ____  _____ ____
/ ___||  _ \\| ____/ ___|_   _ _ __ ___
\\___ \\| |_) |  _|| |  _| | | | '_ \` _ \\
 ___) |  _ <| |__| |_| | |_| | | | | | |
|____/|_| \\_\\_____\\____|\\__, |_| |_| |_|
                        |___/`;

function buildContent(taskCount: number): { text: string; speed: number }[] {
  return [
    { text: "$ sregym --info\n", speed: 40 },
    { text: "\n" + ASCII_ART + "\n", speed: 8 },
    { text: "\nCan AI agents resolve production issues?\n", speed: 25 },
    { text: `\n> ${taskCount} real-world SRE problems\n`, speed: 25 },
    { text: "> 10 failure categories\n", speed: 25 },
    { text: "> Live system environments\n", speed: 25 },
    { text: "> University of Illinois at Urbana-Champaign\n", speed: 25 },
    { text: "\n$ ", speed: 40 },
  ];
}

function getFullText(taskCount: number): string {
  return buildContent(taskCount)
    .map((s) => s.text)
    .join("");
}

export function TerminalHero({ taskCount }: { taskCount: number }) {
  const sections = buildContent(taskCount);
  const fullText = getFullText(taskCount);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      prefersReducedMotion.current = true;
      setDisplayed(fullText);
      setDone(true);
      return;
    }

    let charIndex = 0;
    let sectionIndex = 0;
    let sectionCharIndex = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      if (sectionIndex >= sections.length) {
        setDone(true);
        return;
      }

      const section = sections[sectionIndex];
      sectionCharIndex++;
      charIndex++;

      setDisplayed(fullText.slice(0, charIndex));

      if (sectionCharIndex >= section.text.length) {
        sectionIndex++;
        sectionCharIndex = 0;
      }

      if (sectionIndex < sections.length) {
        const nextSpeed = sections[sectionIndex].speed;
        setTimeout(tick, nextSpeed);
      } else {
        setDone(true);
      }
    }

    const initial = setTimeout(tick, sections[0].speed);

    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Screen reader text */}
      <span className="sr-only">
        SREGym: An AI-Native Platform for Benchmarking SRE Agents.{" "}
        {taskCount} real-world SRE problems across 10 failure categories with
        live system environments. From the University of Illinois at
        Urbana-Champaign.
      </span>

      {/* Terminal window */}
      <div
        className="bg-card border border-border overflow-hidden"
        aria-hidden="true"
      >
        {/* Title bar */}
        <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs text-muted-foreground font-mono select-none">
            sregym@benchmark:~
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-xs sm:text-sm text-foreground whitespace-pre leading-snug">
            {displayed}
            {!done && (
              <span className="animate-blink">&#x2588;</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
