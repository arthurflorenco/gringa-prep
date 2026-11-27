"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getContent } from "@/lib/content";
import { endOfDay, type Day } from "@/lib/date";

export type ItemStatus = "done" | "review" | "new";
export interface ItemProgress {
  status: ItemStatus;
  lastDay: Day;
}

/**
 * Estado de cada item a partir das tentativas: feito (última certa; aulas = qualquer tentativa),
 * a rever (última errada, ou card vencido) ou novo. `undefined` enquanto carrega.
 * A ordem de iteração do Map é a das tentativas: a última chave é o item feito por último.
 */
export function useProgress(today?: Day | null): Map<string, ItemProgress> | undefined {
  return useLiveQuery(async () => {
    const [attempts, cards] = await Promise.all([db.attempts.orderBy("id").toArray(), db.cards.toArray()]);
    const { itemById } = getContent();
    const out = new Map<string, ItemProgress>();
    for (const a of attempts) {
      const it = itemById.get(a.itemId);
      const lesson = it?.type === "exercise" && it.exercise.kind === "lesson";
      // delete + set: a ordem do Map fica a da tentativa mais recente (a última chave = o que fiz por último).
      out.delete(a.itemId);
      out.set(a.itemId, { status: lesson || a.correct ? "done" : "review", lastDay: a.day });
    }
    if (today) {
      const limit = endOfDay(today).getTime();
      for (const c of cards) {
        const p = out.get(c.itemId);
        if (p && p.status === "done" && c.due.getTime() <= limit && p.lastDay !== today) p.status = "review";
      }
    }
    return out;
  }, [today]);
}
