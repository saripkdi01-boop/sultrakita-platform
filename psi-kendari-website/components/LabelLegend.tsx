import { LABELS, type VerificationLabel } from "@/lib/labels";
import { VerificationBadge } from "./Badges";

export function LabelLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {(Object.keys(LABELS) as VerificationLabel[]).map((k) => (
        <div key={k} className="rounded-xl border border-border bg-surface p-3">
          <dt>
            <VerificationBadge label={k} />
          </dt>
          <dd className="mt-2 text-xs text-muted">{LABELS[k].desc}</dd>
        </div>
      ))}
    </dl>
  );
}
