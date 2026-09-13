const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'next-app', 'lib', 'actions', 'groups.ts');
const source = fs.readFileSync(file, 'utf8');

const deletion = source.match(/export async function deleteGroupComment[\s\S]*?\n}\n/);
if (!deletion) {
  console.error('Community action contract failed; deleteGroupComment was not found.');
  process.exit(1);
}

const body = deletion[0];
const required = [
  ".delete().eq('id', commentId).eq('group_id', groupId)",
  'group_post_comments',
  'requireActiveGroupMember',
];
const missing = required.filter((entry) => !body.includes(entry));
if (missing.length) {
  console.error(`Community action contract failed; missing: ${missing.join(', ')}`);
  process.exit(1);
}

if (body.includes('.or(`author_id.eq.')) {
  console.error('Community action contract failed; deletion query broadens beyond the target comment.');
  process.exit(1);
}

console.log('Community action contract passed (scoped comment deletion).');

