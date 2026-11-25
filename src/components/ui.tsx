import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-fg text-bg hover:opacity-90",
    secondary: "border border-border bg-surface text-fg hover:border-border-strong",
    ghost: "text-muted hover:text-fg hover:bg-surface-2",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`}
    />
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted">{children}</kbd>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "success" | "danger" }) {
  const tones = {
    neutral: "bg-surface-2 text-muted",
    accent: "bg-accent-soft text-accent",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-6 sm:p-8 ${className}`}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{children}</div>;
}
