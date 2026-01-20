/**
 * Lightweight CLI argument parser
 * Zero external dependencies
 */

export interface ParsedArgs {
  command: string;
  subcommand?: string;
  input?: string;
  options: Record<string, string | boolean>;
  positional: string[];
}

export interface CommandDef {
  name: string;
  description: string;
  aliases?: string[];
  subcommands?: CommandDef[];
  options?: OptionDef[];
}

export interface OptionDef {
  name: string;
  short?: string;
  description: string;
  required?: boolean;
  default?: string | boolean;
}

/**
 * Parse command line arguments into structured format
 */
export function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    command: '',
    options: {},
    positional: [],
  };

  let i = 0;

  // First non-option argument is the command
  while (i < args.length) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      // Long option
      const [key, value] = arg.slice(2).split('=');
      if (value !== undefined) {
        result.options[key] = value;
      } else if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        result.options[key] = args[++i];
      } else {
        result.options[key] = true;
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      // Short option(s)
      const chars = arg.slice(1);
      if (chars.length === 1) {
        // Single short option, might have value
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          result.options[chars] = args[++i];
        } else {
          result.options[chars] = true;
        }
      } else {
        // Multiple short flags
        for (const char of chars) {
          result.options[char] = true;
        }
      }
    } else {
      // Positional argument
      if (!result.command) {
        result.command = arg;
      } else if (!result.subcommand && !arg.includes(' ')) {
        result.subcommand = arg;
      } else {
        result.positional.push(arg);
      }
    }
    i++;
  }

  return result;
}

/**
 * Read input from stdin if available
 */
export async function readStdin(): Promise<string | null> {
  // Check if stdin is a TTY (interactive terminal)
  if (process.stdin.isTTY) {
    return null;
  }

  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => {
      resolve(data.trim() || null);
    });
    // Timeout after 100ms if no data
    setTimeout(() => {
      if (!data) resolve(null);
    }, 100);
  });
}

/**
 * Format help text for a command
 */
export function formatHelp(
  commands: CommandDef[],
  programName: string = 'txtx'
): string {
  const lines: string[] = [
    `Usage: ${programName} <command> [options] [input]`,
    '',
    'Commands:',
  ];

  const maxNameLen = Math.max(...commands.map((c) => c.name.length));

  for (const cmd of commands) {
    const padding = ' '.repeat(maxNameLen - cmd.name.length + 2);
    const aliases = cmd.aliases ? ` (${cmd.aliases.join(', ')})` : '';
    lines.push(`  ${cmd.name}${padding}${cmd.description}${aliases}`);
  }

  lines.push('');
  lines.push('Options:');
  lines.push('  -h, --help        Show help');
  lines.push('  -v, --version     Show version');
  lines.push('  -l, --list        List available tools');
  lines.push('  -i, --input       Input text (or use stdin)');
  lines.push('  --interactive     Launch interactive mode');
  lines.push('');
  lines.push('Examples:');
  lines.push(`  ${programName} camel "hello world"       # Convert to camelCase`);
  lines.push(`  ${programName} base64 encode "hello"     # Base64 encode`);
  lines.push(`  echo "hello" | ${programName} md5        # Hash from stdin`);
  lines.push(`  ${programName} json format < file.json   # Format JSON file`);
  lines.push(`  ${programName} interactive               # Launch interactive mode`);

  return lines.join('\n');
}

/**
 * Format help for a specific command
 */
export function formatCommandHelp(
  cmd: CommandDef,
  programName: string = 'txtx'
): string {
  const lines: string[] = [
    `Usage: ${programName} ${cmd.name} [subcommand] [options] [input]`,
    '',
    cmd.description,
  ];

  if (cmd.subcommands && cmd.subcommands.length > 0) {
    lines.push('');
    lines.push('Subcommands:');
    const maxLen = Math.max(...cmd.subcommands.map((s) => s.name.length));
    for (const sub of cmd.subcommands) {
      const padding = ' '.repeat(maxLen - sub.name.length + 2);
      lines.push(`  ${sub.name}${padding}${sub.description}`);
    }
  }

  if (cmd.options && cmd.options.length > 0) {
    lines.push('');
    lines.push('Options:');
    for (const opt of cmd.options) {
      const short = opt.short ? `-${opt.short}, ` : '    ';
      const def = opt.default !== undefined ? ` (default: ${opt.default})` : '';
      lines.push(`  ${short}--${opt.name}  ${opt.description}${def}`);
    }
  }

  return lines.join('\n');
}
