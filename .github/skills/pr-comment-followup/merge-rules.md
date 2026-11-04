# Verdict merge rules for pr-comment-followup

Each classifier sub-agent returns one of four verdicts per thread:

- `fixed` — the diff clearly and fully addresses the concern raised
- `partially_fixed` — the concern was addressed in some places but not all, or only part of the issue was resolved
- `not_fixed` — the concern is still present; the problematic code or pattern remains
- `not_relevant` — the comment itself is not a valid improvement (incorrect advice, misunderstanding, etc.)

## Tie-breaking table

Apply the following rules to merge the two verdicts (Claude and Codex) into a single merged verdict.

| Claude verdict    | Codex verdict     | Merged verdict    | Note                                     |
| ----------------- | ----------------- | ----------------- | ---------------------------------------- |
| `fixed`           | `fixed`           | `fixed`           | Both agree — fix confirmed               |
| `not_fixed`       | `not_fixed`       | `not_fixed`       | Both agree — still open                  |
| `not_relevant`    | `not_relevant`    | `not_relevant`    | Both agree — dismiss                     |
| `partially_fixed` | `partially_fixed` | `partially_fixed` | Both agree — partial progress            |
| `fixed`           | `not_fixed`       | `partially_fixed` | Hard disagreement — flag for discussion  |
| `not_fixed`       | `fixed`           | `partially_fixed` | Hard disagreement — flag for discussion  |
| `fixed`           | `partially_fixed` | `fixed`           | One confirmed fully fixed — escalate     |
| `partially_fixed` | `fixed`           | `fixed`           | One confirmed fully fixed — escalate     |
| `not_fixed`       | `partially_fixed` | `partially_fixed` | Partial progress acknowledged            |
| `partially_fixed` | `not_fixed`       | `partially_fixed` | Partial progress acknowledged            |
| `fixed`           | `not_relevant`    | `fixed`           | One model confirmed fix — treat as fixed |
| `not_relevant`    | `fixed`           | `fixed`           | One model confirmed fix — treat as fixed |
| `not_fixed`       | `not_relevant`    | `not_fixed`       | `not_fixed` beats `not_relevant`         |
| `not_relevant`    | `not_fixed`       | `not_fixed`       | `not_fixed` beats `not_relevant`         |
| `partially_fixed` | `not_relevant`    | `partially_fixed` | Partial progress beats dismissal         |
| `not_relevant`    | `partially_fixed` | `partially_fixed` | Partial progress beats dismissal         |

## Priority order (highest to lowest)

1. `fixed` — both agree it is fully addressed, or one confirms while the other says partial
2. `partially_fixed` — models disagree (`fixed` vs `not_fixed`), or at least one sees partial progress
3. `not_fixed` — wins over `not_relevant`; a concern that might still be open must stay open
4. `not_relevant` — only when both models agree no fix was needed

## Disagreement flag

Whenever the two sub-agents return different verdicts, append `_(disagreement)_` to the merged verdict in the final report. Do not change the merged verdict — only annotate it.
