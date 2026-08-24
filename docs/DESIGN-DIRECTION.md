# Techlogi — Design Direction

## The thesis

> **Techlogi is a product company that takes contracts. The site should read like the changelog of
> a team that ships — evidence first, adjectives last — not the brochure of a vendor that bids.**

Every decision below answers to that sentence. The test for any element: *does this make the work
more legible, or does it decorate the page?* If the second, it is deleted.

Three consequences the thesis forces:

1. **The product work is the art direction.** The site's visual interest comes from real interface
   compositions — dashboards, mobile screens, AI workflows — framed carefully. There is no abstract
   artwork, no floating geometry, no gradient mesh doing a job that a screenshot of working software
   does better.
2. **Precision reads as competence.** Tight optical alignment, tabular figures, monospace metadata,
   restrained motion. A studio that sweats a 1px baseline is one you trust with a migration.
3. **Honesty is a differentiator.** Unverified numbers are labelled as illustrative rather than
   quietly implied. An agency site that admits which figures are placeholders reads more credible
   than one claiming "300% growth" with no source.

---

## Phase 1 — what the field does, and what I took from it

Studied recent work from product studios and engineering-led agencies (Basement, Locomotive,
Instrument, Work & Co, Ueno-lineage studios, Vercel/Linear/Stripe-class product marketing, and
Awwwards-tier studio sites from the last few years). What follows is the mechanic, why it works,
and the decision.

### Taken, conceptually

| Mechanic | Why it works | How Techlogi uses it |
|---|---|---|
| **Sticky project metadata against a scrolling media column** | Separates *what this is* from *what it looks like*, so a scanner and a reader are both served by one section. | Case-study hero and the `/work` index: the left rail pins name / industry / services / stack while media scrolls past it. |
| **Editorial type as the primary graphic** | A studio confident in its work doesn't need ornament; scale and weight contrast alone build hierarchy and feel expensive. | A 4-step display scale topping out at ~clamp(3.5rem, 9vw, 7.5rem), tight negative tracking, mixed weights inside one headline. |
| **Full-bleed alternating project panels** | Escapes the card-grid trap; each project gets to be a composition rather than a thumbnail. | `/work` alternates media-left / media-right with different aspect ratios and a full-bleed panel every third entry. |
| **Hover- or focus-triggered interface video** | Software behaving like software is the only proof that matters, and it costs nothing until intent is shown. | `AutoVideo` inside `MediaFrame` — muted, `playsinline`, IntersectionObserver-paused, poster always present, static fallback under reduced motion. |
| **Progressive, low-friction inquiry as step one** | A single low-effort choice converts far better than a 9-field form, and it feels like using a product. | "What would you like to build?" as eight one-tap choices in a persistent drawer, then progressive disclosure. |
| **Monospace labels for metadata** | Signals engineering without a single code screenshot; gives small text a job and a rhythm. | Eyebrows, project indices, stack lists, step counters, footnotes. |
| **A header that detaches into a capsule** | Past the fold the bar contracts to a centred pill of warm glass, so the page scrolls *underneath* the chrome instead of past a bar welded to the top. One continuous morph — every property that changes lives on the same element — rather than a bar swapping itself for a different bar. | `SiteHeader`: `fixed`, outer padding opens, `max-width` contracts, radius goes full, height drops, `.capsule-glass` supplies the blur. All CSS transitions, so `motion-reduce:transition-none` turns it off. |
| **The form IS the hero** | A visitor is at their most willing in the first seconds and least willing to be routed elsewhere. A hero whose primary action is "go to a contact page" spends that willingness on navigation. | Four fields on the hero — what you're building, name, email, an optional note — submitting through the same repository as the four-step drawer. One implementation of "send an inquiry", two depths of it. |
| **Surface inversion as section punctuation** | Alternating ink and paper gives a long page chapters, and makes the eye re-engage at each boundary. | Token-scoped `[data-surface="ink" \| "bone"]` — a section flips the palette and every child adapts. |
| **A horizontal capability rail** | Compresses a long service list into something explorable instead of a wall of bullets. | Services: sticky group labels against expanding capability panels, keyboard- and touch-driven. |

### Deliberately rejected

- **A hero showreel as the largest contentful element.** Cinematic, and it puts a multi-megabyte
  video on the critical path. Techlogi's hero paints text and a poster frame first; motion arrives
  after.
- **Custom cursors and cursor-follow blobs.** They read as portfolio-site flourish, break on touch,
  and fight the product screenshots for attention.
- **Scroll-jacked horizontal sections.** Attractive in a case-study video, hostile on a trackpad and
  unusable with a keyboard. Horizontal galleries here scroll natively with snap points.
- **Page-transition loaders that gate content.** A 900ms curtain to hide a route change is a
  latency tax charged for style.
- **A logo wall.** With no real client permissions it would be fabrication, and even with them it is
  the lowest-signal proof on a page.
- **Glassmorphism, glow stacks, over-rounded cards.** Radii stay tight (8px base) because the work
  being shown is dense software, not a consumer app store listing.
- **Numbered process timelines with big circles.** The process section earns its place by saying
  what the client *receives* at each stage, not by drawing a train track.

---

## Phase 2 — positioning language

**Headline:** *We build production software for companies that can't afford a rewrite.*

**Positioning statement:** Techlogi is a product engineering studio. We take web applications, SaaS
platforms, mobile apps and AI systems from discovery to production — and stay on after launch to
keep them fast, secure and worth using.

**Primary CTA:** Start a Project · **Secondary:** Explore Our Work · **Closing line:** *Tell us what
you're building.*

Banned and absent: "digital experiences", "turn ideas into reality", "digital transformation
partner", "innovative solutions". The copy names artifacts — a schema, a migration, a release, a
design system — because concrete nouns are the only credible claim available before a client
relationship exists.

---

## Visual language

### Palette

**Light-first, on a true white canvas.** The earlier direction was dark-first; it was replaced
because the portfolio is the point of this site and the work is overwhelmingly light, warm mobile
product design. Dark chrome around light screenshots made every project fight its own frame.

White, and specifically not cream. Warm off-white is what an image generator reaches for by
default, and it drags every screenshot toward the same sand cast — fatal here, because the product
work has to supply its own colour. The warmth lives in the accent, in the section washes and in the
ink, never in the base.

| Role | Value | Use |
|---|---|---|
| Canvas | `#FFFFFF` | The default ground |
| Ink | `#1A1512` | Body copy — warm near-black, never pure `#000`. 17.9:1 |
| Muted | `#6B625B` | Metadata. 6.0:1 on white |
| `brand-600` | `#E24A1E` | THE brand colour: display accent, focus ring, washes |
| `--primary` | `#BE3A13` (`brand-700`) | Buttons. White on `brand-600` is 4.0:1 and fails AA at label sizes; one step down reaches 5.5:1 and is still unmistakably the same vermilion |
| Wash | `#FFEDE4` peach · `#FDE9E6` blush · `#FDF3EA` sand | Three soft radial stops the hero and closing bloom from |
| Slab | `#16161A` | The dark ground that punctuates the page |
| Hairline | `#1A151214` | Structure comes from hairlines, not shadows |

The wash is radial, never linear: a linear gradient has a visible direction and starts to look like
a banner, where a bloom reads as light falling on paper.

The slab is a near-neutral graphite with a trace of cool — deliberately NOT a warm near-black. The
vermilion has to be the only warm colour in the palette; put it on a warm dark and the section reads
as brown rather than as an interruption. On the slab the ramp inverts: `brand-500` is the readable
step at 6.0:1, where `brand-700` would sink into the ground.

Accent discipline is unchanged: the primary action, focus states, and at most one emphasis per
section. Scarcity is what makes it read as a signal rather than as a brand tattoo.

### Type

Three faces, each with a job the other two cannot do:

| Role | Face | Why |
|---|---|---|
| Display | **Familjen Grotesk** | Tight apertures and a precise, Scandinavian skeleton. It reads *engineered* rather than friendly — which is the claim this studio is making — and it is uncommon enough not to arrive carrying another product's associations. |
| Body / UI | **Figtree** | Warm humanist, quiet at reading sizes, so the display face is the only one with an opinion. |
| Metadata | **JetBrains Mono** | Eyebrows, indices, stack lists, footnotes. Carries the engineering signal that would otherwise need a code screenshot. |

All three load through `next/font/google` — self-hosted, `display: swap`, latin subset, variable
axes, so there is no CDN round trip and no layout shift. Fallback stacks are declared.

Familjen Grotesk is drawn tight, so it takes **less** negative tracking than a wide grotesk would at
the same size: past about `-0.03em` its already-small apertures start closing and a headline turns
into a texture. The hero sits at `-0.024em`, and tracking eases further as the scale comes down.

Scale (fluid, so nothing needs a breakpoint override):

- `text-hero` — `clamp(2.5rem, 4.6vw, 4.25rem)`, weight 600, leading 1
- `text-display-1` — `clamp(2.125rem, 3.8vw, 3.375rem)`
- `text-display-2` — `clamp(1.75rem, 2.7vw, 2.5rem)`
- `text-display-3` — `clamp(1.1875rem, 1.5vw, 1.4375rem)`
- `text-lead` — `clamp(1.0625rem, 1.15vw, 1.1875rem)`, muted, max ~62ch
- `text-eyebrow` — 11px mono, `0.14em` tracking, uppercase
- `text-marketing-body` — 16px/1.65, max ~68ch

The dashboard-tuned scale the scaffold shipped (`text-h1`…`text-caption`) is untouched — the shared
component catalog still depends on it.

### Space, grid, radius

- Spacing: the Tailwind 4px scale, but section rhythm is restricted to three steps —
  `py-20 / py-28 / py-36` at desktop — so vertical rhythm can't drift component by component.
- Content widths: `1280px` default, `880px` for reading columns, `1600px` for full-bleed media.
  Gutters `20px` mobile → `40px` desktop.
- Grid: 12 columns desktop / 6 tablet / 4 mobile. Asymmetric splits (5/7, 4/8) are preferred over
  50/50, which is what makes a layout look composed rather than divided.
- Radius: `8px` base (`--radius`, unchanged), `2px` on hairline chips, `12px` on media frames.
  Nothing is a pill except the inquiry choice chips, where the pill is the affordance.

### Motion

One system, four durations, two easings, and named patterns. Anything not on this list does not
ship.

- Durations: `--dur-fast 120ms` (state feedback), `--dur-base 240ms` (hover, expand),
  `--dur-slow 420ms` (reveal), `--dur-cinema 720ms` (hero choreography only).
- Easing: `--ease-out cubic-bezier(0.16, 1, 0.3, 1)` for entrances,
  `--ease-inout cubic-bezier(0.65, 0, 0.35, 1)` for state changes. No bounce, no spring.
- Patterns: `reveal` (opacity + 12px translate, IntersectionObserver, once, staggered ≤ 60ms),
  `mask-line` (per-line clip reveal on headlines only), `media-lift` (1.015 scale + hairline
  brighten on project hover), `rail-snap` (horizontal snap), `nav-condense` (height + border on
  scroll), `press` (0.98 scale, 120ms).
- Only `transform`, `opacity`, `clip-path` and `background-color` are animated. No layout property
  is ever animated.
- `prefers-reduced-motion: reduce` resolves every duration to `1ms` at the token level and swaps
  video for its poster. The reduced experience is the same composition, arrived at instantly — not
  a broken one.

### Media treatment

Software is shown inside frames that tell you what you're looking at: a browser chrome frame for web
products (hairline, three dots, a monospace URL), a device frame for mobile (correct corner radius,
no glossy bezel), and a bare hairline frame for full-bleed interface art. One component API
(`MediaFrame` + `AutoVideo`) covers image, `.mp4`/`.webm`, and looping UI recordings, with the aspect
ratio reserved in CSS so nothing shifts on load.

### Section rhythm

The home page alternates ground deliberately, so the page has chapters:

`hero (paper + warm wash, form inline)` → `showreel (paper, hairline)` →
`portfolio (paper, alternating composition)` → `services (SLAB + ember wash)` → `process (paper)` →
`technologies (paper, hairline)` → `testimonials (paper, sunken)` →
`close + inline inquiry (SLAB)` → `footer (SLAB)`

Two dark interruptions, not five: services in the middle, and the close plus footer as one dark
foot to the page. A light page that goes dark twice has chapters; one that alternates every section
has stripes.

No two adjacent sections share a composition. The card grid appears exactly once, in technologies,
where a grid is genuinely the right form.
