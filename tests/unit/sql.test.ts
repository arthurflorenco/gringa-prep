import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { compareResults } from "@/lib/sql/compare";
import { getDb, runQuery } from "@/lib/sql/engine";
import type { SqlExercise } from "@/lib/content/schema";

describe("sql compare", () => {
  it("ignores column names and (unless ordered) row order; normalizes numerics", () => {
    const exp = { columns: ["n", "total"], rows: [["Ana", "10.50"], ["Bia", 3]] };
    expect(compareResults({ columns: ["a", "b"], rows: [["Bia", "3.00"], ["Ana", 10.5]] }, exp, false).ok).toBe(true);
    expect(compareResults({ columns: ["a", "b"], rows: [["Bia", 3], ["Ana", 10.5]] }, exp, true).reason).toMatch(/ordem/);
    expect(compareResults({ columns: ["a"], rows: [["Ana"], ["Bia"]] }, exp, false).ok).toBe(false);
  });
});

const sqlExercises = getContent().exercises.filter((e): e is SqlExercise => e.kind === "sql");

describe("sql exercises", () => {
  it.each(sqlExercises.map((e) => [e.id, e] as const))("%s: solution runs, returns rows, starter differs", async (_id, ex) => {
    const db = await getDb(ex.dataset);
    const sol = await runQuery(db, ex.solution);
    expect(sol.rows.length).toBeGreaterThan(0);
    if (ex.starter.trim()) {
      const st = await runQuery(db, ex.starter).catch(() => null);
      if (st) expect(compareResults(st, sol, ex.ordered).ok).toBe(false);
    }
  }, 20000);
});
