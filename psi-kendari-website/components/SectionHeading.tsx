import Link from "next/link";
import { IconArrowRight } from "./icons";

export function SectionHeading({
  title,
  id,
  href,
  hrefLabel = "Lihat semua",
  kicker,
  as: As = "h2",
  children,
}: {
  title: string;
  id?: string;
  href?: string;
  hrefLabel?: string;
  kicker?: string;
  as?: "h1" | "h2";
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-fg pb-2">
      <div>
        {kicker ? (
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-red-ink">{kicker}</p>
        ) : null}
        <As id={id} className="text-xl font-extrabold tracking-tight sm:text-2xl">
          <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-red align-middle" aria-hidden="true" />
          {title}
        </As>
        {children}
      </div>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-red-ink hover:underline">
          {hrefLabel} <IconArrowRight />
        </Link>
      ) : null}
    </div>
  );
}
