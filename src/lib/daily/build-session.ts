import type { Content } from "@/lib/content";
import type { Exercise, Term } from "@/lib/content/schema";
import type { SessionEntry, TopicLevel } from "@/lib/db";
import { diffDays, type Day } from "@/lib/date";

export const SESSION_LIMITS = { reviews: 10, terms: 3 } as const;
export const TRACK_WEEKS = 8;

export interface BuildInput {
  day: Day;
  startDay: Day;
  content: Content;
  /** Itens que já têm card (já foram vistos pelo menos uma vez). */
  seenIds: ReadonlySet<string>;
  /** Cards vencidos neste dia, já ordenados do mais atrasado para o menos. */
  dueIds: readonly string[];
  topicLevels: Readonly<Record<string, TopicLevel>>;
}

export function weekFor(startDay: Day, day: Day): number {
  const d = Math.max(0, diffDays(startDay, day));
  return Math.min(TRACK_WEEKS, Math.floor(d / 7) + 1);
}

/** Roda a lista para que cada dia comece num tema diferente da semana. */
function rotate<T>(list: T[], by: number): T[] {
  if (list.length === 0) return list;
  const k = ((by % list.length) + list.length) % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
}

/**
 * Monta a sessão do dia. É uma função pura e determinística: as mesmas entradas
 * dão sempre a mesma sessão. A sessão é gravada uma vez por dia, por isso não
 * muda à medida que o usuário responde.
 */
export function buildDailySession(input: BuildInput): SessionEntry[] {
  const { day, startDay, content, seenIds, dueIds, topicLevels } = input;
  const week = weekFor(startDay, day);
  const dayIndex = Math.max(0, diffDays(startDay, day));
  const weekOf = (slug: string) => content.topicBySlug.get(slug)?.week ?? TRACK_WEEKS;
  const weightOf = (slug: string) => content.topicBySlug.get(slug)?.interviewWeight ?? 1;

  const entries: SessionEntry[] = [];
  const used = new Set<string>();
  const push = (itemId: string, section: SessionEntry["section"]) => {
    used.add(itemId);
    entries.push({ itemId, section });
  };
  const fresh = <T extends { id: string }>(x: T) => !seenIds.has(x.id) && !used.has(x.id);

  // 1. Revisão espaçada
  for (const id of dueIds.slice(0, SESSION_LIMITS.reviews)) {
    if (content.itemById.has(id)) push(id, "review");
  }

  // Temas da semana atual, rodados pelo dia
  const weekTopics = rotate(
    content.topics.filter((t) => t.week === week).map((t) => t.slug),
    dayIndex,
  );
  const topicRank = (slug: string) => {
    const i = weekTopics.indexOf(slug);
    return i === -1 ? weekTopics.length + weekOf(slug) : i;
  };
  const byWeekThenRotation = <T extends { topic: string }>(a: T, b: T) =>
    weekOf(a.topic) <= week && weekOf(b.topic) <= week
      ? topicRank(a.topic) - topicRank(b.topic) || weekOf(a.topic) - weekOf(b.topic)
      : weekOf(a.topic) - weekOf(b.topic);

  // 2. Termos técnicos novos
  const terms: Term[] = content.terms.filter((t) => fresh(t) && weekOf(t.topic) <= week).sort(byWeekThenRotation);
  for (const t of terms.slice(0, SESSION_LIMITS.terms)) push(t.id, "terms");

  // 3. Conceitos: 1 do tema da semana + 1 de um tema fraco
  const isLearn = (e: Exercise) => e.kind === "concept" || e.kind === "quiz";
  const learnPool = content.exercises.filter((e) => isLearn(e) && fresh(e));
  const thisWeek = learnPool.filter((e) => weekOf(e.topic) <= week).sort(byWeekThenRotation)[0];
  if (thisWeek) push(thisWeek.id, "learn");

  const weakSlugs = new Set(Object.entries(topicLevels).filter(([, l]) => l === "weak").map(([s]) => s));
  const weakPick =
    learnPool
      .filter((e) => fresh(e) && weakSlugs.has(e.topic))
      .sort((a, b) => weightOf(b.topic) - weightOf(a.topic) || weekOf(a.topic) - weekOf(b.topic))[0] ??
    // Sem temas fracos marcados: puxa o próximo tema mais cobrado em entrevista
    learnPool.filter((e) => fresh(e) && e.topic !== thisWeek?.topic).sort((a, b) => weekOf(a.topic) - weekOf(b.topic) || weightOf(b.topic) - weightOf(a.topic))[0];
  if (weakPick) push(weakPick.id, "learn");

  // 4. Prática de código
  const codePick = content.exercises
    .filter((e) => e.kind === "code" && fresh(e))
    .sort(byWeekThenRotation)[0];
  if (codePick) push(codePick.id, "practice");

  // 5. Falar / escrever em inglês
  const speakPick = content.exercises.filter((e) => e.kind === "behavioral" && fresh(e)).sort(byWeekThenRotation)[0];
  if (speakPick) push(speakPick.id, "speak");

  return entries;
}
