/**
 * SOURCE CATALOG. The single source of truth for every user-facing string.
 *
 * Add new keys HERE first; TypeScript then forces every other locale catalog to
 * add them too (each is declared `satisfies Messages`), so a translation can
 * never silently go missing.
 *
 * Interpolate with `{name}` placeholders: `t("dashboard.welcome", { name })`.
 *
 * ⚠️ Deliberately NOT `as const`. The key PATHS are what `MessageKey` is built
 * from, and those stay literal either way. But `as const` would also make each
 * VALUE a literal type (`"Save"` rather than `string`), and then no translation
 * could ever satisfy `Messages`: German "Speichern" isn't assignable to `"Save"`.
 */
const en = {
  common: {
    actions: {
      save: "Save",
      cancel: "Cancel",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      close: "Close",
      search: "Search",
      retry: "Try again",
      back: "Back",
      next: "Next",
      copy: "Copy",
      copied: "Copied",
      clear: "Clear",
      viewAll: "View all",
    },
    states: {
      loading: "Loading…",
      noResults: "No results",
      noResultsHint: "Try a different search or filter.",
      errorTitle: "Something went off track",
      errorHint: "The request didn't go through. You can try again.",
      notFoundTitle: "Page not found",
      notFoundHint: "The page you're looking for doesn't exist or has moved.",
    },
    pagination: {
      summary: "{from}–{to} of {total}",
      previous: "Previous",
      next: "Next",
      page: "Page {page} of {pages}",
      rowsPerPage: "Rows per page",
    },
    table: {
      columns: "Columns",
      sortAscending: "Sort ascending",
      sortDescending: "Sort descending",
      selected: "{count} selected",
      openMenu: "Open menu",
    },
    confirm: {
      deleteTitle: "Delete this item?",
      deleteDescription: "This can't be undone.",
    },
    language: "Language",
    theme: "Theme",
  },

  nav: {
    home: "Home",
    work: "Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    primary: "Primary",
    skipToContent: "Skip to content",
  },

  booking: {
    trigger: "Book a call",
    duration: "30 minutes",
    ariaOpen: "Open the booking calendar",
  },

  inquiry: {
    trigger: "Send a project brief",
    title: "Send a project brief",
    subtitle:
      "Four short steps, then you pick a time. We keep what you typed if you close it.",
    privacy:
      "We use your details to reply, and for nothing else. No mailing list, no follow-up sequence, and we never pass them on.",
    /* The short form, for the steps before any personal detail is asked for.
       The full reassurance belongs where the data is actually handed over. */
    privacyShort: "We only use your details to reply. No mailing list.",
    steps: {
      build: "What you need",
      brief: "About the project",
      contact: "How to reach you",
    },
    step1: {
      title: "What can we help you build?",
      lead: "Pick whichever is closest. Nothing here is binding, and you can change it later.",
    },
    step2: {
      title: "Tell us about it",
      lead: "In your own words. What you want it to do matters far more than what it's called.",
    },
    step3: {
      title: "How should we reach you?",
      lead: "One person reads your brief and replies within 60 minutes, usually with times to talk.",
    },
    /** The optional disclosure that holds budget, timeline and files. */
    more: "Add budget, timeline or files (optional)",
    /* The four screens. Each names what it wants in the visitor's words, and
       the lead says why it is being asked, which is the question a person is
       actually holding when a form appears. */
    flow: {
      progress: "Step {current} of {total}",
      optional: "Optional",
      stage: {
        title: "Where are you with it?",
        lead: "One tap. This is the whole first step.",
      },
      idea: {
        title: "Tell us the idea",
        lead: "A few sentences. We read every one of these ourselves.",
      },
      prepare: {
        title: "Anything that helps us prepare",
        lead: "Skip all of it if you would rather just talk.",
      },
      contact: {
        title: "Where should the invite go?",
        lead: "Last step, then you pick a time.",
      },
    },
    /* Speak-instead-of-type, offered only on the idea step and only where the
       browser actually has a recogniser. */
    dictate: {
      start: "Or say it out loud",
      stop: "Stop",
      hint: "We will type it out for you.",
      listening: "Listening. Speak normally, and press stop when you are done.",
      denied:
        "Your browser is blocking the microphone. Allow it in the address bar, or just type instead.",
      failed: "Dictation stopped working. Typing still works fine.",
    },
    fields: {
      buildType: {
        label: "What are you building?",
        placeholder: "Pick whichever is closest",
      },
      description: {
        label: "Describe your idea, briefly",
        hint: "A few sentences is plenty. What happens today, and what should change?",
        placeholder:
          "We run scheduling for eleven clinics across three spreadsheets, and our coordinators waste hours on it every week…",
      },
      services: {
        label: "Where do you need help?",
        hint: "Optional. Choose as many as apply, or none.",
      },
      stage: {
        label: "Where are you with it right now?",
        hint: "There is no wrong answer. It only tells us which conversation to have.",
        placeholder: "Pick whichever is closest",
      },
      timeline: {
        label: "When would you like to start?",
        hint: "A rough answer is fine. Nothing here is a commitment.",
        placeholder: "No rush either way",
      },
      budget: {
        label: "Roughly what budget do you have in mind?",
        placeholder: "A range is fine",
        hint: "Not a quote and not a commitment. It only tells us what size of team fits.",
      },
      anythingElse: {
        label: "Anything else we should know before the call?",
        hint: "Optional. A constraint, a deadline, a question you want answered first.",
        placeholder:
          "We have to stay on our current payment provider, and the board wants to see something in March…",
      },
      name: {
        label: "First and last name",
        hint: "So we know who we are talking to on the call.",
        placeholder: "Ada Lovelace",
      },
      company: { label: "Company (optional)" },
      email: {
        label: "Email address",
        hint: "Where the calendar invite and our reply go. We never add you to a list.",
        placeholder: "ada@company.com",
      },
      phone: {
        label: "Phone or WhatsApp (optional)",
        hint: "Only if you would rather we reached you there than by email.",
        /* The NATIONAL part only: the country picker beside it carries the
           dial code, so an example with a +49 on it would show it twice. */
        placeholder: "151 23456789",
        country: "Country calling code",
        countrySearch: "Search countries",
      },
    },
    /* Option labels for the three selects. These were English literals in
       `inquiry.schema.ts` and rendered untranslated on the German site. */
    options: {
      stage: {
        idea: "Just an idea so far",
        concept: "The concept is worked out",
        design: "Designs already exist",
        existingApp: "An existing app needs improving",
      },
      timeline: {
        asap: "As soon as we can",
        months: "In the next few months",
        later: "Later this year",
        exploring: "Just exploring for now",
      },
      budget: {
        under5k: "Under $5k",
        from5to10k: "$5k - $10k",
        from10to25k: "$10k - $25k",
        over25k: "More than $25k",
        unsure: "I'm not sure yet",
        private: "I'd rather not say",
      },
    },
    attachment: {
      label: "Attach anything useful (optional)",
      /* The collapsed summary. Deliberately NOT `label`, which the field
         inside repeats: the same sentence twice is what folding was for. */
      toggle: "Attach a file",
      choose: "Choose files",
      drop: "or drop them here",
      hint: "Any format, up to {max} each.",
      remove: "Remove {name}",
      count: "{count} attached",
      tooLarge:
        "{name} is bigger than {max}. Send that one over when we reply, or share a link to it.",
      tooMany: "Up to {max} files here. Bring the rest to the call.",
    },
    actions: {
      back: "Back",
      next: "Continue",
      change: "Change",
      submit: "Send the brief",
      continueToBooking: "Continue to pick a time",
      skip: "Skip this",
      submitting: "Sending…",
    },
    success: {
      title: "Brief sent",
      heading: "Thanks, that's with us.",
      bookingBody:
        "Your brief is with us and the calendar is open. Pick a time that suits you and we will have read everything before we speak.",
      body: "A person reads every brief and replies within 60 minutes. If you'd rather not wait, book a call and pick a time now.",
      close: "Close",
      another: "Send another",
    },
    error: {
      title: "That didn't send.",
    },
    validation: {
      descriptionShort:
        "A sentence or two more, so we can give you a useful reply",
      /*
        buildType was the ONE field in `inquiry.schema.ts` with no message
        key, so a visitor who submitted without picking got Zod's own default:
        `Invalid option: expected one of "web-app"|"mobile-app"|…`. Raw enum
        ids, in English, on the German page.
      */
      stageRequired:
        "Pick whichever is closest, we can sort out the detail on the call",
      buildTypeRequired:
        "Pick the closest one, we'll sort the detail out on the call",
    },
  },

  /** THE HERO. The headline is three lines, each masked and revealed. */
  hero: {
    /* The label over the showcase frame. Names what the picture IS, because a
       product shot with no caption reads as stock art. */
    showcase: "Recently shipped",
    line1: "We turn your idea into",
    line2: "an app that makes",
    /** Set in brass inside line 2. */
    accent: "money",
    lead: "Websites, mobile apps, SaaS platforms and AI products, taken from an idea to something real people use.",
    answers: {
      talk: { label: "Talk this week", detail: "Pick a slot, not a queue" },
      ship: {
        label: "Ship every 2 weeks",
        detail: "A running build, not a status update",
      },
      straight: {
        label: "Straight answers",
        detail: "Including when it is a bad idea",
      },
    },
  },

  products: {
    heading: "Shipped and in the stores",
    viewCaseStudy: "View the case study",
  },

  howItWorks: {
    eyebrow: "How it works",
    title: "Five steps. The first one takes thirty minutes.",
    lead: "No procurement process, no discovery retainer before anyone has spoken. You book a slot, we tell you honestly whether we are the right team, and it goes from there.",
    youGet: "You get",
  },

  whatWeBuild: {
    eyebrow: "What we build",
    title: "Eight things we build, and where we've built them.",
    lead: "Every technology named below is one we have shipped, not one we could learn. Where we can point at the project, we do.",
    cta: "Talk through yours",
    shippedIn: "Shipped in {project}",
  },

  featuredWork: {
    eyebrow: "Selected work",
    title: "Four of them, written up properly.",
    lead: "Every one shipped, went live, and is still running. Each write-up covers the problem, the approach and the trade-offs, including the ones that didn't go to plan.",
  },

  proof: {
    eyebrow: "Proof",
    title: "What it's actually like to work with us.",
    lead: "The parts of hiring a studio that usually go wrong, and what we do about each one. Every answer here is something you can check against the rest of this site.",
    inTheirWords: "In their own words",
    awaitingClip: "Awaiting a client clip",
    noQuotesYet:
      "We publish a client quote only once a named person at a named company has approved it in writing. None has yet, so this space is empty rather than filled with invented ones.",
    usualExperience: "The usual experience",
    howWeWork: "How we work",
    unmute: "Unmute {person}",
    mute: "Mute {person}",
  },

  faq: {
    eyebrow: "Questions",
    title: "The things people ask before they write in.",
    lead: "Straight answers, including the one about money. If yours is not here, it is a good first question on the call.",
    orEmail: "Or email",
  },

  bookACall: {
    eyebrow: "Book a call",
    title: "Pick a time. We'll tell you what it takes.",
    lead: "Thirty minutes, no pitch deck. Bring a rough idea or a finished spec, and leave with a straight answer on scope, cost and whether we're the right team.",
    preferToWrite: "Prefer to write?",
    withYourFiles: "with your files instead, or email",
    whatHappens: {
      slot: {
        title: "You pick the slot",
        body: "A live calendar, not a queue. Most people find something inside forty-eight hours.",
      },
      prepared: {
        title: "We come prepared",
        body: "We read whatever you send beforehand, so the call starts at the interesting part.",
      },
      bring: {
        title: "Bring anything you have",
        body: "A spec, a Figma link, screenshots, a competitor you like, or nothing at all.",
      },
    },
    scheduler: {
      title: "Live scheduling opens shortly",
      body: "Self-serve booking is being switched on. Until it is, send the brief and we will come back with times inside 60 minutes, or email us and we will reply to that.",
      loading: "Loading available times, {duration}",
    },
  },

  offer: {
    appliesTo: "your first project invoice",
    percentOff: "{percent}% off",
    ifYouBookWithin: "if you book within",
    quote: "Quote",
    onTheCall: "on the call. Applies to {appliesTo}.",
    expired:
      "Your {percent}% window has closed. Book anyway, we'll still talk.",
    secondsLeft: "{seconds} seconds left to claim {percent} percent off",
  },

  confidentiality: {
    headline: "Your idea stays yours",
    /*
      The ONE-LINE version, and not simply the first bullet reused. Compressed
      to the three things that actually answer the unspoken worry: who reads
      it, what we will never do with it, and a concrete offer. The NDA clause
      carries most of the weight, because it is the only one the reader does
      not have to take on trust.
    */
    line: "Read only by the people who would build it, never reused, never passed on. Happy to sign your NDA first.",
    point1: "What you share stays between you and the people on your project.",
    point2:
      "We never reuse your concept, your research or your materials elsewhere.",
    point3: "Happy to sign your NDA before the call, or send ours.",
  },

  seo: {
    workTitle: "Work",
    workDescription:
      "Selected work by GA Code: mobile apps, SaaS platforms, websites and AI products, with the problem and the approach behind each one.",
    servicesTitle: "Services",
    servicesDescription:
      "What GA Code builds: websites, mobile apps, SaaS platforms, AI products, payments, internal tools and MVPs, and what you receive from each.",
    aboutTitle: "About",
    aboutDescription:
      "How GA Code works: written plans, validation at every boundary, every UI state designed, and a team that stays on after launch.",
    contactTitle: "Book a call",
    contactDescription:
      "Book a 30-minute call with the people who would build it, or send a project brief. A straight answer on scope, cost and fit.",
    homeDescription:
      "GA Code builds websites, mobile apps, SaaS platforms and AI products. Book a 30-minute call and get a straight answer on scope and cost.",
  },

  contact: {
    responseTime: "We read every brief and reply within 60 minutes.",
  },

  stack: {
    eyebrow: "Stack",
    title: "Chosen for the problem, not the résumé.",
    lead: "We are opinionated but not religious. Where a client's team already runs something well, we work in it rather than around it.",
  },

  pages: {
    work: {
      eyebrow: "Selected work",
      title: "{count} products, built end to end and still running.",
      lead: "Each case study covers the problem, the approach and the trade-offs, including the decisions we would make differently.",
      draftNote:
        "These case studies are illustrative placeholders. The structure, media and metrics are real components awaiting real, cleared client work.",
      closeTitle: "Yours could be the next one here.",
      closeLead:
        "Thirty minutes to tell us what you're building, and a straight answer on whether we're the team for it.",
    },
    services: {
      eyebrow: "Capabilities",
      title:
        "Everything it takes to get a product into production, and keep it there.",
      lead: "Most engagements draw on several of these at once. They are listed separately so it is obvious what you would actually be buying, and what you would receive at the end of it.",
      group: "Capability group",
      whatYouReceive: "What you receive",
      closeTitle: "Not sure which of these you need?",
      closeLead:
        "That's most of what the first call is for. Bring the problem, not a specification, and we'll work out the shape of it together.",
    },
    about: {
      eyebrow: "About GA Code",
      title: "A product company that takes contracts.",
      lead: "We work the way a good internal team works, with the difference that we have done it across a lot of domains, and we leave you the codebase, the documentation and the ability to carry on without us.",
      principlesEyebrow: "How we work",
      principlesTitle: "Six things we're consistent about.",
      principlesLead:
        "Not values on a wall. These are the decisions that show up in every engagement, and the ones a client would notice if we stopped making them.",
      principles: {
        plan: {
          title: "We write the plan down",
          body: "Discovery ends in a document you could hand to a different team and get the same product. If we can't write it, we don't understand it yet, and neither would you.",
        },
        boundary: {
          title: "The boundary is where things break",
          body: "Every external edge, a backend response, a form, a file upload, a third-party API, is validated in both directions. A renamed field should fail loudly at the seam, not silently three screens later.",
        },
        states: {
          title: "Every state, not the happy path",
          body: "Loading, empty, error, offline, and too-much-data are designed before the build starts. They are most of what a user actually experiences on a bad day, which is the day that decides whether they trust the product.",
        },
        boring: {
          title: "Boring where it counts",
          body: "We pick well-understood technology for the load-bearing parts and save the novelty for where it earns something. A stack chosen to be interesting is a maintenance bill someone else pays.",
        },
        stay: {
          title: "We stay after launch",
          body: "The weeks after go-live tell you more than the months before it. We plan for them: a post-launch review against the measures we agreed, and a backlog built from real usage rather than the original plan.",
        },
        honest: {
          title: "We say what we don't know",
          body: "Estimates come with their assumptions attached. Risks are itemised before they set a budget, not discovered during one. If we think a project is a bad idea, you'll hear it while it's still cheap.",
        },
      },
      engagementsEyebrow: "Engagements",
      engagementsTitle: "Three ways we usually start.",
      engagementsLead:
        "Whichever it is, the first two weeks look the same: we learn the domain, write down what we found, and tell you what we think.",
      engagements: {
        discovery: {
          name: "Discovery engagement",
          detail:
            "Two to four weeks, fixed scope. You get a written plan, an architecture recommendation, an estimate with its assumptions, and a prototype of whatever carries the risk. It stands on its own, you can take it to another team.",
        },
        build: {
          name: "Product build",
          detail:
            "A full team of product, design and engineering, through to launch and past it. Two-week iterations against a deployed environment, with access to the repository from day one.",
        },
        embedded: {
          name: "Embedded team",
          detail:
            "Engineers and designers working inside your process, to your priorities, holding our standards. Useful when the product direction is yours and the capacity isn't.",
        },
      },
      studioEyebrow: "The studio",
      studioTitle: "Who you would actually work with.",
      studioLead:
        "You work with the people who do the work. There is no account layer between you and the engineers, and the person who scoped your project is on the call when it launches.",
      studio1: "The team that pitches is the team that builds",
      studio2:
        "Direct access to engineers and designers, not a delivery manager relaying",
      studio3: "One named lead accountable for the engagement end to end",
      studio4:
        "Your repository, your infrastructure, your accounts, from the first commit",
      studioNote:
        "Team members, headcount, locations and credentials are deliberately not listed here. Add them in {file} and this section once they are real; inventing them would be the one thing that makes everything else on this site less credible.",
      closeTitle: "If that sounds like the way you want to work.",
      closeLead:
        "Thirty minutes, no deck. Bring the problem and we'll tell you what building it actually involves.",
    },
    contact: {
      eyebrow: "Talk to us",
      title: "Pick a time that suits you.",
      lead: "Thirty minutes with the people who would actually build it. No deck, no discovery fee, no sales sequence afterwards.",
      orBriefTitle: "Or send a brief instead",
      orBriefLead:
        "Three short steps, and you can attach whatever you already have. Close it and come back without losing anything.",
      preferEmail: "Prefer email",
      whatHelps: "What helps us reply usefully",
      whatHelps1: "The problem, before the feature list",
      whatHelps2: "What exists today: a system, a spreadsheet, or nothing yet",
      whatHelps3: "Who uses it, and where they are when they do",
      whatHelps4: "Any date that actually matters, and why",
      whatNext: "What happens next",
      whatNext1: "A 30-minute call with the people who would build it",
      whatNext2: "A straight answer on fit, and on what it takes",
      whatNext3: "A written scope and estimate, with the assumptions attached",
      whatNext4: "You decide. We do not chase, and there is no sequence",
      whereWeAre: "Where we are",
    },
    caseStudy: {
      moreFrom: "More from {project}",
      closeTitle: "Building something like this?",
      closeLead:
        "Book thirty minutes and we'll tell you quickly whether we're the right team for it, and roughly what it takes.",
    },
  },

  site: {
    role: "Software house",
    description:
      "GA Code builds websites, mobile apps, SaaS platforms and AI products, from an idea to something real people use. Book a 30-minute call and get a straight answer on scope and cost.",
    keywords:
      "software development|web development|mobile app development|SaaS development|AI development|custom software|software house",
    startProject: "Start a Project",
    exploreWork: "Explore Our Work",
    viewCaseStudy: "View Case Study",
    viewAllWork: "View all work",
    nextProject: "Next project",
    backToWork: "All work",
    industry: "Industry",
    productType: "Product type",
    services: "Services",
    platforms: "Platforms",
    technology: "Technology",
    outcome: "Outcome",
    whatWeDid: "What we did",
    period: "Period",
    allWork: "All work",
    filterBy: "Filter by capability",
    placeholderCaseStudy:
      "Illustrative case study. The engagement, the figures and the quotes are placeholders until real, cleared client work replaces them.",
    placeholderMetrics:
      "Figures shown are illustrative placeholders, not measured results.",
    placeholderTestimonial: "Placeholder, awaiting an approved client quote.",
    categories: {
      saas: "SaaS",
      "web-app": "Web apps",
      mobile: "Mobile",
      ai: "AI",
      commerce: "Commerce",
      data: "Data",
    },
    footer: {
      tagline: "Product engineering studio.",
      navigation: "Navigation",
      capabilities: "Capabilities",
      selectedWork: "Selected work",
      connect: "Connect",
      legal: "Legal",
      rights: "All rights reserved.",
      builtWith: "Built with Next.js. Designed and engineered in-house.",
    },
  },

  validation: {
    required: "This field is required",
    email: "Enter a valid email address",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be at most {max} characters",
    passwordWeak: "Use at least 8 characters, with a letter and a number",
    passwordMismatch: "Passwords don't match",
    phone: "Enter a valid phone number",
    url: "Enter a valid URL",
    number: "Enter a number",
  },

  errors: {
    generic: "Something went wrong. Please try again.",
    network: "Can't reach the server. Check your connection.",
    unauthorized: "You don't have access to this.",
    notFound: "We couldn't find what you were looking for.",
    validation: "Please check the highlighted fields.",
  },
};

export default en;
