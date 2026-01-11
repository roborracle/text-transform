/**
 * Color conversion utilities for developers
 * Converts between HEX, RGB, HSL, and other color formats
 *
 * Related: colorcodeguide.com for comprehensive color tools
 */

/**
 * Convert HEX color to RGB
 * Example: "#ff5733" -> "rgb(255, 87, 51)"
 */
export function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '')

  if (!/^[0-9a-fA-F]{3,6}$/.test(cleanHex)) {
    return 'Invalid hex color'
  }

  let fullHex = cleanHex
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(c => c + c).join('')
  }

  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Convert RGB to HEX
 * Example: "rgb(255, 87, 51)" -> "#ff5733"
 */
export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)

  if (!match) {
    // Try parsing as comma-separated values
    const values = rgb.split(',').map(v => parseInt(v.trim()))
    if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
      return '#' + values.map(v => v.toString(16).padStart(2, '0')).join('')
    }
    return 'Invalid RGB format'
  }

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  if ([r, g, b].some(v => v < 0 || v > 255)) {
    return 'RGB values must be 0-255'
  }

  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert HEX to HSL
 * Example: "#ff5733" -> "hsl(11, 100%, 60%)"
 */
export function hexToHsl(hex: string): string {
  const cleanHex = hex.replace('#', '')

  if (!/^[0-9a-fA-F]{3,6}$/.test(cleanHex)) {
    return 'Invalid hex color'
  }

  let fullHex = cleanHex
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(c => c + c).join('')
  }

  const r = parseInt(fullHex.substring(0, 2), 16) / 255
  const g = parseInt(fullHex.substring(2, 4), 16) / 255
  const b = parseInt(fullHex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

/**
 * Convert HSL to HEX
 * Example: "hsl(11, 100%, 60%)" -> "#ff5733"
 */
export function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/)

  if (!match) {
    return 'Invalid HSL format'
  }

  const h = parseInt(match[1]) / 360
  const s = parseInt(match[2]) / 100
  const l = parseInt(match[3]) / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return '#' + [r, g, b]
    .map(v => Math.round(v * 255).toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert decimal color to HEX
 * Example: "16734003" -> "#ff5733"
 */
export function decimalToHex(decimal: string): string {
  const num = parseInt(decimal)

  if (isNaN(num) || num < 0 || num > 16777215) {
    return 'Invalid decimal color (must be 0-16777215)'
  }

  return '#' + num.toString(16).padStart(6, '0')
}

/**
 * Convert HEX to decimal
 * Example: "#ff5733" -> "16734003"
 */
export function hexToDecimal(hex: string): string {
  const cleanHex = hex.replace('#', '')

  if (!/^[0-9a-fA-F]{3,6}$/.test(cleanHex)) {
    return 'Invalid hex color'
  }

  let fullHex = cleanHex
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(c => c + c).join('')
  }

  return parseInt(fullHex, 16).toString()
}

/**
 * Convert HEX to CSS RGBA
 * Example: "#ff5733", 0.5 -> "rgba(255, 87, 51, 0.5)"
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const rgbResult = hexToRgb(hex)

  if (rgbResult.startsWith('Invalid')) {
    return rgbResult
  }

  const match = rgbResult.match(/rgb\((\d+), (\d+), (\d+)\)/)
  if (!match) return 'Conversion error'

  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
}

/**
 * Generate random hex color
 */
export function generateRandomHexColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * Generate complementary color
 */
export function getComplementaryColor(hex: string): string {
  const cleanHex = hex.replace('#', '')

  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    return 'Invalid hex color'
  }

  const r = 255 - parseInt(cleanHex.substring(0, 2), 16)
  const g = 255 - parseInt(cleanHex.substring(2, 4), 16)
  const b = 255 - parseInt(cleanHex.substring(4, 6), 16)

  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert HEX to CSS custom property format
 * Example: "#ff5733" -> "--color-primary: #ff5733;"
 */
export function hexToCssVariable(hex: string, variableName: string = 'color-primary'): string {
  const cleanHex = hex.startsWith('#') ? hex : '#' + hex
  return `--${variableName}: ${cleanHex};`
}

/**
 * Parse CSS color value and return all formats
 */
export function parseColor(input: string): Record<string, string> {
  let hex = ''

  // Try to parse as hex
  if (input.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(input)) {
    hex = input.startsWith('#') ? input : '#' + input
  }
  // Try to parse as rgb
  else if (input.toLowerCase().startsWith('rgb')) {
    const result = rgbToHex(input)
    if (!result.startsWith('Invalid')) {
      hex = result
    }
  }
  // Try to parse as hsl
  else if (input.toLowerCase().startsWith('hsl')) {
    const result = hslToHex(input)
    if (!result.startsWith('Invalid')) {
      hex = result
    }
  }
  // Try to parse as decimal
  else if (/^\d+$/.test(input)) {
    const result = decimalToHex(input)
    if (!result.startsWith('Invalid')) {
      hex = result
    }
  }

  if (!hex) {
    return { error: 'Could not parse color input' }
  }

  return {
    hex: hex.toLowerCase(),
    rgb: hexToRgb(hex),
    hsl: hexToHsl(hex),
    decimal: hexToDecimal(hex),
    rgba: hexToRgba(hex, 1),
    complementary: getComplementaryColor(hex),
  }
}
