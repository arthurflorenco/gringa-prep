"use client";

import { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type TopicLevel } from "@/lib/db";
import { exportBackup, importBackup, resetAll, restartTrack, setSetting } from "@/lib/db/actions";
import { setContentLang, useContentLang } from "@/lib/use-content-lang";
import { getContent } from "@/lib/content";
import { isDay, toDay } from "@/lib/date";
import { useToday } from "@/lib/use-today";
import { Button, Label } from "@/components/ui";

const LEVELS: { value: TopicLevel; label: string }[] = [
  { value: "weak", label: "Fraco" },
  { value: "medium", label: "Médio" },
  { value: "strong", label: "Forte" },
];

export function SettingsView() {
  const { topics } = getContent();
  const today = useToday();
  const levels = useLiveQuery(async () => ((await db.settings.get("topicLevels"))?.value ?? {}) as Record<string, TopicLevel>, []);
  const startDay = useLiveQuery(async () => (await db.settings.get("startDay"))?.value as string | undefined, []);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const lang = useContentLang();
  const fileRef = useRef<HTMLInputElement>(null);

  const setLevel = async (slug: string, level: TopicLevel) => {
    const next = { ...(levels ?? {}) };
    if (next[slug] === level) delete next[slug];
    else next[slug] = level;
    await setSetting("topicLevels", next);
  };

  const download = async () => {
    const data = await exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gringa-prep-backup-${toDay(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (file: File) => {
    try {
      await importBackup(JSON.parse(await file.text()));
      setMsg("Backup importado.");
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Label>ajustes</Label>
        <h1 className="font-serif text-5xl tracking-tight">Ajustes</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Idioma das perguntas</h2>
        <p className="text-sm text-muted">
          O idioma em que as aulas e perguntas aparecem. Em cada pergunta podes trocar com o botão EN | PT ou a tecla <span className="font-mono">T</span>.
          Na entrevista vai ser em inglês — muda para English quando te sentires pronto.
        </p>
        <div className="flex gap-1" role="radiogroup" aria-label="Idioma das perguntas">
          {(
            [
              ["pt", "Português"],
              ["en", "English"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="radio"
              aria-checked={lang === value}
              onClick={() => setContentLang(value)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${lang === value ? "bg-fg text-bg" : "border border-border text-muted hover:text-fg"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium">O teu nível por tema</h2>
          <p className="text-sm text-muted">Temas marcados como Fraco entram na sessão todos os dias, a partir da semana em que a trilha chega a eles. Só afeta sessões novas (a partir de amanhã).</p>
        </div>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {topics.map((t) => (
            <li key={t.slug} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm">
                {t.name} <span className="font-mono text-[10px] text-faint">S{t.week}</span>
              </span>
              <div className="flex gap-1" role="radiogroup" aria-label={t.name}>
                {LEVELS.map((l) => {
                  const on = levels?.[t.slug] === l.value;
                  const tone = l.value === "weak" ? "bg-danger-soft text-danger" : l.value === "strong" ? "bg-success-soft text-success" : "bg-surface-2 text-fg";
                  return (
                    <button
                      key={l.value}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setLevel(t.slug, l.value)}
                      className={`rounded-full px-3 py-1 text-xs transition-colors ${on ? tone : "text-faint hover:text-fg"}`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Início da trilha</h2>
        <p className="text-sm text-muted">Define em que semana da trilha estás (a semana 1 começa neste dia).</p>
        <Button
          onClick={async () => {
            if (!today) return;
            await restartTrack(today);
            setMsg("Trilha recomeçada: hoje é o dia 1 da semana 1. Abre a tela Hoje.");
          }}
        >
          Recomeçar a trilha a partir de hoje
        </Button>
        <input
          type="date"
          value={startDay ?? today ?? ""}
          onChange={(e) => isDay(e.target.value) && setSetting("startDay", e.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm outline-none focus:border-border-strong"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Os teus dados</h2>
        <p className="text-sm text-muted">Tudo fica neste navegador (IndexedDB). Exporta um backup de vez em quando.</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={download}>Exportar backup</Button>
          <Button onClick={() => fileRef.current?.click()}>Importar backup</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {!confirmReset ? (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              Apagar tudo
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-danger"
              onClick={async () => {
                await resetAll();
                setConfirmReset(false);
                setMsg("Dados apagados.");
              }}
            >
              Confirmar: apagar todo o progresso
            </Button>
          )}
        </div>
        {msg && <p className="text-sm text-muted">{msg}</p>}
      </section>
    </div>
  );
}
