import {
  DiagnosisComparisonChart,
  type DiagnosisComparisonModel,
} from "@/components/blog/jev-diagnosis-explorer";
import previousStudy from "@/content/blog/_data/jev-diagnosis.json";
import study from "@/content/blog/_data/decision-model-led-diagnosis.json";
import timings from "@/content/blog/_data/decision-model-led-timings.json";
import "./comparison.css";

// Reuse blog two's frozen, first-party 21-fault comparison. The live leaderboard
// now uses 17 faults, so its rates must not replace these historical baselines.
const baselines: DiagnosisComparisonModel[] =
  previousStudy.comparison.models.map((row) =>
    row.id === "jev"
      ? {
          ...row,
          group: "earlier-jev",
          annotationTitle: "Earlier Jev",
          annotationDetail: "without an LLM",
        }
      : row,
  );

const passes = study.results.sections[0].rows[0];
const costs = study.results.sections.at(-1)!.rows[0];
const configurations: DiagnosisComparisonModel[] = [
  { model: "Jev", group: "jev", column: 3, review: true },
  { model: "Jev", group: "jev", column: 4, review: false },
  {
    model: "GPT-6 Luna Decisions",
    group: "luna",
    column: 1,
    review: true,
  },
  {
    model: "GPT-6 Luna Decisions",
    group: "luna",
    column: 2,
    review: false,
  },
].map(({ model, group, column, review }) => {
  const [, passed, attempts] = passes[column].match(/^(\d+)\/(\d+)/)!;
  const [, perDiagnosis] = costs[column].match(/\(\$([\d.]+) per attempt\)/)!;
  return {
    id: `${group}-${review ? "reviewed" : "no-review"}`,
    agent: "Decision-model-led agent",
    model,
    label: `${model} ${review ? "with" : "without"} LLM review`,
    group,
    markerStyle: review ? "filled" : "outline",
    annotationTitle: group === "luna" ? "Luna" : "Jev",
    annotationDetail: review ? "with review" : "no review",
    passRate: (Number(passed) / Number(attempts)) * 100,
    diagnosisCostUsd: Number(perDiagnosis),
    attempts: Number(attempts),
    meanDiagnosisSeconds: timings.configurations.find(
      (entry) => entry.id === `${group}-${review ? "review" : "none"}`,
    )!.meanDiagnosisSeconds,
  };
});

export function DecisionModelComparison() {
  return (
    <DiagnosisComparisonChart
      chartId="decision-model-agent-comparison"
      className="decision-agent-comparison"
      models={[...baselines, ...configurations]}
      series={[
        { id: "jev", label: "Jev" },
        { id: "luna", label: "Luna Decisions" },
        { id: "earlier-jev", label: "Earlier Jev pipeline" },
        { id: "codex", label: "Codex" },
        { id: "claude", label: "Claude Code" },
      ]}
      annotationPositions={{
        "Jev with LLM review": {
          cost: { side: "left", dy: -22 },
          time: { side: "right", dy: -7.5 },
        },
        "GPT-6 Luna Decisions with LLM review": {
          cost: { side: "left", dy: -8 },
          time: { side: "right", dy: -8 },
        },
        "Jev without LLM review": {
          cost: { side: "left", dy: 10 },
          time: { side: "right", dy: -43 },
        },
        "GPT-6 Luna Decisions without LLM review": {
          cost: { side: "right", dy: -22 },
          time: { side: "right", dy: -8 },
        },
        "Jev-driven pipeline": {
          cost: { side: "right", dy: -12.5 },
          time: { side: "right", dy: 24 },
        },
        "GPT-5.6 Luna (max)": { cost: { side: "right", dy: -12.5 } },
        "GPT-5.6 Sol (max)": { time: { side: "right", dy: -20 } },
      }}
      caption={
        <p>
          Diagnosis results on the same 21 SREGym-Lite faults, using our own
          runs. For the current agent, filled markers include root-cause review
          and outlined markers do not. Both versions use LLM report writing. The
          decision-model setups ran five attempts per fault; the LLM agents ran
          three. Time and inference cost are means per diagnosis, including
          review and report writing where used. Times exclude the fixed
          120-second observation wait. Repair and judging are excluded.
        </p>
      }
    />
  );
}
