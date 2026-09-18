import { ResearchFigure } from "@/components/blog/research-figure";
import results from "@/content/blog/_data/jev-results.json";

export function JevResults() {
  const { attempts_per_problem: attempts, results: rows } = results;
  const totalAttempts = attempts * rows.length;
  const withoutJev = rows.reduce((sum, row) => sum + row.without_jev, 0);
  const withJev = rows.reduce((sum, row) => sum + row.with_jev, 0);

  return (
    <ResearchFigure
      id="jev-fault-results"
      number={2}
      title="Results by SRE problem"
      src="/blog/jev/fault-results.svg"
      mobileSrc="/blog/jev/fault-results-mobile.svg"
      height={920}
      mobileHeight={1070}
      alt={`Successful attempts per SRE problem, with and without Jev, out of ${attempts}. Total passes: ${withoutJev}/${totalAttempts} without Jev and ${withJev}/${totalAttempts} with Jev. Exact values follow in the results table.`}
      caption="Successful attempts per SRE problem, with and without Jev."
    >
      <table>
        <caption>
          Results by SRE problem: successful attempts out of {attempts}
        </caption>
        <thead>
          <tr>
            <th scope="col">SRE problem</th>
            <th scope="col">Without Jev</th>
            <th scope="col">With Jev</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.problem}>
              <th scope="row">
                {row.label} ({row.problem})
              </th>
              <td>
                {row.without_jev}/{attempts}
              </td>
              <td>
                {row.with_jev}/{attempts}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total passes</th>
            <td>
              {withoutJev}/{totalAttempts}
            </td>
            <td>
              {withJev}/{totalAttempts}
            </td>
          </tr>
        </tfoot>
      </table>
    </ResearchFigure>
  );
}
