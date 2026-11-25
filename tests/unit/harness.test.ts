import { describe, expect, it } from "vitest";
import { runTests } from "@/lib/runner/harness";

describe("runTests", () => {
  it("runs TypeScript and reports pass/fail per test", async () => {
    const r = await runTests("export const add = (a: number, b: number): number => a + b;", [
      { name: "ok", code: "expect(add(1, 2)).toBe(3);", hidden: false },
      { name: "bad", code: "expect(add(1, 2)).toBe(4);", hidden: true },
    ]);
    expect(r.results.map((t) => t.passed)).toEqual([true, false]);
    expect(r.results[1].error).toContain("Expected 4");
    expect(r.ok).toBe(false);
  });

  it("captures console.log", async () => {
    const r = await runTests("console.log('hi', { a: 1 });", [{ name: "t", code: "expect(1).toBe(1);", hidden: false }]);
    expect(r.logs).toEqual(['hi {"a":1}']);
  });

  it("reports compile errors without throwing", async () => {
    const r = await runTests("const = ;", [{ name: "t", code: "", hidden: false }]);
    expect(r.fatal).toMatch(/Compile error/);
  });

  it("times out async tests that never resolve", async () => {
    const r = await runTests("", [{ name: "hang", code: "await new Promise(() => {});", hidden: false }], 50);
    expect(r.results[0].error).toMatch(/Timed out/);
  });
});
