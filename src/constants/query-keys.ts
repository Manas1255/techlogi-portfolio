/**
 * Centralized React Query cache keys.
 *
 * Always import from here, an inline `queryKey: ["inquiry"]` typo silently
 * breaks cache sharing and invalidation, and nothing fails loudly.
 *
 * Shape convention per resource:
 *   all              → invalidate everything for the resource
 *   list(params)     → a filtered/paginated list
 *   detail(id)       → one entity
 */

export const QUERY_KEYS = {
  inquiry: {
    all: ["inquiry"] as const,
    submit: () => [...QUERY_KEYS.inquiry.all, "submit"] as const,
  },
} as const;

/**
 * Params any paginated list accepts.
 *
 * No index signature on purpose: a domain that needs extra filters declares its
 * own `interface XListParams extends ListParams { status?: string }` and passes
 * it as a variable, which is assignable without weakening this type for everyone.
 */
export interface ListParams {
  page?: number;
  q?: string;
  sort?: string;
}

/**
 * Helper the `domain` generator uses so every resource gets an identical key
 * shape without repeating the boilerplate.
 */
export function resourceKeys<const T extends string>(resource: T) {
  const all = [resource] as const;
  return {
    all,
    list: (params?: ListParams) => [...all, "list", params ?? {}] as const,
    detail: (id: string) => [...all, "detail", id] as const,
  };
}
