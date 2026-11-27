/**
 * Efeitos sonoros curtos do reel, sintetizados com WebAudio (sem ficheiros).
 * Só no cliente; o AudioContext é partilhado com o analisador da narração.
 */

let ctx: AudioContext | null = null;
let muted = false;

export function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export const setSfxMuted = (m: boolean) => {
  muted = m;
};

function tone(freq: number, at: number, dur: number, type: OscillatorType = "sine", gain = 0.12) {
  const c = audioContext();
  if (!c || muted) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  /** Acerto: duas notas a subir (mais alto com combo). */
  right(combo = 1) {
    const base = 660 * Math.pow(1.06, Math.min(combo - 1, 6));
    tone(base, 0, 0.14, "triangle");
    tone(base * 1.5, 0.08, 0.22, "triangle");
  },
  wrong() {
    tone(180, 0, 0.18, "square", 0.05);
    tone(140, 0.09, 0.22, "square", 0.05);
  },
  tick() {
    tone(1200, 0, 0.05, "sine", 0.06);
  },
  flip() {
    tone(520, 0, 0.08, "sine", 0.08);
    tone(780, 0.04, 0.1, "sine", 0.06);
  },
  /** Fim do reel: arpejo. */
  finish() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.3, "triangle", 0.1));
  },
};
