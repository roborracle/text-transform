/**
 * Tests for cryptography and hashing functions
 */

import {
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  generateUUIDv4,
  generateULID,
  generateNanoID,
  decodeJWT,
  generateHMACSHA256,
  generateBcryptHash,
  unixTimestampToDate,
  dateToUnixTimestamp,
  generateChecksum,
} from '@/lib/transformations/crypto';

describe('Crypto Functions', () => {
  describe('Hash Functions', () => {
    describe('md5Hash', () => {
      it('should produce correct hash for empty string', async () => {
        const hash = await md5Hash('');
        expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
      });

      it('should produce correct hash for "hello"', async () => {
        const hash = await md5Hash('hello');
        expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
      });

      it('should produce correct hash for "The quick brown fox"', async () => {
        const hash = await md5Hash('The quick brown fox jumps over the lazy dog');
        expect(hash).toBe('9e107d9d372bb6826bd81d3542a419d6');
      });

      it('should produce 32-character hex string', async () => {
        const hash = await md5Hash('test');
        expect(hash).toMatch(/^[a-f0-9]{32}$/);
      });
    });

    describe('sha1Hash', () => {
      it('should produce correct hash for empty string', async () => {
        const hash = await sha1Hash('');
        expect(hash).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
      });

      it('should produce correct hash for "hello"', async () => {
        const hash = await sha1Hash('hello');
        expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
      });

      it('should produce 40-character hex string', async () => {
        const hash = await sha1Hash('test');
        expect(hash).toMatch(/^[a-f0-9]{40}$/);
      });
    });

    describe('sha256Hash', () => {
      it('should produce correct hash for empty string', async () => {
        const hash = await sha256Hash('');
        expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      });

      it('should produce correct hash for "hello"', async () => {
        const hash = await sha256Hash('hello');
        expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
      });

      it('should produce 64-character hex string', async () => {
        const hash = await sha256Hash('test');
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      });
    });

    describe('sha512Hash', () => {
      it('should produce correct hash for empty string', async () => {
        const hash = await sha512Hash('');
        expect(hash).toBe(
          'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
        );
      });

      it('should produce 128-character hex string', async () => {
        const hash = await sha512Hash('test');
        expect(hash).toMatch(/^[a-f0-9]{128}$/);
      });
    });
  });

  describe('ID Generators', () => {
    describe('generateUUIDv4', () => {
      it('should generate valid UUID v4 format', () => {
        const uuid = generateUUIDv4();
        expect(uuid).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
      });

      it('should generate unique UUIDs', () => {
        const uuid1 = generateUUIDv4();
        const uuid2 = generateUUIDv4();
        expect(uuid1).not.toBe(uuid2);
      });
    });

    describe('generateULID', () => {
      it('should generate 26-character string', () => {
        const ulid = generateULID();
        expect(ulid).toHaveLength(26);
      });

      it('should use Crockford base32 characters', () => {
        const ulid = generateULID();
        expect(ulid).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
      });

      it('should generate unique ULIDs', () => {
        const ulid1 = generateULID();
        const ulid2 = generateULID();
        expect(ulid1).not.toBe(ulid2);
      });
    });

    describe('generateNanoID', () => {
      it('should generate 21-character string by default', () => {
        const id = generateNanoID();
        expect(id).toHaveLength(21);
      });

      it('should generate custom length', () => {
        const id = generateNanoID(10);
        expect(id).toHaveLength(10);
      });

      it('should use expected character set', () => {
        const id = generateNanoID();
        expect(id).toMatch(/^[a-zA-Z0-9_-]+$/);
      });

      it('should generate unique IDs', () => {
        const id1 = generateNanoID();
        const id2 = generateNanoID();
        expect(id1).not.toBe(id2);
      });
    });
  });

  describe('JWT Decoder', () => {
    it('should decode valid JWT', () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const result = decodeJWT(jwt);
      const parsed = JSON.parse(result);

      expect(parsed.header.alg).toBe('HS256');
      expect(parsed.header.typ).toBe('JWT');
      expect(parsed.payload.sub).toBe('1234567890');
      expect(parsed.payload.name).toBe('John Doe');
    });

    it('should return error for invalid format', () => {
      const result = decodeJWT('not.valid');
      expect(result).toContain('Invalid JWT format');
    });

    it('should return error for malformed parts', () => {
      const result = decodeJWT('a.b.c');
      expect(result).toContain('Error decoding JWT');
    });
  });

  describe('HMAC', () => {
    describe('generateHMACSHA256', () => {
      it('should generate correct HMAC', async () => {
        const hmac = await generateHMACSHA256('message', 'key');
        expect(hmac).toBe('6e9ef29b75fffc5b7abae527d58fdadb2fe42e7219011976917343065f58ed4a');
      });

      it('should produce 64-character hex string', async () => {
        const hmac = await generateHMACSHA256('test', 'secret');
        expect(hmac).toMatch(/^[a-f0-9]{64}$/);
      });

      it('should produce different output for different keys', async () => {
        const hmac1 = await generateHMACSHA256('message', 'key1');
        const hmac2 = await generateHMACSHA256('message', 'key2');
        expect(hmac1).not.toBe(hmac2);
      });
    });
  });

  describe('Bcrypt', () => {
    describe('generateBcryptHash', () => {
      it('should generate bcrypt-formatted string', () => {
        const hash = generateBcryptHash('password');
        expect(hash).toMatch(/^\$2b\$10\$.+$/);
      });

      it('should generate different hashes each time', () => {
        const hash1 = generateBcryptHash('password');
        const hash2 = generateBcryptHash('password');
        expect(hash1).not.toBe(hash2);
      });
    });
  });

  describe('Timestamp Converters', () => {
    describe('unixTimestampToDate', () => {
      it('should convert seconds timestamp', () => {
        const result = unixTimestampToDate('1609459200');
        expect(result).toContain('2021-01-01');
      });

      it('should convert milliseconds timestamp', () => {
        const result = unixTimestampToDate('1609459200000');
        expect(result).toContain('2021-01-01');
      });

      it('should return error for invalid timestamp', () => {
        const result = unixTimestampToDate('not-a-number');
        expect(result).toBe('Invalid timestamp');
      });
    });

    describe('dateToUnixTimestamp', () => {
      it('should convert date to seconds', () => {
        const result = dateToUnixTimestamp('2021-01-01T00:00:00Z');
        expect(result).toBe('1609459200');
      });

      it('should convert date to milliseconds', () => {
        const result = dateToUnixTimestamp('2021-01-01T00:00:00Z', true);
        expect(result).toBe('1609459200000');
      });

      it('should return error for invalid date', () => {
        const result = dateToUnixTimestamp('not-a-date');
        expect(result).toBe('Invalid date format');
      });
    });
  });

  describe('Checksum', () => {
    describe('generateChecksum', () => {
      it('should generate CRC32 checksum', () => {
        const checksum = generateChecksum('hello');
        expect(checksum).toMatch(/^[0-9A-F]{8}$/);
      });

      it('should generate different checksums for different inputs', () => {
        const checksum1 = generateChecksum('hello');
        const checksum2 = generateChecksum('world');
        expect(checksum1).not.toBe(checksum2);
      });

      it('should generate same checksum for same input', () => {
        const checksum1 = generateChecksum('test');
        const checksum2 = generateChecksum('test');
        expect(checksum1).toBe(checksum2);
      });
    });
  });
});
