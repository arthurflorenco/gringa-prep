"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent, type RefObject, type WheelEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Lang, ReelScene } from "@/lib/content/schema";
import { isInteractive, sceneDurationMs } from "@/lib/reel";
import { clipFor, wordTimes, type ClipInfo } from "@/lib/reel-audio";
import { RATES, readReelPrefs, saveReelPrefs, type ReelPrefs } from "@/lib/narrator";
import { audioContext, setSfxMuted, sfx } from "@/lib/reel-sfx";
import { useHotkeys } from "@/lib/use-hotkeys";
import { Button, Kbd } from "@/components/ui";
import { Inline, SceneView } from "./reel-scenes";
import { useReelClock } from "./use-reel-clock";

gsap.registerPlugin(useGSAP);

type Phase = "cover" | "play" | "end";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const copy = {
  pt: { watch: "Ver aula", read: "Ler em texto", scenes: "cenas", replay: "Rever", text: "Ler a aula completa", done: "Entendi", seen: "Aula vista", next: "As perguntas sobre esta aula vêm a seguir.", answer: "Responde para continuar", sound: "Som (M)", pause: "Pausa (espaço)", first: "de primeira", combo: "melhor combo", voice: "voz natural", interactive: "interativas" },
  en: { watch: "Watch lesson", read: "Read as text", scenes: "scenes", replay: "Replay", text: "Read the full lesson", done: "Got it", seen: "Lesson done", next: "Questions about this lesson come next.", answer: "Answer to continue", sound: "Sound (M)", pause: "Pause (space)", first: "first try", combo: "best combo", voice: "natural voice", interactive: "interactive" },
};

/** Legenda karaoke: a palavra que está a ser dita fica em destaque. */
function Caption({ text, t, timing }: { text: string; t: number; timing: ClipInfo }) {
  const words = useMemo(() => wordTimes(text, timing), [text, timing]);
  let cur = -1;
  for (let i = 0; i < words.length; i++) if (t >= words[i].at) cur = i;
  return (
    <p className="text-[15px] leading-snug">
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block transition-all duration-150 ${i === cur ? "scale-[1.06] font-medium text-accent" : i < cur ? "text-fg" : "text-faint"}`}
        >
          {w.word}&nbsp;
        </span>
      ))}
    </p>
  );
}

/** Orb do narrador: pulsa com o volume real da voz. */
function NarratorOrb({ level, active }: { level: RefObject<number>; active: boolean }) {
  const orb = useRef<HTMLDivElement>(null);
  const bars = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    let smooth = 0;
    const loop = (now: number) => {
      smooth += ((level.current ?? 0) - smooth) * 0.35;
      if (orb.current) {
        orb.current.style.transform = `scale(${1 + smooth * 0.45})`;
        orb.current.style.boxShadow = `0 0 ${8 + smooth * 26}px color-mix(in srgb, var(--accent) ${30 + smooth * 50}%, transparent)`;
      }
      bars.current?.querySelectorAll<HTMLElement>("span").forEach((b, i) => {
        const wob = 0.5 + 0.5 * Math.sin(now / (110 + i * 37) + i);
        b.style.transform = `scaleY(${0.2 + smooth * (0.5 + wob * 0.8)})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [level]);
  return (
    <div className="flex shrink-0 items-center gap-2" aria-hidden>
      <div ref={orb} className={`h-7 w-7 rounded-full bg-radial from-accent/90 to-accent/40 transition-opacity ${active ? "opacity-100" : "opacity-40"}`} />
      <div ref={bars} className="flex h-5 items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="block h-full w-[3px] origin-center rounded-full bg-accent/70" style={{ transform: "scaleY(0.2)" }} />
        ))}
      </div>
    </div>
  );
}

/** Fundo com manchas de cor que derivam devagar e mudam de sítio a cada cena. */
const SPOTS = [
  ["10% 15%", "85% 70%", "40% 95%"],
  ["80% 10%", "15% 60%", "70% 95%"],
  ["50% 5%", "90% 45%", "5% 85%"],
  ["20% 40%", "75% 20%", "60% 80%"],
];
function Backdrop({ idx, paused }: { idx: number; paused: boolean }) {
  const spots = SPOTS[idx % SPOTS.length];
  const colors = ["var(--accent)", "var(--success)", "var(--accent)"];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${paused ? "reel-paused" : ""}`}>
      {spots.map((p, i) => {
        const [x, y] = p.split(" ");
        return (
          <div
            key={i}
            className="reel-blob absolute h-[55%] w-[80%] rounded-full opacity-[0.13] blur-3xl transition-all duration-[1400ms] ease-out"
            style={{ left: x, top: y, background: colors[i], translate: "-50% -50%", animationDelay: `${i * -4}s` }}
          />
        );
      })}
    </div>
  );
}

function Confetti() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const pieces = gsap.utils.toArray<HTMLElement>("[data-c]", ref.current);
      pieces.forEach((p) => {
        gsap.fromTo(
          p,
          { x: 0, y: 0, rotate: 0, autoAlpha: 1 },
          {
            x: gsap.utils.random(-180, 180),
            y: gsap.utils.random(-320, -120),
            rotate: gsap.utils.random(-360, 360),
            duration: gsap.utils.random(0.7, 1.1),
            ease: "power3.out",
            onComplete: () => void gsap.to(p, { y: "+=420", autoAlpha: 0, duration: 1.4, ease: "power1.in" }),
          },
        );
      });
    },
    { scope: ref },
  );
  const colors = ["bg-accent", "bg-success", "bg-fg", "bg-danger"];
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute bottom-1/3 left-1/2">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} data-c className={`absolute h-2.5 w-1.5 rounded-sm ${colors[i % colors.length]}`} style={{ visibility: "hidden" }} />
      ))}
    </div>
  );
}

interface Score {
  xp: number;
  combo: number;
  best: number;
  first: number;
  total: number;
}
const EMPTY: Score = { xp: 0, combo: 0, best: 0, first: 0, total: 0 };

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
  const [run, setRun] = useState(0); // muda a cada (re)início de cena
  const [blocked, setBlocked] = useState(false);
  const [score, setScore] = useState<Score>(EMPTY);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const misses = useRef<Record<number, number>>({});
  const stage = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);

  const scene = scenes[idx];
  const interactive = isInteractive(scene);
  const open = interactive && !solved.includes(idx);
  const narrated = interactive && !open ? scene.why : scene.say;

  const clock = useReelClock({
    text: narrated,
    lang,
    rate: prefs.rate,
    sound: prefs.sound,
    playing: phase === "play" && !paused,
    runKey: `${idx}-${run}-${phase}`,
  });
  // As cenas narradas revelam pelos beats do `say`; nas interativas já resolvidas fala-se o `why`.
  const timing = clock.timing;

  const commit = (to: number) => {
    setBlocked(false);
    setRun((r) => r + 1);
    if (to >= scenes.length) {
      setPhase("end");
      sfx.finish();
    } else setIdx(Math.max(0, to));
  };
  const go = (to: number) => {
    if (leaving.current) return;
    const el = stage.current;
    if (!el || reduced()) return commit(to);
    leaving.current = true;
    gsap.to(el, {
      autoAlpha: 0,
      y: to > idx ? -40 : 40,
      scale: 0.97,
      filter: "blur(8px)",
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        leaving.current = false;
        commit(to);
      },
    });
  };
  const next = () => {
    if (phase !== "play") return;
    if (open) return setBlocked(true);
    go(idx + 1);
  };
  const prev = () => phase === "play" && idx > 0 && go(idx - 1);
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  /* Entrada de cada cena. */
  useGSAP(
    () => {
      const el = stage.current;
      if (!el || phase !== "play") return;
      if (reduced()) return void gsap.set(el, { clearProps: "all" });
      const punch = isInteractive(scenes[idx]);
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: punch ? 0 : 40, scale: punch ? 0.86 : 1.03, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: punch ? 0.5 : 0.45, ease: punch ? "back.out(1.8)" : "power3.out", clearProps: "filter,transform" },
      );
    },
    { dependencies: [idx, phase] },
  );

  const start = () => {
    const p = readReelPrefs();
    audioContext(); // desbloqueia o áudio no gesto do utilizador
    setSfxMuted(!p.sound);
    setPrefs(p);
    setSolved([]);
    setScore(EMPTY);
    misses.current = {};
    setPaused(false);
    setIdx(0);
    setRun((r) => r + 1);
    setPhase("play");
  };
  const updatePrefs = (p: ReelPrefs) => {
    setPrefs(p);
    setSfxMuted(!p.sound);
    saveReelPrefs(p);
  };

  /* Pausa congela também as animações GSAP em curso. */
  useEffect(() => {
    if (paused) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
    return () => void gsap.globalTimeline.resume();
  }, [paused]);

  /* Avança sozinho quando a fala acabou e as animações tiveram tempo. */
  const holdMs = Math.max(timing.ms, interactive ? 600 : 2200) + (scene.type === "visual" && scene.kind === "request" ? 1800 : 0);
  const ready = phase === "play" && !paused && !open && clock.ended && clock.t >= holdMs;
  useEffect(() => {
    if (!ready) return;
    const tm = setTimeout(() => goRef.current(idx + 1), 800);
    return () => clearTimeout(tm);
  }, [ready, idx]);

  /* Gamificação. */
  const flash = (text: string) => setToast({ id: Date.now(), text });
  const onMiss = () => {
    misses.current[idx] = (misses.current[idx] ?? 0) + 1;
    sfx.wrong();
    setScore((s) => ({ ...s, combo: 0 }));
  };
  const onSolved = () => {
    if (solved.includes(idx)) return;
    setSolved((s) => [...s, idx]);
    setBlocked(false);
    if (scene.type === "reveal") {
      sfx.right(1);
      setScore((s) => ({ ...s, xp: s.xp + 5 }));
      return flash("+5");
    }
    const firstTry = !misses.current[idx];
    const combo = firstTry ? score.combo + 1 : 0;
    const gain = firstTry ? 10 * Math.min(Math.max(combo, 1), 3) : 5;
    if (firstTry) sfx.right(combo);
    setScore((s) => ({ xp: s.xp + gain, combo, best: Math.max(s.best, combo), first: s.first + (firstTry ? 1 : 0), total: s.total + 1 }));
    flash(combo >= 2 ? `+${gain} · combo ×${Math.min(combo, 3)}` : `+${gain}`);
  };
  const toastRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!toast || !toastRef.current) return;
      gsap.fromTo(toastRef.current, { autoAlpha: 0, y: 10, scale: 0.8 }, { autoAlpha: 1, y: -10, scale: 1, duration: 0.35, ease: "back.out(2.5)" });
      gsap.to(toastRef.current, { autoAlpha: 0, y: -30, duration: 0.4, delay: 1.1 });
    },
    { dependencies: [toast?.id] },
  );

  useHotkeys({
    arrowright: phase === "play" && next,
    arrowdown: phase === "play" && next,
    arrowleft: phase === "play" && prev,
    arrowup: phase === "play" && prev,
    space: phase === "play" ? () => setPaused((p) => !p) : phase === "cover" ? start : false,
    m: phase === "play" && (() => updatePrefs({ ...prefs, sound: !prefs.sound })),
    enter: phase === "end" ? onFinish : phase === "cover" ? start : false,
  });

  /* Toque: lado esquerdo volta, o resto avança. Swipe/scroll vertical também. Controlos interativos ficam de fora. */
  const swipeY = useRef<number | null>(null);
  const swiped = useRef(false);
  const inControl = (el: EventTarget) => !!(el as HTMLElement).closest("button, [data-interactive]");
  const onPointerDown = (e: PointerEvent) => {
    swipeY.current = inControl(e.target) ? null : e.clientY;
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
    if (phase !== "play" || swiped.current || inControl(e.target)) return;
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

  const progress = open ? 0.5 : interactive ? 0.5 + 0.5 * Math.min(1, clock.t / Math.max(holdMs, 1)) : Math.min(1, clock.t / Math.max(holdMs, 1));
  const voiced = useMemo(() => scenes.every((s) => clipFor(lang, s.say)), [scenes, lang]);
  const totalMin = Math.max(1, Math.ceil(scenes.reduce((s, sc) => s + sceneDurationMs(sc, 1, lang), 0) / 60000));
  const nInteractive = scenes.filter(isInteractive).length;

  return (
    <div
      className="relative mx-auto flex aspect-[9/16] h-[min(72vh,720px)] max-w-full touch-none select-none flex-col overflow-hidden rounded-[28px] border border-border bg-linear-to-b from-surface to-surface-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onWheel={onWheel}
      role="region"
      aria-label={title}
    >
      <Backdrop idx={phase === "play" ? idx : phase === "end" ? 3 : 0} paused={paused} />

      {phase === "cover" && (
        <div className="relative flex h-full flex-col justify-between p-7">
          <div className="flex flex-wrap gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            <span>
              reel · {scenes.length} {c.scenes} · ~{totalMin} min
            </span>
            <span>
              · {nInteractive} {c.interactive}
            </span>
            {voiced && <span className="text-accent">· ♪ {c.voice}</span>}
          </div>
          <h2 className="font-serif text-[2.6rem] leading-[1.05] tracking-tight">{title}</h2>
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
          <div className="relative flex gap-1 px-4 pt-4">
            {scenes.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full w-full origin-left bg-fg transition-transform duration-100 ease-linear"
                  style={{ transform: `scaleX(${i < idx ? 1 : i === idx ? progress : 0})` }}
                />
              </div>
            ))}
          </div>
          <div className="relative flex items-center gap-1 px-3 pt-2">
            <span className="min-w-0 flex-1 truncate pl-1 font-mono text-[11px] text-faint">{title}</span>
            <div className="ml-auto flex shrink-0 items-center gap-0.5 whitespace-nowrap">
              {score.total > 0 && (
                <span className="mr-1 rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent">
                  {score.xp} xp{score.combo >= 2 ? ` · 🔥${score.combo}` : ""}
                </span>
              )}
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

          <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div ref={stage} className="h-full">
              <SceneView
                key={`${idx}-${lang}-${run}`}
                scene={scene}
                lang={lang}
                t={open || !interactive ? clock.t : timing.ms}
                timing={timing}
                solved={solved.includes(idx)}
                onSolved={onSolved}
                onMiss={onMiss}
              />
            </div>
            {toast && (
              <div ref={toastRef} key={toast.id} className="pointer-events-none absolute right-6 top-4 rounded-full bg-success px-3 py-1 font-mono text-sm font-medium text-bg shadow-lg">
                {toast.text}
              </div>
            )}
          </div>

          <div className="relative flex items-start gap-3 border-t border-border/70 bg-surface/80 px-5 py-4 backdrop-blur">
            <NarratorOrb level={clock.level} active={prefs.sound && !clock.ended && !paused} />
            <div className="min-w-0 flex-1">
              {blocked && open ? <p className="text-[15px] text-accent">{c.answer}</p> : <Caption text={narrated} t={clock.t} timing={timing} />}
            </div>
          </div>
          {paused && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-bg/30 backdrop-blur-[2px]">
              <span className="rounded-full bg-fg px-4 py-2 font-mono text-xs text-bg">❚❚</span>
            </div>
          )}
        </>
      )}

      {phase === "end" && (
        <div className="relative flex h-full flex-col justify-between p-7">
          <Confetti />
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-success">✓ {c.seen}</div>
          <div className="space-y-4">
            <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-tight">{title}</h2>
            {score.total > 0 && (
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  [`${score.xp}`, "xp"],
                  [`${score.first}/${score.total}`, c.first],
                  [`×${score.best}`, c.combo],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl border border-border bg-surface px-2 py-3">
                    <div className="font-serif text-2xl">{v}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-faint">{l}</div>
                  </div>
                ))}
              </div>
            )}
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
