/**
 * CLI command definitions and mappings to transformation functions
 */

import type { CommandDef } from './parser';

// Import all transformation functions with correct names
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toKebabCase,
  toTrainCase,
  toDotCase,
  toPathCase,
  toNamespaceCase,
  toAdaCase,
  toCobolCase,
  toFlatCase,
  toUpperFlatCase,
  detectNamingConvention,
} from '../../lib/transformations/naming-conventions';

import {
  base64Encode,
  base64Decode,
  base32Encode,
  base32Decode,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  textToAscii,
  asciiToText,
  utf8Encode,
  utf8Decode,
} from '../../lib/transformations/encoding';

import {
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  generateHMACSHA256,
  generateUUIDv4,
  generateULID,
  generateNanoID,
  decodeJWT,
  generateChecksum,
  unixTimestampToDate,
  dateToUnixTimestamp,
  generateBcryptHash,
} from '../../lib/transformations/crypto';

import {
  formatJSON,
  minifyJSON,
  formatSQL,
  minifySQL,
  formatXML,
  minifyXML,
  formatCSS,
  minifyCSS,
  formatJavaScript,
  minifyJavaScript,
  formatHTML,
  minifyHTML,
  formatYAML,
  jsonToYAML,
  yamlToJSON,
} from '../../lib/transformations/formatters';

import {
  csvToJSON,
  jsonToCSV,
  xmlToJSON,
  jsonToXML,
  markdownToHTML,
  htmlToMarkdown,
  curlToCode,
} from '../../lib/transformations/converters';

import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  decimalToHex,
  hexToDecimal,
  hexToRgba,
  generateRandomHexColor,
  getComplementaryColor,
  hexToCssVariable,
  parseColor,
} from '../../lib/transformations/colors';

import {
  generatePassword,
  generateApiKey,
  generateIPv4,
  generateIPv6,
  generateMacAddress,
  generateRandomString,
  generateLoremIpsum,
  generateRandomDate,
  generateRandomEmail,
  generateRandomUsername,
  generateRandomPhone,
  generateTestCreditCard,
  generateSlug,
} from '../../lib/transformations/generators';

import {
  caesarEncode,
  caesarDecode,
  rot13,
  rot47,
  atbash,
  vigenereEncode,
  vigenereDecode,
  textToMorse,
  morseToText,
  textToNato,
  toPigLatin,
  reverseWords,
  reverseString,
  xorCipher,
} from '../../lib/transformations/ciphers';

/**
 * Type for transformation function
 */
type TransformFn = (input: string, ...args: unknown[]) => string | Promise<string>;

/**
 * Command registry with all available transformations
 */
export const commandRegistry: Record<string, {
  fn: TransformFn;
  description: string;
  category: string;
  subcommands?: Record<string, { fn: TransformFn; description: string }>;
}> = {
  // Naming Conventions
  camel: { fn: toCamelCase, description: 'Convert to camelCase', category: 'naming' },
  pascal: { fn: toPascalCase, description: 'Convert to PascalCase', category: 'naming' },
  snake: { fn: toSnakeCase, description: 'Convert to snake_case', category: 'naming' },
  screaming: { fn: toScreamingSnakeCase, description: 'Convert to SCREAMING_SNAKE_CASE', category: 'naming' },
  kebab: { fn: toKebabCase, description: 'Convert to kebab-case', category: 'naming' },
  train: { fn: toTrainCase, description: 'Convert to Train-Case', category: 'naming' },
  dot: { fn: toDotCase, description: 'Convert to dot.case', category: 'naming' },
  path: { fn: toPathCase, description: 'Convert to path/case', category: 'naming' },
  namespace: { fn: toNamespaceCase, description: 'Convert to Namespace\\Case', category: 'naming' },
  ada: { fn: toAdaCase, description: 'Convert to Ada_Case', category: 'naming' },
  cobol: { fn: toCobolCase, description: 'Convert to COBOL-CASE', category: 'naming' },
  flat: { fn: toFlatCase, description: 'Convert to flatcase', category: 'naming' },
  upperflat: { fn: toUpperFlatCase, description: 'Convert to UPPERFLATCASE', category: 'naming' },
  detect: { fn: detectNamingConvention, description: 'Detect naming convention', category: 'naming' },

  // Encoding
  base64: {
    fn: base64Encode,
    description: 'Base64 encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: base64Encode, description: 'Encode to Base64' },
      decode: { fn: base64Decode, description: 'Decode from Base64' },
    },
  },
  base32: {
    fn: base32Encode,
    description: 'Base32 encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: base32Encode, description: 'Encode to Base32' },
      decode: { fn: base32Decode, description: 'Decode from Base32' },
    },
  },
  url: {
    fn: urlEncode,
    description: 'URL encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: urlEncode, description: 'URL encode' },
      decode: { fn: urlDecode, description: 'URL decode' },
    },
  },
  html: {
    fn: htmlEncode,
    description: 'HTML entity encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: htmlEncode, description: 'Encode HTML entities' },
      decode: { fn: htmlDecode, description: 'Decode HTML entities' },
    },
  },
  binary: {
    fn: textToBinary,
    description: 'Binary encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: textToBinary, description: 'Text to binary' },
      decode: { fn: binaryToText, description: 'Binary to text' },
    },
  },
  hex: {
    fn: textToHex,
    description: 'Hexadecimal encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: textToHex, description: 'Text to hex' },
      decode: { fn: hexToText, description: 'Hex to text' },
    },
  },
  ascii: {
    fn: textToAscii,
    description: 'ASCII code conversion',
    category: 'encoding',
    subcommands: {
      encode: { fn: textToAscii, description: 'Text to ASCII codes' },
      decode: { fn: asciiToText, description: 'ASCII codes to text' },
    },
  },
  utf8: {
    fn: utf8Encode,
    description: 'UTF-8 encode/decode',
    category: 'encoding',
    subcommands: {
      encode: { fn: utf8Encode, description: 'UTF-8 encode' },
      decode: { fn: utf8Decode, description: 'UTF-8 decode' },
    },
  },

  // Crypto
  md5: { fn: md5Hash as TransformFn, description: 'Generate MD5 hash', category: 'crypto' },
  sha1: { fn: sha1Hash as TransformFn, description: 'Generate SHA-1 hash', category: 'crypto' },
  sha256: { fn: sha256Hash as TransformFn, description: 'Generate SHA-256 hash', category: 'crypto' },
  sha512: { fn: sha512Hash as TransformFn, description: 'Generate SHA-512 hash', category: 'crypto' },
  hmac: {
    fn: async (input: string, key?: unknown) => generateHMACSHA256(input, String(key || 'key')),
    description: 'Generate HMAC-SHA256',
    category: 'crypto'
  },
  uuid: { fn: () => generateUUIDv4(), description: 'Generate UUID v4', category: 'crypto' },
  ulid: { fn: () => generateULID(), description: 'Generate ULID', category: 'crypto' },
  nanoid: { fn: () => generateNanoID(), description: 'Generate Nano ID', category: 'crypto' },
  jwt: { fn: decodeJWT, description: 'Decode JWT token', category: 'crypto' },
  checksum: { fn: generateChecksum, description: 'Calculate checksum', category: 'crypto' },
  timestamp: {
    fn: unixTimestampToDate,
    description: 'Unix timestamp conversion',
    category: 'crypto',
    subcommands: {
      todate: { fn: unixTimestampToDate, description: 'Unix to date' },
      tounix: { fn: (input: string) => dateToUnixTimestamp(input), description: 'Date to Unix' },
    },
  },
  bcrypt: { fn: generateBcryptHash, description: 'Generate bcrypt format hash', category: 'crypto' },

  // Formatters
  json: {
    fn: (input: string) => formatJSON(input),
    description: 'JSON format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: (input: string) => formatJSON(input), description: 'Format JSON' },
      minify: { fn: minifyJSON, description: 'Minify JSON' },
    },
  },
  sql: {
    fn: formatSQL,
    description: 'SQL format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: formatSQL, description: 'Format SQL' },
      minify: { fn: minifySQL, description: 'Minify SQL' },
    },
  },
  xml: {
    fn: formatXML,
    description: 'XML format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: formatXML, description: 'Format XML' },
      minify: { fn: minifyXML, description: 'Minify XML' },
    },
  },
  css: {
    fn: formatCSS,
    description: 'CSS format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: formatCSS, description: 'Format CSS' },
      minify: { fn: minifyCSS, description: 'Minify CSS' },
    },
  },
  js: {
    fn: formatJavaScript,
    description: 'JavaScript format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: formatJavaScript, description: 'Format JavaScript' },
      minify: { fn: minifyJavaScript, description: 'Minify JavaScript' },
    },
  },
  htmlfmt: {
    fn: formatHTML,
    description: 'HTML format/minify',
    category: 'formatters',
    subcommands: {
      format: { fn: formatHTML, description: 'Format HTML' },
      minify: { fn: minifyHTML, description: 'Minify HTML' },
    },
  },
  yaml: { fn: formatYAML, description: 'Format YAML', category: 'formatters' },
  json2yaml: { fn: jsonToYAML, description: 'Convert JSON to YAML', category: 'formatters' },
  yaml2json: { fn: yamlToJSON, description: 'Convert YAML to JSON', category: 'formatters' },

  // Converters
  csv2json: { fn: (input: string) => csvToJSON(input), description: 'Convert CSV to JSON', category: 'converters' },
  json2csv: { fn: jsonToCSV, description: 'Convert JSON to CSV', category: 'converters' },
  xml2json: { fn: xmlToJSON, description: 'Convert XML to JSON', category: 'converters' },
  json2xml: { fn: jsonToXML, description: 'Convert JSON to XML', category: 'converters' },
  md2html: { fn: markdownToHTML, description: 'Convert Markdown to HTML', category: 'converters' },
  html2md: { fn: htmlToMarkdown, description: 'Convert HTML to Markdown', category: 'converters' },
  curl2js: { fn: (input: string) => curlToCode(input, 'javascript'), description: 'Convert cURL to JavaScript fetch', category: 'converters' },
  curl2py: { fn: (input: string) => curlToCode(input, 'python'), description: 'Convert cURL to Python requests', category: 'converters' },
  curl2php: { fn: (input: string) => curlToCode(input, 'php'), description: 'Convert cURL to PHP', category: 'converters' },

  // Colors
  hex2rgb: { fn: hexToRgb, description: 'Convert HEX to RGB', category: 'colors' },
  rgb2hex: { fn: rgbToHex, description: 'Convert RGB to HEX', category: 'colors' },
  hex2hsl: { fn: hexToHsl, description: 'Convert HEX to HSL', category: 'colors' },
  hsl2hex: { fn: hslToHex, description: 'Convert HSL to HEX', category: 'colors' },
  dec2hex: { fn: decimalToHex, description: 'Convert decimal to HEX color', category: 'colors' },
  hex2dec: { fn: hexToDecimal, description: 'Convert HEX color to decimal', category: 'colors' },
  hex2rgba: { fn: (input: string, alpha?: unknown) => hexToRgba(input, Number(alpha) || 1), description: 'Convert HEX to RGBA', category: 'colors' },
  randcolor: { fn: () => generateRandomHexColor(), description: 'Generate random color', category: 'colors' },
  complement: { fn: getComplementaryColor, description: 'Get complementary color', category: 'colors' },
  cssvar: { fn: (input: string, name?: unknown) => hexToCssVariable(input, String(name || 'color-primary')), description: 'Format as CSS variable', category: 'colors' },
  parsecolor: {
    fn: (input: string) => JSON.stringify(parseColor(input), null, 2),
    description: 'Parse any color format',
    category: 'colors'
  },

  // Generators
  password: { fn: (input: string) => generatePassword(parseInt(input, 10) || 16), description: 'Generate secure password', category: 'generators' },
  apikey: { fn: (input: string) => generateApiKey(input || 'sk'), description: 'Generate API key', category: 'generators' },
  ipv4: { fn: () => generateIPv4(), description: 'Generate random IPv4', category: 'generators' },
  ipv6: { fn: () => generateIPv6(), description: 'Generate random IPv6', category: 'generators' },
  mac: { fn: () => generateMacAddress(), description: 'Generate random MAC address', category: 'generators' },
  randstr: { fn: (input: string) => generateRandomString(parseInt(input, 10) || 16), description: 'Generate random string', category: 'generators' },
  lorem: { fn: (input: string) => generateLoremIpsum(parseInt(input, 10) || 1), description: 'Generate Lorem Ipsum', category: 'generators' },
  randdate: { fn: () => generateRandomDate(), description: 'Generate random date', category: 'generators' },
  randemail: { fn: () => generateRandomEmail(), description: 'Generate random email', category: 'generators' },
  randuser: { fn: () => generateRandomUsername(), description: 'Generate random username', category: 'generators' },
  randphone: { fn: () => generateRandomPhone(), description: 'Generate random phone', category: 'generators' },
  testcard: { fn: () => generateTestCreditCard(), description: 'Generate test credit card', category: 'generators' },
  slug: { fn: () => generateSlug(), description: 'Generate URL slug', category: 'generators' },

  // Ciphers
  caesar: {
    fn: (input: string, shift?: unknown) => caesarEncode(input, Number(shift) || 3),
    description: 'Caesar cipher',
    category: 'ciphers',
    subcommands: {
      encode: { fn: (input: string, shift?: unknown) => caesarEncode(input, Number(shift) || 3), description: 'Encode with Caesar cipher' },
      decode: { fn: (input: string, shift?: unknown) => caesarDecode(input, Number(shift) || 3), description: 'Decode Caesar cipher' },
    },
  },
  rot13: { fn: rot13, description: 'ROT13 cipher', category: 'ciphers' },
  rot47: { fn: rot47, description: 'ROT47 cipher', category: 'ciphers' },
  atbash: { fn: atbash, description: 'Atbash cipher', category: 'ciphers' },
  vigenere: {
    fn: (input: string, key?: unknown) => vigenereEncode(input, String(key || 'key')),
    description: 'Vigenere cipher',
    category: 'ciphers',
    subcommands: {
      encode: { fn: (input: string, key?: unknown) => vigenereEncode(input, String(key || 'key')), description: 'Encode with Vigenere cipher' },
      decode: { fn: (input: string, key?: unknown) => vigenereDecode(input, String(key || 'key')), description: 'Decode Vigenere cipher' },
    },
  },
  morse: {
    fn: textToMorse,
    description: 'Morse code encode/decode',
    category: 'ciphers',
    subcommands: {
      encode: { fn: textToMorse, description: 'Text to Morse' },
      decode: { fn: morseToText, description: 'Morse to text' },
    },
  },
  nato: { fn: textToNato, description: 'NATO phonetic alphabet', category: 'ciphers' },
  piglatin: { fn: toPigLatin, description: 'Pig Latin', category: 'ciphers' },
  revwords: { fn: reverseWords, description: 'Reverse words', category: 'ciphers' },
  reverse: { fn: reverseString, description: 'Reverse string', category: 'ciphers' },
  xor: { fn: (input: string, key?: unknown) => xorCipher(input, String(key || 'key')), description: 'XOR cipher', category: 'ciphers' },
};

/**
 * Get command definitions for help display
 */
export function getCommandDefs(): CommandDef[] {
  const commands: CommandDef[] = [];

  for (const [name, cmd] of Object.entries(commandRegistry)) {
    const def: CommandDef = {
      name,
      description: cmd.description,
    };

    if (cmd.subcommands) {
      def.subcommands = Object.entries(cmd.subcommands).map(([subName, sub]) => ({
        name: subName,
        description: sub.description,
      }));
    }

    commands.push(def);
  }

  return commands.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get commands grouped by category
 */
export function getCommandsByCategory(): Record<string, CommandDef[]> {
  const byCategory: Record<string, CommandDef[]> = {};

  for (const [name, cmd] of Object.entries(commandRegistry)) {
    if (!byCategory[cmd.category]) {
      byCategory[cmd.category] = [];
    }

    const def: CommandDef = {
      name,
      description: cmd.description,
    };

    if (cmd.subcommands) {
      def.subcommands = Object.entries(cmd.subcommands).map(([subName, sub]) => ({
        name: subName,
        description: sub.description,
      }));
    }

    byCategory[cmd.category].push(def);
  }

  return byCategory;
}

/**
 * Execute a command with input
 */
export async function executeCommand(
  command: string,
  subcommand: string | undefined,
  input: string,
  options: Record<string, string | boolean>
): Promise<string> {
  const cmd = commandRegistry[command];

  if (!cmd) {
    throw new Error(`Unknown command: ${command}`);
  }

  let fn = cmd.fn;

  // Check for subcommand
  if (subcommand && cmd.subcommands) {
    const sub = cmd.subcommands[subcommand];
    if (sub) {
      fn = sub.fn;
    } else {
      throw new Error(`Unknown subcommand: ${subcommand} for command: ${command}`);
    }
  }

  // Get additional arguments from options
  const key = options.key || options.k;
  const shift = options.shift || options.s;

  // Execute the transformation
  const result = await fn(input, key || shift);
  return String(result);
}
