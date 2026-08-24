import type { BuildType, ServiceGroup } from "./schemas";

/**
 * SERVICES CONTENT.
 *
 * Six capability groups. The order is the order a client experiences them, not
 * an org chart — strategy through evolution. `relatedProjectSlug` is what
 * connects a capability to real work, which is the only thing that makes a
 * service list credible.
 */
export const serviceGroups: ServiceGroup[] = [
  {
    id: "strategy",
    name: "Strategy & Product",
    summary:
      "Before anyone writes code, we work out what is actually being built and what would make it a mistake. Discovery ends in a plan you could hand to a different team.",
    deliverables: [
      "A written product thesis and the decisions behind it",
      "Technical discovery: constraints, integrations, risks, and what we don't yet know",
      "A prioritised scope with a first release you could ship",
      "A clickable prototype of the flows that carry the risk",
    ],
    capabilities: [
      {
        name: "Product Discovery",
        description:
          "Interviews, current-state mapping, and a scope that survives contact with the constraints.",
      },
      {
        name: "Technical Discovery",
        description:
          "Integration surfaces, data realities and delivery risks, itemised before they set the budget.",
      },
      {
        name: "Product Strategy",
        description:
          "What to build first, what to defer, and the argument for both — written down.",
      },
      {
        name: "UX Research",
        description:
          "Time with the people who will use it, in the place they will use it.",
      },
      {
        name: "Prototyping",
        description:
          "A clickable version of the risky flow, tested before it becomes a schema.",
      },
    ],
    relatedProjectSlug: "harborlight",
  },
  {
    id: "design",
    name: "Design",
    summary:
      "Interfaces that a domain expert can move through quickly, built on a system rather than a set of screens — so the tenth feature looks like it belongs with the first.",
    deliverables: [
      "A design system: tokens, components, states, and the rules for extending it",
      "High-fidelity designs for every state, not only the happy path",
      "Accessibility built in — contrast, focus order, keyboard paths",
      "Design files that map one-to-one onto the components in the codebase",
    ],
    capabilities: [
      {
        name: "UX Design",
        description:
          "Information architecture, flows and the states everyone forgets: empty, loading, error, too much data.",
      },
      {
        name: "UI Design",
        description:
          "Typography, colour, density and motion, resolved as a system rather than per screen.",
      },
      {
        name: "Product Design",
        description:
          "End-to-end ownership of a product surface, from the argument to the pixel.",
      },
      {
        name: "Design Systems",
        description:
          "Tokens and components your team can extend without our involvement.",
      },
      {
        name: "Website Design",
        description:
          "Marketing surfaces that carry the same standard as the product behind them.",
      },
    ],
    relatedProjectSlug: "nova",
  },
  {
    id: "engineering",
    name: "Engineering",
    summary:
      "Production software: typed end to end, tested where it matters, observable, and structured so the second team to touch it can find their way around.",
    deliverables: [
      "A running application with CI, environments and a deployment path",
      "Test coverage aimed at the logic that is expensive to get wrong",
      "Observability: logs, traces and the alerts that actually page someone",
      "Documentation an engineer who wasn't there can onboard from",
    ],
    capabilities: [
      {
        name: "Web Applications",
        description:
          "Server-rendered, typed, fast on the devices your users actually have.",
      },
      {
        name: "SaaS Development",
        description:
          "Multi-tenancy, billing, roles and audit trails — the parts that are tedious and load-bearing.",
      },
      {
        name: "Custom Software",
        description:
          "Internal tools and line-of-business systems that replace a spreadsheet nobody admits to depending on.",
      },
      {
        name: "Backend Systems",
        description:
          "Data models, workflows and integrations built to be replayed, not re-run by hand.",
      },
      {
        name: "APIs",
        description:
          "Versioned, documented, and validated at the boundary in both directions.",
      },
      {
        name: "Cloud Infrastructure",
        description:
          "Infrastructure as code, environments that match, and a rollback you have actually rehearsed.",
      },
    ],
    relatedProjectSlug: "ledgerline",
  },
  {
    id: "mobile",
    name: "Mobile",
    summary:
      "Apps for people who are standing up, outdoors, or somewhere with no signal. Offline behaviour is a design decision, not an error state.",
    deliverables: [
      "Store-ready iOS and Android builds with a release pipeline",
      "An explicit offline and sync model, documented and monitored",
      "Device-tested interaction: one hand, gloves, bad light, low battery",
      "Crash and performance reporting wired in from the first build",
    ],
    capabilities: [
      {
        name: "iOS",
        description:
          "Native or cross-platform, whichever the product's requirements actually justify.",
      },
      {
        name: "Android",
        description:
          "Including the older, cheaper devices a field workforce is issued.",
      },
      {
        name: "Cross-platform Applications",
        description:
          "One codebase where that is honest, with platform-specific behaviour where it is not.",
      },
    ],
    relatedProjectSlug: "northbound",
  },
  {
    id: "ai",
    name: "AI & Automation",
    summary:
      "Language models put behind real constraints: your data, your authorization rules, an audit trail, and a human on the commitments that matter.",
    deliverables: [
      "An evaluation set before a prompt reaches production",
      "Tool-calling against your existing authorized APIs — no privileged shortcut",
      "Full traces: prompt, tools, cost and outcome, per run",
      "A cost model, and a fallback for when the provider is down",
    ],
    capabilities: [
      {
        name: "AI Applications",
        description:
          "Products where the model is a component with a specified job, not the pitch.",
      },
      {
        name: "LLM Integrations",
        description:
          "Retrieval, structured output and tool use, evaluated against a fixed set before launch.",
      },
      {
        name: "AI Agents",
        description:
          "Scoped autonomy: what it may do, what it must ask about, and what it logs either way.",
      },
      {
        name: "Workflow Automation",
        description:
          "The repetitive path automated, the exception routed to a person with context.",
      },
      {
        name: "Internal AI Tools",
        description:
          "Assistants over your own documents and systems, with permissions that hold.",
      },
    ],
    relatedProjectSlug: "nova",
  },
  {
    id: "evolution",
    name: "Product Evolution",
    summary:
      "Most software that matters already exists. We make it faster, safer to change, and better to use — without the rewrite that gets pitched and then abandoned halfway.",
    deliverables: [
      "A measured baseline before any change, so improvement is provable",
      "A phased plan with a working system at every step",
      "Performance work tied to real user metrics, not a synthetic score",
      "Handover, or an ongoing team — your choice, stated up front",
    ],
    capabilities: [
      {
        name: "Product Modernization",
        description:
          "Incremental migration with the old system live until the new one has earned it.",
      },
      {
        name: "Performance Optimization",
        description:
          "Profiling first. Nearly every slow product is a waterfall, not a render cost.",
      },
      {
        name: "UX Improvements",
        description:
          "Targeted work on the flows where users actually stall or give up.",
      },
      {
        name: "Engineering Support",
        description:
          "Retained capacity for maintenance, dependency upgrades and the small requests.",
      },
      {
        name: "Dedicated Teams",
        description:
          "An embedded team working in your process, with our standards, reporting to you.",
      },
    ],
    relatedProjectSlug: "switchyard",
  },
];

/**
 * Step one of the project inquiry — a single low-effort choice.
 *
 * `id` is submitted with the inquiry payload, so treat these as a stable
 * contract with whatever receives it.
 */
export const buildTypes: BuildType[] = [
  {
    id: "web-app",
    label: "Web Application",
    hint: "An internal tool, a portal, a dashboard",
  },
  {
    id: "mobile-app",
    label: "Mobile Application",
    hint: "iOS, Android, or both",
  },
  {
    id: "saas-platform",
    label: "SaaS Platform",
    hint: "Multi-tenant, billed, sold to others",
  },
  {
    id: "ai-product",
    label: "AI Product",
    hint: "Agents, retrieval, LLM features",
  },
  {
    id: "website",
    label: "Website",
    hint: "Marketing site, ecommerce, content",
  },
  {
    id: "improve-existing",
    label: "Improve an Existing Product",
    hint: "Performance, UX, modernization",
  },
  {
    id: "dedicated-team",
    label: "Dedicated Development Team",
    hint: "Embedded engineers and designers",
  },
  {
    id: "something-else",
    label: "Something Else",
    hint: "Tell us in your own words",
  },
];
