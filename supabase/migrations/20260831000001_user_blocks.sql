-- SultraKita blocking domain. Existing bigint users/custom auth model is preserved.
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  blocker_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_user_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason varchar(40) NOT NULL DEFAULT 'personal_choice',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_blocks_not_self CHECK (blocker_id <> blocked_user_id),
  CONSTRAINT user_blocks_reason_check CHECK (reason IN ('personal_choice','safety','spam','other')),
  CONSTRAINT user_blocks_pair_unique UNIQUE (blocker_id, blocked_user_id)
);
CREATE INDEX IF NOT EXISTS user_blocks_blocker_idx ON public.user_blocks(blocker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_blocks_blocked_idx ON public.user_blocks(blocked_user_id, created_at DESC);
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_blocks_no_client_access ON public.user_blocks;
CREATE POLICY user_blocks_no_client_access ON public.user_blocks FOR ALL USING (false) WITH CHECK (false);
