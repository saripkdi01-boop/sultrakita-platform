import { LABELS, type VerificationLabel } from "@/lib/labels";

export function VerificationBadge({ label, className = "" }: { label: VerificationLabel; className?: string }) {
  const l = LABELS[label];
  return (
    <span
      title={l.desc}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.65rem] font-extrabold uppercase leading-none tracking-wider ${l.className} ${className}`}
    >
      {label === "TERVERIFIKASI" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3.5">
          <path d="m5 12 5 5 9-10" />
        </svg>
      ) : null}
      {l.text}
    </span>
  );
}

export function RubrikBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-red-ink ${className}`}>{children}</span>
  );
}
