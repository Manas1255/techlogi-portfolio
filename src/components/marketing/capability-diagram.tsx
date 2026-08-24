import {
  Monitor,
  Palette,
  Radio,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { Capability } from "@/content/schemas";
import { cn } from "@/lib/utils";

/**
 * THE CAPABILITY DIAGRAM.
 *
 * A small drawn illustration for each capability card: a central mark, the
 * technologies floating around it as chips, and one emphasised pill naming the
 * thing the card is about.
 *
 * Drawn in DOM rather than shipped as an image, for three reasons that all
 * matter here. It inherits the colour tokens, so it is correct on paper and on
 * slab without a second asset. It stays sharp at any density with no srcset.
 * And the technology names are real selectable, searchable text, which is what
 * an image of a tech stack can never be, for a reader or for a crawler.
 *
 * Sizes are in container-query units against the card, so one component serves
 * a three-up desktop grid and a single-column phone without a breakpoint.
 *
 * It is decorative: every fact it shows is repeated in the card's prose, so it
 * is hidden from assistive technology rather than described twice.
 */

const ICONS = {
  smartphone: Smartphone,
  server: Server,
  sparkles: Sparkles,
  monitor: Monitor,
  radio: Radio,
  palette: Palette,
} as const;

/** Where each satellite sits, as a percentage of the diagram box. */
const ORBIT_POSITIONS = [
  { top: "7%", left: "4%" },
  { top: "5%", right: "5%" },
  { top: "40%", left: "3%" },
  { top: "36%", right: "3%" },
  { bottom: "24%", left: "7%" },
  { bottom: "20%", right: "6%" },
] as const;

export function CapabilityDiagram({
  capability,
  className,
}: {
  capability: Capability;
  className?: string;
}) {
  const Icon = ICONS[capability.icon];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "border-hairline bg-sunken relative isolate w-full overflow-hidden rounded-xl border",
        className,
      )}
      style={{
        containerType: "inline-size",
        aspectRatio: "16 / 10",
      }}
    >
      {/* A faint dot grid, so the chips read as floating on a surface. */}
      <span
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--hairline-strong) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {capability.diagram === "orbit" ? (
        <OrbitDiagram capability={capability} Icon={Icon} />
      ) : (
        <FlowDiagram capability={capability} Icon={Icon} />
      )}
    </div>
  );
}

function OrbitDiagram({
  capability,
  Icon,
}: {
  capability: Capability;
  Icon: (typeof ICONS)[keyof typeof ICONS];
}) {
  return (
    <>
      {/* Concentric rings behind the mark, to imply orbit without drawing one. */}
      <span
        className="border-hairline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ width: "52cqw", height: "52cqw" }}
      />
      <span
        className="border-hairline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ width: "34cqw", height: "34cqw" }}
      />

      {/* The central mark. */}
      <span
        className="border-hairline bg-card absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border shadow-sm"
        style={{ width: "13cqw", height: "13cqw" }}
      >
        <Icon
          className="text-foreground"
          style={{ width: "7cqw", height: "7cqw" }}
        />
      </span>

      {capability.chips.slice(0, 6).map((chip, index) => (
        <Chip key={chip.label} style={ORBIT_POSITIONS[index]}>
          {chip.label}
        </Chip>
      ))}

      <FocusPill>{capability.focus}</FocusPill>
    </>
  );
}

function FlowDiagram({
  capability,
  Icon,
}: {
  capability: Capability;
  Icon: (typeof ICONS)[keyof typeof ICONS];
}) {
  const nodes = capability.chips.slice(0, 4);
  return (
    <>
      {/* Dashed connectors drawn as one SVG so the lines meet the nodes exactly. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 160 100"
        preserveAspectRatio="none"
      >
        {[16, 33, 50, 67].slice(0, nodes.length).map((y) => (
          <path
            key={y}
            d={`M 46 ${y} C 82 ${y}, 86 52, 118 52`}
            fill="none"
            stroke="var(--hairline-strong)"
            strokeWidth="0.7"
            strokeDasharray="2.5 2.5"
          />
        ))}
      </svg>

      {/* Inputs, stacked down the left. */}
      <div
        className="absolute left-0 flex flex-col"
        style={{
          top: "8%",
          gap: "2.2cqw",
          paddingLeft: "4cqw",
          width: "48cqw",
        }}
      >
        {nodes.map((chip) => (
          <span
            key={chip.label}
            className="border-hairline bg-card text-foreground truncate rounded-full border text-center shadow-sm"
            style={{
              fontSize: "3.1cqw",
              padding: "1.5cqw 2.4cqw",
            }}
          >
            {chip.label}
          </span>
        ))}
      </div>

      {/* The outcome, on the right. */}
      <span
        className="border-hairline bg-card absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-2xl border shadow-sm"
        style={{
          top: "42%",
          right: "7cqw",
          width: "13cqw",
          height: "13cqw",
        }}
      >
        <Icon
          className="text-foreground"
          style={{ width: "7cqw", height: "7cqw" }}
        />
      </span>

      <FocusPill>{capability.focus}</FocusPill>
    </>
  );
}

function Chip({
  children,
  style,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <span
      className="border-hairline bg-card text-foreground absolute truncate rounded-full border shadow-sm"
      style={{
        fontSize: "3.1cqw",
        padding: "1.4cqw 2.4cqw",
        maxWidth: "42cqw",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** The one emphasised pill. Scarcity is what makes it read as the answer. */
function FocusPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-primary text-primary-foreground absolute left-1/2 -translate-x-1/2 rounded-full font-medium shadow-lg"
      style={{
        bottom: "5%",
        fontSize: "3.4cqw",
        padding: "1.8cqw 3.4cqw",
        maxWidth: "70cqw",
      }}
    >
      {children}
    </span>
  );
}
