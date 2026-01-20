/**
 * Interactive mode for the CLI
 * Provides a REPL-like interface for text transformations
 */

import * as readline from 'readline';
import { commandRegistry, getCommandsByCategory, executeCommand } from './commands';

const PROGRAM_NAME = 'txtx';

/**
 * Create readline interface
 */
function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
}

/**
 * Prompt user for input
 */
function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Display category menu
 */
function displayCategories(): void {
  const byCategory = getCommandsByCategory();
  const categories = Object.keys(byCategory).sort();

  console.log('\nCategories:');
  categories.forEach((cat, i) => {
    const count = byCategory[cat].length;
    const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
    console.log(`  ${i + 1}. ${displayName} (${count} tools)`);
  });
  console.log(`  0. Exit`);
}

/**
 * Display tools in a category
 */
function displayCategoryTools(category: string): void {
  const byCategory = getCommandsByCategory();
  const commands = byCategory[category]?.sort((a, b) => a.name.localeCompare(b.name));

  if (!commands) {
    console.log('Category not found');
    return;
  }

  const displayName = category.charAt(0).toUpperCase() + category.slice(1);
  console.log(`\n${displayName} Tools:`);
  commands.forEach((cmd, i) => {
    const subs = cmd.subcommands
      ? ` [${cmd.subcommands.map((s) => s.name).join('|')}]`
      : '';
    console.log(`  ${i + 1}. ${cmd.name}${subs} - ${cmd.description}`);
  });
  console.log(`  0. Back to categories`);
}

/**
 * Run interactive transformation
 */
async function runTransformation(
  rl: readline.Interface,
  command: string
): Promise<void> {
  const cmd = commandRegistry[command];
  if (!cmd) {
    console.log('Command not found');
    return;
  }

  // Check if command has subcommands
  let subcommand: string | undefined;
  if (cmd.subcommands) {
    const subs = Object.keys(cmd.subcommands);
    console.log(`\nSubcommands for ${command}:`);
    subs.forEach((sub, i) => {
      console.log(`  ${i + 1}. ${sub}`);
    });
    const subChoice = await prompt(rl, 'Select subcommand (number): ');
    const subIndex = parseInt(subChoice, 10) - 1;
    if (subIndex >= 0 && subIndex < subs.length) {
      subcommand = subs[subIndex];
    }
  }

  // Generator commands don't need input
  const generatorCommands = [
    'uuid', 'ulid', 'nanoid', 'ipv4', 'ipv6', 'mac',
    'randdate', 'randemail', 'randuser', 'randphone',
    'testcard', 'randcolor',
  ];

  let input = '';
  if (!generatorCommands.includes(command)) {
    input = await prompt(rl, 'Enter input text: ');
    if (!input) {
      console.log('No input provided');
      return;
    }
  }

  // Check if command needs additional options
  const options: Record<string, string | boolean> = {};
  const needsKey = ['hmac', 'vigenere', 'xor'].includes(command);
  const needsShift = ['caesar'].includes(command);

  if (needsKey) {
    const key = await prompt(rl, 'Enter key: ');
    if (key) options.key = key;
  }

  if (needsShift) {
    const shift = await prompt(rl, 'Enter shift amount (default 3): ');
    if (shift) options.shift = shift;
  }

  try {
    const result = await executeCommand(command, subcommand, input, options);
    console.log('\nResult:');
    console.log('─'.repeat(40));
    console.log(result);
    console.log('─'.repeat(40));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
  }
}

/**
 * Main interactive loop
 */
export async function runInteractive(): Promise<void> {
  const rl = createInterface();

  console.log(`\n${PROGRAM_NAME} - Interactive Mode`);
  console.log('Text Transform CLI - 111+ text transformations');
  console.log('Type "quit" or press Ctrl+C to exit\n');

  const byCategory = getCommandsByCategory();
  const categories = Object.keys(byCategory).sort();

  let running = true;

  while (running) {
    displayCategories();

    const categoryChoice = await prompt(rl, '\nSelect category (number or command name): ');

    // Check for quit
    if (categoryChoice.toLowerCase() === 'quit' || categoryChoice === '0') {
      running = false;
      break;
    }

    // Direct command entry
    if (commandRegistry[categoryChoice]) {
      await runTransformation(rl, categoryChoice);
      continue;
    }

    // Category selection by number
    const catIndex = parseInt(categoryChoice, 10) - 1;
    if (catIndex >= 0 && catIndex < categories.length) {
      const selectedCategory = categories[catIndex];
      const commands = byCategory[selectedCategory].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      let inCategory = true;
      while (inCategory) {
        displayCategoryTools(selectedCategory);

        const toolChoice = await prompt(rl, '\nSelect tool (number or name): ');

        if (toolChoice === '0') {
          inCategory = false;
          break;
        }

        // Direct command name
        if (commandRegistry[toolChoice]) {
          await runTransformation(rl, toolChoice);
          continue;
        }

        // Tool selection by number
        const toolIndex = parseInt(toolChoice, 10) - 1;
        if (toolIndex >= 0 && toolIndex < commands.length) {
          await runTransformation(rl, commands[toolIndex].name);
        } else {
          console.log('Invalid selection');
        }
      }
    } else {
      console.log('Invalid selection');
    }
  }

  console.log('\nGoodbye!');
  rl.close();
}
