import type { CodeTest } from "@/lib/content/schema";
import type { RunResult } from "./harness";

/**
 * Corre os testes num Web Worker descartável. Se o código entrar em loop infinito,
 * o worker é terminado ao fim de `timeoutMs` e a UI continua a responder.
 */
export function runInWorker(source: string, tests: CodeTest[], timeoutMs = 5000): Promise<RunResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false,
        results: [],
        logs: [],
        fatal: `Execution stopped after ${timeoutMs / 1000}s — infinite loop?`,
        durationMs: Date.now() - started,
      });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, results: [], logs: [], fatal: e.message || "Worker error", durationMs: Date.now() - started });
    };
    worker.postMessage({ source, tests });
  });
}
