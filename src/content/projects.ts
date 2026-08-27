import { l } from "./localized";
import type { Localized } from "./localized";
import type { RawMedia, RawProject } from "./schemas";

/**
 * PORTFOLIO CONTENT, real GA Code work.
 *
 * Every feature, stack entry and date below comes from the engineer who built
 * these, via their own written project descriptions, not inferred from the
 * screenshots. Two earlier drafts were wrong in ways worth remembering: Zyuela
 * was described as having no AI (it is an AI coaching product) and OrthoTrack's
 * vision-model photo scoring, the most interesting thing in it, was missed
 * entirely. Screens alone are not a spec.
 *
 * The narrative framing in `caseStudySections` is still editorial, the facts
 * are the author's, the way they are told is the site's. Worth one read before
 * a client sees it.
 *
 * `metrics` is deliberately EMPTY everywhere. No number goes on this site until
 * someone can point at where it was measured.
 *
 * Adding a project:
 *   1. Add an entry here, the schema in `./schemas.ts` is the contract.
 *   2. Drop media in `public/media/projects/<slug>/`. An image declares its own
 *      `width`/`height`; the frame reserves its box from those.
 *   3. Routes, the home-page selection, `/work` filters, related-project links
 *      and the sitemap all derive from this file. Nothing else to wire.
 */

/** A landscape marketing composite, the device is already drawn in the image. */
function shot(
  src: string,
  width: number,
  height: number,
  alt: Localized,
  sizes = "(min-width: 1024px) 56vw, 92vw",
  /** Hero media only, everything else stays lazy. */
  priority = false,
): RawMedia {
  return {
    kind: "image",
    src,
    width,
    height,
    sizes,
    priority,
    frame: "bare",
    chromeUrl: null,
    alt,
  };
}

/** A raw screen capture, framed as a phone. */
function screen(src: string, alt: Localized): RawMedia {
  return {
    kind: "image",
    src,
    width: 736,
    height: 1600,
    sizes: "(min-width: 1024px) 20vw, 60vw",
    priority: false,
    frame: "device",
    chromeUrl: null,
    alt,
  };
}

export const projects: RawProject[] = [
  {
    slug: "soulmate-society",
    name: "Soulmate Society",
    tagline: l(
      "Intentional matchmaking, built on values rather than volume",
      "Bewusste Partnervermittlung, gebaut auf Werten statt auf Masse",
    ),
    summary: l(
      "Most dating products optimise for volume: more profiles, faster swiping, more matches. Soulmate Society is built for the opposite: a compatibility score computed from core values and personality alignment, curated discovery on a map rather than an endless queue, and private conversations designed to actually start one.",
      "Die meisten Dating-Produkte optimieren auf Masse: mehr Profile, schnelleres Wischen, mehr Matches. Soulmate Society ist für das Gegenteil gebaut: ein Übereinstimmungswert, berechnet aus Grundwerten und Persönlichkeitsprofil, kuratiertes Entdecken auf einer Karte statt einer endlosen Warteschlange, und private Gespräche, die so gestaltet sind, dass tatsächlich eines beginnt.",
    ),
    industry: l("Social", "Social"),
    productType: l("Mobile application", "App"),
    whatWeDid: l(
      "Built the mobile application end to end in Flutter, and integrated the real-time messaging and geospatial mapping services behind it.",
      "Die App komplett in Flutter gebaut und die Dienste für Echtzeit-Messaging und Karten dahinter integriert.",
    ),
    outcome: l(
      "A calmer product than the category default. A match percentage is explainable rather than magical, discovery is finite, and the messaging surface is private by construction.",
      "Ein ruhigeres Produkt als der Standard der Kategorie. Ein Übereinstimmungswert ist erklärbar statt magisch, das Entdecken ist endlich, und der Nachrichtenbereich ist von Grund auf privat.",
    ),
    metrics: [],
    services: [
      l("Product Strategy", "Produktstrategie"),
      l("UI Design", "UI-Design"),
      l("Design Systems", "Design-Systeme"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
    ],
    platforms: ["iOS", "Android"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Mapbox",
      "GetStream",
      "Dio",
      "GetIt",
    ],
    categories: ["mobile"],
    period: l("Mar, Apr 2026", "März, Apr. 2026"),
    heroMedia: shot(
      "/media/projects/soulmate-society/01-brand.jpg",
      1448,
      1086,
      l(
        "Soulmate Society's discovery screen: a curated match with a compatibility score, beside a private conversation.",
        "Der Entdecken-Screen von Soulmate Society: ein kuratiertes Match mit Übereinstimmungswert, daneben ein privates Gespräch.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/soulmate-society/02-connection.jpg",
        1672,
        941,
        l(
          "Soulmate Society's core surfaces: curated discovery, favourites, messaging and profile.",
          "Die zentralen Bereiche von Soulmate Society: kuratiertes Entdecken, Favoriten, Nachrichten und Profil.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/soulmate-society/03-home.jpg",
        1672,
        941,
        l(
          "The Soulmate Society home experience, showing curated matches rather than an endless queue.",
          "Die Startansicht von Soulmate Society, mit kuratierten Matches statt einer endlosen Warteschlange.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "The category's defaults work against the stated goal",
          "Die Standards der Kategorie arbeiten gegen das erklärte Ziel",
        ),
        body: [
          l(
            "An app that optimises for session length and swipe volume produces exactly that. It does not produce the outcome people say they came for, and the interface quietly communicates that everyone is interchangeable.",
            "Eine App, die auf Sitzungsdauer und Wischvolumen optimiert, erzeugt genau das. Sie erzeugt nicht das Ergebnis, für das die Leute nach eigener Aussage gekommen sind, und die Oberfläche vermittelt nebenbei, dass alle austauschbar sind.",
          ),
          l(
            "The brief was to build for a different measure, fewer and better-considered connections, which meant rejecting most of the patterns the category has settled on.",
            "Der Auftrag war, auf einen anderen Maßstab hin zu bauen, weniger und durchdachtere Verbindungen, und das hieß, die meisten Muster abzulehnen, auf die sich die Kategorie geeinigt hat.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "Match on stated values, and show the reasoning",
          "Nach genannten Werten zusammenführen, und die Begründung zeigen",
        ),
        body: [
          l(
            "Compatibility is a percentage computed from core values and personality alignment, not a number that appears by magic. If a product is going to claim two people are a strong match, the claim has to be inspectable.",
            "Die Übereinstimmung ist ein Prozentwert aus Grundwerten und Persönlichkeitsprofil, keine Zahl, die aus dem Nichts erscheint. Wenn ein Produkt behauptet, zwei Menschen passten gut zusammen, muss diese Behauptung nachprüfbar sein.",
          ),
          l(
            "Discovery is geospatial and curated: an interactive map of potential matches nearby, which is a defined set to consider rather than an infinite queue. That single change is what alters how much attention each profile actually gets.",
            "Das Entdecken ist ortsbezogen und kuratiert: eine interaktive Karte möglicher Matches in der Nähe, also eine überschaubare Menge statt einer unendlichen Warteschlange. Genau diese eine Änderung verändert, wie viel Aufmerksamkeit jedes Profil tatsächlich bekommt.",
          ),
        ],
        points: [
          l(
            "A compatibility algorithm scoring core values and personality alignment",
            "Ein Algorithmus, der Grundwerte und Persönlichkeitsprofil bewertet",
          ),
          l(
            "Map-based discovery of curated matches nearby, not an endless feed",
            "Kartenbasiertes Entdecken kuratierter Matches in der Nähe, kein endloser Feed",
          ),
          l(
            "Profiles built around personal stories and stated values, with favourites",
            "Profile rund um persönliche Geschichten und genannte Werte, mit Favoriten",
          ),
        ],
        media: shot(
          "/media/projects/soulmate-society/02-connection.jpg",
          1672,
          941,
          l(
            "Curated discovery, favourites and private messaging in Soulmate Society.",
            "Kuratiertes Entdecken, Favoriten und private Nachrichten in Soulmate Society.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: l(
          "A premium register, deliberately unlike the category",
          "Eine gehobene Tonlage, bewusst anders als die Kategorie",
        ),
        body: [
          l(
            "Deep navy and gold, a serif display face, generous space, closer to a members' club than to a social feed, and that is the point. It sets an expectation about pace before a single interaction happens.",
            "Tiefes Marineblau und Gold, eine Serifen-Displayschrift, großzügiger Raum, näher an einem Club als an einem Social Feed, und genau das ist der Punkt. Es setzt eine Erwartung an das Tempo, bevor eine einzige Interaktion stattfindet.",
          ),
          l(
            "Photography is given room rather than cropped into a grid, and the compatibility badge sits on the image where the decision is actually being made.",
            "Fotos bekommen Raum, statt in ein Raster geschnitten zu werden, und der Übereinstimmungswert sitzt auf dem Bild, dort wo die Entscheidung tatsächlich fällt.",
          ),
        ],
        points: [
          l(
            "A serif-led identity and restrained palette, uncommon in the category",
            "Eine serifenbetonte Identität und eine zurückhaltende Palette, unüblich in der Kategorie",
          ),
          l(
            "One profile at a time, at a size where it can be read rather than skimmed",
            "Ein Profil auf einmal, in einer Größe, in der man es liest statt überfliegt",
          ),
          l(
            "Conversation prompts in the chat, so a first message is easier to send",
            "Gesprächsimpulse im Chat, damit die erste Nachricht leichter fällt",
          ),
        ],
        media: null,
      },
      {
        kind: "build",
        title: l(
          "Two hard integrations, kept behind clean boundaries",
          "Zwei schwierige Integrationen, hinter sauberen Grenzen gehalten",
        ),
        body: [
          l(
            "Real-time messaging and geospatial discovery are the two features that would otherwise dominate the codebase. Both run through third-party infrastructure: GetStream for low-latency chat, media handling and presence; Mapbox for map rendering and location-based discovery, so the product's own code stays about matching rather than about sockets and tiles.",
            "Echtzeit-Messaging und ortsbezogenes Entdecken sind die beiden Funktionen, die die Codebasis sonst beherrschen würden. Beide laufen über fremde Infrastruktur: GetStream für Chat mit geringer Latenz, Medien und Anwesenheit; Mapbox für Kartendarstellung und ortsbasiertes Entdecken, damit der eigene Code des Produkts beim Zusammenführen bleibt statt bei Sockets und Kacheln.",
          ),
          l(
            "Clean Architecture with BLoC and Cubit keeps each of those behind a boundary, which is what lets location services, matchmaking logic and the chat transport be reasoned about separately.",
            "Clean Architecture mit BLoC und Cubit hält beide hinter einer Grenze, und genau das erlaubt es, Ortungsdienste, Matching-Logik und den Chat-Transport getrennt zu betrachten.",
          ),
        ],
        points: [
          l(
            "GetStream for real-time messaging, media and presence indicators",
            "GetStream für Echtzeit-Messaging, Medien und Anwesenheitsanzeigen",
          ),
          l(
            "Mapbox SDK for map rendering and location-based discovery",
            "Mapbox SDK für Kartendarstellung und ortsbasiertes Entdecken",
          ),
          l(
            "Clean Architecture with BLoC/Cubit; GetIt for injection, Dio for transport",
            "Clean Architecture mit BLoC/Cubit; GetIt für Injection, Dio für den Transport",
          ),
          l(
            "One Flutter codebase delivering a native experience on iOS and Android",
            "Eine Flutter-Codebasis mit nativem Erlebnis auf iOS und Android",
          ),
        ],
        media: null,
      },
      {
        kind: "result",
        title: l(
          "A product that reads as considered",
          "Ein Produkt, das durchdacht wirkt",
        ),
        body: [
          l(
            "The app looks and behaves like the thing it claims to be, which is most of the credibility problem in this category solved.",
            "Die App sieht aus und verhält sich wie das, was sie zu sein behauptet, und damit ist der größte Teil des Glaubwürdigkeitsproblems dieser Kategorie gelöst.",
          ),
          l(
            "The design system is the durable asset. New surfaces can be added without renegotiating the brand each time.",
            "Das Design-System ist der bleibende Wert. Neue Bereiche lassen sich ergänzen, ohne die Marke jedes Mal neu zu verhandeln.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: false,
  },
  {
    slug: "zyuela",
    name: "Zyuela",
    tagline: l(
      "AI coaching, journalling and habits in one private space",
      "KI-Coaching, Journal und Gewohnheiten in einem privaten Raum",
    ),
    summary: l(
      "A mental wellbeing and coaching app: an AI coach you can actually talk to, guided journalling that tracks an emotional baseline over time, and habit work aimed at small consistent routines rather than large goals. The point is a private, clutter-free place to think, not another dashboard of streaks to protect.",
      "Eine App für mentales Wohlbefinden und Coaching: ein KI-Coach, mit dem man wirklich sprechen kann, geführtes Journaling, das eine emotionale Ausgangslage über die Zeit verfolgt, und Gewohnheitsarbeit, die auf kleine, verlässliche Routinen statt auf große Ziele zielt. Es geht um einen privaten, aufgeräumten Ort zum Nachdenken, nicht um ein weiteres Dashboard mit Serien, die man verteidigen muss.",
    ),
    industry: l("Health & wellbeing", "Gesundheit & Wohlbefinden"),
    productType: l("AI product", "KI-Produkt"),
    whatWeDid: l(
      "Built the Flutter front end and the Node.js backend behind it, including authentication, data persistence and the calls to the AI APIs.",
      "Das Flutter-Frontend und das Node.js-Backend dahinter gebaut, inklusive Authentifizierung, Datenhaltung und der Aufrufe an die KI-APIs.",
    ),
    outcome: l(
      "Reflection, coaching and habit tracking live in one product instead of three, and the coaching responds to what the person is actually working through rather than serving generic prompts.",
      "Reflexion, Coaching und Gewohnheiten leben in einem Produkt statt in dreien, und das Coaching reagiert auf das, woran die Person tatsächlich arbeitet, statt allgemeine Impulse auszuspielen.",
    ),
    metrics: [],
    services: [
      l("Product Discovery", "Produkt-Discovery"),
      l("UX Design", "UX-Design"),
      l("UI Design", "UI-Design"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
      l("AI Integration", "KI-Integration"),
      l("Backend Systems", "Backend-Systeme"),
    ],
    platforms: ["iOS", "Android", "API"],
    technologies: ["Flutter", "Dart", "BLoC/Cubit", "Node.js", "MongoDB"],
    categories: ["mobile", "ai"],
    period: l("May, Jun 2026", "Mai, Juni 2026"),
    heroMedia: shot(
      "/media/projects/zyuela/01-brand.jpg",
      1600,
      1200,
      l(
        "Zyuela's brand lockup and stack beside the home screen: a daily reflection, an open prompt to the AI coach, and a suggested first step.",
        "Die Markendarstellung und der Stack von Zyuela neben dem Startbildschirm: eine tägliche Reflexion, ein offener Impuls an den KI-Coach und ein vorgeschlagener erster Schritt.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/zyuela/02-space.jpg",
        1672,
        941,
        l(
          "Zyuela's core surfaces: home, journal, AI coach, tasks and profile in one supportive space.",
          "Die zentralen Bereiche von Zyuela: Start, Journal, KI-Coach, Aufgaben und Profil in einem unterstützenden Raum.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/zyuela/03-reflect.jpg",
        1672,
        941,
        l(
          "Zyuela's reflect, understand and move forward sequence, with its AI coaching chat and reflection prompts.",
          "Die Abfolge aus Reflektieren, Verstehen und Weitergehen in Zyuela, mit KI-Coaching-Chat und Reflexionsimpulsen.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "Reflection, coaching and habits lived in three different apps",
          "Reflexion, Coaching und Gewohnheiten lebten in drei verschiedenen Apps",
        ),
        body: [
          l(
            "Journalling in one place, a habit tracker in another, and coaching (if any) in a third. None of them knew what the others held, so nothing could respond to what a person was actually working through.",
            "Das Journal an einem Ort, ein Gewohnheits-Tracker an einem anderen, und Coaching, wenn überhaupt, in einem dritten. Keines wusste, was die anderen enthielten, also konnte nichts darauf reagieren, woran jemand tatsächlich arbeitete.",
          ),
          l(
            "The brief was one private space where the coaching has context: it can see the reflections and the routines, because they are in the same product.",
            "Der Auftrag war ein privater Raum, in dem das Coaching Kontext hat: Es sieht die Reflexionen und die Routinen, weil sie im selben Produkt liegen.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "One space, four surfaces, and a coach that has read the room",
          "Ein Raum, vier Bereiche, und ein Coach, der die Lage kennt",
        ),
        body: [
          l(
            "Home, journal, coach, tasks and profile are the whole product. Each is small on its own; the value is that they share a context, so guidance can be about this week rather than about wellbeing in general.",
            "Start, Journal, Coach, Aufgaben und Profil sind das ganze Produkt. Jedes für sich ist klein; der Wert liegt darin, dass sie einen Kontext teilen, sodass es im Coaching um diese Woche gehen kann statt um Wohlbefinden im Allgemeinen.",
          ),
          l(
            "Habit work is deliberately scoped to consistent daily routines rather than large goals, and progress is presented as insight into change over time rather than as a score that resets.",
            "Die Gewohnheitsarbeit ist bewusst auf verlässliche Tagesroutinen zugeschnitten statt auf große Ziele, und Fortschritt erscheint als Einsicht in Veränderung über die Zeit statt als Punktestand, der zurückgesetzt wird.",
          ),
        ],
        points: [
          l(
            "An interactive AI coaching chat giving guidance and prompts in context",
            "Ein interaktiver KI-Coaching-Chat, der im Kontext begleitet und Impulse gibt",
          ),
          l(
            "Guided journalling that tracks an emotional baseline over time",
            "Geführtes Journaling, das eine emotionale Ausgangslage über die Zeit verfolgt",
          ),
          l(
            "Task management aimed at small daily routines, not large goals",
            "Aufgabenverwaltung für kleine Tagesroutinen statt für große Ziele",
          ),
          l(
            "Profile insights that show change over time",
            "Profil-Einsichten, die Veränderung über die Zeit zeigen",
          ),
        ],
        media: shot(
          "/media/projects/zyuela/02-space.jpg",
          1672,
          941,
          l(
            "Zyuela's home, journal, coach, tasks and profile surfaces.",
            "Die Bereiche Start, Journal, Coach, Aufgaben und Profil in Zyuela.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: l(
          "Quiet, warm, and almost entirely typographic",
          "Ruhig, warm und fast vollständig typografisch",
        ),
        body: [
          l(
            "A near-white ground, a deep green accent and a serif wordmark, closer to a printed journal than to a fitness tracker. There is very little chrome, because the writing and the conversation are the product.",
            "Ein fast weißer Grund, ein tiefgrüner Akzent und eine Serifen-Wortmarke, näher an einem gedruckten Tagebuch als an einem Fitness-Tracker. Es gibt kaum Bedienelemente, denn das Schreiben und das Gespräch sind das Produkt.",
          ),
          l(
            "Prompts are set large and centred with nothing competing for attention, so the screen asks one thing at a time. The welcome screen sets that tone before any feature does.",
            "Impulse stehen groß und zentriert, ohne Konkurrenz um Aufmerksamkeit, sodass der Screen immer nur eine Sache fragt. Der Willkommens-Screen setzt diesen Ton, bevor es irgendeine Funktion tut.",
          ),
        ],
        points: [
          l(
            "A calm, paper-like palette with a single restrained accent",
            "Eine ruhige, papierartige Palette mit einem einzigen zurückhaltenden Akzent",
          ),
          l(
            "One prompt per screen, at reading size",
            "Ein Impuls pro Screen, in Lesegröße",
          ),
          l(
            "A distraction-free opening that establishes the pace of the product",
            "Ein ablenkungsfreier Einstieg, der das Tempo des Produkts festlegt",
          ),
        ],
        media: null,
      },
      {
        kind: "build",
        title: l(
          "The model is a component with a job, not the product",
          "Das Modell ist ein Bauteil mit einer Aufgabe, nicht das Produkt",
        ),
        body: [
          l(
            "The Node.js and MongoDB backend owns authentication, persistence and every call out to the AI APIs. Keeping the model behind the server rather than in the client is what makes the key, the cost and the prompt something the product controls.",
            "Das Backend aus Node.js und MongoDB besitzt Authentifizierung, Datenhaltung und jeden Aufruf an die KI-APIs. Das Modell hinter dem Server statt im Client zu halten, ist das, was Schlüssel, Kosten und Prompt zu etwas macht, das das Produkt kontrolliert.",
          ),
          l(
            "Clean Architecture with BLoC and Cubit on the Flutter side means the coaching surface is one feature among several rather than an assumption baked through the app, which is what lets it survive the feature growth a product like this attracts.",
            "Clean Architecture mit BLoC und Cubit auf der Flutter-Seite bedeutet, dass der Coaching-Bereich eine Funktion unter mehreren ist statt eine durch die ganze App gebackene Annahme, und genau das lässt ihn das Funktionswachstum überstehen, das ein solches Produkt anzieht.",
          ),
        ],
        points: [
          l(
            "Node.js and MongoDB owning auth, persistence and all AI API calls",
            "Node.js und MongoDB besitzen Auth, Datenhaltung und alle KI-API-Aufrufe",
          ),
          l(
            "Clean Architecture with BLoC/Cubit, so state stays predictable as features land",
            "Clean Architecture mit BLoC/Cubit, damit der Zustand vorhersagbar bleibt",
          ),
          l(
            "One Flutter codebase serving iOS and Android",
            "Eine Flutter-Codebasis für iOS und Android",
          ),
        ],
        media: null,
      },
      {
        kind: "result",
        title: l(
          "A product you can come back to after a gap",
          "Ein Produkt, zu dem man nach einer Pause zurückkommen kann",
        ),
        body: [
          l(
            "Because progress is framed as insight rather than as an unbroken record, returning after a week away costs nothing, which is the behaviour the whole design was aimed at.",
            "Weil Fortschritt als Einsicht dargestellt wird und nicht als ununterbrochene Serie, kostet die Rückkehr nach einer Woche Pause nichts, und genau auf dieses Verhalten war das ganze Design ausgerichtet.",
          ),
          l(
            "The context-sharing between journal, tasks and coach is the durable idea: any new surface added later inherits it for free.",
            "Der geteilte Kontext zwischen Journal, Aufgaben und Coach ist die bleibende Idee: Jeder später ergänzte Bereich erbt ihn kostenlos.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: false,
  },
  {
    slug: "orthotrack",
    name: "OrthoTrack",
    tagline: l(
      "Orthodontic care that stays connected between appointments",
      "Kieferorthopädische Betreuung, die zwischen den Terminen verbunden bleibt",
    ),
    summary: l(
      "Orthodontic outcomes depend on what happens at home: elastics worn, teeth brushed, photos taken at a comparable angle. Between appointments a clinician can see none of it. OrthoTrack gives the patient a short daily check-in and scores their progress photos against therapist-set reference images automatically, so a problem reaches a human while it still matters.",
      "Kieferorthopädische Ergebnisse hängen davon ab, was zu Hause passiert: Gummizüge getragen, Zähne geputzt, Fotos aus einem vergleichbaren Winkel. Zwischen den Terminen sieht die Behandlerin davon nichts. OrthoTrack gibt Patienten einen kurzen täglichen Check-in und bewertet ihre Fortschrittsfotos automatisch gegen Referenzbilder, die die Therapeutin festlegt, damit ein Problem einen Menschen erreicht, solange es noch zählt.",
    ),
    industry: l("Healthcare", "Gesundheitswesen"),
    productType: l("Two-sided AI platform", "Zweiseitige KI-Plattform"),
    whatWeDid: l(
      "Built the cross-platform mobile application and the backend infrastructure powering it, including the automated photo review pipeline and the alerting behind it.",
      "Die plattformübergreifende App und die Backend-Infrastruktur dahinter gebaut, inklusive der automatischen Fotoprüfung und der Benachrichtigung dahinter.",
    ),
    outcome: l(
      "What used to be a question asked at the next appointment is now a record. Patients follow a short daily list, and a low-scoring photo alerts both sides the same day instead of waiting weeks for someone to notice.",
      "Was früher eine Frage beim nächsten Termin war, ist jetzt ein Datensatz. Patienten folgen einer kurzen Tagesliste, und ein schlecht bewertetes Foto benachrichtigt beide Seiten noch am selben Tag, statt wochenlang darauf zu warten, dass es jemandem auffällt.",
    ),
    metrics: [],
    services: [
      l("Product Discovery", "Produkt-Discovery"),
      l("UX Design", "UX-Design"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
      l("AI Integration", "KI-Integration"),
      l("Backend Systems", "Backend-Systeme"),
      l("APIs", "APIs"),
    ],
    platforms: ["iOS", "Android", "API"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Node.js",
      "MongoDB",
      "Firebase Cloud Messaging",
    ],
    categories: ["mobile", "ai"],
    period: l("Jul, Aug 2026", "Juli, Aug. 2026"),
    heroMedia: shot(
      "/media/projects/orthotrack/01-brand.jpg",
      1448,
      1086,
      l(
        "OrthoTrack's brand lockup and stack beside the compliance screen: weekly rate, elastics adherence and the day's tasks.",
        "Die Markendarstellung und der Stack von OrthoTrack neben dem Mitwirkungs-Screen: Wochenquote, Tragedisziplin und die Aufgaben des Tages.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/orthotrack/02-experience.jpg",
        1448,
        1086,
        l(
          "OrthoTrack's patient side: the daily task list with its progress ring, beside the compliance overview.",
          "Die Patientenseite von OrthoTrack: die Tagesliste mit ihrem Fortschrittsring, daneben die Mitwirkungsübersicht.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/orthotrack/03-analysis.jpg",
        1448,
        1086,
        l(
          "Automated photo review in OrthoTrack: uploads scored against therapist-set reference images, annotated and kept in one record.",
          "Die automatische Fotoprüfung in OrthoTrack: Uploads werden gegen die Referenzbilder der Therapeutin bewertet, kommentiert und in einem Datensatz gehalten.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/orthotrack/04-clinician.jpg",
        1448,
        1086,
        l(
          "The clinician side of OrthoTrack: a patient list, a patient record with photos and compliance, and the reference poses a therapist assigns.",
          "Die Behandlerseite von OrthoTrack: eine Patientenliste, eine Patientenakte mit Fotos und Mitwirkung, und die Referenzposen, die eine Therapeutin zuweist.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      screen(
        "/media/projects/orthotrack/04-notifications.png",
        l(
          "OrthoTrack's reminders, prompting a patient to upload their photos before the day ends.",
          "Die Erinnerungen von OrthoTrack, die einen Patienten auffordern, seine Fotos vor Tagesende hochzuladen.",
        ),
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "The treatment happens at home; the visibility didn't",
          "Die Behandlung findet zu Hause statt; die Sichtbarkeit nicht",
        ),
        body: [
          l(
            "Between appointments, a clinician's only source of truth is what the patient remembers and is willing to report. Compliance is the largest variable in the outcome and the least observable one.",
            "Zwischen den Terminen ist die einzige Quelle der Behandlerin das, woran sich Patienten erinnern und was sie bereit sind zu berichten. Die Mitwirkung ist die größte Variable im Ergebnis und die am wenigsten beobachtbare.",
          ),
          l(
            "Progress photos made it worse rather than better: taken at inconsistent angles and distances, they cannot be compared to each other, so they show change without showing whether it is real.",
            "Fortschrittsfotos machten es eher schlechter als besser: aus uneinheitlichen Winkeln und Abständen aufgenommen, lassen sie sich nicht miteinander vergleichen und zeigen damit Veränderung, ohne zu zeigen, ob sie echt ist.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "Two apps, one record, and a reviewer that never sleeps",
          "Zwei Apps, ein Datensatz, und eine Prüfung, die nie schläft",
        ),
        body: [
          l(
            "Patient and clinician need genuinely different products: one is a two-minute daily habit, the other is a review tool, so the account chooses its side at sign-up and the interfaces diverge from there.",
            "Patient und Behandlerin brauchen wirklich verschiedene Produkte: das eine ist eine tägliche Zwei-Minuten-Gewohnheit, das andere ein Prüfwerkzeug. Deshalb wählt das Konto bei der Anmeldung seine Seite, und die Oberflächen gehen ab dort auseinander.",
          ),
          l(
            "The piece that ties them together is reference images. A therapist assigns them; the patient sees them while taking their own photos; and a background job then scores each upload against them with a vision model. A low score alerts both the patient and their therapist, so a human looks sooner rather than at the next appointment.",
            "Was beide verbindet, sind Referenzbilder. Die Therapeutin weist sie zu; der Patient sieht sie beim Fotografieren; und ein Hintergrundprozess bewertet dann jeden Upload mit einem Bildmodell dagegen. Eine niedrige Bewertung benachrichtigt Patient und Therapeutin, damit ein Mensch früher hinsieht statt erst beim nächsten Termin.",
          ),
        ],
        points: [
          l(
            "One account model, two distinct interfaces chosen at sign-up",
            "Ein Kontomodell, zwei getrennte Oberflächen, bei der Anmeldung gewählt",
          ),
          l(
            "Therapist-maintained reference images, shown to the patient at capture",
            "Von der Therapeutin gepflegte Referenzbilder, sichtbar beim Fotografieren",
          ),
          l(
            "Automated scoring of every upload against those references",
            "Automatische Bewertung jedes Uploads gegen diese Referenzen",
          ),
          l(
            "A low score notifies both sides the same day",
            "Eine niedrige Bewertung benachrichtigt beide Seiten am selben Tag",
          ),
        ],
        media: screen(
          "/media/projects/orthotrack/03-roles.png",
          l(
            "Choosing to join OrthoTrack as a patient or as a therapist.",
            "Die Wahl, OrthoTrack als Patient oder als Therapeutin beizutreten.",
          ),
        ),
      },
      {
        kind: "design",
        title: l(
          "A daily list short enough to actually complete",
          "Eine Tagesliste, kurz genug, um sie wirklich zu schaffen",
        ),
        body: [
          l(
            "The patient's home screen is four tasks and a progress ring: elastics, brushing, a photo, a breathing exercise. It is deliberately finite: a list you can finish is a list you come back to, and the streak is there to reward the habit rather than to punish a missed day.",
            "Der Startbildschirm des Patienten zeigt vier Aufgaben und einen Fortschrittsring: Gummizüge, Zähneputzen, ein Foto, eine Atemübung. Er ist bewusst endlich: Eine Liste, die man abschließen kann, ist eine Liste, zu der man zurückkehrt, und die Serie ist da, um die Gewohnheit zu belohnen, nicht um einen verpassten Tag zu bestrafen.",
          ),
          l(
            "The clinician's side inverts the priority: patient search first, then a record with photos, compliance and reference images as tabs, so a review takes seconds rather than navigation.",
            "Die Seite der Behandlerin dreht die Priorität um: zuerst die Patientensuche, dann ein Datensatz mit Fotos, Mitwirkung und Referenzbildern als Reiter, sodass eine Prüfung Sekunden dauert statt Navigation.",
          ),
        ],
        points: [
          l(
            "Four daily tasks, completable in about two minutes",
            "Vier Tagesaufgaben, in etwa zwei Minuten zu erledigen",
          ),
          l(
            "Weekly compliance rate and day streak on the same screen as the tasks",
            "Wochenquote und Tagesserie auf demselben Screen wie die Aufgaben",
          ),
          l(
            "Reminders timed to the end of the day, while there is still time to act",
            "Erinnerungen zum Tagesende, solange noch Zeit zum Handeln bleibt",
          ),
        ],
        media: screen(
          "/media/projects/orthotrack/02-compliance.png",
          l(
            "OrthoTrack's compliance view with weekly rate and the day's tasks.",
            "Die Mitwirkungsansicht von OrthoTrack mit Wochenquote und den Aufgaben des Tages.",
          ),
        ),
      },
      {
        kind: "build",
        title: l(
          "Scoring runs behind the request, not inside it",
          "Die Bewertung läuft hinter der Anfrage, nicht in ihr",
        ),
        body: [
          l(
            "Photo review is a background job, not part of the upload. The patient's capture completes immediately; the vision model scores it afterwards against the assigned references, and only a score below threshold pushes a notification. Putting the model in the request path would have made the slowest, least reliable dependency the thing standing between a patient and the one action you need them to take.",
            "Die Fotoprüfung ist ein Hintergrundprozess, kein Teil des Uploads. Die Aufnahme des Patienten ist sofort fertig; das Bildmodell bewertet sie danach gegen die zugewiesenen Referenzen, und nur eine Bewertung unter dem Schwellwert löst eine Benachrichtigung aus. Das Modell in den Anfrageweg zu legen, hätte die langsamste und unzuverlässigste Abhängigkeit zwischen den Patienten und genau die eine Handlung gestellt, die er ausführen soll.",
          ),
          l(
            "The Node.js and MongoDB backend holds patient records, media and the compliance history; Firebase Cloud Messaging carries the alerts.",
            "Das Backend aus Node.js und MongoDB hält Patientenakten, Medien und den Verlauf der Mitwirkung; Firebase Cloud Messaging transportiert die Benachrichtigungen.",
          ),
        ],
        points: [
          l(
            "A background job scores uploads; the capture never waits on the model",
            "Ein Hintergrundprozess bewertet Uploads; die Aufnahme wartet nie auf das Modell",
          ),
          l(
            "Alerts pushed via Firebase Cloud Messaging only below a score threshold",
            "Benachrichtigungen über Firebase Cloud Messaging nur unter einem Schwellwert",
          ),
          l(
            "Node.js and MongoDB for patient records, media and compliance history",
            "Node.js und MongoDB für Patientenakten, Medien und Mitwirkungsverlauf",
          ),
          l(
            "Clean Architecture with BLoC/Cubit across one Flutter codebase for both sides",
            "Clean Architecture mit BLoC/Cubit in einer Flutter-Codebasis für beide Seiten",
          ),
        ],
        media: null,
      },
      {
        kind: "result",
        title: l(
          "Compliance is now something you can look at",
          "Mitwirkung ist jetzt etwas, das man ansehen kann",
        ),
        body: [
          l(
            "The appointment conversation changes when both sides are looking at the same record rather than negotiating recollections.",
            "Das Gespräch beim Termin verändert sich, wenn beide Seiten denselben Datensatz ansehen, statt Erinnerungen zu verhandeln.",
          ),
          l(
            "The reference-image mechanism turned out to be the load-bearing idea twice over: it is what makes a series of phone photos comparable at all, and it is what gives the scoring something to score against.",
            "Der Mechanismus der Referenzbilder erwies sich gleich zweifach als tragende Idee: Er macht eine Reihe von Handyfotos überhaupt erst vergleichbar, und er gibt der Bewertung etwas, wogegen sie bewerten kann.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: false,
  },
  {
    slug: "our-ummah",
    name: "OurUmmah",
    tagline: l(
      "One place for a mosque, its members and the businesses around it",
      "Ein Ort für eine Moschee, ihre Mitglieder und die Betriebe ringsum",
    ),
    summary: l(
      "A multi-role community platform for local Muslim communities: a hub for events and announcements, QR check-ins that earn reward points at your mosque, giving that covers Zakat, Sadaqah and membership in one flow, and a directory connecting members to trusted local businesses.",
      "Eine Gemeinschaftsplattform mit mehreren Rollen für muslimische Gemeinden vor Ort: ein Ort für Veranstaltungen und Ankündigungen, QR-Check-ins, die in der eigenen Moschee Punkte einbringen, Spenden für Zakat, Sadaqa und Mitgliedschaft in einem Ablauf, und ein Verzeichnis, das Mitglieder mit vertrauenswürdigen Betrieben vor Ort verbindet.",
    ),
    industry: l("Community & non-profit", "Gemeinschaft & Non-Profit"),
    productType: l(
      "Multi-sided mobile platform",
      "Mehrseitige mobile Plattform",
    ),
    whatWeDid: l(
      "Built the Flutter front end and the Node.js backend behind it, including dynamic QR generation, the points model, Stripe payments and OAuth.",
      "Das Flutter-Frontend und das Node.js-Backend dahinter gebaut, inklusive dynamischer QR-Erzeugung, Punktemodell, Stripe-Zahlungen und OAuth.",
    ),
    outcome: l(
      "Attendance, membership and giving became one record instead of three. A member checks in with a scan; the mosque sees its community; local businesses reach it through a listing rather than a noticeboard.",
      "Anwesenheit, Mitgliedschaft und Spenden wurden ein Datensatz statt dreier. Ein Mitglied checkt per Scan ein; die Moschee sieht ihre Gemeinde; Betriebe vor Ort erreichen sie über einen Eintrag statt über ein schwarzes Brett.",
    ),
    metrics: [],
    services: [
      l("Product Strategy", "Produktstrategie"),
      l("UX Design", "UX-Design"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
      l("Backend Systems", "Backend-Systeme"),
      l("APIs", "APIs"),
    ],
    platforms: ["iOS", "Android", "API"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Node.js",
      "MongoDB",
      "Stripe",
      "OAuth",
    ],
    categories: ["mobile", "commerce"],
    period: l("May, Jul 2026", "Mai, Juli 2026"),
    heroMedia: shot(
      "/media/projects/our-ummah/01-brand.jpg",
      1448,
      1086,
      l(
        "OurUmmah's brand lockup beside the member home screen: a points balance, quick actions to scan, join a mosque or donate, and community partners.",
        "Die Markendarstellung von OurUmmah neben dem Startbildschirm für Mitglieder: ein Punktestand, Schnellaktionen zum Scannen, Beitreten oder Spenden, und Partner der Gemeinde.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/our-ummah/02-community.jpg",
        1672,
        941,
        l(
          "Four OurUmmah surfaces together: the member home, the mosque's member list, the giving flow and the club check-in QR.",
          "Vier Bereiche von OurUmmah zusammen: die Startseite für Mitglieder, die Mitgliederliste der Moschee, der Spendenablauf und der QR-Code für den Check-in.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/our-ummah/03-connect.jpg",
        1672,
        941,
        l(
          "OurUmmah's members list beside a mosque's check-in QR code, which members scan to register attendance and earn points.",
          "Die Mitgliederliste von OurUmmah neben dem Check-in-QR-Code einer Moschee, den Mitglieder scannen, um ihre Anwesenheit zu erfassen und Punkte zu sammeln.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/our-ummah/04-home.jpg",
        1672,
        941,
        l(
          "The OurUmmah home experience, showing a member's points balance and the community partners around their mosque.",
          "Die Startansicht von OurUmmah mit dem Punktestand eines Mitglieds und den Partnern der Gemeinde rund um seine Moschee.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      /* The raw captures stay in the gallery behind the composites: the case
         study sections below reference them directly, and a full-bleed screen
         shows detail a marketing render deliberately softens. */
      screen(
        "/media/projects/our-ummah/02-roles.png",
        l(
          "OurUmmah's onboarding, where a new account joins as a mosque, a member or a community partner.",
          "Der Einstieg in OurUmmah, bei dem ein neues Konto als Moschee, Mitglied oder Partner der Gemeinde beitritt.",
        ),
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "Three groups, three sets of records, none of them shared",
          "Drei Gruppen, drei Datenbestände, keiner davon geteilt",
        ),
        body: [
          l(
            "A mosque knows who has paid. A member knows how often they attend. A local business that wants to support the community has no route to it beyond a poster on a wall. None of these three had a shared surface.",
            "Eine Moschee weiß, wer bezahlt hat. Ein Mitglied weiß, wie oft es kommt. Ein Betrieb vor Ort, der die Gemeinde unterstützen möchte, hat keinen Weg dorthin außer einem Plakat an der Wand. Keine dieser drei Seiten hatte eine gemeinsame Oberfläche.",
          ),
          l(
            "Membership fees and seasonal giving were handled by cash, transfer and reminder, which is workable at small scale and stops being workable the moment it grows.",
            "Mitgliedsbeiträge und saisonale Spenden liefen über Bargeld, Überweisung und Erinnerung, was im Kleinen funktioniert und in dem Moment aufhört zu funktionieren, in dem es wächst.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "Model all three sides from the first screen",
          "Alle drei Seiten ab dem ersten Screen abbilden",
        ),
        body: [
          l(
            "The very first decision in onboarding is which of the three you are: mosque, member, or community partner. Retrofitting a second audience onto a product built for one is expensive, and this product had three from the start.",
            "Die allererste Entscheidung beim Einstieg ist, welche der drei Seiten man ist: Moschee, Mitglied oder Partner der Gemeinde. Eine zweite Zielgruppe nachträglich in ein Produkt einzubauen, das für eine gebaut wurde, ist teuer, und dieses Produkt hatte von Anfang an drei.",
          ),
          l(
            "Attendance is the connective tissue: the mosque displays a dynamically generated QR code, the member scans it, and that single event feeds reward points, membership standing and the mosque's own view of its community.",
            "Die Anwesenheit ist das Bindegewebe: Die Moschee zeigt einen dynamisch erzeugten QR-Code, das Mitglied scannt ihn, und dieses eine Ereignis speist Punkte, Mitgliedsstatus und den eigenen Blick der Moschee auf ihre Gemeinde.",
          ),
        ],
        points: [
          l(
            "Three account types, chosen at sign-up, each with its own surfaces",
            "Drei Kontotypen, bei der Anmeldung gewählt, jeder mit eigenen Bereichen",
          ),
          l(
            "Dynamic QR check-in as the shared event linking attendance and points",
            "Dynamischer QR-Check-in als gemeinsames Ereignis für Anwesenheit und Punkte",
          ),
          l(
            "A community hub carrying local events, services and announcements",
            "Ein Gemeindebereich mit Veranstaltungen, Angeboten und Ankündigungen vor Ort",
          ),
          l(
            "A member directory for managing community connections",
            "Ein Mitgliederverzeichnis zur Pflege der Verbindungen in der Gemeinde",
          ),
        ],
        media: screen(
          "/media/projects/our-ummah/02-roles.png",
          l(
            "Joining OurUmmah as a mosque, a member or a community partner.",
            "Der Beitritt zu OurUmmah als Moschee, Mitglied oder Partner der Gemeinde.",
          ),
        ),
      },
      {
        kind: "design",
        title: l(
          "Explain the mechanism, in plain language, on the screen",
          "Den Mechanismus erklären, in klarer Sprache, auf dem Screen",
        ),
        body: [
          l(
            "A points system that converts into a real financial benefit has to state its own rules where people can see them: how many points, what they cover, and what happens if the target is not reached. That explanation sits on the home screen rather than in a help page.",
            "Ein Punktesystem, das sich in einen echten finanziellen Vorteil verwandelt, muss seine Regeln dort nennen, wo Menschen sie sehen: wie viele Punkte, wofür sie reichen, und was passiert, wenn das Ziel nicht erreicht wird. Diese Erklärung steht auf dem Startbildschirm statt auf einer Hilfeseite.",
          ),
          l(
            "The rest of the interface is three quick actions and a partner list. There is very little to learn, which matters for an audience that spans every level of comfort with an app.",
            "Der Rest der Oberfläche besteht aus drei Schnellaktionen und einer Partnerliste. Es gibt sehr wenig zu lernen, und das zählt bei einem Publikum, das jede Stufe von Vertrautheit mit Apps umfasst.",
          ),
        ],
        points: [
          l(
            "The points model explained in full on the screen that shows the balance",
            "Das Punktemodell vollständig erklärt auf dem Screen, der den Stand zeigt",
          ),
          l(
            "Three quick actions, scan, join, donate, and nothing competing with them",
            "Drei Schnellaktionen, scannen, beitreten, spenden, und nichts, was mit ihnen konkurriert",
          ),
          l(
            "Giving named the way the community names it: Zakat, Sadaqah, membership",
            "Spenden so benannt, wie die Gemeinde es benennt: Zakat, Sadaqa, Mitgliedschaft",
          ),
        ],
        media: screen(
          "/media/projects/our-ummah/03-donations.png",
          l(
            "OurUmmah's giving categories.",
            "Die Spendenkategorien von OurUmmah.",
          ),
        ),
      },
      {
        kind: "build",
        title: l(
          "Money, identity and QR codes, handled properly",
          "Geld, Identität und QR-Codes, ordentlich gemacht",
        ),
        body: [
          l(
            "Payments run through Stripe and identity through OAuth. For a product handling Zakat and mosque memberships, neither was a place to improvise. The money is donated in trust, and the trust is the product.",
            "Zahlungen laufen über Stripe und die Identität über OAuth. Bei einem Produkt, das Zakat und Moscheemitgliedschaften abwickelt, war beides kein Ort zum Improvisieren. Das Geld wird im Vertrauen gegeben, und das Vertrauen ist das Produkt.",
          ),
          l(
            "Check-in codes are generated on the fly per mosque rather than printed once, so a code that leaks stops working without anyone's membership being touched.",
            "Check-in-Codes werden pro Moschee laufend erzeugt statt einmal gedruckt, sodass ein Code, der nach außen gelangt, aufhört zu funktionieren, ohne dass jemandes Mitgliedschaft angetastet wird.",
          ),
        ],
        points: [
          l(
            "Stripe for donations, Zakat, Sadaqah and membership payments",
            "Stripe für Spenden, Zakat, Sadaqa und Mitgliedsbeiträge",
          ),
          l("OAuth for authentication", "OAuth für die Authentifizierung"),
          l(
            "Dynamic, per-mosque QR generation rather than a static printed code",
            "Dynamische QR-Erzeugung pro Moschee statt eines statisch gedruckten Codes",
          ),
          l(
            "Node.js and MongoDB handling the relational data and real-time updates",
            "Node.js und MongoDB für die relationalen Daten und Echtzeit-Aktualisierungen",
          ),
        ],
        media: screen(
          "/media/projects/our-ummah/04-qr.png",
          l(
            "A dynamically generated mosque check-in QR code in OurUmmah.",
            "Ein dynamisch erzeugter QR-Code für den Moschee-Check-in in OurUmmah.",
          ),
        ),
      },
      {
        kind: "result",
        title: l(
          "One record the whole community can see its own part of",
          "Ein Datensatz, in dem die ganze Gemeinde ihren eigenen Teil sieht",
        ),
        body: [
          l(
            "Attendance, membership and giving are now the same system, which is what makes any of them reportable.",
            "Anwesenheit, Mitgliedschaft und Spenden sind jetzt dasselbe System, und genau das macht überhaupt eines davon auswertbar.",
          ),
          l(
            "The partner side gives mosques a funding route that does not depend on asking the same members for more, which was the part that made the model work.",
            "Die Partnerseite gibt Moscheen einen Finanzierungsweg, der nicht davon abhängt, dieselben Mitglieder um mehr zu bitten, und genau das ließ das Modell aufgehen.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: false,
  },
  {
    slug: "threadwise",
    name: "Threadwise",
    tagline: l(
      "Outfit suggestions composed from the wardrobe you already own",
      "Outfit-Vorschläge aus dem Kleiderschrank, den Sie bereits besitzen",
    ),
    summary: l(
      "Styling apps mostly end up selling something new. Threadwise starts from the clothes already hanging in the wardrobe: each piece is photographed and tagged once, and the app composes outfits from that collection against the weather, the occasion and how the colours actually behave together. The recommendation comes from a rule engine that can be inspected, not from a model asked to guess.",
      "Styling-Apps verkaufen am Ende meistens etwas Neues. Threadwise beginnt bei der Kleidung, die schon im Schrank hängt: Jedes Stück wird einmal fotografiert und erfasst, und die App stellt daraus Outfits zusammen, abgestimmt auf Wetter, Anlass und darauf, wie die Farben tatsächlich zusammenwirken. Die Empfehlung stammt aus einem nachvollziehbaren Regelwerk, nicht aus einem Modell, das raten soll.",
    ),
    industry: l("Fashion", "Mode"),
    productType: l("Mobile application and API", "App und API"),
    whatWeDid: l(
      "Built the Flutter application and the Node.js API behind it, including the rule engine that composes and scores outfits and the language model layer that explains them.",
      "Die Flutter-App und die Node.js-API dahinter gebaut, samt dem Regelwerk, das Outfits zusammenstellt und bewertet, und der Sprachmodell-Schicht, die sie erklärt.",
    ),
    outcome: l(
      "Recommendations a wearer can argue with. Every suggestion traces back to a stated rule about colour, weather or formality, and the wear log turns the wardrobe into a record of what actually gets worn rather than what was bought.",
      "Empfehlungen, denen man widersprechen kann. Jeder Vorschlag lässt sich auf eine benannte Regel zu Farbe, Wetter oder Anlass zurückführen, und das Trageprotokoll macht aus dem Kleiderschrank einen Nachweis dessen, was tatsächlich getragen wird, statt dessen, was gekauft wurde.",
    ),
    metrics: [],
    services: [
      l("Product Strategy", "Produktstrategie"),
      l("UX Design", "UX-Design"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
      l("AI Integration", "KI-Integration"),
      l("Backend Systems", "Backend-Systeme"),
      l("APIs", "APIs"),
    ],
    platforms: ["iOS", "Android", "API"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Node.js",
      "Express",
      "MongoDB",
      "Gemini",
      "AWS S3",
      "Hive",
      "Dio",
      "GetIt",
    ],
    categories: ["mobile", "ai"],
    period: l("Aug 2026", "Aug. 2026"),
    heroMedia: shot(
      "/media/projects/threadwise/01-brand.jpg",
      1448,
      1086,
      l(
        "The Threadwise identity beside its onboarding screen, with the Flutter, Node.js and MongoDB marks it is built on.",
        "Die Marke Threadwise neben ihrem Onboarding-Screen, mit den Zeichen von Flutter, Node.js und MongoDB, auf denen sie aufbaut.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
      true,
    ),
    galleryMedia: [
      shot(
        "/media/projects/threadwise/02-wardrobe.jpg",
        1448,
        1086,
        l(
          "The Threadwise wardrobe, the outfit builder and the daily edit, side by side.",
          "Der Kleiderschrank von Threadwise, der Outfit-Baukasten und die Tagesauswahl, nebeneinander.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/threadwise/03-stylist.jpg",
        1448,
        1086,
        l(
          "Today's Edit in Threadwise: ranked outfit suggestions with a match label and a wear-today action.",
          "Die Tagesauswahl in Threadwise: bewertete Outfit-Vorschläge mit Übereinstimmungsangabe und der Aktion, es heute zu tragen.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/threadwise/04-add-item.jpg",
        1448,
        1086,
        l(
          "Adding a garment in Threadwise: photo, category, silhouette and the colour picked from the picture itself.",
          "Ein Kleidungsstück in Threadwise erfassen: Foto, Kategorie, Silhouette und die Farbe, direkt aus dem Bild entnommen.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "The wardrobe is already there, and nothing can read it",
          "Der Kleiderschrank ist längst da, und nichts kann ihn lesen",
        ),
        body: [
          l(
            "People own far more than they wear. The reason is not taste, it is retrieval: at the moment of getting dressed nobody can hold a whole wardrobe in their head, so the same few items surface and everything else quietly stops existing.",
            "Menschen besitzen weit mehr, als sie tragen. Der Grund ist nicht der Geschmack, sondern der Zugriff: Im Moment des Anziehens hat niemand den ganzen Schrank im Kopf, also tauchen dieselben paar Stücke auf und alles andere hört still auf zu existieren.",
          ),
          l(
            "Every product in the category answers this with a shop. The brief here was the opposite: work only with what someone already owns, which means the app has to actually know the collection rather than infer a taste profile from purchases.",
            "Jedes Produkt der Kategorie beantwortet das mit einem Shop. Der Auftrag lautete hier umgekehrt: nur mit dem arbeiten, was jemand bereits besitzt. Das heißt, die App muss die Sammlung wirklich kennen, statt aus Einkäufen ein Geschmacksprofil abzuleiten.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "Capture each piece once, then never ask again",
          "Jedes Stück einmal erfassen, dann nie wieder fragen",
        ),
        body: [
          l(
            "Everything downstream depends on the wardrobe being complete, so the cost of adding an item had to be close to nothing. A photo, a category, a silhouette, and the colour lifted from the picture by tapping it. Fabric, formality, occasion and season are there for anyone who wants the suggestions sharper, and skippable for everyone else.",
            "Alles Weitere hängt daran, dass der Kleiderschrank vollständig ist. Deshalb musste das Erfassen eines Stücks fast nichts kosten. Ein Foto, eine Kategorie, eine Silhouette, und die Farbe wird durch Antippen aus dem Bild übernommen. Stoff, Anlass, Formalität und Saison stehen bereit für alle, die schärfere Vorschläge wollen, und lassen sich sonst überspringen.",
          ),
          l(
            "From there the app has four surfaces over one collection: the wardrobe itself, outfits a person composes by hand, the suggestions the engine composes for them, and a day plan that puts either against a date.",
            "Von dort aus hat die App vier Bereiche über einer Sammlung: den Kleiderschrank selbst, von Hand zusammengestellte Outfits, die Vorschläge, die das System zusammenstellt, und einen Tagesplan, der beides an ein Datum knüpft.",
          ),
        ],
        points: [
          l(
            "A guided add-item flow: photo, category, silhouette, colour sampled from the image",
            "Ein geführter Erfassungsablauf: Foto, Kategorie, Silhouette, Farbe aus dem Bild entnommen",
          ),
          l(
            "Hand-built outfits and generated suggestions living in the same list",
            "Von Hand gebaute Outfits und erzeugte Vorschläge in derselben Liste",
          ),
          l(
            "A wear log, so the wardrobe records what is used rather than what is owned",
            "Ein Trageprotokoll, damit der Schrank festhält, was genutzt wird, statt was vorhanden ist",
          ),
          l(
            "A day plan that ties an outfit to a date and the forecast for it",
            "Ein Tagesplan, der ein Outfit an ein Datum und die zugehörige Vorhersage bindet",
          ),
        ],
        media: shot(
          "/media/projects/threadwise/04-add-item.jpg",
          1448,
          1086,
          l(
            "The Threadwise add-item flow and the item detail it produces.",
            "Der Erfassungsablauf von Threadwise und die Detailansicht, die daraus entsteht.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: l(
          "Clothes are the colour, so the interface is not",
          "Die Kleidung ist die Farbe, also ist es die Oberfläche nicht",
        ),
        body: [
          l(
            "A wardrobe grid is dozens of photographs at once, every one of them a different colour. An interface with opinions of its own would fight all of them, so the chrome stays a single crimson against near-white, and the garments carry the page.",
            "Ein Kleiderschrank-Raster zeigt Dutzende Fotos gleichzeitig, jedes in einer anderen Farbe. Eine Oberfläche mit eigenen Ansichten würde mit allen streiten, also bleibt der Rahmen ein einziges Karmesinrot auf nahezu Weiß, und die Kleidungsstücke tragen die Seite.",
          ),
          l(
            "The onboarding makes one promise and stops. It says what the app does with the wardrobe rather than what it will do for a person's life, which is the claim the product can actually keep on day one, when the wardrobe is still empty.",
            "Das Onboarding gibt ein Versprechen und hört dann auf. Es sagt, was die App mit dem Kleiderschrank macht, nicht was sie für ein Leben tun wird. Das ist die Zusage, die das Produkt am ersten Tag wirklich halten kann, wenn der Schrank noch leer ist.",
          ),
        ],
        points: [
          l(
            "A single accent on a near-white ground, so photography sets the palette",
            "Ein einziger Akzent auf nahezu weißem Grund, damit die Fotos die Palette bestimmen",
          ),
          l(
            "A serif display face, so a styling product does not read as a utility",
            "Eine Serifen-Displayschrift, damit ein Styling-Produkt nicht wie ein Werkzeug wirkt",
          ),
          l(
            "Match strength shown as a plain label on the suggestion, not a score out of ten",
            "Die Passgenauigkeit steht als schlichte Angabe am Vorschlag, nicht als Note von zehn",
          ),
        ],
        media: shot(
          "/media/projects/threadwise/05-onboarding.jpg",
          1448,
          1086,
          l(
            "Threadwise onboarding: one promise about tracking, rediscovering and building a wardrobe that works.",
            "Das Onboarding von Threadwise: ein Versprechen zum Festhalten, Wiederentdecken und Aufbauen eines Schranks, der funktioniert.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "build",
        title: l(
          "The rules choose the outfit, the model only narrates it",
          "Die Regeln wählen das Outfit, das Modell erzählt es nur",
        ),
        body: [
          l(
            "The suggestion engine is a deterministic expert system, not a prompt. It builds valid outfits slot by slot, then scores each one through three independent rule sets: colour, using the Sanzo Wada harmony tables; weather, against the live forecast for the wearer's location; and occasion, against the formality the day calls for. A rule can also block an outfit outright, which is what keeps a linen shirt out of a suggestion for a cold morning.",
            "Das Vorschlagssystem ist ein deterministisches Expertensystem, kein Prompt. Es baut gültige Outfits Platz für Platz auf und bewertet jedes über drei unabhängige Regelwerke: Farbe, anhand der Harmonietafeln von Sanzo Wada; Wetter, gegen die aktuelle Vorhersage am Ort der Person; und Anlass, gegen die Formalität, die der Tag verlangt. Eine Regel kann ein Outfit auch ganz ausschließen, und genau das hält das Leinenhemd aus einem Vorschlag für einen kalten Morgen heraus.",
          ),
          l(
            "A language model enters only after the decision is made, to turn the winning outfit into a sentence a person would say. It never reorders the results and never overrules a rule. That boundary is the whole design: the recommendation stays explainable and reproducible, and the interesting part of the product does not disappear behind a provider's API.",
            "Ein Sprachmodell kommt erst ins Spiel, nachdem die Entscheidung gefallen ist, um aus dem Siegeroutfit einen Satz zu machen, den auch ein Mensch sagen würde. Es sortiert die Ergebnisse nie um und überstimmt nie eine Regel. Diese Grenze ist der ganze Entwurf: Die Empfehlung bleibt erklärbar und reproduzierbar, und der interessante Teil des Produkts verschwindet nicht hinter der API eines Anbieters.",
          ),
          l(
            "The narration sits behind a swappable provider and a two-tier cache, in memory and in MongoDB, keyed by the outfit fingerprint and the prompt version. If the provider is slow or down, the request falls back to deterministic prose and the suggestion still arrives. Nothing in the feature can fail in a way the wearer sees.",
            "Die Erzählung liegt hinter einem austauschbaren Anbieter und einem zweistufigen Zwischenspeicher, im Arbeitsspeicher und in MongoDB, adressiert über den Fingerabdruck des Outfits und die Version des Prompts. Ist der Anbieter langsam oder ausgefallen, greift der Aufruf auf festen Text zurück, und der Vorschlag kommt trotzdem an. Nichts an dieser Funktion kann so ausfallen, dass die Person es merkt.",
          ),
        ],
        points: [
          l(
            "A rule engine scoring colour, weather and occasion, with hard blocking rules",
            "Ein Regelwerk, das Farbe, Wetter und Anlass bewertet, mit harten Ausschlussregeln",
          ),
          l(
            "Sanzo Wada colour harmony as the knowledge base behind the colour rules",
            "Die Farbharmonien von Sanzo Wada als Wissensbasis hinter den Farbregeln",
          ),
          l(
            "A swappable model provider, cached in memory and in MongoDB, with a text fallback",
            "Ein austauschbarer Modellanbieter, zwischengespeichert im Arbeitsspeicher und in MongoDB, mit Textrückfall",
          ),
          l(
            "Node.js and Express over MongoDB, with garment photography on S3",
            "Node.js und Express über MongoDB, mit den Kleidungsfotos auf S3",
          ),
          l(
            "One Flutter codebase on Clean Architecture with BLoC and Cubit",
            "Eine Flutter-Codebasis auf Clean Architecture mit BLoC und Cubit",
          ),
        ],
        media: shot(
          "/media/projects/threadwise/03-stylist.jpg",
          1448,
          1086,
          l(
            "A generated daily edit in Threadwise, with the match label the rule engine produced.",
            "Eine erzeugte Tagesauswahl in Threadwise, mit der Übereinstimmungsangabe aus dem Regelwerk.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "result",
        title: l(
          "A recommendation with its reasoning still attached",
          "Eine Empfehlung, an der die Begründung noch hängt",
        ),
        body: [
          l(
            "Because the rules decide, every suggestion can be traced to the reason it was made, and a wearer who disagrees is disagreeing with something specific. That is a different relationship with a styling product than being handed a look and asked to trust it.",
            "Weil die Regeln entscheiden, lässt sich jeder Vorschlag auf seinen Grund zurückführen, und wer widerspricht, widerspricht etwas Konkretem. Das ist ein anderes Verhältnis zu einem Styling-Produkt, als einen Look vorgesetzt zu bekommen und ihm vertrauen zu sollen.",
          ),
          l(
            "It is also the cheaper architecture. The model is called once per unseen outfit and never on the hot path, so the running cost of the feature stays flat as the wardrobe grows.",
            "Es ist zudem die günstigere Bauweise. Das Modell wird einmal pro unbekanntem Outfit aufgerufen und nie im laufenden Betrieb, sodass die Betriebskosten der Funktion gleich bleiben, während der Schrank wächst.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: false,
    isDraft: false,
  },
  {
    slug: "tatunow",
    name: "TatuNow",
    tagline: l(
      "One booking record for the three sides of a tattoo",
      "Ein Buchungsvorgang für die drei Seiten eines Tattoos",
    ),
    summary: l(
      "Tattoo booking runs on direct messages. A client finds an artist through a social feed, describes the idea in a chat thread, and both sides lose the placement, the reference art and the deposit somewhere in the scroll. TatuNow gives each side of that transaction its own product: clients open a project and follow it, artists work a request queue attached to their portfolio, and studios manage the artists under their roof.",
      "Tattoo-Buchungen laufen über Direktnachrichten. Der Kunde findet den Artist über einen Social Feed, beschreibt die Idee im Chat, und beide Seiten verlieren Platzierung, Referenzbilder und Anzahlung irgendwo im Verlauf. TatuNow gibt jeder Seite dieses Geschäfts ein eigenes Produkt: Kunden eröffnen ein Projekt und verfolgen es, Artists arbeiten eine Anfrageliste an ihrem Portfolio ab, und Studios verwalten die Artists unter ihrem Dach.",
    ),
    industry: l("Creative services", "Kreativdienstleistungen"),
    productType: l(
      "Multi-sided mobile platform",
      "Mehrseitige mobile Plattform",
    ),
    whatWeDid: l(
      "Built the cross-platform application covering all three roles, on Firebase for authentication, data, media and notifications.",
      "Die plattformübergreifende App für alle drei Rollen gebaut, auf Firebase für Anmeldung, Daten, Medien und Benachrichtigungen.",
    ),
    outcome: l(
      "A booking that survives leaving the chat window. A request carries its style, its reference art and its history in one place, and an artist's portfolio becomes the thing being browsed rather than a public grid that happens to contain work.",
      "Eine Buchung, die es übersteht, den Chat zu verlassen. Eine Anfrage trägt Stil, Referenzbilder und Verlauf an einem Ort, und das Portfolio eines Artists wird zu dem, was durchgesehen wird, statt zu einem öffentlichen Raster, in dem zufällig Arbeiten liegen.",
    ),
    metrics: [],
    services: [
      l("Product Strategy", "Produktstrategie"),
      l("UX Design", "UX-Design"),
      l("UI Design", "UI-Design"),
      l("Cross-platform Applications", "Plattformübergreifende Apps"),
      l("Backend Systems", "Backend-Systeme"),
    ],
    platforms: ["iOS", "Android"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Firebase Auth",
      "Cloud Firestore",
      "Firebase Storage",
      "Firebase Cloud Messaging",
      "GoRouter",
      "Hive",
      "Dio",
      "GetIt",
    ],
    categories: ["mobile", "commerce"],
    period: l("Aug 2026", "Aug. 2026"),
    heroMedia: shot(
      "/media/projects/tatunow/01-brand.jpg",
      1448,
      1086,
      l(
        "The TatuNow identity beside its artist discovery, request queue and portfolio screens.",
        "Die Marke TatuNow neben den Screens für Artist-Suche, Anfrageliste und Portfolio.",
      ),
      "(min-width: 1024px) 46vw, 92vw",
      true,
    ),
    galleryMedia: [
      shot(
        "/media/projects/tatunow/02-discovery.jpg",
        1672,
        941,
        l(
          "Browsing TatuNow artists by style, and opening one artist's profile and portfolio.",
          "Artists bei TatuNow nach Stil durchsehen und das Profil samt Portfolio eines Artists öffnen.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/tatunow/03-journey.jpg",
        1672,
        941,
        l(
          "The TatuNow booking path: find an artist, open a project, follow it through.",
          "Der Buchungsweg bei TatuNow: einen Artist finden, ein Projekt eröffnen, es begleiten.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/tatunow/04-dashboard.jpg",
        1672,
        941,
        l(
          "The TatuNow artist dashboard, with pending requests and completed sessions.",
          "Das Artist-Dashboard von TatuNow, mit offenen Anfragen und abgeschlossenen Sitzungen.",
        ),
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: l(
          "A booking that lives in a chat thread is not a record",
          "Eine Buchung im Chatverlauf ist kein Vorgang",
        ),
        body: [
          l(
            "The whole trade already happens on phones, but on tools built for something else. An enquiry, the reference images, the placement, the size, the quoted price and the deposit all arrive as messages, and a message is the one format none of them can be looked up in later.",
            "Das gesamte Gewerbe läuft bereits über Telefone, aber mit Werkzeugen, die für etwas anderes gebaut sind. Anfrage, Referenzbilder, Platzierung, Größe, Preis und Anzahlung kommen alle als Nachrichten an, und eine Nachricht ist genau das Format, in dem sich später nichts davon nachschlagen lässt.",
          ),
          l(
            "The three sides also want opposite things from the same screen. A client is deciding whom to trust with permanent work. An artist is triaging a queue. A studio is looking at a roster. Serving all three from one feed is what makes the existing tools feel wrong to everyone at once.",
            "Die drei Seiten wollen außerdem Gegensätzliches vom selben Bildschirm. Ein Kunde entscheidet, wem er dauerhafte Arbeit anvertraut. Ein Artist sichtet eine Warteschlange. Ein Studio schaut auf eine Besetzung. Alle drei aus einem Feed zu bedienen ist der Grund, warum sich die vorhandenen Werkzeuge für alle gleichzeitig falsch anfühlen.",
          ),
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: l(
          "Three products, one account system",
          "Drei Produkte, ein Kontosystem",
        ),
        body: [
          l(
            "The role is chosen at sign-up and decides the entire application: its navigation, its home screen and what a person can do at all. A client gets discovery and projects. An artist gets a dashboard, a request queue and a portfolio to keep. A studio gets those plus the artists it represents.",
            "Die Rolle wird bei der Anmeldung gewählt und bestimmt die ganze Anwendung: Navigation, Startbildschirm und überhaupt den Handlungsspielraum. Ein Kunde bekommt Suche und Projekte. Ein Artist bekommt ein Dashboard, eine Anfrageliste und ein Portfolio. Ein Studio bekommt beides plus die Artists, die es vertritt.",
          ),
          l(
            "The enquiry becomes a project: a named thing with a style, a description, reference art and a state, which both sides open rather than scroll back through. Chat stays, because the conversation is real, but it sits beside the record instead of being the record.",
            "Aus der Anfrage wird ein Projekt: eine benannte Sache mit Stil, Beschreibung, Referenzbildern und einem Zustand, die beide Seiten öffnen, statt zurückzuscrollen. Der Chat bleibt, denn das Gespräch ist echt, aber er steht neben dem Vorgang, statt der Vorgang zu sein.",
          ),
        ],
        points: [
          l(
            "Role chosen at sign-up, driving navigation and permissions throughout",
            "Rolle bei der Anmeldung gewählt, sie steuert Navigation und Rechte durchgehend",
          ),
          l(
            "Discovery filtered by tattoo style, across both artists and studios",
            "Suche gefiltert nach Tattoo-Stil, über Artists und Studios hinweg",
          ),
          l(
            "A project record carrying style, description, reference art and state",
            "Ein Projektvorgang mit Stil, Beschreibung, Referenzbildern und Zustand",
          ),
          l(
            "Portfolios an artist builds and keeps, rather than a public grid",
            "Portfolios, die ein Artist aufbaut und behält, statt eines öffentlichen Rasters",
          ),
        ],
        media: shot(
          "/media/projects/tatunow/02-discovery.jpg",
          1672,
          941,
          l(
            "Style-filtered discovery in TatuNow, and the artist profile it opens into.",
            "Die nach Stil gefilterte Suche in TatuNow und das Artist-Profil, das sich daraus öffnet.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: l(
          "Dark, because the work is the only thing with colour in it",
          "Dunkel, weil allein die Arbeit Farbe hat",
        ),
        body: [
          l(
            "Tattoo photography is high-contrast skin and ink, and it dies on a white page. The application is near-black with a single brass accent, which lets a portfolio grid read as a portfolio rather than as a product listing.",
            "Tattoo-Fotografie ist kontraststarke Haut und Tinte, und auf weißer Seite stirbt sie. Die Anwendung ist nahezu schwarz mit einem einzigen Messingakzent, wodurch ein Portfolio-Raster wie ein Portfolio wirkt und nicht wie eine Produktliste.",
          ),
          l(
            "The one thing the interface asserts is the artist. A profile leads with the person, their studio address, their social links and the styles they name themselves, because that is the evidence a client is actually weighing before they commit to something permanent.",
            "Das Einzige, was die Oberfläche behauptet, ist der Artist. Ein Profil führt mit der Person, der Studioadresse, den sozialen Verweisen und den Stilen, die sie selbst nennt, denn das ist der Beleg, den ein Kunde tatsächlich abwägt, bevor er sich auf etwas Dauerhaftes einlässt.",
          ),
        ],
        points: [
          l(
            "A near-black ground with one brass accent, so ink photography carries the screen",
            "Ein nahezu schwarzer Grund mit einem Messingakzent, damit die Tattoo-Fotos den Bildschirm tragen",
          ),
          l(
            "Style chips as the primary filter, the vocabulary the trade already uses",
            "Stil-Chips als wichtigster Filter, das Vokabular, das die Branche ohnehin nutzt",
          ),
          l(
            "An artist dashboard that opens on the two numbers that matter, then the queue",
            "Ein Artist-Dashboard, das mit den zwei entscheidenden Zahlen öffnet, dann die Warteschlange",
          ),
        ],
        media: shot(
          "/media/projects/tatunow/05-welcome.jpg",
          1448,
          1086,
          l(
            "The TatuNow welcome screen, with the mark and the language switch.",
            "Der Willkommensbildschirm von TatuNow, mit Zeichen und Sprachumschalter.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "build",
        title: l(
          "One codebase, three applications, no forked build",
          "Eine Codebasis, drei Anwendungen, kein aufgespaltener Build",
        ),
        body: [
          l(
            "Three roles usually become three apps, or one app with conditionals scattered through every screen. Here each role owns its own feature tree with its own navigation shell, and the router picks the shell once, at sign-in. Anything genuinely common, chat, portfolio creation, the search surface, lives in a shared layer both sides import.",
            "Drei Rollen werden sonst zu drei Apps oder zu einer App mit Fallunterscheidungen in jedem Screen. Hier besitzt jede Rolle ihren eigenen Funktionsbaum mit eigener Navigationshülle, und der Router wählt die Hülle einmal, bei der Anmeldung. Was wirklich gemeinsam ist, also Chat, Portfolio-Erstellung und die Suche, liegt in einer geteilten Schicht, die beide Seiten einbinden.",
          ),
          l(
            "The backend is Firebase throughout: authentication with Google and Apple sign-in, Firestore for projects and profiles, Storage for portfolio images, and Cloud Messaging for the notification an artist needs when a request arrives. For a marketplace at this stage that is the right trade, the whole team's effort goes into the three products rather than into operating a server.",
            "Das Backend ist durchgehend Firebase: Anmeldung mit Google und Apple, Firestore für Projekte und Profile, Storage für Portfolio-Bilder und Cloud Messaging für die Benachrichtigung, die ein Artist bei einer neuen Anfrage braucht. Für einen Marktplatz in dieser Phase ist das der richtige Tausch: Die Arbeit des Teams fließt in die drei Produkte statt in den Betrieb eines Servers.",
          ),
        ],
        points: [
          l(
            "A feature tree per role, with the navigation shell resolved once at sign-in",
            "Ein Funktionsbaum je Rolle, die Navigationshülle wird einmal bei der Anmeldung bestimmt",
          ),
          l(
            "A shared layer for chat, portfolio creation and search, imported by every role",
            "Eine geteilte Schicht für Chat, Portfolio-Erstellung und Suche, von jeder Rolle eingebunden",
          ),
          l(
            "Firebase for authentication, Firestore, Storage and Cloud Messaging",
            "Firebase für Anmeldung, Firestore, Storage und Cloud Messaging",
          ),
          l(
            "Clean Architecture with BLoC and Cubit; GoRouter for routing, GetIt for injection",
            "Clean Architecture mit BLoC und Cubit; GoRouter für das Routing, GetIt für die Injection",
          ),
          l(
            "Localised from the first screen, with the language switch on the welcome view",
            "Von der ersten Ansicht an lokalisiert, mit dem Sprachumschalter im Willkommensbildschirm",
          ),
        ],
        media: shot(
          "/media/projects/tatunow/04-dashboard.jpg",
          1672,
          941,
          l(
            "The artist side of TatuNow: pending requests, completed sessions and the marketplace panel.",
            "Die Artist-Seite von TatuNow: offene Anfragen, abgeschlossene Sitzungen und der Marktplatz-Bereich.",
          ),
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "result",
        title: l(
          "The trade's own workflow, in something built for it",
          "Der Arbeitsablauf der Branche, in etwas, das dafür gebaut ist",
        ),
        body: [
          l(
            "Nothing here asks an artist to work differently. It takes the sequence they already run, being found by style, agreeing a piece, booking it, and gives each step somewhere to live that is not a message thread.",
            "Nichts hier verlangt von einem Artist, anders zu arbeiten. Es nimmt die Abfolge, die ohnehin läuft, also nach Stil gefunden werden, ein Motiv abstimmen, es buchen, und gibt jedem Schritt einen Ort, der kein Nachrichtenverlauf ist.",
          ),
          l(
            "Splitting by role early is what makes the third side possible. Studios were added as a full participant rather than as an artist account with extra fields, which is the version that would have had to be unpicked later.",
            "Die frühe Trennung nach Rollen macht die dritte Seite überhaupt möglich. Studios kamen als vollwertige Teilnehmer hinzu und nicht als Artist-Konto mit Zusatzfeldern, also in der Variante, die man später hätte auseinandernehmen müssen.",
          ),
        ],
        points: [],
        media: null,
      },
    ],
    featured: false,
    isDraft: false,
  },
];
