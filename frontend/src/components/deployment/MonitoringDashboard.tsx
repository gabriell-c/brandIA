import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface HealthStatus {
  status: string;
  uptime_seconds: number;
  uptime_human: string;
  timestamp: string;
  version: string;
  checks: Record<string, string>;
}

interface StatsSummary {
  total_requests: number;
  total_errors: number;
  error_rate: number;
  avg_latency_ms: number;
  uptime_seconds: number;
}

interface RecentRequest {
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  duration_ms: number;
}

interface RecentError {
  timestamp: string;
  type: string;
  endpoint: string;
}

interface MonitoringDashboardProps {
  className?: string;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ className }) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [recentErrors, setRecentErrors] = useState<RecentError[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthData, statsData] = await Promise.all([
        client.get('/deployment/monitoring/health'),
        client.get('/deployment/monitoring/stats')
      ]);
      setHealth(healthData);
      setStats(statsData.summary);
      setRecentRequests(statsData.recent_requests);
      setRecentErrors(statsData.recent_errors);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Health Status */}
      {health && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500')} />
              <span className="font-semibold">Status: {health.status}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Version: {health.version}</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="font-semibold">Uptime</div>
            <div className="text-2xl font-bold">{health.uptime_human}</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="font-semibold">Total Requests</div>
            <div className="text-2xl font-bold">{stats?.total_requests || 0}</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="font-semibold">Error Rate</div>
            <div className="text-2xl font-bold text-red-600">{stats?.error_rate || 0}%</div>
          </div>
        </div>
      )}

      {/* Service Checks */}
      {health && (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-4">Service Checks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(health.checks).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium capitalize">{service}</span>
                <span className={cn('px-2 py-1 text-sm rounded-full', status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-500">Avg Latency</div>
            <div className="text-2xl font-bold">{stats.avg_latency_ms.toFixed(1)} ms</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-500">Total Errors</div>
            <div className="text-2xl font-bold text-red-600">{stats.total_errors}</div>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-500">Uptime</div>
            <div className="text-2xl font-bold">{Math.floor(stats.uptime_seconds / 3600)}h {Math.floor((stats.uptime_seconds % 3600) / 60)}m</div>
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
        <h3 className="font-semibold mb-4">Recent Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2">Time</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Endpoint</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.slice(0, 10).map((req, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2">{new Date(req.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 font-mono">{req.method}</td>
                  <td className="py-2 font-mono text-blue-600">{req.endpoint}</td>
                  <td className="py-2">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs', 
                      req.status >= 400 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2 font-mono text-gray-500">{req.duration_ms.toFixed(1)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Errors */}
      {recentErrors.length > 0 && (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-4 text-red-600">Recent Errors</h3>
          <div className="space-y-2">
            {recentErrors.slice(0, 5).map((err, i) => (
              <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div className="flex justify-between">
                  <span className="font-medium">{err.type}</span>
                  <span className="text-sm text-gray-500">{new Date(err.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{err.endpoint}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { MonitoringDashboard };