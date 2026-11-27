import { z } from "zod";

/** Áreas de conhecimento, espelham o "Mapa de temas". */
export const AREAS = [
  "fundamentals",
  "frontend",
  "backend",
  "security",
  "quality",
  "architecture",
  "ai",
  "career",
] as const;

export const LANGS = ["en", "pt"] as const;
export type Lang = (typeof LANGS)[number];

export const topicSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  area: z.enum(AREAS),
  /** Quanto o tema aparece em entrevistas (3 = muito). */
  interviewWeight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** Semana da trilha em que o tema é introduzido (1–8). */
  week: z.number().int().min(1).max(8),
});
export type Topic = z.infer<typeof topicSchema>;

const base = {
  id: z.string().regex(/^[a-z0-9-]+$/, "id em kebab-case"),
  topic: z.string(),
  title: z.string().min(3),
  /** Enunciado em "markdown leve": parágrafos, listas, `código` e blocos ```. */
  prompt: z.string().min(10),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  estimatedMin: z.number().int().min(1).max(60),
  tags: z.array(z.string()).default([]),
};

/*
 * Cada item tem os textos em inglês (principal) e um bloco `pt` com a tradução
 * dos mesmos campos. Código e testes não se traduzem.
 */

/** Opcional no ficheiro (pode vir de content/grading/rubric-keys.ts); buildContent exige que exista. */
const rubricKeys = z.array(z.array(z.string().min(1)).min(1)).min(2).max(6).optional();

export const conceptSchema = z.object({
  ...base,
  kind: z.literal("concept"),
  modelAnswer: z.string().min(20),
  /** Pontos que uma boa resposta precisa cobrir. */
  rubric: z.array(z.string()).min(2).max(6),
  /** Correção automática: por ponto da rubrica, expressões (EN e PT) que mostram que foi coberto. */
  rubricKeys,
  /** Pergunta extra que o entrevistador costuma fazer a seguir. */
  followUp: z.string().optional(),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    modelAnswer: z.string().min(20),
    rubric: z.array(z.string()).min(2).max(6),
    followUp: z.string().optional(),
  }),
});

export const quizSchema = z.object({
  ...base,
  kind: z.literal("quiz"),
  options: z.array(z.string()).min(2).max(6),
  answerIndex: z.number().int().min(0),
  explanation: z.string().min(10),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    options: z.array(z.string()).min(2).max(6),
    explanation: z.string().min(10),
  }),
});

export const codeTestSchema = z.object({
  name: z.string(),
  /** Corpo do teste. Pode usar `await` e `expect(...)`. */
  code: z.string(),
  hidden: z.boolean().default(false),
});

export const codeSchema = z.object({
  ...base,
  kind: z.literal("code"),
  language: z.enum(["ts", "js"]).default("ts"),
  starter: z.string(),
  solution: z.string(),
  tests: z.array(codeTestSchema).min(1),
  hints: z.array(z.string()).default([]),
  /** Explicação da solução, mostrada depois de resolver ou desistir. */
  explanation: z.string().optional(),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    hints: z.array(z.string()).default([]),
    explanation: z.string().optional(),
  }),
});

export const behavioralSchema = z.object({
  ...base,
  kind: z.literal("behavioral"),
  timeLimitSec: z.number().int().min(30).max(600).default(120),
  rubric: z.array(z.string()).min(2).max(6),
  rubricKeys,
  modelAnswer: z.string().min(20),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    rubric: z.array(z.string()).min(2).max(6),
    modelAnswer: z.string().min(20),
  }),
});

/*
 * Reel: a aula em formato vídeo curto vertical (cenas animadas + narração Kokoro pré-gerada).
 * Cada cena tem `say` (o que a voz diz) e um bloco `pt` com os mesmos campos de texto.
 * Em `say`, `|` marca "beats": o elemento k da cena aparece quando a voz chega ao beat k.
 */
const say = z.string().min(5).max(300);
const s = z.string().min(1);
const items = z.array(s).min(2).max(6);
const card = z.object({ front: s, back: s });

export const VISUAL_KINDS = ["request", "tree", "stack", "boxes"] as const;

export const reelSceneSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), say, headline: s, sub: s.optional(), pt: z.object({ say, headline: s, sub: s.optional() }) }),
  /** Caixas ligadas por setas que acendem uma a uma. */
  z.object({ type: z.literal("flow"), say, steps: items, pt: z.object({ say, steps: items }) }),
  /** Código "digitado"; `highlight` = linhas (1-based) que acendem no fim. */
  z.object({
    type: z.literal("code"),
    say,
    code: s,
    highlight: z.array(z.number().int().min(1)).default([]),
    pt: z.object({ say, code: s.optional() }),
  }),
  z.object({ type: z.literal("list"), say, items, pt: z.object({ say, items }) }),
  z.object({
    type: z.literal("compare"),
    say,
    left: z.object({ label: s, items: z.array(s).min(1).max(5) }),
    right: z.object({ label: s, items: z.array(s).min(1).max(5) }),
    pt: z.object({
      say,
      left: z.object({ label: s, items: z.array(s).min(1).max(5) }),
      right: z.object({ label: s, items: z.array(s).min(1).max(5) }),
    }),
  }),
  /**
   * Ilustração animada. `labels` = um passo por beat:
   * - request: nós do caminho (o pacote viaja de um ao outro e volta no fim);
   * - tree: nós da árvore; espaços no início = profundidade (`" head"` é filho do anterior com 0 espaços);
   * - stack: cada label faz push; `"-"` faz pop;
   * - boxes: `"nome = valor"` cria ou atualiza a caixa da variável.
   */
  z.object({
    type: z.literal("visual"),
    say,
    kind: z.enum(VISUAL_KINDS),
    labels: z.array(s).min(2).max(8),
    pt: z.object({ say, labels: z.array(s).min(2).max(8) }),
  }),
  /** Pergunta dentro do reel: só avança depois de acertar. `code` opcional = "prevê o output". */
  z.object({
    type: z.literal("quiz"),
    say,
    question: s,
    code: s.optional(),
    options: z.array(s).min(2).max(4),
    answerIndex: z.number().int().min(0),
    why: s,
    pt: z.object({ say, question: s, options: z.array(s).min(2).max(4), why: s }),
  }),
  /** Arrastar para pôr na ordem. `items` vem na ordem certa (o player embaralha). */
  z.object({
    type: z.literal("order"),
    say,
    question: s,
    items: z.array(s).min(3).max(5),
    why: s,
    pt: z.object({ say, question: s, items: z.array(s).min(3).max(5), why: s }),
  }),
  /** Completar o código: `code` tem exatamente um `___`, preenchido por `choices[answerIndex]`. */
  z.object({
    type: z.literal("fill"),
    say,
    question: s,
    code: s,
    choices: z.array(s).min(2).max(4),
    answerIndex: z.number().int().min(0),
    why: s,
    pt: z.object({ say, question: s, code: s.optional(), why: s }),
  }),
  /** Verdadeiro ou falso (swipe ou botões). */
  z.object({
    type: z.literal("truefalse"),
    say,
    statement: s,
    answer: z.boolean(),
    why: s,
    pt: z.object({ say, statement: s, why: s }),
  }),
  /** Cartas para virar; avança quando todas estiverem viradas. */
  z.object({
    type: z.literal("reveal"),
    say,
    cards: z.array(card).min(2).max(4),
    why: s,
    pt: z.object({ say, cards: z.array(card).min(2).max(4), why: s }),
  }),
]);
export type ReelScene = z.infer<typeof reelSceneSchema>;
export type ReelSceneInput = z.input<typeof reelSceneSchema>;

/** Aula curta: ensina antes de perguntar. Não entra na revisão espaçada. */
export const lessonSchema = z.object({
  ...base,
  kind: z.literal("lesson"),
  /** Corpo da aula (markdown leve). `prompt` é o resumo de uma linha. */
  body: z.string().min(50),
  keyPoints: z.array(z.string()).min(2).max(6),
  /** A aula em formato reel (obrigatório). Vive em content/reels/weekN.ts. */
  reel: z.array(reelSceneSchema).min(4).max(10),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    body: z.string().min(50),
    keyPoints: z.array(z.string()).min(2).max(6),
  }),
});

/**
 * Code review: o formato que está a substituir o live coding. O usuário marca as linhas com
 * problema; cada issue tem um comentário em inglês (o que se diria no PR), com tradução em `pt`.
 */
export const REVIEW_ISSUE_KINDS = ["bug", "security", "performance", "readability"] as const;
export const reviewSchema = z.object({
  ...base,
  kind: z.literal("review"),
  language: z.enum(["ts", "tsx", "js", "sql"]).default("ts"),
  /** Contexto do PR (ex.: "A teammate used AI to add an endpoint…"). */
  context: z.string().min(10),
  code: z.string().min(10),
  issues: z
    .array(z.object({ line: z.number().int().min(1), kind: z.enum(REVIEW_ISSUE_KINDS), comment: z.string().min(10) }))
    .min(1)
    .max(6),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    context: z.string().min(10),
    issues: z.array(z.object({ comment: z.string().min(10) })).min(1).max(6),
  }),
});

/** SQL de verdade, corrido no browser com PGlite e comparado com o resultado da `solution`. */
export const sqlSchema = z.object({
  ...base,
  kind: z.literal("sql"),
  dataset: z.enum(["shop", "blog"]),
  starter: z.string().default(""),
  solution: z.string().min(10),
  /** true = a ordem das linhas conta (a pergunta pede ORDER BY). */
  ordered: z.boolean().default(false),
  hints: z.array(z.string()).default([]),
  explanation: z.string().optional(),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    hints: z.array(z.string()).default([]),
    explanation: z.string().optional(),
  }),
});

export const exerciseSchema = z.discriminatedUnion("kind", [
  conceptSchema,
  quizSchema,
  codeSchema,
  behavioralSchema,
  lessonSchema,
  reviewSchema,
  sqlSchema,
]);

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseInput = z.input<typeof exerciseSchema>;
export type ExerciseKind = Exercise["kind"];
export type CodeExercise = z.infer<typeof codeSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type ReviewExercise = z.infer<typeof reviewSchema>;
export type SqlExercise = z.infer<typeof sqlSchema>;
export type CodeTest = z.infer<typeof codeTestSchema>;

export const termSchema = z.object({
  id: z.string().regex(/^term-[a-z0-9-]+$/),
  term: z.string(),
  topic: z.string(),
  definitionEn: z.string().min(10),
  definitionPt: z.string().min(10),
  /** Frase pronta para usar numa entrevista. */
  interviewLine: z.string().min(10),
  interviewLinePt: z.string().min(10),
});
export type Term = z.infer<typeof termSchema>;
export type TermInput = z.input<typeof termSchema>;

/** Tudo o que pode ir para uma sessão ou para o FSRS. */
export type StudyItem =
  | { type: "exercise"; id: string; exercise: Exercise }
  | { type: "term"; id: string; term: Term };

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
/** Exercício cuja tradução vive em content/translations/pt.ts (conteúdo antigo). */
export type LegacyExerciseInput = DistributiveOmit<ExerciseInput, "pt">;
/** Termo cuja frase PT vive em content/translations/pt.ts (conteúdo antigo). */
export type LegacyTermInput = Omit<TermInput, "interviewLinePt">;
/** Aula sem o reel — o reel é escrito à parte em content/reels/ e juntado em content/index.ts. */
export type LessonDraftInput = Omit<z.input<typeof lessonSchema>, "reel">;
