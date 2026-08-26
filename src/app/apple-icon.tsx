import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The home-screen icon. iOS does not round the corners of a supplied mask
 * itself for `apple-touch-icon`, so this draws a full-bleed tile and lets the
 * OS apply its own shape; a pre-rounded icon ends up double-rounded.
 *
 * Same monogram and same ground as `icon.tsx`. Both used to draw "GA" on an
 * orange that belongs to no current token.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = readFileSync(
  join(process.cwd(), "public/media/brand/ga-code-mark.png"),
).toString("base64");

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d1117",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${mark}`}
        alt=""
        width={132}
        height={132}
      />
    </div>,
    size,
  );
}
