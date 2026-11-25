import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { runTests } from "@/lib/runner/harness";

const content = getContent();
const codeExercises = content.exercises.filter((e) => e.kind === "code");

describe("content", () => {
  it("is valid and has at least one item of each kind", () => {
    const kinds = new Set(content.exercises.map((e) => e.kind));
    expect([...kinds].sort()).toEqual(["behavioral", "code", "concept", "quiz"]);
    expect(content.terms.length).toBeGreaterThan(0);
  });

  it.each(codeExercises.map((e) => [e.id, e] as const))("solution of %s passes all tests", async (_id, ex) => {
    const r = await runTests(ex.solution, ex.tests);
    expect(r.fatal).toBeUndefined();
    expect(r.results.filter((t) => !t.passed)).toEqual([]);
  });

  it.each(codeExercises.map((e) => [e.id, e] as const))("starter of %s does not pass", async (_id, ex) => {
    const r = await runTests(ex.starter, ex.tests);
    expect(r.ok).toBe(false);
  });
});
