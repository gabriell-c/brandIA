import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Comment {
  id: number;
  palette_id: number;
  author: string;
  content: string;
  created_at: string;
}

interface Palette {
  id: number;
  name: string;
  colors: Record<string, string>;
  description: string;
  author: string;
  category: string;
  tags: string[];
  rating: number;
  votes: number;
  comments?: Comment[];
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
  
  // Comment form state
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchComments = async (paletteId: number) => {
    try {
      const comments = await client.get(`/advanced/palettes/${paletteId}/comments`);
      return comments;
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return [];
    }
  };

  const votePalette = async (paletteId: number, score: number) => {
    try {
      await client.post(`/advanced/palettes/${paletteId}/vote?score=${score}`);
      fetchPalettes();
      // Refresh selected palette if needed
      if (selected?.id === paletteId) {
        setSelected({ ...selected, votes: selected.votes + 1, rating: ((selected.rating * selected.votes) + score) / (selected.votes + 1) });
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !commentAuthor.trim() || !commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await client.post('/advanced/palettes/comments', {
        palette_id: selected.id,
        author: commentAuthor,
        content: commentContent
      });
      
      // Add comment to selected palette
      const updatedComments = [...(selected.comments || []), newComment];
      setSelected({ ...selected, comments: updatedComments });
      
      // Reset form
      setCommentAuthor('');
      setCommentContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = async (palette: Palette) => {
    setSelected(palette);
    // Fetch comments for this palette
    const comments = await fetchComments(palette.id);
    setSelected({ ...palette, comments });
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

              <div className="flex items-center justify-between mb-6">
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

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">
                  Comments ({selected.comments?.length || 0})
                </h4>
                
                {/* Comment List */}
                {selected.comments && selected.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {selected.comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
                )}

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comment</label>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      placeholder="Share your thoughts about this palette..."
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentAuthor.trim() || !commentContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { PaletteViewer };