import { ResearchFigure } from "@/components/blog/research-figure";
import data from "@/content/blog/_data/decision-model-led-diagnosis.json";
import "./figures.css";

// Heights match the generated SVG viewBoxes. See the renderer's README.
const figures = {
  1: {
    file: "workflow",
    height: 1520,
    mobileHeight: 1832,
    title: "Decision-model-led diagnosis workflow",
  },
  2: {
    file: "investigation-tools",
    height: 1030,
    title: "Cluster investigation tools",
  },
  3: {
    file: "first-decision",
    height: 823,
    mobileHeight: 949,
    title: "First decision",
  },
  4: {
    file: "last-decision",
    height: 792,
    mobileHeight: 919,
    title: "Last decision",
  },
  6: {
    file: "per-fault-results",
    height: 1216,
    title: "Passed diagnoses for each fault",
  },
  7: {
    file: "reviewer-comparison",
    height: 764,
    title: "LLM reviewer comparison",
  },
} as const;

type SectionedTable = {
  headers: string[];
  sections: { label: string; rows: string[][] }[];
};

function AccessibleTable({ headers, sections }: SectionedTable) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th scope="col" key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      {sections.map((section) => (
        <tbody key={section.label}>
          <tr>
            <th scope="rowgroup" colSpan={headers.length}>
              {section.label}
            </th>
          </tr>
          {section.rows.map(([label, ...values]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

function ResultsFigure({ caption }: { caption: string }) {
  const diagnosis = data.results.sections[0].rows;
  const costs = data.results.sections.at(-1)!.rows[0];
  const costPerAttempt = (column: number) =>
    costs[column].match(/\((\$[\d.]+) per attempt\)/)![1];

  return (
    <figure
      id="decision-model-results"
      className="research-figure decision-study-results not-prose"
      aria-labelledby="decision-model-results-caption"
    >
      <div className="decision-study-summary">
        {[
          { title: "Jev", withoutReview: 4, withReview: 3 },
          { title: "GPT-6 Luna Decisions", withoutReview: 2, withReview: 1 },
        ].map(({ title, withoutReview, withReview }) => (
          <table key={title}>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">No review</th>
                <th scope="col">With review</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Diagnosis passes</th>
                {[withoutReview, withReview].map((column) => {
                  const [count, rate] = diagnosis[0][column].split(" ");
                  return (
                    <td key={column}>
                      <strong>{rate.replace(/[()]/g, "")}</strong>
                      <span className="decision-study-count">{count}</span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <th scope="row">Median time</th>
                <td>{diagnosis[4][withoutReview]}</td>
                <td>{diagnosis[4][withReview]}</td>
              </tr>
              <tr>
                <th scope="row">Cost / diagnosis</th>
                <td>{costPerAttempt(withoutReview)}</td>
                <td>{costPerAttempt(withReview)}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
      <details className="decision-study-details">
        <summary>Full measurements: calls, tokens, latency and cost</summary>
        <div
          className="decision-study-table-scroll"
          role="region"
          aria-label="Full results on SREGym-Lite"
          tabIndex={0}
        >
          <AccessibleTable {...data.results} />
        </div>
      </details>
      <figcaption id="decision-model-results-caption">
        <p>
          <strong>Figure 5.</strong> {caption}
        </p>
      </figcaption>
    </figure>
  );
}

function FigureTranscript({ number }: { number: keyof typeof figures }) {
  if (number === 1) {
    return (
      <>
        <p>
          Blue blocks are programmatic steps, teal blocks are decision-model
          steps, and orange blocks are LLM steps.
        </p>
        <ol>
          <li>
            Collector: Read the cluster state, looking for changes and signs of
            failure.
          </li>
          <li>
            Collector: Check logs or workload state for early signs of failure.
          </li>
          <li>
            Orchestration: Build the tool menu by listing the checks the agent
            can run next.
          </li>
          <li>
            Decision model, one call per step: Choose a check and likely cause.
            Decide if more evidence is needed.
          </li>
          <li>
            If a check is selected: Run the read-only tool and add its result to
            the notes. Loop back to build the tool menu for the next step.
          </li>
          <li>
            When a stop rule or budget ends the investigation: The LLM reviews
            the root cause, but cannot run tools. If it agrees, the agent keeps
            the decision model&apos;s choice. If it disagrees, the agent
            replaces the cause with the LLM&apos;s choice from the supplied
            candidates. Both paths continue to evidence selection.
          </li>
          <li>
            Decision model: Keep the observations that support the final root
            cause.
          </li>
          <li>
            LLM: Write and submit the report using the selected evidence.
          </li>
        </ol>
      </>
    );
  }
  if (number === 2) {
    return (
      <table>
        <thead>
          <tr>
            {["Looks at", "Tool", "What it shows"].map((label) => (
              <th scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.tools.map(([group, tool, description]) => (
            <tr key={tool}>
              <td>{group}</td>
              <th scope="row">{tool}</th>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (number === 3 || number === 4) {
    const decision = data.decisions[number - 3];
    return (
      <>
        <p>
          Step {decision.step}. One request to Jev, {decision.latency}. Which
          tool should run next? Top 6 of 41 options.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Target</th>
              <th scope="col">Probability</th>
            </tr>
          </thead>
          <tbody>
            {decision.options.map(([tool, target, probability]) => (
              <tr key={`${tool}-${target}`}>
                <th scope="row">{tool}</th>
                <td>{target}</td>
                <td>{Number(probability).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Is the last result abnormal? {decision.abnormal >= 0.5 ? "Yes" : "No"}
          , probability of yes {decision.abnormal.toFixed(2)}. Is the evidence
          enough? {decision.enough >= 0.5 ? "Yes" : "No"}, probability of yes{" "}
          {decision.enough.toFixed(2)}.
        </p>
        <p>Where did the fault start?</p>
        <ul>
          {decision.causes.map(([cause, probability]) => (
            <li key={cause}>
              {cause}: {probability}
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (number === 7) return <AccessibleTable {...data.reviewers} />;
  return (
    <table>
      <thead>
        <tr>
          {data.faultResults.headers.map((label) => (
            <th scope="col" key={label}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.faultResults.rows.map(([fault, ...values]) => (
          <tr key={fault}>
            <th scope="row">{fault}</th>
            {values.map((value, index) => (
              <td key={index}>
                {value}/{data.faultResults.attempts}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DecisionModelFigure({
  number,
  caption,
}: {
  number: keyof typeof figures | 5;
  caption: string;
}) {
  if (number === 5) return <ResultsFigure caption={caption} />;
  const figure = figures[number];
  const src = `/blog/decision-model-led-diagnosis/${figure.file}.svg`;
  const mobileHeight =
    "mobileHeight" in figure ? figure.mobileHeight : undefined;
  const content = (
    <ResearchFigure
      id={`decision-model-${figure.file}`}
      number={number}
      title={figure.title}
      src={src}
      mobileSrc={mobileHeight ? src.replace(".svg", "-mobile.svg") : src}
      height={figure.height}
      mobileHeight={mobileHeight ?? Math.round((figure.height * 440) / 1200)}
      alt={caption}
      caption={caption}
    >
      <FigureTranscript number={number} />
    </ResearchFigure>
  );
  if (number === 2) {
    return (
      <details className="decision-study-details decision-study-tools not-prose">
        <summary>Explore the read-only tool menu · Figure 2</summary>
        {content}
      </details>
    );
  }
  return content;
}
