import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

export { Rating };
export type { Card };

/** Granularidade em dias: sem "passos curtos" de minutos — errou, volta amanhã. */
const scheduler = fsrs({ enable_short_term: false, enable_fuzz: false, request_retention: 0.9 });

export function newCard(now: Date): Card {
  return createEmptyCard(now);
}

export function review(card: Card, rating: Grade, now: Date): Card {
  return scheduler.next(card, now, rating).card;
}

/** Intervalo previsto (em dias) para cada avaliação — mostrado nos botões. */
export function previewIntervals(card: Card | undefined, now: Date): Record<Grade, number> {
  const c = card ?? newCard(now);
  const p = scheduler.repeat(c, now);
  const days = (g: Grade) => Math.max(1, Math.round((p[g].card.due.getTime() - now.getTime()) / 86_400_000));
  return { [Rating.Again]: days(Rating.Again), [Rating.Hard]: days(Rating.Hard), [Rating.Good]: days(Rating.Good), [Rating.Easy]: days(Rating.Easy) } as Record<Grade, number>;
}
