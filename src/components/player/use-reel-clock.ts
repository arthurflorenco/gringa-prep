"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/content/schema";
import { spokenText, timingFor, type Timing } from "@/lib/reel-audio";
import { speak, stopNarration } from "@/lib/narrator";
import { audioContext } from "@/lib/reel-sfx";

type Mode = "audio" | "speech" | "timer";

/**
 * Relógio de uma cena do reel. Toca o clip Kokoro (ou, sem clip, a voz do browser; com som
 * desligado, só o relógio) e devolve `t` = ms de fala decorridos (já à escala da velocidade).
 * Depois de a fala acabar, `t` continua a contar para as animações terminarem.
 *
 * `level` (ref, 0–1) = volume instantâneo da voz, para o orb do narrador.
 */
export function useReelClock({
  text,
  lang,
  rate,
  sound,
  playing,
  runKey,
}: {
  text: string;
  lang: Lang;
  rate: number;
  sound: boolean;
  playing: boolean;
  /** Muda para reiniciar a cena. */
  runKey: string;
}) {
  const timing: Timing = useMemo(() => timingFor(lang, text), [lang, text]);
  const mode: Mode = sound && timing.src ? "audio" : sound ? "speech" : "timer";
  /* Estado guardado com a chave da cena: ao mudar de cena volta a 0 sem setState num efeito. */
  const key = `${runKey}|${lang}|${mode}|${text}`;
  const [snap, setSnap] = useState({ key: "", t: 0, ended: false });
  const t = snap.key === key ? snap.t : 0;
  const ended = snap.key === key ? snap.ended : false;
  const level = useRef(0);

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const st = useRef({ t: 0, mode: "timer" as Mode, speechStarted: false, speechDone: false, audioDone: false, ended: false });

  /* (Re)início da cena. */
  useEffect(() => {
    st.current = { t: 0, mode, speechStarted: false, speechDone: false, audioDone: false, ended: false };
    stopNarration();
    const a = audioEl.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
    }
    if (mode === "audio") {
      const el = (audioEl.current ??= new Audio());
      el.preload = "auto";
      el.src = timing.src!;
      el.currentTime = 0;
    }
  }, [runKey, text, lang, mode, timing.src]);

  /* Liga o analisador uma única vez ao elemento de áudio. */
  const ensureAnalyser = () => {
    const el = audioEl.current;
    if (!el || analyser.current) return;
    const ctx = audioContext();
    if (!ctx) return;
    try {
      const src = ctx.createMediaElementSource(el);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      src.connect(an);
      an.connect(ctx.destination);
      analyser.current = an;
    } catch {
      /* já ligado ou sem suporte: o orb fica sem volume real */
    }
  };

  /* Motor: corre enquanto `playing`. */
  useEffect(() => {
    if (!playing) {
      audioEl.current?.pause();
      if (st.current.mode === "speech" && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.pause();
      level.current = 0;
      return;
    }
    const s = st.current;
    const el = audioEl.current;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (s.ended) return;
      s.ended = true;
      setSnap({ key, t: s.t, ended: true });
    };

    if (s.mode === "audio" && el && !s.audioDone) {
      ensureAnalyser();
      el.playbackRate = rate;
      el.onended = () => {
        s.audioDone = true;
        s.t = timing.ms;
        finish();
      };
      el.play().catch(() => {
        // Autoplay bloqueado ou ficheiro em falta: segue com o relógio.
        s.mode = "timer";
      });
    }
    if (s.mode === "speech") {
      if (!s.speechStarted) {
        s.speechStarted = true;
        const cancel = speak(spokenText(text), lang, rate, {
          onEnd: () => {
            s.speechDone = true;
            finish();
          },
        });
        if (!cancel) s.mode = "timer";
        else safety = setTimeout(() => finish(), (timing.ms / rate) * 2 + 4000);
      } else window.speechSynthesis?.resume();
    }

    let raf = 0;
    let last = performance.now();
    let lastPush = 0;
    const buf = new Uint8Array(128);
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (s.mode === "audio" && el && !s.audioDone && !el.paused) s.t = el.currentTime * 1000;
      else s.t += dt * rate;
      if (s.mode === "timer" && s.t >= timing.ms) finish();
      if (s.mode === "speech" && s.speechDone) finish();

      // Volume para o orb.
      if (analyser.current && s.mode === "audio" && !s.audioDone) {
        analyser.current.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        level.current = Math.min(1, Math.sqrt(sum / buf.length) * 4);
      } else if (s.mode === "speech" && !s.speechDone) level.current = 0.35 + 0.25 * Math.sin(now / 90);
      else level.current *= 0.85;

      if (now - lastPush > 50) {
        lastPush = now;
        setSnap({ key, t: s.t, ended: s.ended });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [playing, key, text, lang, rate, timing.ms]);

  /* Velocidade a meio da cena. */
  useEffect(() => {
    if (audioEl.current) audioEl.current.playbackRate = rate;
  }, [rate]);

  useEffect(
    () => () => {
      audioEl.current?.pause();
      stopNarration();
    },
    [],
  );

  return { t, ended, timing, level };
}
