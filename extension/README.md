# Text Transform - Browser Extension

Transform text directly in your browser with 40+ tools for naming conventions, encoding, hashing, ciphers, and more.

## Features

- **Popup Interface**: Click the extension icon to access all transformation tools
- **Context Menu**: Right-click selected text to transform it instantly
- **Quick Tools**: Fast access to commonly used transformations
- **Copy & Replace**: Copy results or replace selected text in editable fields
- **Keyboard Shortcut**: `Alt+T` to open the popup

## Installation

### Chrome / Edge / Brave

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension` folder

### Firefox

Firefox support requires slight modifications to manifest.json. See [Firefox Extension docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).

## Usage

### Popup

1. Click the Text Transform icon in your browser toolbar
2. Enter text in the input field
3. Click a category to filter tools
4. Click any tool to transform your text
5. Click "Copy" to copy the result

### Context Menu

1. Select text on any webpage
2. Right-click to open the context menu
3. Hover over "Text Transform"
4. Choose a category and tool
5. The result appears in a toast notification
6. Click "Copy" or "Replace" to use the result

### Keyboard Shortcut

Press `Alt+T` to quickly open the popup.

## Available Tools

### Naming Conventions
- camelCase, PascalCase, snake_case
- SCREAMING_SNAKE_CASE, kebab-case
- Train-Case, dot.case, flatcase

### Encoding
- Base64 Encode/Decode
- URL Encode/Decode
- HTML Encode/Decode
- Hex, Binary conversion

### Crypto & Hash
- SHA-1, SHA-256, SHA-512
- UUID Generator

### Ciphers
- ROT13, Caesar Cipher
- Atbash, Morse Code
- Reverse String/Words

### Formatters
- Format/Minify JSON

### Text Utilities
- UPPERCASE, lowercase, Title Case
- Character Count
- Trim Whitespace

## Development

```bash
# Project structure
extension/
├── manifest.json       # Extension manifest (MV3)
├── icons/             # Extension icons
├── popup/             # Popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── src/
    ├── background.js   # Service worker
    ├── content.js      # Content script
    ├── content.css     # Toast styles
    └── transforms.js   # Transformation functions
```

### Adding Icons

See `icons/README.md` for instructions on creating extension icons.

### Testing Changes

1. Make your changes
2. Go to `chrome://extensions`
3. Click the refresh icon on the Text Transform extension
4. Test your changes

## Privacy

- **No data collection**: All transformations happen locally in your browser
- **No external requests**: The extension doesn't send data anywhere
- **No tracking**: We don't track usage or analytics

## Related

- [Text Transform Web App](https://texttransform.dev) - Full 111+ tools
- [Text Transform CLI](https://npmjs.com/package/text-transform) - Command-line interface
- [Text Transform API](https://texttransform.dev/api/docs) - REST API

## License

MIT License - see LICENSE file for details.
