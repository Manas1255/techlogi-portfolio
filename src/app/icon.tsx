import { ImageResponse } from "next/og";

/**
 * The browser-tab mark, generated rather than shipped as a file, so it can
 * never drift from the wordmark, and there is no binary in the repo to
 * re-export when the brand colour changes.
 *
 * A tab icon is read at 16px, which is smaller than any letterform stays
 * legible at: the mark is the monogram on the brand colour, and nothing else.
 * The scaffold's default favicon (the Next.js logo) shipped until now.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: "-0.05em",
        borderRadius: 14,
      }}
    >
      GA
    </div>,
    size,
  );
}
