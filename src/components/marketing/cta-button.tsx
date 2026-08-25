import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * THE MARKETING CALL TO ACTION.
 *
 * Separate from `ui/button` on purpose, and not a fork of it. The shadcn
 * button is the dashboard scale the shared catalog was built against: its
 * largest size is 36px tall, which is right in a toolbar beside a table and
 * visibly under-weight as the primary action of a hero. Restyling it through
 * tokens could not fix that, because the problem is the scale itself, and
 * editing `ui/` is how a shadcn upgrade turns into a merge conflict.
 *
 * So this is the marketing scale: a pill, 44px and 52px tall, both at or above
 * the comfortable touch target with no `tap-target` help needed.
 *
 * `primary` is the brass fill and there is one per view. The whole point of an
 * accent this saturated is that it marks the single next action; a page with
 * three brass pills has none. Everything else is `outline` or `quiet`, which
 * are drawn in hairlines and read as available rather than as urged.
 */
const ctaVariants = cva(
  "group/cta press focus-visible:outline-ring inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-offset-3 active:translate-y-px disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Brass fill, ink type. On the slab `--primary` resolves to brand-400
           and `--primary-foreground` to ink, so the same class is a gold
           button on graphite there and a deep brass button on paper here,
           without either site knowing which ground it landed on. */
        primary:
          "bg-primary text-primary-foreground shadow-[0_1px_0_0_color-mix(in_oklab,#fff_28%,transparent)_inset] hover:bg-[color-mix(in_oklab,var(--primary),var(--foreground)_12%)]",
        outline:
          "border-hairline-strong text-foreground hover:border-foreground/45 hover:bg-foreground/[0.045] border",
        quiet:
          "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.045]",
      },
      size: {
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-[3.25rem] px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface CtaButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof ctaVariants> {
  asChild?: boolean;
}

export function CtaButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: CtaButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="cta"
      className={cn(ctaVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { ctaVariants };
