/**
 * Text Transform - Background Service Worker
 * Handles context menus and message passing
 */

import { tools, categories, transform } from './transforms.js';

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
  // Parent menu
  chrome.contextMenus.create({
    id: 'text-transform',
    title: 'Text Transform',
    contexts: ['selection'],
  });

  // Create submenus by category
  const categoryOrder = ['naming', 'encoding', 'crypto', 'ciphers', 'formatters', 'text'];

  for (const categoryId of categoryOrder) {
    const category = categories[categoryId];
    chrome.contextMenus.create({
      id: `category-${categoryId}`,
      parentId: 'text-transform',
      title: `${category.icon} ${category.name}`,
      contexts: ['selection'],
    });

    // Add tools in this category
    for (const [toolId, tool] of Object.entries(tools)) {
      if (tool.category === categoryId) {
        chrome.contextMenus.create({
          id: `tool-${toolId}`,
          parentId: `category-${categoryId}`,
          title: tool.name,
          contexts: ['selection'],
        });
      }
    }
  }

  // Quick access tools at top level
  chrome.contextMenus.create({
    id: 'separator-1',
    parentId: 'text-transform',
    type: 'separator',
    contexts: ['selection'],
  });

  const quickTools = ['camel-case', 'snake-case', 'base64-encode', 'rot13'];
  for (const toolId of quickTools) {
    const tool = tools[toolId];
    chrome.contextMenus.create({
      id: `quick-${toolId}`,
      parentId: 'text-transform',
      title: `⚡ ${tool.name}`,
      contexts: ['selection'],
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText;
  if (!selectedText) return;

  let toolId = null;

  // Extract tool ID from menu item ID
  if (info.menuItemId.startsWith('tool-')) {
    toolId = info.menuItemId.replace('tool-', '');
  } else if (info.menuItemId.startsWith('quick-')) {
    toolId = info.menuItemId.replace('quick-', '');
  }

  if (toolId && tools[toolId]) {
    try {
      const result = await transform(toolId, selectedText);

      // Send result to content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'showResult',
        original: selectedText,
        result: result,
        toolName: tools[toolId].name,
      });
    } catch (error) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'showError',
        error: error.message,
      });
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'transform') {
    transform(message.toolId, message.input)
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (message.action === 'getTools') {
    sendResponse({ tools, categories });
    return false;
  }

  if (message.action === 'copyToClipboard') {
    // This needs to be done in content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'copyToClipboard',
          text: message.text,
        });
      }
    });
    sendResponse({ success: true });
    return false;
  }
});

// Store recent tools
const MAX_RECENT = 5;

export async function addRecentTool(toolId) {
  const { recentTools = [] } = await chrome.storage.local.get('recentTools');
  const updated = [toolId, ...recentTools.filter((t) => t !== toolId)].slice(0, MAX_RECENT);
  await chrome.storage.local.set({ recentTools: updated });
}

export async function getRecentTools() {
  const { recentTools = [] } = await chrome.storage.local.get('recentTools');
  return recentTools;
}
