"use client";

import { useEffect, useRef, useState, type PointerEvent, type MouseEvent, type WheelEvent } from "react";
import type { Lang, ReelScene } from "@/lib/content/schema";
import { animationMs, sceneDurationMs, wordCount } from "@/lib/reel";
import { RATES, readReelPrefs, saveReelPrefs, speak, stopNarration, type ReelPrefs } from "@/lib/narrator";
import { useHotkeys } from "@/lib/use-hotkeys";
import { Button, Kbd } from "@/components/ui";
import { Inline, SceneView } from "./reel-scenes";

type Phase = "cover" | "play" | "end";

const copy = {
  pt: { watch: "Ver aula", read: "Ler em texto", scenes: "cenas", replay: "Rever", text: "Ler a aula completa", done: "Entendi", seen: "Aula vista", next: "As perguntas sobre esta aula vêm a seguir.", answer: "Responde para continuar", sound: "Som (M)", pause: "Pausa (espaço)" },
  en: { watch: "Watch lesson", read: "Read as text", scenes: "scenes", replay: "Replay", text: "Read the full lesson", done: "Got it", seen: "Lesson done", next: "Questions about this lesson come next.", answer: "Answer to continue", sound: "Sound (M)", pause: "Pause (space)" },
};

/** Legenda com as palavras já ditas destacadas (quando a voz emite `boundary`). */
function Caption({ text, spokenChar }: { text: string; spokenChar: number | null }) {
  const parts = text.split(/(\s+)/);
  const starts = parts.map((_, i) => parts.slice(0, i).join("").length);
  return (
    <p className="text-[15px] leading-snug">
      {parts.map((part, i) => {
        const start = starts[i];
        const spoken = spokenChar === null || start <= spokenChar;
        return (
          <span key={i} className={`transition-colors duration-150 ${spoken ? "text-fg" : "text-faint"}`}>
            {part}
          </span>
        );
      })}
    </p>
  );
}

export function ReelPlayer({
  scenes,
  title,
  lang,
  onFinish,
  onReadText,
}: {
  scenes: ReelScene[];
  title: string;
  lang: Lang;
  onFinish: () => void;
  onReadText: () => void;
}) {
  const c = copy[lang];
  const [phase, setPhase] = useState<Phase>("cover");
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prefs, setPrefs] = useState<ReelPrefs>({ sound: true, rate: 1 });
  const [solved, setSolved] = useState<number[]>([]);
  const [spokenChar, setSpokenChar] = useState<number | null>(null);
  const [run, setRun] = useState(0); // muda a cada (re)início de cena, para reiniciar a barra
  const [blocked, setBlocked] = useState(false);

  const scene = scenes[idx];
  const isQuiz = scene.type === "quiz";
  const quizOpen = isQuiz && !solved.includes(idx);
  const narrated = isQuiz && !quizOpen ? scene.why : scene.say;
  // Números estáveis para o efeito (os objetos de cena são recriados a cada render pelo localize).
  const animMs = animationMs(scene);
  const durMs = sceneDurationMs(scene, prefs.rate);

  const go = (to: number) => {
    stopNarration();
    setSpokenChar(null);
    setBlocked(false);
    setRun((r) => r + 1);
    if (to >= scenes.length) setPhase("end");
    else setIdx(Math.max(0, to));
  };
  const next = () => {
    if (phase !== "play") return;
    if (quizOpen) return setBlocked(true);
    go(idx + 1);
  };
  const prev = () => phase === "play" && go(idx - 1);
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  const start = () => {
    setPrefs(readReelPrefs());
    setSolved([]);
    setPaused(false);
    setIdx(0);
    setRun((r) => r + 1);
    setPhase("play");
  };
  const updatePrefs = (p: ReelPrefs) => {
    setPrefs(p);
    saveReelPrefs(p);
    setRun((r) => r + 1);
  };

  /* Motor da cena: narra, espera a voz e a animação, e avança. */
  useEffect(() => {
    if (phase !== "play" || paused) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let speechDone = !prefs.sound;
    let animDone = false;
    const advanceIfReady = () => {
      if (speechDone && animDone && !quizOpen) timers.push(setTimeout(() => goRef.current(idx + 1), 700));
    };

    let cancel: (() => void) | null = null;
    if (prefs.sound) {
      cancel = speak(narrated, lang, prefs.rate, {
        onEnd: () => {
          speechDone = true;
          setSpokenChar(null);
          advanceIfReady();
        },
        onBoundary: setSpokenChar,
      });
      // Sem voz disponível: segue pelo relógio. Rede de segurança se `onend` nunca chegar.
      const est = (wordCount(narrated) / 2.6 / prefs.rate) * 1000;
      timers.push(
        setTimeout(
          () => {
            speechDone = true;
            advanceIfReady();
          },
          cancel ? est * 2 + 4000 : est + 600,
        ),
      );
    }
    const anim = isQuiz && !quizOpen ? 600 : prefs.sound ? animMs : durMs - 700;
    timers.push(
      setTimeout(() => {
        animDone = true;
        advanceIfReady();
      }, anim),
    );
    return () => {
      cancel?.();
      timers.forEach(clearTimeout);
    };
  }, [phase, paused, idx, narrated, lang, prefs, quizOpen, isQuiz, animMs, durMs, run]);

  useEffect(() => () => stopNarration(), []);

  useHotkeys({
    arrowright: phase === "play" && next,
    arrowdown: phase === "play" && next,
    arrowleft: phase === "play" && prev,
    arrowup: phase === "play" && prev,
    space: phase === "play" ? () => setPaused((p) => !p) : phase === "cover" ? start : false,
    m: phase === "play" && (() => updatePrefs({ ...prefs, sound: !prefs.sound })),
    enter: phase === "end" ? onFinish : phase === "cover" ? start : false,
  });

  /* Toque: lado esquerdo volta, o resto avança. Swipe/scroll vertical também. */
  const swipeY = useRef<number | null>(null);
  const swiped = useRef(false);
  const onPointerDown = (e: PointerEvent) => {
    swipeY.current = e.clientY;
    swiped.current = false;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeY.current === null) return;
    const dy = e.clientY - swipeY.current;
    swipeY.current = null;
    if (Math.abs(dy) > 50) {
      swiped.current = true;
      if (dy < 0) next();
      else prev();
    }
  };
  const onClick = (e: MouseEvent) => {
    if (phase !== "play" || swiped.current) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.3) prev();
    else next();
  };
  const lastWheel = useRef(0);
  const onWheel = (e: WheelEvent) => {
    if (phase !== "play" || Math.abs(e.deltaY) < 30 || e.timeStamp - lastWheel.current < 800) return;
    lastWheel.current = e.timeStamp;
    if (e.deltaY > 0) next();
    else prev();
  };

  const barMs = durMs;

  return (
    <div
      className="relative mx-auto flex aspect-[9/16] h-[min(70vh,700px)] max-w-full touch-none select-none flex-col overflow-hidden rounded-[28px] border border-border bg-linear-to-b from-surface to-surface-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onWheel={onWheel}
      role="region"
      aria-label={title}
    >
      {phase === "cover" && (
        <div className="flex h-full flex-col justify-between p-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            reel · {scenes.length} {c.scenes} · ~{Math.ceil(scenes.reduce((s, sc) => s + sceneDurationMs(sc), 0) / 60000)} min
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-[2.6rem] leading-[1.05] tracking-tight">{title}</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={start}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-fg py-4 text-base font-medium text-bg transition-transform active:scale-[0.98]"
            >
              <span aria-hidden className="ml-0.5 inline-block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-current" />
              {c.watch}
            </button>
            <button onClick={onReadText} className="w-full py-2 text-sm text-muted hover:text-fg">
              {c.read}
            </button>
          </div>
        </div>
      )}

      {phase === "play" && (
        <>
          <div className="flex gap-1 px-4 pt-4">
            {scenes.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                {i < idx && <div className="h-full w-full bg-fg" />}
                {i === idx && (
                  <div
                    key={`${run}-${lang}`}
                    className="h-full w-full origin-left bg-fg"
                    style={
                      isQuiz
                        ? { transform: solved.includes(idx) ? "scaleX(1)" : "scaleX(0.5)", transition: "transform 400ms" }
                        : { animation: `reel-fill ${barMs}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 px-3 pt-2">
            <span className="truncate pl-1 font-mono text-[11px] text-faint">{title}</span>
            <div className="ml-auto flex items-center gap-0.5">
              <button
                onClick={() => updatePrefs({ ...prefs, rate: RATES[(RATES.indexOf(prefs.rate as 1) + 1) % RATES.length] })}
                className="rounded-full px-2 py-1 font-mono text-[11px] text-muted hover:bg-surface-2 hover:text-fg"
                title="Velocidade"
              >
                {prefs.rate}×
              </button>
              <button
                onClick={() => updatePrefs({ ...prefs, sound: !prefs.sound })}
                className="rounded-full px-2 py-1 font-mono text-[11px] text-muted hover:bg-surface-2 hover:text-fg"
                title={c.sound}
                aria-pressed={prefs.sound}
              >
                {prefs.sound ? "♪ on" : "♪ off"}
              </button>
              <button
                onClick={() => setPaused((p) => !p)}
                className="rounded-full px-2 py-1 font-mono text-[11px] text-muted hover:bg-surface-2 hover:text-fg"
                title={c.pause}
              >
                {paused ? "▶" : "❚❚"}
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <SceneView
              key={`${idx}-${lang}`}
              scene={scene}
              lang={lang}
              solved={solved.includes(idx)}
              onSolved={() => setSolved((s) => [...s, idx])}
            />
          </div>

          <div className="border-t border-border/70 bg-surface/80 px-6 py-4 backdrop-blur">
            {blocked && quizOpen ? (
              <p className="text-[15px] text-accent">{c.answer}</p>
            ) : (
              <Caption text={narrated} spokenChar={spokenChar} />
            )}
          </div>
          {paused && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-bg/30">
              <span className="rounded-full bg-fg px-4 py-2 font-mono text-xs text-bg">❚❚</span>
            </div>
          )}
        </>
      )}

      {phase === "end" && (
        <div className="flex h-full flex-col justify-between p-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-success">✓ {c.seen}</div>
          <div className="space-y-3">
            <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-tight">{title}</h2>
            <p className="text-sm text-muted">
              <Inline text={c.next} />
            </p>
          </div>
          <div className="space-y-2">
            <Button variant="primary" className="w-full py-3.5 text-base" onClick={onFinish}>
              {c.done} <Kbd>↵</Kbd>
            </Button>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={start}>
                {c.replay}
              </Button>
              <Button className="flex-1" onClick={onReadText}>
                {c.text}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
