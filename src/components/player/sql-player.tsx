"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { SqlExercise } from "@/lib/content/schema";
import { DATASETS } from "@content/sql/datasets";
import { runSql } from "@/lib/sql/run-sql";
import type { SqlRunResult } from "@/lib/sql/engine";
import { norm } from "@/lib/sql/compare";
import { Rating } from "@/lib/srs";
import { Md } from "@/components/md";
import { Button, Kbd, Label } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { AutoResult } from "./auto-result";
import type { PlayerProps } from "./types";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-code-bg" />,
});

/** SQL de verdade: a query corre no Postgres do browser e é comparada com o resultado esperado. */
export function SqlPlayer({ data, itemId, day, onDone }: PlayerProps<SqlExercise>) {
  const draftKey = `draft:${itemId}`;
  const [sql, setSql] = useState(() => (typeof window === "undefined" ? data.starter : (localStorage.getItem(draftKey) ?? data.starter)));
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState<SqlRunResult | null>(null);
  const [runs, setRuns] = useState(0);
  const [hints, setHints] = useState(0);
  const [solved, setSolved] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    localStorage.setItem(draftKey, sql);
  }, [sql, draftKey]);

  const run = async () => {
    if (running || !sql.trim()) return;
    setRunning(true);
    const r = await runSql({ dataset: data.dataset, sql, solution: data.solution, ordered: data.ordered });
    setOut(r);
    setRuns((n) => n + 1);
    setRunning(false);
    if (r.check?.ok) setSolved(true);
  };
  useHotkeys({ "mod+enter": () => void run() });

  const auto = gaveUp ? Rating.Again : runs <= 1 && hints === 0 ? Rating.Easy : runs <= 3 && hints <= 1 ? Rating.Good : Rating.Hard;
  const finish = () => {
    localStorage.removeItem(draftKey);
    onDone({ rating: auto, correct: solved && !gaveUp, answer: sql });
  };

  return (
    <div className="space-y-6">
      <div data-enter>
        <Md className="text-[17px]">{data.prompt}</Md>
      </div>
      <div data-enter className="rounded-xl border border-border bg-surface-2/40 px-4 py-3">
        <Label>tabelas ({data.dataset})</Label>
        <ul className="mt-1.5 space-y-0.5 font-mono text-[12px] text-muted">
          {DATASETS[data.dataset].tables.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div data-enter className="space-y-3">
        <CodeEditor value={sql} onChange={setSql} onRun={() => void run()} language="sql" readOnly={solved || gaveUp} />
        {!solved && !gaveUp && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={() => void run()} disabled={running || !sql.trim()}>
              {running ? "A correr…" : "Correr"} <Kbd>⌘↵</Kbd>
            </Button>
            {data.hints.length > hints && (
              <Button variant="ghost" onClick={() => setHints((h) => h + 1)}>
                Dica ({hints}/{data.hints.length})
              </Button>
            )}
            {runs > 0 && (
              <Button variant="ghost" onClick={() => setGaveUp(true)}>
                Ver solução
              </Button>
            )}
          </div>
        )}
        {data.hints.slice(0, hints).map((h, i) => (
          <div key={i} className="rounded-lg bg-accent-soft/50 px-3 py-2 text-sm">
            <Md className="text-sm">{h}</Md>
          </div>
        ))}
      </div>

      {out && (
        <div data-enter className="space-y-2">
          {out.error ? (
            <div className="rounded-xl bg-danger-soft px-4 py-3 font-mono text-sm text-danger">{out.error}</div>
          ) : (
            <>
              <div className={`rounded-xl px-4 py-2.5 text-sm ${out.check?.ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}>
                {out.check?.ok ? "✓ Resultado certo." : `✗ ${out.check?.reason}`}
              </div>
              {out.result && <ResultTable columns={out.result.columns} rows={out.result.rows} />}
            </>
          )}
        </div>
      )}

      {(solved || gaveUp) && (
        <div className="space-y-4">
          <details data-enter open={gaveUp} className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.12em] text-faint">solução de referência</summary>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-code-bg p-4 font-mono text-[13px] text-code-fg">{data.solution}</pre>
            {data.explanation && <Md className="mt-3 text-sm text-muted">{data.explanation}</Md>}
          </details>
          <AutoResult itemId={itemId} day={day} rating={auto} onContinue={finish} />
        </div>
      )}
    </div>
  );
}

function ResultTable({ columns, rows }: { columns: string[]; rows: unknown[][] }) {
  return (
    <div className="max-h-72 overflow-auto rounded-xl border border-border">
      <table className="w-full font-mono text-[12px]">
        <thead className="sticky top-0 bg-surface-2 text-left text-muted">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="px-3 py-1.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((v, j) => (
                <td key={j} className="px-3 py-1">
                  {norm(v) === "∅" ? <span className="text-faint">NULL</span> : String(v instanceof Date ? norm(v) : v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && <div className="px-3 py-1 text-xs text-faint">… {rows.length - 50} linhas a mais</div>}
    </div>
  );
}
