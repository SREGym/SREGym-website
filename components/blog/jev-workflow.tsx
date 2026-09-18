import { ResearchFigure } from "@/components/blog/research-figure";

export function JevWorkflow() {
  return (
    <ResearchFigure
      id="jev-decision-loop"
      number={1}
      title="The Decision loop"
      src="/blog/jev/decision-loop.svg"
      mobileSrc="/blog/jev/decision-loop-mobile.svg"
      height={1000}
      mobileHeight={1750}
      alt="Three phases: planning, diagnosis, and recovery. In planning, the agent proposes three to five hypotheses and read-only tests; jev_plan ranks tests using fresh system context; the agent runs selected tests and updates its hypotheses, repeating as needed. The agent builds a diagnosis, jev_submit reviews it, and the Conductor receives supported submissions. After receipt, the agent repairs and verifies recovery; jev_submit reviews the repair before Conductor grading. Either refused review repeats the full planning loop, then retries its own stage with new evidence."
      caption="The agent plans, tests, diagnoses, and repairs. If Jev needs more evidence, the agent repeats planning before retrying."
    />
  );
}
