"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getContent } from "@/lib/content";
import { addDays, endOfDay, parseDay, streak } from "@/lib/date";
import { useToday } from "@/lib/use-today";
import { Label } from "@/components/ui";

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <Label>{label}</Label>
      <div className="mt-2 font-serif text-4xl tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-faint">{hint}</div>}
    </div>
  );
}

export function ProgressView() {
  const day = useToday();
  const attempts = useLiveQuery(() => db.attempts.toArray(), []);
  const cards = useLiveQuery(() => db.cards.toArray(), []);
  const content = getContent();

  if (!day || !attempts || !cards) return <div className="h-64 animate-pulse rounded-2xl bg-surface-2/60" />;

  const days = streak(attempts.map((a) => a.day), day);
  const correct = attempts.filter((a) => a.correct).length;
  const accuracy = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
  const dueTomorrow = cards.filter((c) => c.due.getTime() <= endOfDay(addDays(day, 1)).getTime()).length;

  const last14 = Array.from({ length: 14 }, (_, i) => addDays(day, i - 13));
  const perDay = last14.map((d) => ({ d, n: attempts.filter((a) => a.day === d).length }));
  const max = Math.max(1, ...perDay.map((p) => p.n));

  const byTopic = content.topics
    .map((topic) => {
      const ids = [
        ...content.exercises.filter((e) => e.topic === topic.slug && e.kind !== "lesson").map((e) => e.id),
        ...content.terms.filter((t) => t.topic === topic.slug).map((t) => t.id),
      ];
      const topicCards = cards.filter((c) => ids.includes(c.itemId));
      const strong = topicCards.filter((c) => (c.lastRating ?? 0) >= 3).length;
      return { topic, total: ids.length, seen: topicCards.length, strong };
    })
    .filter((x) => x.total > 0);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Label>progresso</Label>
        <h1 className="font-serif text-5xl tracking-tight">Constância ganha.</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="dias seguidos" value={days} />
        <Stat label="respostas" value={attempts.length} />
        <Stat label="acerto" value={`${accuracy}%`} hint="Bom ou Fácil" />
        <Stat label="revisões amanhã" value={dueTomorrow} />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Últimos 14 dias</h2>
        <div className="flex h-32 items-end gap-1.5 rounded-2xl border border-border bg-surface p-4" role="img" aria-label="Respostas por dia nos últimos 14 dias">
          {perDay.map(({ d, n }) => (
            <div key={d} className="group relative flex h-full flex-1 flex-col justify-end">
              <div
                className={`w-full rounded-t-[4px] transition-all ${n ? "bg-accent" : "bg-surface-2"}`}
                style={{ height: n ? `${Math.max(8, (n / max) * 100)}%` : "4px" }}
              />
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] text-bg opacity-0 transition-opacity group-hover:opacity-100">
                {parseDay(d).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} · {n}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Por tema</h2>
        <ul className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          {byTopic.map(({ topic, total, seen, strong }) => (
            <li key={topic.slug} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span>{topic.name}</span>
                <span className="font-mono text-[11px] text-faint">
                  {strong}/{total} sólidos · {seen} vistos
                </span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="bg-success" style={{ width: `${(strong / total) * 100}%` }} />
                <div className="bg-accent/50" style={{ width: `${((seen - strong) / total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
