"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Section, type SessionEntry } from "@/lib/db";
import { addExtraToSession, ensureSession, recordAttempt } from "@/lib/db/actions";
import { getContent } from "@/lib/content";
import { titleOf } from "@/lib/content/localize";
import type { Lang } from "@/lib/content/schema";
import { useContentLang } from "@/lib/use-content-lang";
import { weekFor } from "@/lib/daily/build-session";
import { parseDay, streak } from "@/lib/date";
import { t } from "@/lib/i18n/pt";
import { useToday } from "@/lib/use-today";
import { useEnter } from "@/lib/use-enter";
import { Button, Kbd, Label } from "@/components/ui";
import { ItemPlayer } from "@/components/player/item-player";

const SECTION_ORDER: Section[] = ["lesson", "review", "terms", "learn", "practice", "speak"];

function greeting(d: Date) {
  const h = d.getHours();
  return h < 12 ? "Bom dia" : h < 19 ? "Boa tarde" : "Boa noite";
}

function itemMinutes(id: string) {
  const it = getContent().itemById.get(id);
  return !it ? 0 : it.type === "term" ? 1 : it.exercise.estimatedMin;
}

function itemTitle(id: string, lang: Lang) {
  const it = getContent().itemById.get(id);
  if (!it) return id;
  return it.type === "term" ? it.term.term : titleOf(it.exercise, lang);
}

export function TodayView() {
  const day = useToday();
  const lang = useContentLang();
  const content = getContent();

  useEffect(() => {
    if (day) void ensureSession(day);
  }, [day]);

  const session = useLiveQuery(() => (day ? db.sessions.get(day) : undefined), [day]);
  const doneToday = useLiveQuery(
    async () => (day ? new Set((await db.attempts.where("day").equals(day).toArray()).map((a) => a.itemId)) : new Set<string>()),
    [day],
  );
  const activeDays = useLiveQuery(async () => (await db.attempts.orderBy("day").uniqueKeys()) as string[], []);
  const startDay = useLiveQuery(async () => (await db.settings.get("startDay"))?.value as string | undefined, []);
  const seenIds = useLiveQuery(async () => new Set((await db.cards.toCollection().primaryKeys()) as string[]), []);

  const [current, setCurrent] = useState<string | null>(null);

  const entries = useMemo(() => session?.entries ?? [], [session]);
  const done = doneToday ?? new Set<string>();
  const pending = entries.filter((e) => !done.has(e.itemId));
  const total = entries.length;
  const completed = total - pending.length;
  const minutesLeft = pending.reduce((s, e) => s + itemMinutes(e.itemId), 0);

  const listRef = useEnter<HTMLDivElement>([!!session, current === null]);

  if (!day || !session || !doneToday) {
    return <div className="h-64 animate-pulse rounded-2xl bg-surface-2/60" aria-label="A carregar" />;
  }

  const open = (id: string) => {
    setCurrent(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Modo foco: um exercício de cada vez ----------
  const entry = current ? entries.find((e) => e.itemId === current) : undefined;
  const item = current ? content.itemById.get(current) : undefined;
  if (current && entry && item) {
    const idx = entries.findIndex((e) => e.itemId === current);
    return (
      <FocusMode
        key={current}
        entries={entries}
        idx={idx}
        done={done}
        onExit={() => setCurrent(null)}
        player={
          <ItemPlayer
            key={current}
            item={item}
            day={day}
            badge={entry.section === "review" ? "revisão" : undefined}
            onDone={async (r) => {
              await recordAttempt({ itemId: current, day, ...r });
              const next = entries.slice(idx + 1).find((e) => !done.has(e.itemId) && e.itemId !== current) ??
                entries.find((e) => !done.has(e.itemId) && e.itemId !== current);
              setCurrent(next?.itemId ?? null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        }
      />
    );
  }

  // ---------- Visão geral do dia ----------
  const week = startDay ? weekFor(startDay, day) : 1;
  const date = parseDay(day);
  const dateLabel = date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const days = streak(activeDays ?? [], day);
  const grouped = SECTION_ORDER.map((s) => ({ section: s, items: entries.filter((e) => e.section === s) })).filter((g) => g.items.length);
  const allDone = pending.length === 0;

  const nextExtra = content.exercises.find(
    (e) => !seenIds?.has(e.id) && !entries.some((x) => x.itemId === e.id) && (e.kind === "concept" || e.kind === "quiz" || e.kind === "code"),
  );

  return (
    <div ref={listRef} className="space-y-10">
      <section data-enter className="space-y-5">
        <Label>
          {dateLabel} · semana {week}/8
        </Label>
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          {allDone ? (
            <>
              Feito por hoje. <span className="italic text-muted">Até amanhã.</span>
            </>
          ) : (
            <>
              {greeting(new Date())}. <span className="italic text-muted">Vamos treinar.</span>
            </>
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
          <span>
            <span className="text-fg">{completed}</span>/{total} feitos
          </span>
          {!allDone && <span>~{minutesLeft} min restantes</span>}
          <span>
            <span className={days > 0 ? "text-accent" : ""}>{days}</span> {days === 1 ? "dia seguido" : "dias seguidos"}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
        </div>
        {!allDone && (
          <Button variant="primary" onClick={() => open(pending[0].itemId)} className="mt-2">
            {completed === 0 ? t.actions.start : t.actions.continue} <span className="text-bg/60">→</span>
          </Button>
        )}
      </section>

      {grouped.map(({ section, items }) => (
        <section key={section} data-enter className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium">{t.sections[section]}</h2>
            <span className="text-xs text-faint">{t.sectionHints[section]}</span>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {items.map((e) => {
              const isDone = done.has(e.itemId);
              const it = content.itemById.get(e.itemId);
              const kind = it?.type === "term" ? t.kinds.term : it ? t.kinds[it.exercise.kind] : "";
              return (
                <li key={e.itemId}>
                  <button
                    onClick={() => open(e.itemId)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-2/60"
                  >
                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                        isDone ? "border-success bg-success text-bg" : "border-border-strong"
                      }`}
                      aria-label={isDone ? "feito" : "por fazer"}
                    >
                      {isDone ? "✓" : ""}
                    </span>
                    <span className={`flex-1 ${isDone ? "text-muted line-through decoration-border-strong" : ""}`}>{itemTitle(e.itemId, lang)}</span>
                    <span className="font-mono text-[11px] text-faint">{kind}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {allDone && nextExtra && (
        <section data-enter className="rounded-2xl border border-dashed border-border-strong p-6 text-center">
          <p className="mb-4 text-sm text-muted">Ainda tens energia? Mais um não faz mal.</p>
          <Button
            onClick={async () => {
              await addExtraToSession(day, nextExtra.id);
              open(nextExtra.id);
            }}
          >
            {t.actions.more}
          </Button>
        </section>
      )}

      <p data-enter className="text-center text-xs text-faint">
        Atalhos: <Kbd>1</Kbd>–<Kbd>4</Kbd> avaliar · <Kbd>espaço</Kbd> revelar · <Kbd>⌘↵</Kbd> enviar/correr
      </p>
    </div>
  );
}

function FocusMode({
  entries,
  idx,
  done,
  onExit,
  player,
}: {
  entries: SessionEntry[];
  idx: number;
  done: Set<string>;
  onExit: () => void;
  player: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onExit} className="font-mono text-xs text-muted transition-colors hover:text-fg">
          ← sessão
        </button>
        <div className="flex flex-1 gap-1" aria-label={`Item ${idx + 1} de ${entries.length}`}>
          {entries.map((e, i) => (
            <span
              key={e.itemId}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                done.has(e.itemId) ? "bg-accent" : i === idx ? "bg-fg/60" : "bg-surface-2"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-xs tabular-nums text-faint">
          {idx + 1}/{entries.length}
        </span>
      </div>
      {player}
    </div>
  );
}
