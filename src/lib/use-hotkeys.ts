"use client";

import { useEffect, useRef } from "react";

type Handler = (e: KeyboardEvent) => void;

/**
 * Atalhos de teclado. Teclas simples ("1", " ") são ignoradas quando o foco
 * está num campo de texto; combinações com ⌘/Ctrl funcionam sempre.
 */
export function useHotkeys(map: Record<string, Handler | undefined | false>) {
  const ref = useRef(map);
  useEffect(() => {
    ref.current = map;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      const key = (mod ? "mod+" : "") + (e.key === " " ? "space" : e.key.toLowerCase());
      if (typing && !mod) return;
      const h = ref.current[key];
      if (h) {
        e.preventDefault();
        h(e);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
