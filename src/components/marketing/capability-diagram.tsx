"use client";

import {
  Monitor,
  Palette,
  Radio,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useOnstage } from "@/hooks/use-onstage";
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
 *
 * MOTION. Chips stagger in as the card reveals, then drift on slow individual
 * loops; the rings turn and the flow's dashes march. All of it is CSS on
 * transform and opacity, and all of it is gated on `data-onstage`, which an
 * observer toggles both ways so nothing composites while it is off screen.
 * `prefers-reduced-motion` resolves the durations to 1ms at the token level, so
 * the diagram simply arrives assembled.
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
  const onstageRef = useOnstage<HTMLDivElement>();

  return (
    <div
      ref={onstageRef}
      data-diagram=""
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
      {/* Concentric rings behind the mark, to imply orbit without drawing one.
          Dashed, so the rotation is visible at all. */}
      <span
        data-rings=""
        className="border-hairline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
        style={{ width: "52cqw", height: "52cqw" }}
      />
      <span
        className="border-hairline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ width: "34cqw", height: "34cqw" }}
      />

      {/* The sonar pulse, behind the mark. Two, offset in phase, so the
          diagram is never momentarily still between beats. */}
      {[0, 1].map((beat) => (
        <span
          key={beat}
          data-sonar=""
          className="border-primary/30 absolute top-1/2 left-1/2 rounded-full border"
          style={{
            width: "50cqw",
            height: "50cqw",
            animationDelay: `${beat * 1.6}s`,
          }}
        />
      ))}

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
        <Chip key={chip.label} index={index} style={ORBIT_POSITIONS[index]}>
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
            data-flow-line=""
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
        {nodes.map((chip, index) => (
          <span
            key={chip.label}
            data-chip=""
            style={{ ["--chip-index" as string]: index }}
          >
            <span
              data-drift=""
              className="border-hairline bg-card text-foreground block truncate rounded-full border text-center shadow-sm"
              style={{ fontSize: "3.1cqw", padding: "1.5cqw 2.4cqw" }}
            >
              {chip.label}
            </span>
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

/**
 * Two nested spans on purpose. The outer one owns the entrance transform, the
 * inner one owns the drift loop. Sharing an element would mean the loop's
 * keyframes overwrite the transition's transform the instant it starts, and the
 * chip would snap to its final position instead of easing there.
 */
function Chip({
  children,
  index,
  style,
}: {
  children: React.ReactNode;
  index: number;
  style: React.CSSProperties;
}) {
  return (
    <span
      data-chip=""
      className="absolute"
      style={{
        ["--chip-index" as string]: index,
        maxWidth: "42cqw",
        ...style,
      }}
    >
      <span
        data-drift=""
        className="border-hairline bg-card text-foreground block truncate rounded-full border shadow-sm"
        style={{ fontSize: "3.1cqw", padding: "1.4cqw 2.4cqw" }}
      >
        {children}
      </span>
    </span>
  );
}

/** The one emphasised pill. Scarcity is what makes it read as the answer. */
function FocusPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-chip=""
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        bottom: "5%",
        ["--chip-index" as string]: 6,
        maxWidth: "70cqw",
      }}
    >
      <span
        data-drift=""
        className="bg-primary text-primary-foreground block truncate rounded-full text-center font-medium shadow-lg"
        style={{ fontSize: "3.4cqw", padding: "1.8cqw 3.4cqw" }}
      >
        {children}
      </span>
    </span>
  );
}
