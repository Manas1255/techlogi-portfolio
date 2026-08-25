import { l, type Localized } from "./localized";
import type { RawCapability, TechChip } from "./schemas";

/**
 * WHAT WE BUILD.
 *
 * The portfolio proves we finished things. This section answers the question
 * that comes before that one: can these people build MY thing? A visitor whose
 * project does not resemble anything in the portfolio needs somewhere to
 * recognise themselves, and a list of case studies is not it.
 *
 * Eight entries, up from six, and rewritten in the words a buyer uses rather
 * than the words a studio uses. "Websites", not "web presence". "Internal
 * tools", not "bespoke operational software". The previous set named things
 * like "Backends and APIs", which is what we do, not what anyone arrives
 * looking for; a founder searching for someone to build their MVP does not
 * recognise themselves in a card about data modelling.
 *
 * Two rules hold this honest, and they are the reason the section is worth
 * anything at all:
 *
 *   1. Every chip names a technology we have ACTUALLY SHIPPED, traceable to a
 *      project in `projects.ts`. Not one we could learn.
 *   2. Every card that claims a capability links to where we used it. A card
 *      with no `projectSlug` is a capability with no receipt, and it says so
 *      by staying silent rather than borrowing another project's credibility.
 *
 * That link is the whole difference between this and a price list.
 */
export const capabilities: RawCapability[] = [
  {
    id: "mobile",
    name: l("Mobile apps", "Apps"),
    description: l(
      "One Flutter codebase, shipped to both stores. It is the thing we have done most: every product on the strip above is one.",
      "Eine Flutter-Codebasis, ausgeliefert in beide Stores. Das haben wir am häufigsten gemacht: jedes Produkt im Streifen oben ist eines.",
    ),
    icon: "smartphone",
    focus: l("Flutter", "Flutter"),
    chips: [{ label: "Dart" }, { label: "iOS" }, { label: "Android" }],
    projectSlug: "soulmate-society",
  },
  {
    id: "websites",
    name: l("Websites", "Websites"),
    description: l(
      "Marketing sites and landing pages that load fast, rank, and read well on a phone. Static where it can be, dynamic where it has to be.",
      "Marketing-Seiten und Landingpages, die schnell laden, gefunden werden und auf dem Handy gut lesbar sind. Statisch wo möglich, dynamisch wo nötig.",
    ),
    icon: "globe",
    focus: l("Next.js", "Next.js"),
    chips: [{ label: "React" }, { label: "TypeScript" }, { label: "Tailwind" }],
    projectSlug: null,
  },
  {
    id: "saas",
    name: l("SaaS platforms", "SaaS-Plattformen"),
    description: l(
      "Multi-role products with accounts, permissions and billing. OrthoTrack runs three separate roles against one data model.",
      "Produkte mit mehreren Rollen, Konten, Rechten und Abrechnung. OrthoTrack betreibt drei getrennte Rollen auf einem Datenmodell.",
    ),
    icon: "layout-dashboard",
    focus: l("Node.js", "Node.js"),
    chips: [{ label: "PostgreSQL" }, { label: "MongoDB" }, { label: "Auth" }],
    projectSlug: "orthotrack",
  },
  {
    id: "ai",
    name: l("AI-powered products", "KI-Produkte"),
    description: l(
      "Models put behind real constraints: your data, your permissions, and a human on anything that commits. Vision scoring and a coaching assistant, both shipped.",
      "Modelle in echten Leitplanken: Ihre Daten, Ihre Rechte, und ein Mensch bei allem, was verbindlich ist. Bildbewertung und ein Coaching-Assistent, beides ausgeliefert.",
    ),
    icon: "sparkles",
    focus: l("LLM integration", "LLM-Integration"),
    chips: [
      { label: "Vision models" },
      { label: "Prompt design" },
      { label: "Guardrails" },
    ],
    projectSlug: "zyuela",
  },
  {
    id: "payments",
    name: l("Payments and e-commerce", "Zahlungen und E-Commerce"),
    description: l(
      "Checkout, subscriptions and donations, with the reconciliation and failure paths designed rather than discovered in production.",
      "Checkout, Abos und Spenden, mit durchdachter Abstimmung und Fehlerbehandlung statt Entdeckungen im Livebetrieb.",
    ),
    icon: "credit-card",
    focus: l("Stripe", "Stripe"),
    chips: [
      { label: "Subscriptions" },
      { label: "Webhooks" },
      { label: "Refunds" },
    ],
    projectSlug: "our-ummah",
  },
  {
    id: "internal",
    name: l("Internal tools", "Interne Tools"),
    description: l(
      "The admin side nobody demos and everybody uses: dashboards, moderation queues, role management and reporting.",
      "Die Verwaltungsseite, die niemand vorführt und alle benutzen: Dashboards, Moderationslisten, Rollenverwaltung und Auswertungen.",
    ),
    icon: "wrench",
    focus: l("React", "React"),
    chips: [
      { label: "Dashboards" },
      { label: "Role management" },
      { label: "Reporting" },
    ],
    projectSlug: "orthotrack",
  },
  {
    id: "mvp",
    name: l("MVPs", "MVPs"),
    description: l(
      "A first release narrow enough to ship and real enough to learn from, built so the second version is not a rewrite.",
      "Ein erstes Release, schmal genug zum Ausliefern und echt genug zum Lernen, so gebaut, dass die zweite Version kein Neuanfang ist.",
    ),
    icon: "rocket",
    focus: l("8–12 weeks", "8–12 Wochen"),
    chips: [
      { label: "Scoped fixed" },
      { label: "Store-ready" },
      { label: "Built to extend" },
    ],
    projectSlug: "zyuela",
  },
  {
    id: "rescue",
    name: l("Fixing what exists", "Bestehendes reparieren"),
    description: l(
      "Inheriting someone else's codebase: making it fast, making it safe to change, and shipping again without a rewrite.",
      "Eine fremde Codebasis übernehmen: schnell machen, sicher änderbar machen, und wieder ausliefern, ohne alles neu zu schreiben.",
    ),
    icon: "shield",
    focus: l("Audit first", "Erst prüfen"),
    chips: [
      { label: "Performance" },
      { label: "Refactoring" },
      { label: "Test coverage" },
    ],
    projectSlug: null,
  },
];

/**
 * HOW WE ARE DIFFERENT.
 *
 * Side by side: the thing a client is usually worried about, against what we
 * actually do about it. It is about US on both sides and never about a named
 * competitor, because "other agencies do X" is unfalsifiable and reads as
 * insecurity rather than confidence.
 *
 * Every right-hand claim is checkable elsewhere on this site. That was the
 * test each line had to pass to be here.
 */
export const differences: { concern: Localized; answer: Localized }[] = [
  {
    concern: l(
      "You send an enquiry and wait days for a reply.",
      "Sie schicken eine Anfrage und warten Tage auf eine Antwort.",
    ),
    answer: l(
      "You book a time on our calendar and speak to us this week.",
      "Sie buchen eine Zeit in unserem Kalender und sprechen diese Woche mit uns.",
    ),
  },
  {
    concern: l(
      "The estimate arrives with no working shown.",
      "Die Schätzung kommt ohne nachvollziehbaren Rechenweg.",
    ),
    answer: l(
      "Every estimate lists its assumptions, so a change to one is visible.",
      "Jede Schätzung nennt ihre Annahmen, damit eine Änderung daran sichtbar wird.",
    ),
  },
  {
    concern: l(
      "Nothing runs until the end, then everything is a surprise.",
      "Bis zum Schluss läuft nichts, dann ist alles eine Überraschung.",
    ),
    answer: l(
      "You get a running build every second week, from the first cycle.",
      "Sie bekommen alle zwei Wochen einen lauffähigen Stand, ab dem ersten Zyklus.",
    ),
  },
  {
    concern: l(
      "A sales team scopes it, a different team builds it.",
      "Ein Vertriebsteam schneidet es zu, ein anderes Team baut es.",
    ),
    answer: l(
      "The people who scope your project are the people who write it.",
      "Wer Ihr Projekt zuschneidet, schreibt es auch.",
    ),
  },
  {
    concern: l(
      "The team disappears the week after launch.",
      "Das Team verschwindet in der Woche nach dem Launch.",
    ),
    answer: l(
      "We plan for the weeks after go-live and stay on them.",
      "Wir planen die Wochen nach dem Go-live ein und bleiben dran.",
    ),
  },
  {
    concern: l(
      "Handover is a zip file and a phone number.",
      "Die Übergabe ist eine ZIP-Datei und eine Telefonnummer.",
    ),
    answer: l(
      "Your repository from day one, plus docs someone can onboard from.",
      "Ihr Repository ab Tag eins, plus Doku, mit der sich jemand einarbeiten kann.",
    ),
  },
];

export type { TechChip };
