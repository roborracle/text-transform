/**
 * Random data generators for developers
 * Passwords, IPs, strings, and more
 */

/**
 * Generate secure random password
 */
export function generatePassword(
  length: number = 16,
  options: {
    uppercase?: boolean
    lowercase?: boolean
    numbers?: boolean
    symbols?: boolean
  } = {}
): string {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options

  let chars = ''
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers) chars += '0123456789'
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  return password
}

/**
 * Generate random IPv4 address
 */
export function generateIPv4(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
}

/**
 * Generate random IPv6 address
 */
export function generateIPv6(): string {
  return Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
  ).join(':')
}

/**
 * Generate random MAC address
 */
export function generateMacAddress(separator: string = ':'): string {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(separator)
}

/**
 * Generate random string
 */
export function generateRandomString(
  length: number = 32,
  charset: 'alphanumeric' | 'alpha' | 'numeric' | 'hex' = 'alphanumeric'
): string {
  const charsets: Record<string, string> = {
    alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeric: '0123456789',
    hex: '0123456789abcdef',
  }

  const chars = charsets[charset] || charsets.alphanumeric
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

/**
 * Generate Lorem Ipsum text
 */
export function generateLoremIpsum(
  paragraphs: number = 1,
  wordsPerParagraph: number = 50
): string {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
    'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos',
    'dolores', 'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate',
  ]

  const result: string[] = []

  for (let p = 0; p < paragraphs; p++) {
    const paragraph: string[] = []
    for (let w = 0; w < wordsPerParagraph; w++) {
      paragraph.push(words[Math.floor(Math.random() * words.length)])
    }
    // Capitalize first word and add period
    paragraph[0] = paragraph[0].charAt(0).toUpperCase() + paragraph[0].slice(1)
    result.push(paragraph.join(' ') + '.')
  }

  return result.join('\n\n')
}

/**
 * Generate random date within range
 */
export function generateRandomDate(
  start: Date = new Date(2020, 0, 1),
  end: Date = new Date()
): string {
  const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(timestamp).toISOString()
}

/**
 * Generate random email address
 */
export function generateRandomEmail(domain: string = 'example.com'): string {
  const username = generateRandomString(8, 'alpha').toLowerCase()
  return `${username}@${domain}`
}

/**
 * Generate random username
 */
export function generateRandomUsername(): string {
  const adjectives = ['happy', 'cool', 'fast', 'clever', 'bright', 'swift', 'bold', 'calm']
  const nouns = ['tiger', 'eagle', 'wolf', 'bear', 'fox', 'hawk', 'lion', 'deer']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  return `${adj}_${noun}${num}`
}

/**
 * Generate random phone number
 */
export function generateRandomPhone(format: 'us' | 'international' = 'us'): string {
  if (format === 'us') {
    const area = Math.floor(Math.random() * 900) + 100
    const exchange = Math.floor(Math.random() * 900) + 100
    const subscriber = Math.floor(Math.random() * 9000) + 1000
    return `(${area}) ${exchange}-${subscriber}`
  }

  const country = Math.floor(Math.random() * 99) + 1
  const number = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')
  return `+${country} ${number}`
}

/**
 * Generate random credit card number (for testing only - Luhn valid)
 */
export function generateTestCreditCard(type: 'visa' | 'mastercard' | 'amex' = 'visa'): string {
  const prefixes: Record<string, string> = {
    visa: '4',
    mastercard: '5' + Math.floor(Math.random() * 5 + 1),
    amex: '3' + (Math.random() > 0.5 ? '4' : '7'),
  }

  const length = type === 'amex' ? 15 : 16
  let number = prefixes[type]

  // Generate random digits
  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10)
  }

  // Calculate Luhn check digit
  let sum = 0
  let isEven = false
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i])
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  const checkDigit = (10 - (sum % 10)) % 10

  return number + checkDigit
}

/**
 * Generate random slug
 */
export function generateSlug(words: number = 3): string {
  const wordList = [
    'quick', 'brown', 'fox', 'lazy', 'dog', 'bright', 'sunny', 'day',
    'cool', 'fresh', 'new', 'hot', 'cold', 'warm', 'fast', 'slow',
    'big', 'small', 'red', 'blue', 'green', 'happy', 'sad', 'great',
  ]

  const selected: string[] = []
  for (let i = 0; i < words; i++) {
    selected.push(wordList[Math.floor(Math.random() * wordList.length)])
  }

  return selected.join('-')
}

/**
 * Generate random API key style string
 */
export function generateApiKey(prefix: string = 'sk'): string {
  return `${prefix}_${generateRandomString(32, 'alphanumeric')}`
}
