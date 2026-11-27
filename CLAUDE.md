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
| `content/exercises/*.ts` | exercícios (`ExerciseInput[]`); helpers `quiz()`, `review()`, `sqlEx()` em `_helpers.ts`. **Só abrir se a tarefa for de conteúdo** |
| `content/grading/rubric-keys.ts` | palavras-chave da correção automática dos conceitos/comportamentais antigos (os novos trazem `rubricKeys` inline) |
| `content/glossary/*.ts` | termos (`id` começa por `term-`, precisa `interviewLinePt`) |
| `content/translations/pt.ts` | PT dos exercícios/termos antigos (tipos `Legacy*Input`). Conteúdo novo traz `pt` inline |
| `content/index.ts` | junta tudo — registar aqui ficheiros novos |
| `src/lib/content/schema.ts` | schemas Zod: `lesson`, `concept`, `quiz`, `code`, `behavioral`, `term` — todos com bloco `pt` obrigatório |
| `src/lib/content/localize.ts` | `localize(ex, lang)` sobrepõe `ex.pt`; `titleOf` |
| `src/lib/use-content-lang.ts` | idioma global (localStorage `contentLang`, padrão `pt`) |
| `src/lib/content/index.ts` | `getContent()` valida + indexa (`itemById`, `topicBySlug`) |
| `src/lib/daily/build-session.ts` | `buildDailySession()` pura/determinística; `weekFor()`; segue o ritmo real (`progressWeek`, `recentTopic`) |
| `src/lib/content/library-order.ts` · `src/lib/use-progress.ts` | ordem da biblioteca + `nextInLibrary` · estado feito/a rever/novo por item (a partir de `attempts`) |
| `content/sql/datasets.ts` · `src/lib/sql/*` | bases `shop`/`blog` (DDL+seed) · PGlite: `engine.ts` (roda e compara, usado no worker e nos testes), `worker.ts`, `run-sql.ts` |
| `src/lib/speech.ts` · `src/components/speak-along.tsx` | pronúncia: `speechScript` (markdown → frases com `\|`), `pronunciationScripts` · ouvir frase a frase + gravar e comparar (MediaRecorder, em memória) |
| `src/lib/grading/*` | correção local: `written.ts` (rubrica por palavras-chave + dicas STAR/muletas/idioma), `review.ts` (achados − 0,25×falsos), `term-options.ts` (escolha múltipla dos termos) |
| `src/lib/db/index.ts` | Dexie: `cards`(FSRS), `attempts`, `sessions`, `settings` |
| `src/lib/db/actions.ts` | `ensureSession`, `recordAttempt`, settings, backup export/import/reset |
| `src/lib/srs/index.ts` | wrapper ts-fsrs (`enable_short_term:false` → intervalos em dias) |
| `src/lib/runner/` | `harness.ts` (sucrase + mini `expect`, `sleep`), `worker.ts`, `run-in-worker.ts` (timeout 5s) |
| `src/lib/date.ts` | `Day` = "YYYY-MM-DD" local, `getToday`, `streak`, `nowOn` |
| `src/components/today-view.tsx` | tela Hoje: visão geral + modo foco |
| `src/components/player/*` | um player por tipo + `item-player.tsx` (dispatcher) + `auto-result.tsx` (nota automática + Continuar; não há autoavaliação) |
| `src/components/player/reel-*.tsx` | reel da aula: `reel-player.tsx` (cenas, transições, XP/combo, legenda karaoke) · `use-reel-clock.ts` (toca o clip e dá `t` em ms) · `reel-scenes.tsx` (uma cena por `type`, reveladas pelos beats) · `reel-visuals.tsx` (cena `visual`) |
| `src/lib/reel-audio.ts` · `src/lib/reel.ts` | beats `\|`, `clipKey`, manifest, `revealTimes`, `wordTimes` (puro) · `isInteractive`, `revealUnits`, durações |
| `scripts/gen-reel-audio.ts` · `scripts/tts/kokoro_tts.py` | gera a narração Kokoro → `public/reel-audio/*.m4a` + `content/reels/audio-manifest.json` |
| `src/lib/narrator.ts` · `src/lib/reel-sfx.ts` | fallback Web Speech (clip em falta) + prefs `reelPrefs` · efeitos sonoros WebAudio |
| `src/app/*/page.tsx` | páginas finas (server) que renderizam views client |
| `tests/unit/*` | vitest (node + fake-indexeddb) |

## Fluxo de dados
`TodayView` → `ensureSession(day)` (cria 1×/dia, semana = max(calendário, tema mais avançado estudado): aula seguinte → reviews vencidas ≤10 → 3 termos (tema da aula primeiro) → 4 learn, ≤1 escrito [tema em foco + 1 tema "weak"] → prática: 1 para digitar (code/sql, alterna por dia) + 1 review → 1 behavioral) →
o utilizador responde → `recordAttempt({itemId, day, rating 1–4, correct})` → grava attempt + reagenda card FSRS.
Biblioteca (`/exercicio/[id]`): ao terminar segue sozinha para o próximo por fazer (`nextInLibrary`). "Feito hoje" = existe attempt com esse `day`. Item visto = tem card ou attempt. Aulas gravam attempt com `schedule:false` (sem card FSRS). `restartTrack(day)` muda `startDay` e refaz a sessão de hoje.

## Receitas
- **Aula nova**: objeto `kind: "lesson"` em `content/lessons/weekN.ts` (`body`, `keyPoints`, `pt{title,prompt,body,keyPoints}`) **e** o reel em `content/reels/weekN.ts` (obrigatório, 4–10 cenas).
  Cenas narradas: `title`, `flow{steps}`, `code{code,highlight}`, `list{items}`, `compare{left,right}`, `visual{kind: request|tree|stack|boxes, labels}`.
  Interativas (bloqueiam até responder, `why` é narrado no fim): `quiz{question,code?,options,answerIndex}`, `order{question,items na ordem certa}`, `fill{question,code com um ___,choices,answerIndex}`, `truefalse{statement,answer}`, `reveal{cards[{front,back}]}`.
  Cada cena tem `say` (texto falado, sem crases) e `pt` com os mesmos campos de texto e o mesmo nº de itens. Pôr ≥1 `quiz` e ≥1 outra interativa.
  **Beats**: `|` em `say` marca quando cada item aparece — nº de beats = 1, n ou n+1 (o 1º é introdução); EN e PT com o mesmo nº.
  Depois: `npm run reel:audio` (gera também a pronúncia EN das respostas-modelo, frases de entrevista e comentários de review) (precisa `brew install uv espeak-ng ffmpeg`) e commitar `public/reel-audio/` + o manifest. Sem clip, o reel usa a voz do browser (content:check avisa).
- **Exercício novo**: adicionar objeto em `content/exercises/<area>.ts` (`id` kebab-case único, `topic` existente, bloco `pt` com os mesmos campos de texto e o mesmo nº de itens em rubric/options/hints).
  Tipos: `quiz`, `code` (testes), `sql` (dataset + `solution`; o teste roda em PGlite), `review` (código + `issues[{line,kind,comment}]`, PT só traduz os comentários), `concept`/`behavioral`.
  Preferir quizzes (corrigem-se sozinhos). Temas `interviewWeight: 3` devem ter ≥12 itens. `concept`/`behavioral` só para perguntas clássicas de entrevista e **sempre com `rubricKeys`** (um array de expressões EN+PT por ponto da rubrica; teste exige que a resposta-modelo cubra ≥50%).
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
