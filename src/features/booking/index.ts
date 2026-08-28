/**
 * BOOKING, the site's primary conversion path.
 *
 * `features/inquiry` still exists and is still good: it is the secondary path,
 * for someone who would rather write a brief than talk. This feature is what
 * the page leads with.
 */
export { BookCallButton } from "./components/book-call-button";
export { CalEmbed } from "./components/cal-embed";
export { ConfidentialityNote } from "./components/confidentiality-note";
export { OfferCountdown } from "./components/offer-countdown";
export { useOfferCountdown } from "./hooks/use-offer-countdown";
export {
  useBookingHandoff,
  type BookingPrefill,
} from "./hooks/use-booking-handoff";
export { useOfferStore } from "./offer-store";
