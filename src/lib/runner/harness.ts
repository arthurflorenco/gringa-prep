import { transform } from "sucrase";
import type { CodeTest } from "@/lib/content/schema";

export interface TestResult {
  name: string;
  passed: boolean;
  hidden: boolean;
  error?: string;
}
export interface RunResult {
  ok: boolean;
  results: TestResult[];
  logs: string[];
  /** Erro de compilação ou de execução fora dos testes. */
  fatal?: string;
  durationMs: number;
}

export class AssertionError extends Error {}

const fmt = (v: unknown): string => {
  try {
    return typeof v === "string" ? JSON.stringify(v) : (JSON.stringify(v) ?? String(v));
  } catch {
    return String(v);
  }
};

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => k in b && deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/** API mínima inspirada no Jest/Vitest. */
export function expect(actual: unknown) {
  const fail = (msg: string) => {
    throw new AssertionError(msg);
  };
  const api = {
    toBe: (exp: unknown) => void (Object.is(actual, exp) || fail(`Expected ${fmt(exp)}, received ${fmt(actual)}`)),
    toEqual: (exp: unknown) => void (deepEqual(actual, exp) || fail(`Expected ${fmt(exp)}, received ${fmt(actual)}`)),
    toBeTruthy: () => void (actual || fail(`Expected truthy, received ${fmt(actual)}`)),
    toBeFalsy: () => void (!actual || fail(`Expected falsy, received ${fmt(actual)}`)),
    toContain: (item: unknown) =>
      void ((Array.isArray(actual) || typeof actual === "string") && (actual as unknown[]).includes(item as never)
        ? true
        : fail(`Expected ${fmt(actual)} to contain ${fmt(item)}`)),
    toHaveLength: (n: number) =>
      void ((actual as { length?: number })?.length === n || fail(`Expected length ${n}, received ${(actual as { length?: number })?.length}`)),
    toBeCloseTo: (exp: number, digits = 2) =>
      void (Math.abs((actual as number) - exp) < 10 ** -digits / 2 || fail(`Expected ≈${exp}, received ${fmt(actual)}`)),
    toThrow: (msg?: string) => {
      try {
        (actual as () => unknown)();
      } catch (e) {
        if (msg && !String((e as Error)?.message).includes(msg)) fail(`Expected error containing "${msg}", got "${(e as Error)?.message}"`);
        return;
      }
      fail("Expected function to throw");
    },
  };
  return api;
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** TS/ESM → JS que pode correr dentro de `new Function`. */
export function compile(source: string): string {
  return transform(source, { transforms: ["typescript", "imports"], disableESTransforms: true }).code;
}

/**
 * Corre o código do usuário + testes no contexto atual (Worker no browser, Node nos testes).
 * Os testes partilham o escopo do código, por isso chamam as funções pelo nome.
 */
export async function runTests(source: string, tests: CodeTest[], perTestTimeoutMs = 2000): Promise<RunResult> {
  const started = Date.now();
  const logs: string[] = [];
  const log = (...args: unknown[]) => logs.push(args.map((a) => (typeof a === "string" ? a : fmt(a))).join(" "));
  const fakeConsole = { log, info: log, warn: log, error: log };

  let program: string;
  try {
    const testBodies = tests.map((t, i) => `async function __test_${i}() {\n${t.code}\n}`).join("\n");
    // Função interna: o código do usuário pode redeclarar `sleep`, `expect`… sem colidir com os parâmetros.
    const body = compile(`${source}\n;\n${testBodies}\nreturn [${tests.map((_, i) => `__test_${i}`).join(", ")}];`);
    program = `return (function () {\n${body}\n})();`;
  } catch (e) {
    return { ok: false, results: [], logs, fatal: `Compile error: ${(e as Error).message}`, durationMs: Date.now() - started };
  }

  let fns: Array<() => Promise<void>>;
  try {
    const factory = new Function("expect", "sleep", "console", "exports", "module", "require", program);
    const mod = { exports: {} };
    const noRequire = (name: string) => {
      throw new Error(`Imports are not available here ("${name}")`);
    };
    fns = factory(expect, sleep, fakeConsole, mod.exports, mod, noRequire);
  } catch (e) {
    return { ok: false, results: [], logs, fatal: `${(e as Error).name}: ${(e as Error).message}`, durationMs: Date.now() - started };
  }

  const results: TestResult[] = [];
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      await Promise.race([
        fns[i](),
        new Promise((_, rej) => setTimeout(() => rej(new Error(`Timed out after ${perTestTimeoutMs}ms`)), perTestTimeoutMs)),
      ]);
      results.push({ name: t.name, passed: true, hidden: t.hidden });
    } catch (e) {
      const err = e as Error;
      results.push({ name: t.name, passed: false, hidden: t.hidden, error: err instanceof AssertionError ? err.message : `${err?.name ?? "Error"}: ${err?.message ?? String(e)}` });
    }
  }
  return { ok: results.every((r) => r.passed), results, logs, durationMs: Date.now() - started };
}
