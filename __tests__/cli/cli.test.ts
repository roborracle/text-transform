/**
 * @jest-environment node
 */

import { parseArgs, formatHelp } from '../../cli/src/parser';
import {
  commandRegistry,
  getCommandDefs,
  getCommandsByCategory,
  executeCommand,
} from '../../cli/src/commands';

describe('CLI Parser', () => {
  describe('parseArgs', () => {
    it('should parse simple command', () => {
      const result = parseArgs(['camel', 'hello world']);
      expect(result.command).toBe('camel');
      expect(result.positional).toEqual(['hello world']);
    });

    it('should parse command with subcommand', () => {
      const result = parseArgs(['base64', 'encode', 'hello']);
      expect(result.command).toBe('base64');
      expect(result.subcommand).toBe('encode');
      expect(result.positional).toEqual(['hello']);
    });

    it('should parse long options', () => {
      const result = parseArgs(['--version']);
      expect(result.options.version).toBe(true);
    });

    it('should parse long options with values', () => {
      const result = parseArgs(['--key=secret', 'vigenere', 'hello']);
      expect(result.options.key).toBe('secret');
    });

    it('should parse short options', () => {
      const result = parseArgs(['-v']);
      expect(result.options.v).toBe(true);
    });

    it('should parse combined short options', () => {
      const result = parseArgs(['-vh']);
      expect(result.options.v).toBe(true);
      expect(result.options.h).toBe(true);
    });

    it('should parse short option with value', () => {
      const result = parseArgs(['-i', 'test']);
      expect(result.options.i).toBe('test');
    });

    it('should handle multiple positional arguments', () => {
      const result = parseArgs(['camel', 'hello', 'world']);
      expect(result.command).toBe('camel');
      // Second argument becomes subcommand, third becomes positional
      expect(result.subcommand).toBe('hello');
      expect(result.positional).toEqual(['world']);
    });
  });

  describe('formatHelp', () => {
    it('should generate help text', () => {
      const commands = [
        { name: 'test', description: 'Test command' },
      ];
      const help = formatHelp(commands, 'txtx');
      expect(help).toContain('Usage: txtx');
      expect(help).toContain('test');
      expect(help).toContain('Test command');
    });

    it('should include options section', () => {
      const help = formatHelp([], 'txtx');
      expect(help).toContain('Options:');
      expect(help).toContain('--help');
      expect(help).toContain('--version');
      expect(help).toContain('--list');
    });

    it('should include examples', () => {
      const help = formatHelp([], 'txtx');
      expect(help).toContain('Examples:');
      expect(help).toContain('camel');
      expect(help).toContain('base64');
    });
  });
});

describe('CLI Commands', () => {
  describe('commandRegistry', () => {
    it('should have naming convention commands', () => {
      expect(commandRegistry.camel).toBeDefined();
      expect(commandRegistry.pascal).toBeDefined();
      expect(commandRegistry.snake).toBeDefined();
      expect(commandRegistry.kebab).toBeDefined();
    });

    it('should have encoding commands', () => {
      expect(commandRegistry.base64).toBeDefined();
      expect(commandRegistry.base32).toBeDefined();
      expect(commandRegistry.url).toBeDefined();
      expect(commandRegistry.html).toBeDefined();
    });

    it('should have crypto commands', () => {
      expect(commandRegistry.md5).toBeDefined();
      expect(commandRegistry.sha256).toBeDefined();
      expect(commandRegistry.uuid).toBeDefined();
    });

    it('should have formatter commands', () => {
      expect(commandRegistry.json).toBeDefined();
      expect(commandRegistry.sql).toBeDefined();
      expect(commandRegistry.xml).toBeDefined();
    });

    it('should have converter commands', () => {
      expect(commandRegistry.csv2json).toBeDefined();
      expect(commandRegistry.json2csv).toBeDefined();
      expect(commandRegistry.md2html).toBeDefined();
    });

    it('should have color commands', () => {
      expect(commandRegistry.hex2rgb).toBeDefined();
      expect(commandRegistry.rgb2hex).toBeDefined();
      expect(commandRegistry.randcolor).toBeDefined();
    });

    it('should have generator commands', () => {
      expect(commandRegistry.password).toBeDefined();
      expect(commandRegistry.uuid).toBeDefined();
      expect(commandRegistry.lorem).toBeDefined();
    });

    it('should have cipher commands', () => {
      expect(commandRegistry.caesar).toBeDefined();
      expect(commandRegistry.rot13).toBeDefined();
      expect(commandRegistry.morse).toBeDefined();
    });
  });

  describe('getCommandDefs', () => {
    it('should return sorted command definitions', () => {
      const defs = getCommandDefs();
      expect(defs.length).toBeGreaterThan(50);

      // Check sorted order
      for (let i = 1; i < defs.length; i++) {
        expect(defs[i - 1].name.localeCompare(defs[i].name)).toBeLessThanOrEqual(0);
      }
    });

    it('should include subcommands', () => {
      const defs = getCommandDefs();
      const base64 = defs.find((d) => d.name === 'base64');
      expect(base64?.subcommands).toBeDefined();
      expect(base64?.subcommands?.length).toBe(2);
    });
  });

  describe('getCommandsByCategory', () => {
    it('should group commands by category', () => {
      const byCategory = getCommandsByCategory();
      expect(byCategory.naming).toBeDefined();
      expect(byCategory.encoding).toBeDefined();
      expect(byCategory.crypto).toBeDefined();
      expect(byCategory.formatters).toBeDefined();
      expect(byCategory.converters).toBeDefined();
      expect(byCategory.colors).toBeDefined();
      expect(byCategory.generators).toBeDefined();
      expect(byCategory.ciphers).toBeDefined();
    });

    it('should have naming conventions commands', () => {
      const byCategory = getCommandsByCategory();
      const namingNames = byCategory.naming.map((c) => c.name);
      expect(namingNames).toContain('camel');
      expect(namingNames).toContain('snake');
      expect(namingNames).toContain('kebab');
    });
  });

  describe('executeCommand', () => {
    it('should execute naming convention commands', async () => {
      const result = await executeCommand('camel', undefined, 'hello world', {});
      expect(result).toBe('helloWorld');
    });

    it('should execute snake case', async () => {
      const result = await executeCommand('snake', undefined, 'helloWorld', {});
      expect(result).toBe('hello_world');
    });

    it('should execute encoding commands', async () => {
      const result = await executeCommand('base64', 'encode', 'hello', {});
      expect(result).toBe('aGVsbG8=');
    });

    it('should decode base64', async () => {
      const result = await executeCommand('base64', 'decode', 'aGVsbG8=', {});
      expect(result).toBe('hello');
    });

    it('should execute url encoding', async () => {
      const result = await executeCommand('url', 'encode', 'hello world', {});
      expect(result).toBe('hello%20world');
    });

    it('should execute html encoding', async () => {
      const result = await executeCommand('html', 'encode', '<div>', {});
      expect(result).toBe('&lt;div&gt;');
    });

    it('should execute uuid generator', async () => {
      const result = await executeCommand('uuid', undefined, '', {});
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should execute rot13 cipher', async () => {
      const result = await executeCommand('rot13', undefined, 'hello', {});
      expect(result).toBe('uryyb');
    });

    it('should execute reverse string', async () => {
      const result = await executeCommand('reverse', undefined, 'hello', {});
      expect(result).toBe('olleh');
    });

    it('should execute morse encode', async () => {
      const result = await executeCommand('morse', 'encode', 'SOS', {});
      expect(result).toBe('... --- ...');
    });

    it('should execute morse decode', async () => {
      const result = await executeCommand('morse', 'decode', '... --- ...', {});
      expect(result).toBe('SOS');
    });

    it('should execute json format', async () => {
      const result = await executeCommand('json', 'format', '{"a":1}', {});
      expect(result).toContain('"a": 1');
    });

    it('should execute json minify', async () => {
      const result = await executeCommand('json', 'minify', '{ "a": 1 }', {});
      expect(result).toBe('{"a":1}');
    });

    it('should execute color conversion', async () => {
      const result = await executeCommand('hex2rgb', undefined, '#ff0000', {});
      expect(result).toBe('rgb(255, 0, 0)');
    });

    it('should throw error for unknown command', async () => {
      await expect(executeCommand('unknown', undefined, 'test', {}))
        .rejects.toThrow('Unknown command: unknown');
    });

    it('should throw error for unknown subcommand', async () => {
      await expect(executeCommand('base64', 'invalid', 'test', {}))
        .rejects.toThrow('Unknown subcommand: invalid');
    });
  });
});

describe('CLI Integration', () => {
  it('should have at least 60 commands', () => {
    const defs = getCommandDefs();
    expect(defs.length).toBeGreaterThanOrEqual(60);
  });

  it('should cover all 8 categories', () => {
    const byCategory = getCommandsByCategory();
    const categories = Object.keys(byCategory);
    expect(categories.length).toBe(8);
  });

  it('should have descriptions for all commands', () => {
    const defs = getCommandDefs();
    for (const cmd of defs) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(5);
    }
  });
});
