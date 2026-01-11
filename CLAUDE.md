# Text Transform - Developer Tools

## Project Overview
Developer-focused text and data transformation toolkit with 111+ client-side tools.

**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
**Related:** CaseChangerPro.com (writer tools), ColorCodeGuide.com (color tools)

## Quick Start
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint check
```

## Project Structure
```
lib/transformations/   # All transformation functions (111+)
  ├── naming-conventions.ts   # camelCase, snake_case, etc.
  ├── encoding.ts             # Base64, URL, HTML entities
  ├── crypto.ts               # Hashes, UUID, timestamps
  ├── formatters.ts           # JSON, SQL, CSS beautify/minify
  ├── converters.ts           # CSV↔JSON, XML↔JSON, cURL
  ├── colors.ts               # HEX, RGB, HSL conversions
  ├── generators.ts           # Passwords, Lorem ipsum
  └── ciphers.ts              # Caesar, Morse, ROT13
app/                   # Next.js app router pages
components/            # React components
docs/PRD.md           # Full product requirements
```

## Core Principles
1. **Client-side only** - No server processing, full privacy
2. **Zero external deps** - Pure TypeScript transformations
3. **Instant transforms** - Real-time as user types
4. **Mobile-first** - Responsive design

## Adding New Tools
1. Add function to appropriate file in `lib/transformations/`
2. Export from `lib/transformations/index.ts`
3. Add to category page in `app/tools/[category]/`
4. Update tool count in `docs/PRD.md`

## Code Standards
- TypeScript strict mode
- Pure functions for all transformations
- JSDoc comments for public functions
- No `any` types

## Git Workflow
- `main` branch for development
- `production` branch for deployment
- Conventional commits: `feat:`, `fix:`, `docs:`

## Deployment
Target: Railway
Domain: TBD (texttransform.dev or similar)
