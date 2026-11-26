import { describe, expect, it } from "vitest";
import { getContent, buildContent } from "@/lib/content";
import { localize } from "@/lib/content/localize";
import { animationMs, sceneDurationMs } from "@/lib/reel";
import { rawContent } from "@content/index";
import { reels as w1 } from "@content/reels/week1";
import { reels as w2 } from "@content/reels/week2";
import type { Lesson, ReelScene } from "@/lib/content/schema";

const lessons = getContent().exercises.filter((e): e is Lesson => e.kind === "lesson");

describe("reels", () => {
  it("every lesson has a reel with at least one quiz, and every reel belongs to a lesson", () => {
    for (const l of lessons) {
      expect(l.reel.length, l.id).toBeGreaterThanOrEqual(4);
      expect(l.reel.some((s) => s.type === "quiz"), l.id).toBe(true);
    }
    const ids = new Set(lessons.map((l) => l.id));
    for (const id of Object.keys({ ...w1, ...w2 })) expect(ids.has(id), id).toBe(true);
  });

  it("localize translates every scene and keeps code/answers", () => {
    const l = lessons.find((x) => x.id === "lesson-loops")!;
    const pt = localize(l, "pt");
    pt.reel.forEach((s, i) => {
      const en = l.reel[i];
      expect(s.say).toBe(en.pt.say);
      expect(s.type).toBe(en.type);
      if (s.type === "quiz" && en.type === "quiz") {
        expect(s.answerIndex).toBe(en.answerIndex);
        expect(s.options).toEqual(en.pt.options);
      }
      if (s.type === "code" && en.type === "code") expect(s.code).toBe(en.pt.code ?? en.code);
    });
    expect(localize(l, "en").reel).toBe(l.reel);
  });

  it("rejects a reel whose PT has a different number of options", () => {
    const broken = structuredClone(rawContent);
    const lesson = broken.exercises.find((e) => e.kind === "lesson") as { reel: ReelScene[] };
    const quiz = lesson.reel.find((s) => s.type === "quiz") as Extract<ReelScene, { type: "quiz" }>;
    quiz.pt.options = quiz.pt.options.slice(0, -1);
    expect(() => buildContent(broken)).toThrow(/pt\.options/);
  });

  it("scene duration covers speech and animation, and gets shorter when faster", () => {
    const scene: ReelScene = { type: "list", say: "one two three four five six seven eight nine ten eleven twelve thirteen", items: ["a", "b", "c"], pt: { say: "x x x x x", items: ["a", "b", "c"] } };
    const d1 = sceneDurationMs(scene, 1);
    expect(d1).toBeGreaterThanOrEqual(animationMs(scene));
    expect(d1).toBeGreaterThan(sceneDurationMs(scene, 1.5));
    expect(sceneDurationMs({ ...scene, say: "short one" }, 1)).toBeGreaterThanOrEqual(2500);
  });
});
