import { PGlite } from "@electric-sql/pglite";
import { DATASETS, type DatasetName } from "@content/sql/datasets";
import { compareResults, type QueryResult, type SqlCheck } from "./compare";

/** Uma base PGlite por dataset (criada uma vez). Cada query corre numa transação desfeita no fim. */
const dbs = new Map<DatasetName, Promise<PGlite>>();

export function getDb(dataset: DatasetName): Promise<PGlite> {
  let p = dbs.get(dataset);
  if (!p) {
    p = (async () => {
      const db = new PGlite();
      await db.exec(DATASETS[dataset].sql);
      return db;
    })();
    dbs.set(dataset, p);
  }
  return p;
}

export async function runQuery(db: PGlite, sql: string): Promise<QueryResult> {
  await db.exec("BEGIN");
  try {
    const r = await db.query<unknown[]>(sql.trim().replace(/;\s*$/, ""), [], { rowMode: "array" });
    return { columns: r.fields.map((f) => f.name), rows: r.rows };
  } finally {
    await db.exec("ROLLBACK");
  }
}

export interface SqlRunResult {
  result?: QueryResult;
  error?: string;
  check?: SqlCheck;
}

export async function runAndCheck(dataset: DatasetName, sql: string, solution: string, ordered: boolean): Promise<SqlRunResult> {
  const db = await getDb(dataset);
  let result: QueryResult;
  try {
    result = await runQuery(db, sql);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
  const expected = await runQuery(db, solution);
  return { result, check: compareResults(result, expected, ordered) };
}
