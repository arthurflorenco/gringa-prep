import type { Content } from "@/lib/content";
import { splitBeats } from "@/lib/reel-audio";

/**
 * Textos de pronúncia (respostas-modelo, frases de entrevista, comentários de review) em inglês.
 * O texto vira um "script" com uma frase por beat (`|`): o clip Kokoro guarda o início de cada frase,
 * para tocar frase a frase.
 */

/** Markdown → frases faláveis separadas por " | ". */
export function speechScript(markdown: string): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, "")
    .replace(/\|/g, ",")
    .replace(/[→←]/g, " to ");
  const sentences = text
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => /[a-z]/i.test(s) && s.length > 2);
  return sentences.join(" | ");
}

export const sentencesOf = (script: string) => splitBeats(script);

/** Todos os scripts de pronúncia do conteúdo (para gerar áudio e verificar o que falta). */
export function pronunciationScripts(content: Content): string[] {
  const out = new Set<string>();
  for (const e of content.exercises) {
    if (e.kind === "concept" || e.kind === "behavioral") out.add(speechScript(e.modelAnswer));
    if (e.kind === "review") for (const i of e.issues) out.add(speechScript(i.comment));
  }
  for (const t of content.terms) out.add(speechScript(t.interviewLine));
  return [...out].filter(Boolean);
}
