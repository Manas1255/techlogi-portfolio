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

### Dependencies added

None yet. The scaffold already ships Zod, RHF, Tailwind v4, Radix, lucide, sonner. Motion is
CSS + `IntersectionObserver` + the Web Animations API — §9 of the brief explicitly rules out
adding an animation framework to fade and translate things. Each addition, if any, gets a line here.

---

## Phases

- [x] **Phase 0** — inspect `jinn-web`, scaffold, verify a known-good baseline, commit
- [x] **Phase 1** — research: patterns worth taking, patterns to reject (`docs/DESIGN-DIRECTION.md`)
- [x] **Phase 2** — design thesis and positioning language (`docs/DESIGN-DIRECTION.md`)
- [ ] **Phase 3** — token + primitive layer (type scale, surfaces, motion, media frames)
- [ ] **Phase 4** — IA, routes, content model
- [ ] **Phase 5** — sections: nav, hero, inquiry, showreel, portfolio, services, process, tech, proof, close, footer
- [ ] **Phase 6** — case study architecture
- [ ] **Phase 7** — responsive refinement
- [ ] **Phase 8** — QA (verify, build, doctor, sweep, content stress)
- [ ] **Phase 9** — visual refinement pass
- [ ] **Phase 10** — completion summary

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
