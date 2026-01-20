# Changelog

All notable changes to Text Transform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-20

### Added

#### Core Features
- 111+ text transformation tools across 8 categories
- Real-time transformation as you type
- Client-side processing for privacy
- Dark/light mode with system preference detection
- Responsive design for all devices

#### Web Application
- Homepage with category overview
- Category pages with tool listings
- Individual tool pages with full functionality
- Global search with keyboard shortcut (Cmd/Ctrl+K)
- Recent tools history
- Copy to clipboard functionality
- WCAG 2.1 AA accessibility compliance
- Error boundaries for graceful error handling
- Loading skeletons for better UX

#### REST API
- POST `/api/transform/{category}/{tool}` - Execute transformation
- GET `/api/tools` - List all available tools
- GET `/api/tools?category={category}` - Filter by category
- GET `/api/health` - Health check endpoint
- GET `/api/docs` - OpenAPI 3.0 specification
- Rate limiting (100 req/min standard, 300 req/min for listings)

#### CLI Tool
- `txtx` command for terminal usage
- 60+ commands across all categories
- Subcommand support (e.g., `txtx base64 encode`)
- Interactive mode with category navigation
- Stdin pipe support
- Comprehensive help system

#### Browser Extension
- Chrome Manifest V3 extension
- Popup interface with category filtering
- Context menu for selected text
- Toast notifications with copy/replace
- Keyboard shortcut (Alt+T)
- Works offline

#### Development & Testing
- 1225+ automated tests
- Jest test framework with coverage
- Accessibility testing with jest-axe
- GitHub Actions CI/CD pipeline
- ESLint and TypeScript strict mode

#### SEO & Analytics
- Dynamic sitemap generation
- robots.txt configuration
- OpenGraph and Twitter meta tags
- Google Analytics 4 integration (optional)
- Do Not Track respect

### Tool Categories

#### Naming Conventions (14 tools)
- camelCase, PascalCase, snake_case
- SCREAMING_SNAKE_CASE, kebab-case
- Train-Case, dot.case, path/case
- Namespace\Case, Ada_Case, COBOL-CASE
- flatcase, UPPERFLATCASE
- Convention Detector

#### Encoding/Decoding (16 tools)
- Base64 encode/decode
- Base32 encode/decode
- URL encode/decode
- HTML entities encode/decode
- Binary to/from text
- Hexadecimal to/from text
- ASCII to/from text
- UTF-8 encode/decode

#### Cryptography (14 tools)
- MD5, SHA-1, SHA-256, SHA-512 hashes
- HMAC-SHA256
- UUID v4, ULID, Nano ID generators
- JWT decoder
- Checksum calculator
- Unix timestamp conversion
- Bcrypt format hash

#### Code Formatters (18 tools)
- JSON format/minify
- SQL format/minify
- XML format/minify
- CSS format/minify
- JavaScript format/minify
- HTML format/minify
- YAML format
- JSON ↔ YAML conversion

#### Data Converters (10 tools)
- CSV ↔ JSON
- XML ↔ JSON
- Markdown ↔ HTML
- cURL to JavaScript/Python/PHP

#### Color Utilities (12 tools)
- HEX ↔ RGB/HSL/RGBA
- Decimal ↔ HEX
- Random color generator
- Complementary color
- CSS variable formatter
- Color parser

#### Random Generators (15 tools)
- Password generator
- API key generator
- IPv4/IPv6 addresses
- MAC addresses
- Random strings
- Lorem Ipsum
- Random dates, emails, usernames
- Test credit cards
- URL slugs

#### Ciphers (12 tools)
- Caesar cipher (encode/decode)
- ROT13, ROT47
- Atbash
- Vigenère cipher
- Morse code
- NATO phonetic alphabet
- Pig Latin
- Reverse string/words
- XOR cipher

### Technical Stack
- Next.js 15.5 with App Router
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- Jest 30 for testing

---

## Development History

### Sprint 13 - Final Polish
- Updated documentation
- Created CHANGELOG
- Production deployment checklist
- v1.0.0 release

### Sprint 12 - Browser Extension
- Chrome Manifest V3 extension
- Popup UI with 40+ tools
- Context menu integration
- Toast notifications

### Sprint 11 - REST API
- API route handlers
- Rate limiting
- OpenAPI specification
- API test suite

### Sprint 10 - CLI Tool
- Argument parser
- Command registry
- Interactive mode
- CLI test suite

### Sprint 9 - Deployment
- GitHub Actions CI/CD
- Repository templates
- Sitemap and robots.txt
- Analytics integration

### Sprint 8 - Accessibility
- Skip links
- Focus management
- ARIA attributes
- a11y test suite

### Sprint 7 - Search & UX
- Global search
- Recent tools
- Clipboard hooks
- Security audit

### Sprint 6 - Testing
- Component tests
- Transformation tests
- Integration tests

### Sprint 5 - Tool Pages
- Dynamic routing
- Tool components
- SEO metadata

### Sprint 4 - Category Pages
- Category layouts
- Tool listings
- Navigation

### Sprint 3 - UI Components
- Theme system
- Header/Footer
- Cards and badges

### Sprint 1-2 - Foundation
- Project setup
- 111 transformation functions
- Documentation
