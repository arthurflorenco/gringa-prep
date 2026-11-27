"use client";

import Link from "next/link";
import { getContent } from "@/lib/content";
import { libraryOrder, nextInLibrary } from "@/lib/content/library-order";
import { titleOf } from "@/lib/content/localize";
import { t } from "@/lib/i18n/pt";
import { useContentLang } from "@/lib/use-content-lang";
import { useProgress } from "@/lib/use-progress";
import { useToday } from "@/lib/use-today";
import { Label, Pill } from "@/components/ui";
import { StatusMark } from "@/components/seen-dot";

export function LibraryView() {
  const content = getContent();
  const { topics, exercises } = content;
  const lang = useContentLang();
  const today = useToday();
  const progress = useProgress(today);
  const order = libraryOrder(content);
  const statusOf = (id: string) => progress?.get(id)?.status;
  const isDone = (id: string) => statusOf(id) === "done";
  const doneCount = order.filter((e) => isDone(e.id)).length;
  const lastId = progress ? [...progress.keys()].pop() ?? null : null;
  const next = progress ? nextInLibrary(order, lastId, isDone) : null;
  const nextEx = next ? content.itemById.get(next) : undefined;
  const weeks = [...new Set(topics.map((x) => x.week))].sort((a, b) => a - b);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Label>
          {doneCount}/{exercises.length} feitos · {topics.length} temas
        </Label>
        <h1 className="font-serif text-5xl tracking-tight">Biblioteca</h1>
        <div className="h-1 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-success transition-[width] duration-700" style={{ width: `${(doneCount / exercises.length) * 100}%` }} />
        </div>
        {nextEx?.type === "exercise" && (
          <Link
            href={`/exercicio/${nextEx.id}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-accent/50 bg-accent-soft/40 px-5 py-4 transition-colors hover:border-accent"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-accent">continuar de onde parei</span>
              <span className="block truncate font-medium">{titleOf(nextEx.exercise, lang)}</span>
            </span>
            <span className="shrink-0 text-accent">→</span>
          </Link>
        )}
      </header>

      {weeks.map((w) => {
        const weekTopics = topics.filter((x) => x.week === w);
        const list = order.filter((e) => weekTopics.some((x) => x.slug === e.topic));
        const done = list.filter((e) => isDone(e.id)).length;
        return (
          <section key={w} className="space-y-5">
            <div className="flex items-baseline gap-3 border-b border-border pb-2">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-faint">Semana {w}</h2>
              {list.length === 0 ? (
                <span className="text-xs text-faint">em breve</span>
              ) : (
                <span className={`ml-auto font-mono text-[11px] ${done === list.length ? "text-success" : "text-faint"}`}>
                  {done}/{list.length}
                </span>
              )}
            </div>
            {weekTopics.map((topic) => {
              const items = list.filter((e) => e.topic === topic.slug);
              const tDone = items.filter((e) => isDone(e.id)).length;
              return (
                <div key={topic.slug} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{topic.name}</h3>
                    {topic.interviewWeight === 3 && <Pill tone="accent">muito cobrado</Pill>}
                    {items.length > 0 && (
                      <span className={`ml-auto font-mono text-[11px] ${tDone === items.length ? "text-success" : "text-faint"}`}>
                        {tDone === items.length ? "✓ " : ""}
                        {tDone}/{items.length}
                      </span>
                    )}
                  </div>
                  {items.length > 0 && (
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {items.map((e) => {
                        const st = statusOf(e.id);
                        return (
                          <li key={e.id}>
                            <Link
                              href={`/exercicio/${e.id}`}
                              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                                st === "done"
                                  ? "border-success/30 bg-success-soft/40 text-muted hover:border-success/60"
                                  : st === "review"
                                    ? "border-accent/40 bg-surface hover:border-accent"
                                    : e.id === next
                                      ? "border-accent bg-surface ring-2 ring-accent/15"
                                      : "border-border bg-surface hover:border-border-strong"
                              }`}
                            >
                              <StatusMark status={st} />
                              <span className="flex-1 truncate">{titleOf(e, lang)}</span>
                              <span className="font-mono text-[10px] text-faint">{t.kinds[e.kind]}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
