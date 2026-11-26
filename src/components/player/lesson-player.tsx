"use client";

import { useState } from "react";
import type { Lesson } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ReelPlayer } from "./reel-player";
import type { PlayerProps } from "./types";

/**
 * Aula: abre em formato reel (cenas animadas + narração); dá para ler em texto.
 * "Entendi" marca como feita. Não entra na revisão espaçada.
 */
export function LessonPlayer({ data, onDone, lang }: PlayerProps<Lesson>) {
  const [mode, setMode] = useState<"reel" | "text">("reel");
  const finish = () => onDone({ rating: Rating.Good, correct: true, schedule: false });
  useHotkeys({ enter: mode === "text" && finish });

  if (mode === "reel")
    return (
      <div data-enter className="space-y-3">
        <ReelPlayer scenes={data.reel} title={data.title} lang={lang} onFinish={finish} onReadText={() => setMode("text")} />
        <p className="text-center font-mono text-[11px] text-faint">
          ← → {lang === "pt" ? "cenas" : "scenes"} · {lang === "pt" ? "espaço pausa" : "space pause"} · M {lang === "pt" ? "som" : "sound"} · T EN/PT
        </p>
      </div>
    );

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
      <div data-enter className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={finish}>
          {lang === "pt" ? "Entendi" : "Got it"} <Kbd>↵</Kbd>
        </Button>
        <Button variant="ghost" onClick={() => setMode("reel")}>
          ▶ {lang === "pt" ? "Ver em reel" : "Watch as reel"}
        </Button>
        <span className="text-xs text-faint">{lang === "pt" ? "As perguntas sobre esta aula vêm a seguir." : "Questions about this lesson come next."}</span>
      </div>
    </div>
  );
}
