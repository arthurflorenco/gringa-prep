/** Comparação de resultados SQL — pura, usada no worker do browser e nos testes em Node. */

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export interface SqlCheck {
  ok: boolean;
  /** Mensagem curta do que está diferente (vazia quando ok). */
  reason: string;
}

/** Normaliza valores: números (incl. numeric em string) comparam pelo valor; datas em ISO. */
export function norm(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number" || typeof v === "bigint") return String(Number(v));
  const s = String(v);
  return /^-?\d+(\.\d+)?$/.test(s) ? String(Number(s)) : s;
}

const key = (row: unknown[]) => JSON.stringify(row.map(norm));

export function compareResults(user: QueryResult, expected: QueryResult, ordered: boolean): SqlCheck {
  if (user.columns.length !== expected.columns.length)
    return { ok: false, reason: `Devolveste ${user.columns.length} coluna(s); esperava-se ${expected.columns.length} (${expected.columns.join(", ")}).` };
  if (user.rows.length !== expected.rows.length)
    return { ok: false, reason: `Devolveste ${user.rows.length} linha(s); esperava-se ${expected.rows.length}.` };
  const a = user.rows.map(key);
  const b = expected.rows.map(key);
  if (!ordered) {
    a.sort();
    b.sort();
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      const sameSet = [...a].sort().join() === [...b].sort().join();
      return { ok: false, reason: sameSet && ordered ? "As linhas estão certas, mas a ordem não — falta ORDER BY?" : `A linha ${i + 1} não bate com o esperado.` };
    }
  }
  return { ok: true, reason: "" };
}
