'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Vectorize, TypographicLogo, PaletteViewer, FontViewer, TemplateViewer } from '@/components/advanced';

export default function AdvancedPage() {
  const [activeTab, setActiveTab] = useState('vectorize');

  const tabs = [
    { id: 'vectorize', label: 'Vectorize', icon: '🔷' },
    { id: 'typo', label: 'Typographic Logo', icon: '✍️' },
    { id: 'palettes', label: 'Community Palettes', icon: '🎨' },
    { id: 'fonts', label: 'Font Pairings', icon: '🔤' },
    { id: 'templates', label: 'Templates', icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional tools to enhance your design workflow
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === 'vectorize' && (
            <div>
              <h2 className="text-xl font-bold mb-4">PNG to SVG Vectorization</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload a raster logo and convert it to a scalable SVG vector.
                Best for existing logos that need to be made resolution-independent.
              </p>
              <Vectorize />
            </div>
          )}

          {activeTab === 'typo' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Typographic Logo Generator</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create beautiful text-based logos with customizable fonts, colors, and variations.
                Perfect for wordmark logos and brand names.
              </p>
              <TypographicLogo />
            </div>
          )}

          {activeTab === 'palettes' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Community Palettes</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse and vote for community-contributed color palettes.
                Find inspiration from designers around the world.
              </p>
              <PaletteViewer />
            </div>
          )}

          {activeTab === 'fonts' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Font Pairings</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Explore pre-tested font combinations. Preview and vote for your favorites.
                Find the perfect typography pairing for your brand.
              </p>
              <FontViewer />
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Design Templates</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started quickly with pre-made design templates for common business types.
                Customize colors and typography to match your brand.
              </p>
              <TemplateViewer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
