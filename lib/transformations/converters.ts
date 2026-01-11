/**
 * Data format conversion utilities for developers
 */

/**
 * CSV to JSON converter
 */
export function csvToJSON(input: string, hasHeader: boolean = true): string {
  try {
    const lines = input.trim().split('\n')
    if (lines.length === 0) return '[]'

    const result: any[] = []
    let headers: string[] = []

    if (hasHeader) {
      headers = parseCSVLine(lines[0])
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        if (values.length === headers.length) {
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header] = values[index]
          })
          result.push(obj)
        }
      }
    } else {
      lines.forEach(line => {
        const values = parseCSVLine(line)
        result.push(values)
      })
    }

    return JSON.stringify(result, null, 2)
  } catch (error) {
    return 'Error converting CSV to JSON: ' + (error as Error).message
  }
}

/**
 * JSON to CSV converter
 */
export function jsonToCSV(input: string): string {
  try {
    const data = JSON.parse(input)

    if (!Array.isArray(data)) {
      return 'Input must be a JSON array'
    }

    if (data.length === 0) {
      return ''
    }

    // Get headers from first object
    const headers = Object.keys(data[0])
    const csv: string[] = []

    // Add header row
    csv.push(headers.map(h => escapeCSVValue(h)).join(','))

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header]
        return escapeCSVValue(value?.toString() || '')
      })
      csv.push(values.join(','))
    })

    return csv.join('\n')
  } catch (error) {
    return 'Error converting JSON to CSV: ' + (error as Error).message
  }
}

/**
 * XML to JSON converter
 */
export function xmlToJSON(input: string): string {
  try {
    // Simple XML to JSON converter
    // In production, use a proper XML parser
    const result: any = {}

    // Remove XML declaration
    let xml = input.replace(/<\?xml[^>]*\?>/g, '').trim()

    function parseElement(xmlStr: string): any {
      const tagMatch = xmlStr.match(/^<([^\s>]+)([^>]*)>/)
      if (!tagMatch) return xmlStr

      const tagName = tagMatch[1]
      const attributes = tagMatch[2]

      // Find closing tag
      const closeTag = `</${tagName}>`
      const closeIndex = xmlStr.lastIndexOf(closeTag)

      if (closeIndex === -1) return xmlStr

      const content = xmlStr.substring(tagMatch[0].length, closeIndex)

      // Parse attributes
      const attrs: any = {}
      const attrRegex = /(\w+)="([^"]*)"/g
      let attrMatch
      while ((attrMatch = attrRegex.exec(attributes)) !== null) {
        attrs[`@${attrMatch[1]}`] = attrMatch[2]
      }

      // Check if content has child elements
      if (content.includes('<')) {
        // Has child elements
        const children: any = { ...attrs }
        const childRegex = /<([^\s>]+)[^>]*>[\s\S]*?<\/\1>/g
        let childMatch
        while ((childMatch = childRegex.exec(content)) !== null) {
          const childResult = parseElement(childMatch[0])
          const childTag = childMatch[1]
          if (children[childTag]) {
            // Multiple children with same tag
            if (!Array.isArray(children[childTag])) {
              children[childTag] = [children[childTag]]
            }
            children[childTag].push(childResult[childTag])
          } else {
            Object.assign(children, childResult)
          }
        }
        return { [tagName]: children }
      } else {
        // Text content only
        if (Object.keys(attrs).length > 0) {
          return { [tagName]: { ...attrs, '#text': content.trim() } }
        } else {
          return { [tagName]: content.trim() }
        }
      }
    }

    const parsed = parseElement(xml)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return 'Error converting XML to JSON: ' + (error as Error).message
  }
}

/**
 * JSON to XML converter
 */
export function jsonToXML(input: string): string {
  try {
    const obj = JSON.parse(input)

    function toXML(obj: any, rootName: string = 'root'): string {
      let xml = ''

      if (Array.isArray(obj)) {
        obj.forEach(item => {
          xml += `<${rootName}>${toXML(item, 'item')}</${rootName}>\n`
        })
      } else if (typeof obj === 'object' && obj !== null) {
        const attrs: string[] = []
        const children: string[] = []

        Object.entries(obj).forEach(([key, value]) => {
          if (key.startsWith('@')) {
            // Attribute
            attrs.push(`${key.substring(1)}="${value}"`)
          } else if (key === '#text') {
            // Text content
            children.push(String(value))
          } else {
            // Child element
            children.push(toXML(value, key))
          }
        })

        const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : ''

        if (children.length === 0) {
          xml = `<${rootName}${attrString}/>`
        } else {
          xml = `<${rootName}${attrString}>${children.join('')}</${rootName}>`
        }
      } else {
        // Primitive value
        xml = String(obj)
      }

      return xml
    }

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXML(obj)
  } catch (error) {
    return 'Error converting JSON to XML: ' + (error as Error).message
  }
}

/**
 * Markdown to HTML converter
 */
export function markdownToHTML(input: string): string {
  let html = input

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Code blocks
  html = html.replace(/```([^`]*)```/g, '<pre><code>$1</code></pre>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')

  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // Wrap in paragraphs
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>'
  }

  return html
}

/**
 * HTML to Markdown converter
 */
export function htmlToMarkdown(input: string): string {
  let markdown = input

  // Remove scripts and styles
  markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  markdown = markdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')

  // Links
  markdown = markdown.replace(/<a[^>]+href="([^"]*)"[^>]*>([^<]+)<\/a>/gi, '[$2]($1)')

  // Images
  markdown = markdown.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
  markdown = markdown.replace(/<img[^>]+src="([^"]*)"[^>]*>/gi, '![]($1)')

  // Code blocks
  markdown = markdown.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
  markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`')

  // Line breaks and paragraphs
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n')
  markdown = markdown.replace(/<\/p>/gi, '\n\n')
  markdown = markdown.replace(/<p[^>]*>/gi, '')

  // Lists
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1\n')
  markdown = markdown.replace(/<\/?ul[^>]*>/gi, '')
  markdown = markdown.replace(/<\/?ol[^>]*>/gi, '')

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')

  // Horizontal rules
  markdown = markdown.replace(/<hr\s*\/?>/gi, '---\n\n')

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '')

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n')

  // Decode HTML entities
  markdown = markdown
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  return markdown.trim()
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current)

  return result
}

/**
 * Escape a value for CSV
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"'
  }
  return value
}

/**
 * cURL to code converter (basic implementation)
 */
export function curlToCode(curl: string, language: string = 'javascript'): string {
  try {
    // Parse the curl command
    const urlMatch = curl.match(/curl\s+['"]?([^'"]+)['"]?/)
    const url = urlMatch ? urlMatch[1] : ''

    const methodMatch = curl.match(/-X\s+(\w+)/)
    const method = methodMatch ? methodMatch[1] : 'GET'

    const headers: Record<string, string> = {}
    const headerRegex = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/g
    let headerMatch
    while ((headerMatch = headerRegex.exec(curl)) !== null) {
      headers[headerMatch[1]] = headerMatch[2]
    }

    const dataMatch = curl.match(/(?:-d|--data|--data-raw)\s+['"]([^'"]+)['"]/)
    const data = dataMatch ? dataMatch[1] : null

    // Generate code based on language
    if (language === 'javascript' || language === 'js') {
      return generateJavaScriptFetch(url, method, headers, data)
    } else if (language === 'python') {
      return generatePythonRequests(url, method, headers, data)
    } else if (language === 'php') {
      return generatePHPCurl(url, method, headers, data)
    } else {
      return 'Unsupported language. Supported: javascript, python, php'
    }
  } catch (error) {
    return 'Error parsing cURL command: ' + (error as Error).message
  }
}

function generateJavaScriptFetch(url: string, method: string, headers: Record<string, string>, data: string | null): string {
  let code = `fetch('${url}', {\n`
  code += `  method: '${method}',\n`

  if (Object.keys(headers).length > 0) {
    code += '  headers: {\n'
    Object.entries(headers).forEach(([key, value]) => {
      code += `    '${key}': '${value}',\n`
    })
    code += '  },\n'
  }

  if (data) {
    code += `  body: '${data}',\n`
  }

  code += '})\n'
  code += '  .then(response => response.json())\n'
  code += '  .then(data => console.log(data))\n'
  code += '  .catch(error => console.error(error));'

  return code
}

function generatePythonRequests(url: string, method: string, headers: Record<string, string>, data: string | null): string {
  let code = 'import requests\n\n'

  if (Object.keys(headers).length > 0) {
    code += 'headers = {\n'
    Object.entries(headers).forEach(([key, value]) => {
      code += `    '${key}': '${value}',\n`
    })
    code += '}\n\n'
  }

  if (data) {
    code += `data = '${data}'\n\n`
  }

  code += `response = requests.${method.toLowerCase()}(\n`
  code += `    '${url}'`

  if (Object.keys(headers).length > 0) {
    code += ',\n    headers=headers'
  }

  if (data) {
    code += ',\n    data=data'
  }

  code += '\n)\n\n'
  code += 'print(response.json())'

  return code
}

function generatePHPCurl(url: string, method: string, headers: Record<string, string>, data: string | null): string {
  let code = '<?php\n\n'
  code += '$curl = curl_init();\n\n'
  code += 'curl_setopt_array($curl, array(\n'
  code += `  CURLOPT_URL => '${url}',\n`
  code += '  CURLOPT_RETURNTRANSFER => true,\n'
  code += `  CURLOPT_CUSTOMREQUEST => '${method}',\n`

  if (data) {
    code += `  CURLOPT_POSTFIELDS => '${data}',\n`
  }

  if (Object.keys(headers).length > 0) {
    code += '  CURLOPT_HTTPHEADER => array(\n'
    Object.entries(headers).forEach(([key, value]) => {
      code += `    '${key}: ${value}',\n`
    })
    code += '  ),\n'
  }

  code += '));\n\n'
  code += '$response = curl_exec($curl);\n'
  code += 'curl_close($curl);\n\n'
  code += 'echo $response;'

  return code
}