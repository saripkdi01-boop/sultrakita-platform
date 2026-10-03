-- PAKET UPGRADE ADMIN v2 (2026-10-03)
-- Menjadikan sukidev01@gmail.com sebagai administrator penuh (super_admin).
--
-- CARA PAKAI: jalankan di Supabase Dashboard → SQL Editor (butuh hak DDL/DML
-- dashboard; anon-key TIDAK bisa). Idempoten — aman dijalankan ulang.
-- Setelah login pertama via Google, baris profiles otomatis dibuat oleh trigger
-- handle_new_user(); blok di bawah akan meng-upgrade role-nya ke super_admin.
--
-- Verifikasi sesudahnya:
--   select id, role from public.profiles
--   where id = (select id from auth.users where email = 'sukidev01@gmail.com');

do $$
declare
  v_user_id uuid;
  v_email constant text := 'sukidev01@gmail.com';
begin
  select id into v_user_id from auth.users where email = v_email limit 1;

  if v_user_id is null then
    raise notice 'User % belum ada di auth.users — login dulu via Google di sukiapps.web.id, lalu jalankan lagi.', v_email;
    return;
  end if;

  insert into public.profiles (id, role, display_name, updated_at)
  values (v_user_id, 'super_admin', 'Sarip (Owner)', now())
  on conflict (id) do update set
    role = 'super_admin',
    updated_at = now();

  -- Jejak audit (best-effort; tabel audit_events hanya bisa ditulis service_role/
  -- dashboard — bila gagal, GRANT role di atas tetap berlaku).
  begin
    insert into public.audit_events (actor_id, action, target_type, target_id, reason, metadata)
    values (
      v_user_id,
      'admin.grant_super_admin',
      'profiles',
      v_user_id::text,
      'Owner ditetapkan sebagai administrator penuh (paket upgrade admin v2).',
      jsonb_build_object('email', v_email, 'granted_by', 'sql-editor', 'package', 'admin-upgrade-v2')
    );
  exception when others then
    raise notice 'Audit trail dilewati: %', sqlerrm;
  end;

  raise notice 'OK: % sekarang super_admin.', v_email;
end
$$;
