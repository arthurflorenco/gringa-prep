"use client";

import { Fragment, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Lang, ReelScene } from "@/lib/content/schema";
import { pop } from "@/lib/use-enter";

gsap.registerPlugin(useGSAP);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Texto com `código` inline. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-surface-2 px-1 py-px font-mono text-[0.88em] text-accent">
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Corre a animação de entrada (só se o utilizador não pediu menos movimento). */
function useSceneAnim<T extends HTMLElement = HTMLDivElement>(build: (tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const q = (sel: string) => gsap.utils.toArray<Element>(sel, ref.current);
      const tl = gsap.timeline();
      build(tl, q);
      if (reduced()) tl.progress(1, false);
    },
    { scope: ref },
  );
  return ref;
}

function TitleScene({ scene }: { scene: Extract<ReelScene, { type: "title" }> }) {
  const ref = useSceneAnim((tl, q) => {
    tl.from(q("[data-w]"), { yPercent: 110, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 });
    tl.from(q("[data-sub]"), { autoAlpha: 0, y: 10, duration: 0.4 }, "-=0.2");
  });
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5">
      <h2 className="font-serif text-[2.6rem] leading-[1.05] tracking-tight">
        {scene.headline.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <span data-w className="inline-block">
              {w}&nbsp;
            </span>
          </span>
        ))}
      </h2>
      {scene.sub && (
        <p data-sub className="text-lg leading-snug text-muted">
          <Inline text={scene.sub} />
        </p>
      )}
    </div>
  );
}

const ON = ["border-accent", "bg-accent-soft"];

function FlowScene({ scene }: { scene: Extract<ReelScene, { type: "flow" }> }) {
  const ref = useSceneAnim((tl, q) => {
    const boxes = q("[data-box]");
    const arrows = q("[data-arrow]");
    boxes.forEach((box, i) => {
      if (i > 0) tl.from(arrows[i - 1], { scaleY: 0, transformOrigin: "top", duration: 0.25, ease: "power1.in" });
      tl.from(box, { autoAlpha: 0, y: 14, scale: 0.94, duration: 0.3, ease: "back.out(2)" });
      tl.call(() => {
        boxes.forEach((b) => b.classList.remove(...ON));
        box.classList.add(...ON);
      });
    });
  });
  return (
    <div ref={ref} className="flex h-full flex-col items-stretch justify-center">
      {scene.steps.map((step, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <div data-arrow className="mx-auto h-6 w-px bg-border-strong">
              <div className="relative top-full -ml-[3px] h-0 w-0 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-border-strong" />
            </div>
          )}
          <div data-box className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-[15px] transition-colors duration-300">
            <span className="mr-2 font-mono text-[11px] text-faint">{i + 1}</span>
            <Inline text={step} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function ListScene({ scene }: { scene: Extract<ReelScene, { type: "list" }> }) {
  const ref = useSceneAnim<HTMLUListElement>((tl, q) => {
    tl.from(q("[data-item]"), { autoAlpha: 0, x: -24, duration: 0.35, ease: "power2.out", stagger: 0.45 });
  });
  return (
    <ul ref={ref} className="flex h-full flex-col justify-center gap-3">
      {scene.items.map((item, i) => (
        <li key={i} data-item className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-[16px] leading-snug">
          <span className="font-mono text-sm text-accent">{i + 1}</span>
          <span>
            <Inline text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function CompareScene({ scene }: { scene: Extract<ReelScene, { type: "compare" }> }) {
  const ref = useSceneAnim((tl, q) => {
    tl.from(q("[data-col=l]"), { autoAlpha: 0, x: -30, duration: 0.4, ease: "power2.out" });
    tl.from(q("[data-col=r]"), { autoAlpha: 0, x: 30, duration: 0.4, ease: "power2.out" }, "<0.1");
    tl.from(q("[data-ci]"), { autoAlpha: 0, y: 8, duration: 0.25, stagger: 0.25 });
  });
  const col = (side: "l" | "r", c: { label: string; items: string[] }) => (
    <div data-col={side} className={`flex-1 rounded-2xl border p-4 ${side === "l" ? "border-border bg-surface" : "border-accent/40 bg-accent-soft/50"}`}>
      <div className={`mb-3 font-mono text-[12px] uppercase tracking-wider ${side === "l" ? "text-muted" : "text-accent"}`}>
        <Inline text={c.label} />
      </div>
      <ul className="space-y-2.5 text-[14px] leading-snug">
        {c.items.map((it, i) => (
          <li key={i} data-ci>
            <Inline text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div ref={ref} className="flex h-full items-center">
      <div className="flex w-full gap-3">
        {col("l", scene.left)}
        {col("r", scene.right)}
      </div>
    </div>
  );
}

function CodeScene({ scene }: { scene: Extract<ReelScene, { type: "code" }> }) {
  const lines = scene.code.split("\n");
  const ref = useSceneAnim((tl, q) => {
    const els = q("[data-line]") as HTMLElement[];
    const perChar = Math.min(0.022, 3.2 / Math.max(scene.code.length, 1));
    els.forEach((el) => (el.textContent = ""));
    els.forEach((el, i) => {
      const full = lines[i];
      const o = { n: 0 };
      tl.to(o, {
        n: full.length,
        duration: Math.max(full.length * perChar, 0.05),
        ease: "none",
        onUpdate: () => {
          el.textContent = full.slice(0, Math.round(o.n));
        },
      });
    });
    tl.call(() => scene.highlight.forEach((h) => els[h - 1]?.parentElement?.classList.add("bg-accent/25")));
  });
  return (
    <div ref={ref} className="flex h-full items-center">
      <pre className="w-full overflow-x-auto rounded-2xl bg-code-bg py-4 font-mono text-[13px] leading-[1.7] text-code-fg">
        {lines.map((l, i) => (
          <div key={i} className="flex px-4 transition-colors duration-500">
            <span className="mr-4 w-4 shrink-0 select-none text-right opacity-35">{i + 1}</span>
            <span data-line className="whitespace-pre">
              {l}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function QuizScene({
  scene,
  lang,
  onSolved,
  alreadySolved,
}: {
  scene: Extract<ReelScene, { type: "quiz" }>;
  lang: Lang;
  onSolved: () => void;
  alreadySolved: boolean;
}) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(alreadySolved);
  const optRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const whyRef = useRef<HTMLDivElement>(null);
  const ref = useSceneAnim((tl, q) => {
    tl.from(q("[data-q]"), { autoAlpha: 0, y: 12, duration: 0.4 });
    tl.from(q("[data-opt]"), { autoAlpha: 0, y: 10, duration: 0.25, stagger: 0.08 });
  });

  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return;
    if (i === scene.answerIndex) {
      setSolved(true);
      pop(optRefs.current[i]);
      requestAnimationFrame(() => whyRef.current && !reduced() && gsap.from(whyRef.current, { autoAlpha: 0, y: 8, duration: 0.35 }));
      onSolved();
    } else {
      setWrong((w) => [...w, i]);
      if (!reduced()) gsap.fromTo(optRefs.current[i], { x: -8 }, { x: 0, duration: 0.45, ease: "elastic.out(1.2,0.3)" });
    }
  };

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div data-q className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{lang === "pt" ? "pergunta rápida" : "quick check"}</div>
        <p className="font-serif text-[1.7rem] leading-tight">
          <Inline text={scene.question} />
        </p>
      </div>
      <div className="space-y-2">
        {scene.options.map((o, i) => {
          const isRight = solved && i === scene.answerIndex;
          const isWrong = wrong.includes(i);
          return (
            <button
              key={i}
              data-opt
              ref={(el) => {
                optRefs.current[i] = el;
              }}
              onClick={() => choose(i)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors ${
                isRight
                  ? "border-success bg-success-soft"
                  : isWrong
                    ? "border-danger/50 bg-danger-soft text-muted line-through"
                    : "border-border bg-surface hover:border-border-strong"
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
      <div aria-live="polite" className="min-h-12 text-sm leading-snug">
        {solved ? (
          <div ref={whyRef} className="rounded-xl bg-success-soft px-4 py-3 text-fg">
            <span className="font-medium text-success">{lang === "pt" ? "Isso! " : "Right! "}</span>
            <Inline text={scene.why} />
          </div>
        ) : wrong.length ? (
          <p className="text-danger">{lang === "pt" ? "Ainda não — tenta outra." : "Not quite — try another one."}</p>
        ) : null}
      </div>
    </div>
  );
}

export function SceneView({ scene, lang, onSolved, solved }: { scene: ReelScene; lang: Lang; onSolved: () => void; solved: boolean }) {
  switch (scene.type) {
    case "title":
      return <TitleScene scene={scene} />;
    case "flow":
      return <FlowScene scene={scene} />;
    case "list":
      return <ListScene scene={scene} />;
    case "compare":
      return <CompareScene scene={scene} />;
    case "code":
      return <CodeScene scene={scene} />;
    case "quiz":
      return <QuizScene scene={scene} lang={lang} onSolved={onSolved} alreadySolved={solved} />;
  }
}
