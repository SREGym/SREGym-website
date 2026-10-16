# Decision-model-led diagnosis figures

The article and figure labels/values come from the [source draft](https://docs.google.com/document/d/1HWgZfpiOtNraaqEQAKjgJndpKKyKEXMpW_e72mqe2Qo/edit).
The article's wording is intentionally unchanged. Its two monospace excerpts
are rendered as selectable code blocks rather than screenshots.

The seven numbered figures are SVGs with light and dark palettes. Data for the
tables and decision panels lives in
`content/blog/_data/decision-model-led-diagnosis.json`, shared by the renderer
and the screen-reader-accessible tables. The workflow is drawn in the renderer.

From the repository root, using Node.js:

```sh
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs
node scripts/blog/decision-model-led-diagnosis/render-figures.mjs --check
```

If dimensions change, update the corresponding figure height in
`components/blog/decision-model-led-diagnosis/figures.tsx`. Check the article
and expanded figures at desktop/mobile widths and in both themes.
