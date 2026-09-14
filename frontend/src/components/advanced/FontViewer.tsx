import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface FontPairing {
  id: number;
  name: string;
  heading_font: string;
  body_font: string;
  mono_font: string;
  description: string;
  author: string;
  style: string;
  tags: string[];
  rating: float;
  votes: number;
}

interface FontViewerProps {
  className?: string;
}

const FontViewer: React.FC<FontViewerProps> = ({ className }) => {
  const [pairings, setPairings] = useState<FontPairing[]>([]);
  const [selected, setSelected] = useState<FontPairing | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [styles, setStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPairings();
  }, []);

  const fetchPairings = async () => {
    try {
      setLoading(true);
      const data = await client.get('/advanced/fonts');
      setPairings(data.data);
      setStyles(data.styles);
    } catch (error) {
      console.error('Failed to fetch fonts:', error);
    } finally {
      setLoading(false);
    }
  };

  const voteFont = async (pairingId: number, score: number) => {
    try {
      await client.post(`/advanced/fonts/${pairingId}/vote?score=${score}`);
      fetchPairings();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSelect = (pairing: FontPairing) => {
    setSelected(pairing);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Font Pairings</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search fonts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Styles</option>
            {styles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pairings.map((pairing) => (
              <button
                key={pairing.id}
                onClick={() => handleSelect(pairing)}
                className={cn(
                  'p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg',
                  selected?.id === pairing.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                )}
              >
                <div className="space-y-2">
                  <div 
                    className="text-3xl font-bold"
                    style={{ fontFamily: pairing.heading_font }}
                  >
                    Aa Bb Cc
                  </div>
                  <div 
                    className="text-base"
                    style={{ fontFamily: pairing.body_font }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div 
                    className="text-sm font-mono"
                    style={{ fontFamily: pairing.mono_font }}
                  >
                    code {&lt;component /&gt;}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{pairing.name}</div>
                    <div className="text-sm text-gray-500">
                      {pairing.heading_font} + {pairing.body_font}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>⭐ {pairing.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{pairing.votes}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selected.name}</h3>
                  <p className="text-gray-500 mt-1">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                    {selected.style}
                  </span>
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Heading</label>
                  <div 
                    className="text-2xl font-bold p-4 border rounded-lg"
                    style={{ fontFamily: selected.heading_font }}
                  >
                    Aa Bb Cc
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selected.heading_font}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Body</label>
                  <div 
                    className="text-base p-4 border rounded-lg"
                    style={{ fontFamily: selected.body_font }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selected.body_font}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Mono</label>
                  <div 
                    className="text-sm font-mono p-4 border rounded-lg"
                    style={{ fontFamily: selected.mono_font }}
                  >
                    {`const x = 42;`}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selected.mono_font}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {selected.author}</span>
                  <span>⭐ {selected.rating.toFixed(1)}</span>
                  <span>{selected.votes} votes</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => voteFont(selected.id, score)}
                      className="px-3 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
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

export { FontViewer };