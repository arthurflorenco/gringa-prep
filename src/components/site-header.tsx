"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/pt";

const links = [
  { href: "/", label: t.nav.today },
  { href: "/biblioteca", label: t.nav.library },
  { href: "/glossario", label: t.nav.glossary },
  { href: "/progresso", label: t.nav.progress },
  { href: "/ajustes", label: t.nav.settings },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
        <Link href="/" className="font-mono text-sm tracking-tight text-fg">
          <span className="text-accent">●</span> gringa<span className="text-faint">/</span>prep
        </Link>
        <nav className="-mr-2 flex gap-0.5 overflow-x-auto text-sm">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${
                  active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
