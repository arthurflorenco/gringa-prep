"use client";

import { useSyncExternalStore } from "react";
import { getToday, type Day } from "@/lib/date";

const subscribe = (cb: () => void) => {
  // Recalcula quando a aba volta a ficar visível (ex.: deixaste aberto de um dia para o outro).
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

/** Dia local atual; `null` durante o render no servidor. */
export function useToday(): Day | null {
  return useSyncExternalStore(subscribe, getToday, () => null);
}
