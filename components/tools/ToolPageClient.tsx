'use client';

import { TransformPanel, type TransformOption } from './TransformPanel';
import { getTransformFunction } from '@/lib/tools/function-registry';
import type { Tool } from '@/lib/tools';

/**
 * Props for the ToolPageClient component
 */
interface ToolPageClientProps {
  tool: Tool;
}

/**
 * Convert tool options to TransformPanel options format
 */
function convertOptions(toolOptions: Tool['options']): TransformOption[] {
  if (!toolOptions) return [];

  return toolOptions.map((opt) => ({
    key: opt.key,
    label: opt.label,
    type: opt.type,
    defaultValue: opt.defaultValue,
    options: opt.options,
    placeholder: opt.placeholder,
    min: opt.min,
    max: opt.max,
  }));
}

/**
 * Client component that wires up the tool's transformation function
 * to the TransformPanel component
 */
export function ToolPageClient({ tool }: ToolPageClientProps) {
  // Get the transformation function from the registry
  const transformFn = getTransformFunction(tool.transformFn);

  // If no function found, show error
  if (!transformFn) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
          Tool Not Available
        </h3>
        <p className="text-red-600 dark:text-red-400">
          The transformation function &quot;{tool.transformFn}&quot; is not yet implemented.
        </p>
      </div>
    );
  }

  // Convert tool options to TransformPanel format
  const options = convertOptions(tool.options);

  // Determine if this is a generator tool (no input required)
  const isGenerator = tool.isGenerator === true;

  return (
    <TransformPanel
      title={tool.name}
      description={tool.description}
      transformFn={transformFn}
      inputPlaceholder={
        isGenerator
          ? 'Click Transform to generate output...'
          : tool.inputPlaceholder || 'Enter text to transform...'
      }
      outputPlaceholder={tool.outputPlaceholder || 'Transformed output will appear here...'}
      options={options}
      showSwapButton={!isGenerator && !!tool.reverseFn}
      realtime={!tool.isAsync && !isGenerator}
      maxInputSize={100000}
    />
  );
}

export default ToolPageClient;
