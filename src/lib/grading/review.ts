import type { Grade } from "ts-fsrs";
import { ratingFromScore } from "./written";

export interface ReviewGrade {
  /** Linhas com problema que o usuário marcou. */
  found: number[];
  /** Linhas com problema que ficaram por marcar. */
  missed: number[];
  /** Linhas marcadas que estavam boas. */
  falsePositives: number[];
  /** 0–1 */
  score: number;
  rating: Grade;
}

/** Nota de um code review: achados / total, com penalização de 0,25 por linha boa marcada. */
export function gradeReview(flagged: readonly number[], issueLines: readonly number[]): ReviewGrade {
  const issues = new Set(issueLines);
  const marked = new Set(flagged);
  const found = [...marked].filter((l) => issues.has(l)).sort((a, b) => a - b);
  const missed = [...issues].filter((l) => !marked.has(l)).sort((a, b) => a - b);
  const falsePositives = [...marked].filter((l) => !issues.has(l)).sort((a, b) => a - b);
  const score = Math.max(0, Math.min(1, found.length / Math.max(1, issues.size) - 0.25 * falsePositives.length));
  return { found, missed, falsePositives, score, rating: ratingFromScore(score) };
}
