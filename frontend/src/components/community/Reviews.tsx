import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Review {
  id: string;
  content_type: string;
  content_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  status: string;
  helpful_count: number;
  created_at: string;
}

interface ReviewsProps {
  contentType: string;
  contentId: string;
  className?: string;
}

const Reviews: React.FC<ReviewsProps> = ({ contentType, contentId, className }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [contentType, contentId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await client.get(`/community/reviews/${contentType}/${contentId}`);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    try {
      const newReview = await client.post('/community/reviews', {
        content_type: contentType,
        content_id: contentId,
        user_id: 'current_user',
        rating,
        comment,
      });
      
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setRating(5);
      setComment('');
      setUserName('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => dist[r.rating as keyof typeof dist]++);
    return dist;
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold">{getAverageRating().toFixed(1)}</div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{reviews.length}</div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">
            {reviews.filter(r => r.rating >= 4).length}
          </div>
          <div className="text-sm text-gray-500">4+ Stars</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">
            {Math.round((reviews.filter(r => r.rating >= 4).length / Math.max(reviews.length, 1)) * 100)}%
          </div>
          <div className="text-sm text-gray-500">Positive</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(star => {
          const count = getRatingDistribution()[star as keyof typeof getRatingDistribution()];
          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium w-12">
                {star}★
              </span>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={submitReview} className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[5, 4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={cn(
                      'w-10 h-10 text-2xl rounded-lg transition-colors',
                      rating >= star
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-yellow-200'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Share your experience..."
                rows={4}
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{review.user_name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 ml-12">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { Reviews };