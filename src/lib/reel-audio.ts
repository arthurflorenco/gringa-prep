import manifestJson from "@content/reels/audio-manifest.json";
import type { Lang } from "@/lib/content/schema";

/**
 * Áudio do reel: clips pré-gerados com Kokoro (`npm run reel:audio`) em public/reel-audio/.
 * Puro e partilhado entre o script gerador e o cliente.
 *
 * O texto falado pode ter "beats" marcados com `|`: cada pedaço é sintetizado à parte, e o
 * manifest guarda o ms em que cada um começa — é isso que sincroniza as animações com a voz.
 */

export const VOICES: Record<Lang, string> = { en: "af_heart", pt: "pf_dora" };
/** Muda isto para regenerar tudo (ex.: troca de motor ou de parâmetros). */
const ENGINE = "kokoro-1";
export const AUDIO_DIR = "/reel-audio";
export const AUDIO_EXT = "m4a";
/** Palavras por segundo quando não há clip (estimativa). */
export const WORDS_PER_SEC = 2.6;

export interface ClipInfo {
  /** Duração total (ms, velocidade 1×). */
  ms: number;
  /** Início de cada beat (ms). beats[0] = 0. */
  beats: number[];
}
export type AudioManifest = Record<string, ClipInfo>;
const manifest = manifestJson as AudioManifest;

export interface Timing extends ClipInfo {
  /** URL do clip, ou null se ainda não foi gerado (aí usa-se a voz do browser). */
  src: string | null;
}

export const splitBeats = (say: string) =>
  say
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

/** Texto sem os marcadores de beat (legenda, Web Speech). */
export const spokenText = (say: string) => splitBeats(say).join(" ");

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** FNV-1a 32 bits → hex. Determinístico em Node e no browser. */
function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Chave do clip: muda se mudar o texto (incluindo os `|`), a voz ou o motor. */
export const clipKey = (lang: Lang, say: string) => `${lang}-${fnv1a(`${ENGINE}\0${VOICES[lang]}\0${say.trim()}`)}`;

export function clipFor(lang: Lang, say: string, m: AudioManifest = manifest): (ClipInfo & { src: string }) | null {
  const key = clipKey(lang, say);
  const info = m[key];
  return info ? { ...info, src: `${AUDIO_DIR}/${key}.${AUDIO_EXT}` } : null;
}

/** Estimativa sem clip: duração pelas palavras, beats proporcionais aos caracteres. */
export function estimateTiming(say: string): ClipInfo {
  const segs = splitBeats(say);
  const ms = Math.round((wordCount(spokenText(say)) / WORDS_PER_SEC) * 1000);
  const chars = segs.reduce((n, s) => n + s.length, 0) || 1;
  let acc = 0;
  const beats = segs.map((s) => {
    const at = Math.round((acc / chars) * ms);
    acc += s.length;
    return at;
  });
  return { ms, beats: beats.length ? beats : [0] };
}

export function timingFor(lang: Lang, say: string, m: AudioManifest = manifest): Timing {
  const clip = clipFor(lang, say, m);
  return clip ?? { ...estimateTiming(say), src: null };
}

/** Beat em que o tempo `t` (ms) está. */
export function beatAt(t: number, beats: number[]): number {
  let b = 0;
  for (let i = 0; i < beats.length; i++) if (t >= beats[i]) b = i;
  return b;
}

/**
 * Quando revelar cada um de `n` elementos de uma cena.
 * - beats ≥ n: os últimos n beats (os primeiros são introdução);
 * - caso contrário: distribuídos por ~85% da fala.
 */
export function revealTimes(n: number, { ms, beats }: ClipInfo): number[] {
  if (n <= 0) return [];
  if (beats.length >= n && beats.length > 1) return beats.slice(beats.length - n);
  const span = Math.max(ms * 0.85, 300 * n);
  return Array.from({ length: n }, (_, i) => Math.round((i / n) * span));
}

/** Início estimado de cada palavra (para a legenda karaoke). */
export function wordTimes(say: string, { ms, beats }: ClipInfo): { word: string; at: number }[] {
  const segs = splitBeats(say);
  const out: { word: string; at: number }[] = [];
  segs.forEach((seg, k) => {
    const start = beats[k] ?? 0;
    const end = beats[k + 1] ?? ms;
    const words = seg.split(/\s+/).filter(Boolean);
    const chars = words.reduce((n, w) => n + w.length + 1, 0) || 1;
    let acc = 0;
    for (const w of words) {
      out.push({ word: w, at: Math.round(start + (acc / chars) * (end - start)) });
      acc += w.length + 1;
    }
  });
  return out;
}
