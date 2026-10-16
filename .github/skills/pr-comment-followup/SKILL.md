---
name: pr-comment-followup
description: Follows up on existing review comments for one or more pull requests. Uses two AI classifier sub-agents (Claude Sonnet 4.6 and GPT-5.3-Codex) to independently classify each review thread, merges their verdicts with conservative tie-breaking, then acts — replies and resolves if fixed; unresolves and requests action if not fixed but already resolved; reacts with 👎 and resolves with explanation if the comment is no longer applicable. Use this skill when asked to follow up on PR comments, check if review comments were addressed, or triage review threads.
---

For each PR number provided, fetch all review threads and the current diff, run two classifier sub-agents in parallel to agree on each thread's status, merge their verdicts, then act once per thread.

> **SEQUENTIAL PROCESSING REQUIRED:** Process PRs **one at a time, strictly in order**. Do **not** start any work on PR N+1 until all steps (1–5) for PR N are fully complete and confirmed. This prevents race conditions and mixed-up comments across PRs.

## Important constraints

- **Do NOT use `gh pr checkout` or `git checkout`.** All PR data is fetched via the GitHub API only.
- **Do NOT create any files** in the repository.
- **Do NOT use any persistent todo store.** Track progress in memory only.
- **Do NOT stash or modify the working tree.**
- **Do NOT analyze, interpret, or classify thread content in the orchestrator.** Step 1 is mechanical data collection only — fetch raw data and pass it verbatim to the classifier sub-agents. Any reasoning about what the diff means, what threads are about, or what verdict is likely must happen exclusively inside the classifier sub-agents, never in the orchestrator. If you notice yourself writing observations like "these comments are about JavaScript that was removed" — stop. That is the classifiers' job.

## Input

You will receive a list of PR numbers. Examples:

- `Follow up on PR 5`
- `Check review comments on PRs 3, 7 and 12`
- `Triage review threads for pull requests 1, 2, 3`

Parse all PR numbers from the user's message. Build an ordered list and process them **one by one** — fully complete the entire pipeline for the first PR before touching the second, and so on.

## One-time setup (run once before processing any PRs)

Discover `owner` and `repo`:

```bash
git remote get-url origin
```

Fetch latest refs:

```bash
git fetch origin
```

## Process per PR

> **Strict sequencing rule:** Complete **all five steps** (fetch → classify → merge → act → verify) for the current PR before starting Step 1 of the next PR. Never interleave work across PRs.

### Step 1 — Fetch PR metadata, diff, and review threads

> **Orchestrator discipline:** Collect and store the raw data below. Do not interpret it. After Step 1 your only allowed output is a short status line such as: `Fetched PR {pr_number}: {title}. {N} review threads found. Running classifiers.`

Run in parallel (pipe all commands through `| cat` to suppress pager output):

```bash
gh api /repos/{owner}/{repo}/pulls/{pr_number} | cat
gh api /repos/{owner}/{repo}/pulls/{pr_number} --header "Accept: application/vnd.github.v3.diff" | cat
```

Then fetch all review threads via GraphQL (use `--paginate` to handle PRs with many threads):

```bash
gh api graphql --paginate -f query='
  query($owner: String!, $repo: String!, $number: Int!, $endCursor: String) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        reviewThreads(first: 100, after: $endCursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            isResolved
            comments(first: 20) {
              nodes {
                databaseId
                body
                path
                line
                author { login }
                createdAt
              }
            }
          }
        }
      }
    }
  }
' -f owner="{owner}" -f repo="{repo}" -F number={pr_number} | cat
```

Record: `head_sha`, unified diff text, and the full list of review threads (each with its GraphQL `id`, `isResolved` flag, and all comment bodies).

Discard threads that have zero comments. If there are no review threads, skip to the final report for this PR.

**Forgot-to-push flag:** For each thread that is **not resolved** (`isResolved: false`), scan all replies (comments after the first) for messages from the PR author that contain any of the following words or phrases (case-insensitive):

```
fixed, fix, done, готово, зроблено, виправив, виправила, виправлено, зробив, зробила, вже, already, changed, updated, added, pushed
```

If at least one such reply exists, set `author_claims_fixed: true` for that thread. Otherwise set `author_claims_fixed: false`. Store this flag alongside each thread.

### Step 2 — Run both classifier sub-agents in parallel

**Wait for Step 1 to finish, then invoke both sub-agents simultaneously — do NOT wait for one before starting the other.**

Pass the same inputs to both:

- PR number
- `head_sha` (from Step 1 PR metadata — needed to fetch file content at the PR head)
- The full unified diff text (raw, unprocessed)
- The full thread list: each thread's `id`, `isResolved`, all comment bodies, `path`, `line`
- `owner` and `repo`

The sub-agents are responsible for all code analysis and classification — the orchestrator only forwards the raw data. Do **not** pre-screen, filter, or hint at likely verdicts in the prompt you send to the classifiers. Pass the diff and thread list as-is.

Invoke in parallel:

- `pr-comment-classifier-claude`
- `pr-comment-classifier-codex`

**Wait for BOTH sub-agents to return their full JSON responses before proceeding to Step 3.**

### Step 3 — Merge verdicts

Read `.github/skills/pr-comment-followup/merge-rules.md` now and apply it exactly. That file is the single source of truth — do not use any other logic.

Whenever the two sub-agents return **different** verdicts, append `_(disagreement)_` to the merged verdict in the final report.

### Step 4 — Act on each thread

For each thread, take exactly one action based on the merged verdict:

#### Merged verdict: `FIXED`

Post a reply on the thread's first comment, then resolve the thread.

**Reply body:**

```
✅ **[AI Generated] Addressed** — The concern raised in this comment appears to have been resolved in the latest changes. Resolving this thread.
```

Resolve via GraphQL:

```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -f threadId="{thread.id}"
```

Post reply via REST:

```bash
gh api \
  --method POST \
  /repos/{owner}/{repo}/pulls/{pr_number}/comments/{first_comment_database_id}/replies \
  -f body="✅ **[AI Generated] Addressed** — The concern raised in this comment appears to have been resolved in the latest changes. Resolving this thread."
```

#### Merged verdict: `NOT_FIXED`

If the thread is **already resolved** (`isResolved: true`): unresolve it first, then post a reply requesting action.

Unresolve via GraphQL:

```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    unresolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -f threadId="{thread.id}"
```

If the thread is **not resolved and `author_claims_fixed` is `true`**: the student replied claiming the fix is done but the diff does not confirm it — they likely forgot to commit or push. Post this reply:

```
⚠️ **[AI Generated] Looks like the fix wasn't pushed** — You mentioned this was addressed, but the current diff doesn't reflect the change yet. Please make sure you've committed and pushed your latest changes, then re-request a review.
```

If the thread is **not resolved and `author_claims_fixed` is `false`**: post a standard reply only (no resolve/unresolve).

**Reply body:**

```
🔁 **[AI Generated] Still open** — This concern does not appear to have been addressed yet. Please revisit the original comment and update the code accordingly before requesting re-review.
```

#### Merged verdict: `PARTIALLY_FIXED`

Leave the thread in its current resolved/unresolved state — **do not resolve or unresolve**. Post a reply flagging the partial progress and inviting discussion.

**Reply body:**

```
🔶 **[AI Generated] Partially addressed** — The AI reviewers disagree on whether this concern has been fully resolved. Some progress is visible, but it may not be complete. Please review the original comment and confirm whether the fix covers all cases. A human reviewer should make the final call on this thread.
```

Post reply via REST:

```bash
gh api \
  --method POST \
  /repos/{owner}/{repo}/pulls/{pr_number}/comments/{first_comment_database_id}/replies \
  -f body="🔶 **[AI Generated] Partially addressed** — The AI reviewers disagree on whether this concern has been fully resolved. Some progress is visible, but it may not be complete. Please review the original comment and confirm whether the fix covers all cases. A human reviewer should make the final call on this thread."
```

#### Merged verdict: `NOT_APPLICABLE`

Add a 👎 reaction to the first comment:

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/{owner}/{repo}/pulls/comments/{first_comment_database_id}/reactions \
  -f content="-1"
```

Post a reply explaining why the comment **itself is not a valid improvement**. Use the `reasoning` from the sub-agent responses and the guidance in `.github/skills/pr-comment-followup/not-relevant-guidance.md`.

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/{owner}/{repo}/pulls/{pr_number}/comments/{first_comment_database_id}/replies \
  -f body="👎 **Not applicable.** <INSERT SPECIFIC REASON — explaining why the comment itself is incorrect or not a genuine improvement.> Resolving this thread. _[AI-generated]_"
```

Then resolve the thread:

```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: { threadId: "{thread_node_id}" }) {
    thread { id isResolved }
  }
}'
```

---

#### Case D — `not_fixed` AND `is_resolved: false` (still open)

No action needed — the thread correctly reflects the open state. Record it as **skipped**.

---

### Step 5 — Verify actions

After processing all threads for the PR, fetch the updated thread list to confirm resolved states match expectations:

```bash
gh api graphql -f query='
query {
  repository(owner: "{owner}", name: "{repo}") {
    pullRequest(number: {pr_number}) {
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
        }
      }
    }
  }
}'
```

Log any discrepancy (e.g. a thread that should be resolved but is not) and note it in the final report.

---

## Final report

After all PRs have been processed, report a summary block for each PR. Use one block per thread, followed by a totals line:

```
### PR #{pr_number} — {title}

Thread 1 — "Use CELL_STATE enum instead of raw strings..."
  Claude: fixed  ·  Codex: fixed  →  **fixed**
  ✅ Replied + resolved

Thread 2 — "Missing return statement in revealCell"
  Claude: not_fixed  ·  Codex: not_fixed  →  **not_fixed**
  ⚠️ Unresolved + commented

Thread 2b — "Single-letter variable 'i' in loop" [author claimed fixed]
  Claude: not_fixed  ·  Codex: not_fixed  →  **not_fixed** _(forgot to push?)_
  ⚠️ Warned about missing push

Thread 3 — "Outdated concern about variable naming"
  Claude: not_relevant  ·  Codex: not_relevant  →  **not_relevant**
  👎 Dismissed + resolved

Thread 4 — "Single-letter variable 'r' used in loop"
  Claude: not_fixed  ·  Codex: fixed  →  **partially_fixed** _(disagreement)_
  🔶 Partial — commented, left open for discussion

**Totals:** {fixed} fixed · {partially_fixed} partial · {not_fixed_reopened} re-opened · {not_relevant} dismissed · {skipped} skipped
```

Append `_(disagreement)_` to the merged verdict line whenever Claude and Codex produced different verdicts.
