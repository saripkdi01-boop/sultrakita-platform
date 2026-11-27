import { Breadcrumb, type Crumb } from "./Breadcrumb";

export function PageHeader({
  title,
  lead,
  crumbs,
  kicker,
  children,
}: {
  title: string;
  lead?: React.ReactNode;
  crumbs: Crumb[];
  kicker?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-bg-soft">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumb items={crumbs} />
        {kicker ? (
          <p className="mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-red-ink">{kicker}</p>
        ) : null}
        <h1 className={`${kicker ? "mt-1" : "mt-5"} text-3xl font-extrabold tracking-tight sm:text-4xl`}>{title}</h1>
        {lead ? <div className="mt-3 max-w-3xl text-base text-muted sm:text-lg">{lead}</div> : null}
        {children}
      </div>
    </header>
  );
}
