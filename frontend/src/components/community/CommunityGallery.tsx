import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface SharedDesign {
  id: string;
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  preview_image: string | null;
  tags: string[];
  category: string;
  likes_count: number;
  views_count: number;
  status: string;
  created_at: string;
}

interface CommunityGalleryProps {
  className?: string;
}

const CommunityGallery: React.FC<CommunityGalleryProps> = ({ className }) => {
  const [designs, setDesigns] = useState<SharedDesign[]>([]);
  const [selected, setSelected] = useState<SharedDesign | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      let url = `/community/community/designs?sort_by=${sortBy}`;
      if (category) url += `&category=${category}`;
      if (filter) url += `&search=${filter}`;
      
      const data = await client.get(url);
      setDesigns(data.data);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (design: SharedDesign) => {
    setSelected(design);
    // Track view
    await client.post(`/community/community/designs/${design.id}/view`);
  };

  const handleLike = async (designId: string) => {
    try {
      await client.post(`/community/community/designs/${designId}/like?user_id=current_user`);
      setDesigns(prev => prev.map(d => 
        d.id === designId ? { ...d, likes_count: d.likes_count + 1 } : d
      ));
      if (selected?.id === designId) {
        setSelected({ ...selected, likes_count: selected.likes_count + 1 });
      }
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Community Gallery</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search designs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className={cn(
                  'group rounded-lg border-2 overflow-hidden transition-all hover:shadow-xl cursor-pointer',
                  selected?.id === design.id 
                    ? 'border-blue-500 shadow-xl' 
                    : 'border-transparent'
                )}
                onClick={() => handleSelect(design)}
              >
                {/* Preview */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
                  {design.preview_image ? (
                    <img 
                      src={design.preview_image} 
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex gap-1">
                        {Object.values(design.palette).slice(0, 6).map((color, i) => (
                          <div 
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{design.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {design.user_name}</span>
                    <div className="flex gap-3">
                      <span>❤️ {design.likes_count}</span>
                      <span>👁️ {design.views_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selected.title}</h3>
                  <p className="text-gray-500 mt-1">{selected.description}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Palette Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-3">Color Palette</label>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(selected.palette).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-16 h-16 rounded-lg shadow-md"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-3">Typography</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xl" style={{ fontFamily: selected.typography.heading }}>
                      Heading
                    </div>
                    <p className="text-sm text-gray-500">{selected.typography.heading}</p>
                  </div>
                  <div>
                    <div className="text-base" style={{ fontFamily: selected.typography.body }}>
                      Body text
                    </div>
                    <p className="text-sm text-gray-500">{selected.typography.body}</p>
                  </div>
                  <div>
                    <div className="text-sm font-mono" style={{ fontFamily: selected.typography.mono }}>
                      code
                    </div>
                    <p className="text-sm text-gray-500">{selected.typography.mono}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">By {selected.user_name}</span>
                  <span className="text-sm">❤️ {selected.likes_count}</span>
                  <span className="text-sm">👁️ {selected.views_count}</span>
                </div>
                <button
                  onClick={() => handleLike(selected.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ❤️ Like
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { CommunityGallery };