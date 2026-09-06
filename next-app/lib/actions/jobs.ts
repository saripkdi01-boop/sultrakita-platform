'use server';

import { revalidatePath } from 'next/cache';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

export type Job = { id: string; company_id: string; title: string; slug: string; description: string; job_type: string; work_type: string; experience_level: string; salary_min?: number; salary_max?: number; is_salary_hidden?: boolean; location: string; district?: string; city: string; status: string; published_at: string; is_featured?: boolean; skills?: string[]; company?: { name: string; logo_url?: string; rating?: number; is_verified?: boolean } };
export type JobFilters = { search?: string; location?: string; jobType?: string; workType?: string; experienceLevel?: string; salaryMin?: number; salaryMax?: number; page?: number; limit?: number };
const friendly = (error: unknown) => error instanceof Error ? error.message : 'SUKI Jobs belum dapat memproses permintaan.';

export async function getJobs(filters: JobFilters = {}) {
  try {
    const client = getServerSupabase(); const limit = Math.min(filters.limit || 12, 50); const page = Math.max(filters.page || 1, 1);
    let query = client.from('jobs').select('*, company:companies(name,logo_url,rating,is_verified)', { count: 'exact' }).eq('status', 'published');
    if (filters.search?.trim()) query = query.or(`title.ilike.%${filters.search.trim()}%,description.ilike.%${filters.search.trim()}%`);
    if (filters.location) query = query.or(`city.ilike.%${filters.location}%,district.ilike.%${filters.location}%`);
    if (filters.jobType) query = query.eq('job_type', filters.jobType);
    if (filters.workType) query = query.eq('work_type', filters.workType);
    if (filters.experienceLevel) query = query.eq('experience_level', filters.experienceLevel);
    if (filters.salaryMin !== undefined) query = query.gte('salary_max', filters.salaryMin);
    if (filters.salaryMax !== undefined) query = query.lte('salary_min', filters.salaryMax);
    const { data, error, count } = await query.order('is_featured', { ascending: false }).order('published_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { ok: true as const, jobs: (data || []) as Job[], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) };
  } catch (error) { return { ok: false as const, jobs: [] as Job[], total: 0, page: 1, totalPages: 0, error: friendly(error) }; }
}

export async function getJobById(id: string) {
  const { data, error } = await getServerSupabase().from('jobs').select('*, company:companies(*)').eq('id', id).single();
  if (error) throw error; return data as Job;
}

export async function applyForJob(jobId: string, applicationData: { resume_url?: string; cover_letter?: string }) {
  try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('job_applications').insert({ job_id: jobId, applicant_id: user.id, resume_url: applicationData.resume_url || null, cover_letter: applicationData.cover_letter?.trim() || null }).select('id,job_id,status,applied_at').single(); if (error) throw error; revalidatePath('/jobs'); return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function toggleSavedJob(jobId: string) {
  try { const { supabase, user } = await requireServerUser(); const { data: existing } = await supabase.from('saved_jobs').select('id').eq('user_id', user.id).eq('job_id', jobId).maybeSingle(); const result = existing ? await supabase.from('saved_jobs').delete().eq('id', existing.id) : await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId }); if (result.error) throw result.error; return { ok: true as const, saved: !existing }; } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function getSavedJobIds() { try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('saved_jobs').select('job_id').eq('user_id', user.id); if (error) throw error; return { ok: true as const, ids: (data || []).map(row => row.job_id as string) }; } catch { return { ok: false as const, ids: [] as string[] }; } }

export async function createJobAlert(input: { title: string; keywords?: string[]; locations?: string[]; frequency?: 'daily' | 'weekly' }) { try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('job_alerts').insert({ user_id: user.id, title: input.title.trim(), keywords: input.keywords || [], locations: input.locations || [], frequency: input.frequency || 'daily' }).select('id,title,is_active,frequency').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }
