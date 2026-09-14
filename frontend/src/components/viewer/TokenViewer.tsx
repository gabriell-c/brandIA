import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface TokenViewerProps {
  tokens: Record<string, string>;
  className?: string;
}

const TokenViewer: React.FC<TokenViewerProps> = ({ tokens, className }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'json' | 'css' | 'tailwind'>('tree');

  const formatCSS = (data: Record<string, string>) => {
    let css = ':root {\n';
    Object.entries(data).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });
    css += '}';
    return css;
  };

  const formatTailwind = (data: Record<string, string>) => {
    let config = '// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n';
    Object.entries(data).forEach(([key, value]) => {
      config += `        '${key}': '${value}',\n`;
    });
    config += '      },\n    },\n  },\n}';
    return config;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['tree', 'json', 'css', 'tailwind'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === mode
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {viewMode === 'tree' && (
          <div className="p-4 bg-white dark:bg-gray-900">
            <TokenTree data={tokens} />
          </div>
        )}
        {viewMode === 'json' && (
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-sm overflow-x-auto">
            <code className="text-gray-800 dark:text-gray-200">
              {JSON.stringify(tokens, null, 2)}
            </code>
          </pre>
        )}
        {viewMode === 'css' && (
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-sm overflow-x-auto">
            <code className="text-blue-700 dark:text-blue-300">
              {formatCSS(tokens)}
            </code>
          </pre>
        )}
        {viewMode === 'tailwind' && (
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-sm overflow-x-auto">
            <code className="text-green-700 dark:text-green-300">
              {formatTailwind(tokens)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

interface TokenTreeProps {
  data: Record<string, string>;
  depth?: number;
}

const TokenTree: React.FC<TokenTreeProps> = ({ data, depth = 0 }) => {
  return (
    <div className={cn('font-mono text-sm')}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 py-1">
          <span className="text-gray-500 dark:text-gray-400 w-4">{'  '.repeat(depth)}</span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">{key}:</span>
          <span className="text-green-600 dark:text-green-400">"{value}"</span>
        </div>
      ))}
    </div>
  );
};

export { TokenViewer };