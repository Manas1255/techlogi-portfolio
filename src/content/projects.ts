import type { Media, Project } from "./schemas";

/**
 * PORTFOLIO CONTENT — real Techlogi work.
 *
 * ⚠️ READ BEFORE PUBLISHING. Every project below is a real, shipped product and
 * the screens are real captures. What is NOT verified is the written narrative:
 * `caseStudySections` were drafted from the product itself, not from the people
 * who built it, so each entry carries `isDraft: true` and the case-study page
 * says so plainly. Have the engineer or designer who did the work read theirs,
 * correct it, then set `isDraft: false`.
 *
 * Also still to confirm (marked `TODO:` inline):
 *   · engagement dates — `period` is a best guess from the capture dates
 *   · backend/infrastructure for the projects where only the app was inspected
 *   · client names, and whether each client is happy to be named at all
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
    slug: "dinekaro",
    name: "DineKaro",
    tagline: "Restaurant discovery and table booking for Lahore",
    summary:
      "Finding somewhere to eat and actually securing a table were two different problems, solved by two different tools — a feed to browse and a phone call to book. DineKaro puts discovery, restaurant detail and a real reservation with deposit and seating choice into one flow.",
    industry: "Hospitality",
    productType: "Mobile application",
    whatWeDid:
      "Product design and a cross-platform Flutter build on a Node.js and MongoDB backend, covering discovery, restaurant profiles, reservations and payments.",
    outcome:
      "Browsing and booking happen in the same place. A diner moves from a curated collection to a confirmed table with a seating preference and a deposit, without leaving the app.",
    metrics: [],
    services: [
      "Product Design",
      "UX/UI Design",
      "Cross-platform Applications",
      "Backend Systems",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
    categories: ["mobile", "commerce"],
    period: "2026", // TODO: confirm the real engagement dates.
    heroMedia: shot(
      "/media/projects/dinekaro/01-brand.jpg",
      1800,
      1350,
      "DineKaro's home feed: featured collections, tonight's picks and nearby restaurants with ratings and price bands.",
      "(min-width: 1024px) 46vw, 92vw",
      true,
    ),
    galleryMedia: [
      shot(
        "/media/projects/dinekaro/02-discovery.jpg",
        1800,
        1350,
        "DineKaro's discovery surfaces: a personalised home feed, featured collections, tonight's picks, and search with filters.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/dinekaro/03-booking.jpg",
        1800,
        1350,
        "DineKaro's booking flow: branch selection, date and time, guest and seating selection, then deposit and payment.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Discovery and booking lived in different places",
        body: [
          "Deciding where to eat is a browsing problem — collections, photos, price bands, what's good tonight. Securing the table is a transactional one — which branch, what time, how many people, indoor or outdoor, and who pays the deposit.",
          "Most diners were doing the first in one app and the second over the phone, which meant a restaurant's availability was never actually visible at the moment someone was choosing.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "One flow, from a collection to a confirmed table",
        body: [
          "We modelled the restaurant as something with branches, not as a single location — because in practice a diner picks the brand first and the branch second, and availability differs between them.",
          "That decision shaped the whole flow: discovery surfaces the restaurant, the detail screen carries branch-level opening hours and location, and booking starts from the branch the diner has already chosen.",
        ],
        points: [
          "Restaurants modelled with branches, each with its own hours and availability",
          "Curated collections as a first-class discovery surface, not a banner",
          "Reservation state carried through from discovery, so nothing is re-entered",
        ],
        media: shot(
          "/media/projects/dinekaro/04-restaurant.jpg",
          1800,
          1350,
          "A DineKaro restaurant profile: overview, opening hours, branch and location detail, reviews and ratings.",
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: "Photographs do the persuading, structure does the deciding",
        body: [
          "The discovery half of the app is photographic and warm — collections lead with imagery, because that is what a diner is actually responding to at that moment.",
          "The booking half deliberately changes register. It is structured, stepped and legible: branch, date and time, guests and seating, then payment, each a decision on its own so nothing is buried behind a summary.",
        ],
        points: [
          "Two distinct densities in one design system: browse, then book",
          "Every reservation step is a single decision with a visible state",
          "Ratings, price band and cuisine on the card, so a tap is an informed one",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "Cross-platform where the product is genuinely one product",
        body: [
          "DineKaro is the same experience on both platforms, so Flutter was the honest choice rather than a compromise — one codebase, one design system, and platform-specific behaviour only where the platform actually differs.",
          "The backend is Node.js on MongoDB, with the reservation as the unit everything else hangs off: a booking references a branch, a time slot, a party size, a seating preference and a payment.",
        ],
        points: [
          "One Flutter codebase for iOS and Android",
          "Node.js and MongoDB, with the reservation as the core record",
          "Deposit and payment handled inside the booking flow",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "A diner can go from curious to booked without leaving",
        body: [
          "The app closes the gap between deciding and reserving, which was the whole point: the moment of intent and the moment of booking are now the same moment.",
          "The branch model is the piece that carries the most future weight — adding locations, hours or availability rules is data, not a release.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: true,
  },
  {
    slug: "soulmate-society",
    name: "Soulmate Society",
    tagline: "A values-first relationship app built around privacy",
    summary:
      "Most dating products optimise for volume: more profiles, faster swiping, more matches. Soulmate Society is built for the opposite — curated discovery, matching on values rather than proximity alone, and messaging designed so that people share on their own terms.",
    industry: "Social",
    productType: "Mobile application",
    whatWeDid:
      "Brand and product design, and a cross-platform Flutter build covering discovery, values-based matching, favourites and private messaging.",
    outcome:
      "A calmer product than the category default. Discovery is curated rather than endless, a match score is explainable, and the messaging surface is private by construction.",
    metrics: [],
    services: [
      "Product Strategy",
      "UI Design",
      "Design Systems",
      "Cross-platform Applications",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart"], // TODO: confirm the backend and infrastructure.
    categories: ["mobile"],
    period: "2026", // TODO: confirm the real engagement dates.
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
          "Compatibility is presented as a score with something behind it rather than a number that appears by magic. If the product is going to claim two people are a strong match, the claim has to be inspectable.",
          "Discovery is curated and finite. There is a defined set to consider, not an infinite queue — which changes how much attention each profile actually gets.",
        ],
        points: [
          "Values-based matching rather than proximity and photos alone",
          "Curated, finite discovery instead of an endless feed",
          "Privacy-first messaging: people share more as they choose to, not by default",
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
          "Deep navy and gold, a serif display face, generous space — the visual language is closer to a members' club than to a social feed, and that is the point. It sets an expectation about pace before a single interaction happens.",
          "Photography is given room rather than cropped into a grid, and the compatibility badge sits on the image where a decision is actually being made.",
        ],
        points: [
          "A serif-led identity and restrained palette, uncommon in the category",
          "One profile at a time, at a size where it can be read rather than skimmed",
          "Four flat destinations — discovery, favourites, messages, profile",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "One codebase, one design system",
        body: [
          "Built in Flutter so the identity lands identically on both platforms — with a design this specific, per-platform drift would have been visible immediately.",
          "The design system was built before the screens, so the type ramp, the gold accent and the card treatment are defined once and consumed everywhere.",
        ],
        points: [
          "Flutter for iOS and Android from one codebase",
          "Tokens and components defined ahead of the screens",
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
    isDraft: true,
  },
  {
    slug: "zyuela",
    name: "Zyuela",
    tagline: "A reflection and wellbeing app with no streaks to break",
    summary:
      "Wellbeing apps usually motivate through pressure: streaks, badges, a number that resets if you miss a day. Zyuela takes the opposite position — it opens with “You're not lazy” and is built around small, repeatable moments of awareness rather than a record to protect.",
    industry: "Health & wellbeing",
    productType: "Mobile application",
    whatWeDid:
      "Product and brand design, and a cross-platform Flutter build covering reflection, journalling and the daily practice surfaces.",
    outcome:
      "A product whose tone matches its purpose. Nothing in the interface punishes a missed day, and the daily practice is short enough to actually be repeatable.",
    metrics: [],
    services: [
      "Product Discovery",
      "UX Design",
      "UI Design",
      "Cross-platform Applications",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart"], // TODO: confirm the backend and infrastructure.
    categories: ["mobile"],
    period: "2026", // TODO: confirm the real engagement dates.
    heroMedia: shot(
      "/media/projects/zyuela/01-brand.jpg",
      1672,
      941,
      "Zyuela's opening screen, reading “You're not lazy.” against a calm, near-white ground.",
      "(min-width: 1024px) 46vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/zyuela/02-space.jpg",
        1672,
        941,
        "Zyuela's core surfaces: reflection prompts, journalling and daily practice in one place.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
      shot(
        "/media/projects/zyuela/03-reflect.jpg",
        1672,
        941,
        "Zyuela's reflect-understand-move-forward sequence.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Motivation by guilt has a short half-life",
        body: [
          "Streaks work until the first missed day, at which point the mechanic that was driving engagement becomes the reason to delete the app. For a product about self-understanding, that failure mode is not a detail — it contradicts the premise.",
          "The brief was to build something that survives a bad week.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Design the tone first, then the features",
        body: [
          "The product's voice was settled before the feature set. “Small moments of awareness can lead to meaningful change” is not marketing copy bolted on afterwards — it is the constraint every screen was checked against.",
          "That ruled several standard mechanics out immediately: no streak counters, no red states for a missed day, no leaderboard.",
        ],
        points: [
          "Voice and tone defined as a product constraint, not a copy pass",
          "No streaks, no punitive states, no comparison to other people",
          "Every session designed to be completable in a couple of minutes",
        ],
        media: shot(
          "/media/projects/zyuela/02-space.jpg",
          1672,
          941,
          "Zyuela's supportive surfaces: prompts, journalling and daily practice.",
          "(min-width: 1024px) 42vw, 92vw",
        ),
      },
      {
        kind: "design",
        title: "Quiet, warm, and almost entirely typographic",
        body: [
          "A near-white ground, a deep green accent and a serif wordmark — closer to a printed journal than to a fitness tracker. There is very little chrome, because the writing is the product.",
          "Prompts are set large and centred with nothing competing for attention, so the screen asks one thing at a time.",
        ],
        points: [
          "A calm, paper-like palette with a single restrained accent",
          "One prompt per screen, set at reading size",
          "Progress shown as accumulation, never as a record that can break",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "Flutter, with the writing surface as the hard part",
        body: [
          "Most of the engineering attention went where the user spends their time: a text surface that never loses input, restores exactly where it was left, and behaves predictably with the keyboard up.",
          "The rest of the app is deliberately simple, which is what leaves room to get that one surface right.",
        ],
        points: [
          "One Flutter codebase for iOS and Android",
          "Entry drafts preserved across interruption and app restart",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "A product you can come back to after a gap",
        body: [
          "Returning after a week away costs nothing and is acknowledged as normal, which is the behaviour the whole design was aimed at.",
          "The tone is the product's real differentiator, and it is now written down well enough that new features can be checked against it.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: true,
  },
  {
    slug: "orthotrack",
    name: "OrthoTrack",
    tagline: "Orthodontic compliance, from the clinic to the patient's phone",
    summary:
      "Orthodontic outcomes depend on things that happen at home — elastics worn, teeth brushed, photos taken at the right angle. Between appointments a clinician has no visibility of any of it. OrthoTrack gives the patient a short daily checklist and the practice a compliance record it can actually act on.",
    industry: "Healthcare",
    productType: "Two-sided mobile application",
    whatWeDid:
      "Product design and a cross-platform Flutter build for both sides: a patient app with daily tasks and guided photo capture, and a therapist app for patient records, reference poses and compliance review.",
    outcome:
      "What used to be a question asked at the next appointment is now a record. Patients follow a short daily list, and clinicians see the week rather than reconstructing it from memory.",
    metrics: [],
    services: [
      "Product Discovery",
      "UX Design",
      "Cross-platform Applications",
      "APIs",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart"], // TODO: confirm the backend and infrastructure.
    categories: ["mobile"],
    period: "2026", // TODO: confirm the real engagement dates.
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
        title: "Two apps, one record",
        body: [
          "Patient and clinician need genuinely different products — one is a two-minute daily habit, the other is a review tool — so the account chooses its side at sign-up and the interfaces diverge from there.",
          "The piece that ties them together is reference poses: the clinician sets up to four reference images, and the patient sees them while taking their own photos. The comparison problem is solved at capture time rather than afterwards.",
        ],
        points: [
          "One account model, two distinct interfaces chosen at sign-up",
          "Clinician-set reference poses shown during patient capture",
          "Compliance recorded as discrete daily tasks, not a self-reported summary",
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
          "The patient's home screen is four tasks and a progress ring. It is deliberately finite — a list you can finish is a list you come back to.",
          "The clinician's side inverts the priority: patient search first, then a record with photos, compliance and reference poses as tabs, so a review takes seconds rather than navigation.",
        ],
        points: [
          "Four daily tasks, completable in about two minutes",
          "Progress shown as this week's rate, with history kept per day",
          "Reminders timed to the end of the day, when there is still time to act",
        ],
        media: screen(
          "/media/projects/orthotrack/02-compliance.png",
          "OrthoTrack's compliance view with weekly rate and the day's tasks.",
        ),
      },
      {
        kind: "build",
        title: "Photo handling is the engineering problem",
        body: [
          "Everything of consequence in this product is a photo: captured on a phone camera, uploaded on whatever connection the patient has, stored against a date, and later compared with the one before it.",
          "Uploads queue locally and retry, so a capture taken with no signal is not lost — the patient has already done the part that was hard to get them to do.",
        ],
        points: [
          "Queued, retrying uploads so a capture is never lost to a bad connection",
          "Photos stored against a date and a reference pose, so they are comparable",
          "One Flutter codebase serving both sides of the product",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "Compliance is now something you can look at",
        body: [
          "The appointment conversation changes when both sides are looking at the same record rather than negotiating recollections.",
          "The reference-pose mechanism turned out to be the most valuable part: it is what makes a series of phone photos clinically comparable at all.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: true,
    isDraft: true,
  },
  {
    slug: "our-ummah",
    name: "OurUmmah",
    tagline: "Mosque membership, check-ins and giving in one place",
    summary:
      "Mosque communities run on membership fees, donations and attendance that are tracked, if at all, on paper and in someone's head. OurUmmah connects three sides — mosques, members and community partners — around a QR check-in, a points system and structured giving.",
    industry: "Community & non-profit",
    productType: "Multi-sided mobile platform",
    whatWeDid:
      "Product design and a cross-platform Flutter build on a Node.js and MongoDB backend, with QR check-in, a points model, Stripe payments and partner listings.",
    outcome:
      "Attendance, membership and giving became one record instead of three. A member checks in with a scan; the mosque sees its membership; partners reach the community through a listing rather than a noticeboard.",
    metrics: [],
    services: [
      "Product Strategy",
      "UX Design",
      "Cross-platform Applications",
      "Backend Systems",
      "APIs",
    ],
    platforms: ["iOS", "Android"],
    technologies: [
      "Flutter",
      "Dart",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe",
      "AWS S3",
    ],
    categories: ["mobile", "commerce"],
    period: "2026", // TODO: confirm the real engagement dates.
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
        "OurUmmah's giving flow, with donation categories including membership, project donations and community activities.",
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
          "Attendance is the connective tissue: the mosque displays a QR, the member scans it, and that single event feeds points, membership standing and the mosque's own view of its community.",
        ],
        points: [
          "Three account types, chosen at sign-up, each with its own surfaces",
          "QR check-in as the shared event linking attendance, points and membership",
          "Giving categorised the way communities actually think about it",
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
          "Giving categories named in the community's own vocabulary",
        ],
        media: screen(
          "/media/projects/our-ummah/03-donations.png",
          "OurUmmah's donation categories.",
        ),
      },
      {
        kind: "build",
        title: "Money, identity and files, handled properly",
        body: [
          "Payments run through Stripe, member identity through hashed credentials and signed tokens, and uploaded media through object storage rather than the application server. For a product handling community donations, none of these were places to improvise.",
          "Check-in codes are issued and renewable per mosque, so a code that leaks can be rotated without touching anyone's membership.",
        ],
        points: [
          "Stripe for donations and membership payments",
          "Token-based auth with hashed credentials; rate limiting at the edge",
          "Object storage for uploads, kept off the application server",
          "Renewable per-mosque QR codes",
        ],
        media: screen(
          "/media/projects/our-ummah/04-qr.png",
          "A renewable mosque check-in QR code in OurUmmah.",
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
    isDraft: true,
  },
  {
    slug: "codeable-hr",
    name: "CodeAble HR",
    tagline: "Attendance, leave and payroll visibility for employees",
    summary:
      "HR systems are usually built for the HR team, and employees get whatever is left — a portal they visit twice a year and cannot navigate. CodeAble HR inverts that: the employee app is the product, covering attendance, working hours, leave and salary in a view that answers a question in one glance.",
    industry: "HR technology",
    productType: "SaaS platform",
    whatWeDid:
      "Product design and a cross-platform Flutter application covering attendance and check-ins, leave records, working-hours tracking and salary visibility.",
    outcome:
      "Employees can answer their own questions — how many hours this month, how much leave is left, when did I check in — without opening a ticket with HR.",
    metrics: [],
    services: [
      "Product Design",
      "UX Design",
      "Cross-platform Applications",
      "SaaS Development",
    ],
    platforms: ["iOS", "Android"],
    technologies: ["Flutter", "Dart"], // TODO: confirm the backend and infrastructure.
    categories: ["mobile", "saas"],
    period: "2026", // TODO: confirm the real engagement dates.
    heroMedia: shot(
      "/media/projects/codeable-hr/01-workday.jpg",
      1571,
      1700,
      "CodeAble HR's workday summary: attendance and check-in updates, plus salary and HR support in one view.",
      "(min-width: 1024px) 40vw, 92vw",
    ),
    galleryMedia: [
      shot(
        "/media/projects/codeable-hr/02-attendance.jpg",
        785,
        1700,
        "CodeAble HR's attendance screen: present, absent, late and on-leave counts for the month, with a day-by-day record.",
        "(min-width: 1024px) 24vw, 60vw",
      ),
      shot(
        "/media/projects/codeable-hr/03-dashboard.jpg",
        1024,
        500,
        "CodeAble HR's dashboard, bringing the employee's day into a single view.",
        "(min-width: 1024px) 46vw, 92vw",
      ),
    ],
    video: null,
    testimonial: null,
    caseStudySections: [
      {
        kind: "problem",
        title: "Every simple question went through a person",
        body: [
          "How many hours did I work this month? How much leave do I have left? Was I marked late on the 12th? Each of these is a lookup, and each of them was arriving in HR's inbox.",
          "The data existed. It was just not reachable by the person it was about.",
        ],
        points: [],
        media: null,
      },
      {
        kind: "approach",
        title: "Build the employee's view first",
        body: [
          "We started from the questions employees actually ask, and designed the month summary to answer the four most common ones above the fold: present, absent, late, on leave, plus average hours a day.",
          "Everything else — the day-by-day record, leave history, salary detail — sits one level below that summary rather than competing with it.",
        ],
        points: [
          "The four most-asked questions answered in the first screenful",
          "Day-level detail available, but never the landing view",
          "Leave, attendance and salary in one place instead of three systems",
        ],
        media: shot(
          "/media/projects/codeable-hr/02-attendance.jpg",
          785,
          1700,
          "The monthly attendance summary in CodeAble HR, with filters for present, absent and late.",
          "(min-width: 1024px) 24vw, 60vw",
        ),
      },
      {
        kind: "design",
        title: "A month is a summary, then a list",
        body: [
          "Counts first, coloured by status, with average hours a day underneath. Then a filter row, then the days themselves — each showing check-in, check-out, hours worked and a status pill.",
          "Statuses are their own thing rather than a colour alone: present, half day, late and on leave all read correctly without relying on the reader distinguishing green from orange.",
        ],
        points: [
          "Status carried by a label, not by colour alone",
          "Tabular figures throughout, so times and totals line up",
          "Filters that show their own counts, so an empty state is never a surprise",
        ],
        media: null,
      },
      {
        kind: "build",
        title: "One codebase, an interface an employer can hand out",
        body: [
          "Flutter for both platforms, because the workforce carries whatever phone it carries and the product cannot be better on one of them.",
          "The screens are read-heavy and cache-friendly, so opening the app on a poor connection still answers the question it was opened for.",
        ],
        points: [
          "One Flutter codebase across iOS and Android",
          "Read-heavy screens that stay useful on a poor connection",
        ],
        media: null,
      },
      {
        kind: "result",
        title: "The lookups stopped arriving in HR's inbox",
        body: [
          "Employees answer their own routine questions, which is the entire value: HR's time goes back to the cases that genuinely need a person.",
          "The attendance model underneath is the reusable part — the same records drive the employee view, the manager view and payroll.",
        ],
        points: [],
        media: null,
      },
    ],
    featured: false,
    isDraft: true,
  },
];
