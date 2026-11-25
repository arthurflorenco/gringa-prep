"use client";

import { useRef, useState } from "react";
import type { Exercise } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { pop } from "@/lib/use-enter";
import type { PlayerProps } from "./types";

type Quiz = Extract<Exercise, { kind: "quiz" }>;

export function QuizPlayer({ data, onDone }: PlayerProps<Quiz>) {
  const [picked, setPicked] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const correct = picked === data.answerIndex;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    requestAnimationFrame(() => pop(resultRef.current));
  };
  const finish = () => picked !== null && onDone({ rating: correct ? Rating.Good : Rating.Again, correct, answer: data.options[picked] });

  useHotkeys({
    ...Object.fromEntries(data.options.map((_, i) => [String(i + 1), picked === null ? () => pick(i) : undefined])),
    enter: picked !== null && finish,
  });

  return (
    <div className="space-y-6">
      <div data-enter>
        <Md>{data.prompt}</Md>
      </div>
      <div data-enter className="grid gap-2">
        {data.options.map((opt, i) => {
          const isAnswer = i === data.answerIndex;
          const state =
            picked === null
              ? "border-border hover:border-border-strong"
              : isAnswer
                ? "border-success bg-success-soft"
                : picked === i
                  ? "border-danger bg-danger-soft"
                  : "border-border opacity-50";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-left font-mono text-sm transition-all ${state}`}
            >
              <Kbd>{i + 1}</Kbd>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div ref={resultRef} data-enter className="space-y-4">
          <div className={`rounded-xl p-4 ${correct ? "bg-success-soft" : "bg-danger-soft"}`}>
            <div className={`mb-1 text-sm font-semibold ${correct ? "text-success" : "text-danger"}`}>
              {correct ? "Certo." : "Ainda não."}
            </div>
            <Md className="text-sm">{data.explanation}</Md>
          </div>
          <Button variant="primary" onClick={finish}>
            {correct ? "Próximo" : "Entendi — revejo amanhã"} <Kbd>↵</Kbd>
          </Button>
        </div>
      )}
    </div>
  );
}
