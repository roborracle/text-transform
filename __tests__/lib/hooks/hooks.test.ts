/**
 * Tests for UX Hooks
 * useClipboard, useRecentTools, useKeyboardShortcuts
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn(),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Import hooks after mocks are set up
import { useClipboard } from '@/lib/hooks/useClipboard';
import { useRecentTools, RecentTool } from '@/lib/hooks/useRecentTools';

describe('useClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should return success on copy', async () => {
    const { result } = renderHook(() => useClipboard());

    let success: boolean;
    await act(async () => {
      success = await result.current.copy('test');
    });

    expect(success!).toBe(true);
  });

  it('should handle clipboard errors', async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Copy failed');
  });

  it('should reset state after duration', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useClipboard({ successDuration: 1000 }));

    await act(async () => {
      await result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
    jest.useRealTimers();
  });

  it('should allow manual reset', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
  });
});

describe('useRecentTools', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should start with empty recent tools', () => {
    const { result } = renderHook(() => useRecentTools());
    expect(result.current.recentTools).toEqual([]);
  });

  it('should add a recent tool', () => {
    const { result } = renderHook(() => useRecentTools());

    const tool: Omit<RecentTool, 'timestamp'> = {
      id: 'tool-1',
      name: 'Test Tool',
      slug: 'test-tool',
      categorySlug: 'test-category',
    };

    act(() => {
      result.current.addRecentTool(tool);
    });

    expect(result.current.recentTools).toHaveLength(1);
    expect(result.current.recentTools[0].id).toBe('tool-1');
    expect(result.current.recentTools[0].name).toBe('Test Tool');
    expect(result.current.recentTools[0].timestamp).toBeDefined();
  });

  it('should not duplicate tools, but move to front', () => {
    const { result } = renderHook(() => useRecentTools());

    const tool1 = { id: 'tool-1', name: 'Tool 1', slug: 'tool-1', categorySlug: 'cat' };
    const tool2 = { id: 'tool-2', name: 'Tool 2', slug: 'tool-2', categorySlug: 'cat' };

    act(() => {
      result.current.addRecentTool(tool1);
      result.current.addRecentTool(tool2);
      result.current.addRecentTool(tool1); // Add tool1 again
    });

    expect(result.current.recentTools).toHaveLength(2);
    expect(result.current.recentTools[0].id).toBe('tool-1'); // Most recent
    expect(result.current.recentTools[1].id).toBe('tool-2');
  });

  it('should limit to 10 recent tools', () => {
    const { result } = renderHook(() => useRecentTools());

    // Add 15 tools
    for (let i = 0; i < 15; i++) {
      act(() => {
        result.current.addRecentTool({
          id: `tool-${i}`,
          name: `Tool ${i}`,
          slug: `tool-${i}`,
          categorySlug: 'cat',
        });
      });
    }

    expect(result.current.recentTools).toHaveLength(10);
    // Most recent should be tool-14
    expect(result.current.recentTools[0].id).toBe('tool-14');
  });

  it('should remove a tool', () => {
    const { result } = renderHook(() => useRecentTools());

    const tool1 = { id: 'tool-1', name: 'Tool 1', slug: 'tool-1', categorySlug: 'cat' };
    const tool2 = { id: 'tool-2', name: 'Tool 2', slug: 'tool-2', categorySlug: 'cat' };

    act(() => {
      result.current.addRecentTool(tool1);
      result.current.addRecentTool(tool2);
    });

    expect(result.current.recentTools).toHaveLength(2);

    act(() => {
      result.current.removeRecentTool('tool-1');
    });

    expect(result.current.recentTools).toHaveLength(1);
    expect(result.current.recentTools[0].id).toBe('tool-2');
  });

  it('should clear all tools', () => {
    const { result } = renderHook(() => useRecentTools());

    act(() => {
      result.current.addRecentTool({
        id: 'tool-1',
        name: 'Tool 1',
        slug: 'tool-1',
        categorySlug: 'cat',
      });
      result.current.addRecentTool({
        id: 'tool-2',
        name: 'Tool 2',
        slug: 'tool-2',
        categorySlug: 'cat',
      });
    });

    expect(result.current.recentTools).toHaveLength(2);

    act(() => {
      result.current.clearRecentTools();
    });

    expect(result.current.recentTools).toEqual([]);
  });

  it('should save to localStorage', () => {
    const { result } = renderHook(() => useRecentTools());

    act(() => {
      result.current.addRecentTool({
        id: 'tool-1',
        name: 'Tool 1',
        slug: 'tool-1',
        categorySlug: 'cat',
      });
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedData = localStorageMock.setItem.mock.calls[0][1];
    const parsed = JSON.parse(savedData);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('tool-1');
  });
});

describe('Search Functions', () => {
  // Import search functions dynamically to avoid module caching issues
  let searchModule: typeof import('@/lib/search');

  beforeAll(() => {
    searchModule = require('@/lib/search');
  });

  beforeEach(() => {
    searchModule.clearSearchIndex();
  });

  it('should return empty array for empty query', () => {
    expect(searchModule.search('')).toEqual([]);
    expect(searchModule.search('   ')).toEqual([]);
  });

  it('should find tools by name', () => {
    const results = searchModule.search('base64');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r: { name: string }) => r.name.toLowerCase().includes('base64'))).toBe(true);
  });

  it('should find categories', () => {
    const results = searchModule.search('encoding');
    expect(results.some((r: { type: string }) => r.type === 'category')).toBe(true);
  });

  it('should respect limit option', () => {
    const results = searchModule.search('a', { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('should filter by type', () => {
    const toolResults = searchModule.searchTools('encode');
    expect(toolResults.every((r: { type: string }) => r.type === 'tool')).toBe(true);

    const catResults = searchModule.searchCategories('encoding');
    expect(catResults.every((r: { type: string }) => r.type === 'category')).toBe(true);
  });

  it('should sort by relevance score', () => {
    const results = searchModule.search('json');
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('should be case insensitive', () => {
    const lower = searchModule.search('base64');
    const upper = searchModule.search('BASE64');
    expect(lower.length).toBe(upper.length);
  });
});
