# Session Summary — TakeHomeExercise

Companion document to `test-cases/PromptLog.md` (the full chronological prompt/decision log). This file is a condensed, reviewer-facing summary of what was delivered, intended to sit alongside the prompt log when grading this exercise.

## Timing

| Milestone | Timestamp | Elapsed from start |
|---|---|---|
| Timer start (prompt submitted) | 2026-09-14 23:10:39 -04:00 | 0:00 |
| Repo scaffolded, tooling installed | 2026-09-14 23:19 -04:00 | ~0:08 |
| `test-cases/TestCases.md` drafted (65 cases) | 2026-09-14 23:22 -04:00 | ~0:11 |
| All 34 UI tests implemented & passing | 2026-09-14 23:52 -04:00 | ~0:41 |
| All 31 API tests implemented & passing; flake found & fixed | 2026-09-15 00:00 -04:00 | ~0:49 |
| Repo authenticated & pushed to GitHub | 2026-09-15 00:07 -04:00 | ~0:57 |
| Stretch tests (9), README, agent docs, videos committed | 2026-09-15 00:27 -04:00 | ~1:17 |
| GradingRubric.md + Grading.md (self-assessment) committed | 2026-09-15 00:40 -04:00 | ~1:29 |
| Independent Opus 5 grading pass (Grading-Opus.md) committed | 2026-09-15 00:53 -04:00 | ~1:43 |
| **Session closeout — prompt logging stopped** | **2026-09-15 00:53:50 -04:00** | **1:43:11** |
| 3-hour grading checkpoint (if suite incomplete) | 2026-09-15 02:10:39 -04:00 | 3:00 |
| 4-hour hard deadline | 2026-09-15 03:10:39 -04:00 | 4:00 |

**FINAL STATUS: Exercise completed in 1 hour 43 minutes 11 seconds — 2h 16m 49s ahead of the 4:00:00 budget, well inside the 3:00:00 grading-checkpoint threshold.**

## What Was Delivered

- **Framework:** Playwright + TypeScript, two projects (`ui` → Chromium/SauceDemo, `api` → JSONPlaceholder), configured in `playwright.config.ts`.
- **`test-cases/TestCases.md`:** 74 documented test cases (43 UI + 31 API) that drove every automated test, written *before* any automation code.
- **`tests/ui/`:** Page Object Model (`pages/LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutPage.ts`) + 6 spec files covering login, inventory/sorting, cart, checkout, session, and SauceDemo's undocumented "quirky user" behaviors (`problem_user`, `visual_user`, `error_user`).
- **`tests/api/`:** 5 spec files covering full CRUD + nested-resource traversal across all 6 JSONPlaceholder resources (`posts`, `comments`, `albums`, `photos`, `todos`, `users`), including required-vs-optional field payload variations.
- **`test-cases/PromptLog.md`:** every prompt, the model in use (Claude Sonnet 5 throughout), tool/framework versions, clarifying Q&A, and the rationale behind each design decision.
- **`README.md`, `.github/copilot-instructions.md`, `CLAUDE.md`:** setup/run instructions for humans and AI coding agents continuing this work.
- **`playwright-report/` + `test-results/`:** committed HTML report and raw per-test artifact folders (each individually named with its test case ID, e.g. `checkout-Checkout-UI-030-Complete-checkout-with-valid-info-ui/video.webm`), including passing-run videos for every UI test, for team/grader review without needing to re-run anything.

## Test Results (at last full run)

- **74/74 passing** (`npx playwright test`), ~5-6 second runtime.
- One intermittent flake was found and root-caused during development (`UI-018`, a locator-indexing race condition in bulk add/remove-to-cart) — fixed and re-verified stable across multiple repeated runs before being considered done.
- No other flakiness observed across repeated full-suite runs.

## Key Decisions (see PromptLog.md for full detail/verbatim quotes)

- UI scope: core + extended edge cases + negative/boundary assertions (field length limits, disabled/no-op states, cart edge cases) + a stretch pass on quirky demo users.
- API scope: all JSONPlaceholder resources + nested-resource traversal + required-only vs. required+optional payload coverage.
- API "negative" tests assert JSONPlaceholder's actual mock behavior (200/201 even for missing fields — it never validates or persists), rather than pretending it rejects bad input.
- Browser target: Chromium only (time-boxed decision).
- No CI workflow added (explicit decision, out of scope for this exercise).
- Commits made per major phase, each pushed to `Rreovan/TakeHomeExercise` on `main`.

## Explicitly Out of Scope

- Cross-browser (Firefox/WebKit) execution.
- CI/CD pipeline (e.g., GitHub Actions).
- Visual regression testing (pixel-level screenshot diffing) for `visual_user` — covered functionally instead (see UI-070/071/072).
- Performance/load testing (`performance_glitch_user` was not automated).

## How to Verify

```powershell
npm install
npx playwright install chromium
npm test                 # 74/74 expected
npm run report            # view HTML report with videos
```
