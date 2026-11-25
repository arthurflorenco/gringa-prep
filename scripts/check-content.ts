import { buildContent } from "../src/lib/content";

const c = buildContent();
const byKind = c.exercises.reduce<Record<string, number>>((acc, e) => ((acc[e.kind] = (acc[e.kind] ?? 0) + 1), acc), {});
console.log(`✓ content ok — ${c.topics.length} topics, ${c.exercises.length} exercises ${JSON.stringify(byKind)}, ${c.terms.length} terms`);
