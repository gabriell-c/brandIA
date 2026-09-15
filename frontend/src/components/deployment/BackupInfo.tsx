import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Backup {
  name: string;
  path: string;
  size_bytes: number;
  size_mb: number;
  created_at: string;
}

interface BackupStats {
  total_backups: number;
  total_size_bytes: number;
  total_size_mb: number;
  latest_backup: Backup | null;
  estimated_restore_time_seconds: number;
}

interface BackupInfoProps {
  className?: string;
}

const BackupInfo: React.FC<BackupInfoProps> = ({ className }) => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const [backupsData, statsData] = await Promise.all([
        client.get('/deployment/backup/list'),
        client.get('/deployment/backup/stats')
      ]);
      setBackups(backupsData);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      setResult(null);
      const response = await client.post('/deployment/backup/create');
      setResult(response);
      fetchBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
      setResult({ success: false, error: 'Failed to create backup' });
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupName: string) => {
    if (!confirm(`Are you sure you want to restore from ${backupName}?`)) return;
    
    try {
      const response = await client.post(`/deployment/backup/restore/${backupName}`);
      setResult({ success: true, message: 'Restore completed successfully' });
    } catch (error: any) {
      setResult({ success: false, error: error.response?.data?.detail || 'Restore failed' });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Backup & Restore</h2>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold">{stats.total_backups}</div>
            <div className="text-sm text-gray-500">Total Backups</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold">{stats.total_size_mb} MB</div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold">
              {stats.latest_backup?.created_at ? new Date(stats.latest_backup.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Latest Backup</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold">~{Math.round(stats.estimated_restore_time_seconds)}s</div>
            <div className="text-sm text-gray-500">Est. Restore Time</div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={cn(
          'p-4 rounded-lg',
          result.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        )}>
          <p className={result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
            {result.message || result.error}
          </p>
        </div>
      )}

      {/* Backups List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Available Backups</h3>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
            No backups found. Create your first backup to get started.
          </div>
        ) : (
          backups.map((backup, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg flex items-center justify-between hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <div className="font-medium">{backup.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(backup.created_at).toLocaleString()} • {backup.size_mb} MB
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(backup.name)}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Restore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { BackupInfo };