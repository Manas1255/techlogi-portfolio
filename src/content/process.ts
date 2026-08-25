import { l } from "./localized";
import type { RawProcessStage } from "./schemas";

/**
 * HOW IT WORKS.
 *
 * Five stages, rewritten down from seven. The seven-stage version was accurate
 * and unreadable: it described the engagement from the inside, at the length
 * the people running it would want, and a visitor deciding whether to book a
 * call has to scroll past all of it. The stages that went were the ones a
 * buyer cannot act on before signing (Discover and Define collapsed into
 * "Scope", Engineer and Test into "Build"), not the ones that were untrue.
 *
 * Two constraints hold the shape:
 *
 *   · `what` is ONE sentence. These render in a compact row of cards, and the
 *     moment a card takes two sentences the row becomes a wall.
 *   · `receives` is one concrete artefact. A stage with no deliverable is a
 *     meeting, and a process section that lists meetings is describing its own
 *     overheads to someone who is buying an outcome.
 *
 * Stage one is a booked call rather than a form, which is the point of the
 * whole redesign: the first step in working with us is something the visitor
 * can complete in the next thirty seconds.
 */
export const processStages: RawProcessStage[] = [
  {
    id: "call",
    name: l("Book a call", "Gespräch buchen"),
    what: l(
      "Thirty minutes on what you're building. If we're not the right team for it, we say so on the call.",
      "Dreißig Minuten über das, was Sie bauen. Wenn wir nicht das richtige Team sind, sagen wir das im Gespräch.",
    ),
    receives: l(
      "A straight answer on fit, scope and rough budget",
      "Eine klare Antwort zu Passung, Umfang und grobem Budget",
    ),
    duration: l("30 min", "30 Min."),
    icon: "message-circle",
  },
  {
    id: "scope",
    name: l("Scope it", "Umfang festlegen"),
    what: l(
      "We turn the conversation into a written plan: what the first release contains, what it deliberately leaves out.",
      "Wir machen aus dem Gespräch einen schriftlichen Plan: was das erste Release enthält und was es bewusst weglässt.",
    ),
    receives: l(
      "A scoped plan and an estimate with its assumptions attached",
      "Ein festgelegter Umfang und eine Schätzung mit ihren Annahmen",
    ),
    duration: l("1–2 weeks", "1–2 Wochen"),
    icon: "compass",
  },
  {
    id: "design",
    name: l("Design", "Design"),
    what: l(
      "Flows, then screens, then a system, with the loading, empty and error states drawn before anything is built.",
      "Erst Abläufe, dann Screens, dann ein System, mit Lade-, Leer- und Fehlerzuständen, bevor irgendetwas gebaut wird.",
    ),
    receives: l(
      "A clickable prototype and a design system to extend",
      "Ein klickbarer Prototyp und ein Design-System zum Weiterbauen",
    ),
    duration: l("2–4 weeks", "2–4 Wochen"),
    icon: "pen-tool",
  },
  {
    id: "build",
    name: l("Build and review", "Bauen und prüfen"),
    what: l(
      "Two-week cycles, typed end to end. You get a running build at the end of every one, not a status update.",
      "Zwei-Wochen-Zyklen, durchgehend typisiert. Am Ende jedes Zyklus steht ein lauffähiger Stand, kein Statusbericht.",
    ),
    receives: l(
      "Working software you can use, every second week",
      "Software, die Sie benutzen können, alle zwei Wochen",
    ),
    duration: l("6–16 weeks", "6–16 Wochen"),
    icon: "code",
  },
  {
    id: "launch",
    name: l("Launch and support", "Launch und Betreuung"),
    what: l(
      "We ship it, watch it under real usage, and stay on. The weeks after go-live tell you more than the months before.",
      "Wir bringen es live, beobachten es unter echter Nutzung und bleiben dran. Die Wochen nach dem Go-live sagen mehr als die Monate davor.",
    ),
    receives: l(
      "A live product, a full handover, and a team still on it",
      "Ein Live-Produkt, eine vollständige Übergabe, und ein Team, das dranbleibt",
    ),
    duration: l("Ongoing", "Laufend"),
    icon: "rocket",
  },
];
