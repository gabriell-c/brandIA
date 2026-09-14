import React from 'react';
import { cn } from '@/lib/utils';
import { ColorPalette } from './ColorPalette';
import { TypographyPreview } from './TypographyPreview';

interface BrandResultsProps {
  data: {
    brand_name: string;
    tagline?: string;
    palette: Record<string, string>;
    typography: Record<string, string>;
    explanation: string;
  };
  onExport?: (format: 'json' | 'css' | 'tailwind') => void;
}

export const BrandResults: React.FC<BrandResultsProps> = ({ data, onExport }) => {
  const [activeTab, setActiveTab] = React.useState<'palette' | 'typography' | 'explain'>('palette');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.brand_name}</h1>
          {data.tagline && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{data.tagline}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onExport?.('json')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={() => onExport?.('css')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Export CSS
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {(['palette', 'typography', 'explain'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {tab === 'palette' && '🎨 调色板'}
            {tab === 'typography' && '📝 字体'}
            {tab === 'explain' && '💡 说明'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
        {activeTab === 'palette' && (
          <ColorPalette colors={data.palette} />
        )}
        {activeTab === 'typography' && (
          <TypographyPreview
            heading={data.typography.heading || 'Inter'}
            body={data.typography.body || 'Inter'}
            mono={data.typography.mono || 'JetBrains Mono'}
          />
        )}
        {activeTab === 'explain' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};