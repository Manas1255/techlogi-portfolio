import { l } from "./localized";
import type { RawTechGroup } from "./schemas";

/**
 * TECHNOLOGY.
 *
 * Grouped and reasoned, never a logo wall. Each group leads with why these
 * choices, technology is secondary to the outcome, and a list without an
 * argument is decoration.
 */
export const techGroups: RawTechGroup[] = [
  {
    id: "frontend",
    name: l("Frontend", "Frontend"),
    rationale: l(
      "Server-rendered by default, typed end to end, and shipped with as little JavaScript as the interaction actually requires.",
      "Standardmäßig serverseitig gerendert, durchgehend typisiert, und mit so wenig JavaScript ausgeliefert, wie die Interaktion tatsächlich braucht.",
    ),
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vite"],
  },
  {
    id: "backend",
    name: l("Backend", "Backend"),
    rationale: l(
      "Boring, observable services. Durable workflows where an operation crosses a system boundary and cannot be retried by hand.",
      "Langweilige, beobachtbare Services. Dauerhafte Abläufe dort, wo eine Operation eine Systemgrenze überschreitet und sich nicht von Hand wiederholen lässt.",
    ),
    items: ["Node.js", "NestJS", "Python", "FastAPI", "Go", "GraphQL", "tRPC"],
  },
  {
    id: "mobile",
    name: l("Mobile", "Mobile"),
    rationale: l(
      "Cross-platform where the product is honestly one product; native where the hardware or the platform's conventions decide it.",
      "Plattformübergreifend, wo es ehrlicherweise ein Produkt ist; nativ, wo die Hardware oder die Konventionen der Plattform es entscheiden.",
    ),
    items: ["Flutter", "React Native", "Swift", "Kotlin"],
  },
  {
    id: "data",
    name: l("Data", "Daten"),
    rationale: l(
      "Relational until there is a reason not to be. Schemas are the contract, and migrations are reviewed like code.",
      "Relational, bis es einen Grund dagegen gibt. Schemata sind der Vertrag, und Migrationen werden wie Code geprüft.",
    ),
    items: ["PostgreSQL", "Redis", "ClickHouse", "Prisma", "Airflow", "dbt"],
  },
  {
    id: "cloud",
    name: l("Cloud & Delivery", "Cloud & Delivery"),
    rationale: l(
      "Infrastructure as code, environments that match, and a rollback path that has been rehearsed rather than assumed.",
      "Infrastruktur als Code, Umgebungen, die zusammenpassen, und ein Rollback-Weg, der geprobt und nicht angenommen wurde.",
    ),
    items: ["AWS", "Azure", "Vercel", "Terraform", "Docker", "GitHub Actions"],
  },
  {
    id: "ai",
    name: l("AI", "KI"),
    rationale: l(
      "Evaluated before it ships, traced after it does, and never given more authority than the audit trail can justify.",
      "Vor dem Ausliefern bewertet, danach nachverfolgt, und nie mit mehr Befugnis ausgestattet, als die Nachvollziehbarkeit rechtfertigt.",
    ),
    items: [
      "OpenAI",
      "Anthropic",
      "LangGraph",
      "pgvector",
      "Model Context Protocol",
    ],
  },
];
