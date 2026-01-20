/**
 * Text Transform - Popup Script
 */

import { tools, categories, transform } from '../src/transforms.js';

// DOM Elements
const inputEl = document.getElementById('input');
const categoriesEl = document.getElementById('categories');
const toolsEl = document.getElementById('tools');
const outputSection = document.getElementById('output-section');
const outputToolName = document.getElementById('output-tool-name');
const outputEl = document.getElementById('output');
const copyBtn = document.getElementById('copy-btn');

// State
let activeCategory = null;
let lastResult = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderTools();
  setupEventListeners();
});

// Render category buttons
function renderCategories() {
  categoriesEl.innerHTML = '';

  // Add "All" category
  const allBtn = document.createElement('button');
  allBtn.className = 'popup__category' + (activeCategory === null ? ' popup__category--active' : '');
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => {
    activeCategory = null;
    renderCategories();
    renderTools();
  });
  categoriesEl.appendChild(allBtn);

  // Add category buttons
  for (const [id, category] of Object.entries(categories)) {
    const btn = document.createElement('button');
    btn.className = 'popup__category' + (activeCategory === id ? ' popup__category--active' : '');
    btn.textContent = `${category.icon} ${category.name}`;
    btn.addEventListener('click', () => {
      activeCategory = id;
      renderCategories();
      renderTools();
    });
    categoriesEl.appendChild(btn);
  }
}

// Render tool list
function renderTools() {
  toolsEl.innerHTML = '';

  const filteredTools = Object.entries(tools).filter(([id, tool]) => {
    if (activeCategory === null) return true;
    return tool.category === activeCategory;
  });

  if (filteredTools.length === 0) {
    toolsEl.innerHTML = '<div class="popup__empty">No tools in this category</div>';
    return;
  }

  for (const [id, tool] of filteredTools) {
    const toolEl = document.createElement('div');
    toolEl.className = 'popup__tool';
    toolEl.innerHTML = `
      <span class="popup__tool-name">${tool.name}</span>
      <span class="popup__tool-category">${categories[tool.category]?.icon || ''}</span>
    `;
    toolEl.addEventListener('click', () => executeTool(id, tool));
    toolsEl.appendChild(toolEl);
  }
}

// Execute a tool
async function executeTool(toolId, tool) {
  const input = inputEl.value;

  // Generators don't need input
  if (!tool.generator && !input.trim()) {
    showOutput('Please enter some text first', 'Error');
    return;
  }

  try {
    const result = await transform(toolId, input);
    lastResult = result;
    showOutput(result, tool.name);
  } catch (error) {
    showOutput(`Error: ${error.message}`, 'Error');
  }
}

// Show output
function showOutput(result, toolName) {
  outputSection.style.display = 'block';
  outputToolName.textContent = toolName;
  outputEl.textContent = result;
}

// Setup event listeners
function setupEventListeners() {
  // Copy button
  copyBtn.addEventListener('click', async () => {
    if (!lastResult) return;

    try {
      await navigator.clipboard.writeText(lastResult);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = lastResult;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    }
  });

  // Input change - clear output
  inputEl.addEventListener('input', () => {
    outputSection.style.display = 'none';
  });

  // Focus input on open
  inputEl.focus();
}
