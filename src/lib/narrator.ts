import type { Lang } from "@/lib/content/schema";

/**
 * Narração com a voz do próprio browser (Web Speech API): grátis, offline em macOS/Windows.
 * Só corre no cliente. Se não houver voz, `speak` devolve null e o reel avança por tempo.
 */

const PREFERRED: Record<Lang, string[]> = { pt: ["pt-BR", "pt-PT", "pt"], en: ["en-US", "en-GB", "en"] };
const QUALITY = /google|premium|enhanced|natural|neural|siri/i;
/** Vozes clássicas do macOS/iOS com boa dicção. */
const GOOD = /^(luciana|felipe|joana|catarina|samantha|alex|ava|allison|susan|tom|daniel|serena|karen|moira)\b/i;
/** Vozes "de efeito" do macOS — nunca para uma aula. */
const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|eddy|flo|fred|good news|grandma|grandpa|jester|junior|kathy|organ|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox)\b/i;

function rank(v: SpeechSynthesisVoice) {
  if (QUALITY.test(v.name)) return 0;
  if (GOOD.test(v.name)) return 1;
  if (!NOVELTY.test(v.name)) return 2;
  return 3;
}

let voices: SpeechSynthesisVoice[] = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
}

export const narrationSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

export function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!voices.length && narrationSupported()) loadVoices();
  for (const code of PREFERRED[lang]) {
    const match = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(code.toLowerCase()));
    if (match.length) return [...match].sort((a, b) => rank(a) - rank(b))[0];
  }
  return undefined;
}

export interface SpeakHandlers {
  onEnd: () => void;
  /** Índice do carácter que está a ser dito (nem todas as vozes emitem). */
  onBoundary?: (charIndex: number) => void;
}

/** Fala `text`. Devolve uma função que cancela, ou null se não houver narração possível. */
export function speak(text: string, lang: Lang, rate: number, { onEnd, onBoundary }: SpeakHandlers): (() => void) | null {
  if (!narrationSupported()) return null;
  const voice = pickVoice(lang);
  if (!voice) return null;
  const synth = window.speechSynthesis;
  synth.cancel();
  let active = true;
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = rate;
  u.onend = () => active && onEnd();
  u.onerror = () => active && onEnd();
  u.onboundary = (e) => active && e.name === "word" && onBoundary?.(e.charIndex);
  synth.speak(u);
  return () => {
    active = false;
    synth.cancel();
  };
}

export function stopNarration() {
  if (narrationSupported()) window.speechSynthesis.cancel();
}

/* Preferências do reel (localStorage). Lidas só em handlers/efeitos do cliente. */
export interface ReelPrefs {
  sound: boolean;
  rate: number;
}
export const RATES = [1, 1.25, 1.5] as const;

export function readReelPrefs(): ReelPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem("reelPrefs") ?? "{}") as Partial<ReelPrefs>;
    return { sound: raw.sound ?? true, rate: RATES.includes(raw.rate as 1) ? raw.rate! : 1 };
  } catch {
    return { sound: true, rate: 1 };
  }
}

export function saveReelPrefs(p: ReelPrefs) {
  localStorage.setItem("reelPrefs", JSON.stringify(p));
}
