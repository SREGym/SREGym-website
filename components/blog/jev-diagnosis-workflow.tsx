import { ResearchFigure } from "./research-figure";

export function JevDiagnosisWorkflow() {
  return (
    <ResearchFigure
      id="jev-diagnosis-workflow"
      number={1}
      title="Jev-driven diagnosis workflow"
      src="/blog/jev-diagnosis/workflow.svg"
      mobileSrc="/blog/jev-diagnosis/workflow-mobile.svg"
      height={1248}
      mobileHeight={1260}
      alt="A simplified workflow: programmatic cluster collection, Jev candidate selection, focused evidence collection, and Jev verdict and evidence selection. Programmatic routing confirms a supported origin, follows a victim's dependency, or inspects another candidate, then submits a diagnosis."
      caption="The diagnosis pipeline alternates programmatic evidence collection with Jev's focused decisions."
    />
  );
}
