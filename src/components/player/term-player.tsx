"use client";

import { useState } from "react";
import type { Term } from "@/lib/content/schema";
import { Rating } from "@/lib/srs";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { RatingBar } from "./rating-bar";
import type { PlayerProps } from "./types";

export function TermPlayer({ data, itemId, day, onDone }: PlayerProps<Term>) {
  const [revealed, setRevealed] = useState(false);
  useHotkeys({ space: !revealed && (() => setRevealed(true)), enter: !revealed && (() => setRevealed(true)) });

  return (
    <div className="space-y-6">
      <div data-enter className="space-y-2">
        <Label>termo técnico</Label>
        <h2 className="font-serif text-5xl leading-tight tracking-tight">{data.term}</h2>
        <p className="text-sm text-muted">Diz em voz alta o que significa, em inglês, antes de revelar.</p>
      </div>

      {!revealed ? (
        <Button variant="primary" onClick={() => setRevealed(true)}>
          Revelar <Kbd>espaço</Kbd>
        </Button>
      ) : (
        <>
          <div data-enter className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-2 p-4">
              <Label>EN</Label>
              <p className="mt-1.5 leading-relaxed">{data.definitionEn}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <Label>PT</Label>
              <p className="mt-1.5 leading-relaxed text-muted">{data.definitionPt}</p>
            </div>
          </div>
          <div data-enter className="border-l-2 border-accent pl-4">
            <Label>numa entrevista</Label>
            <p className="mt-1.5 font-serif text-xl italic leading-snug">“{data.interviewLine}”</p>
          </div>
          <RatingBar
            itemId={itemId}
            day={day}
            onRate={(g) => onDone({ rating: g, correct: g !== Rating.Again })}
          />
        </>
      )}
    </div>
  );
}
