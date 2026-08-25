@AGENTS.md

# GA Studio

A marketing site for a product engineering studio. Next.js 16 App Router, React 19, TypeScript
strict, Tailwind v4, shadcn/ui. Scaffolded with `jinn-web` and then deliberately reshaped: the
scaffold builds an authenticated dashboard app, and this is a public, almost entirely static site.

Read this before changing anything. The traps below are not hypothetical. Every one of them shipped
at least once, cost real time, and was invisible to `tsc` and to ESLint.

---

## 1. Read this first: what has actually gone wrong here

### Verify in a PRODUCTION build, not `next dev`

`npm run dev` hides a whole class of defect: streaming boundaries that drop content from the
prerendered HTML, routes that turn out to be client-only, CSS that does not ship. The Playwright
sweep therefore boots `npm run build && npm run start` and costs a build per run. That is the
correct price. Do not "optimise" it back to the dev server.

### `pkill -f "next start"` does not kill the server

Once running, the process is named **`next-server`**. Kill by name and the old one survives, the new
one dies with `EADDRINUSE`, and you spend an hour testing a stale build believing it is current.
This happened three times in one session, once producing a completely unstyled page that looked
like a catastrophic CSS bug and was a zombie process.

**Always use `npm run serve`** (`scripts/serve-prod.sh`). It kills by port, waits for the socket to
be released, and confirms readiness before returning.

### Font variables belong on `<html>`, never `<body>`

`globals.css` applies `font-sans` to the `html` element. Custom properties inherit **downward
only**, so variables set on `<body>` are undefined where `--font-sans` is read; it resolves to
nothing and **every paragraph on the site falls back to Times New Roman**.

The display face keeps working, because headings live inside `<body>`. That is what makes this
survive review: headings look right in every screenshot, so serif body copy reads as a design
choice rather than a failure.

### A client hook cannot know the locale during server rendering

`useTranslations` read the language from the Zustand store, which an effect
fills **after** hydration. So every Client Component on `/de` rendered ENGLISH
into the prerendered HTML and swapped to German once JS ran. A visitor saw a
flash; a crawler saw an English page at a German URL, which is the one thing
routing the locale was supposed to prevent.

**Read the locale from `usePathname`**, which is available during server
rendering. `useTranslations`, `AppLink` and `useContent` all do. The store
survives only for `getLocale()`, called from non-React code. A sweep test
asserts the SERVED markup, because `getByText` passes either way.

### An unprefixed `href` does not 404, it changes language

`/work` is a 307 to `/en/work`. The redirect **succeeds**, so nothing breaks,
nothing fails to build, and no type is wrong. The only symptom is that a German
reader lands back in English. Every internal link goes through
`components/layout/app-link.tsx`, imported **as `Link`**, so call sites keep
writing `href={APP_ROUTES.work}`. A sweep test walks `/de` and fails on any
href that is not `/de`-prefixed.

### A server-rendered inline style cannot know `prefers-reduced-motion`

Framer Motion writes `opacity: 0` into the prerendered HTML for a `whileInView`
entrance. A reduced-motion visitor hydrates with `initial={false}`, which
correctly animates nothing, **including that inline zero**, so every staggered
item below the fold stays invisible forever. `useReducedMotion` cannot fix it:
the server has to assume motion is allowed.

The guarantee lives in CSS. Every staggered element carries `data-stagger-item`
and `globals.css` forces it back to `opacity: 1 !important` under the query, the
same way `[data-reveal]` is handled. **On this site, reduced motion means
nothing is ever hidden**, in either motion system. A sweep test asserts both.

### Next REPLACES `openGraph`, it does not merge it

Top-level metadata merges down the tree. `openGraph` does not: the moment a page
declared its own, it dropped the layout's `images`, and every route shipped an
Open Graph card with **no picture**. Nothing failed. The pages built, rendered
and passed every other test; the only symptom was a blank preview when someone
pasted a link into Slack.

`lib/page-metadata.ts` therefore sets `metadataBase`, `openGraph.images` and
`twitter` on every page rather than inheriting any of them. A sweep test asserts
an absolute `og:image` on all four route shapes.

### `useSearchParams` inside a Suspense boundary deletes the boundary from the HTML

`/work` read its filter with `useQueryState`. Next then dropped the **entire** Suspense boundary
from the prerendered output: the portfolio index served no `<h1>` and not one project name to a
crawler, and refilled on hydration for **0.56 CLS** against a 0.1 budget.

Read query params on the **server** (`searchParams` in the page) and make filters **links**. A
sweep test asserts the served HTML contains project names; do not delete it.

### The countdown must never restart

The five-minute offer is real, so its clock starts **once per visitor** and is
persisted to `localStorage` (not `sessionStorage`, which would silently hand
every returning visitor a fresh five minutes). When it expires it says so and
offers nothing in its place. A timer that resets is the single most
recognisable dark pattern on the web, and a visitor who catches it stops
believing the case studies too. See `features/booking/offer-store.ts`.

### Every form field id must come from `useId`

Field components used to derive the input `id` from the field **name**. The moment two forms shared
a page there were two `id="description"` nodes, and every `label[for]` bound to whichever the
browser met first, so **a label in one form operated a control in the other**. There is a
duplicate-id sweep test.

### `event.currentTarget` is null inside a state updater

A state updater runs during a later render, by which point React has cleared the event. Reading
`event.currentTarget.open` in there threw and took the whole page to the error boundary on the first
click. **Read the element synchronously, then call `setState`.**

### A centred flex parent shrink-wraps, so `w-full` children collapse to zero

Device frames rendered at zero width because the figure centres its children, which shrink-wraps the
wrapper, and the shell inside sizes itself with `w-full`. Give any such wrapper a **definite width**
at every breakpoint. `w-auto` is not one.

### `overflow-x: clip`, never `hidden`

`overflow-x: hidden` computes `overflow-y` to `auto`, which turns the element into a scroll
container and silently breaks `position: sticky`, smooth anchor scrolling, and scroll-driven
animation. `clip` creates no scroll container.

### A `clamp()` with a pure `vw` middle term freezes at zoom

Browsers do not scale viewport units when the user zooms, so `clamp(2rem, 6vw, 4rem)` cannot reach
200% and fails **WCAG 1.4.4**. Every fluid size here has a `rem` component in the middle term
(`clamp(2.5rem, 2rem + 2.5vw, 4.25rem)`). Keep it that way, and keep max/min under about 2.5x.

### Motion you cannot perceive is just battery

The capability diagrams once drifted **4.93px over 7 seconds**, which reads as completely static.
Measure real pixel travel with a browser before believing an animation works. A screenshot cannot
show a loop, so a screenshot cannot confirm one.

---

## 2. Commands

```bash
npm run dev       # dev server (Turbopack)
npm run serve     # build output on :3200, killing any zombie first. USE THIS.
npm run build     # production build + full typecheck
npm run verify    # typecheck + lint + unit tests. The floor, not the finish line.
npm run sweep     # Playwright: builds, serves, then drives every route
npm run format    # prettier
jinn-web doctor   # routes, query keys, nav, endpoints, catalogs still wired
npm audit --omit=dev
```

**Definition of done:** `verify` passes, `sweep` passes, and **you opened the page and looked at
it**. A green typecheck says nothing about whether a section renders, whether motion is visible, or
whether a long string shears the layout.

---

## 3. Non-negotiable: honesty rules

This site's entire argument is that a careful team made it. These rules are what make that credible,
and they have held through every change so far.

- **Never invent a metric, a testimonial, a client name, a logo, an award, a headcount, or an
  office.** Not as a placeholder that looks real, not "for now".
- **A config value must never end up inside a sentence.** `siteConfig` holds deployment facts: a
  link, an address, a key, a number. The moment one is interpolated into copy it cannot be
  translated, and the German page printed "Gilt für your first project invoice." Copy belongs in the
  catalogs, even when it looks like configuration (`offer.appliesTo`, `contact.responseTime`).
- **Every mark on the product strip is a real app icon**, lifted from that product's own Flutter
  repository. Nothing there was drawn for this website and nothing may be: a fabricated mark is
  indistinguishable from a real one to a visitor and instantly obvious to anyone who knows the
  client, and the moment one is invented the other six stop counting. A unit test asserts the file
  exists; a sweep test asserts the browser decoded it.
- **The five-minute discount is real.** Anyone who books inside the window gets it. If that ever
  stops being true, delete the section rather than keeping the clock.
- **Confidentiality copy claims no certification, encryption standard or legal guarantee**, because
  an unbacked security claim is worse than silence. "Happy to sign your NDA" is the strongest item
  on that list precisely because it is a concrete offer.
- `metrics` is **empty** on every project. No number ships until someone can point at where it was
  measured.
- Unverified content carries a flag (`isDraft`, `isPlaceholder`) and the UI **says so on the page**.
  When real content replaces it, flip the flag and the notice disappears on its own.
- Nothing links to a page that does not exist. Legal entries carry `published: false` and stay out
  of the footer until written. **A privacy policy is legally required** before launch: the inquiry
  form collects a name, an email and an optional phone number.
- Every capability chip names a technology **actually shipped**, traceable to a project.
- Every placeholder is greppable: `grep -rn "PLACEHOLDER\|TODO:" src/`

---

## 4. House style

- **No em dashes.** Anywhere: copy, comments, commit messages, chat. They read as generated text.
  Restructure the sentence, or use a comma, a colon, or a full stop. An en dash in a numeric range
  (`$5k - $10k`) is fine and is not the same mark.
- **No `Co-Authored-By` trailers** and no "Generated with" footers on commits or PRs.
- Commit messages explain **why**, and name the bug when there was one.

---

## 5. Architecture

```
src/
├── app/[locale]/(app)/   # the public routes, TWICE: /en/… and /de/…
├── proxy.ts              # locale negotiation: cookie, then Accept-Language
├── content/              # AUTHORED CONTENT. Zod schemas + typed data. See below.
├── config/site.ts        # company facts: contact, socials, booking, inquiry endpoint
├── components/
│   ├── marketing/        # presentation primitives. May NOT import features/
│   ├── media/            # MediaFrame, AutoVideo, synthetic compositions
│   ├── sections/         # page sections. MAY compose features
│   ├── layout/           # header, footer, mobile nav, structured data
│   ├── ui/               # shadcn output. Restyle via tokens, never fork
│   ├── shared/ form/     # the scaffold's component catalog
├── features/booking/     # THE primary conversion path: Cal.com, offer clock, trust
│   ├── inquiry/          # the secondary path: store, schema, repository, brief dialog
├── hooks/                # use-reveal-on-scroll, use-onstage, use-scroll-position
└── app/globals.css       # EVERY design token. No component hardcodes a colour or size.
```

**Deviations from the scaffold**, all deliberate: auth, roles, the app shell, `proxy.ts` and the
session route handlers are **gone** (a login redirect on a public marketing site is a bug, not a
convention). `src/content/` is a new cross-cutting layer, because portfolio copy is authored content
rather than wire data. `constants/routes.ts` is hand-edited, because `jinn-web domain` emits a
backend-coupled CRUD screen, which is the wrong artifact for `/work/[slug]`.

### Two languages, and where each kind of string lives

`/en/work` and `/de/work` are separate, prerendered, indexable documents. The
locale is a route segment above the root layout, so `next/root-params` gives
any Server Component the active language with no prop drilling.

**German is the DEFAULT, English is the SOURCE, and they are two different
constants.** `DEFAULT_LOCALE` (de) is what an unprefixed URL resolves to, what
`x-default` points at, and which URL the sitemap prioritises. `SOURCE_LOCALE`
(en) is what `messages/en.ts` defines the shape against and what every lookup
falls back to. Reordering `SUPPORTED_LOCALES` to change the default would have
silently moved the type system's source of truth with it.

**German is served unconditionally.** `Accept-Language` is deliberately NOT
consulted: nearly every browser ships `en-US` whatever its owner reads, so
honouring it sent most visitors, German ones included, to the English site. The
only thing that overrides the default is the `locale` cookie, because it is the
only signal that is a decision rather than a setting. The q-value parser is
still in `proxy.ts`, unused, because "respect the browser again" is a call that
gets reversed more than once in a site's life.

**Two stores of text, and the split is deliberate:**

| | `src/i18n/messages/` | `src/content/` |
|---|---|---|
| holds | interface text | authored prose |
| keyed | `t("hero.lead")` | beside the thing it describes |
| shape | one file per locale | `l("English", "Deutsch")` inline |

A case study is a thousand words of argument and belongs next to its project,
not under `projects.zyuela.sections.2.body.1`. So content carries every
language at once, and the accessors flatten one out before anything renders:

- **Server**: `getContent(await getLocale())`, memoised per locale.
- **Client**: `useContent()`, which reads the path.

`RawProject` is as authored; `Project` is `Resolved<RawProject>`, every
`Localized` collapsed to a `string`. That is why localising the content layer
changed almost no component: `project.tagline` is still a string.

Adding a locale to `SUPPORTED_LOCALES` makes every untranslated entry in the
repo a **compile error**. There is no silent fallback to English, because a
half-translated page is worse than an English one: the reader cannot tell
whether the missing part is an oversight or a different offer. A unit test also
flags any long string that reads identically in both languages, which is how a
copy-paste-to-satisfy-the-type-checker gets caught.

### Content is data, never markup

`src/content/` holds the Zod schemas **and** the data, with every type as `z.infer`. Nothing parses
at render time; `content.test.ts` parses every entry instead, so a malformed project fails
`npm run verify` rather than a page.

Adding a project is a data edit plus media in `public/media/projects/<slug>/`. Routes, the home-page
selection, `/work` filters, related-project links and the sitemap all derive from it.

**Never pin a test to a sentence of copy.** A regression guard that fails on an ordinary headline
edit is a guard people delete. Assert the property instead: project *names* on `/work`, German
*function words and umlauts* on `/de`, not the paragraph that happened to be there when it was
written.

An **image declares `width`/`height`** and the frame reserves its box from the intrinsic size.
`aspect` is only for synthetic and video media, which have no intrinsic size. Making an author
restate a picture's ratio is only a chance to get it wrong.

**Every project hero must be a 4:3 landscape composite**, and a content test enforces it. The cards
render at 4:3 with `cover`, so a hero of any other shape either loses a corner of a composed frame
(the wordmark sits in one, the device in the other) or gains pale letterbox bars that read as a
rendering fault. Fix the ratio at the SOURCE, where a human can see what is being cropped, not in
the component.

**The masters live in `~/Personal/MockUps/<project>/`**, and the `Vector*.png` in each folder is the
brand frame that becomes `01-brand`. Take them at their native 4:3 rather than cropping a 16:9 one:
cropping Zyuela's sliced its own wordmark off, which is the kind of thing only a person looking at
the picture will catch.

Two tests bracket the media: one fails if a referenced file is missing, the other if a file in
`public/media/projects/` is referenced by nothing. The second catches the leftover from a swap,
which ships and caches forever without appearing on a page.

⚠️ **`next build` caches optimised images by URL.** Replacing a file without renaming it serves the
OLD picture from `.next/cache/images` and everything looks broken-but-green. `rm -rf .next` after
swapping media.

---

## 6. Design system

**Light-first on a true white canvas.** Not cream: warm off-white is the default an image generator
reaches for, and it drags every screenshot toward the same sand cast, which is fatal when the
product work has to supply its own colour.

- Surfaces flip per section with `data-surface="slab"` (dark), `"tint"` (stone) or `"paper"`. Every
  colour token is re-declared for the subtree, so children including shadcn primitives adapt without
  knowing where they landed. **Two dark bands on the home page, not five**, and no two adjacent
  sections share a ground. A sweep test asserts it.
- **GRAPHITE & BRASS.** Cool neutral structure, and the accent is the only warm thing in the system.
  It was drawn from the portfolio rather than imposed on it: four of the seven shipped app icons are
  gold or amber, so brass is the colour these products already had in common.
- `--primary` is `brand-700` on paper (5.6:1 on white) and `brand-400` on slab, where the type on top
  flips to **ink, not white**. White on `brand-600` is 3.6:1 and fails AA at label sizes.
- Every route opens on the ink ground. The header therefore declares `data-surface="slab"` while it
  is at the top and drops it once it detaches into the light glass capsule.
- Type: **Familjen Grotesk** (display), **Figtree** (body), **JetBrains Mono** (metadata).
- **Never hardcode a hex.** Add or adjust a token in `globals.css`.

### Motion

**Two systems, and the split is deliberate.**

`Reveal` is CSS plus one shared `IntersectionObserver`. It costs a ref, it works on
server-rendered children, and it is right for the ~90% of entrances that are "one block fades up".
Four durations, two easings, all in tokens. Only `transform`, `opacity`, `clip-path` and
`background-color` are ever animated. `prefers-reduced-motion` resolves every duration to `1ms` **at
the token level**, so a pattern added later inherits the behaviour for free.

The **marquee** is CSS too, and its three traps are all counter-intuitive. It repeats the product
set SIX times because the reset translates by exactly `-50%`, so the loop only looks seamless while
half the track is at least as wide as the viewport; two copies is what everyone writes first and it
gaps on anything bigger than a laptop. Its container is `overflow-x: auto`, not `clip`, so the row
stays draggable and the tiles are never content nobody can reach. And only the first copy is real:
the rest are `aria-hidden` with unfocusable links, or a keyboard user meets the same six links six
times. Do not put a second `overflow-hidden` on the section around it.

`Stagger` / `StaggerItem` is Framer Motion, and only for a ROW whose items arrive in sequence, where
each delay depends on position among siblings. Doing that in CSS means threading an index into a
custom property at every call site, which stops scaling the moment a list is filtered. Reach for
`Reveal` first; this is the exception, not the upgrade. See the reduced-motion trap in section 1.

Two attributes that are easy to confuse and do opposite jobs:

- **`data-revealed`** fires **once** and stays. For entrances.
- **`data-onstage`** toggles **both ways** as an element enters and leaves. For **loops**, and the
  product marquee is the expensive one: it composites a 6000px layer, so it must stop offstage. Six
  diagrams compositing forever while the reader is three screens away costs real battery and shows
  up in no synthetic test. The sweep asserts the OFF direction specifically, because the ON
  direction failing is visible and the OFF direction failing is not.

The reveal CSS is gated on `data-motion="on"`, set by an inline script before first paint, so with
no JS nothing is ever hidden.

---

## 7. Accessibility floor

Checked by the sweep at 320px through 2560px, and worth keeping:

- No horizontal overflow at any width; no text under 12px.
- Text contrast 4.5:1 (large 3:1) on **both** grounds.
- Tap targets: inline links use the `tap-target` utility, which expands the hit area with a
  transparent pseudo-element on a coarse pointer only, so no box moves and a mouse never gets an
  invisible band swallowing clicks.
- One `<h1>` per page, no skipped heading levels, all three landmarks.
- Every interactive element reachable and operable by keyboard, with a visible focus ring.

---

## 8. Code quality

### TypeScript

- **No `any`** and **no non-null `!`**, both lint errors. Narrow with a type guard, or make the
  type honest. `unknown` plus a guard is almost always the right replacement.
- **No hand-written interface beside a schema.** `z.infer<typeof schema>` only; two declarations of
  one shape drift, and the one that drifts is never the one you're reading.
- **`as` is a smell**, not a tool. The exception is `as const` on literal tables.
- **Discriminated unions over boolean flags.** `{ status: "loading" } | { status: "error"; error }`
  makes the impossible state unrepresentable; `isLoading && isError` invites it.
- Prefer `type` for unions and object shapes; `interface` when something genuinely extends.
- Exported functions get explicit return types. Inference inside a function body is fine; inference
  across a module boundary is how a refactor silently changes a public contract.

### React

- **Never fetch in `useEffect`.** Server state comes from a React Query hook in
  `features/*/services`. An effect that fetches re-races itself, ignores caching, and has no
  cancellation.
- **Derive, don't synchronise.** If a value can be computed from props or query data, compute it
  during render. An effect that copies one piece of state into another is a bug with a delay.
- **`useEffect` is for real subscriptions**: an event listener, a timer, an imperative browser
  API. Each one returns a cleanup.
- **Pages are thin.** A `page.tsx` renders one screen component and nothing else: no data fetching,
  no layout logic, no conditionals.
- **Extract a hook when there is state plus behavior**, not merely to shorten a file. A component
  under ~200 lines with one `useState` is fine as it is.
- Keys are stable ids, never array indexes.
- URL-worthy state (search, sort, filters) belongs in the URL. On this site read it on the
  **server** from `searchParams` and make controls links. The client-side `useTableParams` in the
  shared catalog is unused here, and reaching for it is what broke `/work` (see section 1).

### Naming

| Thing           | Convention                                    | Example                              |
| --------------- | --------------------------------------------- | ------------------------------------ |
| Files & folders | kebab-case                                    | `order-form-dialog.tsx`              |
| Components      | PascalCase, file named after it               | `OrdersScreen` → `orders-screen.tsx` |
| Hooks           | `use-` prefix, one hook per concern           | `use-orders.ts` → `useOrders`        |
| Repositories    | `<domain>.repository.ts`                      | `orders.repository.ts`               |
| Wire models     | `<entity>.model.ts` (singular)                | `order.model.ts`                     |
| Form schemas    | `<domain>.schema.ts`                          | `orders.schema.ts`                   |
| Constants       | `SCREAMING_SNAKE`                             | `DEFAULT_PAGE_SIZE`                  |
| Booleans        | `is` / `has` / `can` prefix                   | `isPending`, `canEdit`               |
| Handlers        | `handleX` in the component, `onX` in the prop | `onSelect={handleSelect}`            |

Say what it is, not what it's made of: `OrdersTable`, not `OrdersDataComponent`.

### Errors

- **Throw typed errors.** `ApiError` (backend said no), `NetworkError` (never arrived),
  `ParseError` (arrived in the wrong shape). Guards: `isApiError`, `isNetworkError`, `isParseError`.
- **Never swallow.** `catch {}` with an empty body deletes the only evidence. If a failure is
  genuinely fine to ignore, say so in a comment explaining why.
- **`console` is banned** outside `lib/reporting.ts`, and lint enforces it. Report through
  `reportError(error, { scope })` so production has one seam to wire.
- Mutations go through `useApiMutation`, which toasts `ApiError.message`, reports, and invalidates.
  Reach past it only for optimistic updates.
- User-facing error text is an i18n key. A raw string in a `catch` block is a bug in two languages.

### Testing

Test the things that are cheap to get wrong and expensive to notice:

- Zod schemas: the boundary cases the backend will eventually send (`null`, missing, wrong type).
- Pure logic: formatters, mappers, permission predicates, anything in `lib/`.
- Hooks with real branching.

Don't unit-test that a component renders its props, and don't mock the whole transport to assert a
repository calls it, because that tests the mock. End-to-end coverage of a critical flow lives in `e2e/`.

### Performance

Correctness first: nearly every perceived slowness here is a waterfall or a missing `staleTime`, not
a render cost.

- Reach for `useMemo`/`useCallback` when a dependency identity actually matters (a memoised child, an
  effect dependency) or the computation is genuinely expensive. Wrapping every function is noise that
  hides the two places it mattered.
- Keep `"use client"` at the leaves. A client boundary high in the tree drags the subtree with it.
- Import icons individually; never re-export a barrel of them.
- Paginate on the server. A table that loads every row works beautifully until the data is real.

### Workflow

- `npm run format` then `npm run verify` before you commit, and **look at the page**.
- `src/components/ui/**` is shadcn output. Restyle via tokens in `globals.css`, don't fork the file.
- Adding a dependency is a decision: check whether `lib/` already does it. Nothing has been added to
  the scaffold so far; motion is CSS plus one shared `IntersectionObserver`.
- `jinn-web doctor` after touching routes, query keys, nav or catalogs.

---

## 9. Open items for a human

- **`siteConfig.booking.calLink`**, the one value that turns the whole site on. Cal.com's
  `username/event-slug`, not a URL. Until it is set, every booking control degrades to the project
  brief and the closing embed renders an honest "scheduling opens shortly" panel. Nothing 404s.
- **Real client proof.** Every testimonial is a marked placeholder; no metric is published. The
  proof rail is built for **vertical video**: add a portrait clip plus poster to a testimonial entry
  and the empty frames become a player, with no layout change.
- **The inquiry endpoint** (`siteConfig.inquiry.endpoint`). Until set, submission takes a logged
  mock-success path. Payload shape: `src/features/inquiry/models/inquiry.model.ts`. It now carries
  `attachments: File[]` with **no client-side type whitelist**, so whatever receives it MUST
  validate the type and content of every file itself.
- **Confirm the product strip.** Four of the seven have written case studies; SMA, Whispering Clouds
  and Yusuf were taken from the same Flutter workspace. Drop any that are not GA Studio's to ship.
- **Privacy and terms pages**, then `published: true` in `siteConfig.legal`.
- **A native German pass.** The German is correct and idiomatic as far as an
  engineer can take it, and it uses Sie throughout; what a native speaker would
  improve is rhythm and the handful of places the English pun does not carry.
- **The domain.** `gastudio.com` is a placeholder in `config/env.ts`.
- **An `/admin` editor** was discussed and deferred. Decided: it lives in this project at `/admin`.
  Still open: where the public site reads content from, media upload, roles, and scope.

`docs/BUILD-PLAN.md` records what was built and why, `docs/DESIGN-DIRECTION.md` the visual
argument, and `docs/techlogi-claude-code-prompt.md` is the original brief, kept verbatim as a
record.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
