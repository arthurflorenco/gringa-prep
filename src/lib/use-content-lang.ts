"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/content/schema";

const KEY = "contentLang";
const EVENT = "content-lang-change";

/** Idioma padrão das perguntas. Português enquanto se aprende o básico. */
export const DEFAULT_LANG: Lang = "pt";

function read(): Lang {
  const v = localStorage.getItem(KEY);
  return v === "en" || v === "pt" ? v : DEFAULT_LANG;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function setContentLang(lang: Lang) {
  localStorage.setItem(KEY, lang);
  window.dispatchEvent(new Event(EVENT));
}

/** Preferência global de idioma do conteúdo (sincronizada entre abas). */
export function useContentLang(): Lang {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_LANG);
}
