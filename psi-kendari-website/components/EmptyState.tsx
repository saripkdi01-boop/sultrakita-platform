export function EmptyState({
  title,
  children,
  action,
  tone = "neutral",
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "warning";
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-2xl border border-dashed p-6 text-center ${className} ${
        tone === "warning" ? "border-gold bg-bg-soft" : "border-border bg-bg-soft"
      }`}
    >
      <p className="font-bold text-fg">{title}</p>
      {children ? <div className="mx-auto mt-2 max-w-2xl text-sm text-muted">{children}</div> : null}
      {action ? <div className="mt-4 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
