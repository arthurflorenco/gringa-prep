import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PracticeView } from "@/components/practice-view";

export function generateStaticParams() {
  return getContent().exercises.map((e) => ({ id: e.id }));
}

export async function generateMetadata(props: PageProps<"/exercicio/[id]">) {
  const { id } = await props.params;
  const it = getContent().itemById.get(id);
  return { title: `${it?.type === "exercise" ? it.exercise.title : "Exercício"} — Gringa Prep` };
}

export default async function ExercisePage(props: PageProps<"/exercicio/[id]">) {
  const { id } = await props.params;
  if (!getContent().itemById.has(id)) notFound();
  return <PracticeView id={id} />;
}
