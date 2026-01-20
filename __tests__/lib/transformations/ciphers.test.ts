/**
 * Tests for cipher and encoding functions
 */

import {
  caesarEncode,
  caesarDecode,
  rot13,
  rot47,
  atbash,
  textToMorse,
  morseToText,
  vigenereEncode,
  vigenereDecode,
  textToNato,
  toPigLatin,
  reverseWords,
  reverseString,
  xorCipher,
  substitutionCipher,
} from '@/lib/transformations/ciphers';

describe('Cipher Functions', () => {
  describe('Caesar Cipher', () => {
    describe('caesarEncode', () => {
      it('should encode with default shift of 3', () => {
        expect(caesarEncode('ABC')).toBe('DEF');
      });

      it('should encode with custom shift', () => {
        expect(caesarEncode('ABC', 1)).toBe('BCD');
      });

      it('should wrap around alphabet', () => {
        expect(caesarEncode('XYZ', 3)).toBe('ABC');
      });

      it('should preserve case', () => {
        expect(caesarEncode('Hello', 3)).toBe('Khoor');
      });

      it('should preserve non-alphabetic characters', () => {
        expect(caesarEncode('Hello, World!', 3)).toBe('Khoor, Zruog!');
      });

      it('should handle empty string', () => {
        expect(caesarEncode('')).toBe('');
      });
    });

    describe('caesarDecode', () => {
      it('should decode with default shift of 3', () => {
        expect(caesarDecode('DEF')).toBe('ABC');
      });

      it('should roundtrip encode/decode', () => {
        const original = 'Hello, World!';
        expect(caesarDecode(caesarEncode(original, 5), 5)).toBe(original);
      });
    });
  });

  describe('ROT13', () => {
    it('should encode text', () => {
      expect(rot13('Hello')).toBe('Uryyb');
    });

    it('should be self-inverse', () => {
      const original = 'Hello, World!';
      expect(rot13(rot13(original))).toBe(original);
    });

    it('should handle full alphabet', () => {
      expect(rot13('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')).toBe(
        'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'
      );
    });
  });

  describe('ROT47', () => {
    it('should encode printable ASCII', () => {
      expect(rot47('Hello!')).toBe('w6==@P');
    });

    it('should be self-inverse', () => {
      const original = 'Hello, World! 123';
      expect(rot47(rot47(original))).toBe(original);
    });
  });

  describe('Atbash', () => {
    it('should reverse alphabet', () => {
      expect(atbash('ABC')).toBe('ZYX');
    });

    it('should be self-inverse', () => {
      const original = 'Hello, World!';
      expect(atbash(atbash(original))).toBe(original);
    });

    it('should preserve case', () => {
      expect(atbash('Hello')).toBe('Svool');
    });
  });

  describe('Morse Code', () => {
    describe('textToMorse', () => {
      it('should convert letters', () => {
        expect(textToMorse('SOS')).toBe('... --- ...');
      });

      it('should convert numbers', () => {
        expect(textToMorse('123')).toBe('.---- ..--- ...--');
      });

      it('should handle spaces', () => {
        expect(textToMorse('HI MOM')).toBe('.... .. / -- --- --');
      });

      it('should be case insensitive', () => {
        expect(textToMorse('hello')).toBe(textToMorse('HELLO'));
      });
    });

    describe('morseToText', () => {
      it('should convert Morse to text', () => {
        expect(morseToText('... --- ...')).toBe('SOS');
      });

      it('should handle word separators', () => {
        expect(morseToText('.... .. / -- --- --')).toBe('HI MOM');
      });

      it('should roundtrip', () => {
        const original = 'HELLO WORLD';
        expect(morseToText(textToMorse(original))).toBe(original);
      });
    });
  });

  describe('Vigenère Cipher', () => {
    describe('vigenereEncode', () => {
      it('should encode with key', () => {
        expect(vigenereEncode('HELLO', 'KEY')).toBe('RIJVS');
      });

      it('should return error without key', () => {
        expect(vigenereEncode('HELLO', '')).toBe('Key required for Vigenère cipher');
      });

      it('should return error with non-letter key', () => {
        expect(vigenereEncode('HELLO', '123')).toBe('Key must contain letters');
      });

      it('should preserve non-alphabetic characters', () => {
        expect(vigenereEncode('Hello, World!', 'key')).toBe('Rijvs, Uyvjn!');
      });
    });

    describe('vigenereDecode', () => {
      it('should decode with key', () => {
        expect(vigenereDecode('RIJVS', 'KEY')).toBe('HELLO');
      });

      it('should roundtrip', () => {
        const original = 'Hello, World!';
        const key = 'secret';
        expect(vigenereDecode(vigenereEncode(original, key), key)).toBe(original);
      });
    });
  });

  describe('NATO Phonetic', () => {
    it('should convert letters', () => {
      expect(textToNato('ABC')).toBe('Alpha Bravo Charlie');
    });

    it('should convert numbers', () => {
      expect(textToNato('123')).toBe('One Two Three');
    });

    it('should handle full alphabet', () => {
      const result = textToNato('ABCDEFGHIJ');
      expect(result).toContain('Alpha');
      expect(result).toContain('Bravo');
      expect(result).toContain('Juliet');
    });
  });

  describe('Pig Latin', () => {
    it('should convert consonant-starting words', () => {
      expect(toPigLatin('hello')).toBe('ellohay');
    });

    it('should convert vowel-starting words', () => {
      expect(toPigLatin('apple')).toBe('appleway');
    });

    it('should handle multiple consonants', () => {
      expect(toPigLatin('string')).toBe('ingstray');
    });

    it('should handle multiple words', () => {
      expect(toPigLatin('hello world')).toBe('ellohay orldway');
    });
  });

  describe('Reverse Functions', () => {
    describe('reverseWords', () => {
      it('should reverse each word', () => {
        expect(reverseWords('hello world')).toBe('olleh dlrow');
      });

      it('should handle single word', () => {
        expect(reverseWords('hello')).toBe('olleh');
      });

      it('should preserve spaces', () => {
        expect(reverseWords('a b c')).toBe('a b c');
      });
    });

    describe('reverseString', () => {
      it('should reverse entire string', () => {
        expect(reverseString('hello')).toBe('olleh');
      });

      it('should preserve spaces in position', () => {
        expect(reverseString('hello world')).toBe('dlrow olleh');
      });

      it('should handle empty string', () => {
        expect(reverseString('')).toBe('');
      });
    });
  });

  describe('XOR Cipher', () => {
    it('should XOR with key', () => {
      const result = xorCipher('hello', 'key');
      expect(result).toBeTruthy();
      expect(result).not.toBe('hello');
    });

    it('should be self-inverse', () => {
      const original = 'Hello, World!';
      const key = 'secret';
      expect(xorCipher(xorCipher(original, key), key)).toBe(original);
    });

    it('should return error without key', () => {
      expect(xorCipher('hello', '')).toBe('Key required for XOR cipher');
    });
  });

  describe('Substitution Cipher', () => {
    it('should substitute with custom alphabet', () => {
      const alphabet = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
      expect(substitutionCipher('ABC', alphabet)).toBe('ZYX');
    });

    it('should preserve case', () => {
      const alphabet = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
      expect(substitutionCipher('Hello', alphabet)).toBe('Svool');
    });

    it('should return error for invalid alphabet length', () => {
      expect(substitutionCipher('hello', 'ABC')).toBe('Alphabet must be exactly 26 characters');
    });

    it('should preserve non-alphabetic characters', () => {
      const alphabet = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
      expect(substitutionCipher('Hello, World!', alphabet)).toBe('Svool, Dliow!');
    });
  });

  describe('Self-Inverse Ciphers', () => {
    const testStrings = ['Hello', 'The quick brown fox', 'Test123!@#'];

    testStrings.forEach((str) => {
      it(`ROT13 should be self-inverse for "${str}"`, () => {
        expect(rot13(rot13(str))).toBe(str);
      });

      it(`ROT47 should be self-inverse for "${str}"`, () => {
        expect(rot47(rot47(str))).toBe(str);
      });

      it(`Atbash should be self-inverse for "${str}"`, () => {
        expect(atbash(atbash(str))).toBe(str);
      });

      it(`XOR should be self-inverse for "${str}"`, () => {
        const key = 'test';
        expect(xorCipher(xorCipher(str, key), key)).toBe(str);
      });
    });
  });
});
