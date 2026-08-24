import { Chip, Dot, Label, Line, Panel } from "./parts";

const PRODUCTS = [
  {
    sku: "HX-4410",
    name: "Hex bolt M10 × 60",
    list: "€ 0.84",
    net: "€ 0.61",
    stock: "In stock · Rotterdam",
  },
  {
    sku: "BR-2207",
    name: "Bearing 6204-2RS",
    list: "€ 3.20",
    net: "€ 2.36",
    stock: "In stock · Venlo",
  },
  {
    sku: "SL-8890",
    name: "Sealant cartridge 310ml",
    list: "€ 6.10",
    net: "€ 4.95",
    stock: "3 day lead",
  },
  {
    sku: "WS-1120",
    name: "Washer DIN 125 · M10",
    list: "€ 0.09",
    net: "€ 0.06",
    stock: "In stock · Rotterdam",
  },
] as const;

/** Wholesale commerce: contract pricing resolved in place, availability per site. */
export function CommerceComposition({ animate = true }: { animate?: boolean }) {
  return (
    <div
      className="bg-background text-foreground @container size-full overflow-hidden"
      style={{ padding: "2cqw" }}
    >
      <div
        className="grid h-full min-h-0 grid-cols-[1.9fr_1fr]"
        style={{ gap: "1.4cqw" }}
      >
        <div className="flex min-h-0 flex-col" style={{ gap: "1.2cqw" }}>
          <div className="flex items-center justify-between">
            <Label size={1.5} className="font-semibold">
              Fasteners
            </Label>
            <Chip tone="brand">Contract pricing active</Chip>
          </div>

          <Panel style={{ padding: "0" }} className="min-h-0 flex-1">
            {PRODUCTS.map((product, index) => (
              <div
                key={product.sku}
                className={
                  index === 0
                    ? "flex items-center"
                    : "border-hairline flex items-center border-t"
                }
                style={{ padding: "1.1cqw 1.3cqw", gap: "1.2cqw" }}
              >
                <div
                  className="bg-foreground/8 shrink-0 rounded-[0.4cqw]"
                  style={{ width: "4cqw", height: "4cqw" }}
                  aria-hidden="true"
                />
                <div
                  className="min-w-0 flex-1"
                  style={{ display: "grid", gap: "0.4cqw" }}
                >
                  <Label size={1.1}>{product.name}</Label>
                  <div className="flex items-center" style={{ gap: "0.7cqw" }}>
                    <Label size={0.95} mono muted>
                      {product.sku}
                    </Label>
                    <Dot
                      tone={
                        product.stock.startsWith("In") ? "success" : "warning"
                      }
                    />
                    <Label size={0.95} muted>
                      {product.stock}
                    </Label>
                  </div>
                </div>
                <div
                  className="shrink-0 text-right"
                  style={{ display: "grid", gap: "0.3cqw" }}
                >
                  <Label size={0.95} mono muted className="line-through">
                    {product.list}
                  </Label>
                  <Label size={1.2} mono className="text-primary font-medium">
                    {product.net}
                  </Label>
                </div>
              </div>
            ))}
          </Panel>
        </div>

        {/* Order pad */}
        <Panel style={{ padding: "1.3cqw", gap: "1cqw" }}>
          <Label size={1.2} className="font-semibold">
            Order pad
          </Label>
          <div
            className="border-hairline rounded-[0.5cqw] border border-dashed"
            style={{ padding: "1cqw", display: "grid", gap: "0.6cqw" }}
          >
            <Label size={0.95} mono muted>
              Paste SKUs and quantities
            </Label>
            <Label size={1} mono>
              HX-4410 × 500
            </Label>
            <Label size={1} mono>
              BR-2207 × 40
            </Label>
            <div className="flex items-center" style={{ gap: "0.6cqw" }}>
              <Label size={1} mono>
                WS-1120 × 500
              </Label>
              <Dot tone="brand" pulse={animate} />
            </div>
          </div>
          <div style={{ display: "grid", gap: "0.7cqw" }}>
            <div className="flex items-center justify-between">
              <Label size={1} muted>
                Subtotal
              </Label>
              <Label size={1.05} mono>
                € 429.40
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <Label size={1} muted>
                Contract saving
              </Label>
              <Label size={1.05} mono className="text-success">
                − € 118.60
              </Label>
            </div>
            <div className="bg-hairline-strong" style={{ height: "1px" }} />
            <div className="flex items-center justify-between">
              <Label size={1.05} className="font-medium">
                Total
              </Label>
              <Label size={1.35} mono className="font-semibold">
                € 310.80
              </Label>
            </div>
          </div>
          <span
            className="bg-primary text-primary-foreground rounded-[0.4cqw] text-center font-medium"
            style={{ fontSize: "1.05cqw", padding: "0.75cqw 1cqw" }}
          >
            Add to order
          </span>
          <Line w={70} />
        </Panel>
      </div>
    </div>
  );
}
