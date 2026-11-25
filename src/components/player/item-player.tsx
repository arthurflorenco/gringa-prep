"use client";

import type { StudyItem } from "@/lib/content/schema";
import type { Day } from "@/lib/date";
import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/pt";
import { Pill } from "@/components/ui";
import { useEnter } from "@/lib/use-enter";
import { CodePlayer } from "./code-player";
import { QuizPlayer } from "./quiz-player";
import { TermPlayer } from "./term-player";
import { WrittenPlayer } from "./written-player";
import type { DoneResult } from "./types";

export function ItemPlayer({ item, day, onDone, badge }: { item: StudyItem; day: Day; onDone: (r: DoneResult) => void; badge?: string }) {
  const ref = useEnter<HTMLDivElement>([item.id]);
  const topicSlug = item.type === "term" ? item.term.topic : item.exercise.topic;
  const topic = getContent().topicBySlug.get(topicSlug);
  const common = { itemId: item.id, day, onDone };

  return (
    <div ref={ref} key={item.id} className="space-y-6">
      <div data-enter className="flex flex-wrap items-center gap-2">
        {badge && <Pill tone="accent">{badge}</Pill>}
        <Pill>{item.type === "term" ? t.kinds.term : t.kinds[item.exercise.kind]}</Pill>
        {topic && <span className="font-mono text-[11px] text-faint">{topic.name}</span>}
        {item.type === "exercise" && <span className="ml-auto font-mono text-[11px] text-faint">~{item.exercise.estimatedMin} min</span>}
      </div>
      {item.type === "exercise" && (
        <h1 data-enter className="font-serif text-4xl leading-tight tracking-tight">
          {item.exercise.title}
        </h1>
      )}
      {item.type === "term" ? (
        <TermPlayer data={item.term} {...common} />
      ) : item.exercise.kind === "quiz" ? (
        <QuizPlayer data={item.exercise} {...common} />
      ) : item.exercise.kind === "code" ? (
        <CodePlayer data={item.exercise} {...common} />
      ) : (
        <WrittenPlayer data={item.exercise} {...common} />
      )}
    </div>
  );
}
