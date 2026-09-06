import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// The public shell can build and render in demo mode before Supabase is configured.
// When configured, createBrowserClient persists the session in cookies compatible
// with the Next.js middleware/server client instead of localStorage-only storage.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;
