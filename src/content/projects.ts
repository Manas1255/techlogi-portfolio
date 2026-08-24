import type { Composition, Media, Project } from "./schemas";

/**
 * PORTFOLIO CONTENT.
 *
 * ⚠️ PLACEHOLDER: every entry below is illustrative. `isPlaceholder: true`
 * makes that visible on the case-study page rather than presenting invented
 * work as fact, and every `metrics` entry carries a `note` saying so.
 *
 * Replacing one with a real engagement:
 *   1. Edit the entry here — the schema in `./schemas.ts` is the contract.
 *   2. Set `isPlaceholder: false` and remove the metric notes (or replace them
 *      with a real source, e.g. "Measured over the first two quarters post-launch").
 *   3. Drop real media into `public/media/projects/<slug>/` and change
 *      `kind: "synthetic"` to `"image"` or `"video"`. No markup changes.
 *
 * Nothing else in the codebase needs to know: routes, the home-page selection,
 * `/work` filters, related-project links and the sitemap all derive from here.
 */

/** A synthetic composition, framed as a product in a browser. */
function browser(
  composition: Composition,
  chromeUrl: string,
  alt: string,
  aspect: "16/9" | "16/10" | "3/2" = "16/10",
): Media {
  return {
    kind: "synthetic",
    composition,
    animate: true,
    frame: "browser",
    chromeUrl,
    aspect,
    alt,
  };
}

/** A synthetic composition, framed as a phone. */
function device(composition: Composition, alt: string): Media {
  return {
    kind: "synthetic",
    composition,
    animate: true,
    frame: "device",
    chromeUrl: null,
    aspect: "9/16",
    alt,
  };
}

/** A synthetic composition on a bare hairline frame, for full-bleed panels. */
function bare(
  composition: Composition,
  alt: string,
  aspect: "16/9" | "16/10" | "3/2" | "4/3" = "16/9",
): Media {
  return {
    kind: "synthetic",
    composition,
    animate: true,
    frame: "bare",
    chromeUrl: null,
    aspect,
    alt,
  };
}

export const projects: Project[] = [
  {
    slug: "nova",
    name: "Nova",
    tagline: "AI-assisted operations platform for a freight network",
    summary:
      "Dispatchers were coordinating 400 daily shipments across email, three spreadsheets and a phone. Nova consolidates the network into one operational view and puts an agent behind the repetitive decisions — exception triage, carrier selection, customer updates — while leaving every commitment under human sign-off.",
    industry: "Freight & logistics",
    productType: "SaaS platform",
    whatWeDid:
      "Product strategy, design system, full-stack build, and an LLM agent layer with tool-calling against the client's own dispatch APIs.",
    outcome:
      "Dispatch moved off spreadsheets entirely. Exception handling that used to interrupt a person now arrives pre-triaged with a recommended action and a one-click override.",
    metrics: [
      {
        label: "Dispatch actions per shipment",
        value: "−60%",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
      {
        label: "Time to first quote",
        value: "9 min → 40 s",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
      {
        label: "Agent actions under review",
        value: "100%",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
    ],
    services: [
      "Product Strategy",
      "UX/UI Design",
      "Full-Stack Development",
      "AI Integration",
    ],
    platforms: ["Web", "API"],
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Temporal",
      "OpenAI",
      "AWS",
    ],
    categories: ["saas", "ai"],
    period: "2024 — ongoing",
    heroMedia: browser(
      "agent-console",
      "nova.app/dispatch",
      "Nova's dispatch console: an exception queue beside an agent run showing each tool call it made before recommending a carrier.",
      "16/9",
    ),
    galleryMedia: [
      bare(
        "ops-board",
        "Nova's network board, with shipments grouped by lane and exceptions surfaced in a dedicated column.",
        "16/9",
      ),
      browser(
        "analytics",
        "nova.app/insights",
        "Nova's margin view: cost per lane over time against a committed-rate baseline.",
        "16/10",
      ),
    ],
    video: null, // TODO: add a demo reel at public/media/projects/nova/reel.{webm,mp4}
    testimonial: {
      quote:
        "PLACEHOLDER — a real quote from the client sponsor goes here, approved in writing, ideally naming the specific thing that changed for their team.",
      person: "PLACEHOLDER — Name",
      role: "PLACEHOLDER — Role",
      company: "PLACEHOLDER — Company",
      projectSlug: "nova",
      portrait: null,
      outcome: null,
      isPlaceholder: true,
    },
    caseStudySections: [
      {
        kind: "problem",
        title: "Coordination was the product, and it lived in email",
        body: [
          "Nova's team ran a freight network out of a shared inbox. Every shipment touched four systems that did not know about each other, and the only place the full picture existed was in the head of whichever dispatcher happened to own that lane.",
          "That works until it doesn't. Onboarding a dispatcher took six weeks. A single person being out meant a lane ran blind. And nobody could answer the question the board kept asking: which lanes are actually profitable?",
        ],
        points: [
          "Four systems of record, no shared identifier for a shipment",
          "Exception handling was reactive — a customer usually noticed first",
          "Margin was reconstructed monthly, in a spreadsheet, by hand",
        ],
        media: null,
      },
      {
        kind: "approach",
        title: "One shipment identity, then everything else",
        body: [
          "We started with a two-week technical discovery on the data, not the UI. Until a shipment has one identity across the carrier API, the TMS, the billing export and the customer portal, no interface can be trusted — it can only be plausible.",
          "That produced a canonical shipment model, an event log for every state change, and a reconciliation job that reported disagreements between systems instead of silently picking a winner. The UI work started only once that was landing.",
        ],
        points: [
          "Canonical shipment model with a per-source provenance trail",
          "Append-only event log — every state change is attributable",
          "Reconciliation surfaced as an operational queue, not a silent job",
        ],
        media: bare(
          "data-pipeline",
          "Nova's ingestion view: four source systems reconciling into one canonical shipment, with disagreements routed to a review queue.",
          "16/9",
        ),
      },
      {
        kind: "design",
        title: "A console for people who already know their job",
        body: [
          "Dispatchers are experts. The design brief was to remove keystrokes, not to explain freight to them. Density is high on purpose, keyboard navigation covers every primary action, and the exception queue is the default landing view because that is the actual job.",
          "The agent lives inside that queue rather than in a chat panel beside it. It proposes; the dispatcher commits. Every recommendation shows the tool calls behind it, so a suggestion can be checked in a glance instead of trusted on faith.",
        ],
        points: [
          "Keyboard-first: every primary action has a shortcut and a visible focus state",
          "Agent recommendations always show their inputs and their tool calls",
          "No modal ever blocks the queue",
        ],
        media: browser(
          "agent-console",
          "nova.app/exceptions",
          "An exception in Nova, with the agent's reasoning trail expanded beneath its recommended action.",
          "16/10",
        ),
      },
      {
        kind: "build",
        title: "Durable workflows, because freight doesn't retry politely",
        body: [
          "Carrier APIs time out, return stale rates, and occasionally accept the same booking twice. We put every multi-step operation behind a durable workflow engine with idempotency keys at each external boundary, so a partial failure resumes instead of leaving a shipment half-booked.",
          "The agent layer calls the same internal APIs a dispatcher does — no privileged shortcut. That constraint made it straightforward to audit, and it means a permission change applies to humans and agents at once.",
        ],
        points: [
          "Idempotent carrier integrations with replayable workflows",
          "Agent tools are the same authorized endpoints the UI uses",
          "Every agent action is logged with its prompt, tools and outcome",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "Dispatch runs on Nova",
        body: [
          "The spreadsheets are gone. New dispatchers are productive in days rather than weeks, because the exception queue teaches the job as they work through it. The margin question is answered continuously instead of monthly.",
          "We stayed on after launch. The current work is expanding the agent's remit one decision at a time, each behind a measurement that tells us whether it earned the trust.",
        ],
        points: [],
        media: browser(
          "analytics",
          "nova.app/insights",
          "Nova's margin view after launch, with per-lane cost trending against committed rates.",
          "16/10",
        ),
      },
    ],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    tagline: "Reconciliation workspace for finance teams",
    summary:
      "A payments company was closing its books with a 40-tab spreadsheet and four days of manual matching. Ledgerline turns that into a reviewable workflow: rules do the obvious matches, humans arbitrate the rest, and every decision keeps an audit trail an auditor will actually accept.",
    industry: "Fintech",
    productType: "Web application",
    whatWeDid:
      "Discovery, product design, and a full-stack build with a rules engine, an exception workflow, and an immutable audit log.",
    outcome:
      "Month-end close became a reviewable queue instead of a spreadsheet marathon, and every adjustment carries the reason it was made.",
    metrics: [
      {
        label: "Auto-matched transactions",
        value: "94%",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
      {
        label: "Close cycle",
        value: "4 days → 1",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
    ],
    services: [
      "Technical Discovery",
      "Product Design",
      "Web Application Development",
      "Data Modelling",
    ],
    platforms: ["Web"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vercel"],
    categories: ["web-app", "data"],
    period: "2024",
    heroMedia: browser(
      "analytics",
      "app.ledgerline.io/close",
      "Ledgerline's close dashboard: matched and unmatched balances by ledger, with an exception queue beneath.",
      "16/10",
    ),
    galleryMedia: [
      bare(
        "data-pipeline",
        "Ledgerline's rule pipeline, showing which rule matched each transaction batch and what it left behind.",
        "16/9",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "The close was a spreadsheet with institutional memory",
        body: [
          "Three people knew how the reconciliation workbook worked, and two of them had built parts of it years apart. Every month it produced a correct answer and no explanation of how.",
          "The company was about to be audited on controls it could describe verbally but not evidence.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Encode the rules that already existed",
        body: [
          "We did not design a new reconciliation methodology. We sat with the finance team and extracted the one they were already running, rule by rule, until the workbook's behaviour was written down as a testable specification.",
          "Each rule became a named, versioned matcher with fixtures drawn from real historical batches, so we could prove the new system reproduced last quarter's close before anyone relied on it for this one.",
        ],
        points: [
          "Rules extracted from the existing workbook, not invented",
          "Historical batches as regression fixtures — the old close is the test suite",
          "Every rule versioned, so a change to matching logic is attributable",
        ],
        media: null,
      },
      {
        kind: "design",
        title: "Designed for the exception, not the happy path",
        body: [
          "Ninety-odd percent of matching is uninteresting; the product's real surface is the remainder. The workspace opens on unmatched items grouped by likely cause, with the evidence for each candidate match side by side and a single keystroke to accept or reject.",
          "Every screen assumes it will be read by someone reconstructing a decision six months later. Reasons are required, not optional, and the interface makes writing one cheap.",
        ],
        points: [
          "Unmatched-first information architecture",
          "Side-by-side evidence for every proposed match",
          "A required reason on every manual adjustment, one keystroke away",
        ],
        media: browser(
          "analytics",
          "app.ledgerline.io/exceptions",
          "An unmatched transaction in Ledgerline with two candidate matches shown side by side.",
          "16/10",
        ),
      },
      {
        kind: "build",
        title: "Append-only, because finance data is evidence",
        body: [
          "Nothing in Ledgerline is updated in place. Adjustments append, matches are events, and the current state of a ledger is a projection over that log. Reversal is a new fact rather than a deletion.",
          "That decision cost some query complexity and bought the audit story outright. It also made a hard requirement trivial: showing exactly what the books looked like on any past date.",
        ],
        points: [
          "Append-only ledger with projected balances",
          "Point-in-time reconstruction of any close",
          "Row-level authorization enforced in the database, not the client",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "A close a reviewer can follow",
        body: [
          "The workbook is retired. The close is now a queue that shrinks, and the audit conversation moved from describing a process to filtering a log.",
          "The rules engine turned out to be the durable asset: the finance team edits matching rules themselves, and engineering is no longer in the path of a policy change.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "harborlight",
    name: "Harborlight",
    tagline: "Yard and fleet operations, from the terminal to the phone",
    summary:
      "A port services operator was running yard moves on paper tickets and radio. Harborlight put the same operation on a tablet in the yard and a dashboard in the office, and made both work when the network doesn't.",
    industry: "Maritime logistics",
    productType: "Web + mobile application",
    whatWeDid:
      "UX research on site, a design system, a web operations console, and an offline-first mobile app for yard crews.",
    outcome:
      "Yard moves are recorded where they happen instead of transcribed at the end of a shift, and the office sees the yard as it is rather than as it was this morning.",
    metrics: [
      {
        label: "Ticket transcription",
        value: "Eliminated",
        note: "PLACEHOLDER — illustrative outcome, not a measured result.",
      },
      {
        label: "Yard state latency",
        value: "6 h → live",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
    ],
    services: [
      "UX Research",
      "Design Systems",
      "Cross-platform Mobile",
      "Backend Systems",
    ],
    platforms: ["Web", "iOS", "Android"],
    technologies: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "SQLite",
    ],
    categories: ["mobile", "web-app"],
    period: "2023 — 2024",
    heroMedia: bare(
      "ops-board",
      "Harborlight's yard board: every bay and its current container, with moves in progress highlighted.",
      "16/9",
    ),
    galleryMedia: [
      device(
        "mobile-field",
        "Harborlight's yard app on a phone: the next move, a container scan, and a queue that works offline.",
      ),
      browser(
        "analytics",
        "harborlight.app/throughput",
        "Harborlight's throughput view: moves per hour by crew and shift.",
        "16/10",
      ),
    ],
    video: null,
    testimonial: {
      quote:
        "PLACEHOLDER — quote from the operations lead, approved in writing. The most useful version names the specific daily friction that disappeared.",
      person: "PLACEHOLDER — Name",
      role: "PLACEHOLDER — Role",
      company: "PLACEHOLDER — Company",
      projectSlug: "harborlight",
      portrait: null,
      outcome: null,
      isPlaceholder: true,
    },
    caseStudySections: [
      {
        kind: "problem",
        title: "The yard and the office kept different books",
        body: [
          "Crews wrote moves on paper and radioed anything urgent. Someone typed the tickets up at the end of a shift. By the time the office saw the yard, the yard had changed.",
          "Every downstream number — throughput, dwell time, billing — inherited that six-hour lag and the transcription errors that came with it.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Two weeks in the yard before a single screen",
        body: [
          "We spent the discovery on site, in high-visibility vests, watching moves happen. The findings that mattered were physical: gloves, direct sunlight, a device held one-handed, and long stretches with no usable signal.",
          "Those constraints set the product's shape more than any workshop did. Offline is not a feature of Harborlight; it is the default assumption, and connectivity is the optimisation.",
        ],
        points: [
          "Observed 40+ yard moves across three shifts, including night",
          "Glove-sized targets and sunlight-legible contrast as hard requirements",
          "Offline-first by default, sync as an optimisation",
        ],
        media: null,
      },
      {
        kind: "design",
        title: "One decision per screen, in gloves, in the sun",
        body: [
          "The yard app shows the next move and almost nothing else. Targets are large, contrast is high enough to survive direct sunlight, and confirmation is a deliberate gesture rather than a small button next to a destructive one.",
          "The office console is the opposite: dense, filterable, keyboard-driven. One design system, two honest interpretations of it — the alternative would have been a tablet UI stretched onto a monitor.",
        ],
        points: [
          "56px minimum touch targets, tested with work gloves on",
          "A single design system with distinct density profiles per platform",
          "Destructive actions require a deliberate gesture, never a tap near a tap",
        ],
        media: device(
          "mobile-field",
          "The Harborlight yard app showing a single move with a large confirm target and an offline indicator.",
        ),
      },
      {
        kind: "build",
        title: "Conflict resolution the crew can understand",
        body: [
          "Offline-first means concurrent edits, which means conflicts. We modelled yard moves as intents with a server-assigned order, so two crews claiming the same container produces a clear loser with a clear message rather than a silent overwrite.",
          "The sync queue is visible in the app. A crew member can see what has not reached the office yet, which turned out to matter more for trust than any amount of background reliability.",
        ],
        points: [
          "Intent-based sync with server-ordered resolution",
          "Visible pending queue — no invisible background state",
          "Local SQLite store surviving app kills and dead batteries",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "One set of books",
        body: [
          "Moves are recorded where they happen. Billing and throughput read from the same events the crew created, so a disagreement between the yard and the office is now a bug rather than a routine.",
          "The design system outlived the first release: the operator has since added two internal tools on it without our involvement.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "meridian",
    name: "Meridian",
    tagline: "Clinical trial data platform for a research network",
    summary:
      "Site coordinators across eleven hospitals were submitting trial data in eleven dialects of Excel. Meridian ingests, validates and versions that data, and tells a coordinator what is wrong with a submission while they can still fix it.",
    industry: "Healthcare research",
    productType: "Data platform",
    whatWeDid:
      "Technical discovery, schema design, a validation and ingestion pipeline, and the coordinator-facing web application.",
    outcome:
      "Data queries that used to surface weeks later during monitoring are caught at submission, with a specific field and a specific reason.",
    metrics: [
      {
        label: "Submissions passing first validation",
        value: "3× more",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
      {
        label: "Query resolution time",
        value: "−70%",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
    ],
    services: [
      "Technical Discovery",
      "Data Platform Engineering",
      "Product Design",
      "Cloud Infrastructure",
    ],
    platforms: ["Web", "API"],
    technologies: [
      "Next.js",
      "TypeScript",
      "Python",
      "PostgreSQL",
      "Airflow",
      "Azure",
    ],
    categories: ["data", "web-app"],
    period: "2023 — 2024",
    heroMedia: bare(
      "data-pipeline",
      "Meridian's ingestion pipeline: eleven site submissions moving through validation stages, with failures itemised by field.",
      "16/9",
    ),
    galleryMedia: [
      browser(
        "analytics",
        "meridian.health/quality",
        "Meridian's data quality view: completeness and query volume per site over the trial timeline.",
        "16/10",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Eleven sites, eleven spreadsheets, one deadline",
        body: [
          "Each site had evolved its own workbook. Column names differed, units differed, and a date could be one of four formats. The data management team spent its week normalising rather than analysing.",
          "Errors surfaced during monitoring visits, months after the visit that produced them, when the patient encounter was no longer fresh in anyone's memory.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Make the schema the contract, and validate at the edge",
        body: [
          "We wrote one canonical schema per case report form, with units and permissible ranges as part of the definition rather than as documentation. Every submission is validated against it at upload, in the browser, before anything is stored.",
          "Site workbooks did not have to change. Meridian maps each site's dialect to the canonical schema, so adopting the platform cost a coordinator nothing on day one.",
        ],
        points: [
          "Canonical schema per form, with units and ranges as data",
          "Per-site mapping layer — no site had to change its workbook",
          "Validation at upload, in the browser, with a field-level reason",
        ],
        media: null,
      },
      {
        kind: "design",
        title: "An error message a coordinator can act on",
        body: [
          "The interface's whole job is to turn a failed validation into a fix. Errors are grouped by row and field, phrased in the coordinator's vocabulary rather than the schema's, and each one links directly to the cell that caused it.",
          "Partial submissions are first-class. A file with twelve good rows and one bad one uploads twelve rows and holds one, which is what a coordinator wanted the first time they tried it.",
        ],
        points: [
          "Errors phrased in clinical vocabulary, not schema vocabulary",
          "Partial acceptance — one bad row doesn't reject a file",
          "Every error links to the exact cell",
        ],
        media: browser(
          "data-pipeline",
          "A Meridian submission held for review, with three field-level validation errors and a link to each source cell.",
          "16/10",
        ),
      },
      {
        kind: "build",
        title: "Versioned, reproducible, and auditable by design",
        body: [
          "Trial data is regulated data. Every submission is retained as received, every transformation is versioned, and any published dataset can be regenerated from its inputs and the code version that produced it.",
          "Pipelines are idempotent and replayable, so a corrected mapping can be applied to historical submissions without a manual migration.",
        ],
        points: [
          "Raw submissions retained immutably alongside derived datasets",
          "Reproducible builds: dataset = inputs + pipeline version",
          "Replayable mappings for retroactive corrections",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "Problems surface while they're still cheap",
        body: [
          "Validation moved from the monitoring visit to the moment of entry. The data management team's week shifted from normalisation to actual data review.",
          "Adding the twelfth site was a mapping file, not a project.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "switchyard",
    name: "Switchyard",
    tagline: "Headless commerce for a wholesale supplier",
    summary:
      "A supplier with 30,000 SKUs and customer-specific pricing had outgrown a hosted storefront that could not express its business rules. Switchyard is a headless build where price, availability and terms are computed per account rather than looked up.",
    industry: "Wholesale distribution",
    productType: "Ecommerce platform",
    whatWeDid:
      "Product modernization: a headless storefront, a pricing service, and a phased migration off the legacy platform with no ordering downtime.",
    outcome:
      "Account-specific pricing and terms are correct at the first page view, and the catalogue is fast enough to browse rather than search.",
    metrics: [
      {
        label: "Catalogue LCP",
        value: "2.9 s → 0.9 s",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
      {
        label: "Migration downtime",
        value: "None",
        note: "PLACEHOLDER — illustrative outcome, not a measured result.",
      },
    ],
    services: [
      "Product Modernization",
      "Performance Optimization",
      "Web Application Development",
      "APIs",
    ],
    platforms: ["Web"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe"],
    categories: ["commerce", "web-app"],
    period: "2024",
    heroMedia: browser(
      "commerce",
      "shop.switchyard.trade",
      "Switchyard's catalogue: account-specific pricing shown inline, with stock and lead time per warehouse.",
      "16/10",
    ),
    galleryMedia: [
      bare(
        "commerce",
        "A Switchyard order being built, with contract pricing, tiered breaks and per-warehouse availability.",
        "16/9",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "The storefront could not express the business",
        body: [
          "Wholesale pricing is a function, not a number: contract rates, volume breaks, promotional overrides and freight terms all interact, per account. The hosted platform modelled a price field.",
          "Sales absorbed the difference by quoting manually, which meant the website was a catalogue with a phone number rather than a place to order.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Extract pricing first, migrate second",
        body: [
          "We pulled pricing out into its own service before touching the storefront, and pointed the legacy platform at it. That proved the rules were right while the old system was still the one taking orders — the risky part, de-risked first.",
          "Only then did the new storefront get built against the same service, and traffic moved across catalogue-first, checkout last.",
        ],
        points: [
          "Pricing service extracted and validated behind the legacy storefront",
          "Phased cutover: catalogue, then account, then checkout",
          "Both systems live against one pricing source during the transition",
        ],
        media: null,
      },
      {
        kind: "design",
        title: "Buying, not browsing",
        body: [
          "Wholesale buyers arrive knowing what they want. The interface optimises for re-ordering and bulk entry: paste a list of SKUs, see availability per warehouse, and get the real landed price without a quote request.",
          "Nothing is hidden behind a login that does not need to be. Public pricing shows list; signing in resolves it to the account's contract terms in place, on the same page.",
        ],
        points: [
          "Paste-a-list bulk entry as a primary path",
          "Per-warehouse availability and lead time on the product row",
          "List → contract price resolved in place after sign-in",
        ],
        media: browser(
          "commerce",
          "shop.switchyard.trade/order",
          "Switchyard's bulk order pad, resolving pasted SKUs to contract pricing and per-warehouse stock.",
          "16/10",
        ),
      },
      {
        kind: "build",
        title: "Personalised and still fast",
        body: [
          "Per-account pricing is hostile to caching if you let it be. The catalogue ships as static content with prices resolved at the edge from a small, cacheable rate set per contract group, so a personalised page still arrives in one round trip.",
          "Stock is the only genuinely live value on the page, and it streams in after first paint rather than blocking it.",
        ],
        points: [
          "Static catalogue + edge-resolved pricing per contract group",
          "Availability streamed after first paint",
          "Idempotent order submission — a double-tap cannot double-order",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "The website takes orders now",
        body: [
          "Sales stopped quoting the routine cases, and the catalogue became fast enough that buyers browse it instead of searching for a part number they already knew.",
          "The pricing service is the reusable asset: the client's own team has since put a mobile rep tool on it.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "northbound",
    name: "Northbound",
    tagline: "Field service app for a utility contractor",
    summary:
      "Two hundred field technicians were dispatched by phone and reported by paper. Northbound gives each of them their day, the asset history for the job in front of them, and a way to close it out that works in a basement with no signal.",
    industry: "Utilities",
    productType: "Mobile application",
    whatWeDid:
      "Product discovery, cross-platform mobile build, offline sync, and integration with the client's existing work-order system.",
    outcome:
      "Technicians arrive with the asset's history instead of calling for it, and a job closes in the field rather than at the end of the week.",
    metrics: [
      {
        label: "Paper work orders",
        value: "Eliminated",
        note: "PLACEHOLDER — illustrative outcome, not a measured result.",
      },
      {
        label: "Same-day closeout",
        value: "2× more",
        note: "PLACEHOLDER — illustrative figure, not a measured result.",
      },
    ],
    services: [
      "Product Discovery",
      "Cross-platform Applications",
      "APIs",
      "Engineering Support",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart", "Node.js", "PostgreSQL"],
    categories: ["mobile"],
    period: "2023",
    heroMedia: device(
      "mobile-field",
      "Northbound on a phone: today's route, the current job, and an offline-capable closeout form.",
    ),
    galleryMedia: [],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "The information was in the office, the work was in a basement",
        body: [
          "A technician standing at an asset had no way to see what had been done to it last time without calling someone who could look it up. Reporting happened on paper and reached the system days later.",
          "The work-order system was fine. It just had no presence anywhere near the work.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Wrap the system of record, don't replace it",
        body: [
          "Replacing the work-order system was never on the table and did not need to be. Northbound is a field client for it: a sync boundary, a local store, and an interface built for one pair of hands in poor light.",
          "That kept the project's scope to the part that was actually broken, and meant the office team's tooling and reporting continued to work unchanged.",
        ],
        points: [
          "Integration, not replacement — the system of record stayed put",
          "One sync boundary, explicitly designed and monitored",
          "No change required to office workflows",
        ],
        media: null,
      },
      {
        kind: "design",
        title: "One hand, bad light, no signal",
        body: [
          "Every primary action is reachable with a thumb. Photo capture, the single most-used feature, is one tap from the job screen and queues locally without blocking the form.",
          "Asset history is the screen technicians open most, so it is one tap from the job and readable without scrolling: last visit, what was replaced, what was flagged.",
        ],
        points: [
          "Thumb-reachable primary actions throughout",
          "Photo capture queues locally, never blocks the form",
          "Asset history one tap away, legible without scrolling",
        ],
        media: device(
          "mobile-field",
          "Northbound's job screen with asset history, a photo queue and a closeout form that works offline.",
        ),
      },
      {
        kind: "build",
        title: "Sync you can see",
        body: [
          "Attachments dominate the payload, so uploads are chunked, resumable and prioritised behind the structured data — a closeout is accepted before its photos finish.",
          "The sync state is visible and honest: what is pending, what failed, and what to do about it. A technician who can see the queue stops distrusting it.",
        ],
        points: [
          "Resumable chunked uploads, prioritised behind structured data",
          "Explicit, visible sync state with an actionable failure path",
          "Battery-aware background sync",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "Closeout happens at the asset",
        body: [
          "Jobs close where the work happens. The office stopped fielding history lookups, and the reporting that depended on paper arriving is now current.",
          "We remain on a support retainer, mostly shipping small things technicians ask for.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: false,
    isPlaceholder: true,
  },
];
