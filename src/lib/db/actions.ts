import { db, type AttemptRow, type SessionRow, type TopicLevel } from "./index";
import { getContent } from "@/lib/content";
import { buildDailySession } from "@/lib/daily/build-session";
import { endOfDay, nowOn, type Day } from "@/lib/date";
import { newCard, review, type Card } from "@/lib/srs";
import type { Grade } from "ts-fsrs";

export interface Settings {
  startDay: Day | null;
  topicLevels: Record<string, TopicLevel>;
}

export const DEFAULT_SETTINGS: Settings = { startDay: null, topicLevels: {} };

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const out: Settings = { ...DEFAULT_SETTINGS, topicLevels: {} };
  for (const r of rows) (out as unknown as Record<string, unknown>)[r.key] = r.value;
  return out;
}

export async function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  await db.settings.put({ key, value });
}

/** Devolve a sessão do dia, criando-a (uma única vez) se ainda não existir. */
export async function ensureSession(day: Day): Promise<SessionRow> {
  return db.transaction("rw", db.sessions, db.cards, db.settings, async () => {
    const existing = await db.sessions.get(day);
    if (existing) return existing;

    const settings = await getSettings();
    let startDay = settings.startDay;
    if (!startDay) {
      startDay = day;
      await db.settings.put({ key: "startDay", value: day });
    }
    const cards = await db.cards.toArray();
    const due = cards
      .filter((c) => c.due.getTime() <= endOfDay(day).getTime())
      .sort((a, b) => a.due.getTime() - b.due.getTime())
      .map((c) => c.itemId);

    const entries = buildDailySession({
      day,
      startDay,
      content: getContent(),
      seenIds: new Set(cards.map((c) => c.itemId)),
      dueIds: due,
      topicLevels: settings.topicLevels,
    });
    const row: SessionRow = { day, entries, createdAt: new Date() };
    await db.sessions.put(row);
    return row;
  });
}

export interface RecordInput {
  itemId: string;
  day: Day;
  rating: Grade;
  correct: boolean;
  answer?: string;
  durationSec?: number;
}

/** Grava a tentativa e reagenda o card no FSRS. */
export async function recordAttempt(input: RecordInput): Promise<Card> {
  const now = nowOn(input.day);
  return db.transaction("rw", db.attempts, db.cards, async () => {
    const attempt: AttemptRow = { ...input, createdAt: now };
    await db.attempts.add(attempt);
    const existing = await db.cards.get(input.itemId);
    const { itemId: _id, lastRating: _r, ...card } = existing ?? { ...newCard(now), itemId: input.itemId };
    void _id;
    void _r;
    const next = review(card as Card, input.rating, now);
    await db.cards.put({ ...next, itemId: input.itemId, lastRating: input.rating });
    return next;
  });
}

/** Acrescenta mais um exercício novo à sessão de hoje ("Quero mais"). */
export async function addExtraToSession(day: Day, itemId: string) {
  await db.transaction("rw", db.sessions, async () => {
    const s = await db.sessions.get(day);
    if (!s || s.entries.some((e) => e.itemId === itemId)) return;
    await db.sessions.put({ ...s, entries: [...s.entries, { itemId, section: "learn" }] });
  });
}

// ---------- Backup ----------

export interface Backup {
  app: "gringa-prep";
  version: 1;
  exportedAt: string;
  cards: unknown[];
  attempts: unknown[];
  sessions: unknown[];
  settings: unknown[];
}

export async function exportBackup(): Promise<Backup> {
  const [cards, attempts, sessions, settings] = await Promise.all([
    db.cards.toArray(),
    db.attempts.toArray(),
    db.sessions.toArray(),
    db.settings.toArray(),
  ]);
  return { app: "gringa-prep", version: 1, exportedAt: new Date().toISOString(), cards, attempts, sessions, settings };
}

const reviveDates = <T extends Record<string, unknown>>(row: T, keys: string[]): T => {
  const out: Record<string, unknown> = { ...row };
  for (const k of keys) if (typeof out[k] === "string") out[k] = new Date(out[k] as string);
  return out as T;
};

export async function importBackup(data: unknown) {
  const b = data as Partial<Backup>;
  if (b?.app !== "gringa-prep" || b.version !== 1) throw new Error("Ficheiro de backup inválido.");
  await db.transaction("rw", db.cards, db.attempts, db.sessions, db.settings, async () => {
    await Promise.all([db.cards.clear(), db.attempts.clear(), db.sessions.clear(), db.settings.clear()]);
    await db.cards.bulkPut((b.cards ?? []).map((r) => reviveDates(r as Record<string, unknown>, ["due", "last_review"])) as never);
    await db.attempts.bulkPut((b.attempts ?? []).map((r) => reviveDates(r as Record<string, unknown>, ["createdAt"])) as never);
    await db.sessions.bulkPut((b.sessions ?? []).map((r) => reviveDates(r as Record<string, unknown>, ["createdAt"])) as never);
    await db.settings.bulkPut((b.settings ?? []) as never);
  });
}

export async function resetAll() {
  await Promise.all([db.cards.clear(), db.attempts.clear(), db.sessions.clear(), db.settings.clear()]);
}
