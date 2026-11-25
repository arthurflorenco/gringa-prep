"use client";

import { useRef, type DependencyList } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Entrada suave (fade + subida) dos filhos marcados com [data-enter]. Respeita reduced-motion. */
export function useEnter<T extends HTMLElement>(deps: DependencyList = []) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = ref.current?.querySelectorAll("[data-enter]");
        if (!targets?.length) return;
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.04, clearProps: "transform,opacity,visibility" },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [...deps] },
  );
  return ref;
}

/** Pequeno "pop" num elemento (ex.: ao acertar). */
export function pop(el: Element | null) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
}
