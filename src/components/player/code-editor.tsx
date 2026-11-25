"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const theme = EditorView.theme(
  {
    "&": { backgroundColor: "var(--code-bg)", color: "var(--code-fg)", fontSize: "13px", borderRadius: "12px" },
    ".cm-content": { fontFamily: "var(--font-mono)", padding: "14px 0", caretColor: "var(--accent)" },
    ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "#6b665c" },
    ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "rgba(255,255,255,0.035)" },
    "&.cm-focused": { outline: "none" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "rgba(224,128,94,0.25) !important" },
    ".cm-cursor": { borderLeftColor: "var(--accent)" },
    ".cm-scroller": { lineHeight: "1.65" },
  },
  { dark: true },
);

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword], color: "#e0805e" },
  { tag: [tags.string, tags.special(tags.string)], color: "#a8c79a" },
  { tag: [tags.number, tags.bool, tags.null], color: "#d9b26f" },
  { tag: [tags.comment], color: "#77716a", fontStyle: "italic" },
  { tag: [tags.typeName, tags.className], color: "#8fb8d6" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#e8d9b5" },
  { tag: [tags.operator, tags.punctuation], color: "#a39d91" },
]);

export default function CodeEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
}) {
  // ⌘/Ctrl+Enter corre os testes em vez de inserir uma linha.
  const runKeys = Prec.highest(keymap.of([{ key: "Mod-Enter", run: () => (onRun?.(), true) }]));
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      theme={theme}
      extensions={[runKeys, javascript({ typescript: true }), syntaxHighlighting(highlight), EditorView.lineWrapping]}
      basicSetup={{ foldGutter: false, highlightActiveLineGutter: !readOnly, highlightActiveLine: !readOnly, autocompletion: true }}
      aria-label="Editor de código"
    />
  );
}
