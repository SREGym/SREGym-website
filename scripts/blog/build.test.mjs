import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const standalone = new URL("../../.next/standalone/", import.meta.url);

test("standalone deployment includes both social-image fonts", async () => {
  for (const weight of ["Regular", "Bold"]) {
    const path = `node_modules/geist/dist/fonts/geist-sans/Geist-${weight}.ttf`;
    const font = await readFile(new URL(path, standalone));
    assert.ok(font.length > 0, `Missing font data: ${path}`);
  }
});

test("blog sharing images are prerendered and packaged as PNGs", async () => {
  const manifest = JSON.parse(
    await readFile(new URL(".next/prerender-manifest.json", standalone), "utf8"),
  );
  const articles = Object.keys(manifest.routes).filter((path) =>
    /^\/blog\/[^/]+$/.test(path) && !path.endsWith("/share-image"),
  );
  assert.ok(articles.length > 0, "No prerendered blog articles found");

  for (const page of ["/blog", ...articles]) {
    const image = `${page}/share-image`;
    assert.ok(manifest.routes[image], `Image not generated at build time: ${image}`);
    const png = await readFile(
      new URL(`.next/server/app${image}.body`, standalone),
    );
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
});
