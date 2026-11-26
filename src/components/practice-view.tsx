"use client";

import Link from "next/link";
import { useState } from "react";
import { getContent } from "@/lib/content";
import { recordAttempt } from "@/lib/db/actions";
import { useToday } from "@/lib/use-today";
import { ItemPlayer } from "@/components/player/item-player";
import { Card } from "@/components/ui";

export function PracticeView({ id }: { id: string }) {
  const day = useToday();
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const item = getContent().itemById.get(id);
  if (!item) return null;
  const isLesson = item.type === "exercise" && item.exercise.kind === "lesson";
  if (!day) return <div className="h-64 animate-pulse rounded-2xl bg-surface-2/60" />;

  return (
    <div className="space-y-8">
      <Link href="/biblioteca" className="block font-mono text-xs text-muted hover:text-fg">
        ← biblioteca
      </Link>
      {done ? (
        <Card className="space-y-4 text-center">
          <p className="font-serif text-3xl">Registado.</p>
          <p className="text-sm text-muted">
            {isLesson
              ? "Aula marcada como vista. As perguntas sobre ela aparecem nas próximas sessões."
              : "Entrou na tua revisão espaçada — vai voltar quando estiver quase a esquecer."}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <button className="text-muted underline-offset-4 hover:text-fg hover:underline" onClick={() => (setDone(false), setRound((r) => r + 1))}>
              {isLesson ? "Ver de novo" : "Fazer de novo"}
            </button>
            <Link className="text-accent underline-offset-4 hover:underline" href="/">
              Ir para Hoje →
            </Link>
          </div>
        </Card>
      ) : (
        <ItemPlayer
          key={round}
          item={item}
          day={day}
          onDone={async (r) => {
            await recordAttempt({ itemId: id, day, ...r });
            setDone(true);
          }}
        />
      )}
    </div>
  );
}
