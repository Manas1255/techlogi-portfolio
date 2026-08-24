import { CalendarClock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The direct-booking path, offered beside the inquiry form rather than instead
 * of it.
 *
 * The trade is real and not settled by data: a form captures the lead even from
 * someone who will not commit to a slot at first contact, while booking
 * collapses response time to zero for someone who will. Offering the form as
 * primary and this as secondary keeps both, and costs one line of text.
 *
 * Renders nothing until a URL is configured. A dead link to a booking page that
 * does not exist is worse than no link, and this is exactly the kind of thing
 * that ships half-finished.
 */
export function BookingLink({ className }: { className?: string }) {
  const { url, label } = siteConfig.booking;
  if (url === null) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "tap-target border-hairline hover:border-hairline-strong focus-visible:outline-ring inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-colors duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      <CalendarClock aria-hidden="true" className="text-primary size-4" />
      {label}
    </a>
  );
}
