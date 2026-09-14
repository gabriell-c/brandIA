import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Palette {
  id: number;
  name: string;
  colors: Record<string, string>;
  description: string;
  author: string;
  category: string;
  tags: string[];
  rating: float;
  votes: number;
}

interface PaletteViewerProps {
  className?: string;
}

const PaletteViewer: React.FC<PaletteViewerProps> = ({ className }) => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [selected, setSelected] = useState<Palette | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPalettes();
  }, []);

  const fetchPalettes = async () => {
    try {
      setLoading(true);
      const data = await client.get('/advanced/palettes');
      setPalettes(data);
      
      // Extract unique categories
      const cats = [...new Set(data.map((p: Palette) => p.category))];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch palettes:', error);
    } finally {
      setLoading(false);
    }
  };

  const votePalette = async (paletteId: number, score: number) => {
    try {
      await client.post(`/advanced/palettes/${paletteId}/vote?score=${score}`);
      fetchPalettes();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSelect = (palette: Palette) => {
    setSelected(palette);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Palettes</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search palettes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => handleSelect(palette)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all hover:shadow-lg',
                  selected?.id === palette.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-transparent'
                )}
              >
                <div className="flex flex-col gap-1 mb-3">
                  {Object.entries(palette.colors).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-500 font-mono">{color}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium">{palette.name}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>⭐ {palette.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{palette.votes} votes</span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selected.name}</h3>
                  <p className="text-gray-500">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                    {selected.category}
                  </span>
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {Object.entries(selected.colors).map(([name, color]) => (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono">{color}</span>
                    <span className="text-xs text-gray-500">{name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">By {selected.author}</span>
                  <span className="text-sm">⭐ {selected.rating.toFixed(1)}</span>
                  <span className="text-sm">{selected.votes} votes</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => votePalette(selected.id, score)}
                      className={cn(
                        'px-3 py-1 rounded text-sm transition-colors',
                        'hover:bg-blue-100 dark:hover:bg-blue-900'
                      )}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { PaletteViewer };