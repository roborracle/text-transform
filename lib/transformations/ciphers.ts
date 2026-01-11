/**
 * Cipher and encoding utilities
 * Caesar, ROT13, Morse code, and more
 */

/**
 * Caesar cipher encoder
 */
export function caesarEncode(input: string, shift: number = 3): string {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
  })
}

/**
 * Caesar cipher decoder
 */
export function caesarDecode(input: string, shift: number = 3): string {
  return caesarEncode(input, 26 - (shift % 26))
}

/**
 * ROT13 encoder/decoder (symmetric)
 */
export function rot13(input: string): string {
  return caesarEncode(input, 13)
}

/**
 * ROT47 encoder/decoder (includes numbers and symbols)
 */
export function rot47(input: string): string {
  return input.replace(/[!-~]/g, (char) => {
    return String.fromCharCode(33 + ((char.charCodeAt(0) - 33 + 47) % 94))
  })
}

/**
 * Atbash cipher (reverse alphabet substitution)
 */
export function atbash(input: string): string {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65
    return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)))
  })
}

/**
 * Morse code alphabet
 */
const morseAlphabet: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/',
}

const reverseMorse: Record<string, string> = Object.fromEntries(
  Object.entries(morseAlphabet).map(([k, v]) => [v, k])
)

/**
 * Text to Morse code
 */
export function textToMorse(input: string): string {
  return input
    .toUpperCase()
    .split('')
    .map(char => morseAlphabet[char] || char)
    .join(' ')
}

/**
 * Morse code to text
 */
export function morseToText(input: string): string {
  return input
    .split(' ')
    .map(code => {
      if (code === '/') return ' '
      if (code === '') return ''
      return reverseMorse[code] || code
    })
    .join('')
}

/**
 * Vigenère cipher encoder
 */
export function vigenereEncode(input: string, key: string): string {
  if (!key) return 'Key required for Vigenère cipher'

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!keyUpper) return 'Key must contain letters'

  let keyIndex = 0
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65
    const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65
    keyIndex++
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
  })
}

/**
 * Vigenère cipher decoder
 */
export function vigenereDecode(input: string, key: string): string {
  if (!key) return 'Key required for Vigenère cipher'

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!keyUpper) return 'Key must contain letters'

  let keyIndex = 0
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65
    const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65
    keyIndex++
    return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base)
  })
}

/**
 * NATO phonetic alphabet encoder
 */
const natoAlphabet: Record<string, string> = {
  'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
  'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet',
  'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
  'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
  'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner',
}

export function textToNato(input: string): string {
  return input
    .toUpperCase()
    .split('')
    .map(char => natoAlphabet[char] || char)
    .join(' ')
}

/**
 * Pig Latin converter
 */
export function toPigLatin(input: string): string {
  return input.replace(/\b([bcdfghjklmnpqrstvwxyz]*)(\w+)/gi, (match, consonants, rest) => {
    if (!consonants) {
      return rest + 'way'
    }
    return rest + consonants.toLowerCase() + 'ay'
  })
}

/**
 * Reverse each word
 */
export function reverseWords(input: string): string {
  return input.split(' ').map(word => word.split('').reverse().join('')).join(' ')
}

/**
 * Reverse entire string
 */
export function reverseString(input: string): string {
  return input.split('').reverse().join('')
}

/**
 * Binary XOR cipher
 */
export function xorCipher(input: string, key: string): string {
  if (!key) return 'Key required for XOR cipher'

  let result = ''
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

/**
 * Simple substitution cipher with custom alphabet
 */
export function substitutionCipher(input: string, alphabet: string): string {
  if (alphabet.length !== 26) {
    return 'Alphabet must be exactly 26 characters'
  }

  const normalAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const upperAlphabet = alphabet.toUpperCase()

  return input.replace(/[a-zA-Z]/g, (char) => {
    const isLower = char >= 'a' && char <= 'z'
    const index = normalAlpha.indexOf(char.toUpperCase())
    const replacement = upperAlphabet[index]
    return isLower ? replacement.toLowerCase() : replacement
  })
}
