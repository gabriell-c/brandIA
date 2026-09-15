'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BackupInfo, MonitoringDashboard } from '@/components/deployment';

export default function DeploymentPage() {
  const [activeTab, setActiveTab] = useState('monitoring');

  const tabs = [
    { id: 'monitoring', label: 'Monitoring', icon: '📊' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
    { id: 'deploy', label: 'Deploy Status', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Deploy & Infra
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor application health, manage backups, and check deployment status
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
                  ? 'bg-blue-600 text-white shadow-md'
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
          {activeTab === 'monitoring' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Monitoring Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Real-time application health, performance metrics, and recent activity
              </p>
              <MonitoringDashboard />
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Backup & Restore</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create, manage, and restore database backups with automatic scheduling
              </p>
              <BackupInfo />
            </div>
          )}

          {activeTab === 'deploy' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Deploy Status</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Check deployment status across all environments
              </p>
              <DeployStatus />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployStatus() {
  const [deployStatus, setDeployStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Frontend */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h3 className="font-semibold">Frontend</h3>
              <p className="text-sm text-gray-500">Vercel</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-medium">✓ Deployed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">URL</span>
              <a href="https://design-system.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                design-system.vercel.app
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Framework</span>
              <span>Next.js 14</span>
            </div>
          </div>
        </div>

        {/* Backend */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="font-semibold">Backend</h3>
              <p className="text-sm text-gray-500">Railway</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-medium">✓ Running</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">URL</span>
              <a href="https://api.design-system.railway.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                api.design-system.railway.app
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Framework</span>
              <span>FastAPI</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl">
              🗄️
            </div>
            <div>
              <h3 className="font-semibold">Database</h3>
              <p className="text-sm text-gray-500">PostgreSQL</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-medium">✓ Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span>PostgreSQL 16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Region</span>
              <span>US East</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold mb-4">Deployment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-blue-600">Frontend (Vercel)</h4>
            <pre className="p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
{`{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "regions": ["iad1"],
  "customDomain": "design-system.com"
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-purple-600">Backend (Railway)</h4>
            <pre className="p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
{`{
  "framework": "fastapi",
  "startCommand": "uvicorn app.main:app",
  "regions": ["us-east-1"],
  "healthCheck": "/health"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Monitoring Stack */}
      <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold mb-4">Monitoring Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-medium">Prometheus</div>
            <div className="text-sm text-gray-500">Metrics</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-3xl mb-2">📈</div>
            <div className="font-medium">Grafana</div>
            <div className="text-sm text-gray-500">Dashboards</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-3xl mb-2">🔔</div>
            <div className="font-medium">Alertmanager</div>
            <div className="text-sm text-gray-500">Alerts</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-medium">Loki</div>
            <div className="text-sm text-gray-500">Logs</div>
          </div>
        </div>
      </div>
    </div>
  );
}