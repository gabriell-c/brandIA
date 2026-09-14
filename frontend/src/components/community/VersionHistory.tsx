import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Version {
  id: string;
  project_id: string;
  brand_id: string;
  name: string;
  description: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  logo_svg: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  is_current: boolean;
}

interface Diff {
  palette_changes: Array<{ color: string; old_value: string; new_value: string }>;
  typography_changes: Array<{ type: string; old_value: string; new_value: string }>;
  logo_changed: boolean;
  version1: Version;
  version2: Version;
  version1_name: string;
  version2_name: string;
  version1_created_at: string;
  version2_created_at: string;
}

interface VersionHistoryProps {
  projectId: string;
  className?: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ projectId, className }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [diff, setDiff] = useState<Diff | null>(null);
  const [compareFrom, setCompareFrom] = useState<string>('');
  const [compareTo, setCompareTo] = useState<string>('');

  useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await client.get(`/community/versions/project/${projectId}`);
      setVersions(data.data);
      
      const current = data.data.find((v: Version) => v.is_current);
      setCurrentVersion(current || null);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!compareFrom || !compareTo || compareFrom === compareTo) return;
    
    try {
      const result = await client.post('/community/versions/diff', {
        version1_id: compareFrom,
        version2_id: compareTo,
      });
      setDiff(result);
      setShowDiff(true);
    } catch (error) {
      console.error('Failed to create diff:', error);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!confirm('Are you sure you want to rollback to this version?')) return;
    
    try {
      const newVersion = await client.post(`/community/versions/project/${projectId}/rollback`, {
        version_id: versionId,
        new_name: `Rollback to ${versionId}`,
      });
      
      // Refresh versions
      fetchVersions();
    } catch (error) {
      console.error('Failed to rollback:', error);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Version History</h2>
        {currentVersion && (
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
              Current: {currentVersion.name}
            </span>
          </div>
        )}
      </div>

      {/* Version List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
          No versions yet. Create your first version to start tracking changes.
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={cn(
                'p-4 border rounded-lg flex items-center justify-between transition-all',
                version.is_current
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{version.name}</span>
                    {version.is_current && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(version.created_at).toLocaleString()}
                    {version.created_by && ` • By ${version.created_by}`}
                  </div>
                  {version.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {version.notes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCompareFrom(compareFrom === version.id ? '' : version.id);
                    setCompareTo(compareTo === version.id ? '' : version.id);
                  }}
                  className={cn(
                    'px-3 py-1 text-sm rounded border transition-colors',
                    (compareFrom === version.id || compareTo === version.id)
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  Compare
                </button>
                {!version.is_current && (
                  <button
                    onClick={() => handleRollback(version.id)}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Rollback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compare Section */}
      {versions.length >= 2 && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold mb-4">Compare Versions</h3>
          <div className="flex gap-4 mb-4">
            <select
              value={compareFrom}
              onChange={(e) => setCompareFrom(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Select version...</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <span className="flex items-center">→</span>
            <select
              value={compareTo}
              onChange={(e) => setCompareTo(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Select version...</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCompare}
            disabled={!compareFrom || !compareTo || compareFrom === compareTo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Compare
          </button>
        </div>
      )}

      {/* Diff Display */}
      {showDiff && diff && (
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Comparison: {diff.version1_name} → {diff.version2_name}</h3>
            <button
              onClick={() => setShowDiff(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Palette Changes */}
          {diff.palette_changes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Color Changes</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {diff.palette_changes.map((change, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium mb-2">{change.color}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: change.old_value }}
                        />
                        <span className="text-xs text-gray-500 line-through">{change.old_value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: change.new_value }}
                        />
                        <span className="text-xs">{change.new_value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography Changes */}
          {diff.typography_changes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Typography Changes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diff.typography_changes.map((change, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium mb-2">{change.type}</div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 line-through">{change.old_value}</div>
                      <div className="text-sm font-medium">{change.new_value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diff.logo_changed && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="font-semibold">Logo changed</span>
            </div>
          )}

          {diff.palette_changes.length === 0 && diff.typography_changes.length === 0 && !diff.logo_changed && (
            <div className="text-center py-8 text-gray-500">
              No differences found between these versions.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { VersionHistory };