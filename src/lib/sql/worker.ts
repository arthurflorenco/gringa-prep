import { runAndCheck } from "./engine";

/** Worker do SQL: mantém as bases PGlite em memória entre execuções. */
self.onmessage = async (e: MessageEvent<{ id: number; dataset: "shop" | "blog"; sql: string; solution: string; ordered: boolean }>) => {
  const { id, dataset, sql, solution, ordered } = e.data;
  try {
    const out = await runAndCheck(dataset, sql, solution, ordered);
    self.postMessage({ id, ...out });
  } catch (err) {
    self.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  }
};
