"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { attachQueryErrorReporting, getQueryClient } from "@/lib/query-client";

/**
 * THE single client boundary of the site, mounted once by the root layout.
 *
 * Everything that needs browser context lives here so the rest of the tree can
 * stay Server Components. Adding `"use client"` further down is almost always a
 * mistake, check whether the component really needs state or effects first.
 *
 * A marketing site has no session to bootstrap. React Query is still here
 * because the project inquiry is a real mutation with real pending/error states,
 * and `nuqs` because `/work`'s category filter belongs in the URL.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  // useState (not a module singleton) so React owns the instance across
  // Fast Refresh and Strict Mode double-invocation.
  const [queryClient] = useState(() => {
    const client = getQueryClient();
    attachQueryErrorReporting(client);
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
