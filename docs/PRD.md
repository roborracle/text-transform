# Text Transform - Product Requirements Document

**Version:** 1.0.0
**Last Updated:** January 2026
**Status:** Active Development

---

## Overview

Text Transform is a comprehensive developer-focused text and data transformation toolkit. It provides instant, client-side transformations for common programming tasks including naming convention conversion, encoding/decoding, code formatting, and data format conversion.

**Target Domain:** texttransform.dev (or similar developer-focused domain)
**Related Projects:**
- [CaseChangerPro.com](https://casechangerpro.com) - Writer-focused text tools
- [ColorCodeGuide.com](https://colorcodeguide.com) - Color conversion and palette tools

---

## Core Architecture

### Technology Stack
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 15.5+ |
| Runtime | React | 19.x |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Build | Turbopack | Latest |
| Deployment | Railway | - |

### Design Principles
1. **Client-side processing** - All transformations run in the browser for privacy
2. **Zero dependencies** - Core transformations use no external libraries
3. **Instant feedback** - Real-time transformation as you type
4. **Mobile-first** - Responsive design for all devices
5. **Accessible** - WCAG 2.1 AA compliance

---

## Tool Categories

### 1. Naming Convention Converters (14 tools)
For variable/function name transformations.

| Tool | Example Input | Example Output |
|------|---------------|----------------|
| camelCase | "hello world" | "helloWorld" |
| PascalCase | "hello world" | "HelloWorld" |
| snake_case | "hello world" | "hello_world" |
| SCREAMING_SNAKE | "hello world" | "HELLO_WORLD" |
| kebab-case | "hello world" | "hello-world" |
| Train-Case | "hello world" | "Hello-World" |
| dot.case | "hello world" | "hello.world" |
| path/case | "hello world" | "hello/world" |
| Namespace\Case | "hello world" | "Hello\World" |
| Ada_Case | "hello world" | "Hello_World" |
| COBOL-CASE | "hello world" | "HELLO-WORLD" |
| flatcase | "hello world" | "helloworld" |
| UPPERFLATCASE | "hello world" | "HELLOWORLD" |
| Convention Detector | "helloWorld" | "camelCase" |

### 2. Encoding/Decoding (16 tools)
For data encoding transformations.

| Tool | Direction |
|------|-----------|
| Base64 | Encode/Decode |
| Base32 | Encode/Decode |
| URL Encoding | Encode/Decode |
| HTML Entities | Encode/Decode |
| Binary | To Text/From Text |
| Hexadecimal | To Text/From Text |
| ASCII | To Text/From Text |
| UTF-8 | Encode/Decode |

### 3. Cryptography & Hashing (14 tools)
For security-related transformations.

| Tool | Description |
|------|-------------|
| MD5 Hash | Generate MD5 |
| SHA-1 Hash | Generate SHA-1 |
| SHA-256 Hash | Generate SHA-256 |
| SHA-512 Hash | Generate SHA-512 |
| HMAC-SHA256 | Generate HMAC |
| UUID v4 | Generate UUID |
| ULID | Generate ULID |
| Nano ID | Generate Nano ID |
| JWT Decoder | Decode (not verify) |
| CRC32 Checksum | Generate checksum |
| Unix Timestamp | Convert to/from date |
| Bcrypt Format | Generate hash format |

### 4. Code Formatters (18 tools)
For code beautification and minification.

| Tool | Format/Minify |
|------|---------------|
| JSON | Both |
| SQL | Both |
| XML | Both |
| CSS | Both |
| JavaScript | Both |
| HTML | Both |
| YAML | Format only |
| JSON ↔ YAML | Convert both ways |

### 5. Data Converters (10 tools)
For format conversion between data types.

| Tool | Description |
|------|-------------|
| CSV → JSON | Convert CSV to JSON |
| JSON → CSV | Convert JSON to CSV |
| XML → JSON | Convert XML to JSON |
| JSON → XML | Convert JSON to XML |
| Markdown → HTML | Convert MD to HTML |
| HTML → Markdown | Convert HTML to MD |
| cURL → JavaScript | Generate fetch code |
| cURL → Python | Generate requests code |
| cURL → PHP | Generate cURL code |

### 6. Color Utilities (12 tools)
*Semantically linked to ColorCodeGuide.com*

| Tool | Description |
|------|-------------|
| HEX → RGB | Convert hex to rgb() |
| RGB → HEX | Convert rgb to #hex |
| HEX → HSL | Convert hex to hsl() |
| HSL → HEX | Convert hsl to #hex |
| Decimal → HEX | Convert int to #hex |
| HEX → Decimal | Convert #hex to int |
| HEX → RGBA | Add alpha channel |
| Random Color | Generate random hex |
| Complementary | Get opposite color |
| CSS Variable | Format as custom prop |
| Color Parser | Parse any format |

### 7. Random Generators (15 tools)
For generating test and placeholder data.

| Tool | Description |
|------|-------------|
| Password | Secure passwords |
| UUID | UUID v4 |
| API Key | Prefixed keys |
| IPv4 Address | Random IPs |
| IPv6 Address | Random IPv6 |
| MAC Address | Random MACs |
| Random String | Configurable |
| Lorem Ipsum | Placeholder text |
| Random Date | Date in range |
| Random Email | Test emails |
| Random Username | Usernames |
| Random Phone | Phone numbers |
| Test Credit Card | Luhn-valid cards |
| Random Slug | URL slugs |

### 8. Ciphers (12 tools)
For encoding with classic ciphers.

| Tool | Description |
|------|-------------|
| Caesar Cipher | Shift cipher |
| ROT13 | Symmetric Caesar |
| ROT47 | Extended ROT |
| Atbash | Reverse alphabet |
| Vigenère | Polyalphabetic |
| Morse Code | To/from Morse |
| NATO Phonetic | Letter → word |
| Pig Latin | Word game cipher |
| Reverse Words | Reverse each word |
| Reverse String | Reverse all |
| XOR Cipher | Binary XOR |
| Substitution | Custom alphabet |

---

## Total Tool Count

| Category | Count |
|----------|-------|
| Naming Conventions | 14 |
| Encoding/Decoding | 16 |
| Cryptography | 14 |
| Code Formatters | 18 |
| Data Converters | 10 |
| Color Utilities | 12 |
| Random Generators | 15 |
| Ciphers | 12 |
| **Total** | **111** |

---

## User Experience

### Target Users
1. **Software Developers** - Variable naming, data conversion, encoding
2. **DevOps Engineers** - Configuration formatting, encoding
3. **QA Engineers** - Test data generation, format validation
4. **API Developers** - cURL conversion, JSON handling
5. **Frontend Developers** - Color conversion, CSS formatting

### Key User Flows
1. **Quick Transform**: Paste → Select tool → Copy result
2. **Batch Mode**: Paste multiple lines → Transform all → Export
3. **Format Detection**: Paste data → Auto-detect format → Suggest tools

### UI Components (from CaseChangerPro)
Reuse proven components:
- Universal Text Transformer
- Category navigation
- Dark/light mode toggle
- Copy to clipboard
- Real-time preview
- Tool search

---

## Cross-Project Integration

### ColorCodeGuide.com Link
The Color Utilities category creates a semantic connection:
- HEX ↔ Decimal conversions link to ColorCodeGuide for advanced palette tools
- Users needing deeper color work are directed to the specialized tool
- Shared color conversion algorithms

### CaseChangerPro.com Foundation
This project reuses:
- Universal Text Transformer component architecture
- Transformation engine pattern
- Category/tool organization
- Dark mode implementation
- Accessibility patterns

---

## Development Phases

### Phase 1: Core Infrastructure (Current)
- [x] Project initialization
- [x] Transformation library (111 functions)
- [ ] Universal Transformer component
- [ ] Basic routing and pages
- [ ] Tool category pages

### Phase 2: Full UI
- [ ] All tool pages
- [ ] Search functionality
- [ ] Mobile optimization
- [ ] Accessibility audit

### Phase 3: Polish
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Analytics integration
- [ ] Production deployment

### Phase 4: Future
- [ ] API access
- [ ] Browser extension
- [ ] CLI tool

---

## Technical Specifications

### Performance Targets
- Page load: < 2s
- Transformation: < 50ms
- First Contentful Paint: < 1s
- Lighthouse score: > 90

### Security
- Client-side only processing
- No data transmission
- No tracking cookies
- CSP headers configured

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## File Structure

```
text-transform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── tools/
│       └── [category]/
│           └── [tool]/
│               └── page.tsx
├── components/
│   ├── UniversalTransformer.tsx
│   ├── ToolCard.tsx
│   └── CategoryNav.tsx
├── lib/
│   └── transformations/
│       ├── index.ts
│       ├── naming-conventions.ts
│       ├── encoding.ts
│       ├── crypto.ts
│       ├── formatters.ts
│       ├── converters.ts
│       ├── colors.ts
│       ├── generators.ts
│       └── ciphers.ts
├── docs/
│   └── PRD.md
├── CLAUDE.md
├── package.json
└── README.md
```

---

*This PRD defines the scope and requirements for Text Transform. All transformations are implemented as pure functions with no external dependencies.*
