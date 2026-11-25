/// <reference lib="webworker" />
import { runTests } from "./harness";
import type { CodeTest } from "@/lib/content/schema";

self.onmessage = async (event: MessageEvent<{ source: string; tests: CodeTest[] }>) => {
  const { source, tests } = event.data;
  const result = await runTests(source, tests);
  self.postMessage(result);
};
