# Reviewer rules — shared reference for pr-reviewer agents

This file is the single source of truth for review logic. Both
`pr-reviewer-claude` and `pr-reviewer-codex` must read this file at the start
of every run and apply these rules exactly.

## Your task

Analyse the provided diff strictly against the conventions in
`.github/copilot-instructions.md` and the lab rules in
`.github/prompts/review-pr.prompt.md`.

## Output format

Return a structured JSON object. Do **not** post anything to GitHub — the
orchestrator handles posting.

```json
{
  "reviewer": "<your model name>",
  "event": "REQUEST_CHANGES" | "COMMENT" | "APPROVE",
  "summary": "<one paragraph overview>",
  "issues": [
    {
      "severity": "critical" | "high" | "medium",
      "title": "<short title>",
      "description": "<one paragraph>",
      "path": "<file path as in diff>",
      "line": <line number in new file>,
      "fix": "<corrected snippet or null>"
    }
  ]
}
```

## Rules

- Label every issue `"description"` value with your model name in brackets at
  the start, e.g. `[Claude Sonnet 4.6] …` or `[GPT-5.3-Codex] …`.
- Follow the tone guidelines in `.github/prompts/review-pr.prompt.md` (friendly
  teacher, direct on violations, warm on suggestions).
- Only report genuinely impactful findings — bugs, violations, logic errors,
  accessibility failures.
- Do not invent issues that are not clearly visible in the diff.
- Set `event` to `REQUEST_CHANGES` if any critical or high issues exist,
  `COMMENT` for medium only, `APPROVE` if everything is clean.
