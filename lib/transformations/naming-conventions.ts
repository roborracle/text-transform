/**
 * Naming convention converters for programming contexts
 * Converts between camelCase, PascalCase, snake_case, kebab-case, and more
 */

/**
 * Convert text to camelCase
 * Example: "hello world" -> "helloWorld"
 */
export function toCamelCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * Convert text to PascalCase
 * Example: "hello world" -> "HelloWorld"
 */
export function toPascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * Convert text to snake_case
 * Example: "hello world" -> "hello_world"
 */
export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

/**
 * Convert text to SCREAMING_SNAKE_CASE (constant case)
 * Example: "hello world" -> "HELLO_WORLD"
 */
export function toScreamingSnakeCase(input: string): string {
  return toSnakeCase(input).toUpperCase()
}

/**
 * Convert text to kebab-case
 * Example: "hello world" -> "hello-world"
 */
export function toKebabCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/**
 * Convert text to Train-Case (HTTP header case)
 * Example: "hello world" -> "Hello-World"
 */
export function toTrainCase(input: string): string {
  return toKebabCase(input)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}

/**
 * Convert text to dot.case
 * Example: "hello world" -> "hello.world"
 */
export function toDotCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase()
}

/**
 * Convert text to path/case
 * Example: "hello world" -> "hello/world"
 */
export function toPathCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1/$2')
    .replace(/[^a-zA-Z0-9]+/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()
}

/**
 * Convert text to namespace\case (PHP namespace style)
 * Example: "hello world" -> "Hello\World"
 */
export function toNamespaceCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1\\$2')
    .replace(/[^a-zA-Z0-9]+/g, '\\')
    .replace(/^\\+|\\+$/g, '')
    .split('\\')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('\\')
}

/**
 * Convert text to Ada_Case
 * Example: "hello world" -> "Hello_World"
 */
export function toAdaCase(input: string): string {
  return toSnakeCase(input)
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_')
}

/**
 * Convert text to COBOL-CASE
 * Example: "hello world" -> "HELLO-WORLD"
 */
export function toCobolCase(input: string): string {
  return toKebabCase(input).toUpperCase()
}

/**
 * Convert text to flatcase (all lowercase, no separators)
 * Example: "hello world" -> "helloworld"
 */
export function toFlatCase(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

/**
 * Convert text to UPPERFLATCASE
 * Example: "hello world" -> "HELLOWORLD"
 */
export function toUpperFlatCase(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

/**
 * Detect the naming convention of input text
 */
export function detectNamingConvention(input: string): string {
  if (/^[a-z]+([A-Z][a-z]*)*$/.test(input)) return 'camelCase'
  if (/^[A-Z][a-z]*([A-Z][a-z]*)*$/.test(input)) return 'PascalCase'
  if (/^[a-z]+(_[a-z]+)*$/.test(input)) return 'snake_case'
  if (/^[A-Z]+(_[A-Z]+)*$/.test(input)) return 'SCREAMING_SNAKE_CASE'
  if (/^[a-z]+(-[a-z]+)*$/.test(input)) return 'kebab-case'
  if (/^[A-Z][a-z]*(-[A-Z][a-z]*)*$/.test(input)) return 'Train-Case'
  if (/^[A-Z]+(-[A-Z]+)*$/.test(input)) return 'COBOL-CASE'
  if (/^[a-z]+(\.[a-z]+)*$/.test(input)) return 'dot.case'
  if (/^[a-z]+(\/[a-z]+)*$/.test(input)) return 'path/case'
  if (/^[A-Z][a-z]*(\\[A-Z][a-z]*)*$/.test(input)) return 'Namespace\\Case'
  if (/^[A-Z][a-z]*(_[A-Z][a-z]*)*$/.test(input)) return 'Ada_Case'
  return 'unknown'
}

/**
 * Convert from any naming convention to any other
 */
export function convertNamingConvention(
  input: string,
  targetConvention: string
): string {
  // First normalize to words
  const normalized = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-./\\]+/g, ' ')
    .trim()

  switch (targetConvention.toLowerCase()) {
    case 'camelcase':
      return toCamelCase(normalized)
    case 'pascalcase':
      return toPascalCase(normalized)
    case 'snakecase':
    case 'snake_case':
      return toSnakeCase(normalized)
    case 'screamingsnakecase':
    case 'screaming_snake_case':
    case 'constantcase':
      return toScreamingSnakeCase(normalized)
    case 'kebabcase':
    case 'kebab-case':
      return toKebabCase(normalized)
    case 'traincase':
    case 'train-case':
      return toTrainCase(normalized)
    case 'dotcase':
    case 'dot.case':
      return toDotCase(normalized)
    case 'pathcase':
    case 'path/case':
      return toPathCase(normalized)
    case 'namespacecase':
      return toNamespaceCase(normalized)
    case 'adacase':
    case 'ada_case':
      return toAdaCase(normalized)
    case 'cobolcase':
    case 'cobol-case':
      return toCobolCase(normalized)
    case 'flatcase':
      return toFlatCase(normalized)
    case 'upperflatcase':
      return toUpperFlatCase(normalized)
    default:
      return input
  }
}
