import type { Metadata } from "next";
import { GlossaryView } from "@/components/glossary-view";

export const metadata: Metadata = { title: "Glossário — Gringa Prep" };

export default function GlossaryPage() {
  return <GlossaryView />;
}
