import type { Lang, Term } from "@/lib/content/schema";

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * Escolha múltipla para um termo: a definição certa + 3 de outros termos
 * (do mesmo tema/área primeiro), em ordem determinística.
 */
export function termOptions(term: Term, all: readonly Term[], lang: Lang, areaOf: (topic: string) => string | undefined) {
  const def = (t: Term) => (lang === "pt" ? t.definitionPt : t.definitionEn);
  const others = all.filter((t) => t.id !== term.id && def(t) !== def(term));
  const score = (t: Term) => (t.topic === term.topic ? 0 : areaOf(t.topic) === areaOf(term.topic) ? 1 : 2);
  const distractors = [...others].sort((a, b) => score(a) - score(b) || hash(term.id + a.id) - hash(term.id + b.id)).slice(0, 3);
  const options = [term, ...distractors].sort((a, b) => hash(term.id + "|" + a.id) - hash(term.id + "|" + b.id));
  return { options: options.map(def), answerIndex: options.indexOf(term) };
}
