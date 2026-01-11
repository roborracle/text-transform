/**
 * Encoding and decoding utility functions for developers
 */

/**
 * Base64 encode
 */
export function base64Encode(input: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return btoa(unescape(encodeURIComponent(input)))
  }
  return Buffer.from(input, 'utf-8').toString('base64')
}

/**
 * Base64 decode
 */
export function base64Decode(input: string): string {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(atob(input)))
    }
    return Buffer.from(input, 'base64').toString('utf-8')
  } catch (error) {
    return 'Invalid Base64 input'
  }
}

/**
 * URL encode
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input)
}

/**
 * URL decode
 */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input)
  } catch {
    return 'Invalid URL-encoded input'
  }
}

/**
 * HTML entity encode
 */
export function htmlEncode(input: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return String(input).replace(/[&<>"'`=/]/g, (s) => entities[s] || s)
}

/**
 * HTML entity decode
 */
export function htmlDecode(input: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  }

  let result = input
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char)
  }

  // Decode numeric entities
  result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(Number(dec)))
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))

  return result
}

/**
 * Base32 encode
 */
export function base32Encode(input: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = new TextEncoder().encode(input)
  let bits = ''
  let result = ''

  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0')
  }

  while (bits.length % 5 !== 0) {
    bits += '0'
  }

  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5)
    result += alphabet[parseInt(chunk, 2)]
  }

  while (result.length % 8 !== 0) {
    result += '='
  }

  return result
}

/**
 * Base32 decode
 */
export function base32Decode(input: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const cleanInput = input.replace(/=+$/, '').toUpperCase()
  let bits = ''

  for (const char of cleanInput) {
    const index = alphabet.indexOf(char)
    if (index === -1) throw new Error('Invalid Base32 character')
    bits += index.toString(2).padStart(5, '0')
  }

  const bytes = []
  for (let i = 0; i < bits.length - 7; i += 8) {
    const byte = bits.substr(i, 8)
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2))
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes))
}

/**
 * Binary to text
 */
export function binaryToText(input: string): string {
  const binary = input.replace(/\s/g, '')
  if (!/^[01]+$/.test(binary)) {
    return 'Invalid binary input'
  }

  let result = ''
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8)
    if (byte.length === 8) {
      result += String.fromCharCode(parseInt(byte, 2))
    }
  }

  return result
}

/**
 * Text to binary
 */
export function textToBinary(input: string): string {
  return input
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ')
}

/**
 * Hex to text
 */
export function hexToText(input: string): string {
  const hex = input.replace(/\s/g, '')
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    return 'Invalid hexadecimal input'
  }

  let result = ''
  for (let i = 0; i < hex.length; i += 2) {
    const byte = hex.substr(i, 2)
    result += String.fromCharCode(parseInt(byte, 16))
  }

  return result
}

/**
 * Text to hex
 */
export function textToHex(input: string): string {
  return input
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ')
}

/**
 * UTF-8 encode
 */
export function utf8Encode(input: string): string {
  return unescape(encodeURIComponent(input))
}

/**
 * UTF-8 decode
 */
export function utf8Decode(input: string): string {
  try {
    return decodeURIComponent(escape(input))
  } catch {
    return 'Invalid UTF-8 input'
  }
}

/**
 * ASCII to text (decimal)
 */
export function asciiToText(input: string): string {
  const codes = input.trim().split(/\s+/)
  let result = ''

  for (const code of codes) {
    const num = parseInt(code, 10)
    if (isNaN(num) || num < 0 || num > 127) {
      return 'Invalid ASCII code'
    }
    result += String.fromCharCode(num)
  }

  return result
}

/**
 * Text to ASCII (decimal)
 */
export function textToAscii(input: string): string {
  return input
    .split('')
    .map(char => char.charCodeAt(0))
    .join(' ')
}