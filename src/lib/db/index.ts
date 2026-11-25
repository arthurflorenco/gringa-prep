import Dexie, { type EntityTable } from "dexie";
import type { Card } from "@/lib/srs";
import type { Day } from "@/lib/date";

export type Section = "review" | "terms" | "learn" | "practice" | "speak";
export type TopicLevel = "weak" | "medium" | "strong";

export interface CardRow extends Card {
  itemId: string;
  lastRating?: number;
}

export interface AttemptRow {
  id?: number;
  itemId: string;
  day: Day;
  createdAt: Date;
  /** 1 Errei · 2 Difícil · 3 Bom · 4 Fácil */
  rating: number;
  correct: boolean;
  answer?: string;
  durationSec?: number;
}

export interface SessionEntry {
  itemId: string;
  section: Section;
}

export interface SessionRow {
  day: Day;
  entries: SessionEntry[];
  createdAt: Date;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

export class PrepDB extends Dexie {
  cards!: EntityTable<CardRow, "itemId">;
  attempts!: EntityTable<AttemptRow, "id">;
  sessions!: EntityTable<SessionRow, "day">;
  settings!: EntityTable<SettingRow, "key">;

  constructor(name = "gringa-prep") {
    super(name);
    this.version(1).stores({
      cards: "itemId, due",
      attempts: "++id, itemId, day",
      sessions: "day",
      settings: "key",
    });
  }
}

export const db = new PrepDB();
