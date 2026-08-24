import { ImageResponse } from "next/og";

/**
 * The home-screen icon. iOS does not round the corners of a supplied mask
 * itself for `apple-touch-icon`, so this draws a full-bleed tile and lets the
 * OS apply its own shape — a pre-rounded icon ends up double-rounded.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e24a1e",
        color: "#ffffff",
        fontSize: 116,
        fontWeight: 700,
        letterSpacing: "-0.05em",
      }}
    >
      T
    </div>,
    size,
  );
}
