import type { SqlRunResult } from "./engine";

/**
 * Cliente do worker de SQL. O worker fica vivo (a base demora ~1s a criar); se uma query
 * passar do tempo, é terminado e recriado na próxima execução.
 */
let worker: Worker | null = null;
let seq = 0;

export function runSql(input: { dataset: "shop" | "blog"; sql: string; solution: string; ordered: boolean }, timeoutMs = 8000): Promise<SqlRunResult> {
  worker ??= new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  const w = worker;
  const id = ++seq;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.terminate();
      if (worker === w) worker = null;
      resolve({ error: `A query passou de ${timeoutMs / 1000}s e foi parada.` });
    }, timeoutMs);
    const onMsg = (e: MessageEvent<SqlRunResult & { id: number }>) => {
      if (e.data.id !== id) return;
      clearTimeout(timer);
      w.removeEventListener("message", onMsg);
      resolve(e.data);
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ id, ...input });
  });
}
