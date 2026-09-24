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
  { path: "/blog/postmortems-to-sre-benchmarks", authors: 10 },
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
