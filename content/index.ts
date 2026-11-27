import { exercises as jsEventLoop } from "./exercises/js-event-loop";
import { exercises as jsClosures } from "./exercises/js-closures-scope";
import { exercises as jsData } from "./exercises/js-data-structures";
import { exercises as career } from "./exercises/career";
import { exercises as frontendCore } from "./exercises/frontend-core";
import { exercises as backendSecurity } from "./exercises/backend-security";
import { exercises as basicsWeb } from "./exercises/basics-web";
import { exercises as basicsJs } from "./exercises/basics-js";
import { exercises as backend } from "./exercises/backend";
import { exercises as sql } from "./exercises/sql";
import { exercises as typescript } from "./exercises/typescript";
import { exercises as reactNext } from "./exercises/react-next";
import { exercises as ai } from "./exercises/ai";
import { exercises as reviews } from "./exercises/reviews";
import { exercises as sqlPractice } from "./exercises/sql-practice";
import { exercises as codePractice } from "./exercises/code-practice";
import { exercises as fillJs } from "./exercises/fill-js";
import { exercises as fillBackend } from "./exercises/fill-backend";
import { exercises as quality } from "./exercises/quality";
import { exercises as careerJunior } from "./exercises/career-junior";
import { lessons as week1 } from "./lessons/week1";
import { lessons as week2 } from "./lessons/week2";
import { lessons as week4 } from "./lessons/week4";
import { lessons as week5 } from "./lessons/week5";
import { lessons as week7 } from "./lessons/week7";
import { lessons as week8 } from "./lessons/week8";
import { reels as reelsWeek1 } from "./reels/week1";
import { reels as reelsWeek2 } from "./reels/week2";
import { reels as reelsWeek4 } from "./reels/week4";
import { reels as reelsWeek5 } from "./reels/week5";
import { reels as reelsWeek7 } from "./reels/week7";
import { reels as reelsWeek8 } from "./reels/week8";
import { terms as legacyTerms } from "./glossary/terms";
import { terms as basicTerms } from "./glossary/basics";
import { terms as backendTerms } from "./glossary/backend";
import { terms as aiTerms } from "./glossary/ai";
import { legacyPt, legacyTermLinesPt } from "./translations/pt";
import { topics } from "./topics";
import { rubricKeys } from "./grading/rubric-keys";
import type { ExerciseInput, LegacyExerciseInput, LegacyTermInput, LessonDraftInput, TermInput } from "@/lib/content/schema";

/** Exercícios antigos recebem o bloco `pt` do ficheiro de traduções. */
const withPt = (list: LegacyExerciseInput[]) => list.map((e) => ({ ...e, pt: legacyPt[e.id] }) as ExerciseInput);

/** Cada aula recebe o seu reel (content/reels/). Aula sem reel falha na validação. */
const reels = { ...reelsWeek1, ...reelsWeek2, ...reelsWeek4, ...reelsWeek5, ...reelsWeek7, ...reelsWeek8 };
const withReel = (list: LessonDraftInput[]) => list.map((l) => ({ ...l, reel: reels[l.id] }) as ExerciseInput);

const withLinePt = (list: LegacyTermInput[]) => list.map((t) => ({ ...t, interviewLinePt: legacyTermLinesPt[t.id] }) as TermInput);

/** Conceitos/comportamentais sem `rubricKeys` inline recebem as de content/grading/rubric-keys.ts. */
const withKeys = (list: ExerciseInput[]) =>
  list.map((e) => ((e.kind === "concept" || e.kind === "behavioral") && !e.rubricKeys ? ({ ...e, rubricKeys: rubricKeys[e.id] } as ExerciseInput) : e));

/** Para adicionar um ficheiro novo, importe-o aqui. Aulas primeiro (ordem = ordem das aulas). */
export const rawContent = {
  topics,
  exercises: withKeys([
    ...withReel([...week1, ...week2, ...week4, ...week5, ...week7, ...week8]),
    ...basicsWeb,
    ...basicsJs,
    ...withPt([...jsEventLoop, ...jsClosures, ...jsData, ...career, ...frontendCore, ...backendSecurity]),
    ...backend,
    ...sql,
    ...typescript,
    ...reactNext,
    ...ai,
    ...reviews,
    ...sqlPractice,
    ...codePractice,
    ...fillJs,
    ...fillBackend,
    ...quality,
    ...careerJunior,
  ]),
  terms: [...basicTerms, ...withLinePt(legacyTerms), ...backendTerms, ...aiTerms],
};
