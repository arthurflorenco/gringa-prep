import type { Exercise, Lang } from "./schema";

/**
 * Devolve o exercício com os textos no idioma pedido.
 * O bloco `pt` tem os mesmos nomes de campo que o inglês, por isso basta sobrepor.
 */
export function localize<E extends Exercise>(exercise: E, lang: Lang): E {
  if (lang === "en") return exercise;
  const pt = Object.fromEntries(Object.entries(exercise.pt).filter(([, v]) => v !== undefined));
  return { ...exercise, ...pt } as E;
}

export function titleOf(exercise: Exercise, lang: Lang): string {
  return lang === "pt" ? exercise.pt.title : exercise.title;
}
