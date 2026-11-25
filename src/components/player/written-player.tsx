"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import type { Grade } from "ts-fsrs";
import { Md } from "@/components/md";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { RatingBar } from "./rating-bar";
import type { PlayerProps } from "./types";

type Written = Extract<Exercise, { kind: "concept" | "behavioral" }>;

function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? (setRunning(false), 0) : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <button
      onClick={() => (left === 0 ? (setLeft(seconds), setRunning(false)) : setRunning((r) => !r))}
      className={`rounded-full border px-3 py-1 font-mono text-xs tabular-nums transition-colors ${
        left === 0 ? "border-danger text-danger" : running ? "border-accent text-accent" : "border-border text-muted hover:text-fg"
      }`}
      title="Responde em voz alta dentro do tempo"
    >
      {running ? "■" : "▶"} {mm}:{ss}
    </button>
  );
}

/** Conceito ou comportamental: escreve em inglês, compara com a resposta-modelo e a rubrica. */
export function WrittenPlayer({ data, itemId, day, onDone }: PlayerProps<Written>) {
  const draftKey = `draft:${itemId}`;
  const [answer, setAnswer] = useState(() => (typeof window === "undefined" ? "" : (localStorage.getItem(draftKey) ?? "")));
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() => data.rubric.map(() => false));

  useEffect(() => {
    if (answer) localStorage.setItem(draftKey, answer);
  }, [answer, draftKey]);

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const ratio = checked.filter(Boolean).length / checked.length;
  const suggested: Grade = ratio === 1 ? Rating.Easy : ratio >= 0.6 ? Rating.Good : ratio >= 0.3 ? Rating.Hard : Rating.Again;

  useHotkeys({ "mod+enter": !revealed && (() => setRevealed(true)) });

  const finish = (g: Grade) => {
    localStorage.removeItem(draftKey);
    onDone({ rating: g, correct: g >= Rating.Good, answer });
  };

  return (
    <div className="space-y-6">
      <div data-enter className="flex items-start justify-between gap-4">
        <Md className="text-[17px]">{data.prompt}</Md>
        {data.kind === "behavioral" && <Timer seconds={data.timeLimitSec} />}
      </div>

      <div data-enter className="space-y-2">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={revealed}
          rows={7}
          spellCheck
          lang="en"
          placeholder="Write your answer in English…"
          className="w-full resize-y rounded-xl border border-border bg-surface-2/50 p-4 leading-relaxed outline-none transition-colors placeholder:text-faint focus:border-border-strong focus:bg-surface disabled:opacity-70"
        />
        <div className="flex items-center justify-between font-mono text-[11px] text-faint">
          <span>{words} palavras</span>
          <span>rascunho guardado automaticamente</span>
        </div>
      </div>

      {!revealed ? (
        <div data-enter className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setRevealed(true)}>
            Comparar com a resposta-modelo <Kbd>⌘↵</Kbd>
          </Button>
          {!answer && <span className="text-xs text-faint">Tenta escrever algo primeiro — mesmo que incompleto.</span>}
        </div>
      ) : (
        <>
          <div data-enter className="space-y-3">
            <Label>a tua resposta cobriu…</Label>
            <ul className="space-y-1.5">
              {data.rubric.map((r, i) => (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
                    <input
                      type="checkbox"
                      checked={checked[i]}
                      onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                      className="mt-1 size-4 accent-[var(--accent)]"
                    />
                    <span className="text-sm leading-relaxed">{r}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <details data-enter open className="group rounded-xl border border-border bg-surface-2/40 p-4">
            <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              resposta-modelo
            </summary>
            <Md className="mt-3 whitespace-pre-line text-[15px]">{data.modelAnswer}</Md>
          </details>
          {data.kind === "concept" && data.followUp && (
            <div data-enter className="border-l-2 border-accent pl-4 text-sm">
              <Label>pergunta seguinte provável</Label>
              <p className="mt-1">{data.followUp}</p>
            </div>
          )}
          <RatingBar itemId={itemId} day={day} onRate={finish} suggested={suggested} />
        </>
      )}
    </div>
  );
}
