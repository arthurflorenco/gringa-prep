import type { ExerciseInput } from "@/lib/content/schema";

export interface QuizText {
  title: string;
  prompt: string;
  options: string[];
  explanation: string;
}

/** Quiz compacto: textos EN + PT com o mesmo nº de opções; `answer` = índice da certa. */
export function quiz(topic: string, id: string, difficulty: 1 | 2 | 3, answer: number, en: QuizText, pt: QuizText, tags: string[] = []): ExerciseInput {
  return {
    id,
    kind: "quiz",
    topic,
    title: en.title,
    prompt: en.prompt,
    difficulty,
    estimatedMin: difficulty + 1,
    tags,
    options: en.options,
    answerIndex: answer,
    explanation: en.explanation,
    pt,
  };
}

type IssueKind = "bug" | "security" | "performance" | "readability";
export interface ReviewIssue {
  line: number;
  kind: IssueKind;
  en: string;
  pt: string;
}
export interface ReviewText {
  title: string;
  /** Contexto do PR. */
  context: string;
}

/**
 * Code review compacto. `code` é um array de linhas (a 1ª linha é a linha 1) para as issues
 * apontarem para a linha certa sem contar à mão.
 */
export function review(
  topic: string,
  id: string,
  difficulty: 1 | 2 | 3,
  language: "ts" | "tsx" | "js" | "sql",
  code: string[],
  issues: ReviewIssue[],
  en: ReviewText,
  pt: ReviewText,
  tags: string[] = [],
): ExerciseInput {
  return {
    id,
    kind: "review",
    topic,
    title: en.title,
    prompt: "Review this pull request. Click the lines you would comment on.",
    difficulty,
    estimatedMin: difficulty * 2 + 2,
    tags: ["code-review", ...tags],
    language,
    context: en.context,
    code: code.join("\n"),
    issues: issues.map(({ line, kind, en }) => ({ line, kind, comment: en })),
    pt: {
      title: pt.title,
      prompt: "Revise este pull request. Clique nas linhas que você comentaria.",
      context: pt.context,
      issues: issues.map((i) => ({ comment: i.pt })),
    },
  };
}

export interface SqlText {
  title: string;
  prompt: string;
  hints?: string[];
  explanation?: string;
}

/** Exercício de SQL digitado: a `solution` define o resultado esperado. */
export function sqlEx(
  topic: string,
  id: string,
  difficulty: 1 | 2 | 3,
  dataset: "shop" | "blog",
  solution: string,
  en: SqlText,
  pt: SqlText,
  opts: { ordered?: boolean; starter?: string } = {},
): ExerciseInput {
  return {
    id,
    kind: "sql",
    topic,
    title: en.title,
    prompt: en.prompt,
    difficulty,
    estimatedMin: difficulty * 2 + 2,
    tags: ["sql", "typing"],
    dataset,
    starter: opts.starter ?? "",
    solution,
    ordered: opts.ordered ?? false,
    hints: en.hints ?? [],
    explanation: en.explanation,
    pt: { title: pt.title, prompt: pt.prompt, hints: pt.hints ?? [], explanation: pt.explanation },
  };
}
