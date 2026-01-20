/**
 * Text Transform - Content Script
 * Shows transformation results and handles clipboard
 */

// Create toast notification element
function createToast() {
  const existing = document.getElementById('text-transform-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'text-transform-toast';
  toast.className = 'text-transform-toast';
  document.body.appendChild(toast);
  return toast;
}

// Show toast notification
function showToast(content, type = 'success', duration = 4000) {
  const toast = createToast();
  toast.innerHTML = content;
  toast.className = `text-transform-toast text-transform-toast--${type}`;

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('text-transform-toast--visible');
  });

  // Auto-hide
  setTimeout(() => {
    toast.classList.remove('text-transform-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast;
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showResult') {
    const { original, result, toolName } = message;

    // Create result content
    const content = `
      <div class="text-transform-toast__header">
        <span class="text-transform-toast__icon">✓</span>
        <span class="text-transform-toast__title">${toolName}</span>
      </div>
      <div class="text-transform-toast__result">${escapeHtml(result)}</div>
      <div class="text-transform-toast__actions">
        <button class="text-transform-toast__btn text-transform-toast__btn--copy" data-result="${escapeAttr(result)}">
          Copy
        </button>
        <button class="text-transform-toast__btn text-transform-toast__btn--replace" data-result="${escapeAttr(result)}">
          Replace
        </button>
      </div>
    `;

    const toast = showToast(content, 'success', 8000);

    // Handle copy button
    toast.querySelector('.text-transform-toast__btn--copy')?.addEventListener('click', async (e) => {
      const text = e.target.dataset.result;
      await copyToClipboard(text);
      e.target.textContent = 'Copied!';
      setTimeout(() => (e.target.textContent = 'Copy'), 1500);
    });

    // Handle replace button (replace selected text in editable fields)
    toast.querySelector('.text-transform-toast__btn--replace')?.addEventListener('click', (e) => {
      const text = e.target.dataset.result;
      replaceSelectedText(text);
      e.target.textContent = 'Replaced!';
      toast.classList.remove('text-transform-toast--visible');
      setTimeout(() => toast.remove(), 300);
    });

    sendResponse({ success: true });
    return false;
  }

  if (message.action === 'showError') {
    const content = `
      <div class="text-transform-toast__header">
        <span class="text-transform-toast__icon">✗</span>
        <span class="text-transform-toast__title">Error</span>
      </div>
      <div class="text-transform-toast__result">${escapeHtml(message.error)}</div>
    `;
    showToast(content, 'error', 5000);
    sendResponse({ success: true });
    return false;
  }

  if (message.action === 'copyToClipboard') {
    copyToClipboard(message.text).then(() => {
      showToast(`
        <div class="text-transform-toast__header">
          <span class="text-transform-toast__icon">✓</span>
          <span class="text-transform-toast__title">Copied to clipboard</span>
        </div>
      `, 'success', 2000);
    });
    sendResponse({ success: true });
    return false;
  }
});

// Replace selected text in editable elements
function replaceSelectedText(newText) {
  const activeElement = document.activeElement;

  // Handle input/textarea
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;

    activeElement.value = value.substring(0, start) + newText + value.substring(end);
    activeElement.selectionStart = activeElement.selectionEnd = start + newText.length;

    // Dispatch input event
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  // Handle contenteditable
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Check if in contenteditable
    const editable = container.nodeType === 3
      ? container.parentElement?.closest('[contenteditable="true"]')
      : container.closest?.('[contenteditable="true"]');

    if (editable) {
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));

      // Move cursor to end
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      // Dispatch input event
      editable.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

// Escape HTML for display
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Escape for HTML attributes
function escapeAttr(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Announce ready
console.log('[Text Transform] Content script loaded');
