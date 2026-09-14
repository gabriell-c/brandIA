import React from 'react';
import { cn } from '@/lib/utils';

interface ColorPaletteProps {
  colors: Record<string, string>;
  onSelect?: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, onSelect }) => {
  const colorEntries = Object.entries(colors);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {colorEntries.map(([name, color]) => (
        <div
          key={name}
          className={cn(
            'rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105',
            'shadow-sm hover:shadow-md'
          )}
          onClick={() => onSelect?.(color)}
        >
          <div
            className="h-16 w-full"
            style={{ backgroundColor: color }}
          />
          <div className="bg-white dark:bg-gray-800 p-2">
            <p className="text-xs font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{color}</p>
          </div>
        </div>
      ))}
    </div>
  );
};