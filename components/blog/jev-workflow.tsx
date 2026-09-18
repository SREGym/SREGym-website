const phases = [
  {
    title: "Investigate",
    steps: [
      { actor: "Luna", action: "Collect initial evidence" },
      { actor: "Luna", action: "Propose explanations and tests" },
      { actor: "Jev", action: "Rank the proposed tests" },
    ],
  },
  {
    title: "Validate",
    steps: [
      { actor: "Luna", action: "Run the selected tests" },
      { actor: "Jev", action: "Review diagnosis evidence" },
      { actor: "Conductor", action: "Accept the diagnosis" },
    ],
  },
  {
    title: "Recover",
    steps: [
      { actor: "Luna", action: "Repair and check behavior" },
      { actor: "Jev", action: "Review repair evidence" },
      { actor: "Conductor", action: "Grade the mitigation" },
    ],
  },
];

export function JevWorkflow() {
  return (
    <figure
      className="jev-workflow not-prose"
      aria-labelledby="workflow-caption"
    >
      <figcaption id="workflow-caption">
        <span className="blog-eyebrow blog-muted">The decision loop</span>
        <p className="mt-2 text-xl font-medium tracking-tight">
          Luna acts. Jev reviews.
        </p>
      </figcaption>
      <ol className="workflow-phases">
        {phases.map((phase, phaseIndex) => (
          <li key={phase.title}>
            <p className="workflow-phase-title">
              <span>{phaseIndex + 1}</span>
              {phase.title}
            </p>
            <ol className="workflow-steps" start={phaseIndex * 3 + 1}>
              {phase.steps.map((step, stepIndex) => (
                <li
                  key={step.action}
                  className={`workflow-step workflow-${step.actor.toLowerCase()}`}
                >
                  <span className="workflow-step-number" aria-hidden="true">
                    {String(phaseIndex * 3 + stepIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="workflow-actor">{step.actor}</span>
                    <p>{step.action}</p>
                  </div>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <p className="blog-muted mt-5 border-t pt-4 text-xs leading-relaxed">
        If a review rejects a submission, Luna returns to planning and gathers
        new evidence.
      </p>
    </figure>
  );
}
