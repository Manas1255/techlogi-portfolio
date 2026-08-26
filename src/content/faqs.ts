import type { Localized } from "./localized";
import { l } from "./localized";

/**
 * FAQ.
 *
 * Placed immediately before the closing inquiry, because that is where the
 * doubt is. The research on B2B buying is blunt about which question matters
 * most: across 28 types of information a buyer looks for, PRICE ranked highest
 * by a wide margin, and most studio sites withhold it entirely. So it is first,
 * and it is answered with real numbers rather than "it depends".
 *
 * Every answer here is either a fact about how GA Code works or an honest
 * "here is how we would find out". Nothing claims a result.
 */
export interface RawFaq {
  question: Localized;
  answer: Localized;
}

export const faqs: RawFaq[] = [
  {
    question: l("What does a project cost?", "Was kostet ein Projekt?"),
    answer: l(
      "Most work lands between $5k and $25k, depending on how much of it there is rather than how long we spend. A focused mobile app or a marketing site sits at the lower end; a multi-role platform with payments, real-time features and a backend sits at the upper end. We give you a written number with its assumptions attached, so if something changes you can see exactly which assumption moved.",
      "Die meisten Projekte liegen zwischen 5.000 und 25.000 $, abhängig vom Umfang und nicht von der Dauer. Eine fokussierte App oder eine Marketing-Website liegt am unteren Ende; eine Plattform mit mehreren Rollen, Zahlungen, Echtzeit-Funktionen und Backend am oberen. Sie bekommen eine schriftliche Zahl mit ihren Annahmen, damit Sie bei einer Änderung genau sehen, welche Annahme sich bewegt hat.",
    ),
  },
  {
    question: l("How long does it take?", "Wie lange dauert es?"),
    answer: l(
      "Discovery is one to two weeks. A first release is usually six to sixteen weeks after that, depending on scope. You get a deployed environment updated every iteration from early on, so you are never waiting until the end to see whether it is going well.",
      "Die Discovery dauert ein bis zwei Wochen. Ein erstes Release folgt meist sechs bis sechzehn Wochen später, je nach Umfang. Sie bekommen früh eine deployte Umgebung, die jede Iteration aktualisiert wird, und warten nie bis zum Ende, um zu sehen, ob es gut läuft.",
    ),
  },
  {
    question: l(
      "I am not technical. Is that a problem?",
      "Ich bin nicht technisch. Ist das ein Problem?",
    ),
    answer: l(
      "No, and it is the normal case. You know what the software needs to do and what is going wrong today; that is the part nobody else can supply. We handle the translation into architecture and technology choices, and we explain the decisions that affect your budget or your timeline in plain language rather than asking you to approve a stack diagram.",
      "Nein, und es ist der Normalfall. Sie wissen, was die Software können muss und was heute schiefgeht; genau das kann niemand sonst liefern. Die Übersetzung in Architektur und Technologie übernehmen wir, und Entscheidungen, die Ihr Budget oder Ihren Zeitplan betreffen, erklären wir in normaler Sprache, statt Sie ein Stack-Diagramm freigeben zu lassen.",
    ),
  },
  {
    question: l("Who owns the code?", "Wem gehört der Code?"),
    answer: l(
      "You do, from the first commit. It is your repository, your infrastructure accounts and your app store listings. We work inside them rather than handing something over at the end, which also means you are never locked in: if you want to take the project elsewhere, there is nothing to extract.",
      "Ihnen, ab dem ersten Commit. Es ist Ihr Repository, Ihre Infrastruktur-Zugänge und Ihre Store-Einträge. Wir arbeiten darin, statt Ihnen am Ende etwas zu übergeben, und damit gibt es auch keine Bindung: Wenn Sie das Projekt woanders fortsetzen wollen, ist nichts herauszulösen.",
    ),
  },
  {
    question: l("What happens after launch?", "Was passiert nach dem Launch?"),
    answer: l(
      "We stay on unless you would rather we did not. The weeks after launch tell you more than the months before it, so there is a post-launch review against the measures we agreed before starting, and a backlog built from what real usage revealed rather than from the original plan. Retained capacity or a clean handover, decided up front rather than at the end.",
      "Wir bleiben dran, sofern Sie das möchten. Die Wochen nach dem Launch sagen mehr als die Monate davor, deshalb gibt es eine Nachbetrachtung an den vorher vereinbarten Maßstäben und ein Backlog aus dem, was echte Nutzung gezeigt hat, statt aus dem ursprünglichen Plan. Feste Kapazität oder saubere Übergabe, vorab entschieden statt am Ende.",
    ),
  },
  {
    question: l(
      "What if I already have an app or a website?",
      "Was, wenn ich schon eine App oder Website habe?",
    ),
    answer: l(
      "Then we usually do not rebuild it. Most products that matter already exist, and a rewrite is the pitch that gets abandoned halfway. We measure a baseline first, then work in phases with a running system at every step, whether that is performance, the flows where people give up, or making it safe to change.",
      "Dann bauen wir sie meistens nicht neu. Die meisten Produkte, auf die es ankommt, existieren bereits, und ein Neuschrieb ist der Vorschlag, der auf halbem Weg abgebrochen wird. Wir messen zuerst einen Ausgangswert und arbeiten dann in Phasen mit einem laufenden System bei jedem Schritt, ob es um Performance geht, um die Stellen, an denen Nutzer aufgeben, oder darum, Änderungen wieder sicher zu machen.",
    ),
  },
  {
    question: l(
      "What technologies do you work in?",
      "Mit welchen Technologien arbeiten Sie?",
    ),
    answer: l(
      "Flutter for mobile, Next.js and React for web, Node.js with MongoDB or PostgreSQL behind both. For AI work, vision models and LLM integrations that run behind your own permissions with a trace of every call. We pick from what we have shipped rather than what is new, and where your team already runs something well, we work in it instead of around it.",
      "Flutter für Mobile, Next.js und React fürs Web, Node.js mit MongoDB oder PostgreSQL dahinter. Für KI-Arbeit Vision-Modelle und LLM-Integrationen, die hinter Ihren eigenen Rechten laufen, mit einer Spur zu jedem Aufruf. Wir wählen aus dem, was wir ausgeliefert haben, statt aus dem, was neu ist, und wo Ihr Team etwas bereits gut betreibt, arbeiten wir darin statt daran vorbei.",
    ),
  },
  {
    question: l(
      "How do we work together day to day?",
      "Wie arbeiten wir im Alltag zusammen?",
    ),
    answer: l(
      "One named person is accountable for the engagement end to end, and you talk to the people writing the code rather than through an account manager. Two-week iterations, notes on what shipped and what moved, and access to the repository throughout.",
      "Eine namentlich benannte Person ist von Anfang bis Ende verantwortlich, und Sie sprechen mit den Menschen, die den Code schreiben, nicht über eine Kundenbetreuung. Zwei-Wochen-Iterationen, Notizen dazu, was ausgeliefert wurde und was sich bewegt hat, und durchgehender Zugriff auf das Repository.",
    ),
  },
];
