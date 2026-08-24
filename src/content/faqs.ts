/**
 * FAQ.
 *
 * Placed immediately before the closing inquiry, because that is where the
 * doubt is. The research on B2B buying is blunt about which question matters
 * most: across 28 types of information a buyer looks for, PRICE ranked highest
 * by a wide margin, and most studio sites withhold it entirely. So it is first,
 * and it is answered with real numbers rather than "it depends".
 *
 * Every answer here is either a fact about how GA Studio works or an honest
 * "here is how we would find out". Nothing claims a result.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What does a project cost?",
    answer:
      "Most work lands between $5k and $25k, depending on how much of it there is rather than how long we spend. A focused mobile app or a marketing site sits at the lower end; a multi-role platform with payments, real-time features and a backend sits at the upper end. We give you a written number with its assumptions attached, so if something changes you can see exactly which assumption moved.",
  },
  {
    question: "How long does it take?",
    answer:
      "Discovery is one to two weeks. A first release is usually six to sixteen weeks after that, depending on scope. You get a deployed environment updated every iteration from early on, so you are never waiting until the end to see whether it is going well.",
  },
  {
    question: "I am not technical. Is that a problem?",
    answer:
      "No, and it is the normal case. You know what the software needs to do and what is going wrong today; that is the part nobody else can supply. We handle the translation into architecture and technology choices, and we explain the decisions that affect your budget or your timeline in plain language rather than asking you to approve a stack diagram.",
  },
  {
    question: "Who owns the code?",
    answer:
      "You do, from the first commit. It is your repository, your infrastructure accounts and your app store listings. We work inside them rather than handing something over at the end, which also means you are never locked in: if you want to take the project elsewhere, there is nothing to extract.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We stay on unless you would rather we did not. The weeks after launch tell you more than the months before it, so there is a post-launch review against the measures we agreed before starting, and a backlog built from what real usage revealed rather than from the original plan. Retained capacity or a clean handover, decided up front rather than at the end.",
  },
  {
    question: "What if I already have an app or a website?",
    answer:
      "Then we usually do not rebuild it. Most products that matter already exist, and a rewrite is the pitch that gets abandoned halfway. We measure a baseline first, then work in phases with a running system at every step, whether that is performance, the flows where people give up, or making it safe to change.",
  },
  {
    question: "What technologies do you work in?",
    answer:
      "Flutter for mobile, Next.js and React for web, Node.js with MongoDB or PostgreSQL behind both. For AI work, vision models and LLM integrations that run behind your own permissions with a trace of every call. We pick from what we have shipped rather than what is new, and where your team already runs something well, we work in it instead of around it.",
  },
  {
    question: "How do we work together day to day?",
    answer:
      "One named person is accountable for the engagement end to end, and you talk to the people writing the code rather than through an account manager. Two-week iterations, notes on what shipped and what moved, and access to the repository throughout.",
  },
];
