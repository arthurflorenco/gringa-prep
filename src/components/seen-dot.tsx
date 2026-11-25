"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

/** Ponto de estado: cinza = nunca visto, verde = aprendido, terracota = em revisão. */
export function SeenDot({ id }: { id: string }) {
  const card = useLiveQuery(() => db.cards.get(id), [id]);
  const tone = !card ? "bg-border-strong" : (card.lastRating ?? 0) >= 3 ? "bg-success" : "bg-accent";
  return <span className={`size-1.5 shrink-0 rounded-full ${tone}`} aria-hidden />;
}
