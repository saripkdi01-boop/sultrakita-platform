import { IconMapPin } from "./icons";

export function OfficeCard({
  title,
  alamat,
  catatan,
  children,
}: {
  title: string;
  alamat: string[];
  catatan?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="flex items-center gap-2 text-lg font-extrabold">
        <IconMapPin className="text-red-ink" /> {title}
      </h3>
      {alamat.length ? (
        <address className="mt-3 not-italic leading-relaxed">
          {alamat.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </address>
      ) : (
        <p className="mt-3 italic text-muted">Alamat menunggu data resmi.</p>
      )}
      {catatan ? <p className="mt-3 text-xs text-muted">{catatan}</p> : null}
      {children}
    </div>
  );
}
