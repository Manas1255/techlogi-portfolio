import { AreaChart, BarRow, Chip, Dot, Label, Line, Panel } from "./parts";

const ROWS = [
  {
    lane: "Rotterdam → Hamburg",
    value: "€ 4,820",
    delta: "+6.2%",
    tone: "success",
  },
  {
    lane: "Antwerp → Duisburg",
    value: "€ 3,140",
    delta: "+2.8%",
    tone: "success",
  },
  {
    lane: "Le Havre → Lyon",
    value: "€ 2,905",
    delta: "−1.4%",
    tone: "warning",
  },
  {
    lane: "Gdańsk → Poznań",
    value: "€ 1,760",
    delta: "+0.9%",
    tone: "success",
  },
] as const;

/**
 * A SaaS analytics surface: KPI row, trend, distribution, and a table that is
 * the point of the screen rather than an afterthought.
 */
export function AnalyticsComposition({
  animate = true,
}: {
  animate?: boolean;
}) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      style={{ padding: "2cqw" }}
    >
      <div className="flex h-full min-h-0 flex-col" style={{ gap: "1.6cqw" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ gap: "2cqw" }}
        >
          <div className="flex min-w-0 items-center" style={{ gap: "1.2cqw" }}>
            <Label size={1.5} className="font-semibold">
              Margin by lane
            </Label>
            <Chip tone="brand">Last 30 days</Chip>
          </div>
          <div className="flex items-center" style={{ gap: "0.8cqw" }}>
            <Dot tone="success" pulse={animate} />
            <Label size={1} mono muted>
              live
            </Label>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4" style={{ gap: "1.2cqw" }}>
          {[
            { k: "Revenue", v: "€ 1.42M", d: "+8.1%" },
            { k: "Margin", v: "18.4%", d: "+1.2pt" },
            { k: "Shipments", v: "12,048", d: "+4.6%" },
            { k: "Exceptions", v: "37", d: "−22%" },
          ].map((kpi) => (
            <Panel key={kpi.k} style={{ padding: "1.1cqw", gap: "0.6cqw" }}>
              <Label size={0.95} mono muted>
                {kpi.k}
              </Label>
              <Label size={2} className="font-semibold tabular-nums">
                {kpi.v}
              </Label>
              <Label size={0.95} mono className="text-success">
                {kpi.d}
              </Label>
            </Panel>
          ))}
        </div>

        {/* Trend + distribution */}
        <div
          className="grid min-h-0 flex-1 grid-cols-[2.2fr_1fr]"
          style={{ gap: "1.2cqw" }}
        >
          <Panel style={{ padding: "1.2cqw", gap: "0.9cqw" }}>
            <Label size={1} mono muted>
              Contribution margin
            </Label>
            <div className="min-h-0 flex-1">
              <AreaChart
                animate={animate}
                points={[12, 18, 15, 22, 26, 24, 31, 29, 36, 42, 39, 48]}
              />
            </div>
          </Panel>
          <Panel style={{ padding: "1.2cqw", gap: "0.9cqw" }}>
            <Label size={1} mono muted>
              Volume by week
            </Label>
            <div className="min-h-0 flex-1">
              <BarRow values={[14, 22, 19, 27, 24, 33, 30]} />
            </div>
          </Panel>
        </div>

        {/* Table */}
        <Panel style={{ padding: "0" }}>
          {ROWS.map((row, index) => (
            <div
              key={row.lane}
              className={
                index === 0
                  ? "flex items-center"
                  : "border-hairline flex items-center border-t"
              }
              style={{ padding: "0.9cqw 1.2cqw", gap: "1.2cqw" }}
            >
              <Dot tone={row.tone === "success" ? "success" : "warning"} />
              <div className="min-w-0 flex-1">
                <Label size={1.1}>{row.lane}</Label>
              </div>
              <Label size={1.1} mono className="shrink-0">
                {row.value}
              </Label>
              <div style={{ width: "8cqw" }} className="shrink-0 text-right">
                <Label
                  size={1}
                  mono
                  className={
                    row.tone === "success" ? "text-success" : "text-warning"
                  }
                >
                  {row.delta}
                </Label>
              </div>
            </div>
          ))}
        </Panel>

        <div className="flex items-center" style={{ gap: "1cqw" }}>
          <Line w={22} />
          <Line w={12} />
        </div>
      </div>
    </div>
  );
}
