"use client";

import type { Lesson } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { PlayerProps } from "./types";

/** Aula: lê, revê os pontos-chave e marca como entendida. Não entra na revisão espaçada. */
export function LessonPlayer({ data, onDone, lang }: PlayerProps<Lesson>) {
  const finish = () => onDone({ rating: Rating.Good, correct: true, schedule: false });
  useHotkeys({ enter: finish });

  return (
    <div className="space-y-8">
      <p data-enter className="text-lg text-muted">
        {data.prompt}
      </p>
      <article data-enter className="text-[16px]">
        <Md>{data.body}</Md>
      </article>
      <div data-enter className="rounded-2xl border border-border bg-surface-2/50 p-5">
        <Label>{lang === "pt" ? "para lembrar" : "key points"}</Label>
        <ul className="mt-3 space-y-2">
          {data.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-0.5 font-mono text-accent">{i + 1}</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-enter className="flex items-center gap-3">
        <Button variant="primary" onClick={finish}>
          Entendi <Kbd>↵</Kbd>
        </Button>
        <span className="text-xs text-faint">As perguntas sobre esta aula vêm a seguir.</span>
      </div>
    </div>
  );
}
