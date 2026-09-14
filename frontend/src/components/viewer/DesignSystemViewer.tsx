import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TokenViewer } from './TokenViewer';
import { ComponentShowcase } from './ComponentShowcase';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface DesignSystemViewerProps {
  brandName?: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  onExport?: (format: 'json' | 'css' | 'tailwind') => void;
  className?: string;
}

export const DesignSystemViewer: React.FC<DesignSystemViewerProps> = ({
  brandName = 'Design System',
  palette,
  typography,
  onExport,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'export'>('tokens');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {brandName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preview and export your design system
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex gap-2" role="group" aria-label="Export formats">
            <button
              onClick={() => onExport?.('json')}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              JSON
            </button>
            <button
              onClick={() => onExport?.('css')}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              CSS
            </button>
            <button
              onClick={() => onExport?.('tailwind')}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Tailwind
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-1" role="tablist">
          {([
            { id: 'tokens', label: 'Tokens' },
            { id: 'components', label: 'Components' },
            { id: 'export', label: 'Export' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'tokens' && (
          <TokenViewer tokens={palette} />
        )}
        
        {activeTab === 'components' && (
          <ComponentShowcase theme={palette} typography={typography} />
        )}
        
        {activeTab === 'export' && (
          <ExportPanel 
            brandName={brandName}
            palette={palette}
            typography={typography}
            onExport={onExport}
          />
        )}
      </div>
    </div>
  );
};

interface ExportPanelProps {
  brandName: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  onExport?: (format: 'json' | 'css' | 'tailwind') => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  brandName,
  palette,
  typography,
  onExport
}) => {
  const formatCSS = () => {
    let css = `:root {\n  /* ${brandName} Design Tokens */\n`;
    Object.entries(palette).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });
    css += '}\n\n/* Dark mode */\n.dark {\n';
    Object.entries(palette).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });
    css += '}';
    return css;
  };

  const formatTailwind = () => {
    let config = `// tailwind.config.js\n// ${brandName} Design Tokens\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
    Object.entries(palette).forEach(([key, value]) => {
      config += `        '${key}': '${value}',\n`;
    });
    config += `      },\n      fontFamily: {\n        heading: ['${typography?.heading || 'Inter'}', 'sans-serif'],\n        body: ['${typography?.body || 'Inter'}', 'sans-serif'],\n        mono: ['${typography?.mono || 'JetBrains Mono'}', 'monospace']\n      }\n    },\n  },\n}`;
    return config;
  };

  const formatStyleDictionary = () => {
    const tokens: Record<string, any> = {};
    Object.entries(palette).forEach(([key, value]) => {
      tokens[key] = { value, type: 'color' };
    });
    return JSON.stringify(tokens, null, 2);
  };

  const exports = [
    {
      id: 'json',
      label: 'Design Tokens (JSON)',
      description: 'Standard JSON format for design tokens',
      content: JSON.stringify({ palette, typography }, null, 2),
      icon: '{}'
    },
    {
      id: 'css',
      label: 'CSS Variables',
      description: 'Ready-to-use CSS custom properties',
      content: formatCSS(),
      icon: '{}'
    },
    {
      id: 'tailwind',
      label: 'Tailwind Config',
      description: 'Complete tailwind.config.js with colors and fonts',
      content: formatTailwind(),
      icon: '//'
    },
    {
      id: 'style-dictionary',
      label: 'Style Dictionary',
      description: 'Format compatible with Amazon Style Dictionary',
      content: formatStyleDictionary(),
      icon: '{}'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Export Options</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Choose a format below to download your design system tokens. Each format is ready to use in your projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {exports.map((exp) => (
          <div key={exp.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{exp.icon}</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{exp.label}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exp.description}</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([exp.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${exp.id}.${exp.id === 'tailwind' ? 'js' : exp.id === 'style-dictionary' ? 'json' : exp.id}`;
                  a.click();
                  URL.revokeObjectURL(url);
                  onExport?.(exp.id as 'json' | 'css' | 'tailwind');
                }}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                Download
              </button>
            </div>
            <pre className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto max-h-40">
              <code>{exp.content.slice(0, 500)}{exp.content.length > 500 ? '...' : ''}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};