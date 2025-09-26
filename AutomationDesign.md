# Automation Design Doc

## Objective
Describe a reusable browser automation stack that interprets natural language goals, reads dynamic pages, and executes precise UI actions without hard-coded selectors. The guide should apply to any web flow that needs agentic navigation.

## Core Components
- **Controller (`Stagehand` or equivalent):** Wraps Playwright, converts high-level instructions into DOM interactions, and manages LLM calls.
- **Executor (Playwright):** Launches Chromium contexts, exposes `page`/`context` for navigation, input, and cookie handling.
- **Planner (Gemini or chosen LLM):** Receives cleaned DOM snapshots plus instructions and returns structured actions (`click`, `type`, selector details).
- **Support Services:** Fetch target records, craft content, or supply runtime parameters (user profile, goals, environment flags).
- **Persistent State:** Stores authentication data, cached selectors, and environment configuration for subsequent runs.

## End-to-End Flow
1. UI collects user input and triggers a server-side orchestration action.
2. Orchestrator instantiates the controller with model and browser config, loading prior cookies or session state if available.
3. Controller boots Playwright and returns a `page` enhanced with helper APIs (`act`, `observe`, `extract`).
4. Script issues sequential steps such as `page.goto`, `page.extract` with schemas, and natural-language `page.act("Press the primary action button")`.
5. For each `extract`/`act` instruction, the controller:
   - Captures a fresh DOM snapshot via Playwright.
   - Sends the snapshot and instruction to the planner.
   - Receives selectors/values, then executes them through Playwright.
6. Actions are logged; selectors may be cached (e.g., into `cache.json`) for faster future runs.
7. On completion, controller saves updated cookies, closes the browser, and returns success or failure.

## Action Semantics
- `page.act` accepts natural language instructions; optional wrappers like `actWithCache` reuse prior planner output.
- `page.extract` combines natural language with schemas (e.g., Zod) to coerce planner responses.
- Observability tools (overlays, structured logs) highlight chosen elements for debugging.

## State & Configuration
- Environment variables provide model keys, API credentials, and execution modes (local vs remote browser).
- Session files (`*-auth-state.json`) store Playwright cookies per user.
- Selector cache files persist instruction → selector mappings; clear them when layouts change.
- Logs capture timestamps, instruction text, chosen selectors, and error details.

## Error Handling
- Navigation/login loops poll with retry caps and timeouts.
- Failures bubble up with user-friendly messages; severe errors trigger cleanup (close browser, clear cache).
- Recovery paths can prompt manual intervention (e.g., waiting for user login) before resuming scripted steps.

## Security & Compliance
- Keep API keys server-side or in secure desktop storage; encrypt session files in multi-user environments.
- Isolate per-user data and rate-limit automation runs.
- Document terms-of-service implications for the target platform.

## Extensibility
- Add domain-specific helpers that wrap recurring `page.act` patterns for custom widgets.
- Integrate additional services supplying targets or content.
- Swap planner models or adjust controller config to balance reasoning depth and latency.
- Stream logs and metrics for real-time monitoring of automation jobs.

## Operational Checklist
- **Inputs:** user context, target list, environment variables, auth state.
- **Outputs:** automation status, logs, optional generated content.
- **Prerequisites:** stable Playwright runtime, valid LLM and automation API keys.
- **Testing:** rehearse flows in development, validate cache invalidation, and monitor DOM changes that might invalidate cached selectors.

This blueprint lets high-level scripts describe intent while the controller + planner + executor trio handles low-level browser interactions for any webpage workflow.
