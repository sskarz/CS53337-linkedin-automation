# Repository Guidelines

## Project Structure & Module Organization
The Next.js 15 application lives under `src/app`, with route groups such as `dashboard/`, `explore/`, and `profile/`. Shared, client-side widgets sit in `src/components`, and reusable UI primitives remain under `src/components/ui`. Integrations and data fetchers (Linkd, Gemini, outreach helpers) are in `src/services`. Non-React utilities, including Stagehand helpers, live in `src/lib`. Static assets go into `public/`. Browser automation credentials persist in the repo root as `linkedin-auth-state.json` and `gmail-auth-state.json`; refresh them locally but keep secrets out of Git.

## Build, Test, and Development Commands
`npm run dev` launches the local development server with system CA support. `npm run build` produces an optimized production bundle, and `npm run start` serves that bundle. `npm run lint` runs the default Next.js ESLint stack; fix warnings before committing. When iterating on Stagehand agents, run the UI in parallel with `npm run dev` and execute the relevant server action from `src/app/stagehand/main.ts` to validate automation paths.

## Coding Style & Naming Conventions
Use TypeScript with functional React components and `use client` boundaries where required. Keep indentation at two spaces and favor trailing commas. Follow kebab-case for file names (`profiles-section.tsx`) and camelCase for variables and functions. Co-locate component-specific styles in module files and use Tailwind utility classes where possible. Import from `@/` aliases instead of deep relative paths.

## Testing Guidelines
Automated coverage is still forming. Smoke-test the key flows—profile capture, explore search, and outreach message generation—before opening a PR. Add unit or integration tests alongside the feature (e.g., `src/services/__tests__/message-generator.test.ts`) using Playwright or Node test runners as needed, and ensure they run without network credentials when mocked. Document any new manual verification steps in the PR description.

## Commit & Pull Request Guidelines
Use short, imperative commit messages similar to the existing history (`animation`, `readme`). Group related changes and avoid WIP commits. Each PR should describe the feature, list testing performed (`npm run lint`, manual flows), and include screenshots or recordings for UI changes. Link GitHub issues when applicable and call out new environment variables or data files.

## Stagehand & Automation Notes
Stagehand is configured through `stagehand.config.ts`; update API keys via `.env.local` (`GEMINI_API_KEY`, `BROWSERBASE_API_KEY`, `BROWSERBASE_PROJECT_ID`). Clear or rotate `*-auth-state.json` when debugging login failures. Prefer writing new automation utilities in `src/lib/stagehand-utils.ts` and keep instructions idempotent to allow cached actions via `actWithCache`.
