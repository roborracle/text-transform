/**
 * Function Registry
 * Maps function name strings to actual transformation functions
 * Adapts various function signatures to the standard TransformFn interface
 */

import * as transformations from '@/lib/transformations';

/**
 * Standard transform function signature
 */
export type TransformFunction = (
  input: string,
  options?: Record<string, unknown>
) => string | Promise<string>;

/**
 * Create wrapper for generator functions (no input required)
 */
function wrapGenerator(fn: () => string): TransformFunction {
  return () => fn();
}

/**
 * Create wrapper for generator with size option
 */
function wrapGeneratorWithSize(
  fn: (size?: number) => string
): TransformFunction {
  return (_input: string, options?: Record<string, unknown>) => {
    const size = typeof options?.size === 'number' ? options.size : undefined;
    return fn(size);
  };
}

/**
 * Create wrapper for password generator
 */
function wrapPasswordGenerator(): TransformFunction {
  return (_input: string, options?: Record<string, unknown>) => {
    const length = typeof options?.length === 'number' ? options.length : 16;
    return transformations.generatePassword(length, {
      uppercase: options?.uppercase !== false,
      lowercase: options?.lowercase !== false,
      numbers: options?.numbers !== false,
      symbols: options?.symbols !== false,
    });
  };
}

/**
 * Create wrapper for lorem ipsum generator
 */
function wrapLoremIpsumGenerator(): TransformFunction {
  return (_input: string, options?: Record<string, unknown>) => {
    const paragraphs =
      typeof options?.paragraphs === 'number' ? options.paragraphs : 1;
    const wordsPerParagraph =
      typeof options?.wordsPerParagraph === 'number'
        ? options.wordsPerParagraph
        : 50;
    return transformations.generateLoremIpsum(paragraphs, wordsPerParagraph);
  };
}

/**
 * Create wrapper for random string generator
 */
function wrapRandomStringGenerator(): TransformFunction {
  return (_input: string, options?: Record<string, unknown>) => {
    const length = typeof options?.length === 'number' ? options.length : 32;
    const charset = (options?.charset as 'alphanumeric' | 'alpha' | 'numeric' | 'hex') || 'alphanumeric';
    return transformations.generateRandomString(length, charset);
  };
}

/**
 * Create wrapper for slug generator
 */
function wrapSlugGenerator(): TransformFunction {
  return (_input: string, options?: Record<string, unknown>) => {
    const words = typeof options?.words === 'number' ? options.words : 3;
    return transformations.generateSlug(words);
  };
}

/**
 * Create wrapper for HMAC function (message + key)
 */
function wrapHMAC(): TransformFunction {
  return async (input: string, options?: Record<string, unknown>) => {
    const key = typeof options?.key === 'string' ? options.key : '';
    return transformations.generateHMACSHA256(input, key);
  };
}

/**
 * Create wrapper for dateToUnixTimestamp with option
 */
function wrapDateToUnix(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const inMilliseconds = options?.inMilliseconds === true;
    return transformations.dateToUnixTimestamp(input, inMilliseconds);
  };
}

/**
 * Create wrapper for formatJSON with indent option
 */
function wrapFormatJSON(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const indent = typeof options?.indent === 'number' ? options.indent : 2;
    return transformations.formatJSON(input, indent);
  };
}

/**
 * Create wrapper for curlToCode with language option
 */
function wrapCurlToCode(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const language = typeof options?.language === 'string' ? options.language : 'javascript';
    return transformations.curlToCode(input, language);
  };
}

/**
 * Create wrapper for csvToJSON with hasHeader option
 */
function wrapCsvToJSON(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const hasHeader = options?.hasHeader !== false;
    return transformations.csvToJSON(input, hasHeader);
  };
}

/**
 * Create wrapper for Caesar cipher with shift option
 */
function wrapCaesarEncode(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const shift = typeof options?.shift === 'number' ? options.shift : 3;
    return transformations.caesarEncode(input, shift);
  };
}

/**
 * Create wrapper for Caesar decode with shift option
 */
function wrapCaesarDecode(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const shift = typeof options?.shift === 'number' ? options.shift : 3;
    return transformations.caesarDecode(input, shift);
  };
}

/**
 * Create wrapper for Vigenere encode with key option
 */
function wrapVigenereEncode(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const key = typeof options?.key === 'string' ? options.key : '';
    return transformations.vigenereEncode(input, key);
  };
}

/**
 * Create wrapper for Vigenere decode with key option
 */
function wrapVigenereDecode(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const key = typeof options?.key === 'string' ? options.key : '';
    return transformations.vigenereDecode(input, key);
  };
}

/**
 * Create wrapper for XOR cipher with key option
 */
function wrapXorCipher(): TransformFunction {
  return (input: string, options?: Record<string, unknown>) => {
    const key = typeof options?.key === 'string' ? options.key : '';
    return transformations.xorCipher(input, key);
  };
}

/**
 * Registry mapping function names to implementations
 */
export const FUNCTION_REGISTRY: Record<string, TransformFunction> = {
  // Naming Conventions (all have standard signature)
  toCamelCase: transformations.toCamelCase,
  toPascalCase: transformations.toPascalCase,
  toSnakeCase: transformations.toSnakeCase,
  toScreamingSnakeCase: transformations.toScreamingSnakeCase,
  toKebabCase: transformations.toKebabCase,
  toTrainCase: transformations.toTrainCase,
  toDotCase: transformations.toDotCase,
  toPathCase: transformations.toPathCase,
  toNamespaceCase: transformations.toNamespaceCase,
  toAdaCase: transformations.toAdaCase,
  toCobolCase: transformations.toCobolCase,
  toFlatCase: transformations.toFlatCase,
  toUpperFlatCase: transformations.toUpperFlatCase,
  detectNamingConvention: transformations.detectNamingConvention,

  // Encoding (all have standard signature)
  base64Encode: transformations.base64Encode,
  base64Decode: transformations.base64Decode,
  base32Encode: transformations.base32Encode,
  base32Decode: transformations.base32Decode,
  urlEncode: transformations.urlEncode,
  urlDecode: transformations.urlDecode,
  htmlEncode: transformations.htmlEncode,
  htmlDecode: transformations.htmlDecode,
  textToBinary: transformations.textToBinary,
  binaryToText: transformations.binaryToText,
  textToHex: transformations.textToHex,
  hexToText: transformations.hexToText,
  utf8Encode: transformations.utf8Encode,
  utf8Decode: transformations.utf8Decode,
  textToAscii: transformations.textToAscii,
  asciiToText: transformations.asciiToText,

  // Crypto (mix of async, sync, and generators)
  md5Hash: transformations.md5Hash,
  sha1Hash: transformations.sha1Hash,
  sha256Hash: transformations.sha256Hash,
  sha512Hash: transformations.sha512Hash,
  generateUUIDv4: wrapGenerator(transformations.generateUUIDv4),
  generateULID: wrapGenerator(transformations.generateULID),
  generateNanoID: wrapGeneratorWithSize(transformations.generateNanoID),
  decodeJWT: transformations.decodeJWT,
  generateHMACSHA256: wrapHMAC(),
  generateBcryptHash: transformations.generateBcryptHash,
  unixTimestampToDate: transformations.unixTimestampToDate,
  dateToUnixTimestamp: wrapDateToUnix(),
  generateChecksum: transformations.generateChecksum,

  // Formatters (some have options)
  formatJSON: wrapFormatJSON(),
  minifyJSON: transformations.minifyJSON,
  formatSQL: transformations.formatSQL,
  minifySQL: transformations.minifySQL,
  formatXML: transformations.formatXML,
  minifyXML: transformations.minifyXML,
  formatCSS: transformations.formatCSS,
  minifyCSS: transformations.minifyCSS,
  formatJavaScript: transformations.formatJavaScript,
  minifyJavaScript: transformations.minifyJavaScript,
  formatHTML: transformations.formatHTML,
  minifyHTML: transformations.minifyHTML,
  formatYAML: transformations.formatYAML,
  jsonToYAML: transformations.jsonToYAML,
  yamlToJSON: transformations.yamlToJSON,
  markdownToHTML: transformations.markdownToHTML,
  htmlToMarkdown: transformations.htmlToMarkdown,
  curlToCode: wrapCurlToCode(),

  // Converters
  csvToJSON: wrapCsvToJSON(),
  jsonToCSV: transformations.jsonToCSV,
  xmlToJSON: transformations.xmlToJSON,
  jsonToXML: transformations.jsonToXML,

  // Colors
  hexToRgb: transformations.hexToRgb,
  rgbToHex: transformations.rgbToHex,
  hexToHsl: transformations.hexToHsl,
  hslToHex: transformations.hslToHex,
  hexToDecimal: transformations.hexToDecimal,
  decimalToHex: transformations.decimalToHex,
  hexToRgba: (input: string, options?: Record<string, unknown>) => {
    const alpha = typeof options?.alpha === 'number' ? options.alpha : 1;
    return transformations.hexToRgba(input, alpha);
  },
  generateRandomHexColor: wrapGenerator(transformations.generateRandomHexColor),
  getComplementaryColor: transformations.getComplementaryColor,
  hexToCssVariable: (input: string, options?: Record<string, unknown>) => {
    const variableName = typeof options?.variableName === 'string'
      ? options.variableName
      : 'color-primary';
    return transformations.hexToCssVariable(input, variableName);
  },
  parseColor: (input: string) => {
    const result = transformations.parseColor(input);
    return JSON.stringify(result, null, 2);
  },

  // Generators
  generatePassword: wrapPasswordGenerator(),
  generateLoremIpsum: wrapLoremIpsumGenerator(),
  generateRandomString: wrapRandomStringGenerator(),
  generateSlug: wrapSlugGenerator(),
  generateIPv4: wrapGenerator(transformations.generateIPv4),
  generateIPv6: wrapGenerator(transformations.generateIPv6),
  generateMacAddress: wrapGenerator(() => transformations.generateMacAddress()),
  generateApiKey: wrapGenerator(() => transformations.generateApiKey()),
  generateRandomUsername: wrapGenerator(transformations.generateRandomUsername),
  generateRandomEmail: wrapGenerator(() => transformations.generateRandomEmail()),
  generateRandomPhone: wrapGenerator(() => transformations.generateRandomPhone()),
  generateRandomDate: wrapGenerator(() => transformations.generateRandomDate()),
  generateTestCreditCard: wrapGenerator(() => transformations.generateTestCreditCard()),

  // Ciphers
  rot13: transformations.rot13,
  caesarEncode: wrapCaesarEncode(),
  caesarDecode: wrapCaesarDecode(),
  atbash: transformations.atbash,
  textToMorse: transformations.textToMorse,
  morseToText: transformations.morseToText,
  vigenereEncode: wrapVigenereEncode(),
  vigenereDecode: wrapVigenereDecode(),
  reverseString: transformations.reverseString,
  reverseWords: transformations.reverseWords,
  toPigLatin: transformations.toPigLatin,
  textToNato: transformations.textToNato,
  rot47: transformations.rot47,
  xorCipher: wrapXorCipher(),
  substitutionCipher: (input: string, options?: Record<string, unknown>) => {
    const alphabet = typeof options?.alphabet === 'string'
      ? options.alphabet
      : 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
    return transformations.substitutionCipher(input, alphabet);
  },
};

/**
 * Get a transformation function by name
 */
export function getTransformFunction(
  fnName: string
): TransformFunction | undefined {
  return FUNCTION_REGISTRY[fnName];
}

/**
 * Check if a function exists in the registry
 */
export function hasTransformFunction(fnName: string): boolean {
  return fnName in FUNCTION_REGISTRY;
}
