import { Chip, Dot, Label, Line, Panel } from "./parts";

const STAGES = [
  { name: "Ingest", state: "done", detail: "11 sources" },
  { name: "Validate", state: "done", detail: "1,204 rows" },
  { name: "Map", state: "running", detail: "3 held" },
  { name: "Publish", state: "queued", detail: "v1.8" },
] as const;

const RUNS = [
  { site: "Site 04 · Utrecht", rows: "312", state: "passed" },
  { site: "Site 07 · Leuven", rows: "288", state: "passed" },
  { site: "Site 09 · Aarhus", rows: "196", state: "held" },
  { site: "Site 11 · Malmö", rows: "408", state: "passed" },
] as const;

/** Ingestion and validation: stages, what each one held, and why. */
export function DataPipelineComposition({
  animate = true,
}: {
  animate?: boolean;
}) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      style={{ padding: "2cqw" }}
    >
      <div className="flex h-full min-h-0 flex-col" style={{ gap: "1.5cqw" }}>
        <div className="flex items-center justify-between">
          <Label size={1.5} className="font-semibold">
            Submission pipeline
          </Label>
          <Chip tone="brand">run 4,182</Chip>
        </div>

        {/* Stage graph */}
        <div className="flex items-center" style={{ gap: "0.9cqw" }}>
          {STAGES.map((stage, index) => (
            <div
              key={stage.name}
              className="flex min-w-0 flex-1 items-center"
              style={{ gap: "0.9cqw" }}
            >
              <Panel
                className={
                  stage.state === "running"
                    ? "border-primary/50 bg-primary/8 flex-1"
                    : "flex-1"
                }
                style={{ padding: "1cqw", gap: "0.5cqw" }}
              >
                <div className="flex items-center" style={{ gap: "0.7cqw" }}>
                  <Dot
                    tone={
                      stage.state === "done"
                        ? "success"
                        : stage.state === "running"
                          ? "brand"
                          : "muted"
                    }
                    pulse={animate && stage.state === "running"}
                  />
                  <Label size={1.15} className="font-medium">
                    {stage.name}
                  </Label>
                </div>
                <Label size={0.95} mono muted>
                  {stage.detail}
                </Label>
              </Panel>
              {index < STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="bg-hairline-strong shrink-0"
                  style={{ width: "2cqw", height: "1px" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Held submission detail */}
        <Panel
          style={{ padding: "1.3cqw", gap: "0.9cqw" }}
          className="border-warning/40"
        >
          <div className="flex items-center justify-between">
            <Label size={1.15} className="font-medium">
              Site 09 · held for review
            </Label>
            <Chip tone="warning">3 field errors</Chip>
          </div>
          {[
            "visit_date · expected ISO 8601, received 09/04/24",
            "sys_bp · 402 outside permissible range 60–250",
            "consent_version · missing, required since v1.6",
          ].map((error) => (
            <div
              key={error}
              className="flex items-start"
              style={{ gap: "0.8cqw" }}
            >
              <Dot tone="warning" />
              <Label size={1} mono muted className="min-w-0 flex-1">
                {error}
              </Label>
            </div>
          ))}
        </Panel>

        {/* Run list */}
        <Panel style={{ padding: "0" }} className="min-h-0 flex-1">
          {RUNS.map((run, index) => (
            <div
              key={run.site}
              className={
                index === 0
                  ? "flex items-center"
                  : "border-hairline flex items-center border-t"
              }
              style={{ padding: "0.9cqw 1.2cqw", gap: "1.1cqw" }}
            >
              <Dot tone={run.state === "passed" ? "success" : "warning"} />
              <div className="min-w-0 flex-1">
                <Label size={1.05}>{run.site}</Label>
              </div>
              <Label size={1} mono muted className="shrink-0">
                {run.rows} rows
              </Label>
              <Chip tone={run.state === "passed" ? "success" : "warning"}>
                {run.state}
              </Chip>
            </div>
          ))}
        </Panel>

        <Line w={30} />
      </div>
    </div>
  );
}
