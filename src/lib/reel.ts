import type { ReelScene } from "@/lib/content/schema";

/** Palavras por segundo de uma voz de síntese a velocidade 1×. */
const WORDS_PER_SEC = 2.6;

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** Quanto tempo a animação de entrada de uma cena precisa (ms), sem contar a voz. */
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
    case "code":
      return 300 + Math.min(scene.code.length * 22, 3200);
    case "quiz":
      return 700;
  }
}

/**
 * Duração estimada de uma cena (ms): o maior entre a fala e a animação, mais uma pausa curta.
 * Usada para encher a barra de progresso e como relógio quando o som está desligado.
 */
export function sceneDurationMs(scene: ReelScene, rate = 1): number {
  const speech = (wordCount(scene.say) / WORDS_PER_SEC / rate) * 1000;
  return Math.round(Math.max(speech, animationMs(scene), 2500) + 700);
}
