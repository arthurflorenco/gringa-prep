import type { Content } from "@/lib/content";
import type { Exercise, Term } from "@/lib/content/schema";
import type { SessionEntry, TopicLevel } from "@/lib/db";
import { diffDays, type Day } from "@/lib/date";

export const SESSION_LIMITS = { reviews: 10, terms: 3, learn: 4, written: 1 } as const;
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
  /**
   * Ritmo real: semana do tema mais avançado já estudado (ex.: pela Biblioteca).
   * A sessão usa o maior entre isto e a semana do calendário.
   */
  progressWeek?: number;
  /** Tema da tentativa mais recente — foco quando já não há aula nova. */
  recentTopic?: string;
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
  const { day, startDay, content, seenIds, dueIds, topicLevels, progressWeek = 0, recentTopic } = input;
  const week = Math.min(TRACK_WEEKS, Math.max(weekFor(startDay, day), progressWeek));
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
  const focusTopic = lesson?.topic ?? recentTopic;

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

  // 4. Conceitos / quiz: até 4, no máximo 1 escrito (os quizzes corrigem-se sozinhos e treinam mais).
  //    Ordem de preferência: tema em foco → temas fracos já alcançados → resto da trilha alcançada.
  const isLearn = (e: Exercise) => e.kind === "concept" || e.kind === "quiz";
  const weak = new Set(Object.entries(topicLevels).filter(([, l]) => l === "weak").map(([s]) => s));
  const rank = (e: Exercise) => (e.topic === focusTopic ? 0 : weak.has(e.topic) && reached(e) ? 1 : reached(e) ? 2 : 3);
  const candidates = content.exercises.filter((e) => isLearn(e) && fresh(e));
  // Só temas já alcançados pela trilha (sem saltar para RLS no dia 1), salvo se não houver mais nada.
  const reachedPool = candidates.filter((e) => reached(e) || e.topic === focusTopic);
  const learnPool = (reachedPool.length ? reachedPool : candidates).sort((a, b) => rank(a) - rank(b) || byTrack(a, b));
  // Um lugar garantido para um tema fraco (logo a seguir ao primeiro do tema em foco).
  const weakIdx = learnPool.findIndex((e) => rank(e) === 1);
  if (weakIdx > 1) learnPool.splice(1, 0, ...learnPool.splice(weakIdx, 1));
  let written = 0;
  let learned = 0;
  for (const e of learnPool) {
    if (learned >= SESSION_LIMITS.learn) break;
    if (!fresh(e)) continue;
    if (e.kind === "concept") {
      if (written >= SESSION_LIMITS.written) continue;
      written++;
    }
    push(e.id, "learn");
    learned++;
  }

  // 5. Prática de entrevista: 1 para digitar (código JS/TS ou SQL, alternando pelo dia) + 1 code review.
  //    O mais fácil disponível, pela ordem da trilha.
  const easiest = (kinds: Exercise["kind"][]) =>
    content.exercises
      .filter((e) => kinds.includes(e.kind) && fresh(e))
      .sort((a, b) => Number(!reached(a)) - Number(!reached(b)) || a.difficulty - b.difficulty || byTrack(a, b))[0];
  const sqlDay = diffDays(startDay, day) % 2 === 1;
  const typed = easiest(sqlDay ? ["sql"] : ["code"]) ?? easiest(["code", "sql"]);
  if (typed) push(typed.id, "practice");
  const review = easiest(["review"]);
  if (review) push(review.id, "practice");

  // 6. Falar / escrever em inglês (pitch e STAR, todos os dias)
  const speak = content.exercises.filter((e) => e.kind === "behavioral" && fresh(e)).sort(byTrack)[0];
  if (speak) push(speak.id, "speak");

  return entries;
}
