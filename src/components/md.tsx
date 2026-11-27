import { Fragment, type ReactNode } from "react";

/** Inline: **negrito**, `código`. Sem HTML cru — seguro para conteúdo de contribuidores. */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={`${keyBase}-${i++}`} className="font-semibold text-fg">{tok.slice(2, -2)}</strong>);
    else
      out.push(
        <code key={`${keyBase}-${i++}`} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
          {tok.slice(1, -1)}
        </code>,
      );
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Markdown leve: parágrafos, listas com "-" e blocos ```. */
export function Md({ children, className = "" }: { children: string; className?: string }) {
  const blocks: ReactNode[] = [];
  const parts = children.split(/```(?:\w+)?\n([\s\S]*?)```/g);
  parts.forEach((part, idx) => {
    if (idx % 2 === 1) {
      blocks.push(
        <pre key={`c${idx}`} className="overflow-x-auto rounded-xl bg-code-bg p-4 font-mono text-[13px] leading-relaxed text-code-fg">
          <code>{part.replace(/\n$/, "")}</code>
        </pre>,
      );
      return;
    }
    part
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((para, j) => {
        const key = `p${idx}-${j}`;
        // Agrupa linhas seguidas: as que começam por "- " viram lista, as outras parágrafo.
        const groups: { list: boolean; lines: string[] }[] = [];
        for (const line of para.split("\n")) {
          const list = /^\s*[-*] /.test(line);
          const last = groups[groups.length - 1];
          if (last && last.list === list) last.lines.push(line);
          else groups.push({ list, lines: [line] });
        }
        groups.forEach((g, gi) => {
          const gk = `${key}-${gi}`;
          if (g.list) {
            blocks.push(
              <ul key={gk} className="list-disc space-y-1 pl-5 marker:text-faint">
                {g.lines.map((l, k) => (
                  <li key={k}>{inline(l.replace(/^\s*[-*] /, ""), `${gk}-${k}`)}</li>
                ))}
              </ul>,
            );
          } else {
            blocks.push(
              <p key={gk}>
                {g.lines.map((l, k) => (
                  <Fragment key={k}>
                    {k > 0 && <br />}
                    {inline(l, `${gk}-${k}`)}
                  </Fragment>
                ))}
              </p>,
            );
          }
        });
      });
  });
  return <div className={`space-y-3 leading-relaxed ${className}`}>{blocks}</div>;
}
