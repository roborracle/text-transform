/**
 * Function Registry Tests
 * Tests for the function registry that maps function names to implementations
 */

import {
  FUNCTION_REGISTRY,
  getTransformFunction,
  hasTransformFunction,
} from '@/lib/tools/function-registry';
import { BATCH1_TOOLS, BATCH2_TOOLS } from '@/lib/tools';

describe('Function Registry', () => {
  describe('getTransformFunction', () => {
    it('returns a function for valid function name', () => {
      const fn = getTransformFunction('toCamelCase');
      expect(typeof fn).toBe('function');
    });

    it('returns undefined for invalid function name', () => {
      const fn = getTransformFunction('nonExistentFunction');
      expect(fn).toBeUndefined();
    });
  });

  describe('hasTransformFunction', () => {
    it('returns true for existing function', () => {
      expect(hasTransformFunction('toCamelCase')).toBe(true);
      expect(hasTransformFunction('base64Encode')).toBe(true);
      expect(hasTransformFunction('md5Hash')).toBe(true);
    });

    it('returns false for non-existing function', () => {
      expect(hasTransformFunction('nonExistent')).toBe(false);
    });
  });

  describe('Naming Convention functions', () => {
    it('toCamelCase transforms correctly', () => {
      const fn = getTransformFunction('toCamelCase');
      expect(fn?.('hello world')).toBe('helloWorld');
    });

    it('toPascalCase transforms correctly', () => {
      const fn = getTransformFunction('toPascalCase');
      expect(fn?.('hello world')).toBe('HelloWorld');
    });

    it('toSnakeCase transforms correctly', () => {
      const fn = getTransformFunction('toSnakeCase');
      expect(fn?.('helloWorld')).toBe('hello_world');
    });

    it('toKebabCase transforms correctly', () => {
      const fn = getTransformFunction('toKebabCase');
      expect(fn?.('helloWorld')).toBe('hello-world');
    });

    it('detectNamingConvention works', () => {
      const fn = getTransformFunction('detectNamingConvention');
      expect(fn?.('helloWorld')).toBe('camelCase');
      expect(fn?.('HelloWorld')).toBe('PascalCase');
    });
  });

  describe('Encoding functions', () => {
    it('base64Encode transforms correctly', () => {
      const fn = getTransformFunction('base64Encode');
      expect(fn?.('hello')).toBe('aGVsbG8=');
    });

    it('base64Decode transforms correctly', () => {
      const fn = getTransformFunction('base64Decode');
      expect(fn?.('aGVsbG8=')).toBe('hello');
    });

    it('urlEncode transforms correctly', () => {
      const fn = getTransformFunction('urlEncode');
      expect(fn?.('hello world')).toBe('hello%20world');
    });

    it('urlDecode transforms correctly', () => {
      const fn = getTransformFunction('urlDecode');
      expect(fn?.('hello%20world')).toBe('hello world');
    });

    it('textToBinary transforms correctly', () => {
      const fn = getTransformFunction('textToBinary');
      expect(fn?.('A')).toBe('01000001');
    });
  });

  describe('Crypto functions', () => {
    it('md5Hash returns hash', async () => {
      const fn = getTransformFunction('md5Hash');
      const result = await fn?.('hello');
      expect(result).toMatch(/^[a-f0-9]{32}$/);
    });

    it('sha256Hash returns hash', async () => {
      const fn = getTransformFunction('sha256Hash');
      const result = await fn?.('hello');
      expect(result).toMatch(/^[a-f0-9]{64}$/);
    });

    it('generateUUIDv4 generates valid UUID', () => {
      const fn = getTransformFunction('generateUUIDv4');
      const result = fn?.('');
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('generateULID generates valid ULID', () => {
      const fn = getTransformFunction('generateULID');
      const result = fn?.('');
      expect(result).toHaveLength(26);
    });

    it('decodeJWT decodes valid JWT', () => {
      const fn = getTransformFunction('decodeJWT');
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const result = fn?.(jwt);
      expect(result).toContain('John Doe');
    });
  });

  describe('Formatter functions', () => {
    it('formatJSON with options', () => {
      const fn = getTransformFunction('formatJSON');
      const result = fn?.('{"a":1}', { indent: 4 });
      expect(result).toContain('    "a"');
    });

    it('minifyJSON works', () => {
      const fn = getTransformFunction('minifyJSON');
      const result = fn?.('{\n  "a": 1\n}');
      expect(result).toBe('{"a":1}');
    });

    it('formatSQL works', () => {
      const fn = getTransformFunction('formatSQL');
      const result = fn?.('select * from users where id = 1');
      expect(result).toContain('SELECT');
      expect(result).toContain('FROM');
    });
  });

  describe('Color functions', () => {
    it('hexToRgb converts correctly', () => {
      const fn = getTransformFunction('hexToRgb');
      expect(fn?.('#ff0000')).toBe('rgb(255, 0, 0)');
    });

    it('rgbToHex converts correctly', () => {
      const fn = getTransformFunction('rgbToHex');
      expect(fn?.('rgb(255, 0, 0)')).toBe('#ff0000');
    });

    it('generateRandomHexColor generates valid hex', () => {
      const fn = getTransformFunction('generateRandomHexColor');
      const result = fn?.('');
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe('Generator functions', () => {
    it('generatePassword generates password with options', () => {
      const fn = getTransformFunction('generatePassword');
      const result = fn?.('', { length: 20 });
      expect(result).toHaveLength(20);
    });

    it('generateLoremIpsum generates text', () => {
      const fn = getTransformFunction('generateLoremIpsum');
      const result = fn?.('', { paragraphs: 2 });
      expect(result?.split('\n\n').length).toBe(2);
    });

    it('generateIPv4 generates valid IP', () => {
      const fn = getTransformFunction('generateIPv4');
      const result = fn?.('');
      expect(result).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });
  });

  describe('Cipher functions', () => {
    it('rot13 encodes correctly', () => {
      const fn = getTransformFunction('rot13');
      expect(fn?.('hello')).toBe('uryyb');
    });

    it('caesarEncode with shift option', () => {
      const fn = getTransformFunction('caesarEncode');
      const result = fn?.('abc', { shift: 1 });
      expect(result).toBe('bcd');
    });

    it('textToMorse converts correctly', () => {
      const fn = getTransformFunction('textToMorse');
      expect(fn?.('SOS')).toBe('... --- ...');
    });

    it('morseToText converts correctly', () => {
      const fn = getTransformFunction('morseToText');
      expect(fn?.('... --- ...')).toBe('SOS');
    });

    it('reverseString works', () => {
      const fn = getTransformFunction('reverseString');
      expect(fn?.('hello')).toBe('olleh');
    });
  });

  describe('All tool functions exist', () => {
    const allTools = [...BATCH1_TOOLS, ...BATCH2_TOOLS];

    it.each(allTools.map((t) => [t.name, t.transformFn]))(
      '%s has function "%s" in registry',
      (_name, fnName) => {
        expect(hasTransformFunction(fnName)).toBe(true);
      }
    );
  });

  describe('Registry completeness', () => {
    it('has all naming convention functions', () => {
      const fns = [
        'toCamelCase',
        'toPascalCase',
        'toSnakeCase',
        'toScreamingSnakeCase',
        'toKebabCase',
        'toTrainCase',
        'toDotCase',
        'toPathCase',
        'toNamespaceCase',
        'toAdaCase',
        'toCobolCase',
        'toFlatCase',
        'toUpperFlatCase',
        'detectNamingConvention',
      ];
      fns.forEach((fn) => {
        expect(hasTransformFunction(fn)).toBe(true);
      });
    });

    it('has all encoding functions', () => {
      const fns = [
        'base64Encode',
        'base64Decode',
        'base32Encode',
        'base32Decode',
        'urlEncode',
        'urlDecode',
        'htmlEncode',
        'htmlDecode',
        'textToBinary',
        'binaryToText',
        'textToHex',
        'hexToText',
      ];
      fns.forEach((fn) => {
        expect(hasTransformFunction(fn)).toBe(true);
      });
    });

    it('has crypto functions', () => {
      const fns = [
        'md5Hash',
        'sha1Hash',
        'sha256Hash',
        'sha512Hash',
        'generateUUIDv4',
        'generateULID',
        'generateNanoID',
        'decodeJWT',
        'generateHMACSHA256',
        'generateBcryptHash',
        'unixTimestampToDate',
        'dateToUnixTimestamp',
        'generateChecksum',
      ];
      fns.forEach((fn) => {
        expect(hasTransformFunction(fn)).toBe(true);
      });
    });
  });
});
