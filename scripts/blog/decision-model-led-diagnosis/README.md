# Decision-model-led diagnosis figures

The article and figure labels/values come from the [source draft](https://docs.google.com/document/d/1HWgZfpiOtNraaqEQAKjgJndpKKyKEXMpW_e72mqe2Qo/edit).
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

If dimensions change, update the corresponding figure height in
`components/blog/decision-model-led-diagnosis/figures.tsx`. Check the article
and expanded figures at desktop/mobile widths and in both themes.
