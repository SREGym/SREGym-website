import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const baseUrl = process.env.BLOG_TEST_URL ?? "http://localhost:3000";
const results = JSON.parse(
  await readFile(
    new URL("../../content/blog/_data/jev-results.json", import.meta.url),
    "utf8",
  ),
);

async function get(path) {
  return fetch(new URL(path, baseUrl), {
    headers: { "User-Agent": "Twitterbot/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
}

const pages = [
  { path: "/blog" },
  { path: "/blog/jev-sregym-lite", authors: 4 },
  { path: "/blog/jev-driven-sre-diagnosis", authors: 4 },
  { path: "/blog/postmortems-to-sre-benchmarks", authors: 11 },
  { path: "/blog/frontier-data-summit", authors: 2 },
  { path: "/blog/decision-model-led-sre-diagnosis", authors: 5 },
];

for (const { path, authors } of pages) {
  test(`${path}: crawler metadata and sharing image`, async () => {
    const response = await get(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const head = html.split("</head>")[0];
    const tags = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) =>
      Object.fromEntries(
        [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
          key,
          value,
        ]),
      ),
    );
    const meta = (key) =>
      tags
        .filter((tag) => tag.name === key || tag.property === key)
        .map((tag) => tag.content);
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.equal(new URL(canonical).protocol, "https:");
    assert.equal(new URL(canonical).pathname, path);
    assert.equal(meta("description").length, 1);
    assert.ok(meta("description")[0].length > 80);
    assert.deepEqual(meta("og:url"), [canonical]);
    assert.deepEqual(meta("og:image"), [`${canonical}/share-image`]);
    assert.deepEqual(meta("twitter:image"), meta("og:image"));
    assert.deepEqual(meta("twitter:card"), ["summary_large_image"]);
    assert.deepEqual(meta("og:type"), [
      path === "/blog" ? "website" : "article",
    ]);

    if (path === "/blog") {
      assert.ok(html.includes('src="/blog/jev-diagnosis/cover.svg"'));
    }

    if (path !== "/blog") {
      const schema = JSON.parse(
        html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
      );
      assert.equal(schema["@type"], "BlogPosting");
      assert.equal(schema.url, canonical);
      assert.equal(schema.image, meta("og:image")[0]);
      assert.equal(schema.datePublished, meta("article:published_time")[0]);
      assert.equal(schema.author.length, authors);
    }

    if (path === "/blog/jev-sregym-lite") {
      assert.ok(html.includes('src="/blog/jev/cover.svg"'));
      const table = html.match(/<table\b[^>]*>(.*?)<\/table>/s)?.[1];
      assert.ok(table, "The results need a text-accessible table");
      const tableRows = [...table.matchAll(/<tr>(.*?)<\/tr>/gs)].map(
        ([, row]) => row,
      );
      for (const row of results.results) {
        const values = tableRows.find((value) => value.includes(row.problem));
        assert.ok(values, `Missing accessible results for ${row.problem}`);
        // React may insert comment separators between dynamic text nodes.
        const cells = [
          ...values.replace(/<!--.*?-->/g, "").matchAll(/<td>(.*?)<\/td>/gs),
        ].map(([, value]) => value);
        assert.deepEqual(
          cells,
          [row.without_jev, row.with_jev].map(
            (value) => `${value}/${results.attempts_per_problem}`,
          ),
        );
      }
    }

    const image = await get(`${path}/share-image`);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get("content-type"), "image/png");
    const png = Buffer.from(await image.arrayBuffer());
    assert.equal(png.readUInt32BE(16), Number(meta("og:image:width")[0]));
    assert.equal(png.readUInt32BE(20), Number(meta("og:image:height")[0]));
    assert.ok(png.length < 5 * 1024 * 1024);
  });
}

test("decision-model comparison uses only our matching 21-fault results", async () => {
  const response = await get("/blog/decision-model-led-sre-diagnosis");
  assert.equal(response.status, 200);
  const html = await response.text();
  const chart = html.match(
    /<figure\b[^>]*id="decision-model-agent-comparison"[^>]*>(.*?)<\/figure>/s,
  )?.[1];
  assert.ok(chart, "The article needs the interactive comparison");
  const previous = JSON.parse(
    await readFile(
      new URL("../../content/blog/_data/jev-diagnosis.json", import.meta.url),
      "utf8",
    ),
  );
  const study = JSON.parse(
    await readFile(
      new URL(
        "../../content/blog/_data/decision-model-led-diagnosis.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const timings = JSON.parse(
    await readFile(
      new URL(
        "../../content/blog/_data/decision-model-led-timings.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(previous.comparison.cohort, "SREGym-Lite-0904");
  assert.equal(previous.comparison.faultIds.length, 21);
  assert.equal(study.faultResults.rows.length, 21);
  assert.deepEqual(
    previous.comparison.faultIds
      .map((id) =>
        id.replace(/_(hotel_reservation|social_network|astronomy_shop)$/, ""),
      )
      .sort(),
    study.faultResults.rows.map(([id]) => id).sort(),
  );
  const labels = [
    ...chart.matchAll(/<g\b[^>]*role="button"[^>]*aria-label="([^"]+)"/g),
  ].map(([, label]) => label);
  assert.equal(labels.length, 14);
  for (const row of previous.comparison.models) {
    assert.ok(
      ["Jev-driven pipeline", "Codex", "Claude Code"].includes(row.agent),
    );
    assert.ok(
      labels.some((label) =>
        label.startsWith(
          `${row.label}, ${row.agent}: ${row.passRate.toFixed(1)}%`,
        ),
      ),
    );
    assert.equal(row.attempts, row.id === "jev" ? 105 : 63);
  }
  for (const [column, model, timingId] of [
    [1, "GPT-6 Luna Decisions", "luna-review"],
    [3, "Jev", "jev-review"],
  ]) {
    const [, passed, attempts] =
      study.results.sections[0].rows[0][column].match(/^(\d+)\/(\d+)/);
    const [, cost] = study.results.sections
      .at(-1)
      .rows[0][column].match(/\(\$([\d.]+) per attempt\)/);
    const rate = ((Number(passed) / Number(attempts)) * 100).toFixed(1);
    const meanTime = timings.configurations
      .find((entry) => entry.id === timingId)
      .meanDiagnosisSeconds.toFixed(1);
    assert.ok(
      labels.includes(
        `${model} with LLM review, Decision-model-led agent: ${rate}% pass rate, ${meanTime} seconds, inference cost $${Number(cost).toFixed(3)}`,
      ),
    );
  }
  assert.ok(!chart.includes("CloudThinker"));
  assert.ok(!chart.includes("Devin Oncall"));
  assert.ok(
    chart.includes('aria-label="Horizontal axis"'),
    "Both axes now use means",
  );
  assert.ok(chart.includes("Diagnosis time"));
  assert.ok(chart.includes("Inference cost"));
  assert.ok(html.includes("Mean diagnosis time"));
  assert.ok(!html.includes("Median diagnosis time"));
  assert.ok(chart.includes("mean inference cost"));
  assert.ok(chart.includes("review and report writing"));
});

test("Jev-driven diagnosis article includes accessible measurements and the workflow image", async () => {
  const response = await get("/blog/jev-driven-sre-diagnosis");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes("80/105 (76.2%)"));
  assert.ok(html.includes("21 faults"));
  assert.ok(!html.includes("17 shared faults"));
  assert.ok(!html.includes("60/85"));
  assert.ok(html.includes("$0.880"));
  assert.ok(html.includes("$0.00139"));
  assert.ok(
    !html.includes("Only Jev has a verified diagnosis-stage inference cost"),
  );
  assert.ok(html.includes("mutating_webhook_resource_limits_social_network"));
  assert.ok(html.includes('aria-label="Search Jev faults"'));
  assert.ok(!html.includes('aria-label="Download comparison data"'));
  assert.ok(html.includes("historical 21-fault cohort"));
  assert.ok(!html.includes('aria-label="Axis scale"'));
  assert.ok(!html.includes('class="jev-point-ring"'));
  assert.ok(!html.includes('class="jev-label-leader"'));
  const labels = [
    ...html.matchAll(
      /<text\b[^>]*class="jev-point-label[^\"]*"[^>]*>(.*?)<\/text>/gs,
    ),
  ];
  assert.equal(
    labels.length,
    12,
    "Every plotted model should have a permanent label",
  );
  assert.ok(labels.some((label) => label[1].includes("Jev 1.13.0")));
  assert.ok(labels.some((label) => label[1].includes("GPT-6 Astra")));
  assert.ok(labels.some((label) => label[1].includes("Claude Opus 5")));
  assert.ok(!html.includes("PIPELINE_FIGURE"));
  assert.ok(!html.includes("\u000b"));
  assert.ok(html.includes("/blog/jev-diagnosis/workflow-mobile.svg"));
  assert.ok(!html.includes('src="/blog/jev-diagnosis/cover.svg"'));
  const cover = await get("/blog/jev-diagnosis/cover.svg");
  assert.equal(cover.status, 200);
  assert.match(cover.headers.get("content-type"), /image\/svg\+xml/);
  const coverSvg = await cover.text();
  assert.ok(coverSvg.includes('viewBox="0 0 1000 630"'));
  assert.match(coverSvg, /prefers-color-scheme:\s*dark/);
  assert.ok(coverSvg.includes('id="review-box"'));
  assert.ok(coverSvg.includes("Cause supported"));
  assert.ok(coverSvg.includes("Otherwise: next component"));
  for (const file of ["workflow.svg", "workflow-mobile.svg"]) {
    const workflow = await get(`/blog/jev-diagnosis/${file}`);
    assert.equal(workflow.status, 200);
    assert.match(workflow.headers.get("content-type"), /image\/svg\+xml/);
    const svg = await workflow.text();
    assert.ok(svg.includes("prefers-color-scheme: dark"));
    assert.ok(svg.includes("Origin supported"));
    assert.ok(svg.includes("Victim"));
    assert.ok(svg.includes("Repeat with the next candidate"));
    assert.ok(svg.includes("Submit the diagnosis"));
  }
});

test("postmortem article preserves its reference tables and omits draft placeholders", async () => {
  const response = await get("/blog/postmortems-to-sre-benchmarks");
  const html = await response.text();
  const article = html.match(/<article\b[^>]*>(.*?)<\/article>/s)?.[1];
  assert.ok(article, "Missing article content");
  assert.ok(!article.includes("[[FIGURE]]"));
  assert.ok(!article.includes("postmodern"));
  const tables = [...article.matchAll(/<table\b[^>]*>(.*?)<\/table>/gs)];
  assert.equal(tables.length, 2);
  // The source has 31 populated problem entries and 29 contributors.
  assert.equal([...tables[0][1].matchAll(/<tr\b/g)].length, 32);
  assert.equal([...tables[1][1].matchAll(/<tr\b/g)].length, 30);
  assert.ok(article.includes("https://github.com/SREGym/SREGym/issues/779"));
  assert.ok(article.includes("https://uiuc-srse.github.io/"));
  assert.ok(html.includes('src="/blog/postmortems/overview.svg"'));
  const image = await get("/blog/postmortems/overview.svg");
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type"), /image\/svg\+xml/);
  const svg = await image.text();
  assert.ok(svg.includes('viewBox="0 0 800 500"'));
  assert.ok(svg.includes("prefers-color-scheme: dark"));
  assert.ok(svg.includes("Postmortem reports"));
  assert.ok(svg.includes("SREGym problems"));
});

test("missing articles and sharing images return 404", async () => {
  for (const path of [
    "/blog/no-such-article",
    "/blog/no-such-article/share-image",
  ]) {
    assert.equal((await get(path)).status, 404);
  }
});

test("decision-model article retains full measurements and fixed-scale decision panels", async () => {
  const data = JSON.parse(
    await readFile(
      new URL(
        "../../content/blog/_data/decision-model-led-diagnosis.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const response = await get("/blog/decision-model-led-sre-diagnosis");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(
    html.includes("Full measurements: calls, tokens, latency and cost"),
  );
  assert.ok(html.includes("Explore the read-only tool menu"));
  assert.ok(html.includes("offline question-replay result"));
  assert.ok(!html.includes("/decision-model-led-diagnosis/results.svg"));
  for (const section of data.results.sections) {
    for (const row of section.rows) {
      for (const value of row)
        assert.ok(html.includes(value), `Missing measurement: ${value}`);
    }
  }
  for (const [index, name] of ["first-decision", "last-decision"].entries()) {
    for (const suffix of ["", "-mobile"]) {
      const response = await get(
        `/blog/decision-model-led-diagnosis/${name}${suffix}.svg`,
      );
      assert.equal(response.status, 200);
      const svg = await response.text();
      const width = (suffix ? 330 : 470) * data.decisions[index].options[0][2];
      assert.ok(svg.includes(`width="${width}"`));
      assert.ok(
        svg.includes(`P(yes) = ${data.decisions[index].enough.toFixed(2)}`),
      );
      assert.match(svg, /prefers-color-scheme:\s*dark/);
    }
  }
  const passes = data.faultResults.rows.reduce(
    (totals, [, ...values]) =>
      totals.map((total, index) => total + values[index]),
    [0, 0, 0, 0],
  );
  assert.deepEqual(passes, [100, 83, 94, 82]);
});

test("Frontier Data Summit article preserves its sections, links, and supplied images", async () => {
  const response = await get("/blog/frontier-data-summit");
  assert.equal(response.status, 200);
  const html = await response.text();
  const article = html.match(/<article\b[^>]*>(.*?)<\/article>/s)?.[1];
  assert.ok(article, "Missing summit article content");
  assert.ok(!article.includes("\u000b"));
  assert.ok(article.includes("https://www.frontierdatasummit.ai/"));
  assert.ok(article.includes("https://snorkel.ai/"));
  for (const heading of [
    "A Refreshing Perspective on AI Eval Research",
    "SREGym at the Poster Session",
    "The Community Behind SREGym",
    "Looking Ahead: SREGym 2.0",
  ]) {
    assert.ok(article.includes(heading), `Missing section: ${heading}`);
  }
  assert.ok(article.includes("more than 60 contributors"));
  assert.ok(article.includes("280 members"));
  assert.ok(article.includes("environment scaling"));
  for (const [file, width, height] of [
    ["featured-poster.png", 2048, 1072],
    ["sregym-poster.png", 1130, 1596],
  ]) {
    assert.ok(article.includes(file), `Missing supplied image: ${file}`);
    const image = await get(`/blog/frontier-data-summit/${file}`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type"), /image\/png/);
    const png = Buffer.from(await image.arrayBuffer());
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
  }
});
