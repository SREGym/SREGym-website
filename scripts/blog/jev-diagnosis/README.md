# Jev-driven diagnosis post

The article at `content/blog/jev-driven-sre-diagnosis.mdx` was imported from the latest [Google Doc](https://docs.google.com/document/d/1eDNoJTL4nDEKuV28wSNrsrg7Klx51oyU_8-_ilWtuN8/edit) on October 6, 2026. The Doc was read without modification. The article retains its findings, with light copy edits and clarifications of the historical cohort and comparison methods. It adds an interactive reference comparison and an expandable attempt table.

`content/blog/_data/jev-diagnosis.json` contains aggregate measurements only. No raw Kubernetes objects, logs, Secrets, submissions, or authentication data are included. The original campaign has 21 faults and 105 attempts; passes and scores come from the complete `gpt-6-astra` high rejudgment. Times exclude the fixed 120-second benchmark observation delay and judge execution. The diagram is a simplified view of the pipeline, not a complete transition policy.

The chart uses the full **21-fault SREGym-Lite-0904 cohort** throughout. Jev has 105 attempts and 80 diagnosis passes. The 11 first-party baselines each have 63 attempts. Their 21-fault diagnosis rates and mean times were recovered from the existing source-data audit of `SREGym-runs/all_runs.csv` and per-configuration `results.csv` files. That audit reproduced the original 21-fault figures before filtering to the later 17-fault leaderboard. None of the 17-fault rates or times are used in this chart. CloudThinker is excluded.

All axes use diagnosis-stage measurements. Time is a mean for every plotted configuration; the headline remains the median of all 105 Jev attempts. Cost is API-equivalent inference cost per attempt, including failed diagnoses, and excludes judges, repair and infrastructure. The user supplied the diagnosis-only cost table for all 11 baselines on October 6, 2026. It was calculated from per-step token usage through diagnosis submission, with cached-input discounts and cache-write charges. One Opus 4.8 attempt ended without diagnosis submission, and its recorded spend is still included in the 63-attempt mean. These values are estimates at standard API prices, not billing receipts.

Jev's cost uses all 3,478,789 recorded input tokens at [TypeSafe's price](https://docs.typesafe.ai/models) of $0.042 per million. Output tokens are free. This gives $0.146109138 across 105 attempts, or $0.0013915156 per attempt. Baseline costs are supplied to three decimal places; Jev is displayed to five because of its smaller cost. Full-run diagnosis-plus-repair costs are not substituted.

This is a comparison across separate experiments on the same cohort, not a matched decision-layer ablation. Judge equivalence is not established. No frontier is drawn because not all model and reasoning configurations are covered. The saved JSON is a fixed snapshot; update cohort IDs, all three metrics, denominators, sources and tests together when adding data.

Model names and reasoning efforts are permanently labeled close to their points, without connector lines. Cost uses a fixed logarithmic axis, and time uses a fixed linear axis. Hovering or keyboard focus opens a tooltip with all three measurements and fades the other points. Touch or keyboard activation also opens the tooltip. There are no selection rings or additional panels beneath the chart. Escape dismisses the tooltip. On narrow screens the chart can be scrolled horizontally so the labels remain readable.

The workflow SVGs in `public/blog/jev-diagnosis/` follow the host image's color scheme. The mobile variant stacks the alternative outcomes, retaining the confirmation step and both return paths. The expanded figure uses the desktop variant. Keep their decisions and loop behavior in sync when editing the diagram.

Checks:

```sh
npm run typecheck
node --test scripts/blog/jev-diagnosis/data.test.mjs
# With the site running locally:
npm run test:blog
npm run test:seo
npm run build
npm run test:blog:build
```
