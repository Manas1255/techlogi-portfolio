"use client";

import { useState } from "react";
import { LayoutGrid, List, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Combobox,
  CopyButton,
  DatePicker,
  DescriptionList,
  EmptyState,
  ErrorState,
  FilterChips,
  MultiSelect,
  PageHeader,
  SearchInput,
  SectionHeader,
  SegmentedTabs,
  StatCard,
  StatusBadge,
  Stepper,
  TruncatedText,
  CardSkeleton,
  DetailSkeleton,
  FormSkeleton,
  ListSkeleton,
  StatsSkeleton,
  type StatusTone,
} from "@/components/shared";
import { ApiError } from "@/lib/http";
import {
  ArrowLink,
  ChoiceCards,
  Eyebrow,
  HairlineList,
  PlaceholderNote,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import type { Media } from "@/content/schemas";

const BRAND_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

const SEMANTIC_TOKENS = [
  "background",
  "card",
  "primary",
  "secondary",
  "muted",
  "accent",
  "border",
  "ring",
] as const;

const TONES: StatusTone[] = ["success", "warning", "danger", "info", "neutral"];

const MARKETING_TYPE_STEPS = [
  ["text-hero", "Hero, the home page headline, and nowhere else"],
  ["text-display-1", "Display 1, page titles"],
  ["text-display-2", "Display 2, section headlines"],
  ["text-display-3", "Display 3, sub-headings, project names in a rail"],
  ["text-quote", "Quote, pull quotes and testimonials"],
  ["text-lead", "Lead, the paragraph under a headline"],
  ["text-marketing-body", "Marketing body, reading copy at 16/1.65"],
  ["text-eyebrow", "Eyebrow, section labels"],
  ["text-mono-label", "Mono label, indices, stacks, footnotes"],
] as const;

const MOTION_TOKENS = [
  ["--dur-fast", "120ms", "State feedback: press, focus"],
  ["--dur-base", "240ms", "Hover, expand, collapse"],
  ["--dur-slow", "420ms", "Scroll reveals"],
  ["--dur-cinema", "720ms", "Hero choreography only"],
  ["--ease-out-expo", "cubic-bezier(.16,1,.3,1)", "Entrances"],
  ["--ease-in-out-quart", "cubic-bezier(.65,0,.35,1)", "State changes"],
] as const;

const DEMO_MEDIA: Media = {
  kind: "synthetic",
  composition: "analytics",
  animate: false,
  frame: "browser",
  chromeUrl: "app.example.com/insights",
  aspect: "16/9",
  alt: "",
};

const TYPE_STEPS = [
  ["text-display", "Display, page hero"],
  ["text-h1", "Heading 1, page title"],
  ["text-h2", "Heading 2, section"],
  ["text-h3", "Heading 3, card title"],
  ["text-h4", "Heading 4, subsection"],
  ["text-body-lg", "Body large, reading contexts"],
  ["text-body", "Body, default copy"],
  ["text-label", "Label, form labels, cells"],
  ["text-caption", "Caption, meta, secondary"],
  ["text-overline", "Overline, table headers"],
  ["text-data", "Data, 1,234.56 tabular"],
  ["text-metric", "1,284"],
] as const;

const OPTIONS = [
  { value: "a", label: "Hamburg warehouse", hint: "DE" },
  { value: "b", label: "Rotterdam distribution centre", hint: "NL" },
  { value: "c", label: "Gdańsk cold storage", hint: "PL" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <SectionHeader title={title} description={description} />
      {children}
      <Separator className="mt-8" />
    </section>
  );
}

export function DesignSystemView() {
  const [segment, setSegment] = useState("list");
  const [chip, setChip] = useState("all");
  const [combo, setCombo] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>(["a"]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [choice, setChoice] = useState("a");

  return (
    <div className="bg-canvas min-h-svh p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Design system"
          description="Every token, type step and shared component in one place. Keep this in sync when you add either."
        />

        <Section
          title="Brand ramp"
          description="Generated from the project brand color. Use for tints, charts and custom accents."
        >
          <div className="flex flex-wrap gap-2">
            {BRAND_STEPS.map((step) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className="size-14 rounded-md border"
                  style={{ backgroundColor: `var(--brand-${step})` }}
                />
                <span className="text-caption text-muted-foreground tabular-nums">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Semantic slots"
          description="What components actually consume, never a raw ramp step for a surface."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SEMANTIC_TOKENS.map((token) => (
              <div key={token} className="flex items-center gap-2">
                <div
                  className="size-8 shrink-0 rounded-md border"
                  style={{ backgroundColor: `var(--${token})` }}
                />
                <span className="text-caption truncate">{token}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Status tones"
          description="Always via StatusBadge. The dot keeps it readable without color perception."
        >
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <StatusBadge key={tone} tone={tone}>
                {tone}
              </StatusBadge>
            ))}
          </div>
        </Section>

        <Section
          title="Typography"
          description="Reuse these classes instead of re-picking size and weight."
        >
          <div className="flex flex-col gap-3">
            {TYPE_STEPS.map(([className, sample]) => (
              <div key={className} className="flex items-baseline gap-4">
                <code className="text-caption text-muted-foreground w-28 shrink-0">
                  {className}
                </code>
                <span className={className}>{sample}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
          </div>
        </Section>

        <Section title="Metrics">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Orders"
              value="1,284"
              delta={0.124}
              icon={Package}
            />
            <StatCard
              label="Revenue"
              value="€48.2K"
              delta={0.032}
              icon={TrendingUp}
            />
            <StatCard label="Returns" value="37" delta={-0.08} invertDelta />
            <StatCard label="Pending" value="12" hint="awaiting review" />
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* aria-label because this showcase has no visible labels, in a
                real form these are always wrapped by a `components/form` field,
                which associates a proper <label>. */}
            <Input placeholder="Plain input" aria-label="Plain input" />
            <SearchInput value={search} onChange={setSearch} />
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
            />
            <Combobox
              options={OPTIONS}
              value={combo}
              onChange={setCombo}
              placeholder="Select a warehouse"
            />
            <MultiSelect
              options={OPTIONS}
              value={multi}
              onChange={setMulti}
              placeholder="Select several"
            />
          </div>
        </Section>

        <Section title="Selection & navigation">
          <div className="flex flex-col gap-4">
            <SegmentedTabs
              aria-label="View"
              options={[
                { value: "list", label: "List", icon: List },
                { value: "board", label: "Board", icon: LayoutGrid },
              ]}
              value={segment}
              onChange={setSegment}
            />
            <FilterChips
              chips={[
                { value: "all", label: "All", count: 128 },
                { value: "open", label: "Open", count: 12 },
                { value: "done", label: "Completed", count: 116 },
              ]}
              value={chip}
              onChange={setChip}
            />
            <Stepper
              steps={[
                { label: "Details" },
                { label: "Schedule" },
                { label: "Review" },
              ]}
              current={1}
            />
          </div>
        </Section>

        <Section title="People">
          <div className="flex items-center gap-6"></div>
        </Section>

        <Section
          title="Long text handling"
          description="The container is fixed-width; the value must truncate rather than widen it."
        >
          <Card className="max-w-sm">
            <CardContent>
              <DescriptionList
                items={[
                  { label: "Reference", value: "ORD-2026-000481" },
                  {
                    label: "Customer",
                    value:
                      "Internationale Handelsgesellschaft für Speditionslogistik mbH & Co. KG",
                  },
                  {
                    label: "Tracking",
                    value: (
                      <span className="flex min-w-0 items-center gap-1">
                        <TruncatedText
                          text="1Z999AA10123456784"
                          className="text-data"
                        />
                        <CopyButton value="1Z999AA10123456784" />
                      </span>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Async states"
          description="Every data surface ships all four. Loading is a layout-matching skeleton, never a screen spinner."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-h4">Empty</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="No orders yet"
                  hint="Orders appear here as soon as the first one is placed."
                  action={<Button size="sm">New order</Button>}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-h4">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorState
                  error={
                    new ApiError(503, "The service is temporarily unavailable.")
                  }
                  onRetry={() => undefined}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CardSkeleton />
            <Card>
              <CardContent>
                <ListSkeleton rows={3} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <DetailSkeleton rows={3} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <FormSkeleton fields={2} />
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <StatsSkeleton count={4} />
          </div>
        </Section>

        {/* ── The marketing layer, added on top of the product catalog above ── */}

        <Section
          title="Surfaces"
          description="A section flips the whole palette for its subtree with data-surface. Every child adapts, including shadcn primitives, because they consume semantic slots and never raw ramp steps."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {(["paper", "slab"] as const).map((surface) => (
              <div
                key={surface}
                data-surface={surface}
                className="border-hairline flex flex-col gap-3 rounded-lg border p-5"
              >
                <Eyebrow>data-surface=&quot;{surface}&quot;</Eyebrow>
                <p className="text-display-3">The ground changes</p>
                <p className="text-muted-foreground text-sm">
                  Body copy, muted copy, hairlines and the primary action all
                  resolve against this surface.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm">Primary</Button>
                  <StatusBadge tone="success">Live</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Marketing type scale"
          description="Fluid, editorial, and separate from the dense product scale above, which the shared component catalog still depends on."
        >
          <div className="flex flex-col gap-4">
            {MARKETING_TYPE_STEPS.map(([className, label]) => (
              <div key={className} className="flex flex-col gap-1">
                <span className="text-caption text-muted-foreground font-mono">
                  .{className}
                </span>
                <span className={className}>{label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Motion"
          description="Four durations, two easings. Anything not built from these does not ship. All of them resolve to 1ms under prefers-reduced-motion."
        >
          <DescriptionList
            items={MOTION_TOKENS.map(([token, value, use]) => ({
              label: token,
              value: `${value}, ${use}`,
            }))}
          />
        </Section>

        <Section
          title="Media frames"
          description="One API over images, video and synthetic interface compositions. The aspect ratio is reserved in CSS, so nothing shifts on load."
        >
          <MediaFrame
            media={DEMO_MEDIA}
            caption="frame=browser · kind=synthetic"
          />
        </Section>

        <Section
          title="Choice cards"
          description="The site's low-effort choice control. Single-select is a real radio group (arrow keys, announced position); multi-select uses aria-pressed toggles."
        >
          <ChoiceCards
            label="Example choice"
            columns={2}
            options={[
              {
                id: "a",
                label: "Web Application",
                hint: "An internal tool, a portal",
              },
              {
                id: "b",
                label: "AI Product",
                hint: "Agents, retrieval, LLM features",
              },
            ]}
            value={choice}
            onChange={setChoice}
          />
        </Section>

        <Section
          title="Editorial primitives"
          description="Eyebrow, hairline list, arrow link and the honesty marker used wherever a claim is not yet verified."
        >
          <div className="flex flex-col gap-6">
            <Eyebrow index={1}>Section label</Eyebrow>
            <HairlineList
              items={[
                "A supporting point, separated by a rule rather than a bullet",
                "A second one, to show the rhythm",
              ]}
            />
            <ArrowLink href="/work">View all work</ArrowLink>
            <PlaceholderNote tone="panel">
              Illustrative content. Replace it in src/content and this treatment
              disappears on its own.
            </PlaceholderNote>
          </div>
        </Section>
      </div>
    </div>
  );
}
