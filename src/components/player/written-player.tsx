"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { AutoResult } from "./auto-result";
import { SpeakAlong } from "@/components/speak-along";
import { getContent } from "@/lib/content";
import { gradeWritten, type WrittenGrade } from "@/lib/grading/written";
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

/** Conceito ou comportamental: escreve, e a resposta é corrigida automaticamente (rubrica + dicas de entrevista). */
export function WrittenPlayer({ data, itemId, day, onDone, lang }: PlayerProps<Written>) {
  const draftKey = `draft:${itemId}`;
  const [answer, setAnswer] = useState(() => (typeof window === "undefined" ? "" : (localStorage.getItem(draftKey) ?? "")));
  const [grade, setGrade] = useState<WrittenGrade | null>(null);

  useEffect(() => {
    if (answer) localStorage.setItem(draftKey, answer);
  }, [answer, draftKey]);

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const submit = () => {
    if (!answer.trim()) return;
    setGrade(gradeWritten({ answer, rubric: data.rubric, rubricKeys: data.rubricKeys ?? [], kind: data.kind, lang }));
  };
  useHotkeys({ "mod+enter": !grade && submit });

  const finish = () => {
    if (!grade) return;
    localStorage.removeItem(draftKey);
    onDone({ rating: grade.rating, correct: grade.rating >= Rating.Good, answer });
  };

  const pct = grade ? Math.round(grade.score * 100) : 0;
  const original = getContent().itemById.get(itemId);
  const enModelAnswer = original?.type === "exercise" && "modelAnswer" in original.exercise ? original.exercise.modelAnswer : data.modelAnswer;
  const tone = !grade ? "" : grade.rating >= Rating.Good ? "text-success" : grade.rating === Rating.Hard ? "text-accent" : "text-danger";
  const extra = grade?.tips.filter((tip) => tip.kind !== "missing") ?? [];

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
          disabled={!!grade}
          rows={7}
          spellCheck
          placeholder={lang === "pt" ? "Responde em inglês — ou em português, se ainda não conseguires…" : "Write your answer in English…"}
          className="w-full resize-y rounded-xl border border-border bg-surface-2/50 p-4 leading-relaxed outline-none transition-colors placeholder:text-faint focus:border-border-strong focus:bg-surface disabled:opacity-70"
        />
        <div className="flex items-center justify-between font-mono text-[11px] text-faint">
          <span>{words} palavras</span>
          <span>rascunho guardado automaticamente</span>
        </div>
      </div>

      {!grade ? (
        <div data-enter className="flex items-center gap-3">
          <Button variant="primary" onClick={submit} disabled={!answer.trim()}>
            Corrigir <Kbd>⌘↵</Kbd>
          </Button>
          <span className="text-xs text-faint">A correção compara com os pontos que um entrevistador espera ouvir.</span>
        </div>
      ) : (
        <>
          <div data-enter className="space-y-4 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-baseline gap-3">
              <span className={`font-serif text-4xl ${tone}`}>{pct}%</span>
              <span className="text-sm text-muted">
                cobriste {grade.covered.filter(Boolean).length} de {grade.covered.length} pontos-chave
              </span>
            </div>
            <ul className="space-y-1.5">
              {data.rubric.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className={`mt-0.5 shrink-0 font-mono ${grade.covered[i] ? "text-success" : "text-danger"}`}>{grade.covered[i] ? "✓" : "✗"}</span>
                  <span className={grade.covered[i] ? "text-muted" : ""}>{r}</span>
                </li>
              ))}
            </ul>
            {extra.length > 0 && (
              <div className="space-y-2 border-t border-border pt-4">
                <Label>o que melhorar</Label>
                <ul className="space-y-2">
                  {extra.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className="text-accent">→</span>
                      <Md className="text-sm">{tip.text}</Md>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <details data-enter open className="group rounded-xl border border-border bg-surface-2/40 p-4">
            <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              resposta-modelo — compara e copia as frases que te faltaram
            </summary>
            <Md className="mt-3 whitespace-pre-line text-[15px]">{data.modelAnswer}</Md>
          </details>
          <div data-enter>
            <SpeakAlong text={enModelAnswer} label="resposta-modelo em inglês — ouve e repete" />
          </div>
          {data.kind === "concept" && data.followUp && (
            <div data-enter className="border-l-2 border-accent pl-4 text-sm">
              <Label>pergunta seguinte provável</Label>
              <p className="mt-1">{data.followUp}</p>
            </div>
          )}
          <AutoResult itemId={itemId} day={day} rating={grade.rating} onContinue={finish} />
        </>
      )}
    </div>
  );
}
