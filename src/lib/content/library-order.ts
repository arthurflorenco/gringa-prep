import type { Content } from "./index";
import type { Exercise } from "./schema";

/**
 * Ordem da Biblioteca (e da trilha): semana do tema → ordem do tema → ordem no conteúdo.
 * Partilhada pela página da biblioteca, pelo auto-avanço e pela sessão "Hoje".
 */
export function libraryOrder(content: Content): Exercise[] {
  const topicIdx = new Map(content.topics.map((t, i) => [t.slug, i]));
  const contentIdx = new Map(content.exercises.map((e, i) => [e.id, i]));
  const week = (slug: string) => content.topicBySlug.get(slug)?.week ?? 99;
  return [...content.exercises].sort(
    (a, b) =>
      week(a.topic) - week(b.topic) ||
      (topicIdx.get(a.topic) ?? 0) - (topicIdx.get(b.topic) ?? 0) ||
      // Dentro do tema, a aula vem primeiro.
      Number(b.kind === "lesson") - Number(a.kind === "lesson") ||
      (contentIdx.get(a.id) ?? 0) - (contentIdx.get(b.id) ?? 0),
  );
}

/**
 * Próximo item a fazer depois de `id`: o primeiro não feito a seguir na ordem;
 * se não houver, o primeiro não feito desde o início; `null` se está tudo feito.
 */
export function nextInLibrary(order: readonly { id: string }[], id: string | null, isDone: (id: string) => boolean): string | null {
  const at = id ? order.findIndex((e) => e.id === id) : -1;
  const after = order.slice(at + 1).find((e) => e.id !== id && !isDone(e.id));
  if (after) return after.id;
  return order.find((e) => e.id !== id && !isDone(e.id))?.id ?? null;
}
