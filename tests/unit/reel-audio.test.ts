import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@content/reels/audio-manifest.json";
import { AUDIO_EXT, beatAt, clipFor, clipKey, estimateTiming, revealTimes, spokenText, splitBeats, timingFor, wordTimes, type AudioManifest } from "@/lib/reel-audio";

describe("reel audio", () => {
  it("splits beats and strips the markers for speech", () => {
    expect(splitBeats("Step by step: | one, | two.")).toEqual(["Step by step:", "one,", "two."]);
    expect(splitBeats("no beats here")).toEqual(["no beats here"]);
    expect(spokenText("a | b |  c")).toBe("a b c");
  });

  it("clip keys are stable and change with text, beats and language", () => {
    const k = clipKey("en", "Hello there | friend");
    expect(k).toMatch(/^en-[0-9a-f]{8}$/);
    expect(clipKey("en", "Hello there | friend")).toBe(k);
    expect(clipKey("en", "Hello there friend")).not.toBe(k);
    expect(clipKey("pt", "Hello there | friend")).toMatch(/^pt-/);
    expect(clipKey("pt", "Hello there | friend").slice(3)).not.toBe(k.slice(3));
  });

  it("uses the manifest when there is a clip, and estimates otherwise", () => {
    const say = "One | two three";
    const m: AudioManifest = { [clipKey("en", say)]: { ms: 2000, beats: [0, 900] } };
    expect(clipFor("en", say, m)).toEqual({ ms: 2000, beats: [0, 900], src: `/reel-audio/${clipKey("en", say)}.${AUDIO_EXT}` });
    expect(timingFor("pt", say, m).src).toBeNull();
    const est = estimateTiming(say);
    expect(est.beats).toHaveLength(2);
    expect(est.beats[0]).toBe(0);
    expect(est.beats[1]).toBeGreaterThan(0);
  });

  it("reveal times follow the beats (intro beat skipped) or spread evenly", () => {
    expect(revealTimes(3, { ms: 4000, beats: [0, 1000, 2000, 3000] })).toEqual([1000, 2000, 3000]);
    expect(revealTimes(3, { ms: 4000, beats: [0, 1000, 2000] })).toEqual([0, 1000, 2000]);
    const even = revealTimes(4, { ms: 4000, beats: [0] });
    expect(even[0]).toBe(0);
    expect(even).toEqual([...even].sort((a, b) => a - b));
    expect(even[3]).toBeLessThan(4000);
  });

  it("word times are monotonic and start each segment at its beat", () => {
    const w = wordTimes("Hello big | world", { ms: 3000, beats: [0, 2000] });
    expect(w.map((x) => x.word)).toEqual(["Hello", "big", "world"]);
    expect(w[2].at).toBe(2000);
    expect(w[1].at).toBeGreaterThan(w[0].at);
    expect(beatAt(2500, [0, 2000])).toBe(1);
    expect(beatAt(10, [0, 2000])).toBe(0);
  });

  it("every manifest entry has its file and sane timings", () => {
    for (const [key, info] of Object.entries(manifest as AudioManifest)) {
      expect(existsSync(join(__dirname, "../../public/reel-audio", `${key}.${AUDIO_EXT}`)), key).toBe(true);
      expect(info.beats[0]).toBe(0);
      for (let i = 1; i < info.beats.length; i++) expect(info.beats[i]).toBeGreaterThan(info.beats[i - 1]);
      expect(info.ms).toBeGreaterThan(info.beats[info.beats.length - 1]);
    }
  });
});
