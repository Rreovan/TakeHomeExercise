# TakeHomeExercise — Playwright + TypeScript Test Automation

Automated UI and API test suite built with [Playwright](https://playwright.dev) and TypeScript, covering:

- **UI:** [SauceDemo](https://www.saucedemo.com/) — login, inventory/sorting, cart, checkout, session, and the "quirky user" (`problem_user`, `visual_user`, `error_user`) edge cases.
- **API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — full CRUD + nested-resource coverage for `/posts`, `/comments`, `/albums`, `/photos`, `/todos`, and `/users`.

## Project Structure

```
tests/
  ui/              SauceDemo UI specs + Page Object Models (tests/ui/pages/)
  api/             JSONPlaceholder API specs
test-cases/
  TestCases.md     Full list of test cases (drove automation development)
  PromptLog.md     Log of every prompt, model, and decision made during this exercise
playwright.config.ts  Two projects: "ui" (chromium, saucedemo) and "api" (jsonplaceholder)
```

## Prerequisites

- Node.js v24+ and npm
- Git

## Setup

```powershell
npm install
npx playwright install chromium
```

## Running Tests

```powershell
npm test           # run both ui + api projects
npm run test:ui    # run only the SauceDemo UI suite
npm run test:api   # run only the JSONPlaceholder API suite
npm run report     # open the last HTML report (with videos, on failure screenshots, traces)
```

Run a single spec or test case by name:

```powershell
npx playwright test tests/ui/login.spec.ts
npx playwright test -g "UI-018"
```

## Notes on Test Design

- **UI tests** use a Page Object Model (`tests/ui/pages/`) — one class per page/flow (Login, Inventory, Cart, Checkout).
- **API tests** use Playwright's built-in `request` fixture; no separate HTTP client is needed.
- **JSONPlaceholder is a non-persisting mock API** — it returns success responses (200/201) even for missing-field or malformed payloads, and never returns 400/422. "Negative" API test cases assert this actual documented mock behavior rather than a rejection, and call this out explicitly in test comments.
- **SauceDemo's `problem_user`/`visual_user`/`error_user` quirks are undocumented** and were confirmed via a one-off exploration pass against the live site before writing assertions, rather than assumed from general knowledge.
- Browser target is **Chromium only** (scoped for this exercise's time constraints).

## Reports & Artifacts

`npx playwright test` generates an HTML report at `playwright-report/` (self-contained, includes recorded videos for UI tests). Open it with:

```powershell
npx playwright show-report
```

See `test-cases/TestCases.md` for the full test case catalog and `test-cases/PromptLog.md` for the development history of this exercise.

## AI Agent Instructions

If you're an AI coding agent working in this repo, see:
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — for GitHub Copilot
- [`CLAUDE.md`](CLAUDE.md) — for Claude Code
