"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Download } from "lucide-react";
import data from "@/content/blog/_data/jev-diagnosis.json";
import "./jev-diagnosis.css";

type Model = (typeof data.comparison.models)[number];
type Axis = "time" | "cost";

type ChartPoint = { row: Model; x: number; y: number };
type ChartLabel = {
  point: ChartPoint;
  title: string;
  effort: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type LabelPosition = { side: "left" | "right" | "center"; dy: number };

// Fixed annotation positions keep labels clear in both chart views.
const labelPositions: Record<string, Record<Axis, LabelPosition>> = {
  "Jev-driven pipeline": {
    cost: { side: "right", dy: -7.5 },
    time: { side: "right", dy: -7.5 },
  },
  "GPT-6 Astra (max)": {
    cost: { side: "right", dy: -35 },
    time: { side: "left", dy: 10 },
  },
  "GPT-6 Astra (medium)": {
    cost: { side: "center", dy: -35 },
    time: { side: "left", dy: -12.5 },
  },
  "GPT-6.1 Sol (max)": {
    cost: { side: "right", dy: 10 },
    time: { side: "center", dy: -35 },
  },
  "GPT-6.1 Sol (medium)": {
    cost: { side: "left", dy: -12.5 },
    time: { side: "right", dy: -12.5 },
  },
  "GPT-5.6 Sol (max)": {
    cost: { side: "left", dy: 18 },
    time: { side: "right", dy: -12.5 },
  },
  "Claude Opus 5": {
    cost: { side: "right", dy: -7.5 },
    time: { side: "right", dy: -5 },
  },
  "GPT-5.6 Terra (max)": {
    cost: { side: "right", dy: -12.5 },
    time: { side: "left", dy: -12.5 },
  },
  "GPT-5.6 Luna (max)": {
    cost: { side: "left", dy: -12.5 },
    time: { side: "right", dy: -12.5 },
  },
  "GPT-5.6 Sol (medium)": {
    cost: { side: "right", dy: -12.5 },
    time: { side: "right", dy: -12.5 },
  },
  "Claude Sonnet 5": {
    cost: { side: "left", dy: -7.5 },
    time: { side: "left", dy: -7.5 },
  },
  "Claude Opus 4.8": {
    cost: { side: "right", dy: -7.5 },
    time: { side: "right", dy: -7.5 },
  },
};

function placeLabels(points: ChartPoint[], axis: Axis): ChartLabel[] {
  return points.map((point) => {
    const match = point.row.label.match(/^(.*?) \((.*?)\)$/);
    const title =
      point.row.group === "jev"
        ? "Jev 1.13.0"
        : (match?.[1] ?? point.row.label);
    const effort = match?.[2] ?? "";
    const width = title.length * 5.9;
    const height = effort ? 25 : 15;
    const position = labelPositions[point.row.label]?.[axis] ?? {
      side: "right",
      dy: -height / 2,
    };
    return {
      point,
      title,
      effort,
      x:
        point.x +
        (position.side === "right"
          ? 10
          : position.side === "left"
            ? -width - 10
            : -width / 2),
      y: point.y + position.dy,
      width,
      height,
    };
  });
}

const groups = [
  { id: "jev", label: "Jev-driven pipeline" },
  { id: "codex", label: "Codex" },
  { id: "claude", label: "Claude Code" },
];

function cost(value: number | null) {
  return value === null
    ? "Unavailable"
    : `$${value.toFixed(value < 0.01 ? 5 : 3)}`;
}

function Marker({
  group,
  x = 8,
  y = 8,
  size = 5,
}: {
  group: string;
  x?: number;
  y?: number;
  size?: number;
}) {
  if (group === "jev") {
    return (
      <path
        d={`M ${x} ${y - size - 1} L ${x + size + 1} ${y} L ${x} ${y + size + 1} L ${x - size - 1} ${y} Z`}
      />
    );
  }
  if (group === "claude") {
    return (
      <path
        d={`M ${x} ${y - size - 1} L ${x + size + 1} ${y + size} L ${x - size - 1} ${y + size} Z`}
      />
    );
  }
  return <circle cx={x} cy={y} r={size} />;
}

function ModelMarker({ group }: { group: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={`jev-marker jev-series-${group}`}
      aria-hidden="true"
    >
      <Marker group={group} />
    </svg>
  );
}

export function JevDiagnosisExplorer() {
  const id = useId();
  const [axis, setAxis] = useState<Axis>("cost");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [width, setWidth] = useState(680);
  const chartRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(hoverTimeout.current), []);

  function inspect(row: Model) {
    clearTimeout(hoverTimeout.current);
    setFocusedId(null);
    setHoveredId(row.id);
  }

  function leavePoint() {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredId(null), 120);
  }

  const dismissTooltip = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    setHoveredId(null);
    setFocusedId(null);
  }, []);

  // Hover does not move keyboard focus into the chart. Escape must still work.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismissTooltip();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismissTooltip]);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(660, entry.contentRect.width)),
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const plotted = data.comparison.models.filter(
    (row) => axis === "time" || row.diagnosisCostUsd !== null,
  );
  const missingCosts = data.comparison.models.length - plotted.length;
  const height = 520;
  const margin = { left: 48, right: 112, top: 36, bottom: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const min = axis === "time" ? 0 : 0.001;
  const max = axis === "time" ? 400 : 2;
  const ticks =
    axis === "time" ? [0, 100, 200, 300, 400] : [0.001, 0.01, 0.1, 1];
  const x = (value: number) =>
    Math.round(
      (margin.left +
        plotWidth *
          (axis === "cost"
            ? (Math.log10(value) - Math.log10(min)) /
              (Math.log10(max) - Math.log10(min))
            : value / max)) *
        1000,
    ) / 1000;
  const y = (value: number) =>
    Math.round((margin.top + plotHeight * (1 - (value - 50) / 54)) * 1000) /
    1000;
  const points = plotted.map((row) => ({
    row,
    x: x(axis === "time" ? row.meanDiagnosisSeconds : row.diagnosisCostUsd!),
    y: y(row.passRate),
  }));
  const labels = placeLabels(points, axis);
  const inspectedPoint = points.find(
    (point) => point.row.id === (hoveredId ?? focusedId),
  );
  const visibleLeft = chartRef.current?.scrollLeft ?? 0;
  const visibleWidth = chartRef.current?.clientWidth ?? width;
  const tooltipWidth = Math.min(260, visibleWidth - 16);
  const tooltipHeight = 155;
  const tooltipLeft = inspectedPoint
    ? Math.max(
        visibleLeft + 8,
        Math.min(
          inspectedPoint.x + 18 + tooltipWidth <= visibleLeft + visibleWidth - 8
            ? inspectedPoint.x + 18
            : inspectedPoint.x - tooltipWidth - 18,
          visibleLeft + visibleWidth - tooltipWidth - 8,
        ),
      )
    : 0;
  const tooltipTop = inspectedPoint
    ? inspectedPoint.y + tooltipHeight + 18 <= height - 12
      ? inspectedPoint.y + 18
      : inspectedPoint.y - tooltipHeight - 18
    : 0;

  function changeAxis(next: Axis) {
    setAxis(next);
    dismissTooltip();
  }

  const download = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ updated: data.updated, ...data.comparison }, null, 2))}`;

  return (
    <figure
      className="jev-explorer not-prose"
      aria-labelledby={`${id}-caption`}
    >
      <div className="jev-explorer-panel">
        <div className="jev-explorer-heading">
          <div>
            <p className="jev-explorer-kicker">
              SREGym-Lite · Sep 4 cohort · 21 faults
            </p>
            <h3>
              Diagnosis performance vs. {axis === "time" ? "time" : "cost"}
            </h3>
          </div>
          <a
            className="jev-icon-button"
            href={download}
            download="jev-diagnosis-comparison.json"
            aria-label="Download comparison data"
          >
            <Download size={17} />
          </a>
        </div>
        <div className="jev-toolbar">
          <div
            className="jev-axis-toggle"
            role="group"
            aria-label="Horizontal axis"
          >
            <button
              type="button"
              aria-pressed={axis === "time"}
              onClick={() => changeAxis("time")}
            >
              Diagnosis time
            </button>
            <button
              type="button"
              aria-pressed={axis === "cost"}
              onClick={() => changeAxis("cost")}
            >
              Inference cost
            </button>
          </div>
        </div>
        <div className="jev-legend" aria-label="Agent families">
          {groups.map((group) => (
            <span key={group.id}>
              <ModelMarker group={group.id} />
              {group.label}
            </span>
          ))}
        </div>
        {axis === "cost" && missingCosts > 0 && (
          <p className="jev-cost-notice">
            {missingCosts} configurations have no diagnosis cost measurement and
            are omitted from this plot.
          </p>
        )}
        <p className="jev-chart-hint">
          Scroll horizontally to see all models →
        </p>
        <div
          ref={chartRef}
          className="jev-chart"
          tabIndex={0}
          aria-label="Diagnosis comparison chart"
          onScroll={dismissTooltip}
        >
          {plotted.length > 0 ? (
            <div
              className="jev-chart-surface"
              style={{ width }}
              data-inspecting={Boolean(inspectedPoint)}
            >
              <svg
                viewBox={`0 0 ${width} ${height}`}
                style={{ width }}
                role="group"
                aria-labelledby={`${id}-chart-title ${id}-chart-desc`}
              >
                <title
                  id={`${id}-chart-title`}
                >{`Diagnosis pass rate versus mean ${axis === "time" ? "diagnosis time" : "inference cost"}`}</title>
                <desc id={`${id}-chart-desc`}>
                  Higher means more diagnoses passed. Farther left means lower{" "}
                  {axis === "time" ? "time" : "cost"}. Hover or focus a point
                  for its measurements. This compares separate experiments on
                  the same 21 fault IDs.
                </desc>
                <text x={margin.left} y={16} className="jev-axis-title">
                  Diagnosis pass rate (%) ↑
                </text>
                {[50, 60, 70, 80, 90, 100].map((tick) => (
                  <g key={tick} className="jev-grid">
                    <line
                      x1={margin.left}
                      x2={width - margin.right}
                      y1={y(tick)}
                      y2={y(tick)}
                    />
                    <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end">
                      {tick}
                    </text>
                  </g>
                ))}
                {ticks.map((tick) => (
                  <g key={tick} className="jev-grid">
                    <line
                      x1={x(tick)}
                      x2={x(tick)}
                      y1={margin.top}
                      y2={y(50)}
                    />
                    <text x={x(tick)} y={y(50) + 23} textAnchor="middle">
                      {axis === "time"
                        ? tick
                        : `$${tick.toFixed(tick > 0 && tick < 0.01 ? 3 : tick > 0 && tick < 1 ? 2 : tick % 1 === 0 ? 0 : 1)}`}
                    </text>
                  </g>
                ))}
                <text
                  x={margin.left + plotWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="jev-axis-title"
                >
                  ← Mean{" "}
                  {axis === "time"
                    ? "diagnosis time (seconds)"
                    : "diagnosis cost ($ / attempt, log scale)"}
                </text>
                {points.map(({ row, x: px, y: py }) => {
                  const inspected = row.id === inspectedPoint?.row.id;
                  const label = labels.find(
                    (item) => item.point.row.id === row.id,
                  );
                  return (
                    <g
                      key={row.id}
                      className={`jev-chart-point jev-series-${row.group}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${row.label}, ${row.agent}: ${row.passRate.toFixed(1)}% pass rate, ${row.meanDiagnosisSeconds.toFixed(1)} seconds, inference cost ${cost(row.diagnosisCostUsd)}`}
                      aria-describedby={inspected ? `${id}-tooltip` : undefined}
                      data-inspected={inspected}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== "touch") inspect(row);
                      }}
                      onPointerLeave={leavePoint}
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible")) {
                          clearTimeout(hoverTimeout.current);
                          setHoveredId(null);
                          setFocusedId(row.id);
                        }
                      }}
                      onBlur={dismissTooltip}
                      onClick={() => inspect(row)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          clearTimeout(hoverTimeout.current);
                          setHoveredId(null);
                          setFocusedId(row.id);
                        }
                      }}
                    >
                      <rect
                        x={px - 10}
                        y={py - 10}
                        width={20}
                        height={20}
                        fill="transparent"
                        stroke="none"
                      />
                      <Marker
                        group={row.group}
                        x={px}
                        y={py}
                        size={
                          (row.group === "jev" ? 6 : 4.5) + (inspected ? 1 : 0)
                        }
                      />
                      {label && (
                        <>
                          <rect
                            x={label.x - 2}
                            y={label.y - 1}
                            width={label.width + 4}
                            height={label.height + 2}
                            fill="transparent"
                            stroke="none"
                          />
                          <text
                            x={label.x}
                            y={label.y + 11}
                            className={
                              row.group === "jev"
                                ? "jev-point-label jev-point-label-jev"
                                : "jev-point-label"
                            }
                          >
                            <tspan x={label.x}>{label.title}</tspan>
                            {label.effort && (
                              <tspan
                                x={label.x}
                                dy={13}
                                className="jev-point-effort"
                              >
                                {label.effort}
                              </tspan>
                            )}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
              {inspectedPoint && (
                <div
                  id={`${id}-tooltip`}
                  role="tooltip"
                  className="jev-chart-tooltip"
                  style={{
                    left: tooltipLeft,
                    top: tooltipTop,
                    width: tooltipWidth,
                  }}
                  onPointerEnter={() => inspect(inspectedPoint.row)}
                  onPointerLeave={leavePoint}
                >
                  <div className="jev-tooltip-heading">
                    <ModelMarker group={inspectedPoint.row.group} />
                    <strong>{inspectedPoint.row.label}</strong>
                  </div>
                  <p className="jev-tooltip-meta">
                    {inspectedPoint.row.group === "jev"
                      ? inspectedPoint.row.model
                      : inspectedPoint.row.agent}{" "}
                    · {inspectedPoint.row.attempts} attempts
                  </p>
                  <dl>
                    <div>
                      <dt>Diagnosis pass rate</dt>
                      <dd>{inspectedPoint.row.passRate.toFixed(1)}%</dd>
                    </div>
                    <div>
                      <dt>Diagnosis cost / attempt</dt>
                      <dd>{cost(inspectedPoint.row.diagnosisCostUsd)}</dd>
                    </div>
                    <div>
                      <dt>Mean diagnosis time</dt>
                      <dd>
                        {inspectedPoint.row.meanDiagnosisSeconds.toFixed(1)} s
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          ) : (
            <p className="jev-empty">
              No configurations have data for this axis. Switch to diagnosis
              time.
            </p>
          )}
        </div>
      </div>
      <figcaption id={`${id}-caption`}>
        <p>
          <strong>Figure 2.</strong> Diagnosis results on the same 21
          SREGym-Lite faults. Jev ran five attempts per fault. Each LLM agent
          ran three.
        </p>
      </figcaption>
    </figure>
  );
}

export function JevAttemptResults() {
  const [query, setQuery] = useState("");
  const faults = data.faults.filter((fault) =>
    fault.id.includes(query.toLowerCase().trim().replaceAll(" ", "_")),
  );
  return (
    <details className="jev-attempts not-prose">
      <summary>
        Per-fault results{" "}
        <span>
          {data.study.faults} faults · {data.study.attempts} diagnoses
        </span>
      </summary>
      <input
        type="search"
        aria-label="Search Jev faults"
        placeholder="Find a fault…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {faults.map((fault) => (
        <details className="jev-fault" key={fault.id}>
          <summary>
            <span>{fault.id.replaceAll("_", " ")}</span>
            <strong
              className={
                fault.attempts.every((attempt) => attempt.passed)
                  ? "jev-pass"
                  : "jev-fail"
              }
            >
              {fault.attempts.filter((attempt) => attempt.passed).length}/
              {fault.attempts.length}
            </strong>
          </summary>
          <div
            className="jev-table-scroll"
            role="region"
            aria-label={`${fault.id} attempts`}
            tabIndex={0}
          >
            <table>
              <caption className="sr-only">
                {fault.id}: five independent attempts judged by gpt-6-astra at
                high reasoning effort
              </caption>
              <thead>
                <tr>
                  <th scope="col">Attempt</th>
                  <th scope="col">Diagnosis</th>
                  <th scope="col">Score</th>
                  <th scope="col">Time</th>
                  <th scope="col">Jev calls</th>
                </tr>
              </thead>
              <tbody>
                {fault.attempts.map((attempt) => (
                  <tr key={attempt.attempt}>
                    <th scope="row">{attempt.attempt}</th>
                    <td>{attempt.passed ? "Pass" : "Fail"}</td>
                    <td>{attempt.score.toFixed(2)}</td>
                    <td>{attempt.diagnosisSeconds.toFixed(1)} s</td>
                    <td>{attempt.calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
      {faults.length === 0 && <p className="jev-empty">No matching faults.</p>}
    </details>
  );
}
