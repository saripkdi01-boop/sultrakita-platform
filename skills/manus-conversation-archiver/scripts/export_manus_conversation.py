#!/usr/bin/env python3
"""Lossless exporter for an authorized Manus task conversation."""
import argparse
import json
import os
import pathlib
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone


def fetch(url, api_key):
    request = urllib.request.Request(url, headers={"x-manus-api-key": api_key, "accept": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Manus API HTTP {exc.code}: {body[:1000]}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Manus API connection failed: {exc.reason}") from exc


def page_items(payload):
    if isinstance(payload, list):
        return payload, None
    if not isinstance(payload, dict):
        raise RuntimeError("Unexpected API response: expected object or array")
    for key in ("messages", "events", "data", "items", "results"):
        value = payload.get(key)
        if isinstance(value, list):
            return value, payload
    return [], payload


def next_cursor(payload):
    if not isinstance(payload, dict):
        return None
    for key in ("next_cursor", "nextCursor", "cursor"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value
    pagination = payload.get("pagination")
    if isinstance(pagination, dict):
        for key in ("next_cursor", "nextCursor", "cursor"):
            value = pagination.get(key)
            if isinstance(value, str) and value:
                return value
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--base-url", default="https://api.manus.ai")
    parser.add_argument("--max-pages", type=int, default=1000)
    args = parser.parse_args()
    api_key = os.environ.get("MANUS_API_KEY")
    if not api_key:
        raise SystemExit("MANUS_API_KEY is required and must be provided through the environment")
    if args.max_pages < 1:
        raise SystemExit("--max-pages must be positive")

    base = args.base_url.rstrip("/") + "/v2/task.listMessages"
    pages, cursor, seen = [], None, set()
    for index in range(args.max_pages):
        query = {"task_id": args.task_id}
        if cursor:
            query["cursor"] = cursor
        url = base + "?" + urllib.parse.urlencode(query)
        payload = fetch(url, api_key)
        items, _ = page_items(payload)
        pages.append({"request_url": url.split("?", 1)[0], "response": payload, "item_count": len(items)})
        new_cursor = next_cursor(payload)
        if not new_cursor:
            break
        if new_cursor in seen or new_cursor == cursor:
            raise RuntimeError("Pagination cursor repeated; refusing to claim complete export")
        seen.add(new_cursor)
        cursor = new_cursor
    else:
        raise RuntimeError(f"Pagination exceeded --max-pages={args.max_pages}; export is incomplete")

    all_items = []
    for page in pages:
        items, _ = page_items(page["response"])
        all_items.extend(items)
    output = pathlib.Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    document = {
        "format": "manus-conversation-archive/v1",
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "source": "manus-api",
        "endpoint": base,
        "task_id": args.task_id,
        "coverage": "complete-for-returned-scope",
        "limitations": [],
        "page_count": len(pages),
        "event_count": len(all_items),
        "pages": pages,
    }
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=output.parent, delete=False) as tmp:
        json.dump(document, tmp, ensure_ascii=False, indent=2)
        tmp.write("\n")
        temp_name = tmp.name
    os.replace(temp_name, output)
    print(json.dumps({"output": str(output), "pages": len(pages), "events": len(all_items), "coverage": document["coverage"]}))


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
