import { rawContent } from "@content/index";
import { exerciseSchema, termSchema, topicSchema, type Exercise, type Lesson, type StudyItem, type Term, type Topic } from "./schema";

export interface Content {
  topics: Topic[];
  exercises: Exercise[];
  terms: Term[];
  topicBySlug: Map<string, Topic>;
  itemById: Map<string, StudyItem>;
}

/** O PT de cada cena tem de ter o mesmo nº de passos/itens/opções que o EN. */
function checkReel(lesson: Lesson): string[] {
  const errs: string[] = [];
  lesson.reel.forEach((sc, i) => {
    const at = `lesson "${lesson.id}" reel[${i}]`;
    const same = (a: unknown[], b: unknown[], what: string) => a.length !== b.length && errs.push(`${at}: pt.${what} has ${b.length} items, en has ${a.length}`);
    if (sc.type === "flow") same(sc.steps, sc.pt.steps, "steps");
    if (sc.type === "list") same(sc.items, sc.pt.items, "items");
    if (sc.type === "compare") {
      same(sc.left.items, sc.pt.left.items, "left.items");
      same(sc.right.items, sc.pt.right.items, "right.items");
    }
    if (sc.type === "quiz") {
      same(sc.options, sc.pt.options, "options");
      if (sc.answerIndex >= sc.options.length) errs.push(`${at}: answerIndex out of range`);
    }
    if (sc.type === "code") {
      const lines = sc.code.split("\n").length;
      if (sc.highlight.some((h) => h > lines)) errs.push(`${at}: highlight line out of range`);
      if (sc.pt.code && sc.pt.code.split("\n").length !== lines) errs.push(`${at}: pt.code has a different number of lines`);
    }
  });
  return errs;
}

/** Valida e indexa o conteúdo. Lança um erro legível se algo estiver inválido. */
export function buildContent(raw = rawContent): Content {
  const errors: string[] = [];
  const topics = raw.topics.map((t) => topicSchema.parse(t));
  const topicBySlug = new Map(topics.map((t) => [t.slug, t]));

  const exercises: Exercise[] = [];
  for (const e of raw.exercises) {
    const r = exerciseSchema.safeParse(e);
    if (!r.success) {
      errors.push(`exercise "${(e as { id?: string }).id}": ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
      continue;
    }
    const ex = r.data;
    if (!topicBySlug.has(ex.topic)) errors.push(`exercise "${ex.id}": unknown topic "${ex.topic}"`);
    if (ex.kind === "quiz" && ex.answerIndex >= ex.options.length) errors.push(`exercise "${ex.id}": answerIndex out of range`);
    if (ex.kind === "lesson") errors.push(...checkReel(ex));
    exercises.push(ex);
  }

  const terms: Term[] = [];
  for (const t of raw.terms) {
    const r = termSchema.safeParse(t);
    if (!r.success) {
      errors.push(`term "${t.id}": ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
      continue;
    }
    if (!topicBySlug.has(r.data.topic)) errors.push(`term "${r.data.id}": unknown topic "${r.data.topic}"`);
    terms.push(r.data);
  }

  const itemById = new Map<string, StudyItem>();
  for (const exercise of exercises) {
    if (itemById.has(exercise.id)) errors.push(`duplicate id "${exercise.id}"`);
    itemById.set(exercise.id, { type: "exercise", id: exercise.id, exercise });
  }
  for (const term of terms) {
    if (itemById.has(term.id)) errors.push(`duplicate id "${term.id}"`);
    itemById.set(term.id, { type: "term", id: term.id, term });
  }

  if (errors.length) throw new Error(`Invalid content:\n- ${errors.join("\n- ")}`);
  return { topics, exercises, terms, topicBySlug, itemById };
}

let cached: Content | undefined;
export function getContent(): Content {
  return (cached ??= buildContent());
}
