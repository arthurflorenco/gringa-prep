import type { Topic } from "@/lib/content/schema";

/**
 * Trilha "Frontend / Full-stack" de 8 semanas.
 * Para contribuir: adicione um tema aqui e crie exercícios em content/exercises/<slug>.ts.
 */
export const topics: Topic[] = [
  // Semana 1 — JavaScript core + pitch
  { slug: "js-event-loop", name: "JavaScript: event loop e async/await", area: "frontend", interviewWeight: 3, week: 1 },
  { slug: "js-closures-scope", name: "JavaScript: closures, escopo e this", area: "frontend", interviewWeight: 3, week: 1 },
  { slug: "js-data-structures", name: "JavaScript: arrays, objetos e imutabilidade", area: "frontend", interviewWeight: 2, week: 1 },
  { slug: "pitch", name: "Pitch pessoal e dos projetos", area: "career", interviewWeight: 3, week: 1 },
  { slug: "behavioral-star", name: "Perguntas comportamentais (STAR)", area: "career", interviewWeight: 3, week: 1 },

  // Semana 2 — TypeScript + React
  { slug: "typescript", name: "TypeScript: type vs interface, unknown, generics", area: "frontend", interviewWeight: 3, week: 2 },
  { slug: "react-hooks", name: "React: hooks e renderização", area: "frontend", interviewWeight: 3, week: 2 },

  // Semana 3 — Next.js + HTTP
  { slug: "nextjs-rendering", name: "Next.js: server vs client, SSR e SSG", area: "frontend", interviewWeight: 3, week: 3 },
  { slug: "rest-http", name: "APIs REST e códigos de status", area: "backend", interviewWeight: 2, week: 3 },
  { slug: "css-layout", name: "CSS, Tailwind e layout responsivo", area: "frontend", interviewWeight: 2, week: 3 },

  // Semana 4 — Dados
  { slug: "sql-joins", name: "SQL básico e joins", area: "backend", interviewWeight: 3, week: 4 },
  { slug: "data-modeling", name: "Modelagem de dados (1:N, N:N)", area: "backend", interviewWeight: 3, week: 4 },

  // Semana 5 — Segurança
  { slug: "authn-authz", name: "Autenticação vs autorização", area: "security", interviewWeight: 3, week: 5 },
  { slug: "rls", name: "Row Level Security (Postgres/Supabase)", area: "security", interviewWeight: 3, week: 5 },
  { slug: "web-security", name: "Segurança web (OWASP, tokens, segredos)", area: "security", interviewWeight: 2, week: 5 },

  // Semana 6 — Qualidade
  { slug: "testing", name: "Testes (unitário, integração, e2e)", area: "quality", interviewWeight: 3, week: 6 },
  { slug: "git-ci", name: "Git, pull requests e CI/CD", area: "quality", interviewWeight: 2, week: 6 },

  // Semana 7 — Performance
  { slug: "web-performance", name: "Performance e acessibilidade web", area: "frontend", interviewWeight: 2, week: 7 },
  { slug: "db-indexes", name: "Índices, paginação e EXPLAIN", area: "backend", interviewWeight: 3, week: 7 },

  // Semana 8 — Arquitetura e IA
  { slug: "tradeoffs", name: "Decisões técnicas e trade-offs", area: "architecture", interviewWeight: 3, week: 8 },
  { slug: "soft-delete-audit", name: "Soft delete e log de auditoria", area: "architecture", interviewWeight: 3, week: 8 },
  { slug: "ai-safety", name: "IA no produto e no desenvolvimento", area: "ai", interviewWeight: 3, week: 8 },
];
