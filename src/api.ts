/**
 * A read-only index of the whole backend surface.
 *
 * It re-exports each feature's endpoint constants, it never restates a path,
 * so there is still exactly one source of truth per endpoint, while this file
 * answers "what does this app call?" in one place.
 *
 * GA Studio's site is almost entirely static: the only thing it sends anywhere
 * is a project inquiry.
 */

export * from "@/features/inquiry/constants";
