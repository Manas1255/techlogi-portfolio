/**
 * THE ONE PLACE ON THIS SITE THAT WRITES A HEX OUTSIDE `globals.css`.
 *
 * Cal.com renders in an IFRAME, so this site's tokens stop at the document
 * boundary: the embed cannot read `--raised` or `--brand-400` however they are
 * declared. The only seam is `cssVarsPerTheme`, which hands literal values
 * across. Left alone, Cal paints its own white card with a green availability
 * dot, which is what both the inline scheduler and the overlay did on first
 * switch-on.
 *
 * It lives in its own module because there are TWO Cal instances and they are
 * easy to forget about separately. `CalEmbed` mounts the inline scheduler on
 * namespace `closing`; `BookCallButton` binds the overlay on namespace `book`,
 * and a `ui` call only ever reaches the namespace it names. The overlay
 * shipped unthemed for exactly that reason: the scheduler was fixed, looked
 * right, and the button three sections above it still opened a white modal.
 *
 * Keep these in step with the `[data-surface="slab"]` block in `globals.css`.
 * Both grounds get the same map because the theme is pinned to dark rather
 * than following the visitor: the inline embed only ever sits on the closing
 * section's ink, and the overlay opens over a dimmed page.
 */
export const CAL_SLAB_VARS = {
  "cal-brand": "#dfb04a", // --brand-400
  "cal-brand-emphasis": "#e9c676", // --brand-300
  "cal-brand-text": "#14100a", // --primary-foreground: ink on brass, not white
  "cal-bg": "#161c24", // --raised, so the iframe matches the card it sits in
  "cal-bg-emphasis": "#222a35", // --accent
  "cal-bg-subtle": "#1b2029", // --muted
  "cal-bg-muted": "#1e252f", // --secondary
  "cal-bg-inverted": "#eef1f5",
  "cal-text": "#eef1f5", // --foreground
  "cal-text-emphasis": "#eef1f5",
  "cal-text-subtle": "#99a3b2", // --muted-foreground, 6.7:1 on the slab
  "cal-text-muted": "#99a3b2",
  "cal-text-inverted": "#0d1117",
  "cal-border": "#ffffff1a", // --hairline
  "cal-border-subtle": "#ffffff1a",
  "cal-border-emphasis": "#ffffff33", // --hairline-strong
  /*
    Transparent, not a hairline. This is the outline Cal draws around the WHOLE
    booker, and the inline embed already sits inside the closing section's own
    rounded card: drawn, it reads as a frame inside a frame, inset by a few
    pixels on every side. The vertical rules BETWEEN the three panes are
    `cal-border` above and stay, because they are doing real work.
  */
  "cal-border-booker": "transparent",
} as const;

/**
 * What both instances pass to `cal("ui", …)`.
 *
 * `month_view` with the event-details pane VISIBLE is the shape the closing
 * section is built around: given enough width Cal opens into three panes
 * (details, month, times). It only does that above ~1024px of iframe width,
 * which is why the copy sits above the card rather than beside it; see the
 * note in `book-a-call.tsx`.
 *
 * The details pane repeats what the section already says, but it also carries
 * the TIMEZONE control, and a German reader checking that 15:00 means 15:00
 * where they are is the one question this embed has to be able to answer. Cal
 * renders that pane in English whatever the locale, which is a known wart and
 * not fixable from here: `?locale=de` was tried against the live booker and
 * changed nothing.
 */
export const CAL_UI_CONFIG = {
  theme: "dark",
  cssVarsPerTheme: { light: CAL_SLAB_VARS, dark: CAL_SLAB_VARS },
  hideEventTypeDetails: false,
  layout: "month_view",
} as const;
