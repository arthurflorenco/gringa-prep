import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { gradeWritten, matchesKey, normalize } from "@/lib/grading/written";
import { termOptions } from "@/lib/grading/term-options";
import { Rating } from "@/lib/srs";

const rubric = ["Index speeds up reads", "Costs on writes", "Example"];
const rubricKeys = [["index", "índice"], ["write", "insert", "escrita"], ["for example", "por exemplo"]];

describe("written grading", () => {
  it("matches keys with accents, plurals and phrases", () => {
    const t = normalize("Os índices aceleram leituras; for example, inserts ficam lentos.");
    expect(matchesKey(t, "índice")).toBe(true);
    expect(matchesKey(t, "insert")).toBe(true);
    expect(matchesKey(t, "for example")).toBe(true);
    expect(matchesKey(t, "write")).toBe(false);
    expect(matchesKey(normalize("I wrote it"), "ai")).toBe(false);
  });

  it("scores coverage and maps it to a rating", () => {
    const full = gradeWritten({
      answer: "An index makes reads fast because the database can jump to the rows. The cost is on writes: every insert updates the index. For example, an index on user_id for the orders table.",
      rubric, rubricKeys, kind: "concept", lang: "en",
    });
    expect(full.covered).toEqual([true, true, true]);
    expect(full.rating).toBe(Rating.Easy);

    const half = gradeWritten({ answer: "An index makes the query faster, I think, maybe because it is sorted and the database reads less data from disk.", rubric, rubricKeys, kind: "concept", lang: "en" });
    expect(half.covered).toEqual([true, false, false]);
    expect(half.rating).toBe(Rating.Hard);
    expect(half.tips.some((t) => t.kind === "missing" && t.text === "Costs on writes")).toBe(true);
    expect(half.tips.some((t) => t.kind === "filler")).toBe(true);
    expect(gradeWritten({ answer: "", rubric, rubricKeys, kind: "concept", lang: "en" }).rating).toBe(Rating.Again);
  });

  it("flags answers in Portuguese and missing STAR parts", () => {
    const pt = gradeWritten({ answer: "O índice deixa a busca mais rápida porque o banco não precisa ler a tabela toda, e isso é muito importante para a performance.", rubric, rubricKeys, kind: "concept", lang: "en" });
    expect(pt.tips.some((t) => t.kind === "language")).toBe(true);
    const star = gradeWritten({ answer: "We had a conflict and we talked and it was fine in the end for everybody involved in it.", rubric: ["a", "b"], rubricKeys: [["x"], ["y"]], kind: "behavioral", lang: "en" });
    expect(star.tips.filter((t) => t.kind === "star").length).toBeGreaterThanOrEqual(2);
  });

  it("supports the max-words key", () => {
    const g = gradeWritten({ answer: "short answer here", rubric: ["short", "x"], rubricKeys: [["__max_words:5__"], ["zzz"]], kind: "behavioral", lang: "en" });
    expect(g.covered).toEqual([true, false]);
  });

  it("every concept/behavioral rubric point can be matched by its own model answer (sanity)", () => {
    for (const e of getContent().exercises) {
      if (e.kind !== "concept" && e.kind !== "behavioral") continue;
      const g = gradeWritten({ answer: `${e.modelAnswer}\n${e.pt.modelAnswer}`, rubric: e.rubric, rubricKeys: e.rubricKeys!, kind: e.kind, lang: "en" });
      expect(g.score, e.id).toBeGreaterThanOrEqual(0.5);
    }
  });
});

describe("term options", () => {
  it("are deterministic, contain the right definition once, and have 4 options", () => {
    const { terms, topicBySlug } = getContent();
    const area = (s: string) => topicBySlug.get(s)?.area;
    for (const term of terms) {
      const a = termOptions(term, terms, "en", area);
      expect(a).toEqual(termOptions(term, terms, "en", area));
      expect(a.options).toHaveLength(4);
      expect(a.options[a.answerIndex]).toBe(term.definitionEn);
      expect(new Set(a.options).size).toBe(4);
    }
  });
});
