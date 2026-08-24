# Techlogi: Flagship Website Build

**An implementation directive for Claude Code.**

Copy everything below the line into Claude Code as a single prompt.

---

## 0. Mission

Research, art-direct, design, engineer, test, and refine the flagship digital presence for **Techlogi**, a premium software product company that designs and builds web applications, SaaS platforms, mobile apps, and AI products for other companies.

This is not "make a nice landing page for a software agency." Treat it as the build of a company's most important commercial asset. The bar: a founder, VP of Product, or CTO lands on the site and thinks *these are the people I would trust with an important digital product.*

You are working autonomously. Do not stop to ask for approval at every step, do not hand back a plan instead of a build, and do not stop at the first version that renders without errors. Produce a running, polished, production-quality project on disk.

---

## 1. Operating mode

Act as a full senior product team, and switch hats deliberately as you move through the work:

Creative Director, Product Designer, UX Designer, UX Researcher, Brand Designer, Motion Designer, Conversion Rate Optimization specialist, Senior Frontend Engineer, Web Performance Engineer, Accessibility Engineer, QA Engineer.

Work in this order and do not skip forward:

**Research → Strategy → Information Architecture → Visual Direction → Scaffold → Implementation → Interaction Design → Responsive Refinement → QA → Final Polish**

Practical working rules:

- Keep a living plan file at `docs/BUILD-PLAN.md`. Record decisions, open questions, and what is done. Update it as you go rather than at the end.
- Record the visual direction in `docs/DESIGN-DIRECTION.md` (thesis, type choices, palette, motion rules, references and what you took from each conceptually).
- Run the dev server and keep it running. Actually look at the output. If you have browser or screenshot tooling available, use it to inspect real rendered pages at multiple viewport widths rather than reasoning about the layout abstractly.
- Commit in logical increments with clear messages.
- Prefer fixing the root cause over patching symptoms. If a section is not working visually, redesign it rather than nudging padding.

---

## 2. Hard constraints

1. The project **must** be scaffolded with the npm package **`jinn-web`** (https://www.npmjs.com/package/jinn-web).
2. Do **not** assume, invent, or guess `jinn-web`'s CLI syntax, framework, folder structure, components, dependencies, commands, or capabilities. Inspect it first. See Phase 0.
3. Do **not** replace the scaffold with Create React App, Vite, Next.js, Astro, or anything else, unless `jinn-web` itself uses or explicitly requires that tool.
4. Preserve the scaffold's intended dev/build/test workflow. Do not rewire the toolchain for convenience.
5. Never invent client results, revenue figures, growth percentages, named clients, real testimonials, awards, team headcounts, office addresses, or certifications. Every unverified fact is a clearly marked placeholder.
6. Every visual element must have a reason to exist. If you cannot justify it, delete it.

---

## 3. Phase 0: Inspect `jinn-web` before touching anything

Before writing a single line of product code:

1. Inspect the current package. Use the tools actually available to you: npm registry metadata, the package's README and documentation, the published files, `--help` output from its CLI, and its declared dependencies and bin entries.
2. Determine the correct, current command to initialize a project, and the options it supports (templates, TypeScript flags, styling choices, package manager, directory naming, and so on).
3. Determine what framework, router, styling approach, dependencies, scripts, linting, testing, and conventions it creates.
4. Scaffold the Techlogi project with `jinn-web` using the options that best fit this build.
5. Read the generated project before modifying it. Map out the routing model, layout entry points, styling system, asset handling, config files, and available npm scripts.
6. Write a short summary of the scaffold's architecture and conventions into `docs/BUILD-PLAN.md`, then build **with** those conventions.
7. Add dependencies only where they materially improve the result. Justify each one in the plan file.
8. Get the untouched scaffold running and building successfully before you start implementing, so you have a known-good baseline.

If the scaffold's conventions conflict with something described later in this brief, follow the scaffold and note the deviation. The scaffold is the constraint; the brief describes intent.

---

## 4. Phase 1: Research before coding

Study the current landscape of premium websites for software houses, digital product agencies, product design studios, AI development agencies, SaaS consultancies, web development studios, mobile app agencies, creative technology companies, and enterprise software consultancies. Weight recent work most heavily: sites built or refreshed in the last few years.

Look specifically at how the best of them handle:

hero sections, agency positioning, typography, navigation, project showcases, case studies, interactive portfolios, showreels, application demos, video previews, client logos, social proof, service presentation, process sections, testimonials, project inquiry experiences, contact forms, footer design, page transitions, hover behavior, scroll animation, responsive layout, mobile navigation, visual rhythm, whitespace, storytelling, and conversion paths.

Use premium reference sources: leading agency and studio sites, Awwwards-caliber work, curated design galleries, and the marketing sites of respected technology companies.

**Do not copy any single website.** Extract patterns, work out *why* they work, and synthesize an original visual language for Techlogi. Write down the specific mechanics you are borrowing conceptually (for example "sticky project metadata against a scrolling media column") and what you are deliberately rejecting.

---

## 5. Phase 2: Establish a design thesis

Before designing sections, commit to one sentence of creative strategy and let it govern every later decision. An example of the right shape, which you may replace with something stronger:

> Techlogi should feel like a product company that happens to build products for other companies, not like an outsourcing vendor.

The site must communicate: exceptional engineering capability, strong product thinking, sophisticated design taste, business understanding, reliability, speed, confidence, and technical depth.

### Reject the outsourcing-agency aesthetic

Do not build any of the following:

generic blue-gradient corporate layouts, cliché stock photography, random code screenshots, floating 3D shapes with no meaning, excessive glow effects, generic AI-generated icons, meaningless dashboard mockups, endless card grids, over-rounded everything, gratuitous glassmorphism, animation for its own sake.

### Positioning language

Write real positioning. Banned openers and anything in their family:

- "We create digital experiences."
- "We turn ideas into reality."
- "Your digital transformation partner."
- "Innovative solutions for modern businesses."

Aim for specific, confident, verifiable-sounding claims about what Techlogi builds and how it works. Concrete nouns beat abstractions.

---

## 6. Phase 3: Design the site as one experience

The site must read as a single coherent digital experience, not a stack of unrelated landing-page blocks. Define these deliberately, as tokens and primitives, before mass-producing sections:

spacing scale, max content widths, grid, typography scale, heading hierarchy, body typography, border-radius system, interaction language, animation timing, easing curves, button behavior, image treatment, browser-mockup treatment, device-mockup treatment, card system, section rhythm, background transitions, responsive breakpoints.

Rules:

- Tokens live in one place and are consumed everywhere. No ad-hoc hex values or magic pixel numbers scattered through components.
- Typography should do a large share of the design work. Choose a type pairing with genuine character, load it efficiently, and use scale and weight contrast rather than decoration to build hierarchy.
- Vary section composition on purpose. If three consecutive sections are "heading, subhead, three cards," the design has failed.
- Plan how backgrounds and section transitions carry the eye from top to bottom, including where the page goes dark or light and why.

---

## 7. Phase 4: Information architecture and content model

Build routes for:

- Home
- Work / Portfolio
- Individual case studies (dynamic route)
- Services
- About
- Contact

Make it straightforward to add Careers, Insights, service-detail pages, and industry pages later. Do not pre-build dozens of thin SEO pages now.

### Content is data, not markup

Do not hard-code portfolio and services content inside deeply nested JSX/markup. Create a structured content layer (typed data modules or content files, following whatever the scaffold supports) that presentation components consume.

A portfolio entry should support at least:

```
slug
name
tagline
summary
industry
productType
whatWeDid
outcome              // qualitative, placeholder-safe
metrics[]            // { label, value, note }  PLACEHOLDER ONLY
services[]
platforms[]
technologies[]
heroMedia            // image or video, with poster + fallback
galleryMedia[]
video                // mp4 / webm sources, poster, aspect ratio
testimonial          // optional, placeholder-safe
caseStudySections[]  // ordered blocks: problem, approach, design, build, result
featured             // boolean, controls home-page selection
```

Also create a single `site.config.*` holding company-level facts: name, tagline, contact email, phone, locations, social links, legal links, form endpoint. Everything unknown gets an obvious `TODO:` placeholder value so a human can find and replace it in one file.

Every placeholder must be findable with a single grep. Use a consistent marker such as `PLACEHOLDER` or `TODO:`.

---

## 8. Phase 5: Implementation, section by section

### 8.1 Navigation

Designed, not defaulted. Decide how it behaves on scroll (transform, condense, hide, invert) and make it deliberate. Include a persistent, always-reachable **Start a Project** control. The mobile navigation must be a designed experience of its own, keyboard accessible, focus-trapped when open, dismissible with Escape, and it must not break scroll position.

### 8.2 Hero

Within seconds the hero must answer: Who is Techlogi? What does Techlogi build? Why should a company trust Techlogi? What do I do next?

Contains:

- A strong, specific headline
- A concise positioning statement
- Primary CTA: **Start a Project**
- Secondary CTA: **Explore Our Work**
- Visual proof of real work
- Optional trust signal (placeholder-safe)
- Motion that is designed, not decorative

The visual side should show actual digital product interfaces rather than abstract artwork: a choreographed sequence or composition of SaaS dashboards, mobile apps, ecommerce interfaces, AI products, data platforms, and enterprise applications. Use mock project content where necessary, but structure it so real project media drops in by editing data, not markup.

### 8.3 Immediate contact experience (primary business requirement)

A visitor must be able to start a conversation almost immediately after arriving. This must not feel like an ad popup.

Design a premium, progressive lead-generation interaction. Choose the approach that best fits your thesis: hero-integrated inquiry, persistent "Start a Project" control opening a drawer, modal project brief, multi-step inquiry, compact floating CTA, or split-screen inquiry.

Step 1 must be a single low-effort choice, for example **What would you like to build?**

Web Application · Mobile Application · SaaS Platform · AI Product · Website · Existing Product Improvement · Dedicated Development Team · Something Else

Then progressively collect: project description, desired services, timeline, approximate budget, name, company, email, optional phone, optional attachment.

Never show all fields at once. Required behaviors:

- Visible, well-designed focus states
- Inline validation with accessible error messaging tied to inputs
- Full keyboard navigation, logical tab order, Escape to close, focus return on close
- Loading, error, and success states that are designed, not browser defaults
- Real labels (not placeholder-as-label)
- A short privacy reassurance line
- Progress indication across steps, and the ability to go back without losing input
- State preserved if the drawer/modal is closed and reopened in the same session

Wire submission to a configurable endpoint in `site.config.*`. If no endpoint is set, fail gracefully into a clearly logged mock success path and document exactly where to add the real endpoint and what payload shape it receives.

This form should feel like part of a product, not a contact page.

### 8.4 Product showreel

Consider a cinematic showreel near the hero built from real UI experiences rather than a corporate video: browser interface → mobile app → analytics dashboard → AI workflow → ecommerce product → enterprise platform.

Keep clips short. Use tasteful transitions. Where possible let hover or focus preview an individual project. Never autoplay audio. Respect `prefers-reduced-motion` with a static, still-beautiful fallback.

### 8.5 Portfolio: the centerpiece

The portfolio is the star of this site. A grid of six identical cards is a failure state.

Build an editorial portfolio experience. Draw from techniques such as: oversized project panels, sticky project metadata against scrolling media, full-bleed visuals, alternating compositions, hover-triggered video, looping interface demos, browser and device frames, subtle parallax, justified horizontal gallery sections, animated transitions between screenshots, category filtering, layered UI compositions.

Each featured project must expose enough context to understand the work:

**Project name · Industry · Product type · What Techlogi did · Short outcome · Services · Platforms · Technology (only where useful) · View Case Study**

Example of the intended density:

> ### Nova
> AI-powered operations platform
> Product Strategy · UX/UI · Full-Stack Development · AI Integration
> One or two sentences on the business problem that was solved.
> Then a polished product video or interactive visual.

Case study pages must use a reusable section architecture (problem, approach, design, build, result, next project) driven by the content model, so a new case study is a data addition plus media, not a bespoke page build.

Outcomes and metrics are placeholders. Mark them unmistakably.

### 8.6 Media and demo component system

Techlogi builds software, so the site must show software behaving like software. Do not rely on static screenshots alone.

Build reusable components that handle `.mp4`, `.webm`, animated UI recordings, interactive demos, image sequences, browser frames, and mobile device frames through one consistent API.

Video requirements:

- Autoplay only where appropriate, always `muted`, `playsinline`, `loop` where useful
- Lazy-loaded, with `poster` frames always present
- Pause when substantially out of the viewport (IntersectionObserver) where feasible
- Explicit aspect ratios reserved in CSS so nothing shifts on load
- Graceful static-image fallback if the video fails, is unsupported, or reduced motion is preferred
- Sensible compression; do not ship enormous files

### 8.7 Services

An interactive services section, not a bulleted capability list. Organize into coherent capability groups:

**Strategy & Product:** Product Discovery, Technical Discovery, Product Strategy, UX Research, Prototyping
**Design:** UX Design, UI Design, Product Design, Design Systems, Website Design
**Engineering:** Web Applications, SaaS Development, Custom Software, Backend Systems, APIs, Cloud Infrastructure
**Mobile:** iOS, Android, Cross-platform Applications
**AI & Automation:** AI Applications, LLM Integrations, AI Agents, Workflow Automation, Internal AI Tools
**Product Evolution:** Product Modernization, Performance Optimization, UX Improvements, Engineering Support, Dedicated Teams

Explore sticky labels, accordion panels, expandable capability cards, animated examples, and contextual project previews that connect a capability to real work. Whatever pattern you choose must work with a keyboard and on touch.

### 8.8 Development process

Show how an idea reaches production. Avoid a childish numbered timeline unless the execution is exceptional. Suggested stages: Discover, Define, Design, Engineer, Validate, Launch, Evolve.

For each stage explain what happens and what the client actually receives. The goal is to reassure a buyer that the methodology is mature, without turning the page into corporate process bureaucracy.

### 8.9 Technologies

No wall of logos. Present technology contextually, grouped as Frontend, Backend, Mobile, Cloud, AI, Data, and only where it adds credibility or clarifies capability. Technology stays secondary to outcomes.

### 8.10 Testimonials and client proof

Build a credible testimonial structure supporting quote, person, role, company, related project, optional portrait, and optional measurable outcome.

Do not invent testimonials, people, or companies. Use obviously replaceable placeholder content and make the swap path clear in the completion summary.

### 8.11 Final conversion moment

Not "Ready to get started?" Write a close that follows from the story the page has told. A strong shape:

> **Tell us what you're building.**

Then immediately expose step one of the project inquiry inline, so the close is an interaction rather than a link.

### 8.12 Footer

Designed, not an afterthought. Include logo, short positioning statement, primary navigation, services, work, contact, social links, legal links, email, copyright, locations (only when real details are supplied), and a prominent project CTA.

---

## 9. Motion and interaction system

Define one motion system with a small set of durations, easings, and named patterns, then reuse it. Candidate patterns: text reveals, masking, image and video reveals, project hover states, subtle scale transitions, section transitions, navigation transformations, CTA feedback, cursor-adjacent interactions where suitable, scrolling product sequences, sticky compositions.

Rules:

- Motion must reinforce hierarchy and storytelling. Anything that does not, gets cut.
- Animate transforms and opacity. Avoid animating layout properties.
- Respect `prefers-reduced-motion` throughout, and verify the reduced-motion experience still looks intentional rather than broken.
- Do not add a heavyweight animation framework to fade and translate things if the scaffold's existing stack, CSS, or the Web Animations API can do it well.

---

## 10. Responsive design

Do not build desktop and stack it for mobile. Design mobile on purpose.

Evaluate every major component at: small phone, large phone, tablet, laptop, large desktop, ultra-wide desktop.

Pay particular attention to navigation, hero typography, project previews, video aspect ratios, the contact interface, service interactions, sticky sections, and horizontal experiences.

Any desktop interaction that does not translate to touch (hover reveals, cursor effects, hover-triggered video) must have a designed mobile alternative, not a disabled one.

---

## 11. Performance

Visual ambition does not excuse a slow site. Optimize images, video, fonts, JavaScript, hydration and runtime work, animation, and third-party scripts.

Use responsive images with correct `sizes`, lazy loading below the fold, modern formats, sensible video compression, code splitting where the scaffold supports it, optimized font loading with a sane fallback, semantic HTML, and as few dependencies as the job allows.

Reserve space for all media to prevent layout shift. Keep the hero's critical path lean: the largest contentful element should not be a large autoplaying video that blocks first render.

---

## 12. Accessibility

Accessibility is part of quality, not a later pass.

Semantic landmarks. Logical, non-skipping heading hierarchy. Keyboard-accessible navigation and controls. Visible focus states that match the design language. Sufficient color contrast. Real labels on every form field. Accessible validation messaging. ARIA only where semantics cannot do the job. Reduced-motion handling. Accessible dialogs and drawers with focus trapping and restoration. Accessible carousels where used. Meaningful alt text, and empty alt for decorative images.

Every interactive element must be fully usable without a mouse. Test this by actually tabbing through the site.

---

## 13. SEO and metadata

Semantic page structure. Unique title and meta description per route. Canonical URLs where appropriate. Open Graph and social preview metadata with real OG images (generated placeholders are fine). Favicon and app icons. Sitemap and robots configuration where the scaffold supports them. Structured data (Organization, plus CreativeWork or similar for case studies) only where justified.

No keyword stuffing. Position Techlogi naturally around software development, product design, SaaS development, web applications, mobile development, and AI development.

---

## 14. Code quality

- Understand the `jinn-web` scaffold before modifying it, and follow its conventions.
- Keep components modular. No monolithic page components.
- Extract reusable UI primitives: buttons, links, section wrappers, eyebrow labels, headings, media frames.
- Reusable portfolio components, media/demo components, CTA components, and case-study structures.
- No duplicated styling. Tokens, not copy-paste.
- Keep content and data separate from presentation where practical.
- Remove unused code and unused dependencies.
- Zero console errors and warnings in normal use.
- Zero type errors where TypeScript is used. No broken imports.
- No hydration mismatches. No obvious layout shift. No inaccessible custom controls.

Do not over-engineer abstractions prematurely. Extract on the second or third use, not the first.

---

## 15. Visual asset strategy

Work out what assets each section needs before finalizing it. Use authentic-looking UI mockups, generated placeholder interfaces, browser frames, phone frames, product screenshots, and appropriately licensed imagery. Abstract graphics only where they genuinely serve the composition.

No stock photos of people pointing at laptops.

Where production assets do not exist, build sophisticated placeholders that communicate the intended composition. Never leave grey rectangles. Placeholder UI should be designed well enough that the page looks finished, and organized in predictable paths (for example `public/media/projects/<slug>/`) so real media replaces it cleanly.

---

## 16. QA phase (do not skip)

**Do not stop after the first functioning implementation.** Once the site works, run a dedicated QA pass.

Check: desktop layout, tablet layout, mobile layout, typography, spacing, alignment, overflow, navigation, buttons, hover states, focus states, forms, modals and drawers, videos, project cards, animations, reduced motion, content clipping, long-text edge cases, image loading, console warnings, broken links.

Also run every relevant tool the project provides: lint, format check, typecheck, build, and tests. The production build must succeed cleanly.

Stress the content: swap in a very long project name and a very long testimonial, empty out an optional field, and confirm nothing breaks.

Fix everything you find before moving on.

---

## 17. Visual refinement pass

After functional QA, do a separate art-direction pass and answer these honestly:

- Does this still look like an AI-generated template?
- Are too many sections using the same card layout?
- Is there enough visual rhythm between sections?
- Is typography doing enough of the design work?
- Is the portfolio truly the star of the page?
- Does the hero communicate value within seconds?
- Does motion feel intentional or decorative?
- Is there enough evidence that Techlogi actually builds software?
- Can someone start a project within seconds of arriving?
- Does the site feel premium on a phone, not just tolerable?
- Are visual effects competing with the product work instead of framing it?
- Is anything purely decorative that should be deleted?

Where the answer is unflattering, redesign. Keep iterating until the experience feels deliberately art-directed rather than assembled.

---

## 18. Definition of done

Leave behind a working, polished project, not a description of one. Deliverables:

1. Correctly scaffolded `jinn-web` project
2. Fully implemented responsive website
3. Hero experience
4. Navigation
5. Immediate project-inquiry interaction
6. Services presentation
7. Product showreel functionality
8. Premium portfolio experience
9. Reusable project and case-study architecture
10. Process section
11. Testimonials and social proof structure
12. Conversion section
13. Contact experience
14. Footer
15. Deliberate mobile experience
16. Motion and interaction system
17. Accessibility treatment
18. Performance optimizations
19. SEO foundation
20. Clean production-quality code

### Completion summary

Finish with a concise summary covering:

- What was built
- Major design decisions and the thesis behind them
- Project structure
- Significant reusable components and how to use them
- How to replace portfolio projects with real ones
- How to add videos and demos
- How contact submission is configured, and the expected payload
- Any external service that still needs credentials
- Every command needed to run, build, lint, typecheck, and test the project
- A list of remaining placeholders that a human must replace

---

## 19. Final reminder

Do not read this as "create a nice landing page for a software agency."

Read it as: **research, art-direct, design, engineer, test, and refine a flagship digital presence for a premium software product company, using `jinn-web` as the required scaffold and yourself as the autonomous implementation environment.**

Begin with Phase 0: inspect `jinn-web`.
