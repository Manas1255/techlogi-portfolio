import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The browser-tab mark: the GA monogram on the ink ground.
 *
 * Generated rather than shipped as a binary, so the ground stays a token
 * decision in one place. It used to draw the letters "GA" on `#e24a1e`, an
 * orange left over from a palette this site no longer has: nothing referenced
 * it, nothing failed, and the tab was simply the wrong brand colour.
 *
 * A tab icon is read at 16px, which is smaller than any letterform stays
 * legible at, so it is the monogram and nothing else. Read from disk at build
 * time and inlined, because `ImageResponse` fetches nothing off the origin.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const mark = readFileSync(
  join(process.cwd(), "public/media/brand/ga-code-mark.png"),
).toString("base64");

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d1117",
        borderRadius: 14,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${mark}`}
        alt=""
        width={52}
        height={52}
      />
    </div>,
    size,
  );
}
