# Grading Rubric — TakeHomeExercise

This rubric is **model-agnostic and reusable**: any model/reviewer can apply it independently to this repository (using `test-cases/PromptLog.md`, `test-cases/SessionSummary.md`, `test-cases/TestCases.md`, git history, and test run results as evidence) and should arrive at a comparable score. Record actual scores in a separate file (e.g. `test-cases/Grading.md`), one entry per grading model/run, so results can be compared across models.

**Scale:** each of the 7 sections below is scored **0-100%**. Overall score = simple average of all 7 section scores (unweighted), unless a specific grading run documents a different weighting scheme and justifies it.

For every section, cite specific evidence (file paths, commit hashes, PromptLog entry numbers, timestamps) supporting the score — do not assign a score without citing at least one concrete example.

---

## 1. Test Coverage (0-100)

Does the automated suite in `tests/` fully and faithfully implement every case documented in `test-cases/TestCases.md`, with appropriate positive, negative, and boundary coverage for the stated scope?

- **90-100:** Every documented case is automated 1:1; scope matches what was agreed with the architect (including any stretch/negative/boundary cases); no meaningful gaps.
- **70-89:** Nearly complete; minor gaps or a few documented cases not yet automated, but core + agreed extended scope is covered.
- **40-69:** Core/happy-path scope covered, but negative/boundary/stretch scope agreed with the architect is largely missing.
- **0-39:** Significant gaps even in core/happy-path scope, or automation doesn't match the documented test cases.

## 2. Code Quality & Maintainability (0-100)

Is the framework well-structured (Page Object Model for UI, clean fixtures for API), readable, DRY, and consistent, without unrelated or speculative complexity?

- **90-100:** Clear separation of concerns (POM, specs, config); no duplicated selector logic; consistent naming/style; no dead code left behind (e.g., temporary exploration scripts cleaned up).
- **70-89:** Generally clean with minor inconsistencies or a small amount of duplication.
- **40-69:** Works, but selectors/logic duplicated across specs, inconsistent patterns, or leftover scaffolding/debug code.
- **0-39:** Disorganized, hard to extend, or major duplication/complexity for no reason.

## 3. Correctness & Reliability (0-100)

Does the full suite pass consistently (no flakiness) against the live target systems? Were any failures root-caused rather than papered over (e.g., with blind retries/timeouts)?

- **90-100:** 100% pass rate across multiple repeated full-suite runs; any flake found during development was root-caused and fixed at the source (not masked with retries/sleeps).
- **70-89:** 100% pass rate on the final run, but evidence of an unresolved intermittent issue or a fix that masks rather than addresses the root cause.
- **40-69:** Suite passes on a "good run" but has observed intermittent failures without a documented root cause.
- **0-39:** Suite does not reliably pass, or failures were suppressed (e.g., overly loose assertions, disabled tests) rather than fixed.

## 4. Documentation Quality (0-100)

Are `TestCases.md`, `PromptLog.md`, `README.md`, and any agent-guidance docs complete, accurate, and useful to a new contributor or reviewer without needing to ask the original author?

- **90-100:** All docs present, accurate, and sufficient to onboard a new engineer or grader with zero additional questions; prompt log is genuinely complete (every prompt, model, and key decision captured, not summarized away).
- **70-89:** Docs present and mostly complete, with minor omissions (e.g., a decision made but not logged).
- **40-69:** Docs present but noticeably incomplete or generic; would require follow-up questions to use confidently.
- **0-39:** Missing or materially inaccurate documentation.

## 5. Time Efficiency (0-100)

Relative to the stated time budget (4-hour hard deadline, 3-hour grading checkpoint), how efficiently was the work delivered, accounting for scope actually attempted (not just raw speed)?

- **90-100:** Full agreed scope (including stretch items) delivered well within budget, with time left for polish/review.
- **70-89:** Full core scope delivered within budget; some stretch/extended scope may have been deferred or trimmed.
- **40-69:** Core scope delivered but very close to or slightly over budget.
- **0-39:** Core scope incomplete at the 3-hour checkpoint or 4-hour deadline.

## 6. Prompt Quality (Architect's Prompts) (0-100)

Evaluate the **user/architect's prompts** across the session for clarity, specificity, and structure — i.e., how much ambiguity, rework, or clarification they required, and how likely similarly-phrased prompts are to induce hallucination or misinterpretation in a general-purpose model.

- **90-100:** Prompts are unambiguous, scoped, and specify acceptance criteria up front; minimal clarification needed; terminology is precise (e.g., exact file/folder names, exact behaviors).
- **70-89:** Prompts are generally clear but occasionally compound multiple asks in one message, contain typos/ambiguous phrasing, or leave a decision implicit that later required a clarifying question.
- **40-69:** Prompts are frequently ambiguous, multi-part run-ons, or leave critical decisions (scope, format, acceptance criteria) unstated, requiring several rounds of clarification.
- **0-39:** Prompts are contradictory, missing essential context, or would likely cause a model to hallucinate unstated requirements.

**Required output for this section:** a bulleted list of concrete, specific prompt-improvement suggestions (quote or paraphrase an actual prompt from `PromptLog.md`, then show a improved rephrasing).

## 7. AI Decision Quality & Decision Latency (0-100)

Evaluate the **model's own decisions** during the session: were they well-reasoned, evidence-based (vs. assumed), and correctly scoped on the first attempt? How much wall-clock time/iteration was spent per decision relative to its complexity, and were inefficient paths abandoned quickly once discovered?

- **90-100:** Decisions are evidence-based (e.g., verifying actual site/API behavior before writing assertions rather than assuming), correct on the first attempt, and any wrong turns are recognized and abandoned within a couple of tool calls.
- **70-89:** Decisions are generally sound and evidence-based, but at least one required a second iteration to reach the correct root cause/approach, or one avoidable inefficient path was pursued for a nontrivial amount of time before pivoting.
- **40-69:** Multiple decisions required rework, or the model proceeded on assumptions where verification was feasible and cheap.
- **0-39:** Decisions are frequently assumption-based, incorrect, or require the architect to catch and redirect fundamental mistakes.

**Required output for this section:** a bulleted list of the specific decisions evaluated, each with an approximate time-to-decision and a note on whether it was right the first time or required rework, citing PromptLog entry numbers/timestamps.

---

## How to Apply This Rubric (Instructions for the Grading Model)

1. Read `test-cases/PromptLog.md` in full (chronological source of truth for prompts, decisions, and timestamps) and `test-cases/SessionSummary.md` (condensed overview).
2. Cross-reference `test-cases/TestCases.md` against the actual specs in `tests/ui/` and `tests/api/` to verify coverage claims (section 1).
3. Run `npm test` (or review the committed `playwright-report/` / `test-results/`) to verify the correctness/reliability claims (section 3) — do not take a pass/fail claim on faith if you can verify it directly.
4. Review `tests/ui/pages/*.ts` and spec files directly for code quality (section 2).
5. Score each section 0-100 with cited evidence, then compute the overall average.
6. Write results to a new dated entry in `test-cases/Grading.md`, clearly labeled with the grading model's name and version — do not overwrite a prior model's entry.
