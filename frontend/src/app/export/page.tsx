import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ExportPage() {
  const [activeTab, setActiveTab] = React.useState('json');

  const sampleTokens = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    neutral: '#6B7280',
    light: '#F9FAFB',
    dark: '#111827',
  };

  const generateCSS = () => {
    return `:root {\n${Object.entries(sampleTokens).map(([name, color]) => `  --${name}: ${color};`).join('\n')}\n}`;
  };

  const generateTailwind = () => {
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${Object.entries(sampleTokens).map(([name, color]) => `        '${name}': '${color}',`).join('\n')}
      },
    },
  },
}`;
  };

  const generateJSON = () => {
    return JSON.stringify(sampleTokens, null, 2);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('已复制到剪贴板');
  };

  const getContent = () => {
    switch (activeTab) {
      case 'css': return generateCSS();
      case 'tailwind': return generateTailwind();
      default: return generateJSON();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeRoute="/export" />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            导出设计系统
          </h1>

          <Card className="p-6 mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mb-6">
              {['json', 'css', 'tailwind'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'json' && 'JSON'}
                  {tab === 'css' && 'CSS Variables'}
                  {tab === 'tailwind' && 'Tailwind Config'}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{getContent()}</pre>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => copyToClipboard(getContent())}>
                复制到剪贴板
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                颜色预览
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(sampleTokens).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-full h-16 rounded-lg mb-2 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{name}</p>
                    <p className="text-xs text-gray-500 font-mono">{color}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                使用说明
              </h2>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p><strong className="text-gray-900 dark:text-white">JSON:</strong> 通用格式，可用于任何项目</p>
                <p><strong className="text-gray-900 dark:text-white">CSS:</strong> 复制到全局样式文件，通过 var() 使用</p>
                <p><strong className="text-gray-900 dark:text-white">Tailwind:</strong> 添加到 tailwind.config.js 的 theme.extend.colors</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}