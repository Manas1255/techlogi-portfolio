import type { Capability, TechChip } from "./schemas";

/**
 * WHAT WE CAN BUILD.
 *
 * The home page's answer to "are these people capable of my thing?". It is
 * deliberately a different artefact from `serviceGroups`: that one is a
 * reference index for someone who has decided to read, this one is for someone
 * deciding whether to keep scrolling.
 *
 * Every chip names a technology GA Studio has actually shipped, traceable to a
 * project in `projects.ts`. That constraint is the whole point. A capability
 * grid listing everything a studio could theoretically do is a price list, not
 * evidence, and it is the single easiest thing on a site like this to inflate.
 *
 * `diagram` picks the drawn illustration:
 *   orbit  a central mark with satellites, for a toolset
 *   flow   nodes converging on an outcome, for a pipeline
 */
export const capabilities: Capability[] = [
  {
    id: "mobile",
    name: "Mobile applications",
    description:
      "Cross-platform apps built from one Flutter codebase, shipped to both stores. Every project in our portfolio is one, so this is the thing we have done most and know best.",
    diagram: "orbit",
    icon: "smartphone",
    /** The emphasised chip. One per card, the thing the diagram is about. */
    focus: "Flutter",
    chips: [
      { label: "Dart" },
      { label: "BLoC / Cubit" },
      { label: "iOS" },
      { label: "Android" },
      { label: "Clean Architecture" },
    ],
    projectSlug: "orthotrack",
  },
  {
    id: "backend",
    name: "Backends and APIs",
    description:
      "The part clients rarely see and always feel. Authentication, data modelling, payments, file storage and the integrations that have to keep working when a third party has an outage.",
    diagram: "orbit",
    icon: "server",
    focus: "Node.js",
    chips: [
      { label: "Express" },
      { label: "MongoDB" },
      { label: "PostgreSQL" },
      { label: "Stripe" },
      { label: "OAuth" },
    ],
    projectSlug: "our-ummah",
  },
  {
    id: "ai",
    name: "AI that does a job",
    description:
      "Models put behind real constraints: your data, your permissions, an audit trail, and a human on anything that commits. We have shipped both a vision pipeline and a coaching assistant.",
    diagram: "flow",
    icon: "sparkles",
    focus: "Scored, then reviewed",
    chips: [
      { label: "Vision models" },
      { label: "LLM integration" },
      { label: "Background jobs" },
      { label: "Threshold alerts" },
    ],
    projectSlug: "orthotrack",
  },
  {
    id: "web",
    name: "Web applications",
    description:
      "Server-rendered, typed end to end, and fast on the devices your users actually carry. This site is one of them, and so is the CLI that scaffolded it.",
    diagram: "orbit",
    icon: "monitor",
    focus: "Next.js",
    chips: [
      { label: "React" },
      { label: "TypeScript" },
      { label: "Tailwind" },
      { label: "Zod" },
      { label: "Playwright" },
    ],
    projectSlug: null,
  },
  {
    id: "realtime",
    name: "Real-time and location",
    description:
      "Chat, presence, live updates and maps. Hard to retrofit and easy to get subtly wrong, so we put them behind clean boundaries from the first commit.",
    diagram: "flow",
    icon: "radio",
    focus: "Live, and it stays live",
    chips: [
      { label: "GetStream" },
      { label: "Mapbox" },
      { label: "Firebase Cloud Messaging" },
      { label: "Offline sync" },
    ],
    projectSlug: "soulmate-society",
  },
  {
    id: "design",
    name: "Product design",
    description:
      "Flows, then screens, then a system. We design every state including the ones that get discovered late: loading, empty, error, and far too much data.",
    diagram: "orbit",
    icon: "palette",
    focus: "Design systems",
    chips: [
      { label: "UX research" },
      { label: "Prototyping" },
      { label: "Design tokens" },
      { label: "Accessibility" },
    ],
    projectSlug: "zyuela",
  },
] satisfies Capability[];

/**
 * HOW WE ARE DIFFERENT.
 *
 * A side-by-side of what a client is usually worried about against what we
 * actually do. It earns its place only because every right-hand claim is
 * checkable somewhere else on this site, which is the test each line had to
 * pass to be here.
 *
 * Deliberately about US, never about a named competitor. "Other agencies do X"
 * is unfalsifiable and reads as insecurity.
 */
export const differences: { concern: string; answer: string }[] = [
  {
    concern: "You get a sales team, then a different team builds it",
    answer: "The people who scope your project are the people who write it",
  },
  {
    concern: "An estimate with no assumptions attached",
    answer: "Estimates state what they assume, so a change to one is visible",
  },
  {
    concern: "The happy path is designed, the rest is improvised",
    answer: "Loading, empty, error and too-much-data are designed up front",
  },
  {
    concern: "You find out it is late at the end",
    answer: "A deployed environment updated every iteration, not a demo build",
  },
  {
    concern: "Handover is a zip file and a phone number",
    answer:
      "Your repository from day one, plus docs someone else can onboard from",
  },
  {
    concern: "After launch, everyone disappears",
    answer:
      "A post-launch review against the measures agreed before we started",
  },
];

export type { TechChip };
