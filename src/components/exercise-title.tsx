"use client";

import { getContent } from "@/lib/content";
import { titleOf } from "@/lib/content/localize";
import { useContentLang } from "@/lib/use-content-lang";

/** Título no idioma escolhido em Ajustes (o servidor renderiza em PT, o padrão). */
export function ExerciseTitle({ id, className }: { id: string; className?: string }) {
  const lang = useContentLang();
  const it = getContent().itemById.get(id);
  if (!it || it.type !== "exercise") return null;
  return <span className={className}>{titleOf(it.exercise, lang)}</span>;
}
