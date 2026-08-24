import type { TechGroup } from "./schemas";

/**
 * TECHNOLOGY.
 *
 * Grouped and reasoned, never a logo wall. Each group leads with why these
 * choices — technology is secondary to the outcome, and a list without an
 * argument is decoration.
 */
export const techGroups: TechGroup[] = [
  {
    id: "frontend",
    name: "Frontend",
    rationale:
      "Server-rendered by default, typed end to end, and shipped with as little JavaScript as the interaction actually requires.",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vite"],
  },
  {
    id: "backend",
    name: "Backend",
    rationale:
      "Boring, observable services. Durable workflows where an operation crosses a system boundary and cannot be retried by hand.",
    items: ["Node.js", "NestJS", "Python", "FastAPI", "Go", "GraphQL", "tRPC"],
  },
  {
    id: "mobile",
    name: "Mobile",
    rationale:
      "Cross-platform where the product is honestly one product; native where the hardware or the platform's conventions decide it.",
    items: ["Flutter", "React Native", "Swift", "Kotlin"],
  },
  {
    id: "data",
    name: "Data",
    rationale:
      "Relational until there is a reason not to be. Schemas are the contract, and migrations are reviewed like code.",
    items: ["PostgreSQL", "Redis", "ClickHouse", "Prisma", "Airflow", "dbt"],
  },
  {
    id: "cloud",
    name: "Cloud & Delivery",
    rationale:
      "Infrastructure as code, environments that match, and a rollback path that has been rehearsed rather than assumed.",
    items: ["AWS", "Azure", "Vercel", "Terraform", "Docker", "GitHub Actions"],
  },
  {
    id: "ai",
    name: "AI",
    rationale:
      "Evaluated before it ships, traced after it does, and never given more authority than the audit trail can justify.",
    items: [
      "OpenAI",
      "Anthropic",
      "LangGraph",
      "pgvector",
      "Model Context Protocol",
    ],
  },
];
