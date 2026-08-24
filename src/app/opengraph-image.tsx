import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * The social preview card, generated rather than shipped as a PNG, so it can
 * never drift from the site's own name and positioning.
 *
 * Deliberately typographic and on the ink ground: a preview card is read at
 * thumbnail size in a chat window, where a screenshot of an interface is
 * illegible and a headline is not.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} · product engineering studio`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0b0a09",
        padding: "76px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ color: "#ede9e3", fontSize: 34, fontWeight: 700 }}>
          {siteConfig.name}
        </span>
        <span style={{ color: "#e24a1e", fontSize: 34, fontWeight: 700 }}>
          .
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            color: "#ede9e3",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 940,
            display: "flex",
          }}
        >
          We build production software for companies that can&apos;t afford a
          rewrite.
        </div>
        <div
          style={{
            color: "#9c958c",
            fontSize: 27,
            maxWidth: 880,
            display: "flex",
          }}
        >
          Web applications · SaaS platforms · Mobile apps · AI systems
        </div>
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ffffff26",
          paddingTop: 26,
          color: "#9c958c",
          fontSize: 22,
        }}
      >
        {siteConfig.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
