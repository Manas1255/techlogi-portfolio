/**
 * COUNTRY CALLING CODES for the phone field's picker.
 *
 * ISO 3166-1 alpha-2 paired with its ITU calling code. Names are NOT here on
 * purpose: `Intl.DisplayNames` already knows every country in both languages
 * this site speaks, so hardcoding seventy names would be seventy strings to
 * translate, keep in step, and eventually get wrong. The runtime has them, and
 * it has them right.
 *
 * The list is CURATED, not exhaustive, and that is a real limitation worth
 * knowing about: it covers Europe, North America, the larger Latin American,
 * Asian, Middle Eastern and African markets, and Oceania. Every code in it was
 * checked; nothing was guessed to pad the list out, because a wrong dial code
 * is worse than an absent one. Someone whose country is missing can still type
 * their full international number into the field beside it, which the schema
 * accepts.
 *
 * DACH leads, because this is a German-first site and those are the three the
 * majority of visitors need. Everything after is alphabetical BY LOCALISED
 * NAME, sorted at render time, so the German list reads in German order.
 *
 * `+1` appears twice, for the US and Canada, which is correct: they share a
 * calling code. Options are keyed by ISO code rather than dial code so the two
 * stay distinct, and parsing a stored `+1…` resolves to the first match.
 */
export interface DialCode {
  /** ISO 3166-1 alpha-2. The option's value, and the key for `Intl`. */
  readonly iso: string;
  /** ITU calling code, with its leading plus. */
  readonly dial: string;
}

export const DIAL_CODES: readonly DialCode[] = [
  // DACH first: the site's own market.
  { iso: "DE", dial: "+49" },
  { iso: "AT", dial: "+43" },
  { iso: "CH", dial: "+41" },

  // Rest of Europe.
  { iso: "AL", dial: "+355" },
  { iso: "BA", dial: "+387" },
  { iso: "BE", dial: "+32" },
  { iso: "BG", dial: "+359" },
  { iso: "BY", dial: "+375" },
  { iso: "CY", dial: "+357" },
  { iso: "CZ", dial: "+420" },
  { iso: "DK", dial: "+45" },
  { iso: "EE", dial: "+372" },
  { iso: "ES", dial: "+34" },
  { iso: "FI", dial: "+358" },
  { iso: "FR", dial: "+33" },
  { iso: "GB", dial: "+44" },
  { iso: "GR", dial: "+30" },
  { iso: "HR", dial: "+385" },
  { iso: "HU", dial: "+36" },
  { iso: "IE", dial: "+353" },
  { iso: "IS", dial: "+354" },
  { iso: "IT", dial: "+39" },
  { iso: "LT", dial: "+370" },
  { iso: "LU", dial: "+352" },
  { iso: "LV", dial: "+371" },
  { iso: "MD", dial: "+373" },
  { iso: "ME", dial: "+382" },
  { iso: "MK", dial: "+389" },
  { iso: "MT", dial: "+356" },
  { iso: "NL", dial: "+31" },
  { iso: "NO", dial: "+47" },
  { iso: "PL", dial: "+48" },
  { iso: "PT", dial: "+351" },
  { iso: "RO", dial: "+40" },
  { iso: "RS", dial: "+381" },
  { iso: "RU", dial: "+7" },
  { iso: "SE", dial: "+46" },
  { iso: "SI", dial: "+386" },
  { iso: "SK", dial: "+421" },
  { iso: "TR", dial: "+90" },
  { iso: "UA", dial: "+380" },

  // Americas.
  { iso: "US", dial: "+1" },
  { iso: "CA", dial: "+1" },
  { iso: "AR", dial: "+54" },
  { iso: "BR", dial: "+55" },
  { iso: "CL", dial: "+56" },
  { iso: "CO", dial: "+57" },
  { iso: "MX", dial: "+52" },
  { iso: "PE", dial: "+51" },

  // Middle East and Africa.
  { iso: "AE", dial: "+971" },
  { iso: "BH", dial: "+973" },
  { iso: "DZ", dial: "+213" },
  { iso: "EG", dial: "+20" },
  { iso: "ET", dial: "+251" },
  { iso: "GH", dial: "+233" },
  { iso: "IL", dial: "+972" },
  { iso: "JO", dial: "+962" },
  { iso: "KE", dial: "+254" },
  { iso: "KW", dial: "+965" },
  { iso: "LB", dial: "+961" },
  { iso: "MA", dial: "+212" },
  { iso: "NG", dial: "+234" },
  { iso: "OM", dial: "+968" },
  { iso: "QA", dial: "+974" },
  { iso: "SA", dial: "+966" },
  { iso: "TN", dial: "+216" },
  { iso: "TZ", dial: "+255" },
  { iso: "UG", dial: "+256" },
  { iso: "ZA", dial: "+27" },

  // Asia and Oceania.
  { iso: "AU", dial: "+61" },
  { iso: "BD", dial: "+880" },
  { iso: "CN", dial: "+86" },
  { iso: "HK", dial: "+852" },
  { iso: "ID", dial: "+62" },
  { iso: "IN", dial: "+91" },
  { iso: "JP", dial: "+81" },
  { iso: "KR", dial: "+82" },
  { iso: "LK", dial: "+94" },
  { iso: "MY", dial: "+60" },
  { iso: "NZ", dial: "+64" },
  { iso: "PH", dial: "+63" },
  { iso: "PK", dial: "+92" },
  { iso: "SG", dial: "+65" },
  { iso: "TH", dial: "+66" },
  { iso: "VN", dial: "+84" },
];

/** The studio's own country, so the common case is one interaction fewer. */
export const DEFAULT_DIAL_ISO = "DE";

/**
 * Split a stored number back into a country and a national part.
 *
 * LONGEST PREFIX WINS, and that is the whole subtlety: `+1` is a prefix of
 * nothing here, but `+4` would match Germany, Austria and the UK if this
 * compared shortest-first, so a saved `+44 20…` would come back as Germany
 * with a national number of `4 20…`. Sorting by length before matching is what
 * keeps a restored draft showing the country the visitor actually chose.
 */
export function splitDialCode(value: string): {
  iso: string;
  nationalNumber: string;
} {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) {
    const byLongestDial = [...DIAL_CODES].sort(
      (a, b) => b.dial.length - a.dial.length,
    );
    const match = byLongestDial.find((entry) => trimmed.startsWith(entry.dial));
    if (match !== undefined) {
      return {
        iso: match.iso,
        nationalNumber: trimmed.slice(match.dial.length).trim(),
      };
    }
  }
  return { iso: DEFAULT_DIAL_ISO, nationalNumber: trimmed };
}

/** Join a country and a national number back into what the payload carries. */
export function joinDialCode(iso: string, nationalNumber: string): string {
  const national = nationalNumber.trim();
  if (national === "") return "";
  const entry = DIAL_CODES.find((item) => item.iso === iso);
  return entry === undefined ? national : `${entry.dial} ${national}`;
}
