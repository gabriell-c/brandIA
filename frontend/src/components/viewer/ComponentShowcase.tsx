import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentShowcaseProps {
  theme: Record<string, string>;
  typography: Record<string, string>;
  className?: string;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ theme, typography }) => {
  const primary = theme.primary || '#3B82F6';
  const secondary = theme.secondary || '#10B981';
  const accent = theme.accent || '#F59E0B';
  const neutral = theme.neutral || '#6B7280';
  const light = theme.light || '#F9FAFB';
  const dark = theme.dark || '#111827';
  const headingFont = typography?.heading || 'Inter';
  const bodyFont = typography?.body || 'Inter';

  return (
    <div className={cn('space-y-8', className)}>
      {/* Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <button className={cn('px-4 py-2 rounded-lg font-medium transition-all', 'bg-blue-600 text-white hover:bg-blue-700')}>
            Primary
          </button>
          <button className={cn('px-4 py-2 rounded-lg font-medium transition-all', 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100')}>
            Secondary
          </button>
          <button className={cn('px-4 py-2 rounded-lg font-medium transition-all', 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')}>
            Ghost
          </button>
          <button className={cn('px-4 py-2 rounded-lg font-medium transition-all', 'bg-red-600 text-white hover:bg-red-700')}>
            Destructive
          </button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn('p-4 rounded-lg border', 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700')}>
            <h4 className="font-semibold mb-2">Info Card</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Standard card with information</p>
          </div>
          <div className={cn('p-4 rounded-lg border', 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800')}>
            <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Success Card</h4>
            <p className="text-sm text-green-600 dark:text-green-400">Success state card</p>
          </div>
          <div className={cn('p-4 rounded-lg border', 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800')}>
            <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Warning Card</h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Warning state card</p>
          </div>
          <div className={cn('p-4 rounded-lg border', 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800')}>
            <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Error Card</h4>
            <p className="text-sm text-red-600 dark:text-red-400">Error state card</p>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Form Elements</h3>
        <div className={cn('p-4 rounded-lg border space-y-4', 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700')}>
          <div>
            <label className="block text-sm font-medium mb-1">Text Input</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 rounded-md border text-gray-900 dark:text-white"
              style={{ borderColor: neutral, backgroundColor: light }}
              placeholder="Enter text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Input</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 rounded-md border text-gray-900 dark:text-white"
              style={{ borderColor: neutral, backgroundColor: light }}
              placeholder="email@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="demo-check" className="w-4 h-4" />
            <label htmlFor="demo-check" className="text-sm">Checkbox</label>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="demo-radio" className="w-4 h-4" />
              Option 1
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="demo-radio" className="w-4 h-4" />
              Option 2
            </label>
          </div>
          <select className="w-full px-3 py-2 rounded-md border text-gray-900 dark:text-white" style={{ borderColor: neutral }}>
            <option>Select option...</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Color Palette</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(theme).map(([name, color]) => (
            <div key={name} className="text-center">
              <div 
                className="w-full aspect-square rounded-lg border shadow-sm"
                style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.1)' }}
              />
              <p className="text-xs font-medium mt-2 text-gray-700 dark:text-gray-300 capitalize">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{color}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Typography</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Heading ({headingFont})</p>
            <p style={{ fontFamily: `'${headingFont}', sans-serif` }} className="text-2xl font-bold">
              Heading Text
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Body ({bodyFont})</p>
            <p style={{ fontFamily: `'${bodyFont}', sans-serif` }} className="text-base">
              Body text with regular weight for comfortable reading
            </p>
          </div>
        </div>
      </section>

      {/* Navbar & Footer Preview */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Layout Components</h3>
        
        {/* Navbar */}
        <div className={cn('p-3 rounded-lg border mb-4', 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700')}>
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg" style={{ color: primary }}>Logo</div>
            <nav className="flex gap-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Home</span>
              <span className="text-gray-600 dark:text-gray-400">About</span>
              <span className="text-gray-600 dark:text-gray-400">Contact</span>
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className={cn('p-3 rounded-lg border', 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700')}>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 Brand System. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
};

export { ComponentShowcase };