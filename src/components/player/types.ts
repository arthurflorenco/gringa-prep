import type { Grade } from "ts-fsrs";
import type { Day } from "@/lib/date";
import type { Lang } from "@/lib/content/schema";

export interface DoneResult {
  rating: Grade;
  correct: boolean;
  answer?: string;
  /** false = só regista que foi feito, sem agendar revisão (aulas). */
  schedule?: boolean;
}

export interface PlayerProps<T> {
  data: T;
  itemId: string;
  day: Day;
  onDone: (r: DoneResult) => void;
  lang: Lang;
}
