/**
 * Code formatting utilities for various programming languages
 */

/**
 * Format JSON with proper indentation
 */
export function formatJSON(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, indent)
  } catch (error) {
    return 'Invalid JSON: ' + (error as Error).message
  }
}

/**
 * Minify JSON by removing whitespace
 */
export function minifyJSON(input: string): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  } catch (error) {
    return 'Invalid JSON: ' + (error as Error).message
  }
}

/**
 * Format SQL with proper indentation and keywords
 */
export function formatSQL(input: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
    'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'DROP INDEX', 'AS', 'AND', 'OR',
    'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'DISTINCT', 'ALL'
  ]

  let formatted = input.trim()

  // Uppercase keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, keyword)
  })

  // Add newlines before major clauses
  formatted = formatted
    .replace(/\s+(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION)/g, '\n$1')
    .replace(/\s+(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)/g, '\n  $1')
    .replace(/\s+AND\s+/g, '\n  AND ')
    .replace(/\s+OR\s+/g, '\n  OR ')
    .replace(/,\s*/g, ',\n  ')

  // Clean up multiple newlines
  formatted = formatted.replace(/\n\s*\n/g, '\n')

  return formatted.trim()
}

/**
 * Minify SQL by removing extra whitespace
 */
export function minifySQL(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),])\s*/g, '$1')
    .replace(/;\s*/g, ';')
    .trim()
}

/**
 * Format XML with proper indentation
 */
export function formatXML(input: string): string {
  try {
    let formatted = ''
    let indent = 0
    const tab = '  '

    // Remove existing formatting
    const xml = input.replace(/>\s+</g, '><').trim()

    // Split by tags
    const tokens = xml.split(/(<[^>]*>)/).filter(token => token)

    for (const token of tokens) {
      if (token.startsWith('<?') || token.startsWith('<!')) {
        // Declaration or DOCTYPE
        formatted += token + '\n'
      } else if (token.startsWith('</')) {
        // Closing tag
        indent--
        formatted += tab.repeat(Math.max(0, indent)) + token + '\n'
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        // Self-closing tag
        formatted += tab.repeat(indent) + token + '\n'
      } else if (token.startsWith('<')) {
        // Opening tag
        formatted += tab.repeat(indent) + token + '\n'
        if (!token.includes('</')) {
          indent++
        }
      } else {
        // Text content
        const text = token.trim()
        if (text) {
          formatted += tab.repeat(indent) + text + '\n'
        }
      }
    }

    return formatted.trim()
  } catch {
    return 'Error formatting XML'
  }
}

/**
 * Minify XML
 */
export function minifyXML(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/>\s+</g, '><')         // Remove whitespace between tags
    .replace(/\s+/g, ' ')             // Collapse multiple spaces
    .trim()
}

/**
 * Format CSS with proper indentation
 */
export function formatCSS(input: string): string {
  try {
    let css = input.trim()
    let formatted = ''
    let indent = 0
    const tab = '  '

    // Remove comments for cleaner parsing
    css = css.replace(/\/\*[\s\S]*?\*\//g, '')

    // Add spaces around braces and semicolons
    css = css.replace(/\{/g, ' {\n')
    css = css.replace(/\}/g, '\n}\n')
    css = css.replace(/;/g, ';\n')
    css = css.replace(/,/g, ',\n')

    // Split into lines and format
    const lines = css.split('\n')

    for (let line of lines) {
      line = line.trim()
      if (!line) continue

      if (line.includes('}')) {
        indent--
      }

      formatted += tab.repeat(Math.max(0, indent)) + line + '\n'

      if (line.includes('{')) {
        indent++
      }
    }

    // Clean up
    formatted = formatted
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .replace(/\{\n\n/g, '{\n')   // Remove extra line after {
      .replace(/;\n\}/g, ';\n}')   // Clean up closing braces

    return formatted.trim()
  } catch {
    return 'Error formatting CSS'
  }
}

/**
 * Minify CSS
 */
export function minifyCSS(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')              // Collapse spaces
    .replace(/\s*{\s*/g, '{')          // Remove space around {
    .replace(/\s*}\s*/g, '}')          // Remove space around }
    .replace(/\s*:\s*/g, ':')          // Remove space around :
    .replace(/\s*;\s*/g, ';')          // Remove space around ;
    .replace(/\s*,\s*/g, ',')          // Remove space around ,
    .replace(/;}/g, '}')               // Remove last semicolon
    .trim()
}

/**
 * Format JavaScript/TypeScript
 */
export function formatJavaScript(input: string): string {
  try {
    // Basic formatting - in production, use a proper parser like Prettier
    let formatted = input

    // Add spaces around operators
    formatted = formatted.replace(/([=+\-*/%<>!&|])/g, ' $1 ')

    // Fix spacing around parentheses and braces
    formatted = formatted.replace(/\s*\(\s*/g, '(')
    formatted = formatted.replace(/\s*\)\s*/g, ')')
    formatted = formatted.replace(/\)\s*{/g, ') {')

    // Add newlines after statements
    formatted = formatted.replace(/;/g, ';\n')
    formatted = formatted.replace(/{/g, '{\n')
    formatted = formatted.replace(/}/g, '\n}\n')

    // Clean up multiple spaces and newlines
    formatted = formatted.replace(/\s+/g, ' ')
    formatted = formatted.replace(/\n\s*\n/g, '\n')

    return formatted.trim()
  } catch {
    return 'Error formatting JavaScript'
  }
}

/**
 * Minify JavaScript
 */
export function minifyJavaScript(input: string): string {
  // Basic minification - in production, use a proper minifier
  return input
    .replace(/\/\/.*$/gm, '')          // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
    .replace(/\s+/g, ' ')               // Collapse whitespace
    .replace(/\s*([{}();,:])\s*/g, '$1') // Remove space around syntax
    .replace(/;\s*}/g, '}')             // Remove unnecessary semicolons
    .trim()
}

/**
 * Format HTML
 */
export function formatHTML(input: string): string {
  try {
    const html = input.trim()
    let formatted = ''
    let indent = 0
    const tab = '  '

    // Split by tags
    const tokens = html.split(/(<[^>]*>)/).filter(token => token)

    const inlineTags = ['span', 'a', 'strong', 'em', 'b', 'i', 'code', 'small', 'sub', 'sup']

    for (const token of tokens) {
      if (token.startsWith('<!--')) {
        // Comment
        formatted += tab.repeat(indent) + token + '\n'
      } else if (token.startsWith('<!')) {
        // DOCTYPE
        formatted += token + '\n'
      } else if (token.startsWith('</')) {
        // Closing tag
        const tagName = token.match(/<\/(\w+)/)?.[1]
        if (tagName && !inlineTags.includes(tagName.toLowerCase())) {
          indent--
        }
        formatted += tab.repeat(Math.max(0, indent)) + token + '\n'
      } else if (token.endsWith('/>')) {
        // Self-closing tag
        formatted += tab.repeat(indent) + token + '\n'
      } else if (token.startsWith('<')) {
        // Opening tag
        formatted += tab.repeat(indent) + token + '\n'
        const tagName = token.match(/<(\w+)/)?.[1]
        if (tagName && !inlineTags.includes(tagName.toLowerCase()) && !token.endsWith('/>')) {
          indent++
        }
      } else {
        // Text content
        const text = token.trim()
        if (text) {
          formatted += tab.repeat(indent) + text + '\n'
        }
      }
    }

    return formatted.trim()
  } catch {
    return 'Error formatting HTML'
  }
}

/**
 * Minify HTML
 */
export function minifyHTML(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, '')  // Remove comments
    .replace(/>\s+</g, '><')          // Remove whitespace between tags
    .replace(/\s+/g, ' ')              // Collapse spaces
    .replace(/\s*=\s*/g, '=')          // Remove spaces around =
    .trim()
}

/**
 * Format YAML
 */
export function formatYAML(input: string): string {
  try {
    // Basic YAML formatting
    const lines = input.split('\n')
    const formatted: string[] = []

    for (let line of lines) {
      line = line.trimEnd()

      // Skip empty lines
      if (!line.trim()) {
        formatted.push('')
        continue
      }

      // Determine indentation
      const leadingSpaces = line.length - line.trimStart().length
      const indentLevel = Math.floor(leadingSpaces / 2)

      // Format the line
      const content = line.trim()
      formatted.push('  '.repeat(indentLevel) + content)
    }

    return formatted.join('\n').trim()
  } catch {
    return 'Error formatting YAML'
  }
}

/**
 * Convert JSON to YAML
 */
export function jsonToYAML(input: string): string {
  try {
    const obj = JSON.parse(input)

    function toYAML(obj: unknown, indent: number = 0): string {
      const spacing = '  '.repeat(indent)
      let result = ''

      if (Array.isArray(obj)) {
        obj.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            result += `${spacing}- \n${toYAML(item, indent + 1)}`
          } else {
            result += `${spacing}- ${item}\n`
          }
        })
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            result += `${spacing}${key}:\n${toYAML(value, indent + 1)}`
          } else {
            result += `${spacing}${key}: ${value}\n`
          }
        })
      } else {
        result = `${spacing}${obj}\n`
      }

      return result
    }

    return toYAML(obj).trim()
  } catch {
    return 'Invalid JSON input'
  }
}

/**
 * Convert YAML to JSON
 */
export function yamlToJSON(input: string): string {
  try {
    // Very basic YAML to JSON converter
    // In production, use a proper YAML parser
    const lines = input.split('\n')
    const result: Record<string, unknown> = {}
    const stack: unknown[] = [result]
    let lastIndent = -1

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue

      const indent = line.length - line.trimStart().length
      const content = line.trim()

      if (content.startsWith('- ')) {
        // Array item
        const value = content.substring(2).trim()
        const current = stack[stack.length - 1]
        if (!Array.isArray(current)) {
          const parent = stack[stack.length - 2]
          if (!parent || typeof parent !== 'object') {
            return 'Error converting YAML to JSON'
          }
          const parentObj = parent as Record<string, unknown>
          const key = Object.keys(parentObj).pop()
          if (!key) {
            return 'Error converting YAML to JSON'
          }
          parentObj[key] = []
          stack[stack.length - 1] = parentObj[key]
        }
        ;(stack[stack.length - 1] as unknown[]).push(value)
      } else if (content.includes(':')) {
        // Key-value pair
        const [key, ...valueParts] = content.split(':')
        const value = valueParts.join(':').trim()

        if (indent > lastIndent) {
          // Nested object
          const parent = stack[stack.length - 1]
          if (!parent || typeof parent !== 'object') {
            return 'Error converting YAML to JSON'
          }
          const parentObj = parent as Record<string, unknown>
          if (!value) {
            parentObj[key] = {}
            stack.push(parentObj[key])
          } else {
            parentObj[key] = value
          }
        } else if (indent < lastIndent) {
          // Go back up
          const levelDiff = (lastIndent - indent) / 2
          for (let i = 0; i < levelDiff; i++) {
            stack.pop()
          }
          const parent = stack[stack.length - 1]
          if (!parent || typeof parent !== 'object') {
            return 'Error converting YAML to JSON'
          }
          const parentObj = parent as Record<string, unknown>
          if (!value) {
            parentObj[key] = {}
            stack.push(parentObj[key])
          } else {
            parentObj[key] = value
          }
        } else {
          // Same level
          const parent = stack[stack.length - 1]
          if (!parent || typeof parent !== 'object') {
            return 'Error converting YAML to JSON'
          }
          const parentObj = parent as Record<string, unknown>
          if (!value) {
            parentObj[key] = {}
            stack.push(parentObj[key])
          } else {
            parentObj[key] = value
          }
        }
      }

      lastIndent = indent
    }

    return JSON.stringify(result, null, 2)
  } catch {
    return 'Error converting YAML to JSON'
  }
}