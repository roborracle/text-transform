# Text Transform - Sprint Plan & Task Breakdown

> **Project:** Text Transform Developer Toolkit
> **Status:** Phase 1 Complete (111+ transformation functions implemented)
> **Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
> **Last Updated:** 2026-01-20

---

## Sprint Overview

| Sprint | Focus | Deliverable |
|--------|-------|-------------|
| Sprint 1 | Testing Infrastructure | Test framework + tests for all 111 transformations |
| Sprint 2 | Core Components | Reusable UI components library |
| Sprint 3 | Layout & Navigation | App shell with routing and navigation |
| Sprint 4 | Category Pages | 8 category landing pages with tool listings |
| Sprint 5 | Tool Pages - Batch 1 | First 4 categories (61 tools) with individual pages |
| Sprint 6 | Tool Pages - Batch 2 | Remaining 4 categories (52 tools) |
| Sprint 7 | Search & UX Features + Security | Search, keyboard shortcuts, security audit |
| Sprint 8 | Polish & Accessibility | Performance optimization, WCAG compliance |
| Sprint 9 | Deployment | CI/CD, Railway deployment, monitoring |

---

## Dependency Graph

```
Sprint 1 ──────────────────────────────────────────────────────────────►
    │
    ▼
Sprint 2 ──► Ticket 2.9 (Theme) required by all Sprint 3+ components
    │
    ▼
Sprint 3 ──► Ticket 3.4 (Tool Data) required by all Sprint 4+ pages
    │
    ▼
Sprint 4 ──► Category definitions required by Sprint 5-6 tool pages
    │
    ├──► Sprint 5 (Tools Batch 1)
    │
    └──► Sprint 6 (Tools Batch 2)
              │
              ▼
         Sprint 7 (Search & Security)
              │
              ▼
         Sprint 8 (Polish)
              │
              ▼
         Sprint 9 (Deploy)
```

**Critical Path:** Sprint 1 → Sprint 2.9 → Sprint 3.4 → Sprint 5-6

---

## Sprint 1: Testing Infrastructure

### Goal
Establish comprehensive test coverage for all 111+ transformation functions. Every function must have unit tests validating correct behavior, edge cases, and error handling.

### Demo Criteria
- `npm test` runs all tests
- Test coverage report shows 100% function coverage for `lib/transformations/`
- All tests pass

---

### Ticket 1.1: Test Framework Setup
**Type:** Infrastructure
**Files:** `package.json`, `jest.config.js`, `tsconfig.json`

**Description:**
Install and configure Jest with TypeScript support for unit testing transformation functions.

**Tasks:**
1. Install Jest and dependencies: `jest`, `@types/jest`, `ts-jest`
2. Create `jest.config.js` with TypeScript preset
3. Add `test`, `test:watch`, `test:coverage` scripts to package.json
4. Update tsconfig to include test files
5. Create `__tests__/` directory structure mirroring `lib/transformations/`

**Acceptance Criteria:**
- [ ] `npm test` runs without errors
- [ ] `npm run test:coverage` generates coverage report
- [ ] TypeScript compilation works for test files

**Validation Command:**
```bash
npm test -- --passWithNoTests
npm run test:coverage
```

---

### Ticket 1.1b: Browser API Compatibility Audit
**Type:** Technical Debt
**Files:** `lib/transformations/crypto.ts`, `lib/transformations/encoding.ts`
**Priority:** CRITICAL - Blocking for Ticket 1.4

**Description:**
Audit and fix browser API compatibility issues. The current `crypto.ts` uses `crypto.subtle.digest('MD-5')` which is NOT supported in browsers (Web Crypto API doesn't support MD5). Additionally, encoding functions use `window.btoa` which won't work during SSR.

**Known Issues:**
1. `md5Hash()` - Web Crypto API doesn't support MD5, need JavaScript implementation
2. `window.btoa`/`window.atob` - Won't work in Node.js/SSR
3. `crypto.randomUUID()` - Needs fallback for older browsers

**Tasks:**
1. Replace MD5 Web Crypto call with pure JavaScript MD5 implementation
2. Add environment checks for browser vs Node
3. Add SSR-safe wrappers for encoding functions
4. Verify all crypto functions work in both browser and Node
5. Add `'use client'` directive notes for components using these functions

**Acceptance Criteria:**
- [ ] All hash functions work in browser
- [ ] All encoding functions work in browser AND Node
- [ ] MD5 produces correct output (test with known values)
- [ ] No runtime errors in either environment
- [ ] Document which functions require client-side only execution

**Validation Command:**
```bash
npm run typecheck
# Manual: Test in browser console AND Node REPL
```

---

### Ticket 1.1c: Error Handling Patterns
**Type:** Architecture
**Files:** `lib/errors/index.ts`, `lib/transformations/*.ts`

**Description:**
Establish consistent error handling patterns before writing tests. Currently, transformation functions return error strings (e.g., "Invalid Base64 input") rather than throwing errors, making it difficult to distinguish success from failure.

**Tasks:**
1. Create `lib/errors/index.ts` with custom error types
2. Define `TransformationError` class with error codes
3. Create error code constants (e.g., `INVALID_INPUT`, `ENCODING_FAILED`)
4. Document error handling strategy (throw vs return)
5. Update at least 2 functions as examples of the pattern

**Error Types:**
```typescript
export class TransformationError extends Error {
  constructor(
    message: string,
    public code: string,
    public input?: string
  ) {
    super(message);
    this.name = 'TransformationError';
  }
}

export const ErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  ENCODING_FAILED: 'ENCODING_FAILED',
  DECODING_FAILED: 'DECODING_FAILED',
  INVALID_FORMAT: 'INVALID_FORMAT',
} as const;
```

**Acceptance Criteria:**
- [ ] Error types created and exported
- [ ] Error codes defined
- [ ] At least 2 transformation functions updated as examples
- [ ] Error handling pattern documented in code comments

**Validation Command:**
```bash
npm run typecheck
```

---

### Ticket 1.2: Tests for naming-conventions.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/naming-conventions.test.ts`

**Description:**
Write comprehensive unit tests for all 14 naming convention functions.

**Functions to Test:**
1. `toCamelCase` - 5+ test cases
2. `toPascalCase` - 5+ test cases
3. `toSnakeCase` - 5+ test cases
4. `toScreamingSnakeCase` - 3+ test cases
5. `toKebabCase` - 5+ test cases
6. `toTrainCase` - 3+ test cases
7. `toDotCase` - 3+ test cases
8. `toPathCase` - 3+ test cases
9. `toNamespaceCase` - 3+ test cases
10. `toAdaCase` - 3+ test cases
11. `toCobolCase` - 3+ test cases
12. `toFlatCase` - 3+ test cases
13. `toUpperFlatCase` - 3+ test cases
14. `detectNamingConvention` - 8+ test cases (one per convention)
15. `convertNamingConvention` - 5+ test cases

**Test Categories per Function:**
- Basic transformation
- Multi-word input
- Already-in-target-format (idempotency)
- Empty string handling
- Special characters
- Numbers in input

**Acceptance Criteria:**
- [ ] All 14 functions have tests
- [ ] Each function has 3+ test cases minimum
- [ ] Edge cases covered (empty string, single word, numbers)
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- naming-conventions
```

---

### Ticket 1.3: Tests for encoding.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/encoding.test.ts`

**Description:**
Write comprehensive unit tests for all 16 encoding/decoding functions.

**Functions to Test:**
1. `base64Encode` / `base64Decode` - roundtrip tests
2. `base32Encode` / `base32Decode` - roundtrip tests
3. `urlEncode` / `urlDecode` - special characters, spaces
4. `htmlEncode` / `htmlDecode` - all 8 entities + numeric
5. `binaryToText` / `textToBinary` - roundtrip
6. `hexToText` / `textToHex` - roundtrip
7. `utf8Encode` / `utf8Decode` - unicode characters
8. `asciiToText` / `textToAscii` - roundtrip

**Test Categories:**
- Encode → Decode roundtrip equality
- Known values (e.g., "hello" → "aGVsbG8=")
- Empty string handling
- Unicode/special characters
- Invalid input handling

**Acceptance Criteria:**
- [ ] All 16 functions have tests
- [ ] Roundtrip tests verify encode(decode(x)) === x
- [ ] Known value tests for verification
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- encoding
```

---

### Ticket 1.4: Tests for crypto.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/crypto.test.ts`

**Description:**
Write unit tests for all 13 crypto/hashing functions. Note: Hash functions are async.

**Functions to Test:**
1. `md5Hash` - known hash values
2. `sha1Hash` - known hash values
3. `sha256Hash` - known hash values
4. `sha512Hash` - known hash values
5. `generateUUIDv4` - format validation (8-4-4-4-12)
6. `generateULID` - format validation (26 chars, Crockford base32)
7. `generateNanoID` - length validation
8. `decodeJWT` - valid/invalid token handling
9. `generateHMACSHA256` - known values with key
10. `generateBcryptHash` - format validation (placeholder)
11. `unixTimestampToDate` - known conversions
12. `dateToUnixTimestamp` - known conversions
13. `generateChecksum` - CRC32 known values

**Test Categories:**
- Known input/output pairs for deterministic functions
- Format validation for generators
- Async/await handling for hash functions
- Error handling for invalid inputs

**Acceptance Criteria:**
- [ ] All 13 functions have tests
- [ ] Hash functions tested with known values
- [ ] UUID/ULID/NanoID format validated
- [ ] JWT decode handles valid/invalid tokens
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- crypto
```

---

### Ticket 1.5: Tests for formatters.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/formatters.test.ts`

**Description:**
Write unit tests for all 18+ formatting functions.

**Functions to Test:**
1. `formatJSON` / `minifyJSON`
2. `formatSQL` / `minifySQL`
3. `formatXML` / `minifyXML`
4. `formatCSS` / `minifyCSS`
5. `formatJavaScript` / `minifyJavaScript`
6. `formatHTML` / `minifyHTML`
7. `formatYAML`
8. `jsonToYAML` / `yamlToJSON`
9. `markdownToHTML` / `htmlToMarkdown`
10. `curlToCode` (JavaScript, Python, PHP targets)

**Test Categories:**
- Format → Minify → Format roundtrip structure
- Known input/output pairs
- Invalid input handling (malformed JSON, etc.)
- Preserve semantics after formatting

**Acceptance Criteria:**
- [ ] All 18+ functions have tests
- [ ] Format/minify pairs tested together
- [ ] cURL conversion tested for all 3 targets
- [ ] Invalid input error handling verified
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- formatters
```

---

### Ticket 1.6: Tests for converters.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/converters.test.ts`

**Description:**
Write unit tests for all 10 data conversion functions.

**Functions to Test:**
1. `csvToJSON` - headers, no headers, quoted values
2. `jsonToCSV` - flat objects, arrays
3. `xmlToJSON` - basic XML structures
4. `jsonToXML` - object to XML
5. `parseCSVLine` - helper function
6. `escapeCSVValue` - special character escaping

**Test Categories:**
- Roundtrip conversion (CSV → JSON → CSV)
- Edge cases (empty rows, quoted commas)
- Special characters
- Array vs object handling

**Acceptance Criteria:**
- [ ] All conversion functions have tests
- [ ] CSV edge cases covered (quotes, commas, newlines)
- [ ] XML/JSON basic conversions work
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- converters
```

---

### Ticket 1.7: Tests for colors.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/colors.test.ts`

**Description:**
Write unit tests for all 12 color conversion functions.

**Functions to Test:**
1. `hexToRgb` - 3-digit, 6-digit, with/without #
2. `rgbToHex` - string and object input
3. `hexToHsl` - known color conversions
4. `hslToHex` - known color conversions
5. `decimalToHex` / `hexToDecimal`
6. `hexToRgba` - alpha handling
7. `generateRandomHexColor` - format validation
8. `getComplementaryColor` - known complements
9. `hexToCssVariable` - format output
10. `parseColor` - multi-format parsing

**Test Categories:**
- Known color conversions (red, green, blue, white, black)
- Roundtrip conversions
- Edge cases (case sensitivity, with/without #)
- Random generator format validation

**Acceptance Criteria:**
- [ ] All 12 functions have tests
- [ ] Known color values verified
- [ ] Roundtrip hex → rgb → hex works
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- colors
```

---

### Ticket 1.8: Tests for generators.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/generators.test.ts`

**Description:**
Write unit tests for all 15 random generator functions.

**Functions to Test:**
1. `generatePassword` - length, charset inclusion
2. `generateIPv4` - format validation
3. `generateIPv6` - format validation
4. `generateMacAddress` - format, separator options
5. `generateRandomString` - length, charset options
6. `generateLoremIpsum` - paragraph/word counts
7. `generateRandomDate` - date range validation
8. `generateRandomEmail` - email format validation
9. `generateRandomUsername` - format validation
10. `generateRandomPhone` - format validation
11. `generateTestCreditCard` - Luhn validation
12. `generateSlug` - URL-safe output
13. `generateApiKey` - prefix and format

**Test Categories:**
- Output format validation (regex)
- Length/count parameters respected
- Options (separators, charsets) work
- Credit card Luhn algorithm validation

**Acceptance Criteria:**
- [ ] All 15 functions have tests
- [ ] Format validation via regex
- [ ] Credit card passes Luhn check
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- generators
```

---

### Ticket 1.9: Tests for ciphers.ts
**Type:** Testing
**Files:** `__tests__/lib/transformations/ciphers.test.ts`

**Description:**
Write unit tests for all 12+ cipher functions.

**Functions to Test:**
1. `caesarEncode` / `caesarDecode` - roundtrip with shift
2. `rot13` - self-inverse property
3. `rot47` - self-inverse property
4. `atbash` - self-inverse property
5. `textToMorse` / `morseToText` - roundtrip
6. `vigenereEncode` / `vigenereDecode` - roundtrip with key
7. `textToNato` - known conversions
8. `toPigLatin` - known conversions
9. `reverseWords` - word order reversal
10. `reverseString` - string reversal
11. `xorCipher` - self-inverse with same key
12. `substitutionCipher` - custom alphabet

**Test Categories:**
- Encode → Decode roundtrip
- Self-inverse ciphers (ROT13, ROT47, Atbash, XOR)
- Known plaintext/ciphertext pairs
- Key handling for Vigenère

**Acceptance Criteria:**
- [ ] All 12+ functions have tests
- [ ] Self-inverse property verified
- [ ] Morse code alphabet complete
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- ciphers
```

---

### Ticket 1.10: Test Coverage Report & CI Integration
**Type:** Infrastructure
**Files:** `package.json`, `.github/workflows/test.yml` (optional)

**Description:**
Generate final coverage report, ensure 100% function coverage, and optionally set up GitHub Actions for CI.

**Tasks:**
1. Run full test suite with coverage
2. Verify 100% function coverage for `lib/transformations/`
3. Fix any gaps in coverage
4. Add coverage badge to README (optional)
5. Create GitHub Actions workflow for automated testing (optional)

**Acceptance Criteria:**
- [ ] `npm run test:coverage` shows 100% function coverage
- [ ] All 111+ functions tested
- [ ] Coverage report generated in `coverage/` directory
- [ ] All tests pass

**Validation Command:**
```bash
npm run test:coverage
# Verify coverage/lcov-report/index.html shows 100%
```

---

## Sprint 2: Core Components

### Goal
Build the foundational React components that will be reused across all tool pages. Focus on the core interaction pattern: input → transform → output.

### Demo Criteria
- Storybook or test page showing all components
- Components render correctly in isolation
- Dark mode toggle works
- Components are typed and documented

---

### Ticket 2.0a: SSR Compatibility Layer
**Type:** Architecture
**Files:** `lib/utils/ssr-safe.ts`
**Priority:** HIGH - Required before any component uses transformations

**Description:**
Create SSR-safe wrappers for transformation functions that use browser-only APIs. All tool pages must use these wrappers to prevent hydration mismatches.

**Tasks:**
1. Create `lib/utils/ssr-safe.ts` with dynamic import helpers
2. Create `useTransform` hook that handles client-side only execution
3. Add `'use client'` directive guidance documentation
4. Create SSR-safe wrapper pattern for async transformations
5. Document which transformations are SSR-safe vs client-only

**Implementation:**
```typescript
// lib/utils/ssr-safe.ts
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function useClientOnly<T>(fn: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(fn());
  }, []);
  return value;
}
```

**Acceptance Criteria:**
- [ ] SSR-safe utilities created
- [ ] useTransform hook works without hydration errors
- [ ] Documentation explains client-only vs universal functions
- [ ] No hydration mismatch errors in development

**Validation Command:**
```bash
npm run build
npm start
# Check for hydration warnings in console
```

---

### Ticket 2.0b: Input Validation Utilities
**Type:** Security
**Files:** `lib/validation/index.ts`
**Priority:** HIGH - Security critical

**Description:**
Create input validation utilities to prevent XSS, injection attacks, and DoS via large inputs. All transformation functions should validate input before processing.

**Tasks:**
1. Create `lib/validation/index.ts`
2. Implement max input size validation (default: 1MB)
3. Implement input sanitization for HTML/Markdown converters
4. Create validation error messages
5. Add rate limiting helpers for generators

**Validation Functions:**
```typescript
export const MAX_INPUT_SIZE = 1_000_000; // 1MB

export function validateInputSize(input: string): void {
  if (input.length > MAX_INPUT_SIZE) {
    throw new TransformationError(
      `Input exceeds maximum size of ${MAX_INPUT_SIZE} characters`,
      ErrorCodes.INPUT_TOO_LARGE
    );
  }
}

export function sanitizeHtmlInput(input: string): string {
  // Remove script tags and event handlers
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}
```

**Acceptance Criteria:**
- [ ] Max input size enforced
- [ ] HTML sanitization prevents XSS
- [ ] Validation errors are user-friendly
- [ ] No performance impact for normal-sized inputs

**Validation Command:**
```bash
npm run typecheck
npm test -- validation
```

---

### Ticket 2.0c: State Management Architecture
**Type:** Architecture
**Files:** `lib/hooks/useTransformState.ts`

**Description:**
Define the state management pattern for transformation tools. Each tool needs to manage input, output, error, and loading states consistently.

**Tasks:**
1. Create `useTransformState` hook
2. Implement debouncing for real-time transforms (150ms default)
3. Add error state management
4. Add loading state for async transforms
5. Add transform history (last 5 transforms per session)

**Hook Interface:**
```typescript
interface UseTransformStateOptions {
  transformFn: (input: string, options?: Record<string, unknown>) => string | Promise<string>;
  debounceMs?: number;
  realtime?: boolean;
}

interface TransformState {
  input: string;
  output: string;
  error: string | null;
  isLoading: boolean;
  setInput: (value: string) => void;
  transform: () => Promise<void>;
  clear: () => void;
  swap: () => void;
}

function useTransformState(options: UseTransformStateOptions): TransformState;
```

**Acceptance Criteria:**
- [ ] Hook manages all transform states
- [ ] Debouncing works for rapid input changes
- [ ] Async transforms show loading state
- [ ] Errors display and clear appropriately
- [ ] Hook is fully typed

**Validation Command:**
```bash
npm run typecheck
npm test -- hooks/useTransformState
```

---

### Ticket 2.1: Component Directory Structure
**Type:** Infrastructure
**Files:** `components/`, `components/ui/`, `components/layout/`

**Description:**
Create the component directory structure following Next.js conventions.

**Tasks:**
1. Create `components/` directory
2. Create `components/ui/` for primitive UI components
3. Create `components/layout/` for structural components
4. Create `components/tools/` for tool-specific components
5. Create `components/index.ts` for barrel exports

**Directory Structure:**
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── index.ts
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── index.ts
├── tools/
│   ├── TransformPanel.tsx
│   ├── ToolCard.tsx
│   ├── CategoryCard.tsx
│   └── index.ts
└── index.ts
```

**Acceptance Criteria:**
- [ ] Directory structure created
- [ ] Barrel exports configured
- [ ] TypeScript paths resolve correctly

**Validation:**
```bash
ls -la components/
npm run typecheck
```

---

### Ticket 2.2: Button Component
**Type:** Component
**Files:** `components/ui/Button.tsx`

**Description:**
Create a reusable Button component with variants and sizes.

**Props Interface:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Tasks:**
1. Create Button component with variants
2. Implement size variations
3. Add loading state with spinner
4. Support icon placement
5. Ensure keyboard accessibility (focus states)

**Acceptance Criteria:**
- [ ] All 4 variants render correctly
- [ ] All 3 sizes render correctly
- [ ] Loading state shows spinner and disables button
- [ ] Focus states visible for keyboard navigation
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Render button in page.tsx and verify
```

---

### Ticket 2.3: Textarea Component
**Type:** Component
**Files:** `components/ui/Textarea.tsx`

**Description:**
Create the primary text input component for transformation input/output.

**Props Interface:**
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  showLineCount?: boolean;
  monospace?: boolean;
  onValueChange?: (value: string) => void;
}
```

**Tasks:**
1. Create Textarea with label support
2. Add character and line count display
3. Support monospace font option
4. Implement error state styling
5. Auto-resize option (optional)

**Acceptance Criteria:**
- [ ] Label renders above textarea
- [ ] Character count updates in real-time
- [ ] Line count updates in real-time
- [ ] Monospace option applies correct font
- [ ] Error state shows red border and message
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Test character/line counting
```

---

### Ticket 2.4: Card Component
**Type:** Component
**Files:** `components/ui/Card.tsx`

**Description:**
Create a Card container component for tool cards and panels.

**Props Interface:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}
```

**Tasks:**
1. Create Card with padding variants
2. Implement elevation/shadow variants
3. Support semantic HTML elements
4. Add hover state for interactive cards

**Acceptance Criteria:**
- [ ] All variants render correctly
- [ ] Padding options work
- [ ] Can render as different HTML elements
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
```

---

### Ticket 2.5: Badge Component
**Type:** Component
**Files:** `components/ui/Badge.tsx`

**Description:**
Create a Badge component for category labels and status indicators.

**Props Interface:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}
```

**Tasks:**
1. Create Badge with color variants
2. Implement size options
3. Ensure good contrast ratios

**Acceptance Criteria:**
- [ ] All 5 color variants render
- [ ] Both sizes render correctly
- [ ] Text is readable (contrast)
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
```

---

### Ticket 2.6: TransformPanel Component
**Type:** Component
**Files:** `components/tools/TransformPanel.tsx`

**Description:**
Create the main transformation interface component with input, transform button, and output areas.

**Props Interface:**
```typescript
interface TransformPanelProps {
  title: string;
  description?: string;
  transformFn: (input: string, options?: Record<string, unknown>) => string | Promise<string>;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  options?: TransformOption[];
  showSwapButton?: boolean;
}

interface TransformOption {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  defaultValue?: unknown;
  options?: { label: string; value: string }[]; // for select type
}
```

**Tasks:**
1. Create two-panel layout (input/output)
2. Wire up transform function execution
3. Handle async transformations
4. Implement options panel for configurable transforms
5. Add swap button to exchange input/output
6. Add copy to clipboard for output
7. Add clear buttons for both panels
8. Handle errors gracefully with user feedback

**Acceptance Criteria:**
- [ ] Input text transforms on button click
- [ ] Async transforms show loading state
- [ ] Options render and affect transformation
- [ ] Swap button exchanges values
- [ ] Copy button copies output
- [ ] Errors display user-friendly message
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Wire up a simple transform function and test
```

---

### Ticket 2.7: ToolCard Component
**Type:** Component
**Files:** `components/tools/ToolCard.tsx`

**Description:**
Create a card component for displaying tool previews in category listings.

**Props Interface:**
```typescript
interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  category: string;
  icon?: React.ReactNode;
}
```

**Tasks:**
1. Create card layout with name/description
2. Add category badge
3. Implement hover state
4. Make entire card clickable (Link)
5. Add icon support

**Acceptance Criteria:**
- [ ] Card displays tool information
- [ ] Category badge renders
- [ ] Hover state visible
- [ ] Clicking navigates to tool page
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
```

---

### Ticket 2.8: CategoryCard Component
**Type:** Component
**Files:** `components/tools/CategoryCard.tsx`

**Description:**
Create a card component for displaying categories on the homepage.

**Props Interface:**
```typescript
interface CategoryCardProps {
  name: string;
  description: string;
  href: string;
  toolCount: number;
  icon: React.ReactNode;
}
```

**Tasks:**
1. Create card layout with category info
2. Display tool count badge
3. Add category icon
4. Implement hover state
5. Make card clickable

**Acceptance Criteria:**
- [ ] Card displays category information
- [ ] Tool count renders
- [ ] Icon renders
- [ ] Clicking navigates to category page
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
```

---

### Ticket 2.9: Theme Context and Dark Mode
**Type:** Feature
**Files:** `contexts/ThemeContext.tsx`, `app/layout.tsx`

**Description:**
Implement dark mode support with localStorage persistence.

**Tasks:**
1. Create ThemeContext with light/dark/system options
2. Create ThemeProvider component
3. Implement localStorage persistence
4. Respect system preference on first load
5. Add theme toggle hook (`useTheme`)
6. Configure Tailwind dark mode

**Context Interface:**
```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

**Acceptance Criteria:**
- [ ] Dark mode toggles correctly
- [ ] Preference persists across page reloads
- [ ] System preference detected on first visit
- [ ] No flash of wrong theme on load
- [ ] Context is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Toggle theme and verify persistence
```

---

### Ticket 2.10: UI Component Tests
**Type:** Testing
**Files:** `__tests__/components/ui/*.test.tsx`

**Description:**
Write unit tests for all UI components using React Testing Library.

**Tasks:**
1. Install `@testing-library/react`, `@testing-library/jest-dom`
2. Write tests for Button (variants, loading, click)
3. Write tests for Textarea (value change, counts)
4. Write tests for Card (variants, children)
5. Write tests for Badge (variants)

**Acceptance Criteria:**
- [ ] All UI components have tests
- [ ] Tests cover primary functionality
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- components/ui
```

---

## Sprint 3: Layout & Navigation

### Goal
Build the app shell including header, footer, sidebar navigation, and routing structure. The app should have a complete navigation experience.

### Demo Criteria
- Full page layout with header/footer
- Navigation between categories works
- Mobile responsive navigation
- Dark mode toggle in header

---

### Ticket 3.1: Header Component
**Type:** Component
**Files:** `components/layout/Header.tsx`

**Description:**
Create the site header with logo, navigation, and theme toggle.

**Tasks:**
1. Create header layout with logo/brand
2. Add main navigation links (categories dropdown)
3. Implement theme toggle button
4. Add mobile hamburger menu
5. Implement sticky header behavior

**Acceptance Criteria:**
- [ ] Logo links to homepage
- [ ] Navigation dropdown shows categories
- [ ] Theme toggle works
- [ ] Mobile menu opens/closes
- [ ] Header sticks on scroll
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Test at mobile and desktop widths
```

---

### Ticket 3.2: Footer Component
**Type:** Component
**Files:** `components/layout/Footer.tsx`

**Description:**
Create the site footer with links and attribution.

**Tasks:**
1. Create footer layout
2. Add category links
3. Add related sites links (CaseChangerPro, ColorCodeGuide)
4. Add copyright and year
5. Ensure responsive layout

**Acceptance Criteria:**
- [ ] Footer displays at bottom
- [ ] Links work correctly
- [ ] Responsive on mobile
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
```

---

### Ticket 3.3: Sidebar Component
**Type:** Component
**Files:** `components/layout/Sidebar.tsx`

**Description:**
Create the category sidebar for tool pages.

**Tasks:**
1. Create sidebar layout
2. List all categories with icons
3. Highlight current category
4. Show tool count per category
5. Collapsible on mobile
6. Expand category to show tools

**Acceptance Criteria:**
- [ ] All 8 categories listed
- [ ] Current category highlighted
- [ ] Tool counts accurate
- [ ] Expands to show tools in category
- [ ] Collapses on mobile
- [ ] Component is fully typed

**Validation:**
```bash
npm run typecheck
# Manual: Navigate between categories
```

---

### Ticket 3.4a: Tool & Category Type Definitions
**Type:** Data
**Files:** `lib/tools/types.ts`

**Description:**
Define TypeScript types for tools and categories.

**Data Structure:**
```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export interface ToolOption {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  transformFn: string; // function name from lib/transformations
  isAsync?: boolean;
  options?: ToolOption[];
  keywords: string[];
}
```

**Tasks:**
1. Create `lib/tools/types.ts`
2. Define Category interface
3. Define Tool interface
4. Define ToolOption interface
5. Export all types

**Acceptance Criteria:**
- [ ] All types defined
- [ ] Types are exported
- [ ] TypeScript compiles without errors

**Validation Command:**
```bash
npm run typecheck
```

---

### Ticket 3.4b: Category Definitions
**Type:** Data
**Files:** `lib/tools/categories.ts`

**Description:**
Define all 8 category entries with metadata.

**Categories (8):**
1. naming-conventions - "Naming Conventions"
2. encoding - "Encoding & Decoding"
3. crypto - "Cryptography & Hashing"
4. formatters - "Code Formatters"
5. converters - "Data Converters"
6. colors - "Color Utilities"
7. generators - "Random Generators"
8. ciphers - "Ciphers & Encoding"

**Tasks:**
1. Create `lib/tools/categories.ts`
2. Define CATEGORIES array with all 8 categories
3. Add icons (emoji or icon name) for each
4. Add SEO-friendly descriptions
5. Export categories

**Acceptance Criteria:**
- [ ] All 8 categories defined
- [ ] Each has id, name, description, icon, slug
- [ ] Slugs are URL-safe

**Validation Command:**
```bash
npm run typecheck
# Manual: Verify 8 categories in export
```

---

### Ticket 3.4c: Tool Definitions - Categories 1-4
**Type:** Data
**Files:** `lib/tools/definitions/batch1.ts`

**Description:**
Define tool entries for first 4 categories (61 tools).

**Tools to Define:**
- Naming Conventions: 14 tools
- Encoding: 16 tools
- Crypto: 13 tools
- Formatters: 18 tools
- **Total: 61 tools**

**Tasks:**
1. Create `lib/tools/definitions/batch1.ts`
2. Define all 14 naming convention tools
3. Define all 16 encoding tools
4. Define all 13 crypto tools (mark async ones)
5. Define all 18 formatter tools
6. Map each to correct transformFn name
7. Add keywords for search

**Acceptance Criteria:**
- [ ] 61 tools defined
- [ ] Each maps to correct transformation function
- [ ] Async tools marked with `isAsync: true`
- [ ] Keywords populated

**Validation Command:**
```bash
npm run typecheck
# Automated test: verify 61 tools in batch1
```

---

### Ticket 3.4d: Tool Definitions - Categories 5-8
**Type:** Data
**Files:** `lib/tools/definitions/batch2.ts`

**Description:**
Define tool entries for remaining 4 categories (52 tools).

**Tools to Define:**
- Converters: 10 tools
- Colors: 12 tools
- Generators: 15 tools
- Ciphers: 15 tools
- **Total: 52 tools**

**Tasks:**
1. Create `lib/tools/definitions/batch2.ts`
2. Define all 10 converter tools
3. Define all 12 color tools
4. Define all 15 generator tools
5. Define all 15 cipher tools
6. Map each to correct transformFn name
7. Add options for configurable tools

**Acceptance Criteria:**
- [ ] 52 tools defined
- [ ] Each maps to correct transformation function
- [ ] Options defined for generators and ciphers
- [ ] Keywords populated

**Validation Command:**
```bash
npm run typecheck
# Automated test: verify 52 tools in batch2
```

---

### Ticket 3.4e: Tool Registry & Helper Functions
**Type:** Data
**Files:** `lib/tools/index.ts`, `lib/tools/registry.ts`

**Description:**
Create the tool registry and helper functions for looking up tools and categories.

**Helper Functions:**
```typescript
export function getCategory(slug: string): Category | undefined;
export function getTool(categorySlug: string, toolSlug: string): Tool | undefined;
export function getToolsByCategory(categoryId: string): Tool[];
export function getAllTools(): Tool[];
export function getAllCategories(): Category[];
export function getToolCount(): number;
export function getCategoryToolCount(categoryId: string): number;
```

**Tasks:**
1. Create `lib/tools/registry.ts`
2. Combine batch1 and batch2 tool definitions
3. Implement all helper functions
4. Create barrel export in `lib/tools/index.ts`
5. Add runtime validation that all transformFn references exist

**Acceptance Criteria:**
- [ ] All helper functions work correctly
- [ ] getToolCount() returns 113 (61 + 52)
- [ ] All tools map to existing transformation functions
- [ ] Type-safe exports

**Validation Command:**
```bash
npm run typecheck
npm test -- tools/registry
# Automated: verify tool count matches expected
```

---

### Ticket 3.5: Root Layout Update
**Type:** Layout
**Files:** `app/layout.tsx`

**Description:**
Update the root layout to include header, footer, and theme provider.

**Tasks:**
1. Wrap app in ThemeProvider
2. Add Header component
3. Add Footer component
4. Configure main content area with proper spacing
5. Add metadata (title, description)
6. Configure viewport for mobile

**Acceptance Criteria:**
- [ ] Header renders on all pages
- [ ] Footer renders on all pages
- [ ] Theme persists across navigation
- [ ] Metadata configured correctly
- [ ] Mobile viewport set

**Validation:**
```bash
npm run build
# Manual: Navigate and verify layout consistency
```

---

### Ticket 3.6: Homepage Implementation
**Type:** Page
**Files:** `app/page.tsx`

**Description:**
Implement the homepage showing all categories.

**Tasks:**
1. Create hero section with site description
2. Display all 8 categories as CategoryCards
3. Add quick-access popular tools section
4. Ensure responsive grid layout
5. Add SEO metadata

**Acceptance Criteria:**
- [ ] Hero section renders
- [ ] All 8 categories display
- [ ] Cards link to category pages
- [ ] Responsive on all screen sizes
- [ ] Page has proper metadata

**Validation:**
```bash
npm run build
# Manual: Verify all categories visible and clickable
```

---

### Ticket 3.7: Category Page Template
**Type:** Page
**Files:** `app/tools/[category]/page.tsx`

**Description:**
Create the dynamic category page template.

**Tasks:**
1. Create dynamic route `[category]`
2. Fetch category data by slug
3. Display category header with description
4. List all tools in category as ToolCards
5. Handle invalid category (404)
6. Add breadcrumb navigation
7. Generate static params for all categories

**Acceptance Criteria:**
- [ ] Category page renders for all 8 categories
- [ ] Tools list correctly for each category
- [ ] Invalid category shows 404
- [ ] Breadcrumbs work
- [ ] Page has proper metadata

**Validation:**
```bash
npm run build
# Verify all category routes generate
```

---

### Ticket 3.8: Tool Page Template
**Type:** Page
**Files:** `app/tools/[category]/[tool]/page.tsx`

**Description:**
Create the dynamic individual tool page template.

**Tasks:**
1. Create dynamic route `[category]/[tool]`
2. Fetch tool data by slugs
3. Display tool name and description
4. Render TransformPanel with correct transform function
5. Handle tool options if applicable
6. Handle invalid tool (404)
7. Add breadcrumb navigation
8. Generate static params for all tools

**Acceptance Criteria:**
- [ ] Tool page renders for all 111 tools
- [ ] TransformPanel wired to correct function
- [ ] Options render when applicable
- [ ] Invalid tool shows 404
- [ ] Breadcrumbs work
- [ ] Page has proper metadata

**Validation:**
```bash
npm run build
# Verify all tool routes generate
```

---

### Ticket 3.9: 404 Page
**Type:** Page
**Files:** `app/not-found.tsx`

**Description:**
Create a custom 404 page.

**Tasks:**
1. Create not-found.tsx
2. Add helpful message
3. Link to homepage
4. Link to categories
5. Match site styling

**Acceptance Criteria:**
- [ ] 404 page renders for invalid routes
- [ ] Links to homepage work
- [ ] Matches site design

**Validation:**
```bash
# Manual: Navigate to /invalid-route
```

---

### Ticket 3.10: Navigation Tests
**Type:** Testing
**Files:** `__tests__/navigation.test.tsx`

**Description:**
Write integration tests for navigation flows.

**Tasks:**
1. Test homepage renders all categories
2. Test category page renders correct tools
3. Test tool page renders TransformPanel
4. Test breadcrumb navigation
5. Test 404 handling

**Acceptance Criteria:**
- [ ] All navigation tests pass
- [ ] Coverage for main flows

**Validation Command:**
```bash
npm test -- navigation
```

---

## Sprint 4: Category Pages Complete

### Goal
Implement all 8 category pages with complete tool listings. Each category page should be fully functional with accurate tool counts and descriptions.

### Demo Criteria
- All 8 category pages accessible
- Tool counts accurate
- Category descriptions match PRD
- Navigation between categories works

---

### Ticket 4.1: Naming Conventions Category Page
**Type:** Page
**Files:** `lib/tools/categories/naming-conventions.ts`

**Description:**
Define and implement the Naming Conventions category with all 14 tools.

**Tools (14):**
1. camelCase Converter
2. PascalCase Converter
3. snake_case Converter
4. SCREAMING_SNAKE_CASE Converter
5. kebab-case Converter
6. Train-Case Converter
7. dot.case Converter
8. path/case Converter
9. Namespace\Case Converter
10. Ada_Case Converter
11. COBOL-CASE Converter
12. flatcase Converter
13. UPPERFLATCASE Converter
14. Naming Convention Detector

**Tasks:**
1. Define category metadata
2. Define all 14 tool entries
3. Map each to transformation function
4. Add SEO keywords for each tool
5. Verify all tools render on category page

**Acceptance Criteria:**
- [ ] Category page shows 14 tools
- [ ] Each tool links to correct tool page
- [ ] Descriptions are accurate
- [ ] Category description matches PRD

**Validation:**
```bash
npm run build
# Manual: Visit /tools/naming-conventions
```

---

### Ticket 4.2: Encoding Category Page
**Type:** Page
**Files:** `lib/tools/categories/encoding.ts`

**Description:**
Define and implement the Encoding/Decoding category with all 16 tools.

**Tools (16):**
1. Base64 Encode
2. Base64 Decode
3. Base32 Encode
4. Base32 Decode
5. URL Encode
6. URL Decode
7. HTML Encode
8. HTML Decode
9. Binary to Text
10. Text to Binary
11. Hex to Text
12. Text to Hex
13. UTF-8 Encode
14. UTF-8 Decode
15. ASCII to Text
16. Text to ASCII

**Tasks:**
1. Define category metadata
2. Define all 16 tool entries
3. Map each to transformation function
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 16 tools
- [ ] Each tool links correctly
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/encoding
```

---

### Ticket 4.3: Crypto Category Page
**Type:** Page
**Files:** `lib/tools/categories/crypto.ts`

**Description:**
Define and implement the Cryptography & Hashing category with all 13 tools.

**Tools (13):**
1. MD5 Hash Generator
2. SHA-1 Hash Generator
3. SHA-256 Hash Generator
4. SHA-512 Hash Generator
5. UUID v4 Generator
6. ULID Generator
7. NanoID Generator
8. JWT Decoder
9. HMAC-SHA256 Generator
10. Bcrypt Hash Generator
11. Unix Timestamp to Date
12. Date to Unix Timestamp
13. CRC32 Checksum

**Tasks:**
1. Define category metadata
2. Define all 13 tool entries
3. Mark async tools appropriately
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 13 tools
- [ ] Async tools handled correctly
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/crypto
```

---

### Ticket 4.4: Formatters Category Page
**Type:** Page
**Files:** `lib/tools/categories/formatters.ts`

**Description:**
Define and implement the Code Formatters category with all 18 tools.

**Tools (18):**
1. JSON Formatter
2. JSON Minifier
3. SQL Formatter
4. SQL Minifier
5. XML Formatter
6. XML Minifier
7. CSS Formatter
8. CSS Minifier
9. JavaScript Formatter
10. JavaScript Minifier
11. HTML Formatter
12. HTML Minifier
13. YAML Formatter
14. JSON to YAML
15. YAML to JSON
16. Markdown to HTML
17. HTML to Markdown
18. cURL to Code (with target language option)

**Tasks:**
1. Define category metadata
2. Define all 18 tool entries
3. Configure cURL tool with language options
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 18 tools
- [ ] cURL tool has language selector
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/formatters
```

---

### Ticket 4.5: Converters Category Page
**Type:** Page
**Files:** `lib/tools/categories/converters.ts`

**Description:**
Define and implement the Data Converters category with all 10 tools.

**Tools (10):**
1. CSV to JSON
2. JSON to CSV
3. XML to JSON
4. JSON to XML
5. Markdown to HTML (alias)
6. HTML to Markdown (alias)
7. cURL to JavaScript
8. cURL to Python
9. cURL to PHP
10. Number Base Converter

**Tasks:**
1. Define category metadata
2. Define all 10 tool entries
3. Handle aliased tools (link to formatters or duplicate)
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 10 tools
- [ ] Aliased tools work correctly
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/converters
```

---

### Ticket 4.6: Colors Category Page
**Type:** Page
**Files:** `lib/tools/categories/colors.ts`

**Description:**
Define and implement the Color Utilities category with all 12 tools.

**Tools (12):**
1. HEX to RGB
2. RGB to HEX
3. HEX to HSL
4. HSL to HEX
5. Decimal to HEX Color
6. HEX to Decimal Color
7. HEX to RGBA
8. Random Color Generator
9. Complementary Color Finder
10. HEX to CSS Variable
11. Color Parser
12. Color Palette Generator (if implemented)

**Tasks:**
1. Define category metadata
2. Define all 12 tool entries
3. Add color preview feature flag
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 12 tools
- [ ] Descriptions accurate
- [ ] Color tools have preview (future)

**Validation:**
```bash
npm run build
# Manual: Visit /tools/colors
```

---

### Ticket 4.7: Generators Category Page
**Type:** Page
**Files:** `lib/tools/categories/generators.ts`

**Description:**
Define and implement the Random Generators category with all 15 tools.

**Tools (15):**
1. Password Generator
2. IPv4 Address Generator
3. IPv6 Address Generator
4. MAC Address Generator
5. Random String Generator
6. Lorem Ipsum Generator
7. Random Date Generator
8. Random Email Generator
9. Random Username Generator
10. Random Phone Generator
11. Test Credit Card Generator
12. Slug Generator
13. API Key Generator
14. UUID Generator (alias)
15. ULID Generator (alias)

**Tasks:**
1. Define category metadata
2. Define all 15 tool entries
3. Configure options for generators (length, format, etc.)
4. Handle aliased tools
5. Add SEO keywords
6. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 15 tools
- [ ] Generator options configurable
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/generators
```

---

### Ticket 4.8: Ciphers Category Page
**Type:** Page
**Files:** `lib/tools/categories/ciphers.ts`

**Description:**
Define and implement the Ciphers & Encoding category with all 15 tools.

**Tools (15):**
1. Caesar Cipher Encode
2. Caesar Cipher Decode
3. ROT13
4. ROT47
5. Atbash Cipher
6. Text to Morse Code
7. Morse Code to Text
8. Vigenère Cipher Encode
9. Vigenère Cipher Decode
10. NATO Phonetic Alphabet
11. Pig Latin
12. Reverse Words
13. Reverse String
14. XOR Cipher
15. Substitution Cipher

**Tasks:**
1. Define category metadata
2. Define all 15 tool entries
3. Configure options (shift for Caesar, key for Vigenère)
4. Add SEO keywords
5. Verify tools render

**Acceptance Criteria:**
- [ ] Category page shows 15 tools
- [ ] Cipher options configurable
- [ ] Descriptions accurate

**Validation:**
```bash
npm run build
# Manual: Visit /tools/ciphers
```

---

### Ticket 4.9: Category Page SEO Metadata
**Type:** SEO
**Files:** All category page files

**Description:**
Add comprehensive SEO metadata to all category pages.

**Tasks:**
1. Add unique title for each category
2. Add meta description (150-160 chars)
3. Add Open Graph tags
4. Add canonical URLs
5. Add JSON-LD structured data

**Acceptance Criteria:**
- [ ] All 8 categories have unique titles
- [ ] Meta descriptions present
- [ ] OG tags configured
- [ ] Structured data validates

**Validation:**
```bash
npm run build
# Manual: Check page source for meta tags
# Use Google Rich Results Test for structured data
```

---

### Ticket 4.10: Category Page Tests
**Type:** Testing
**Files:** `__tests__/pages/categories.test.tsx`

**Description:**
Write tests for all category pages.

**Tasks:**
1. Test each category page renders
2. Verify tool counts match expected
3. Test category metadata is correct
4. Test invalid category returns 404

**Acceptance Criteria:**
- [ ] All 8 category pages tested
- [ ] Tool counts verified
- [ ] 404 handling tested
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- pages/categories
```

---

## Sprint 5: Tool Pages - Batch 1

### Goal
Implement individual tool pages for the first 4 categories (61 tools total: 14 naming + 16 encoding + 13 crypto + 18 formatters). Each tool should have a fully functional transformation interface.

### Demo Criteria
- All 61 tools in first 4 categories functional
- Transformations work correctly
- Options configurable where applicable
- Copy/clear functionality works

---

### Ticket 5.1: Naming Convention Tool Pages (14 tools)
**Type:** Pages
**Files:** Tool page implementations for naming-conventions category

**Description:**
Implement all 14 individual tool pages for naming conventions.

**Tools to Implement:**
1. `/tools/naming-conventions/camel-case`
2. `/tools/naming-conventions/pascal-case`
3. `/tools/naming-conventions/snake-case`
4. `/tools/naming-conventions/screaming-snake-case`
5. `/tools/naming-conventions/kebab-case`
6. `/tools/naming-conventions/train-case`
7. `/tools/naming-conventions/dot-case`
8. `/tools/naming-conventions/path-case`
9. `/tools/naming-conventions/namespace-case`
10. `/tools/naming-conventions/ada-case`
11. `/tools/naming-conventions/cobol-case`
12. `/tools/naming-conventions/flat-case`
13. `/tools/naming-conventions/upper-flat-case`
14. `/tools/naming-conventions/detect-convention`

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add tool-specific placeholder text
3. Add examples in description
4. Configure any options
5. Test transformation works

**Acceptance Criteria:**
- [ ] All 14 tools render
- [ ] All transformations work correctly
- [ ] Pages have correct metadata
- [ ] Copy functionality works

**Validation:**
```bash
npm run build
# Manual: Test each tool with sample input
```

---

### Ticket 5.2: Encoding Tool Pages (16 tools)
**Type:** Pages
**Files:** Tool page implementations for encoding category

**Description:**
Implement all 16 individual tool pages for encoding/decoding.

**Tools to Implement:**
1. `/tools/encoding/base64-encode`
2. `/tools/encoding/base64-decode`
3. `/tools/encoding/base32-encode`
4. `/tools/encoding/base32-decode`
5. `/tools/encoding/url-encode`
6. `/tools/encoding/url-decode`
7. `/tools/encoding/html-encode`
8. `/tools/encoding/html-decode`
9. `/tools/encoding/binary-to-text`
10. `/tools/encoding/text-to-binary`
11. `/tools/encoding/hex-to-text`
12. `/tools/encoding/text-to-hex`
13. `/tools/encoding/utf8-encode`
14. `/tools/encoding/utf8-decode`
15. `/tools/encoding/ascii-to-text`
16. `/tools/encoding/text-to-ascii`

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add encoding-specific placeholders
3. Add examples
4. Test roundtrip where applicable

**Acceptance Criteria:**
- [ ] All 16 tools render
- [ ] All transformations work
- [ ] Encode/decode pairs work together
- [ ] Copy functionality works

**Validation:**
```bash
npm run build
# Manual: Test encode/decode roundtrips
```

---

### Ticket 5.3: Crypto Tool Pages (13 tools)
**Type:** Pages
**Files:** Tool page implementations for crypto category

**Description:**
Implement all 13 individual tool pages for crypto/hashing.

**Tools to Implement:**
1. `/tools/crypto/md5-hash`
2. `/tools/crypto/sha1-hash`
3. `/tools/crypto/sha256-hash`
4. `/tools/crypto/sha512-hash`
5. `/tools/crypto/uuid-generator`
6. `/tools/crypto/ulid-generator`
7. `/tools/crypto/nanoid-generator`
8. `/tools/crypto/jwt-decoder`
9. `/tools/crypto/hmac-sha256`
10. `/tools/crypto/bcrypt-hash`
11. `/tools/crypto/unix-to-date`
12. `/tools/crypto/date-to-unix`
13. `/tools/crypto/crc32-checksum`

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Handle async functions (loading state)
3. Add "Generate" button for generators
4. Add options (key for HMAC, length for NanoID)
5. Test async operations

**Acceptance Criteria:**
- [ ] All 13 tools render
- [ ] Async operations show loading
- [ ] Generators produce valid output
- [ ] JWT decoder handles invalid tokens gracefully

**Validation:**
```bash
npm run build
# Manual: Test hash generation, verify UUID format
```

---

### Ticket 5.4: Formatter Tool Pages (18 tools)
**Type:** Pages
**Files:** Tool page implementations for formatters category

**Description:**
Implement all 18 individual tool pages for code formatters.

**Tools to Implement:**
1. `/tools/formatters/json-format`
2. `/tools/formatters/json-minify`
3. `/tools/formatters/sql-format`
4. `/tools/formatters/sql-minify`
5. `/tools/formatters/xml-format`
6. `/tools/formatters/xml-minify`
7. `/tools/formatters/css-format`
8. `/tools/formatters/css-minify`
9. `/tools/formatters/javascript-format`
10. `/tools/formatters/javascript-minify`
11. `/tools/formatters/html-format`
12. `/tools/formatters/html-minify`
13. `/tools/formatters/yaml-format`
14. `/tools/formatters/json-to-yaml`
15. `/tools/formatters/yaml-to-json`
16. `/tools/formatters/markdown-to-html`
17. `/tools/formatters/html-to-markdown`
18. `/tools/formatters/curl-to-code`

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add code-specific monospace styling
3. Add syntax highlighting (future)
4. Add indent size option where applicable
5. Add language selector for cURL

**Acceptance Criteria:**
- [ ] All 18 tools render
- [ ] Format/minify work correctly
- [ ] cURL shows language options
- [ ] Error handling for invalid input

**Validation:**
```bash
npm run build
# Manual: Test with valid/invalid JSON, SQL, etc.
```

---

### Ticket 5.5: Batch 1 Tool Page Tests
**Type:** Testing
**Files:** `__tests__/pages/tools-batch1.test.tsx`

**Description:**
Write tests for all 61 tool pages in batch 1 (first 4 categories).

**Tasks:**
1. Test each tool page renders
2. Test transformation function is wired correctly
3. Test options render when applicable
4. Test error states for invalid input

**Acceptance Criteria:**
- [ ] All 61 tools have basic render tests
- [ ] Key transformations tested end-to-end
- [ ] Error handling verified
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- pages/tools-batch1
```

---

## Sprint 6: Tool Pages - Batch 2

### Goal
Implement individual tool pages for the remaining 4 categories (50+ tools). Complete all 111 tool pages.

### Demo Criteria
- All 111 tools functional
- Full site navigation works
- All transformations tested
- Ready for feature additions

---

### Ticket 6.1: Converter Tool Pages (10 tools)
**Type:** Pages
**Files:** Tool page implementations for converters category

**Description:**
Implement all 10 individual tool pages for data converters.

**Tools to Implement:**
1. `/tools/converters/csv-to-json`
2. `/tools/converters/json-to-csv`
3. `/tools/converters/xml-to-json`
4. `/tools/converters/json-to-xml`
5. `/tools/converters/curl-to-javascript`
6. `/tools/converters/curl-to-python`
7. `/tools/converters/curl-to-php`
8. `/tools/converters/number-base-converter`
9. (Markdown/HTML tools may be aliases)

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add file upload option (future)
3. Add download option for output
4. Test with various input formats

**Acceptance Criteria:**
- [ ] All 10 tools render
- [ ] CSV/JSON roundtrip works
- [ ] cURL generates valid code
- [ ] Error handling for malformed input

**Validation:**
```bash
npm run build
# Manual: Test CSV/JSON conversions
```

---

### Ticket 6.2: Color Tool Pages (12 tools)
**Type:** Pages
**Files:** Tool page implementations for colors category

**Description:**
Implement all 12 individual tool pages for color utilities.

**Tools to Implement:**
1. `/tools/colors/hex-to-rgb`
2. `/tools/colors/rgb-to-hex`
3. `/tools/colors/hex-to-hsl`
4. `/tools/colors/hsl-to-hex`
5. `/tools/colors/decimal-to-hex`
6. `/tools/colors/hex-to-decimal`
7. `/tools/colors/hex-to-rgba`
8. `/tools/colors/random-color`
9. `/tools/colors/complementary-color`
10. `/tools/colors/hex-to-css-variable`
11. `/tools/colors/color-parser`
12. `/tools/colors/color-palette` (if implemented)

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add color preview component
3. Add color picker input (future)
4. Show all format outputs where applicable

**Acceptance Criteria:**
- [ ] All 12 tools render
- [ ] Color preview shows actual color
- [ ] Conversions mathematically correct
- [ ] Random generator produces valid colors

**Validation:**
```bash
npm run build
# Manual: Verify colors display correctly
```

---

### Ticket 6.3: Generator Tool Pages (15 tools)
**Type:** Pages
**Files:** Tool page implementations for generators category

**Description:**
Implement all 15 individual tool pages for random generators.

**Tools to Implement:**
1. `/tools/generators/password`
2. `/tools/generators/ipv4`
3. `/tools/generators/ipv6`
4. `/tools/generators/mac-address`
5. `/tools/generators/random-string`
6. `/tools/generators/lorem-ipsum`
7. `/tools/generators/random-date`
8. `/tools/generators/random-email`
9. `/tools/generators/random-username`
10. `/tools/generators/random-phone`
11. `/tools/generators/test-credit-card`
12. `/tools/generators/slug`
13. `/tools/generators/api-key`
14. `/tools/generators/uuid` (alias or dedicated)
15. `/tools/generators/ulid` (alias or dedicated)

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add "Generate" button (primary action)
3. Add configuration options per generator
4. Add "Generate Multiple" option
5. Add copy functionality

**Acceptance Criteria:**
- [ ] All 15 tools render
- [ ] Generate button produces output
- [ ] Options affect output correctly
- [ ] Credit card passes Luhn check

**Validation:**
```bash
npm run build
# Manual: Generate and verify formats
```

---

### Ticket 6.4: Cipher Tool Pages (15 tools)
**Type:** Pages
**Files:** Tool page implementations for ciphers category

**Description:**
Implement all 15 individual tool pages for ciphers.

**Tools to Implement:**
1. `/tools/ciphers/caesar-encode`
2. `/tools/ciphers/caesar-decode`
3. `/tools/ciphers/rot13`
4. `/tools/ciphers/rot47`
5. `/tools/ciphers/atbash`
6. `/tools/ciphers/text-to-morse`
7. `/tools/ciphers/morse-to-text`
8. `/tools/ciphers/vigenere-encode`
9. `/tools/ciphers/vigenere-decode`
10. `/tools/ciphers/nato-phonetic`
11. `/tools/ciphers/pig-latin`
12. `/tools/ciphers/reverse-words`
13. `/tools/ciphers/reverse-string`
14. `/tools/ciphers/xor-cipher`
15. `/tools/ciphers/substitution-cipher`

**Tasks per Tool:**
1. Wire TransformPanel to correct function
2. Add shift/key options where needed
3. Add reference charts (Morse alphabet, etc.)
4. Test encode/decode roundtrips

**Acceptance Criteria:**
- [ ] All 15 tools render
- [ ] Cipher options work (shift, key)
- [ ] Self-inverse ciphers verified
- [ ] Morse/NATO alphabets complete

**Validation:**
```bash
npm run build
# Manual: Test encode/decode roundtrips
```

---

### Ticket 6.5: Batch 2 Tool Page Tests
**Type:** Testing
**Files:** `__tests__/pages/tools-batch2.test.tsx`

**Description:**
Write tests for all tool pages in batch 2 (remaining 4 categories).

**Tasks:**
1. Test each tool page renders
2. Test transformation functions wired correctly
3. Test options render when applicable
4. Test generators produce valid output

**Acceptance Criteria:**
- [ ] All batch 2 tools have tests
- [ ] Key transformations tested
- [ ] Generator output validated
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- pages/tools-batch2
```

---

### Ticket 6.6: Full Site Build Verification
**Type:** QA
**Files:** N/A (verification task)

**Description:**
Verify the complete site builds and all 111 tool pages are accessible.

**Tasks:**
1. Run production build
2. Verify all 119 routes generate (8 categories + 111 tools)
3. Test navigation through entire site
4. Verify no console errors
5. Check for missing pages or broken links

**Acceptance Criteria:**
- [ ] `npm run build` succeeds
- [ ] All routes accessible
- [ ] No console errors
- [ ] No broken internal links

**Validation:**
```bash
npm run build
npm start
# Manual: Navigate through all categories and tools
```

---

## Sprint 7: Search, UX Features & Security

### Goal
Implement search functionality, keyboard shortcuts, clipboard integration, user experience improvements, and conduct security audit.

### Demo Criteria
- Search finds tools by name and keywords
- Cmd/Ctrl+K opens search
- Recent tools history persists
- Clipboard copy works everywhere
- Security audit completed with no critical issues

---

### Ticket 7.1: Search Index Generation
**Type:** Feature
**Files:** `lib/search/index.ts`, `lib/search/searchIndex.ts`

**Description:**
Create a search index for all tools enabling fast client-side search.

**Tasks:**
1. Create search index data structure
2. Index tool names, descriptions, keywords
3. Index category names
4. Create search scoring algorithm
5. Export searchable index

**Index Structure:**
```typescript
interface SearchItem {
  id: string;
  type: 'tool' | 'category';
  name: string;
  description: string;
  keywords: string[];
  slug: string;
  categorySlug?: string;
  score?: number;
}
```

**Acceptance Criteria:**
- [ ] All 111 tools indexed
- [ ] All 8 categories indexed
- [ ] Search returns relevant results
- [ ] Index is type-safe

**Validation:**
```bash
npm run typecheck
# Write test: search("base64") returns encoding tools
```

---

### Ticket 7.2: Search Function Implementation
**Type:** Feature
**Files:** `lib/search/search.ts`

**Description:**
Implement the search function with fuzzy matching and relevance scoring.

**Tasks:**
1. Implement exact match search
2. Implement fuzzy/partial match
3. Implement relevance scoring
4. Support search by category filter
5. Return top N results

**Function Signature:**
```typescript
function search(
  query: string,
  options?: {
    limit?: number;
    category?: string;
    type?: 'tool' | 'category' | 'all';
  }
): SearchResult[];
```

**Acceptance Criteria:**
- [ ] Exact matches ranked highest
- [ ] Partial matches work
- [ ] Category filter works
- [ ] Results limited correctly
- [ ] Performance acceptable (<50ms)

**Validation:**
```bash
npm test -- search
```

---

### Ticket 7.3: Search Modal Component
**Type:** Component
**Files:** `components/search/SearchModal.tsx`

**Description:**
Create the command palette style search modal.

**Tasks:**
1. Create modal overlay
2. Add search input with icon
3. Display search results
4. Keyboard navigation (up/down arrows)
5. Enter to select result
6. Escape to close
7. Show recent searches

**Acceptance Criteria:**
- [ ] Modal opens/closes correctly
- [ ] Search results update as typing
- [ ] Keyboard navigation works
- [ ] Selecting navigates to tool
- [ ] Recent searches shown when empty

**Validation:**
```bash
npm run typecheck
# Manual: Test modal interaction
```

---

### Ticket 7.4: Keyboard Shortcuts
**Type:** Feature
**Files:** `hooks/useKeyboardShortcuts.ts`, update `app/layout.tsx`

**Description:**
Implement global keyboard shortcuts for the application.

**Shortcuts:**
- `Cmd/Ctrl + K` - Open search
- `Cmd/Ctrl + /` - Focus input (on tool page)
- `Escape` - Close modal/clear
- `Cmd/Ctrl + Enter` - Transform (on tool page)
- `Cmd/Ctrl + Shift + C` - Copy output

**Tasks:**
1. Create useKeyboardShortcuts hook
2. Register global shortcuts in layout
3. Register page-specific shortcuts
4. Show shortcut hints in UI
5. Handle modifier keys cross-platform

**Acceptance Criteria:**
- [ ] All shortcuts work
- [ ] Shortcuts shown in UI
- [ ] Work on Mac and Windows
- [ ] Don't conflict with browser shortcuts

**Validation:**
```bash
# Manual: Test all shortcuts on Mac/Windows
```

---

### Ticket 7.5: Clipboard Integration
**Type:** Feature
**Files:** `hooks/useClipboard.ts`, update TransformPanel

**Description:**
Implement robust clipboard copy/paste functionality.

**Tasks:**
1. Create useClipboard hook
2. Implement copy with fallback for older browsers
3. Show copy success feedback
4. Add paste from clipboard button
5. Handle clipboard permissions

**Hook Interface:**
```typescript
function useClipboard(): {
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string | null>;
  isCopied: boolean;
  isSupported: boolean;
};
```

**Acceptance Criteria:**
- [ ] Copy works in all browsers
- [ ] Success feedback shown
- [ ] Paste works where supported
- [ ] Graceful fallback for unsupported

**Validation:**
```bash
# Manual: Test copy/paste in Chrome, Firefox, Safari
```

---

### Ticket 7.6: Recent Tools History
**Type:** Feature
**Files:** `hooks/useRecentTools.ts`, update Sidebar

**Description:**
Track and display recently used tools in localStorage.

**Tasks:**
1. Create useRecentTools hook
2. Store last 10 tools used
3. Persist in localStorage
4. Display in sidebar
5. Display in search modal (recent section)

**Hook Interface:**
```typescript
function useRecentTools(): {
  recentTools: Tool[];
  addRecentTool: (tool: Tool) => void;
  clearRecentTools: () => void;
};
```

**Acceptance Criteria:**
- [ ] Recent tools tracked
- [ ] Persists across sessions
- [ ] Shows in sidebar
- [ ] Max 10 tools stored
- [ ] Most recent first

**Validation:**
```bash
# Manual: Use tools, refresh, verify history persists
```

---

### Ticket 7.7: Favorites/Bookmarks
**Type:** Feature
**Files:** `hooks/useFavorites.ts`, update ToolCard

**Description:**
Allow users to bookmark favorite tools.

**Tasks:**
1. Create useFavorites hook
2. Add favorite button to tool pages
3. Store favorites in localStorage
4. Show favorites section in sidebar
5. Filter by favorites in search

**Hook Interface:**
```typescript
function useFavorites(): {
  favorites: string[]; // tool IDs
  isFavorite: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => void;
  clearFavorites: () => void;
};
```

**Acceptance Criteria:**
- [ ] Can add/remove favorites
- [ ] Persists across sessions
- [ ] Shows in sidebar
- [ ] Heart icon toggles state

**Validation:**
```bash
# Manual: Favorite tools, verify persistence
```

---

### Ticket 7.8: Download Output Feature
**Type:** Feature
**Files:** `hooks/useDownload.ts`, update TransformPanel

**Description:**
Allow users to download transformation output as a file.

**Tasks:**
1. Create useDownload hook
2. Add download button to output panel
3. Detect appropriate file extension
4. Generate filename from tool name
5. Handle large outputs

**Hook Interface:**
```typescript
function useDownload(): {
  download: (content: string, filename: string, mimeType?: string) => void;
};
```

**Acceptance Criteria:**
- [ ] Download button works
- [ ] Correct file extension used
- [ ] Filename includes tool name
- [ ] Works with large content

**Validation:**
```bash
# Manual: Download output, verify file contents
```

---

### Ticket 7.9: Share Tool Link
**Type:** Feature
**Files:** Update tool pages

**Description:**
Add ability to share a pre-filled tool link.

**Tasks:**
1. Add share button to tool pages
2. Encode input in URL query param (optional, for small inputs)
3. Copy shareable link to clipboard
4. Show share success message
5. Handle URL input on page load

**Acceptance Criteria:**
- [ ] Share button copies link
- [ ] Link navigates to correct tool
- [ ] Pre-filled input works (if enabled)
- [ ] Long inputs handled gracefully

**Validation:**
```bash
# Manual: Share link, open in incognito, verify
```

---

### Ticket 7.10: Security Audit
**Type:** Security
**Files:** Various
**Priority:** HIGH

**Description:**
Conduct comprehensive security audit focusing on XSS prevention, input validation, and secure coding practices.

**Audit Areas:**
1. XSS vulnerabilities in HTML/Markdown converters
2. Input validation completeness
3. CSP header configuration
4. Secure error handling (no information leakage)
5. Third-party dependency audit

**Tasks:**
1. Review all transformation functions for XSS vectors
2. Test HTML/Markdown output with malicious payloads
3. Verify input size limits are enforced everywhere
4. Add CSP headers to Next.js config
5. Run `npm audit` and fix vulnerabilities
6. Review error messages for information leakage
7. Document security considerations for each tool category

**XSS Test Payloads:**
```
<script>alert('xss')</script>
<img src=x onerror=alert('xss')>
javascript:alert('xss')
<svg onload=alert('xss')>
```

**Acceptance Criteria:**
- [ ] No XSS vulnerabilities in HTML/Markdown output
- [ ] All inputs validated before processing
- [ ] CSP headers configured
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Error messages don't reveal system internals
- [ ] Security documentation created

**Validation Command:**
```bash
npm audit
# Manual: Test XSS payloads in HTML/Markdown tools
# Manual: Verify CSP headers in browser DevTools
```

---

### Ticket 7.11: UX Feature Tests
**Type:** Testing
**Files:** `__tests__/features/*.test.tsx`

**Description:**
Write tests for all UX features.

**Tasks:**
1. Test search functionality
2. Test keyboard shortcuts
3. Test clipboard operations
4. Test recent tools persistence
5. Test favorites persistence

**Acceptance Criteria:**
- [ ] Search tests pass
- [ ] Keyboard shortcut tests pass
- [ ] Clipboard mock tests pass
- [ ] localStorage mock tests pass
- [ ] All tests pass

**Validation Command:**
```bash
npm test -- features
```

---

## Sprint 8: Polish & Accessibility

### Goal
Optimize performance, ensure WCAG 2.1 AA compliance, and polish the user experience.

### Demo Criteria
- Lighthouse score 90+ on all metrics
- WCAG 2.1 AA compliant
- Mobile experience polished
- Loading states smooth

---

### Ticket 8.1: Lighthouse Audit & Fixes
**Type:** Performance
**Files:** Various

**Description:**
Run Lighthouse audit and fix all issues to achieve 90+ scores.

**Metrics to Optimize:**
- Performance (90+)
- Accessibility (100)
- Best Practices (100)
- SEO (100)

**Tasks:**
1. Run Lighthouse audit on homepage
2. Run on category pages
3. Run on tool pages
4. Document all issues
5. Fix performance issues (images, fonts, etc.)
6. Fix accessibility issues
7. Fix SEO issues
8. Re-run and verify 90+

**Acceptance Criteria:**
- [ ] Homepage 90+ all metrics
- [ ] Category pages 90+ all metrics
- [ ] Tool pages 90+ all metrics
- [ ] No critical issues remaining

**Validation:**
```bash
# Run Lighthouse in Chrome DevTools
# Or: npm run lighthouse (if script added)
```

---

### Ticket 8.2: Image Optimization
**Type:** Performance
**Files:** `public/`, `next.config.ts`

**Description:**
Optimize all images and implement lazy loading.

**Tasks:**
1. Audit all images in public/
2. Convert to WebP format
3. Create multiple sizes for responsive
4. Implement Next.js Image component
5. Add blur placeholders
6. Configure image optimization in next.config

**Acceptance Criteria:**
- [ ] All images optimized
- [ ] WebP format used
- [ ] Lazy loading implemented
- [ ] Blur placeholders show
- [ ] LCP improved

**Validation:**
```bash
npm run build
# Check build output for image optimization
```

---

### Ticket 8.3: Font Optimization
**Type:** Performance
**Files:** `app/layout.tsx`, font files

**Description:**
Optimize font loading to prevent FOUT/FOIT.

**Tasks:**
1. Use next/font for font loading
2. Subset fonts to needed characters
3. Add font-display: swap
4. Preload critical fonts
5. Remove unused font weights

**Acceptance Criteria:**
- [ ] Fonts load without flash
- [ ] Font files minimal size
- [ ] Preloading configured
- [ ] CLS minimized

**Validation:**
```bash
npm run build
# Check network tab for font loading
```

---

### Ticket 8.4: Bundle Size Optimization
**Type:** Performance
**Files:** `next.config.ts`, imports

**Description:**
Analyze and reduce bundle size.

**Tasks:**
1. Run bundle analyzer
2. Identify large dependencies (should be none)
3. Implement code splitting
4. Lazy load non-critical components
5. Tree shake unused exports

**Acceptance Criteria:**
- [ ] Bundle analyzer report generated
- [ ] No unexpected large modules
- [ ] Code splitting working
- [ ] Initial bundle < 100KB

**Validation:**
```bash
npm run build
# Check .next/analyze/ (if configured)
```

---

### Ticket 8.5: Accessibility Audit
**Type:** Accessibility
**Files:** Various components

**Description:**
Perform full accessibility audit and fix all issues.

**Audit Areas:**
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management
- ARIA labels
- Form labels
- Skip links

**Tasks:**
1. Run axe DevTools audit
2. Test with keyboard only
3. Test with screen reader (VoiceOver/NVDA)
4. Document all issues
5. Fix all A and AA violations
6. Add skip to content link
7. Verify focus trapping in modals

**Acceptance Criteria:**
- [ ] Zero A violations
- [ ] Zero AA violations
- [ ] Keyboard navigation complete
- [ ] Screen reader announces correctly
- [ ] Skip link works

**Validation:**
```bash
# Run axe DevTools in browser
# Manual: Keyboard and screen reader testing
```

---

### Ticket 8.6: Focus Management
**Type:** Accessibility
**Files:** Components with interactive elements

**Description:**
Implement proper focus management throughout the app.

**Tasks:**
1. Add visible focus indicators
2. Implement focus trap for modals
3. Return focus after modal close
4. Skip repetitive navigation
5. Focus first input on tool pages

**Acceptance Criteria:**
- [ ] Focus visible on all interactive elements
- [ ] Modal traps focus
- [ ] Focus returns on modal close
- [ ] Skip link bypasses nav

**Validation:**
```bash
# Manual: Tab through entire application
```

---

### Ticket 8.7: Mobile Polish
**Type:** UX
**Files:** Various components, CSS

**Description:**
Polish the mobile experience.

**Tasks:**
1. Test all pages on mobile viewport
2. Fix any overflow issues
3. Optimize touch targets (min 44x44px)
4. Test mobile navigation
5. Test input/output panels on mobile
6. Verify no horizontal scroll

**Acceptance Criteria:**
- [ ] All pages usable on mobile
- [ ] No horizontal overflow
- [ ] Touch targets accessible
- [ ] Mobile nav works
- [ ] Transformation panels usable

**Validation:**
```bash
# Manual: Test on actual mobile device
# Chrome DevTools device emulation
```

---

### Ticket 8.8: Loading States
**Type:** UX
**Files:** Various components

**Description:**
Implement polished loading states throughout the app.

**Tasks:**
1. Add skeleton loaders for tool cards
2. Add loading state for search results
3. Add spinner for async transformations
4. Add page transition loading
5. Ensure no layout shift during load

**Acceptance Criteria:**
- [ ] Skeleton loaders show during data load
- [ ] Async operations show spinner
- [ ] No layout shift (CLS < 0.1)
- [ ] Loading states accessible

**Validation:**
```bash
# Manual: Throttle network, verify loading states
```

---

### Ticket 8.9: Error Boundaries
**Type:** Stability
**Files:** `components/ErrorBoundary.tsx`, `app/error.tsx`

**Description:**
Implement error boundaries to catch and handle errors gracefully.

**Tasks:**
1. Create ErrorBoundary component
2. Create app/error.tsx for route errors
3. Add error recovery options
4. Log errors (console in dev)
5. Show user-friendly error message

**Acceptance Criteria:**
- [ ] Errors caught and displayed
- [ ] App doesn't crash completely
- [ ] Recovery option available
- [ ] Error details in dev mode

**Validation:**
```bash
# Manual: Trigger error, verify boundary catches it
```

---

### Ticket 8.10: Accessibility & Performance Tests
**Type:** Testing
**Files:** `__tests__/a11y/*.test.tsx`

**Description:**
Write automated accessibility tests.

**Tasks:**
1. Install jest-axe
2. Write axe tests for key pages
3. Test keyboard navigation
4. Test focus management
5. Add to CI pipeline

**Acceptance Criteria:**
- [ ] axe tests pass for all pages
- [ ] No accessibility regressions
- [ ] Tests run in CI

**Validation Command:**
```bash
npm test -- a11y
```

---

## Sprint 9: Deployment

### Goal
Deploy the application to production with CI/CD pipeline, monitoring, and analytics.

### Demo Criteria
- Site live on production domain
- CI/CD pipeline running
- Analytics collecting data
- SSL configured

---

### Ticket 9.1: GitHub Repository Setup
**Type:** Infrastructure
**Files:** `.github/`, repository settings

**Description:**
Create and configure GitHub repository.

**Tasks:**
1. Create GitHub repository (if not exists)
2. Push codebase
3. Configure branch protection for main
4. Add CODEOWNERS file
5. Add PR template
6. Add issue templates

**Acceptance Criteria:**
- [ ] Repository created
- [ ] Code pushed
- [ ] Branch protection enabled
- [ ] Templates configured

**Validation:**
```bash
git remote -v
# Verify remote points to GitHub
```

---

### Ticket 9.2: CI Pipeline (GitHub Actions)
**Type:** Infrastructure
**Files:** `.github/workflows/ci.yml`

**Description:**
Set up continuous integration pipeline.

**Tasks:**
1. Create CI workflow file
2. Run on push to main and PRs
3. Run linting
4. Run type checking
5. Run tests
6. Run build
7. Cache dependencies

**Workflow Steps:**
```yaml
- Checkout
- Setup Node.js
- Install dependencies
- Run lint
- Run typecheck
- Run tests
- Run build
```

**Acceptance Criteria:**
- [ ] Workflow runs on push
- [ ] All checks must pass
- [ ] Caching working
- [ ] Badge added to README

**Validation:**
```bash
# Push to main, verify Actions run
```

---

### Ticket 9.3: Railway Project Setup
**Type:** Infrastructure
**Files:** `railway.toml` (optional)

**Description:**
Set up Railway project for deployment.

**Tasks:**
1. Create Railway account/project
2. Connect GitHub repository
3. Configure build settings
4. Set environment variables
5. Configure auto-deploy on main
6. Set up production environment

**Acceptance Criteria:**
- [ ] Railway project created
- [ ] GitHub connected
- [ ] Auto-deploy configured
- [ ] Preview deploys working

**Validation:**
```bash
# Push to main, verify Railway deploys
```

---

### Ticket 9.4: Domain Configuration
**Type:** Infrastructure
**Files:** DNS settings (external)

**Description:**
Acquire and configure production domain.

**Tasks:**
1. Acquire domain (texttransform.dev or similar)
2. Configure DNS to point to Railway
3. Enable SSL/HTTPS
4. Configure www redirect
5. Update metadata with production URL

**Acceptance Criteria:**
- [ ] Domain acquired
- [ ] DNS configured
- [ ] SSL working
- [ ] www redirects to apex

**Validation:**
```bash
curl -I https://texttransform.dev
# Verify 200 OK and HTTPS
```

---

### Ticket 9.5: Production Environment Variables
**Type:** Infrastructure
**Files:** Railway settings

**Description:**
Configure production environment variables.

**Tasks:**
1. Set NODE_ENV=production
2. Set NEXT_PUBLIC_BASE_URL
3. Set analytics keys (if used)
4. Verify no secrets in code
5. Document required env vars

**Acceptance Criteria:**
- [ ] All env vars set
- [ ] No secrets in code
- [ ] Documentation updated

**Validation:**
```bash
# Verify site works with production vars
```

---

### Ticket 9.6: Analytics Integration
**Type:** Feature
**Files:** `app/layout.tsx`, `lib/analytics.ts`

**Description:**
Integrate Google Analytics 4 for usage tracking.

**Tasks:**
1. Create GA4 property
2. Add GA4 script to layout
3. Create analytics helper functions
4. Track page views
5. Track tool usage events
6. Respect Do Not Track

**Events to Track:**
- Page view
- Tool used (which tool)
- Copy to clipboard
- Download output
- Search performed

**Acceptance Criteria:**
- [ ] GA4 integrated
- [ ] Page views tracked
- [ ] Custom events working
- [ ] DNT respected

**Validation:**
```bash
# Check GA4 Real-time report
```

---

### Ticket 9.7: Error Monitoring (Optional)
**Type:** Feature
**Files:** `lib/errorReporting.ts`

**Description:**
Set up error monitoring with Sentry (optional).

**Tasks:**
1. Create Sentry project
2. Install Sentry SDK
3. Configure error boundaries to report
4. Set up source maps
5. Configure alert rules

**Acceptance Criteria:**
- [ ] Sentry configured
- [ ] Errors reported
- [ ] Source maps uploaded
- [ ] Alerts configured

**Validation:**
```bash
# Trigger error, verify appears in Sentry
```

---

### Ticket 9.8: Robots.txt and Sitemap
**Type:** SEO
**Files:** `public/robots.txt`, `app/sitemap.ts`

**Description:**
Configure SEO files for search engine indexing.

**Tasks:**
1. Create robots.txt allowing all crawlers
2. Generate dynamic sitemap with all pages
3. Include all 119 routes
4. Set proper priorities
5. Submit to Google Search Console

**Acceptance Criteria:**
- [ ] robots.txt accessible
- [ ] Sitemap generates all URLs
- [ ] Submitted to GSC
- [ ] No crawl errors

**Validation:**
```bash
curl https://texttransform.dev/robots.txt
curl https://texttransform.dev/sitemap.xml
```

---

### Ticket 9.9: Launch Checklist
**Type:** QA
**Files:** N/A (verification task)

**Description:**
Final pre-launch verification checklist.

**Checklist:**
1. [ ] All 111 tools working
2. [ ] All tests passing
3. [ ] Lighthouse 90+ all metrics
4. [ ] No console errors
5. [ ] SSL working
6. [ ] Analytics tracking
7. [ ] Sitemap submitted
8. [ ] Error monitoring active
9. [ ] Mobile tested
10. [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

**Acceptance Criteria:**
- [ ] All checklist items verified
- [ ] Sign-off from stakeholder

**Validation:**
```bash
# Manual verification of all items
```

---

### Ticket 9.10: Launch & Monitor
**Type:** Release
**Files:** N/A

**Description:**
Execute production launch and monitor initial performance.

**Tasks:**
1. Merge final changes to main
2. Verify Railway auto-deploys
3. Test production site thoroughly
4. Monitor error rates
5. Monitor performance metrics
6. Check analytics data flowing
7. Document any immediate issues

**Acceptance Criteria:**
- [ ] Site live on production domain
- [ ] No critical errors in first 24h
- [ ] Performance acceptable
- [ ] Analytics collecting data

**Validation:**
```bash
# Monitor Railway logs
# Check GA4 and Sentry dashboards
```

---

## Appendix A: Tool Inventory

### Total: 113 Tools

| Category | Count | Status |
|----------|-------|--------|
| Naming Conventions | 14 | Functions Complete |
| Encoding/Decoding | 16 | Functions Complete |
| Crypto & Hashing | 13 | Functions Complete |
| Code Formatters | 18 | Functions Complete |
| Data Converters | 10 | Functions Complete |
| Color Utilities | 12 | Functions Complete |
| Random Generators | 15 | Functions Complete |
| Ciphers | 15 | Functions Complete |

### Sprint-by-Sprint Progress

| Sprint | Tools Completed | Cumulative |
|--------|-----------------|------------|
| Sprint 1 | 0 (testing) | 0 |
| Sprint 2 | 0 (components) | 0 |
| Sprint 3 | 0 (layout) | 0 |
| Sprint 4 | 0 (categories) | 0 |
| Sprint 5 | 61 (batch 1) | 61 |
| Sprint 6 | 52 (batch 2) | 113 |
| Sprint 7 | 0 (features + security) | 113 |
| Sprint 8 | 0 (polish) | 113 |
| Sprint 9 | 0 (deploy) | 113 |

---

## Appendix B: Review Improvements Applied

This sprint plan was reviewed by a subagent and the following improvements were incorporated:

### Critical Additions
1. **Ticket 1.1b: Browser API Compatibility Audit** - MD5 won't work with Web Crypto API, needs JavaScript implementation
2. **Ticket 1.1c: Error Handling Patterns** - Establish consistent error types before writing tests
3. **Ticket 2.0a: SSR Compatibility Layer** - Prevent hydration mismatches with browser-only APIs
4. **Ticket 2.0b: Input Validation Utilities** - Security-critical XSS and DoS prevention
5. **Ticket 2.0c: State Management Architecture** - Define transform state patterns
6. **Ticket 7.10: Security Audit** - Comprehensive security review

### Task Splits
- **Ticket 3.4** split into 5 atomic tasks (3.4a-3.4e) for tool data configuration

### Corrections
- Fixed Sprint 5 tool count: 52 → 61 tools (14+16+13+18)
- Fixed Sprint 6 tool count: 59 → 52 tools (10+12+15+15)
- Total tools: 111 → 113 (reconciled across documents)

### Added Dependency Graph
- Visual dependency graph showing critical path
- Explicit dependencies between sprints and tickets

### Validation Improvements
- Added automated test requirements for tool counts
- Added security validation criteria
- Added performance test requirements (<50ms for transforms)

---

## Appendix C: Ticket Count Summary

| Sprint | Tickets |
|--------|---------|
| Sprint 1 | 12 (1.1, 1.1b, 1.1c, 1.2-1.10) |
| Sprint 2 | 13 (2.0a-2.0c, 2.1-2.10) |
| Sprint 3 | 10 (3.1-3.3, 3.4a-3.4e, 3.5-3.10) |
| Sprint 4 | 10 (4.1-4.10) |
| Sprint 5 | 5 (5.1-5.5) |
| Sprint 6 | 6 (6.1-6.6) |
| Sprint 7 | 12 (7.1-7.11 + security audit) |
| Sprint 8 | 10 (8.1-8.10) |
| Sprint 9 | 10 (9.1-9.10) |
| **Total** | **88 tickets** |

---

*Document generated for Text Transform project sprint planning.*
*Last reviewed: 2026-01-20*
