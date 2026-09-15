'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface APIKey {
  id: string;
  name: string;
  key: string;
  full_key?: string;
  tier: string;
  monthly_limit: number;
  usage_this_month: number;
  status: string;
  created_at: string;
}

interface Stats {
  key_id?: string;
  name?: string;
  tier?: string;
  monthly_limit: number;
  usage_this_month: number;
  total_usage: number;
  last_used_at?: string;
  usage_percentage: number;
}

export default function ApiDashboardPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedTier, setSelectedTier] = useState('free');
  const [createdKey, setCreatedKey] = useState<APIKey | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const data = await client.get('/api-keys');
      setKeys(data);
      if (data.length > 0) {
        fetchStats(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (keyId: string) => {
    try {
      const data = await client.get(`/api-keys/stats?key_id=${keyId}`);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setCreating(true);
      const data = await client.post('/api-keys', {
        name: newKeyName,
        tier: selectedTier
      });
      setCreatedKey(data);
      setKeys(prev => [data, ...prev]);
      setNewKeyName('');
      fetchStats(data.id);
    } catch (error) {
      console.error('Failed to create key:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      await client.delete(`/api-keys/${keyId}`);
      setKeys(prev => prev.filter(k => k.id !== keyId));
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            API Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your API keys and monitor usage
          </p>
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-sm text-gray-500">Tier</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {stats.tier}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-sm text-gray-500">Monthly Limit</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.monthly_limit.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-sm text-gray-500">Usage This Month</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.usage_this_month.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-sm text-gray-500">Usage %</div>
              <div className={cn(
                "text-2xl font-bold",
                stats.usage_percentage > 80 ? "text-red-600" :
                stats.usage_percentage > 50 ? "text-yellow-600" : "text-green-600"
              )}>
                {stats.usage_percentage}%
              </div>
            </div>
          </div>
        )}

        {/* Usage Bar */}
        {stats && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Monthly Usage</span>
              <span className="text-sm text-gray-500">
                {stats.usage_this_month} / {stats.monthly_limit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all",
                  stats.usage_percentage > 80 ? "bg-red-500" :
                  stats.usage_percentage > 50 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(stats.usage_percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Create New Key */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="flex gap-4">
            <input
              type="text"
              placeholder="Key name (e.g., Production, Staging)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="free">Free</option>
              <option value="basic">Basic ($9.99/mo)</option>
              <option value="premium">Premium ($49.99/mo)</option>
              <option value="enterprise">Enterprise ($199.99/mo)</option>
            </select>
            <button
              type="submit"
              disabled={creating || !newKeyName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Key'}
            </button>
          </form>

          {createdKey && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                Your API key has been created. Save it securely - it won't be shown again.
              </p>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded font-mono text-sm">
                  {createdKey.full_key}
                </code>
                <button
                  onClick={() => copyToClipboard(createdKey.full_key || '')}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* API Keys List */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Your API Keys</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No API keys yet. Create your first key above.
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      🔑
                    </div>
                    <div>
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-gray-500">
                        {key.key} • {key.tier} tier • Created {new Date(key.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      key.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {key.status}
                    </span>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">How to Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Include your API key in requests</h3>
              <pre className="p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
{`headers: {
  "X-API-Key": "your_api_key_here"
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Example cURL request</h3>
              <pre className="p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
{`curl https://api.omnidesign.com/api/v1/brand/generate \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"business_name": "My Company", "industry": "technology"}'`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Response format</h3>
              <pre className="p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "palette": {...},
    "typography": {...},
    "brand_guidelines": {...}
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}