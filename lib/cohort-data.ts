import fs from "fs";
import path from "path";

export const SREGYM_0508_CATEGORIES = [
  "Ported",
  "Similar Failures",
  "New Failures",
] as const;

export type Sregym0508Category =
  (typeof SREGYM_0508_CATEGORIES)[number];

export type CohortProblem = {
  id: string;
  category: Sregym0508Category;
};

const MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "sregym-0508-problems.csv",
);

export function getSregym0508Problems(): CohortProblem[] {
  const [, ...rows] = fs.readFileSync(MANIFEST_PATH, "utf-8").trim().split("\n");

  const problems = rows.map((row) => {
    const separator = row.indexOf(",");
    const id = row.slice(0, separator);
    const category = row.slice(separator + 1) as Sregym0508Category;

    if (!id || !SREGYM_0508_CATEGORIES.includes(category)) {
      throw new Error(`Invalid SREGym-0508 cohort row: ${row}`);
    }

    return { id, category };
  });

  if (problems.length !== 90) {
    throw new Error(
      `SREGym-0508 must contain exactly 90 problems; found ${problems.length}`,
    );
  }

  return problems;
}
