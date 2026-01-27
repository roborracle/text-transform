/**
 * Random data generators for developers
 * Passwords, IPs, strings, and more
 *
 * SECURITY: All random generation uses crypto.getRandomValues()
 * for cryptographically secure randomness
 */

/**
 * Cryptographically secure random integer
 */
function secureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Cryptographically secure random float (0-1)
 */
function secureRandomFloat(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

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
    password += chars[secureRandomInt( chars.length)]
  }

  return password
}

/**
 * Generate random IPv4 address
 */
export function generateIPv4(): string {
  return Array.from({ length: 4 }, () => secureRandomInt( 256)).join('.')
}

/**
 * Generate random IPv6 address
 */
export function generateIPv6(): string {
  return Array.from({ length: 8 }, () =>
    secureRandomInt( 65536).toString(16).padStart(4, '0')
  ).join(':')
}

/**
 * Generate random MAC address
 */
export function generateMacAddress(separator: string = ':'): string {
  return Array.from({ length: 6 }, () =>
    secureRandomInt( 256).toString(16).padStart(2, '0')
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
    result += chars[secureRandomInt( chars.length)]
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
      paragraph.push(words[secureRandomInt( words.length)])
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
  const adj = adjectives[secureRandomInt( adjectives.length)]
  const noun = nouns[secureRandomInt( nouns.length)]
  const num = secureRandomInt( 1000)
  return `${adj}_${noun}${num}`
}

/**
 * Generate random phone number
 */
export function generateRandomPhone(format: 'us' | 'international' = 'us'): string {
  if (format === 'us') {
    const area = secureRandomInt( 900) + 100
    const exchange = secureRandomInt( 900) + 100
    const subscriber = secureRandomInt( 9000) + 1000
    return `(${area}) ${exchange}-${subscriber}`
  }

  const country = secureRandomInt( 99) + 1
  const number = Array.from({ length: 10 }, () => secureRandomInt( 10)).join('')
  return `+${country} ${number}`
}

/**
 * Generate random credit card number (for testing only - Luhn valid)
 */
export function generateTestCreditCard(type: 'visa' | 'mastercard' | 'amex' = 'visa'): string {
  const prefixes: Record<string, string> = {
    visa: '4',
    mastercard: '5' + secureRandomInt( 5 + 1),
    amex: '3' + (Math.random() > 0.5 ? '4' : '7'),
  }

  const length = type === 'amex' ? 15 : 16
  let number = prefixes[type]

  // Generate random digits
  while (number.length < length - 1) {
    number += secureRandomInt( 10)
  }

  // Calculate Luhn check digit
  // The last digit of partial number is at position 2 in final number, so start doubling
  let sum = 0
  let shouldDouble = true
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
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
    selected.push(wordList[secureRandomInt( wordList.length)])
  }

  return selected.join('-')
}

/**
 * Generate random API key style string
 */
export function generateApiKey(prefix: string = 'sk'): string {
  return `${prefix}_${generateRandomString(32, 'alphanumeric')}`
}

/**
 * Generate random integers within a range (random.org style)
 */
export function generateRandomIntegers(
  min: number = 1,
  max: number = 100,
  count: number = 1,
  unique: boolean = false
): string {
  if (min > max) [min, max] = [max, min]
  const range = max - min + 1

  if (unique && count > range) {
    return `Error: Cannot generate ${count} unique numbers in range ${min}-${max}`
  }

  const results: number[] = []
  const used = new Set<number>()

  while (results.length < count) {
    const num = min + secureRandomInt(range)
    if (unique) {
      if (!used.has(num)) {
        used.add(num)
        results.push(num)
      }
    } else {
      results.push(num)
    }
  }

  return results.join(', ')
}

/**
 * Roll dice (random.org style)
 */
export function rollDice(
  sides: number = 6,
  count: number = 1,
  showTotal: boolean = true
): string {
  const validSides = [4, 6, 8, 10, 12, 20, 100]
  if (!validSides.includes(sides)) {
    sides = 6
  }

  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(secureRandomInt(sides) + 1)
  }

  const total = rolls.reduce((sum, n) => sum + n, 0)
  const rollsStr = rolls.join(', ')

  if (showTotal && count > 1) {
    return `Rolls: ${rollsStr}\nTotal: ${total}`
  }
  return rollsStr
}

/**
 * Flip coins (random.org style)
 */
export function flipCoins(count: number = 1): string {
  const results: string[] = []
  let heads = 0
  let tails = 0

  for (let i = 0; i < count; i++) {
    if (secureRandomInt(2) === 0) {
      results.push('Heads')
      heads++
    } else {
      results.push('Tails')
      tails++
    }
  }

  if (count === 1) {
    return results[0]
  }

  return `Results: ${results.join(', ')}\nHeads: ${heads}, Tails: ${tails}`
}

/**
 * Generate random time of day
 */
export function generateRandomTime(format: '12h' | '24h' = '24h'): string {
  const hours = secureRandomInt(24)
  const minutes = secureRandomInt(60)
  const seconds = secureRandomInt(60)

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    return `${hour12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Shuffle a sequence of numbers
 */
export function shuffleSequence(start: number = 1, end: number = 10): string {
  if (start > end) [start, end] = [end, start]

  const sequence: number[] = []
  for (let i = start; i <= end; i++) {
    sequence.push(i)
  }

  // Fisher-Yates shuffle with secure random
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    ;[sequence[i], sequence[j]] = [sequence[j], sequence[i]]
  }

  return sequence.join(', ')
}

/**
 * Generate random decimal fractions
 */
export function generateRandomDecimals(
  count: number = 1,
  decimalPlaces: number = 2
): string {
  const results: string[] = []

  for (let i = 0; i < count; i++) {
    const num = secureRandomFloat()
    results.push(num.toFixed(decimalPlaces))
  }

  return results.join(', ')
}

/**
 * Generate random hex color codes (multiple)
 */
export function generateHexColors(count: number = 1): string {
  const colors: string[] = []

  for (let i = 0; i < count; i++) {
    const r = secureRandomInt(256)
    const g = secureRandomInt(256)
    const b = secureRandomInt(256)
    colors.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase())
  }

  return colors.join('\n')
}

/**
 * Generate random bytes (hex encoded)
 */
export function generateRandomBytes(count: number = 16): string {
  const bytes: string[] = []

  for (let i = 0; i < count; i++) {
    bytes.push(secureRandomInt(256).toString(16).padStart(2, '0'))
  }

  return bytes.join('')
}

/**
 * Pick random items from a list
 */
export function pickFromList(
  input: string,
  count: number = 1,
  unique: boolean = true
): string {
  const items = input.split('\n').map(s => s.trim()).filter(s => s.length > 0)

  if (items.length === 0) {
    return 'Error: No items provided'
  }

  if (unique && count > items.length) {
    return `Error: Cannot pick ${count} unique items from ${items.length} items`
  }

  const results: string[] = []
  const used = new Set<number>()

  while (results.length < count) {
    const idx = secureRandomInt(items.length)
    if (unique) {
      if (!used.has(idx)) {
        used.add(idx)
        results.push(items[idx])
      }
    } else {
      results.push(items[idx])
    }
  }

  return results.join('\n')
}
