import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.SEO_TEST_URL ?? "http://localhost:3000";

async function get(path) {
  return fetch(new URL(path, baseUrl), {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
}

test("robots.txt advertises one sitemap and permits public pages", async () => {
  const response = await get("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/plain/);
  const robots = await response.text();
  assert.match(robots, /^User-Agent: \*$/im);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  const sitemaps = [...robots.matchAll(/^Sitemap: (.+)$/gm)];
  assert.equal(sitemaps.length, 1);
  const url = new URL(sitemaps[0][1].trim());
  assert.equal(url.protocol, "https:");
  assert.equal(url.pathname, "/sitemap.xml");
});

test("sitemap contains every listed blog article and only public destinations", async () => {
  const response = await get("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /xml/);
  const xml = await response.text();
  assert.match(
    xml,
    /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/,
  );
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.ok(urls.length > 0);
  assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap entries");
  const paths = urls.map((url) => new URL(url).pathname);
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.origin, new URL(urls[0]).origin);
    assert.equal(parsed.search, "");
    assert.equal(parsed.hash, "");
  }
  for (const path of ["/", "/blog", "/leaderboard"]) {
    assert.ok(paths.includes(path), `Missing ${path}`);
  }
  for (const path of paths) {
    assert.ok(!path.startsWith("/docs") && !path.startsWith("/api/"));
    assert.ok(
      !["/about", "/problems", "/ascii-logo", "/contributors"].includes(path),
    );
    assert.ok(!path.startsWith("/problems/cohorts/"));
    assert.ok(!path.endsWith("/share-image"));
  }

  const blogResponse = await get("/blog");
  assert.equal(blogResponse.status, 200);
  const html = await blogResponse.text();
  const articles = new Set(
    [...html.matchAll(/href="(\/blog\/[^"?#]+)"/g)].map(([, path]) => path),
  );
  assert.ok(articles.size > 0);
  for (const article of articles) {
    assert.ok(paths.includes(article), `Missing article: ${article}`);
    assert.equal((await get(article)).status, 200);
  }

  // Sample a catalog URL to catch incorrect IDs/path construction.
  const problem = paths.find(
    (path) =>
      path.startsWith("/problems/") && !path.startsWith("/problems/cohorts/"),
  );
  assert.ok(problem, "Problem catalog is absent");
  assert.equal((await get(problem)).status, 200);
});
