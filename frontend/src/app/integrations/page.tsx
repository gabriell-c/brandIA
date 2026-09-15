'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Integration {
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  version: string;
  components?: number;
  features: string[];
}

export default function IntegrationsPage() {
  const [status, setStatus] = useState<any>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/integrations/status'),
      client.get('/integrations/vscode/snippets')
    ]).then(([statusData, snippetsData]) => {
      setStatus(statusData);
      setSnippets(snippetsData);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to fetch integrations data:', error);
      setLoading(false);
    });
  }, []);

  const integrations: Integration[] = [
    {
      name: 'Figma',
      icon: '🎨',
      description: 'Import and export design tokens between Omni and Figma',
      status: 'active',
      version: '2.0.0',
      features: ['Import colors', 'Export palettes', 'Sync styles', 'Bidirectional sync']
    },
    {
      name: 'VS Code',
      icon: '📝',
      description: 'Use design tokens directly in your code editor',
      status: 'active',
      version: '1.0.0',
      features: ['Code snippets', 'Color preview', 'Autocomplete', 'Auto-sync']
    },
    {
      name: 'React',
      icon: '⚛️',
      description: 'Ready-to-use React components with design tokens',
      status: 'active',
      version: '1.0.0',
      components: 15,
      features: ['TypeScript types', 'Styled components', 'Storybook', 'Props API']
    },
    {
      name: 'Vue',
      icon: '💚',
      description: 'Vue components with design tokens integration',
      status: 'active',
      version: '1.0.0',
      components: 15,
      features: ['TypeScript support', 'Composition API', 'Storybook', 'Props API']
    },
    {
      name: 'CSS',
      icon: '🎯',
      description: 'CSS variables and modules for web projects',
      status: 'active',
      version: '1.0.0',
      features: ['CSS Variables', 'SCSS modules', 'CSS Modules', 'Global styles']
    },
    {
      name: 'Tailwind',
      icon: '🌊',
      description: 'Tailwind CSS config with design tokens',
      status: 'active',
      version: '1.0.0',
      features: ['Config file', 'Theme extension', 'Utility classes', 'Dark mode']
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect Omni Design System with your favorite tools
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    integration.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  )}>
                    {integration.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>

                <div className="text-xs text-gray-500 mb-4">
                  Version: {integration.version}
                  {integration.components && ` • ${integration.components} components`}
                </div>

                <div className="space-y-2">
                  {integration.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VS Code Snippets */}
        {snippets.length > 0 && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">VS Code Snippets</h2>
            <div className="space-y-3">
              {snippets.slice(0, 4).map((snippet, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-mono text-sm font-medium">{snippet.prefix}</div>
                    <div className="text-xs text-gray-500">{snippet.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {snippet.body[0]}
                    </code>
                    <button
                      onClick={() => copyToClipboard(snippet.body[0])}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Links */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Download Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium">Figma Plugin</div>
              <div className="text-sm text-gray-500">Download for Figma</div>
            </button>
            <button className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left">
              <div className="text-2xl mb-2">💻</div>
              <div className="font-medium">VS Code Extension</div>
              <div className="text-sm text-gray-500">Install from Marketplace</div>
            </button>
            <button className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left">
              <div className="text-2xl mb-2">⚛️</div>
              <div className="font-medium">React Components</div>
              <div className="text-sm text-gray-500">npm install @omni/react</div>
            </button>
            <button className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left">
              <div className="text-2xl mb-2">💚</div>
              <div className="font-medium">Vue Components</div>
              <div className="text-sm text-gray-500">npm install @omni/vue</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}