import { describe, expect, it } from "vitest";
import { getContent, buildContent } from "@/lib/content";
import { localize } from "@/lib/content/localize";
import { animationMs, beatsProblem, isInteractive, revealUnits, sceneDurationMs } from "@/lib/reel";
import { rawContent } from "@content/index";
import { reels as w1 } from "@content/reels/week1";
import { reels as w2 } from "@content/reels/week2";
import { reels as w4 } from "@content/reels/week4";
import { reels as w5 } from "@content/reels/week5";
import { reels as w7 } from "@content/reels/week7";
import { reels as w8 } from "@content/reels/week8";
import type { Lesson, ReelScene } from "@/lib/content/schema";

const lessons = getContent().exercises.filter((e): e is Lesson => e.kind === "lesson");

describe("reels", () => {
  it("every lesson has a reel with at least one quiz, and every reel belongs to a lesson", () => {
    for (const l of lessons) {
      expect(l.reel.length, l.id).toBeGreaterThanOrEqual(4);
      expect(l.reel.some((s) => s.type === "quiz"), l.id).toBe(true);
    }
    const ids = new Set(lessons.map((l) => l.id));
    for (const id of Object.keys({ ...w1, ...w2, ...w4, ...w5, ...w7, ...w8 })) expect(ids.has(id), id).toBe(true);
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

  it("every lesson has at least one interactive scene besides quiz", () => {
    for (const l of lessons) expect(l.reel.some((s) => isInteractive(s) && s.type !== "quiz"), l.id).toBe(true);
  });

  it("beats must match the number of things a scene reveals", () => {
    const list = (say: string): ReelScene => ({ type: "list", say, items: ["a", "b", "c"], pt: { say, items: ["a", "b", "c"] } });
    expect(revealUnits(list("x"))).toBe(3);
    expect(beatsProblem(list("no beats at all"))).toBeNull();
    expect(beatsProblem(list("a | b | c"))).toBeNull();
    expect(beatsProblem(list("intro | a | b | c"))).toBeNull();
    expect(beatsProblem(list("a | b"))).toMatch(/2 beats/);
  });

  it("rejects a reel whose PT has a different number of beats", () => {
    const broken = structuredClone(rawContent);
    const lesson = broken.exercises.find((e) => e.kind === "lesson") as { reel: ReelScene[] };
    const sc = lesson.reel.find((s) => s.say.includes("|"))!;
    sc.pt.say = sc.pt.say.replaceAll("|", "");
    expect(() => buildContent(broken)).toThrow(/beats/);
  });

  it("rejects a fill scene without exactly one blank", () => {
    const broken = structuredClone(rawContent);
    const lesson = broken.exercises.find((e) => e.kind === "lesson" && (e as { reel: ReelScene[] }).reel.some((s) => s.type === "fill")) as { reel: ReelScene[] };
    const fill = lesson.reel.find((s) => s.type === "fill") as Extract<ReelScene, { type: "fill" }>;
    fill.code = fill.code.replace("___", "x");
    expect(() => buildContent(broken)).toThrow(/exactly one ___/);
  });

  it("localize translates the new scene types", () => {
    const l = lessons.find((x) => x.id === "lesson-functions")!;
    const pt = localize(l, "pt");
    const reveal = pt.reel.find((s) => s.type === "reveal") as Extract<ReelScene, { type: "reveal" }>;
    expect(reveal.cards[0].front).toBe("Parâmetro");
    const stack = pt.reel.find((s) => s.type === "visual") as Extract<ReelScene, { type: "visual" }>;
    expect(stack.kind).toBe("stack");
  });
});
