/**
 * Cryptography and hash utility functions for developers
 */

/**
 * Generate MD5 hash of input text
 */
export async function md5Hash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('MD-5', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
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
 * Simple JWT decoder (decode only, no verification)
 */
export function decodeJWT(token: string): string {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return 'Invalid JWT format - must have 3 parts separated by dots'
    }

    // Decode header and payload
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))

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