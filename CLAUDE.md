# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses NODE_OPTIONS="--use-system-ca" for system CA certificates)
- **Build project**: `npm run build`
- **Start production**: `npm start`
- **Lint code**: `npm run lint`

## Project Architecture

**Brew** is an autonomous cold outreach platform built with Next.js 15 and React 19. The application helps users craft personalized cold outreach messages for LinkedIn and email connections.

### Core Structure

- **Next.js App Router**: Uses the new App Router pattern in `src/app/`
- **API Routes**: Located in `src/app/api/` for backend functionality
- **Components**: UI components in `src/components/` using Radix UI and Tailwind CSS
- **Services**: External API integrations in `src/services/`
- **Utilities**: Helper functions in `src/lib/`

### Key Integrations

1. **Linkd API** (`src/services/linkd-api.ts`): LinkedIn profile search functionality
   - Requires `LINKD_API_KEY` environment variable
   - Searches for LinkedIn profiles based on generated queries
   - Returns structured profile data with experience and education

2. **Google Gemini AI** (`src/services/gemini-api.ts`): AI-powered content generation
   - Requires `GEMINI_API_KEY` environment variable
   - Generates LinkedIn search queries from user objectives
   - Powers personalized message generation

3. **Browserbase Stagehand**: Browser automation for message sending
   - Configuration in `stagehand.config.ts`
   - Uses Gemini 2.0 Flash model for browser actions
   - Supports both local and Browserbase environments
   - Environment variables: `BROWSERBASE_API_KEY`, `BROWSERBASE_PROJECT_ID`

### Application Flow

1. **Profile Setup**: Users enter their profile information and objectives
2. **Profile Search**: Generates LinkedIn search queries using Gemini AI
3. **Profile Discovery**: Uses Linkd API to find relevant LinkedIn profiles
4. **Message Generation**: Creates personalized outreach messages
5. **Automated Sending**: Uses Stagehand to send messages via LinkedIn/Gmail

### TypeScript Configuration

- Uses path aliases: `@/*` maps to `./src/*`
- Strict TypeScript configuration with Next.js plugin
- Target: ES2017 with modern module resolution

### Environment Variables Required

```
GEMINI_API_KEY=your_gemini_api_key
LINKD_API_KEY=your_linkd_api_key
BROWSERBASE_API_KEY=your_browserbase_api_key (optional, for remote browser)
BROWSERBASE_PROJECT_ID=your_project_id (optional, for remote browser)
```

### Key Data Models

- `UserProfile`: University info, clubs, societies, location
- `Profile`: LinkedIn profile with headline, description, profile picture
- `Experience`: Work experience with company details
- `Education`: Educational background
- `SearchResponse`: API response structure from Linkd

The codebase follows modern React patterns with TypeScript, uses Tailwind for styling, and integrates multiple AI services for intelligent outreach automation.