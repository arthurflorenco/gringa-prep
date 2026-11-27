"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { timingFor } from "@/lib/reel-audio";
import { speak, stopNarration } from "@/lib/narrator";
import { sentencesOf, speechScript } from "@/lib/speech";
import { Label } from "@/components/ui";

const RATES = [0.75, 1] as const;

/**
 * Treino de pronúncia: o texto em inglês frase a frase, com áudio natural (Kokoro) por frase,
 * e gravação da própria voz para comparar logo a seguir. Tudo fica em memória — nada é guardado.
 */
export function SpeakAlong({ text, label = "ouve e repete em voz alta", compact = false }: { text: string; label?: string; compact?: boolean }) {
  const script = useMemo(() => speechScript(text), [text]);
  const sentences = useMemo(() => sentencesOf(script), [script]);
  const timing = useMemo(() => timingFor("en", script), [script]);
  const [rate, setRate] = useState<(typeof RATES)[number]>(1);
  const [playing, setPlaying] = useState<number | "all" | null>(null);
  const [recording, setRecording] = useState<number | null>(null);
  const [takes, setTakes] = useState<Record<number, string>>({});
  const [micError, setMicError] = useState<string | null>(null);

  const audio = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef<number | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const mine = useRef<HTMLAudioElement | null>(null);

  const stopAll = () => {
    audio.current?.pause();
    mine.current?.pause();
    stopNarration();
    stopAt.current = null;
    setPlaying(null);
  };

  useEffect(
    () => () => {
      audio.current?.pause();
      stopNarration();
      recorder.current?.stream.getTracks().forEach((t) => t.stop());
    },
    [],
  );
  useEffect(() => () => Object.values(takes).forEach((u) => URL.revokeObjectURL(u)), [takes]);

  /** Toca a frase i (ou tudo). Sem clip gerado, usa a voz do browser. */
  const play = (i: number | "all", then?: () => void) => {
    stopAll();
    if (!timing.src) {
      const t = i === "all" ? sentences.join(" ") : sentences[i];
      setPlaying(i);
      const cancel = speak(t, "en", rate, {
        onEnd: () => {
          setPlaying(null);
          then?.();
        },
      });
      if (!cancel) setPlaying(null);
      return;
    }
    const el = (audio.current ??= new Audio(timing.src));
    if (!el.src.endsWith(timing.src)) el.src = timing.src;
    el.playbackRate = rate;
    const start = i === "all" ? 0 : timing.beats[i];
    const end = i === "all" ? null : (timing.beats[i + 1] ?? null);
    el.currentTime = start / 1000;
    stopAt.current = end;
    el.ontimeupdate = () => {
      if (stopAt.current !== null && el.currentTime * 1000 >= stopAt.current - 60) {
        el.pause();
        stopAt.current = null;
        setPlaying(null);
        then?.();
      }
    };
    el.onended = () => {
      setPlaying(null);
      then?.();
    };
    setPlaying(i);
    void el.play();
  };

  const record = async (i: number) => {
    if (recording === i) {
      recorder.current?.stop();
      return;
    }
    stopAll();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType }));
        setTakes((t) => ({ ...t, [i]: url }));
        setRecording(null);
        // Compara logo: modelo e depois a tua voz.
        play(i, () => playMine(url));
      };
      recorder.current = rec;
      rec.start();
      setRecording(i);
      setMicError(null);
    } catch {
      setMicError("Não consegui usar o microfone — verifica a permissão do navegador.");
    }
  };

  const playMine = (url: string) => {
    mine.current?.pause();
    mine.current = new Audio(url);
    void mine.current.play();
  };

  if (!sentences.length) return null;

  return (
    <div className={`space-y-3 rounded-2xl border border-border bg-surface ${compact ? "p-3" : "p-4"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Label>🗣 {label}</Label>
        <div className="ml-auto flex items-center gap-1">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              aria-pressed={rate === r}
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${rate === r ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
            >
              {r}×
            </button>
          ))}
          <button
            onClick={() => (playing === "all" ? stopAll() : play("all"))}
            className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted hover:border-border-strong hover:text-fg"
          >
            {playing === "all" ? "■ parar" : "▶ tudo"}
          </button>
        </div>
      </div>
      <ol className="space-y-1">
        {sentences.map((s, i) => (
          <li key={i} className={`flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors ${playing === i || recording === i ? "bg-accent-soft/60" : ""}`}>
            <button onClick={() => (playing === i ? stopAll() : play(i))} className="mt-0.5 shrink-0 font-mono text-xs text-accent" title="Ouvir esta frase" aria-label="Ouvir">
              {playing === i ? "■" : "▶"}
            </button>
            <span className="flex-1 text-[15px] leading-relaxed">{s}</span>
            <button
              onClick={() => void record(i)}
              className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] ${recording === i ? "animate-pulse bg-danger text-bg" : "text-muted hover:text-fg"}`}
              title={recording === i ? "Parar e comparar" : "Gravar a minha voz"}
            >
              {recording === i ? "■ parar" : "🎙"}
            </button>
            {takes[i] && (
              <button onClick={() => playMine(takes[i])} className="shrink-0 font-mono text-[11px] text-success" title="Ouvir a minha gravação">
                ▶ eu
              </button>
            )}
          </li>
        ))}
      </ol>
      {micError ? (
        <p className="text-xs text-danger">{micError}</p>
      ) : (
        !compact && <p className="text-xs text-faint">Ouve a frase, grava-te (🎙) e compara: toca o modelo e depois a tua voz. Nada é guardado.</p>
      )}
    </div>
  );
}
