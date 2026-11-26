import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { localize } from "@/lib/content/localize";

const content = getContent();

describe("localize", () => {
  it("returns Portuguese text fields and keeps code untouched", () => {
    const ex = content.exercises.find((e) => e.id === "code-is-even")!;
    const pt = localize(ex, "pt");
    expect(pt.title).toBe(ex.pt.title);
    expect(pt.prompt).toBe(ex.pt.prompt);
    expect(pt.kind === "code" && ex.kind === "code" && pt.solution === ex.solution).toBe(true);
    expect(localize(ex, "en")).toBe(ex);
  });

  it("every exercise has matching rubric/options lengths in both languages", () => {
    for (const e of content.exercises) {
      if (e.kind === "quiz") expect(e.pt.options.length, e.id).toBe(e.options.length);
      if (e.kind === "concept" || e.kind === "behavioral") expect(e.pt.rubric.length, e.id).toBe(e.rubric.length);
      if (e.kind === "code") expect(e.pt.hints.length, e.id).toBe(e.hints.length);
      if (e.kind === "lesson") expect(e.pt.keyPoints.length, e.id).toBe(e.keyPoints.length);
    }
  });
});
