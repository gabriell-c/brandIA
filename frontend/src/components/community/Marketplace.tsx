import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  segment: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  preview_images: string[];
  author_name: string;
  price_cents: number;
  price_dollars: number;
  license_type: string;
  tags: string[];
  status: string;
  sales_count: number;
  revenue_cents: number;
  created_at: string;
}

interface MarketplaceProps {
  className?: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ className }) => {
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [selected, setSelected] = useState<MarketplaceTemplate | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [segment, setSegment] = useState<string>('');
  const [segments, setSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await client.get('/community/marketplace/templates');
      setTemplates(data.data);
      setSegments(data.segments || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template: MarketplaceTemplate) => {
    setSelected(template);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search templates..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Segments</option>
            {segments.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={cn(
                  'group rounded-lg border-2 overflow-hidden transition-all hover:shadow-xl',
                  selected?.id === template.id 
                    ? 'border-purple-500 shadow-xl' 
                    : 'border-transparent'
                )}
              >
                {/* Preview area */}
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                  {template.preview_images && template.preview_images.length > 0 ? (
                    <img 
                      src={template.preview_images[0]} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center p-4">
                        <p className="font-medium text-lg">{template.name}</p>
                        <p className="text-sm opacity-80">{template.segment}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                      {template.license_type.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-3 py-1 bg-black/80 text-white text-lg font-bold rounded">
                      {formatPrice(template.price_cents)}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {template.segment}
                    </span>
                    {template.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-500">By {template.author_name}</span>
                    <span className="text-sm font-medium">{template.sales_count} sales</span>
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
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm">
                    {selected.license_type}
                  </span>
                </div>
              </div>

              {/* Preview Images */}
              {selected.preview_images && selected.preview_images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selected.preview_images.map((img, i) => (
                      <img 
                        key={i}
                        src={img} 
                        alt={`${selected.name} ${i + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Palette */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-3">Color Palette</label>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(selected.palette).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-16 h-16 rounded-lg shadow-md border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono">{color}</span>
                      <span className="text-xs text-gray-500 capitalize">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-3">Typography</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <label className="text-xs text-gray-500 block mb-1">Heading</label>
                    <div 
                      className="text-xl font-bold p-2 border rounded"
                      style={{ fontFamily: selected.typography.heading }}
                    >
                      Heading Example
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selected.typography.heading}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <label className="text-xs text-gray-500 block mb-1">Body</label>
                    <div 
                      className="text-base p-2 border rounded"
                      style={{ fontFamily: selected.typography.body }}
                    >
                      Body text example with the selected font
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selected.typography.body}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <label className="text-xs text-gray-500 block mb-1">Mono</label>
                    <div 
                      className="text-sm font-mono p-2 border rounded"
                      style={{ fontFamily: selected.typography.mono }}
                    >
                      {`const hello = "world";`}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selected.typography.mono}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-purple-600">{formatPrice(selected.price_cents)}</span>
                  <span className="text-sm text-gray-500">/{selected.license_type} license</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Purchase
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { Marketplace };