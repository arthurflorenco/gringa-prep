"use client";

import { useState } from "react";
import { getContent } from "@/lib/content";
import { Label } from "@/components/ui";
import { SeenDot } from "@/components/seen-dot";

export function GlossaryView() {
  const { terms, topicBySlug } = getContent();
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const filtered = (s ? terms.filter((t) => [t.term, t.definitionEn, t.definitionPt].some((x) => x.toLowerCase().includes(s))) : [...terms]).sort(
    (a, b) => a.term.localeCompare(b.term),
  );

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Label>{terms.length} termos</Label>
        <h1 className="font-serif text-5xl tracking-tight">Glossário</h1>
        <p className="text-muted">Vocabulário técnico em inglês, com a frase pronta para usar na entrevista.</p>
      </header>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Procurar termo…"
        className="w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm outline-none transition-colors placeholder:text-faint focus:border-border-strong"
      />
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {filtered.map((t) => (
          <li key={t.id}>
            <details className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center gap-3">
                <SeenDot id={t.id} />
                <span className="flex-1 font-medium">{t.term}</span>
                <span className="hidden font-mono text-[11px] text-faint sm:inline">{topicBySlug.get(t.topic)?.name}</span>
                <span className="text-faint transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-3 space-y-2 pl-4 text-sm leading-relaxed">
                <p>{t.definitionEn}</p>
                <p className="text-muted">{t.definitionPt}</p>
                <p className="border-l-2 border-accent pl-3 font-serif text-base italic">“{t.interviewLine}”</p>
              </div>
            </details>
          </li>
        ))}
        {filtered.length === 0 && <li className="px-5 py-6 text-center text-sm text-faint">Nenhum termo encontrado.</li>}
      </ul>
    </div>
  );
}
