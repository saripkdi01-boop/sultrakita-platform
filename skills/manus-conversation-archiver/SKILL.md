---
name: manus-conversation-archiver
description: Export and version the complete message history of an accessible Manus conversation to a Git repository without inventing missing messages. Use when the user asks to record, archive, back up, audit, or synchronize Manus AI chat conversations, including ongoing conversations.
---

# Manus Conversation Archiver

Archive conversation messages exactly as returned by an authorized Manus API or from a transcript explicitly supplied by the user. Preserve message order, timestamps, roles, content, attachments metadata, status events, and export metadata. Never claim to have captured messages that are outside the authorized task scope or unavailable to the current session.

## Access boundary

The Manus API can read the default IM agent history with `task_id=agent-default-main_task`, or a specific task when the credential is authorized for it. An Open App with `create_task` scope can only read tasks created by that app; broader history requires appropriate authorization. The skill cannot access hidden system context, deleted messages, other users' conversations, or an account-wide history unless the API explicitly returns them.

Before exporting, state the scope in the archive metadata:

- `source`: `manus-api`, `user-supplied-transcript`, or another explicit source.
- `task_id`: exact task identifier, if applicable.
- `coverage`: `complete-for-returned-scope` or `partial`.
- `limitations`: concrete missing-access or pagination limitations.

If the user asks for "everything from the beginning" but no authorized task history is available, ask them to provide the transcript or API authorization. Do not silently substitute the current context or a summary.

## Standard workflow

1. Determine the source and authorization. Prefer the Manus API for an accessible task; use a user-supplied transcript when API access is unavailable.
2. Export raw JSON first using `scripts/export_manus_conversation.py`. The script follows pagination, preserves returned events, writes atomically, and does not redact or summarize content.
3. Write a human-readable Markdown rendering only as a view of the raw export. Treat the JSON as canonical; do not edit it manually.
4. Record an export manifest with UTC timestamp, task ID, source, API endpoint, event count, and coverage status. Never store API keys or access tokens.
5. Review the diff for accidental secrets, unrelated files, or truncated content. Do not commit credentials, `.env` files, cookies, browser profiles, or private keys.
6. Commit and push only the archive files and this skill. A push is a repository change; broad publication of sensitive conversation content requires the user's authorization.

## Repository layout

```text
conversation-archives/
  <task-id>/
    conversation.json        # canonical lossless API response/events
    conversation.md          # readable rendering, if requested
    manifest.json             # provenance and coverage
skills/manus-conversation-archiver/
  SKILL.md
  scripts/export_manus_conversation.py
```

Use a stable task ID in paths and do not use user names or secrets in filenames.

## API mode

Set `MANUS_API_KEY` in the environment without placing it in files, then run:

```bash
python3 scripts/export_manus_conversation.py \
  --task-id agent-default-main_task \
  --output conversation-archives/agent-default-main_task/conversation.json
```

The exporter calls `GET https://api.manus.ai/v2/task.listMessages` with `x-manus-api-key`. Use `--base-url` only for an explicitly trusted compatible endpoint. The script accepts common paginated response shapes and keeps each returned page/event in the raw output. If the server returns an authorization or pagination error, stop and report the exact limitation instead of fabricating completeness.

For a user-supplied transcript, save the original text unchanged as `source-transcript.txt`, mark `source` as `user-supplied-transcript`, and set `coverage` to `complete-for-supplied-transcript`; do not label it as account-wide history.

## Validation checklist

- Confirm the raw JSON parses and contains the exact event/message count returned by the API.
- Confirm the first and last message/event identifiers or timestamps are present when supplied by the API.
- Confirm no API key, token, cookie, or secret appears in tracked files.
- Confirm the Markdown view is generated from raw JSON and is not used as the source of truth.
- Report inaccessible ranges, deleted messages, pagination failures, or unknown coverage explicitly.

## Important honesty rule

"Without anything missing" means lossless preservation of everything returned within the authorized source scope. It does not mean access to conversations the API or user did not provide. Always distinguish **lossless** from **complete** and include that distinction in the manifest and final report.
