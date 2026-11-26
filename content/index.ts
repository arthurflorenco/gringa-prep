import { exercises as jsEventLoop } from "./exercises/js-event-loop";
import { exercises as jsClosures } from "./exercises/js-closures-scope";
import { exercises as jsData } from "./exercises/js-data-structures";
import { exercises as career } from "./exercises/career";
import { exercises as frontendCore } from "./exercises/frontend-core";
import { exercises as backendSecurity } from "./exercises/backend-security";
import { exercises as basicsWeb } from "./exercises/basics-web";
import { exercises as basicsJs } from "./exercises/basics-js";
import { lessons as week1 } from "./lessons/week1";
import { lessons as week2 } from "./lessons/week2";
import { reels as reelsWeek1 } from "./reels/week1";
import { reels as reelsWeek2 } from "./reels/week2";
import { terms as legacyTerms } from "./glossary/terms";
import { terms as basicTerms } from "./glossary/basics";
import { legacyPt, legacyTermLinesPt } from "./translations/pt";
import { topics } from "./topics";
import type { ExerciseInput, LegacyExerciseInput, LegacyTermInput, LessonDraftInput, TermInput } from "@/lib/content/schema";

/** Exercícios antigos recebem o bloco `pt` do ficheiro de traduções. */
const withPt = (list: LegacyExerciseInput[]) => list.map((e) => ({ ...e, pt: legacyPt[e.id] }) as ExerciseInput);

/** Cada aula recebe o seu reel (content/reels/). Aula sem reel falha na validação. */
const reels = { ...reelsWeek1, ...reelsWeek2 };
const withReel = (list: LessonDraftInput[]) => list.map((l) => ({ ...l, reel: reels[l.id] }) as ExerciseInput);

const withLinePt = (list: LegacyTermInput[]) => list.map((t) => ({ ...t, interviewLinePt: legacyTermLinesPt[t.id] }) as TermInput);

/** Para adicionar um ficheiro novo, importe-o aqui. Aulas primeiro (ordem = ordem das aulas). */
export const rawContent = {
  topics,
  exercises: [
    ...withReel([...week1, ...week2]),
    ...basicsWeb,
    ...basicsJs,
    ...withPt([...jsEventLoop, ...jsClosures, ...jsData, ...career, ...frontendCore, ...backendSecurity]),
  ],
  terms: [...basicTerms, ...withLinePt(legacyTerms)],
};
