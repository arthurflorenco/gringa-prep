@AGENTS.md

# gringa-prep — guia rápido para agentes

App de prática diária para entrevistas tech no exterior, **do zero ao nível júnior**. UI em **pt-BR**; todo o conteúdo existe em **EN e PT** (toggle por item, tecla `T`, padrão em Ajustes).
Sem backend: tudo no browser (IndexedDB via Dexie). Open source (MIT), repo `arthurflorenco/gringa-prep`.

## Comandos
- `npm run dev` — dev server (porta 3000). `?date=AAAA-MM-DD` simula outro dia (guardado em sessionStorage).
- `npm run check` — typecheck (`next typegen` + tsc) · lint · content:check · vitest. **Correr antes de cada commit.**
- `npm test` / `npm run content:check` / `npm run build`.

## Mapa (leia só o que a tarefa precisa)
| Ficheiro | Papel |
| --- | --- |
| `content/topics.ts` | 30 temas, `week` 1–8 (S1 web/HTML/CSS/Git → S8 testes/arquitetura); ordem = ordem das aulas |
| `content/lessons/week*.ts` | aulas (`kind: "lesson"`, tipo `LessonDraftInput`), ordem do array = ordem da trilha |
| `content/reels/week*.ts` | reel de cada aula (`id da aula → ReelSceneInput[]`), juntado em `content/index.ts` (`withReel`) |
| `content/exercises/*.ts` | exercícios (`ExerciseInput[]`). **Só abrir se a tarefa for de conteúdo** |
| `content/glossary/*.ts` | termos (`id` começa por `term-`, precisa `interviewLinePt`) |
| `content/translations/pt.ts` | PT dos exercícios/termos antigos (tipos `Legacy*Input`). Conteúdo novo traz `pt` inline |
| `content/index.ts` | junta tudo — registar aqui ficheiros novos |
| `src/lib/content/schema.ts` | schemas Zod: `lesson`, `concept`, `quiz`, `code`, `behavioral`, `term` — todos com bloco `pt` obrigatório |
| `src/lib/content/localize.ts` | `localize(ex, lang)` sobrepõe `ex.pt`; `titleOf` |
| `src/lib/use-content-lang.ts` | idioma global (localStorage `contentLang`, padrão `pt`) |
| `src/lib/content/index.ts` | `getContent()` valida + indexa (`itemById`, `topicBySlug`) |
| `src/lib/daily/build-session.ts` | `buildDailySession()` pura/determinística; `weekFor()` |
| `src/lib/db/index.ts` | Dexie: `cards`(FSRS), `attempts`, `sessions`, `settings` |
| `src/lib/db/actions.ts` | `ensureSession`, `recordAttempt`, settings, backup export/import/reset |
| `src/lib/srs/index.ts` | wrapper ts-fsrs (`enable_short_term:false` → intervalos em dias) |
| `src/lib/runner/` | `harness.ts` (sucrase + mini `expect`, `sleep`), `worker.ts`, `run-in-worker.ts` (timeout 5s) |
| `src/lib/date.ts` | `Day` = "YYYY-MM-DD" local, `getToday`, `streak`, `nowOn` |
| `src/components/today-view.tsx` | tela Hoje: visão geral + modo foco |
| `src/components/player/*` | um player por tipo + `item-player.tsx` (dispatcher) + `rating-bar.tsx` |
| `src/components/player/reel-*.tsx` | reel da aula: `reel-player.tsx` (motor: cenas, barras, controlos) + `reel-scenes.tsx` (uma cena animada por `type`) |
| `src/lib/narrator.ts` · `src/lib/reel.ts` | voz do browser (Web Speech API, prefs em localStorage `reelPrefs`) · duração das cenas (pura) |
| `src/app/*/page.tsx` | páginas finas (server) que renderizam views client |
| `tests/unit/*` | vitest (node + fake-indexeddb) |

## Fluxo de dados
`TodayView` → `ensureSession(day)` (cria 1×/dia: aula seguinte → reviews vencidas ≤10 → 3 termos (tema da aula primeiro) → 2 learn [tema da aula + tema "weak" já alcançado] → 1 code (mais fácil) → 1 behavioral) →
o utilizador responde → `recordAttempt({itemId, day, rating 1–4, correct})` → grava attempt + reagenda card FSRS.
"Feito hoje" = existe attempt com esse `day`. Item visto = tem card ou attempt. Aulas gravam attempt com `schedule:false` (sem card FSRS). `restartTrack(day)` muda `startDay` e refaz a sessão de hoje.

## Receitas
- **Aula nova**: objeto `kind: "lesson"` em `content/lessons/weekN.ts` (`body`, `keyPoints`, `pt{title,prompt,body,keyPoints}`) **e** o reel em `content/reels/weekN.ts` (obrigatório, 4–10 cenas).
  Cenas: `title`, `flow{steps}`, `code{code,highlight}`, `list{items}`, `compare{left,right}`, `quiz{question,options,answerIndex,why}`; cada uma com `say` (texto falado, sem crases) e `pt` com os mesmos campos de texto e o mesmo nº de itens. Pôr ≥1 `quiz`.
- **Exercício novo**: adicionar objeto em `content/exercises/<area>.ts` (`id` kebab-case único, `topic` existente, bloco `pt` com os mesmos campos de texto e o mesmo nº de itens em rubric/options/hints).
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
- Conteúdo: aulas das semanas 3–8 (só as semanas 1–2 têm aulas) e mais exercícios de iniciante nas semanas 3–4.
- F2: exercícios SQL com PGlite (joins, índices/EXPLAIN, RLS), mock interview ao fim de semana, conteúdo semanas 2–4.
- F3: feedback por IA opcional (chave Anthropic do utilizador, rota `/api/grade`), semanas 5–8, Playwright e2e, UI em EN.
