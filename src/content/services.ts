import { l } from "./localized";
import type { RawBuildType, RawServiceGroup } from "./schemas";

/**
 * SERVICES CONTENT.
 *
 * Six capability groups. The order is the order a client experiences them, not
 * an org chart, strategy through evolution. `relatedProjectSlug` is what
 * connects a capability to real work, which is the only thing that makes a
 * service list credible.
 */
export const serviceGroups: RawServiceGroup[] = [
  {
    id: "strategy",
    name: l("Strategy & Product", "Strategie & Produkt"),
    summary: l(
      "Before anyone writes code, we work out what is actually being built and what would make it a mistake. Discovery ends in a plan you could hand to a different team.",
      "Bevor jemand Code schreibt, klären wir, was tatsächlich gebaut wird und was es zu einem Fehler machen würde. Die Discovery endet mit einem Plan, den Sie einem anderen Team geben könnten.",
    ),
    deliverables: [
      l(
        "A written product thesis and the decisions behind it",
        "Eine schriftliche Produktthese und die Entscheidungen dahinter",
      ),
      l(
        "Technical discovery: constraints, integrations, risks, and what we don't yet know",
        "Technische Discovery: Rahmenbedingungen, Integrationen, Risiken und was wir noch nicht wissen",
      ),
      l(
        "A prioritised scope with a first release you could ship",
        "Ein priorisierter Umfang mit einem ersten Release, das ausgeliefert werden kann",
      ),
      l(
        "A clickable prototype of the flows that carry the risk",
        "Ein klickbarer Prototyp der Abläufe, die das Risiko tragen",
      ),
    ],
    capabilities: [
      {
        name: l("Product Discovery", "Produkt-Discovery"),
        description: l(
          "Interviews, current-state mapping, and a scope that survives contact with the constraints.",
          "Interviews, Bestandsaufnahme, und ein Umfang, der den Kontakt mit den Rahmenbedingungen übersteht.",
        ),
      },
      {
        name: l("Technical Discovery", "Technische Discovery"),
        description: l(
          "Integration surfaces, data realities and delivery risks, itemised before they set the budget.",
          "Integrationspunkte, Datenrealität und Lieferrisiken, einzeln aufgeführt, bevor sie das Budget festlegen.",
        ),
      },
      {
        name: l("Product Strategy", "Produktstrategie"),
        description: l(
          "What to build first, what to defer, and the argument for both, written down.",
          "Was zuerst gebaut wird, was wartet, und die Begründung für beides, schriftlich.",
        ),
      },
      {
        name: l("UX Research", "UX-Research"),
        description: l(
          "Time with the people who will use it, in the place they will use it.",
          "Zeit mit den Menschen, die es nutzen werden, an dem Ort, an dem sie es nutzen.",
        ),
      },
      {
        name: l("Prototyping", "Prototyping"),
        description: l(
          "A clickable version of the risky flow, tested before it becomes a schema.",
          "Eine klickbare Fassung des riskanten Ablaufs, getestet, bevor sie ein Schema wird.",
        ),
      },
    ],
    relatedProjectSlug: "our-ummah",
  },
  {
    id: "design",
    name: l("Design", "Design"),
    summary: l(
      "Interfaces that a domain expert can move through quickly, built on a system rather than a set of screens, so the tenth feature looks like it belongs with the first.",
      "Oberflächen, durch die sich Fachleute schnell bewegen, gebaut auf einem System statt auf einer Sammlung von Screens, damit die zehnte Funktion aussieht, als gehöre sie zur ersten.",
    ),
    deliverables: [
      l(
        "A design system: tokens, components, states, and the rules for extending it",
        "Ein Design-System: Tokens, Komponenten, Zustände und die Regeln zum Erweitern",
      ),
      l(
        "High-fidelity designs for every state, not only the happy path",
        "Ausgearbeitete Entwürfe für jeden Zustand, nicht nur für den glücklichen Pfad",
      ),
      l(
        "Accessibility built in, contrast, focus order, keyboard paths",
        "Barrierefreiheit von Anfang an: Kontrast, Fokusreihenfolge, Tastaturwege",
      ),
      l(
        "Design files that map one-to-one onto the components in the codebase",
        "Design-Dateien, die eins zu eins auf die Komponenten im Code passen",
      ),
    ],
    capabilities: [
      {
        name: l("UX Design", "UX-Design"),
        description: l(
          "Information architecture, flows and the states everyone forgets: empty, loading, error, too much data.",
          "Informationsarchitektur, Abläufe und die Zustände, die alle vergessen: leer, ladend, fehlerhaft, zu viele Daten.",
        ),
      },
      {
        name: l("UI Design", "UI-Design"),
        description: l(
          "Typography, colour, density and motion, resolved as a system rather than per screen.",
          "Typografie, Farbe, Dichte und Bewegung, als System gelöst statt pro Screen.",
        ),
      },
      {
        name: l("Product Design", "Produktdesign"),
        description: l(
          "End-to-end ownership of a product surface, from the argument to the pixel.",
          "Durchgängige Verantwortung für einen Produktbereich, vom Argument bis zum Pixel.",
        ),
      },
      {
        name: l("Design Systems", "Design-Systeme"),
        description: l(
          "Tokens and components your team can extend without our involvement.",
          "Tokens und Komponenten, die Ihr Team ohne uns erweitern kann.",
        ),
      },
      {
        name: l("Website Design", "Website-Design"),
        description: l(
          "Marketing surfaces that carry the same standard as the product behind them.",
          "Marketing-Auftritte mit demselben Anspruch wie das Produkt dahinter.",
        ),
      },
    ],
    relatedProjectSlug: "soulmate-society",
  },
  {
    id: "engineering",
    name: l("Engineering", "Entwicklung"),
    summary: l(
      "Production software: typed end to end, tested where it matters, observable, and structured so the second team to touch it can find their way around.",
      "Software für den Produktivbetrieb: durchgehend typisiert, getestet wo es zählt, beobachtbar, und so strukturiert, dass sich das zweite Team darin zurechtfindet.",
    ),
    deliverables: [
      l(
        "A running application with CI, environments and a deployment path",
        "Eine laufende Anwendung mit CI, Umgebungen und einem Deployment-Weg",
      ),
      l(
        "Test coverage aimed at the logic that is expensive to get wrong",
        "Testabdeckung für die Logik, deren Fehler teuer sind",
      ),
      l(
        "Observability: logs, traces and the alerts that actually page someone",
        "Beobachtbarkeit: Logs, Traces und die Alarme, die wirklich jemanden erreichen",
      ),
      l(
        "Documentation an engineer who wasn't there can onboard from",
        "Dokumentation, mit der sich jemand einarbeiten kann, der nicht dabei war",
      ),
    ],
    capabilities: [
      {
        name: l("Web Applications", "Web-Anwendungen"),
        description: l(
          "Server-rendered, typed, fast on the devices your users actually have.",
          "Serverseitig gerendert, typisiert, schnell auf den Geräten, die Ihre Nutzer wirklich haben.",
        ),
      },
      {
        name: l("SaaS Development", "SaaS-Entwicklung"),
        description: l(
          "Multi-tenancy, billing, roles and audit trails, the parts that are tedious and load-bearing.",
          "Mandantenfähigkeit, Abrechnung, Rollen und Protokolle, also die Teile, die mühsam und tragend sind.",
        ),
      },
      {
        name: l("Custom Software", "Individualsoftware"),
        description: l(
          "Internal tools and line-of-business systems that replace a spreadsheet nobody admits to depending on.",
          "Interne Werkzeuge und Fachanwendungen, die eine Tabelle ersetzen, von der niemand zugibt, dass sie tragend ist.",
        ),
      },
      {
        name: l("Backend Systems", "Backend-Systeme"),
        description: l(
          "Data models, workflows and integrations built to be replayed, not re-run by hand.",
          "Datenmodelle, Abläufe und Integrationen, gebaut zum Wiederholen statt zum Nachfahren von Hand.",
        ),
      },
      {
        name: l("APIs", "APIs"),
        description: l(
          "Versioned, documented, and validated at the boundary in both directions.",
          "Versioniert, dokumentiert und an der Grenze in beide Richtungen validiert.",
        ),
      },
      {
        name: l("Cloud Infrastructure", "Cloud-Infrastruktur"),
        description: l(
          "Infrastructure as code, environments that match, and a rollback you have actually rehearsed.",
          "Infrastruktur als Code, Umgebungen, die zusammenpassen, und ein Rollback, das geprobt wurde.",
        ),
      },
    ],
    relatedProjectSlug: "our-ummah",
  },
  {
    id: "mobile",
    name: l("Mobile", "Mobile"),
    summary: l(
      "Apps for people who are standing up, outdoors, or somewhere with no signal. Offline behaviour is a design decision, not an error state.",
      "Apps für Menschen, die stehen, draußen sind oder keinen Empfang haben. Offline-Verhalten ist eine Entwurfsentscheidung, kein Fehlerzustand.",
    ),
    deliverables: [
      l(
        "Store-ready iOS and Android builds with a release pipeline",
        "Store-fertige iOS- und Android-Builds mit einer Release-Pipeline",
      ),
      l(
        "An explicit offline and sync model, documented and monitored",
        "Ein ausdrückliches Offline- und Sync-Modell, dokumentiert und überwacht",
      ),
      l(
        "Device-tested interaction: one hand, gloves, bad light, low battery",
        "Auf Geräten getestete Bedienung: eine Hand, Handschuhe, schlechtes Licht, wenig Akku",
      ),
      l(
        "Crash and performance reporting wired in from the first build",
        "Absturz- und Leistungsberichte ab dem ersten Build angebunden",
      ),
    ],
    capabilities: [
      {
        name: l("iOS", "iOS"),
        description: l(
          "Native or cross-platform, whichever the product's requirements actually justify.",
          "Nativ oder plattformübergreifend, je nachdem, was die Anforderungen wirklich rechtfertigen.",
        ),
      },
      {
        name: l("Android", "Android"),
        description: l(
          "Including the older, cheaper devices a field workforce is issued.",
          "Auch die älteren, günstigen Geräte, die Außendienstteams bekommen.",
        ),
      },
      {
        name: l("Cross-platform Applications", "Plattformübergreifende Apps"),
        description: l(
          "One codebase where that is honest, with platform-specific behaviour where it is not.",
          "Eine Codebasis, wo das ehrlich ist, mit plattformspezifischem Verhalten, wo nicht.",
        ),
      },
    ],
    relatedProjectSlug: "orthotrack",
  },
  {
    id: "ai",
    name: l("AI & Automation", "KI & Automatisierung"),
    summary: l(
      "Language models put behind real constraints: your data, your authorization rules, an audit trail, and a human on the commitments that matter.",
      "Sprachmodelle hinter echten Leitplanken: Ihre Daten, Ihre Berechtigungsregeln, ein Protokoll, und ein Mensch bei den Zusagen, auf die es ankommt.",
    ),
    deliverables: [
      l(
        "An evaluation set before a prompt reaches production",
        "Ein Bewertungsdatensatz, bevor ein Prompt in Produktion geht",
      ),
      l(
        "Tool-calling against your existing authorized APIs, no privileged shortcut",
        "Werkzeugaufrufe gegen Ihre bestehenden, berechtigten APIs, keine Abkürzung mit Sonderrechten",
      ),
      l(
        "Full traces: prompt, tools, cost and outcome, per run",
        "Vollständige Traces: Prompt, Werkzeuge, Kosten und Ergebnis, pro Durchlauf",
      ),
      l(
        "A cost model, and a fallback for when the provider is down",
        "Ein Kostenmodell, und ein Ausweichweg, wenn der Anbieter ausfällt",
      ),
    ],
    capabilities: [
      {
        name: l("AI Applications", "KI-Anwendungen"),
        description: l(
          "Products where the model is a component with a specified job, not the pitch.",
          "Produkte, in denen das Modell ein Bauteil mit klarer Aufgabe ist, nicht das Verkaufsargument.",
        ),
      },
      {
        name: l("LLM Integrations", "LLM-Integrationen"),
        description: l(
          "Retrieval, structured output and tool use, evaluated against a fixed set before launch.",
          "Retrieval, strukturierte Ausgaben und Werkzeugnutzung, vor dem Start gegen einen festen Satz bewertet.",
        ),
      },
      {
        name: l("AI Agents", "KI-Agenten"),
        description: l(
          "Scoped autonomy: what it may do, what it must ask about, and what it logs either way.",
          "Begrenzte Autonomie: was er darf, wobei er nachfragen muss, und was er in beiden Fällen protokolliert.",
        ),
      },
      {
        name: l("Workflow Automation", "Prozessautomatisierung"),
        description: l(
          "The repetitive path automated, the exception routed to a person with context.",
          "Der wiederkehrende Weg automatisiert, die Ausnahme an einen Menschen mit Kontext geleitet.",
        ),
      },
      {
        name: l("Internal AI Tools", "Interne KI-Werkzeuge"),
        description: l(
          "Assistants over your own documents and systems, with permissions that hold.",
          "Assistenten über Ihre eigenen Dokumente und Systeme, mit Rechten, die halten.",
        ),
      },
    ],
    relatedProjectSlug: "zyuela",
  },
  {
    id: "evolution",
    name: l("Product Evolution", "Produktweiterentwicklung"),
    summary: l(
      "Most software that matters already exists. We make it faster, safer to change, and better to use, without the rewrite that gets pitched and then abandoned halfway.",
      "Die meiste Software, auf die es ankommt, existiert bereits. Wir machen sie schneller, sicherer änderbar und angenehmer zu benutzen, ohne den Neuschrieb, der vorgeschlagen und dann auf halbem Weg abgebrochen wird.",
    ),
    deliverables: [
      l(
        "A measured baseline before any change, so improvement is provable",
        "Ein gemessener Ausgangswert vor jeder Änderung, damit Verbesserung belegbar ist",
      ),
      l(
        "A phased plan with a working system at every step",
        "Ein Plan in Phasen mit einem funktionierenden System bei jedem Schritt",
      ),
      l(
        "Performance work tied to real user metrics, not a synthetic score",
        "Performance-Arbeit an echten Nutzerwerten, nicht an einer synthetischen Punktzahl",
      ),
      l(
        "Handover, or an ongoing team, your choice, stated up front",
        "Übergabe oder ein weiterlaufendes Team, Ihre Wahl, vorab festgelegt",
      ),
    ],
    capabilities: [
      {
        name: l("Product Modernization", "Produktmodernisierung"),
        description: l(
          "Incremental migration with the old system live until the new one has earned it.",
          "Schrittweise Migration, das alte System bleibt live, bis das neue es sich verdient hat.",
        ),
      },
      {
        name: l("Performance Optimization", "Performance-Optimierung"),
        description: l(
          "Profiling first. Nearly every slow product is a waterfall, not a render cost.",
          "Erst messen. Fast jedes langsame Produkt ist eine Kette von Wartezeiten, keine Renderkosten.",
        ),
      },
      {
        name: l("UX Improvements", "UX-Verbesserungen"),
        description: l(
          "Targeted work on the flows where users actually stall or give up.",
          "Gezielte Arbeit an den Abläufen, in denen Nutzer tatsächlich hängenbleiben oder aufgeben.",
        ),
      },
      {
        name: l("Engineering Support", "Entwicklungs-Support"),
        description: l(
          "Retained capacity for maintenance, dependency upgrades and the small requests.",
          "Feste Kapazität für Wartung, Abhängigkeits-Updates und die kleinen Anliegen.",
        ),
      },
      {
        name: l("Dedicated Teams", "Feste Teams"),
        description: l(
          "An embedded team working in your process, with our standards, reporting to you.",
          "Ein eingebettetes Team in Ihrem Prozess, mit unseren Standards, berichtend an Sie.",
        ),
      },
    ],
    // TODO: point at a modernization engagement once one is public.
    relatedProjectSlug: null,
  },
];

/**
 * Step one of the project inquiry, a single low-effort choice.
 *
 * `id` is submitted with the inquiry payload, so treat these as a stable
 * contract with whatever receives it.
 */
/**
 * Step one of the project inquiry, a single low-effort choice.
 *
 * ⚠️ Written for someone who is NOT technical. The person filling this in is
 * usually a founder or an operations lead, not an engineer: they know what they
 * want the software to DO, not what category it belongs to. So the labels name
 * the outcome ("A product I sell to customers") and the hints explain it in
 * the words they would use themselves. "Multi-tenant", "LLM", "retrieval" and
 * "modernization" were all in an earlier draft and all of them ask the reader
 * to already know the answer.
 *
 * l(
      "Something else entirely",
      "Etwas ganz anderes",
    ) is deliberately a first-class option rather than a
 * fallback at the bottom of a list. The commonest reason a form like this
 * gets abandoned is that none of the choices felt safe to pick, and a studio
 * that builds custom software has to say out loud that a request which fits no
 * category is welcome.
 *
 * Two labels changed after review because they were ambiguous rather than
 * wrong. "A web app" was the first option and read to a non-technical buyer as
 * the same thing as a website, while the actual website option sat five rows
 * below it; a person looking for a marketing site had to scroll past the entry
 * they would most likely click. So l(
      "A website",
      "Eine Website",
    ) leads, and the browser-based
 * one is l(
      "A web platform",
      "Eine Web-Plattform",
    ), which nobody confuses with a homepage. "A product I
 * sell to customers" became "A software product" for the same reason: it
 * described a business model where the reader was looking for a thing.
 *
 * `id` is submitted with the inquiry payload and is a stable contract with
 * whatever receives it, the LABELS can be rewritten freely, the ids cannot.
 */
export const buildTypes: RawBuildType[] = [
  {
    id: "website",
    label: l("A website", "Eine Website"),
    hint: l(
      "A marketing site, a landing page, or an online store",
      "Eine Marketing-Seite, eine Landingpage oder ein Onlineshop",
    ),
  },
  {
    id: "mobile-app",
    label: l("A mobile app", "Eine App"),
    hint: l("For iPhone, Android, or both", "Für iPhone, Android oder beides"),
  },
  {
    id: "web-app",
    label: l("A web platform", "Eine Web-Plattform"),
    hint: l(
      "A portal, a dashboard, or an internal tool your team runs on",
      "Ein Portal, ein Dashboard oder ein internes Werkzeug für Ihr Team",
    ),
  },
  {
    id: "saas-platform",
    label: l("A software product", "Ein Softwareprodukt"),
    hint: l(
      "Accounts, subscriptions and billing: software that is the business",
      "Konten, Abos und Abrechnung: Software, die das Geschäft ist",
    ),
  },
  {
    id: "ai-product",
    label: l("Something with AI in it", "Etwas mit KI darin"),
    hint: l(
      "An assistant, automation, or smarter features in what you already have",
      "Ein Assistent, Automatisierung oder klügere Funktionen in dem, was Sie haben",
    ),
  },
  {
    id: "improve-existing",
    label: l("Improve something we have", "Bestehendes verbessern"),
    hint: l(
      "Make it faster, easier to use, or easier to keep running",
      "Schneller machen, einfacher bedienbar oder leichter zu betreiben",
    ),
  },
  {
    id: "dedicated-team",
    label: l("Extra people on my team", "Zusätzliche Leute im Team"),
    hint: l(
      "Designers and engineers working alongside yours",
      "Designerinnen und Entwickler, die neben Ihren arbeiten",
    ),
  },
  {
    id: "something-else",
    label: l("Something else entirely", "Etwas ganz anderes"),
    hint: l(
      "Custom software, an integration, or an idea that fits no box. Tell us in your own words",
      "Individualsoftware, eine Integration oder eine Idee, die in kein Schema passt. Sagen Sie es in Ihren Worten",
    ),
  },
];
