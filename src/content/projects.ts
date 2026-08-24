import type { Media, Project } from "./schemas";

/**
 * PORTFOLIO CONTENT — real Techlogi work.
 *
 * Every feature, stack entry and date below comes from the engineer who built
 * these, via their own written project descriptions — not inferred from the
 * screenshots. Two earlier drafts were wrong in ways worth remembering: Zyuela
 * was described as having no AI (it is an AI coaching product) and OrthoTrack's
 * vision-model photo scoring, the most interesting thing in it, was missed
 * entirely. Screens alone are not a spec.
 *
 * The narrative framing in `caseStudySections` is still editorial — the facts
 * are the author's, the way they are told is the site's. Worth one read before
 * a client sees it.
 *
 * `metrics` is deliberately EMPTY everywhere. No number goes on this site until
 * someone can point at where it was measured.
 *
 * Adding a project:
 *   1. Add an entry here — the schema in `./schemas.ts` is the contract.
 *   2. Drop media in `public/media/projects/<slug>/`. An image declares its own
 *      `width`/`height`; the frame reserves its box from those.
 *   3. Routes, the home-page selection, `/work` filters, related-project links
 *      and the sitemap all derive from this file. Nothing else to wire.
 */

/** A landscape marketing composite — the device is already drawn in the image. */
function shot(
  src: string,
  width: number,
  height: number,
  alt: string,
  sizes = "(min-width: 1024px) 56vw, 92vw",
  /** Hero media only — everything else stays lazy. */
  priority = false,
): Media {
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
function screen(src: string, alt: string): Media {
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

export const projects: Project[] = [
  {
    slug: "soulmate-society",
    name: "Soulmate Society",
    tagline: "Intentional matchmaking, built on values rather than volume",
    summary:
      "Most dating products optimise for volume: more profiles, faster swiping, more matches. Soulmate Society is built for the opposite — a compatibility score computed from core values and personality alignment, curated discovery on a map rather than an endless queue, and private conversations designed to actually start one.",
    industry: "Social",
    productType: "Mobile application",
    whatWeDid:
      "Built the mobile application end to end in Flutter, and integrated the real-time messaging and geospatial mapping services behind it.",
    outcome:
      "A calmer product than the category default. A match percentage is explainable rather than magical, discovery is finite, and the messaging surface is private by construction.",
    metrics: [],
    services: [
      "Product Strategy",
      "UI Design",
      "Design Systems",
      "Cross-platform Applications",
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
    period: "Mar — Apr 2026",
    heroMedia: shot(
      "/media/projects/soulmate-society/01-brand.jpg",
      1448,
      1086,
      "Soulmate Society's discovery screen: a curated match with a compatibility score, beside a private conversation.",
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/soulmate-society/02-connection.jpg",
        1672,
        941,
        "Soulmate Society's core surfaces: curated discovery, favourites, messaging and profile.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/soulmate-society/03-home.jpg",
        1672,
        941,
        "The Soulmate Society home experience, showing curated matches rather than an endless queue.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "The category's defaults work against the stated goal",
        body: [
          "An app that optimises for session length and swipe volume produces exactly that. It does not produce the outcome people say they came for, and the interface quietly communicates that everyone is interchangeable.",
          "The brief was to build for a different measure — fewer, better-considered connections — which meant rejecting most of the patterns the category has settled on.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Match on stated values, and show the reasoning",
        body: [
          "Compatibility is a percentage computed from core values and personality alignment, not a number that appears by magic. If a product is going to claim two people are a strong match, the claim has to be inspectable.",
          "Discovery is geospatial and curated: an interactive map of potential matches nearby, which is a defined set to consider rather than an infinite queue. That single change is what alters how much attention each profile actually gets.",
        ],
        points: [
          "A compatibility algorithm scoring core values and personality alignment",
          "Map-based discovery of curated matches nearby, not an endless feed",
          "Profiles built around personal stories and stated values, with favourites",
        ],
        media: shot(
          "/media/projects/soulmate-society/02-connection.jpg",
          1672,
          941,
          "Curated discovery, favourites and private messaging in Soulmate Society.",
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: "A premium register, deliberately unlike the category",
        body: [
          "Deep navy and gold, a serif display face, generous space — closer to a members' club than to a social feed, and that is the point. It sets an expectation about pace before a single interaction happens.",
          "Photography is given room rather than cropped into a grid, and the compatibility badge sits on the image where the decision is actually being made.",
        ],
        points: [
          "A serif-led identity and restrained palette, uncommon in the category",
          "One profile at a time, at a size where it can be read rather than skimmed",
          "Conversation prompts in the chat, so a first message is easier to send",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "Two hard integrations, kept behind clean boundaries",
        body: [
          "Real-time messaging and geospatial discovery are the two features that would otherwise dominate the codebase. Both run through third-party infrastructure — GetStream for low-latency chat, media handling and presence; Mapbox for map rendering and location-based discovery — so the product's own code stays about matching rather than about sockets and tiles.",
          "Clean Architecture with BLoC and Cubit keeps each of those behind a boundary, which is what lets location services, matchmaking logic and the chat transport be reasoned about separately.",
        ],
        points: [
          "GetStream for real-time messaging, media and presence indicators",
          "Mapbox SDK for map rendering and location-based discovery",
          "Clean Architecture with BLoC/Cubit; GetIt for injection, Dio for transport",
          "One Flutter codebase delivering a native experience on iOS and Android",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "A product that reads as considered",
        body: [
          "The app looks and behaves like the thing it claims to be, which is most of the credibility problem in this category solved.",
          "The design system is the durable asset — new surfaces can be added without renegotiating the brand each time.",
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
    tagline: "AI coaching, journalling and habits in one private space",
    summary:
      "A mental wellbeing and coaching app: an AI coach you can actually talk to, guided journalling that tracks an emotional baseline over time, and habit work aimed at small consistent routines rather than large goals. The point is a private, clutter-free place to think — not another dashboard of streaks to protect.",
    industry: "Health & wellbeing",
    productType: "AI product",
    whatWeDid:
      "Built the Flutter front end and the Node.js backend behind it, including authentication, data persistence and the calls to the AI APIs.",
    outcome:
      "Reflection, coaching and habit tracking live in one product instead of three, and the coaching responds to what the person is actually working through rather than serving generic prompts.",
    metrics: [],
    services: [
      "Product Discovery",
      "UX Design",
      "UI Design",
      "Cross-platform Applications",
      "AI Integration",
      "Backend Systems",
    ],
    platforms: ["iOS", "Android", "API"],
    technologies: [
      "Flutter",
      "Dart",
      "BLoC/Cubit",
      "Node.js",
      "MongoDB",
    ],
    categories: ["mobile", "ai"],
    period: "May — Jun 2026",
    heroMedia: shot(
      "/media/projects/zyuela/01-brand.jpg",
      1672,
      941,
      "Zyuela's welcome screen: a calm, distraction-free opening built around self-awareness rather than targets.",
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/zyuela/02-space.jpg",
        1672,
        941,
        "Zyuela's core surfaces: home, journal, AI coach, tasks and profile in one supportive space.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/zyuela/03-reflect.jpg",
        1672,
        941,
        "Zyuela's reflect, understand and move forward sequence, with its AI coaching chat and reflection prompts.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Reflection, coaching and habits lived in three different apps",
        body: [
          "Journalling in one place, a habit tracker in another, and coaching — if any — in a third. None of them knew what the others held, so nothing could respond to what a person was actually working through.",
          "The brief was one private space where the coaching has context: it can see the reflections and the routines, because they are in the same product.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "One space, four surfaces, and a coach that has read the room",
        body: [
          "Home, journal, coach, tasks and profile are the whole product. Each is small on its own; the value is that they share a context, so guidance can be about this week rather than about wellbeing in general.",
          "Habit work is deliberately scoped to consistent daily routines rather than large goals, and progress is presented as insight into change over time rather than as a score that resets.",
        ],
        points: [
          "An interactive AI coaching chat giving guidance and prompts in context",
          "Guided journalling that tracks an emotional baseline over time",
          "Task management aimed at small daily routines, not large goals",
          "Profile insights that show change over time",
        ],
        media: shot(
          "/media/projects/zyuela/02-space.jpg",
          1672,
          941,
          "Zyuela's home, journal, coach, tasks and profile surfaces.",
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: "Quiet, warm, and almost entirely typographic",
        body: [
          "A near-white ground, a deep green accent and a serif wordmark — closer to a printed journal than to a fitness tracker. There is very little chrome, because the writing and the conversation are the product.",
          "Prompts are set large and centred with nothing competing for attention, so the screen asks one thing at a time. The welcome screen sets that tone before any feature does.",
        ],
        points: [
          "A calm, paper-like palette with a single restrained accent",
          "One prompt per screen, at reading size",
          "A distraction-free opening that establishes the pace of the product",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "The model is a component with a job, not the product",
        body: [
          "The Node.js and MongoDB backend owns authentication, persistence and every call out to the AI APIs. Keeping the model behind the server rather than in the client is what makes the key, the cost and the prompt something the product controls.",
          "Clean Architecture with BLoC and Cubit on the Flutter side means the coaching surface is one feature among several rather than an assumption baked through the app — which is what lets it survive the feature growth a product like this attracts.",
        ],
        points: [
          "Node.js and MongoDB owning auth, persistence and all AI API calls",
          "Clean Architecture with BLoC/Cubit, so state stays predictable as features land",
          "One Flutter codebase serving iOS and Android",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "A product you can come back to after a gap",
        body: [
          "Because progress is framed as insight rather than as an unbroken record, returning after a week away costs nothing — which is the behaviour the whole design was aimed at.",
          "The context-sharing between journal, tasks and coach is the durable idea: any new surface added later inherits it for free.",
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
    tagline: "Orthodontic care that stays connected between appointments",
    summary:
      "Orthodontic outcomes depend on what happens at home — elastics worn, teeth brushed, photos taken at a comparable angle. Between appointments a clinician can see none of it. OrthoTrack gives the patient a short daily check-in and scores their progress photos against therapist-set reference images automatically, so a problem reaches a human while it still matters.",
    industry: "Healthcare",
    productType: "Two-sided AI platform",
    whatWeDid:
      "Built the cross-platform mobile application and the backend infrastructure powering it, including the automated photo review pipeline and the alerting behind it.",
    outcome:
      "What used to be a question asked at the next appointment is now a record. Patients follow a short daily list, and a low-scoring photo alerts both sides the same day instead of waiting weeks for someone to notice.",
    metrics: [],
    services: [
      "Product Discovery",
      "UX Design",
      "Cross-platform Applications",
      "AI Integration",
      "Backend Systems",
      "APIs",
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
    period: "Jul — Aug 2026",
    heroMedia: screen(
      "/media/projects/orthotrack/01-patient-home.png",
      "OrthoTrack's patient home: today's progress with elastics, brushing, photo upload and breathing, plus the assigned therapist.",
    ),
    galleryMedia: [
      screen(
        "/media/projects/orthotrack/02-compliance.png",
        "OrthoTrack's compliance overview: weekly rate, elastics adherence and the day's remaining tasks.",
      ),
      screen(
        "/media/projects/orthotrack/03-roles.png",
        "OrthoTrack's account creation, where a new user joins as either a patient or a therapist.",
      ),
      screen(
        "/media/projects/orthotrack/04-notifications.png",
        "OrthoTrack's reminders, prompting a patient to upload their photos before the day ends.",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "The treatment happens at home; the visibility didn't",
        body: [
          "Between appointments, a clinician's only source of truth is what the patient remembers and is willing to report. Compliance is the largest variable in the outcome and the least observable one.",
          "Progress photos made it worse rather than better: taken at inconsistent angles and distances, they cannot be compared to each other, so they show change without showing whether it is real.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Two apps, one record, and a reviewer that never sleeps",
        body: [
          "Patient and clinician need genuinely different products — one is a two-minute daily habit, the other is a review tool — so the account chooses its side at sign-up and the interfaces diverge from there.",
          "The piece that ties them together is reference images. A therapist assigns them; the patient sees them while taking their own photos; and a background job then scores each upload against them with a vision model. A low score alerts both the patient and their therapist, so a human looks sooner rather than at the next appointment.",
        ],
        points: [
          "One account model, two distinct interfaces chosen at sign-up",
          "Therapist-maintained reference images, shown to the patient at capture",
          "Automated scoring of every upload against those references",
          "A low score notifies both sides the same day",
        ],
        media: screen(
          "/media/projects/orthotrack/03-roles.png",
          "Choosing to join OrthoTrack as a patient or as a therapist.",
        ),
      },
      {
        kind: "design",
        title: "A daily list short enough to actually complete",
        body: [
          "The patient's home screen is four tasks and a progress ring — elastics, brushing, a photo, a breathing exercise. It is deliberately finite: a list you can finish is a list you come back to, and the streak is there to reward the habit rather than to punish a missed day.",
          "The clinician's side inverts the priority: patient search first, then a record with photos, compliance and reference images as tabs, so a review takes seconds rather than navigation.",
        ],
        points: [
          "Four daily tasks, completable in about two minutes",
          "Weekly compliance rate and day streak on the same screen as the tasks",
          "Reminders timed to the end of the day, while there is still time to act",
        ],
        media: screen(
          "/media/projects/orthotrack/02-compliance.png",
          "OrthoTrack's compliance view with weekly rate and the day's tasks.",
        ),
      },
      {
        kind: "build",
        title: "Scoring runs behind the request, not inside it",
        body: [
          "Photo review is a background job, not part of the upload. The patient's capture completes immediately; the vision model scores it afterwards against the assigned references, and only a score below threshold pushes a notification. Putting the model in the request path would have made the slowest, least reliable dependency the thing standing between a patient and the one action you need them to take.",
          "The Node.js and MongoDB backend holds patient records, media and the compliance history; Firebase Cloud Messaging carries the alerts.",
        ],
        points: [
          "A background job scores uploads; the capture never waits on the model",
          "Alerts pushed via Firebase Cloud Messaging only below a score threshold",
          "Node.js and MongoDB for patient records, media and compliance history",
          "Clean Architecture with BLoC/Cubit across one Flutter codebase for both sides",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "Compliance is now something you can look at",
        body: [
          "The appointment conversation changes when both sides are looking at the same record rather than negotiating recollections.",
          "The reference-image mechanism turned out to be the load-bearing idea twice over: it is what makes a series of phone photos comparable at all, and it is what gives the scoring something to score against.",
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
    tagline: "One place for a mosque, its members and the businesses around it",
    summary:
      "A multi-role community platform for local Muslim communities: a hub for events and announcements, QR check-ins that earn reward points at your mosque, giving that covers Zakat, Sadaqah and membership in one flow, and a directory connecting members to trusted local businesses.",
    industry: "Community & non-profit",
    productType: "Multi-sided mobile platform",
    whatWeDid:
      "Built the Flutter front end and the Node.js backend behind it, including dynamic QR generation, the points model, Stripe payments and OAuth.",
    outcome:
      "Attendance, membership and giving became one record instead of three. A member checks in with a scan; the mosque sees its community; local businesses reach it through a listing rather than a noticeboard.",
    metrics: [],
    services: [
      "Product Strategy",
      "UX Design",
      "Cross-platform Applications",
      "Backend Systems",
      "APIs",
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
    period: "May — Jul 2026",
    heroMedia: screen(
      "/media/projects/our-ummah/01-home.png",
      "OurUmmah's home: a member's points balance, quick actions to scan, join a mosque or donate, and community partners.",
    ),
    galleryMedia: [
      screen(
        "/media/projects/our-ummah/02-roles.png",
        "OurUmmah's onboarding, where a new account joins as a mosque, a member or a community partner.",
      ),
      screen(
        "/media/projects/our-ummah/03-donations.png",
        "OurUmmah's giving flow, covering Zakat, Sadaqah, mosque membership and project donations.",
      ),
      screen(
        "/media/projects/our-ummah/04-qr.png",
        "A mosque's check-in QR code, which members scan to register attendance and earn points.",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Three groups, three sets of records, none of them shared",
        body: [
          "A mosque knows who has paid. A member knows how often they attend. A local business that wants to support the community has no route to it beyond a poster on a wall. None of these three had a shared surface.",
          "Membership fees and seasonal giving were handled by cash, transfer and reminder, which is workable at small scale and stops being workable the moment it grows.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Model all three sides from the first screen",
        body: [
          "The very first decision in onboarding is which of the three you are — mosque, member, or community partner. Retrofitting a second audience onto a product built for one is expensive, and this product had three from the start.",
          "Attendance is the connective tissue: the mosque displays a dynamically generated QR code, the member scans it, and that single event feeds reward points, membership standing and the mosque's own view of its community.",
        ],
        points: [
          "Three account types, chosen at sign-up, each with its own surfaces",
          "Dynamic QR check-in as the shared event linking attendance and points",
          "A community hub carrying local events, services and announcements",
          "A member directory for managing community connections",
        ],
        media: screen(
          "/media/projects/our-ummah/02-roles.png",
          "Joining OurUmmah as a mosque, a member or a community partner.",
        ),
      },
      {
        kind: "design",
        title: "Explain the mechanism, in plain language, on the screen",
        body: [
          "A points system that converts into a real financial benefit has to state its own rules where people can see them — how many points, what they cover, and what happens if the target is not reached. That explanation sits on the home screen rather than in a help page.",
          "The rest of the interface is three quick actions and a partner list. There is very little to learn, which matters for an audience that spans every level of comfort with an app.",
        ],
        points: [
          "The points model explained in full on the screen that shows the balance",
          "Three quick actions — scan, join, donate — and nothing competing with them",
          "Giving named the way the community names it: Zakat, Sadaqah, membership",
        ],
        media: screen(
          "/media/projects/our-ummah/03-donations.png",
          "OurUmmah's giving categories.",
        ),
      },
      {
        kind: "build",
        title: "Money, identity and QR codes, handled properly",
        body: [
          "Payments run through Stripe and identity through OAuth. For a product handling Zakat and mosque memberships, neither was a place to improvise — the money is donated in trust, and the trust is the product.",
          "Check-in codes are generated on the fly per mosque rather than printed once, so a code that leaks stops working without anyone's membership being touched.",
        ],
        points: [
          "Stripe for donations, Zakat, Sadaqah and membership payments",
          "OAuth for authentication",
          "Dynamic, per-mosque QR generation rather than a static printed code",
          "Node.js and MongoDB handling the relational data and real-time updates",
        ],
        media: screen(
          "/media/projects/our-ummah/04-qr.png",
          "A dynamically generated mosque check-in QR code in OurUmmah.",
        ),
      },
      {
        kind: "result",
        title: "One record the whole community can see its own part of",
        body: [
          "Attendance, membership and giving are now the same system, which is what makes any of them reportable.",
          "The partner side gives mosques a funding route that does not depend on asking the same members for more — which was the part that made the model work.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: false,
  },
];
