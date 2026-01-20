/**
 * Text Transform - Browser Extension
 * Bundled transformation functions
 */

// ============================================================================
// NAMING CONVENTIONS
// ============================================================================

export function toCamelCase(input) {
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function toPascalCase(input) {
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

export function toSnakeCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export function toScreamingSnakeCase(input) {
  return toSnakeCase(input).toUpperCase();
}

export function toKebabCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

export function toTrainCase(input) {
  return toKebabCase(input)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

export function toDotCase(input) {
  return toSnakeCase(input).replace(/_/g, '.');
}

export function toFlatCase(input) {
  return input.replace(/[-_\s]/g, '').toLowerCase();
}

export function toUpperFlatCase(input) {
  return toFlatCase(input).toUpperCase();
}

// ============================================================================
// ENCODING
// ============================================================================

export function base64Encode(input) {
  return btoa(unescape(encodeURIComponent(input)));
}

export function base64Decode(input) {
  return decodeURIComponent(escape(atob(input)));
}

export function urlEncode(input) {
  return encodeURIComponent(input);
}

export function urlDecode(input) {
  return decodeURIComponent(input);
}

export function htmlEncode(input) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, (char) => entities[char]);
}

export function htmlDecode(input) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
  };
  return input.replace(/&(?:amp|lt|gt|quot|#39|#x27|apos);/g, (entity) => entities[entity] || entity);
}

export function textToHex(input) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}

export function hexToText(input) {
  return input
    .replace(/\s+/g, '')
    .match(/.{1,2}/g)
    ?.map((hex) => String.fromCharCode(parseInt(hex, 16)))
    .join('') || '';
}

export function textToBinary(input) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export function binaryToText(input) {
  return input
    .replace(/\s+/g, '')
    .match(/.{1,8}/g)
    ?.map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join('') || '';
}

// ============================================================================
// CRYPTO (using Web Crypto API)
// ============================================================================

async function hashText(input, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function md5Hash(input) {
  // MD5 not supported in Web Crypto, use simple implementation
  return simpleHash(input, 'MD5');
}

export async function sha1Hash(input) {
  return hashText(input, 'SHA-1');
}

export async function sha256Hash(input) {
  return hashText(input, 'SHA-256');
}

export async function sha512Hash(input) {
  return hashText(input, 'SHA-512');
}

// Simple hash for MD5 (not cryptographically secure, for display only)
function simpleHash(input, label) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${label}:${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// CIPHERS
// ============================================================================

export function rot13(input) {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function caesarEncode(input, shift = 3) {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
}

export function atbash(input) {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
  });
}

export function reverseString(input) {
  return input.split('').reverse().join('');
}

export function reverseWords(input) {
  return input.split(' ').map((word) => word.split('').reverse().join('')).join(' ');
}

const MORSE_CODE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const MORSE_DECODE = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

export function textToMorse(input) {
  return input
    .toUpperCase()
    .split('')
    .map((char) => MORSE_CODE[char] || char)
    .join(' ');
}

export function morseToText(input) {
  return input
    .split(' ')
    .map((code) => MORSE_DECODE[code] || code)
    .join('');
}

// ============================================================================
// FORMATTERS
// ============================================================================

export function formatJSON(input) {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return 'Invalid JSON';
  }
}

export function minifyJSON(input) {
  try {
    return JSON.stringify(JSON.parse(input));
  } catch {
    return 'Invalid JSON';
  }
}

// ============================================================================
// TEXT UTILITIES
// ============================================================================

export function toUpperCase(input) {
  return input.toUpperCase();
}

export function toLowerCase(input) {
  return input.toLowerCase();
}

export function toTitleCase(input) {
  return input.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function countCharacters(input) {
  return `Characters: ${input.length} | Words: ${input.trim().split(/\s+/).filter(Boolean).length} | Lines: ${input.split('\n').length}`;
}

export function trimWhitespace(input) {
  return input.trim();
}

export function removeExtraSpaces(input) {
  return input.replace(/\s+/g, ' ').trim();
}

// ============================================================================
// TOOL REGISTRY
// ============================================================================

export const tools = {
  // Naming Conventions
  'camel-case': { name: 'camelCase', fn: toCamelCase, category: 'naming' },
  'pascal-case': { name: 'PascalCase', fn: toPascalCase, category: 'naming' },
  'snake-case': { name: 'snake_case', fn: toSnakeCase, category: 'naming' },
  'screaming-snake': { name: 'SCREAMING_SNAKE', fn: toScreamingSnakeCase, category: 'naming' },
  'kebab-case': { name: 'kebab-case', fn: toKebabCase, category: 'naming' },
  'train-case': { name: 'Train-Case', fn: toTrainCase, category: 'naming' },
  'dot-case': { name: 'dot.case', fn: toDotCase, category: 'naming' },
  'flat-case': { name: 'flatcase', fn: toFlatCase, category: 'naming' },

  // Encoding
  'base64-encode': { name: 'Base64 Encode', fn: base64Encode, category: 'encoding' },
  'base64-decode': { name: 'Base64 Decode', fn: base64Decode, category: 'encoding' },
  'url-encode': { name: 'URL Encode', fn: urlEncode, category: 'encoding' },
  'url-decode': { name: 'URL Decode', fn: urlDecode, category: 'encoding' },
  'html-encode': { name: 'HTML Encode', fn: htmlEncode, category: 'encoding' },
  'html-decode': { name: 'HTML Decode', fn: htmlDecode, category: 'encoding' },
  'text-to-hex': { name: 'Text to Hex', fn: textToHex, category: 'encoding' },
  'hex-to-text': { name: 'Hex to Text', fn: hexToText, category: 'encoding' },
  'text-to-binary': { name: 'Text to Binary', fn: textToBinary, category: 'encoding' },
  'binary-to-text': { name: 'Binary to Text', fn: binaryToText, category: 'encoding' },

  // Crypto
  'sha1': { name: 'SHA-1 Hash', fn: sha1Hash, category: 'crypto', async: true },
  'sha256': { name: 'SHA-256 Hash', fn: sha256Hash, category: 'crypto', async: true },
  'sha512': { name: 'SHA-512 Hash', fn: sha512Hash, category: 'crypto', async: true },
  'uuid': { name: 'Generate UUID', fn: generateUUID, category: 'crypto', generator: true },

  // Ciphers
  'rot13': { name: 'ROT13', fn: rot13, category: 'ciphers' },
  'caesar': { name: 'Caesar Cipher', fn: caesarEncode, category: 'ciphers' },
  'atbash': { name: 'Atbash', fn: atbash, category: 'ciphers' },
  'reverse': { name: 'Reverse String', fn: reverseString, category: 'ciphers' },
  'reverse-words': { name: 'Reverse Words', fn: reverseWords, category: 'ciphers' },
  'morse-encode': { name: 'Text to Morse', fn: textToMorse, category: 'ciphers' },
  'morse-decode': { name: 'Morse to Text', fn: morseToText, category: 'ciphers' },

  // Formatters
  'json-format': { name: 'Format JSON', fn: formatJSON, category: 'formatters' },
  'json-minify': { name: 'Minify JSON', fn: minifyJSON, category: 'formatters' },

  // Text Utilities
  'uppercase': { name: 'UPPERCASE', fn: toUpperCase, category: 'text' },
  'lowercase': { name: 'lowercase', fn: toLowerCase, category: 'text' },
  'title-case': { name: 'Title Case', fn: toTitleCase, category: 'text' },
  'count': { name: 'Count Characters', fn: countCharacters, category: 'text' },
  'trim': { name: 'Trim Whitespace', fn: trimWhitespace, category: 'text' },
  'remove-spaces': { name: 'Remove Extra Spaces', fn: removeExtraSpaces, category: 'text' },
};

export const categories = {
  naming: { name: 'Naming Conventions', icon: '📝' },
  encoding: { name: 'Encoding', icon: '🔐' },
  crypto: { name: 'Crypto & Hash', icon: '🔒' },
  ciphers: { name: 'Ciphers', icon: '🔀' },
  formatters: { name: 'Formatters', icon: '📋' },
  text: { name: 'Text Utilities', icon: '✏️' },
};

/**
 * Transform text using a specific tool
 */
export async function transform(toolId, input) {
  const tool = tools[toolId];
  if (!tool) {
    throw new Error(`Unknown tool: ${toolId}`);
  }

  if (tool.generator) {
    return tool.fn();
  }

  if (tool.async) {
    return await tool.fn(input);
  }

  return tool.fn(input);
}
