/**
 * API Tools Registry
 * Maps API endpoints to transformation functions
 */

// Import all transformation functions
import * as naming from '../transformations/naming-conventions';
import * as encoding from '../transformations/encoding';
import * as crypto from '../transformations/crypto';
import * as formatters from '../transformations/formatters';
import * as converters from '../transformations/converters';
import * as colors from '../transformations/colors';
import * as generators from '../transformations/generators';
import * as ciphers from '../transformations/ciphers';

/**
 * Tool definition for API
 */
export interface ApiTool {
  name: string;
  slug: string;
  description: string;
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => string | Promise<string>;
  params?: ApiToolParam[];
  isGenerator?: boolean;
}

export interface ApiToolParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
  default?: unknown;
}

/**
 * Category definition
 */
export interface ApiCategory {
  name: string;
  slug: string;
  description: string;
  toolCount: number;
}

/**
 * Tools registry organized by category
 */
export const toolsRegistry: Record<string, ApiTool[]> = {
  'naming-conventions': [
    { name: 'camelCase', slug: 'camel-case', description: 'Convert to camelCase', category: 'naming-conventions', fn: naming.toCamelCase },
    { name: 'PascalCase', slug: 'pascal-case', description: 'Convert to PascalCase', category: 'naming-conventions', fn: naming.toPascalCase },
    { name: 'snake_case', slug: 'snake-case', description: 'Convert to snake_case', category: 'naming-conventions', fn: naming.toSnakeCase },
    { name: 'SCREAMING_SNAKE', slug: 'screaming-snake', description: 'Convert to SCREAMING_SNAKE_CASE', category: 'naming-conventions', fn: naming.toScreamingSnakeCase },
    { name: 'kebab-case', slug: 'kebab-case', description: 'Convert to kebab-case', category: 'naming-conventions', fn: naming.toKebabCase },
    { name: 'Train-Case', slug: 'train-case', description: 'Convert to Train-Case', category: 'naming-conventions', fn: naming.toTrainCase },
    { name: 'dot.case', slug: 'dot-case', description: 'Convert to dot.case', category: 'naming-conventions', fn: naming.toDotCase },
    { name: 'path/case', slug: 'path-case', description: 'Convert to path/case', category: 'naming-conventions', fn: naming.toPathCase },
    { name: 'Namespace\\Case', slug: 'namespace-case', description: 'Convert to Namespace\\Case', category: 'naming-conventions', fn: naming.toNamespaceCase },
    { name: 'Ada_Case', slug: 'ada-case', description: 'Convert to Ada_Case', category: 'naming-conventions', fn: naming.toAdaCase },
    { name: 'COBOL-CASE', slug: 'cobol-case', description: 'Convert to COBOL-CASE', category: 'naming-conventions', fn: naming.toCobolCase },
    { name: 'flatcase', slug: 'flat-case', description: 'Convert to flatcase', category: 'naming-conventions', fn: naming.toFlatCase },
    { name: 'UPPERFLATCASE', slug: 'upper-flat-case', description: 'Convert to UPPERFLATCASE', category: 'naming-conventions', fn: naming.toUpperFlatCase },
    { name: 'Detect Convention', slug: 'detect', description: 'Detect naming convention', category: 'naming-conventions', fn: naming.detectNamingConvention },
  ],

  'encoding': [
    { name: 'Base64 Encode', slug: 'base64-encode', description: 'Encode to Base64', category: 'encoding', fn: encoding.base64Encode },
    { name: 'Base64 Decode', slug: 'base64-decode', description: 'Decode from Base64', category: 'encoding', fn: encoding.base64Decode },
    { name: 'Base32 Encode', slug: 'base32-encode', description: 'Encode to Base32', category: 'encoding', fn: encoding.base32Encode },
    { name: 'Base32 Decode', slug: 'base32-decode', description: 'Decode from Base32', category: 'encoding', fn: encoding.base32Decode },
    { name: 'URL Encode', slug: 'url-encode', description: 'URL encode text', category: 'encoding', fn: encoding.urlEncode },
    { name: 'URL Decode', slug: 'url-decode', description: 'URL decode text', category: 'encoding', fn: encoding.urlDecode },
    { name: 'HTML Encode', slug: 'html-encode', description: 'Encode HTML entities', category: 'encoding', fn: encoding.htmlEncode },
    { name: 'HTML Decode', slug: 'html-decode', description: 'Decode HTML entities', category: 'encoding', fn: encoding.htmlDecode },
    { name: 'Text to Binary', slug: 'text-to-binary', description: 'Convert text to binary', category: 'encoding', fn: encoding.textToBinary },
    { name: 'Binary to Text', slug: 'binary-to-text', description: 'Convert binary to text', category: 'encoding', fn: encoding.binaryToText },
    { name: 'Text to Hex', slug: 'text-to-hex', description: 'Convert text to hexadecimal', category: 'encoding', fn: encoding.textToHex },
    { name: 'Hex to Text', slug: 'hex-to-text', description: 'Convert hexadecimal to text', category: 'encoding', fn: encoding.hexToText },
    { name: 'Text to ASCII', slug: 'text-to-ascii', description: 'Convert text to ASCII codes', category: 'encoding', fn: encoding.textToAscii },
    { name: 'ASCII to Text', slug: 'ascii-to-text', description: 'Convert ASCII codes to text', category: 'encoding', fn: encoding.asciiToText },
    { name: 'UTF-8 Encode', slug: 'utf8-encode', description: 'UTF-8 encode text', category: 'encoding', fn: encoding.utf8Encode },
    { name: 'UTF-8 Decode', slug: 'utf8-decode', description: 'UTF-8 decode text', category: 'encoding', fn: encoding.utf8Decode },
  ],

  'crypto': [
    { name: 'MD5 Hash', slug: 'md5', description: 'Generate MD5 hash', category: 'crypto', fn: crypto.md5Hash },
    { name: 'SHA-1 Hash', slug: 'sha1', description: 'Generate SHA-1 hash', category: 'crypto', fn: crypto.sha1Hash },
    { name: 'SHA-256 Hash', slug: 'sha256', description: 'Generate SHA-256 hash', category: 'crypto', fn: crypto.sha256Hash },
    { name: 'SHA-512 Hash', slug: 'sha512', description: 'Generate SHA-512 hash', category: 'crypto', fn: crypto.sha512Hash },
    {
      name: 'HMAC-SHA256',
      slug: 'hmac-sha256',
      description: 'Generate HMAC-SHA256',
      category: 'crypto',
      fn: crypto.generateHMACSHA256,
      params: [{ name: 'key', type: 'string', description: 'Secret key for HMAC', required: true }],
    },
    { name: 'UUID v4', slug: 'uuid', description: 'Generate UUID v4', category: 'crypto', fn: crypto.generateUUIDv4, isGenerator: true },
    { name: 'ULID', slug: 'ulid', description: 'Generate ULID', category: 'crypto', fn: crypto.generateULID, isGenerator: true },
    {
      name: 'Nano ID',
      slug: 'nanoid',
      description: 'Generate Nano ID',
      category: 'crypto',
      fn: crypto.generateNanoID,
      isGenerator: true,
      params: [{ name: 'size', type: 'number', description: 'ID length', default: 21 }],
    },
    { name: 'Decode JWT', slug: 'jwt-decode', description: 'Decode JWT token (without verification)', category: 'crypto', fn: crypto.decodeJWT },
    { name: 'Checksum', slug: 'checksum', description: 'Generate checksum', category: 'crypto', fn: crypto.generateChecksum },
    { name: 'Unix to Date', slug: 'unix-to-date', description: 'Convert Unix timestamp to date', category: 'crypto', fn: crypto.unixTimestampToDate },
    { name: 'Date to Unix', slug: 'date-to-unix', description: 'Convert date to Unix timestamp', category: 'crypto', fn: crypto.dateToUnixTimestamp },
    { name: 'Bcrypt Hash', slug: 'bcrypt', description: 'Generate bcrypt format hash', category: 'crypto', fn: crypto.generateBcryptHash },
  ],

  'formatters': [
    { name: 'Format JSON', slug: 'json-format', description: 'Format/beautify JSON', category: 'formatters', fn: formatters.formatJSON },
    { name: 'Minify JSON', slug: 'json-minify', description: 'Minify JSON', category: 'formatters', fn: formatters.minifyJSON },
    { name: 'Format SQL', slug: 'sql-format', description: 'Format/beautify SQL', category: 'formatters', fn: formatters.formatSQL },
    { name: 'Minify SQL', slug: 'sql-minify', description: 'Minify SQL', category: 'formatters', fn: formatters.minifySQL },
    { name: 'Format XML', slug: 'xml-format', description: 'Format/beautify XML', category: 'formatters', fn: formatters.formatXML },
    { name: 'Minify XML', slug: 'xml-minify', description: 'Minify XML', category: 'formatters', fn: formatters.minifyXML },
    { name: 'Format CSS', slug: 'css-format', description: 'Format/beautify CSS', category: 'formatters', fn: formatters.formatCSS },
    { name: 'Minify CSS', slug: 'css-minify', description: 'Minify CSS', category: 'formatters', fn: formatters.minifyCSS },
    { name: 'Format JavaScript', slug: 'js-format', description: 'Format/beautify JavaScript', category: 'formatters', fn: formatters.formatJavaScript },
    { name: 'Minify JavaScript', slug: 'js-minify', description: 'Minify JavaScript', category: 'formatters', fn: formatters.minifyJavaScript },
    { name: 'Format HTML', slug: 'html-format', description: 'Format/beautify HTML', category: 'formatters', fn: formatters.formatHTML },
    { name: 'Minify HTML', slug: 'html-minify', description: 'Minify HTML', category: 'formatters', fn: formatters.minifyHTML },
    { name: 'Format YAML', slug: 'yaml-format', description: 'Format YAML', category: 'formatters', fn: formatters.formatYAML },
    { name: 'JSON to YAML', slug: 'json-to-yaml', description: 'Convert JSON to YAML', category: 'formatters', fn: formatters.jsonToYAML },
    { name: 'YAML to JSON', slug: 'yaml-to-json', description: 'Convert YAML to JSON', category: 'formatters', fn: formatters.yamlToJSON },
  ],

  'converters': [
    { name: 'CSV to JSON', slug: 'csv-to-json', description: 'Convert CSV to JSON', category: 'converters', fn: converters.csvToJSON },
    { name: 'JSON to CSV', slug: 'json-to-csv', description: 'Convert JSON to CSV', category: 'converters', fn: converters.jsonToCSV },
    { name: 'XML to JSON', slug: 'xml-to-json', description: 'Convert XML to JSON', category: 'converters', fn: converters.xmlToJSON },
    { name: 'JSON to XML', slug: 'json-to-xml', description: 'Convert JSON to XML', category: 'converters', fn: converters.jsonToXML },
    { name: 'Markdown to HTML', slug: 'markdown-to-html', description: 'Convert Markdown to HTML', category: 'converters', fn: converters.markdownToHTML },
    { name: 'HTML to Markdown', slug: 'html-to-markdown', description: 'Convert HTML to Markdown', category: 'converters', fn: converters.htmlToMarkdown },
    {
      name: 'cURL to JavaScript',
      slug: 'curl-to-js',
      description: 'Convert cURL to JavaScript fetch',
      category: 'converters',
      fn: (input: string) => converters.curlToCode(input, 'javascript'),
    },
    {
      name: 'cURL to Python',
      slug: 'curl-to-python',
      description: 'Convert cURL to Python requests',
      category: 'converters',
      fn: (input: string) => converters.curlToCode(input, 'python'),
    },
    {
      name: 'cURL to PHP',
      slug: 'curl-to-php',
      description: 'Convert cURL to PHP',
      category: 'converters',
      fn: (input: string) => converters.curlToCode(input, 'php'),
    },
  ],

  'colors': [
    { name: 'HEX to RGB', slug: 'hex-to-rgb', description: 'Convert HEX to RGB', category: 'colors', fn: colors.hexToRgb },
    { name: 'RGB to HEX', slug: 'rgb-to-hex', description: 'Convert RGB to HEX', category: 'colors', fn: colors.rgbToHex },
    { name: 'HEX to HSL', slug: 'hex-to-hsl', description: 'Convert HEX to HSL', category: 'colors', fn: colors.hexToHsl },
    { name: 'HSL to HEX', slug: 'hsl-to-hex', description: 'Convert HSL to HEX', category: 'colors', fn: colors.hslToHex },
    { name: 'Decimal to HEX', slug: 'decimal-to-hex', description: 'Convert decimal to HEX color', category: 'colors', fn: colors.decimalToHex },
    { name: 'HEX to Decimal', slug: 'hex-to-decimal', description: 'Convert HEX to decimal', category: 'colors', fn: colors.hexToDecimal },
    {
      name: 'HEX to RGBA',
      slug: 'hex-to-rgba',
      description: 'Convert HEX to RGBA',
      category: 'colors',
      fn: colors.hexToRgba,
      params: [{ name: 'alpha', type: 'number', description: 'Alpha value (0-1)', default: 1 }],
    },
    { name: 'Random Color', slug: 'random-color', description: 'Generate random HEX color', category: 'colors', fn: colors.generateRandomHexColor, isGenerator: true },
    { name: 'Complementary Color', slug: 'complementary', description: 'Get complementary color', category: 'colors', fn: colors.getComplementaryColor },
    {
      name: 'CSS Variable',
      slug: 'css-variable',
      description: 'Format as CSS variable',
      category: 'colors',
      fn: colors.hexToCssVariable,
      params: [{ name: 'name', type: 'string', description: 'Variable name', default: 'color-primary' }],
    },
    { name: 'Parse Color', slug: 'parse-color', description: 'Parse any color format', category: 'colors', fn: (input: string) => JSON.stringify(colors.parseColor(input)) },
  ],

  'generators': [
    {
      name: 'Password',
      slug: 'password',
      description: 'Generate secure password',
      category: 'generators',
      fn: generators.generatePassword,
      isGenerator: true,
      params: [{ name: 'length', type: 'number', description: 'Password length', default: 16 }],
    },
    {
      name: 'API Key',
      slug: 'api-key',
      description: 'Generate API key',
      category: 'generators',
      fn: generators.generateApiKey,
      isGenerator: true,
      params: [{ name: 'prefix', type: 'string', description: 'Key prefix', default: 'sk' }],
    },
    { name: 'IPv4', slug: 'ipv4', description: 'Generate random IPv4 address', category: 'generators', fn: generators.generateIPv4, isGenerator: true },
    { name: 'IPv6', slug: 'ipv6', description: 'Generate random IPv6 address', category: 'generators', fn: generators.generateIPv6, isGenerator: true },
    { name: 'MAC Address', slug: 'mac-address', description: 'Generate random MAC address', category: 'generators', fn: generators.generateMacAddress, isGenerator: true },
    {
      name: 'Random String',
      slug: 'random-string',
      description: 'Generate random string',
      category: 'generators',
      fn: generators.generateRandomString,
      isGenerator: true,
      params: [{ name: 'length', type: 'number', description: 'String length', default: 16 }],
    },
    {
      name: 'Lorem Ipsum',
      slug: 'lorem-ipsum',
      description: 'Generate Lorem Ipsum text',
      category: 'generators',
      fn: generators.generateLoremIpsum,
      isGenerator: true,
      params: [{ name: 'paragraphs', type: 'number', description: 'Number of paragraphs', default: 1 }],
    },
    { name: 'Random Date', slug: 'random-date', description: 'Generate random date', category: 'generators', fn: generators.generateRandomDate, isGenerator: true },
    { name: 'Random Email', slug: 'random-email', description: 'Generate random email', category: 'generators', fn: generators.generateRandomEmail, isGenerator: true },
    { name: 'Random Username', slug: 'random-username', description: 'Generate random username', category: 'generators', fn: generators.generateRandomUsername, isGenerator: true },
    { name: 'Random Phone', slug: 'random-phone', description: 'Generate random phone number', category: 'generators', fn: generators.generateRandomPhone, isGenerator: true },
    { name: 'Test Credit Card', slug: 'test-card', description: 'Generate test credit card', category: 'generators', fn: generators.generateTestCreditCard, isGenerator: true },
    { name: 'Slug', slug: 'slug', description: 'Generate URL slug', category: 'generators', fn: generators.generateSlug, isGenerator: true },
  ],

  'ciphers': [
    {
      name: 'Caesar Encode',
      slug: 'caesar-encode',
      description: 'Caesar cipher encode',
      category: 'ciphers',
      fn: ciphers.caesarEncode,
      params: [{ name: 'shift', type: 'number', description: 'Shift amount', default: 3 }],
    },
    {
      name: 'Caesar Decode',
      slug: 'caesar-decode',
      description: 'Caesar cipher decode',
      category: 'ciphers',
      fn: ciphers.caesarDecode,
      params: [{ name: 'shift', type: 'number', description: 'Shift amount', default: 3 }],
    },
    { name: 'ROT13', slug: 'rot13', description: 'ROT13 cipher', category: 'ciphers', fn: ciphers.rot13 },
    { name: 'ROT47', slug: 'rot47', description: 'ROT47 cipher', category: 'ciphers', fn: ciphers.rot47 },
    { name: 'Atbash', slug: 'atbash', description: 'Atbash cipher', category: 'ciphers', fn: ciphers.atbash },
    {
      name: 'Vigenère Encode',
      slug: 'vigenere-encode',
      description: 'Vigenère cipher encode',
      category: 'ciphers',
      fn: ciphers.vigenereEncode,
      params: [{ name: 'key', type: 'string', description: 'Cipher key', required: true }],
    },
    {
      name: 'Vigenère Decode',
      slug: 'vigenere-decode',
      description: 'Vigenère cipher decode',
      category: 'ciphers',
      fn: ciphers.vigenereDecode,
      params: [{ name: 'key', type: 'string', description: 'Cipher key', required: true }],
    },
    { name: 'Text to Morse', slug: 'text-to-morse', description: 'Convert text to Morse code', category: 'ciphers', fn: ciphers.textToMorse },
    { name: 'Morse to Text', slug: 'morse-to-text', description: 'Convert Morse code to text', category: 'ciphers', fn: ciphers.morseToText },
    { name: 'NATO Phonetic', slug: 'nato', description: 'Convert to NATO phonetic alphabet', category: 'ciphers', fn: ciphers.textToNato },
    { name: 'Pig Latin', slug: 'pig-latin', description: 'Convert to Pig Latin', category: 'ciphers', fn: ciphers.toPigLatin },
    { name: 'Reverse Words', slug: 'reverse-words', description: 'Reverse each word', category: 'ciphers', fn: ciphers.reverseWords },
    { name: 'Reverse String', slug: 'reverse-string', description: 'Reverse entire string', category: 'ciphers', fn: ciphers.reverseString },
    {
      name: 'XOR Cipher',
      slug: 'xor',
      description: 'XOR cipher',
      category: 'ciphers',
      fn: ciphers.xorCipher,
      params: [{ name: 'key', type: 'string', description: 'XOR key', required: true }],
    },
  ],
};

/**
 * Get all categories
 */
export function getCategories(): ApiCategory[] {
  return Object.entries(toolsRegistry).map(([slug, tools]) => ({
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    description: `${tools.length} transformation tools`,
    toolCount: tools.length,
  }));
}

/**
 * Get all tools
 */
export function getAllTools(): ApiTool[] {
  return Object.values(toolsRegistry).flat();
}

/**
 * Get tool by category and slug
 */
export function getTool(category: string, toolSlug: string): ApiTool | undefined {
  const categoryTools = toolsRegistry[category];
  if (!categoryTools) return undefined;
  return categoryTools.find(t => t.slug === toolSlug);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ApiTool[] | undefined {
  return toolsRegistry[category];
}
