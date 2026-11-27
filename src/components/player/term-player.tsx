"use client";

import { useMemo, useRef, useState } from "react";
import type { Term } from "@/lib/content/schema";
import { getContent } from "@/lib/content";
import { termOptions } from "@/lib/grading/term-options";
import { Rating } from "@/lib/srs";
import { Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { pop } from "@/lib/use-enter";
import { AutoResult } from "./auto-result";
import { SpeakAlong } from "@/components/speak-along";
import type { PlayerProps } from "./types";

/** Termo técnico: escolhe a definição certa (corrigido automaticamente), depois a frase de entrevista. */
export function TermPlayer({ data, itemId, day, onDone, lang }: PlayerProps<Term>) {
  const { terms, topicBySlug } = getContent();
  const { options, answerIndex } = useMemo(() => termOptions(data, terms, lang, (s) => topicBySlug.get(s)?.area), [data, terms, lang, topicBySlug]);
  const [picked, setPicked] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const correct = picked === answerIndex;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    requestAnimationFrame(() => pop(resultRef.current));
  };
  useHotkeys(Object.fromEntries(options.map((_, i) => [String(i + 1), picked === null ? () => pick(i) : undefined])));

  return (
    <div className="space-y-6">
      <div data-enter className="space-y-2">
        <Label>termo técnico</Label>
        <h2 className="font-serif text-5xl leading-tight tracking-tight">{data.term}</h2>
        <p className="text-sm text-muted">{lang === "pt" ? "Qual é a definição certa?" : "Which definition is right?"}</p>
      </div>

      <div data-enter className="grid gap-2">
        {options.map((opt, i) => {
          const state =
            picked === null
              ? "border-border hover:border-border-strong"
              : i === answerIndex
                ? "border-success bg-success-soft"
                : picked === i
                  ? "border-danger bg-danger-soft"
                  : "border-border opacity-50";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`flex items-start gap-3 rounded-xl border bg-surface px-4 py-3 text-left text-sm leading-relaxed transition-all ${state}`}
            >
              <Kbd>{i + 1}</Kbd>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div ref={resultRef} className="space-y-4">
          <div data-enter className="border-l-2 border-accent pl-4">
            <Label>numa entrevista</Label>
            <p className="mt-1.5 font-serif text-xl italic leading-snug">“{data.interviewLine}”</p>
            {lang === "pt" && <p className="mt-1 text-sm text-muted">{data.interviewLinePt}</p>}
          </div>
          <div data-enter>
            <SpeakAlong text={data.interviewLine} label="ouve, grava-te e compara" compact />
          </div>
          <AutoResult
            itemId={itemId}
            day={day}
            rating={correct ? Rating.Good : Rating.Again}
            onContinue={() => onDone({ rating: correct ? Rating.Good : Rating.Again, correct, answer: options[picked] })}
          />
        </div>
      )}
    </div>
  );
}
