import type { ProcessStage } from "./schemas";

/**
 * DEVELOPMENT PROCESS.
 *
 * Each stage says what happens and — the part a buyer is actually evaluating —
 * what they receive at the end of it. A stage with no deliverable is a meeting.
 */
export const processStages: ProcessStage[] = [
  {
    id: "discover",
    name: "Discover",
    what: "We learn the domain from the people in it: interviews, current-state mapping, and time watching the work happen. We also find out what will make this hard.",
    receives: [
      "A written summary of the problem, in your vocabulary",
      "An itemised list of risks, integrations and unknowns",
      "A recommendation on whether to proceed, and how",
    ],
    duration: "1–2 weeks",
  },
  {
    id: "define",
    name: "Define",
    what: "Scope becomes concrete. We agree what the first release contains, what it deliberately excludes, and how we will know it worked.",
    receives: [
      "A prioritised scope with a shippable first release",
      "Architecture and data model decisions, with the trade-offs recorded",
      "An estimate with its assumptions attached, so a change to one is visible",
    ],
    duration: "1–2 weeks",
  },
  {
    id: "design",
    name: "Design",
    what: "Flows, then screens, then a system. We design every state — loading, empty, error, and too much data — because those are the ones that get discovered late.",
    receives: [
      "A design system: tokens, components and the rules for extending it",
      "High-fidelity designs for the full flow, all states included",
      "A clickable prototype of anything genuinely uncertain",
    ],
    duration: "2–4 weeks",
  },
  {
    id: "engineer",
    name: "Engineer",
    what: "Two-week iterations against a working deployment. Typed end to end, tested where the cost of being wrong is high, reviewed before it merges.",
    receives: [
      "A deployed environment updated every iteration, not a demo build",
      "Iteration notes: what shipped, what moved, what we learned",
      "Access to the repository from day one — it is yours",
    ],
    duration: "6–16 weeks, typically",
  },
  {
    id: "validate",
    name: "Validate",
    what: "We test the product against reality: real data volumes, real devices, keyboard-only paths, screen readers, and the failure modes we can force.",
    receives: [
      "Accessibility and performance reports with the fixes applied",
      "Load and failure testing against expected volumes",
      "A known-issues list — the honest one, not the empty one",
    ],
    duration: "1–2 weeks",
  },
  {
    id: "launch",
    name: "Launch",
    what: "A rehearsed release. Migration dry-run, monitoring in place, rollback tested rather than assumed, and someone on hand who wrote the code.",
    receives: [
      "A release runbook and a rehearsed rollback",
      "Monitoring, alerting and error reporting wired to your channels",
      "Handover documentation and a working session with your team",
    ],
    duration: "1 week",
  },
  {
    id: "evolve",
    name: "Evolve",
    what: "What happens after launch is where most software is won or lost. We measure real usage, fix what the first weeks reveal, and keep dependencies current.",
    receives: [
      "A post-launch review against the success measures agreed in Define",
      "A prioritised backlog from real usage, not from the original plan",
      "Retained capacity, or a clean handover — decided up front, not at the end",
    ],
    duration: "Ongoing, or handover",
  },
];
