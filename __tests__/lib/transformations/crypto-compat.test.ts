/**
 * Browser API Compatibility Tests
 * Verifies that crypto functions work correctly with known values
 */

import { md5Hash, sha256Hash, decodeJWT } from '@/lib/transformations/crypto';

describe('Browser API Compatibility', () => {
  describe('MD5 Hash', () => {
    it('should produce correct hash for empty string', async () => {
      const hash = await md5Hash('');
      expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should produce correct hash for "hello"', async () => {
      const hash = await md5Hash('hello');
      expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('should produce correct hash for "The quick brown fox jumps over the lazy dog"', async () => {
      const hash = await md5Hash('The quick brown fox jumps over the lazy dog');
      expect(hash).toBe('9e107d9d372bb6826bd81d3542a419d6');
    });

    it('should handle unicode characters', async () => {
      const hash = await md5Hash('héllo wörld');
      // This should not throw and should produce a 32-char hex string
      expect(hash).toMatch(/^[a-f0-9]{32}$/);
    });
  });

  describe('SHA-256 Hash', () => {
    it('should produce correct hash for empty string', async () => {
      const hash = await sha256Hash('');
      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });

    it('should produce correct hash for "hello"', async () => {
      const hash = await sha256Hash('hello');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });
  });

  describe('JWT Decoder', () => {
    it('should decode a valid JWT', () => {
      // Example JWT with header: {"alg":"HS256","typ":"JWT"} and payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const result = decodeJWT(jwt);
      const parsed = JSON.parse(result);

      expect(parsed.header.alg).toBe('HS256');
      expect(parsed.header.typ).toBe('JWT');
      expect(parsed.payload.sub).toBe('1234567890');
      expect(parsed.payload.name).toBe('John Doe');
    });

    it('should handle invalid JWT format', () => {
      const result = decodeJWT('not.a.valid.jwt.token');
      expect(result).toContain('Invalid JWT format');
    });

    it('should handle malformed base64', () => {
      const result = decodeJWT('invalid.invalid.invalid');
      expect(result).toContain('Error decoding JWT');
    });
  });
});
