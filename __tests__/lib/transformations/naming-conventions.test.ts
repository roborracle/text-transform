/**
 * Tests for naming convention transformation functions
 */

import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toKebabCase,
  toTrainCase,
  toDotCase,
  toPathCase,
  toNamespaceCase,
  toAdaCase,
  toCobolCase,
  toFlatCase,
  toUpperFlatCase,
  detectNamingConvention,
  convertNamingConvention,
} from '@/lib/transformations/naming-conventions';

describe('Naming Conventions', () => {
  describe('toCamelCase', () => {
    it('should convert space-separated words', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should convert snake_case', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should convert kebab-case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert PascalCase', () => {
      expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    });

    it('should handle multiple words', () => {
      expect(toCamelCase('this is a test')).toBe('thisIsATest');
    });

    it('should handle empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
    });

    it('should handle numbers', () => {
      expect(toCamelCase('test123value')).toBe('test123value');
    });

    it('should handle already camelCase', () => {
      expect(toCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase');
    });
  });

  describe('toPascalCase', () => {
    it('should convert space-separated words', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });

    it('should convert snake_case', () => {
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
    });

    it('should convert kebab-case', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
    });

    it('should convert camelCase', () => {
      expect(toPascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      expect(toPascalCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toPascalCase('hello')).toBe('Hello');
    });

    it('should handle already PascalCase', () => {
      expect(toPascalCase('AlreadyPascal')).toBe('AlreadyPascal');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert space-separated words', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });

    it('should convert camelCase', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert PascalCase', () => {
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
    });

    it('should convert kebab-case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toSnakeCase('hello')).toBe('hello');
    });

    it('should handle already snake_case', () => {
      expect(toSnakeCase('already_snake_case')).toBe('already_snake_case');
    });

    it('should handle multiple consecutive spaces', () => {
      expect(toSnakeCase('hello   world')).toBe('hello_world');
    });
  });

  describe('toScreamingSnakeCase', () => {
    it('should convert space-separated words', () => {
      expect(toScreamingSnakeCase('hello world')).toBe('HELLO_WORLD');
    });

    it('should convert camelCase', () => {
      expect(toScreamingSnakeCase('helloWorld')).toBe('HELLO_WORLD');
    });

    it('should handle empty string', () => {
      expect(toScreamingSnakeCase('')).toBe('');
    });

    it('should handle already SCREAMING_SNAKE_CASE', () => {
      expect(toScreamingSnakeCase('ALREADY_SCREAMING')).toBe('ALREADY_SCREAMING');
    });
  });

  describe('toKebabCase', () => {
    it('should convert space-separated words', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('should convert camelCase', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert PascalCase', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should convert snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(toKebabCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toKebabCase('hello')).toBe('hello');
    });

    it('should handle already kebab-case', () => {
      expect(toKebabCase('already-kebab-case')).toBe('already-kebab-case');
    });
  });

  describe('toTrainCase', () => {
    it('should convert space-separated words', () => {
      expect(toTrainCase('hello world')).toBe('Hello-World');
    });

    it('should convert camelCase', () => {
      expect(toTrainCase('helloWorld')).toBe('Hello-World');
    });

    it('should handle empty string', () => {
      expect(toTrainCase('')).toBe('');
    });

    it('should handle already Train-Case', () => {
      expect(toTrainCase('Already-Train-Case')).toBe('Already-Train-Case');
    });
  });

  describe('toDotCase', () => {
    it('should convert space-separated words', () => {
      expect(toDotCase('hello world')).toBe('hello.world');
    });

    it('should convert camelCase', () => {
      expect(toDotCase('helloWorld')).toBe('hello.world');
    });

    it('should handle empty string', () => {
      expect(toDotCase('')).toBe('');
    });

    it('should handle already dot.case', () => {
      expect(toDotCase('already.dot.case')).toBe('already.dot.case');
    });
  });

  describe('toPathCase', () => {
    it('should convert space-separated words', () => {
      expect(toPathCase('hello world')).toBe('hello/world');
    });

    it('should convert camelCase', () => {
      expect(toPathCase('helloWorld')).toBe('hello/world');
    });

    it('should handle empty string', () => {
      expect(toPathCase('')).toBe('');
    });

    it('should handle already path/case', () => {
      expect(toPathCase('already/path/case')).toBe('already/path/case');
    });
  });

  describe('toNamespaceCase', () => {
    it('should convert space-separated words', () => {
      expect(toNamespaceCase('hello world')).toBe('Hello\\World');
    });

    it('should convert camelCase', () => {
      expect(toNamespaceCase('helloWorld')).toBe('Hello\\World');
    });

    it('should handle empty string', () => {
      expect(toNamespaceCase('')).toBe('');
    });

    it('should handle multiple words', () => {
      expect(toNamespaceCase('app models user')).toBe('App\\Models\\User');
    });
  });

  describe('toAdaCase', () => {
    it('should convert space-separated words', () => {
      expect(toAdaCase('hello world')).toBe('Hello_World');
    });

    it('should convert camelCase', () => {
      expect(toAdaCase('helloWorld')).toBe('Hello_World');
    });

    it('should handle empty string', () => {
      expect(toAdaCase('')).toBe('');
    });

    it('should handle already Ada_Case', () => {
      expect(toAdaCase('Already_Ada_Case')).toBe('Already_Ada_Case');
    });
  });

  describe('toCobolCase', () => {
    it('should convert space-separated words', () => {
      expect(toCobolCase('hello world')).toBe('HELLO-WORLD');
    });

    it('should convert camelCase', () => {
      expect(toCobolCase('helloWorld')).toBe('HELLO-WORLD');
    });

    it('should handle empty string', () => {
      expect(toCobolCase('')).toBe('');
    });

    it('should handle already COBOL-CASE', () => {
      expect(toCobolCase('ALREADY-COBOL-CASE')).toBe('ALREADY-COBOL-CASE');
    });
  });

  describe('toFlatCase', () => {
    it('should convert space-separated words', () => {
      expect(toFlatCase('hello world')).toBe('helloworld');
    });

    it('should convert camelCase', () => {
      expect(toFlatCase('helloWorld')).toBe('helloworld');
    });

    it('should convert with numbers', () => {
      expect(toFlatCase('test 123 value')).toBe('test123value');
    });

    it('should handle empty string', () => {
      expect(toFlatCase('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(toFlatCase('hello@world!')).toBe('helloworld');
    });
  });

  describe('toUpperFlatCase', () => {
    it('should convert space-separated words', () => {
      expect(toUpperFlatCase('hello world')).toBe('HELLOWORLD');
    });

    it('should convert camelCase', () => {
      expect(toUpperFlatCase('helloWorld')).toBe('HELLOWORLD');
    });

    it('should handle empty string', () => {
      expect(toUpperFlatCase('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(toUpperFlatCase('test123')).toBe('TEST123');
    });
  });

  describe('detectNamingConvention', () => {
    it('should detect camelCase', () => {
      expect(detectNamingConvention('helloWorld')).toBe('camelCase');
    });

    it('should detect PascalCase', () => {
      expect(detectNamingConvention('HelloWorld')).toBe('PascalCase');
    });

    it('should detect snake_case', () => {
      expect(detectNamingConvention('hello_world')).toBe('snake_case');
    });

    it('should detect SCREAMING_SNAKE_CASE', () => {
      expect(detectNamingConvention('HELLO_WORLD')).toBe('SCREAMING_SNAKE_CASE');
    });

    it('should detect kebab-case', () => {
      expect(detectNamingConvention('hello-world')).toBe('kebab-case');
    });

    it('should detect Train-Case', () => {
      expect(detectNamingConvention('Hello-World')).toBe('Train-Case');
    });

    it('should detect COBOL-CASE', () => {
      expect(detectNamingConvention('HELLO-WORLD')).toBe('COBOL-CASE');
    });

    it('should detect dot.case', () => {
      expect(detectNamingConvention('hello.world')).toBe('dot.case');
    });

    it('should detect path/case', () => {
      expect(detectNamingConvention('hello/world')).toBe('path/case');
    });

    it('should detect Namespace\\Case', () => {
      expect(detectNamingConvention('Hello\\World')).toBe('Namespace\\Case');
    });

    it('should detect Ada_Case', () => {
      expect(detectNamingConvention('Hello_World')).toBe('Ada_Case');
    });

    it('should return unknown for unrecognized patterns', () => {
      expect(detectNamingConvention('123_invalid!')).toBe('unknown');
    });

    it('should return unknown for mixed conventions', () => {
      expect(detectNamingConvention('Hello_world-Mixed')).toBe('unknown');
    });
  });

  describe('convertNamingConvention', () => {
    const testInput = 'hello world example';

    it('should convert to camelCase', () => {
      expect(convertNamingConvention(testInput, 'camelcase')).toBe('helloWorldExample');
    });

    it('should convert to PascalCase', () => {
      expect(convertNamingConvention(testInput, 'pascalcase')).toBe('HelloWorldExample');
    });

    it('should convert to snake_case', () => {
      expect(convertNamingConvention(testInput, 'snake_case')).toBe('hello_world_example');
    });

    it('should convert to SCREAMING_SNAKE_CASE', () => {
      expect(convertNamingConvention(testInput, 'screaming_snake_case')).toBe('HELLO_WORLD_EXAMPLE');
    });

    it('should convert to kebab-case', () => {
      expect(convertNamingConvention(testInput, 'kebab-case')).toBe('hello-world-example');
    });

    it('should convert to Train-Case', () => {
      expect(convertNamingConvention(testInput, 'train-case')).toBe('Hello-World-Example');
    });

    it('should convert to dot.case', () => {
      expect(convertNamingConvention(testInput, 'dot.case')).toBe('hello.world.example');
    });

    it('should convert to path/case', () => {
      expect(convertNamingConvention(testInput, 'path/case')).toBe('hello/world/example');
    });

    it('should convert to namespacecase', () => {
      expect(convertNamingConvention(testInput, 'namespacecase')).toBe('Hello\\World\\Example');
    });

    it('should convert to Ada_Case', () => {
      expect(convertNamingConvention(testInput, 'ada_case')).toBe('Hello_World_Example');
    });

    it('should convert to COBOL-CASE', () => {
      expect(convertNamingConvention(testInput, 'cobol-case')).toBe('HELLO-WORLD-EXAMPLE');
    });

    it('should convert to flatcase', () => {
      expect(convertNamingConvention(testInput, 'flatcase')).toBe('helloworldexample');
    });

    it('should convert to upperflatcase', () => {
      expect(convertNamingConvention(testInput, 'upperflatcase')).toBe('HELLOWORLDEXAMPLE');
    });

    it('should return original for unknown convention', () => {
      expect(convertNamingConvention(testInput, 'unknownCase')).toBe(testInput);
    });

    it('should handle conversion from camelCase input', () => {
      expect(convertNamingConvention('helloWorldExample', 'snake_case')).toBe('hello_world_example');
    });

    it('should handle conversion from snake_case input', () => {
      expect(convertNamingConvention('hello_world_example', 'camelcase')).toBe('helloWorldExample');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single character', () => {
      expect(toCamelCase('a')).toBe('a');
      expect(toPascalCase('a')).toBe('A');
      expect(toSnakeCase('a')).toBe('a');
    });

    it('should handle all uppercase input', () => {
      // Note: toCamelCase doesn't lowercase all-caps input, it keeps it as-is after first char
      expect(toCamelCase('HELLO')).toBe('hELLO');
      expect(toSnakeCase('HELLO')).toBe('hello');
    });

    it('should handle input with leading/trailing spaces', () => {
      expect(toKebabCase('  hello world  ')).toBe('hello-world');
    });

    it('should handle input with only special characters', () => {
      expect(toCamelCase('___')).toBe('');
      expect(toKebabCase('---')).toBe('');
    });

    it('should handle unicode-like but ASCII strings', () => {
      expect(toCamelCase('hello world 123')).toBe('helloWorld123');
    });
  });
});
