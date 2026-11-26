import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/pt";
import { Label, Pill } from "@/components/ui";
import { SeenDot } from "@/components/seen-dot";
import { ExerciseTitle } from "@/components/exercise-title";

export const metadata: Metadata = { title: "Biblioteca — Gringa Prep" };

export default function LibraryPage() {
  const { topics, exercises } = getContent();
  const weeks = [...new Set(topics.map((t) => t.week))].sort((a, b) => a - b);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Label>
          {exercises.length} exercícios · {topics.length} temas
        </Label>
        <h1 className="font-serif text-5xl tracking-tight">Biblioteca</h1>
        <p className="max-w-xl text-muted">
          Tudo o que existe, por semana da trilha. A sessão do dia escolhe por ti, mas podes praticar qualquer coisa aqui — as
          perguntas entram na revisão espaçada.
        </p>
      </header>

      {weeks.map((w) => {
        const weekTopics = topics.filter((t) => t.week === w);
        const count = exercises.filter((e) => weekTopics.some((t) => t.slug === e.topic)).length;
        return (
          <section key={w} className="space-y-5">
            <div className="flex items-baseline gap-3 border-b border-border pb-2">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-faint">Semana {w}</h2>
              {count === 0 && <span className="text-xs text-faint">em breve</span>}
            </div>
            {weekTopics.map((topic) => {
              const list = exercises.filter((e) => e.topic === topic.slug);
              return (
                <div key={topic.slug} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{topic.name}</h3>
                    {topic.interviewWeight === 3 && <Pill tone="accent">muito cobrado</Pill>}
                  </div>
                  {list.length > 0 && (
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {list.map((e) => (
                        <li key={e.id}>
                          <Link
                            href={`/exercicio/${e.id}`}
                            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm transition-colors hover:border-border-strong"
                          >
                            <SeenDot id={e.id} />
                            <ExerciseTitle id={e.id} className="flex-1 truncate" />
                            <span className="font-mono text-[10px] text-faint">{t.kinds[e.kind]}</span>
                          </Link>
                        </li>
                      ))}
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
