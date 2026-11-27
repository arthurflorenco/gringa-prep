"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ReelScene } from "@/lib/content/schema";
import { Inline } from "./reel-inline";

gsap.registerPlugin(useGSAP);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Visual = Extract<ReelScene, { type: "visual" }>;

const REST: Record<string, number> = { autoAlpha: 1, opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0 };
/**
 * Como `gsap.from`, mas com o estado final explícito: o `from` com o duplo-mount do StrictMode
 * pode ler o estado inicial como final e deixar o elemento invisível.
 */
export function enterFrom(target: gsap.TweenTarget, from: gsap.TweenVars, vars: gsap.TweenVars = {}) {
  const to: gsap.TweenVars = { ...vars };
  for (const k of Object.keys(from)) if (k in REST) to[k] = REST[k];
  return gsap.fromTo(target, from, to);
}

/**
 * Anima os elementos [data-unit] com índice em [antes, shown). O estado final aparece
 * logo quando o utilizador prefere menos movimento.
 */
export function useUnits<T extends HTMLElement>(shown: number, from: gsap.TweenVars, after?: (el: Element, i: number) => void) {
  const ref = useRef<T>(null);
  const prev = useRef(0);
  useGSAP(
    () => {
      const els = gsap.utils.toArray<Element>("[data-unit]", ref.current);
      for (let i = prev.current; i < Math.min(shown, els.length); i++) {
        if (!reduced()) {
          const { ease, duration, ...start } = from;
          enterFrom(els[i], start, { ease: ease ?? "back.out(1.8)", duration: duration ?? 0.45 });
        }
        after?.(els[i], i);
      }
      prev.current = Math.max(prev.current, shown);
    },
    { scope: ref, dependencies: [shown] },
  );
  return ref;
}

const hide = (visible: boolean) => (visible ? undefined : ({ visibility: "hidden" } as const));

/* ── request: um pacote viaja pelo caminho e volta com a resposta ───────────────────────── */
function RequestVisual({ labels, shown }: { labels: string[]; shown: number }) {
  const n = labels.length;
  const pos = labels.map((_, i) => ({ x: n === 2 ? 50 : i % 2 ? 70 : 30, y: 10 + (i * 80) / Math.max(n - 1, 1) }));
  const packet = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(0);
  useGSAP(
    () => {
      const p = packet.current;
      if (!p || shown === 0) return;
      const target = pos[Math.min(shown, n) - 1];
      const nodes = gsap.utils.toArray<HTMLElement>("[data-unit]", ref.current);
      const tl = gsap.timeline();
      if (prev.current === 0) gsap.set(p, { left: `${pos[0].x}%`, top: `${pos[0].y}%`, autoAlpha: 1 });
      for (let i = prev.current; i < shown; i++) {
        tl.fromTo(nodes[i], { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" }, i === prev.current ? 0 : ">");
        tl.fromTo(`[data-seg="${i}"]`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "power1.inOut" }, "<");
      }
      tl.to(p, { left: `${target.x}%`, top: `${target.y}%`, duration: 0.5, ease: "power2.inOut" }, prev.current === 0 ? 0 : "<");
      if (shown >= n && prev.current < n) {
        // Resposta: volta ao início, verde.
        tl.to(p, { backgroundColor: "var(--success)", boxShadow: "0 0 18px var(--success)", duration: 0.2 }, "+=0.5");
        [...pos].reverse().slice(1).forEach((q) => tl.to(p, { left: `${q.x}%`, top: `${q.y}%`, duration: 0.32, ease: "power1.inOut" }));
        tl.to(ref.current!.querySelector("[data-unit]"), { scale: 1.08, yoyo: true, repeat: 1, duration: 0.18 });
      }
      if (reduced()) tl.progress(1);
      prev.current = shown;
    },
    { scope: ref, dependencies: [shown] },
  );
  return (
    <div ref={ref} className="relative h-full min-h-[380px] w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {pos.slice(1).map((q, i) => (
          <line
            key={i}
            data-seg={i + 1}
            x1={pos[i].x}
            y1={pos[i].y}
            x2={q.x}
            y2={q.y}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={i + 1 < shown ? 0 : 1}
            className="stroke-accent/60"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {labels.map((l, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%`, maxWidth: "62%" }}>
          <div
            data-unit
            className={`rounded-2xl border px-4 py-2.5 text-center text-[14px] font-medium shadow-sm transition-colors duration-300 ${
              i === shown - 1 ? "border-accent bg-accent-soft" : "border-border bg-surface"
            }`}
            style={hide(i < shown)}
          >
            <Inline text={l} />
          </div>
        </div>
      ))}
      <div
        ref={packet}
        aria-hidden
        className="pointer-events-none absolute z-10 -ml-[7px] -mt-[7px] h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_16px_var(--accent)]"
        style={{ visibility: "hidden" }}
      />
    </div>
  );
}

/* ── tree: nós a crescer, profundidade pelos espaços iniciais ─────────────────────────── */
function TreeVisual({ labels, shown }: { labels: string[]; shown: number }) {
  const ref = useUnits<HTMLUListElement>(shown, { autoAlpha: 0, x: -16, scale: 0.9 });
  return (
    <ul ref={ref} className="flex h-full flex-col justify-center gap-1.5">
      {labels.map((raw, i) => {
        const depth = raw.length - raw.trimStart().length;
        return (
          <li key={i} data-unit className="flex items-center" style={{ paddingLeft: depth * 22, ...hide(i < shown) }}>
            {depth > 0 && <span className="mr-1.5 font-mono text-sm text-faint">└─</span>}
            <span
              className={`rounded-lg border px-3 py-1.5 font-mono text-[13px] transition-colors duration-300 ${
                i === shown - 1 ? "border-accent bg-accent-soft text-fg" : "border-border bg-surface text-muted"
              }`}
            >
              <Inline text={raw.trim()} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ── stack: push / pop ("-") ──────────────────────────────────────────────────────────── */
function stackAt(labels: string[], n: number) {
  const stack: { label: string; id: number }[] = [];
  let popped: { label: string; id: number } | null = null;
  labels.slice(0, n).forEach((l, i) => {
    popped = null;
    if (l.trim() === "-") popped = stack.pop() ?? null;
    else stack.push({ label: l, id: i });
  });
  return { stack, popped: popped as { label: string; id: number } | null };
}

function StackVisual({ labels, shown }: { labels: string[]; shown: number }) {
  const { stack, popped } = stackAt(labels, shown);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced() || shown === 0) return;
      const ghost = ref.current?.querySelector("[data-ghost]");
      if (ghost) gsap.fromTo(ghost, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -60, rotate: -4, duration: 0.5, ease: "power2.in" });
      const top = ref.current?.querySelector(`[data-frame="${shown - 1}"]`);
      if (top) enterFrom(top, { y: -80, autoAlpha: 0 }, { duration: 0.45, ease: "bounce.out" });
      enterFrom(ref.current!.querySelector("[data-op]"), { autoAlpha: 0, scale: 0.8 }, { duration: 0.25 });
    },
    { scope: ref, dependencies: [shown] },
  );
  const last = labels[shown - 1];
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-4">
      <div data-op className="font-mono text-[12px] text-accent" style={hide(shown > 0)}>
        {last?.trim() === "-" ? "pop " : "push "}
        <Inline text={(last?.trim() === "-" ? popped?.label : last) ?? ""} />
      </div>
      <div className="relative flex w-3/4 flex-col-reverse gap-1.5 rounded-b-2xl border-x-2 border-b-2 border-border-strong px-2 pb-2 pt-10">
        {stack.map((f, i) => (
          <div
            key={f.id}
            data-frame={f.id}
            className={`rounded-lg border px-3 py-2 text-center font-mono text-[13px] ${i === stack.length - 1 ? "border-accent bg-accent-soft" : "border-border bg-surface text-muted"}`}
          >
            <Inline text={f.label} />
          </div>
        ))}
        {popped && labels[shown - 1]?.trim() === "-" && (
          <div data-ghost className="absolute inset-x-2 rounded-lg border border-danger/50 bg-danger-soft px-3 py-2 text-center font-mono text-[13px]" style={{ bottom: 8 + stack.length * 42 }}>
            <Inline text={popped.label} />
          </div>
        )}
        {!stack.length && !popped && <div className="py-2 text-center font-mono text-[12px] text-faint">empty</div>}
      </div>
    </div>
  );
}

/* ── boxes: variáveis como caixas cujo valor muda ─────────────────────────────────────── */
function boxesAt(labels: string[], n: number) {
  const boxes = new Map<string, { value: string; v: number }>();
  let last = "";
  labels.slice(0, n).forEach((l, i) => {
    const eq = l.indexOf("=");
    const name = (eq >= 0 ? l.slice(0, eq) : l).trim();
    const value = eq >= 0 ? l.slice(eq + 1).trim() : "";
    boxes.set(name, { value, v: i });
    last = name;
  });
  return { boxes: [...boxes.entries()], last };
}

function BoxesVisual({ labels, shown }: { labels: string[]; shown: number }) {
  const { boxes, last } = boxesAt(labels, shown);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced() || !last) return;
      const box = ref.current?.querySelector(`[data-box="${CSS.escape(last)}"]`);
      const val = box?.querySelector("[data-val]");
      if (val) enterFrom(val, { y: -26, autoAlpha: 0, scale: 1.4 }, { duration: 0.45, ease: "back.out(2)" });
      if (box) gsap.fromTo(box, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
    },
    { scope: ref, dependencies: [shown] },
  );
  return (
    <div ref={ref} className="flex h-full flex-wrap content-center items-center justify-center gap-3">
      {boxes.map(([name, { value, v }]) => (
        <div
          key={name}
          data-box={name}
          className={`flex min-w-[42%] flex-col items-center rounded-2xl border-2 px-4 pb-3 pt-2 transition-colors duration-300 ${
            name === last ? "border-accent bg-accent-soft" : "border-border bg-surface"
          }`}
        >
          <span className="font-mono text-[12px] text-muted">{name}</span>
          <span key={v} data-val className="mt-1 font-mono text-2xl text-fg">
            <Inline text={value || "·"} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function VisualScene({ scene, shown }: { scene: Visual; shown: number }) {
  switch (scene.kind) {
    case "request":
      return <RequestVisual labels={scene.labels} shown={shown} />;
    case "tree":
      return <TreeVisual labels={scene.labels} shown={shown} />;
    case "stack":
      return <StackVisual labels={scene.labels} shown={shown} />;
    case "boxes":
      return <BoxesVisual labels={scene.labels} shown={shown} />;
  }
}
