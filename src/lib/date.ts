/** Datas como "dias locais" YYYY-MM-DD, para a sessão do dia não mudar com fusos. */
export type Day = string;

const pad = (n: number) => String(n).padStart(2, "0");

export function toDay(d: Date): Day {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDay(day: Day): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isDay(value: string | null | undefined): value is Day {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseDay(value).getTime());
}

export function addDays(day: Day, n: number): Day {
  const d = parseDay(day);
  d.setDate(d.getDate() + n);
  return toDay(d);
}

/** Diferença em dias inteiros (b − a). */
export function diffDays(a: Day, b: Day): number {
  return Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86_400_000);
}

export function endOfDay(day: Day): Date {
  const d = parseDay(day);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** "Agora" dentro do dia indicado (usa a hora real; útil com ?date= para testar). */
export function nowOn(day: Day): Date {
  const real = new Date();
  if (toDay(real) === day) return real;
  const d = parseDay(day);
  d.setHours(real.getHours(), real.getMinutes(), real.getSeconds());
  return d;
}

/** Dia atual. Em desenvolvimento aceita `?date=AAAA-MM-DD` para simular outro dia. */
export function getToday(): Day {
  if (typeof window !== "undefined") {
    const fromUrl = new URLSearchParams(window.location.search).get("date");
    if (isDay(fromUrl)) {
      sessionStorage.setItem("debugDate", fromUrl);
      return fromUrl;
    }
    const stored = sessionStorage.getItem("debugDate");
    if (isDay(stored)) return stored;
  }
  return toDay(new Date());
}

export function streak(days: Iterable<Day>, today: Day): number {
  const set = new Set(days);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (set.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}
