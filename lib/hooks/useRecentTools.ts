'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'text-transform-recent-tools';
const MAX_RECENT_TOOLS = 10;

export interface RecentTool {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  timestamp: number;
}

interface UseRecentToolsReturn {
  /** List of recent tools */
  recentTools: RecentTool[];
  /** Add a tool to recent history */
  addRecentTool: (tool: Omit<RecentTool, 'timestamp'>) => void;
  /** Remove a tool from recent history */
  removeRecentTool: (id: string) => void;
  /** Clear all recent tools */
  clearRecentTools: () => void;
}

/**
 * Load recent tools from localStorage
 */
function loadRecentTools(): RecentTool[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Validate and filter items
    return parsed.filter(
      (item): item is RecentTool =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.slug === 'string' &&
        typeof item.categorySlug === 'string' &&
        typeof item.timestamp === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Save recent tools to localStorage
 */
function saveRecentTools(tools: RecentTool[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch {
    // Ignore storage errors (e.g., quota exceeded)
  }
}

/**
 * Hook for managing recently used tools
 */
export function useRecentTools(): UseRecentToolsReturn {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setRecentTools(loadRecentTools());
  }, []);

  const addRecentTool = useCallback(
    (tool: Omit<RecentTool, 'timestamp'>) => {
      setRecentTools((prev) => {
        // Remove existing entry for this tool
        const filtered = prev.filter((t) => t.id !== tool.id);

        // Add new entry at the beginning
        const newTool: RecentTool = {
          ...tool,
          timestamp: Date.now(),
        };

        // Keep only the most recent tools
        const updated = [newTool, ...filtered].slice(0, MAX_RECENT_TOOLS);

        // Save to localStorage
        saveRecentTools(updated);

        return updated;
      });
    },
    []
  );

  const removeRecentTool = useCallback((id: string) => {
    setRecentTools((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveRecentTools(updated);
      return updated;
    });
  }, []);

  const clearRecentTools = useCallback(() => {
    setRecentTools([]);
    saveRecentTools([]);
  }, []);

  return {
    recentTools,
    addRecentTool,
    removeRecentTool,
    clearRecentTools,
  };
}

export default useRecentTools;
