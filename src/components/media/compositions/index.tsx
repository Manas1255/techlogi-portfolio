import type { Composition } from "@/content/schemas";
import { AgentConsoleComposition } from "./agent-console";
import { AnalyticsComposition } from "./analytics";
import { CommerceComposition } from "./commerce";
import { DataPipelineComposition } from "./data-pipeline";
import { MobileFieldComposition } from "./mobile-field";
import { OpsBoardComposition } from "./ops-board";

/**
 * The composition registry.
 *
 * Synthetic interfaces exist so the site can show software behaving like
 * software before a single client asset is cleared for publication. They are
 * real DOM built from semantic tokens, which means they adapt to the ink or
 * bone ground they land on — something a screenshot can't do — and they stay
 * crisp at any size.
 *
 * They are placeholders with a defined exit: change a media entry's `kind` from
 * "synthetic" to "image" or "video" in `src/content/projects.ts` and real media
 * takes over with no markup change.
 */
const REGISTRY: Record<
  Composition,
  (props: { animate?: boolean }) => React.JSX.Element
> = {
  analytics: AnalyticsComposition,
  "agent-console": AgentConsoleComposition,
  "ops-board": OpsBoardComposition,
  "data-pipeline": DataPipelineComposition,
  commerce: CommerceComposition,
  "mobile-field": MobileFieldComposition,
};

export function SyntheticComposition({
  composition,
  animate = true,
}: {
  composition: Composition;
  animate?: boolean;
}) {
  const Component = REGISTRY[composition];
  return <Component animate={animate} />;
}
