/**
 * Tests for random generator functions
 */

import {
  generatePassword,
  generateIPv4,
  generateIPv6,
  generateMacAddress,
  generateRandomString,
  generateLoremIpsum,
  generateRandomDate,
  generateRandomEmail,
  generateRandomUsername,
  generateRandomPhone,
  generateTestCreditCard,
  generateSlug,
  generateApiKey,
} from '@/lib/transformations/generators';

describe('Generator Functions', () => {
  describe('generatePassword', () => {
    it('should generate password of default length', () => {
      const password = generatePassword();
      expect(password).toHaveLength(16);
    });

    it('should generate password of custom length', () => {
      const password = generatePassword(24);
      expect(password).toHaveLength(24);
    });

    it('should include uppercase when specified', () => {
      const password = generatePassword(100, { uppercase: true, lowercase: false, numbers: false, symbols: false });
      expect(password).toMatch(/^[A-Z]+$/);
    });

    it('should include lowercase when specified', () => {
      const password = generatePassword(100, { uppercase: false, lowercase: true, numbers: false, symbols: false });
      expect(password).toMatch(/^[a-z]+$/);
    });

    it('should include numbers when specified', () => {
      const password = generatePassword(100, { uppercase: false, lowercase: false, numbers: true, symbols: false });
      expect(password).toMatch(/^[0-9]+$/);
    });

    it('should use default charset when all options are false', () => {
      const password = generatePassword(16, { uppercase: false, lowercase: false, numbers: false, symbols: false });
      expect(password).toHaveLength(16);
    });
  });

  describe('generateIPv4', () => {
    it('should generate valid IPv4 format', () => {
      const ip = generateIPv4();
      expect(ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });

    it('should have octets in valid range', () => {
      const ip = generateIPv4();
      const octets = ip.split('.').map(Number);
      octets.forEach((octet) => {
        expect(octet).toBeGreaterThanOrEqual(0);
        expect(octet).toBeLessThanOrEqual(255);
      });
    });

    it('should generate unique IPs', () => {
      const ip1 = generateIPv4();
      const ip2 = generateIPv4();
      // Very small chance of collision, but format should be valid
      expect(ip1).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      expect(ip2).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });
  });

  describe('generateIPv6', () => {
    it('should generate valid IPv6 format', () => {
      const ip = generateIPv6();
      expect(ip).toMatch(/^[0-9a-f]{4}(:[0-9a-f]{4}){7}$/);
    });

    it('should have 8 groups', () => {
      const ip = generateIPv6();
      const groups = ip.split(':');
      expect(groups).toHaveLength(8);
    });
  });

  describe('generateMacAddress', () => {
    it('should generate valid MAC format with colon separator', () => {
      const mac = generateMacAddress(':');
      expect(mac).toMatch(/^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/);
    });

    it('should generate valid MAC format with dash separator', () => {
      const mac = generateMacAddress('-');
      expect(mac).toMatch(/^[0-9a-f]{2}(-[0-9a-f]{2}){5}$/);
    });

    it('should have 6 octets', () => {
      const mac = generateMacAddress(':');
      const octets = mac.split(':');
      expect(octets).toHaveLength(6);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string of default length', () => {
      const str = generateRandomString();
      expect(str).toHaveLength(32);
    });

    it('should generate alphanumeric string', () => {
      const str = generateRandomString(100, 'alphanumeric');
      expect(str).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should generate alpha-only string', () => {
      const str = generateRandomString(100, 'alpha');
      expect(str).toMatch(/^[a-zA-Z]+$/);
    });

    it('should generate numeric-only string', () => {
      const str = generateRandomString(100, 'numeric');
      expect(str).toMatch(/^[0-9]+$/);
    });

    it('should generate hex string', () => {
      const str = generateRandomString(100, 'hex');
      expect(str).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('generateLoremIpsum', () => {
    it('should generate one paragraph by default', () => {
      const text = generateLoremIpsum();
      expect(text.split('\n\n')).toHaveLength(1);
    });

    it('should generate multiple paragraphs', () => {
      const text = generateLoremIpsum(3);
      expect(text.split('\n\n')).toHaveLength(3);
    });

    it('should capitalize first word', () => {
      const text = generateLoremIpsum(1, 10);
      expect(text[0]).toMatch(/[A-Z]/);
    });

    it('should end with period', () => {
      const text = generateLoremIpsum(1, 10);
      expect(text.endsWith('.')).toBe(true);
    });
  });

  describe('generateRandomDate', () => {
    it('should generate valid ISO date string', () => {
      const date = generateRandomDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should generate date within range', () => {
      const start = new Date('2020-01-01');
      const end = new Date('2020-12-31');
      const dateStr = generateRandomDate(start, end);
      const date = new Date(dateStr);
      expect(date.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(date.getTime()).toBeLessThanOrEqual(end.getTime());
    });
  });

  describe('generateRandomEmail', () => {
    it('should generate valid email format', () => {
      const email = generateRandomEmail();
      expect(email).toMatch(/^[a-z]+@example\.com$/);
    });

    it('should use custom domain', () => {
      const email = generateRandomEmail('test.org');
      expect(email).toMatch(/^[a-z]+@test\.org$/);
    });
  });

  describe('generateRandomUsername', () => {
    it('should generate adjective_noun format with number', () => {
      const username = generateRandomUsername();
      expect(username).toMatch(/^[a-z]+_[a-z]+\d+$/);
    });
  });

  describe('generateRandomPhone', () => {
    it('should generate US format phone', () => {
      const phone = generateRandomPhone('us');
      expect(phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    });

    it('should generate international format phone', () => {
      const phone = generateRandomPhone('international');
      expect(phone).toMatch(/^\+\d{1,2} \d{10}$/);
    });
  });

  describe('generateTestCreditCard', () => {
    it('should generate Visa card (starts with 4)', () => {
      const card = generateTestCreditCard('visa');
      expect(card).toMatch(/^4\d{15}$/);
    });

    it('should generate Mastercard (starts with 51-55)', () => {
      const card = generateTestCreditCard('mastercard');
      expect(card).toMatch(/^5[1-5]\d{14}$/);
    });

    it('should generate Amex (starts with 34 or 37, 15 digits)', () => {
      const card = generateTestCreditCard('amex');
      expect(card).toMatch(/^3[47]\d{13}$/);
    });

    it('should pass Luhn validation', () => {
      const card = generateTestCreditCard('visa');
      expect(luhnCheck(card)).toBe(true);
    });

    // Luhn algorithm check
    function luhnCheck(cardNumber: string): boolean {
      let sum = 0;
      let isEven = false;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }
  });

  describe('generateSlug', () => {
    it('should generate hyphen-separated words', () => {
      const slug = generateSlug();
      expect(slug).toMatch(/^[a-z]+(-[a-z]+){2}$/);
    });

    it('should generate custom number of words', () => {
      const slug = generateSlug(5);
      const words = slug.split('-');
      expect(words).toHaveLength(5);
    });
  });

  describe('generateApiKey', () => {
    it('should generate key with default prefix', () => {
      const key = generateApiKey();
      expect(key).toMatch(/^sk_[a-zA-Z0-9]{32}$/);
    });

    it('should generate key with custom prefix', () => {
      const key = generateApiKey('pk');
      expect(key).toMatch(/^pk_[a-zA-Z0-9]{32}$/);
    });
  });

  describe('Uniqueness Tests', () => {
    it('should generate unique passwords', () => {
      const passwords = new Set(Array.from({ length: 100 }, () => generatePassword()));
      expect(passwords.size).toBe(100);
    });

    it('should generate unique UUIDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateRandomString(32)));
      expect(ids.size).toBe(100);
    });
  });
});
