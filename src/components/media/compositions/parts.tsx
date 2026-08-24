import { cn } from "@/lib/utils";

/**
 * One unit of a composition's internal scale. `--synth-u` is set by the
 * composition root, so the same atom is legible in a phone frame and in a
 * 1600px panel.
 */
export function U(multiple: number): string {
  return `calc(var(--synth-u, 1cqw) * ${multiple})`;
}

/**
 * Atoms shared by the synthetic interface compositions.
 *
 * Every size is a multiple of `--synth-u`, the composition's base unit, which
 * is itself a `cqw` (container-query width) value. So a composition scales
 * proportionally from a 320px phone frame to a 1600px full-bleed panel without
 * a single breakpoint, and a portrait composition can set a larger unit
 * (`--synth-u: 3.4cqw`) so a phone-width layout isn't rendered at 3px.
 *
 * The composition root sets `@container` and `--synth-u`; everything below is
 * relative to it.
 *
 * Colours are semantic tokens only, which is what lets the same composition sit
 * on the ink ground in the hero and the bone ground in the services section.
 */

export function Line({
  w = 40,
  strong = false,
  className,
}: {
  /** Width as a percentage of the parent. */
  w?: number;
  strong?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block rounded-full",
        strong ? "bg-foreground/70" : "bg-foreground/20",
        className,
      )}
      style={{ width: `${w}%`, height: U(0.55), minHeight: "2px" }}
    />
  );
}

export function Dot({
  tone = "muted",
  pulse = false,
}: {
  tone?: "brand" | "success" | "warning" | "muted";
  pulse?: boolean;
}) {
  const tones = {
    brand: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    muted: "bg-foreground/30",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 rounded-full",
        tones[tone],
        pulse && "animate-pulse",
      )}
      style={{
        width: U(0.9),
        height: U(0.9),
        minWidth: "4px",
        minHeight: "4px",
      }}
    />
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "success" | "warning";
}) {
  const tones = {
    neutral: "bg-foreground/8 text-muted-foreground",
    brand: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full whitespace-nowrap",
        tones[tone],
      )}
      style={{ fontSize: U(0.95), padding: `${U(0.35)} ${U(0.9)}` }}
    >
      {children}
    </span>
  );
}

export function Label({
  children,
  mono = false,
  muted = false,
  size = 1.05,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  muted?: boolean;
  /** Font size in cqw. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block truncate",
        mono && "font-mono tabular-nums",
        muted ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      style={{ fontSize: U(size) }}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-hairline bg-card/60 flex min-w-0 flex-col overflow-hidden rounded-[0.6cqw] border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * An area chart drawn as a single path, with the stroke drawn on once.
 *
 * The animation is `stroke-dashoffset` only, it never touches layout, and it
 * is disabled wholesale by the reduced-motion rule in `globals.css`.
 */
export function AreaChart({
  points,
  animate = true,
}: {
  points: readonly number[];
  animate?: boolean;
}) {
  const width = 100;
  const height = 40;
  const max = Math.max(...points, 1);
  const step = width / (points.length - 1);
  const coords = points.map(
    (value, index) =>
      [index * step, height - (value / max) * (height - 4) - 2] as const,
  );
  const line = coords
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
    )
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="synth-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#synth-area)" />
      <path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={
          animate
            ? {
                strokeDasharray: 1,
                strokeDashoffset: 0,
                animation:
                  "synth-draw var(--dur-cinema) var(--ease-out-expo) both",
              }
            : undefined
        }
      />
    </svg>
  );
}

/** Vertical bars, for distribution and throughput panels. */
export function BarRow({ values }: { values: readonly number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-full items-end" style={{ gap: U(0.6) }}>
      {values.map((value, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "flex-1 rounded-t-[0.2cqw]",
            index === values.length - 2 ? "bg-primary" : "bg-foreground/15",
          )}
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
