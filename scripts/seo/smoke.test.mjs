import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import test from "node:test";

const baseUrl = process.env.SEO_TEST_URL ?? "http://localhost:3000";
const canonicalOrigin = "https://www.sregym.com";

async function get(path, userAgent = "Twitterbot/1.0") {
  return fetch(new URL(path, baseUrl), {
    redirect: "manual",
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(30_000),
  });
}

// Fetch may ignore a supplied Host header. Use HTTP requests to exercise the
// actual host-based redirect without needing to change local DNS.
async function getWithHost(path, host) {
  const url = new URL(path, baseUrl);
  const request = url.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise((resolve, reject) => {
    const req = request(url, { headers: { Host: host } }, (response) => {
      response.resume();
      resolve(response);
    });
    req.on("error", reject);
    req.setTimeout(30_000, () => req.destroy(new Error("Request timed out")));
    req.end();
  });
}

async function assertCanonical(path, userAgent) {
  const response = await get(path, userAgent);
  assert.equal(response.status, 200, path);
  const head = (await response.text()).split("</head>")[0];
  const canonicals = [
    ...head.matchAll(/<link rel="canonical" href="([^"]+)"/g),
  ].map(([, url]) => new URL(url).href);
  const pathname = new URL(path, baseUrl).pathname;
  assert.deepEqual(canonicals, [new URL(pathname, canonicalOrigin).href], path);
}

test("public pages declare their own www canonical without tracking parameters", async () => {
  for (const path of [
    "/",
    "/leaderboard",
    "/contributors",
    "/stratus",
    "/ascii-logo",
    "/problems/cohorts/sregym-0508",
    "/problems/cohorts/sregym-lite",
    "/problems/cohorts/sregym-lite-0720",
    "/leaderboard?utm_source=linkedin&utm_medium=social",
  ]) {
    await assertCanonical(path);
  }
});

test("Googlebot and browsers receive canonical tags in the initial HTML head", async () => {
  for (const userAgent of ["Googlebot", "Mozilla/5.0"]) {
    for (const path of ["/", "/leaderboard", "/blog/jev-driven-sre-diagnosis"]) {
      await assertCanonical(path, userAgent);
    }
  }
});

test("non-www redirects permanently to www, preserving paths and query strings", async () => {
  for (const path of [
    "/",
    "/leaderboard?utm_source=linkedin&utm_medium=social",
    "/blog/jev-driven-sre-diagnosis?utm_campaign=launch",
  ]) {
    const response = await getWithHost(path, "sregym.com");
    assert.equal(response.statusCode, 308, path);
    assert.equal(
      new URL(response.headers.location).href,
      new URL(path, canonicalOrigin).href,
    );
  }

  for (const host of ["www.sregym.com", "sregymXcom"]) {
    const response = await getWithHost("/", host);
    assert.equal(response.statusCode, 200, host);
    assert.equal(response.headers.location, undefined, host);
  }
});

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
    assert.equal(parsed.origin, canonicalOrigin);
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
    // Only navigation links, not production image-preload <link> elements.
    [...html.matchAll(/<a\b[^>]*\bhref="(\/blog\/[^"?#]+)"/g)].map(
      ([, path]) => path,
    ),
  );
  assert.ok(articles.size > 0);
  for (const article of articles) {
    assert.ok(paths.includes(article), `Missing article: ${article}`);
    await assertCanonical(article);
  }

  // Sample a catalog URL to catch incorrect IDs/path construction.
  const problem = paths.find(
    (path) =>
      path.startsWith("/problems/") && !path.startsWith("/problems/cohorts/"),
  );
  assert.ok(problem, "Problem catalog is absent");
  await assertCanonical(problem);
  await assertCanonical(problem, "Googlebot");
  await assertCanonical(`${problem}?utm_source=slack`);
});
