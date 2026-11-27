"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getContent } from "@/lib/content";
import { libraryOrder, nextInLibrary } from "@/lib/content/library-order";
import { titleOf } from "@/lib/content/localize";
import { recordAttempt } from "@/lib/db/actions";
import { useContentLang } from "@/lib/use-content-lang";
import { useProgress } from "@/lib/use-progress";
import { useToday } from "@/lib/use-today";
import { ItemPlayer } from "@/components/player/item-player";
import { Button, Card } from "@/components/ui";

/** Prática a partir da Biblioteca: ao terminar, segue sozinho para o próximo item por fazer. */
export function PracticeView({ id }: { id: string }) {
  const router = useRouter();
  const day = useToday();
  const lang = useContentLang();
  const progress = useProgress(day);
  const [toast, setToast] = useState<string | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [round, setRound] = useState(0);

  const content = getContent();
  const item = content.itemById.get(id);
  if (!item) return null;
  if (!day || !progress) return <div className="h-64 animate-pulse rounded-2xl bg-surface-2/60" />;

  const order = libraryOrder(content);
  const topicId = item.type === "exercise" ? item.exercise.topic : item.term.topic;
  const topic = content.topicBySlug.get(topicId);
  const inTopic = order.filter((e) => e.topic === topicId);
  const posInTopic = inTopic.findIndex((e) => e.id === id) + 1;
  const isDone = (x: string) => progress.get(x)?.status === "done";
  const nextId = nextInLibrary(order, id, isDone);
  const nextEx = nextId ? content.itemById.get(nextId) : undefined;
  const nextTitle = nextEx?.type === "exercise" ? titleOf(nextEx.exercise, lang) : null;

  const goNext = (target = nextId) => {
    if (target) router.push(`/exercicio/${target}`);
    else setAllDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <Link href="/biblioteca" className="hover:text-fg">
          ← biblioteca
        </Link>
        {topic && (
          <span className="text-faint">
            · {topic.name}
            {posInTopic > 0 && ` · ${posInTopic}/${inTopic.length}`}
          </span>
        )}
        {nextTitle && (
          <button onClick={() => goNext()} className="ml-auto truncate text-faint hover:text-fg" title="Saltar para o próximo">
            saltar → {nextTitle}
          </button>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-fg px-4 py-2 text-sm text-bg shadow-lg" role="status">
          {toast}
        </div>
      )}

      {allDone ? (
        <Card className="space-y-4 text-center">
          <p className="font-serif text-3xl">Fizeste tudo o que há na biblioteca. 🎉</p>
          <p className="text-sm text-muted">As revisões voltam no &quot;Hoje&quot; quando estiveres quase a esquecer.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => (setAllDone(false), setRound((r) => r + 1))}>Fazer de novo</Button>
            <Link href="/" className="inline-flex items-center rounded-full bg-fg px-4 py-2 text-sm text-bg">
              Ir para Hoje →
            </Link>
          </div>
        </Card>
      ) : (
        <ItemPlayer
          key={`${id}-${round}`}
          item={item}
          day={day}
          onDone={async (r) => {
            await recordAttempt({ itemId: id, day, ...r });
            // O progresso ainda não inclui esta tentativa: calcula o próximo tratando este como feito.
            const target = nextInLibrary(order, id, (x) => x === id || isDone(x));
            const tTarget = target ? content.itemById.get(target) : undefined;
            setToast(
              tTarget?.type === "exercise"
                ? `${r.correct || r.schedule === false ? "✓ Registado" : "↻ Fica para rever"} · a seguir: ${titleOf(tTarget.exercise, lang)}`
                : "✓ Registado",
            );
            setTimeout(() => {
              setToast(null);
              goNext(target);
            }, 900);
          }}
        />
      )}
    </div>
  );
}
