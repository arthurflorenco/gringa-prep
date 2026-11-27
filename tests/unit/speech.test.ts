import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { pronunciationScripts, speechScript } from "@/lib/speech";
import { splitBeats } from "@/lib/reel-audio";

describe("speech scripts", () => {
  it("strips markdown and code, one sentence per beat", () => {
    const s = speechScript("An **index** is a `B-tree`. It's fast!\n\n```sql\nSELECT 1;\n```\n- Costs writes");
    expect(splitBeats(s)).toEqual(["An index is a B-tree.", "It's fast!", "Costs writes"]);
  });
  it("every script fits the narration limits", () => {
    for (const s of pronunciationScripts(getContent())) for (const seg of splitBeats(s)) expect(seg.length, seg).toBeLessThan(600);
  });
});
