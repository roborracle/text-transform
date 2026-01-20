#!/usr/bin/env node
/**
 * Text Transform CLI
 * Command-line interface for 111+ text transformations
 */

import { parseArgs, readStdin, formatHelp, formatCommandHelp } from './parser';
import {
  commandRegistry,
  getCommandDefs,
  getCommandsByCategory,
  executeCommand,
} from './commands';
import { runInteractive } from './interactive';

const VERSION = '1.0.0';
const PROGRAM_NAME = 'txtx';

/**
 * Print version info
 */
function printVersion(): void {
  console.log(`${PROGRAM_NAME} v${VERSION}`);
  console.log('Text Transform CLI - 111+ text transformations');
}

/**
 * Print help for listing tools by category
 */
function printToolList(): void {
  const byCategory = getCommandsByCategory();
  const categories = Object.keys(byCategory).sort();

  console.log('Available transformations:\n');

  for (const category of categories) {
    const displayName = category.charAt(0).toUpperCase() + category.slice(1);
    console.log(`${displayName}:`);

    const commands = byCategory[category].sort((a, b) => a.name.localeCompare(b.name));
    for (const cmd of commands) {
      const subs = cmd.subcommands
        ? ` [${cmd.subcommands.map((s) => s.name).join('|')}]`
        : '';
      console.log(`  ${cmd.name}${subs} - ${cmd.description}`);
    }
    console.log('');
  }
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Check for global flags
  if (parsed.options.v || parsed.options.version) {
    printVersion();
    return;
  }

  if (parsed.options.h || parsed.options.help) {
    if (parsed.command && commandRegistry[parsed.command]) {
      const cmd = commandRegistry[parsed.command];
      console.log(formatCommandHelp({
        name: parsed.command,
        description: cmd.description,
        subcommands: cmd.subcommands
          ? Object.entries(cmd.subcommands).map(([name, sub]) => ({
              name,
              description: sub.description,
            }))
          : undefined,
      }, PROGRAM_NAME));
    } else {
      console.log(formatHelp(getCommandDefs(), PROGRAM_NAME));
    }
    return;
  }

  if (parsed.options.l || parsed.options.list) {
    printToolList();
    return;
  }

  // Interactive mode
  if (parsed.options.interactive || parsed.command === 'interactive') {
    await runInteractive();
    return;
  }

  // No command provided
  if (!parsed.command) {
    console.log(formatHelp(getCommandDefs(), PROGRAM_NAME));
    return;
  }

  // Check if command exists
  if (!commandRegistry[parsed.command]) {
    console.error(`Error: Unknown command '${parsed.command}'`);
    console.error(`Run '${PROGRAM_NAME} --list' to see available commands`);
    process.exit(1);
  }

  // Get input from options, positional args, or stdin
  let input = '';

  if (parsed.options.i || parsed.options.input) {
    input = String(parsed.options.i || parsed.options.input);
  } else if (parsed.positional.length > 0) {
    input = parsed.positional.join(' ');
  } else {
    // Check for stdin
    const stdinData = await readStdin();
    if (stdinData) {
      input = stdinData;
    }
  }

  // Some commands don't need input (generators)
  const generatorCommands = [
    'uuid', 'ulid', 'nanoid', 'ipv4', 'ipv6', 'mac',
    'randdate', 'randemail', 'randuser', 'randphone',
    'testcard', 'randcolor',
  ];

  if (!input && !generatorCommands.includes(parsed.command)) {
    console.error(`Error: No input provided`);
    console.error(`Usage: ${PROGRAM_NAME} ${parsed.command} "your text here"`);
    console.error(`   or: echo "your text" | ${PROGRAM_NAME} ${parsed.command}`);
    process.exit(1);
  }

  try {
    const result = await executeCommand(
      parsed.command,
      parsed.subcommand,
      input,
      parsed.options
    );
    console.log(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
