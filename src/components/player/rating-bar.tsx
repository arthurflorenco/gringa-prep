"use client";

import { useMemo } from "react";
import type { Grade } from "ts-fsrs";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { nowOn, type Day } from "@/lib/date";
import { previewIntervals, Rating } from "@/lib/srs";
import { t } from "@/lib/i18n/pt";
import { Kbd } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";

const GRADES: Grade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

const fmt = (d: number) => (d < 30 ? `${d}d` : d < 365 ? `${Math.round(d / 30)}m` : `${Math.round(d / 365)}a`);

/** Avaliação estilo Anki. `allowed` limita as opções (ex.: viu a solução → só Errei/Difícil). */
export function RatingBar({
  itemId,
  day,
  onRate,
  allowed = GRADES,
  suggested,
}: {
  itemId: string;
  day: Day;
  onRate: (g: Grade) => void;
  allowed?: Grade[];
  suggested?: Grade;
}) {
  const card = useLiveQuery(() => db.cards.get(itemId), [itemId]);
  const intervals = useMemo(() => previewIntervals(card, nowOn(day)), [card, day]);

  useHotkeys(Object.fromEntries(GRADES.map((g) => [String(g), allowed.includes(g) ? () => onRate(g) : undefined])));

  return (
    <div data-enter className="space-y-2">
      <div className="text-xs text-muted">Como foi? Isto decide quando a pergunta volta.</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {GRADES.map((g) => {
          const on = allowed.includes(g);
          const tone =
            g === Rating.Again ? "hover:border-danger/60" : g === Rating.Easy ? "hover:border-success/60" : "hover:border-border-strong";
          return (
            <button
              key={g}
              disabled={!on}
              onClick={() => onRate(g)}
              className={`group flex flex-col items-start rounded-xl border bg-surface px-3 py-2.5 text-left transition-all active:scale-[0.98] disabled:opacity-30 ${tone} ${
                suggested === g ? "border-accent ring-2 ring-accent/15" : "border-border"
              }`}
            >
              <span className="flex w-full items-center justify-between text-sm font-medium">
                {t.ratings[g]} <Kbd>{g}</Kbd>
              </span>
              <span className="font-mono text-[11px] text-faint">volta em {fmt(intervals[g])}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
