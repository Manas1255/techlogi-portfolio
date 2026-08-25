import { AppLink as Link } from "@/components/layout/app-link";
import { Button } from "@/components/ui/button";
import { APP_ROUTES, HOME_ROUTE } from "@/constants";

/**
 * 404. A Server Component, so the copy can't come from the client-only `t()`,
 * this is one of the few places English lives in a page file. When you add a
 * second locale, move these strings behind a server-side translator.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-eyebrow text-brand-500">404</p>
      <h1 className="text-display-2 max-w-xl text-balance">
        That page isn&apos;t here.
      </h1>
      <p className="text-marketing-body text-muted-foreground max-w-md">
        The link may be out of date, or the page may have moved. The work is a
        good place to pick up again.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href={APP_ROUTES.work}>Explore our work</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href={HOME_ROUTE}>Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
