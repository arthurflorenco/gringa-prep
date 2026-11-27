import { buildContent } from "../src/lib/content";
import { localize } from "../src/lib/content/localize";
import { LANGS, type Lesson } from "../src/lib/content/schema";
import { clipFor } from "../src/lib/reel-audio";
import { pronunciationScripts } from "../src/lib/speech";

const c = buildContent();
const byKind = c.exercises.reduce<Record<string, number>>((acc, e) => ((acc[e.kind] = (acc[e.kind] ?? 0) + 1), acc), {});
console.log(`✓ content ok — ${c.topics.length} topics, ${c.exercises.length} exercises ${JSON.stringify(byKind)}, ${c.terms.length} terms`);

/* Narração: só avisa (o CI não tem Kokoro). Sem clip, o reel usa a voz do browser. */
const missing: string[] = [];
for (const l of c.exercises.filter((e): e is Lesson => e.kind === "lesson"))
  for (const lang of LANGS)
    localize(l, lang).reel.forEach((s, i) => {
      for (const text of "why" in s ? [s.say, s.why] : [s.say]) if (!clipFor(lang, text)) missing.push(`${l.id}[${i}] ${lang}`);
    });
for (const s of pronunciationScripts(c)) if (!clipFor("en", s)) missing.push(`pronúncia: "${s.slice(0, 30)}…"`);
if (missing.length) console.warn(`⚠ ${missing.length} reel clips sem áudio (corre \`npm run reel:audio\`): ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`);
