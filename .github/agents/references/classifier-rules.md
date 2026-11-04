# Classifier rules — shared reference for pr-comment-classifier agents

This file is the single source of truth for classification logic. Both
`pr-comment-classifier-claude` and `pr-comment-classifier-codex` must read this
file at the start of every run and apply these rules exactly.

## Input format

Each thread in the thread list payload has this shape:

```json
{
  "thread_node_id": "<GraphQL id (the `id` field from reviewThreads)",
  "is_resolved": true | false,
  "comment_bodies": ["<first comment body>", "<reply 1 body>", "..."],
  "path": "<file path>",
  "line": 42
}
```

`comment_bodies[0]` is always the original review comment. Subsequent entries are
replies. Read the full thread to understand the context and any developer responses.

## Your task

For each thread, examine the first comment body and compare it against the unified
diff to determine one of the three verdicts below.

## Verdict definitions

| Verdict        | Meaning                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fixed`        | The diff clearly addresses the concern raised (the problem code is gone or corrected).                                                                                                      |
| `not_fixed`    | The concern is still present; the problematic code or pattern remains in the diff.                                                                                                          |
| `not_relevant` | The comment itself is not a valid improvement: it is factually incorrect, conflicts with project conventions in `.github/copilot-instructions.md`, or is based on a misreading of the code. |

## Classification rules

- Base your classification solely on what is visible in the diff and the comment body.
- When in doubt between `fixed` and `not_fixed`, choose `not_fixed` (conservative).
- Only choose `not_relevant` when you are confident the comment itself is wrong or
  misguided — not merely because the code hasn't changed.
- `not_fixed` takes priority over `not_relevant` if the issue described would be a
  genuine improvement.

### Holistic / structural concerns

Some review comments are about the **overall state** of a file rather than a
specific line — e.g. "page lacks semantic landmark structure", "no CSS Modules
used", "class component instead of functional", "state mutated directly". For
these, the diff alone is insufficient: it only shows what changed, not the full
resulting file.

**When the concern is holistic** (identifiable by language like "lacks",
"missing", "no X used", "should use X throughout", or a reference to
page/component structure rather than a single expression), **fetch the current
file content** from the PR head before deciding:

```bash
gh api /repos/{owner}/{repo}/contents/{path}?ref={head_sha} | cat
```

Decode the `content` field (base64) and evaluate the concern against the full
current file. A `fixed` verdict is appropriate if the current file satisfies the
concern — even if the diff hunks don't make it obvious.

### File not present in the diff

Before classifying, check whether the thread's `path` appears as a changed file
in the unified diff (i.e. look for `diff --git a/{path}` in the diff text).

- **If the file is absent from the diff**, you cannot conclude `not_fixed` from
  the absence of changes alone. Absence of a file in the diff means the PR did
  not touch it — not that the concern is unaddressed.
  - First check whether the concern could have been addressed through changes in
    _other_ files visible in the diff. If so, classify based on those.
  - If the concern is strictly about the absent file and nothing else in the diff
    addresses it, classify as `not_relevant` — a review comment anchored to a
    file that is not part of this PR cannot meaningfully be `not_fixed`.
  - **Do NOT classify as `not_fixed` purely because the file has no diff entry.**
    A `not_fixed` verdict requires you to point to a specific location in the
    diff where the problem visibly persists.

## Output format

Return a single JSON object with no additional text. Use your own model name as
the `"classifier"` value and label every `"reasoning"` value with your model
name in brackets at the start:

```json
{
  "classifier": "<your model name>",
  "classifications": [
    {
      "thread_node_id": "<thread_node_id from input>",
      "verdict": "fixed" | "partially_fixed" | "not_fixed" | "not_relevant",
      "reasoning": "[<your model name>] <one sentence explaining the verdict>"
    }
  ]
}
```

## General rules

- Include one entry per thread in the input — do not skip any threads.
- Use exactly the `thread_node_id` values provided — do not fabricate IDs.
