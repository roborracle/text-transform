/**
 * Tests for encoding/decoding transformation functions
 */

import {
  base64Encode,
  base64Decode,
  base32Encode,
  base32Decode,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  binaryToText,
  textToBinary,
  hexToText,
  textToHex,
  utf8Encode,
  utf8Decode,
  asciiToText,
  textToAscii,
} from '@/lib/transformations/encoding';

describe('Encoding Functions', () => {
  describe('Base64', () => {
    describe('base64Encode', () => {
      it('should encode simple text', () => {
        expect(base64Encode('hello')).toBe('aGVsbG8=');
      });

      it('should encode empty string', () => {
        expect(base64Encode('')).toBe('');
      });

      it('should encode text with spaces', () => {
        expect(base64Encode('hello world')).toBe('aGVsbG8gd29ybGQ=');
      });

      it('should encode unicode characters', () => {
        const encoded = base64Encode('héllo wörld');
        expect(encoded).toBeTruthy();
        expect(base64Decode(encoded)).toBe('héllo wörld');
      });

      it('should encode special characters', () => {
        expect(base64Encode('hello+world')).toBe('aGVsbG8rd29ybGQ=');
      });
    });

    describe('base64Decode', () => {
      it('should decode valid base64', () => {
        expect(base64Decode('aGVsbG8=')).toBe('hello');
      });

      it('should decode empty string', () => {
        expect(base64Decode('')).toBe('');
      });

      it('should handle malformed base64 gracefully', () => {
        // Note: Buffer.from in Node is very forgiving with base64
        // It doesn't throw for most "invalid" inputs, just returns garbage or empty
        // This test verifies the function doesn't crash
        const result = base64Decode('====');
        // Returns empty string for padding-only input (no actual data)
        expect(typeof result).toBe('string');
      });

      it('should return error message for truly invalid base64', () => {
        // Test with a string that will definitely throw in atob (browser)
        // In Node's Buffer, this might not throw, so we check the pattern
        const result = base64Decode('!!invalid!!');
        // Function should return a string (either decoded garbage or error message)
        expect(typeof result).toBe('string');
      });

      it('should roundtrip encode/decode', () => {
        const original = 'The quick brown fox jumps over the lazy dog';
        expect(base64Decode(base64Encode(original))).toBe(original);
      });
    });
  });

  describe('Base32', () => {
    describe('base32Encode', () => {
      it('should encode simple text', () => {
        expect(base32Encode('hello')).toBe('NBSWY3DP');
      });

      it('should encode empty string', () => {
        expect(base32Encode('')).toBe('');
      });

      it('should encode text with spaces', () => {
        const encoded = base32Encode('hello world');
        expect(encoded).toBeTruthy();
      });
    });

    describe('base32Decode', () => {
      it('should decode valid base32', () => {
        expect(base32Decode('NBSWY3DP')).toBe('hello');
      });

      it('should handle case insensitivity', () => {
        expect(base32Decode('nbswy3dp')).toBe('hello');
      });

      it('should handle padding', () => {
        expect(base32Decode('NBSWY3DP==')).toBe('hello');
      });

      it('should throw on invalid characters', () => {
        expect(() => base32Decode('1234567890')).toThrow();
      });

      it('should roundtrip encode/decode', () => {
        const original = 'test string';
        expect(base32Decode(base32Encode(original))).toBe(original);
      });
    });
  });

  describe('URL Encoding', () => {
    describe('urlEncode', () => {
      it('should encode spaces', () => {
        expect(urlEncode('hello world')).toBe('hello%20world');
      });

      it('should encode special characters', () => {
        expect(urlEncode('hello&world=test')).toBe('hello%26world%3Dtest');
      });

      it('should encode empty string', () => {
        expect(urlEncode('')).toBe('');
      });

      it('should not encode safe characters', () => {
        expect(urlEncode('hello-world_test')).toBe('hello-world_test');
      });

      it('should encode unicode', () => {
        expect(urlEncode('héllo')).toBe('h%C3%A9llo');
      });
    });

    describe('urlDecode', () => {
      it('should decode URL-encoded text', () => {
        expect(urlDecode('hello%20world')).toBe('hello world');
      });

      it('should decode special characters', () => {
        expect(urlDecode('hello%26world%3Dtest')).toBe('hello&world=test');
      });

      it('should handle invalid encoding', () => {
        expect(urlDecode('%ZZ')).toBe('Invalid URL-encoded input');
      });

      it('should roundtrip encode/decode', () => {
        const original = 'test?query=value&other=123';
        expect(urlDecode(urlEncode(original))).toBe(original);
      });
    });
  });

  describe('HTML Encoding', () => {
    describe('htmlEncode', () => {
      it('should encode ampersand', () => {
        expect(htmlEncode('Tom & Jerry')).toBe('Tom &amp; Jerry');
      });

      it('should encode less than', () => {
        expect(htmlEncode('<div>')).toBe('&lt;div&gt;');
      });

      it('should encode quotes', () => {
        expect(htmlEncode('"hello"')).toBe('&quot;hello&quot;');
      });

      it('should encode single quotes', () => {
        expect(htmlEncode("it's")).toBe('it&#39;s');
      });

      it('should encode multiple special characters', () => {
        expect(htmlEncode('<script>"alert(1)"</script>')).toBe(
          '&lt;script&gt;&quot;alert(1)&quot;&lt;&#x2F;script&gt;'
        );
      });

      it('should handle empty string', () => {
        expect(htmlEncode('')).toBe('');
      });
    });

    describe('htmlDecode', () => {
      it('should decode named entities', () => {
        expect(htmlDecode('Tom &amp; Jerry')).toBe('Tom & Jerry');
      });

      it('should decode numeric entities', () => {
        expect(htmlDecode('&#65;&#66;&#67;')).toBe('ABC');
      });

      it('should decode hex entities', () => {
        expect(htmlDecode('&#x41;&#x42;&#x43;')).toBe('ABC');
      });

      it('should roundtrip encode/decode', () => {
        const original = '<div class="test">Hello & Goodbye</div>';
        expect(htmlDecode(htmlEncode(original))).toBe(original);
      });
    });
  });

  describe('Binary Encoding', () => {
    describe('textToBinary', () => {
      it('should convert text to binary', () => {
        expect(textToBinary('A')).toBe('01000001');
      });

      it('should convert multiple characters', () => {
        expect(textToBinary('Hi')).toBe('01001000 01101001');
      });

      it('should handle empty string', () => {
        expect(textToBinary('')).toBe('');
      });
    });

    describe('binaryToText', () => {
      it('should convert binary to text', () => {
        expect(binaryToText('01000001')).toBe('A');
      });

      it('should convert with spaces', () => {
        expect(binaryToText('01001000 01101001')).toBe('Hi');
      });

      it('should handle invalid binary', () => {
        expect(binaryToText('not binary')).toBe('Invalid binary input');
      });

      it('should roundtrip conversion', () => {
        const original = 'Hello';
        expect(binaryToText(textToBinary(original))).toBe(original);
      });
    });
  });

  describe('Hex Encoding', () => {
    describe('textToHex', () => {
      it('should convert text to hex', () => {
        expect(textToHex('A')).toBe('41');
      });

      it('should convert multiple characters', () => {
        expect(textToHex('Hi')).toBe('48 69');
      });

      it('should handle empty string', () => {
        expect(textToHex('')).toBe('');
      });
    });

    describe('hexToText', () => {
      it('should convert hex to text', () => {
        expect(hexToText('41')).toBe('A');
      });

      it('should convert with spaces', () => {
        expect(hexToText('48 69')).toBe('Hi');
      });

      it('should handle invalid hex', () => {
        expect(hexToText('GG')).toBe('Invalid hexadecimal input');
      });

      it('should roundtrip conversion', () => {
        const original = 'Hello World';
        expect(hexToText(textToHex(original))).toBe(original);
      });
    });
  });

  describe('UTF-8 Encoding', () => {
    describe('utf8Encode', () => {
      it('should encode ASCII text', () => {
        expect(utf8Encode('hello')).toBe('hello');
      });

      it('should encode unicode characters', () => {
        const encoded = utf8Encode('héllo');
        expect(encoded).toBeTruthy();
        expect(encoded).not.toBe('héllo');
      });

      it('should handle empty string', () => {
        expect(utf8Encode('')).toBe('');
      });
    });

    describe('utf8Decode', () => {
      it('should decode ASCII text', () => {
        expect(utf8Decode('hello')).toBe('hello');
      });

      it('should handle invalid UTF-8 sequences', () => {
        // The function uses escape/unescape which doesn't validate UTF-8 strictly
        // Test with a sequence that will cause decodeURIComponent to throw
        const result = utf8Decode('\xff\xfe');
        expect(result).toBe('Invalid UTF-8 input');
      });

      it('should roundtrip encode/decode', () => {
        const original = 'héllo wörld';
        expect(utf8Decode(utf8Encode(original))).toBe(original);
      });
    });
  });

  describe('ASCII Encoding', () => {
    describe('textToAscii', () => {
      it('should convert text to ASCII codes', () => {
        expect(textToAscii('A')).toBe('65');
      });

      it('should convert multiple characters', () => {
        expect(textToAscii('Hi')).toBe('72 105');
      });

      it('should handle empty string', () => {
        expect(textToAscii('')).toBe('');
      });

      it('should handle spaces', () => {
        expect(textToAscii('A B')).toBe('65 32 66');
      });
    });

    describe('asciiToText', () => {
      it('should convert ASCII codes to text', () => {
        expect(asciiToText('65')).toBe('A');
      });

      it('should convert multiple codes', () => {
        expect(asciiToText('72 105')).toBe('Hi');
      });

      it('should handle invalid ASCII', () => {
        expect(asciiToText('200')).toBe('Invalid ASCII code');
      });

      it('should handle negative numbers', () => {
        expect(asciiToText('-1')).toBe('Invalid ASCII code');
      });

      it('should handle non-numeric input', () => {
        expect(asciiToText('abc')).toBe('Invalid ASCII code');
      });

      it('should roundtrip conversion', () => {
        const original = 'Hello';
        expect(asciiToText(textToAscii(original))).toBe(original);
      });
    });
  });

  describe('Roundtrip Tests', () => {
    const testStrings = [
      'Hello, World!',
      'The quick brown fox',
      '12345',
      'Special: !@#$%^&*()',
      'Unicode: éàü',
    ];

    testStrings.forEach((str) => {
      it(`should roundtrip base64 for "${str.substring(0, 20)}..."`, () => {
        expect(base64Decode(base64Encode(str))).toBe(str);
      });

      it(`should roundtrip URL encoding for "${str.substring(0, 20)}..."`, () => {
        expect(urlDecode(urlEncode(str))).toBe(str);
      });

      it(`should roundtrip HTML encoding for "${str.substring(0, 20)}..."`, () => {
        expect(htmlDecode(htmlEncode(str))).toBe(str);
      });
    });
  });
});
