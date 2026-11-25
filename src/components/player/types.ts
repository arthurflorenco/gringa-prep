import type { Grade } from "ts-fsrs";
import type { Day } from "@/lib/date";

export interface DoneResult {
  rating: Grade;
  correct: boolean;
  answer?: string;
}

export interface PlayerProps<T> {
  data: T;
  itemId: string;
  day: Day;
  onDone: (r: DoneResult) => void;
}
