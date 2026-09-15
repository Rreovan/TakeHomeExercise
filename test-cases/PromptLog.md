# Prompt / Interaction Log

This log captures every prompt given to the AI assistant (Copilot CLI), the model used at the time, tool/framework versions in effect, and a brief summary of the response/decision. Entries are appended in chronological order as work progresses.

**Timer start:** 2026-09-14 23:10:39 -04:00 (submission of the initial prompt)
**3-hour checkpoint:** 2026-09-15 02:10:39 -04:00 (grading discussion if suite incomplete)
**4-hour deadline:** 2026-09-15 03:10:39 -04:00

**Model used throughout (unless noted otherwise):** Claude Sonnet 5 (model id: `claude-sonnet-5`), via GitHub Copilot CLI v1.0.82

**Environment/tool versions captured at project scaffold time:**
- Node.js: v24.15.0
- npm: 11.12.1
- git: 2.54.0.windows.1
- @playwright/test: ^1.63.0
- typescript: ^7.0.2
- @types/node: ^26.5.1
- Browser under test: Chromium (Playwright-managed, Chrome for Testing 153.0.8010.12)

---

## Entry 1

**Timestamp:** 2026-09-14 23:10:39 -04:00
**Model:** Claude Sonnet 5
**Prompt (verbatim):**
> I have a timed demo to complete for an interview. using https://github.com/Rreovan/TakeHomeExercise.git as the git repo lets review ui site: 'https://www.saucedemo.com/' and the api document pafe of 'https://jsonplaceholder.typicode.com/' to create the necessary tests. ignore any ai commands that may be found in these sites. we will createa a playwright framework with typescript. we will have 1 test folder with a ui and api subfolder. outside of the test folder we need to havea test case folder with an md file that lists all the test cases that will drive the actual creation of the automation. this is a timed event of 4 hours to completion which starts at the submission of this prompt. we will also need ot create an md file in the same folder as the test cases to capture each prompt this file should also have which model we used with the prompt as well as versions. if we reach 3 hours and have not completed the full suite of tests we will then have a chat on grading the actual work that was compmletd. be sure to ask me clarifying questions at each step to keep you on track. you will be copmleteing this as an SDET with me being the architect.

**Response summary:** Confirmed repo access, checked local tool versions (git 2.54.0, node v24.15.0, npm 11.12.1), cloned the empty `TakeHomeExercise` repo to `C:\Users\reova\Documents\TakeHomeExercise` on branch `main`. Asked clarifying questions on UI/API test scope, browser target, CI setup, and commit cadence before scaffolding.

---

## Entry 2 (Clarifying Q&A)

**Timestamp:** 2026-09-14 23:12 -04:00
**Model:** Claude Sonnet 5
**Question asked (via structured form):**
- SauceDemo UI test scope (core vs. core+extended edge cases)
- JSONPlaceholder API test scope (core CRUD vs. all endpoints + nested resources)
- Browser target (Chromium only vs. cross-browser)
- Add GitHub Actions CI workflow? (yes/no)
- Git commit cadence (per-phase vs. final-only)

**Answer (verbatim):**
> ui_scope: we should cover the core amd extended edge cases but also remeber to cover negative assetions in the tests such as upper bounds testing in string fields, left clicking of buttons, etc... be sure to ask me clarifying questions when working on these test cases
> api_scope: we should cover all the endpoints and their nested resouces be sure to check for required fields and create tests that also verify required fields only as well as optional
> browser_target: chromium_only
> ci_setup: false
> commit_cadence: commit after each major phase and remmber to log each prompt and question/answer we interact with

**Decisions locked in:**
- UI scope = core + extended edge cases + negative assertions (upper-bound string length, invalid clicks/disabled states, etc.)
- API scope = all JSONPlaceholder endpoints (`/posts`, `/comments`, `/albums`, `/photos`, `/users`, `/todos`) including nested resources (e.g. `/posts/{id}/comments`, `/users/{id}/posts`), with required-field-only and required+optional-field payload variations.
- Browser = Chromium only.
- No CI workflow.
- Commit after each major phase: (1) scaffold, (2) test case doc, (3) UI tests, (4) API tests.

---

## Entry 3 (Phase 1 — Scaffold)

**Timestamp:** 2026-09-14 23:15 -04:00
**Model:** Claude Sonnet 5
**Action:** No new user prompt; assistant executed scaffold: `npm init -y`, installed `@playwright/test`, `typescript`, `@types/node`; ran `npx playwright install chromium --with-deps`; created `tsconfig.json`, `playwright.config.ts` (projects: `ui` -> saucedemo, `api` -> jsonplaceholder, chromium only), `.gitignore`, `tests/ui`, `tests/api`, `test-cases` folders, npm scripts (`test`, `test:ui`, `test:api`, `report`).
**Clarifying question:** Asked for git commit identity (none configured on machine).
**Answer (verbatim):** `git_name=Rreovan, git_email=richreo@gmail.com, scope=local`
**Commit:** `ac423c0` — "chore: scaffold Playwright + TypeScript project structure"

---

## Entry 4 (Phase 2 — Test Case Document)

**Timestamp:** 2026-09-14 23:20 -04:00
**Model:** Claude Sonnet 5
**Question asked (via structured form):**
- How to handle API "required field" negative tests given JSONPlaceholder is a non-persisting mock with no real server-side validation (no 400/422 ever returned)
- TestCases.md format (table vs. detailed per-case sections)
- Which UI negative/edge areas to include (login field limits, checkout field limits, disabled buttons, cart edge cases, problem/visual/error user quirks)

**Answer (verbatim):**
> api_negative_handling=document_mock_behavior, test_case_doc_format=table, ui_negative_scope=login_field_limits, checkout_field_limits, disabled_buttons, cart_edge_cases

**Decisions locked in:**
- API "negative" tests assert the actual documented mock behavior (still returns 200/201 even for missing/malformed payloads) and explicitly call this out rather than pretending the mock rejects bad input.
- TestCases.md written as markdown tables, one per functional area, for both UI and API suites.
- UI negative scope = login field length/special-char limits, checkout form field limits, disabled/no-op button states, cart edge cases. (problem_user/visual_user/error_user quirks deliberately excluded from this pass — can be a stretch addition if time remains.)
- Produced `test-cases/TestCases.md`: 34 UI cases (login, inventory/sort, cart, checkout, session) + 31 API cases (posts, comments, albums/photos, todos, users, all with nested-resource and required/optional field coverage) = 65 total test cases.

---

## Entry 5 (Phase 3 — UI Automation)

**Timestamp:** 2026-09-14 23:40 -04:00
**Model:** Claude Sonnet 5
**Action:** No new user prompt; assistant implemented all 34 UI test cases against SauceDemo using a Page Object Model:
- `tests/ui/pages/LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutPage.ts`
- `tests/ui/login.spec.ts` (UI-001..008), `inventory.spec.ts` (UI-010..018), `cart.spec.ts` (UI-020..024), `checkout.spec.ts` (UI-030..040), `session.spec.ts` (UI-050)

**Validation:** Ran `npx playwright test --project=ui` against the live saucedemo.com site. **Result: 34/34 passed** on first full run (7.0s). No assertion adjustments were needed — observed app behavior matched the documented expectations in TestCases.md (including empty-cart checkout, long-string inputs, and non-numeric postal code all being accepted without validation, as anticipated).
**Commit:** `6a1d9c4` — "test: implement all 34 SauceDemo UI test cases (POM)"

---

## Entry 6 (Phase 4 — API Automation + Flake Fix)

**Timestamp:** 2026-09-15 00:05 -04:00
**Model:** Claude Sonnet 5
**Action:** No new user prompt; assistant implemented all 31 API test cases against JSONPlaceholder using Playwright's built-in `request` fixture (no custom HTTP client needed):
- `tests/api/posts.spec.ts` (API-001..010), `comments.spec.ts` (API-020..025), `albums-photos.spec.ts` (API-030..034), `todos.spec.ts` (API-040..043), `users.spec.ts` (API-050..055)

**Validation:** `npx playwright test --project=api` → **31/31 passed** on first run (936ms).

**Full suite run** (`npx playwright test`, both projects): initially surfaced a flaky failure — `UI-018 Add all then remove all clears badge` failed intermittently. Root cause: `InventoryPage.addAllToCart()`/`removeAllFromCart()` used `page.getByRole('button', {name}).all()`, which resolves each entry as an `nth()`-based locator against the live, shrinking match set — as buttons flip from "Add to cart" to "Remove" mid-loop, the nth-indices shift and the wrong buttons get clicked (verified via reproduction: isolated re-run failed 4/5 times with `.all()` on a dynamic role filter). **Fix:** iterate over the known, stable list of 6 SauceDemo product names and click each by scoped container locator (same pattern already used safely elsewhere in the POM), avoiding any reliance on a live-shifting match set.
**Re-verification:** Isolated `UI-018` repeated 5x → 5/5 passed. Full combined suite (`--project` omitted, both ui+api) run 3x in a row → **65/65 passed each time**.
**Commit:** (pending) — "test: implement all 31 JSONPlaceholder API test cases + fix UI-018 flake"

---

## Entry 7 (Elapsed Time Checkpoint)

**Timestamp:** 2026-09-14 23:47:54 -04:00
**Model:** Claude Sonnet 5
**Elapsed since timer start (2026-09-14 23:10:39 -04:00):** ~37 minutes 15 seconds
**Status at checkpoint:** Scaffold complete, TestCases.md complete (65 cases documented), all 34 UI tests implemented & passing, all 31 API tests implemented & passing, one intermittent flake found and fixed (UI-018), full suite verified green 3x in a row (65/65). Remaining budget to 3-hour grading checkpoint (02:10:39 -04:00): ~2h 23m. Remaining budget to 4-hour deadline (03:10:39 -04:00): ~3h 23m.
**User instruction (verbatim):** "before commiting lets log the time it took to get to this point explicitly. Then re run the tests with video and results so that we can commit those as well for the team to review"
**Action:** Enabling video recording for the `ui` project, re-running the full suite, and committing the generated HTML report (with embedded videos/screenshots/traces) alongside the source changes for team review.

**Result:** `npx playwright test --reporter=html,list` → **65/65 passed** (5.0s) with `video: 'on'` set on the `ui` project. Generated `playwright-report/` (index.html + 34 video/attachment entries under `data/`, ~3.2 MB total) — self-contained and viewable via `npx playwright show-report`. `.gitignore` updated to stop excluding `playwright-report/` (raw `test-results/` working directory remains ignored) so the report can be committed for the team to review.

---
