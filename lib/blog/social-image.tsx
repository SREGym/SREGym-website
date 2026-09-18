import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "@/lib/site";
import { blogImageSize } from "./config";

// Use the site's existing font package, without a network request at render time.
const regularFont = readFile(
  join(
    process.cwd(),
    "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
  ),
);
const boldFont = readFile(
  join(
    process.cwd(),
    "node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf",
  ),
);

export async function createBlogSocialImage({
  title,
  description,
  category = "Field notes",
}: {
  title: string;
  description?: string;
  category?: string;
}) {
  const [regular, bold] = await Promise.all([regularFont, boldFont]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "52px 64px 42px",
        background: "#F6F4EF",
        color: "#252B33",
        fontFamily: "Geist",
        borderTop: "10px solid #B96B43",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.5 }}>
            SREGym
          </span>
          <span style={{ width: 1, height: 28, background: "#C8C5BF" }} />
          <span style={{ fontSize: 23, color: "#65686D" }}>BLOG</span>
        </div>
        <span
          style={{
            padding: "10px 18px",
            border: "1px solid #C8C5BF",
            borderRadius: 6,
            fontSize: 20,
            color: "#8E4F2F",
          }}
        >
          {category}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: title.length > 65 ? 60 : 76,
            lineHeight: 1.06,
            fontWeight: 700,
            letterSpacing: -3,
            maxWidth: 1040,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#65686D",
              maxWidth: 1000,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 22,
          borderTop: "1px solid #C8C5BF",
          fontSize: 21,
          color: "#65686D",
        }}
      >
        <span>Research on reliable SRE agents</span>
        <span style={{ color: "#8E4F2F" }}>
          {new URL(siteUrl).hostname.replace(/^www\./, "")}/blog
        </span>
      </div>
    </div>,
    {
      ...blogImageSize,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
