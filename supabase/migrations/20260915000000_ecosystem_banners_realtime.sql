-- Enable Supabase Realtime for the public campaign banner feed.
-- RLS on ecosystem_banners remains the source of truth for which rows are visible.
do $$
begin
  alter publication supabase_realtime add table public.ecosystem_banners;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
