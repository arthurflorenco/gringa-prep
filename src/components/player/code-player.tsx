"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CodeExercise } from "@/lib/content/schema";
import type { RunResult } from "@/lib/runner/harness";
import { runInWorker } from "@/lib/runner/run-in-worker";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd, Label, Pill } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { pop } from "@/lib/use-enter";
import { RatingBar } from "./rating-bar";
import type { PlayerProps } from "./types";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-xl bg-code-bg" />,
});

export function CodePlayer({ data, itemId, day, onDone }: PlayerProps<CodeExercise>) {
  const draftKey = `draft:${itemId}`;
  const [code, setCode] = useState(() => (typeof window === "undefined" ? data.starter : (localStorage.getItem(draftKey) ?? data.starter)));
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runs, setRuns] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const [solved, setSolved] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(draftKey, code);
  }, [code, draftKey]);

  const run = async () => {
    if (running) return;
    setRunning(true);
    const r = await runInWorker(code, data.tests);
    setResult(r);
    setRuns((n) => n + 1);
    setRunning(false);
    if (r.ok && !solved) {
      setSolved(true);
      requestAnimationFrame(() => pop(successRef.current));
    }
  };

  useHotkeys({ "mod+enter": () => void run() });

  const finish = (g: Rating) => {
    localStorage.removeItem(draftKey);
    onDone({ rating: g as never, correct: solved && !gaveUp && g >= Rating.Good, answer: code });
  };

  const suggested = gaveUp ? Rating.Again : solved ? (runs <= 1 && hintsShown === 0 ? Rating.Easy : runs <= 3 ? Rating.Good : Rating.Hard) : undefined;

  return (
    <div className="space-y-6">
      <div data-enter className="space-y-3">
        <Md className="text-[17px]">{data.prompt}</Md>
      </div>

      <div data-enter className="space-y-3">
        <CodeEditor value={code} onChange={setCode} onRun={() => void run()} />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={run} disabled={running}>
            {running ? "A correr…" : "Correr testes"} <Kbd>⌘↵</Kbd>
          </Button>
          {hintsShown < data.hints.length && !solved && (
            <Button variant="ghost" onClick={() => setHintsShown((n) => n + 1)}>
              Dica ({hintsShown + 1}/{data.hints.length})
            </Button>
          )}
          {!solved && !gaveUp && runs > 0 && (
            <Button variant="ghost" onClick={() => setGaveUp(true)}>
              Desisto — mostrar solução
            </Button>
          )}
          <Button variant="ghost" className="ml-auto" onClick={() => setCode(data.starter)}>
            Recomeçar
          </Button>
        </div>
        {hintsShown > 0 && (
          <ul className="space-y-1.5">
            {data.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i} className="rounded-lg bg-accent-soft/60 px-3 py-2 text-sm">
                💡 <Md className="inline">{h}</Md>
              </li>
            ))}
          </ul>
        )}
      </div>

      {result && (
        <div data-enter className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <Label>testes</Label>
            <span className="font-mono text-[11px] text-faint">
              {result.results.filter((r) => r.passed).length}/{data.tests.length} · {result.durationMs}ms
            </span>
          </div>
          {result.fatal && <pre className="whitespace-pre-wrap rounded-lg bg-danger-soft p-3 font-mono text-xs text-danger">{result.fatal}</pre>}
          <ul className="space-y-1">
            {result.results.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 font-mono text-[13px]">
                <span className={r.passed ? "text-success" : "text-danger"}>{r.passed ? "✓" : "✕"}</span>
                <span className="flex-1">
                  {r.hidden ? <span className="text-muted">teste oculto · {r.name}</span> : r.name}
                  {r.error && <span className="block text-xs text-danger/90">{r.error}</span>}
                </span>
              </li>
            ))}
          </ul>
          {result.logs.length > 0 && (
            <pre className="max-h-40 overflow-auto rounded-lg bg-surface-2 p-3 font-mono text-xs text-muted">{result.logs.join("\n")}</pre>
          )}
        </div>
      )}

      {solved && (
        <div ref={successRef} className="rounded-xl bg-success-soft p-4 text-sm text-success">
          <strong>Todos os testes passaram.</strong> Agora explica a tua solução em voz alta, em inglês: complexidade e casos-limite.
        </div>
      )}

      {(solved || gaveUp) && (
        <>
          <details data-enter open={gaveUp} className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              solução de referência
            </summary>
            <div className="mt-3 space-y-3">
              <CodeEditor value={data.solution} readOnly />
              {data.explanation && <Md className="text-sm text-muted">{data.explanation}</Md>}
            </div>
          </details>
          <RatingBar
            itemId={itemId}
            day={day}
            onRate={(g) => finish(g)}
            suggested={suggested}
            allowed={gaveUp ? [Rating.Again, Rating.Hard] : undefined}
          />
        </>
      )}
      {!solved && !gaveUp && runs === 0 && (
        <div className="flex gap-2 text-xs text-faint">
          <Pill>{data.tests.filter((t) => !t.hidden).length} testes visíveis</Pill>
          <Pill>{data.tests.filter((t) => t.hidden).length} ocultos</Pill>
        </div>
      )}
    </div>
  );
}
