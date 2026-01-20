/**
 * Batch 2 Tools Tests
 * Comprehensive tests for converters, colors, generators, and ciphers
 * Sprint 6: Tool Pages - Batch 2
 */

import { getTransformFunction } from '@/lib/tools/function-registry';
import {
  CONVERTER_TOOLS,
  COLOR_TOOLS,
  GENERATOR_TOOLS,
  CIPHER_TOOLS,
} from '@/lib/tools/definitions/batch2';

describe('Batch 2 Tools', () => {
  describe('Converter Tools', () => {
    describe('CSV to JSON', () => {
      const fn = getTransformFunction('csvToJSON');

      it('converts CSV with headers to JSON', () => {
        const csv = 'name,age\nJohn,30\nJane,25';
        const result = fn?.(csv, { hasHeader: true });
        const parsed = JSON.parse(result || '[]');
        expect(parsed).toHaveLength(2);
        expect(parsed[0].name).toBe('John');
        expect(parsed[0].age).toBe('30');
      });

      it('converts CSV without headers', () => {
        const csv = 'John,30\nJane,25';
        const result = fn?.(csv, { hasHeader: false });
        const parsed = JSON.parse(result || '[]');
        expect(parsed).toHaveLength(2);
        expect(parsed[0]).toEqual(['John', '30']);
      });

      it('handles quoted values with commas', () => {
        const csv = 'name,address\nJohn,"123 Main St, Apt 4"';
        const result = fn?.(csv);
        const parsed = JSON.parse(result || '[]');
        expect(parsed[0].address).toBe('123 Main St, Apt 4');
      });
    });

    describe('JSON to CSV', () => {
      const fn = getTransformFunction('jsonToCSV');

      it('converts JSON array to CSV', () => {
        const json = '[{"name":"John","age":30},{"name":"Jane","age":25}]';
        const result = fn?.(json);
        expect(result).toContain('name,age');
        expect(result).toContain('John,30');
        expect(result).toContain('Jane,25');
      });

      it('handles empty array', () => {
        const result = fn?.('[]');
        expect(result).toBe('');
      });

      it('returns error for non-array input', () => {
        const result = fn?.('{"name":"John"}');
        expect(result).toContain('must be a JSON array');
      });
    });

    describe('XML to JSON', () => {
      const fn = getTransformFunction('xmlToJSON');

      it('converts simple XML to JSON', () => {
        const xml = '<root><name>John</name><age>30</age></root>';
        const result = fn?.(xml);
        const parsed = JSON.parse(result || '{}');
        expect(parsed.root.name).toBe('John');
        expect(parsed.root.age).toBe('30');
      });
    });

    describe('JSON to XML', () => {
      const fn = getTransformFunction('jsonToXML');

      it('converts JSON to XML', () => {
        const json = '{"person":{"name":"John","age":30}}';
        const result = fn?.(json);
        expect(result).toContain('<?xml version="1.0"');
        expect(result).toContain('<person>');
        expect(result).toContain('John');
        expect(result).toContain('30');
      });
    });

    it('all converter tools have functions in registry', () => {
      CONVERTER_TOOLS.forEach((tool) => {
        expect(getTransformFunction(tool.transformFn)).toBeDefined();
      });
    });
  });

  describe('Color Tools', () => {
    describe('HEX to RGB', () => {
      const fn = getTransformFunction('hexToRgb');

      it('converts 6-digit hex to RGB', () => {
        expect(fn?.('#FF5733')).toBe('rgb(255, 87, 51)');
        expect(fn?.('#000000')).toBe('rgb(0, 0, 0)');
        expect(fn?.('#FFFFFF')).toBe('rgb(255, 255, 255)');
      });

      it('converts 3-digit hex to RGB', () => {
        expect(fn?.('#FFF')).toBe('rgb(255, 255, 255)');
        expect(fn?.('#000')).toBe('rgb(0, 0, 0)');
      });

      it('handles hex without hash', () => {
        expect(fn?.('FF5733')).toBe('rgb(255, 87, 51)');
      });
    });

    describe('RGB to HEX', () => {
      const fn = getTransformFunction('rgbToHex');

      it('converts RGB to HEX', () => {
        expect(fn?.('rgb(255, 87, 51)')).toBe('#ff5733');
        expect(fn?.('rgb(0, 0, 0)')).toBe('#000000');
        expect(fn?.('rgb(255, 255, 255)')).toBe('#ffffff');
      });

      it('converts comma-separated values', () => {
        expect(fn?.('255, 87, 51')).toBe('#ff5733');
      });
    });

    describe('HEX to HSL', () => {
      const fn = getTransformFunction('hexToHsl');

      it('converts HEX to HSL', () => {
        const result = fn?.('#FF0000');
        expect(result).toContain('hsl(');
        expect(result).toContain('0,'); // Red is 0 degrees
      });
    });

    describe('HSL to HEX', () => {
      const fn = getTransformFunction('hslToHex');

      it('converts HSL to HEX', () => {
        const result = fn?.('hsl(0, 100%, 50%)');
        expect(result).toBe('#ff0000');
      });
    });

    describe('HEX to RGBA', () => {
      const fn = getTransformFunction('hexToRgba');

      it('converts HEX to RGBA with alpha', () => {
        expect(fn?.('#FF5733', { alpha: 0.5 })).toBe('rgba(255, 87, 51, 0.5)');
        expect(fn?.('#FF5733', { alpha: 1 })).toBe('rgba(255, 87, 51, 1)');
      });

      it('defaults to alpha 1', () => {
        expect(fn?.('#FF5733')).toBe('rgba(255, 87, 51, 1)');
      });
    });

    describe('Random HEX Color', () => {
      const fn = getTransformFunction('generateRandomHexColor');

      it('generates valid hex color', () => {
        const result = fn?.('');
        expect(result).toMatch(/^#[0-9a-f]{6}$/);
      });

      it('generates different colors', () => {
        const colors = new Set();
        for (let i = 0; i < 10; i++) {
          colors.add(fn?.(''));
        }
        // Should have multiple unique colors
        expect(colors.size).toBeGreaterThan(1);
      });
    });

    describe('Complementary Color', () => {
      const fn = getTransformFunction('getComplementaryColor');

      it('returns complementary color', () => {
        expect(fn?.('#FF0000')).toBe('#00ffff'); // Red -> Cyan
        expect(fn?.('#000000')).toBe('#ffffff'); // Black -> White
      });
    });

    describe('HEX to CSS Variable', () => {
      const fn = getTransformFunction('hexToCssVariable');

      it('creates CSS variable with default name', () => {
        expect(fn?.('#FF5733')).toBe('--color-primary: #FF5733;');
      });

      it('creates CSS variable with custom name', () => {
        expect(fn?.('#FF5733', { variableName: 'accent' })).toBe(
          '--accent: #FF5733;'
        );
      });
    });

    describe('Parse Color', () => {
      const fn = getTransformFunction('parseColor');

      it('parses HEX and returns all formats', () => {
        const result = fn?.('#FF5733');
        const parsed = JSON.parse(result || '{}');
        expect(parsed.hex).toBe('#ff5733');
        expect(parsed.rgb).toBe('rgb(255, 87, 51)');
        expect(parsed.hsl).toContain('hsl(');
      });
    });

    it('all color tools have functions in registry', () => {
      COLOR_TOOLS.forEach((tool) => {
        expect(getTransformFunction(tool.transformFn)).toBeDefined();
      });
    });
  });

  describe('Generator Tools', () => {
    describe('Password Generator', () => {
      const fn = getTransformFunction('generatePassword');

      it('generates password with default length', () => {
        const result = fn?.('');
        expect(result?.length).toBe(16);
      });

      it('generates password with custom length', () => {
        const result = fn?.('', { length: 32 });
        expect(result?.length).toBe(32);
      });

      it('generates unique passwords', () => {
        const passwords = new Set();
        for (let i = 0; i < 10; i++) {
          passwords.add(fn?.(''));
        }
        expect(passwords.size).toBe(10);
      });
    });

    describe('IPv4 Generator', () => {
      const fn = getTransformFunction('generateIPv4');

      it('generates valid IPv4 address', () => {
        const result = fn?.('');
        expect(result).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      });

      it('generates addresses with valid octets', () => {
        const result = fn?.('');
        const octets = result?.split('.').map(Number);
        octets?.forEach((octet) => {
          expect(octet).toBeGreaterThanOrEqual(0);
          expect(octet).toBeLessThanOrEqual(255);
        });
      });
    });

    describe('IPv6 Generator', () => {
      const fn = getTransformFunction('generateIPv6');

      it('generates valid IPv6 address', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[0-9a-f]{4}(:[0-9a-f]{4}){7}$/);
      });
    });

    describe('MAC Address Generator', () => {
      const fn = getTransformFunction('generateMacAddress');

      it('generates valid MAC address', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/);
      });
    });

    describe('Lorem Ipsum Generator', () => {
      const fn = getTransformFunction('generateLoremIpsum');

      it('generates single paragraph by default', () => {
        const result = fn?.('');
        expect(result?.split('\n\n').length).toBe(1);
      });

      it('generates multiple paragraphs', () => {
        const result = fn?.('', { paragraphs: 3 });
        expect(result?.split('\n\n').length).toBe(3);
      });

      it('generates text starting with capital letter', () => {
        const result = fn?.('');
        expect(result?.[0]).toMatch(/[A-Z]/);
      });
    });

    describe('Random String Generator', () => {
      const fn = getTransformFunction('generateRandomString');

      it('generates alphanumeric by default', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[a-zA-Z0-9]+$/);
      });

      it('generates hex characters', () => {
        const result = fn?.('', { charset: 'hex' });
        expect(result).toMatch(/^[0-9a-f]+$/);
      });

      it('respects length option', () => {
        const result = fn?.('', { length: 64 });
        expect(result?.length).toBe(64);
      });
    });

    describe('Slug Generator', () => {
      const fn = getTransformFunction('generateSlug');

      it('generates URL-friendly slug', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
      });

      it('respects word count option', () => {
        const result = fn?.('', { words: 5 });
        expect(result?.split('-').length).toBe(5);
      });
    });

    describe('API Key Generator', () => {
      const fn = getTransformFunction('generateApiKey');

      it('generates key with default prefix', () => {
        const result = fn?.('');
        expect(result).toMatch(/^sk_[a-zA-Z0-9]+$/);
      });
    });

    describe('Random Email Generator', () => {
      const fn = getTransformFunction('generateRandomEmail');

      it('generates valid email format', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[a-z]+@example\.com$/);
      });
    });

    describe('Random Username Generator', () => {
      const fn = getTransformFunction('generateRandomUsername');

      it('generates username with adjective and noun', () => {
        const result = fn?.('');
        expect(result).toMatch(/^[a-z]+_[a-z]+\d+$/);
      });
    });

    describe('Test Credit Card Generator', () => {
      const fn = getTransformFunction('generateTestCreditCard');

      it('generates 16-digit number', () => {
        const result = fn?.('');
        expect(result).toMatch(/^\d{16}$/);
      });

      it('generates Luhn-valid number', () => {
        const result = fn?.('');
        expect(luhnCheck(result || '')).toBe(true);
      });
    });

    it('all generator tools have functions in registry', () => {
      GENERATOR_TOOLS.forEach((tool) => {
        expect(getTransformFunction(tool.transformFn)).toBeDefined();
      });
    });
  });

  describe('Cipher Tools', () => {
    describe('Caesar Cipher', () => {
      const encode = getTransformFunction('caesarEncode');
      const decode = getTransformFunction('caesarDecode');

      it('encodes with default shift of 3', () => {
        expect(encode?.('ABC')).toBe('DEF');
        expect(encode?.('XYZ')).toBe('ABC');
      });

      it('encodes with custom shift', () => {
        expect(encode?.('ABC', { shift: 1 })).toBe('BCD');
        expect(encode?.('ABC', { shift: 13 })).toBe('NOP');
      });

      it('decodes correctly', () => {
        expect(decode?.('DEF')).toBe('ABC');
        expect(decode?.('DEF', { shift: 3 })).toBe('ABC');
      });

      it('roundtrip encode/decode', () => {
        const original = 'Hello World';
        const encoded = encode?.(original, { shift: 7 });
        const decoded = decode?.(encoded || '', { shift: 7 });
        expect(decoded).toBe(original);
      });

      it('preserves case', () => {
        expect(encode?.('Hello')).toBe('Khoor');
      });
    });

    describe('ROT13', () => {
      const fn = getTransformFunction('rot13');

      it('encodes correctly', () => {
        expect(fn?.('HELLO')).toBe('URYYB');
        expect(fn?.('hello')).toBe('uryyb');
      });

      it('is self-reversing', () => {
        const original = 'Hello World';
        const encoded = fn?.(original);
        const decoded = fn?.(encoded || '');
        expect(decoded).toBe(original);
      });
    });

    describe('ROT47', () => {
      const fn = getTransformFunction('rot47');

      it('encodes ASCII printable characters', () => {
        const result = fn?.('Hello!');
        expect(result).not.toBe('Hello!');
      });

      it('is self-reversing', () => {
        const original = 'Hello123!@#';
        const encoded = fn?.(original);
        const decoded = fn?.(encoded || '');
        expect(decoded).toBe(original);
      });
    });

    describe('Atbash Cipher', () => {
      const fn = getTransformFunction('atbash');

      it('reverses alphabet', () => {
        expect(fn?.('A')).toBe('Z');
        expect(fn?.('Z')).toBe('A');
        expect(fn?.('ABC')).toBe('ZYX');
      });

      it('is self-reversing', () => {
        const original = 'Hello World';
        const encoded = fn?.(original);
        const decoded = fn?.(encoded || '');
        expect(decoded).toBe(original);
      });
    });

    describe('Morse Code', () => {
      const toMorse = getTransformFunction('textToMorse');
      const fromMorse = getTransformFunction('morseToText');

      it('converts text to morse', () => {
        expect(toMorse?.('SOS')).toBe('... --- ...');
        expect(toMorse?.('A')).toBe('.-');
      });

      it('converts morse to text', () => {
        expect(fromMorse?.('... --- ...')).toBe('SOS');
        expect(fromMorse?.('.-')).toBe('A');
      });

      it('roundtrip conversion', () => {
        const original = 'HELLO';
        const morse = toMorse?.(original);
        const decoded = fromMorse?.(morse || '');
        expect(decoded).toBe(original);
      });
    });

    describe('Vigenère Cipher', () => {
      const encode = getTransformFunction('vigenereEncode');
      const decode = getTransformFunction('vigenereDecode');

      it('encodes with key', () => {
        const result = encode?.('HELLO', { key: 'KEY' });
        expect(result).toBe('RIJVS');
      });

      it('decodes with key', () => {
        const result = decode?.('RIJVS', { key: 'KEY' });
        expect(result).toBe('HELLO');
      });

      it('roundtrip encode/decode', () => {
        const original = 'SECRET MESSAGE';
        const key = 'MYKEY';
        const encoded = encode?.(original, { key });
        const decoded = decode?.(encoded || '', { key });
        expect(decoded).toBe(original);
      });

      it('requires key', () => {
        const result = encode?.('HELLO', { key: '' });
        expect(result).toContain('Key required');
      });
    });

    describe('NATO Phonetic Alphabet', () => {
      const fn = getTransformFunction('textToNato');

      it('converts letters to NATO', () => {
        expect(fn?.('A')).toBe('Alpha');
        expect(fn?.('SOS')).toBe('Sierra Oscar Sierra');
      });

      it('handles numbers', () => {
        expect(fn?.('123')).toBe('One Two Three');
      });
    });

    describe('Pig Latin', () => {
      const fn = getTransformFunction('toPigLatin');

      it('converts words starting with consonants', () => {
        expect(fn?.('hello')).toBe('ellohay');
        expect(fn?.('world')).toBe('orldway');
      });

      it('converts words starting with vowels', () => {
        expect(fn?.('apple')).toBe('appleway');
      });
    });

    describe('Reverse String', () => {
      const fn = getTransformFunction('reverseString');

      it('reverses string', () => {
        expect(fn?.('hello')).toBe('olleh');
        expect(fn?.('abc123')).toBe('321cba');
      });
    });

    describe('Reverse Words', () => {
      const fn = getTransformFunction('reverseWords');

      it('reverses each word', () => {
        expect(fn?.('hello world')).toBe('olleh dlrow');
      });
    });

    describe('XOR Cipher', () => {
      const fn = getTransformFunction('xorCipher');

      it('XORs with key', () => {
        const original = 'Hello';
        const encoded = fn?.(original, { key: 'KEY' });
        expect(encoded).not.toBe(original);
      });

      it('is self-reversing', () => {
        const original = 'Hello World';
        const key = 'SECRET';
        const encoded = fn?.(original, { key });
        const decoded = fn?.(encoded || '', { key });
        expect(decoded).toBe(original);
      });
    });

    describe('Substitution Cipher', () => {
      const fn = getTransformFunction('substitutionCipher');

      it('substitutes with custom alphabet', () => {
        const result = fn?.('ABC', { alphabet: 'ZYXWVUTSRQPONMLKJIHGFEDCBA' });
        expect(result).toBe('ZYX');
      });

      it('preserves case', () => {
        const result = fn?.('Hello', { alphabet: 'ZYXWVUTSRQPONMLKJIHGFEDCBA' });
        expect(result).toBe('Svool');
      });
    });

    it('all cipher tools have functions in registry', () => {
      CIPHER_TOOLS.forEach((tool) => {
        expect(getTransformFunction(tool.transformFn)).toBeDefined();
      });
    });
  });
});

/**
 * Luhn algorithm check for credit card validation
 */
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
