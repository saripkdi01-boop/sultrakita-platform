-- Normalize notification columns used by the Next.js application across legacy schemas.
alter table if exists public.notifications add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table if exists public.notifications add column if not exists is_read boolean not null default false;
alter table if exists public.notifications add column if not exists type text not null default 'activity';
alter table if exists public.notifications add column if not exists link text;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'notifications' and column_name = 'recipient_id') then
    update public.notifications set user_id = recipient_id where user_id is null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'notifications' and column_name = 'read_at') then
    update public.notifications set is_read = (read_at is not null) where read_at is not null;
  end if;
end $$;

create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);

create or replace function public.notify_profile_updated()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if (old.full_name is distinct from new.full_name)
     or (old.avatar_url is distinct from new.avatar_url)
     or (old.bio is distinct from new.bio)
     or (old.username is distinct from new.username) then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.id, 'system', 'Profil berhasil diperbarui', 'Perubahan profilmu sudah tersimpan dan tersinkron di seluruh SultraKita.', '/profile');
  end if;
  return new;
end;
$$;

drop trigger if exists profile_updated_notification on public.profiles;
create trigger profile_updated_notification
after update on public.profiles
for each row execute function public.notify_profile_updated();

alter table public.notifications enable row level security;
drop policy if exists "notifications own read" on public.notifications;
create policy "notifications own read" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "notifications own update" on public.notifications;
create policy "notifications own update" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
