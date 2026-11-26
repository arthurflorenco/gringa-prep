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

export const conceptSchema = z.object({
  ...base,
  kind: z.literal("concept"),
  modelAnswer: z.string().min(20),
  /** Pontos que uma boa resposta precisa cobrir (autoavaliação). */
  rubric: z.array(z.string()).min(2).max(6),
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
  modelAnswer: z.string().min(20),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    rubric: z.array(z.string()).min(2).max(6),
    modelAnswer: z.string().min(20),
  }),
});

/** Aula curta: ensina antes de perguntar. Não entra na revisão espaçada. */
export const lessonSchema = z.object({
  ...base,
  kind: z.literal("lesson"),
  /** Corpo da aula (markdown leve). `prompt` é o resumo de uma linha. */
  body: z.string().min(50),
  keyPoints: z.array(z.string()).min(2).max(6),
  pt: z.object({
    title: z.string().min(3),
    prompt: z.string().min(10),
    body: z.string().min(50),
    keyPoints: z.array(z.string()).min(2).max(6),
  }),
});

export const exerciseSchema = z.discriminatedUnion("kind", [
  conceptSchema,
  quizSchema,
  codeSchema,
  behavioralSchema,
  lessonSchema,
]);

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseInput = z.input<typeof exerciseSchema>;
export type ExerciseKind = Exercise["kind"];
export type CodeExercise = z.infer<typeof codeSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
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
