import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Template {
  id: number;
  name: string;
  description: string;
  segment: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  preview_image: string | null;
  author: string;
  is_premium: boolean;
  tags: string[];
  created_at: string;
}

interface TemplateViewerProps {
  className?: string;
}

const TemplateViewer: React.FC<TemplateViewerProps> = ({ className }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [segments, setSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await client.get('/advanced/templates');
      setTemplates(data.data);
      setSegments(data.segments);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template: Template) => {
    setSelected(template);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Design Templates</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search templates..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Segments</option>
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
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
                    ? 'border-blue-500 shadow-xl' 
                    : 'border-transparent'
                )}
              >
                {/* Preview area */}
                <div className="h-40 relative overflow-hidden">
                  {template.preview_image ? (
                    <img 
                      src={template.preview_image} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="flex justify-center gap-1 mb-2">
                          {Object.entries(template.palette).map(([_, color]) => (
                            <div 
                              key={color}
                              className="w-8 h-8 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">
                          {template.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {template.is_premium && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                      PREMIUM
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {template.segment}
                    </span>
                    {template.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded-full">
                        {tag}
                      </span>
                    ))}
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
                    {selected.segment}
                  </span>
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {selected.is_premium && (
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-bold">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {selected.author}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Use Template
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Customize
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

export { TemplateViewer };