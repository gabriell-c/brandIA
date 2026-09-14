'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Marketplace, CommunityGallery, Reviews, VersionHistory } from '@/components/community';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('marketplace');

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: '🛍️' },
    { id: 'gallery', label: 'Community Gallery', icon: '🖼️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'versions', label: 'Version History', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community & Ecossistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover premium templates, share designs, and collaborate with the community
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
                  ? 'bg-purple-600 text-white shadow-md'
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
          {activeTab === 'marketplace' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Premium Template Marketplace</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse and purchase professionally designed templates. Secure payments via Stripe.
              </p>
              <Marketplace />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Community Gallery</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Explore designs shared by the community. Get inspired, like, and connect with creators.
              </p>
              <CommunityGallery />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Read and write reviews for templates and community designs.
              </p>
              <Reviews contentType="template" contentId="sample" />
            </div>
          )}

          {activeTab === 'versions' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Version History</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Track changes, compare versions, and rollback to previous states.
              </p>
              <VersionHistory projectId="default" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}