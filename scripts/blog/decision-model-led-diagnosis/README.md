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
execution branching to the side and returning to the menu. Step labels and
descriptions are shared between the desktop and mobile layouts.
Both layouts include a legend for programmatic, decision-model, and LLM steps.
The LLM review has separate agree/disagree paths. Agreement keeps the model's
root cause; disagreement applies the LLM's choice. Both feed the same evidence
selection and report-writing steps.
Decision probability bars share a fixed 0–1 scale;
the yes/no numbers are probabilities of yes, not confidence in the displayed no.

The interactive agent comparison reuses the frozen first-party 21-fault results
from `content/blog/_data/jev-diagnosis.json`, not the live 17-fault leaderboard or
third-party submissions. The two reviewed decision-model points derive their
pass rates and per-diagnosis costs from this post's shared results table.
Both posts provide the same diagnosis-time/inference-cost toggle.

Mean diagnosis times are calculated from all 420 live CSV results, with 105
attempts per setup, including passing and failing diagnoses. Use the benchmark's
`phase.stage:diagnosis.duration_s` minus the fixed 120-second observation delay.
This stage ends at submission, before judging, and retains startup, collection,
tools, review, report writing, and submission overhead. It is not the sum of
phase medians. Internal API-latency rows retain their separately labeled medians.
The numeric-only audit data is in `content/blog/_data/decision-model-led-timings.json`;
no reports, prompts, or raw trajectories are copied into that file.
The DNS example matches `jev-review-2` (first action probability 0.62, final
submit probability 0.17); its stage duration is 164.263 s, or 44.263 s after the
observation delay is removed. Its narrative timing uses the same clock.

The supplied `blog3-scores.tar.gz` contains 420 live scores and the offline
review/report judgments. The 27 catches (14 Luna, 13 Jev) require a failing
original report and passing reviewed report in both the initial and repeated
judgments; the single regression also holds across both judgments. The supplied
`blog3-trajectories.tar.gz` confirms the DNS example stops on `submit_twice`.
Neither archive supplies the question-rewrite replay summary, so its approximate
“about a third” result remains attributed to the draft's offline replay, not
presented as a newly measured live pass rate or an invented exact count.

From the repository root, using Node.js:

```sh
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs --check
```

To regenerate or verify the means from the supplied score archive, using Python 3:

```sh
python3 scripts/blog/decision-model-led-diagnosis/summarize-timings.py /path/to/blog3-scores.tar.gz --write
python3 scripts/blog/decision-model-led-diagnosis/summarize-timings.py /path/to/blog3-scores.tar.gz --check
```

If dimensions change, update the corresponding figure height in
`components/blog/decision-model-led-diagnosis/figures.tsx`. Check the article
and expanded figures at desktop/mobile widths and in both themes.
