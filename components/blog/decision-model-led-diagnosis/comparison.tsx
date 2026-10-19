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
const reviewed: DiagnosisComparisonModel[] = [
  { id: "jev-reviewed", model: "Jev", group: "jev", column: 3 },
  {
    id: "luna-reviewed",
    model: "GPT-6 Luna Decisions",
    group: "luna",
    column: 1,
  },
].map(({ id, model, group, column }) => {
  const [, passed, attempts] = passes[column].match(/^(\d+)\/(\d+)/)!;
  const [, perDiagnosis] = costs[column].match(/\(\$([\d.]+) per attempt\)/)!;
  return {
    id,
    agent: "Decision-model-led agent",
    model,
    label: `${model} with LLM review`,
    group,
    annotationTitle: group === "luna" ? "Luna" : "Jev",
    annotationDetail: "",
    passRate: (Number(passed) / Number(attempts)) * 100,
    diagnosisCostUsd: Number(perDiagnosis),
    attempts: Number(attempts),
    meanDiagnosisSeconds: timings.configurations.find(
      (entry) => entry.id === `${group}-review`,
    )!.meanDiagnosisSeconds,
  };
});

export function DecisionModelComparison() {
  return (
    <DiagnosisComparisonChart
      chartId="decision-model-agent-comparison"
      className="decision-agent-comparison"
      models={[...baselines, ...reviewed]}
      series={[
        { id: "jev", label: "Jev + LLM review" },
        { id: "luna", label: "Luna Decisions + LLM review" },
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
        "Jev-driven pipeline": { cost: { side: "right", dy: -12.5 } },
        "GPT-5.6 Luna (max)": { cost: { side: "right", dy: -12.5 } },
        "GPT-5.6 Sol (max)": { time: { side: "right", dy: -20 } },
      }}
      caption={
        <p>
          Diagnosis results on the same 21 SREGym-Lite faults, using our own
          runs. The decision-model setups ran five attempts per fault; the LLM
          agents ran three. Time and inference cost are means per diagnosis,
          including review and report writing where used. Times exclude the
          fixed 120-second observation wait. Repair and judging are excluded.
        </p>
      }
    />
  );
}
