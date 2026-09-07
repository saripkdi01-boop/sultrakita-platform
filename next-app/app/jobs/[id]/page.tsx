import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Building2, CheckCircle2, Clock3, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getJobById } from '@/lib/actions/jobs';

const labels: Record<string, string> = {
  full_time: 'Full-time', part_time: 'Part-time', contract: 'Kontrak', freelance: 'Freelance', internship: 'Magang',
  onsite: 'On-site', remote: 'Remote', hybrid: 'Hybrid', entry: 'Pemula', mid: 'Menengah', senior: 'Senior', manager: 'Manajer',
};
const rupiah = (value?: number) => value ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value) : 'Gaji kompetitif';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let job;
  try { job = await getJobById(id); } catch { notFound(); }
  if (job.status !== 'published') notFound();

  return <AppLayout active="market"><main className="platform-shell mx-auto max-w-5xl">
    <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal"><ArrowLeft size={16}/> Kembali ke SUKI Jobs</Link>
    <section className="mt-5 rounded-3xl bg-gradient-to-br from-sultra-forest via-sultra-teal to-sultra-blue p-7 text-white shadow-lg md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-5"><div className="flex gap-4"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15"><Building2 size={30}/></div><div><p className="text-xs font-bold uppercase tracking-[.18em] text-sultra-sand">SUKI Jobs</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">{job.title}</h1><p className="mt-2 text-white/80">{job.company?.name} {job.company?.is_verified && <CheckCircle2 className="ml-1 inline text-sultra-sand" size={16}/>}</p></div></div><Link href={`/login?redirect=/jobs/${job.id}`} className="rounded-xl bg-sultra-gold px-5 py-3 text-sm font-bold text-sultra-forest">Lamar sekarang</Link></div>
      <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/85"><span className="rounded-full bg-white/10 px-3 py-2"><MapPin className="mr-1 inline" size={15}/>{job.location}</span><span className="rounded-full bg-white/10 px-3 py-2"><Clock3 className="mr-1 inline" size={15}/>{labels[job.job_type] || job.job_type}</span><span className="rounded-full bg-white/10 px-3 py-2">{labels[job.work_type] || job.work_type}</span></div>
    </section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_310px]"><article className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark md:p-8"><h2 className="text-xl font-bold text-sultra-forest dark:text-sultra-sand">Tentang pekerjaan</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-sultra-sand/75">{job.description}</p><h2 className="mt-8 text-xl font-bold text-sultra-forest dark:text-sultra-sand">Persyaratan</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-sultra-sand/75">{(job.requirements || []).map((item: string) => <li key={item}>{item}</li>)}</ul><h2 className="mt-8 text-xl font-bold text-sultra-forest dark:text-sultra-sand">Tanggung jawab</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-sultra-sand/75">{(job.responsibilities || []).map((item: string) => <li key={item}>{item}</li>)}</ul></article><aside className="space-y-4"><div className="rounded-3xl bg-sultra-mint/50 p-6 dark:bg-sultra-forest/20"><p className="text-xs font-bold uppercase tracking-wider text-sultra-teal">Kompensasi</p><p className="mt-2 text-xl font-bold text-sultra-forest dark:text-sultra-sand">{job.is_salary_hidden ? 'Gaji kompetitif' : `${rupiah(job.salary_min)} – ${rupiah(job.salary_max)}`}</p><p className="mt-1 text-xs text-gray-500">per bulan · {labels[job.experience_level] || job.experience_level}</p></div><div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark"><div className="flex items-center gap-2 text-sultra-teal"><BriefcaseBusiness size={18}/><h2 className="font-bold">Keahlian</h2></div><div className="mt-4 flex flex-wrap gap-2">{(job.skills || []).map((skill: string) => <span key={skill} className="rounded-full bg-sultra-mint px-3 py-1 text-xs text-sultra-forest">{skill}</span>)}</div><Link href={`/login?redirect=/jobs/${job.id}`} className="mt-6 block rounded-xl bg-sultra-forest px-4 py-3 text-center text-sm font-bold text-white">Masuk untuk melamar</Link></div></aside></div>
  </main></AppLayout>;
}
