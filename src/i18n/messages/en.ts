/**
 * SOURCE CATALOG — the single source of truth for every user-facing string.
 *
 * Add new keys HERE first; TypeScript then forces every other locale catalog to
 * add them too (each is declared `satisfies Messages`), so a translation can
 * never silently go missing.
 *
 * Interpolate with `{name}` placeholders: `t("dashboard.welcome", { name })`.
 *
 * ⚠️ Deliberately NOT `as const`. The key PATHS are what `MessageKey` is built
 * from, and those stay literal either way — but `as const` would also make each
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
    work: "Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    primary: "Primary",
    skipToContent: "Skip to content",
  },

  inquiry: {
    trigger: "Start a Project",
    title: "Start a project",
    subtitle: "Four short steps. You can close this and pick it up later.",
    privacy:
      "We use these details to reply to your inquiry, and nothing else. No list, no sequence, no sharing.",
    steps: {
      build: "What you're building",
      brief: "The brief",
      scope: "Scope",
      contact: "Your details",
    },
    step1: {
      title: "What would you like to build?",
      lead: "Pick the closest one. You can explain the specifics next.",
    },
    step2: {
      title: "Tell us about it",
      lead: "The problem you're solving matters more than the feature list.",
    },
    step3: {
      title: "Timing and scope",
      lead: "Rough is fine. It helps us tell you quickly whether we're a fit.",
    },
    step4: {
      title: "Where do we reply?",
      lead: "One person, one reply — no sequence, no sales team.",
    },
    fields: {
      description: {
        label: "What are you building?",
        hint: "A few sentences is plenty. What exists today, and what should change?",
        placeholder:
          "We run scheduling across eleven clinics in three spreadsheets. We need one system our coordinators can actually use…",
      },
      services: {
        label: "Where do you need help?",
        hint: "Optional. Choose as many as apply, or none.",
      },
      timeline: { label: "When would you want to start?" },
      budget: {
        label: "Approximate budget",
        hint: "A range, not a commitment. It tells us what shape of team fits.",
      },
      name: { label: "Your name" },
      company: { label: "Company (optional)" },
      email: { label: "Email" },
      phone: { label: "Phone (optional)" },
    },
    attachment: {
      label: "Attachment (optional)",
      choose: "Attach a brief or spec",
      hint: "PDF, image or Word document, up to {max}.",
      remove: "Remove {name}",
      tooLarge:
        "That file is larger than {max}. Try a smaller one, or send it in your reply.",
    },
    actions: {
      back: "Back",
      next: "Continue",
      submit: "Send inquiry",
      submitting: "Sending…",
    },
    success: {
      title: "Inquiry sent",
      heading: "Thanks — that's with us.",
      body: "A person reads every inquiry. You'll hear back at the address you gave us, and you can always reach us directly at {email}.",
      close: "Close",
      another: "Send another",
    },
    error: {
      title: "That didn't send.",
    },
    validation: {
      descriptionShort: "A sentence or two more, so we can reply usefully",
    },
  },

  site: {
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
    placeholderTestimonial: "Placeholder — awaiting an approved client quote.",
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
