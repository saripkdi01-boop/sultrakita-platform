const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'supabase', 'migrations', '20260913060000_suki_community_interactions.sql');
const sql = fs.readFileSync(file, 'utf8').toLowerCase();
const required = [
  'create table if not exists public.group_post_comments',
  'create table if not exists public.group_post_reactions',
  'references public.groups(id)',
  'references public.group_posts(id)',
  'char_length(trim(body)) between 1 and 1000',
  "reaction_type in ('like','support','insight')",
  'alter table public.group_post_comments enable row level security',
  'alter table public.group_post_reactions enable row level security',
  'auth.uid() = author_id',
  'auth.uid() = user_id',
  'alter publication supabase_realtime add table public.group_post_comments',
  'alter publication supabase_realtime add table public.group_post_reactions',
];
const missing = required.filter((entry) => !sql.includes(entry));
if (missing.length) {
  console.error(`Community migration contract failed; missing: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`Community migration contract passed (${required.length} assertions).`);
