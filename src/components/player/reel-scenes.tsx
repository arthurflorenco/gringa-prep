"use client";

import { Fragment, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Lang, ReelScene } from "@/lib/content/schema";
import { revealTimes, type ClipInfo } from "@/lib/reel-audio";
import { revealUnits } from "@/lib/reel";
import { sfx } from "@/lib/reel-sfx";
import { pop } from "@/lib/use-enter";
import { Inline } from "./reel-inline";
import { VisualScene, enterFrom, useUnits } from "./reel-visuals";

export { Inline } from "./reel-inline";

gsap.registerPlugin(useGSAP);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hide = (visible: boolean) => (visible ? undefined : ({ visibility: "hidden" } as const));

type Of<T extends ReelScene["type"]> = Extract<ReelScene, { type: T }>;

export interface SceneProps {
  scene: ReelScene;
  lang: Lang;
  /** ms de fala decorridos nesta cena. */
  t: number;
  timing: ClipInfo;
  solved: boolean;
  /** Resposta certa (as interativas chamam uma vez). */
  onSolved: () => void;
  /** Tentativa errada. */
  onMiss: () => void;
}

/** Quantos elementos da cena já foram "ditos". */
function useShown(scene: ReelScene, t: number, timing: ClipInfo) {
  const times = useMemo(() => revealTimes(revealUnits(scene), timing), [scene, timing]);
  return times.filter((at) => t >= at).length;
}

/* ── Cenas narradas ────────────────────────────────────────────────────────────────────── */

function TitleScene({ scene, shown }: { scene: Of<"title">; shown: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.fromTo(gsap.utils.toArray("[data-w]", ref.current), { yPercent: 110, autoAlpha: 0, rotate: 4 }, { yPercent: 0, autoAlpha: 1, rotate: 0, duration: 0.7, ease: "power4.out", stagger: 0.07 });
      gsap.fromTo("[data-rule]", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 0.8, ease: "power3.inOut", delay: 0.25 });
    },
    { scope: ref },
  );
  useGSAP(() => void (shown > 1 && !reduced() && enterFrom("[data-sub]", { autoAlpha: 0, y: 14 }, { duration: 0.5, ease: "power2.out" })), { scope: ref, dependencies: [shown > 1] });
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5">
      <h2 className="font-serif text-[2.8rem] leading-[1.02] tracking-tight">
        {scene.headline.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <span data-w className="inline-block">
              {w}&nbsp;
            </span>
          </span>
        ))}
      </h2>
      <div data-rule className="h-[3px] w-16 rounded-full bg-accent" />
      {scene.sub && (
        <p data-sub className="text-lg leading-snug text-muted" style={hide(shown > 1)}>
          <Inline text={scene.sub} />
        </p>
      )}
    </div>
  );
}

const ON = ["border-accent", "bg-accent-soft", "shadow-[0_0_0_4px_var(--accent-soft)]"];

function FlowScene({ scene, shown }: { scene: Of<"flow">; shown: number }) {
  const ref = useUnits<HTMLDivElement>(shown, { autoAlpha: 0, y: 18, scale: 0.9 }, (el) => {
    el.parentElement?.querySelectorAll("[data-unit]").forEach((b) => b.querySelector("[data-box]")?.classList.remove(...ON));
    el.querySelector("[data-box]")?.classList.add(...ON);
    const arrow = el.querySelector("[data-arrow]");
    if (arrow && !reduced()) enterFrom(arrow, { scaleY: 0 }, { transformOrigin: "top", duration: 0.25 });
  });
  return (
    <div ref={ref} className="flex h-full flex-col items-stretch justify-center">
      {scene.steps.map((step, i) => (
        <div key={i} data-unit style={hide(i < shown)}>
          {i > 0 && (
            <div data-arrow className="mx-auto h-5 w-px bg-border-strong">
              <div className="relative top-full -ml-[3px] h-0 w-0 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-border-strong" />
            </div>
          )}
          <div data-box className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-[15px] transition-all duration-300">
            <span className="mr-2 font-mono text-[11px] text-faint">{i + 1}</span>
            <Inline text={step} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListScene({ scene, shown }: { scene: Of<"list">; shown: number }) {
  const ref = useUnits<HTMLUListElement>(shown, { autoAlpha: 0, x: -30, duration: 0.4, ease: "power3.out" });
  return (
    <ul ref={ref} className="flex h-full flex-col justify-center gap-3">
      {scene.items.map((item, i) => (
        <li
          key={i}
          data-unit
          style={hide(i < shown)}
          className={`flex gap-3 rounded-xl border px-4 py-3 text-[16px] leading-snug transition-colors duration-300 ${i === shown - 1 ? "border-accent/60 bg-surface" : "border-border bg-surface"}`}
        >
          <span className="font-mono text-sm text-accent">{i + 1}</span>
          <span>
            <Inline text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function CompareScene({ scene, shown }: { scene: Of<"compare">; shown: number }) {
  const ref = useUnits<HTMLDivElement>(shown, { autoAlpha: 0, y: 24, duration: 0.45, ease: "power3.out" }, (el) => {
    if (!reduced()) gsap.fromTo(el.querySelectorAll("[data-ci]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.15, delay: 0.2 });
  });
  const col = (side: "l" | "r", c: { label: string; items: string[] }, i: number) => (
    <div
      data-unit
      style={hide(i < shown)}
      className={`flex-1 rounded-2xl border p-4 ${side === "l" ? "border-border bg-surface" : "border-accent/40 bg-accent-soft/50"}`}
    >
      <div className={`mb-3 font-mono text-[12px] uppercase tracking-wider ${side === "l" ? "text-muted" : "text-accent"}`}>
        <Inline text={c.label} />
      </div>
      <ul className="space-y-2.5 text-[14px] leading-snug">
        {c.items.map((it, j) => (
          <li key={j} data-ci>
            <Inline text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div ref={ref} className="flex h-full items-center">
      <div className="flex w-full gap-3">
        {col("l", scene.left, 0)}
        <div className="self-center font-serif text-xl italic text-faint" style={hide(shown > 1)}>
          vs
        </div>
        {col("r", scene.right, 1)}
      </div>
    </div>
  );
}

function CodeBlock({ code, typed, highlight = [], blank }: { code: string; typed?: number; highlight?: number[]; blank?: string | null }) {
  const lines = code.split("\n");
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length + 1, 0));
  return (
    <pre className="w-full overflow-x-auto rounded-2xl bg-code-bg py-4 font-mono text-[13px] leading-[1.7] text-code-fg shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
      {lines.map((l, i) => {
        const left = (typed ?? Infinity) - starts[i];
        const vis = l.slice(0, Math.max(0, left));
        const typing = typed !== undefined && left >= 0 && left < l.length + 1 && typed < code.length;
        const parts = blank !== undefined ? vis.split("___") : [vis];
        return (
          <div key={i} className={`flex px-4 transition-colors duration-500 ${highlight.includes(i + 1) ? "bg-accent/25" : ""}`}>
            <span className="mr-4 w-4 shrink-0 select-none text-right opacity-35">{i + 1}</span>
            <span className="whitespace-pre">
              {parts.map((p, j) => (
                <Fragment key={j}>
                  {j > 0 && (
                    <span data-blank className={`rounded px-1 ${blank ? "bg-success/30 text-code-fg" : "border-b-2 border-dashed border-accent text-transparent"}`}>
                      {blank || "____"}
                    </span>
                  )}
                  {p}
                </Fragment>
              ))}
              {typing && <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-pulse bg-code-fg/70" />}
            </span>
          </div>
        );
      })}
    </pre>
  );
}

function CodeScene({ scene, t, timing }: { scene: Of<"code">; t: number; timing: ClipInfo }) {
  const total = scene.code.length;
  // Digita durante ~75% da fala (entre 0,8 s e 3,6 s); destaca no último beat.
  const typeMs = Math.min(Math.max(timing.ms * 0.75, 800), 3600, Math.max(total * 30, 800));
  const typed = reduced() ? total : Math.floor(Math.min(1, t / typeMs) * total);
  const hlAt = Math.max(typeMs, timing.beats.length > 1 ? timing.beats[timing.beats.length - 1] : 0);
  return (
    <div className="flex h-full items-center">
      <CodeBlock code={scene.code} typed={typed} highlight={t >= hlAt ? scene.highlight : []} />
    </div>
  );
}

/* ── Interativas ───────────────────────────────────────────────────────────────────────── */

function Why({ show, lang, text }: { show: boolean; lang: Lang; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => void (show && !reduced() && enterFrom(ref.current, { autoAlpha: 0, y: 10 }, { duration: 0.4 })), { dependencies: [show] });
  if (!show) return null;
  return (
    <div ref={ref} className="rounded-xl bg-success-soft px-4 py-3 text-sm leading-snug text-fg">
      <span className="font-medium text-success">{lang === "pt" ? "Isso! " : "Right! "}</span>
      <Inline text={text} />
    </div>
  );
}

const Kicker = ({ children }: { children: string }) => <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{children}</div>;

const shake = (el: Element | null | undefined) => el && !reduced() && gsap.fromTo(el, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1.2,0.3)" });

function useEnterAnim() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.fromTo("[data-q]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
      gsap.fromTo("[data-opt]", { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.07, delay: 0.2, ease: "back.out(2)" });
    },
    { scope: ref },
  );
  return ref;
}

function QuizScene({ scene, lang, onSolved, onMiss, solved: already }: SceneProps & { scene: Of<"quiz"> }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(already);
  const opts = useRef<(HTMLButtonElement | null)[]>([]);
  const ref = useEnterAnim();
  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return;
    if (i === scene.answerIndex) {
      setSolved(true);
      pop(opts.current[i]);
      onSolved();
    } else {
      setWrong((w) => [...w, i]);
      shake(opts.current[i]);
      onMiss();
    }
  };
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div data-q className="space-y-2">
        <Kicker>{scene.code ? (lang === "pt" ? "qual é o output?" : "what's the output?") : lang === "pt" ? "pergunta rápida" : "quick check"}</Kicker>
        <p className="font-serif text-[1.6rem] leading-tight">
          <Inline text={scene.question} />
        </p>
        {scene.code && <CodeBlock code={scene.code} />}
      </div>
      <div data-interactive className="space-y-2">
        {scene.options.map((o, i) => {
          const isRight = solved && i === scene.answerIndex;
          const isWrong = wrong.includes(i);
          return (
            <button
              key={i}
              data-opt
              ref={(el) => {
                opts.current[i] = el;
              }}
              onClick={() => choose(i)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-all active:scale-[0.98] ${
                isRight ? "border-success bg-success-soft" : isWrong ? "border-danger/50 bg-danger-soft text-muted line-through" : "border-border bg-surface hover:border-border-strong"
              }`}
            >
              <span className="font-mono text-xs text-faint">{String.fromCharCode(65 + i)}</span>
              <span>
                <Inline text={o} />
              </span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="min-h-12">
        {solved ? <Why show lang={lang} text={scene.why} /> : wrong.length ? <p className="text-sm text-danger">{lang === "pt" ? "Ainda não — tenta outra." : "Not quite — try another one."}</p> : null}
      </div>
    </div>
  );
}

/** Embaralha de forma determinística (nunca devolve a ordem certa). */
function scramble(n: number, seed: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed || 7;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === i)) a.reverse();
  return a;
}

function OrderScene({ scene, lang, onSolved, onMiss, solved: already }: SceneProps & { scene: Of<"order"> }) {
  const n = scene.items.length;
  const [order, setOrder] = useState(() => (already ? Array.from({ length: n }, (_, i) => i) : scramble(n, scene.items.join("").length)));
  const [solved, setSolved] = useState(already);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const drag = useRef<{ pos: number; startY: number; h: number; moved: boolean; el: HTMLElement } | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const ref = useEnterAnim();

  const move = (from: number, to: number) =>
    setOrder((o) => {
      const next = [...o];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  const onDown = (e: RPointerEvent<HTMLElement>, pos: number) => {
    if (solved) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    drag.current = { pos, startY: e.clientY, h: el.offsetHeight + 8, moved: false, el };
  };
  const onMove = (e: RPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    let dy = e.clientY - d.startY;
    if (Math.abs(dy) > 5) d.moved = true;
    if (dy > d.h / 2 && d.pos < n - 1) {
      move(d.pos, d.pos + 1);
      d.pos++;
      d.startY += d.h;
      dy -= d.h;
      sfx.tick();
    } else if (dy < -d.h / 2 && d.pos > 0) {
      move(d.pos, d.pos - 1);
      d.pos--;
      d.startY -= d.h;
      dy += d.h;
      sfx.tick();
    }
    const el = list.current?.children[d.pos] as HTMLElement | undefined;
    if (el) el.style.transform = `translateY(${dy}px) scale(1.03)`;
    setChecked(false);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    list.current?.querySelectorAll<HTMLElement>("[data-opt]").forEach((el) => (el.style.transform = ""));
    if (!d.moved) {
      // Toque: seleciona e depois troca com outro.
      if (selected === null) setSelected(d.pos);
      else {
        if (selected !== d.pos) move(selected, d.pos);
        setSelected(null);
        setChecked(false);
      }
    }
  };
  const check = () => {
    setChecked(true);
    if (order.every((v, i) => v === i)) {
      setSolved(true);
      onSolved();
      if (!reduced()) enterFrom(list.current!.children, { scale: 1.05 }, { duration: 0.3, stagger: 0.06, ease: "back.out(3)" });
    } else {
      onMiss();
      list.current?.querySelectorAll("[data-bad]").forEach((el) => shake(el));
    }
  };

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div data-q className="space-y-2">
        <Kicker>{lang === "pt" ? "põe na ordem" : "put in order"}</Kicker>
        <p className="font-serif text-[1.5rem] leading-tight">
          <Inline text={scene.question} />
        </p>
        {!solved && <p className="text-xs text-faint">{lang === "pt" ? "Arrasta, ou toca em dois para trocar." : "Drag, or tap two to swap."}</p>}
      </div>
      <div ref={list} data-interactive className="space-y-2">
        {order.map((item, pos) => {
          const bad = checked && item !== pos;
          return (
            <div
              key={item}
              data-opt
              data-bad={bad || undefined}
              onPointerDown={(e) => onDown(e, pos)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className={`flex touch-none items-center gap-3 rounded-xl border px-4 py-3 text-[15px] transition-colors ${solved ? "cursor-default" : "cursor-grab active:cursor-grabbing"} ${
                solved || (checked && !bad) ? "border-success bg-success-soft" : bad ? "border-danger/50 bg-danger-soft" : selected === pos ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
            >
              <span className="font-mono text-xs text-faint">{pos + 1}</span>
              <span className="flex-1">
                <Inline text={scene.items[item]} />
              </span>
              {!solved && <span className="font-mono text-faint">⋮⋮</span>}
            </div>
          );
        })}
      </div>
      {solved ? (
        <Why show lang={lang} text={scene.why} />
      ) : (
        <button data-interactive onClick={check} className="self-start rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg active:scale-[0.97]">
          {lang === "pt" ? "Verificar" : "Check"}
        </button>
      )}
    </div>
  );
}

function FillScene({ scene, lang, onSolved, onMiss, solved: already }: SceneProps & { scene: Of<"fill"> }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(already);
  const ref = useEnterAnim();
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return;
    if (i === scene.answerIndex) {
      setSolved(true);
      onSolved();
      requestAnimationFrame(() => {
        const b = ref.current?.querySelector("[data-blank]");
        if (b && !reduced()) enterFrom(b, { scale: 1.6, y: 30, autoAlpha: 0 }, { duration: 0.45, ease: "back.out(2)" });
      });
    } else {
      setWrong((w) => [...w, i]);
      shake(chips.current[i]);
      onMiss();
    }
  };
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div data-q className="space-y-2">
        <Kicker>{lang === "pt" ? "completa o código" : "fill the gap"}</Kicker>
        <p className="font-serif text-[1.5rem] leading-tight">
          <Inline text={scene.question} />
        </p>
      </div>
      <div data-q>
        <CodeBlock code={scene.code} blank={solved ? scene.choices[scene.answerIndex] : null} />
      </div>
      <div data-interactive className="flex flex-wrap gap-2">
        {scene.choices.map((c, i) => (
          <button
            key={i}
            data-opt
            ref={(el) => {
              chips.current[i] = el;
            }}
            onClick={() => choose(i)}
            className={`rounded-full border px-4 py-2 font-mono text-[14px] transition-all active:scale-95 ${
              solved && i === scene.answerIndex ? "border-success bg-success-soft" : wrong.includes(i) ? "border-danger/50 bg-danger-soft text-muted line-through" : "border-border bg-surface hover:border-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="min-h-12">
        <Why show={solved} lang={lang} text={scene.why} />
      </div>
    </div>
  );
}

function TrueFalseScene({ scene, lang, onSolved, onMiss, solved: already }: SceneProps & { scene: Of<"truefalse"> }) {
  const [pick, setPick] = useState<boolean | null>(already ? scene.answer : null);
  const card = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number } | null>(null);
  const ref = useEnterAnim();
  const L = lang === "pt" ? { t: "Verdadeiro", f: "Falso", k: "verdadeiro ou falso?", hint: "Arrasta o cartão ← falso · verdadeiro →", was: "Era" } : { t: "True", f: "False", k: "true or false?", hint: "Swipe the card ← false · true →", was: "It was" };

  const choose = (v: boolean) => {
    if (pick !== null) return;
    setPick(v);
    const right = v === scene.answer;
    if (card.current && !reduced())
      gsap
        .timeline()
        .to(card.current, { x: v ? 60 : -60, rotate: v ? 6 : -6, duration: 0.2 })
        .to(card.current, { x: 0, rotate: 0, duration: 0.5, ease: right ? "back.out(2)" : "elastic.out(1,0.4)" });
    if (!right) onMiss();
    onSolved();
  };
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (pick !== null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!drag.current || !card.current) return;
    const dx = e.clientX - drag.current.x;
    card.current.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`;
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    if (!drag.current || !card.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    card.current.style.transform = "";
    if (Math.abs(dx) > 70) choose(dx > 0);
  };

  const done = pick !== null;
  const right = pick === scene.answer;
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5">
      <div data-q>
        <Kicker>{L.k}</Kicker>
      </div>
      <div
        data-q
        data-interactive
        ref={card}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`touch-none rounded-3xl border-2 px-6 py-8 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] transition-colors ${
          !done ? "cursor-grab border-border bg-surface active:cursor-grabbing" : right ? "border-success bg-success-soft" : "border-danger/60 bg-danger-soft"
        }`}
      >
        <p className="font-serif text-[1.65rem] leading-tight">
          <Inline text={scene.statement} />
        </p>
        {done && (
          <p className={`mt-4 font-mono text-[12px] uppercase tracking-wider ${right ? "text-success" : "text-danger"}`}>
            {right ? "✓ " : `✗ ${L.was} `}
            {scene.answer ? L.t : L.f}
          </p>
        )}
      </div>
      {!done ? (
        <>
          <div data-interactive className="grid grid-cols-2 gap-2">
            <button data-opt onClick={() => choose(false)} className="rounded-xl border border-border bg-surface py-3 text-[15px] hover:border-danger/60 active:scale-[0.97]">
              ← {L.f}
            </button>
            <button data-opt onClick={() => choose(true)} className="rounded-xl border border-border bg-surface py-3 text-[15px] hover:border-success active:scale-[0.97]">
              {L.t} →
            </button>
          </div>
          <p className="text-center text-xs text-faint">{L.hint}</p>
        </>
      ) : (
        <div className="rounded-xl bg-surface-2 px-4 py-3 text-sm leading-snug">
          <Inline text={scene.why} />
        </div>
      )}
    </div>
  );
}

function RevealScene({ scene, lang, onSolved, solved: already }: SceneProps & { scene: Of<"reveal"> }) {
  const [open, setOpen] = useState<number[]>(already ? scene.cards.map((_, i) => i) : []);
  const ref = useEnterAnim();
  const flip = (i: number) => {
    if (open.includes(i)) return;
    sfx.flip();
    const next = [...open, i];
    setOpen(next);
    if (next.length === scene.cards.length) onSolved();
  };
  const all = open.length === scene.cards.length;
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div data-q>
        <Kicker>{lang === "pt" ? `toca para virar · ${open.length}/${scene.cards.length}` : `tap to flip · ${open.length}/${scene.cards.length}`}</Kicker>
      </div>
      <div data-interactive className={`grid gap-3 ${scene.cards.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {scene.cards.map((c, i) => {
          const o = open.includes(i);
          return (
            <button
              key={i}
              data-opt
              onClick={() => flip(i)}
              className={`h-32 [perspective:800px] ${scene.cards.length === 3 && i === 2 ? "col-span-2" : ""}`}
              aria-pressed={o}
            >
              <div className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${o ? "[transform:rotateY(180deg)]" : ""}`}>
                <div className="absolute inset-0 grid place-items-center rounded-2xl border border-border bg-surface px-3 text-center font-serif text-xl [backface-visibility:hidden]">
                  <span>
                    <Inline text={c.front} />
                  </span>
                  <span className="absolute bottom-2 right-3 font-mono text-[10px] text-faint">↻</span>
                </div>
                <div className="absolute inset-0 grid place-items-center rounded-2xl border border-accent/50 bg-accent-soft px-3 text-center text-[13px] leading-snug [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span>
                    <Inline text={c.back} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="min-h-12">
        <Why show={all} lang={lang} text={scene.why} />
      </div>
    </div>
  );
}

export function SceneView(props: SceneProps) {
  const { scene, t, timing } = props;
  const shown = useShown(scene, t, timing);
  switch (scene.type) {
    case "title":
      return <TitleScene scene={scene} shown={shown} />;
    case "flow":
      return <FlowScene scene={scene} shown={shown} />;
    case "list":
      return <ListScene scene={scene} shown={shown} />;
    case "compare":
      return <CompareScene scene={scene} shown={shown} />;
    case "visual":
      return <VisualScene scene={scene} shown={shown} />;
    case "code":
      return <CodeScene scene={scene} t={t} timing={timing} />;
    case "quiz":
      return <QuizScene {...props} scene={scene} />;
    case "order":
      return <OrderScene {...props} scene={scene} />;
    case "fill":
      return <FillScene {...props} scene={scene} />;
    case "truefalse":
      return <TrueFalseScene {...props} scene={scene} />;
    case "reveal":
      return <RevealScene {...props} scene={scene} />;
  }
}
