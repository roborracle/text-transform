/**
 * Cryptography and hash utility functions for developers
 */

/**
 * Pure JavaScript MD5 implementation
 * Web Crypto API does NOT support MD5, so we need a manual implementation
 */
function md5Core(input: string): string {
  // Helper functions
  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function rotateLeft(val: number, bits: number): number {
    return (val << bits) | (val >>> (32 - bits));
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  // Convert string to word array
  function stringToWordArray(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 128) {
        bytes.push(code);
      } else if (code < 2048) {
        bytes.push((code >> 6) | 192);
        bytes.push((code & 63) | 128);
      } else {
        bytes.push((code >> 12) | 224);
        bytes.push(((code >> 6) & 63) | 128);
        bytes.push((code & 63) | 128);
      }
    }

    const words: number[] = [];
    for (let i = 0; i < bytes.length; i += 4) {
      words.push(
        bytes[i] |
        ((bytes[i + 1] || 0) << 8) |
        ((bytes[i + 2] || 0) << 16) |
        ((bytes[i + 3] || 0) << 24)
      );
    }
    return words;
  }

  // Pad message
  const msgLen = input.length;
  const words = stringToWordArray(input);
  const bitLen = msgLen * 8;

  // Append padding
  words[bitLen >> 5] |= 0x80 << (bitLen % 32);
  words[(((bitLen + 64) >>> 9) << 4) + 14] = bitLen;

  // Initialize hash
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    const aa = a, bb = b, cc = c, dd = d;
    const x: number[] = [];
    for (let j = 0; j < 16; j++) {
      x[j] = words[i + j] || 0;
    }

    // Round 1
    a = ff(a, b, c, d, x[0], 7, 0xd76aa478);
    d = ff(d, a, b, c, x[1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, x[2], 17, 0x242070db);
    b = ff(b, c, d, a, x[3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, x[4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, x[5], 12, 0x4787c62a);
    c = ff(c, d, a, b, x[6], 17, 0xa8304613);
    b = ff(b, c, d, a, x[7], 22, 0xfd469501);
    a = ff(a, b, c, d, x[8], 7, 0x698098d8);
    d = ff(d, a, b, c, x[9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, x[10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, x[11], 22, 0x895cd7be);
    a = ff(a, b, c, d, x[12], 7, 0x6b901122);
    d = ff(d, a, b, c, x[13], 12, 0xfd987193);
    c = ff(c, d, a, b, x[14], 17, 0xa679438e);
    b = ff(b, c, d, a, x[15], 22, 0x49b40821);

    // Round 2
    a = gg(a, b, c, d, x[1], 5, 0xf61e2562);
    d = gg(d, a, b, c, x[6], 9, 0xc040b340);
    c = gg(c, d, a, b, x[11], 14, 0x265e5a51);
    b = gg(b, c, d, a, x[0], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[5], 5, 0xd62f105d);
    d = gg(d, a, b, c, x[10], 9, 0x02441453);
    c = gg(c, d, a, b, x[15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, x[4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, x[14], 9, 0xc33707d6);
    c = gg(c, d, a, b, x[3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, x[8], 20, 0x455a14ed);
    a = gg(a, b, c, d, x[13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, x[2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, x[7], 14, 0x676f02d9);
    b = gg(b, c, d, a, x[12], 20, 0x8d2a4c8a);

    // Round 3
    a = hh(a, b, c, d, x[5], 4, 0xfffa3942);
    d = hh(d, a, b, c, x[8], 11, 0x8771f681);
    c = hh(c, d, a, b, x[11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, x[14], 23, 0xfde5380c);
    a = hh(a, b, c, d, x[1], 4, 0xa4beea44);
    d = hh(d, a, b, c, x[4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, x[7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, x[10], 23, 0xbebfbc70);
    a = hh(a, b, c, d, x[13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, x[0], 11, 0xeaa127fa);
    c = hh(c, d, a, b, x[3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, x[6], 23, 0x04881d05);
    a = hh(a, b, c, d, x[9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, x[12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, x[15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, x[2], 23, 0xc4ac5665);

    // Round 4
    a = ii(a, b, c, d, x[0], 6, 0xf4292244);
    d = ii(d, a, b, c, x[7], 10, 0x432aff97);
    c = ii(c, d, a, b, x[14], 15, 0xab9423a7);
    b = ii(b, c, d, a, x[5], 21, 0xfc93a039);
    a = ii(a, b, c, d, x[12], 6, 0x655b59c3);
    d = ii(d, a, b, c, x[3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, x[10], 15, 0xffeff47d);
    b = ii(b, c, d, a, x[1], 21, 0x85845dd1);
    a = ii(a, b, c, d, x[8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, x[15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[6], 15, 0xa3014314);
    b = ii(b, c, d, a, x[13], 21, 0x4e0811a1);
    a = ii(a, b, c, d, x[4], 6, 0xf7537e82);
    d = ii(d, a, b, c, x[11], 10, 0xbd3af235);
    c = ii(c, d, a, b, x[2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[9], 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  // Convert to hex string
  function toHex(n: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }

  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

/**
 * Generate MD5 hash of input text
 * Note: MD5 is not cryptographically secure, use SHA-256 for security
 */
export async function md5Hash(input: string): Promise<string> {
  // MD5 is not supported by Web Crypto API, use pure JS implementation
  return md5Core(input);
}

/**
 * Generate SHA1 hash of input text
 */
export async function sha1Hash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate SHA256 hash of input text
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate SHA512 hash of input text
 */
export async function sha512Hash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate UUID v4
 */
export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Generate ULID (Universally Unique Lexicographically Sortable Identifier)
 */
export function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  const TIME_LEN = 10
  const RANDOM_LEN = 16

  const now = Date.now()
  let timeStr = ''
  let time = now

  for (let i = TIME_LEN - 1; i >= 0; i--) {
    const mod = time % ENCODING.length
    timeStr = ENCODING[mod] + timeStr
    time = Math.floor(time / ENCODING.length)
  }

  let randomStr = ''
  for (let i = 0; i < RANDOM_LEN; i++) {
    randomStr += ENCODING[Math.floor(Math.random() * ENCODING.length)]
  }

  return timeStr + randomStr
}

/**
 * Generate Nano ID
 */
export function generateNanoID(size: number = 21): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
  let id = ''

  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return id
}

/**
 * Cross-environment base64 decode helper
 */
function base64DecodeUniversal(input: string): string {
  // Handle URL-safe base64
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

  if (typeof atob === 'function') {
    return atob(padded);
  }
  // Node.js environment
  return Buffer.from(padded, 'base64').toString('utf-8');
}

/**
 * Simple JWT decoder (decode only, no verification)
 */
export function decodeJWT(token: string): string {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return 'Invalid JWT format - must have 3 parts separated by dots'
    }

    // Decode header and payload using cross-environment helper
    const header = JSON.parse(base64DecodeUniversal(parts[0]))
    const payload = JSON.parse(base64DecodeUniversal(parts[1]))

    // Format the output nicely
    return JSON.stringify({
      header,
      payload,
      signature: parts[2]
    }, null, 2)
  } catch (error) {
    return 'Error decoding JWT: ' + (error as Error).message
  }
}

/**
 * Generate HMAC-SHA256
 */
export async function generateHMACSHA256(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const messageData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate bcrypt-style hash (simplified version for demo)
 */
export function generateBcryptHash(input: string): string {
  // Note: This is a simplified representation, not actual bcrypt
  // Real bcrypt requires proper implementation with salt rounds
  void input
  return `$2b$10$${generateRandomString(22)}.${generateRandomString(31)}`
}

/**
 * Generate random string for various uses
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./='
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

/**
 * Unix timestamp converter
 */
export function unixTimestampToDate(timestamp: string): string {
  const ts = parseInt(timestamp)

  if (isNaN(ts)) {
    return 'Invalid timestamp'
  }

  // Detect if it's in seconds or milliseconds
  const isMilliseconds = ts > 9999999999
  const date = new Date(isMilliseconds ? ts : ts * 1000)

  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return `${date.toISOString()} (${date.toLocaleString()})`
}

/**
 * Date to Unix timestamp
 */
export function dateToUnixTimestamp(dateStr: string, inMilliseconds: boolean = false): string {
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) {
    return 'Invalid date format'
  }

  const timestamp = date.getTime()
  return inMilliseconds ? timestamp.toString() : Math.floor(timestamp / 1000).toString()
}

/**
 * Generate checksum (simple CRC32)
 */
export function generateChecksum(input: string): string {
  let crc = 0xFFFFFFFF

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    crc = crc ^ char

    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1)
      crc = (crc >> 1) ^ (0xEDB88320 & mask)
    }
  }

  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0')
}