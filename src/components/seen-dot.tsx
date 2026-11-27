import type { ItemStatus } from "@/lib/use-progress";

/** Marca de estado: ✓ verde = feito, ↻ terracota = a rever, círculo vazio = novo. */
export function StatusMark({ status }: { status: ItemStatus | undefined }) {
  if (status === "done")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-[10px] text-bg" aria-label="feito">
        ✓
      </span>
    );
  if (status === "review")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full border border-accent bg-accent-soft text-[11px] text-accent" aria-label="a rever">
        ↻
      </span>
    );
  return <span className="size-5 shrink-0 rounded-full border border-border-strong" aria-label="por fazer" />;
}
