import type { Topic } from "@/lib/content/schema";

/**
 * Trilha "do zero ao nível de entrevista" — 8 semanas.
 * A ordem dentro de cada semana é a ordem das aulas.
 * Para contribuir: adicione um tema aqui e crie aulas/exercícios em content/.
 */
export const topics: Topic[] = [
  // Semana 1 — Como a web funciona, HTML, CSS, terminal e Git
  { slug: "web-basics", name: "Como a web funciona", area: "fundamentals", interviewWeight: 2, week: 1 },
  { slug: "html", name: "HTML: estrutura de uma página", area: "fundamentals", interviewWeight: 2, week: 1 },
  { slug: "css-basics", name: "CSS básico: seletores, box model, flexbox", area: "fundamentals", interviewWeight: 2, week: 1 },
  { slug: "terminal-git", name: "Terminal e Git básico", area: "fundamentals", interviewWeight: 2, week: 1 },
  { slug: "pitch", name: "Pitch pessoal e dos projetos", area: "career", interviewWeight: 3, week: 1 },
  { slug: "behavioral-star", name: "Perguntas comportamentais (STAR)", area: "career", interviewWeight: 3, week: 1 },

  // Semana 2 — JavaScript do zero
  { slug: "js-basics", name: "JavaScript: variáveis, tipos e operadores", area: "fundamentals", interviewWeight: 3, week: 2 },
  { slug: "js-control-flow", name: "JavaScript: if, else e loops", area: "fundamentals", interviewWeight: 3, week: 2 },
  { slug: "js-functions", name: "JavaScript: funções", area: "fundamentals", interviewWeight: 3, week: 2 },

  // Semana 3 — Arrays, objetos, DOM
  { slug: "js-data-structures", name: "JavaScript: arrays, objetos e imutabilidade", area: "frontend", interviewWeight: 3, week: 3 },
  { slug: "js-closures-scope", name: "JavaScript: escopo, closures e this", area: "frontend", interviewWeight: 3, week: 3 },
  { slug: "dom-events", name: "DOM e eventos", area: "frontend", interviewWeight: 2, week: 3 },

  // Semana 4 — Assíncrono e HTTP
  { slug: "js-event-loop", name: "JavaScript assíncrono: promises, async/await, event loop", area: "frontend", interviewWeight: 3, week: 4 },
  { slug: "rest-http", name: "HTTP, APIs REST e códigos de status", area: "backend", interviewWeight: 3, week: 4 },
  { slug: "node-api", name: "Node.js: criar uma API (rotas, middleware, validação)", area: "backend", interviewWeight: 3, week: 4 },

  // Semana 5 — TypeScript e React
  { slug: "typescript", name: "TypeScript básico", area: "frontend", interviewWeight: 3, week: 5 },
  { slug: "react-hooks", name: "React: componentes, props, state e hooks", area: "frontend", interviewWeight: 3, week: 5 },

  // Semana 6 — Next.js e layout
  { slug: "nextjs-rendering", name: "Next.js: server vs client, SSR e SSG", area: "frontend", interviewWeight: 3, week: 6 },
  { slug: "css-layout", name: "Tailwind e layout responsivo", area: "frontend", interviewWeight: 2, week: 6 },

  // Semana 7 — Dados, back-end e segurança
  { slug: "sql-joins", name: "SQL básico e joins", area: "backend", interviewWeight: 3, week: 7 },
  { slug: "sql-transactions", name: "SQL: chaves, constraints e transações (ACID)", area: "backend", interviewWeight: 3, week: 7 },
  { slug: "data-modeling", name: "Modelagem de dados (1:N, N:N)", area: "backend", interviewWeight: 3, week: 7 },
  { slug: "authn-authz", name: "Autenticação vs autorização", area: "security", interviewWeight: 3, week: 7 },
  { slug: "rls", name: "Row Level Security (Postgres/Supabase)", area: "security", interviewWeight: 3, week: 7 },
  { slug: "web-security", name: "Segurança web (OWASP, tokens, segredos)", area: "security", interviewWeight: 2, week: 7 },
  { slug: "db-indexes", name: "Índices, paginação e EXPLAIN", area: "backend", interviewWeight: 3, week: 7 },

  // Semana 8 — Qualidade, arquitetura e IA
  { slug: "testing", name: "Testes (unitário, integração, e2e)", area: "quality", interviewWeight: 3, week: 8 },
  { slug: "git-ci", name: "Pull requests e CI/CD", area: "quality", interviewWeight: 2, week: 8 },
  { slug: "web-performance", name: "Performance e acessibilidade web", area: "frontend", interviewWeight: 2, week: 8 },
  { slug: "tradeoffs", name: "Decisões técnicas e trade-offs", area: "architecture", interviewWeight: 3, week: 8 },
  { slug: "soft-delete-audit", name: "Soft delete e log de auditoria", area: "architecture", interviewWeight: 3, week: 8 },
  { slug: "ai-safety", name: "IA no desenvolvimento: rever código gerado", area: "ai", interviewWeight: 3, week: 8 },
  { slug: "ai-llm-basics", name: "LLMs no produto: tokens, contexto, alucinação, custo", area: "ai", interviewWeight: 3, week: 8 },
  { slug: "ai-rag", name: "RAG: embeddings e busca vetorial", area: "ai", interviewWeight: 3, week: 8 },
  { slug: "ai-product", name: "Construir features de IA: prompts, tools, evals, guardrails", area: "ai", interviewWeight: 3, week: 8 },
];
