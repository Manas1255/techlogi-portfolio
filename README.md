# Techlogi

Techlogi — product engineering studio building web apps, SaaS platforms, mobile apps and AI products.
Scaffolded with [jinn-web](https://github.com/jinn-tea/web-cli) — Next.js 16 App Router,
role-first features, BFF cookie auth, React Query, Zod, Tailwind v4 tokens, shadcn/ui, typed i18n.

Read **[CLAUDE.md](./CLAUDE.md)** before adding code — it's the architecture contract.

## Getting started

```bash
cp .env.example .env.local     # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

## Commands

```bash
npm run dev         # dev server
npm run build       # production build + full typecheck
npm run verify      # typecheck + lint + unit tests
npm run sweep       # Playwright sweep (layout, a11y, auth, forms)
```

## Generating code

```bash
jinn-web domain <name> --role undefined   # a full CRUD domain, wired end to end
jinn-web role <name>                    # add a role; the compiler lists what to update
jinn-web add-locale <code>              # add a language
jinn-web doctor                         # check the wiring stayed intact
```

## Features

This app has no roles, so features live flat under `src/features/<domain>/`.

If you add one later, `jinn-web role <name>` migrates the project: it moves existing features to
`features/common/`, rewrites their imports, and adds the role plumbing.

## Locales

- `en` (source — add new keys here first)Every user-facing string goes through `t("...")`. There are no hardcoded display strings.
