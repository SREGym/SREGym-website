"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ASCII_ART = ` ____  ____  _____ ____
/ ___||  _ \\| ____/ ___|_   _ _ __ ___
\\___ \\| |_) |  _|| |  _| | | | '_ \` _ \\
 ___) |  _ <| |__| |_| | |_| | | | | | |
|____/|_| \\_\\_____\\____|\\__, |_| |_| |_|
                        |___/`;

const ASCII_SECTION = 1;

function buildContent(): { text: string; speed: number }[] {
  return [
    { text: "$ sregym --info\n", speed: 18 },
    { text: "\n" + ASCII_ART + "\n", speed: 2 },
    { text: "\nCan AI agents resolve production issues?\n", speed: 14 },
    { text: "\n> Real-world SRE problems\n", speed: 14 },
    { text: "> Metastable failures, misconfigurations, and many more\n", speed: 14 },
    { text: "> Live system environments\n", speed: 14 },
    { text: "> University of Illinois at Urbana-Champaign\n", speed: 14 },
    {
      text: "\nTo submit, open an issue with the 'submission' label:\ngithub.com/SREGym/SREGym\n",
      speed: 14,
    },
    { text: "\npsst... if you think this is cool, give us a star on GitHub :)\n", speed: 14 },
    { text: "\nType 'help' for available commands.\n", speed: 14 },
    { text: "\n$ ", speed: 18 },
  ];
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

// --- Command registry ---

const PROBLEMS_BY_CATEGORY: Record<string, string[]> = {
  "Cloud Management System Failure": [
    "assign_to_non_existent_node",
    "duplicate_pvc_mounts_astronomy_shop",
    "duplicate_pvc_mounts_hotel_reservation",
    "duplicate_pvc_mounts_social_network",
    "liveness_probe_too_aggressive_astronomy_shop",
    "liveness_probe_too_aggressive_hotel_reservation",
    "liveness_probe_too_aggressive_social_network",
    "missing_configmap_hotel_reservation",
    "missing_configmap_social_network",
    "missing_service_astronomy_shop",
    "missing_service_hotel_reservation",
    "missing_service_social_network",
    "namespace_memory_limit",
    "operator_non_existent_storage",
    "operator_overload_replicas",
    "persistent_volume_affinity_violation",
    "pod_anti_affinity_deadlock",
    "pvc_claim_mismatch",
    "resource_request_too_large",
    "resource_request_too_small",
    "scale_pod_zero_social_net",
    "taint_no_toleration_social_network",
  ],
  "Correlated Failure": [
    "faulty_image_correlated",
    "update_incompatible_correlated",
    "kubelet_crash",
  ],
  "Database Failure": [
    "valkey_memory_disruption",
  ],
  "Hardware Component Failure": [
    "read_error",
  ],
  "Metastable Failure": [
    "capacity_decrease_rpc_retry_storm",
    "gc_capacity_degradation",
    "load_spike_rpc_retry_storm",
  ],
  "Misconfiguration Failure": [
    "incorrect_port_assignment",
    "missing_env_variable_astronomy_shop",
    "configmap_drift_hotel_reservation",
    "env_variable_shadowing_astronomy_shop",
    "k8s_target_port-misconfig",
    "liveness_probe_misconfiguration_astronomy_shop",
    "liveness_probe_misconfiguration_hotel_reservation",
    "liveness_probe_misconfiguration_social_network",
    "rbac_misconfiguration",
    "readiness_probe_misconfiguration_astronomy_shop",
    "readiness_probe_misconfiguration_hotel_reservation",
    "readiness_probe_misconfiguration_social_network",
    "rolling_update_misconfigured_hotel_reservation",
    "rolling_update_misconfigured_social_network",
    "sidecar_port_conflict_astronomy_shop",
    "sidecar_port_conflict_hotel_reservation",
    "sidecar_port_conflict_social_network",
    "wrong_service_selector_astronomy_shop",
    "wrong_service_selector_hotel_reservation",
    "wrong_service_selector_social_network",
    "operator_invalid_affinity_toleration",
    "operator_wrong_update_strategy_fault",
  ],
  "Multiple Independent Failures": [
    "social_net_hotel_res_astro_shop_concurrent_failures",
  ],
  "Network Failure": [
    "service_dns_resolution_failure_astronomy_shop",
    "service_dns_resolution_failure_social_network",
    "stale_coredns_config_astronomy_shop",
    "stale_coredns_config_social_network",
    "wrong_dns_policy_astronomy_shop",
    "wrong_dns_policy_hotel_reservation",
    "wrong_dns_policy_social_network",
    "ingress_misroute",
    "network_policy_block",
  ],
  "Security Failure": [
    "revoke_auth_mongodb-1",
    "revoke_auth_mongodb-2",
    "storage_user_unregistered-1",
    "storage_user_unregistered-2",
    "valkey_auth_disruption",
    "auth_miss_mongodb",
    "operator_security_context_fault",
  ],
  "System/Application Software Failure": [
    "incorrect_image",
    "misconfig_app_hotel_res",
    "wrong_bin_usage",
    "astronomy_shop_ad_service_failure",
    "astronomy_shop_ad_service_high_cpu",
    "astronomy_shop_ad_service_manual_gc",
    "astronomy_shop_cart_service_failure",
    "astronomy_shop_ad_service_image_slow_load",
    "astronomy_shop_payment_service_failure",
    "astronomy_shop_payment_service_unreachable",
    "astronomy_shop_product_catalog_service_failure",
    "astronomy_shop_recommendation_service_cache_failure",
    "kafka_queue_problems",
    "loadgenerator_flood_homepage",
    "trainticket_f17_nested_sql_select_clause_error",
    "trainticket_f22_sql_column_name_mismatch_error",
    "workload_imbalance",
  ],
};

function processCommand(input: string): string {
  const trimmed = input.trim();
  if (trimmed === "") return "";

  switch (trimmed) {
    case "help":
      return [
        "Available commands:",
        "",
        "  help              Show this help message",
        "  sregym --submit   How to submit your agent",
        "  sregym --list     List problems by category",
        "  sregym --team     Meet the team",
        "  sregym --about    About the SREGym project",
        "  clear             Clear the terminal",
      ].join("\n");

    case "sregym --submit":
      return [
        "Submission instructions:",
        "",
        "  1. Fork github.com/SREGym/SREGym",
        "  2. Run the benchmark with your agent",
        "  3. Open an issue with the 'submission' label",
        "  4. Include your agent name, results, and methodology",
        "",
        "See the repository README for full details.",
      ].join("\n");

    case "sregym --list": {
      const totalProblems = Object.values(PROBLEMS_BY_CATEGORY).reduce(
        (sum, ps) => sum + ps.length,
        0,
      );
      const lines: string[] = [
        `SREGym Problems (${totalProblems} total):`,
        "",
      ];
      for (const [category, problems] of Object.entries(PROBLEMS_BY_CATEGORY)) {
        lines.push(`  ${category} (${problems.length}):`);
        for (const p of problems) {
          lines.push(`    - ${p}`);
        }
        lines.push("");
      }
      return lines.join("\n");
    }

    case "sregym --team":
      return [
        "SREGym Team:",
        "",
        "  Jackson Clark          Lead",
        "    hacksonclark.github.io",
        "",
        "  Yiming Su              Co-Lead",
        "    yimingsu01.github.io",
        "",
        "  Lily Gniedziejko       Core Team",
        "    lilygniedz.me",
        "",
        "  Saad Mohammad Rafid Pial  Core Team",
        "    saadmrp1038.github.io",
        "",
        "University of Illinois at Urbana-Champaign",
        "",
        "Want to join? See /docs/contributing",
      ].join("\n");

    case "sregym --about":
      return [
        "SREGym is an AI-native benchmarking platform for",
        "Site Reliability Engineering agents.",
        "",
        "It provides real-world SRE problems with live system",
        "environments to evaluate how well AI agents can",
        "diagnose and resolve production incidents.",
        "",
        "Developed at the University of Illinois at Urbana-Champaign.",
      ].join("\n");

    default:
      return `command not found: ${trimmed}\nType 'help' for available commands.`;
  }
}

// --- Component ---

const MAX_HISTORY = 100;

export function TerminalHero() {
  const sections = buildContent();
  const totalLength = sections.reduce((sum, s) => sum + s.text.length, 0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  // Interactive state
  const [inputBuffer, setInputBuffer] = useState("");
  const [history, setHistory] = useState<
    Array<{ command: string; output: string }>
  >([]);
  const [cleared, setCleared] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  // Typing animation
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history, inputBuffer, charIndex]);

  // Focus terminal when animation finishes
  useEffect(() => {
    if (done && terminalRef.current) {
      terminalRef.current.focus();
    }
  }, [done]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!done) return;

      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = inputBuffer;
        setInputBuffer("");

        if (cmd.trim() === "clear") {
          setCleared(true);
          setHistory([]);
          return;
        }

        const output = processCommand(cmd);
        setHistory((prev) => {
          const next = [...prev, { command: cmd, output }];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setInputBuffer((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setInputBuffer((prev) => prev + e.key);
      }
    },
    [done, inputBuffer],
  );

  const displayedSections = sliceSections(sections, charIndex);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Screen reader text */}
      <span className="sr-only">
        SREGym: Can AI agents resolve production issues? Real-world SRE
        problems including metastable failures, misconfigurations, and many
        more. Live system environments. From the University of Illinois at
        Urbana-Champaign. To submit, open an issue with the submission label at
        github.com/SREGym/SREGym.
      </span>

      {/* Terminal window */}
      <div
        ref={terminalRef}
        className={`bg-card border border-border overflow-hidden ${done ? "cursor-text focus:ring-2 focus:ring-ring focus:outline-none" : ""}`}
        aria-hidden="true"
        tabIndex={done ? 0 : -1}
        onKeyDown={handleKeyDown}
        onClick={() => done && terminalRef.current?.focus()}
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
        <div
          ref={contentRef}
          className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto"
        >
          <pre className="font-mono text-xs sm:text-sm text-foreground whitespace-pre leading-snug">
            {/* Initial animation content */}
            {!cleared &&
              displayedSections.map((text, i) =>
                text ? (
                  <span
                    key={i}
                    className={
                      i === ASCII_SECTION
                        ? "text-green-700 dark:text-green-500"
                        : undefined
                    }
                  >
                    {text}
                  </span>
                ) : null,
              )}

            {/* Command history */}
            {history.map((entry, i) => (
              <span key={`hist-${i}`}>
                {i === 0 && cleared ? "" : "\n"}
                {entry.command !== "" && (
                  <>
                    {i === 0 && cleared ? "$ " : "$ "}
                    {entry.command}
                    {"\n"}
                  </>
                )}
                {entry.output && (
                  <>
                    {entry.output}
                    {"\n"}
                  </>
                )}
                {"\n"}
              </span>
            ))}

            {/* Current input line (only after animation is done) */}
            {done && (
              <>
                {history.length > 0 || cleared ? "$ " : ""}
                {inputBuffer}
              </>
            )}

            {/* Blinking cursor */}
            <span className="animate-blink">&#x2588;</span>
          </pre>
        </div>
      </div>

      {/* Mobile hint */}
      {done && (
        <p className="sm:hidden text-xs text-muted-foreground text-center mt-2 font-mono">
          Interactive terminal available on desktop
        </p>
      )}
    </div>
  );
}
