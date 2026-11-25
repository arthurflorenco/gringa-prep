@AGENTS.md

# gringa-prep — guia rápido para agentes

App de prática diária para entrevistas tech no exterior. UI em **pt-BR**, conteúdo (perguntas/respostas) em **inglês**.
Sem backend: tudo no browser (IndexedDB via Dexie). Open source (MIT), repo `arthurflorenco/gringa-prep`.

## Comandos
- `npm run dev` — dev server (porta 3000). `?date=AAAA-MM-DD` simula outro dia (guardado em sessionStorage).
- `npm run check` — typecheck (`next typegen` + tsc) · lint · content:check · vitest. **Correr antes de cada commit.**
- `npm test` / `npm run content:check` / `npm run build`.

## Mapa (leia só o que a tarefa precisa)
| Ficheiro | Papel |
| --- | --- |
| `content/topics.ts` | 22 temas, `week` 1–8, `interviewWeight` 1–3 |
| `content/exercises/*.ts` | exercícios (`ExerciseInput[]`). **Só abrir se a tarefa for de conteúdo** |
| `content/glossary/terms.ts` | termos (`id` começa por `term-`) |
| `content/index.ts` | junta tudo — registar aqui ficheiros novos |
| `src/lib/content/schema.ts` | schemas Zod: `concept`, `quiz`, `code`, `behavioral`, `term` |
| `src/lib/content/index.ts` | `getContent()` valida + indexa (`itemById`, `topicBySlug`) |
| `src/lib/daily/build-session.ts` | `buildDailySession()` pura/determinística; `weekFor()` |
| `src/lib/db/index.ts` | Dexie: `cards`(FSRS), `attempts`, `sessions`, `settings` |
| `src/lib/db/actions.ts` | `ensureSession`, `recordAttempt`, settings, backup export/import/reset |
| `src/lib/srs/index.ts` | wrapper ts-fsrs (`enable_short_term:false` → intervalos em dias) |
| `src/lib/runner/` | `harness.ts` (sucrase + mini `expect`, `sleep`), `worker.ts`, `run-in-worker.ts` (timeout 5s) |
| `src/lib/date.ts` | `Day` = "YYYY-MM-DD" local, `getToday`, `streak`, `nowOn` |
| `src/components/today-view.tsx` | tela Hoje: visão geral + modo foco |
| `src/components/player/*` | um player por tipo + `item-player.tsx` (dispatcher) + `rating-bar.tsx` |
| `src/app/*/page.tsx` | páginas finas (server) que renderizam views client |
| `tests/unit/*` | vitest (node + fake-indexeddb) |

## Fluxo de dados
`TodayView` → `ensureSession(day)` (cria 1×/dia: reviews vencidas ≤10, 3 termos, 2 learn [semana + tema "weak"], 1 code, 1 behavioral) →
o utilizador responde → `recordAttempt({itemId, day, rating 1–4, correct})` → grava attempt + reagenda card FSRS.
"Feito hoje" = existe attempt com esse `day`. Item visto = existe card.

## Receitas
- **Exercício novo**: adicionar objeto em `content/exercises/<area>.ts` (`id` kebab-case único, `topic` existente).
  `code` precisa de `starter`, `solution`, `tests[{name, code, hidden?}]` — os testes partilham escopo com o código e usam `expect`/`sleep`.
  CI exige: solution passa todos, starter falha. Evitar rejeições não tratadas nos testes (`p.catch(() => {})`).
- **Ficheiro de conteúdo novo**: importar em `content/index.ts`.
- **Página nova**: `src/app/<rota>/page.tsx` (server, `metadata`) + view client em `src/components/`; adicionar link em `site-header.tsx`.

## Convenções de UI
- Tokens em `src/app/globals.css` → classes `bg-bg`, `bg-surface`, `bg-surface-2`, `border-border`, `text-fg`, `text-muted`, `text-faint`, `text-accent`, `bg-success-soft`, `text-danger`… Nunca cores hex soltas.
- Fontes: `font-sans` (Geist), `font-mono` (labels/código), `font-serif` (títulos grandes, Instrument Serif).
- Primitivos em `src/components/ui.tsx` (`Button`, `Card`, `Pill`, `Kbd`, `Label`). Markdown leve com `<Md>`.
- Animação: `useEnter(deps)` + atributo `data-enter`; `pop(el)`. Respeitam reduced-motion.
- Atalhos: `useHotkeys({ "1": fn, "mod+enter": fn, space: fn })`.
- Strings de UI em `src/lib/i18n/pt.ts`.
- Nada de `Date`/`localStorage` no render do servidor: usar `useToday()` (null no SSR) e `useLiveQuery`.

## Next.js 16 — armadilhas
- `cacheComponents: true`; `params` é `Promise`; `PageProps<"/rota/[id]">` é global (precisa `next typegen`).
- Docs locais: `node_modules/next/dist/docs/` — consultar antes de usar APIs que não conheces.

## Não ler
`package-lock.json`, `.next/`, `node_modules/` (exceto docs do Next), `next-env.d.ts`.

## Git
- `main` = estável. Trabalhar em `dev` (ou `feat/*`) e abrir PR para `main`. Nunca commitar direto na `main`.
- Commits convencionais (`feat:`, `fix:`, `content:`, `docs:`).

## Roadmap
- F2: exercícios SQL com PGlite (joins, índices/EXPLAIN, RLS), mock interview ao fim de semana, conteúdo semanas 2–4.
- F3: feedback por IA opcional (chave Anthropic do utilizador, rota `/api/grade`), semanas 5–8, Playwright e2e, UI em EN.
