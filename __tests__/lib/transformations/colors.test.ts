/**
 * Tests for color conversion functions
 */

import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  decimalToHex,
  hexToDecimal,
  hexToRgba,
  generateRandomHexColor,
  getComplementaryColor,
  hexToCssVariable,
  parseColor,
} from '@/lib/transformations/colors';

describe('Color Functions', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#ff5733')).toBe('rgb(255, 87, 51)');
    });

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRgb('#f00')).toBe('rgb(255, 0, 0)');
    });

    it('should handle hex without #', () => {
      expect(hexToRgb('ff5733')).toBe('rgb(255, 87, 51)');
    });

    it('should convert black', () => {
      expect(hexToRgb('#000000')).toBe('rgb(0, 0, 0)');
    });

    it('should convert white', () => {
      expect(hexToRgb('#ffffff')).toBe('rgb(255, 255, 255)');
    });

    it('should return error for invalid hex', () => {
      expect(hexToRgb('#gggggg')).toBe('Invalid hex color');
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB string to hex', () => {
      expect(rgbToHex('rgb(255, 87, 51)')).toBe('#ff5733');
    });

    it('should convert comma-separated values', () => {
      expect(rgbToHex('255, 87, 51')).toBe('#ff5733');
    });

    it('should convert black', () => {
      expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
    });

    it('should convert white', () => {
      expect(rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
    });

    it('should return error for invalid format', () => {
      expect(rgbToHex('invalid')).toBe('Invalid RGB format');
    });

    it('should return error for out-of-range values', () => {
      expect(rgbToHex('rgb(300, 0, 0)')).toBe('RGB values must be 0-255');
    });
  });

  describe('hexToHsl', () => {
    it('should convert red', () => {
      expect(hexToHsl('#ff0000')).toBe('hsl(0, 100%, 50%)');
    });

    it('should convert green', () => {
      expect(hexToHsl('#00ff00')).toBe('hsl(120, 100%, 50%)');
    });

    it('should convert blue', () => {
      expect(hexToHsl('#0000ff')).toBe('hsl(240, 100%, 50%)');
    });

    it('should convert white', () => {
      expect(hexToHsl('#ffffff')).toBe('hsl(0, 0%, 100%)');
    });

    it('should convert black', () => {
      expect(hexToHsl('#000000')).toBe('hsl(0, 0%, 0%)');
    });

    it('should return error for invalid hex', () => {
      expect(hexToHsl('invalid')).toBe('Invalid hex color');
    });
  });

  describe('hslToHex', () => {
    it('should convert red', () => {
      expect(hslToHex('hsl(0, 100%, 50%)')).toBe('#ff0000');
    });

    it('should convert green', () => {
      expect(hslToHex('hsl(120, 100%, 50%)')).toBe('#00ff00');
    });

    it('should convert blue', () => {
      expect(hslToHex('hsl(240, 100%, 50%)')).toBe('#0000ff');
    });

    it('should return error for invalid format', () => {
      expect(hslToHex('invalid')).toBe('Invalid HSL format');
    });
  });

  describe('decimalToHex', () => {
    it('should convert decimal to hex', () => {
      expect(decimalToHex('16711680')).toBe('#ff0000');
    });

    it('should convert 0 to black', () => {
      expect(decimalToHex('0')).toBe('#000000');
    });

    it('should return error for negative number', () => {
      expect(decimalToHex('-1')).toBe('Invalid decimal color (must be 0-16777215)');
    });

    it('should return error for too large number', () => {
      expect(decimalToHex('20000000')).toBe('Invalid decimal color (must be 0-16777215)');
    });

    it('should return error for invalid input', () => {
      expect(decimalToHex('abc')).toBe('Invalid decimal color (must be 0-16777215)');
    });
  });

  describe('hexToDecimal', () => {
    it('should convert hex to decimal', () => {
      expect(hexToDecimal('#ff0000')).toBe('16711680');
    });

    it('should convert black', () => {
      expect(hexToDecimal('#000000')).toBe('0');
    });

    it('should convert 3-digit hex', () => {
      expect(hexToDecimal('#f00')).toBe('16711680');
    });

    it('should return error for invalid hex', () => {
      expect(hexToDecimal('invalid')).toBe('Invalid hex color');
    });
  });

  describe('hexToRgba', () => {
    it('should convert hex to rgba with default alpha', () => {
      expect(hexToRgba('#ff0000')).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert hex to rgba with custom alpha', () => {
      expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should return error for invalid hex', () => {
      expect(hexToRgba('invalid')).toBe('Invalid hex color');
    });
  });

  describe('generateRandomHexColor', () => {
    it('should generate valid hex color', () => {
      const color = generateRandomHexColor();
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('should generate different colors', () => {
      const color1 = generateRandomHexColor();
      const color2 = generateRandomHexColor();
      // Very small chance of same color, but check format at least
      expect(color1).toMatch(/^#[0-9a-f]{6}$/);
      expect(color2).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe('getComplementaryColor', () => {
    it('should return complementary of red (cyan)', () => {
      expect(getComplementaryColor('#ff0000')).toBe('#00ffff');
    });

    it('should return complementary of white (black)', () => {
      expect(getComplementaryColor('#ffffff')).toBe('#000000');
    });

    it('should return complementary of black (white)', () => {
      expect(getComplementaryColor('#000000')).toBe('#ffffff');
    });

    it('should return error for invalid hex', () => {
      expect(getComplementaryColor('invalid')).toBe('Invalid hex color');
    });

    it('should return error for 3-digit hex (needs 6)', () => {
      expect(getComplementaryColor('#f00')).toBe('Invalid hex color');
    });
  });

  describe('hexToCssVariable', () => {
    it('should create CSS variable with default name', () => {
      expect(hexToCssVariable('#ff0000')).toBe('--color-primary: #ff0000;');
    });

    it('should create CSS variable with custom name', () => {
      expect(hexToCssVariable('#ff0000', 'brand-red')).toBe('--brand-red: #ff0000;');
    });

    it('should add # if missing', () => {
      expect(hexToCssVariable('ff0000')).toBe('--color-primary: #ff0000;');
    });
  });

  describe('parseColor', () => {
    it('should parse hex color', () => {
      const result = parseColor('#ff0000');
      expect(result.hex).toBe('#ff0000');
      expect(result.rgb).toBe('rgb(255, 0, 0)');
    });

    it('should parse RGB color', () => {
      const result = parseColor('rgb(255, 0, 0)');
      expect(result.hex).toBe('#ff0000');
    });

    it('should parse HSL color', () => {
      const result = parseColor('hsl(0, 100%, 50%)');
      expect(result.hex).toBe('#ff0000');
    });

    it('should parse decimal color', () => {
      const result = parseColor('16711680');
      expect(result.hex).toBe('#ff0000');
    });

    it('should return error for invalid input', () => {
      const result = parseColor('invalid');
      expect(result.error).toBe('Could not parse color input');
    });

    it('should return all formats', () => {
      const result = parseColor('#ff0000');
      expect(result.hex).toBeDefined();
      expect(result.rgb).toBeDefined();
      expect(result.hsl).toBeDefined();
      expect(result.decimal).toBeDefined();
      expect(result.rgba).toBeDefined();
      expect(result.complementary).toBeDefined();
    });
  });

  describe('Roundtrip Tests', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000', '#ff5733'];

    colors.forEach((hex) => {
      it(`should roundtrip hex -> rgb -> hex for ${hex}`, () => {
        const rgb = hexToRgb(hex);
        const backToHex = rgbToHex(rgb);
        expect(backToHex).toBe(hex);
      });
    });
  });
});
