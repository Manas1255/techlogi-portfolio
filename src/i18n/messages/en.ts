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
    subtitle:
      "Three short steps. Close it any time — we'll keep what you typed.",
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
      lead: "One person reads your message and replies. No call centre, no sales sequence.",
    },
    fields: {
      description: {
        label: "The project, in your words",
        hint: "A few sentences is plenty. What happens today, and what should change?",
        placeholder:
          "We run scheduling for eleven clinics across three spreadsheets, and our coordinators waste hours on it every week…",
      },
      services: {
        label: "Where do you need help?",
        hint: "Optional. Choose as many as apply, or none.",
      },
      timeline: { label: "When would you like to start? (optional)" },
      budget: {
        label: "Rough budget (optional)",
        hint: "A range is fine, and it isn't a quote or a commitment — it just tells us what size of team fits. If you'd rather not say, that's genuinely fine.",
      },
      name: { label: "Your name" },
      company: { label: "Company (optional)" },
      email: { label: "Email" },
      phone: { label: "Phone (optional)" },
    },
    attachment: {
      label: "Attach a file (optional)",
      choose: "Choose a file",
      hint: "Anything that helps — a document, a sketch, a screenshot. Up to {max}.",
      remove: "Remove {name}",
      tooLarge:
        "That file is bigger than {max}. Try a smaller one, or send it when we reply.",
    },
    actions: {
      back: "Back",
      next: "Continue",
      change: "Change",
      submit: "Send it",
      submitting: "Sending…",
    },
    success: {
      title: "Message sent",
      heading: "Thanks — that's with us.",
      body: "A person reads every message and replies within one business day. You can also reach us directly at {email}.",
      close: "Close",
      another: "Send another",
    },
    error: {
      title: "That didn't send.",
    },
    quick: {
      title: "Start a project",
      lead: "Four fields. A person reads every one, and replies within a business day.",
      buildTypeLabel: "What can we help you build?",
      buildTypePlaceholder: "Pick whichever is closest",
      messageLabel: "Anything we should know? (optional)",
      messagePlaceholder:
        "What you want it to do matters more than what it's called.",
      submit: "Send inquiry",
      submitting: "Sending…",
      successTitle: "Thanks — that's with us.",
      successBody:
        "You'll hear back at the address you gave us. You can always reach us directly at {email}.",
      privacy:
        "We use these details to reply, and nothing else. No list, no sequence.",
    },
    validation: {
      descriptionShort:
        "A sentence or two more, so we can give you a useful reply",
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
