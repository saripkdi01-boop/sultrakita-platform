const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const actionModule = await import('../next-app/lib/actions/ai-listing.ts');
  const generateListingFromImage = actionModule.generateListingFromImage ?? actionModule.default?.generateListingFromImage;
  if (typeof generateListingFromImage !== 'function') throw new Error('Could not load generateListingFromImage from the server action.');
  const createPage = fs.readFileSync(path.join(process.cwd(), 'next-app/app/properti/create/page.tsx'), 'utf8');
  const assistant = fs.readFileSync(path.join(process.cwd(), 'next-app/components/marketplace/AiListingAssistant.tsx'), 'utf8');
  const feedbackAction = fs.readFileSync(path.join(process.cwd(), 'next-app/lib/actions/ai-listing-feedback.ts'), 'utf8');
  const feedbackMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260907000000_ai_listing_feedback.sql'), 'utf8');

  const originalKey = process.env.GEMINI_API_KEY;
  const originalInfo = console.info;
  const telemetryLines = [];
  console.info = (...args) => telemetryLines.push(args.join(' '));
  try {
    delete process.env.GEMINI_API_KEY;
    const noKey = await generateListingFromImage({ base64: 'data:image/jpeg;base64,AA==' });
    assert.equal(noKey.ok, false);
    assert.match(noKey.error, /manual/i);
    assert.match(telemetryLines.at(-1), /"event":"ai_listing_generation"/);
    assert.match(telemetryLines.at(-1), /"reason":"configuration"/);
    assert.doesNotMatch(telemetryLines.at(-1), /data:image|AA==|api[_ -]?key|seller|prompt|response/i);

    process.env.GEMINI_API_KEY = 'test-only-key';
    const invalidMime = await generateListingFromImage({
      base64: 'data:image/gif;base64,AA==',
      mimeType: 'image/gif',
    });
    assert.equal(invalidMime.ok, false);
    assert.match(invalidMime.error, /Format foto/i);

    const oversized = Buffer.alloc(8 * 1024 * 1024 + 1).toString('base64');
    const tooLarge = await generateListingFromImage({
      base64: `data:image/jpeg;base64,${oversized}`,
      mimeType: 'image/jpeg',
    });
    assert.equal(tooLarge.ok, false);
    assert.match(tooLarge.error, /8 MB/i);
    assert.match(telemetryLines.at(-1), /"reason":"unsupported_image"/);

    assert.match(createPage, /<AiListingAssistant file=\{photo\}/);
    assert.match(createPage, /result\.category === 'Properti'/);
    assert.match(assistant, /aria-busy=\{loading\}/);
    assert.match(assistant, /role=\{generated \? 'status' : 'alert'\}/);
    assert.match(assistant, /submitAiListingFeedback/);
    assert.match(assistant, /Apakah draft AI membantu/);
    assert.match(feedbackAction, /export async function submitAiListingFeedback/);
    assert.doesNotMatch(feedbackAction, /base64|prompt|response|imageUrl|api[_ -]?key/i);
    assert.match(feedbackMigration, /seller_id uuid not null references auth\.users/);
    assert.match(feedbackMigration, /corrected_fields text\[\]/);
    assert.match(feedbackMigration, /enable row level security/);
    assert.match(feedbackMigration, /auth\.uid\(\) = seller_id/);
    console.log('AI listing regression checks passed.');
  } finally {
    console.info = originalInfo;
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
