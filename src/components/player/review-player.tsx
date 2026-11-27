"use client";

import { useState } from "react";
import type { ReviewExercise } from "@/lib/content/schema";
import { gradeReview, type ReviewGrade } from "@/lib/grading/review";
import { Md } from "@/components/md";
import { Button, Kbd, Label, Pill } from "@/components/ui";
import { SpeakAlong } from "@/components/speak-along";
import { useHotkeys } from "@/lib/use-hotkeys";
import { getContent } from "@/lib/content";
import { AutoResult } from "./auto-result";
import type { PlayerProps } from "./types";

const KIND_LABEL: Record<ReviewExercise["issues"][number]["kind"], string> = {
  bug: "bug",
  security: "segurança",
  performance: "performance",
  readability: "legibilidade",
};

/** Code review: clica nas linhas com problema; depois vê o que achou, o que faltou e o comentário a dizer. */
export function ReviewPlayer({ data, itemId, day, onDone, lang }: PlayerProps<ReviewExercise>) {
  const [flagged, setFlagged] = useState<number[]>([]);
  const [grade, setGrade] = useState<ReviewGrade | null>(null);
  const lines = data.code.split("\n");
  const issueAt = new Map(data.issues.map((i) => [i.line, i]));
  // Comentários sempre também em inglês (é o que se diz na entrevista).
  const enIssues = (getContent().itemById.get(itemId) as { exercise: ReviewExercise } | undefined)?.exercise.issues ?? data.issues;

  const toggle = (n: number) => !grade && setFlagged((f) => (f.includes(n) ? f.filter((x) => x !== n) : [...f, n]));
  const submit = () => setGrade(gradeReview(flagged, data.issues.map((i) => i.line)));
  useHotkeys({ "mod+enter": !grade && flagged.length > 0 && submit });

  return (
    <div className="space-y-6">
      <div data-enter className="space-y-3">
        <Md className="text-[17px]">{data.prompt}</Md>
        <div className="rounded-xl border-l-2 border-accent bg-surface-2/50 px-4 py-3 text-sm text-muted">
          <Md className="text-sm">{data.context}</Md>
        </div>
        {!grade && (
          <p className="text-xs text-faint">
            Clica nas linhas que comentarias no PR ({data.issues.length} {data.issues.length === 1 ? "problema" : "problemas"} escondidos). Marcar linhas boas tira pontos.
          </p>
        )}
      </div>

      <div data-enter className="overflow-hidden rounded-2xl bg-code-bg py-3 font-mono text-[13px] leading-[1.7] text-code-fg">
        {lines.map((l, i) => {
          const n = i + 1;
          const mark = flagged.includes(n);
          const issue = issueAt.get(n);
          const state = !grade ? (mark ? "flag" : "") : issue ? (mark ? "found" : "missed") : mark ? "false" : "";
          const bg =
            state === "flag"
              ? "bg-accent/25"
              : state === "found"
                ? "bg-success/25"
                : state === "missed"
                  ? "bg-accent/20"
                  : state === "false"
                    ? "bg-danger/25"
                    : "hover:bg-white/5";
          return (
            <div key={n}>
              <button onClick={() => toggle(n)} disabled={!!grade} className={`flex w-full px-3 text-left transition-colors ${bg} ${grade ? "cursor-default" : "cursor-pointer"}`}>
                <span className="mr-3 w-5 shrink-0 select-none text-right opacity-40">{n}</span>
                <span className="w-4 shrink-0 select-none">{state === "found" ? "✓" : state === "missed" ? "⚠" : state === "false" ? "✗" : mark ? "●" : ""}</span>
                <span className="flex-1 whitespace-pre-wrap break-words">{l || " "}</span>
              </button>
              {grade && issue && (
                <div className="mx-3 my-1.5 rounded-lg bg-bg/90 px-3 py-2 font-sans text-[13px] leading-relaxed text-fg">
                  <Pill tone={issue.kind === "security" ? "danger" : issue.kind === "bug" ? "accent" : "neutral"}>{KIND_LABEL[issue.kind]}</Pill>{" "}
                  <Md className="mt-1 text-[13px]">{issue.comment}</Md>
                </div>
              )}
              {grade && state === "false" && <div className="mx-3 my-1 font-sans text-xs text-danger">Esta linha estava boa.</div>}
            </div>
          );
        })}
      </div>

      {!grade ? (
        <div data-enter className="flex items-center gap-3">
          <Button variant="primary" onClick={submit} disabled={!flagged.length}>
            Enviar revisão <Kbd>⌘↵</Kbd>
          </Button>
          <span className="text-xs text-faint">{flagged.length} linhas marcadas</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div data-enter className="text-sm">
            Achaste <strong>{grade.found.length}</strong> de {data.issues.length}
            {grade.falsePositives.length > 0 && <span className="text-danger"> · {grade.falsePositives.length} linha(s) boa(s) marcada(s)</span>}
          </div>
          <div data-enter className="space-y-2">
            <Label>diz o comentário em inglês, como farias no PR / na entrevista</Label>
            {enIssues.map((iss) => (
              <SpeakAlong key={iss.line} text={iss.comment} label={`linha ${iss.line}`} compact />
            ))}
          </div>
          <AutoResult
            itemId={itemId}
            day={day}
            rating={grade.rating}
            onContinue={() => onDone({ rating: grade.rating, correct: grade.score >= 0.6, answer: flagged.join(",") })}
          />
          {lang === "pt" && <p className="text-xs text-faint">Os comentários acima estão em inglês de propósito — treina a dizê-los.</p>}
        </div>
      )}
    </div>
  );
}
