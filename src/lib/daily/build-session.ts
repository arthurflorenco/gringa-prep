import type { Content } from "@/lib/content";
import type { Exercise, Term } from "@/lib/content/schema";
import type { SessionEntry, TopicLevel } from "@/lib/db";
import { diffDays, type Day } from "@/lib/date";

export const SESSION_LIMITS = { reviews: 10, terms: 3, learn: 2 } as const;
export const TRACK_WEEKS = 8;

export interface BuildInput {
  day: Day;
  startDay: Day;
  content: Content;
  /** Itens já feitos pelo menos uma vez (têm card ou tentativa). */
  seenIds: ReadonlySet<string>;
  /** Cards vencidos neste dia, já ordenados do mais atrasado para o menos. */
  dueIds: readonly string[];
  topicLevels: Readonly<Record<string, TopicLevel>>;
}

export function weekFor(startDay: Day, day: Day): number {
  const d = Math.max(0, diffDays(startDay, day));
  return Math.min(TRACK_WEEKS, Math.floor(d / 7) + 1);
}

/**
 * Monta a sessão do dia — função pura e determinística. A sessão é gravada uma
 * vez por dia, por isso não muda à medida que o usuário responde.
 *
 * Ordem: aula do dia → revisão → termos → 2 conceitos (do tema da aula; um
 * deles de um tema fraco já estudado) → 1 código → 1 fala/escrita.
 */
export function buildDailySession(input: BuildInput): SessionEntry[] {
  const { day, startDay, content, seenIds, dueIds, topicLevels } = input;
  const week = weekFor(startDay, day);
  const topicIndex = new Map(content.topics.map((t, i) => [t.slug, i]));
  const weekOf = (slug: string) => content.topicBySlug.get(slug)?.week ?? TRACK_WEEKS;
  const order = (slug: string) => topicIndex.get(slug) ?? Number.MAX_SAFE_INTEGER;
  const contentOrder = new Map(content.exercises.map((e, i) => [e.id, i]));

  const entries: SessionEntry[] = [];
  const used = new Set<string>();
  const push = (itemId: string, section: SessionEntry["section"]) => {
    used.add(itemId);
    entries.push({ itemId, section });
  };
  const fresh = (x: { id: string }) => !seenIds.has(x.id) && !used.has(x.id);
  /** Pela ordem da trilha: semana, depois ordem do tema, depois ordem no conteúdo. */
  const byTrack = <T extends { id: string; topic: string }>(a: T, b: T) =>
    weekOf(a.topic) - weekOf(b.topic) || order(a.topic) - order(b.topic) || (contentOrder.get(a.id) ?? 0) - (contentOrder.get(b.id) ?? 0);
  const reached = (e: { topic: string }) => weekOf(e.topic) <= week;

  // 1. Aula do dia: a próxima não lida da semana; se a semana acabou, adianta a seguinte.
  const lessons = content.exercises.filter((e) => e.kind === "lesson" && fresh(e)).sort(byTrack);
  const lesson = lessons.find(reached) ?? lessons.find((e) => weekOf(e.topic) === week + 1);
  if (lesson) push(lesson.id, "lesson");
  const focusTopic = lesson?.topic;

  // 2. Revisão espaçada
  for (const id of dueIds.slice(0, SESSION_LIMITS.reviews)) {
    if (content.itemById.has(id) && !used.has(id)) push(id, "review");
  }

  // 3. Termos técnicos novos (do tema da aula primeiro, depois pela ordem da trilha)
  const termRank = (t: Term) => (t.topic === focusTopic ? -1 : 0);
  const terms = content.terms
    .filter((t) => fresh(t) && weekOf(t.topic) <= Math.max(week, focusTopic ? weekOf(focusTopic) : week))
    .sort((a, b) => termRank(a) - termRank(b) || weekOf(a.topic) - weekOf(b.topic) || order(a.topic) - order(b.topic));
  for (const t of terms.slice(0, SESSION_LIMITS.terms)) push(t.id, "terms");

  // 4. Conceitos / quiz
  const isLearn = (e: Exercise) => e.kind === "concept" || e.kind === "quiz";
  const learnPool = () => content.exercises.filter((e) => isLearn(e) && fresh(e)).sort(byTrack);

  const fromFocus = learnPool().find((e) => e.topic === focusTopic) ?? learnPool().find(reached);
  if (fromFocus) push(fromFocus.id, "learn");

  // Tema fraco — só entre os temas que a trilha já alcançou (sem saltar para RLS no dia 1).
  const weak = new Set(Object.entries(topicLevels).filter(([, l]) => l === "weak").map(([s]) => s));
  const second =
    learnPool().find((e) => weak.has(e.topic) && reached(e) && e.topic !== focusTopic) ??
    learnPool().find((e) => e.topic === focusTopic) ??
    learnPool().find(reached) ??
    learnPool()[0];
  if (second) push(second.id, "learn");

  // 5. Código: o mais fácil disponível, pela ordem da trilha
  const code = content.exercises
    .filter((e) => e.kind === "code" && fresh(e))
    .sort((a, b) => Number(!reached(a)) - Number(!reached(b)) || a.difficulty - b.difficulty || byTrack(a, b))[0];
  if (code) push(code.id, "practice");

  // 6. Falar / escrever em inglês (pitch e STAR, todos os dias)
  const speak = content.exercises.filter((e) => e.kind === "behavioral" && fresh(e)).sort(byTrack)[0];
  if (speak) push(speak.id, "speak");

  return entries;
}
