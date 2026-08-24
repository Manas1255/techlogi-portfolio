# Techlogi

The flagship site for Techlogi, a product engineering studio.

Scaffolded with [jinn-web](https://github.com/jinn-tea/web-cli) — Next.js 16 App Router (Turbopack),
TypeScript strict, Tailwind v4 tokens, shadcn/ui, React Query, Zod, typed i18n, Vitest + Playwright.

- **[CLAUDE.md](./CLAUDE.md)** — the architecture contract. Read it before adding code.
- **[docs/BUILD-PLAN.md](./docs/BUILD-PLAN.md)** — what was built, the deviations from the scaffold
  and why, and what QA found.
- **[docs/DESIGN-DIRECTION.md](./docs/DESIGN-DIRECTION.md)** — the thesis, the palette, the type
  system, the motion rules, and what was deliberately rejected.

## Getting started

```bash
cp .env.example .env.local     # NEXT_PUBLIC_SITE_URL, and NEXT_PUBLIC_API_URL if you wire the form
npm run dev
```

Visit `/design-system` in development for the living token, type and component reference. It is
`notFound()` in production.

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build + full typecheck
npm run start        # serve the production build
npm run verify       # typecheck + lint + unit tests — the floor before committing
npm run typecheck    # tsc --noEmit
npm run lint         # eslint, including the architecture guardrails
npm run test         # vitest (content schemas, formatters, pure logic)
npm run sweep        # Playwright: layout, a11y, navigation, the inquiry flow, reduced motion
npm run format       # prettier
jinn-web doctor      # architectural wiring: routes, query keys, nav, endpoints, catalogs
```

## Where things live

```
src/
├── app/(app)/           # the public routes: /, /work, /work/[slug], /services, /about, /contact
├── content/             # AUTHORED CONTENT — projects, services, process, stack, testimonials
├── config/site.ts       # company facts: contact, socials, locations, the inquiry endpoint
├── components/
│   ├── marketing/       # presentation primitives (Section, Reveal, Eyebrow, ChoiceCards…)
│   ├── media/           # MediaFrame, AutoVideo, and the synthetic interface compositions
│   ├── sections/        # page sections — may compose features
│   ├── layout/          # header, footer, mobile nav, structured data
│   ├── shared/ ui/ form/ # the scaffold's component catalog
├── features/inquiry/    # the project inquiry: store, schema, repository, drawer
└── app/globals.css      # EVERY design token. No component hardcodes a colour or a size.
```

## Replacing the placeholder content

Everything a human must replace is greppable:

```bash
grep -rn "PLACEHOLDER\|TODO:" src/
```

- **Projects** — `src/content/projects.ts`. Edit the entry, set `isPlaceholder: false`, and the
  illustrative-case-study notice disappears on its own.
- **Real media** — drop files in `public/media/projects/<slug>/` and change a media entry's `kind`
  from `"synthetic"` to `"image"` or `"video"`. No markup changes.
- **Testimonials** — `src/content/testimonials.ts`. Only publish quotes approved in writing.
- **Company facts** — `src/config/site.ts`: email, phone, locations, social links, legal links.
- **The inquiry endpoint** — `siteConfig.inquiry.endpoint`. Until it is set, the form takes a
  logged mock-success path so the whole experience is exercisable. The payload it sends is
  documented in `src/features/inquiry/models/inquiry.model.ts`.

## Generating code

```bash
jinn-web domain <name>       # a full CRUD domain, wired end to end
jinn-web component <name>    # a component at the right layering tier
jinn-web add-locale <code>   # a language, seeded from the source catalog
```
