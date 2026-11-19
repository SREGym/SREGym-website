import { renderToString } from "katex";
import "katex/dist/katex.min.css";

const equations = [
  {
    desktop: String.raw`\text{Score from a victim} = \text{victim probability} \times \text{probability of choosing the candidate next}`,
    mobile: String.raw`\begin{gathered}
      \text{Score from a victim} \\[0.5em]
      = \text{victim probability} \times \\
      \text{probability of choosing the candidate next}
    \end{gathered}`,
  },
  {
    desktop: String.raw`\text{Candidate score} = \max\!\left(\text{own origin probability},\;\text{highest score from a victim}\right)`,
    mobile: String.raw`\begin{gathered}
      \text{Candidate score} \\[0.5em]
      = \max\!\left\{\begin{array}{l}
        \text{own origin probability}, \\
        \text{highest score from a victim}
      \end{array}\right\}
    \end{gathered}`,
  },
];

function render(tex: string) {
  return renderToString(tex, {
    displayMode: true,
    output: "htmlAndMathml",
    throwOnError: true,
    trust: false,
    strict: "error",
  });
}

export function PipelineScoringEquations() {
  return (
    <div
      className="pipeline-equations not-prose"
      role="group"
      aria-label="Candidate scoring equations"
    >
      {equations.map((equation, index) => (
        <div className="pipeline-equation" key={index}>
          <div
            className="pipeline-equation-desktop"
            dangerouslySetInnerHTML={{ __html: render(equation.desktop) }}
          />
          <div
            className="pipeline-equation-mobile"
            dangerouslySetInnerHTML={{ __html: render(equation.mobile) }}
          />
        </div>
      ))}
    </div>
  );
}
