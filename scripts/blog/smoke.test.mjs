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

for (const path of ["/blog", "/blog/jev-sregym-lite"]) {
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
      assert.equal(schema.author.length, 4);
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

test("missing articles and sharing images return 404", async () => {
  for (const path of [
    "/blog/no-such-article",
    "/blog/no-such-article/share-image",
  ]) {
    assert.equal((await get(path)).status, 404);
  }
});
