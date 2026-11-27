# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["kokoro>=0.9.4", "soundfile", "numpy", "pip"]
# ///
"""
Sintetiza clips do reel com o Kokoro (open source, corre localmente).

stdin:  JSON [{ "out": "/abs/clip.wav", "lang": "en" | "pt", "voice": "af_heart", "segments": ["...", "..."] }]
stdout: uma linha JSON por clip: { "out": ..., "ms": total, "beats": [início de cada segmento em ms] }

Uso: uv run scripts/tts/kokoro_tts.py < jobs.json   (chamado por scripts/gen-reel-audio.ts)
"""
import json
import sys
import warnings

warnings.filterwarnings("ignore")

import numpy as np
import soundfile as sf
from kokoro import KPipeline

RATE = 24000
GAP = np.zeros(int(RATE * 0.12), dtype=np.float32)  # 120 ms entre beats
LANG_CODE = {"en": "a", "pt": "p"}

pipelines: dict[str, KPipeline] = {}


def pipeline(lang: str) -> KPipeline:
    if lang not in pipelines:
        pipelines[lang] = KPipeline(lang_code=LANG_CODE[lang], repo_id="hexgrad/Kokoro-82M")
    return pipelines[lang]


def synth(lang: str, voice: str, text: str) -> np.ndarray:
    parts = [np.asarray(r.audio, dtype=np.float32) for r in pipeline(lang)(text, voice=voice, speed=1.0) if r.audio is not None]
    return np.concatenate(parts) if parts else np.zeros(0, dtype=np.float32)


def trim(a: np.ndarray, thr: float = 0.01) -> np.ndarray:
    """Corta o silêncio do início/fim de cada segmento (mantém um respiro curto)."""
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a
    pad = int(RATE * 0.03)
    return a[max(idx[0] - pad, 0) : idx[-1] + pad]


def main() -> None:
    jobs = json.load(sys.stdin)
    for job in jobs:
        chunks, beats, cursor = [], [], 0
        for i, seg in enumerate(job["segments"]):
            if i:
                chunks.append(GAP)
                cursor += len(GAP)
            beats.append(round(cursor / RATE * 1000))
            audio = trim(synth(job["lang"], job["voice"], seg))
            chunks.append(audio)
            cursor += len(audio)
        sf.write(job["out"], np.concatenate(chunks), RATE)
        print(json.dumps({"out": job["out"], "ms": round(cursor / RATE * 1000), "beats": beats}), flush=True)


if __name__ == "__main__":
    main()
