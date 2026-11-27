import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { ensureSession, exportBackup, importBackup, recordAttempt, resetAll, restartTrack, setSetting } from "@/lib/db/actions";
import { Rating } from "@/lib/srs";
import { streak } from "@/lib/date";

beforeEach(async () => {
  await resetAll();
});

describe("ensureSession", () => {
  it("creates the session once and sets the start day", async () => {
    const a = await ensureSession("2026-11-26");
    const b = await ensureSession("2026-11-26");
    expect(b).toEqual(a);
    expect((await db.settings.get("startDay"))?.value).toBe("2026-11-26");
  });

  it("a failed item comes back as a review the next day", async () => {
    const s1 = await ensureSession("2026-11-26");
    const first = s1.entries.find((e) => e.section !== "lesson")!.itemId;
    await recordAttempt({ itemId: first, day: "2026-11-26", rating: Rating.Again, correct: false });
    const s2 = await ensureSession("2026-11-27");
    expect(s2.entries.find((e) => e.itemId === first)?.section).toBe("review");
  });

  it("an easy item does not come back the next day", async () => {
    const s1 = await ensureSession("2026-11-26");
    const first = s1.entries.find((e) => e.section !== "lesson")!.itemId;
    await recordAttempt({ itemId: first, day: "2026-11-26", rating: Rating.Easy, correct: true });
    const s2 = await ensureSession("2026-11-27");
    expect(s2.entries.some((e) => e.itemId === first)).toBe(false);
  });
});

describe("lessons", () => {
  it("are recorded without a review card, and the next day brings the next lesson", async () => {
    const s1 = await ensureSession("2026-11-26");
    expect(s1.entries[0].section).toBe("lesson");
    await recordAttempt({ itemId: s1.entries[0].itemId, day: "2026-11-26", rating: Rating.Good, correct: true, schedule: false });
    expect(await db.cards.get(s1.entries[0].itemId)).toBeUndefined();
    const s2 = await ensureSession("2026-11-27");
    expect(s2.entries[0].itemId).not.toBe(s1.entries[0].itemId);
    expect(s2.entries.some((e) => e.itemId === s1.entries[0].itemId)).toBe(false);
  });
});

describe("restartTrack", () => {
  it("moves the start day and rebuilds today's session", async () => {
    await setSetting("startDay", "2026-10-01");
    const before = await ensureSession("2026-11-26");
    await restartTrack("2026-11-26");
    expect((await db.settings.get("startDay"))?.value).toBe("2026-11-26");
    expect(await db.sessions.get("2026-11-26")).toBeUndefined();
    const after = await ensureSession("2026-11-26");
    expect(after.entries[0].itemId).toBe("lesson-how-web-works");
    expect(before).toBeDefined();
  });
});

describe("backup", () => {
  it("round-trips through JSON", async () => {
    await setSetting("topicLevels", { rls: "weak" });
    const s = await ensureSession("2026-11-26");
    await recordAttempt({ itemId: s.entries.find((e) => e.section !== "lesson")!.itemId, day: "2026-11-26", rating: Rating.Good, correct: true, answer: "x" });
    const json = JSON.parse(JSON.stringify(await exportBackup()));
    await resetAll();
    expect(await db.cards.count()).toBe(0);
    await importBackup(json);
    expect(await db.cards.count()).toBe(1);
    expect((await db.cards.toArray())[0].due).toBeInstanceOf(Date);
    expect((await db.settings.get("topicLevels"))?.value).toEqual({ rls: "weak" });
  });

  it("rejects foreign files", async () => {
    await expect(importBackup({ foo: 1 })).rejects.toThrow();
  });
});

describe("streak", () => {
  it("counts consecutive days ending today or yesterday", () => {
    expect(streak(["2026-11-24", "2026-11-25", "2026-11-26"], "2026-11-26")).toBe(3);
    expect(streak(["2026-11-24", "2026-11-25"], "2026-11-26")).toBe(2);
    expect(streak(["2026-11-20"], "2026-11-26")).toBe(0);
  });
});
