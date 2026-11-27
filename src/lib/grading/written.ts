import { Rating } from "@/lib/srs";
import type { Grade } from "ts-fsrs";
import type { Lang } from "@/lib/content/schema";

/**
 * Correção local (sem IA) das respostas escritas: cobertura da rubrica por palavras-chave
 * (EN e PT), mais dicas de entrevista — tamanho, muletas, idioma, exemplo e estrutura STAR.
 */

export interface Tip {
  kind: "missing" | "length" | "filler" | "language" | "example" | "star";
  text: string;
}

export interface WrittenGrade {
  covered: boolean[];
  /** 0–1 */
  score: number;
  rating: Grade;
  words: number;
  tips: Tip[];
}

export const normalize = (s: string) =>
  ` ${s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim()} `;

/** Uma chave bate se aparece como frase; palavras com ≥4 letras aceitam sufixos (plural, -ing, -ed…). */
export function matchesKey(textNorm: string, key: string): boolean {
  const k = normalize(key).trim();
  if (!k) return false;
  if (k.includes(" ")) return textNorm.includes(` ${k}`);
  if (k.length >= 4) return new RegExp(`\\s${k}[a-z]{0,4}\\s`).test(textNorm);
  return textNorm.includes(` ${k} `);
}

const FILLERS = ["i think", "maybe", "basically", "kind of", "sort of", "actually", "you know", "i guess", "like i said", "tipo", "acho que", "basicamente", "sei la", "ne"];
const PT_WORDS = ["que", "nao", "uma", "para", "com", "como", "isso", "voce", "sao", "porque", "tambem", "quando", "entao", "mais", "pelo", "pela"];
const EN_WORDS = ["the", "and", "is", "are", "that", "with", "for", "this", "when", "because", "which", "you", "it", "of", "to"];
const EXAMPLE = ["for example", "for instance", "e g", "such as", "imagine", "por exemplo", "imagina", "tipo quando"];

const count = (textNorm: string, words: string[]) => words.reduce((n, w) => n + (textNorm.split(` ${w} `).length - 1), 0);

export function ratingFromScore(score: number): Grade {
  return score >= 0.9 ? Rating.Easy : score >= 0.6 ? Rating.Good : score >= 0.3 ? Rating.Hard : Rating.Again;
}

export function gradeWritten({
  answer,
  rubric,
  rubricKeys,
  kind,
  lang,
}: {
  answer: string;
  rubric: string[];
  rubricKeys: string[][];
  kind: "concept" | "behavioral";
  lang: Lang;
}): WrittenGrade {
  const text = normalize(answer);
  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const covered = rubricKeys.map((keys) =>
    keys.some((k) => {
      const max = /^__max_words:(\d+)__$/.exec(k);
      return max ? words > 0 && words <= Number(max[1]) : matchesKey(text, k);
    }),
  );
  const score = words === 0 ? 0 : covered.filter(Boolean).length / Math.max(1, covered.length);
  const tips: Tip[] = [];

  rubric.forEach((r, i) => !covered[i] && tips.push({ kind: "missing", text: r }));

  const [min, max] = kind === "behavioral" ? [80, 350] : [35, 220];
  if (words > 0 && words < min)
    tips.push({ kind: "length", text: `Curta demais (${words} palavras). Numa entrevista, desenvolve: explica o porquê e dá um exemplo — mira ${min}+ palavras.` });
  if (words > max) tips.push({ kind: "length", text: `Longa demais (${words} palavras, ~${Math.round(words / 130)} min falados). Corta para o essencial: ~${max} palavras.` });

  const fillers = FILLERS.filter((f) => count(text, [f]) > 0);
  if (count(text, FILLERS) >= 2)
    tips.push({ kind: "filler", text: `Muletas que soam inseguras: ${fillers.map((f) => `"${f}"`).join(", ")}. Afirma direto: "X does Y because Z".` });

  const pt = count(text, PT_WORDS);
  const en = count(text, EN_WORDS);
  if (lang === "en" && words >= 10 && pt > en)
    tips.push({ kind: "language", text: "Respondeste em português. Para a entrevista lá fora, tenta a mesma resposta em inglês — mesmo simples." });

  if (kind === "concept" && words >= 20 && !EXAMPLE.some((e) => text.includes(` ${normalize(e).trim()} `)))
    tips.push({ kind: "example", text: 'Falta um exemplo concreto ("For example, in my project…"). É o que convence o entrevistador.' });

  if (kind === "behavioral" && words > 0) {
    const first = count(text, ["i", "eu", "fiz", "decidi", "implementei"]);
    const we = count(text, ["we", "nos", "fizemos"]);
    const result = /\d/.test(answer) || ["result", "as a result", "reduced", "increased", "improved", "saved", "learned", "resultado", "reduzi", "aumentei", "melhorei", "aprendi"].some((k) => matchesKey(text, k));
    const situation = ["when", "project", "team", "company", "client", "quando", "projeto", "equipe", "empresa", "cliente"].some((k) => matchesKey(text, k));
    if (!situation) tips.push({ kind: "star", text: "STAR — Situação: começa pelo contexto (onde, quando, qual era o problema)." });
    if (first < 2 || we > first) tips.push({ kind: "star", text: 'STAR — Ação: fala do que **tu** fizeste ("I decided…, I built…"), não só "we".' });
    if (!result) tips.push({ kind: "star", text: "STAR — Resultado: termina com o impacto, de preferência com um número (tempo, %, utilizadores) ou o que aprendeste." });
  }

  return { covered, score, rating: ratingFromScore(score), words, tips };
}
