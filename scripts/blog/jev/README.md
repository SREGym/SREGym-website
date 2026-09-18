# Jev figures

This directory owns the renderer for the Jev article. The canonical benchmark
data and display labels live in `content/blog/_data/jev-results.json`, shared
with the article's screen-reader-accessible results table.

## Setup and regeneration

Run from the repository root with Python 3.9 or newer:

```sh
python3 -m venv scripts/blog/jev/.venv
scripts/blog/jev/.venv/bin/python -m pip install -r scripts/blog/jev/requirements.txt
scripts/blog/jev/.venv/bin/python scripts/blog/jev/render_figures.py
```

Only the five SVGs used by the site are generated in `public/blog/jev/`:
`cover.svg`, `decision-loop.svg`, `decision-loop-mobile.svg`,
`fault-results.svg`, and `fault-results-mobile.svg`. Desktop and mobile SVGs
include light and dark palettes. PNG exports and superseded diagrams are not
maintained because the site does not use them.

Verify the committed figures without modifying them:

```sh
scripts/blog/jev/.venv/bin/python scripts/blog/jev/render_figures.py --check
```

The committed figures use Arial. Matplotlib falls back to DejaVu Sans if Arial
is unavailable; that can change text metrics and fail the byte-for-byte check.
Use the same font environment when regenerating, and visually inspect changes
in both themes and at desktop/mobile widths before committing.

Update labels and scores in the shared JSON, not directly in generated SVGs.
The renderer validates the ten-problem experiment, score bounds, and narrative
totals before saving. A different experiment also requires updating those
assertions and the article's narrative.
