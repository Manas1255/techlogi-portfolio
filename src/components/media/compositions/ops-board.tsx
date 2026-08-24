import { Chip, Dot, Label, Line, Panel } from "./parts";

const LANES = [
  {
    name: "Inbound",
    tone: "muted",
    cards: [
      { ref: "MSKU-4471", note: "Bay 12 · reefer", tone: "brand" },
      { ref: "TGHU-9920", note: "Bay 14", tone: "muted" },
      { ref: "CAIU-2231", note: "Bay 07", tone: "muted" },
    ],
  },
  {
    name: "In yard",
    tone: "brand",
    cards: [
      { ref: "HLXU-8812", note: "Row C · 3h dwell", tone: "warning" },
      { ref: "OOLU-5540", note: "Row A", tone: "muted" },
    ],
  },
  {
    name: "Loading",
    tone: "warning",
    cards: [
      { ref: "MSCU-1180", note: "Crew 2 · 18 min", tone: "brand" },
      { ref: "FCIU-3092", note: "Crew 4", tone: "muted" },
      { ref: "TCLU-7741", note: "Crew 1", tone: "muted" },
    ],
  },
  {
    name: "Departed",
    tone: "success",
    cards: [
      { ref: "SEGU-6610", note: "14:02", tone: "success" },
      { ref: "TRHU-2204", note: "13:41", tone: "success" },
    ],
  },
] as const;

/** A live operations board: lanes, dwell, crews. The office's view of a yard. */
export function OpsBoardComposition({ animate = true }: { animate?: boolean }) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      style={{ padding: "2cqw" }}
    >
      <div className="flex h-full min-h-0 flex-col" style={{ gap: "1.4cqw" }}>
        <div
          className="flex items-center justify-between"
          style={{ gap: "1.5cqw" }}
        >
          <div className="flex items-center" style={{ gap: "1.1cqw" }}>
            <Label size={1.5} className="font-semibold">
              Yard board
            </Label>
            <Chip tone="brand">Terminal 3</Chip>
          </div>
          <div className="flex items-center" style={{ gap: "0.8cqw" }}>
            <Dot tone="success" pulse={animate} />
            <Label size={1} mono muted>
              synced 4s ago
            </Label>
          </div>
        </div>

        <div
          className="grid min-h-0 flex-1 grid-cols-4"
          style={{ gap: "1.2cqw" }}
        >
          {LANES.map((lane) => (
            <div
              key={lane.name}
              className="flex min-h-0 flex-col"
              style={{ gap: "0.9cqw" }}
            >
              <div className="flex items-center justify-between">
                <Label size={1.05} mono muted>
                  {lane.name}
                </Label>
                <Label size={1} mono muted>
                  {lane.cards.length}
                </Label>
              </div>
              <div
                className="bg-foreground/12 w-full rounded-full"
                style={{ height: "0.35cqw" }}
              >
                <div
                  className={
                    lane.tone === "success"
                      ? "bg-success h-full rounded-full"
                      : lane.tone === "warning"
                        ? "bg-warning h-full rounded-full"
                        : lane.tone === "brand"
                          ? "bg-primary h-full rounded-full"
                          : "bg-foreground/30 h-full rounded-full"
                  }
                  style={{ width: `${40 + lane.cards.length * 18}%` }}
                />
              </div>
              <div className="flex min-h-0 flex-col" style={{ gap: "0.9cqw" }}>
                {lane.cards.map((card) => (
                  <Panel
                    key={card.ref}
                    style={{ padding: "1cqw", gap: "0.55cqw" }}
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "0.7cqw" }}
                    >
                      <Dot
                        tone={
                          card.tone === "success"
                            ? "success"
                            : card.tone === "warning"
                              ? "warning"
                              : card.tone === "brand"
                                ? "brand"
                                : "muted"
                        }
                      />
                      <Label size={1.05} mono>
                        {card.ref}
                      </Label>
                    </div>
                    <Label size={0.95} muted>
                      {card.note}
                    </Label>
                    <Line w={64} />
                  </Panel>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
