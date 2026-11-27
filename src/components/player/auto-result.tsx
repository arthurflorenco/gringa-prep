"use client";

import { useMemo } from "react";
import type { Grade } from "ts-fsrs";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { nowOn, type Day } from "@/lib/date";
import { previewIntervals, Rating } from "@/lib/srs";
import { t } from "@/lib/i18n/pt";
import { Button, Kbd } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";

const fmt = (d: number) => (d < 30 ? `${d} ${d === 1 ? "dia" : "dias"}` : d < 365 ? `${Math.round(d / 30)} meses` : `${Math.round(d / 365)} anos`);

/** Resultado da correção automática: nota calculada, quando volta, e Continuar (↵). */
export function AutoResult({ itemId, day, rating, onContinue, label }: { itemId: string; day: Day; rating: Grade; onContinue: () => void; label?: string }) {
  const card = useLiveQuery(() => db.cards.get(itemId), [itemId]);
  const days = useMemo(() => previewIntervals(card, nowOn(day))[rating], [card, day, rating]);
  useHotkeys({ enter: onContinue });
  const tone = rating === Rating.Again ? "text-danger" : rating === Rating.Hard ? "text-accent" : "text-success";
  return (
    <div data-enter className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="text-sm">
        <span className="text-muted">{label ?? "Avaliação automática"}: </span>
        <span className={`font-medium ${tone}`}>{t.ratings[rating]}</span>
        <span className="font-mono text-[11px] text-faint"> · volta em {fmt(days)}</span>
      </div>
      <Button variant="primary" className="ml-auto" onClick={onContinue}>
        Continuar <Kbd>↵</Kbd>
      </Button>
    </div>
  );
}
