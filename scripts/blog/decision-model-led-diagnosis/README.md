# Decision-model-led diagnosis figures

The initial article and figure labels/values were imported from the [source draft](https://docs.google.com/document/d/1HWgZfpiOtNraaqEQAKjgJndpKKyKEXMpW_e72mqe2Qo/edit).
The initial import preserved the draft verbatim. The website version is now
edited for continuity with the previous Jev posts. Its two monospace excerpts
remain selectable code blocks rather than screenshots.

Figures use SVGs with light and dark palettes, except Figure 5, which uses a
compact HTML comparison and an expandable full measurements table. The tool
inventory is an expandable reference. Data for all tables and decision panels lives in
`content/blog/_data/decision-model-led-diagnosis.json`, shared by the renderer
and the screen-reader-accessible tables. The workflow and decision panels have
dedicated mobile layouts. The workflow reads from top to bottom, with tool
execution branching to the side and returning to the list of possible tool calls.
Step labels and descriptions are shared between the desktop and mobile layouts.
Both layouts include a legend for programmatic, decision-model, and LLM steps.
The LLM review has separate agree/disagree paths. Agreement keeps the model's
root cause; disagreement applies the LLM's choice. Both feed the same evidence
selection and report-writing steps.
Decision probability bars share a fixed 0–1 scale;
the yes/no numbers are probabilities of yes, not confidence in the displayed no.

Use "tool" for a read-only capability and "tool call" for a specific use of that
tool on a supplied target. The prepared list contains possible tool calls;
`submit_now` is a separate request to stop, not a tool call. Do not use "checks"
as an umbrella term for these calls. Actual tests such as `client_check` retain
their names.

The 1000 × 630 SVG cover uses the same role colors and shows the investigation
loop followed by LLM review, decision-model evidence selection, and LLM report
writing. It appears on the blog listing, not at the start of the article, and
does not change the existing Open Graph title-card renderer.

The interactive agent comparison reuses the frozen first-party 21-fault results
from `content/blog/_data/jev-diagnosis.json`, not the live 17-fault leaderboard or
third-party submissions. All four decision-model points, with and without review, derive their
pass rates and per-diagnosis costs from this post's shared results table.
Both posts provide the same diagnosis-time/inference-cost toggle.

Mean diagnosis times are calculated from all 420 live CSV results, with 105
attempts per setup, including passing and failing diagnoses. Use the benchmark's
`phase.stage:diagnosis.duration_s` minus the fixed 120-second observation delay.
This stage ends at submission, before judging, and retains startup, collection,
tools, review, report writing, and submission overhead. It is not the sum of
phase averages. All displayed timing summaries in this post use arithmetic means.
The numeric-only audit data is in `content/blog/_data/decision-model-led-timings.json`;
no reports, prompts, or raw trajectories are copied into that file.
The DNS example matches `jev-review-2` (first action probability 0.62, final
submit probability 0.17); its stage duration is 164.263 s, or 44.263 s after the
observation delay is removed. Its narrative timing uses the same clock.

The supplied `blog3-scores.tar.gz` contains 420 live scores and the offline
review/report judgments. The 27 cases corrected by review (14 Luna, 13 Jev) require a failing
original report and passing reviewed report in both the initial and repeated
judgments; the single regression also holds across both judgments. The supplied
`blog3-trajectories.tar.gz` confirms the DNS example stops on `submit_twice`.
Neither archive supplies the question-rewrite replay summary, so its approximate
“about a third” result remains attributed to the draft's offline replay, not
presented as a newly measured live pass rate or an invented exact count.

The LLM comparison includes all three models with and without review. GPT-6 Sol's
rows use the main live experiments, including the separate no-review investigations.
The GPT-5.6 rows use offline review/report reruns of the saved reviewed investigations.
The section describes this difference; the GPT-6 Sol no-review row is not presented
as a full offline replay, since `before_g6` covers only the 42 changed-root-cause cases.

The full-measurements audit recomputes scores, pass counts, decision-model calls,
tokens and timing, and review/report timing from the supplied archives. It reads
only the final cumulative message snapshot in each trajectory to avoid counting
the same call repeatedly. Per-call mean latency is the summed duration divided by
the total number of calls, not a mean of per-run averages. The report-phase timer
includes decision-model evidence selection and report preparation, so it is not
an isolated LLM API latency. One Luna-reviewed report used a template after a
failed LLM attempt; its recorded report duration remains included.
Numeric audit data is in `content/blog/_data/decision-model-led-measurements.json`.
The regenerated trajectories omit LLM token/cache usage. At the user's request,
the supplied LLM token/cache counts and estimated costs are retained from the
draft rather than claimed to have been independently remeasured.

From the repository root, using Node.js:

```sh
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs --check
```

To regenerate or verify the means from the supplied score archive, using Python 3:

```sh
python3 scripts/blog/decision-model-led-diagnosis/summarize-timings.py /path/to/blog3-scores.tar.gz --write
python3 scripts/blog/decision-model-led-diagnosis/summarize-timings.py /path/to/blog3-scores.tar.gz --check
python3 scripts/blog/decision-model-led-diagnosis/summarize-measurements.py /path/to/blog3-scores.tar.gz /path/to/blog3-trajectories.tar.gz --check
```

If dimensions change, update the corresponding figure height in
`components/blog/decision-model-led-diagnosis/figures.tsx`. Check the article
and expanded figures at desktop/mobile widths and in both themes.
