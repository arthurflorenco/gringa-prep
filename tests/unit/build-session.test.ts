import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { buildDailySession, weekFor } from "@/lib/daily/build-session";

const content = getContent();
const base = { startDay: "2026-11-26", content, seenIds: new Set<string>(), dueIds: [], topicLevels: {} };
const topicOf = (id: string) => {
  const it = content.itemById.get(id)!;
  return it.type === "term" ? it.term.topic : it.exercise.topic;
};
const weekOfItem = (id: string) => content.topicBySlug.get(topicOf(id))!.week;

describe("weekFor", () => {
  it("maps days to track weeks and caps at 8", () => {
    expect(weekFor("2026-11-26", "2026-11-26")).toBe(1);
    expect(weekFor("2026-11-26", "2026-12-02")).toBe(1);
    expect(weekFor("2026-11-26", "2026-12-03")).toBe(2);
    expect(weekFor("2026-11-26", "2027-06-01")).toBe(8);
  });
});

describe("buildDailySession", () => {
  it("is deterministic", () => {
    expect(buildDailySession({ ...base, day: "2026-11-26" })).toEqual(buildDailySession({ ...base, day: "2026-11-26" }));
  });

  it("day 1 starts with the first lesson, then terms, 4 concepts/quizzes (max 1 written), code and speaking", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26" });
    expect(s[0]).toEqual({ itemId: "lesson-how-web-works", section: "lesson" });
    const count = (sec: string) => s.filter((e) => e.section === sec).length;
    expect(count("terms")).toBe(3);
    expect(count("learn")).toBe(4);
    const written = s.filter((e) => e.section === "learn" && (content.itemById.get(e.itemId) as { exercise: { kind: string } }).exercise.kind === "concept");
    expect(written.length).toBeLessThanOrEqual(1);
    // 1 para digitar (código ou SQL) + 1 code review
    expect(count("practice")).toBe(2);
    const kinds = s.filter((e) => e.section === "practice").map((e) => (content.itemById.get(e.itemId) as { exercise: { kind: string } }).exercise.kind);
    expect(kinds).toContain("review");
    expect(count("speak")).toBe(1);
  });

  it("concepts follow the topic of the lesson of the day", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26" });
    const learn = s.filter((e) => e.section === "learn").map((e) => topicOf(e.itemId));
    expect(learn.slice(0, 2)).toEqual(["web-basics", "web-basics"]);
  });

  it("week 1 only shows week-1 terms and the easiest code exercise", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26" });
    for (const e of s.filter((x) => x.section === "terms")) expect(weekOfItem(e.itemId)).toBe(1);
    const code = s.find((e) => e.section === "practice" && (content.itemById.get(e.itemId) as { exercise: { kind: string } }).exercise.kind === "code")!;
    const it = content.itemById.get(code.itemId)!;
    expect(it.type === "exercise" && it.exercise.difficulty).toBe(1);
  });

  it("moves to the next lesson once the previous one was read", () => {
    const s = buildDailySession({ ...base, day: "2026-11-27", seenIds: new Set(["lesson-how-web-works"]) });
    expect(s[0].itemId).toBe("lesson-html-basics");
  });

  it("puts due reviews after the lesson, capped at 10, and never repeats an item", () => {
    const due = content.exercises.filter((e) => e.kind !== "lesson").slice(0, 12).map((e) => e.id);
    const s = buildDailySession({ ...base, day: "2026-11-27", seenIds: new Set(due), dueIds: due });
    expect(s.filter((e) => e.section === "review")).toHaveLength(10);
    const ids = s.map((e) => e.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("weak topics only appear once the track reaches them", () => {
    const day1 = buildDailySession({ ...base, day: "2026-11-26", topicLevels: { rls: "weak" } });
    expect(day1.some((e) => topicOf(e.itemId) === "rls")).toBe(false);

    const week7 = buildDailySession({ ...base, day: "2027-01-07", topicLevels: { rls: "weak" } });
    expect(week7.filter((e) => e.section === "learn").map((e) => topicOf(e.itemId))).toContain("rls");
  });

  it("does not offer already-seen exercises as new", () => {
    const seen = new Set(content.exercises.map((e) => e.id));
    const s = buildDailySession({ ...base, day: "2026-11-26", seenIds: seen });
    expect(s.filter((e) => e.section !== "terms" && e.section !== "review")).toEqual([]);
  });

  it("follows the library pace: studied ahead of the calendar → next lesson and its topic", () => {
    const week1Lessons = content.exercises.filter((e) => e.kind === "lesson" && content.topicBySlug.get(e.topic)!.week === 1).map((e) => e.id);
    const s = buildDailySession({ ...base, day: "2026-11-27", seenIds: new Set(week1Lessons), progressWeek: 2, recentTopic: "terminal-git" });
    const lesson = s.find((e) => e.section === "lesson")!;
    expect(weekOfItem(lesson.itemId)).toBe(2);
    const learn = s.filter((e) => e.section === "learn").map((e) => topicOf(e.itemId));
    expect(learn[0]).toBe(topicOf(lesson.itemId));
  });

  it("without new lessons, focuses on the most recently studied topic", () => {
    const lessons = content.exercises.filter((e) => e.kind === "lesson").map((e) => e.id);
    const s = buildDailySession({ ...base, day: "2026-11-27", seenIds: new Set(lessons), progressWeek: 2, recentTopic: "js-functions" });
    expect(s.some((e) => e.section === "lesson")).toBe(false);
    expect(topicOf(s.find((e) => e.section === "learn")!.itemId)).toBe("js-functions");
  });
});
