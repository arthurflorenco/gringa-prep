import { z } from "zod";

/** Áreas de conhecimento, espelham o "Mapa de temas". */
export const AREAS = [
  "frontend",
  "backend",
  "security",
  "quality",
  "architecture",
  "ai",
  "career",
] as const;

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

export const conceptSchema = z.object({
  ...base,
  kind: z.literal("concept"),
  modelAnswer: z.string().min(20),
  /** Pontos que uma boa resposta precisa cobrir (autoavaliação). */
  rubric: z.array(z.string()).min(2).max(6),
  /** Pergunta extra que o entrevistador costuma fazer a seguir. */
  followUp: z.string().optional(),
});

export const quizSchema = z.object({
  ...base,
  kind: z.literal("quiz"),
  options: z.array(z.string()).min(2).max(6),
  answerIndex: z.number().int().min(0),
  explanation: z.string().min(10),
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
});

export const behavioralSchema = z.object({
  ...base,
  kind: z.literal("behavioral"),
  timeLimitSec: z.number().int().min(30).max(600).default(120),
  rubric: z.array(z.string()).min(2).max(6),
  modelAnswer: z.string().min(20),
});

export const exerciseSchema = z.discriminatedUnion("kind", [
  conceptSchema,
  quizSchema,
  codeSchema,
  behavioralSchema,
]);

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseInput = z.input<typeof exerciseSchema>;
export type ExerciseKind = Exercise["kind"];
export type CodeExercise = z.infer<typeof codeSchema>;
export type CodeTest = z.infer<typeof codeTestSchema>;

export const termSchema = z.object({
  id: z.string().regex(/^term-[a-z0-9-]+$/),
  term: z.string(),
  topic: z.string(),
  definitionEn: z.string().min(10),
  definitionPt: z.string().min(10),
  /** Frase pronta para usar numa entrevista. */
  interviewLine: z.string().min(10),
});
export type Term = z.infer<typeof termSchema>;
export type TermInput = z.input<typeof termSchema>;

/** Tudo o que pode ir para uma sessão ou para o FSRS. */
export type StudyItem =
  | { type: "exercise"; id: string; exercise: Exercise }
  | { type: "term"; id: string; term: Term };
