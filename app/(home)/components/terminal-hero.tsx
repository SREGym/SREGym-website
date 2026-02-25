"use client";

import { useEffect, useRef, useState } from "react";

const ASCII_ART = ` ____  ____  _____ ____
/ ___||  _ \\| ____/ ___|_   _ _ __ ___
\\___ \\| |_) |  _|| |  _| | | | '_ \` _ \\
 ___) |  _ <| |__| |_| | |_| | | | | | |
|____/|_| \\_\\_____\\____|\\__, |_| |_| |_|
                        |___/`;

const ASCII_SECTION = 1;

function buildContent(taskCount: number): { text: string; speed: number }[] {
  return [
    { text: "$ sregym --info\n", speed: 18 },
    { text: "\n" + ASCII_ART + "\n", speed: 2 },
    { text: "\nCan AI agents resolve production issues?\n", speed: 14 },
    { text: `\n> ${taskCount} real-world SRE problems\n`, speed: 14 },
    { text: "> 10 failure categories\n", speed: 14 },
    { text: "> Live system environments\n", speed: 14 },
    { text: "> University of Illinois at Urbana-Champaign\n", speed: 14 },
    { text: "\n$ ", speed: 18 },
  ];
}

function getFullText(taskCount: number): string {
  return buildContent(taskCount)
    .map((s) => s.text)
    .join("");
}

function sliceSections(
  sections: { text: string }[],
  charIndex: number,
): string[] {
  const result: string[] = [];
  let remaining = charIndex;
  for (const section of sections) {
    if (remaining <= 0) {
      result.push("");
    } else if (remaining >= section.text.length) {
      result.push(section.text);
      remaining -= section.text.length;
    } else {
      result.push(section.text.slice(0, remaining));
      remaining = 0;
    }
  }
  return result;
}

export function TerminalHero({ taskCount }: { taskCount: number }) {
  const sections = buildContent(taskCount);
  const totalLength = sections.reduce((sum, s) => sum + s.text.length, 0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      prefersReducedMotion.current = true;
      setCharIndex(totalLength);
      setDone(true);
      return;
    }

    let idx = 0;
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
      idx++;

      setCharIndex(idx);

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

  const displayedSections = sliceSections(sections, charIndex);

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
            {displayedSections.map((text, i) =>
              text ? (
                <span
                  key={i}
                  className={i === ASCII_SECTION ? "text-green-500" : undefined}
                >
                  {text}
                </span>
              ) : null,
            )}
            <span className="animate-blink">&#x2588;</span>
          </pre>
        </div>
      </div>
    </div>
  );
}
