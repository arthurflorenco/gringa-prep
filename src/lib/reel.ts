import type { Lang, ReelScene } from "@/lib/content/schema";
import { splitBeats, timingFor } from "@/lib/reel-audio";

export { wordCount } from "@/lib/reel-audio";

export type InteractiveScene = Extract<ReelScene, { type: "quiz" | "order" | "fill" | "truefalse" | "reveal" }>;
const INTERACTIVE = new Set<ReelScene["type"]>(["quiz", "order", "fill", "truefalse", "reveal"]);

/** Cenas que bloqueiam o avanço até o utilizador responder. */
export const isInteractive = (scene: ReelScene): scene is InteractiveScene => INTERACTIVE.has(scene.type);

/**
 * Quantos elementos da cena aparecem um a um, sincronizados com os beats da fala.
 * 0 = a cena não revela por beats (código, interativas).
 */
export function revealUnits(scene: ReelScene): number {
  switch (scene.type) {
    case "title":
      return scene.sub ? 2 : 1;
    case "flow":
      return scene.steps.length;
    case "list":
      return scene.items.length;
    case "compare":
      return 2;
    case "visual":
      return scene.labels.length;
    default:
      return 0;
  }
}

/** Nº de beats aceitável para uma cena: 1 (sem marcas), n ou n+1 (com introdução). */
export function beatsProblem(scene: ReelScene): string | null {
  const n = revealUnits(scene);
  const b = splitBeats(scene.say).length;
  if (b <= 1 || n === 0) return null;
  if (b === n || b === n + 1) return null;
  return `say has ${b} beats, expected 1, ${n} or ${n + 1}`;
}

/** Quanto tempo a animação de uma cena precisa (ms), sem contar a voz. */
export function animationMs(scene: ReelScene): number {
  switch (scene.type) {
    case "title":
      return 900;
    case "flow":
      return 500 + scene.steps.length * 550;
    case "list":
      return 400 + scene.items.length * 450;
    case "compare":
      return 600 + (scene.left.items.length + scene.right.items.length) * 300;
    case "visual":
      return 600 + scene.labels.length * 600;
    case "code":
      return 300 + Math.min(scene.code.length * 22, 3200);
    default:
      return 700;
  }
}

/**
 * Duração de uma cena (ms): o maior entre a fala e a animação, mais uma pausa curta.
 * Usa a duração real do clip quando existe (`lang` dado), senão uma estimativa.
 */
export function sceneDurationMs(scene: ReelScene, rate = 1, lang: Lang = "en"): number {
  const speech = timingFor(lang, scene.say).ms / rate;
  return Math.round(Math.max(speech, animationMs(scene), 2500) + 700);
}
