import { cn } from "@/lib/utils";

export type ContainerWidth = "content" | "reading" | "wide" | "full";

const WIDTHS: Record<ContainerWidth, string> = {
  content: "max-w-content", // 1280 — the default
  reading: "max-w-reading", // 880 — prose
  wide: "max-w-wide", // 1600 — full-bleed media
  full: "max-w-none",
};

export interface ContainerProps extends React.ComponentProps<"div"> {
  width?: ContainerWidth;
}

/**
 * Horizontal measure and gutters. The ONLY place page width is decided —
 * a component that sets its own `max-w-*` is how a layout drifts out of
 * alignment one section at a time.
 */
export function Container({
  width = "content",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        WIDTHS[width],
        className,
      )}
      {...props}
    />
  );
}
