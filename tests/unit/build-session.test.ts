import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { buildDailySession, weekFor } from "@/lib/daily/build-session";

const content = getContent();
const base = { startDay: "2026-11-26", content, seenIds: new Set<string>(), dueIds: [], topicLevels: {} };

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
    const a = buildDailySession({ ...base, day: "2026-11-26" });
    const b = buildDailySession({ ...base, day: "2026-11-26" });
    expect(a).toEqual(b);
  });

  it("has terms, learn, practice and speak sections on day 1", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26" });
    const count = (sec: string) => s.filter((e) => e.section === sec).length;
    expect(count("terms")).toBe(3);
    expect(count("learn")).toBe(2);
    expect(count("practice")).toBe(1);
    expect(count("speak")).toBe(1);
  });

  it("only picks week-1 topics for terms in week 1", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26" });
    for (const e of s.filter((x) => x.section === "terms")) {
      const item = content.itemById.get(e.itemId)!;
      const topic = item.type === "term" ? item.term.topic : "";
      expect(content.topicBySlug.get(topic)!.week).toBe(1);
    }
  });

  it("puts due reviews first, capped at 10, and never repeats an item", () => {
    const due = content.exercises.slice(0, 12).map((e) => e.id);
    const s = buildDailySession({ ...base, day: "2026-11-27", seenIds: new Set(due), dueIds: due });
    expect(s.slice(0, 10).every((e) => e.section === "review")).toBe(true);
    expect(s.filter((e) => e.section === "review")).toHaveLength(10);
    const ids = s.map((e) => e.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("prioritises topics marked as weak", () => {
    const s = buildDailySession({ ...base, day: "2026-11-26", topicLevels: { rls: "weak" } });
    const learnTopics = s
      .filter((e) => e.section === "learn")
      .map((e) => content.itemById.get(e.itemId))
      .map((i) => (i?.type === "exercise" ? i.exercise.topic : ""));
    expect(learnTopics).toContain("rls");
  });

  it("does not offer already-seen exercises as new", () => {
    const seen = new Set(content.exercises.map((e) => e.id));
    const s = buildDailySession({ ...base, day: "2026-11-26", seenIds: seen });
    expect(s.filter((e) => e.section !== "terms" && e.section !== "review")).toEqual([]);
  });
});
