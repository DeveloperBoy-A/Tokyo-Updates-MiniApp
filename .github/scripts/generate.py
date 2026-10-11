#!/usr/bin/env python3
"""Generate the MDX blog post specified in prompt.txt using the OpenAI API."""
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROMPT_PATH = ROOT / "prompt.txt"
OUTPUT_PATH = ROOT / "content" / "blog" / "best-action-2025.mdx"
API_URL = "https://api.openai.com/v1/chat/completions"


def main() -> int:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("ERROR: OPENAI_API_KEY secret is not configured.", file=sys.stderr)
        return 1
    if not PROMPT_PATH.is_file():
        print(f"ERROR: Prompt file not found: {PROMPT_PATH}", file=sys.stderr)
        return 1

    payload = {
        "model": os.environ.get("OPENAI_MODEL", "").strip() or "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": (
                    "Write concise, accurate, spoiler-free movie discovery posts. "
                    "Return only the requested file content. Do not invent facts."
                ),
            },
            {"role": "user", "content": PROMPT_PATH.read_text(encoding="utf-8").strip()},
        ],
        "temperature": 0.7,
    }
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        print(f"OpenAI API HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"Generation failed: {exc}", file=sys.stderr)
        return 1

    try:
        content = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError):
        print("ERROR: API response did not contain generated content.", file=sys.stderr)
        return 1

    content = re.sub(r"^\s*```(?:mdx|markdown|md)?\s*\n", "", content, flags=re.I)
    content = re.sub(r"\n```\s*$", "", content).strip() + "\n"
    if not content.startswith("---"):
        print("ERROR: Generated MDX must start with YAML frontmatter.", file=sys.stderr)
        return 1
    for field in ("title", "date", "excerpt"):
        if not re.search(rf"(?m)^{field}:\s*.+$", content):
            print(f"ERROR: Generated MDX frontmatter is missing {field}.", file=sys.stderr)
            return 1

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(content, encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)} ({len(content)} characters).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
