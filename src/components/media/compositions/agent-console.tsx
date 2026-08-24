import { Chip, Dot, Label, Line, Panel } from "./parts";

const QUEUE = [
  { id: "SHP-40912", title: "Carrier missed pickup window", tone: "warning" },
  { id: "SHP-40918", title: "Rate expired before booking", tone: "warning" },
  { id: "SHP-40921", title: "Customs document missing", tone: "brand" },
  { id: "SHP-40930", title: "Temperature excursion logged", tone: "warning" },
  { id: "SHP-40944", title: "Weight mismatch at gate", tone: "brand" },
  { id: "SHP-40951", title: "Driver ETA slipped 40 min", tone: "warning" },
  { id: "SHP-40962", title: "Consignee address unverified", tone: "brand" },
] as const;

const STEPS = [
  { tool: "shipments.get", detail: "SHP-40912 · lane RTM→HAM", done: true },
  {
    tool: "carriers.availability",
    detail: "4 carriers · 2 within window",
    done: true,
  },
  { tool: "rates.quote", detail: "€ 1,180 · +€ 60 vs contract", done: true },
  { tool: "policy.check", detail: "within approval threshold", done: false },
] as const;

/**
 * An agent working inside an operations queue — the recommendation, and the
 * tool calls behind it, so a suggestion can be checked rather than trusted.
 */
export function AgentConsoleComposition({
  animate = true,
}: {
  animate?: boolean;
}) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      style={{ padding: "2cqw" }}
    >
      <div
        className="grid h-full min-h-0 grid-cols-[1fr_1.5fr]"
        style={{ gap: "1.4cqw" }}
      >
        {/* Exception queue */}
        <Panel style={{ padding: "0" }} className="min-h-0">
          <div
            className="border-hairline flex items-center justify-between border-b"
            style={{ padding: "1.1cqw 1.2cqw" }}
          >
            <Label size={1.15} className="font-semibold">
              Exceptions
            </Label>
            <Chip tone="warning">4 open</Chip>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {QUEUE.map((item, index) => (
              <div
                key={item.id}
                className={
                  index === 0
                    ? "bg-primary/8 border-primary flex items-start border-l-[0.35cqw]"
                    : "border-hairline flex items-start border-t"
                }
                style={{ padding: "1cqw 1.2cqw", gap: "0.9cqw" }}
              >
                <Dot tone={item.tone === "brand" ? "brand" : "warning"} />
                <div
                  className="min-w-0 flex-1"
                  style={{ display: "grid", gap: "0.4cqw" }}
                >
                  <Label size={1} mono muted>
                    {item.id}
                  </Label>
                  <Label size={1.05}>{item.title}</Label>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Agent run */}
        <Panel style={{ padding: "0" }} className="min-h-0">
          <div
            className="border-hairline flex items-center justify-between border-b"
            style={{ padding: "1.1cqw 1.2cqw" }}
          >
            <div className="flex items-center" style={{ gap: "0.9cqw" }}>
              <Dot tone="brand" pulse={animate} />
              <Label size={1.15} className="font-semibold">
                Agent run · rebooking
              </Label>
            </div>
            <Label size={0.95} mono muted>
              1.8s · 4 tools
            </Label>
          </div>

          <div
            className="min-h-0 flex-1"
            style={{
              padding: "1.2cqw",
              display: "grid",
              gap: "0.9cqw",
              alignContent: "start",
            }}
          >
            {STEPS.map((step) => (
              <div
                key={step.tool}
                className="border-hairline flex items-center rounded-[0.5cqw] border"
                style={{ padding: "0.8cqw 1cqw", gap: "0.9cqw" }}
              >
                <Dot
                  tone={step.done ? "success" : "brand"}
                  pulse={animate && !step.done}
                />
                <Label size={1.05} mono className="text-primary shrink-0">
                  {step.tool}
                </Label>
                <div className="min-w-0 flex-1">
                  <Label size={1} muted>
                    {step.detail}
                  </Label>
                </div>
              </div>
            ))}

            {/* Recommendation */}
            <div
              className="border-primary/40 bg-primary/8 rounded-[0.5cqw] border"
              style={{ padding: "1.1cqw", display: "grid", gap: "0.7cqw" }}
            >
              <Label size={0.95} mono className="text-primary">
                RECOMMENDED
              </Label>
              <Label size={1.25} className="font-medium">
                Rebook with Nordfracht · pickup 14:20 · € 1,180
              </Label>
              <Label size={1} muted>
                Within contract tolerance. Customer ETA unchanged.
              </Label>
              <div
                className="flex items-center"
                style={{ gap: "0.8cqw", marginTop: "0.3cqw" }}
              >
                <span
                  className="bg-primary text-primary-foreground rounded-[0.4cqw] font-medium"
                  style={{ fontSize: "1cqw", padding: "0.55cqw 1.2cqw" }}
                >
                  Approve
                </span>
                <span
                  className="border-hairline-strong text-muted-foreground rounded-[0.4cqw] border"
                  style={{ fontSize: "1cqw", padding: "0.55cqw 1.2cqw" }}
                >
                  Override
                </span>
              </div>
            </div>

            <div
              style={{ display: "grid", gap: "0.6cqw", marginTop: "0.3cqw" }}
            >
              <Line w={72} />
              <Line w={54} />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
