# Techlogi — Build Plan

Living document. Updated as the build progresses.

---

## 0. Scaffold: `jinn-web@2.2.0`

### How it was created

```bash
npx jinn-web@2.2.0 create techlogi \
  --app-name "Techlogi" \
  --no-roles \
  --locales en \
  --brand "#E24A1E" \
  --api-url "https://api.techlogi.com" \
  --auth client \
  --pm npm --no-git
```

Then moved into the repo root (which already held `docs/`), `.gitignore` written by hand
(npm strips `.gitignore` from published tarballs, so the CLI's copy never shipped), and
committed untouched as `e4299f3`.

**Known-good baseline before any product code:** `npm run verify` (typecheck + lint +
23 unit tests) and `npm run build` (12 routes) both green.

### What the scaffold actually is

| Concern | Choice |
|---|---|
| Framework | Next.js **16** App Router + Turbopack (`src/app`) — Middleware is renamed **Proxy** (`src/proxy.ts`) |
| Language | TypeScript strict |
| Styling | Tailwind **v4**, all tokens in `src/app/globals.css` (`@theme inline`) |
| UI | shadcn/ui in `src/components/ui` (generated — restyle via tokens, never fork) |
| Shared UI | ~35 components in `src/components/shared` + 11 RHF fields in `src/components/form` |
| Server state | TanStack Query v5 (`features/*/services`) |
| Client state | Zustand + URL state via nuqs |
| Validation | Zod, **both directions** — `features/*/models` (wire) and `features/*/validations` (forms) |
| i18n | In-house typed catalogs, `src/i18n/messages/en.ts`; a missing key is a type error |
| HTTP | `backendClient` (`src/lib/http`) — envelope unwrap, typed `ApiError`/`NetworkError`/`ParseError` |
| Tests | Vitest (unit) + Playwright (`e2e/sweep.spec.ts`) |
| Lint | Architecture guardrails: no `any`, no `!`, no `console`, no raw `fetch`, no `process.env` outside `config/env.ts`, no `../` imports, shared layers may not import `features/`, raised jsx-a11y set |

Conventions I am building **with**: token-only styling, thin `page.tsx` files that render one
screen component, feature folders under `src/features/<domain>/`, `ROUTES` constants instead of
literal paths, `t()` for UI strings, `cn()` for class merging, kebab-case files named after their
default export, explicit return types on exported functions.

### Deviations from the scaffold, and why

The scaffold's shape is an **authenticated dashboard app**. Techlogi's site is a **public
marketing site**. Where those genuinely conflict, the brief's intent wins and the deviation is
recorded here.

1. **Auth, session and the app shell are removed.** `src/proxy.ts` redirected every
   unauthenticated request to `/login` — on a public site that is not a deviation to keep, it is
   a bug. Removed with it: `app/(auth)`, `app/(app)`, `app/api/session`, `features/auth`,
   `features/dashboard`, `lib/auth`, `constants/session.ts`, `components/layout/*`
   (app shell / sidebar / user menu), `components/dev`. §14 of the brief requires unused code to
   go, and a dead login screen on a marketing site is exactly that.
   *Not a one-way door:* re-running `jinn-web` generators or restoring from `e4299f3` brings it back.
2. **Content lives in `src/content/`, not in a feature's `models/`.** The scaffold's `models/`
   means "wire shapes the backend returns". Portfolio and services copy is local, authored
   content. It gets its own cross-cutting layer, with Zod schemas as the single source of truth
   for the shape (`z.infer`, per convention) and a unit test that parses every entry — so a
   malformed project fails `npm run verify`, not the page.
3. **`site.config` is `src/config/site.ts`,** matching the scaffold's `src/config/` home rather
   than a root-level file. Everything a human must replace lives here or in `src/content/`.
4. **`constants/routes.ts` and the locale catalog are hand-edited.** The scaffold reserves these
   for `jinn-web domain`, but that generator emits a backend-coupled CRUD screen — wrong artifact
   for `/work/[slug]`. Routes stay in `ROUTES` so nothing hardcodes a path; `jinn-web doctor`'s
   routes↔pages check still applies and is run in QA.
5. **Typography scale is extended, not replaced.** The scaffold's scale is tuned for data-dense
   desktop UI (14px base, 30px display). Editorial marketing scale utilities are added to the same
   token layer in `globals.css`; no component picks its own sizes.
6. **i18n split.** UI chrome (nav, buttons, form labels, validation, aria labels, states) goes in
   `i18n/messages/en.ts` per convention. Long-form editorial copy — headlines, project narratives,
   case-study prose — lives in the typed content layer, because that *is* the content model the
   brief mandates and duplicating it into a message catalog would give one string two owners.
   A second locale translates content modules alongside catalogs.
7. **The theme is dark-first.** The scaffold shipped a light slate/blue palette with a complete
   but disabled `.dark` block. Techlogi's direction is ink-on-near-black with light "bone"
   sections for rhythm, so the token *values* are rewritten while every token *name* is kept —
   shadcn primitives and the shared catalog keep working untouched. Surface inversion is
   token-scoped per section (`[data-surface]`), not per component.

### Dependencies

**Added: none.** The scaffold already ships Zod, react-hook-form, Tailwind v4, Radix, lucide and
sonner, which covers everything this site needed. Motion is CSS custom properties plus one shared
`IntersectionObserver` — §9 of the brief explicitly rules out adding an animation framework to fade
and translate things, and nothing here needed more than that.

**Removed:**

- `next-themes` — read a theme nobody set. The site is ink-only by design, and the Toaster's
  colours come from tokens either way. `components/ui/sonner.tsx` now passes `theme="dark"`
  directly; that is a deliberate, commented deviation from generated shadcn output.
- `input-otp` and `components/ui/input-otp.tsx` — orphaned when the auth screens went.

**Upgraded:** `next` and `eslint-config-next` `16.2.10 → 16.3.2` (same major). The scaffolded
version carried three high-severity advisories in shipped code (`next`, `postcss`, `sharp`);
`npm audit --omit=dev` now reports zero. The exact pin the scaffold uses was restored after the
bump, and the full gate — verify, build, sweep, doctor — was re-run green on the new version.

---

## Phases

- [x] **Phase 0** — inspect `jinn-web`, scaffold, verify a known-good baseline, commit
- [x] **Phase 1** — research: patterns worth taking, patterns to reject (`docs/DESIGN-DIRECTION.md`)
- [x] **Phase 2** — design thesis and positioning language (`docs/DESIGN-DIRECTION.md`)
- [x] **Phase 3** — token + primitive layer (type scale, surfaces, motion, media frames)
- [x] **Phase 4** — IA, routes, content model
- [x] **Phase 5** — sections: nav, hero, inquiry, showreel, portfolio, services, process, tech, proof, close, footer
- [x] **Phase 6** — case study architecture
- [x] **Phase 7** — responsive refinement
- [x] **Phase 8** — QA (verify, build, doctor, sweep, content stress)
- [x] **Phase 9** — visual refinement pass
- [x] **Phase 10** — completion summary

## What QA actually found

Recorded because the fixes are the interesting part, not the pass:

1. **The inquiry drawer closed instead of showing its success state.** The store's `reset()` also
   cleared `isOpen`, so a successful submit dismissed the drawer and the visitor never saw that it
   worked. Split into `clearDraft()` (keeps it open) and `reset()`.
2. **Synthetic interfaces rendered ~3px text on a phone.** A dense desktop composition scaled to a
   350px frame is a smear. Frames narrower than `40rem` now render the composition at its design
   width and crop it — a legible detail of real software, which is also what a desktop app looks
   like on a phone. The switch is a container query on the frame, not a viewport breakpoint,
   because the same composition appears in a 590px column and a 1560px panel on one screen.
3. **The mobile services rail buried its own content** under six full-width tabs. It is now a
   horizontal snap row above the panel — same DOM, same semantics, different form.
4. **`Start a Project` was hidden below 640px.** "Persistent and always reachable" has to hold on a
   phone; it is now visible at every width.
5. **One composition appeared three times on the home page** (hero, reel, first project panel).
   The reel now starts on the second project and the first panel shows its gallery frame.
6. **A heading skip on `/work`** — panels sat directly under the `h1` as `h3`. `ProjectPanel` now
   takes a heading level.
7. **The error tone was too close to the brand vermilion**; shifted toward crimson so "this failed"
   doesn't read as "this is branded".
8. **The services page eyebrow printed its index twice** ("01 — 01").
9. **Device frames collapsed to zero width.** The figure centres its children, which
   shrink-wrapped the phone shell, so the `w-full` screen inside it had nothing to fill — the
   mobile composition never rendered anywhere it was used. Only visible by looking at the page.
10. **Three sweep false-positive classes** — deliberate media crops, scrollable rails, and Radix's
   `aria-hidden` bubble inputs — were taught to the helpers rather than deleted, because a check
   that cries wolf is a check people stop reading.

An earlier attempt to give the hero the `wide` container was reverted: it fixed a crop at 2560px
and broke alignment with every section below it at 1440px. Consistency won.

## The gate

All of these are green as of the final commit:

```
npm run verify       # typecheck + lint + 59 unit tests
npm run build        # 18 routes, all static or SSG
npm run sweep        # 83 Playwright checks, desktop + mobile
jinn-web doctor      # 6/6 architectural checks
npm audit --omit=dev # 0 vulnerabilities
```

## Portfolio content

The six fictional projects the site was built against have been replaced with **real Techlogi
work**, using real screen captures from `~/Personal/MockUps` (kaprayy deliberately excluded):

| Project | What it is | Stack evidence |
|---|---|---|
| DineKaro | Restaurant discovery and table booking, Lahore | Flutter, Node.js, MongoDB — stated on the client's own mockup |
| Soulmate Society | Values-first relationship app | `soulmate_society` pubspec (Flutter); backend unconfirmed |
| Zyuela | Reflection and wellbeing, no streaks | `zyuela` pubspec (Flutter); backend unconfirmed |
| OrthoTrack | Two-sided orthodontic compliance | `orthotrack` pubspec (Flutter); backend unconfirmed |
| OurUmmah | Mosque membership, check-ins and giving | `islamic_app` pubspec + `our-ummah-backend` (Express, MongoDB, Stripe, S3, JWT) |
| CodeAble HR | Employee attendance, leave and salary | `codeable_hr` pubspec (Flutter); backend unconfirmed |

**What is verified and what is not.** The products, the screens and the stack entries above are
real. The written case studies are **drafts inferred from the products themselves** — every entry
carries `isDraft: true`, and the case-study page says so rather than presenting an unverified
account as fact. `metrics` is empty everywhere: no number ships until someone can point at where it
was measured. Engagement dates are marked `TODO:`.

Media lives in `public/media/projects/<slug>/` — photographic composites as JPEG, UI captures as
PNG, all downscaled (5.9MB total). Two screenshots showing test data (a placeholder email and phone
number) were deliberately left out, as was one file that turned out to be a different app.

### What changed in the code to support it

- **An image now declares `width`/`height` instead of an `aspect`**, and the frame reserves its box
  from the intrinsic size. Making an author restate a picture's ratio is only a chance to get it
  wrong, and a wrong one letterboxes or crops. `aspect` remains required for synthetic and video
  media, which have no intrinsic size.
- **`MediaFrame` takes an `aspectOverride`** for bands that hold different media in one box — the
  showreel, where a jumping block height between clips reads as a bug.
- **The showreel only carries landscape media.** A portrait phone capture letterboxed into a wide
  frame is a worse advertisement than leaving it out.
- **A mobile case study opens on a row of three screens**, not one phone alone in a 1200px column,
  and the gallery below picks up from where that left off.
- **`isPlaceholder` became `isDraft`** on projects. The old flag meant "this engagement is
  invented"; the new one means "this write-up has not been reviewed", which is the honest claim now.
- The synthetic interface compositions are kept: they are the fallback for a project with no
  cleared media yet, and the design-system page documents them.

## Open questions for a human

- Real client names, logos and testimonials — every one on the site is a marked placeholder.
- The inquiry endpoint (`src/config/site.ts`). Until it is set, submission takes a logged mock
  success path.
- Real project media. Placeholder UI compositions live at `public/media/projects/<slug>/`.
- Legal pages (privacy, terms) are linked but not written.

## Decision log

- **Vermilion `#E24A1E`, not blue.** The brief bans the blue-gradient corporate look; the brand
  ramp is CLI-generated in OKLCH from this hex with it landing exactly on `brand-600`, which
  `--primary` points at.
- **`--no-roles`.** A marketing site has one audience; role machinery would be dead weight.
- **`--auth client`.** Fewer route handlers to remove, since auth is being removed entirely.
