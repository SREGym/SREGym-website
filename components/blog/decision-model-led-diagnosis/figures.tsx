import { ResearchFigure } from "@/components/blog/research-figure";
import data from "@/content/blog/_data/decision-model-led-diagnosis.json";

// Heights match the generated SVG viewBoxes. See the renderer's README.
const figures = {
  1: {
    file: "workflow",
    height: 1450,
    title: "Decision-model-led diagnosis workflow",
  },
  2: {
    file: "investigation-tools",
    height: 1030,
    title: "Cluster investigation tools",
  },
  3: { file: "first-decision", height: 823, title: "First decision" },
  4: { file: "last-decision", height: 792, title: "Last decision" },
  5: { file: "results", height: 1840, title: "Results on SREGym-Lite" },
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

function FigureTranscript({ number }: { number: keyof typeof figures }) {
  if (number === 1) {
    return (
      <ol>
        <li>
          Programmatic: Read the cluster. Workloads, pods, Services, events,
          changes, error lines and an anomaly score for each component.
        </li>
        <li>
          Programmatic: Run the first tools. Logs or describe of the two
          top-scoring components.
        </li>
        <li>
          Programmatic: List the options. Up to 40 tool × target options,
          highest scores first.
        </li>
        <li>
          Decision Model, one call per step: What next, and is it enough? Next
          tool; is the last result abnormal? Error kinds; is the evidence
          enough? Where did the fault start?
        </li>
        <li>
          If not yet: Run the chosen tool. The result becomes a new observation.
          Loop back to list the options for the next step.
        </li>
        <li>
          If enough and sure, asked to stop, or out of budget: LLM reviews the
          conclusion. Pick the root cause from the top candidates. If it
          disagrees, replace the root cause with the LLM&apos;s pick; if it
          agrees, keep the root cause.
        </li>
        <li>
          Decision Model: Pick the supporting evidence. One yes or no per
          observation.
        </li>
        <li>
          LLM: Write the report and submit. From the chosen observations only.
        </li>
      </ol>
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
          Is the last result abnormal? {decision.abnormal}. Is the evidence
          enough? {decision.enough}.
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
  if (number === 5) return <AccessibleTable {...data.results} />;
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
  number: keyof typeof figures;
  caption: string;
}) {
  const figure = figures[number];
  const src = `/blog/decision-model-led-diagnosis/${figure.file}.svg`;
  return (
    <ResearchFigure
      id={`decision-model-${figure.file}`}
      number={number}
      title={figure.title}
      src={src}
      mobileSrc={src}
      height={figure.height}
      mobileHeight={Math.round((figure.height * 440) / 1200)}
      alt={caption}
      caption={caption}
    >
      <FigureTranscript number={number} />
    </ResearchFigure>
  );
}
