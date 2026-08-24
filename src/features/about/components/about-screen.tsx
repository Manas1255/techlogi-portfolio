import {
  Container,
  Eyebrow,
  HairlineList,
  PlaceholderNote,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { ClosingCta } from "@/components/sections";
import { findProject, projects } from "@/content";
import { siteConfig } from "@/config/site";

const PRINCIPLES = [
  {
    title: "We write the plan down",
    body: "Discovery ends in a document you could hand to a different team and get the same product. If we can't write it, we don't understand it yet — and neither would you.",
  },
  {
    title: "The boundary is where things break",
    body: "Every external edge — a backend response, a form, a file upload, a third-party API — is validated in both directions. A renamed field should fail loudly at the seam, not silently three screens later.",
  },
  {
    title: "Every state, not the happy path",
    body: "Loading, empty, error, offline, and too-much-data are designed before the build starts. They are most of what a user actually experiences on a bad day, which is the day that decides whether they trust the product.",
  },
  {
    title: "Boring where it counts",
    body: "We pick well-understood technology for the load-bearing parts and save the novelty for where it earns something. A stack chosen to be interesting is a maintenance bill someone else pays.",
  },
  {
    title: "We stay after launch",
    body: "The weeks after go-live tell you more than the months before it. We plan for them: a post-launch review against the measures we agreed, and a backlog built from real usage rather than the original plan.",
  },
  {
    title: "We say what we don't know",
    body: "Estimates come with their assumptions attached. Risks are itemised before they set a budget, not discovered during one. If we think a project is a bad idea, you'll hear it while it's still cheap.",
  },
];

/**
 * `/about` — how the studio works, in the studio's own terms.
 *
 * Deliberately not a team grid: no real people can be listed without their
 * consent and photographs, and a page of invented headshots would be exactly
 * the fabrication the brief rules out. What's here instead is the operating
 * philosophy, which is the thing a buyer is actually assessing.
 */
export function AboutScreen() {
  // A landscape frame: this sits in a wide column beside the intro.
  const showcase = findProject("zyuela") ?? projects[0];

  return (
    <>
      <section className="wash-warm grain pt-32 pb-16 md:pt-40 md:pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-6">
              <Reveal variant="fade">
                <Eyebrow>About Techlogi</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="text-display-1 text-balance">
                  A product company that takes contracts.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lead text-muted-foreground">
                  {siteConfig.tagline} We work the way a good internal team
                  works — with the difference that we have done it across a lot
                  of domains, and we leave you the codebase, the documentation
                  and the ability to carry on without us.
                </p>
              </Reveal>
            </div>
            <Reveal variant="fade" delay={120}>
              <MediaFrame
                media={showcase.heroMedia}
                priority
                sizes="(min-width: 1024px) 44vw, 92vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <Section surface="slab" rhythm="loose" className="wash-slab">
        <SectionIntro
          index={1}
          eyebrow="How we work"
          title="Six things we're consistent about."
          lead="Not values on a wall. These are the decisions that show up in every engagement, and the ones a client would notice if we stopped making them."
        />
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <Reveal
              key={principle.title}
              delay={Math.min(index * 40, 160)}
              className="border-hairline flex flex-col gap-3 border-t pt-6"
            >
              <span className="text-mono-label text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-display-3">{principle.title}</h3>
              <p className="text-marketing-body text-muted-foreground">
                {principle.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section rhythm="base" divided>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow index={2}>Engagements</Eyebrow>
            <h2 className="text-display-2 text-balance">
              Three ways we usually start.
            </h2>
            <p className="text-marketing-body text-muted-foreground">
              Whichever it is, the first two weeks look the same: we learn the
              domain, write down what we found, and tell you what we think.
            </p>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-8">
            {[
              {
                name: "Discovery engagement",
                detail:
                  "Two to four weeks, fixed scope. You get a written plan, an architecture recommendation, an estimate with its assumptions, and a prototype of whatever carries the risk. It stands on its own — you can take it to another team.",
              },
              {
                name: "Product build",
                detail:
                  "A full team — product, design, engineering — through to launch and past it. Two-week iterations against a deployed environment, with access to the repository from day one.",
              },
              {
                name: "Embedded team",
                detail:
                  "Engineers and designers working inside your process, to your priorities, holding our standards. Useful when the product direction is yours and the capacity isn't.",
              },
            ].map((option) => (
              <div
                key={option.name}
                className="border-hairline flex flex-col gap-2.5 border-t pt-5"
              >
                <h3 className="text-display-3">{option.name}</h3>
                <p className="text-marketing-body text-muted-foreground">
                  {option.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section rhythm="base" className="bg-sunken">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow index={5}>The studio</Eyebrow>
            <h2 className="text-display-2 text-balance">
              Who you would actually work with.
            </h2>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-6">
            <p className="text-marketing-body text-muted-foreground">
              You work with the people who do the work. There is no account
              layer between you and the engineers, and the person who scoped
              your project is on the call when it launches.
            </p>
            <HairlineList
              items={[
                "The team that pitches is the team that builds",
                "Direct access to engineers and designers, not a delivery manager relaying",
                "One named lead accountable for the engagement end to end",
                "Your repository, your infrastructure, your accounts — from the first commit",
              ]}
            />
            <PlaceholderNote tone="panel">
              Team members, headcount, locations and credentials are
              deliberately not listed here. Add them in{" "}
              <code className="font-mono text-[0.8125rem]">
                src/config/site.ts
              </code>{" "}
              and this section once they are real — inventing them would be the
              one thing that makes everything else on this site less credible.
            </PlaceholderNote>
          </Reveal>
        </div>
      </Section>

      <ClosingCta
        origin="about-close"
        title="Tell us what you're building."
        lead="One question to start. A person reads every inquiry, and answers it."
      />
    </>
  );
}
