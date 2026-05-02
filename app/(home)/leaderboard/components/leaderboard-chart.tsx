"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts";
import { RankedRunEntry } from "../data";

const metricTabs = [
  { key: "e2ePct", label: "E2E (%)", suffix: "%" },
  { key: "diagPct", label: "Diag. (%)", suffix: "%" },
  { key: "mitPct", label: "Mit. (%)", suffix: "%" },
  { key: "ttdSeconds", label: "TTD (s)", suffix: "s" },
  { key: "ttmSeconds", label: "TTM (s)", suffix: "s" },
  { key: "tokens", label: "Tokens", suffix: "" },
] as const;

type MetricKey = (typeof metricTabs)[number]["key"];

function parseTokens(t: string): number {
  return (
    parseFloat(t.replace(/[KM]/g, "")) * (t.includes("M") ? 1000 : 1)
  );
}

function CustomTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  const [agent, model] = payload.value.split("\n");
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={-6}
        textAnchor="end"
        fill="var(--foreground)"
        fontSize={11}
        fontFamily="var(--font-mono)"
      >
        {agent}
      </text>
      <text
        x={-8}
        y={8}
        textAnchor="end"
        fill="var(--muted-foreground)"
        fontSize={10}
        fontFamily="var(--font-mono)"
      >
        {model}
      </text>
    </g>
  );
}

export function LeaderboardChart({ data }: { data: RankedRunEntry[] }) {
  const [metric, setMetric] = React.useState<MetricKey>("e2ePct");
  const tab = metricTabs.find((t) => t.key === metric)!;

  const chartData = [...data]
    .sort((a, b) => a.rank - b.rank)
    .map((d) => ({
      name: `${d.agent}${d.noise ? " ✱" : ""}\n${d.model}`,
      value:
        metric === "tokens"
          ? parseTokens(d.tokens)
          : (d[metric as keyof RankedRunEntry] as number),
      display:
        metric === "tokens"
          ? d.tokens
          : `${d[metric as keyof RankedRunEntry]}${tab.suffix}`,
    }));

  return (
    <div className="bg-card border-y font-mono md:border-x">
      <div className="flex gap-0 overflow-x-auto border-b px-4 pt-4">
        {metricTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setMetric(t.key)}
            className={cn(
              "whitespace-nowrap px-3 py-2 text-xs transition-colors",
              metric === t.key
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto p-4 sm:p-6">
        <div style={{ minWidth: 500 }}>
          <ResponsiveContainer width="100%" height={data.length * 58 + 32}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 56, top: 4, bottom: 4 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tickLine={false}
                axisLine={false}
                tick={CustomTick as never}
              />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[0, 4, 4, 0]}
                barSize={28}
              >
                <LabelList
                  dataKey="display"
                  position="right"
                  offset={8}
                  className="fill-foreground font-mono"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="text-muted-foreground border-t px-6 py-3 text-xs">
        ✱ = noisy environment
      </div>
    </div>
  );
}
