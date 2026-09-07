import fs from "fs";
import path from "path";

export const SREGYM_0508_CATEGORIES = [
  "Ported",
  "Similar Failures",
  "New Failures",
] as const;

export type Sregym0508Category = (typeof SREGYM_0508_CATEGORIES)[number];

export type CohortProblem = {
  id: string;
  category: Sregym0508Category;
};

export type LiteCohortProblem = {
  id: string;
};

const SREGYM_0508_MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "sregym-0508-problems.csv",
);

const SREGYM_LITE_0720_MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "sregym-lite-0720-problems.csv",
);

const SREGYM_LITE_0904_MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "sregym-lite-0904-problems.csv",
);

export function getSregym0508Problems(): CohortProblem[] {
  const [, ...rows] = fs
    .readFileSync(SREGYM_0508_MANIFEST_PATH, "utf-8")
    .trim()
    .split("\n");

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

function getLiteCohortProblems(
  manifestPath: string,
  cohortName: string,
  expectedCount: number,
): LiteCohortProblem[] {
  const [, ...rows] = fs.readFileSync(manifestPath, "utf-8").trim().split("\n");

  const problems = rows.map((row) => {
    const id = row.trim();

    if (!id) {
      throw new Error(`Invalid ${cohortName} cohort row`);
    }

    return { id };
  });

  if (problems.length !== expectedCount) {
    throw new Error(
      `${cohortName} must contain exactly ${expectedCount} problems; found ${problems.length}`,
    );
  }

  if (new Set(problems.map((problem) => problem.id)).size !== problems.length) {
    throw new Error(`${cohortName} contains duplicate problem IDs`);
  }

  return problems;
}

export function getSregymLite0904Problems(): LiteCohortProblem[] {
  return getLiteCohortProblems(
    SREGYM_LITE_0904_MANIFEST_PATH,
    "SREGym-Lite-0904",
    21,
  );
}

export function getSregymLite0720Problems(): LiteCohortProblem[] {
  return getLiteCohortProblems(
    SREGYM_LITE_0720_MANIFEST_PATH,
    "SREGym-Lite-0720",
    20,
  );
}
