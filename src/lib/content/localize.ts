import type { Exercise, Lang, ReelScene } from "./schema";

/** Sobrepõe os campos definidos de `pt` (os nomes de campo são os mesmos do inglês). */
function overlay<T extends { pt: object }>(item: T): T {
  const pt = Object.fromEntries(Object.entries(item.pt).filter(([, v]) => v !== undefined));
  return { ...item, ...pt };
}

/**
 * Devolve o exercício com os textos no idioma pedido.
 * O bloco `pt` tem os mesmos nomes de campo que o inglês, por isso basta sobrepor.
 * Nas aulas, cada cena do reel também é traduzida.
 */
export function localize<E extends Exercise>(exercise: E, lang: Lang): E {
  if (lang === "en") return exercise;
  const out = overlay(exercise);
  if (out.kind === "lesson") return { ...out, reel: out.reel.map((s) => overlay(s) as ReelScene) };
  return out;
}

export function titleOf(exercise: Exercise, lang: Lang): string {
  return lang === "pt" ? exercise.pt.title : exercise.title;
}
