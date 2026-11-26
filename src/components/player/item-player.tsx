"use client";

import { useState } from "react";
import type { Lang, StudyItem } from "@/lib/content/schema";
import type { Day } from "@/lib/date";
import { getContent } from "@/lib/content";
import { localize } from "@/lib/content/localize";
import { t } from "@/lib/i18n/pt";
import { Pill } from "@/components/ui";
import { useEnter } from "@/lib/use-enter";
import { useContentLang } from "@/lib/use-content-lang";
import { useHotkeys } from "@/lib/use-hotkeys";
import { CodePlayer } from "./code-player";
import { LessonPlayer } from "./lesson-player";
import { QuizPlayer } from "./quiz-player";
import { TermPlayer } from "./term-player";
import { WrittenPlayer } from "./written-player";
import type { DoneResult } from "./types";

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="ml-auto flex rounded-full border border-border p-0.5 font-mono text-[11px]" role="group" aria-label="Idioma">
      {(["en", "pt"] as const).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          title="Trocar idioma (T)"
          className={`rounded-full px-2.5 py-0.5 uppercase transition-colors ${lang === l ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ItemPlayer({ item, day, onDone, badge }: { item: StudyItem; day: Day; onDone: (r: DoneResult) => void; badge?: string }) {
  const globalLang = useContentLang();
  const [override, setOverride] = useState<Lang | null>(null);
  const lang = override ?? globalLang;
  const ref = useEnter<HTMLDivElement>([item.id]);

  useHotkeys({ t: () => setOverride(lang === "en" ? "pt" : "en") });

  const topicSlug = item.type === "term" ? item.term.topic : item.exercise.topic;
  const topic = getContent().topicBySlug.get(topicSlug);
  const common = { itemId: item.id, day, onDone, lang };
  const ex = item.type === "exercise" ? localize(item.exercise, lang) : null;

  return (
    <div ref={ref} key={item.id} className="space-y-6">
      <div data-enter className="flex flex-wrap items-center gap-2">
        {badge && <Pill tone="accent">{badge}</Pill>}
        <Pill>{item.type === "term" ? t.kinds.term : t.kinds[item.exercise.kind]}</Pill>
        {topic && <span className="font-mono text-[11px] text-faint">{topic.name}</span>}
        {ex && <span className="font-mono text-[11px] text-faint">· ~{ex.estimatedMin} min</span>}
        <LangToggle lang={lang} onChange={setOverride} />
      </div>
      {ex && (
        <h1 data-enter className="font-serif text-4xl leading-tight tracking-tight">
          {ex.title}
        </h1>
      )}
      {item.type === "term" ? (
        <TermPlayer data={item.term} {...common} />
      ) : ex!.kind === "lesson" ? (
        <LessonPlayer data={ex as Extract<typeof ex, { kind: "lesson" }>} {...common} />
      ) : ex!.kind === "quiz" ? (
        <QuizPlayer data={ex as Extract<typeof ex, { kind: "quiz" }>} {...common} />
      ) : ex!.kind === "code" ? (
        <CodePlayer data={ex as Extract<typeof ex, { kind: "code" }>} {...common} />
      ) : (
        <WrittenPlayer data={ex as Extract<typeof ex, { kind: "concept" | "behavioral" }>} {...common} />
      )}
    </div>
  );
}
