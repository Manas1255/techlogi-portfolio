import { Chip, Dot, Label, Line, Panel, U } from "./parts";

const HISTORY = [
  { when: "12 Mar", what: "Valve seat replaced" },
  { when: "04 Jan", what: "Pressure test, passed" },
  { when: "18 Nov", what: "Flagged: corrosion, monitor" },
] as const;

/**
 * The field app, in a phone frame.
 *
 * Portrait containers are narrow, so this sets a larger base unit, otherwise
 * every atom would render at two or three pixels. It is the same scale system,
 * tuned once, in one place.
 */
export function MobileFieldComposition({
  animate = true,
}: {
  animate?: boolean;
}) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      // Extra headroom so the status row clears the frame's notch.
      style={{
        ["--synth-u" as string]: "3.4cqw",
        padding: `${U(2.4)} ${U(1.4)} ${U(1.4)}`,
      }}
    >
      <div className="flex h-full min-h-0 flex-col" style={{ gap: U(1.2) }}>
        {/* Status bar */}
        <div
          className="flex items-center justify-between"
          style={{ padding: `0 ${U(0.6)}` }}
        >
          <Label size={0.95} mono muted>
            09:41
          </Label>
          <div className="flex items-center" style={{ gap: U(0.6) }}>
            <Dot tone="warning" />
            <Label size={0.95} mono muted>
              offline · 3 queued
            </Label>
          </div>
        </div>

        {/* Route header */}
        <div style={{ display: "grid", gap: U(0.5), padding: `0 ${U(0.6)}` }}>
          <Label size={0.95} mono muted>
            TODAY · 6 JOBS
          </Label>
          <Label size={2} className="font-semibold">
            Job 3 of 6
          </Label>
        </div>

        {/* Current job */}
        <Panel
          style={{ padding: U(1.2), gap: U(0.9) }}
          className="border-primary/40"
        >
          <div className="flex items-center justify-between">
            <Label size={1.05} mono className="text-primary">
              WO-88214
            </Label>
            <Chip tone="brand">In progress</Chip>
          </div>
          <Label size={1.5} className="font-medium">
            Pressure regulator · PRV-40
          </Label>
          <Label size={1.05} muted>
            14 Kolenkitplein, Amsterdam · basement plant room
          </Label>
          <div className="flex items-center" style={{ gap: U(0.7) }}>
            <Dot tone="success" />
            <Label size={1} muted>
              Asset history cached
            </Label>
          </div>
        </Panel>

        {/* Asset history */}
        <Panel style={{ padding: "0" }} className="min-h-0 flex-1">
          <div className="border-hairline border-b" style={{ padding: U(1) }}>
            <Label size={1.05} mono muted>
              ASSET HISTORY
            </Label>
          </div>
          {HISTORY.map((entry, index) => (
            <div
              key={entry.when}
              className={
                index === 0
                  ? "flex items-start"
                  : "border-hairline flex items-start border-t"
              }
              style={{ padding: U(1), gap: U(0.9) }}
            >
              <Label size={1} mono muted className="shrink-0">
                {entry.when}
              </Label>
              <Label size={1.05} className="min-w-0 flex-1">
                {entry.what}
              </Label>
            </div>
          ))}
          <div
            className="border-hairline border-t"
            style={{ padding: U(1), display: "grid", gap: U(0.6) }}
          >
            <Line w={78} />
            <Line w={52} />
          </div>
        </Panel>

        {/* Photo queue + primary action */}
        <div className="flex items-center" style={{ gap: U(0.8) }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="bg-foreground/10 border-hairline flex-1 rounded-[calc(var(--synth-u)*0.5)] border"
              style={{ height: U(5) }}
              aria-hidden="true"
            />
          ))}
          <div
            className="border-primary/50 text-primary flex shrink-0 items-center justify-center rounded-[calc(var(--synth-u)*0.5)] border border-dashed"
            style={{ height: U(5), width: U(5), fontSize: U(1.6) }}
            aria-hidden="true"
          >
            +
          </div>
        </div>

        <div
          className="bg-primary text-primary-foreground flex items-center justify-center rounded-[calc(var(--synth-u)*0.6)] font-semibold"
          style={{ padding: `${U(1.4)} ${U(1)}`, fontSize: U(1.35) }}
        >
          <span className="flex items-center" style={{ gap: U(0.7) }}>
            Close out job
            {animate && <Dot tone="muted" pulse />}
          </span>
        </div>
      </div>
    </div>
  );
}
