/**
 * Gera a narração dos reels e os áudios de pronúncia com Kokoro (local, grátis) → public/reel-audio/*.m4a + content/reels/audio-manifest.json.
 *
 *   npm run reel:audio                 # só o que falta
 *   npm run reel:audio -- --force      # tudo de novo
 *   npm run reel:audio -- --only lesson-loops
 *
 * Precisa: `brew install uv espeak-ng ffmpeg`. O primeiro uso baixa o modelo (~330 MB).
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildContent } from "../src/lib/content";
import { localize } from "../src/lib/content/localize";
import { LANGS, type Lang, type Lesson } from "../src/lib/content/schema";
import { AUDIO_EXT, VOICES, clipKey, splitBeats, type AudioManifest } from "../src/lib/reel-audio";
import { pronunciationScripts } from "../src/lib/speech";

const root = join(__dirname, "..");
const outDir = join(root, "public", "reel-audio");
const manifestPath = join(root, "content", "reels", "audio-manifest.json");
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

/** Todos os textos falados de um reel: `say` de cada cena e `why` das interativas. */
function spoken(lesson: Lesson, lang: Lang): string[] {
  return localize(lesson, lang).reel.flatMap((s) => ("why" in s ? [s.say, s.why] : [s.say]));
}

const content = buildContent();
const lessons = content.exercises.filter((e): e is Lesson => e.kind === "lesson");
const manifest: AudioManifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
mkdirSync(outDir, { recursive: true });

const wanted = new Map<string, { lang: Lang; text: string }>();
for (const l of lessons) for (const lang of LANGS) for (const text of spoken(l, lang)) wanted.set(clipKey(lang, text), { lang, text });
// Pronúncia: respostas-modelo, frases de entrevista e comentários de review, sempre em inglês.
for (const text of pronunciationScripts(content)) wanted.set(clipKey("en", text), { lang: "en", text });

const tmp = join(tmpdir(), "gringa-reel-audio");
mkdirSync(tmp, { recursive: true });
const targets = new Set(only ? lessons.filter((l) => l.id === only).flatMap((l) => LANGS.flatMap((lang) => spoken(l, lang).map((t) => clipKey(lang, t)))) : wanted.keys());
const jobs = [...targets]
  .filter((key) => force || !manifest[key] || !existsSync(join(outDir, `${key}.${AUDIO_EXT}`)))
  .map((key) => {
    const { lang, text } = wanted.get(key)!;
    return { key, out: join(tmp, `${key}.wav`), lang, voice: VOICES[lang], segments: splitBeats(text) };
  });

function save() {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(manifestPath, JSON.stringify(sorted, null, 1) + "\n");
}

async function main() {
  console.log(`reel audio: ${wanted.size} clips no conteúdo, ${jobs.length} para gerar`);
  if (jobs.length) {
    const py = spawn("uv", ["run", "--quiet", join(root, "scripts", "tts", "kokoro_tts.py")], { stdio: ["pipe", "pipe", "inherit"] });
    py.stdin.end(JSON.stringify(jobs));
    const byOut = new Map(jobs.map((j) => [j.out, j]));
    let buf = "";
    let done = 0;
    py.stdout.on("data", (d: Buffer) => {
      buf += d.toString();
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith('{"out"')) continue; // ignora o ruído do pip/spacy
        const r = JSON.parse(line) as { out: string; ms: number; beats: number[] };
        const job = byOut.get(r.out)!;
        const enc = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", r.out, "-ac", "1", "-c:a", "aac", "-b:a", "48k", join(outDir, `${job.key}.${AUDIO_EXT}`)]);
        if (enc.status !== 0) throw new Error(`ffmpeg falhou em ${job.key}: ${enc.stderr}`);
        rmSync(r.out, { force: true });
        manifest[job.key] = { ms: r.ms, beats: r.beats };
        done++;
        process.stdout.write(`\r  ${done}/${jobs.length}`);
        if (done % 10 === 0) save();
      }
    });
    const code: number = await new Promise((res) => py.on("close", res));
    process.stdout.write("\n");
    save();
    if (code !== 0) throw new Error(`kokoro_tts.py saiu com código ${code}`);
  }

  // Remove clips que já não estão no conteúdo.
  let removed = 0;
  for (const key of Object.keys(manifest))
    if (!wanted.has(key)) {
      delete manifest[key];
      removed++;
    }
  for (const f of readdirSync(outDir))
    if (!wanted.has(f.replace(/\.\w+$/, ""))) {
      rmSync(join(outDir, f));
      removed++;
    }
  save();
  console.log(`✓ reel audio ok${removed ? ` (${removed} órfãos removidos)` : ""}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
